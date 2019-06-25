"use strict";
//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.nz
//        ah-mee no-see       "I See It this.now - I AminoSee it!"
const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stoRed in text files, output to PNG graphics file, then launches an WebGL this.browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by this.peptide.`;

const interactiveKeysGuide = `
Interactive control:    D            (devmode)  Q   (graceful quit next save)
V       ( this.verbose this.mode)  B ( this.dnabg DNA to screen)  Control-C      (fast quit)
S    (start webserver)  W (toggle screen this.clear) U       (stats update on/off)
Esc     (graceful quit) O (toggle show files after in GUI)`;
const settings = require('./aminosee-settings');
const version = require('./aminosee-version');
const server = require('./aminosee-server');
const data = require('./aminosee-data');
// const StdInPipe = require('./aminosee-stdinpipe');
// const main = require('./main');
let saySomethingEpic = data.saySomethingEpic;
let debug = false; // should be false for PRODUCTION
const asciiart = data.asciiart;

// OPEN SOURCE PACKAGES FROM NPM
const Preferences = require("preferences");
const spawn = require('cross-spawn');
const stream = require('stream');
const util = require('util');
const path = require('path');
const async = require('async-kit'); // amazing lib
const term = require('terminal-kit').terminal;
const MyManHilbert = require('hilbert-2d'); // also contains magic
const Readable = require('stream').Readable
const Writable = require('stream').Writable
const Transform = require('stream').Transform
const es = require('event-stream');
const minimist = require('minimist')
const highland = require('highland')
const fetch = require("node-fetch");
const keypress = require('keypress');
const open = require('open'); //path-to-executable/xdg-open
const parse = require('parse-apache-directory-index');
const fs = require('fs-extra'); // drop in replacement = const fs = require('fs')
const request = require('request');
const histogram = require('ascii-histogram');
const bytes = require('bytes');
const PNG = require('pngjs').PNG;
const os = require("os");
const humanizeDuration = require('humanize-duration')
const appFilename = require.main.filename; //     /bin/aminosee.js is 11 chars
const appPath = path.normalize(appFilename.substring(0, appFilename.length-15));// cut 4 off to remove /dna
const hostname = os.hostname();
const clog = console.log;
const chalk = require('chalk');
const obviousFoldername = "/AminoSee_Output"; // descriptive for users
const netFoldername = "/output"; // terse for networks
let PNGReader = require('png.js');
let express = require('express');
let bodyParser = require('body-parser');
// const gv = require('genversion');
// const Jimp = require('jimp');
// const electron = require('./main'); // electron app!
// const fileDialog = require('file-dialog')
// let gui = require('./public/aminosee-gui-web.js');
// let imageStack = gui.imageStack;
// let imageStack = require('./public/aminosee-gui-web.js').imageStack;

BigInt.prototype.toJSON = function() { return this.toString(); }; // shim for big int
BigInt.prototype.toBSON = function() { return this.toString(); }; // Add a `toBSON()` to enable MongoDB to store BigInts as strings

const targetPixels = 9000000; // for big genomes use setting flag -c 1 to achieve highest resolution and bypass this taret max render size
const funknzLabel = "aminosee.funk.nz"
const extensions = [ "txt", "fa", "mfa", "gbk", "dna", "fasta", "fna", "fsa", "mpfa", "gb", "gff"];
const refimage = "Reference image - all amino acids blended together"
const closeBrowser = "If the process apears frozen, it's waiting for your this.browser or image viewer to quit. Escape with [ CONTROL-C ] or use --no-image --no-html";
const lockFileMessage = `
aminosee.funk.nz DNA Viewer by Tom Atkinson.
This is a temporary lock file, placed during rendering to enable parallel cluster rendering over LAN networks, if this is here after processing has completerd it usually it means an AminoSee was quit before finishing or had crashed. Its safe to erase these files, and I've made a script in /dna/ to batch delete them all in one go. Normally these are deleted when render is complete, or with Control-C and graceful shutdown.`;
const defaultC = 1; // back when it could not handle 3+GB files.
const artisticHighlightLength = 12; // px only use in artistic this.mode. must be 6 or 12 currently
const defaultMagnitude = 8; // max for auto setting
const theoreticalMaxMagnitude = 10; // max for auto setting
const overSampleFactor = 2; // your linear image needs to be 2 megapixels to make 1 megapixel hilbert
const maxCanonical = 32; // max length of canonical name
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ]; // I've personally never seen a mag 9 or 10 image, cos my computer breaks down. 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
const widthMax = 960; // i wanted these to be tall and slim kinda like the most common way of diagrammatically showing chromosomes
const port = 4321;
const max32bitInteger = 2147483647;
const minUpdateTime = 2000;
const defaultFilename = "dna/megabase.fa"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
const testFilename = "AminoSeeTestPatterns"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
let isElectron, status, args, killServersOnQuit, webserverEnabled, cliInstance, tx, ty, termPixels, cliruns, gbprocessed, projectprefs, userprefs, progato, threads;
let dnaTriplets = data.dnaTriplets;
termPixels = 69;
tx = ty = cliruns = gbprocessed = 0;
let isShuttingDown = false;

module.exports = () => {
  isElectron = false;
  status = "exports";
  log(`isElectron: [${isElectron}]`)
  if (isElectron == true) {
    // this.args = generateArgs(classyArgv)
    output("Electron mode enabled")
  } else {
    // cliInstance = new AminoSeeNoEvil();
    // cliInstance.addJob(process.argv); // do stuff that is needed even just to run "aminosee" with no options.
    addJob(process.argv); // do stuff that is needed even just to run "aminosee" with no options.
    bugtxt(`process.argv.toString(): [${process.argv.toString()}]`)
  }
}
// let radMessage, opensExplorer, this.debugColumns, height,  this.mixRGBA, this.rgbArray,  isStreamingPipe,  filenameHILBERT,  this.justNameOfHTML,  users, present, peptide, ratio,  this.magnitude,  this.openImage, usersOutpath, projectprefs, userprefs, eak this.green ,   this.progato, userCPP, startDate, started, this.previousImage, this.charClock,  this.genomeSize, cliruns,  gbprocessed , progTimer, this.hilbertImage, keyboard, filenameTouch, filenameServerLock, estimatedPixels, args, filenamePNG, extension, reader, hilbertPoints, herbs, levels, mouseX, mouseY, windowHalfX, windowHalfY, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, fileUploadShowing, testColors, chunksMax, chunksize, chunksizeBytes, cpu, subdivisions, contextBitmap, this.aminoacid, pixelClock, start, updateClock, bytesPerMs,  this.pixelStacking, this.isHighlightCodon,  this.justNameOfPNG,  this.justNameOfHILBERT, sliceDNA, filenameHTML, msElapsed, bytesRemain, width, triplet, updatesTimer, pngImageFlags, codonsPerPixel, codonsPerPixelHILBERT, this.red, this.green, this.blue, this.alpha,  errorClock, this.breakClock, this.streamLineNr,  this.opacity , this.codonRGBA, currentTriplet,  this.currentPeptide,  this.shrinkFactor, reg, image, this.loopCounter,  this.percentComplete,  this.baseChars, bigIntFileSize, currentPepHighlight, justNameOfCurrentFile ,  this.openHtml,  this.openFileExplorer , pixelStream, startPeptideIndex, stopPeptideIndex, flags, loadavg, platform, totalmem, correction, aspect, this.debugFreq, help, tx, ty, this.lockTimer,  this.opensFile,  this.opensImage,  this.opensHtml, instanceCLI;

class AminoSeeNoEvil {
  constructor(classyArgv = ['node', 'aminosee.js', 'demo']) { // CLI commands, this.filenames, *
    log(`constructed with: [${classyArgv.toString()}] [${classyArgv[1]}] [${classyArgv[2]}]  this.genomeSize: [${ this.genomeSize}]`)
  }
  // return number of AminoSee objects
  static get COUNT() {
    return AminoSeeNoEvil.count;
  }

  setupApp(procArgv) {

    // do stuff aside from creating any changes. eg if you just run "aminosee" by itself.
    // for each render batch sent through addJob, here is where "this" be instantiated once per addJob
    // for each DNA file, run setupProject

    const radMessage =
    terminalRGB(`
      ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
      ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
      ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
      by Tom Atkinson          aminosee.funk.nz
      ah-mee no-see         "I See It this.now - I AminoSee it!"
      `, 96, 64, 245);

      const lineBreak = `
      `;
      const options = {
        boolean: [ 'artistic' ],
        boolean: [ 'clear' ],
        boolean: [ 'chrome' ],
        boolean: [ 'devmode' ],
        boolean: [ 'debug' ],
        boolean: [ 'demo' ],
        boolean: [ 'dnabg' ],
        boolean: [ 'explorer' ],
        boolean: [ 'file' ],
        boolean: [ 'force' ],
        boolean: [ 'firefox' ],
        boolean: [ 'gui' ],
        boolean: [ 'html' ],
        boolean: [ 'image' ],
        boolean: [ 'keyboard' ],
        boolean: [ 'progress' ],
        boolean: [ 'quiet' ],
        boolean: [ 'reg' ],
        boolean: [ 'recycle' ],
        boolean: [ 'serve' ],
        boolean: [ 'safari' ],
        boolean: [ 'test' ],
        boolean: [ 'updates' ],
        boolean: [ 'verbose' ],
        string: [ 'codons'],
        string: [ 'magnitude'],
        string: [ 'outpath'],
        string: [ 'triplet'],
        string: [ 'peptide'],
        string: [ 'ratio'],
        string: [ 'width'],
        unknown: [ unknownOption ],
        alias: { a: 'artistic', b: 'dnabg', c: 'codons', d: 'devmode', f: 'force', h: 'help', k: 'keyboard', m: ' magnitude', o: 'outpath', out: 'outpath', output: 'outpath', p: 'peptide', i: 'image', t: 'triplet', q: 'quiet', r: 'reg', w: 'width', v: 'verbose', x: 'explorer', finder: 'explorer'  },
        default: { image: true, updates: true, dnabg: false, clear: true, explorer: false, quiet: false, gui: true, keyboard: false, progress: false },
        stopEarly: false
      }

      this.args = minimist(procArgv.slice(2), options);
      args = this.args;

      webserverEnabled = false;
      this.loopCounter = 0;
      this.startDate = new Date(); // required for touch locks.
      this.started = this.startDate.getTime(); // required for touch locks.
      this.rawDNA = "this aint sushi";
      this.isShuttingDown = false;
      this.termDisplayHeight = 31;
      this.termStatsHeight = 9;
      this.timestamp = Math.round(+new Date()/1000);
      this.outFoldername = "";
      this.howMany = args._.length;
      this.genomeSize = 0;
      this.killServersOnQuit = true;
      this.isElectron = true;
      this.maxMsPerUpdate  = 30000; // milliseconds per updatethis.maxpix = targetPixels; //  this.maxpix can be changed downwards by algorithm for small genomes in order to zoom in
      this.timeRemain = 1;
      this.debugGears = 1;
      this.done = 0;
      this.suopIters = 0;
      this.raceDelay = 669; // so i learnt a lot on this project. one day this line shall disappear replaced by promises.
      this.darkenFactor = 0.25; // if user has chosen to highlight an amino acid others are darkened
      this.highlightFactor = 4.0; // highten brightening.
      this.devmode = false; // kills the auto opening of reports etc
      this.quiet = false;
      this.verbose = false; // not recommended. will slow down due to console.
      this.debug = false; // not recommended. will slow down due to console.
      this.force = false; // this.force overwrite existing PNG and HTML reports
      this.artistic = false; // for Charlie
      this.dnabg = false; // firehose your screen with DNA!
      this.report = true; // html reports can be dynamically disabled
      this.test = false;
      this.updates = true;
      this.updateProgress = false; // whether to show the progress bars
      this.stats = true;
      this.recycEnabled = false; // bummer had to disable it
      this.renderLock = false; // not rendering right this.now obviously
      this.clear = true; // this.clear the terminal screen while running
      this.openLocalHtml = true; // its better to use the built-in server due to CORS
      this.openImage = true; // open the png
      this.openHtml = true;
      this.opensHtml = 0; // how many times have we popped up a browser.
      this.highlightTriplets = [];
      this.isHighlightSet = false;
      this.isHilbertPossible = true; // set false if -c flags used.
      this.isDiskFinLinear = true; // flag shows if saving png is complete
      this.isDiskFinHilbert = true; // flag shows if saving hilbert png is complete
      this.isDiskFinHTML = true; // flag shows if saving html is complete
      this.isStorageBusy = false; // true just after render while saving to disk. helps percent show 100% etc.
      this.isShuttingDown = false; // this is the way to solve race cond.
      this.willRecycleSavedImage = false; // allows all the this.regular processing to mock the DNA render stage
      this.codonsPerSec = 0;
      this.peakRed  = 0.1010101010;
      this.peakGreen  = 0.1010101010;
      this.peakBlue  = 0.1010101010;
      this.rawDNA ="@loading DNA Stream..."; // this.debug
      this.status = "load";
      this.outFoldername = `/AminoSee_Output`;
      this.justNameOfDNA = 'aminosee-is-looking-for-files-containing-ascii-DNA.txt';
      this.browser = 'firefox';
      this.currentFile = funknzLabel;
      this.nextFile = funknzLabel;
      this.dimension = defaultMagnitude; // var that the hilbert projection is be downsampled to
      this.msPerUpdate  = minUpdateTime; // min milliseconds per update its increased for long renders
      this.now = new Date();
      this.termMarginTop = (term.height - this.termDisplayHeight - this.termStatsHeight) / 4;
      this.maxpix = targetPixels;
      this.howMany = 1;
      this.termPixels = 69;//Math.round((term.width) * (term.height-8));
      this.runningDuration = 1; // ms
      this.pepTable = data.pepTable;
      this.streamLineNr = 0;
      this.termMarginLeft = 2;
      this.dnabg = false;
      // this.filename = path.resolve(currentFile)
      // termSize();
      // this.resized(tx, ty);
      // this.previousImage = this.justNameOfDNA
      output(logo());
      this.setupOutPaths();

      if ( args.debug) {
        this.debug = true;
        output('debug mode ENABLED');
      } else {
        this.debug = false;
      }
      debug = this.debug; // global
      if ( args.progress) {
        this.updateProgress = true; // whether to show the progress bars
        log('progress bars enabled');
      } else {
        this.updateProgress = false; // whether to show the progress bars
        output('Disabled progress bars')
      }

      this.devmode = false;
      if ( args.devmode || args.d) { // needs to be at top sochanges can be overridden! but after this.debug.
        output("devmode enabled.");
        this.toggleDevmode();
      }
      if ( args.recycle) { // needs to be at top so  changes can be overridden! but after this.debug.
        output("recycle mode enabled. (experimental)");
        this.recycEnabled = true;
      } else { this.recycEnabled = false }

      if ( args.outpath || args.output || args.out || args.o) {
        this.usersOutpath = path.normalize(path.resolve( args.outpath));
        this.usersOutpath = this.usersOutpath.replace("~", os.homedir);
        if (doesFileExist(usersOutpath)) {
          if (fs.statSync(usersOutpath).isDirectory == true) {
            output(`Using custom output path ${usersOutpath}`);
            this.outputPath = this.usersOutpath;
          } else {
            this.error(`${usersOutpath} is not a directory`);
          }
        } else {
          this.usersOutpath = path.resolve(path.normalize( args.outpath));
          this.error(`Could not find output path: ${usersOutpath}, creating it this.now`);
          this.outputPath = this.usersOutpath;
          if ( this.mkdir() ) {
            log('Success');
          } else {
            this.error("That's weird. Couldn't create a writable output folder at: " + this.outputPath + " maybe try not using custom flag? --output");
            this.outputPath = homedirPath;
            this.quit(0, `cant create output folder`);
            // return false;
          }
        }
      }
      if ( args.keyboard || args.k ) {
        this.keyboard = true;
        this.termDisplayHeight += 4; // display bigger
        if ( this.verbose == true) {
          this.termDisplayHeight++;
        }
      } else {
        this.keyboard = false;
      }
      if ( this.keyboard == true) {
        output(`interactive keyboard mode enabled`)
        this.setupKeyboardUI()
      } else {
        log(`interactive keyboard mode disabled`)
      }
      this.openHtml = true;
      this.browser = 'chrome';
      log(`default this.browser set to open automatically in ${ this.browser }`);
      if ( args.chrome) {
        // this.openImage = true;
        this.openHtml = true;
        this.browser = 'chrome';
        output(`default this.browser set to open automatically in ${ this.browser }`);
      } else if ( args.firefox) {
        // this.openImage = true;
        this.openHtml = true;
        this.browser = 'firefox';
        output(`default this.browser set to open automatically in ${ this.browser }`);
      } else if ( args.safari) {
        // this.openImage = true;
        this.openHtml = true;
        this.browser = 'safari';
        output(`default this.browser set to open automatically in ${ this.browser }`);
      }
      if ( args.image || args.i) {
        this.openImage = true;
        output(`will automatically open image`)
      } else {
        log(`will not open image`)
        this.openImage = false;
      }

      if ( args.codons || args.c) {
        this.userCPP = Math.round( args.codons || args.c); // javascript is amazing
        output(`codons per pixel ${ this.userCPP }`);
        this.codonsPerPixel = this.userCPP;
      } else {
        this.codonsPerPixel = defaultC;
        this.userCPP = "auto";
      }
      if ( args.magnitude || args.m) {
        this.magnitude = Math.round( args.magnitude || args.m);
          if (  this.magnitude < 1 ) {
            this.dimension = 1;
            // this.maxpix = 4096 * 16; // sixteen times oversampled in reference to the linear image.
            output("Magnitude must be an integer number between 3 and 9. Using -m 3 for 4096 pixel curve.");
          } else if (  this.magnitude > theoreticalMaxMagnitude) {
            this.dimension = theoreticalMaxMagnitude;
            // this.maxpix = 64000000;
            output("Magnitude must be an integer number between 3 and 9.");
          } else if (  this.magnitude > 6 &&  this.magnitude < 9) {
            // this.maxpix = targetPixels;
            output(`Using custom output magnitude: ${ this.magnitude }`);
          }
      } else {
        this.magnitude = defaultMagnitude;
      }
      bugtxt(` this.maxpix: ${  this.maxpix } this.dimension: ${ this.dimension }`);
      if ( args.ratio) {
        this.ratio = args.ratio;
        if ( this.ratio && this.ratio != true ) { // this is for: aminosee --test -r
          this.ratio = this.ratio.toLowerCase();
        }
        if ( this.ratio == "fixed" || this.ratio == "fix") {
          this.ratio = "fix";
        } else if ( this.ratio == "square" || this.ratio == "sqr") {
          this.ratio = "sqr";
        } else if ( this.ratio == "hilbert" || this.ratio == "hilb" || this.ratio == "hil" ) {
          this.ratio = "hil";
        } else {
          bugtxt(`No custom this.ratio chosen. (default)`);
          this.ratio = "fix";
        }
        this.pngImageFlags += this.ratio;
      } else {
        bugtxt(`No custom ratio chosen. (default)`);
        this.ratio = "fix";
      }
      log(`Using ${ this.ratio } aspect ratio`);

      this.peptide = this.triplet = this.currentTriplet = this.currentPeptide = "none";
      if ( args.triplet || args.t) {
        this.users = args.triplet || args.t;
        this.triplet = this.tidyTripletName(this.users);
        this.currentTriplet = this.triplet;
        if ( this.isNormalTriplet( this.triplet )) { //uses global this.currentTriplet
          output(`Found this.triplet ${ this.triplet } with colour ${ this.tripletToHue( this.triplet )}°`);
          this.isHighlightSet = true;
          output(`Custom triplet ${chalk.bgWhite.blue ( this.triplet )} set. Others will be mostly transparent.`);

        } else {
          output(`Error could not lookup this.triplet: ${ this.triplet }`);
          this.triplet = "none";
        }
      } else {
        log(`No custom this.triplet chosen. (default)`);
        this.triplet = "none";
      }
      if ( args.peptide || args.p) {
        let usersPeptide = args.peptide || args.p;
        this.peptide = this.tidyPeptideName( usersPeptide);
        if ( this.peptide != "none" || this.peptide == "") { // this colour is a flag for  this.error
          this.isHighlightSet = true;
          output(`User has set highlight mode to ${ this.peptide }`);
        } else {
          log(`Sorry, could not lookup users peptide: ${usersPeptide} using ${ this.peptide }`);
        }
      } else {
        log(`No custom peptide chosen. Will render standard reference type image`);
        this.peptide = "none";
      }
      if ( this.peptide == "none" && this.triplet == "none") {
        // DISABLE HIGHLIGHTS
        this.darkenFactor = 1.0;
        this.highlightFactor = 1.0; // set to zero to i notice any bugs
        this.isHighlightSet = false;
      } else {
        log(`peptide  ${ this.peptide } this.triplet ${ this.triplet }`);
        this.isHighlightSet = true;
        this.report = false; // disable html report
      }
      if ( args.artistic || args.art || args.a) {
        output(`artistic enabled. Start (Methione =  green ) and Stop codons (Amber, Ochre, Opal) interupt the pixel timing creating columns. protein coding codons are diluted they are made ${ twosigbitsTolocale( this.opacity *100)}% translucent and ${ twosigbitsTolocale( this.codonsPerPixel )} of them are blended together to make one colour that is then faded across ${artisticHighlightLength} pixels horizontally. The start/stop codons get a whole pixel to themselves, and are faded across ${ this.highlightFactor} pixels horizontally.`);
        this.artistic = true;
        // isHilbertPossible = false;
        this.pngImageFlags += "_art";
        // this.peptide = "none";
        // this.triplet = "none";
        // this.isHighlightSet = false;
        this.codonsPerPixel = artisticHighlightLength;
        if  ( args.ratio)  {
          output("artistic mode is best used with fixed width ratio, but lets see")
        } else {
          this.ratio = "fix"
        }
      } else {
        log("1:1 science mode enabled.");
        this.artistic = false;
      }

      if ( args.verbose || args.v) {
        output("verbose enabled. AminoSee version: " + version);
        this.bugtxt(`os.platform(): ${os.platform()} ${process.cwd()}`)
        this.verbose = true;
        this.termDisplayHeight++;
      } else { this.verbose = false; }
      if ( args.html ) {
        output("will open html after render")
        this.openHtml = true;
      } else {
        log("not opening html")
        this.openHtml = false;
      }
      if ( args.html || args.chrome || args.firefox  || args.safari  || args.report  || args.open) {
        output("opening html");
        this.openHtml = true;
      } else {
        log("not opening html");
        this.openHtml = false;
      }

      if ( cliruns > 69 ||  gbprocessed  > 0.1 ) { this.dnabg = true } // if you actually use the program, this easter egg starts showing raw DNA as the background after 100 megs or 69 runs.
      if ( args.dnabg || args.s) {
        log("this.dnabg mode enabled.");
        this.dnabg = true;
      } else {
        log("this.dnabg mode disabled.");
        this.dnabg = false;
      }

      if ( args.force || args.f) {
        output("force overwrite enabled.");
        this.force = true;
      }
      if ( args.file || args.explorer || args.x || args.finder) {
        output("will open folder in File Manager / Finder / File Explorer when done.");
        this.openFileExplorer = true;
      } else {
        log("will not open folder in File Manager / Finder / File Explorer when done.");
        this.openFileExplorer = false;
      }
      if ( args.help || args.h) {
        this.help = true;
        this.helpCmd(args);
      } else {
        this.help = false;
      }
      if ( args.serve || args.s) {
        webserverEnabled = true;
        // launchNonBlockingServer();
        blockingServer();
      }
      if ( args.clear || args.c) {
        log("screen this.clearing enabled.");
        this.clear = true;
      } else {
        log("clear screen disabled.");
        this.clear = false;
        this.termDisplayHeight--;
      }
      if ( args.updates || args.u) {
        log("statistics this.updates enabled");
        this.updates = true;
      } else {
        log("statistics this.updates disabled");
        this.updates = false;
        this.maxMsPerUpdate  = 5000;
        this.clear = false;
      }
      if ( args.reg || args.r) { // NEEDS TO BE ABOVE TEST
        this.reg = true;
        output(`using this.regmarks`)
      } else {
        // if ( args.test) {
        //   this.reg = true;
        //   output(`using this.regmarks for calibration`)
        // } else {
        //   this.reg = false;
        //   log(`not using this.regmarks for calibration`)
        // }
        log(`no this.regmarks`)
        this.reg = false;
      }
      if ( args.test) {
        this.test = true;
        output("Beginning self test")
        this.generateTestPatterns(bugout);
      } else {
        this.test = false;
      }
      // test = this.test;
      if ( args.stop ) {
        if (this) {
          this.quit(130)
        } else {
          cliInstance.quit(130);
        }
      }
      if ( args.gui) {
        // default was always fairly graphical :)
      } else {
        output("Disabled the graphical user interface")
        openFile = false;
        this.openHtml = false;
        openLocalHtml = false;
        this.openFileExplorer = false;
        this.openImage = false;
      }
      if ( args.quiet || args.q) { // needs to be at top so changes can be overridden! but after this.debug.
        log("quiet mode enabled.");
        this.quiet = true;
        this.verbose = false;
        this.dnabg = false;
        this.updates = false;
      } else { this.quiet = false }

      log(`Custom peptide ${blueWhite( this.peptide )} set. Others will be mostly transparent. Triplet: ${ blueWhite( this.triplet ) }`);
      log( `args: [${args.toString()}]`)

      if ( args.get ) {
        this.downloadMegabase(pollForStream); //.then(out("megabase done"));//.catch(log("mega fucked up"));
      }
      if ( args.demo ) {
        runDemo();
      }
      if ( args.list ) {
        listDNA();
      }

      if ( this.howMany > 0) {
        this.currentFile = args._[0]
        if ( !this.chartAtCheck() ) { this.quit(); return false }
        this.filename =  path.resolve( this.currentFile );
        log("Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω " + this.currentFile)
        mode("Ω first command " + this.howMany + " " + this.currentFile);
        this.setupProject();
        this.lookForWork('Ω first command ॐ')
        // this.pollForStream('Ω first command ॐ');
        bugtxt( `appPath ${appPath}` )
      } else {
        mode("no command ");
        if ( cliruns < 3) {
          output("FIRST RUN!!! Opening the demo... use the command aminosee demo to see this first run demo in future");
          this.firstRun();
        } else {
          log('not first run')
        }
        output(`Try running  --->>>        aminosee help`);
        output(`usage        --->>>        aminosee [*/dna-file.txt] [--help|--test|--demo|--force|--html|--image|--keyboard]     `); //" Closing in 2 seconds.")
        if ( this.verbose == true && this.quiet == false) {
          this.helpCmd();
        } else if ( !this.quiet) {
          output();
          log('Closing in ')
          this.countdown('Closing in ', 3000);
        } else {
          output();
          this.countdown('Closing in ', 500);
        }
        return true;
      }
    }
    setupProgress() {
      if ( this.updateProgress == true) {
        this.progato = term.progressBar({
          width: term.width - 20,
          title: `Booting up at ${ formatAMPM( new Date())} on ${hostname}`,
          eta: true,
          percent: true,
          inline: false
        });
        term.moveTo(1 + this.termMarginLeft,1 + this.termMarginTop);
        this.drawProgress();
      }
    }
    destroyProgress() { // this.now thats a fucking cool name if ever there was!
      // if (this.howMany == -1) {
      // }
      if ( this.updateProgress == true) {
        if ( this.progato !== undefined) {
          this.progato.stop();
          //  this.progato = null;
        }
      }
      clearTimeout( this.updatesTimer);
      clearTimeout( this.progTimer);
      clearTimeout( this.lockTimer);
    }
    bugtxt(txt) { // full this.debug output
      if (this.quiet == false && this.debug == true && this.devmode == true && this.verbose == true)  {
        bugout(txt);
      } else {
        if (this.verbose == true ) {
          redoLine(txt);
        }
      }
    }





