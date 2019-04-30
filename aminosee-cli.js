
// "use strict";
//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.nz
//        ah-mee no-see       "I See It Now - I AminoSee it!"
process.title = "aminosee.funk.nz";
const extensions = [ "txt", "fa", "mfa", "gbk", "dna", "fasta", "fna", "fsa", "mpfa", "gb"];
const refimage = "Reference image - all amino acids blended together"
const lockFileMessage = "aminosee.funk.nz DNA Viewer by Tom Atkinson. This is a temp lock file, to enable parallel cluster rendering, usually it means an AminoSee was quit before finishing. Safe to erase. Normally deleting when render is complete.";
const targetPixels = 8000000; // for big genomes use setting flag -c 1 to achieve highest resolution and bypass this taret max render size
const raceDelay = 66;
const defaultC = 1; // back when it could not handle 3+GB files.
const artisticHighlightLength = 18; // px only use in artistic mode. must be 6 or 12 currently
const maxMagnitude = 7; // max for auto setting
const theActualMaxMagnitude = 12; // max for auto setting
let raceTimer = false;
let dimension; // var that the hilbert projection is be downsampled to
let darkenFactor = 0.25; // if user has chosen to highlight an amino acid others are darkened
let highlightFactor = 4.0; // highten brightening.
let spewThresh = 10000; // spew mode creates matrix style terminal filling each thresh cycles
let devmode = false; // kills the auto opening of reports etc
let verbose = false; // not recommended. will slow down due to console.
let force = false; // force overwrite existing PNG and HTML reports
let artistic = false; // for Charlie
let spew = false; // firehose your screen with DNA
let report = true; // html reports
let test = false;
const overSampleFactor = 2.0;
let updates = false;
const maxMsPerUpdate = 12000; // milliseconds per update
let msPerUpdate = 200; // min milliseconds per update
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ]; // 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
const widthMax = 960;
const timestamp = Math.round(+new Date()/1000);
let MyManHilbert = require('hilbert-2d');
// let StdInPipe = require('./stdinpipe');
// let pipeInstance = new StdInPipe();
let es = require('event-stream');
const minimist = require('minimist')
const highland = require('highland')
const fetch = require("node-fetch");
const path = require('path');
const keypress = require('keypress');
const opn = require('opn'); //path-to-executable/xdg-open
const parse = require('parse-apache-directory-index');
const fs = require("fs");
const request = require('request');
const histogram = require('ascii-histogram');
const bytes = require('bytes');
const Jimp = require('jimp');
const PNG = require('pngjs').PNG;
let ProgressBar = require('progress');
const chalk = require('chalk');
const clog = console.log;
const os = require("os");
const hostname = os.hostname();
const util = require('util');
const appPath = require.main.filename;
const defaultFilename = "AminoSeeTestPatterns"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
let highlightTriplets = [];
let isHighlightSet = false;
let isHilbertPossible = true; // set false if -c flags used.
let isDiskFinLinear = false; // flag shows if saving png is complete
let isDiskFinHilbert = false; // flag shows if saving hilbert png is complete
let isDiskFinHTML = false; // flag shows if saving html is complete
let filename = defaultFilename;
let rawDNA ="@"; // debug
let status = "load";
console.log(`${chalk.rgb(255, 255, 255).inverse("Amino")}${chalk.rgb(196,196,196).inverse("See")}${chalk.rgb(128,128,128).inverse(
  "No")}${chalk.rgb(64, 64, 64).inverse("Evil")}`);
let interactiveKeysGuide = "";
let renderLock = false;
let hilbertImage, keyboard, filenameTouch, maxpix, estimatedPixels, args, filenamePNG, extension, reader, hilbertPoints, herbs, levels, progress, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, textFile, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, fileUploadShowing, testColors, chunksMax, chunksize, chunksizeBytes, cpu, subdivisions, contextBitmap, aminoacid, colClock, start, updateClock, bytesPerSec, pixelStacking, isHighlightCodon, justNameOfDNA, justNameOfPNG, justNameOfHILBERT, sliceDNA, filenameHTML, howMany, timeElapsed, runningDuration, kbRemain, width, triplet, updatesTimer, pngImageFlags, codonsPerPixel, codonsPerPixelHILBERT, CRASH, red, green, blue, alpha, errorClock, breakClock, streamLineNr, filesDone, spewClock, opacity, codonRGBA, geneRGBA, currentTriplet, currentPeptide,  progato, shrinkFactor, reg, image, loopCounter, clear, percentComplete, charClock, baseChars, bigIntFileSize;
BigInt.prototype.toJSON = function() { return this.toString(); }; // shim for big int
BigInt.prototype.toBSON = function() { return this.toString(); }; // Add a `toBSON()` function to enable MongoDB to store BigInts as strings

percentComplete = charClock = baseChars = genomeSize = 0;

// const public = path.join(__dirname, './public'); // include the webserver files in exe
// const xdg = path.join(__dirname, './xdg-open'); // include the webserver files in exe
// const pos = path.join(__dirname, './pos.node'); // cursor position
// const { Transform } = require('stream');

// class AminoSeeFloatToPNG extends Transform {
// const options = {[
//   highWaterMark: 4096,
//   objectMode: true,
//   transform: _transform,
//   destroy: _final,
// ]}
//   constructor(options) {
//     super(options);
//
//   }
//    _transform(chunk, encoding, callback) {
//       this.push(chunk);
//       log(`_transform chunk: ${chunk}`);
//       callback();
//
//   // Custom Transform implementations may implement the transform._flush() method. This will be called when there is no more written data to be consumed, but before the 'end' event is emitted signaling the end of the Readable stream.
//      _flush(callback) {
//       log(` function _flush `)
//     }
//      _final() {
//       log(`    function _final `);
//     }
//
// }


// var keypress = require('keypress');
function setupKeyboardUI() {
  interactiveKeysGuide += `
  Interactive control:    D            (devmode)  Q   (graceful quit next save)
  V       (verbose mode)  S (spew DNA to screen)  Control-C      (instant quit)
  F      (overwrite png)  W (toggle scr clear)    U       (stats update on/off)`;

  // make `process.stdin` begin emitting "keypress" events
  keypress(process.stdin);
  //
  // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    log('got "keypress"', key);

    if (key && key.ctrl && key.name == 'c') {
      process.stdin.pause();
      status = "TERMINATED WITH CONTROL-C";
      console.log(status);
      printRadMessage([`highlight: ${isHighlightSet}`, `peptide: ${peptide} triplet: ${triplet}`, chalk.underline(filename), "In", raceDelay, `done: ${nicePercent()}`]);

      updates = false;
      args = [];
      if (devmode) {
        output("Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rendered but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry.")
      } else {
        removeLocks();
      }
      quit(1);
      process.exit()
    }
    if (key && key.name == 'q') {
      status = "GRACEFUL QUIT";
      output(status);
      args = [];
      howMany = 0;
      calcUpdate();
      whack_a_progress_on();
    }
    if (key && key.name == 's') {
      toggleSpew();
    }
    if (key && key.name == 'f') {
      toggleForce();
    }
    if (key && key.name == 'd') {
      toggleDevmode();
    }
    if (key && key.name == 'v') {
      toggleVerbose();
    }
    if (key && key.name == 'w') {
      toggleClearScreen();
    }
    // if (key && key.name == 't') {
    //   linearpixbert();
    // }
    if (key && key.name == 'Space' || key.name == 'Enter') {
      msPerUpdate = 200;
    }
    if (key && key.name == 'u') {
      msPerUpdate = 200;
      if (updates) {
        updates = false;
        clearTimeout(updatesTimer);
      } else {
        updates = true;
        drawHistogram();
      }
    }


    function toggleVerbose() {
      verbose = !verbose;
      output(`verbose mode ${verbose}`);
    }
    function toggleSpew() {
      spew = !spew;
      output(`spew mode ${spew}`);
    }
    function toggleDevmode() {
      devmode = !devmode;
      output(`devmode ${devmode}`);
    }
    function toggleForce() {
      force = !force;
      output(`force overwrite ${force}`);
    }
    function showHelp() {
      output("Hello! Thanks for checking this. I've not made a help file yet.");
      output("Author:         tom@funk.co.nz or +64212576422");
      output("calls only between 2pm and 8pm NZT (GMT+11hrs)");
      output("Donations can be sent to my bitcoin address with thanks:");
      output("15S43axXZ8hqqaV8XpFxayZQa8bNhL5VVa");
      output("https://www.funk.co.nz/blog/online-marketing/pay-tom-atkinson");
    }
    function toggleClearScreen() {
      clear = !clear;
      output("clear screen toggled.");
    }
    function toggleUpdates() {
      updates = !updates;
      output(`stats updates toggled to: ${updates}`);
    }
  });

  try {
    process.stdin.setRawMode(true);

  } catch(err) {
    output(`Could not use interactive keyboard due to: ${err}`)
  }
  process.stdin.resume();
}




module.exports = () => {
  status = "exports";
  args = minimist(process.argv.slice(2), {
    boolean: [ 'artistic' ],
    boolean: [ 'devmode' ],
    boolean: [ 'clear' ],
    boolean: [ 'html' ],
    boolean: [ 'updates' ],
    boolean: [ 'force' ],
    boolean: [ 'spew' ],
    boolean: [ 'test' ],
    boolean: [ 'verbose' ],
    boolean: [ 'reg' ],
    boolean: [ 'image' ],
    string: [ 'codons'],
    string: [ 'magnitude'],
    string: [ 'triplet'],
    string: [ 'peptide'],
    string: [ 'ratio'],
    string: [ 'width'],
    alias: { a: 'artistic', c: 'codons', d: 'devmode', f: 'force', m: 'magnitude', p: 'peptide', i: 'image', t: 'triplet', r: 'ratio', s: 'spew', w: 'width', v: 'verbose' },
    default: { updates: true, clear: true },
    '--': true
  });
  //
  // console.log(`stdin pipe: ${pipeInstance.checkIsPipeActive()}`);
  // const stdin = pipeInstance.stdinLineByLine();
  // stdin.on('line', console.log);

  if (args.keyboard || args.k) {
    keyboard = true;
  } else {
    if (args.keyboard == false) {
      keyboard = false;
    }
  }
  if (keyboard) {
    output(`interactive keyboard mode enabled`)
    setupKeyboardUI()
  } else {
    log(`interactive keyboard mode disabled`)
  }


  if (args.image || args.i || args.png) {
    openImage = true;
    output(`will automatically open image`)
  } else {
    log(`no auto open`);
    openImage = false;
  }
  if (args.reg || args.r) {
    reg = true;
    output(`using regmarks`)
  } else {
    if (args.test) {
      reg = true;
      output(`using regmarks for calibration`)
    } else {
      reg = false;
      log(`not using regmarks for calibration`)
    }
    log(`no regmarks`)
    reg = false;
  }
  if (args.codons || args.c) {
    userCPP = Math.round(args.codons || args.c); // javascript is amazing
    output(`shrink the image by blending ${userCPP} codons per pixel.`);
    codonsPerPixel = userCPP;
  } else {
    codonsPerPixel = defaultC;
    userCPP = -1;
  }
  maxpix = targetPixels;
  if (args.magnitude || args.m) {
    magnitude = Math.round(args.magnitude || args.m);
    if (isHilbertPossible) {
      if (magnitude < 1 ) {
        magnitude = 1;
        maxpix = 4096 * 16; // sixteen times oversampled in reference to the linear image.
        output("Magnitude must be an integer number between 3 and 9. Using -m 3 for 4096 pixel curve.");
      } else if ( magnitude > theActualMaxMagnitude) {
        magnitude = theActualMaxMagnitude;
        maxpix = 64000000;
        output("Magnitude must be an integer number between 3 and 9.");
      } else if (magnitude > 7 && magnitude < 9) {
        maxpix = 16000000;
        output(`Magnitude 8 requires 700 mb ram and takes a while. It's 2048x2048.`);
      } else if (magnitude > 8) {
        maxpix = 32000000;
        output(`This setting will give your machine quite the hernia. It's in the name of science but.`);
        output(`On my machine, magnitude 8 requires 1.8 GB of ram and 9+ crashes nodes heap and 10+ crashes the max call stack, so perhaps this will run OK in the 2020 AD`);
      }
    }
  } else {
    magnitude = false;
  }

  log(`maxpix: ${maxpix} magnitude: ${magnitude}`);

  if (args.ratio || args.r) {
    ratio = args.ratio || args.r;
    if (ratio && ratio != true ) { // this is for: aminosee --test -r
      ratio = ratio.toLowerCase();
    }
    if (ratio == "fixed" || ratio == "fix") {
      ratio = "fix";
    } else if (ratio == "square" || ratio == "sqr") {
      ratio = "sqr";
    } else if ( ratio == "hilbert" || ratio == "hilb" || ratio == "hil" ) {
      ratio = "hil";
    } else {
      ratio = "sqr";
    }
    pngImageFlags += ratio;
  } else {
    log(`No custom ratio chosen. (default)`);
    ratio = "fix";
  }
  log("using ${ratio} aspect ratio");
  peptide = triplet = currentTriplet = currentPeptide = "none";

  if (args.triplet || args.t) {
    users = args.triplet || args.t;
    triplet = tidyTripletName(users);
    currentTriplet = triplet;
    if (isNormalTriplet(triplet)) { //uses global currentTriplet
      output(`Found triplet ${triplet} with colour ${tripletToHue(triplet)}°`);
      isHighlightSet = true;
    } else {
      output(`Error could not lookup triplet: ${triplet}`);
      triplet = "none";
    }
    output(`Custom triplet ${triplet} set. Will highlight these codons = they are`);
  } else {
    log(`No custom triplet chosen. (default)`);
    triplet = "none";
  }
  if (args.peptide || args.p) {
    users = args.peptide || args.p;
    peptide = tidyPeptideName(users);
    output(` users peptide: ${users}  peptide: ${peptide}`);
    if (peptide != "none") { // this colour is a flag for error
      output(`Custom peptide ${peptide} set. Will highlight these codons. users: ${users}`);
      isHighlightSet = true;
    } else {
      output(`ERROR could not lookup peptide: ${users} using ${peptide}`);
      // isHighlightSet = false;
    }
  } else {
    log(`No custom peptide chosen. (default)`);
    peptide = "none";
    // triplet = "none";
  }
  if ( peptide == "none" && triplet == "none") {
    // DISABLE HIGHLIGHTS
    darkenFactor = 1.0;
    highlightFactor = 1.0; // set to zero to i notice any bugs
    isHighlightSet = false;
  } else {
    output(`peptide  ${peptide}   triplet  ${triplet}`);
    isHighlightSet = true;
    report = false; // disable html report
  }

  if (args.artistic || args.art || args.a) {
    output(`artistic enabled. Start (Methione = Green) and Stop codons (Amber, Ochre, Opal) interupt the pixel timing creating columns. protein coding codons are diluted they are made ${twosigbitsTolocale(opacity*100)}% translucent and ${twosigbitsTolocale(codonsPerPixel)} of them are blended together to make one colour that is then faded across ${artisticHighlightLength} pixels horizontally. The start/stop codons get a whole pixel to themselves, and are faded across ${highlightFactor} pixels horizontally.`);
    artistic = true;
    isHilbertPossible = false;
    pngImageFlags += "_art";
    if  (args.ratio || args.r)  {
      output("artistic mode is best used with fixed width ratio, but lets see")
    } else {
      ratio = "fix"
    }
  } else {
    log("1:1 science mode enabled.");
    artistic = false;
  }
  if (args.verbose || args.v) {
    output("verbose enabled.");
    verbose = true;
  }
  if (args.html) {
    output("will open html")
    openHtml = true;
  } else {
    log("not opening html");
    openHtml = false;
  }
  if (args.spew || args.s) {
    output("spew mode enabled.");
    spew = true;
  } else {
    spew = false;
  }
  if (args.devmode || args.debug || args.d) {
    output("devmode enabled.");
    devmode = true;
  } else {
    devmode = false;
  }
  if (args.force || args.f) {
    output("force overwrite enabled.");
    force = true;
  }
  if (args.help || args.h) {
    output(siteDescription);
    output("Author:         tom@funk.co.nz or +64212576422");
    output("calls only between 2pm and 8pm NZT (GMT+11hrs)");
  }

  if (args.clear || args.c) {
    log("screen clearing enabled.");
    clear = true;
  } else {
    log("clear screen disabled.");
    clear = false;
  }
  if (args.updates || args.u) {
    log("statistics updates enabled");
    updates = true;
  } else {
    log("statistics updates disabled");
    updates = false;
  }


  // log(args);
  let cmd = args._[0];
  log(args._);
  howMany = args._.length ;

  if (args.test) {
    test = true;
    output("output test patterns");
    updates = true;
    pngImageFlags = "_test_pattern";
    setTimeout(() => {
      generateTestPatterns();
    }, raceDelay);
  } else {
    test = false;
  }

  switch (cmd) {
    case 'unknown':
    output(` [unknown argument] ${cmd}`);
    break;


    case 'demo':
    launchNonBlockingServer();
    break;

    case 'serve':
    launchNonBlockingServer();
    break;

    case 'help':
    helpCmd(args);
    break;

    case 'list':
    listDNA();
    break

    default:
    if (cmd == undefined) {
      welcomeMessage();

      status = "no command";
      filename = "no file";
      output("Try running aminosee * in a directory with DNA.");//" Closing in 2 seconds.")
      // setTimeout(() => {
      //   quit(1);
      // }, 2000);
      return true;
    } else {
      out(".");
      pollForStream();
      return true;
    }
    status = "leaving switch";
    out(".");
    log(status)
  }
  status = "global";
  out(".");
}
function streamingZip(f) {
  zipfile = path.resolve(f);

  fs.createReadStream(zipfile)
  .pipe(unzipper.Parse())
  .pipe(stream.Transform({
    objectMode: true,
    transform: function(entry,e,cb) {
      var filePath = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      var size = entry.size;
      var cb = function (byte) {
        console.log(byte);
      }
      if (filePath === "this IS the file I'm looking for") {
        entry.pipe(fs.createWriteStream('dna'))
        .on('finish',cb);
      } else {
        entry.autodrain();
        cb();
      }
    }

  }));

}