    termSize() {
      tx = term.width;
      ty = term.height
      termPixels = (tx) * (ty-8);
      this.termPixels = termPixels;
    }

    resized(tx, ty) {
      this.clearCheck();
      termSize();
      this.setDebugCols();
      log(`Terminal resized to (${tx},${ty})`);
      // Enough to fill screen starting from underneath the histogram:
      if (tx == undefined) { tx = term.width; ty = term.height } else {
        // this.clearCheck();
      }
      log(`Terminal resized: ${tx} x ${ty} and has at least ${termPixels} chars`)
      this.debugColumns = this.setDebugCols(); // Math.round(term.width / 3);
      this.msPerUpdate  = minUpdateTime;

      if ( this.updates == true) {
        // cover entire screen!
        if (tx > 400) {
          this.termMarginLeft = this.debugColumns * 2;
        } else {
          this.termMarginLeft = 2;
        }
        this.msPerUpdate  = minUpdateTime
      } else {
        this.termMarginLeft = 0;
        this.msPerUpdate  =  this.maxMsPerUpdate ;
      }
      if ( this.dnabg == true) {
        this.termMarginTop = Math.round(((term.height - this.termDisplayHeight) - this.termStatsHeight) / 3);
      } else {
        if ( this.clear== true) {
          this.termMarginTop = Math.round(((term.height - this.termDisplayHeight) - this.termStatsHeight) / 6);
        } else {
          this.termMarginTop = 0;
        }
      }
      // this.clearCheck();
      // this.drawHistogram();
    }
    cli(argumentsArray) {
      output(`cli argumentsArray [${argumentsArray.toString()}]`)
    }

    getRenderObject() { // return part of the histogramJson obj
      // this.calculateShrinkage();
      this.bugtxt(`codonsPerPixelHILBERT inside this.getRenderObject is ${ this.codonsPerPixelHILBERT }`)

      for (let h=0; h< this.pepTable.length; h++) {
        const pep =  this.pepTable[h];
        this.currentPeptide = pep.Codon;
        this.pepTable[h].src = this.aminoFilenameIndex(h)[0];
        // this.bugtxt( this.pepTable[h].src);
      }
      this.pepTable.sort( this.compareHistocount )
      // this.bugtxt( this.pepTable ); // least common amino acids in front

      let zumari = {
        maxpix:  this.maxpix,
        name: this.justNameOfDNA,
        refimage:  this.justNameOfHILBERT,
        linearimage: this.justNameOfPNG,
        runid: this.timestamp,
        cliruns: cliruns,
        gbprocessed: gbprocessed,
        hostname: os.hostname(),
        version: version,
        flags: (  this.force ? "F" : ""    )+(  this.userCPP == "auto"  ? `C${ this.userCPP }` : ""    )+(  this.devmode ? "D" : ""    )+(  this.args.ratio || this.args.r ? `${ this.ratio }` : "   "    )+(  this.args.magnitude || this.args.m ? `M${ this.dimension }` : "   "    ),
        aspect: this.ratio,
        bytes:  this.baseChars,
        estimatedPixels: this.estimatedPixels,
        genomeSize:  this.genomeSize,
        accuracy: this.estimatedPixels / this.genomeSize,
        noncoding:  this.errorClock,
        codonsPerPixel:  this.codonsPerPixel,
        codonsPerPixelHILBERT: this.codonsPerPixelHILBERT,
        pixelClock: this.pixelClock,
        pixhilbert: hilbPixels[ this.dimension ],
        shrinkFactor: this.shrinkFactor,
        overSampleFactor: this.overSampleFactor,
        opacity: this.opacity,
        magnitude:  this.magnitude,
        optimumDimension: this.optimumDimension ( this.estimatedPixels ),
        darkenFactor: this.darkenFactor,
        highlightFactor: this.highlightFactor,
        correction: 'Ceiling',
        finish: new Date(),
        blurb: this.blurb(),
        runningDuration: this.runningDuration,
        totalmem: os.totalmem(),
        platform: os.platform(),
        loadavg: os.loadavg()
      }
      let histogramJson = {
        pepTable: this.pepTable,
        summary: zumari
      }
      return histogramJson;
    }



    // cliruns = "!";
    //  gbprocessed  = "!";





    setupProject() { // blank all the variables
      if ( this.renderLock == true ) {
        this.error(`Renderlock failed in setupProject ${ this.currentFile } , ${ this.nextFile}`)
        return false;
      }
      this.startDate = new Date(); // required for touch locks.
      this.started = this.startDate.getTime(); // required for touch locks.
      this.baseChars =  this.genomeSize = this.charClock = this.codonsPerSec =  this.red  =  this.green  =  this.blue  = 0;
      this.peakRed  =  this.red ;
      this.peakGreen  =  this.green ;
      this.peakBlue  =  this.blue ;
      this.percentComplete = 0;
      this.pixelClock = 0;
      this.currentTriplet = "none";
      this.breakClock = 0;
      this.msElapsed = this.runningDuration = this.charClock =  this.percentComplete =  this.genomeSize = this.pixelClock = this.opacity  = 0;
      this.codonRGBA =  this.mixRGBA = [0,0,0,0]; // this.codonRGBA is colour of last codon,  this.mixRGBA is sum so far
      this.msPerUpdate  = minUpdateTime; // milliseconds per  update
      this.red  = 0;
      this.green  = 0;
      this.blue  = 0;
      this.alpha = 0;
      this.charClock = 0; // its 'i' from the main loop
      this.errorClock = 0; // increment each non DNA, such as line break. is reset after each codon
      this.breakClock = 0;
      this.streamLineNr = 0;
      this.genomeSize = 1;
      this.opacity  = 1 / this.codonsPerPixel; // 0.9 is used to make it brighter, also due to line breaks
      this.isDiskFinHTML = false;
      this.isDiskFinHilbert = false;
      this.isDiskFinLinear = false;
      for (let h=0; h< this.pepTable.length; h++) {
        this.pepTable[h].Histocount = 0;
        this.pepTable[h].z = h;
        this.pepTable[h].src = this.aminoFilenameIndex(h)[0];
      }
      for (let h=0; h < dnaTriplets.length; h++) {
        dnaTriplets[h].Histocount = 0;
      }
      this.setupOutPaths();
      if (this.test) {
        this.filename = "Running Test"
      } else {
        this.setNextFile();
        this.autoconfCodonsPerPixel();
      }
      termSize();
    }

    generateArgs() { // returns fake args array
      args = {
        "artistic": true,
        "devmode": true,
        "debug": true,
        "clear": true,
        "keyboard": "false",
        "html": true,
        "updates": true,
        "force": true,
        "dnabg": "false",
        "test": true,
        "verbose": true,
        "reg": true,
        "image": true,
        "file": true,
        "explorer": "false",
        "firefox": true,
        "chrome": true,
        "safari": true,
        "recycle": true,
        "quiet": "false",
        "serve": true,
        "gui": true,
        "codons": "2",
        "magnitude": "4",
        "outpath": "2",
        "triplet": "2",
        "peptide": "2",
        "ratio": "fix",
        "width": "false"
      }

    }

    progUpdate(obj) {  // allows to disable all the prog bars in one place
      if ( this.updateProgress == true) {
        if ( this.progato !== undefined && obj !== undefined) {
          this.progato.update(obj);
        }
      } else {
        this.bugtxt(`progress dummy function: ${obj}`)
      }
      // main.updatePercent(this.percentComplete)
    }

    setupKeyboardUI() {
      // make `process.stdin` begin emitting "keypress" events
      keypress(process.stdin);
      // keypress.enableMouse(process.stdout); // wow mouse events in the term?
      // process.stdin.on('mousepress', function (info) {
      //   bugout('got "mousepress" event at %d x %d', info.x, info.y);
      // });
      var that = this;
      try {
        process.stdin.setRawMode(true);
      } catch(err) {
        output(`Could not use interactive keyboard due to: ${err} press enter after each key mite help`)
      }
      process.stdin.resume(); // means start consuming
      // listen for the "keypress" event
      process.stdin.once('keypress', function (ch, key) {
        // log('got "keypress"', key);
        if (key && key.name == 't') {
          that.mode('pushing this.test onto render queue')
          that.args._.push('test');
        }
        if (key && key.name == 'c') {
          that.clearCheck();
        }
        if (key && key.ctrl && key.name == 'c') {
          process.stdin.pause(); // stop sending control-c here, send that.now to parent, which is gonna kill us on the second go with control-c
          that.status = "TERMINATED WITH CONTROL-C";
          that.isShuttingDown = true;
          if (that.devmode == true) {
            setTimeout(()=> {
              output(`Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly that.test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rende that.red  but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry; this way AminoSee will skip the large genome becauyse it has a lock file, saving me CPU during development. Lock files are safe to delete.`)
            }, 500)
          } else {
            that.removeLocks();
          }
          log(status);
          // that.updates = false;
          args = [];
          that.debug = true;
          that.devmode = true;
          killServersOnQuit = true;
          server.stop();
          destroyKeyboardUI();
          // setTimeout(()=> {
          that.gracefulQuit(130);
          // }, 500)
        }
        if (key && key.name == 'q' || key.name == 'Escape') {
          output("Gracefull Shutdown in progress... will finish this render then quit.")
          killServersOnQuit = false;
          that.gracefulQuit();
          // that.quit(7, 'Q / Escape - leaving webserver running in background')
        }
        if (key && key.name == 'b') {
          that.clearCheck();
          that.togglethis.dnabg();
        }
        if (key && key.name == 's') {
          that.clearCheck();
          that.toggleServer();
        }
        if (key && key.name == 'f') {
          that.toggleForce();
        }
        if (key && key.name == 'd') {
          that.clearCheck();
          that.toggleDebug();
        }
        if (key && key.name == 'v') {
          that.clearCheck();
          that.toggleVerbose();
        }
        if (key && key.name == 'o') {
          that.clearCheck();
          that.toggleOpen();
        }
        if (key && key.name == 'w') {
          term.clear();
          that.toggleClearScreen();
        }
        // if (key && key.name == 't') {
        //   linearpixbert();
        // }
        if (key && key.name == 'Space' || key.name == 'Enter') {
          that.clearCheck();
          that.msPerUpdate  = 200;
        }
        if (key && key.name == 'u') {
          that.msPerUpdate  = 200;
          if ( that.updates == true) {
            that.updates = false;
            clearTimeout( that.updatesTimer);
          } else {
            that.updates = true;
            that.drawHistogram();
          }
        }
        // that.drawHistogram();
      });
      process.on('exit', function () {
        // disable mouse on exit, so that the state
        // is back to normal for the terminal
        // keypress.disableMouse(process.stdout);
      });

    }
    toggleOpen() {
      this.openHtml = ! this.openHtml;
      if ( this.openHtml) {
        this.openImage = true;
        this.openFileExplorer = true;
      } else {
        this.openImage = false;
        this.openFileExplorer = false;
      }
      log(`Will ${( this.openHtml ? '' : 'not ' )} open images, reports and file explorer when done.`);
    }
    toggleVerbose() {
      this.verbose = !this.verbose;
      log(`verbose mode ${this.verbose}`);
    }



    togglednabg() {
      this.dnabg = !this.dnabg;
      this.clearCheck();
      log(`this.dnabg mode ${this.dnabg}`);
    }
    toggleServer() {
      webserverEnabled = true;
      log('start server')
      // launchNonBlockingServer(this);
      blockingServer();
    }
    toggleDebug() {
      this.debug = !this.debug;
      if (this.debug == true) {
        this.raceDelay  += 1000; // this helps considerably!
      }
      if (this.debug == false) {
        this.raceDelay  -= 100;
      }
      output("AminoSee has been slowed to " + this.raceDelay )
    }
    toggleDevmode() {
      this.devmode = !this.devmode;
      log(`devmode ${this.devmode}`);
      if (this.devmode == true) {
        this.quiet = false;
        this.verbose = true;
        this.updates = false;
        this.clear = false;
        this.openHtml = false;
        this.openImage = false;
        this.openFileExplorer = false;
        this.termDisplayHeight++;
        this.raceDelay += 1000; // this helps considerably!
        if (this.debug == true) {
          this.raceDelay += 1000; // this helps considerably!
        }
        output("AminoSee has been slowed to " + this.raceDelay)
      } else {
        this.raceDelay -= 1000; // if you turn devmode on and off a lot it will slow down
        this.verbose = false;
        this.updates = true;
        this.clear = true;
        this.openHtml = true;
        this.openImage = true;
        this.openFileExplorer = true;
        this.termDisplayHeight--;
      }
    }
    toggleForce() {
      this.force = !force;
      log(`force overwrite ${force}`);
    }

    toggleClearScreen() {
      this.clear = !clear;
      log("clear screen toggled.");
    }
    toggleUpdates() {
      this.updates = !this.updates;
      log(`stats this.updates toggled to: ${updates}`);
      if (update) {

      } else {

      }
    }
    gracefulQuit(code) {
      if (code == undefined) { code = 0; }
      mode( "Graceful shutdown in progress...");
      var that = this;
      that.bugtxt(status);
      that.bugtxt("webserverEnabled: " + webserverEnabled + " killServersOnQuit: "+ killServersOnQuit)

      try {
        that.nextFile = "shutdown";
        that.howMany = 0;
        that.removeLocks(process.exit());
      } catch(e) {

      }

      try {
        if (code = 130) {
          that.args._ = [];
          that.calcUpdate();
          // this.destroyProgress();
          that.removeLocks(process.exit());

        }
      } catch(e) {

      }

    }
    background(callback) {
      // const spawn = require('cross-spawn');
      // Spawn NPM asynchronously
      // const evilSpawn = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'pipe' }); // inline can quit
      // const evilSpawn = spawn('aminosee', ['open', 'explorer'], { stdio: 'inherit' }); // background
      // evilSpawn.stdout.on('data', (data) => {
      //   output(`${chalk.inverse('aminosee serve')}${chalk(': ')}${data}`);
      // });
      // evilSpawn.stderr.on('data', (data) => {
      //   output(`${chalk.inverse('aminosee  this.error')}${chalk(': ')}${data}`);
      // });
      // evilSpawn.on('close', (code) => {
      //   output(`child process quit with code ${code}`);
      // });
    }
    // function* generatorOpen(file, options) {
    //
    //   if (options == undefined) {
    //     options = { wait: false }
    //   }
    //   let this.result = (async (file, options) => {
    //     await open(file, options);
    //   })();
    //   yield this.result;
    // }

    downloadMegabase(cb) {
      this.currentFile = 'megabase.fa';
      let promiseMegabase = new Promise(function(resolve,reject) {
        try {
          var exists = doesFileExist( this.currentFile);
        } catch(err) {
          log(maxWidth(5, "e:" + err));
        }
        if (exists) {
          resolve()
          if ( cb !== undefined ) { cb( ) }
        } else {
          if (runTerminalCommand(`wget https://www.funk.co.nz/aminosee/dna/megabase.fa`)) {
            resolve();
            if ( cb !== undefined ) { cb( ) }

          } else {
            reject();
            cb()
          }
        }
      });

      output(chalk.rgb(255,255,255)("Getting some DNA..."))
      // promiseMegabase.resolve();
      return promiseMegabase;
    }
    setupOutPaths() {
      let outpath, clusterRender;
      // to make network / cluster render just "magically work":
      // look in current dir for specially named folders
      // /AminoSee_Output/
      // /output/
      // if found, use those as they are thought to be network SHARES
      // if not found setup and use local home folder ~/AminoSee_Output
      // this way you can create a network cluster quickly by just moving your ~/AminoSee_Output into the same folder as your DNA files
      // next time you run, it will put the render in same folder
      bugtxt(`OS: ${os.platform()} Home: ${os.homedir} `)

      // FIRST check for special folders in current directory
      // THEN if not found, create and use dirs in home directory
      if (doesFolderExist( path.resolve( process.cwd() + obviousFoldername) ) ) {
        clusterRender = true;
        this.outFoldername = obviousFoldername;
      } else if (doesFolderExist(path.resolve(process.cwd() + netFoldername))) {
        clusterRender = true;
        this.outFoldername = netFoldername;
      } else if (doesFolderExist(path.resolve(os.homedir + obviousFoldername))) {
        clusterRender = false;
        this.outFoldername = obviousFoldername;
      } else if (doesFolderExist(path.resolve(os.homedir + netFoldername))) {
        clusterRender = false;
        this.outFoldername = netFoldername;
      }

      if (clusterRender) {
        this.outputPath = path.normalize(path.resolve(process.cwd() + this.outFoldername))  // default location after checking overrides
        output("CLUSTER OUTPUT FOLDER ENABLED")
        log(`Enabled by the prseence of a /output/ or /AminoSee_Output/ folder in *current* dir. If not present, local users homedir ~/AminoSee_Output`);
      } else {
        this.outputPath = path.normalize(path.resolve(os.homedir + this.outFoldername))  // default location after checking overrides
        log("HOME DIRECTORY OUTPUT ENABLED")
      }
      // log( chalk.inverse("Render output folder: ") + this.outputPath )
      return this.outputPath;
    }
    nowAndNext() {
      return fixedWidth(18, this.currentFile) + " " + fixedWidth(18, this.nextFile);
    }
    runTerminalCommand(str) {
      output(`[ running terminal command ---> ] ${str}`);
      const exec = require("child_process").exec
      exec(str, ( error, stdout, stderr) => {
        this.error('runTerminalCommand ' +  this.error);
        output(stdout);
        this.error('runTerminalCommand ' + stderr);
        if ( this.error) {
          return false;
        } else {
          return true;
        }
      })
    }


    listDNA() {
      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xhr = new XMLHttpRequest('https://www.funk.co.nz/aminosee/output/');
      let txt = xhr.responseText;
      // testParse();
      // parse("https://www.funk.co.nz/aminosee/output/")
      output(txt)
      parse(txt)
    }
    aPeptideCodon(a) {
      // output(a);
      return a.Codon.toUpperCase().substring(0, 4) == this.peptide.toUpperCase().substring(0, 4);
    }
    pepToColor(pep) {
      let temp = this.peptide;
      this.currentPeptide = pep; // aPeptideCodon depends on this global
      let clean = this.pepTable.filter(aPeptideCodon);
      if (clean.length > 0 ) {
        return hsvToRgb(clean[0].Hue, 0.5, 1.0);
      } else {
        return [0,0,0,0];
      }
    }
    createJob(cb) {
      return new Promise(function(resolve,reject) {
        ( cb ? resolve() : reject() )
      })
    }


    storage() {
      // return `${(isDiskFinLinear ? 'Linear ' : '')} ${(isDiskFinHilbert ? 'Hilbert ' : '')} ${(isDiskFinHTML ? 'HTML ' : '' )}`;
      return `${( !this.isDiskFinLinear ? 'Linear ' : 'OK')} ${( !this.isDiskFinHilbert ? 'Hilbert ' : 'OK')} ${( !this.isDiskFinHTML ? 'HTML ' : 'OK' )}`;
    }
    chartAtCheck() {
      if ( this.currentFile === undefined) { return false }
      if ( this.currentFile.charAt(0) == '-') {
        log(`cant use files that begin with a dash - ${ this.currentFile }`)
        this.popAndResolve()
        // this.pollForStream('cant use files that begin with a dash -')
        return false;
      } else { return true }
    }
    setNextFile() {
      this.nextFile = "Loading";
      try {
        this.nextFile = this.args._[args._.length - 2]; // not the last but the second to last
      } catch(e) {
        this.nextFile = "Finished";
      }
      if ( this.nextFile == undefined) {
        this.nextFile = "Finished";
        return false;
      } else { return true; }
    }
    pollForStream(reason) { // render lock must be off before calling. aim: start the render, or look for work
      mode('pre-polling ' + this.howMany);
      var that = this;
      if ( !this.chartAtCheck() ) { quit(); return false }

      if (!this.checkFileExtension( this.currentFile)) {
        log(this.popAndResolve())
        // this.pollForStream('!checkFileExtension')
        // return false;
      }
      if ( !this ) { return }
      if ( this && this.renderLock == true ) {
        bugtxt(`thread re-entry inside pollForStream: ${ this.justNameOfDNA} ${ this.busy()} ${this.storage()} reason: ${reason}`);
        return false;
      }

      mode(`pollForStream ${reason}`)
      //////////////////////
      let result = this.popAndResolve();
      //////////////////////
      bugtxt(`File: ${ this.howMany } popAndLock result: ${ result } ${ this.currentFile} reason: ${reason}`);
      this.howMany = this.args._.length + 1;
      log(`>>> PREFLIGHT <<< ${ this.howMany } ${ fixedWidth(24,  this.currentFile)} then ${ fixedWidth(24,  this.nextFile)} reason: ${reason}`);


      if ( this.howMany < 0) {
        log(`outa work`)
        quit(0);
        return false;
      }

      try {
        this.filename = path.resolve( this.currentFile);  // not thread safe after here!
      } catch(err) {
        bugtxt(`path.resolve( this.currentFile) = ${err}`)
      }
      if ( this.currentFile == undefined) {
        output("currentFile is undefined")
        this.resetAndMaybe();
        return false;
      }

      if (doesFileExist(this.filename) == false) {
        output("currentFile is not exist")
        this.resetAndMaybe();
        return false;
      }

      this.setupFNames();

      if (this.extension == "zip") {
        streamingZip(this.filename);
      }
      if ( this.checkFileExtension( this.currentFile) == false) {
        redoLine("File Format not supported: " + chalk.inverse( this.getFileExtension( this.currentFile)));
        this.popAndResolve();
        // this.renderLock = false;
        this.pollForStream('File Format not supported')
        // this.lookForWork('inside poll for stream. file format not support. ' + fixedWidth(24, this.currentFile) );
        return false;
      }
      // this.bugtxt("PNG: " + this.justNameOfPNG);
      // this.bugtxt(`[ polling ${ this.nicePercent()} ${status} ${new Date()} ]`);
      // this.bugtxt(`[ this.howMany  ${this.howMany} ${status} ${ this.filename } ${ this.currentFile } ]`);
      // this.bugtxt( "this.currentFile is " + this.currentFile   + this.args)
      if (this.howMany < 1) { this.isShuttingDown = true;}
      if (this.howMany < 0) { this.gracefulQuit(130) }

      if ( this.currentFile == defaultFilename) { // maybe this is to get past my lack of understanding of processing of this.args.
        // this.bugtxt("skipping default: " + defaultFilename); // it was rendered same file twice i think
        this.resetAndMaybe();
        return false;
      }
      if (doesFileExist(this.filenamePNG) && this.force == false) {
        let msg = `Already rendered ${chalk.bgBlue.white(this.justNameOfPNG)}. `

        if ( this.openImage === true) {
          msg += chalk.gray(`Opening image now. Use --no-image to prevent. `)
          this.opensImage++;
          open( this.filenamePNG ).then(() => {
            log("image browser closed");
          }).catch(function () {  bugtxt("open( this.filenamePNG )") });
        } else {
          msg += chalk.gray(`Use --image to automatically open files after render. `)
        }
        output(msg);
        if (this.args.magnitude || this.args.m) {
          output(`Will render again because of custom magnitude setting: ${this.magnitude}`)
        } else {
          this.resetAndMaybe();
          return false;
        }
      }
      ///////////////// BEGIN PARSING DNA FILE //////////////////////////////
      ///////////////// Check if it's been rendered etc
      mode('parsing');
      this.setupProject();
      this.autoconfCodonsPerPixel();
      this.setupFNames(); // will have incorrect Hilbert file name. Need to wait until after render to check if exists.
      // this.bugtxt(`analyse: ${chalk.inverse( this.currentFile)} storage: ${chalk.inverse( this.storage() )} Fullpath: ${ this.filename }`)
      // this.bugtxt(`Parsing ${ this.justNameOfDNA }  defaultFilename  ${defaultFilename}  ${ this.filename }  this.howMany   ${this.howMany}   status ${status}`);
      output('Checking '+ this.filenamePNG)
      if ( this.skipExistingFile( this.filenamePNG ) ) {
        output(`Already rendered this.${ fixedWidth(32, this.filenamePNG)} (${this.howMany} files to go) use --explorer to show files`);
        log("use --force to overwrite  --image to automatically open   ");
        if ( this.openHtml == true || this.openImage == true || this.openFileExplorer == true) {
          log("use --no-image suppress automatic opening of the image.")
          this.openOutputs(this);
        } else {
          log('use --image to open in viewer')
        }
        this.previousImage = this.filenamePNG;
        mode('skip existing')
        this.popAndResolve();
        // this.howMany--;
        this.pollForStream()
        return false;
      } else { log('Not skipping') }

      // this.termDrawImage();

      if ( this.checkLocks( this.filenameTouch)) {
        output("Render already in progress by another thread for: " + this.justNameOfPNG);
        log("Either use --force or delete this file: ");
        log(`Touchfile: ${chalk.underline( this.filenameTouch)}`);
        if ( this.renderLock ) {
          this.error("Thread re-entry during pollForStream " + this.justNameOfDNA)
        } else {
          this.resetAndMaybe(); // <---  another node maybe working on, NO RENDER
        }
        // this.pollForStream();
        return false;
      }

      mode("Lock OK proceeding to render...");
      if (this.renderLock == false) {
        this.touchLockAndStartStream(); // <--- THIS IS WHERE MAGIC STARTS
      }
      log('polling end');
    }