function listDNA() {
  // var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  // var xhr = new XMLHttpRequest('https://www.funk.co.nz/aminosee/output/');
  // let txt = xhr.responseText;

  // testParse();
  // parse("https://www.funk.co.nz/aminosee/output/")
  output(txt)
  parse(txt)
  // output( parse( "dna" ))
}
function aPeptideCodon(a) {
  // console.log(a);
  return a.Codon.toUpperCase().substring(0, 4) == peptide.toUpperCase().substring(0, 4);
}
function pepToColor(pep) {
  let temp = peptide;
  currentPeptide = pep; // aPeptideCodon depends on this global
  let clean = pepTable.filter(aPeptideCodon);
  if (clean.length > 0 ) {
    return hsvToRgb(clean[0].Hue, 0.5, 1.0);
  } else {
    return [0,0,0,0];
  }
}
function pollForStream() {
  status = "polling";
  output(".");
  calcUpdate();
  log(` [polling ${nicePercent()}%] `);
  if (renderLock) {
    return true;
  } else if ((isDiskFinLinear && isDiskFinHilbert && isDiskFinHTML)){
    out(" [disk is writing] ");
    return true;
  }
  if (!args.updates) {
    updates = false;
  }
  if (howMany < 1) {
    output("FINITO");
    return true;
  }
  try {
    if (args._) {
      current = args._[0];
      current = args._.pop();

    } else {
      setImmediate(() => {
        output("Finished processing.")
        quit(1);
      });
      return true;
    }
  } catch(e) {
    output("Finished processing. Maybe. This was catch.")
    quit(1);
    return true;
  }
  log(` [ howMany  ${howMany} ${status} ${filename} ${current}]`)


  if (current == undefined) {
    // quit()
    return false;
  }

  howMany = args._.length;
  filename = path.resolve(current);
  log("current: " + filename)
  let pollAgainFlag = false;
  let willStart = true;
  log( " current is " + current   + args)


  //  var fileExist = fs.open('current', 'r', (err, fd) => {
  //   if (err) {
  //     if (err.code === 'ENOENT') {
  //       console.error('myfile does not exist');
  //       return;
  //     }
  //
  //     throw err;
  //   }
  //
  //   readMyData(fd);
  // });
  try {
    if (!fs.statSync(filename).isFile) {
      output("This is not a file: " + filename)
      theSwitcher(false);
      return false;
    }
  } catch(err) {
    console.warn("ERROR: " + err);
    output("statSync: false " + filename)
    theSwitcher(false);
    return false;
  }

  if (filename == defaultFilename) {
    log("skipping default: " + defaultFilename);
    log("checkFileExtension: " + filename)
    theSwitcher(false);
    return false;
  }
  if (!checkFileExtension(getLast5Chars(filename))) {
    log("getLast5Chars(filename): " + getLast5Chars(filename));
    log("checkFileExtension(getLast5Chars(filename)): " + checkFileExtension(getLast5Chars(filename)))
    theSwitcher(false);
    return false;
  } else {

    autoconfCodonsPerPixel();
    status ="polling";
    setupFNames();

    if (!okToOverwritePNG(filenamePNG)) {
      log("Failed check: OK to overwrite existing image?  " + okToOverwritePNG(filenamePNG));
      log(filenamePNG + " exist, skipping.");
      if (openHtml || openImage) {
        openOutputs();
      }
      theSwitcher(false);
      return false;
    } else {
      let temp = !checkLocks(filenameTouch);
      if (temp) {
        log("!checkLocks(filenameTouch) " + temp);
        theSwitcher(false); // <---- FAIL
        return false;
      } else {
        log(`filenameTouch ${filenameTouch}`);
        theSwitcher(true); // <--- GOOD
        return true;
      }
    }
  }


  log(`willStart   ${willStart}  pollAgainFlag ${pollAgainFlag}  defaultFilename  ${defaultFilename}  ${filename}  howMany   ${howMany}   status ${status}`);

}
function theSwitcher(bool) {
  log(`cpu has entered The Switcher!`)
  if (bool) {

    autoconfCodonsPerPixel();
    status ="polling";
    setupFNames();

    touchLockAndStartStream(filenameTouch); // <--- THIS IS WHERE RENDER STARTS
    return true;
  } else  {
    status = "switcher"
    log(howMany);
    if (howMany > 0 ) {
      log(`there is more work but also renderLock: ${renderLock}`);

      pollForStream();
      return true;
    } else {
      log(`polling none renderLock: ${renderLock}`);
      clearTimeout(raceTimer);
      quit();
      return false;
    }
  }
}
async function initStream(f) {
  status = "init";
  mkdir('output');
  log(status.toUpperCase());
  start = new Date().getTime();

  timeElapsed, runningDuration, charClock, percentComplete, genomeSize, colClock, opacity = 0;
  msPerUpdate = 200;
  codonRGBA, geneRGBA, mixRGBA = [0,0,0,0]; // codonRGBA is colour of last codon, geneRGBA is temporary pixel colour before painting.
  codonsPerPixel = defaultC; //  one codon per pixel maximum
  CRASH = false; // hopefully not
  msPerUpdate = 200; // milliseconds per  update
  codonRGBA, geneRGBA, mixRGBA = [0,0,0,0]; // codonRGBA is colour of last codon, geneRGBA is temporary pixel colour before painting.
  rgbArray = [];
  red = 0;
  green = 0;
  blue = 0;
  alpha = 0;
  charClock = 0; // its 'i' from the main loop
  errorClock = 0; // increment each non DNA, such as line break. is reset after each codon
  breakClock = 0;
  streamLineNr = 0;
  genomeSize = 0;
  filesDone = 0;
  spewClock = 0;
  opacity = 1 / codonsPerPixel; // 0.9 is used to make it brighter, also due to line breaks

  for (h=0; h<pepTable.length; h++) {
    pepTable[h].Histocount = 0;
  }
  for (h=0; h<dnaTriplets.length; h++) {
    dnaTriplets[h].Histocount = 0;
  }

  filename = path.resolve(f); // set a global. i know. god i gotta stop using those.

  autoconfCodonsPerPixel();
  status ="init";
  setupFNames();


  extension = getLast5Chars(f);
  log(` [ func parm: ${f} ]`);
  log(` [ cli parameter: ${filename} ]`);
  log(` [ canonical:     ${justNameOfDNA} ]`);
  log("[FILESIZE] " + baseChars.toLocaleString() + " extension: " + extension);


  percentComplete = 0;
  genomeSize = 0; // number of codons.
  pixelStacking = 0; // how we fit more than one codon on each pixel
  colClock = 0; // which pixel are we painting?
  timeElapsed = 0;
  if (updates) {
    clearScreen(); // always clear if doing updates
  }

  output(`STARTING RENDER ${filename}`);

  if (updatesTimer) {
    clearTimeout(updatesTimer);
  }

  // var readStream = fs.createReadStream('all_titles.txt');
  //var readStream = process.stdin;
// pipeInstance
try {
  var readStream = fs.createReadStream(filename).pipe(es.split()).pipe(es.mapSync(function(line){
    status = "wait stream";
    readStream.pause(); // pause the readstream during processing
    streamLineNr++;
    status = "paint";
    processLine(line); // process line here and call readStream.resume() when ready
    readStream.resume();
  })
  .on('error', function(err){
    status = "stream error";
    log('Error while reading file: ' + filename, err.reason);
    console.dir(err)
    log(status)
  })
  .on('end', function() {
    status = "stream end";
    log("Stream ending event");
  })
  .on('close', function() {
    status = "stream close";
    log("Stream closed.");
    progato = null;
    currentTriplet = "none";
    currentTriplet = triplet;
    return saveDocuments();
  }));
} catch(e) {
  log("ERROR:"  + e)
}



  if (updates == true) {
    cursorToTopLeft();
    drawHistogram();
  } else {
    progato = whack_a_progress_on();
  }

  log("FINISHED INIT");
}
function showFlags() {
  return `${(  force ? "F" : "-"    )}${(  args.updates || args.u ? `U` : "-"    )}${(  userCPP != -1 ? `C${userCPP}` : "--"    )}${(  args.keyboard || args.k ? `K` : "-"    )}${(  args.spew || spew ? `K` : "-"    )}${( verbose ? "V" : "-"  )}${(  artistic ? "A" : "-"    )}${(  args.ratio || args.r ? `${ratio}` : "---"    )}${(magnitude? "M" + magnitude:"")}C${onesigbitTolocale(codonsPerPixel)}${(reg?"REG":"")}`;
}
function testSummary() {
  return `TEST
  Filename: <b>${justNameOfDNA}</b>
  Registration Marks: ${( reg ? true : false )}
  ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
  Your custom flags: TEST${(  force ? "F" : ""    )}${(  userCPP != -1 ? `C${userCPP}` : ""    )}${(  devmode ? "D" : ""    )}${(  args.ratio || args.r ? `${ratio}` : ""    )}${(  args.magnitude || args.m ? `M${magnitude}` : ""    )}
  ${(  artistic ? ` Artistic Mode` : ` Science Mode`    )}
  Max magnitude: ${magnitude} / 10 Max pix: ${maxpix.toLocaleString()}
  Hilbert Magnitude: ${magnitude} / ${maxMagnitude}
  Hilbert Curve Pixels: ${hilbPixels[magnitude]}`;
}
function renderSummary() {
  maxpix += 0; // cast it into a number from whatever the heck data type it was before!
  return `
  Filename: <b>${justNameOfDNA}</b>
  Run ID: ${timestamp} (unix timestamp)
  Highlight set: ${isHighlightSet} ${(isHighlightSet ? peptide + " " + triplet : peptide)}
  ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
  Your custom flags: ${(  force ? "F" : ""    )}${(  userCPP != -1 ? `C${userCPP}` : ""    )}${(  devmode ? "D" : ""    )}${(  args.ratio || args.r ? `${ratio}` : "   "    )}${(  args.magnitude || args.m ? `M${magnitude}` : "   "    )}
  ${(  artistic ? `Artistic Mode` : `Science Mode`    )}
  Aspect Ratio: ${ratio}
  Input bytes: ${baseChars.toLocaleString()}
  Output bytes: ${rgbArray.length.toLocaleString()}
  Estimated Codons by file size: ${Math.round(estimatedPixels).toLocaleString()}
  Actual Codons matched: ${genomeSize.toLocaleString()}
  Estimate accuracy: ${Math.round(((estimatedPixels / genomeSize)-1)*100)}%
  Error Clock: ${errorClock.toLocaleString()}
  Char Clock: ${charClock.toLocaleString()}
  Codons per pixel linear image: ${twosigbitsTolocale(codonsPerPixel)} integer
  Codons per pixel hilbert: ${twosigbitsTolocale(codonsPerPixelHILBERT)} float
  Pixels linear: ${colClock.toLocaleString()}
  Pixels hilbert: ${hilbPixels[dimension].toLocaleString()}
  Scale down factor:  ${twosigbitsTolocale(shrinkFactor)}
  overSampleFactor: ${twosigbitsTolocale(overSampleFactor)}
  Amino acid blend opacity: ${Math.round(opacity*10000)/100}%
  Users Max magnitude: ${ ( magnitude != false ? `${magnitude}/ 10 ` : "Not Set" ) } Max pix:${maxpix.toLocaleString()}
  Hilbert Magnitude: ${magnitude} / ${maxMagnitude}
  Hilbert Curve Pixels: ${hilbPixels[dimension]}
  Darken Factor ${twosigbitsTolocale(darkenFactor)}
  Highlight Factor ${twosigbitsTolocale(highlightFactor)}
  Time used: ${runningDuration.toLocaleString()} miliseconds`;
}