    firstRun() {
      output(chalk.bgRed   ("First run demo!"));
      output(chalk.bgYellow("First run demo!"));
      output(chalk.bgGreen ("First run demo!"));
      runDemo();
    }
    startStreamingPng() {
      pixelStream = pStream(); // readable stream
      pixelStream.pipe(new PNG({
        width: 960,
        inputHasAlpha: true
      }))
      .on('parsed', function() {
        this.pack().pipe(fs.createWriteStream('streaming-out.png'));
      });
    }
    pStream() { // returns require('module');adable to push pixels into
    const through2 = require('through2');
    const Readable = require('readable-stream').Readable;
    const stream = Readable({objectMode: true});   /* 1 */
    stream._read = () => {};                       /* 2 */
    // setInterval(() => {                            /* 3 */
    //   stream.push({
    //     x: Math.random()
    //   });
    // }, 100);
    const getX = through2.obj((data, enc, cb) => { /* 4 */
      cb(null, `${data.x.toString()}\n`);
    });
    stream.pipe(getX).pipe(process.stdout);        /* 5 */
    return stream
  }
  resetAndMaybe(){
    mode(`RESET JOB. Storage: (${ this.storage()} ${ this.busy()}) this.currentFile: ${ this.currentFile } Next: ${ this.nextFile}`)
    bugtxt(this.status);
    this.isDiskFinHTML = this.isDiskFinLinear = this.isDiskFinHilbert = true;
    this.renderLock = false;
    this.percentComplete = 0;
    this.howMany = this.args._.length;
    if (this.howMany > 0) {
      this.pollForStream(`resetAndMaybe`);
    } else {
      this.quit();
    }
  }

  initStream() {
    mode("initStream");
    if ( isShuttingDown == true ) { output("Sorry shutting down."); return false;}
    if ( this.renderLock == false) {
      this.error("RENDER LOCK FAILED. This is an  this.error I'd like reported. Please run with --devmode option enabled and send the logs to aminosee@funk.co.nz");
      // this.quit(4, 'Render lock failed');
      // resetAndMaybe();
      // lookForWork('render lock failed inside initStream')
      return false;
    } else { log('Begin') }
    log("isElectron: " + isElectron  );
    termSize();
    this.resized();
    mode("Ω first command " + this.howMany + " " + this.currentFile);
    // log( this.filename )
    // output(status);
    this.setIsDiskBusy( false );
    this.autoconfCodonsPerPixel();
    // this.setupFNames();
    this.autoconfCodonsPerPixel();
    this.mkRenderFolders(); // create /images etc
    this.setupProgress();
    this.rawDNA = "@"
    this.extension = this.getFileExtension( this.filename );
    this.percentComplete = 0;
    this.genomeSize = 1; // number of codons.
    this.pixelStacking = 0; // how we fit more than one codon on each pixel
    this.pixelClock = 0; // which pixel are we painting?
    this.msElapsed  = 0;
    this.status = "init";
    this.rgbArray = [];
    this.hilbertImage = [];
    this.clearCheck();
    this.bugtxt(`Loading ${ this.filename } Filesize ${bytes( this.baseChars)}`);
    if ( this.clear == true) {
      term.up(this.termDisplayHeight + this.termStatsHeight*2);
      term.eraseDisplayBelow();
    }
    if ( this.updatesTimer) {
      clearTimeout( this.updatesTimer);
    }
    if ( this.willRecycleSavedImage && this.recycEnabled) {
      output(`Skipped DNA render stage of ${ this.justNameOfDNA}`);
      log("AM PLANNING TO RECYCLE TODAY (joy)")
      recycleOldImage( this.filenamePNG );
      // saveDocuments();
      return false;
    } else {
      log('Not recycling');
    }
    // startStreamingPng();
    process.title = `aminosee.funk.nz ${ this.justNameOfDNA} ${bytes( this.estimatedPixels*4)}`;
    this.streamStarted();


    var that = this;
    var closure = this.filename;
    try {
      var readStream = fs.createReadStream( closure ).pipe(es.split()).pipe(es.mapSync(function(line){
        readStream.pause(); // pause the readstream during processing
        that.processLine(line); // process line here and call readStream.resume() when ready
        readStream.resume();
      })
      .on('start', function(err){
        output("streaming");
      })
      .on('error', function(err){
        that.mode("stream error");
        output(`stream error ` + err)
        output(`while starting stream: [${ closure }] renderLock: [${ that.renderLock}] storage: [${that.storage()}]`);
        // that.streamStopped();
      })
      .on('end', function() {
        log("stream end");
      })
      .on('close', function() {
        log("stream close");
        that.streamStopped();
      }));
    } catch(e) {
      output("Catch in Init ERROR:"  + e)
    }

    log("FINISHED INIT " + this.howMany);
    // term.up( this.termStatsHeight);
    this.clearCheck();
    term.eraseDisplayBelow();
  }
  streamStarted() {
    mode('streamStarted');
    var that = this;
    output('Started render ' + this.justNameOfPNG);
    this.drawHistogram();
    if ( that.renderLock == true ) {
      if ( that.updates == true) {
      }
      that.progUpdate({ title: 'DNA File Render step 1/3', items: that.howMany, syncMode: true })
      setTimeout(() => {
        that.manageLocks(5000)
      }, 2000);
    }
  }
  manageLocks(time) {
    if ( this.lockTimer !== undefined) { clearTimeout(this.lockTimer) }
    if ( this.isShuttingDown) { return false }
    var that = this;

    this.lockTimer = setTimeout( () => {
      if ( that.renderLock == true ) {
        that.fastUpdate();
        if (  that.percentComplete < 0.9 &&  that.timeRemain > 20000 ) { // helps to eliminate concurrency issues
          that.tLock();
          that.manageLocks(time*2)
        } else {
          log('No more this.updates scheduled after 90% with less than 20 seconds to go. Current at ' + that.nicePercent() + ' time remain: ' + humanizeDuration( that.timeRemain))
        }
      }
    }, time);
  }
  streamStopped() {
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");
    log("Stream ending event");

    term.eraseDisplayBelow()
    this.percentComplete = 1;
    this.calcUpdate();
    this.percentComplete = 1;
    clearTimeout( this.updatesTimer);
    clearTimeout( this.progTimer);
    clearTimeout( this.lockTimer);
    this.currentTriplet = this.triplet;
    this.currentPeptide = this.peptide;
    this.saveDocsSync();
  }
  showFlags() {
    return `${(  this.force ? "F" : `-`    )}${( this.updates ? `U` : `-` )}C_${ this.userCPP }${( this.keyboard ? `K` : `-` )}${(  this.dnabg ? `B` : `-`  )}${( this.verbose ? "V" : `-`  )}${(  this.artistic ? "A" : `-`    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : "---"    )}${( this.dimension ? "M" + this.dimension : "-")}${( this.reg?"REG":"")} C${ onesigbitTolocale( this.codonsPerPixel )}`;
  }
  testSummary() {
    return `TEST
    this.filename: <b>${ this.justNameOfDNA}</b>
    Registration Marks: ${( this.reg ? true : false )}
    ${ ( this.peptide || this.triplet ) ?  "Highlights: " + ( this.peptide || this.triplet) : " "}
    Your custom flags: TEST${(  this.force ? "F" : ""    )}${(  this.userCPP == "auto"  ? `C${ this.userCPP }` : ""    )}${(  this.devmode ? "D" : ""    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : ""    )}${(  this.args.magnitude || this.args.m ? `M${ this.dimension }` : ""    )}
    ${(  this.artistic ? ` Artistic this.mode` : ` Science this.mode`    )}
    Max  this.magnitude: ${ this.dimension } / 10 Max pix: ${ this.maxpix.toLocaleString()}
    Hilbert Magnitude: ${ this.dimension } / ${defaultMagnitude}
    Hilbert Curve Pixels: ${hilbPixels[ this.dimension ]}`;
  }
  renderObjToString() {

    // += 0; // cast it into a number from whatever the heck data type it was before!
    return `
    <h3>Canonical this.filename: <b>${ this.justNameOfDNA}</b></h3>
    Source: ${ this.justNameOfCurrentFile}
    Gigabytes processed: ${ gbprocessed.toLocaleString()} Run ID: ${ this.timestamp } ${ cliruns}th run on <b>${ this.hostname}</b>
    Finished at: ${ formatAMPM(new Date())} Time used: ${humanizeDuration( this.runningDuration )}
    Machine load averages: ${ this.loadAverages()}
    DNA Input bytes: ${bytes(  this.baseChars )} ${bytes( this.bytesPerMs * 1000 )}/sec
    Image Output bytes: ${bytes ( this.rgbArray.length)}
    Pixels linear: ${ this.pixelClock.toLocaleString()} Aspect Ratio: ${ this.ratio}
    Pixels hilbert: ${hilbPixels[ this.dimension ].toLocaleString()} ${(  this.magnitude ? "(auto)" : "(manual -m)")}
    Custom flags: ${ this.flags}
    ${(  this.artistic ? "Artistic this.mode" : "Science this.mode"    )}
    Estimated Codons: ${Math.round( this.estimatedPixels).toLocaleString()} (filesize % 3)
    Actual Codons matched: ${ this.genomeSize.toLocaleString()}
    Estimate ${Math.round((( this.estimatedPixels /  this.genomeSize))*100)}% of actual
    Non-coding characters: ${ this.errorClock.toLocaleString()}
    Coding characters: ${ this.charClock.toLocaleString()}
    Codons per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )} (linear) ${ twosigbitsTolocale( this.codonsPerPixelHILBERT )} (hilbert)
    Linear to Hilbert reduction: ${ twosigbitsTolocale( this.shrinkFactor)} Oversampling: ${ twosigbitsTolocale(overSampleFactor)}
    Amino acid blend this.opacity : ${Math.round(this.opacity *10000)/100}%
    Max pix setting: ${ this.maxpix.toLocaleString()}
    ${ this.dimension }th Hilbert this.dimension
    Darken Factor ${ twosigbitsTolocale(this.darkenFactor)} / Highlight Factor ${ twosigbitsTolocale( this.highlightFactor)}
    AminoSee version: ${version}`;
  }



  // CODONS PER PIXEL
  autoconfCodonsPerPixel() {
    mode('autoconf')
    // requires  this.baseChars  this.maxpix
    //  this.baseChars is like  this.genomeSize but the esetimation of it based on filesize
    // internally, we signal streamed pipe input from standard in as -1 filesize
    // therefore if filesize = -1 then streaming pipe mode is enabled.
    // the goal is to set this.codonsPerPixel
    //

    this.baseChars = this.getFilesizeInBytes( this.filename );
    if ( this.baseChars < 0) { // switch to streaming pipe this.mode,
      this.error("Are you streaming std in? That part isn't written yet!")
      process.exit();

      this.isStreamingPipe = true; // cat Human.genome | aminosee
      this.estimatedPixels = 696969; // 696969 flags a missing value in this.debug
      this.magnitude = this.dimension = 6; // close to 69
      log("Could not get filesize, setting for image size of 696,969 pixels, maybe use --codons 1 this is rendered with --codons 696");
      this.baseChars = 696969; // 696969 flags a missing value in this.debug
      this.codonsPerPixel = 696; // small images with _c69 in this.filename
      return true;
    } else { // use a file
      this.isStreamingPipe = false; // cat Human.genome | aminosee
      this.estimatedPixels =  this.baseChars / 3; // divide by 4 times 3
      this.dimension = this.optimumDimension ( this.estimatedPixels);
    }


    if ( this.estimatedPixels <  this.maxpix ) { // for sequence smaller than the screen
      if ( this.userCPP != "auto" )  {
        log("its not recommended to use anything other than --codons 1 for small genomes, better to reduce the -- this.magnitude")
      } else {
        this.codonsPerPixel = 1; // normally we want 1:1 for small genomes
      }
    }

    if ( this.userCPP != "auto" ) {
      output(`Manual zoom level override enabled at: ${ this.userCPP } codons per pixel.`);
      this.codonsPerPixel = this.userCPP;
    } else {
      log("Automatic codons per pixel setting")
    }

    if ( this.estimatedPixels >  this.maxpix ) { // for seq bigger than screen        this.codonsPerPixel = this.estimatedPixels /  this.maxpix*overSampleFactor;
      this.codonsPerPixel = this.estimatedPixels /  this.maxpix;
      if ( this.userCPP == "auto" ) {
        if ( this.userCPP < this.codonsPerPixel) {
          log( terminalRGB(`WARNING: Your target Codons Per Pixel setting ${ this.userCPP } will make an estimated ${Math.round( this.estimatedPixels / this.userCPP).toLocaleString()} is likely to exceed the max image size of ${ this.maxpix.toLocaleString()}, sometimes this causes an out of memory  this.error. My machine spit the dummy at 1.7 GB of virtual memory use by node, lets try yours. We reckon ${ this.codonsPerPixel } would be better, higher numbers give a smaller image.`))
        }
      } else {
        this.codonsPerPixel = this.userCPP; // they picked a smaller size than me. therefore their computer less likely to melt.
      }
    }

    if ( this.codonsPerPixel < defaultC) {
      this.codonsPerPixel = defaultC;
    } else if ( this.codonsPerPixel > 6000) {
      this.codonsPerPixel = 6000;
    } else if ( this.codonsPerPixel == NaN || this.codonsPerPixel == undefined) {
      this.error(`codonsPerPixel == NaN || this.codonsPerPixel == undefined`)
      this.codonsPerPixel = defaultC;
    }
    if ( this.artistic == true) {
      this.codonsPerPixel *= artisticHighlightLength;
      log(`Using ${ this.codonsPerPixel } this.codonsPerPixel for art this.mode`);
    }
    ///////// ok i stopped messing with this.codonsPerPixel this.now

    if ( this.estimatedPixels < 1843200 && !this.args.ratio && !this.args.r) { // if user has not set aspect, small bacteria and virus will be square this.ratio. big stuff is fixed.
      this.ratio = 'sqr'; // small genomes like "the flu" look better square.
      if ( this.verbose == true) {
        this.bugtxt('For genomes smaller than 1843200 codons, I switched to square this.ratio for better comparison to the Hilbert images. Use --ratio=fixed or --ratio=golden to avoid this. C. Elegans worm is big enough, but not Influenza.')
      } else {
        this.bugtxt('Genomes <  1840000 codons. square this.ratio enabled')
      }
    } else {
      this.ratio = 'fix'; // small genomes like "the flu" look better square.
    }

    this.opacity  = 1 / this.codonsPerPixel;
    // set highlight factor such  that:
    // if cpp is 1 it is 1
    // if cpp is 2 it is 1.5
    // if cpp is 3 it is 1
    // if cpp is 4 it is 2.5
    // if cpp is 10 it is 6.5
    if ( this.codonsPerPixel < 5 ) {
      this.highlightFactor = 1 + ( this.codonsPerPixel/2);
    } else if ( this.codonsPerPixel < 64 )  {
      this.highlightFactor = this.codonsPerPixel / 8 ;
    } else if ( this.codonsPerPixel > 64 ) {
      this.highlightFactor = 16 + ( 255 / this.codonsPerPixel) ;
    }
    return this.codonsPerPixel;
  }

  removeFileExtension(f) {
    return f.substring(0, f.length - ( this.getFileExtension(f).length+1));
  }
  highlightFilename() {
    let ret = "";
    // log(``)
    if ( this.isHighlightSet == false) {
      ret += `-Reference`;
    } else {
      if ( this.currentTriplet.toLowerCase() != "none" || this.triplet.toLowerCase() != "none") {
        ret += `_${spaceTo_( this.currentTriplet).toUpperCase()}`;
      } else if ( this.currentPeptide != "none") {
        ret += `_${spaceTo_( this.tidyPeptideName( this.peptide ) )}`;
      } else {
        ret += `-Reference`;
      }
    }
    // log(`ret: ${ret} this.currentTriplet: ${currentTriplet}  this.currentPeptide ${ this.currentPeptide}`);
    return ret;
  }
  setupHilbertFilenames() {
    this.calculateShrinkage(); // REQUIRES INFO FROM HERE FOR HILBERT this.filename. BUT THAT INFO NOT EXIST UNTIL WE KNOW HOW MANY PIXELS CAME OUT OF THE DNA!
    this.filenameHILBERT = `${ this.outputPath }/${ this.justNameOfDNA }/images/${ this.generateFilenameHilbert() }`;
  }
  generateFilenameTouch() { // we need the *fullpath* of this one
    let justTouch = `AminoSee_BUSY_LOCK_${ this.extension }${ this.highlightFilename() }_c${ onesigbitTolocale( this.codonsPerPixel ) }${ this.getImageType() }.txt`;

    // this.filenameTouch = path.resolve(`${ this.outputPath }/${ this.justNameOfDNA }/${ this.justTouch }`);
    // log(`this.debug for justTouch: ${ this.justTouch }`);
    // log(`this.debug for generateFilenameTouch: ${ this.filenameTouch }`);
    return           justTouch;
  }
  generateFilenamePNG() {
    this.justNameOfPNG =         `${ this.justNameOfDNA}.${ this.extension }_linear${ this.highlightFilename() }_c${ onesigbitTolocale( this.codonsPerPixel )}${ this.getImageType() }.png`;
    return this.justNameOfPNG;
  }
  generateFilenameHilbert() {
    if ( this.test) {
      // the this.filename should be set already fingers crossed.
    } else {
      this.justNameOfHILBERT =     `${ this.justNameOfDNA}.${ this.extension }_HILBERT${ this.highlightFilename() }_m${ this.dimension }_c${ onesigbitTolocale( this.codonsPerPixelHILBERT )}${ this.getRegmarks()}.png`;
    }
    return this.justNameOfHILBERT;
  }
  generateFilenameHTML() {
    this.justNameOfHTML =        `${ this.justNameOfDNA}.${ this.extension }_m${ this.dimension }_c${ onesigbitTolocale( this.codonsPerPixel )}${ this.getRegmarks()}${ this.getImageType() }.html`;
    return this.justNameOfHTML;
  }

  setupFNames() { // must not be called during creation of hilbert image
    if ( this.renderLock == true) {
      this.error('thread re-entry inside setupFNames')
      return false;
    }
    mode("setupFNames " + this.currentFile);

    // log( this.outputPath);
    // log( this.filenameTouch);
    // log( this.filenamePNG );
    // log( this.filenameHILBERT);
    // log( this.filenameHTML);

    if (this.isShuttingDown) {     output(`isShuttingDown: [${ this.isShuttingDown }]`)  }

    // this.calculateShrinkage(); // REQUIRES INFO FROM HERE FOR HILBERT this.filename. BUT THAT INFO NOT EXIST UNTIL WE KNOW HOW MANY PIXELS CAME OUT OF THE DNA!
    this.filename = path.resolve(this.currentFile);
    this.justNameOfCurrentFile  = replaceoutputPathFileName( this.filename );
    this.extension = this.getFileExtension( this.currentFile);
    this.justNameOfDNA = spaceTo_( this.removeFileExtension( this.justNameOfCurrentFile));
    if ( this.justNameOfDNA.length > maxCanonical ) {
      this.justNameOfDNA = this.justNameOfDNA.replace('_', '');
    }
    if ( this.justNameOfDNA.length > maxCanonical ) {
      this.justNameOfDNA = this.justNameOfDNA.substring(0,maxCanonical/2) + this.justNameOfDNA.substring( this.justNameOfDNA.length-( maxCanonical /2), this.justNameOfDNA.length);
    }
    let ext = spaceTo_( this.getImageType());
    this.filenameTouch =   this.qualifyPath( this.generateFilenameTouch()  );
    this.filenameHTML =    this.qualifyPath( this.generateFilenameHTML()   );
    this.filenamePNG =     this.qualifyPath(`images/${ this.generateFilenamePNG()     }`);
    this.filenameHILBERT = this.qualifyPath(`images/${ this.generateFilenameHilbert() }`);
    // this.fancyFilenames();
    this.setNextFile();
  }
  qualifyPath(f) {
    return path.resolve( `${ this.outputPath }/${ this.justNameOfDNA }/${ f }` );
  }

  copyGUI(cb) { // does:  ln -s /Users.....AminoSee/public, /Users.....currentWorkingDir/output/public
    // this.outputPath = appPath;
    this.mkRenderFolders();
    this.mkdir('public')


    let fullSrc, fullDest;
    fullSrc = path.normalize( path.resolve(appPath + '/public') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/public') );
    copyRecursiveSync(fullSrc, fullDest );
    fullSrc = path.normalize( path.resolve(appPath + '/public/index.html') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/index.html') ); // Protects users privacy in current working directory
    copyRecursiveSync(fullSrc, fullDest );
    // fullSrc = path.normalize( path.resolve(appPath + '/public/index.html') );
    // fullDest = path.normalize( path.resolve(this.outputPath + '/main.html') ); // Protects users privacy in current working directory
    // copyRecursiveSync(fullSrc, fullDest );
    fullSrc = path.normalize( path.resolve(appPath + '/public/favicon.ico') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/favicon.ico') ); // MOVES INTO ROOT
    copyRecursiveSync(fullSrc, fullDest );
    // fullSrc = path.normalize( path.resolve(appPath + '/aminosee-gui-web.js') );
    // fullDest = path.normalize( path.resolve(this.outputPath + '/aminosee-gui-web.js') );
    // copyRecursiveSync(fullSrc, fullDest );
    if (cb !== undefined) {
      cb();
    }
  }

  symlinkGUI(cb) { // does:  ln -s /Users.....AminoSee/public, /Users.....currentWorkingDir/output/public
    this.mkRenderFolders();
    this.mkdir('public')
    let fullSrc, fullDest;
    fullSrc = path.normalize( path.resolve(appPath + '/public') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/public') );
    createSymlink(fullSrc, fullDest);
    fullSrc = path.normalize( path.resolve(appPath + '/aminosee-gui-web.js') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/aminosee-gui-web.js') );
    createSymlink(fullSrc  , fullDest);
    fullSrc = path.normalize( path.resolve(appPath + '/public/index.html') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/main.html') ); // Protects users privacy in current working directory
    createSymlink(fullSrc, fullDest);
    fullSrc = path.normalize( path.resolve(appPath + '/node_modules') );
    fullDest = path.normalize( path.resolve(this.outputPath + '/node_modules') ); // MOVES INTO ROOT
    createSymlink(fullSrc, fullDest);
    if (cb !== undefined) {
      cb();
    }
  }

  // function startLocalWebServer() { // package lws
  //   fullSrc = path.normalize( path.resolve(appPath + '/public/lws.config.js') );
  //   fullDest = path.normalize( path.resolve(process.cwd() + '/lws.config.js') ); // MOVES INTO ROOT
  //   createSymlink(fullSrc, fullDest);


  // var PromisaryNote = function () {
  // const LocalWebServer = require('local-web-server')
  // const localWebServer = new LocalWebServer()
  // server = localWebServer.listen({
  //   configFile: 'output/lws.config.js'
  // });
  // .then(function () {
  //   output("Promise Resolved");
  // }).catch(function () {
  //   output("Promise Rejected");
  // });
  // return new Promise(function (resolve, reject) {
  //   if (true === true)
  //   resolve();
  //   else
  //   reject();
  // });
  // }
  // }

  startHttpServer() {
    httpserver.createServer();
    log('server started')
    setTimeout( () => {
      // runDemo();
    }, 10000) // keeps node open a little.
  }

  blockingServer() {
    setupProject();
    setupKeyboardUI();
    server.buildServer();  // copyGUI();  // startHttpServer()
    server.startServeHandler();
    // startCrossSpawnHttp(); // requires http-server be installed globally

    setTimeout(()=> {
      output("AminoSee built-in web server started")
      showCountdown();
    }, max32bitInteger);
  }



  // directoryListing: [
  //   "./*",
  //   "./dna/*",
  //   "./AminoSee_Output/*",
  //   "./output/*",
  //   "./public/*",
  //   "./calibration/*"
  // ]

  // let options = {
  //   public: process.cwd(),
  //   renderSingle: false,
  //   symlinks: true,
  //   unlisted: [
  //     ".DS_Store",
  //     ".git"
  //   ],
  //   directoryListing: true
  // }
  selfSpawn() {

    const evilSpawn = spawn('aminosee', ['serve', '', '', '0'], { stdio: 'pipe' });
    evilSpawn.stdout.on('data', (data) => {
      output(`${chalk.inverse('aminosee-cli serve')}${chalk(': ')}${data}  ${evilSpawn.name}`);
    });

    evilSpawn.stderr.on('data', (data) => {
      output(`${chalk.inverse('aminosee-cli  this.error')}${chalk(': ')}${data}`);
    });

    evilSpawn.on('close', (code) => {
      output(`child process quit with code ${code}`);
    });

  }

  startCrossSpawnHttp() {
    const spawn = require('cross-spawn');


    // Spawn NPM asynchronously
    // const evilSpawn = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' });
    // const evilSpawn = spawn('http-server', [server.getServerURL( this.justNameOfDNA), '--port', port, '0'], { stdio: 'pipe' });
    const evilSpawn = spawn('http-server', ['--directory', this.outputPath,  '--port', port, '0'], { stdio: 'pipe' });
    evilSpawn.stdout.on('data', (data) => {
      output(`${chalk.inverse('aminosee serve')}${chalk(': ')}${data}`);
    });

    evilSpawn.stderr.on('data', (data) => {
      output(`${chalk.inverse('aminosee  this.error')}${chalk(': ')}${data}`);
    });

    evilSpawn.on('close', (code) => {
      output(`child process quit with code ${code}`);
    });

    // port: port,
    // https: true,
    // log: ({
    // format: 'stats'
    // }),
    // directory: this.outputPath,
    // sp a: 'index.html',
    // websocket: 'src/websocket-server.js'

    log("Personal mini-Webserver starting up around this.now (hopefully) on port ${port}");
    // log(`visit ${server.getServerURL()} in your this.browser to see 3D WebGL visualisation`);
    log( terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10));
    log( terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200));
    log("Control-C to quit. This requires http-server, install that with:");
    log("sudo npm install --global http-server");
  }
  openMiniWebsite(path) {
    log(`Opening URL: ${server.getServerURL()}`)
    try {
      open(server.getServerURL());
    } catch(e) {
      this.error(`during openMiniWebsite: ${e} URL: ${server.getServerURL()}`);
    }
  }

  helpCmd(args) {

    output(chalk.bgBlue (`Welcome to the AminoSeeNoEvil DNA Viewer!`));
    output(siteDescription);
    output(chalk.bgBlue (`USAGE:`));
    output('    aminosee [files/*] --flags            (to process all files');
    output( terminalRGB('TIP: if you need some DNA in a hurry try this random clipping of 1MB human DNA:', 255,255,200));
    output('wget https://www.funk.co.nz/aminosee/dna/megabase.fa');
    output(`This CLI is to convert sequence found in ASCII/RTF-8 text files - tested with .mfa .fa .gbk up to  into .png graphics. works with .mfa .fa .gbk DNA text files. It's been tested with files up to 3 GB, and uses asynchronous streaming architecture! Pass the name of the DNA file via command line, and it will put the images in a folder called 'output' in the same folder.`);
    output(chalk.bgBlue (`HELP:`));
    output("Author:         tom@funk.co.nz or +64212576422");
    output("calls only between 2pm and 8pm NZT (GMT+11hrs)");
    output("Author:         tom@funk.co.nz or +64212576422");
    output("calls only between 2pm and 8pm NZT (GMT+11hrs)");
    output(chalk.bgBlue (`SUPPORT:`));
    output("Donations can be sent to my bitcoin address with thanks:");
    output("15S43axXZ8hqqaV8XpFxayZQa8bNhL5VVa");
    output("https://www.funk.co.nz/blog/online-marketing/pay-tom-atkinson");
    output(chalk.bgBlue (`VARIABLES:`));
    output('  --peptide="Amino Acid"  use quotes for two word compounds');
    output('  --triplet=[ATCGU]..   -t=GGG            any 3 nucleotides');
    output('  --codons [1-999] -c2       reduce detail to half size res');
    output('  --codons [1-999] -c100         packs 100 codons per pixel');
    output('  -- this.magnitude [0-8] -m9 crashes my mac 4096x4096 -m8 maximum 2048x2048 resolution');
    output(chalk.bgBlue (`FLAGS:`));
    output('  --ratio=[square|golden|fixed] fixed is default: 960px width variable height aspect');
    output('  --ratio=fix --ratio=golden --ratio=sqr aspect this.ratio proportions');
    output('  --verbose -v                               verbose this.mode');
    output('  --help -h                             show this message');
    output('  --force -f              ignore locks overwrite existing');
    output('  --devmode -d   will skip locked files even with --force');
    output('  --artistitc -a   creates a visual rhythm in the picture');
    output('  --this.dnabg -b   spew DNA bases to background during render');
    output('  --clear --no-clear       dont this.clear the terminal during');
    output('  --reg     put this.registration marks @ 25% 50% 75% and 100%');
    output('  --test                 create calibration this.test patterns');
    output('  --keyboard -k enable interactive this.mode, use control-c to end');
    output('  --firefox --chrome --safari changes default this.browser to open images');
    output('  --clear');
    output('  --html --no-html             open HTML report when done');
    output('  --updates --no-updates           turn off stats display');
    output('  --image                            open image when done');
    output('  --explorer  --file open file explorer / Finder to view files');
    output('  --no-gui               disables all GUI except terminal');
    output('  --quiet  -q               full this.quiet mode / server this.mode');
    output(chalk.bgBlue (`EXAMPLES:`));
    output('     aminosee Human-Chromosome-DNA.txt --force overwrite w/ fresh render');
    output('     aminosee chr1.fa -m 8                  render at 2048x2048');
    output('     aminosee chr1.fa  chrX.fa  chrY.fa          render 3 files');
    output('     aminosee * --peptide="Glutamic acid" (use quotes if there is a space');
    output('     aminosee * --triplet=GGT (highlight only this specific version of amino acid');
    output('     aminosee this.test                 (generate calibration images');
    output('     aminosee serve                (fire up the mini web server');
    output('     aminosee demo   <<-----           (run demo - beta version');
    output('     aminosee help   <<-----           (shows this docs message');
    output('     aminosee *         (render all files with default settings');
    term.down( this.termStatsHeight);
    this.printRadMessage( [ `software version ${version}` ] );
    if ( this.help == true) {
      this.openHtml = true;
      this.openImage = true;
      this.openFileExplorer = true;
      if ( this.keyboard == false) { // this not need done twice
        setupKeyboardUI();
      }

      // countdown('Press [Q] to quit this.now, [S] to launch a web server in background thread or wait ', 4000, blockingServer());
      // countdown('Press [S] to launch a web server in background thread or quit in ', 4000);
      setTimeout( () => {
        output("Closing in 2 minutes.")
        this.countdown("Closing in " , 120000, process.exit() );
      }, 4000)
    } else {
      // output('This is a terminal CLI (command line interface) program. Run it from the DOS prompt / Terminal.app / shell.', 4000);
      this.countdown('Press [Q] to quit this.now, closing in ', 4000, process.exit());
    }
  }

  mkRenderFolders() {
    log(`Making render folders for ${ this.justNameOfDNA}`)
    this.mkdir(); // create the output dir if it not exist
    this.mkdir( this.justNameOfDNA); // render dir
    this.mkdir(`${ this.justNameOfDNA}/images`);
  }
  fancyFilenames() {
    term.eraseDisplayBelow();
    output(chalk.bold(`Render Filenames for ${ this.justNameOfDNA}: ${this.pixelClock.toLocaleString()} pixels`));
    output(chalk.rgb(255, 255, 255).inverse( fixedWidth( this.debugColumns*2, `Input DNA File: ${ this.filename }`)));
    output(chalk.rgb(200,200,200).inverse(  fixedWidth( this.debugColumns*2, `Linear PNG: ${ this.justNameOfPNG }`)));
    output(chalk.rgb(150,150,150).inverse(  fixedWidth( this.debugColumns*2, `Hilbert PNG: ${ this.justNameOfHILBERT }`)));
    output(chalk.rgb(100,100,180).inverse.underline(  fixedWidth( this.debugColumns*2, `HTML ${ this.filenameHTML }`)));
    output(chalk.rgb(80,80,120).bgBlue.inverse(fixedWidth( this.debugColumns*2, `${ this.filenameTouch.substring( this.filenameTouch.length -24, -1) }`)));
  }
  setIsDiskBusy(boolean) {
    if (boolean) { // busy!
      this.isStorageBusy = true;
      this.isDiskFinHTML = false;
      this.isDiskFinHilbert = false;
      this.isDiskFinLinear = false;
      // this.renderLock = true;
    } else { // free!
      this.isStorageBusy = false;
      this.isDiskFinHTML = true;
      this.isDiskFinHilbert = true;
      this.isDiskFinLinear = true;
      // this.renderLock = false;
    }
  }
  saveDocsSync() {
    let pixels, height, width = 0;
    mode('saveDocsSync ' + this.justNameOfPNG);
    if ( this.renderLock == false) {
      bugtxt("How is this even possible. this.renderLock should be true until all storage is complete");
      return false;
    }
    try {
      pixels = ( this.rgbArray.length / 4);
    }
    catch (err) {
      this.error(`EXCEPTION DURING this.rgbArray.length / 4 = ${err}`);
      setTimeout(() => {
        this.resetAndMaybe();
      }, this.raceDelay )
      return false;
    }
    if ( pixels < 64) {
      output(`Not enough DNA in this file (${ this.currentFile }) ONLY RENDERED ${pixels} pixels`);
      setTimeout(() => {
        this.resetAndMaybe();
      }, this.raceDelay )
      return false;
    }
    this.setIsDiskBusy( true );
    output(chalk.inverse(`Finished linear render of ${ this.justNameOfDNA} ${ pixels } = ${ this.pixelClock }`))
    this.percentComplete = 1;
    term.eraseDisplayBelow();
    const computerWants = this.optimumDimension (this.pixelClock);

    if (this.test) { // the calibration generates its own image
      this.shrinkFactor = 1;
    } else { // regular DNA processing
      userprefs.aminosee.cliruns++; // increment run counter. for a future high score table stat and things maybe.
      userprefs.aminosee.gbprocessed  +=  this.baseChars / 1024 / 1024 / 1024; // increment disk counter.
      cliruns = userprefs.aminosee.cliruns
      gbprocessed  = userprefs.aminosee.gbprocessed ;
    }
    this.percentComplete = 1; // to be sure it shows 100% complete

    this.calcUpdate();
    this.setupHilbertFilenames();
    this.fancyFilenames();

    var that = this; // closure
    var file = this.filename;
    var temp = this.filenamePNG;

    async.series( [
      function( cb ) {
        log('async start')
        setTimeout(() => {
          cb();
        }, this.raceDelay*2);
      },
      function( cb ) {
        if ( this.test ) {
          log('async save hilbert using fakey method')
          this.filenamePNG = this.filenameHILBERT;
          this.rgbArray = this.hilbertImage
          this.ratio = 'sqr'
          that.savePNG( cb );
        } else {
          log('async save png')
          this.filename = file;
          that.savePNG( cb );
        }

      },
      function ( cb ) {
        this.filenamePNG = temp;

        // setTimeout(() => {
        that.saveHilbert( cb )
        // }, that.raceDelay)
      },
      function ( cb ) {
        that.saveHTML( cb ); // saveHTML no longer calls htmlFinished, its so this.openOutputs has time to open it
      },
      function ( cb ) {
        that.openOutputs(that); // thats done in here now
        that.htmlFinished();
        setTimeout(() => {
          cb();
        }, that.raceDelay*3)
      }
    ])
    .exec( function( error, results ) {
      log( 'Saving complete.' ) ;
      // that.pollForStream()
      if ( error ) { console.warn( 'Doh!' ) ; }
    })

  }

  compareHistocount(a,b) {
    if (a.Histocount < b.Histocount)
    return -1;
    if (a.Histocount > b.Histocount)
    return 1;
    return 0;
  }
  saveHTML(cb) {
    mode("maybe save HTML");
    if ( !this.isHilbertPossible ) { log('not saving html - due to hilbert not possible');       this.isDiskFinHTML = true; cb(); return false; }
    if ( this.test ) { log('not saving html - due to test'); cb(); return false; }
    if ( this.willRecycleSavedImage == true && this.recycEnabled) {
      log("Didnt save HTML this.report because the linear file was recycled. Use --html to enable and auto open when done.");
      this.isDiskFinHTML = true;
      if ( cb !== undefined ) { cb() }
      return false;
    }
    if ( this.report == false) {
      log("Didnt save HTML this.report because reports = false they were disabled. Use --html to enable and auto open when done.");
      this.isDiskFinHTML = true;
      // this.htmlFinished();
      if ( cb !== undefined ) { cb() }
      return false;
    }
    mode("save HTML");
    this.pepTable.sort( this.compareHistocount )
    let histogramJson =  this.getRenderObject();
    let histogramFile = path.normalize( path.resolve(`${ this.outputPath }/${ this.justNameOfDNA}/aminosee_histogram.json`) );
    let hypertext
    if ( this.test === true ) {
      hypertext = this.htmlTemplate( this.testSummary() );
    } else {
      hypertext = this.htmlTemplate( histogramJson );
    }

    let histotext = JSON.stringify(histogramJson);
    this.fileWrite( this.filenameHTML, hypertext );
    this.fileWrite( histogramFile, histotext );
    this.fileWrite(`${ this.outputPath }/${ this.justNameOfDNA}/main.html`, hypertext, cb);
    if ( cb !== undefined ) { cb() }
    // this.bugtxt( this.pepTable.sort( this.compareHistocount ) ); // least common amino acids in front
    // this.bugtxt(histogramJson);
  }
  fileWrite(file, contents, cb) {
    this.mkRenderFolders();
    var that = this;
    try {
      fs.writeFile(file, contents, 'utf8', function (err, cb) {
        if (err) {
          that.bugtxt(`[FileWrite] Issue with saving: ${ file } ${err}`)
        } else {
          try {
            that.bugtxt('Set permissions for file: ' + file);
            // fs.chmodSync(file, 0o777); // not work with strict this.mode
            fs.chmodSync(file, '0777');
          } catch(e) {
            that.bugtxt('Could not set permission for file: ' + file + ' due to ' + e);
          }
        }
        log('¢ ' + file);
        if ( cb !== undefined ) { cb() }
      });
      output('$');
    } catch(err) {
      log(`[catch] Issue with saving: ${file} ${err}`);
      if ( cb !== undefined ) { cb() }
    }
  }
  touchLockAndStartStream() { // saves CPU waste. delete lock when all files are saved, not just the png.
    mode("touchLockAndStartStream");
    if ( this.renderLock == true ) {
      log(`Thread re-entry during locking`)
      return false;
    }
    this.renderLock = true;
    // output("Start")
    this.tLock( );
    this.initStream()
  }
  blurb() {
    return `Started DNA render ${ this.currentFile } at ${ formatAMPM( this.startDate)}, and after ${humanizeDuration( this.runningDuration)} completed ${ this.nicePercent()} of the ${bytes(  this.baseChars)} file at ${bytes( this.bytesPerMs*1000)} per second. Estimated ${humanizeDuration( this.timeRemain)} to go with ${  this.genomeSize.toLocaleString()} r/DNA base pair this.triplets decoded, and ${ this.pixelClock.toLocaleString()} pixels painted so far.
    ${ this.memToString()}
    CPU load:    [ ${ this.loadAverages()} ]`
  }
  tLock(cb) {
    this.calcUpdate();

    const outski = " " + this.blurb();
    this.fileWrite(
      this.filenameTouch,
      `${lockFileMessage}
      ${ version } ${ this.timestamp } ${ hostname }
      ${ asciiart }
      Input: ${ this.filename }
      Your output path : ${ this.outputPath }
      ${outski}`,
      cb
    );
    if ( this.msElapsed > 5000) {
      this.termDrawImage();
    }

    if ( !this.quiet ) {
      term.saveCursor()
      term.moveTo(0, term.height - 5);
      output(chalk.bgWhite.rgb(48,48,48).inverse(outski));
      output('*')
      term.restoreCursor()
    }
  }
  fileBug(err) {
    this.bugtxt(err + " the file was: " + this.currentFile);
  }
  static deleteFile(file) {
    try {
      fs.unlinkSync(file, (err) => {
        this.bugtxt("Removing file OK...")
        if (err) { fileBug(err)  }
      });
    } catch (err) {
      fileBug(err)
    }
  }

  removeLocks(cb) { // just remove the lock files.
    mode('remove locks');
    this.bugtxt('remove locks with ' + this.howMany + ' files in queue. this.filenameTouch: ' + this.filenameTouch)
    this.renderLock = false
    this.howMany--
    clearTimeout( this.updatesTimer);
    clearTimeout( this.progTimer);
    deleteFile( this.filenameTouch);
    if ( cb !== undefined ) { cb() }
  }
  // start or poll.
  lookForWork( reason ) { // move on to the next file via this.pollForStream. only call from early parts prio to render.
    mode(`Look for work reason: ${reason}`);

    if ( this.renderLock == true ) { // re-entrancy filter
      this.error('busy with render ' + reason);
      return false;
    }
    if ( this.test == true ) { // uses a loop not polling.
      this.bugtxt('test is in look for work?');
      return false;
    }
    if (this.howMany <= 0) {
      mode('Happiness.');
      log(chalk.bgRed.yellow(status));
      this.printRadMessage(status)
      this.quit(130, status)
      return false;
    }
    if ( this.currentFile == undefined) {
      // this.quit(1, status)
      return false;
    }
    if (!doesFileExist(path.resolve(this.currentFile))) {
      mode(`file not existing, trying next one`);
      this.pollForStream();
      return false;
    }

    try {
      this.howMany = this.args._.length;
    } catch(e) {
      mode(`lookForWork caught  this.error: ${e}`);
      this.bugtxt(status)
      this.quit(0, status)
      return false;
    }
    if (this.howMany == -1) {
      output('Shutdown in progress');
      this.quit(0, status)
      return false;
    }
    this.bugtxt(`Polling in ${ this.raceDelay } ms ${this.howMany} files remain, next is ${maxWidth(32, this.nextFile)}`);
    // setTimeout(() => {
    if ( !this.renderLock) {
      this.pollForStream('everything is going according to plan.');
    } else {
      output(`Thread re-entered in look for work`)
    }
    // }, this.raceDelay );
  }
  popAndResolve() {
    try {
      this.currentFile = this.args._.pop().toString();
      this.howMany = this.args._.length;
    } catch(e) {
      this.howMany = this.args._.length;
      return 'popAndLock args not exist ' + e;
    }
    if ( this.currentFile.indexOf('...') != -1) { return 'Cant use files with three dots in this.filename ... ' }
    this.filename = path.resolve( this.currentFile );
    if ( this.filename == undefined) { return 'filename was undefined after resolve: ' + this.currentFile }
    if ( doesFileExist(this.filename)) {
      return 'success';
    }  else {
      if (this.renderLock == false) {
        this.popAndResolve();
      }
    }
  }
  postRenderPoll(reason) { // renderLock on late, off early
    log(chalk.inverse(`Finishing saving (${reason}), ${this.busy()} waiting on ${ this.storage() } ${ this.howMany } files to go.`));
    if ( this.renderLock !== true) { // re-entrancy filter
      log("Not rendering (may halt), thread entered postRenderPoll: " + reason)
      return true
    }
    // if (this.test) { this.isDiskFinHTML = true }
    // try to avoid messing with globals of a already running render!
    // sort through and load a file into "nextFile"
    // if its the right this.extension go to sleep
    // check if all the disk is finished and if so change the locks
    // log(chalk.inverse( fixedWidth(24, this.justNameOfDNA))  + " postRenderPoll reason: " + reason);
    if ( this.isDiskFinLinear == true && this.isDiskFinHilbert == true  && this.isDiskFinHTML == true ) {
      log(` [ storage threads ready: ${chalk.inverse( this.storage() )} ] `);
      this.setIsDiskBusy( false );
      // this.openOutputs(this);

      if ( this.test ) {
        this.renderLock = false;
        // setTimeout( () => {
          this.runCycle()
        // }, this.raceDelay)
      } else { this.removeLocks(); this.resetAndMaybe(); }
    } else {
      log(` [ wait on storage: ${chalk.inverse( this.storage() )} reason: ${reason}] `);
      // if ( this.test ) {
      //   setTimeout( () => {
      //     this.htmlFinished();
      //   }, this.raceDelay)
      // }
    }
  }
  getFilesizeInBytes(file) {
    try {
      const stats = fs.statSync(file)
      const fileSizeInBytes = stats.size
      return fileSizeInBytes
    } catch(err) {
      console.warn("File not found: " + file);
      return -1; // -1 is signal for failure or unknown size (stream).
    }
  }
  // function getFilesizeInBigIntBytes(f) {
  //    this.baseChars = 69;
  //   bigIntFileSize = 69696969696969n; // this.test of big int.
  //   try {
  //      this.baseChars = fs.fstatSync(f, { bigint: false }).size;
  //     bigIntFileSize = fs.fstatSync(f, { bigint: true } ).size;
  //     log(`File exists with size ${ this.baseChars} at: ${path}`);
  //     return  this.baseChars;
  //   } catch(e) {
  //      this.baseChars = -1;
  //     output(`Cant stat filesize of ${path} File  this.error: ${e}`);
  //     return  this.baseChars;
  //   }
  //   log(`f ${path}  this.baseChars ${ this.baseChars} file: ${file} big int filesize: ${bigIntFileSize}`);
  //   return  this.baseChars; // this.debug flag. basically i should never see -69 appearing in  this.error logs
  // }
  getFileExtension(f) {
    if (!f) { return "none" }
    let lastFour = f.slice(-4);
    return lastFour.replace(/.*\./, '').toLowerCase();

    // let lastFive = f.slice(-5);
    // return lastFive.replace(/.*\./, '').toLowerCase();
  }
  checkFileExtension(f) {
    let value = extensions.indexOf( this.getFileExtension(f));
    if ( value < 0) {
      this.bugtxt(`checkFileExtension FAIL: ${f}  ${value} `);
      return false;
    } else {
      this.bugtxt(`checkFileExtension GREAT SUCCESS: ${f}  ${value} `);
      return true;
    }
  }

  quit(n, txt) {
    if (n == undefined) { n = 0 }
    log(`Received quit(${n})`);
    if ( this.isDiskFinLinear && this.isDiskFinHilbert && this.isDiskFinHTML) {
      if ( this.renderLock == true ) {
        log("still rendering") // maybe this happens during gracefull shutdown
        return false;
      }
    } else {
      log("still saving to storage") // maybe this happens during gracefull shutdown
    }
    if (this.howMany > 1 ) {
      this.bugtxt(`There is more work (${this.howMany}) . Rendering: ${this.busy()} Load: ${os.loadavg()}`);
      // lookForWork('quit')
      return true;
    }
    if (n == 0) {
      if (isElectron == true){
        log("Electron mode clean exit.")
        return true;
      } else {
        log("CLI mode clean exit.")
      }
    }
    mode('quit');
    log(chalk.bgWhite.red (`process.exit going on. last file: ${ this.filename }`));
    if (this.devmode == true && this.debug == false) {
      output("Because you are using --devmode without --this.debug, the lock file is not deleted. This is useful during development because I can quickly this.test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rendered but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry.")
    } else {
      this.removeLocks();
    }
    this.bugtxt(`percent complete ${  this.percentComplete}`);
    destroyKeyboardUI();
    this.destroyProgress();
    this.calcUpdate();
    if (killServersOnQuit == true) {
      if (webserverEnabled == true && n == 130) { // control-c kills server
        output("ISSUING 'killall node' use 'Q' key to quit without killing all node processes.")
        // this.renderLock = false;
        const killServe = spawn('nice', ['killall', 'node', '', '0'], { stdio: 'pipe' });
        const killAminosee = spawn('nice', ['killall', 'aminosee.funk.nz', '', '0'], { stdio: 'pipe' });
        if (server != undefined) {
          log("closing server")
          server.close();
        } else {
          this.bugtxt("no server running?")
        }
        try {
          fs.unlinkSync( this.filenameServerLock, (err) => {
            this.bugtxt("Removing server locks OK...")
            if (err) { log('ish'); console.warn(err);  }
          });
        } catch (err) {
          this.bugtxt("No server locks to remove: " + err);
        }
      }
    } else if (webserverEnabled == true){
      log("If you get a lot of servers running, use Control-C instead of [Q] to issues a 'killall node' command to kill all of them")
    }
    this.args._ = [];
    if ( this.keyboard == true) {
      try {
        process.stdin.setRawMode(false);
        // process.stdin.resume();
      } catch(e) {  this.error( "Issue with keyboard this.mode: " + e ) }
    } else {
      log("Not in keyboard this.mode.")
    }

    term.eraseDisplayBelow();
    // this.printRadMessage([ ` ${(killServersOnQuit ?  'AminoSee has shutdown' : 'Webserver will be left running in background. ' )}`, `${( this.verbose ?  ' Exit code: '+n : '' )}`,  (killServersOnQuit == false ? server.getServerURL() : ' '), this.howMany ]);
    // redoLine("exiting in "+ humanizeDuration( this.raceDelay * 2) )
    setImmediate(() => {
      // redoLine("exiting in "+ humanizeDuration( this.raceDelay * 2) )
      setTimeout( () => {
        // redoLine("exiting")
        process.exitCode = 0;
        if ( n == 130 ) {
          term.processExit(n);
          process.exit()
        }

      }, this.raceDelay  * 2)
    })
  }
  processLine(l) {
    this.status = "stream";
    this.streamLineNr++;
    if (this.rawDNA.length < this.termPixels) {
      this.rawDNA = this.cleanString(l) + this.rawDNA;
    }
    let lineLength = l.length; // replaces  this.baseChars
    let codon = "";
    this.currentTriplet = "none";
    this.isHighlightCodon = false;
    for (let column=0; column<lineLength; column++) {
      // build a three digit codon
      let c = cleanChar(l.charAt(column)); // has to be ATCG or a . for cleaned chars and line breaks
      this.charClock++;
      // ERROR DETECTING
      // IMPLMENTED AFTER ENABLEDING "N" TO AFFECT THE IMAGE
      // ITS AT THE STAGE WHERE IT CAN EAT ANY FILE WITH DNA
      // BUT IF ANY META DATA CONTAINS THE WORD "CAT", "TAG" etc these are taken as coding (its a bug)
      while ( c == "." && c != "N") { // biff it and get another
        // log(c);
        codon =  ""; // we wipe it because... codons should not cross line break boundaries.
        column++;
        c = cleanChar(l.charAt(column)); // line breaks
        this.charClock++;
        this.errorClock++;
        this.red  = 0;
        this.green  = 0;
        this.blue  = 0;

        if (column > lineLength) {
          // log("BREAK - END OF LINE")
          this.breakClock++;
          break
        }
      }
      codon += c; // add the base
      if (codon == "..." || codon == "NNN") {
        this.currentTriplet = codon;
        if (codon == "NNN" ) {
          this.pepTable.find(isNoncoding).Histocount++;
        }
        codon="";
        this.bugtxt( this.red + this.green + this.blue );
        if ( this.red + this.green + this.blue >0) { // this is a fade out to show headers.
          //  this.red  -= this.codonsPerPixel;
          //  this.green -= this.codonsPerPixel;
          //  this.blue -= this.codonsPerPixel;
          this.red  --;
          this.green --;
          this.blue --;
          // this.paintPixel();
        } else {
          // do nothing this maybe a non-coding header section in the file.
          // status = "header";
          //  this.msPerUpdate  = 100;
        }
        this.errorClock++;


      } else if (codon.length ==  3) {
        this.currentTriplet = codon;
        this.pixelStacking++;
        this.genomeSize++;
        this.codonRGBA =  this.codonToRGBA(codon); // this will this.report this.alpha info
        let brightness = this.codonRGBA[0] +  this.codonRGBA[1] +  this.codonRGBA[2] + this.codonRGBA[3];

        // HIGHLIGHT codon --triplet Tryptophan
        if ( this.isHighlightSet ) {
          if (codon == this.triplet) {
            this.isHighlightCodon = true;
          } else if (this.aminoacid == this.peptide) {
            this.isHighlightCodon = true;
          } else {
            this.isHighlightCodon = false;
          }
        }

        if (this.isHighlightCodon) { // 255 = 1.0
          this.mixRGBA[0]  += parseFloat( this.codonRGBA[0].valueOf() * this.highlightFactor * this.opacity );// * this.opacity ; //  this.red
          this.mixRGBA[1]  += parseFloat( this.codonRGBA[1].valueOf() * this.highlightFactor * this.opacity );// * this.opacity ; //  this.green
          this.mixRGBA[2]  += parseFloat( this.codonRGBA[2].valueOf() * this.highlightFactor * this.opacity );// * this.opacity ; //  this.blue
          this.mixRGBA[3]  +=   255 * ( this.highlightFactor *  this.opacity );// * this.opacity ; //  this.blue
        } else {
          //  not a START/STOP codon. Stack multiple codons per pixel.
          // HERE WE ADDITIVELY BUILD UP THE VALUES with +=
          this.mixRGBA[0] +=   parseFloat( this.codonRGBA[0].valueOf() * this.opacity  *  this.darkenFactor );
          this.mixRGBA[1] +=   parseFloat( this.codonRGBA[1].valueOf() * this.opacity  *  this.darkenFactor );
          this.mixRGBA[2] +=   parseFloat( this.codonRGBA[2].valueOf() * this.opacity  *  this.darkenFactor );
          this.mixRGBA[3] +=   255 * ( this.darkenFactor *  this.opacity );// * this.opacity ; //  this.blue
        }





        //  blends colour on one pixel
        if ( this.pixelStacking >= this.codonsPerPixel) {


          if ( this.artistic != true) {


            this.red  =  this.mixRGBA[0];
            this.green  =  this.mixRGBA[1];
            this.blue  =  this.mixRGBA[2];
            this.alpha =  this.mixRGBA[3];
            this.paintPixel(); // FULL BRIGHTNESS
            // reset inks, using this.codonsPerPixel cycles for each pixel:
            this.mixRGBA[0] =   0;
            this.mixRGBA[1] =   0;
            this.mixRGBA[2] =   0;
            this.mixRGBA[3] =   0;
            this.red  = 0;
            this.green  = 0;
            this.blue  = 0;
            this.alpha = 0;

            // end science this.mode
          } else {
            // ************ ARTISTIC this.mode
            if (this.isHighlightCodon) {
              if ( artisticHighlightLength >= 12) {
                this.red  =  this.mixRGBA[0]/12;
                this.green  =  this.mixRGBA[1]/12;
                this.blue  =  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();



                this.red  =  this.mixRGBA[0]/12;
                this.green  =  this.mixRGBA[1]/12;
                this.blue  =  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
                this.red  +=  this.mixRGBA[0]/12;
                this.green  +=  this.mixRGBA[1]/12;
                this.blue  +=  this.mixRGBA[2]/12;
                this.paintPixel();
              }
              this.red  +=  this.mixRGBA[0]/3;
              this.green  +=  this.mixRGBA[1]/3;
              this.blue  +=  this.mixRGBA[2]/3;
              this.paintPixel();
              this.red  +=  this.mixRGBA[0]/3;
              this.green  +=  this.mixRGBA[1]/3;
              this.blue  +=  this.mixRGBA[2]/3;
              this.paintPixel();
              this.red  =  this.mixRGBA[0];
              this.green  =  this.mixRGBA[1];
              this.blue  =  this.mixRGBA[2];
              this.paintPixel();
              this.red  += 200;
              this.green  += 200;
              this.blue  += 200;
              this.paintPixel();
              this.red  =  this.mixRGBA[0]/2;
              this.green  =  this.mixRGBA[1]/2;
              this.blue  =  this.mixRGBA[2]/2;
              this.paintPixel();
              this.red  = 0;
              this.green  = 0;
              this.blue  = 0;
              this.paintPixel(); // END WITH BLACK
              this.pixelStacking = 0;
              this.mixRGBA[0] =   0;
              this.mixRGBA[1] =   0;
              this.mixRGBA[2] =   0;
              //
            } else { // non highlight pixel end // ARTISTIC MODE BELOW
              this.red  = 0;
              this.green  = 0;
              this.blue  = 0;
              this.alpha = 255; // Full black
              this.paintPixel(); // 1. START WITH BLACK
              this.red  =  this.mixRGBA[0]/2;
              this.green  =  this.mixRGBA[1]/2;
              this.blue  =  this.mixRGBA[2]/2;
              this.alpha = 128; // HALF TRANSLUCENT GLINT
              this.paintPixel(); // 2.
              this.red  += 99; // <-- THIS IS THE WHITE GLINT
              this.green  += 99; // <-- THIS IS THE WHITE GLINT
              this.blue  += 99; // <-- THIS IS THE WHITE GLINT
              this.alpha = 255; // fully opaque from here
              this.paintPixel(); // 3.
              this.red  =  this.mixRGBA[0];
              this.green  =  this.mixRGBA[1];
              this.blue  =  this.mixRGBA[2];
              this.paintPixel(); // 4. <<--- Full colour pixel! from here it fades out

              for(let ac = 0; ac < artisticHighlightLength - 5; ac++ ) { // Subtract the four pix above and the one below
                this.red  =  this.red  / 1.2;
                this.green  =  this.green  / 1.2;
                this.blue  =  this.blue  / 1.2;
                this.paintPixel(); // 12 - 4 = 7 cycles hopefully
              }

              this.red  =  this.red  / 1.1;
              this.green  =  this.green  / 1.1;
              this.blue  =  this.blue  / 1.1;
              this.alpha = 128;
              this.paintPixel(); // 12th.
              // reset inks:
              this.pixelStacking = 0;
              this.mixRGBA[0] =   0;
              this.mixRGBA[1] =   0;
              this.mixRGBA[2] =   0;
            }


          } // this.artistic this.mode

        } // end pixel stacking
        codon = ""; // wipe for next time
      } // end codon.length ==  3
    } // END OF line LOOP! thats one line but  this.mixRGBA can survive lines
  } // end processLine

  aminoFilenameIndex(id) { // return the this.filename for this amino acid for the report
    let backupPeptide = this.peptide;
    let backupHighlight = this.isHighlightSet;
    if (id == undefined || id == -1) { // for the reference image
      this.currentPepHighlight = false;
      this.currentPeptide = "none";
      this.isHighlightSet = false; //currentPepHighlight;
    } else {
      this.currentPepHighlight = true;
      this.currentPeptide = this.pepTable[id].Codon;
      this.isHighlightSet = true; //currentPepHighlight;
    }
    this.peptide = this.currentPeptide; // bad use of globals i agree, well i aint getting paid for this, i do it for the love, so yeah
    let returnedHil = this.generateFilenameHilbert(); // this.isHighlightSet needs to be false for reference
    let returnedPNG = this.generateFilenamePNG(); // this.isHighlightSet needs to be false for reference
    this.peptide = backupPeptide;
    this.isHighlightSet = backupHighlight;
    return [ returnedHil, returnedPNG ];
  }
  getImageType() {
    let t = "";
    if ( this.args.ratio) {
      t += `_${ this.ratio }`;
    }
    ( this.artistic ? t += "_artistic" : t += "_sci")
    return t;
  }


  htmlTemplate(histogramJson) {
    if (histogramJson == undefined) {
      let histogramJson = this.getRenderObject();
      // ;
    }
    var html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8"/>
    <head>
    <title>${ this.justNameOfDNA} :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson :: ${ this.currentFile }</title>
    <meta name="description" content="${ siteDescription }">
    <link rel="stylesheet" type="text/css" href="https://www.funk.co.nz/aminosee/public/AminoSee.css">
    <link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
    <link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
    <link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet">



    <script src="https://www.funk.co.nz/aminosee/public/three.min.js"></script>
    <script src="https://www.funk.co.nz/aminosee/public/jquery.min.js"></script>
    <script src="https://www.funk.co.nz/aminosee/public/hilbert3D.js"></script>
    <script src="https://www.funk.co.nz/aminosee/public/hilbert2D.js"></script>
    <script src="https://www.funk.co.nz/aminosee/public/WebGL.js"></script>
    <script src="https://www.funk.co.nz/aminosee/public/hammer.min.js"></script>
    <!--
    <script src="../public/three.min.js"></script>
    <script src="../public/jquery.min.js"></script>
    <script src="../public/hilbert3D.js"></script>
    <script src="../public/hilbert2D.js"></script>
    <script src="../public/WebGL.js"></script>
    <script src="../public/hammer.min.js"></script>
    -->
    <script src="../public/aminosee-gui-web.js"></script>

    <style>
    border: 1px black;
    backround: black;
    padding: 4px;
    </style>
    </head>
    <body>
    <!-- Google Tag Manager -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8JX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-P8JX');</script>
  <!-- End Google Tag Manager -->
<nav> <a href="../../">AminoSee Home</a> | <a href="../../">Parent</a>  </nav>
  <h1>AminoSee DNA Render Summary for ${ this.currentFile }</h1>
  <h2>${ this.justNameOfDNA}</h2>
  ${( this.test ? " this.test " : this.imageStack(histogramJson))}


  <div class="fineprint" style="text-align: right; float: right;">
  <pre>
  ${ this.renderObjToString(histogramJson)}
  </pre>
  </div>


  <a href="#scrollLINEAR" class="button" title"Click To Scroll Down To See LINEAR"><br />
  <img width="128" height="128" style="border: 4px black; background: black;" src="images/${ this.justNameOfPNG}">
  1D Linear Map Image
  </a>
  <a href="#scrollHILBERT" class="button" title"Click To Scroll Down To See 2D Hilbert Map"><br />
  <img width="128" height="128" style="border: 4px black background: black;" src="images/${ this.justNameOfHILBERT}">
  2D Hilbert Map Image
  </a>



  <div id="monkeys">
  <div><a href="http://aminosee.funk.nz/">
  <input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollHILBERT'"><br>

  <img src="https://www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg">

  <!-- <h1>AminoSeeNoEvil</h1> -->
  <h1>Amino<span style="color: #888888;">See</span><span style="color: #dddddd;">NoEvil</span></h1>
  <div class="hidable">
  <h2 id="h2">DNA/RNA Chromosome Viewer</h2>
  <p id="description" class="fineprint hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon this.triplet</p>



  </div>
  </a>
  </div>
  </div>

  <div>`;



  html += `</div>

  <br /><br />
  http://localhost:8888/aminosee/output/50KB_TestPattern/50KB_TestPattern.txt_linear-Reference_c1_sci.png
  <table>
  <thead>
  <tr>
  <th>Amino Acid</th>
  <th>Hue</th>
  <th>RGB</th>
  <th>Count</th>
  <th>Description</th>
  <th>Hilbert PNG</th>
  <th>Linear PNG</th>
  </tr>
  </thead>
  <tbody>

  <tr>
  <td style="background-color: white;"> All amino acids combined =   </td>
  <td>
  <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">n/a</p>
  </td>
  <td style="color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">n/a</p> </td>
  <td>${ this.genomeSize}</td>
  <td>n/a</td>
  <td style="background-color: white;">
  <a href="images/${ this.justNameOfHILBERT}" class="button" title="Reference Hilbert Image"><img width="48" height="16" class="blackback" src="images/${ this.justNameOfHILBERT}" alt="AminoSee Reference Hilbert Image ${ this.justNameOfDNA}"></a>
  </td>
  <td style="background-color: white;">
  <a href="images/${ this.justNameOfPNG}" class="button" title="Reference Linear Image"><img width="48" height="16" class="blackback" src="images/${ this.justNameOfPNG}" alt="Reference Linear Image ${ this.justNameOfDNA}"></a>
  </td>
  </tr>

  `;
  // this.pepTable   = [Codon, Description, Hue, Alpha, Histocount]
  for (let i = 0; i < this.pepTable.length; i++) {
    let thePep = this.pepTable[i].Codon;
    let theHue = this.pepTable[i].Hue;
    let c =      hsvToRgb( theHue / 360, 0.5, 1.0 );
    let lightC = hsvToRgb( theHue / 360, 0.95, 0.75 );
    let imghil = this.aminoFilenameIndex(i)[0]; // first elemewnt in array is the hilbert image
    let imglin = this.aminoFilenameIndex(i)[1]; // second element is linear

    if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
      html += `<!-- ${thePep} -->`;
    } else {
      html += `
      <tr style="background-color: hsl( ${theHue} , 50%, 100%);" onmouseover="mover(${i})" onmouseout="mout(${i})">
      <td style="background-color: white;"> ${ this.pepTable[i].Codon} </td>
      <td style="background-color: rgb(${lightC});">
      <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${theHue}&#xB0;</p>
      </td>
      <td style="background-color: rgb(${c}); color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${c}</p> </td>
      <td>${ this.pepTable[i].Histocount.toLocaleString()}</td>
      <td>${ this.pepTable[i].Description}</td>
      <td style="background-color: white;">
      <a href="images/${ imghil }" class="button" title="Amino filter: ${ thePep }"><img width="48" height="16" class="blackback" src="images/${ imghil }" alt="${ this.justNameOfDNA } ${ thePep }"></a>
      </td>
      <td style="background-color: white;">
      <a href="images/${ imglin }" class="button" title="Amino filter: ${ thePep }"><img width="48" height="16" class="blackback" src="images/${ imglin }" alt="${ this.justNameOfDNA } ${ thePep }"></a>
      </td>
      </tr>
      `
    }
  }
  html += `
  </tbody>
  <tfoot>
  <tr>
  <td>19 Amino Acids, 4 Start/Stop codes, 1 NNN</td>
  <td>.</td>
  <td>.</td>
  <td>.</td>
  <td>.</td>
  </tr>
  </tfoot>
  </table>
  <a name="scrollHILBERT" ></a>
  <a href="images/${ this.justNameOfHILBERT}" ><img src="images/${ this.justNameOfHILBERT}" width-"99%" height="auto"></a>

  <h2>About Start and Stop Codons</h2>
  <p>The codon AUG is called the START codon as it the first codon in the transcribed mRNA that undergoes translation. AUG is the most common START codon and it codes for the amino acid methionine (Met) in eukaryotes and formyl methionine (fMet) in prokaryotes. During protein synthesis, the tRNA recognizes the START codon AUG with the help of some initiation factors and starts translation of mRNA.

  Some alternative START codons are found in both eukaryotes and prokaryotes. Alternate codons usually code for amino acids other than methionine, but when they act as START codons they code for Met due to the use of a separate initiator tRNA.

  Non-AUG START codons are rarely found in eukaryotic genomes. Apart from the usual Met codon, mammalian cells can also START translation with the amino acid leucine with the help of a leucyl-tRNA decoding the CUG codon. Mitochondrial genomes use AUA and AUU in humans and GUG and UUG in prokaryotes as alternate START codons.

  In prokaryotes, E. coli is found to use AUG 83%, GUG 14%, and UUG 3% as START codons. The lacA and lacI coding this.regions in the E coli lac operon don’t have AUG START codon and instead use UUG and GUG as initiation codons respectively.</p>
  <h2>Linear Projection</h2>
  The following image is in raster order, top left to bottom right:
  <a name="scrollLINEAR" ></a>
  <a href="images/${ this.justNameOfPNG}" ><img src="images/${ this.justNameOfPNG}"></a>
  <br/>

  <div id="googleads">

  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <!-- AminoSee Reports -->
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-0729228399056705"
  data-ad-slot="2513777969"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
  <script>
  (adsbygoogle = window.adsbygoogle || []).push({});
  </script>

  </div>
  `;
  return html;
}

checkLocks(fullPathOfLockFile) { // return TRUE if locked.
  this.bugtxt("checkLocks RUNNING: " + fullPathOfLockFile);
  if ( this.force == true) {
    this.bugtxt("Not checking locks - this.force mode enabled.");
    return false;
  }
  let locked, result;
  locked = false;
  try {
    result = fs.lstatSync(fullPathOfLockFile).isDirectory();
    log('locked')
    return true;
  } catch(e){
    this.bugtxt("No lockfile found - proceeding to render" );
    return false;
  }
  return locked;
}
decodePNG(file, callback) {
  // var fs = require('fs'),
  //   PNG = require('pngjs').PNG;
  log("Recyling...")
  fs.createReadStream(file)
  .pipe(new PNG({
    filterType: 4
  }))
  .on('parsed', function() {
    this.rgbArray = [this.length];
    for (let  y = 0; y < this.height; y++) {
      for (let  x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;



        // invert color
        this.rgbArray[idx] = this.data[idx];
        this.rgbArray[idx+1] = this.data[idx+1];
        this.rgbArray[idx+2] = this.data[idx+2];
        this.rgbArray[idx+3] = this.data[idx+3];
      }
    }
    // this.pack().pipe(fs.createWriteStream('out.png'));
    callback();
    return this.rgbArray;
  });
}
recycleOldImage(pngfile) {
  try {
    // var oldimage = new PNG.load(f);
    output(chalk.inverse("RECYCLING EXISTING LINEAR FILE ") + chalk(" " + this.justNameOfDNA))
    this.rgbArray = decodePNG(pngfile, function () {
      this.isDiskFinHilbert = false;
      this.isDiskFinHTML = true;
      this.isDiskFinLinear = true;
      this.calculateShrinkage();
      this.rgbArray = this.data;
      // this.saveHilbert( this.hilbertFinished);
      saveDocuments();
    });
  } catch(e) {
    output(`Failure during recycling: ${e} will poll for work`);
    this.isDiskFinHilbert = true;
    // this.lookForWork(`recycle fail`);
    this.pollForStream(`recycle fail`)
    return false;
  }
}

skipExistingFile (fizzle) { // skip the file if TRUE render it if FALSE
  if ( this.force == true) { return false; } // true means to skip render
  let result = doesFileExist(fizzle);
  this.bugtxt('skipExistingFile ' + fizzle + "force: " + this.force + " result: " + result)
  this.bugtxt(`The file is: ${fizzle} which ${( result ? 'DOES' : 'does NOT')} exist`)
  return this.result;
}




stat(txt) {
  output(`stat: ${txt}`);
}

toBuffer(ab) {
  var buf = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (let  i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
// returns 1 this.dimensional array index from x y co-ords
coordsToLinear(x, y) {
  return (x % width) + (y * width)
}
makeWide(txt) {
  let len = txt.length;
  if (len > 14) {
    txt = `[${txt.slice(14)}]`;
  } else if (len > 13) {
    txt = `[ ${txt.slice(13)}]`;
  } else if (len < 13) {
    txt = `[ ${txt.slice(12)} ]`;
  }
  return txt
}
hilDecode(i, dimension) {
  // this.bugtxt(`i, this.dimension  ${i} ${ this.dimension }`)
  let x, y;
  [x, y] = MyManHilbert.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
  // ROTATE IMAGE CLOCKWISE 90 DEGREES IF this.dimension IS EVEN NUMBER FRAMES
  if ( this.dimension % 2 == 0 ) { // if even number
    let newY = x;
    x = y
    y = newY;
  }
  return [ x, y ];
}

calculateShrinkage() { // danger: can change this.filenames of Hilbert images!

  let linearpix = this.rgbArray.length / 4;
  let computerWants = this.optimumDimension (linearpix);

  if ( computerWants > defaultMagnitude ) {
    output(`This genome could be output at a higher resolution of ${hilbPixels[computerWants].toLocaleString()} than the default of ${computerWants}, you could try -m 8 or -m 9 if your machine is muscular, but it might core dump. -m10 would be 67,108,864 pixels but node runs out of stack before I get there on my 16 GB macOS. -Tom.`)
    this.dimension = defaultMagnitude;
  } else if (computerWants < 0) {
    this.dimension = 0; // its an array index
    this.error(`That image is way too small to make an image out of?`);
  } else {
    this.dimension = computerWants; // give him what he wants
  }

  if ( this.args.magnitude || this.args.m) {
    this.dimension =  this.magnitude; // users choice over ride all this nonsense
    output(`Ideal magnitude: ${computerWants} using custom magnitude: ${ this.dimension }`);
  } else {
    // this.magnitude = this.dimension;
    output(`Ideal magnitude: ${computerWants} using auto-magnitude: ${ this.dimension }`);
  }

  let hilpix = hilbPixels[ this.dimension ];;
  this.hilbertImage = [hilpix*4];
  this.shrinkFactor = linearpix / hilpix;//  array.length / 4;
  this.codonsPerPixelHILBERT = this.codonsPerPixel /  this.shrinkFactor;
  log(`Linear pix: ${linearpix.toLocaleString()} > reduction: X${  this.shrinkFactor } = ${hilbPixels[ this.dimension ].toLocaleString()} pixels ${ this.dimension }th this.dimension hilbert curve`);
  // this.dimension; // for this.filenames
  // this.codonsPerPixelHILBERT = twosigbitsTolocale( this.codonsPerPixel* this.shrinkFactor );
  this.codonsPerPixelHILBERT = this.codonsPerPixel* this.shrinkFactor;
  this.filenameHILBERT = `${ this.outputPath }/${ this.justNameOfDNA}/images/${ this.generateFilenameHilbert() }`;

  this.bugtxt(` this.shrinkFactor pre ${  this.shrinkFactor } = linearpix ${linearpix } /  hilpix ${hilpix}  `);
  this.bugtxt(`filenameHILBERT after shrinking: ${ this.filenameHILBERT } this.dimension: ${ this.dimension }  this.shrinkFactor post ${ twosigbitsTolocale( this.shrinkFactor)} this.codonsPerPixel ${ this.codonsPerPixel } this.codonsPerPixelHILBERT ${ this.codonsPerPixelHILBERT }`);
}


// resample the large 760px wide linear image into a smaller square hilbert curve
saveHilbert(cb) {
  mode('maybe save hilbert');
  if ( this.isHilbertPossible  == true) {
    log("projecting linear array to 2D hilbert curve");
  } else {
    log("Cant output hilbert image when using artistic mode");
    this.isDiskFinHilbert = true; // doesnt trigger a re-poll.
    // hilbertFinished();
    cb();
    return false;
  }
  this.setupHilbertFilenames();
  if ( this.skipExistingFile( this.filenameHILBERT) == true ) {
    output("Existing hilbert image found - skipping projection: " + this.filenameHILBERT);
    if ( this.openImage) {
      this.bugtxt('opening');
      // this.openOutputs();
    } else {
      log("Use --image to open in default this.browser")
    }
    this.isDiskFinHilbert = true;
    this.previousImage = this.filenameHILBERT;
    this.termDrawImage();
    cb();
    return false;
  }
  term.eraseDisplayBelow();
  mode('save hilbert');
  log("Getting in touch with my man from 1891... Hilbert. In the " + this.dimension + "th this.dimension and reduced by " + threesigbitsTolocale( this.shrinkFactor) + "X  ----> " +  this.justNameOfHILBERT);
  output("    ॐ    ");
  this.bugtxt( this.justNameOfDNA);
  // term.up(1);
  // output(status);
  let hilpix = hilbPixels[ this.dimension ];;
  this.resampleByFactor( this.shrinkFactor);
  let hWidth = Math.sqrt(hilpix);
  let hHeight  = hWidth;
  this.hilbertImage = [ hilpix ]; // wipe the memory
  this.percentComplete = 0;
  this.debugFreq = Math.round(hilpix / 100);
  this.progUpdate({ title: 'Hilbert Curve', items: this.howMany, syncMode: true })
  for (let i = 0; i < hilpix; i++) {
    if ( i%this.debugFreq == 0) {
      this.percentComplete = i/hilpix;
      this.progUpdate(  this.percentComplete)
    }

    let hilbX, hilbY;
    [hilbX, hilbY] = hilDecode(i, this.dimension, MyManHilbert);
    let cursorLinear  = 4 * i ;
    let hilbertLinear = 4 * ((hilbX % hWidth) + (hilbY * hWidth));
    this.percentComplete = i / hilpix;
    // if ((Math.round(  this.percentComplete * 1000) % 100) === 0) {
    //   this.clout(i, this.debugFreq, "Space filling " + this.nicePercent() + " of " + hilpix.toLocaleString());
    // }

    // output("Space filling " + fixedWidth(10, (perc*100) + "%") + " of " + hilpix.toLocaleString());

    this.hilbertImage[hilbertLinear+0] = this.rgbArray[cursorLinear+0];
    this.hilbertImage[hilbertLinear+1] = this.rgbArray[cursorLinear+1];
    this.hilbertImage[hilbertLinear+2] = this.rgbArray[cursorLinear+2];
    this.hilbertImage[hilbertLinear+3] = this.rgbArray[cursorLinear+3];
    if ( this.reg) {
      this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete);
    }
    if (i-4 > this.rgbArray.length) {
      this.bugtxt("BREAKING at positon ${i} due to ran out of source image. this.rgbArray.length  = ${rgbArray.length}");
      this.bugtxt(` @i ${i} `);
      break;
    }
  }

  log("Done projected 100% of " + hilpix.toLocaleString());
  // hilbertFinished();

  var hilbert_img_data = Uint8ClampedArray.from( this.hilbertImage);
  var hilbert_img_png = new PNG({
    width: hWidth,
    height: hHeight,
    colorType: 6,
    bgColor: {
      red: 0,
      green: 0,
      blue: 0
    }
  })

  hilbert_img_png.data = Buffer.from(hilbert_img_data);
  let wstream = fs.createWriteStream( this.filenameHILBERT);
  var that = this;
  new Promise(resolve => {
    hilbert_img_png.pack()
    .pipe(wstream)
    .on('finish', (err) => {
      that.bugtxt("HILBERT Save OK " +  this.storage());
      that.hilbertFinished();
      if ( cb !== undefined ) { cb() }
    })
  }).then( output('Render HILBERT done') ).catch( output('catch') );
}
htmlFinished() {
  this.isDiskFinHTML = true;
  mode(`HTML done. Waiting on (${ this.storage()})`);
  this.postRenderPoll('htmlFinished ' + this.filenameHTML);
}
hilbertFinished() {
  mode(`Hilbert curve done. Waiting on (${ this.storage()})`);
  this.isDiskFinHilbert = true;
  this.previousImage = this.filenameHILBERT;
  // this.termDrawImage()
  this.postRenderPoll('hilbertFinished ' + this.filenameHILBERT);
}

linearFinished() {
  if ( this.test ) {
    mode(`Calibration linear generation done. Waiting on (${ this.storage()})`);
  } else {
    mode(`DNA linear render done. Waiting on (${ this.storage()})`);
  }
  this.isDiskFinLinear = true;
  if ( this.artistic) {
    this.previousImage = this.filenamePNG;
    // this.termDrawImage()
  }
  this.postRenderPoll('linearFinished ' + this.filenamePNG);
}
termDrawImage(fullpath) {
  if (fullpath === undefined) { fullpath = this.previousImage }
  if (fullpath === undefined) { return false }
  // if ( this.force == true) { return false }
  if ( this.quiet == true ) { return false }
  this.previousImage = fullpath;
  term.clear()
  bugout(this.previousImage)
  term.moveTo( 0, 0 );
  term.drawImage( this.previousImage , { shrink: { width: term.width,  height: term.height } } )
  output("Previous image: " +  replaceoutputPathFileName(this.previousImage))
  // term.restoreCursor()
}
bothKindsTestPattern(cb) {
  if (this.renderLock == false) {
    log("error render lock fail in test patterns")
    return false;
  }
  let h = require('hilbert-2d');
  let hilpix = hilbPixels[ this.dimension ];
  let linearpix = hilpix;// * 4;
  this.hilbertImage = [hilpix*4];
  this.rgbArray = [linearpix*4];

  output(chalk.bgWhite(`Math.sqrt(hilpix): [${Math.sqrt(hilpix)}])`));
  let hWidth = Math.round(Math.sqrt(hilpix));
  let hHeight = hWidth;
  const linearWidth = Math.round(Math.sqrt(hilpix));
  const linearHeight = linearWidth;

  // if (this.howMany == -1) {
  // log("Error -1: no remaining files to process");
  // hilbertFinished();
  // return false;
  // }

  output(`Generating hilbert curve of the ${ this.dimension }th this.dimension out of: ${this.howMany}`);
  this.bugtxt( this.filenameHILBERT);
  this.percentComplete = 0;
  let d = Math.round(hilpix/100);
  for (let i = 0; i < hilpix; i++) {
    let hilbX, hilbY;
    [hilbX, hilbY] = hilDecode(i, this.dimension, h);
    let cursorLinear  = 4 * i ;
    let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth));
    this.percentComplete =  (i+1) / hilpix;
    this.dot(i, d, ' ॐ  ' + this.nicePercent());
    this.hilbertImage[hilbertLinear] =   255* this.percentComplete; // slow ramp of  this.red
    this.hilbertImage[hilbertLinear+1] = ( i % Math.round(  this.percentComplete * 32) ) / (  this.percentComplete *32) *  255; // SNAKES! crazy bio snakes.
    this.hilbertImage[hilbertLinear+2] = (  this.percentComplete *2550)%255; // creates 10 segments to show each 10% mark in  this.blue
    this.hilbertImage[hilbertLinear+3] = 255; // slight edge in this.alpha
    if ( this.reg) {
      this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete);
    } else {
      if ( this.peptide == "Opal") {
        this.hilbertImage[hilbertLinear]  = 0; //  this.red
        this.hilbertImage[hilbertLinear+1]  = 0; //  this.green
      } else if ( this.peptide == "Ochre") {
        this.hilbertImage[hilbertLinear+2]  = 0; //  this.blue
        this.hilbertImage[hilbertLinear+1]  = 0; //  this.green
      } else if ( this.peptide == "Methionine") {
        this.hilbertImage[hilbertLinear]  = 0; //  this.red
        this.hilbertImage[hilbertLinear+2]  = 0; //  this.blue
      } else if ( this.peptide == "Arginine") { // PURPLE
        this.hilbertImage[hilbertLinear+1]  = 0; //  this.blue
      }
    }
    this.rgbArray[cursorLinear+0] = this.hilbertImage[hilbertLinear+0];
    this.rgbArray[cursorLinear+1] = this.hilbertImage[hilbertLinear+1];
    this.rgbArray[cursorLinear+2] = this.hilbertImage[hilbertLinear+2];
    this.rgbArray[cursorLinear+3] = this.hilbertImage[hilbertLinear+3];
  }










  this.setIsDiskBusy( true );
  this.renderLock = true;
  const hilbertImage = this.hilbertImage;
  const rgbArray = this.rgbArray;
  // this.saveDocsSync();

  var hilbert_img_data = Uint8ClampedArray.from( this.hilbertImage );
  var hilbert_img_png = new PNG({
    width: this.width,
    height: this.height,
    colorType: 6,
    bgColor: {
      red: 0,
      green: 0,
      blue: 0
    }
  })
  hilbert_img_png.data = Buffer.from( hilbert_img_data );
  let wstreamHILBERT = fs.createWriteStream( this.filenameHILBERT );

  new Promise(resolve => {
    hilbert_img_png.pack()
    .pipe(wstreamHILBERT)
    .on('finish', (err, resolve) => {
      // if (err) { log(`not sure if that saved: ${err}`)}
      // if (resolve) { log(`not sure if that saved: ${err} ${ this.storage()} `) }
      this.isDiskFinHilbert = true;
    })
  }).then(  ).catch( output('Test HILBERT catch') );




  // new Promise(resolve =>
  //   hilbert_img_png.pack()
  //   .pipe(wstreamHILBERT)
  //   .on('finish', resolve)
  // );


  var img_data = Uint8ClampedArray.from( this.rgbArray );
  var img_png = new PNG({
    width: this.width,
    height: this.height,
    colorType: 6,
    bgColor: {
      red: 0,
      green: 0,
      blue: 0
    }
  })
  img_png.data = Buffer.from( img_data );
  let wstreamLINEAR = fs.createWriteStream( this.filenamePNG );

  new Promise(resolve => {
    img_png.pack()
    .pipe(wstreamLINEAR)
    .on('finish', (err, resolve) => {
      // if (err) { log(`not sure if that saved: ${err}`)}
      // if (resolve) { log(`not sure if that saved: ${err} ${ this.storage()} `) }
      // this.isDiskFinLinear = true;
      this.linearFinished()
    })
  }).then(  ).catch( output('Test LINEAR catch') );



  // new Promise(resolve =>
  //   img_png.pack()
  //   .pipe(wstreamLINEAR)
  //   .on('finish', resolve)
  // );

    setTimeout( () => {
      this.isDiskFinHTML = true;
      this.linearFinished();
      this.hilbertFinished();
      if (cb !== undefined) { cb() }
    }, 4000)
    //
    // if (cb !== undefined) { cb() }




  }
  saveLinearPNG(cb, filename, array) {
    this.filenamePNG = filename;
    this.width = width;
    this.height = height;
    this.rgbArray = array;
    savePNG(cb)
  }
  savePNG(cb) {
    let pixels, height, width = 0;
    try {
      pixels = ( this.rgbArray.length / 4);
    }
    catch (err) {
      this.error(`NOT ENOUGH PIXELS ${err}`);
      resetAndMaybe();
      return false;
    }

    if ( this.ratio == "sqr" || this.ratio == "hil") {
      width = Math.round(Math.sqrt(pixels));
      height = width;
      while ( pixels > width*height) {
        log(` [w: ${width} h: ${height}] `)
        width++;
        height++;
      }
    } // SQUARE RATIO

    if ( this.ratio == "gol") {
      let phi = ((Math.sqrt(5) + 1) / 2) ; // 1.618033988749895
      let bleed = pixels * phi; // was a good guess!
      width = Math.sqrt(bleed); // need some extra pixels sometimes
      height = width; // 1mp = 1000 x 1000
      height =  ( width * phi ) - width; // 16.18 - 6.18 = 99.99
      width = bleed / height;
      height = Math.round(height);
      width = Math.round(width) - height;
    } else if ( this.ratio == "fix") {
      if (pixels <= widthMax) {
        width = pixels;
        height = 1;
      } else {
        width = widthMax;
        height = Math.round(pixels / widthMax); // you can have half a line. more and its an extra vert line
        if (height<1) {
          height=1;
        }
      }
      while ( pixels > width*height) {
        log(`linear image height: ${height} pixels by 960`);
        height++;
      }
    } // GOLDEN RATIO

    if ( pixels <= width*height) {
      log("Image allocation is OK: " + pixels + " <= width x height = " + ( width * height ));
    } else {
      this.error(`MEGA FAIL: TOO MANY ARRAY PIXELS NOT ENOUGH IMAGE SIZE: array pixels: ${pixels} <  width x height = ${width*height}`);
      // this.quit(6, 'Failed to allocate correct image size (doh!)');
      resetAndMaybe();
      return false;
    }
    var stringy = {
      file: this.filenamePNG,
      width: width,
      height: height,
      colorType: 6,
      bgColor: {
        red: 0,
        green: 0,
        blue: 0
      }
    }
    log( JSON.stringify(stringy));

    var img_data = Uint8ClampedArray.from( this.rgbArray );
    var img_png = new PNG({
      width: width,
      height: height,
      colorType: 6,
      bgColor: {
        red: 0,
        green: 0,
        blue: 0
      }
    })

    img_png.data = Buffer.from(img_data);
    let wstream = fs.createWriteStream( this.filenamePNG);
    var that = this;
    new Promise(resolve => {
      img_png.pack()
      .pipe(wstream)
      .on('finish', (err) => {
        that.bugtxt("linear Save OK " +  this.storage());
        that.linearFinished();
      })
    }).then( bugtxt('LINEAR then') ).catch( bugtxt('LINEAR catch') );

    if ( cb !== undefined ) { cb() }
  }

  openOutputs(that) {
    // return true;
    status ="open files";
    // if (that.devmode == true)  { this.bugtxt(renderObjToString()); }

    if ( !this.openHtml == false && !this.openImage && !this.openFileExplorer) {
      log('Will not open the output');
      return false;
    }
    if ( this.opensFile > 2) {
      log('will not open more windows')
      // opens  File = 0;
      openFile = false;
      return false;
    }
    if ( this.opensImage > 2) {
      log('will not open more windows')
      //  this.opensImage = 0;
      this.openImage = false;
      return false;
    }
    if ( this.opensHtml > 2) {
      log('will not open more windows')
      //  this.opensHtml = 0;
      this.openHtml = false;
      return false;
    }
    log( closeBrowser ); // tell user process maybe blocked
    this.bugtxt(` this.openHtml, this.openImage, this.openFileExplorer `, this.openHtml, this.openImage, this.openFileExplorer );
    if ( this.openFileExplorer === true) {
      output(`Opening render output folder in File Manager ${ this.outputPath }`);
      open(this.outputPath).then(() => {
        this.opensFile++;
        log("file manager closed");
      }).catch(function () {  this.error(`open(${ this.outputPath })`)});
    }
    if ( this.openHtml == true) {
      output(`Opening ${ this.justNameOfHTML} DNA render summary HTML report.`);
      // bgOpen( this.filenameHTML, {app: 'firefox', wait: false} );
      launchNonBlockingServer( this.justNameOfDNA, this);
      this.opensHtml++;
      open( server.getServerURL( this.justNameOfDNA), { wait: false } );
      // if (openLocalHtml == true) {
      //    this.opensFile++;
      //   open( this.filenameHTML, {app: 'firefox', wait: false}).then(() => {
      //     log("browser closed");
      //   }).catch(function () {  this.error("open( this.filenameHTML)")});
      // }
    }
    if ( this.isHilbertPossible  === true && this.openImage === true) {
      output(`Opening ${ this.justNameOfHILBERT} 2D hilbert space-filling image.`);
      // bgOpen( this.filenameHILBERT)
      this.opensImage++;
      open( this.filenameHILBERT).then(() => {
        log("hilbert image closed");
      }).catch(function () {  this.error("open( this.filenameHILBERT)") });
    } else if ( this.openImage === true) {
      output(`Opening ${ this.justNameOfPNG} 1D linear projection image.`);
      // bgOpen( this.filenamePNG )
      this.opensImage++;
      open( this.filenamePNG ).then(() => {
        log("regular png image closed");
      }).catch(function () {  this.error("open( this.filenamePNG )") });
    } else {
      log(`Use --html or --image to automatically open files after render, and "aminosee demo" to generate this.test pattern and download a 1 MB DNA file from aminosee.funk.nz`)
      log(`values of this.openHtml ${ this.openHtml }   this.openImage ${ this.openImage}`);
    }
    if ( this.openHtml || this.openImage || this.openFileExplorer ) {
    } else {
      this.out("Not opening anything");
    }
    // log(");
  }
  getRegmarks() {
    return ( this.reg == true ? "_reg" : "" )
  }
  mkdir(relative, cb) { // returns true if a fresh dir was created
    if ( relative === undefined) { relative = ''}
    let dir2make = path.resolve( `${ this.outputPath }/${relative}` );
    if ( doesFolderExist(this.outputPath) == false) {
      try {
        fs.mkdirSync(this.outputPath, function (err, result) {
          // if (result) { log(`Success: ${result}`) }
          // if (err) { this.bugtxt(`Couldnts create output folder: ${err}`) }
        });
      } catch(e) {
        // this.bugtxt(`Error creating folder: ${e} at location: ${dir2make}`)
      }
    }
    if ( doesFolderExist(dir2make) === false) {
      log(`Creating fresh directory: ${dir2make}`);
      try {
        fs.mkdirSync(dir2make, function (err, result) {
          if (result) { log(`Success: ${result}`) }
          if (err) {  this.error(`Fail: ${err}`) }
          if ( cb !== undefined ) { cb() }
        });
      } catch(e) { this.bugtxt(`${e} This is normal`); if ( cb !== undefined ) { cb() } }
      return true; // true because its first run
    } else {
      this.bugtxt(`Directory ${ relative } already exists - This is normal.`)
      if ( cb !== undefined ) { cb() }
      return false;
    }
    console.warn("Quiting due to lack of permissions in this directory");
    this.howMany = 0;
    this.bugtxt(`this.outputPath: ${ this.outputPath }`);

    return false;
  }

  generateTestPatterns(cb) {
    this.howMany = this.magnitude;
    this.openHtml = false;
    this.report = false;
    this.test = true;
    this.updates = true;
    this.pngImageFlags = "_test_pattern";
    this.setupProject()

    if ( this.args.magnitude || this.args.m) {
      this.magnitude = Math.round( this.args.magnitude || this.args.m);
    } else {
      this.magnitude = defaultMagnitude;
    }
    if ( this.args.ratio || this.args.r) {
      log("Looks better with --ratio=square in my humble opinion")
    } else {
      this.ratio = "sqr";
    }

    output("output test patterns to /calibration/ folder. filename: " + this.filename);
    this.mkdir('calibration');
    if (this.howMany == -1) { this.quit(0); return false;}
    if (  this.magnitude > 10) { output(`I think this will crash node`); }
    output(`TEST PATTERNS GENERATION    m${ this.magnitude} c${ this.codonsPerPixel }`);
    output("Use -m to try different this.dimensions. -m 9 requires 1.8 GB RAM");
    output("Use --no-reg to remove this.registration marks at 0%, 25%, 50%, 75%, 100%. It looks a little cleaner without them ");
    log(`pix      ${hilbPixels[ this.magnitude]} `);

    this.loopCounter = 0; // THIS REPLACES THE FOR LOOP, INCREMENET BY ONE EACH FUNCTION CALL AND USE IF.
    this.howMany =  this.magnitude;// - this.loopCounter;
    if ( cb !== undefined ) {
      this.runCycle(cb); // runs in a callback loop
    } else {
      this.runCycle(); // runs in a callback loop
    }

    // log(`done with JUST ONE CYCLE OF this.generateTestPatterns(). this.filenames:`);
    // log( this.outputPath);
    // log( this.filenameTouch);
    // log( this.filenamePNG );
    // log( this.filenameHILBERT);
    // log( this.filenameHTML);

  }
  runCycle(cb) {
    if (this.renderLock == true) {
      log(`Thread re-entered runCycle ${this.loopCounter}`)
      return false;
    }
    this.loopCounter++
    this.howMany--;
    if (this.loopCounter+1 >  this.magnitude) {
      this.testStop();
      // this.saveHTML(this.openOutputs);
      // this.openOutputs();
      // this.termDrawImage();
      if ( cb !== undefined ) { cb() }
      // this.quit(0);
      return false;
    }
    output('test cycle ' + this.loopCounter);
    this.testInit (this.loopCounter); // replaces loop
    this.bothKindsTestPattern(() => {
      output(`test patterns returned`)
      // this.saveDocsSync();

      // this.runCycle( cb )
      this.isDiskFinHTML = true;
      setTimeout( () => {
        this.postRenderPoll(`test patterns returned`);
        //   this.rgbArray = this.hilbertImage;
        //   this.savePNG()
        //
        // })
      }, this.raceDelay)

    }); // <<--------- sets up both linear and hilbert arrays but only saves the Hilbert.




    return true;
  }

  testStop () {
    this.percentComplete = 1;
    this.genomeSize = 0;
    this.baseChars = 0;
    this.charClock = -1; // gets around zero length check
    this.pixelClock = -1; // gets around zero length check
    this.quit(0);
  }
  testInit ( magnitude ) {
    let testPath = path.resolve(this.outputPath + "/calibration");
    let regmarks = this.getRegmarks();
    let highlight = "";

    this.renderLock = true;
    this.dimension =  magnitude;

    if ( this.peptide == "Opal" || this.peptide == "Blue") {
      highlight += "_BlueAt10Percent";
    } else if ( this.peptide == "Ochre" || this.peptide == "Red") {
      highlight += "_RedRamp";
    } else if ( this.peptide == "Methionine" || this.peptide == "Green") {
      highlight += "_GreenPowersTwo";
    } else if ( this.peptide == "Arginine" || this.peptide == "Purple") {
      highlight += "_Purple";
    }
    this.isHilbertPossible = true;
    this.report = false;
    this.errorClock = 0;
    this.percentComplete = 1;
    this.runningDuration = 1;
    this.currentTriplet = "none"
    this.ratio = "sqr"
    this.justNameOfDNA = `AminoSee_Calibration${ highlight }${ regmarks }`;
    this.justNameOfPNG = `${ this.justNameOfDNA}_LINEAR_${  magnitude }.png`;
    this.justNameOfHILBERT = `${ this.justNameOfDNA}_HILBERT_${  magnitude }.png`;
    this.filenameHTML    = testPath + "/" + this.justNameOfDNA + ".html";
    this.filenamePNG     = testPath + "/" + this.justNameOfPNG;
    this.filenameHILBERT = testPath + "/" + this.justNameOfHILBERT;
    this.filenameTouch   = testPath + "/" + this.justNameOfDNA + "_LOCK.touch";
    this.filename = this.filenameHILBERT;
    this.currentFile = this.justNameOfHILBERT;
    this.baseChars = hilbPixels[  magnitude ];
    this.maxpix = hilbPixels[defaultMagnitude+1];
    this.genomeSize =  this.baseChars;
    this.estimatedPixels =  this.baseChars;
    this.charClock =  this.baseChars;
    this.pixelClock =  this.baseChars;
    return true;
  }

  paintRegMarks(hilbertLinear, hilbertImage,  percentComplete) {
    let thinWhiteSlice = (Math.round( percentComplete * 1000 )) % 250; // 1% white bands at 0%, 25%, 50%, 75%, 100%
    if (thinWhiteSlice < 1) { // 5 one out of 10,000
      // this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete);
      this.hilbertImage[hilbertLinear+0] = 255 - ( this.hilbertImage[hilbertLinear+0]);
      this.hilbertImage[hilbertLinear+1] = 255 - ( this.hilbertImage[hilbertLinear+1]);
      this.hilbertImage[hilbertLinear+2] = 255 - ( this.hilbertImage[hilbertLinear+2]);
      this.hilbertImage[hilbertLinear+3] = 128;
      if (thinWhiteSlice % 2) {
        this.hilbertImage[hilbertLinear+0] = 255;
        this.hilbertImage[hilbertLinear+1] = 255;
        this.hilbertImage[hilbertLinear+2] = 255;
        this.hilbertImage[hilbertLinear+3] = 255;
      }
    }
  }
  throttledFreq(gears) { // used to prevent super fast computers from spitting too much output
    if (gears == undefined) { gears = this.debugGears } else { this.debugGears = gears} // wow that is one line
    return this.estimatedPixels / (( this.codonsPerSec + 1) * gears); // numbers get bigger on fast machines.
  }


  // this will destroy the main array by first upsampling then down sampling
  resampleByFactor( shrinkFactor) {
    let sampleClock = 0;
    let brightness = 1/ this.shrinkFactor;
    let downsampleSize = hilbPixels[ this.dimension ]; // 2X over sampling high grade y'all!
    let antiAliasArray = [ downsampleSize  * 4 ]; // RGBA needs 4 cells per pixel
    // output(`Resampling linear image of size in pixels ${pixelClock.toLocaleString()} by the factor ${ twosigbitsTolocale( this.shrinkFactor)}X brightness per amino acid ${brightness} destination hilbert curve pixels ${downsampleSize.toLocaleString()} `);
    this.debugFreq = Math.round(downsampleSize/100);
    // SHRINK LINEAR IMAGE:
    this.progUpdate({ title: 'Resample by X'+ this.shrinkFactor, items: this.howMany, syncMode: true })
    for (let z = 0; z<downsampleSize; z++) { // 2x AA this.pixelClock is the number of pixels in linear
      if ( z % this.debugFreq == 0) {
        this.percentComplete = z/downsampleSize;
        this.progUpdate(  this.percentComplete)
      }
      let sum = z*4;
      let clk = sampleClock*4; // starts on 0
      antiAliasArray[sum+0] = this.rgbArray[clk+0]*brightness;
      antiAliasArray[sum+1] = this.rgbArray[clk+1]*brightness;
      antiAliasArray[sum+2] = this.rgbArray[clk+2]*brightness;
      antiAliasArray[sum+3] = this.rgbArray[clk+3]*brightness;
      this.dot(z, this.debugFreq, `z: ${z.toLocaleString()}/${downsampleSize.toLocaleString()} samples remain: ${( this.pixelClock - sampleClock).toLocaleString()}`);
      while(sampleClock  < z* this.shrinkFactor) {
        clk = sampleClock*4;
        antiAliasArray[sum+0] += this.rgbArray[clk+0]*brightness;
        antiAliasArray[sum+1] += this.rgbArray[clk+1]*brightness;
        antiAliasArray[sum+2] += this.rgbArray[clk+2]*brightness;
        antiAliasArray[sum+3] += this.rgbArray[clk+3]*brightness;
        sampleClock++;
      }
      sampleClock++;
    }
    this.rgbArray = antiAliasArray;
  }
  optimumDimension (pix) { // give it pix it returns a  this.magnitude that fits inside it
    let dim = 0;
    let rtxt = `[HILBERT] Calculating largest Hilbert curve image that can fit inside ${ twosigbitsTolocale(pix)} pixels, and over sampling factor of ${overSampleFactor}: `;
    while (pix > (hilbPixels[dim] * overSampleFactor)) {
      // rtxt += ` dim ${dim}: ${hilbPixels[dim]} `;
      if (dim % 666 == 0 && dim > 666) {
        // rtxt+= (`ERROR this.optimumDimension  [${hilbPixels[dim]}] pix ${pix} dim ${dim} `);
      }
      if (dim > defaultMagnitude) {
        if (  this.magnitude && dim > theoreticalMaxMagnitude ) {
          output("Hilbert dimensions above 8 will likely exceed nodes heap memory and/or call stack. mag 11 sure does. spin up the fans.")
          dim = theoreticalMaxMagnitude;
          break
        } else {
          dim = defaultMagnitude;
          break
        }
      }
      dim++;
    }
    if (dim>0) { dim--; } // was off by 1

    rtxt+= ` <<<--- chosen  this.magnitude: ${dim} `;
    this.bugtxt(rtxt);
    if (this.devmode == true) { this.bugtxt(rtxt) }
    return dim;
  }

  dot(i, x, t) {
    // this.debugFreq = throttledFreq();
    if (i % x == 0 ) {
      if (!t) {
        t = `[ ${i} ]`;
      }
      // if ( this.verbose && devmode && this.debug) {
      // output(t);
      // } else {
      this.clout(t);
      this.progUpdate(  this.percentComplete);

      // }
    }
  }




  makeRequest(url) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false); // Note: synchronous
      xhr.responseType = 'arraybuffer';
      xhr.send();
      return xhr.response;
    } catch(e) {
      return "XHR Error " + e.toString();
    }
  }
  busy() {
    return ( this.renderLock ? 'BUSY' : 'IDLE')
  }


  setDebugCols() {
    if (term.width > 200) {
    } else {
      this.debugColumns = term.width - 2;
    }
    this.debugColumns = Math.round(term.width  / 3)-1;
    return Math.round(term.width / 3);
  }

  // static output(txt) {
  //   wTitle(txt) // put it on the terminal windowbar or in tmux
  //   output(txt);
  // }
  // output(txt) {
  //   output(txt);
  // }
  out(txt) {
    // redoLine(txt);
    // output(txt);
    // return true;

    if (txt == undefined || this.quiet == true) { return false;}
    term.eraseDisplayBelow;
    // output(`[${txt}] `)
    redoLine(txt);
    if ( this.updates == true && this.renderLock == true) {
      term.right( this.termMarginLeft );
    }
    process.stdout.write(`[${txt}] `);
  }
  error(e) {
    if ( this.quiet == false ) {
      output();
      output(status + ' /  this.error start {{{ ----------- ' + chalk.inverse( e.toString() ) + chalk(" ") + ' ----------- }}} end');
      output();
    }
    mode(` this.error: ${e} will exit`)
    process.exit();
  }
  clout(txt) {
    if (txt == undefined) {
      txt = " ";
      return false;
    }
    if (txt.substring(0,5) == ' this.error' &&  !this.quiet) {
      console.warn(`[ ${txt} ] `);
    } else {
      redoLine(chalk.rgb( this.red, this.green, this.blue )(`[ `) + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(`[ `));
        // output(chalk.rgb( this.red, this.green, this.blue )(`[ `) + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(`[ `));
      }
    }




    cleanString(s) {
      let ret = "";
      s = removeLineBreaks(s);

      for (let i=0; i< s.length; i++) {
        ret += cleanChar(s.charAt(i));
      }
      return ret;
    }
    paintPixel() {
      let byteIndex = this.pixelClock * 4; // 4 bytes per pixel. RGBA.

      this.rgbArray.push(Math.round( this.red ));
      this.rgbArray.push(Math.round( this.green ));
      this.rgbArray.push(Math.round( this.blue ));
      this.rgbArray.push(Math.round( this.alpha));

      // new streaming method
      // pixelStream.push(Math.round( this.red ));
      // pixelStream.push(Math.round( this.green ));
      // pixelStream.push(Math.round( this.blue ));
      // pixelStream.push(Math.round(alpha));
      // STORE THE HIGH SCORES. Knowing what the peak brightness was enables
      // a scale down in brightness later using floating point images.
      // if ( this.red  > peakRed )     { peakRed  =  this.red } else {  peakRed --}
      // if ( this.green  > peakGreen ) { peakGreen  =  this.green } else {  peakGreen --}
      // if ( this.blue  > peakBlue )   { peakBlue  =  this.blue } else {  peakBlue --}
      this.peakRed  =  this.red ;
      this.peakGreen  =  this.green ;
      this.peakBlue  =  this.blue ;
      this.pixelStacking = 0;
      this.pixelClock++;
    }

    clearCheck() { // maybe clear the terminal
      if ( this.clear == true) {
        this.clearScreen();
      } else {
        process.stdout.write('[nc]');
        term.eraseDisplayBelow();
      }
      // this.msPerUpdate  = minUpdateTime; // update the displays faster
      // if ( this.renderLock ) { this.drawHistogram() }
    }
    clearScreen() {
      term.clear();
      // process.stdout.write("\x1Bc");
      // process.stdout.write("\x1B[2J"); // THIS SHRINKS MY FONTS!! wtf?
      // process.stdout.write('\033c'); // <-- maybe best for linux? this.clears the screen. ALSD SHRINKS MY FONTS
    }
    static clearScreen() {
      term.clear();
      // process.stdout.write("\x1Bc");
      // process.stdout.write("\x1B[2J"); // THIS SHRINKS MY FONTS!! wtf?
      // process.stdout.write('\033c'); // <-- maybe best for linux? this.clears the screen. ALSD SHRINKS MY FONTS
    }

    prettyDate() {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today  = new Date();

      return today.toLocaleString(options) + "  " + today.toLocaleDateString(options); // Saturday, September 17, 2016
    }
    returnRadMessage(array) {
      let returnText = "";
      if (array == undefined) {
        array = ["    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:", this.outputPath ];
        // array = [ "    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:"," " ];
      }
      while ( array.length < 8 ) {
        array.push("    ________","    ________");
      }
      returnText += terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${array[0]}`, 255, 60,  250);
      returnText += terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${array[1]}`, 170, 150, 255);
      returnText += terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${array[2]}`, 128, 240, 240);
      returnText += terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${array[3]}`, 225, 225, 130);
      returnText += terminalRGB(`  ah-mee-no-see     'I See It this.now - I AminoSee it!'   ${array[4]}`, 255, 180,  90);
      returnText += terminalRGB(`   ${ this.prettyDate()}   v${version}            ${array[5]}`          , 220, 120,  70);
      returnText += terminalRGB(array[6], 200, 105,   60);
      returnText += terminalRGB(array[7], 200, 32,   32);
      return returnText;
    }
    printRadMessage(array) {
      // output( returnRadMessage(array) );
      if (array == undefined) {
        array = ["    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:", this.outputPath ];
        // array = [ "    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:"," " ];
      }
      while ( array.length < 8 ) {
        array.push("    ________","    ________");
      }
      let radMargin = this.termMarginLeft;
      if ( this.renderLock == false) { radMargin = 3; }
      term.eraseLine();
      output(); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${array[0]}`, 255, 60,  250) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${array[1]}`, 170, 150, 255) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${array[2]}`, 128, 240, 240) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${array[3]}`, 225, 225, 130) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`  ah-mee-no-see     'I See It this.now - I AminoSee it!'   ${array[4]}`, 255, 180,  90) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`   ${ this.prettyDate()}   v${version} ${array[5]}`          , 220, 120,  70) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(array[6], 200, 105,   60) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(array[7], 200, 32,   32) ); term.eraseLine();
      // term.right(radMargin);
      // output(); term.right(radMargin); term.eraseLine();
    }


    fastUpdate() {

      this.present = new Date().getTime();
      this.runningDuration = ( this.present - this.started) + 1; // avoid division by zero
      this.msElapsed  = deresSeconds( this.runningDuration); // ??!! ah i see


      if ( this.charClock == 0 ||  this.baseChars == 0) {
        this.percentComplete = 0.03;//(( this.charClock+1) / ( this.baseChars+1)); // avoid div by zero below a lot
      } else {
        this.percentComplete = this.charClock /  this.baseChars; // avoid div by zero below a lot
      }
      if (this.isStorageBusy == true) { // render just finished so make percent 100% etc
        this.percentComplete = 1;
      }
      if (  this.percentComplete > 1) {
        this.bugtxt(`percentComplete is over 1: ${  this.percentComplete} `)
        this.timeRemain = 1; // close to 0 its ms.
        this.percentComplete = 1;
      } else {
        this.timeRemain = deresSeconds(( this.runningDuration / (  this.percentComplete )) - this.msElapsed ); // everything in ms
      }
    }
    calcUpdate() { // DONT ROUND KEEP PURE NUMBERS
      this.fastUpdate();
      this.bytesRemain = (  this.baseChars - this.charClock);
      this.bytesPerMs = Math.round( ( this.charClock) / this.runningDuration );
      this.codonsPerSec = (  this.genomeSize+1) / ( this.runningDuration*1000);
      wTitle(`${ this.nicePercent()} remain ${humanizeDuration( this.timeRemain)} `);
    }

    getHistoCount(item, index) {
      return [ item.Codon, item.Histocount];
    }
    formatMs(date) { // nice ms output
      return  deresSeconds(date.getTime()) -  this.now.getTime();
    }


    drawProgress() {
      this.fastUpdate();
      this.progato.update(  this.percentComplete ) ;

      if (this.howMany >= 0 ) {
        clearTimeout( this.progTimer)
        this.progTimer = setTimeout(() => {
          if (  this.percentComplete < 0.99 &&  this.timeRemain > 2001) {
            this.drawProgress();
            // electron.updatePercent( this.percentComplete )
          } else {
            this.progato.stop();
          }
        }, 500);
      }
    }



    drawHistogram() {
      if ( this.updatesTimer) { clearTimeout( this.updatesTimer)};
      if ( this.renderLock == false ) { log("render lock failed inside drawHistogram"); this.rawDNA = "!"; return false; }
      if ( this.updateProgress == true) {  this.fastUpdate();   this.progUpdate(  this.percentComplete); }
      if ( !this.updates) { this.bugtxt("updates disabled"); return false; }
      // let tb = new term.TextBuffer( )
      // let textBuffer = "";
      // let abc = this.pepTable.map(getHistoCount).entries();
      this.calcUpdate();
      termSize();
      let text = " ";
      let aacdata = [];

      for (let h=0;h< this.pepTable.length;h++) {       // OPTIMISE i should not be creating a new array each frame!
        aacdata[ this.pepTable[h].Codon] = this.pepTable[h].Histocount ;
      }
      let array = [
        `| Load: ${ this.loadAverages()}  Files to go: ${this.howMany}`,
        `| File:  ${chalk.inverse( fixedWidth(40, this.justNameOfDNA))}.${ this.extension } ${chalk.inverse( this.highlightOrNothin())}`,
        `| @i${ fixedWidth(10, this.charClock.toLocaleString())} Breaks:${ fixedWidth(6, this.breakClock.toLocaleString())} Filesize:${ fixedWidth(7, bytes(  this.baseChars ))}`,
        `| Next update:${ fixedWidth(6,  this.msPerUpdate .toLocaleString())}ms Codon Opacity: ${ twosigbitsTolocale( this.opacity *100)}%`,
        `| CPU:${ fixedWidth(10, bytes( this.bytesPerMs*1000))}/s ${ fixedWidth(5, this.codonsPerSec.toLocaleString())}K acids/s`,
        ` Next file >>> ${maxWidth(24, this.nextFile)}`,
        `| Codons:${ fixedWidth(14, " " +  this.genomeSize.toLocaleString())} Pixels:${ fixedWidth(10, " " + this.pixelClock.toLocaleString())} Last Acid: ${chalk.inverse.rgb(ceiling( this.red ), ceiling( this.green ), ceiling( this.blue )).bgWhite.bold( fixedWidth(16, "  " + this.aminoacid + "   ") ) } Host: ${hostname}`,
        `| Sample: ${ fixedWidth(60, this.rawDNA) } ${ this.showFlags()}`,
        `| RunID: ${chalk.rgb(128, 0, 0).bgWhite( this.timestamp )} acids per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )}`
      ];
      if ( this.clear == true) {
        term.up( this.termStatsHeight);
      } else {
        log('nc')
      }
      this.clearCheck();

      if ( this.dnabg  == true) {
        if ( this.clear == true) {
          term.moveTo(1,1);
        }
        this.rawDNA = this.rawDNA.substring(0, termPixels);
        output(chalk.inverse.grey.bgBlack( this.rawDNA));
        // term.up(rawDNA.length/term.width);
        // if ( this.clear== true) {
        term.moveTo(1 + this.termMarginLeft,1);
        output("     To disable real-time DNA background use any of --no-this.dnabg --no-updates --quiet -q");
        // }
      }
      this.rawDNA = funknzLabel;
      term.moveTo(1 + this.termMarginLeft,1 + this.termMarginTop);
      this.printRadMessage(array);
      // term.right( this.termMarginLeft );
      output(`Done: ${chalk.rgb(128, 255, 128).inverse( this.nicePercent() )} Elapsed: ${ fixedWidth(12, humanizeDuration( this.msElapsed )) } Remain: ${humanizeDuration( this.timeRemain)}  |  Lifetime values this workstation: ${ twosigbitsTolocale( gbprocessed )} GB Job run: ${ cliruns.toLocaleString()} UID: ${ this.timestamp } ${chalk.yellow(hostname)} `);
      output();
      output(`Output path: ${chalk.underline(this.filenamePNG)}`)
      this.progUpdate(  this.percentComplete);
      term.down(1);
      term.right( this.termMarginLeft );
      output();
      if (term.height > this.termStatsHeight + this.termDisplayHeight) {
        output(histogram(aacdata, { bar: '/', width: this.debugColumns*2, sort: true, map: aacdata.Histocount} ));
        output();
        output();
        output(interactiveKeysGuide);
        output();
        // term.up(5);
        output(`Last red: ${ this.peakRed } Last  green : ${ this.peakGreen } Last  blue : ${ this.peakBlue }`)
        // term.up(this.termDisplayHeight - 2)
      } else {
        output();
        output(chalk.italic(`Increase the height of your terminal for realtime histogram. Genome size: ${ this.genomeSize}`));
        output();
      }

      if ( this.renderLock == true && this.howMany >= 0 ) { // dont update if not rendering
        if ( this.msPerUpdate  <  this.maxMsPerUpdate ) {
          this.msPerUpdate  += 200; // this.updates will slow over time on big jobs
          if (this.devmode == true) {
            this.msPerUpdate  += 100; // this.updates will slow over time on big jobs
            if (this.debug == true) {
              this.msPerUpdate  += 100;
            }
          }
        }
        this.updatesTimer = setTimeout(() => {
          if ( this.renderLock == true && this.howMany >= 0 ) { // status == "stream") { // || this.updates) {
            this.drawHistogram(); // MAKE THE HISTOGRAM AGAIN LATER
          }
        },  this.msPerUpdate );
        this.bugtxt("drawing again in " +  this.msPerUpdate )
      } else { output('DNA render done') }
    }
    memToString() {
      let memReturn = `Memory load: [ `;
        // const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        arr.reverse();
        const used = process.memoryUsage();
        for (let key in used) {
          memReturn += `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB `;
        }
        return memReturn + " ] ";
      }
      loadAverages() {
        const l0 = os.loadavg()[0];
        const l1 = os.loadavg()[1];
        const l2 = os.loadavg()[2];
        return twosigbitsTolocale(l0) + " / " + twosigbitsTolocale(l1) + " / " + twosigbitsTolocale(l2);
      }
      highlightOrNothin() { // no highlight, no return!
        return ( this.isHighlightSet ?  this.peptideOrNothing() + this.tripletOrNothing()  : "" )
      }
      peptideOrNothing() {
        return ( this.peptide == "none" ? "" : this.peptide )
      }
      tripletOrNothing() {
        return ( this.triplet == "none" ? "" : this.triplet )
      }
      isTriplet( obj ) {
        const elTripo = obj.DNA;
        const result = cleanChar(elTripo.substring(0,1)) + cleanChar(elTripo.substring(1,2))  +  cleanChar(elTripo.substring(2,3))
        if (result.length == 3) {
          return true;
        } else {
          return false;
        }
      }
      isHighlightTriplet(array) {
        return array.DNA == this.triplet;
      }
      isCurrentPeptide(pep) {
        // return p.Codon == this.peptide || p.Codon == this.triplet;
        return pep.Codon.toLowerCase() == this.peptide.toLowerCase();
      }
      isStartCodon(pep) {
        return pep.Codon == "Methionine";
      }
      isStopCodon(pep) {
        return (pep.Codon == "Amber" || pep.Codon == "Ochre" || pep.Codon == "Opal" );
      }
      isStartTOTAL(pep) {
        return (pep.Codon == "Start Codons" )
      }
      isStopTOTAL(pep) {
        return (pep.Codon == "Stop Codons" )
      }
      isNoncoding(pep) {
        return pep.Codon == "Non-coding NNN"
      }
      isPeptide(pep) {
        return pep.Codon == this.peptide
      }
      throttleOut( ratio, str){
        if (Math.random() < this.ratio) { return str }
        return "";
      }
      // isNormalPep(normalpep) {
      // this.bugtxt(`your normalpep ${normalpep.toUpperCase()}`);
      // return  this.pepTable => this.pepTable.Codon.toUpperCase() === normalpep.toUpperCase();
      // }
      isNormalTriplet(normaltrip) {
        // output(`your normalpep ${normalpep.toUpperCase()}`);
        return dnaTriplets => dnaTriplets.DNA.toUpperCase() === normaltrip.toUpperCase();
      }
      nicePercent() {
        return minWidth(5, (Math.round(  this.percentComplete*1000) / 10) + "%");
      }
      tidyTripletName(str) {
        for ( let i =0; i < dnaTriplets.length; i++) {
          if ( spaceTo_( dnaTriplets[i].DNA.toUpperCase() ) == spaceTo_( str.toUpperCase() ) ) {
            return dnaTriplets[i].DNA
          }
        }
        return "none";

        //
        // let clean = "none";
        // this.currentTriplet = str;
        // this.clean = dnaTriplets.find( this.isNormalTriplet(str)).DNA.toUpperCase();
        // if ( clean == undefined ) {
        //   clean = "none";
        // } else {
        //   // clean = spaceTo_( clean.Codon );
        // }
        // this.bugtxt( fixedWidth(12,`tidy: ${str} dirty:${" " +  this.isDirtyPep(str)} clean: ${clean}`));
        // if (clean) {
        //   return clean;
        // } else {
        //   return "none";
        // }
      }
      tidyPeptideName(str) { // give it "OPAL" it gives "Opal"
      str =                               str.toUpperCase()
      for ( let i =0; i < this.pepTable.length; i++) {
        var compareTo = this.pepTable[i].Codon.toUpperCase()
        // output(`str  ${str}    compareTo: ${compareTo}`)
        if ( compareTo == str ) {
          // output(`str  ${str}    compareTo: ${this.pepTable[i].Codon} <--  GREAT SUCCESS`)

          return this.pepTable[i].Codon
        }
      }
      return "none";
      //
      // this.currentPeptide = str.toUpperCase();
      // let clean = "none";
      // try {
      //   clean = this.pepTable.find(isNormalPep(str)).Codon;
      // } catch(e) {
      //   log("tidyPeptideName " + clean)
      //   if ( clean == undefined ) {
      //     clean = this.pepTable.find( this.isDirtyPep(str));
      //     if ( clean == undefined ) {
      //       clean = "none";
      //     }
      //   }
      // }
      // clean = spaceTo_( clean );
      // if (clean) {
      //   return clean;
      // } else {
      //   return "none";
      // }
    }
    tripletToCodon(str) {
      this.currentTriplet = str;
      return dnaTriplets.find( this.isTriplet).DNA;
    }
    tripletToHue(str) {
      console.warn(str);
      // this.currentTriplet = str;
      // let hue = dnaTriplets.find(  (dna, str) => {dna.DNA == str}).Hue;
      let hue = dnaTriplets.find( this.isTriplet).Hue;
      if (hue !== undefined) {
        return hue
      } else {
        return 120
      }
      return 120
    }
    peptideToHue(str) {
      console.warn(`str ${str}`);
      let r = this.pepTable.find( (pep) => { pep.Codon == str });
      console.warn(r);
      return r.Hue;
    }
    getCodonIndex(str) {
      return this.pepTable.indexOf(str)
    }
    getTripletIndex(str) {
      return dnaTriplets.indexOf( str )
    }
    // *
    // take 3 letters, convert into a Uint8ClampedArray with 4 items
    codonToRGBA(cod) {
      // STOP CODONS are hard coded as   index 24 in this.pepTable array       "Description": "One of Opal, Ochre, or Amber",
      // START CODONS are hard coded as  ndex 23 in this.pepTable array       "Description": "Count of Methionine",
      // Non-coding NNN this.triplets are hard coded as index 0 in this.pepTable array
      // this.dot( this.genomeSize, 10000, cod);
      this.aminoacid = "ERROR";
      this.currentTriplet = cod;
      this.debugFreq = this.throttledFreq(3);

      let theMatch = dnaTriplets.find( this.isTriplet).DNA
      for (let z=0; z < dnaTriplets.length; z++) {
        if (cod == dnaTriplets[z].DNA) { // SUCCESSFUL MATCH (convert to map)
          this.aminoacid = dnaTriplets[z].Codon;
          dnaTriplets[z].Histocount++;
          this.dot( this.genomeSize, this.debugFreq, `z = ${z} theMatch ${theMatch} <==> ${cod} ${this.aminoacid}`); // show each 10,000th (or so) base pair.

          for (let h=0; h< this.pepTable.length; h++) { // update this.pepTable
            if (this.aminoacid == this.pepTable[h].Codon) {
              this.pepTable[h].Histocount++;
              // this.pepTable[h].Histocount++;

              // let cindex =   this.pepTable[h].Description;
              let acidesc = this.pepTable[h].Description;
              // this.bugtxt(`codon index for ${ fixedWidth(20, this.aminoacid)} is ${getCodonIndex(this.aminoacid)} or acidesc = ${acidesc}`)
              // let startStops = -1; // for the start/stop codon histogram
              if (acidesc == "Stop Codons") {
                this.pepTable[24].Histocount++;
                // this.pepTable[getCodonIndex(acidesc)]
              } else if (acidesc == "Start Codons") {
                this.pepTable[23].Histocount++;
                // startStops = this.pepTable.indexOf("Start Codons");
              }
              // if (startStops > -1) { // good ole -1 as an exception flag. oldskool.
              //   log(startStops);
              //   this.pepTable[ startStops ].Histocount++;
              // }
              break
            }
          }
          // this.bugtxt( acidesc);

          let hue = dnaTriplets[z].Hue / 360;
          let tempcolor = hsvToRgb(hue, 1, 1);
          //  this.red ,  this.green ,  this.blue , ALPHA
          this.red    = tempcolor[0];
          this.green  = tempcolor[1];
          this.blue   = tempcolor[2];

          if ( this.isHighlightSet ) {

            if (this.aminoacid == this.peptide ) {
              this.alpha = 255;
              // log(`isHighlightSet    ${isHighlightSet}   this.aminoacid ${this.aminoacid}  this.peptide ${ this.peptide }`)
              // log(alpha);
            } else {
              this.alpha = 128;
              // log(alpha);
            }
          } else {
            this.alpha = 255; // only custom this.peptide pngs are transparent
          }
          return [ this.red ,  this.green ,  this.blue , this.alpha];
        }
      }
      let crash;
      if ( this.aminoacid == "ERROR" ) {
        this.aminoacid = "ERROR " + cod;
        crash = true;
      } else {
        crash = false;

      }
      // return [13,255,13,128]; // this colour means "ERROR".
      return [0,0,0,0]; // this colour means "ERROR".
    }






    //PARSE SOURCE CODE
    // https://www.npmjs.com/package/parse-apache-directory-index

    testParse() {
      output(parse(`
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
        <html>
        <head>
        <title>Index of /foo/bar</title>
        </head>
        <body>
        <h1>Index of /foo/bar</h1>
        <table><tr><th><img src="/icons/blank.gif" alt="[ICO]"></th><th><a href="?C=N;O=D">Name</a></th><th><a href="?C=M;O=A">Last modified</a></th><th><a href="?C=S;O=A">Size</a></th><th><a href="?C=D;O=A">Description</a></th></tr><tr><th colspan="5"><hr></th></tr>
        <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="beep/">beep/</a>           </td><td align="right">25-May-2016 11:53  </td><td align="right">  - </td><td>&nbsp;</td></tr>
        <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="boop20160518/">boop20160518/</a>        </td><td align="right">19-May-2016 17:57  </td><td align="right">  - </td><td>&nbsp;</td></tr>
        <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="jazz20160518/">jazz20160518/</a>         </td><td align="right">19-May-2016 19:04  </td><td align="right">  - </td><td>&nbsp;</td></tr>
        <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="punk20160518/">punk20160518/</a>    </td><td align="right">19-May-2016 17:47  </td><td align="right">  - </td><td>&nbsp;</td></tr>
        <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="space20160518/">space20160518/</a>       </td><td align="right">19-May-2016 19:03  </td><td align="right">  - </td><td>&nbsp;</td></tr>
        <tr><th colspan="5"><hr></th></tr>
        </table>
        </body></html>`));

      }





      // stream.pipe(tr).pipe(process.stdout);
      /** https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js/26038979
      * Look ma, it's cp -R.
      * @param {string} src The path to the thing to copy.
      * @param {string} dest The path to the new copy.
      */
      copyRecursiveSync(src, dest) {
        log(`Will try to recursive copy from ${src} to ${dest}`)
        var exists = doesFileExist(src);
        var stats = exists && fs.statSync(src);
        var isDirectory = exists && stats.isDirectory();
        var existsDest = doesFileExist(dest);
        if (existsDest) {
          log(`Remove the ${dest} folder or file, then I can rebuild the web-server`);
          return false;
        }
        if (exists && isDirectory) {
          var exists = doesFileExist(dest);
          if (exists) {
            log("Remove the /public/ folder and also /index.html, then I can rebuild the web-server");
            return false;
          } else {
            fs.mkdirSync(dest);
          }
          fs.readdirSync(src).forEach(function(childItemName) {
            log(childItemName);
            copyRecursiveSync(path.join(src, childItemName),
            path.join(dest, childItemName));
          });
        } else {
          fs.linkSync(src, dest);
        }
      };


      imageStack(histogramJson) {
        mode('imageStack')
        let html = " ";
        let summary = histogramJson.summary;
        let pepTable = histogramJson.pepTable;
        let name = summary.name;
        let refimage = summary.refimage;
        let linearimage = summary.linearimage;
        let i = 0;
        let quant = pepTable.length;
        html += `<div id="stackOimages">
        <a href="images/${name}" class="imgstack">
        <img src="images/${name}" id="stack_reference" width="256" height="256" style="z-index: ${i}; position: fixed; top: 50%; left: 50%; transform: translate(${(i*4)-40},${(i*4)-40})" alt="${refimage}" title="${refimage}" onmouseover="mover(this)" onmouseout="mout(this)">Reference</a>`;

        histogramJson.pepTable.forEach(function(item) {
          // log(item.toString());
          let thePep = item.Codon;
          let theHue = item.Hue;
          let c =      hsvToRgb( theHue/360, 0.5, 1.0 );
          let z =      item.z;
          let i =      item.index + 1;
          let src =    item.src;
          let vector = i - (quant/2);
          // this.bugtxt( src );
          html +=  i +". ";
          if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
            html += `<!-- ${thePep.Codon} -->`;
          } else {
            html += `
            <a href="images/${src}" class="imgstack">${i}. ${thePep} <br/>
            <img src="images/${src}" id="stack_${i}" width="256" height="256" style="z-index: 99; position: absolute; top: ${i*2}px; left: ${i*32}px;" alt="${thePep}" title="${item.Description}" onmouseover="mover(${i})" onmouseout="mout(${i})"></a>`;
          }
        });
        html += `</div> <!--  id="stackOimages -- >`;
        return html;
      }
      output(txt) { // console out
        output("WRONG " + txt);
      }
    }
    function bugtxt(txt) { // full this.debug output
      if (this !== undefined) {
        if (this.quiet == false && this.debug == true && this.devmode == true && this.verbose == true)  {
          bugout(txt);
        } else {
          if (this.verbose == true ) {
            redoLine(txt);
          }
        }
      } else if (debug){
        output(txt)
      } else if (cliInstance.debug == true) {
        bugout(txt)
      }

    }
    function output(txt) {
      // console.log('refusing');
      // return false;
      if (debug && this !== undefined) {
        bugout(txt)
      } else {
        // bugout(txt)
        console.log(txt);
      }
    }
    function log(txt) {
      if (this !== undefined) {
        if (this.quiet == false && this.devmode == true && this.verbose == true ) {
          output(`devmode log: [${txt}] `);
        } else if (this.quiet == false){
          redoLine(txt);
        }
      } else if (debug == true) {
        console.log(txt)
      } else {
        return false;
      }
      wTitle(txt) // put it on the terminal windowbar or in tmux
    }
    function wTitle(txt) {
      if (this !== undefined) {
        term.windowTitle(`${ this.highlightOrNothin()} ${ this.justNameOfDNA} ${status} ${maxWidth(120,txt)} (${this.howMany} files next: ${ this.nextFile}) AminoSee@${hostname}`);
      } else {
        term.windowTitle(`${status} ${maxWidth(120,txt)} (AminoSee@${hostname}`);
      }
    }
    function bugout(txt) {
      if (txt == undefined) { txt = 'txt not set' }
      // let mem = process.memoryUsage();
      let splitScreen = "";
      if (this !== undefined) {
        let debugColumns = this.debugColumns;
        splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( debugColumns - 10,  `[Jbs: ${this.howMany} Status: ${ this.status} Crrnt: ${maxWidth(12, this.currentFile)} Nxt: ${maxWidth(12, this.nextFile)} ${ this.nicePercent()} ${ this.busy()} ${ this.storage()} Stat: ${this.status} Highlt${( this.isHighlightSet ? this.peptide + " " : " ")} >>>    `));
        splitScreen += fixedWidth( debugColumns,` ${txt} `);
        term.eraseLine();
        process.stdout.write(splitScreen);
        // splitScreen = chalk.gray.inverse( fixedWidth( debugColumns - 10, `Cpp: ${ this.codonsPerPixel }  G: ${ this.genomeSize.toLocaleString()} Est: ${ onesigbitTolocale( this.estimatedPixels/1000000)} megapixels ${bytes(  this.baseChars )} RunID: ${ this.timestamp } H dim: ${hilbPixels[ this.dimension ]}]  ${ formatAMPM( this.now )} and ${ this.formatMs( this.now )}ms`));
      } else {
        let debugColumns = Math.round(term.Width / 3);
        splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( debugColumns - 10,  `[Args: ${args._.length} ${ cliInstance.nicePercent()} ${ cliInstance.busy()} ${ cliInstance.storage()} >>>    `));
          splitScreen += fixedWidth( debugColumns,` ${txt} `);
          term.eraseLine();
          process.stdout.write(splitScreen);
          // splitScreen = chalk.gray.inverse( fixedWidth( debugColumns - 10, ` ${ formatAMPM( Date() )} and ${ this.formatMs( Date().getTime() )}ms`));
        }