// CODONS PER PIXEL
function autoconfCodonsPerPixel() { // requires baseChars maxpix defaultC
  let existing = userCPP;

  // internally, we signal pipe input from standard in as -1 filesize
  // therefore if filesize = -1 then streaming pipe mode is enabled.
  baseChars = getFilesizeInBytes(filename);
  log("File size in bytes: " + baseChars + " filename " + filename);
  if (baseChars < 0) { // switch to streaming pipe mode,
    isStreamingPipe = true; // cat Human.genome | aminosee
    log("Could not get filesize, setting for image size of 696,969 pixels");
    estimatedPixels = 696969; // 696969 flags a missing value in debug
    baseChars = 696969; // 696969 flags a missing value in debug
    codonsPerPixel = 69; // small images with _c69 in filename
    magnitude = dimension = 6; // close to 69
    return
  } else { // use a file
    isStreamingPipe = false; // cat Human.genome | aminosee
  }
  estimatedPixels = baseChars / 3; // divide by 4 times 3
  let computersGuess = pixToMaxMagnitude(estimatedPixels); // give it pixels it gives magnitude
  log(`image estimatedPixels ${estimatedPixels}   computersGuess ${computersGuess}`)

  if (codonsPerPixel < defaultC) {
    codonsPerPixel = defaultC;
  } else if (codonsPerPixel > 6000) {
    codonsPerPixel = 6000;
  } else if (codonsPerPixel == NaN || codonsPerPixel == undefined) {
    codonsPerPixel = defaultC;
  }

  if (magnitude != undefined || magnitude == false) {
    if ( magnitude < computersGuess) {
      log(`It mite be possible to get higher resolution with --magnitude ${computersGuess}`)
    } else if ( magnitude < computersGuess ) {
      log(`Your --magnitude of ${magnitude} is larger than my default of ${computersGuess}`)
    }
  } else {
    if ( magnitude < computersGuess) {
      log(`It mite be possible to get higher resolution with --magnitude ${computersGuess} your choice was ${magnitude}`)
      // default of 6
    } else {
      if ( computersGuess < maxMagnitude) {
        log(`Image is not super large, fitting output to --magnitude ${computersGuess}`)
        magnitude = computersGuess;
      } else {
        log(`Image is big. Limiting size to --magnitude ${maxMagnitude}`)
        magnitude = maxMagnitude;
      }
    }
  }

  log(`magnitude is ${magnitude} new maxpix: ${maxpix}`);

  if (estimatedPixels < maxpix ) { // for sequence smaller than the screen
    if (userCPP != -1)  {
      log("its not recommended to use anything other than --codons 1 for small genomes, better to reduce the --magnitude")
    } else {
      codonsPerPixel = 1; // normally we want 1:1 for small genomes
    }
  } else if (estimatedPixels > maxpix ){ // for seq bigger than screen        codonsPerPixel = estimatedPixels / maxpix*overSampleFactor;
    codonsPerPixel = estimatedPixels / maxpix;
    if (userCPP != -1) {
      if (userCPP < codonsPerPixel) {
        log(terminalRGB(`WARNING: Your target Codons Per Pixel setting ${userCPP} will make an estiamted ${Math.round(estimatedPixels / userCPP).toLocaleString()} is likely to exceed the max image size of ${maxpix.toLocaleString()}, sometimes this causes an out of memory error. My machine spit the dummy at 1.7 GB of virtual memory use by node, lets try yours. We reckon ${codonsPerPixel} would be better but will give it a try...`))
      } else {
        codonsPerPixel = userCPP; // they picked a smaller size than me. therefore their computer less likely to melt.
      }
    }
  }

  if ( userCPP != -1) {
    output(`Manual zoom level override enabled at: ${userCPP} codons per pixel.`);
    codonsPerPixel = userCPP;
  } else {
    log("Automatic codons per pixel setting")
  }

  if (artistic == true) {
    codonsPerPixel = codonsPerPixel / artisticHighlightLength; // to pack it into same image size
  }

  if (codonsPerPixel < defaultC) { // less than 1
    codonsPerPixel = defaultC;
  }
  opacity = 1 / codonsPerPixel;
  // set highlight factor such  that:
  // if cpp is 1 it is 1
  // if cpp is 2 it is 1.5
  // if cpp is 3 it is 1
  // if cpp is 4 it is 2.5
  // if cpp is 10 it is 6.5
  if ( codonsPerPixel < 5 ) {
    highlightFactor = 1 + (codonsPerPixel/2);
  } else if ( codonsPerPixel < 64 )  {
    highlightFactor = codonsPerPixel / 8 ;
  } else if ( codonsPerPixel > 64 ) {
    highlightFactor = 16 + ( 255 / codonsPerPixel) ;
  }

  return codonsPerPixel;
}

function removeFileExtension(f) {
  return f.substring(0, f.length - (getLast5Chars(f).length+1));
}
function highlightFilename() {
  let ret = "";
  // log(``)
  if ( isHighlightSet == false) {
    ret += `-reference`;
  } else {
    if ( currentTriplet.toLowerCase() != "none" || triplet.toLowerCase() != "none") {
      ret += `_${spaceTo_(currentTriplet).toUpperCase()}`;
    } else if (currentPeptide != "none") {
      ret += `_${spaceTo_(currentPeptide)}`;
    } else {
      ret += `-reference`;
    }
  }
  log(`ret: ${ret} currentTriplet: ${currentTriplet} currentPeptide ${currentPeptide}`);
  return ret;
}
function getFileExtension() {
  let t = getRegmarks();

  if (args.ratio || args.r) {
    t += `_${ratio}`;
  }
  ( artistic ? t += "_artistic" : t += "_sci")
  return t;
}
function setupFNames() {
  extension = getLast5Chars(filename);
  justNameOfDNA = spaceTo_(removeFileExtension(replaceFilepathFileName(filename)));

  if (justNameOfDNA.length > 22 ) {
    justNameOfDNA = justNameOfDNA.substring(0,11) + justNameOfDNA.substring(justNameOfDNA.length-11,justNameOfDNA.length);
  }
  // let filePath = path.dirname(path.resolve(path.dirname(filename))); // parent
  let filePath = path.resolve(path.dirname(filename)) ;
  filePath += "/output" ;
  mkdir("output");
  let ext = spaceTo_(getFileExtension());
  // if (magnitude != false) {
  //   t += ".m" + magnitude;
  // } else {
  //   log(`no magnitude setting: ${magnitude}`)
  // }
  //
  justNameOfHTML =     `${justNameOfDNA}.${extension}_c${onesigbitTolocale(codonsPerPixel)}${ext}.html`;
  generateFilenamePNG();
  generateFilenameHilbert();
  filenameTouch =   `${filePath}/${justNameOfDNA}.${extension}_LOCK${highlightFilename()}_c${onesigbitTolocale(codonsPerPixel)}${ext}.aminosee.touch`;
  filenamePNG =     filePath + "/" + justNameOfPNG;
  filenameHTML =    filePath + "/" + justNameOfHTML;
  filenameHILBERT = filePath + "/" + justNameOfHILBERT;

  log(`ext: ${highlightFilename() + ext} pep ${peptide} status ${status} filePath ${filePath} isHighlightSet ${isHighlightSet}`);
}

function launchNonBlockingServer() {
  serverPath = appPath.substring(0, appPath.length-15);// + "public";
  console.log(`serverPath ${serverPath}`)
  const LocalWebServer = require('local-web-server')
  const localWebServer = new LocalWebServer()
  const server = localWebServer.listen({
    port: 3210,
    // https: true,
    directory: serverPath,
    spa: 'index.html',
    // websocket: 'src/websocket-server.js'
  })
  // secure, SPA server with listening websocket now ready on port 8050

  // Stop listening when/if server is no longer needed
  // server.close()

  openMiniWebsite();
}

// const server = require('node-http-server');
// log("appPath " + appPath + " server path: " + serverPath);
// server.deploy(
//   {
//     port: 3210,
//     root: serverPath
//   }
// )
// openMiniWebsite();


// const httpServer = require('http-server');
// const { get, post } = server.router;
// server({ port: 3210 }, [
//   get('/', ctx => 'Hello world!')
// ]);

//
// const handleReq = function (req) {
//   console.log("listening", req);
// }
//
//  let server = httpServer.createServer({
//   port: 3210,
//   root: "public",
//   robots: true,
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Credentials': 'true'
//   },
// });


// });
// try {
//   server.listen(3210);
//   server.callback(null, handleReq);
// } catch(e) {
//   console.warn(e);
// }


function openMiniWebsite() {
  // opn(`http://127.0.0.1:3210/${justNameOfHTML}`);
  try {
    opn('http://127.0.0.1:3210/');
  } catch(e) {
    log(`error during openMiniWebsite: ${e}`);
  }
  stat("Personal mini-Webserver starting up around now (hopefully) on port 3210");
  stat("visit http://127.0.0.1:3210/ in your browser to see 3D WebGL visualisation");
  console.log(terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10));
  console.log(terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200));
  stat("Control-C to quit");

}
function welcomeMessage() {
  output('Welcome to the AminoSeeNoEvil DNA Viewer!');
  output(`This CLI is to convert sequence found in ASCII/RTF-8 text files - tested with .mfa .fa .gbk up to  into .png graphics. works with .mfa .fa .gbk DNA text files. It's been tested with files up to 3 GB, and uses asynchronous streaming architecture!`);
  output(' ');
  output('flags:');

  output('     --ratio -r square|golden|fixed       (image proportions)');
  output('     --width -w   1-20          (only works with fixed ratio)');
  output('     --magnitude -m       (debug setting to limit memory use)');
  output('     --triplet -t        (highlight triplet eg --triplet GGC)');
  output('     --verbose -v                              (verbose mode)');
  output('     --help -h                                          Help)');
  output('     --force -f     (Overwrite existing .png file if present)');
  output('     --devmode -d         (dont automatically open the image)');
  output('     --artistitc -a  (creates a visual rhythm in the picture)');
  output('     --codons -c  1-6000            (default is 1 per pixel )');
  output('        setting codons per pixel disables hilbert mode export');
  output('     --spew -s          (spew DNA bases to the screen during)');
  output('     --no-clear              (dont clear the terminal during)');
  output('     --no-update                       (dont provide updates)');
  output('     --reg    (put registration marks @ 25% 50% 75% and 100%)');
  output('     --test                (create calibration test patterns)');
  output(' ');
  output('use * to process all files in current directory');
  output('use serve to run the web server');
  output(terminalRGB('if you need some DNA try this random clipping:', 255,255,200));
  output('wget https://www.funk.co.nz/aminosee/dna/megabase.fa');
  output(' ');
  output('examples:    ');
  output('     aminosee human-genome-DNA.txt             (render one file)');
  output('     aminosee chr1.fa  chrX.fa  chrY.fa         (render 3 files)');
  output('     aminosee chr1.fa -m 8                 (render at 2048x2048)');
  output('     aminosee * --golden --peptide=phenyl (Phenylalanine codons)');
  output('     aminosee * --fixed  --triplet=GGT   (higlighted GGT codons)');
  output('     aminosee serve                         (fire up the demo!!)');
  printRadMessage();
}
// function
function saveDocuments(callback) {
  status = "save"; // <-- this is the true end point of the program!
  clearTimeout(updatesTimer);
  calcUpdate();
  percentComplete = 1;
  calculateShrinkage();

  output(`Saving documents... ` + chalk.rgb(255, 255, 255).inverse(`Input DNA: ${justNameOfDNA}.${extension} Linear PNG: ${justNameOfPNG} Hilbert PNG: ${justNameOfHILBERT} HTML ${justNameOfHTML} Lock: ${filenameTouch}`));


  arrayToPNG(function () {
    if (isHilbertPossible) {
     log("projecting linear array to 2D hilbert curve");
     saveHilbert(rgbArray);
   } else {
     output("Cant output hilbert image when using artistic mode");
   }
  });


 // status = "saving html report";
 if (report == true ) { // report when highlight set
   out("Saving HTML");

   saveHTML();
 } else {
   out(`No HTML report output. Due to peptide filters: ${peptide} ${triplet}`);
   // output("HACK: running output");
   // saveHTML();
 }
 openOutputs();
 log(renderSummary());

 // updates = true;
 status = "removelocks";
 // setImmediate(() => {
   removeLocks();
 // });
 if (callback != undefined) {
   callback();
 }

}
function compareHistocount(a,b) {
  if (a.Histocount < b.Histocount)
  return -1;
  if (a.Histocount > b.Histocount)
  return 1;
  return 0;
}
function saveSync(theCallback) {
  fs.writeFile(filenameHTML, htmlTemplate(), function (err) {
    if (err) { output(`Error saving HTML: ${err}`) }
    output('Saved html report to: ' + chalk.underline(filenameHTML));
  }, theCallback);
}
function saveHTML() {
  log( pepTable.sort( compareHistocount ) );
  fs.writeFileSync(filenameHTML, htmlTemplate(), function (err) {
    if (err) { output(`Error saving HTML: ${err}`) }
    output('Saved html report to: ' + chalk.underline( filenameHTML ) );
  });
}
function touchLockAndStartStream(fTouch) {
  renderLock = true;
  isDiskFinHTML, isDiskFinHilbert, isDiskFinLinear = false;

  fs.writeFile(fTouch, lockFileMessage,  function (err) {
    if (err) { console.dir(err); console.warn("Touch file error " + fTouch) }
    log('Touched lockfile OK: ' + fTouch);
    log('Starting init for ' + filename);
    status = "paint";
    output("Starting render");
    printRadMessage([`highlight: ${isHighlightSet}`, `peptide: ${peptide} triplet: ${triplet}`, filename, "Now", ".", "."]);
    initStream(filename);
    // setTimeout(() => {
    // }, raceDelay);
  });

}
function removeLocks() {

  if (keyboard == true) {
    try {
      process.stdin.setRawMode(false);
      process.stdin.resume();
    } catch(e) { log( e ) }
  }

  try {
    fs.unlinkSync(filenameTouch, (err) => {
      if (err) { console.warn(err) }
      log("Removing locks OK")
    });

  } catch (err) {
    // log("No locks to remove: " + err);
  }
  isDiskFinHTML = true;
  renderLock = false;

  if (howMany > 0 ) {
    setTimeout(() => {
      pollForStream();
    }, raceDelay);
  } else {
    log("and thats's all she wrote folks.");
  }

}