        // output(splitScreen);
      }
      function deleteFile(file) {
        try {
          fs.unlinkSync(file, (err) => {
            this.bugtxt("Removing file OK...")
            if (err) { fileBug(err)  }
          });
        } catch (err) {
          // this.bugtxt(err)
        }
      }
      function termSize() {
        tx = term.width;
        ty = term.height
        termPixels = (tx) * (ty-8);
      }
      function destroyKeyboardUI() {
        process.stdin.pause(); // stop eating the this.keyboard!
        // keypress.disableMouse(process.stdout);
        try {
          process.stdin.setRawMode(false); // back to cooked this.mode
        } catch(err) {
          log(`Could not disable raw mode this.keyboard: ${err}`)
        }
        // process.stdin.resume(); // DONT EVEN THINK ABOUT IT.
      }
      function ceiling(number) {
        number = Math.ceil(number) // round into integer
        if (number > 255) {
          number = 255;
        } else if (number < 0 ){
          number = 0;
        }
        return number;
      }
      function onesigbitTolocale(num) {
        return (Math.round(num*10)/10).toLocaleString();
      }
      function twosigbitsTolocale(num){
        return (Math.round(num*100)/100).toLocaleString();
      }
      function threesigbitsTolocale(num){
        return (Math.round(num*1000)/1000).toLocaleString();
      }
      function variable(v, space) {
        while (v.length < space) {
          v = " " + v;
        }
        if (v.length > space) {
          v = v.substring(1,-1);
        }
        return
      }
      function fixedRightSide(wide, str) {
        return maxWidth(wide, minWidth(wide, str));
      }
      function fixedWidth(wide, str) { // return strings all the same length
        return minWidthRight(wide, maxWidth(wide, str));
      }
      function maxWidth(wide, str) { // shorten it if you need to
        if (str) {
          if (str.length > wide) { str = str.substring(0,wide) }
          return str;
        } else {
          return logo()
        }
      }
      function minWidth(wide, str) { // make it wider
        while(str.length < wide) { str = " " + str }
        return str;
      }
      function minWidthRight(wide, str) { // make it wider
        while(str.length < wide) { str += " " }
        return str;
      }
      function blueWhite(txt) {
        output(chalk.bgBlue.white.bold(txt));
      }
      function spaceTo_(str) {
        // log(str);
        if (str == undefined) {
          return "";
        } else {
          str += "";
          while(str.indexOf(' ') > -1) { str = str.replace(' ', '_') }
          return str;
        }
      }
      function hilDecode(i, dimension) {
        // this.bugtxt(`i, this.dimension  ${i} ${ this.dimension }`)
        let x, y;
        [x, y] = MyManHilbert.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
        // ROTATE IMAGE CLOCKWISE 90 DEGREES IF this.dimension IS EVEN NUMBER FRAMES
        if ( dimension % 2 == 0 ) { // if even number
          let newY = x;
          x = y
          y = newY;
        }
        return [ x, y ];
      }

      function runDemo() {
        async.series( [
          function( cb ) {
            // addJob('test')
          },
          function( cb ) {
            this.openImage = true;
            this.peptide = 'Opal'; // Blue TESTS
            this.ratio = 'sqr';
            this.generateTestPatterns(cb);
            this.openOutputs();

          },
          function( cb ) {
            // this.openImage = true;
            this.peptide = 'Ochre'; // Red TESTS
            this.ratio = 'sqr';
            this.generateTestPatterns(cb);
          },
          function( cb ) {
            // this.openImage = true;
            this.peptide = 'Arginine'; //  PURPLE TESTS
            this.ratio = 'sqr';
            this.generateTestPatterns(cb);
          },
          function( cb ) {
            // this.openImage = true;
            this.peptide = 'Methionine'; //  this.green  TESTS
            this.ratio = 'sqr';
            this.generateTestPatterns(cb);
          },

          function ( cb ) {
            this.openOutputs();
            if ( cb !== undefined ) { cb() }
          },
          // function ( cb ) {
          //   this.args._[0] = this.currentFile;
          //   this.currentFile = '*';
          //   this.args._.push( this.currentFile); // DEMO
          //   this.pollForStream();
          // },
          function( cb ) {
            launchNonBlockingServer();
            // copyGUI(cb);
            // symlinkGUI(cb);
          }
        ] )
        .exec( function( error, results ) {
          if (  this.error ) { log( 'Doh!' ) ; }
          else { log( 'WEEEEE DONE Yay! Done!' ) ; }
        } ) ;

      }
      function setupPrefs() {

        projectprefs = new Preferences('nz.funk.aminosee.project',{}, {
          encrypt: false,
          file: path.join(os.homedir(), obviousFoldername +  '/aminosee.conf'),
          format: 'yaml'
        });

        // userprefs = new Preferences('nz.funk.aminosee.user',{}, {
        //   encrypt: false,
        //   file: path.join(os.homedir(), obviousFoldername +  '/aminosee.conf'),
        //   format: 'yaml'
        // });     ~/.config/preferences/com.foo.bar.pref

        userprefs = new Preferences('nz.funk.aminosee.user', {
          aminosee: {
            cliruns: 0,
            guiruns: 0,
            gbprocessed: 0
          }
        }, {
          encrypt: false,
          file: path.resolve( os.homedir(), '.config/preferences/nz.funk.aminosee.conf'),
          format: 'yaml'
        });
        // Preferences can be accessed directly
        userprefs.aminosee.cliruns++; // increment run counter. for a future high score table stat and things maybe.
        cliruns = userprefs.aminosee.cliruns;
        gbprocessed  = userprefs.aminosee.gbprocessed;
      }
      function logo() {
        return `${chalk.rgb(255, 255, 255).inverse("Amino")}${chalk.rgb(196,196,196).inverse("See")}${chalk.rgb(128,128,128).inverse("No")}${chalk.grey.inverse("Evil")}       v${chalk.rgb(255,255,0).inverse(version)}`;
        // process.stdout.write(`v${chalk.rgb(255,255,0).bgBlue(version)}`);
      }
      function removeLineBreaks(txt) {
        return txt.replace(/(\r\n\t|\n|\r\t)/gm,"");
      }
      // remove anything that isn't ATCG, convert U to T
      function cleanChar(c) {
        let char = c.toUpperCase();
        if (char == "A" || char == "C" || char == "G" || char == "T" || char == "U") {
          if (char == "U") {
            return "T"; // convert RNA into DNA
          } else {
            return char; // add it to the clean string
          }
        } else {
          return "."; // remove line breaks etc. also helps  this.error detect codons.
        }
      }

      /**
      * Converts an RGB color value to HSL. Conversion formula
      * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
      * Assumes r, g, and b are contained in the set [0, 255] and
      * returns h, s, and l in the set [0, 1].
      *
      * @param   Number  r       The Red color value
      * @param   Number  g       The  this.green  color value
      * @param   Number  b       The  this.blue  color value
      * @return  Array           The HSL representation
      */
      function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var hue, s, l = (max + min) / 2;

        if (max == min) {
          hue = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

          switch (max) {
            case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
            case g: hue = (b - r) / d + 2; break;
            case b: hue = (r - g) / d + 4; break;
          }

          hue /= 6;
        }

        return [ hue, s, l ];
      }

      /**
      * Converts an HSL color value to RGB. Conversion formula
      * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
      * Assumes h, s, and l are contained in the set [0, 1] and
      * returns r, g, and b in the set [0, 255].
      *
      * @param   Number  h       The hue
      * @param   Number  s       The saturation
      * @param   Number  l       The lightness
      * @return  Array           The RGB representation
      */
      function hslToRgb(hue, s, l) {
        var r, g, b;

        if (s == 0) {
          r = g = b = l; // achromatic
        } else {
          function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;

          r = hue2rgb(p, q, hue + 1/3);
          g = hue2rgb(p, q, hue);
          b = hue2rgb(p, q, hue - 1/3);
        }

        return [ r * 255, g * 255, b * 255 ];
      }

      /**
      * Converts an RGB color value to HSV. Conversion formula
      * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
      * Assumes r, g, and b are contained in the set [0, 255] and
      * returns h, s, and v in the set [0, 1].
      *
      * @param   Number  r       The Red color value
      * @param   Number  g       The  this.green  color value
      * @param   Number  b       The  this.blue  color value
      * @return  Array           The HSV representation
      */
      function rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
          h = 0; // achromatic
        } else {
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }

          h /= 6;
        }

        return [ h, s, v ];
      }

      /**
      * Converts an HSV color value to RGB. Conversion formula
      * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
      * Assumes h, s, and v are contained in the set [0, 1] and
      * returns r, g, and b in the set [0, 255].
      *
      * @param   Number  h       The hue
      * @param   Number  s       The saturation
      * @param   Number  v       The value
      * @return  Array           The RGB representation
      */
      function hsvToRgb(h, s, v) {
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
        }

        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
      }

      // source: https://github.com/oliver-moran/jimp/blob/master/packages/core/src/index.js#L117
      // function isRawRGBAData(obj) {
      //   return (
      //     obj &&
      //     typeof obj === 'object' &&
      //     typeof obj.width === 'number' &&
      //     typeof obj.height === 'number' &&
      //     (Buffer.isBuffer(obj.data) ||
      //     obj.data instanceof Uint8Array ||
      //     (typeof Uint8ClampedArray === 'function' &&
      //     obj.data instanceof Uint8ClampedArray)) &&
      //     (obj.data.length === obj.width * obj.height * 4 ||
      //       obj.data.length === obj.width * obj.height * 3)
      //     );
      //   }
      function replaceoutputPathFileName(f) {
        if (f == undefined) { f = "was_not_set";  console.warn(f); }
        return f.replace(/^.*[\\\/]/, '');
      }


      function addJob(commandArray) {
        setupPrefs();

        log(chalk.inverse(`ADD JOB CALLED: `) + commandArray.toString() + ` isElectron: [${isElectron}]`)

        cliInstance = new AminoSeeNoEvil();
        cliInstance.setupApp( process.argv ); // do stuff that is needed even just to run "aminosee" with no options.

        // let thread = new AminoSeeNoEvil();//.setupApp(commandArray);
        // thread.setupApp(commandArray);
        // cliInstance = thread;
        return cliInstance;
      }

      function launchNonBlockingServer(path, cb, that) {

        output(`threads: ${threads}`)
        // that.buildServer();  // copyGUI();  // startHttpServer()
        buildServer();  // copyGUI();  // startHttpServer()
        log("Personal mini-Webserver starting up around this.now (hopefully) on port ${port}.");
        // server.startCrossSpawnHttp(); // requires http-server be installed globally
        server.startCrossSpawnHttp(); // requires http-server be installed globally
        // selfSpawn();
        showCountdown();
        return true;


        // server.start(this.outputPath);
        //
        return true;

        let handler = server.start(this.outputPath);//
        serverURL =  server.getServerURL(path);
        this.printRadMessage([
          `Interactive keyboard mode ENABLED`,
          `use keyboard to control AminoSee`,
          `local webserver is running from:`,
          chalk.underline(this.outputPath),
          `${serverURL} <-- only your LAN  http://localhost:${port} <-- only your machine`,
          'use Control-C to stop'
        ]);
        if (path == undefined) { path = "/" }
        that.setupKeyboardUI();
        // cliInstance.setupKeyboardUI();
        // copyGUI();
        // symlinkGUI();
        if ( this.openHtml == true) {
          openMiniWebsite(path);
        }
        // if ( cb !== undefined ) { cb() }
      }

      function buildServer() {
        // this.openHtml = true;
        webserverEnabled = true;
        // that.setupKeyboardUI();

        let sFiles = [
          { "source": appPath + '/public',            "dest": cliInstance.outputPath + '/public' },
          { "source": appPath + '/public/home.html', "dest": cliInstance.outputPath + '/home.html' },
          { "source": appPath + '/public/favicon.ico',"dest": cliInstance.outputPath + '/favicon.ico' },
        ];
        sFiles.forEach(function(element) {
          log('buildling ' + element.toString());
          createSymlink(path.normalize(path.resolve(element.source)), path.normalize(path.resolve(element.dest)));
        });
      }
      function createSymlink(src, dest) { // source is the original, dest is the symlink
        log(src, " --> " , dest);
        try { // the idea is to copy the GUI into the output folder to.... well enable it to render cos its a web app!
          let existing = doesFileExist(dest);
          if (existing == true) {
            log(`symlink already appears to be in place at: ${dest}`);
            return false;
          } else {
            // fs.symlink(src, dest, function (err, this.result) {
            //   if (err) { console.warn(`Just a slight issue creating a symlink: ${err}`)}
            //   if (result) { log(`Great Symlink Success ${result}`)}
            // });
            fs.symlinkSync(src, dest, function (err, result) {
              if (err) { console.warn(`Just a slight issue creating a symlink: ${err}`)}
              if (result) { log(`Great Symlink Success ${result}`)}
            });
          }
        } catch(e) {
          log("Symlink ${} could not created. Probably not an  this.error. " + maxWidth(12, "*" + e));
        }
      }
      function doesFileExist(f) {
        let result = false;
        if (f == undefined) { return false; } // adds stability to this rickety program!
        f = path.resolve(f);
        // this.bugtxt(`doesFileExist ${f}`)
        try {
          result = fs.existsSync(f);
          if (result == true ) {
            bugtxt( fixedWidth( term.width/2, result + " FILE EXISTS: " + f ))
            return true; //file exists
          } else {
            result = false;
          }
        } catch(err) {
          bugtxt("Shell be right mate: " + err)
          result = false;
        }
        bugtxt( fixedWidth( term.width/2, result + " NOT EXISTS: " + f ))
        return result;
      }
      function doesFolderExist(f) {
        if (doesFileExist(f)) {
          return fs.lstatSync(f).isDirectory; // Query the entry
        } else {
          return false;
        }
      }
      function terminalRGB(_text, _r, _g, _b) {
        return chalk.rgb(_r,_g,_b)(_text);

        if (_r+_g+_b >= 256.0) {
          _text += "\x1b[44m"; // add some black background if its a light colour
        }
        return "\x1b[38;2;" + _r + ";" + _g + ";" + _b + "m" + _text + "\x1b[0m";
      };
      function showCountdown() {
        countdown(`Built-in webserver: ${server.getServerURL()}   [ stop server with Control-C | run in background with [S] | will shutdown in ${humanizeDuration(max32bitInteger)}`, 3000);
      }
      function countdown(text, timeMs, cb) {
        redoLine(text + humanizeDuration ( deresSeconds(timeMs) ) );
        if ( timeMs > 0 ) {
          setTimeout(() => {
            countdown(text, timeMs, cb);
          },  timeMs - 500 )
        } else {
          // redoLine(' ');
          if ( cb !== undefined ) { cb() }
        }
      }
      function mode(txt) { // good for this.debugging
        status = txt;
        wTitle(txt);
        if (debug) {
          output(txt);
        } else {
          redoLine(txt);
        }
      }

      function redoLine(txt) {
        term.eraseLine();
        output(maxWidth( term.width - 2, txt));
        if (debug) {
          output(maxWidth( term.width - 2, txt));
        }
        term.up( 1 ) ;
      }
      function deresSeconds(ms){
        return Math.round(ms/1000) * 1000;
      }
      function pushCli(commandString) { // "push command line interface"
      output(`Starting AminoSee now with CLI:`);
      output(`[ ${commandString} ]`);
      commandString = `node aminosee ${commandString} --html --image`;
      let commandArray = commandString.split("\\s+");
      let thread = aminosee();
      thread = aminosee.addJob( commandArray );
      threads.push( thread );
    }

    function streamingZip(f) {
      zipfile = path.resolve(f);
      fs.createReadStream(zipfile)
      .pipe(unzipper.Parse())
      .pipe(stream.Transform({
        objectMode: true,
        transform: function(entry,e,cb) {
          var zipPath = entry.path;
          var type = entry.type; // 'Directory' or 'File'
          var size = entry.size;
          var cb = function (byte) {
            output(byte);
          }
          if (zipPath === "this IS the file I'm looking for") {
            entry.pipe(fs.createWriteStream('dna'))
            .on('finish',cb);
          } else {
            entry.autodrain();
            if ( cb !== undefined ) { cb( ) }
          }
        }
      }));
    }
    function unknownOption(unknown) {
      output( chalk.inverse('Unknown option: ') +  unknown);
      output( chalk.inverse('Unknown option: ') +  unknown);
      output( chalk.inverse('Unknown option: ') +  unknown);
      output( chalk.inverse('Unknown option: ') +  unknown);
    }
    function   formatAMPM(date) { // nice time output
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var secs   = date.getSeconds();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      secs = secs < 10 ? '0'+secs : secs;
      var strTime = hours + ':' + minutes + ":" + secs + ' ' + ampm;
      return strTime;
    }

    // function addJob(commandArray) {
    //   log(chalk.inverse(`ADD JOB CALLED: `) + commandArray.toString() + ` isElectron: [${isElectron}]`)
    //   this.setupApp(commandArray);
    // }

    var that = this;
    process.on("SIGTERM", () => {
      cliInstance.removeLocks();
      // this.gracefulQuit();
      // this.destroyProgress();
      process.exitCode = 130;
      cliInstance.quit(130);
      process.exit(); // this.now the "exit" event will fire
    });
    process.on("SIGINT", function() {
      cliInstance.removeLocks();
      // this.gracefulQuit();
      // this.destroyProgress();
      process.exitCode = 130;
      cliInstance.quit(130);
      process.exit(); // this.now the "exit" event will fire
    });
    // module.exports = {
    //     aminosee,
    //     this.gracefulQuit,
    //     log
    // }
    // module.exports.gracefulQuit = gracefulQuit;
    // module.exports.gracefulQuit = (code) => { this.gracefulQuit(code) }
    // module.exports.log = (txt) => { log(txt) }
    module.exports.log = log;
    // }
    module.exports.output = output;
    // module.exports.output = (txt) => { output(txt) }
    // module.exports.doesFileExist = (file) => { doesFileExist(file) }
    // module.exports.this.outputPath = () => { this.outputPath }
    //
    //
    module.exports.doesFileExist = doesFileExist;
    // module.exports.blurb = this.blurb;
    // module.exports.fileWrite = this.fileWrite;
    // module.exports.version = this.version;
    // module.exports.this.outputPath = this.outputPath;
    // module.exports.aminosee = aminosee;
    module.exports.AminoSeeNoEvil = AminoSeeNoEvil;
    module.exports.addJob = addJob;
    module.exports.pushCli = pushCli;
    module.exports.terminalRGB = terminalRGB;
    module.exports.showCountdown = showCountdown;