function getFilesizeInBytes(file) {
    const stats = fs.statSync(file)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

// function getFilesizeInBytes(f) {
//   baseChars = 69;
//   bigIntFileSize = 69696969696969n; // test of big int.
//   try {
//     baseChars = fs.fstatSync(f, { bigint: false }).size;
//     bigIntFileSize = fs.fstatSync(f, { bigint: true } ).size;
//     log(`File exists with size ${baseChars} at: ${f}`);
//     return baseChars;
//   } catch(e) {
//     baseChars = -1;
//     output(`Cant stat filesize of ${f} File error: ${e}`);
//     return baseChars;
//   }
//   log(`f ${f} baseChars ${baseChars} file: ${file} big int filesize: ${bigIntFileSize}`);
//   return baseChars; // debug flag. basically i should never see -69 appearing in error logs
// }
function getLast5Chars(f) {
  let lastFive = f.slice(-5);
  log(`lastFive ${lastFive}`)
  return lastFive.replace(/.*\./, '').toLowerCase();
}
function checkFileExtension(f) {
  let value = extensions.indexOf(getLast5Chars(f));
  if ( value < 0) {
    log(`checkFileExtension FAIL: ${f}  ${value} `);
    return false;
  } else {
    log(`checkFileExtension GREAT SUCCESS: ${f}  ${value} `);
    return true;
  }
}

function quit(n) {
  if ( renderLock == true ) {
    log("still rendering")
    return true;
  }
  status = "bye";
  log(status);
  if ( howMany > 0 ) {
    log("Continuing...");
    pollForStream();
  } else {
    log(`process.exit type bye. last file: ${filename}`);
    clearTimeout(updatesTimer);
    // args = [];
    if (devmode) {
      output("Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rendered but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry.")
    } else {
      removeLocks();
    }
    process.exitCode = 0;
    if (keyboard) {
      process.stdin.pause();
    }

    // process.exit()
  }
}
function processLine(l) {

  rawDNA = l;
  var cleanDNA = "";
  let lineLength = l.length; // replaces baseChars
  let codon = "";
  currentTriplet = "none";
  isHighlightCodon = false;
  CRASH = false;
  for (column=0; column<lineLength; column++) {
    // build a three digit codon
    let c = cleanChar(l.charAt(column)); // has to be ATCG or a . for cleaned chars and line breaks
    charClock++;
    // ERROR DETECTING
    // IMPLMENTED AFTER ENABLEDING "N" TO AFFECT THE IMAGE
    // ITS AT THE STAGE WHERE IT CAN EAT ANY FILE WITH DNA
    // BUT IF ANY META DATA CONTAINS THE WORD "CAT", "TAG" etc these are taken as coding (its a bug)
    while ( c == "." && c != "N") { // biff it and get another
      // log(c);
      codon =  ""; // we wipe it because... codons should not cross line break boundaries.
      column++;
      c = cleanChar(l.charAt(column)); // line breaks
      charClock++;
      errorClock++;
      red = 0;
      green = 0;
      blue = 0;

      if (column > lineLength) {
        // log("BREAK - END OF LINE")
        breakClock++;
        break
      }
    }
    // if (c==".") { c = ""}
    codon += c; // add the base
    // log(c);
    if (codon == "..." || codon == "NNN") {
      currentTriplet = codon;
      if (codon == "NNN" ) {
        pepTable.find(isNoncoding).Histocount++;
      }
      codon="";
      log(red+green+blue);
      if (red+green+blue>0) { // this is a fade out to show headers.
        // red -= codonsPerPixel;
        // green-= codonsPerPixel;
        // blue-= codonsPerPixel;
        red --;
        green--;
        blue--;
        // paintPixel();
      } else {
        // do nothing this maybe a non-coding header section in the file.
        // status = "header";
        // msPerUpdate = 100;
      }
      errorClock++;


    } else if (codon.length ==  3) {
      currentTriplet = codon;
      pixelStacking++;
      genomeSize++;
      codonRGBA = codonToRGBA(codon); // this will report alpha info
      let brightness = codonRGBA[0] +  codonRGBA[1] +  codonRGBA[2] + codonRGBA[3];
      // log(" brightness: " + brightness);
      cleanDNA += codon;
      if (CRASH) {
        output(cleanDNA + " IM CRASHING Y'ALL: " + codon);
        crashReport();
        // quit();
        errorClock++;
        CRASH = false;
        break
      }

      // HIGHLIGHT codon --triplet Tryptophan
      if (isHighlightSet) {
        if (codon == triplet) {
          isHighlightCodon = true;
        } else if (aminoacid == peptide) {
          isHighlightCodon = true;
        } else {
          isHighlightCodon = false;
        }
      }

      if (isHighlightCodon) { // 255 = 1.0
        mixRGBA[0]  += parseFloat(codonRGBA[0].valueOf()) * highlightFactor * opacity;// * opacity; // red
        mixRGBA[1]  += parseFloat(codonRGBA[1].valueOf()) * highlightFactor * opacity;// * opacity; // green
        mixRGBA[2]  += parseFloat(codonRGBA[2].valueOf()) * highlightFactor * opacity;// * opacity; // blue
        mixRGBA[3]  +=   255 * highlightFactor *  opacity;// * opacity; // blue
      } else {
        //  not a START/STOP codon. Stack multiple codons per pixel.
        // HERE WE ADDITIVELY BUILD UP THE VALUES with +=
        mixRGBA[0] +=   parseFloat(codonRGBA[0].valueOf()) * opacity * darkenFactor;
        mixRGBA[1] +=   parseFloat(codonRGBA[1].valueOf()) * opacity * darkenFactor;
        mixRGBA[2] +=   parseFloat(codonRGBA[2].valueOf()) * opacity * darkenFactor;
        mixRGBA[3] +=   255 * darkenFactor *  opacity;// * opacity; // blue
      }





      //  blends colour on one pixel
      if (pixelStacking >= codonsPerPixel) {


        if (artistic != true) {


          red = mixRGBA[0];
          green = mixRGBA[1];
          blue = mixRGBA[2];
          alpha = mixRGBA[3];
          paintPixel(); // FULL BRIGHTNESS
          // reset inks, using codonsPerPixel cycles for each pixel:
          mixRGBA[0] =   0;
          mixRGBA[1] =   0;
          mixRGBA[2] =   0;
          mixRGBA[3] =   0;
          red = 0;
          green = 0;
          blue = 0;
          alpha = 0;

          // end science mode
        } else {
          // ************ ARTISTIC MODE
          if (isHighlightCodon) {
            if (artisticHighlightLength >= 12) {
              red = mixRGBA[0]/12;
              green = mixRGBA[1]/12;
              blue = mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();



              red = mixRGBA[0]/12;
              green = mixRGBA[1]/12;
              blue = mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
              red += mixRGBA[0]/12;
              green += mixRGBA[1]/12;
              blue += mixRGBA[2]/12;
              paintPixel();
            }
            red += mixRGBA[0]/3;
            green += mixRGBA[1]/3;
            blue += mixRGBA[2]/3;
            paintPixel();
            red += mixRGBA[0]/3;
            green += mixRGBA[1]/3;
            blue += mixRGBA[2]/3;
            paintPixel();
            red = mixRGBA[0];
            green = mixRGBA[1];
            blue = mixRGBA[2];
            paintPixel();
            red += 200;
            green += 200;
            blue += 200;
            paintPixel();
            red = mixRGBA[0]/2;
            green = mixRGBA[1]/2;
            blue = mixRGBA[2]/2;
            paintPixel();
            red = 0;
            green = 0;
            blue = 0;
            paintPixel(); // END WITH BLACK
            pixelStacking = 0;
            mixRGBA[0] =   0;
            mixRGBA[1] =   0;
            mixRGBA[2] =   0;
            //
          } else { // non highlight pixel
            red = 0;
            green = 0;
            blue = 0; // START WITH BLACK
            paintPixel();
            red = mixRGBA[0]/2;
            green = mixRGBA[1]/2;
            blue = mixRGBA[2]/2;
            paintPixel();
            red += 180; // <-- THIS IS THE WHITE GLINT
            green += 180; // <-- THIS IS THE WHITE GLINT
            blue += 180; // <-- THIS IS THE WHITE GLINT
            alpha = 200;
            paintPixel();
            red = mixRGBA[0];
            green = mixRGBA[1];
            blue = mixRGBA[2];
            paintPixel();
            red = red / 1.2;
            green = green / 1.2;
            blue = blue / 1.2;
            paintPixel();
            red = red / 1.2;
            green = green / 1.2;
            blue = blue / 1.2;
            paintPixel();
            if (artisticHighlightLength >= 12) {
              red = red / 1.1;
              green = green / 1.1;
              blue = blue / 1.1;
              paintPixel();
              red = red / 1.1;
              green = green / 1.1;
              blue = blue / 1.1;
              paintPixel();red = red / 1.1;
              green = green / 1.1;
              blue = blue / 1.1;
              paintPixel();
              red = red / 1.1;
              green = green / 1.1;
              blue = blue / 1.1;
              paintPixel();red = red / 1.1;
              green = green / 1.1;
              blue = blue / 1.1;
              paintPixel();
              red = red / 1.1;
              green = green / 1.1;
              blue = blue / 1.1;
              paintPixel();
            }
            // reset inks:
            pixelStacking = 0;
            mixRGBA[0] =   0;
            mixRGBA[1] =   0;
            mixRGBA[2] =   0;
          }


        } // artistic mode

      } // end pixel stacking
      codon = ""; // wipe for next time
    } // end codon.length ==  3
  } // END OF line LOOP! thats one line but mixRGBA can survive lines
} // end processLine

function aminoFilenameIndex(id) {
  let temp = peptide; // store it after unsafe usage in this function
  let temp2 = isHighlightSet; // store it after unsafe usage in this function
  if (id == undefined || id == -1) {
    isHighlightSet = false;
    peptide = "none";
    currentPeptide = "none";
  } else {
    isHighlightSet = true;
    currentPeptide = pepTable[id].Codon.toLowerCase(); // bad use of globals but highlightFilename use this global
  }

  // let ret = `${justNameOfDNA}.${extension}_HILBERT${highlightFilename()}_c${codonsPerPixelHILBERT}${getFileExtension()}.png`;
  let ret = generateFilenameHilbert();
  currentPeptide = temp;
  isHighlightSet = temp2;
  return ret;
}
function generateFilenamePNG() {
  let ext = spaceTo_(getFileExtension());
  justNameOfPNG =     `${justNameOfDNA}.${extension}_linear${highlightFilename()}_c${onesigbitTolocale(codonsPerPixel)}${ext}.png`;
  return justNameOfPNG;
}
function generateFilenameHilbert() {
  let ext = spaceTo_(getFileExtension());
  justNameOfHILBERT =     `${justNameOfDNA}.${extension}_HILBERT${highlightFilename()}_m${dimension}_c${onesigbitTolocale(codonsPerPixelHILBERT)}${ext}.png`;
  return justNameOfHILBERT;
}
function imageStack() {
  let hhh = " ";
  hhh += `<a href="${aminoFilenameIndex()}" onmouseover="mover(${-1})" onmouseout="mout(${-1})"><img  src="${aminoFilenameIndex()}" id="stack_reference" width="256" height="256" style="z-index: ${999}; position: absolute; top: 0px; left: 0px;" alt="${refimage}" title="${refimage}"></a>`;

  for (i=0; i<pepTable.length; i++) {
    let thePep = pepTable[i].Codon.toLowerCase();
    let theHue = pepTable[i].Hue;
    let c =      hsvToRgb( theHue/360, 0.5, 1.0 );

    if (thePep != "non-coding nnn"  && thePep != "start codons" && thePep != "stop codons") {
      hhh += `<a href="${aminoFilenameIndex(i)}" onmouseover="mover(${i})" onmouseout="mout(${i})"><img  src="${aminoFilenameIndex(i)}" id="stack_${i}" width="256" height="256" style="z-index: ${1000+i}; position: absolute; top: ${i*2}px; left: ${i*12}px;" alt="${pepTable[i].Codon}" title="${pepTable[i].Codon}"></a>`;
    } else {
      log("non-coding nnn image not output");
    }
  }
  currentPeptide = peptide = "none"; // hack to address globals
  aminoFilenameIndex(); // hack to address globals
  return hhh;
}

function htmlTemplate() {
  var html = `<html>
  <head>
  <title>${justNameOfDNA} :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson</title>
  <meta name="description" content="${siteDescription}">
  <link rel="stylesheet" type="text/css" href="https://www.funk.co.nz/aminosee/public/AminoSee.css">
  <link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
  <link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
  <link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet">


  <script src="https://www.funk.co.nz/aminosee/node_modules/three/build/three.min.js"></script>
  <script src="https://www.funk.co.nz/aminosee/node_modules/jquery/dist/jquery.min.js"></script>
  <script src="https://www.funk.co.nz/aminosee/public/hilbert3D.js"></script>
  <script src="https://www.funk.co.nz/aminosee/public/hilbert2D.js"></script>
  <script src="https://www.funk.co.nz/aminosee/public/WebGL.js"></script>
  <script src="https://www.funk.co.nz/aminosee/node_modules/hammerjs/hammer.min.js"></script>
  <script src="https://www.funk.co.nz/aminosee/bundle.js"></script>

  <script src="https://www.funk.co.nz/aminosee/aminosee-gui-web.js">


  </head>
  <body>
  <!-- Google Tag Manager -->
  <noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-P8JX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P8JX');</script>
<!-- End Google Tag Manager -->

<h1>AminoSee DNA Render Summary for ${justNameOfDNA}</h1>
${imageStack()}
<div class="fineprint" style="text-align: right; float: right;">
<pre>
${renderSummary()}
</pre>
</div>
<a href="#scrollLINEAR" class="button" title"Click To Scroll Down To See LINEAR"><br />
<img width="128" height="128" style="border: 4px black;" src="${justNameOfPNG}">
1D Linear Map Image
</a>
<a href="#scrollHILBERT" class="button" title"Click To Scroll Down To See 2D Hilbert Map"><br />
<img width="128" height="128" style="border: 4px black;" src="${justNameOfHILBERT}">
2D Hilbert Map Image
</a>
<a href="#scroll3D" class="button" title"Click To Scroll Down To See 3D Hilbert Map"><br />
<img width="128" height="128" style="border: 4px black;" src="https://www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg">
3D Hilbert Map Image
</a>


<div id="monkeys">
<div><a href="http://aminosee.funk.nz/">
<input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollHILBERT'"><br>

<img src="https://www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg">

<!-- <h1>AminoSeeNoEvil</h1> -->
<h1>Amino<span style="color: #888888;">See</span><span style="color: #dddddd;">NoEvil</span></h1>
<div class="hidable">
<h2 id="h2">DNA/RNA Chromosome Viewer</h2>
<p id="description" class="fineprint hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon triplet</p>



</div>
</a>
</div>
</div>

<div>`;



html += `</div>

<br /><br />

<table>
<thead>
<tr>
<th>Amino Acid</th>
<th>Hue</th>
<th>RGB</th>
<th>Count</th>
<th>Description</th>
<th>Hilbert PNG</th>
</tr>
</thead>
<tbody>

<tr>
<td style="background-color: white;"> All combined main reference image  </td>
<td>
<p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">n/a</p>
</td>
<td style="color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">n/a</p> </td>
<td>n/a</td>
<td>n/a</td>
<td style="background-color: white;">
<a href="${aminoFilenameIndex()}" class="button" title="${refimage}"><img width="48" height="16" style="border: 1px black;" src="${aminoFilenameIndex()}" alt="${refimage}"></a>
</td>
</tr>

`;
// pepTable   = [Codon, Description, Hue, Alpha, Histocount]
for (i=0; i<pepTable.length; i++) {
  let thePep = pepTable[i];
  let theHue = thePep.Hue;
  let c =      hsvToRgb( theHue / 360, 0.5, 1.0 );
  let lightC = hsvToRgb( theHue / 360, 0.95, 0.75 );
  // log(thePep, theHue, c);
  html += `
  <tr style="background-color: hsl( ${theHue} , 50%, 100%);">
  <td style="background-color: white;"> ${pepTable[i].Codon} </td>
  <td style="background-color: rgb(${lightC});">
  <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${theHue}&#xB0;</p>
  </td>
  <td style="background-color: rgb(${c}); color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${c}</p> </td>
  <td>${pepTable[i].Histocount.toLocaleString()}</td>
  <td>${pepTable[i].Description}</td>
  <td style="background-color: white;">
  <a href="${aminoFilenameIndex(i)}" class="button" title="Amino filter: ${spaceTo_(pepTable[i].Codon)}"><img width="48" height="16" style="border: 1px black;" src="${aminoFilenameIndex(i)}" alt="${spaceTo_(pepTable[i].Codon)}"></a>
  </td>
  </tr>
  `
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
<a href="${justNameOfHILBERT}" ><img src="${justNameOfHILBERT}"></a>

<h2>About Start and Stop Codons</h2>
<p>The codon AUG is called the START codon as it the first codon in the transcribed mRNA that undergoes translation. AUG is the most common START codon and it codes for the amino acid methionine (Met) in eukaryotes and formyl methionine (fMet) in prokaryotes. During protein synthesis, the tRNA recognizes the START codon AUG with the help of some initiation factors and starts translation of mRNA.

Some alternative START codons are found in both eukaryotes and prokaryotes. Alternate codons usually code for amino acids other than methionine, but when they act as START codons they code for Met due to the use of a separate initiator tRNA.

Non-AUG START codons are rarely found in eukaryotic genomes. Apart from the usual Met codon, mammalian cells can also START translation with the amino acid leucine with the help of a leucyl-tRNA decoding the CUG codon. Mitochondrial genomes use AUA and AUU in humans and GUG and UUG in prokaryotes as alternate START codons.

In prokaryotes, E. coli is found to use AUG 83%, GUG 14%, and UUG 3% as START codons. The lacA and lacI coding regions in the E coli lac operon don’t have AUG START codon and instead use UUG and GUG as initiation codons respectively.</p>
<h2>Linear Projection</h2>
The following image is in raster order, top left to bottom right:
<a name="scrollLINEAR" ></a>
<a href="${justNameOfPNG}" ><img src="${justNameOfPNG}"></a>
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

function helpCmd(args) {
  output("Help section." + args);
  output(hilbPixels);
  output("Calibrate your DNA with a --test  ");
  output("run aminosee * to process all dna in current dir");
}
function checkLocks(ffffff) { // return false if locked.
  log("checkLocks RUNNING");
  if (force == true && devmode == false) {
    log("Not checking locks - force mode enabled.");
    return true;
  }
  let unlocked, result;
  unlocked = true;
  try {
    result = fs.lstatSync(ffffff).isDirectory;
    log("[lstatSync result]" + result);
    output("A lock file exists for this DNA: " + ffffff)
    output("This may happen if you interupt a render.")
    output("If you render with multiple threads this could be another thread working on the file.")
    output("use -f to overwrite, or just delete the touch file above.");
    return false;
  } catch(e){
    log("No lockfile found - proceeding to render" );
    return true;
  }
  return unlocked;
}

function okToOverwritePNG(f) { // true to continue, false to abort
  log("okToOverwritePNG RUNNING");
  if (force == true) {
    log("Not checking - force mode enabled.");
    return true;
  }

  try {
    result = fs.lstatSync(f).isDirectory;
    log("[lstatSync result]" + result);
    output("A png image has already been generated for this DNA: " + f)
    output("use -f to overwrite");
    if (openHtml || openImage) {
      openOutputs();
    }
    return false;
  } catch(e){
    output("Output png will be saved to: " + f );
    return true;
  }
  return true;
}

function stat(txt) {
  console.log(txt);
}

function toBuffer(ab) {
  var buf = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
// returns 1 dimensional array index from x y co-ords
function coordsToLinear(x, y) {
  return (x % width) + (y * width)
}
function makeWide(txt) {
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
function hilDecode(i, dimension) {
  // output(`i, dimension  ${i} ${dimension}`)
  let x, y;
  [x, y] = MyManHilbert.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
  // ROTATE IMAGE CLOCKWISE 90 DEGREES IF DIMENSION IS EVEN NUMBER FRAMES
  if ( dimension % 2 == 0 ) { // if even number
    let newY = x;
    x = y
    y = newY;
  }
  return [ x, y ];
}
function calculateShrinkage() {
  let linearpix = rgbArray.length / 4;
  let computerWants = pixToMaxMagnitude(linearpix);
  output(`Ideal magnitude: ${computerWants} (new) previous magnitude: ${magnitude}`);

  if ( computerWants > maxMagnitude ) {
    if (args.magnitude || args.m && magnitude > maxMagnitude) {
      output(`I'm not sure that trying to render ${hilbPixels[magnitude]} is going to work out. Maybe try a lower magnitude like ${computerWants} if you get core dump.`)
      dimension = magnitude;
    } else {
      output(`Max size reached: ${hilbPixels[computerWants]} trying a number one higher than -m ${computerWants} and see if I core dump.`)
      dimension = maxMagnitude;
    }
  } else if (computerWants < 0) {
    dimension = 0; // its an array index
  }

  if (args.magnitude || args.m) {
    dimension = magnitude; // users choice
  } else {
    dimension = computerWants; // computers choice
  }

  let hilpix = hilbPixels[dimension];;
  hilbertImage = [hilpix*4];
  shrinkFactor = linearpix / (hilpix*2);//  array.length / 4;
  codonsPerPixelHILBERT = codonsPerPixel / shrinkFactor;
  output(`Linear input image size ${linearpix.toLocaleString()} will be down saple by factor ${shrinkFactor} to achieve a dimension ${dimension} hilbert curve yielding ${hilbPixels[dimension].toLocaleString()} pixels`);
  log(`shrinkFactor pre ${shrinkFactor} = linearpix ${linearpix } /  hilpix ${hilpix}  `);
  magnitude = dimension; // for filenames
  // codonsPerPixelHILBERT = twosigbitsTolocale( codonsPerPixel*shrinkFactor );
  codonsPerPixelHILBERT = codonsPerPixel*shrinkFactor;
  setupFNames();
  log(`filenameHILBERT after shrinking: ${filenameHILBERT} magnitude: ${magnitude} shrinkFactor post ${shrinkFactor} codonsPerPixel ${codonsPerPixel} codonsPerPixelHILBERT ${codonsPerPixelHILBERT}`);
}
// resample the large 760px wide linear image into a smaller square hilbert curve
function saveHilbert(array) {
  status = "Getting in touch with my man... Hilbert. X" + twosigbitsTolocale(shrinkFactor);
  output(status);
  let hilpix = hilbPixels[dimension];;
  let height, width;
  resampleByFactor(shrinkFactor);
  width = Math.sqrt(hilpix);
  height = width;
  let perc = 0;

  for (i = 0; i < hilpix; i++) {
    dot(i, 20000);
    let hilbX, hilbY;
    [hilbX, hilbY] = hilDecode(i, dimension, MyManHilbert);
    let cursorLinear  = 4 * i ;
    let hilbertLinear = 4 * ((hilbX % width) + (hilbY * width));
    let perc = i / hilpix;
    // let thinWhite = 249;
    // let thinWhiteSlice = (Math.round(perc * 1000 )-50) % thinWhite; // -5 is to hit 0% to 0.5% instead of 0% to 1% as previously. this is to enlarge the 99.5% to 100% thinWhite

    hilbertImage[hilbertLinear+0] = rgbArray[cursorLinear+0];
    hilbertImage[hilbertLinear+1] = rgbArray[cursorLinear+1];
    hilbertImage[hilbertLinear+2] = rgbArray[cursorLinear+2];
    hilbertImage[hilbertLinear+3] = rgbArray[cursorLinear+3];

    if (reg) {
      paintRegMarks(hilbertLinear, hilbertImage, perc);
    }

    // if (thinWhiteSlice < 1 && reg) {
    //   paintRegMarks(hilbertLinear, hilbertImage, perc);
    // }

    if (i-4 > rgbArray.length) {
      log("BREAKING at positon ${i} due to ran out of source image. rgbArray.length  = ${rgbArray.length}");
      log(` @i ${i} `);
      break;
    }
  }

  var hilbert_img_data = Uint8ClampedArray.from(hilbertImage);
  var hilbert_img_png = new PNG({
    width: width,
    height: height,
    colorType: 6,
    bgColor: {
      red: 0,
      green: 0,
      blue: 0
    }
  })
  // var hilbert_img_png = new PNG({
  //   width: width,
  //   height: height,
  //   colorType: 6,
  // })
  hilbert_img_png.data = Buffer.from(hilbert_img_data);
  let wstream = fs.createWriteStream(filenameHILBERT);
  new Promise(resolve =>
    hilbert_img_png.pack()
    .pipe(wstream)
    .on('finish', resolve));

  }
  function htmlFinished() {
    isDiskFinHTML = true;
    pollForStream();
  }
  function hilbertFinished() {
    isDiskFinHilbert = true;
    pollForStream();
  }
  function linearFinished() {
  isDiskFinLinear = true;
  pollForStream();
}
function arrayToPNG(callBack) {
    let pixels, height, width = 0;
    pixels = (rgbArray.length / 4);

    if (colClock == 0) {
      output("No DNA or RNA in this file sorry?! You sure you gave a file with sequences? Like: GCCTCTATGACTGACGTA" + filename);
      return;
    }

    if (ratio == "sqr" || ratio == "hil") {
      width = Math.round(Math.sqrt(pixels));
      height = width;
      while ( pixels > width*height) {
        out(` [w: ${width} h: ${height}] `)
        width++;
        height++;
      }
    }

    if (ratio == "gol") {
      let phi = ((Math.sqrt(5) + 1) / 2) ; // 1.618033988749895
      let bleed = pixels * phi; // was a good guess!
      width = Math.sqrt(bleed); // need some extra pixels sometimes
      height = width; // 1mp = 1000 x 1000
      height =  ( width * phi ) - width; // 16.18 - 6.18 = 99.99
      width = bleed / height;
      height = Math.round(height);
      width = Math.round(width) - height;
      log(bleed + " Image allocation check: " + pixels + " > width x height = " + ( width * height ));
    } else if (ratio == "fix") {
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
        out(`h = ${height} `);
        height++;
      }
    }
    if ( pixels <= width*height) {
      log("Image allocation check: " + pixels + " < width x height = " + ( width * height ));
    } else {
      output(`MEGA FAIL: TOO MANY ARRAY PIXELS NOT ENOUGH IMAGE SIZE: array pixels: ${pixels} <  width x height = ${width*height}`);
      process.exit();
    }
    log("Raw image bytes: " + bytes(pixels/4));
    log("Pixels: " + pixels.toLocaleString());
    log("Dimensions: " + width + "x"   + height);
    log("width x height = " + (width*height).toLocaleString());
    log("First 100  bytes: " + rgbArray.slice(0,99));
    log("Proportions: " + ratio);

    var img_data = Uint8ClampedArray.from(rgbArray);
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
    let wstream = fs.createWriteStream(filenamePNG);
    new Promise(resolve =>
      img_png.pack()
      .pipe(wstream)
      .on('finish', () => {
        out("Finished linear png save.");
        openOutputs();
        if (callBack != undefined) {
          out("Downsampling linear image to Hilbert curve");
          callBack();
        } else {
          out("quit - no callBack");
          // quit();
        }
      }));
  }

  function asyncPNG(img_png) {

    }
    function syncPNG(img_png, callback) {

    }

    function openOutputs() {
      status ="open outputs";

      log("Input DNA: " + justNameOfDNA + "." + extension)
      log("Saved Linear projection: " + filenamePNG);
      if ( isHilbertPossible ) {
        log("Saved Hilbert projection: " + filenameHILBERT);
      }
      log("Saved HTML Report projection: " + filenameHTML);
      if (devmode)  { log(renderSummary()); }

      updatesTimer = setTimeout(() => {

        if (openHtml) {
          output("Opening: " + filenameHTML);
          output("Opening your RENDER SUMMARY HTML report. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");
          opn(filenameHTML).then(() => {
            log("browser closed");
          }).catch(function () { out("HTML opened: " + filenameHTML) });
        }
        if (isHilbertPossible && openImage) {
          output("Opening your HILBERT PROJECTION image. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");
          opn(filenameHILBERT).then(() => {
            log("hilbert image closed");
          }).catch(function () { out("Hilbert PNG saved. ") });
        } else if (openImage) {
          output("Opening your LINEAR PROJECTION image. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");
          opn(filenamePNG).then(() => {
            log("regular png image closed");
          }).catch(function () { out("Linear PNG saved. ") });
        } else {
          output(`Use --html or --image to automatically open files after render, and "aminosee demo"`)
          log(`values of openHtml ${openHtml}   openImage ${openImage}`);
          if (howMany <1) {
            quit();
          }
        }

      }, raceDelay);



      log("Thats us cousin");
    }
    function getRegmarks() {
      return ( ratio == true || reg == true ? "_reg" : "" )
    }
    function mkdir(d) {
      if (!fs.existsSync(d)){
        log(`Creating output directory: ${d}`)
        fs.mkdirSync(d);
      }
    }
    function generateTestPatterns() {
      mkdir('calibration');

      if ( !magnitude ) {
        magnitude = maxMagnitude-1;
      }
      // if (magnitude > 8) { magnitude = 8}
      output(`TEST PATTERNS GENERATION    m${magnitude} c${codonsPerPixel}`);
      output("use -m to try different dimensions. -m 9 requires 1.8 GB RAM");
      output("use -a to remove registration marks it looks a little cleaner without them ");
      log(`pix      ${hilbPixels[magnitude]} `);
      log(`magnitude      ${magnitude} `);
      log(`maxMagnitude      ${maxMagnitude} `);


      loopCounter = 0; // THIS REPLACES THE FOR LOOP, INCREMENET BY ONE EACH FUNCTION CALL AND USE IF.
      while(runCycle()) {}
      // runCycle();



      log(`done with generateTestPatterns()`);

      openOutputs();
    }
    function runCycle() {
      if (loopCounter > magnitude) return false

      // for (test = 0; test <= magnitude; test++) {
      fakeReportInit(loopCounter);
      patternsToPngAndMainArray(); // call with no array for test
      fakeReportStop();
      arrayToPNG();
      var theCallback = function saveHTML2() {
        log( pepTable.sort( compareHistocount ) );
        fs.writeFileSync(filenameHTML, htmlTemplate(), function (err) {
          if (err) { output(`Error saving HTML: ${err}`) }
          output(loopCounter + ' Saved html report to: ' + filenameHTML);
        });
      }
      // saveSync(theCallback);
      saveHTML();
      // }
      loopCounter++
      return true;
    }
    function fakeReportStop() {
      calcUpdate();

    }
    function fakeReportInit(magnitude) {
      start = new Date().getTime();
      test, dimension = magnitude; // mags for the test
      // let filePath = path.resolve(__dirname); // OLD WAY not compatible with pkg
      let filePath = path.resolve(process.cwd()); //
      let regmarks = getRegmarks();
      isHilbertPossible = true;
      report = true;
      // FORMAT:  AminoSee_Calibration_reg.undefined_HILBERT_proline_reg.m7_c1_sci.png
      justNameOfDNA = `AminoSee_Calibration${ regmarks }`;
      justNameOfPNG = `${justNameOfDNA}_LINEAR_${ magnitude }.png`;
      justNameOfHILBERT = `${justNameOfDNA}_HILBERT_${ magnitude }.png`;

      filenameHILBERT = filePath + "/calibration/" + justNameOfHILBERT;
      filenamePNG     = filePath + "/calibration/" + justNameOfPNG;
      filenameHTML    = filePath + "/calibration/" + justNameOfDNA + ".html";

      // baseChars = Math.pow(2, magnitude + 3); // HILBERT 8 IS 1024 PIXELS HILBERT 0 IS 8 PIXELS
      baseChars = hilbPixels[ magnitude ];
      genomeSize = baseChars;
      errorClock = 0;
      charClock = baseChars;
      colClock = baseChars;
      maxpix = hilbPixels[magnitude];
      return true;
    }

    function paintRegMarks(hilbertLinear, hilbertImage, perc) {
      let thinWhiteSlice = (Math.round(perc * 1000 )) % 250; // 1% white bands at 0%, 25%, 50%, 75%, 100%

      if (thinWhiteSlice < 1) { // 5 one out of 10,000
        // paintRegMarks(hilbertLinear, hilbertImage, perc);

        hilbertImage[hilbertLinear+0] = 255 - (hilbertImage[hilbertLinear+0]);
        hilbertImage[hilbertLinear+1] = 255 - (hilbertImage[hilbertLinear+1]);
        hilbertImage[hilbertLinear+2] = 255 - (hilbertImage[hilbertLinear+2]);
        hilbertImage[hilbertLinear+3] = 128;
        if (i%2) {
          hilbertImage[hilbertLinear+0] = 255;
          hilbertImage[hilbertLinear+1] = 255;
          hilbertImage[hilbertLinear+2] = 255;
          hilbertImage[hilbertLinear+3] = 255;
        }
      }
    }

    function patternsToPngAndMainArray() {
      let h = require('hilbert-2d');

      let hilpix = hilbPixels[dimension];
      let linearpix = hilpix;// * 4;
      let hilbertImage = [hilpix*4];
      rgbArray = [linearpix*4];


      width = Math.round(Math.sqrt(hilpix));
      height = width;
      linearWidth = Math.round(Math.sqrt(hilpix));
      linearHeight = linearWidth;

      output(`Generating hilbert curve, dimension: ${dimension}`);
      log(filenameHILBERT);
      let perc = 0;
      for (i = 0; i < hilpix; i++) {
        dot(i, 20000);
        let hilbX, hilbY;
        // [hilbX, hilbY] = h.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS

        [hilbX, hilbY] = hilDecode(i, dimension, h);

        let cursorLinear  = 4 * i ;
        let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth));
        let perc = i / hilpix;

        hilbertImage[hilbertLinear] =   255*perc; // slow ramp of red
        hilbertImage[hilbertLinear+1] = ( i % Math.round( perc * 32) ) / (perc *32) *  255; // SNAKES! crazy bio snakes.
        hilbertImage[hilbertLinear+2] = (perc *2550)%255; // creates 10 segments to show each 10% mark in blue
        hilbertImage[hilbertLinear+3] = 255; // slight edge in alpha

        if (reg) {
          paintRegMarks(hilbertLinear, hilbertImage, perc);
        }


        rgbArray[cursorLinear+0] = hilbertImage[hilbertLinear+0];
        rgbArray[cursorLinear+1] = hilbertImage[hilbertLinear+1];
        rgbArray[cursorLinear+2] = hilbertImage[hilbertLinear+2];
        rgbArray[cursorLinear+3] = hilbertImage[hilbertLinear+3];
      }

      var hilbert_img_data = Uint8ClampedArray.from(hilbertImage);
      var hilbert_img_png = new PNG({
        width: width,
        height: height,
        colorType: 6,
        bgColor: {
          red: 0,
          green: 0,
          blue: 0
        }
      })
      hilbert_img_png.data = Buffer.from(hilbert_img_data);
      let wstream = fs.createWriteStream(filenameHILBERT);
      new Promise(resolve =>
        hilbert_img_png.pack()
        .pipe(wstream)
        .on('finish', resolve));
        log("hilbert png saved");
      }

      // this will destroy the main array by first upsampling then down sampling
      function resampleByFactor(shrinkFactor) {
        let sampleClock = 0;
        let brightness = 1/shrinkFactor;
        let upsampleSize = hilbPixels[dimension] * 2; // 2X over sampling high grade y'all!
        let antiAliasArray = [ upsampleSize  * 4 ]; // RGBA needs 4 cells per pixel
        output(`Resampling linear image of size in pixels ${colClock.toLocaleString()} by the factor ${shrinkFactor} brightness per amino acid ${brightness} destination hilbert curve pixels ${hilbPixels[dimension].toLocaleString()} `);

        // BLOW LINEAR IMAGE UP DOUBLE SIZE:
        for (z = 0; z<upsampleSize; z++) { // 2x AA colClock is the number of pixels in linear
          if (z % 5000 == 0) {
            log(`z: ${z.toLocaleString()}/${upsampleSize.toLocaleString()} samples remain: ${(colClock - sampleClock).toLocaleString()}`);
          }

          let sum = z*4;
          let clk = sampleClock*4; // starts on 0

          antiAliasArray[sum+0] = rgbArray[clk+0]*brightness;
          antiAliasArray[sum+1] = rgbArray[clk+1]*brightness;
          antiAliasArray[sum+2] = rgbArray[clk+2]*brightness;
          antiAliasArray[sum+3] = rgbArray[clk+3]*brightness;

          while(sampleClock  < z*shrinkFactor) {
            // log(` z: ${z} sampleClock: ${sampleClock} shrinkFactor: ${shrinkFactor} brightness: ${brightness} hil pixels ${hilbPixels[dimension]} `);
            // output(`z: ${z}   sampleClock: ${sampleClock}`)
            clk = sampleClock*4;

            antiAliasArray[sum+0] += rgbArray[clk+0]*brightness;
            antiAliasArray[sum+1] += rgbArray[clk+1]*brightness;
            antiAliasArray[sum+2] += rgbArray[clk+2]*brightness;
            antiAliasArray[sum+3] += rgbArray[clk+3]*brightness;

            sampleClock++;
          }
          sampleClock++;
        }

        // SHRINK IT BY HALF:
        sampleClock = 0;
        for (aa = 0; aa<hilbPixels[dimension]; aa++) { // 2x AA
          let sum = z*4;
          let clk = sampleClock*4*2; // 2 X AA

          rgbArray[sum+0] = antiAliasArray[clk+0]*brightness;
          rgbArray[sum+1] = antiAliasArray[clk+1]*brightness;
          rgbArray[sum+2] = antiAliasArray[clk+2]*brightness;
          rgbArray[sum+3] = antiAliasArray[clk+3]*brightness;

          // anti-alias
          rgbArray[sum+0] += antiAliasArray[clk+4]*brightness;
          rgbArray[sum+1] += antiAliasArray[clk+5]*brightness;
          rgbArray[sum+2] += antiAliasArray[clk+6]*brightness;
          rgbArray[sum+3] += antiAliasArray[clk+7]*brightness;
          sampleClock++;
        }

      }
      function pixToMaxMagnitude(pix) { // give it pix it returns a magnitude that fits inside it
        let dim = 0;
        out(`[HILBERT] Calculating largest Hilbert curve image that can fit inside ${twosigbitsTolocale(pix)} pixels, and over sampling factor of ${overSampleFactor}: `);
        while (pix/overSampleFactor < hilbPixels[dim]) {
          if (dim % 5000 == 0 ) {
            log(` pixToMaxMagnitude [${hilbPixels[dim]}] pix ${pix}`);
          }
          dim++;
          if (dim >= maxMagnitude) {
            if (magnitude && dim > theActualMaxMagnitude ) {
              output("HELLO: This will likely exceed nodes heap memory and/or call stack. mag 11 sure does. spin up the fans.")
              dim = theActualMaxMagnitude;
            } else {
              dim = maxMagnitude;
            }
          }
        }
        if (dim>0) { dim--; } // was off by 1

        out(` <<<--- chosen magnitude: ${dim} `);
        return dim;
      }
      function dot(i, x, t) {
        if (!t) {
          t = '1';
        }
        if (i % x == 0 ) {
          out('.');
        }
      }


      function spaceTo_(str) {
        // log(str);
        if (str == undefined) {
          return "";
        } else {
          str += "";
          return str.replace(' ', '_');
        }
      }

      function replaceFilepathFileName(f) {
        return f.replace(/^.*[\\\/]/, '');
      }
      function makeRequest(url) {
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
      function output(txt) {
        if (verbose) {
          console.log(maxWidth(`[ ${(isHighlightSet ? peptide + " " : " ")}Jobs: ${howMany} genomeSize: ${genomeSize} bytes ${baseChars}  bigint ${bigIntFileSize} ${status} RunID: ${timestamp} hilbert: ${hilbPixels[dimension]}] `, 60) + " >>> " + txt);
        } else {
          // BgBlack = "\x1b[40m"
          console.log(txt);
        }
      }
      function log(txt) {
        if (verbose && devmode) {
          let d = Math.round(+new Date());
          console.log(maxWidth(`@${d} gSize ${genomeSize} ${nicePercent()} ${status} ${howMany} ${status} lock ${renderLock}] `, 60) + " >>> " + txt);
        } else if (verbose) {
          output(txt);
        }
      }

      function onError(e) {
        output('ERROR: ' + e.toString());
      }

      // remove anything that isn't ATCG, convert U to T
      function cleanChar(c) {
        char = c.toUpperCase();
        if (char == "A" || char == "C" || char == "G" || char == "T" || char == "U") {
          if (char == "U") {
            return "T"; // convert RNA into DNA
          } else {
            return char; // add it to the clean string
          }
        } else {
          return "."; // remove line breaks etc. also helps error detect codons.
        }
      }
      function removeLineBreaks(txt) {
        return txt.replace(/(\r\n\t|\n|\r\t)/gm,"");
      }
      function cleanString(s) {
        let ret = "";
        s = removeLineBreaks(s);

        for (i=0; i< s.length; i++) {
          ret += cleanChar(s.charAt(i));
        }
        return ret;
      }
      function paintPixel() {
        status = "paint";
        let byteIndex = colClock * 4; // 4 bytes per pixel. RGBA.

        rgbArray.push(Math.round(red));
        rgbArray.push(Math.round(green));
        rgbArray.push(Math.round(blue));
        rgbArray.push(Math.round(alpha));
        pixelStacking = 0;
        colClock++;
      }
      function out(t) {
        process.stdout.write(` [ ${t} ] `); // CURSOR TO TOP LEFT????
      }
      function cursorToTopLeft() {
          process.stdout.write('\x1B[0f'); // CURSOR TO TOP LEFT???? <-- best for macos
          // process.stdout.write("\033[<0>;<0>f"); // cursor to 0,0 maybe linux
          // process.stdout.write("\033[<0>;<0>H"); // pretty good
        clearCheck();
      }
      function clearCheck() {
        if (clear) {
          clearScreen();
        }
      }
      function clearScreen() {
        // console.log('\033c');
        console.log('\x1Bc');
        process.stdout.write("\x1B[2J"); // CLEAR TERMINAL SCREEN????
        process.stdout.write('\033c'); // <-- maybe best for linux? clears the screen
        // put cursor to L,C:  \033[<L>;<C>H
        // put cursor to L,C:  \033[<L>;<C>f
      }


      function prettyDate() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today  = new Date();

        return today.toLocaleString(options) + "  " + today.toLocaleDateString(options); // Saturday, September 17, 2016
      }
      function printRadMessage(array) {
        if (array == undefined) {
          array = ["__1__", "__2__", "__3__", "__4__", "__5__", "__6__", ""]
        } else if ( array.length < 6 ) {
          array.push("__@__","__@__");
        }
        console.log(terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${array[0]}`, 255, 60,  250) );          console.log(terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${array[1]}`, 170, 150, 255) );
        console.log(terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${array[2]}`, 128, 240, 240) );
        console.log(terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${array[3]}`, 225, 225, 130) );
        console.log(terminalRGB(`  ah-mee-no-see     'I See It Now - I AminoSee it!'   ${array[4]}`, 255, 180,  90) );
        console.log(terminalRGB(`   ${prettyDate()}   ${array[5]}`                 , 220, 120,  70) );
        console.log(terminalRGB(array[6], 180, 90,   50) );
      }

      function crashReport() {
        log(cleanDNA);
      }
      function calcUpdate() { // DONT ROUND KEEP PURE NUMBERS
        percentComplete = (charClock+69) / (baseChars+69); // avoid div by zero below
        let now = new Date().getTime();
        runningDuration = (now - start) + 1;
        timeElapsed = Math.round(runningDuration / 1000);
        timeRemain = Math.round(((timeElapsed + 0.001) / (percentComplete + 0.001)) - timeElapsed);
        kbRemain = (baseChars - charClock)/1000;
      }
      function getHistoCount(item, index) {
        return [ item.Codon, item.Histocount];
      }
      function whack_a_progress_on() {
        setTimeout(() => {
          calcUpdate();
          out(nicePercent());
            // var bar = new ProgressBar({
            //   schema: ':bar',
            //   total : 5000
            // });
            //
            // var iv = setInterval(function () {
            //   calcUpdate();
            //   bar.update(percentComplete*1000);           // bar.tick();
            //
            //   if (bar.completed) {
            //     clearInterval(iv);
            //   }
            // }, 200);
            // return bar;

        }, 1000);
      }
      function onesigbitTolocale(num){
        return (Math.round(num*10)/10).toLocaleString();
      }
      function twosigbitsTolocale(num){
        return (Math.round(num*100)/100).toLocaleString();
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
      function fixedWidth(str, wide) {
        return minWidth(maxWidth(str, wide), wide);
      }
      function maxWidth(str, wide) { // shorten it if you need to
        while(str.length > wide) { str = str.substring(0,wide) }
        return str;
      }
      function minWidth(str, wide) { // make it wider
        while(str.length <= wide) { str = " " + str }
        return str;
      }
      function drawHistogram() {
        if (updates == false) {
          status = "Stats display disabled ";
          return status;
        }

        calcUpdate();

        let codonsPerSec = Math.round( (genomeSize+1) / (runningDuration*1000) );
        let bytesPerSec = Math.round( (charClock+1) / runningDuration*1000 );
        let text = " ";
        let aacdata = [];
        let abc = pepTable.map(getHistoCount).entries();

        if (msPerUpdate < maxMsPerUpdate) {
          msPerUpdate += 50; // updates will slow over time on big jobs
        }

        // OPTIMISE i should not be creating a new array each frame!
        for (h=0;h<pepTable.length;h++) {
          aacdata[pepTable[h].Codon] = pepTable[h].Histocount ;
        }
        // aacdata = abc;


        let array = [
          `File: ${chalk.rgb(255, 255, 255).inverse(justNameOfDNA.toUpperCase())}.${extension} `,
          `Done: ${chalk.rgb(128, 255, 128).inverse(nicePercent())} % Elapsed:${ fixedWidth( twosigbitsTolocale(timeElapsed), 4) } Remain:${ fixedWidth( twosigbitsTolocale(timeRemain),4) } sec `,
          `@i${fixedWidth( charClock.toLocaleString(), 11)} Lines:${ fixedWidth( breakClock.toLocaleString(),7)} Filesize:${fixedWidth( bytes(baseChars), 8)}`,
          `Next update: ${fixedWidth( msPerUpdate.toLocaleString(), 5)}ms Codon Opacity: ${twosigbitsTolocale(opacity*100)}% `,
          `CPU:${fixedWidth( bytes(bytesPerSec), 10)}/s${fixedWidth( Math.round(codonsPerSec).toLocaleString(),5)}tps Acids/pixel: ${twosigbitsTolocale(codonsPerPixel)} Pixels:${fixedWidth(colClock.toLocaleString(),11)}`,
          `[ Codons: ${genomeSize.toLocaleString()} Last Acid: ${chalk.rgb(red, green, blue)(aminoacid)} ${ ( isHighlightSet ? "Highlight: " + chalk.rgb(255, 255, 0).inverse(peptide) : "" )} Files left: ${howMany}`,
          `[ Sample: ${ fixedWidth(cleanString(rawDNA), 60) } ${showFlags()} ]`];

          clearCheck();
          cursorToTopLeft();
          printRadMessage(array);
          if (status == "save") {
            log("saving");
          } else {
            console.log(histogram(aacdata, { bar: '/', width: 40, sort: true, map:  aacdata.Histocount} ));
            output(interactiveKeysGuide);
          }

          if (status == "paint" || updates) {
            updatesTimer = setTimeout(() => {
              drawHistogram(); // MAKE THE HISTOGRAM AGAIN LATER
            }, msPerUpdate);
          } else {
            clearTimeout(updatesTimer);
          }
          return text;
        }


        function isTriplet(array) {
          return array.DNA == currentTriplet;
          // return dnaTriplets.find(isTriplet).Hue;
        }
        function isHighlightTriplet(array) {
          return array.DNA == triplet;
        }
        function isCurrentPeptide(pep) {
          // return p.Codon == peptide || p.Codon == triplet;
          return pep.Codon.toLowerCase() == peptide.toLowerCase();
        }
        function isStartCodon(pep) {
          return pep.Codon == "Methionine";
        }
        function isStopCodon(pep) {
          return (pep.Codon == "Amber" || pep.Codon == "Ochre" || pep.Codon == "Opal" );
        }
        function isStartTOTAL(pep) {
          return (pep.Codon == "Start Codons" )
        }
        function isStopTOTAL(pep) {
          return (pep.Codon == "Stop Codons" )
        }
        function isNoncoding(pep) {
          return pep.Codon == "Non-coding NNN"
        }
        function isPeptide(pep) {
          return pep.Codon == peptide
        }
        function isDirtyPep(dirtyString) {
          log(`your dirty string: ${dirtyString.substring(0,4).toUpperCase()}`);
          return pepTable => pepTable.Codon.substring(0,4).toUpperCase() === dirtyString.substring(0,4).toUpperCase();
        }
        function isNormalPep(normalpep) {
          // output(`your normalpep ${normalpep.toUpperCase()}`);
          return pepTable => pepTable.Codon.toUpperCase() === normalpep.toUpperCase();
        }
        function isNormalTriplet(normaltrip) {
          // output(`your normalpep ${normalpep.toUpperCase()}`);
          return dnaTriplets => dnaTriplets.DNA.toUpperCase() === normaltrip.toUpperCase();
        }
        function nicePercent() {
          return fixedWidth( (Math.round(percentComplete*1000) / 10) + "%");
        }
        function tidyTripletName(str) {
          let clean = "none";
          currentTriplet = str;
          clean = dnaTriplets.find(isNormalTriplet(str)).DNA.toUpperCase();
          if ( clean == undefined ) {
            clean = "none";
          } else {
            // clean = spaceTo_( clean.Codon );
          }
          log(`isDirtyPep(${str}) ${isDirtyPep(str)} clean: ${clean}`)
          if (clean) {
            return clean;
          } else {
            return "none";
          }
        }
        function tidyPeptideName(str) {
          currentPeptide = str;
          let clean = "none";
          try {
            clean = pepTable.find(isNormalPep(str)).Codon;
          } catch(e) {
            output("tidyPeptideName " + clean)
            if ( clean == undefined ) {
              clean = pepTable.find(isDirtyPep(str));
              if ( clean == undefined ) {
                clean = "none";
              }
            }
          }
          clean = spaceTo_( clean );
          log(`isDirtyPep(${str}) ${isDirtyPep(str)} clean: ${clean}`)
          if (clean) {
            return clean;
          } else {
            return "none";
          }
        }
        function tripletToCodon(str) {
          currentTriplet = str;
          return dnaTriplets.find(isTriplet).DNA;
        }
        function tripletToHue(str) {
          console.warn(str);
          currentTriplet = str;
          // let hue = dnaTriplets.find(  (dna, str) => {dna.DNA == str}).Hue;
          let hue = dnaTriplets.find(isTriplet).Hue;
          if (hue) {
            return hue
          } else {
            return 120
          }
          return 120
        }
        function peptideToHue(str) {
          console.warn(`str ${str}`);
          let r = pepTable.find( (pep) => { pep.Codon == str });
          console.warn(r);
          return r.Hue;
        }
        function getCodonIndex(str) {
          return pepTable.indexOf(str)
        }
        function getTripletIndex(str) {
          return dnaTriplets.indexOf( str )
        }
        // *
        // take 3 letters, convert into a Uint8ClampedArray with 4 items
        function codonToRGBA(cod) {
          // log(cod);
          aminoacid = "ERROR";
          currentTriplet = cod;
          let theMatch = dnaTriplets.find(isTriplet).DNA
          // out(theMatch);
          for (z=0; z<dnaTriplets.length; z++) {
            if (cod == dnaTriplets[z].DNA) { // SUCCESSFUL MATCH (convert to map)
              aminoacid = dnaTriplets[z].Codon;
              dnaTriplets[z].Histocount++;

              for (h=0; h<pepTable.length; h++) {

                if (aminoacid == pepTable[h].Codon) {
                  pepTable[h].Histocount++;

                  if (aminoacid == "Amber" || aminoacid == "Ochre" || aminoacid == "Opal" ) {
                    // pepTable[ pepTable.indexOf("Stop Codons")].Histocount++;

                  } else if (aminoacid == "Methionine") {

                    // pepTable[pepTable.find(isStartTOTAL)].Histocount++;
                  }
                  break
                }
              }

              let hue = dnaTriplets[z].Hue / 360;
              let tempcolor = hsvToRgb(hue, 1, 1);
              // RED, GREEN, BLUE, ALPHA
              red   = tempcolor[0];
              green = tempcolor[1];
              blue  = tempcolor[2];

              if (isHighlightSet) {

                if (aminoacid == peptide ) {
                  alpha = 255;
                  // log(`isHighlightSet    ${isHighlightSet}   aminoacid ${aminoacid}  peptide ${peptide}`)

                  // log(alpha);
                } else {
                  alpha = 0;
                  // log(alpha);

                }
              } else {
                alpha = 255; // only custom peptide pngs are transparent
              }

              spewClock++;
              if (spew && spewClock > spewThresh) {
                let c = aminoacid.charAt(0) | ".";
                // log(terminalRGB(c, red, green, blue));
                if(colClock % 20 ==0 ){
                  out(` [ ${colClock} ] `);
                  output(terminalRGB(rawDNA + " ", 64, 128, 64));
                  out(" ");
                }
                spewClock = 0;
              }
              return [red, green, blue, alpha];
            }
          }
          if ( aminoacid == "ERROR" ) {
            aminoacid = "ERROR " + cod;
            CRASH = true;
          } else {
            CRASH = false;

          }
          // return [13,255,13,128]; // this colour means "ERROR".
          return [0,0,0,0]; // this colour means "ERROR".
        }


        function terminalRGB(_text, _r, _g, _b) {
          return chalk.rgb(_r,_g,_b)(_text);
          // BgBlack = "\x1b[40m"
          if (_r+_g+_b >= 256.0) {
            _text += "\x1b[44m"; // add some black background if its a light colour
          }
          // BgBlue = "\x1b[44m"

          return "\x1b[38;2;" + _r + ";" + _g + ";" + _b + "m" + _text + "\x1b[0m";
        };

        let dnaTriplets = [
          {
            "DNA": "AAA",
            "Codon": "Lysine",
            "Hue": 313,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AAC",
            "Codon": "Asparagine",
            "Hue": 266,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AAG",
            "Codon": "Lysine",
            "Hue": 313,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AAT",
            "Codon": "Asparagine",
            "Hue": 266,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ACA",
            "Codon": "Threonine",
            "Hue": 219,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ACC",
            "Codon": "Threonine",
            "Hue": 219,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ACG",
            "Codon": "Threonine",
            "Hue": 219,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ACT",
            "Codon": "Threonine",
            "Hue": 219,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AGA",
            "Codon": "Arginine",
            "Hue": 297,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AGC",
            "Codon": "Serine",
            "Hue": 203,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AGG",
            "Codon": "Arginine",
            "Hue": 297,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "AGT",
            "Codon": "Serine",
            "Hue": 203,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ATA",
            "Codon": "Isoleucine",
            "Hue": 157,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ATC",
            "Codon": "Isoleucine",
            "Hue": 157,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "ATG",
            "Codon": "Methionine",
            "Hue": 110,
            "Alpha": 1,
            "Histocount": 0,
          },
          {
            "DNA": "ATT",
            "Codon": "Isoleucine",
            "Hue": 157,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CAA",
            "Codon": "Glutamine",
            "Hue": 250,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CAC",
            "Codon": "Histidine",
            "Hue": 329,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CAG",
            "Codon": "Glutamine",
            "Hue": 250,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CAT",
            "Codon": "Histidine",
            "Hue": 329,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CCA",
            "Codon": "Proline",
            "Hue": 344,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CCC",
            "Codon": "Proline",
            "Hue": 344,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CCG",
            "Codon": "Proline",
            "Hue": 344,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CCT",
            "Codon": "Proline",
            "Hue": 344,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CGA",
            "Codon": "Arginine",
            "Hue": 297,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CGC",
            "Codon": "Arginine",
            "Hue": 297,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CGG",
            "Codon": "Arginine",
            "Hue": 297,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CGT",
            "Codon": "Arginine",
            "Hue": 297,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CTA",
            "Codon": "Leucine",
            "Hue": 141,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CTC",
            "Codon": "Leucine",
            "Hue": 141,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CTG",
            "Codon": "Leucine",
            "Hue": 141,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "CTT",
            "Codon": "Leucine",
            "Hue": 141,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GAA",
            "Codon": "Glutamic acid",
            "Hue": 16,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GAC",
            "Codon": "Aspartic acid",
            "Hue": 31,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GAG",
            "Codon": "Glutamic acid",
            "Hue": 16,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GAT",
            "Codon": "Aspartic acid",
            "Hue": 31,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GCA",
            "Codon": "Alanine",
            "Hue": 94,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GCC",
            "Codon": "Alanine",
            "Hue": 94,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GCG",
            "Codon": "Alanine",
            "Hue": 94,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GCT",
            "Codon": "Alanine",
            "Hue": 94,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GGA",
            "Codon": "Glycine",
            "Hue": 78,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GGC",
            "Codon": "Glycine",
            "Hue": 78,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GGG",
            "Codon": "Glycine",
            "Hue": 78,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GGT",
            "Codon": "Glycine",
            "Hue": 78,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GTA",
            "Codon": "Valine",
            "Hue": 125,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GTC",
            "Codon": "Valine",
            "Hue": 125,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GTG",
            "Codon": "Valine",
            "Hue": 125,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "GTT",
            "Codon": "Valine",
            "Hue": 125,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TAA",
            "Codon": "Ochre",
            "Hue": 0,
            "Alpha": 1,
            "Histocount": 0,
          },
          {
            "DNA": "TAC",
            "Codon": "Tyrosine",
            "Hue": 282,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TAG",
            "Codon": "Amber",
            "Hue": 47,
            "Alpha": 1,
            "Histocount": 0,
          },
          {
            "DNA": "TAT",
            "Codon": "Tyrosine",
            "Hue": 282,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TCA",
            "Codon": "Serine",
            "Hue": 203,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TCC",
            "Codon": "Serine",
            "Hue": 203,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TCG",
            "Codon": "Serine",
            "Hue": 203,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TCT",
            "Codon": "Serine",
            "Hue": 203,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TGA",
            "Codon": "Opal",
            "Hue": 240,
            "Alpha": 1,
            "Histocount": 0,
          },
          {
            "DNA": "TGC",
            "Codon": "Cysteine",
            "Hue": 63,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TGG",
            "Codon": "Tryptophan",
            "Hue": 188,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TGT",
            "Codon": "Cysteine",
            "Hue": 63,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TTA",
            "Codon": "Leucine",
            "Hue": 141,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TTC",
            "Codon": "Phenylalanine",
            "Hue": 172,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TTG",
            "Codon": "Leucine",
            "Hue": 141,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "TTT",
            "Codon": "Phenylalanine",
            "Hue": 172,
            "Alpha": 0.1,
            "Histocount": 0,
          },
          {
            "DNA": "NNN",
            "Codon": "Non-coding",
            "Hue": 120,
            "Alpha": 1.0,
            "Histocount": 0,
          },
          {
            "DNA": "",
            "Codon": "NoMatchError",
            "Hue": 120,
            "Alpha": 0,
            "Histocount": 0,
          }
        ]
        ;
        /*
        ***************************************
        ***************************************
        ***************************************
        */


        /**
        * Converts an RGB color value to HSL. Conversion formula
        * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
        * Assumes r, g, and b are contained in the set [0, 255] and
        * returns h, s, and l in the set [0, 1].
        *
        * @param   Number  r       The red color value
        * @param   Number  g       The green color value
        * @param   Number  b       The blue color value
        * @return  Array           The HSL representation
        */
        function rgbToHsl(r, g, b) {
          r /= 255, g /= 255, b /= 255;

          var max = Math.max(r, g, b), min = Math.min(r, g, b);
          var h, s, l = (max + min) / 2;

          if (max == min) {
            h = s = 0; // achromatic
          } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
          }

          return [ h, s, l ];
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
        function hslToRgb(h, s, l) {
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

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
          }

          return [ r * 255, g * 255, b * 255 ];
        }

        /**
        * Converts an RGB color value to HSV. Conversion formula
        * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
        * Assumes r, g, and b are contained in the set [0, 255] and
        * returns h, s, and v in the set [0, 1].
        *
        * @param   Number  r       The red color value
        * @param   Number  g       The green color value
        * @param   Number  b       The blue color value
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
        function isRawRGBAData(obj) {
          return (
            obj &&
            typeof obj === 'object' &&
            typeof obj.width === 'number' &&
            typeof obj.height === 'number' &&
            (Buffer.isBuffer(obj.data) ||
            obj.data instanceof Uint8Array ||
            (typeof Uint8ClampedArray === 'function' &&
            obj.data instanceof Uint8ClampedArray)) &&
            (obj.data.length === obj.width * obj.height * 4 ||
              obj.data.length === obj.width * obj.height * 3)
            );
          }


          //PARSE SOURCE CODE
          // https://www.npmjs.com/package/parse-apache-directory-index

          function testParse() {
            console.log(parse(`
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






            let pepTable   = [
              {
                "Codon": "Non-coding NNN",
                "Description": "Expressed as NNN Codon",
                "Hue": 120,
                "Alpha": 0,
                "Histocount": 0,
              },
              {
                "Codon": "Ochre",
                "Description": "STOP Codon",
                "Hue": 0,
                "Alpha": 1,
                "Histocount": 0,
              },
              {
                "Codon": "Glutamic acid",
                "Description": "Group III: Acidic amino acids",
                "Hue": 16,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Aspartic acid",
                "Description": "Group III: Acidic amino acids",
                "Hue": 31,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Amber",
                "Description": "STOP Codon",
                "Hue": 47,
                "Alpha": 1,
                "Histocount": 0,
              },
              {
                "Codon": "Cysteine",
                "Description": "Group II: Polar, uncharged amino acids",
                "Hue": 63,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Glycine",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 78,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Alanine",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 94,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Methionine",
                "Description": "START Codon",
                "Hue": 110,
                "Alpha": 1,
                "Histocount": 0,
              },
              {
                "Codon": "Valine",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 125,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Leucine",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 141,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Isoleucine",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 157,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Phenylalanine",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 172,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Tryptophan",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 188,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Serine",
                "Description": "Group II: Polar, uncharged amino acids",
                "Hue": 203,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Threonine",
                "Description": "Group II: Polar, uncharged amino acids",
                "Hue": 219,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Opal",
                "Description": "STOP Codon",
                "Hue": 240,
                "Alpha": 1,
                "Histocount": 0,
              },
              {
                "Codon": "Glutamine",
                "Description": "Group II: Polar, uncharged amino acids",
                "Hue": 250,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Asparagine",
                "Description": "Group II: Polar, uncharged amino acids",
                "Hue": 266,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Tyrosine",
                "Description": "Group II: Polar, uncharged amino acids",
                "Hue": 282,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Arginine",
                "Description": "Group IV: Basic amino acids",
                "Hue": 297,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Lysine",
                "Description": "Group IV: Basic amino acids",
                "Hue": 313,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Histidine",
                "Description": "Group IV: Basic amino acids",
                "Hue": 329,
                "Alpha": 0.1,
                "Histocount": 0,
              },
              {
                "Codon": "Start Codons",
                "Description": "Count of Methionine",
                "Hue": 120,
                "Alpha": 0.0,
                "Histocount": 0,
              },
              {
                "Codon": "Stop Codons",
                "Description": "One of Opal, Ochre, or Amber",
                "Hue": 120,
                "Alpha": 0.0,
                "Histocount": 0,
              },
              {
                "Codon": "Proline",
                "Description": "Group I: Nonpolar amino acids",
                "Hue": 344,
                "Alpha": 0.1,
                "Histocount": 0,
              }
            ]
            ;
            const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by peptide.`;

            const radMessage =
            terminalRGB(`
              ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
              ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
              ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
              by Tom Atkinson          aminosee.funk.nz
              ah-mee no-see         "I See It Now - I AminoSee it!"
              `, 96, 64, 245);

              const lineBreak = `
              `;
// “I have not failed. I've just found 10,000 ways that won't work.”



// source: https://gist.github.com/rjz/9501304

// Depends on `through`
//
//     $ npm install through
//
// Usage:
//
//     $ echo 'hello' | node stdin-and-fs-stream.js
//     $ echo 'hello' > tmp && node stdin-and-fs-stream.js tmp

// let fs = require('fs'),
// let through = require('through');
//
// var tr = through(function (buf) {
//   console.log(` [process.argv.length: ${process.argv.length}  process.argv[2]: ${process.argv[2]} ] buf.toString(): ${buf.toString()} `);
// });
//
//
// var stream;
//
// if (process.argv.length > 2) {
//   stream = fs.createReadStream(process.argv[2]);
// }
// else {
//   stream = process.stdin;
//   setImmediate(function () {
//     stream.push(null);
//   });
// }

// stream.pipe(tr).pipe(process.stdout);
