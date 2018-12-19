
// "use strict";
//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.nz
//        ah-mee no-see       "I See It Now - I AminoSee it!"
let raceDelay = 66;
let raceTimer = false;
let linearMagnitudeMax = 10; // magnitude is the size of upper limit for linear render to come *under*
let dimension = 7; // dimension is the -1 size the hilbert projection is be downsampled to
const maxMagnitude = 8; // max for auto setting
const theActualMaxMagnitude = 12; // max for auto setting
let darkenFactor = 0.65;
let highlightFactor = 4.5;
const defaultC = 1; // back when it could not handle 3+GB files.
const artisticHighlightLength = 18; // px only use in artistic mode. must be 6 or 12 currently
let spewThresh = 1000;
let devmode = false; // kills the auto opening of reports etc
let verbose = false; // not recommended. will slow down due to console.
let force = false; // force overwrite existing PNG and HTML reports
let artistic = false; // for Charlie
let spew = false; // firehose your screen with DNA
let report = true; // html reports
let test = false;
const overSampleFactor = 1.0;
let updates = false;
let clear;
const maxMsPerUpdate = 12000; // milliseconds per update
let msPerUpdate = 200; // milliseconds per update
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ]; // 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
let widthMax = 960;
let es = require('event-stream');
const minimist = require('minimist')
const highland = require('highland')
const fetch = require("node-fetch");
const path = require('path');
const opn = require('opn');
const parse = require('parse-apache-directory-index');
let fs = require("fs");
let request = require('request');
let histogram = require('ascii-histogram');
let bytes = require('bytes');
let Jimp = require('jimp');
let PNG = require('pngjs').PNG;
let ProgressBar = require('ascii-progress');
const chalk = require('chalk');
const clog = console.log;
var os = require("os");
const hostname = os.hostname();
const util = require('util');
const appPath = require.main.filename;
let highlightTriplets = [];
let isHighlightSet = false;
let isHilbertPossible = true; // set false if -c flags used.
process.title = "aminosee.funk.nz";
const defaultFilename = "AminoSeeTestPatterns"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
let filename = defaultFilename;
let rawDNA ="@"; // debug
const extensions = [ "txt", "fa", "mfa", "gbk", "dna", "fasta", "fna", "fsa", "mpfa", "gb"];
let status = "load";
console.log("Amino\x1b[40mSee\x1b[37mNoEvil");
let interactiveKeysGuide = "";
let renderLock = false;
let keyboard, filenameTouch, maxpix, estimatedPixels, args, filenamePNG, extension, reader, hilbertPoints, herbs, levels, progress, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, textFile, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, fileUploadShowing, testColors, chunksMax, chunksize, chunksizeBytes, baseChars, cpu, subdivisions, contextBitmap, aminoacid, colClock, start, updateClock, percentComplete, kBytesPerSec, pixelStacking, isHighlightCodon, justNameOfDNA, justNameOfPNG, justNameOfHILBERT, sliceDNA, filenameHTML, howMany, timeRemain, runningDuration, kbRemain, width, triplet, updatesTimer, pngImageFlags;
let codonsPerPixel, CRASH, cyclesPerUpdate, red, green, blue, alpha, charClock, errorClock, breakClock, streamLineNr, genomeSize, filesDone, spewClock, opacity, codonRGBA, geneRGBA, currentTriplet, progato, shrinkFactor, reg, image;

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


var keypress = require('keypress');
function setupKeyboardUI() {
  interactiveKeysGuide += `
  Interactive control:    D            (devmode)  Q   (graceful quit next save)
  V       (verbose mode)  S (spew DNA to screen)  Control-C      (instant quit)
  F      (Overwrite png)  W        (wipe screen)  U       (stats update on/off)`;

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
      printRadMessage(["_@__", "____", "____", "____", "____", "____", "____"]);
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
      printRadMessage();
      // updates = false;
      args = [];
      howMany = 0;
      calcUpdate();
      // whack_a_progress_on();
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
    if (key && key.name == 't') {
      saveHilbert();
    }
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
  welcomeMessage();
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
    default: { clear: true, updates: true },
    '--': true
  });


  if (args.keyboard || args.k) {
    keyboard = true;
    output(`interactive keyboard mode enabled`)
    if (keyboard) {
      // output("skipped setupKeyboardUI() ");
      setupKeyboardUI()
    }
  } else {
    log(`interactive keyboard mode not enabled`)
    keyboard = false;
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
      output(`using regmarks`)
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

  if (args.magnitude || args.m) {
    if (isHilbertPossible) {
      magnitude = Math.round(args.magnitude || args.m);
      if (magnitude < 1 || magnitude > theActualMaxMagnitude) {
        linearMagnitudeMax = magnitude;
        output("Magnitude must be an odd number between 1 and 9.");
      } else if (magnitude > 7) {
        output(`Magnitude 8 requires 700 mb ram and takes a while`);
      } else if (magnitude > 8) {
        output(`This will give your machine quite a hernia. It's in the name of science but.`);
        output(`On my machine, magnitude 8 requires 1.8 GB of ram and 9+ crashes nodes heap and 10+ crashes the max call stack, so perhaps this will run OK in the 2020 AD`);
      } else if (magnitude == 2 || magnitude == 4 || magnitude ==6 || magnitude == 8 ||magnitude == 10) {
        magnitude--;
        output(`Until I implement rotation for the hilbert it's odd numbered dimensions only`)
      }
    } else {
      output("Can't set magnitude and codons per pixel at the same time. Remove your -c option to set magnitude")
    }
    linearMagnitudeMax = magnitude;
  } else {
    magnitude = false;
    linearMagnitudeMax = maxMagnitude;
    log(`mag is false`)
  }

  log(`linearMagnitudeMax: ${linearMagnitudeMax}`);
  maxpix = hilbPixels[ linearMagnitudeMax ];


  log(`using linearMagnitudeMax ${linearMagnitudeMax} for ${maxpix} px max`);

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
    ratio = "sqr";
  }
  log("using ${ratio} aspect ratio");

  if (args.triplet || args.t) {
    triplet = args.triplet || args.t;
    triplet = triplet.toUpperCase();
    let tempColor = codonToRGBA(triplet);
    let tempHue = tripletToHue(triplet);
    if (tempColor != [13, 255, 13, 255]){ // this colour is a flag for error
      output(`Found ${triplet} with colour: ${tempHue}`);
    } else {
      output(`Error could not lookup triplet: ${triplet}`);
      triplet = "none";
    }

    output(`Custom triplet ${triplet} set. Will highlight these codons, they are Hue ${tripletToHue(triplet)}° in colour`);
  } else {
    log(`No custom triplet chosen. (default)`);
    triplet = "none";
  }
  if (args.peptide || args.p) {
    users = args.peptide || args.p;

    output(` users peptide: ${users}`);

    peptide = tidyPeptideName(users).Codon;

    if (peptide != "none") { // this colour is a flag for error
      output(`Found:${users} SUCCESS`);
    } else {
      output(`ERROR could not lookup peptide: ${users}`);
      // peptide = users;
      output(`using ${peptide}`);
    }

    output(`Custom peptide ${peptide} set. Will highlight these codons`);
  } else {
    log(`No custom peptide chosen. (default)`);
    peptide = "none";
    triplet = "none";
    log(tidyPeptideName());
  }
  if ( peptide == "none" && triplet == "none") {
    // DISABLE HIGHLIGHTS
    darkenFactor = 1.0;
    highlightFactor = 1.0; // set to zero to i notice any bugs
    isHighlightSet = false;
  } else {
    isHighlightSet = true;
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
    output("will open html");
    openHtml = true;
  } else {
    openHtml = false;
  }
  if (args.spew || args.s) {
    output("spew mode enabled.");
    spew = true;
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

  mkdir('calibration');
  mkdir('output');

  log(args);
  let cmd = args._[0];
  log(args._);
  howMany = args._.length ;

  if (args.test) {
    test = true;
    output("output test patterns");
    updates = true;
    pngImageFlags = "_test_pattern";
    setTimeout(() => {
      // printRadMessage();
      generateTestPatterns();
    }, raceDelay);
  } else {
    test = false;
  }


  //
  // log("howMany: " + howMany+ " cmd: " + cmd)
  // if (howMany > 0) {
  //   filename = path.resolve(args._[0]);
  // } else {
  //   log("try using aminosee * in a directory with DNA")
  //   // quit();
  // setTimeout(() => {
  //   // printRadMessage();
  //   // quit();
  // }, 69);
  // }
  switch (cmd) {
    case 'unknown':
    output(` [unknown argument] ${cmd}`);
    break;

    case 'serve':
    launchNonBlockingServer();
    break;

    case 'help':
    helpCmd(args);
    break;

    case 'tick':
    createTick();
    break

    case 'list':
    listDNA();
    break

    default:
    if (cmd == undefined) {
      status = "no command";
      log("try using aminosee * in a directory with DNA")
      // setTimeout(() => {
      //   output("try using aminosee * in a directory with DNA")
      //
      //   quit(1);
      // }, 20000);
      return true;
    } else {
      pollForStream();
      return true;
    }
    status = "leaving switch";
    log(status)
  }
  status = "global";
  log(status)
}
function listDNA() {

  testParse();

  // output( parse( "dna" ))
}
function aPeptideCodon(a) {
  // console.log(a);
  return a.Codon.toUpperCase().substring(0, 4) == peptide.toUpperCase().substring(0, 4);
}
function tidyPeptideName(str) {
  // let clean = pepTable.find((pep) => { pep.Codon.toUpperCase() == str.toUpperCase() } );

  peptide = str;
  let clean = dnaTriplets.find(isCurrentPeptide);

  log(clean);
  if (clean) {
    return clean;
  } else {
    return "none";
  }
}
function pepToColor(pep) {
  let temp = peptide;
  peptide = pep; // aPeptideCodon depends on this global
  let clean = pepTable.filter(aPeptideCodon);
  if (clean.length > 0 ) {
    return hsvToRgb(clean[0].Hue, 0.5, 1.0);
  } else {
    return [0,0,0,0];
  }
}
function pollForStream() {
  log(".polling.");

  if (renderLock) {
    raceTimer = setTimeout(() => {
      log(`raceDelay inside pollForStream`)
      calcUpdate();
      printRadMessage(["POLLING", "Render", filename, "Now", "RENDER", "LOCKED", percentComplete]);
      pollForStream();

    }, raceDelay);

    return true;
  }
  if (!args.updates) {
    updates = false;
  } else {
    // drawHistogram();
  }
  if (howMany < 1) {
    output("");
    // quit();
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

  if (status == "removelocks" || status == "polling") {
  }
  if (current == undefined) {
    // quit()
    return false;
  }
  status = "polling";
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
      output("statSync: false " + filename)
      theSwitcher(false);
      return false;
    }
  } catch(err) {
    console.warn(err);
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

    baseChars = getFilesizeInBytes(filename);
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

    baseChars = getFilesizeInBytes(filename);
    autoconfCodonsPerPixel();
    status ="polling";
    setupFNames();

    touchLockAndStartStream(filenameTouch); // <--- THIS IS WHERE RENDER STARTS
    return true;
  } else  {
    status = "polling"
    log(howMany);
    if (howMany > 0 ) {
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
  log(status.toUpperCase());
  start = new Date().getTime();
  timeRemain, runningDuration, charClock, percentComplete, genomeSize, colClock, opacity = 0;
  msPerUpdate = 200;
  codonRGBA, geneRGBA, mixRGBA = [0,0,0,0]; // codonRGBA is colour of last codon, geneRGBA is temporary pixel colour before painting.
  codonsPerPixel = defaultC; //  one codon per pixel maximum
  CRASH = false; // hopefully not
  msPerUpdate = 200; // milliseconds per  update
  cyclesPerUpdate = 100; // start valuue only this is auto tuneded to users computer speed based on msPerUpdate
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
  log(` [ func parm: ${f} ]`);
  log(` [ cli parameter: ${filename} ]`);
  log(` [ canonical:     ${justNameOfDNA} ]`);

  // if (getFilesizeInBytes(f) == -1) {
  //   log("Problem with file.");
  //   return false;
  // } else {
  //   baseChars = getFilesizeInBytes(f);
  // }
  extension = getLast5Chars(f);
  log("[FILESIZE] " + baseChars.toLocaleString() + " extension: " + extension);


  percentComplete = 0;
  genomeSize = 0; // number of codons.
  pixelStacking = 0; // how we fit more than one codon on each pixel
  colClock = 0; // which pixel are we painting?
  timeRemain = 0;
  output("STARTING RENDER");

  if (updatesTimer) {
    clearTimeout(updatesTimer);
  }


  if (updates == true) {
    drawHistogram();
  } else {
    // progato = whack_a_progress_on();
  }

  var s = fs.createReadStream(filename).pipe(es.split()).pipe(es.mapSync(function(line){
    status = "stream";

    // pause the readstream
    s.pause();
    streamLineNr++;
    // process line here and call s.resume() when rdy
    // function below was for logging memory usage
    status = "paint";
    if( percentComplete > 99 && streamLineNr % 1000 == 0 ) {
      log("somethings not right: " + percentComplete + " %   streamLineNr: " + streamLineNr + filename + this);
    }
    processLine(line);
    // resume the readstream, possibly from a callback
    s.resume();
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
    return saveDocuments();
  }));




  log("FINISHED INIT");
}
function showFlags() {
  return `${(  force ? "F" : "-"    )}${(  args.updates || args.u ? `U` : "-"    )}${(  userCPP != -1 ? `C${userCPP}` : "--"    )}${(  args.keyboard || args.k ? `K` : "-"    )}${(  args.spew || spew ? `K` : "-"    )}${( verbose ? "V" : "-"  )}${(  artistic ? "A" : "-"    )}${(  args.ratio || args.r ? `${ratio}` : "---"    )}${(  args.magnitude || args.m ? `M${magnitude}` : "--"    )}`;
  // chalk.rgb(255, 255, 255).inverse(justNameOfDNA.toUpperCase())
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
  Hilbert Curve Pixels: ${hilbPixels[dimension]}`;
}
function renderSummary() {
  return `
  Filename: <b>${justNameOfDNA}</b>
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
  CharClock: ${charClock.toLocaleString()}
  Codons per pixel: ${twosigbitsTolocale(codonsPerPixel)} integer
  Pixels: ${colClock.toLocaleString()} (colClock)
  Linear scale down:  ${twosigbitsTolocale(shrinkFactor)}
  overSampleFactor: ${twosigbitsTolocale(overSampleFactor)}
  Shrink Factor: ${twosigbitsTolocale(shrinkFactor)}
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
  if ( userCPP != -1) {
    output(`Manual zoom level override enabled at: ${userCPP} codons per pixel.`);
    codonsPerPixel = userCPP;
  } else {
    log("Automatic codons per pixel setting")

    baseChars = getFilesizeInBytes(filename);
    let existing = userCPP;
    estimatedPixels = baseChars / 3; // divide by 4 times 3
    let computersGuess = pixToMagnitude(estimatedPixels); // give it pixels it gives magnitude
    log(`image estimatedPixels ${estimatedPixels}   computersGuess ${computersGuess}  linearMagnitudeMax ${linearMagnitudeMax}`)

    if (codonsPerPixel < defaultC) {
      codonsPerPixel = defaultC;
    } else if (codonsPerPixel > 6000) {
      codonsPerPixel = 6000;
    } else if (codonsPerPixel == NaN || codonsPerPixel == undefined) {
      codonsPerPixel = defaultC;
    }

    if (magnitude != undefined) {
      if ( magnitude < computersGuess) {
        log(`It mite be possible to get higher resolution with --magnitude ${computersGuess}`)
      } else if ( magnitude < computersGuess ) {
        log(`Your --magnitude of ${magnitude} is larger than my default of ${computersGuess}`)
      }
    } else {
      if ( magnitude < computersGuess) {
        log(`It mite be possible to get higher resolution with --magnitude ${computersGuess}`)
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

    log(`linearMagnitudeMax: ${linearMagnitudeMax}`);
    maxpix = hilbPixels[ linearMagnitudeMax ];

    log(`magnitude is ${magnitude} new maxpix: ${maxpix} `)
    if (estimatedPixels < (maxpix) ) { // for sequence smaller than the screen
      if (userCPP != -1)  {
        log("its not recommended to use anything other than --codons 1 for small genomes, better to reduce the --magnitude")
      } else {
        codonsPerPixel = defaultC; // normally we want 1:1 for smalls
      }
    } else if (estimatedPixels > maxpix ){ // for seq bigger than screen        codonsPerPixel = estimatedPixels / maxpix*overSampleFactor;
      codonsPerPixel = (estimatedPixels * overSampleFactor) / maxpix;
      if (userCPP != -1) {
        if (userCPP < codonsPerPixel) {
          log(terminalRGB(`WARNING: Your target Codons Per Pixel setting ${userCPP} will make an estiamted ${Math.round(estimatedPixels / userCPP).toLocaleString()} is likely to exceed the max image size of ${maxpix.toLocaleString()}, sometimes this causes an out of memory error. My machine spit the dummy at 1.7 GB of virtual memory use by node, lets try yours. We reckon ${codonsPerPixel} would be better but will give it a try...`))
        } else {
          codonsPerPixel = userCPP; // they picked a smaller size than me. therefore their computer less likely to melt.
        }
      }
    }
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
  log(`triplet ${triplet}  peptitde ${peptide}`)

  if ( triplet == "none" && peptide == "none") {
    return ret;
  } else if ( triplet != "none" ) {
    ret += `_${removeSpacesForFilename(triplet).toLowerCase()}`
  }
  if (peptide != "none") {
    ret += `_${removeSpacesForFilename(peptide).toLowerCase()}`;
  }
  log(`triplet ${triplet}  peptitde ${peptide} highlightFilename returns ${ret}`)

  return ret;
}
function getFileExtension() {
  let t = highlightFilename() + getRegmarks();
  if (magnitude != false) {
    t += ".m" + magnitude;
  } else {
    log(`no magnitude setting: ${magnitude}`)
  }
  t += `_c${Math.round(codonsPerPixel*10)/10}`;
  if (args.ratio || args.r) {
    t += `_${ratio}`;
  }
  ( artistic ? t += "_artistic" : t += "_sci")
  return t;
}
function setupFNames() {
  extension = getLast5Chars(filename);
  justNameOfDNA = removeSpacesForFilename(removeFileExtension(replaceFilepathFileName(filename)));
  if (justNameOfDNA.length > 22 ) {
    justNameOfDNA = justNameOfDNA.substring(0,11) + justNameOfDNA.substring(justNameOfDNA.length-11,justNameOfDNA.length);
  }
  let filePath = path.dirname(path.resolve(path.dirname(filename))) ;
  filePath += "/output" ;

  let ext = getFileExtension();

  justNameOfPNG =     `${justNameOfDNA}.${extension}_linear${ext}.png`;
  justNameOfHILBERT =     `${justNameOfDNA}.${extension}_HILBERT${ext}.png`;
  justNameOfHTML =     `${justNameOfDNA}.${extension}_AMINOSEE-REPORT${ext}.html`;

  filenameTouch =   `${filePath}/${justNameOfDNA}.${extension}_LOCK${ext}.aminosee.touch`;
  filenamePNG =     filePath + "/" + justNameOfPNG;
  filenameHTML =    filePath + "/" + justNameOfHTML;
  filenameHILBERT = filePath + "/" + justNameOfHILBERT;

  log(`ext: ${ext} pep ${peptide} status ${status} filePath ${filePath}`);
  output(chalk.rgb(255, 255, 255).inverse(`FILENAMES SETUP AS:  highlightFilename() ${highlightFilename()} pep
  justNameOfDNA.extension ${justNameOfDNA + "." + extension}
  justNameOfPNG: ${justNameOfPNG}
  justNameOfHTML ${justNameOfHTML}
  filenameTouch: ${filenameTouch}`));
}

function launchNonBlockingServer() {
  serverPath = appPath.substring(0, appPath.length-15);// + "public";



  const LocalWebServer = require('local-web-server')
  const localWebServer = new LocalWebServer()
  const server = localWebServer.listen({
    port: 3210,
    // https: true,
    directory: serverPath,
    // spa: 'index.html',
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

  opn('http://127.0.0.1:3210/');
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
function saveDocuments(callback) {
  status = "save"; // <-- this is the true end point of the program!
  percentComplete = 1;
  clearTimeout(updatesTimer);
  calcUpdate();
  output(`Saving documents...`);
  arrayToPNG();
  if (isHilbertPossible) {
    output("projecting linear array to 2D hilbert curve")
    saveHilbert(rgbArray);
  } else {
    output("Cant output hilbert image when using artistic mode");
  }

  // status = "saving html report";
  log("SAVING HTML")
  if (report && !isHighlightSet) { // report when highlight set
    saveHTML();
  } else {
    output("No HTML report output.")
  }
  openOutputs();
  log(renderSummary());

  // updates = true;
  status = "removelocks";
  setImmediate(() => {
    removeLocks();
  });


}
function compareHistocount(a,b) {
  if (a.Histocount < b.Histocount)
  return -1;
  if (a.Histocount > b.Histocount)
  return 1;
  return 0;
}

function saveHTML() {

  log( pepTable.sort( compareHistocount ) );

  fs.writeFileSync(filenameHTML, htmlTemplate(), function (err) {
    if (err) { output(`Error saving HTML: ${err}`) }
    output('Saved html report to: ' + filenameHTML);
    // setImmediate(() => {
    //   log("saveHTML done");
    // });
  });

}
function touchLockAndStartStream(fTouch) {
  renderLock = true;
  fs.writeFile(fTouch, "aminosee.funk.nz temp lock file. safe to erase.", function (err) {
    if (err) { console.dir(err); console.warn("Touch file error " + fTouch) }
    log('Touched lockfile OK: ' + fTouch);
    log('Starting init for ' + filename);


    printRadMessage( ["____", "____", "____", "____", "____", "____"] );
    status = "paint";
    output("Starting render");
    printRadMessage(["Starting", "Render", filename, "In", raceDelay, "milliseconds"]);
    setTimeout(() => {
      printRadMessage(["Starting", "Render", filename, "Now", ".", "."]);
      initStream(filename);

    }, raceDelay);


  });

}
function removeLocks() {
  console.warn("Removing locks")
  renderLock = false;

  try {
    // fs.unlinkSync(filenameTouch);

    fs.unlinkSync(filenameTouch, (err) => {
      if (err) { console.warn(err) }
      console.warn("file locks removed")
      pollForStream();
    });

  } catch (err) {
    console.warn("removeLocks err: " + err);
    pollForStream();
  }
  console.log("end of removeLocks function");
  // if (howMany>0) {
  //   pollForStream();
  // } else {
  //   quit(1)
  // }
}
function getFilesizeInBytes(f) {
  try {
    if (fs.statSync(f) == true) {
      baseChars = fs.statSync(f).size;
      log(`PROBABLY getFilesizeInBytes ${baseChars} File Found at: ${f}`);
      return baseChars;
    } else {
      baseChars = fs.statSync(f).size;
      log(`MAYBE getFilesizeInBytes ${baseChars} File Found at: ${f}`);
      return baseChars;
    }
  } catch(e) {
    log("File error: " + e);
    return -1;
  }
}
function getLast5Chars(f) {
  let lastFive = f.slice(-5);
  log(`lastFive ${lastFive}`)
  return lastFive.replace(/.*\./, '').toLowerCase();
}
function checkFileExtension(f) {
  let value = extensions.indexOf(getLast5Chars(f));
  if ( value < 0) {
    log(`checkFileExtension FAIL: ${extension}  ${value} `);
    return false;
  } else {
    log(`checkFileExtension GREAT SUCCESS: ${extension}  ${value} `);
    return true;
  }
}

function quit(n) {


  if ( renderLock == false ) {
    clearTimeout(updatesTimer);
    status = "bye";
    // msPerUpdate = 0;
    // log("press Control-C again to quit; or.... try T to output test patterns");
    if (keyboard) {
      try {
        process.stdin.setRawMode(false);
        process.stdin.resume();
        // removeLocks();
      } catch(e) { log( e ) }
    }

    log(status);
    // updates = false;

    if ( howMany > 0 ) {
      log("Continuing...");
      pollForStream();
    } else {
      process.exitCode = 1;

      log('really bye. like process.exit type bye.');
      log(" ");
      printRadMessage([`last file: ${filename}`,"bye","bye","bye","bye","bye"]);
    }
  } else {
    log("half bye but still rendering")
  }
}
function processLine(l) {

  rawDNA = l;
  var cleanDNA = "";
  let lineLength = l.length; // replaces baseChars
  let codon = "";
  currentTriplet = "";
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

function aminoFilenameIndex(index) {
  peptide = pepTable[index].Codon; // bad use of globals
  justNameOfHILBERT =     `${justNameOfDNA}.${extension}_HILBERT${getFileExtension()}.png`;
  return `${justNameOfHILBERT}`;
}

function imageStack() {
  let hhh = " ";
  for (i=0; i<pepTable.length; i++) {
    let thePep = pepTable[i].Codon.toLowerCase();
    let theHue = pepTable[i].Hue;
    let c =      hsvToRgb( theHue/360, 0.5, 1.0 );

    if (thePep != "non-coding nnn"  && thePep != "start codons" && thePep != "stop codons") {
      hhh += `<a href="${aminoFilenameIndex(i)}" onmouseover="mover(${i})" onmouseout="mout(${i})"><img  src="${aminoFilenameIndex(i)}" id="stack_${i}" width="256" height="256" style="z-index: ${6969+i}; position: absolute; top: ${i}px; left: ${i*3}px;" alt="${pepTable[i].Codon}" title="${pepTable[i].Codon}"></a>`;
    } else {
      log("non-coding nnn image not output");
    }

  }
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
<img width="128" height="128" style="border: 4px black;" src="${justNameOfPNG}">
3D Hilbert Map Image
</a>


<div id="monkeys">
<div><a href="http://aminosee.funk.nz/">
<input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollHILBERT'"><br>

<img src="https://www.funk.co.nz/aminosee/aminosee/seenoevilmonkeys.jpg">

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
`;
// pepTable   = [Codon, Description, Hue, Alpha, Histocount]
for (i=0; i<pepTable.length; i++) {
  let thePep = pepTable[i];
  let theHue = thePep.Hue;
  let c =      hsvToRgb( theHue / 360, 0.5, 1.0 );
  let lightC = hsvToRgb( theHue / 360, 0.95, 0.75 );
  log(thePep, theHue, c);
  html += `
  <tr style="background-color: hsl( ${theHue} , 50%, 100%);">
  <td style="background-color: white;"> ${pepTable[i].Codon} </td>
  <td style="background-color: rgb(${lightC});">
  <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${theHue}°</p>
  </td>
  <td style="background-color: rgb(${c}); color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${c}</p> </td>
  <td>${pepTable[i].Histocount.toLocaleString()}</td>
  <td>${pepTable[i].Description}</td>
  <td style="background-color: white;">
  <a href="${aminoFilenameIndex(i)}" class="button" title="Amino filter: ${removeSpacesForFilename(pepTable[i].Codon)}"><img width="48" height="16" style="border: 1px black;" src="${aminoFilenameIndex(i)}" alt="${removeSpacesForFilename(pepTable[i].Codon)}"></a>
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

`;
return html;
}

function helpCmd(args) {
  output("Help section." + args);
  output(hilbPixels);
  output("Calibrate your DNA with a --test  ");


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
function saveHilbert(array) {
  status = "getting in touch with my man... hilbert";
  let perc = 0;
  let height, width, pixels;

  pixels = array.length/4;
  let computerWants = pixToMagnitude(pixels);
  log(`computerWants ${computerWants} pixToMagnitude(pixels) ${pixToMagnitude(pixels)}  `);

  if ( computerWants > maxMagnitude ) {
    if (args.magnitude || args.m && magnitude > maxMagnitude) {
      output(`I'm not sure that trying to render ${hilbPixels[magnitude]} is going to work out. Maybe try a lower magnitue like ${computerWants}`)
      dimension = magnitude;
    } else {
      output(`I'd like to do that ${hilbPixels[computerWants]} for you dave, but I can't. I let some other humans render at magnitue ${computerWants} and I core dumped.`)
      dimension = maxMagnitude;
    }
  } else if (computerWants < 0) {
    dimension = 0; // its an array index
  }
  dimension = computerWants -1;
  maxpix = hilbPixels[dimension];
  log(`image size ${pixels} will use dimension ${dimension} yielding ${hilbPixels[dimension]} pixels `);

  output(`DIMENSION: ${dimension}`)

  const h = require('hilbert-2d');
  let hilpix = hilbPixels[ dimension ];
  let hilbertImage = [hilpix*4];
  let linearpix = rgbArray.length / 4;
  shrinkFactor = linearpix / hilpix;
  log(`shrinkFactor pre ${shrinkFactor} = linearpix ${linearpix } /  hilpix ${hilpix}  `);
  resampleByFactor(shrinkFactor);
  log(filenameHILBERT);
  log(`shrinkFactor post ${shrinkFactor}`);

  width = Math.sqrt(hilpix);
  height = width;
  hilbertImage = [hilpix*4]; //  x = x, y % 960

  for (i = 0; i < hilpix; i++) {
    dot(i, 20000);
    let hilbX, hilbY;
    [hilbX, hilbY] = h.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
    let cursorLinear  = 4 * i ;
    let hilbertLinear = 4 * ((hilbX % width) + (hilbY * width));
    let perc = i / hilpix;
    let thinWhite = 249;
    let thinWhiteSlice = (Math.round(perc * 1000 )-5) % thinWhite; // -5 is to hit 0% to 0.5% instead of 0% to 1% as previously. this is to enlarge the 99.5% to 100% thinWhite
    if (thinWhiteSlice < 4 && reg) {

      // hilbertImage[hilbertLinear] =   255*perc;
      // hilbertImage[hilbertLinear+1] = ( i % Math.round( perc *32) ) / (perc *32) *  255;
      // hilbertImage[hilbertLinear+2] = (perc *2550)%255;
      // hilbertImage[hilbertLinear+3] = 255 ;

      hilbertImage[hilbertLinear+0] = rgbArray[cursorLinear+0];
      hilbertImage[hilbertLinear+1] = rgbArray[cursorLinear+1];
      hilbertImage[hilbertLinear+2] = rgbArray[cursorLinear+2];
      // hilbertImage[hilbertLinear+3] = rgbArray[cursorLinear+3];


      hilbertImage[hilbertLinear+0] = 255 - (hilbertImage[hilbertLinear+0]);
      hilbertImage[hilbertLinear+1] = 255 - (hilbertImage[hilbertLinear+1]);
      hilbertImage[hilbertLinear+2] = 255 - (hilbertImage[hilbertLinear+2]);
      // hilbertImage[hilbertLinear+3] = 128;
      hilbertImage[hilbertLinear+3] = (i%4)*63;

    } else {

      hilbertImage[hilbertLinear+0] = rgbArray[cursorLinear+0];
      hilbertImage[hilbertLinear+1] = rgbArray[cursorLinear+1];
      hilbertImage[hilbertLinear+2] = rgbArray[cursorLinear+2];
      hilbertImage[hilbertLinear+3] = rgbArray[cursorLinear+3];

    }

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
  function arrayToPNG() {
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
    // img_png.data = Buffer.from(img_data);
    // img_png.pack().pipe(fs.createWriteStream(filenamePNG));

    img_png.data = Buffer.from(img_data);
    let wstream = fs.createWriteStream(filenamePNG);
    new Promise(resolve =>
      img_png.pack()
      .pipe(wstream)
      .on('finish', () => {
        // printRadMessage(["i think we're done", isHilbertPossible, justNameOfDNA ,howMany, updates]);
        output("Finished linear png save.");
        openOutputs();
        quit();
      }));
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
          output("Opening your RENDER SUMMARY HTML report. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");
          opn(filenameHTML).then(() => {
            log("browser closed");
          }).catch();
        }
        if (isHilbertPossible && openImage) {
          output("Opening your HILBERT PROJECTION image. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");
          opn(filenameHILBERT).then(() => {
            log("hilbert image closed");
          }).catch();
        } else if (openImage) {
          output("Opening your LINEAR PROJECTION image. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");
          opn(filenamePNG).then(() => {
            log("regular png image closed");
          }).catch();
        } else {
          output(`Use --html or --image to automatically open files after render`)
          log(`values of openHtml ${openHtml}   openImage ${openImage}`)
        }

      }, raceDelay);



      log("Thats us cousin");
    }
    function getRegmarks() {
      return ( ratio == true || reg == true ? "_reg" : "" )
    }
    function mkdir(d) {
      log(`mkdir ${d} `)

      let filePath = path.resolve(__dirname);// + "/calibration/" ; filePath + "/calibration/"
      d = filePath + "/" + d;

      if (!fs.existsSync(d)){
        log(`mkdir GREAT SUCCESS ${d}`)
        fs.mkdirSync(d);
      } else {
        log(`mkdir ALREADY GREAT ${d}`)
      }
    }
    function generateTestPatterns() {
      if ( !magnitude ) {
        magnitude = maxMagnitude;
      } else {
        log("um");
      }
      output(`TEST PATTERNS GENERATION    m ${magnitude} c ${codonsPerPixel}`);
      output("use -m to try different dimensions. -m 9 requires 1.8 GB RAM");
      output("use -a to remove registration marks it looks a little cleaner without them ");
      log(`hilbPixels      ${magnitude} `);
      log(`hilbPixels      ${magnitude} `);
      log(`hilbPixels      ${hilbPixels[magnitude]} `);
      log(`magnitude      ${magnitude} `);
      log(`maxMagnitude      ${maxMagnitude} `);


      // filenameHILBERT = filePath + "/" + justNameOfHILBERT;

      for (test = 0; test <= magnitude; test++) {
        fakeReportInit(test);
        patternsToPngAndMainArray(); // call with no array for test
        fakeReportStop();
        arrayToPNG();
        saveHTML();

      }
      log(`done with generateTestPatterns()`);

      // openOutputs();
    }
    function fakeReportStop() {
      calcUpdate();

    }
    function fakeReportInit(magnitude) {
      start = new Date().getTime();
      test, dimension = magnitude; // mags for the test

      let filePath = path.resolve(__dirname);// + "/calibration/" ;
      let regmarks = getRegmarks();
      justNameOfDNA = `AminoSee_Calibration_${ test }${ regmarks }`;
      justNameOfPNG = `${justNameOfDNA}_linear.png`;
      justNameOfHILBERT = `${justNameOfDNA}_hilbert.png`;

      filenameHILBERT = filePath + "/calibration/" + justNameOfHILBERT;
      filenamePNG     = filePath + "/calibration/" + justNameOfPNG;
      filenameHTML    = filePath + "/calibration/" + justNameOfDNA + ".html";

      baseChars = hilbPixels[ test ];
      genomeSize = baseChars;
      errorClock = 0;
      charClock = baseChars;
      colClock = baseChars;

      return true;
    }
    function rotateNinetyDegrees(x, y) {
      out(width);
      return y;
    }
    function patternsToPngAndMainArray() {
      let perc = 0;

      log(`Generating hilbert curve, dimension: ${dimension}`);

      const h = require('hilbert-2d');
      let hilpix = hilbPixels[dimension];
      let linearpix = hilpix;// * 4;
      let hilbertImage = [hilpix*4];
      rgbArray = [linearpix*4];

      log(filenameHILBERT);

      width = Math.round(Math.sqrt(hilpix));
      height = width;
      linearWidth = Math.round(Math.sqrt(hilpix));
      linearHeight = linearWidth;
      rotateNinetyDegrees();
      for (i = 0; i < hilpix; i++) {
        dot(i, 20000);
        let hilbX, hilbY;
        [hilbX, hilbY] = h.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
        let cursorLinear  = 4 * i ;
        let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth));

        let perc = i / hilpix;
        let thinWhite = 249;
        let thinWhiteSlice = (Math.round(perc * 1000 )-5) % thinWhite;

        hilbertImage[hilbertLinear] =   255*perc; // slow ramp of red
        hilbertImage[hilbertLinear+1] = ( i % Math.round( perc * 32) ) / (perc *32) *  255; // SNAKES! crazy bio snakes.
        hilbertImage[hilbertLinear+2] = (perc *2550)%255; // creates 10 segments to show each 10% mark in blue
        hilbertImage[hilbertLinear+3] = 255; // slight edge in alpha

        if (thinWhiteSlice < 5 && reg) { // 5 one out of 10,000
          // log(`@i ${i}   hilbX, hilbY `);
          hilbertImage[hilbertLinear+0] = 255 - (hilbertImage[hilbertLinear+0]);
          hilbertImage[hilbertLinear+1] = 255 - (hilbertImage[hilbertLinear+1]);
          hilbertImage[hilbertLinear+2] = 255 - (hilbertImage[hilbertLinear+2]);
          hilbertImage[hilbertLinear+3] = 128;
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

      function resampleByFactor(shrinkFactor) {
        let sampleClock = 0;
        let brightness = 1/shrinkFactor;
        let antiAliasArray = [ hilbPixels[dimension] * 2 * 4 ]; // 1 dimensional data only needs 2 x aa

        // BLOW IT UP DOUBLE SIZE:
        for (z = 0; z<hilbPixels[dimension]*2; z++) { // 2x AA
          // log(` ${z}  ${sampleClock}  ${shrinkFactor} ${brightness} ${hilbPixels[dimension]} `);
          let sum = z*4;
          let clk = sampleClock*4;
          sampleClock++;

          antiAliasArray[sum+0] = rgbArray[clk+0]*brightness;
          antiAliasArray[sum+1] = rgbArray[clk+1]*brightness;
          antiAliasArray[sum+2] = rgbArray[clk+2]*brightness;
          antiAliasArray[sum+3] = rgbArray[clk+3]*brightness;

          while(z*shrinkFactor > sampleClock * 2) {
            sampleClock++;
            clk = sampleClock*4;

            antiAliasArray[sum+0] += rgbArray[clk+0]*brightness;
            antiAliasArray[sum+1] += rgbArray[clk+1]*brightness;
            antiAliasArray[sum+2] += rgbArray[clk+2]*brightness;
            antiAliasArray[sum+3] += rgbArray[clk+3]*brightness;
          }
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
      function pixToMagnitude(pix) { // give it pix it returns a magnitude that is bigger
        let dim = 0;
        out(`Finding best fit for image size ${twosigbitsTolocale(pix)} Hilbert curve: `);
        while (pix > hilbPixels[dim]) {
          // status = "set hilbert dim";
          out(` [${hilbPixels[dim]}] `);
          dim++;
          if (dim > maxMagnitude) {
            if (magnitude && dim > theActualMaxMagnitude ) {
              output("HELLO: This will likely exceed nodes heap memory and/or call stack. mag 11 sure does. spin up the fans.")
              return theActualMaxMagnitude;
            } else {
              return maxMagnitude;
            }
          }
        }
        out(" ");
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


      function removeSpacesForFilename(str) {
        if (str == undefined) {
          return "";
        } else {
          return str.replace(' ', '');
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
          console.log(` [ p_${peptide} ${howMany}_${status}_lock:${renderLock} ] ${txt}`);
        } else {
          // BgBlack = "\x1b[40m"

          console.log(txt);
        }
      }
      function log(txt) {
        if (verbose && devmode) {
          let d = new Date().getTime();
          console.log(`[ ${status} ${d.toLocaleString()} ] [ ${howMany}_${status}_lock:${renderLock} ] + ${txt}`);
        } else if (verbose) {
          console.log(txt)
        }
      }

      function onError(e) {
        output('ERROR: ' + e.toString());
      }

      // it used to chop the headers
      // but not it just helps with the streaming read design.
      function parseFileMeta() {
        // show users a sample of their file
        const first1k = rawDNA.substring(0,999);
        baseChars = rawDNA.length; // Size of file in bytes
        // ignore anything at the start of the file, it starts with 6 letters of base
        // var regexp = "/[ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun]/";
        log("baseChars " + baseChars);
        log(removeLineBreaks(first1k.substring(0,360)));
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
        process.stdout.write(t); // CURSOR TO TOP LEFT????

      }
      function clearScreen() {
        if (clear) {
          // process.stdout.write('\x1B[2J\x1B[0f'); // CURSOR TO TOP LEFT????
          // console.log('\033c');
          // process.stdout.write("\x1B[2J"); // CLEAR TERMINAL SCREEN????
          // console.log('\x1Bc');
          // process.stdout.write('\x1B[2J\x1B[0f');
          process.stdout.write("\033[<0>;<0>H"); // pretty good
          process.stdout.write("\033[<0>;<0>f"); // cursor to 0,0
          process.stdout.write('\033c'); // <-- this is really the best one
          // put cursor to L,C:  \033[<L>;<C>H
          // put cursor to L,C:  \033[<L>;<C>f
        } else {
          log("noclear");
        }
        // printRadMessage(array);
      }

      function prettyDate() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today  = new Date();

        return today.toLocaleString(options) + "  " + today.toLocaleDateString(options); // Saturday, September 17, 2016
      }
      function printRadMessage(array) {
        if (array == undefined) {
          array = ["__1__", "__2__", "__3__", "__4__", "__5__", "__6__", ""]
        } else if ( array.length < 7 ) {
          array.push("__1__", "__2__", "__3__", "__4__", "__5__", "__6__", "");
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
      function calcUpdate() {
        percentComplete = charClock / baseChars;
        let now = new Date().getTime();
        runningDuration = now - start;
        timeRemain = Math.round(runningDuration * ((baseChars-charClock)/charClock+1)/1000);
        kbRemain = (Math.round((baseChars - charClock)/1000)).toLocaleString();

      }
      function getHistoCount(item, index) {
        return [ item.Codon, item.Histocount];
      }
      function whack_a_progress_on() {
        var bar = new ProgressBar({
          schema: ':bar',
          total : 1000
        });

        var iv = setInterval(function () {
          calcUpdate();
          // bar.tick();
          bar.update(percentComplete*1000);
          if (bar.completed) {
            clearInterval(iv);
          }
        }, 200);
        return bar;
      }
      function twosigbitsTolocale(num){
        return (Math.round(num*100)/100).toLocaleString();
      }
      function drawHUD() {

      }
      function drawHistogram() {
        if (updates == false) {
          status = "Stats display disabled ";
          return status;
        }

        calcUpdate();

        let kCodonsPerSecond = Math.round((genomeSize+1) / (runningDuration+1));
        let kBytesPerSec = Math.round((charClock+1) / (runningDuration+1));
        let text = " ";
        let aacdata = [];
        let abc = pepTable.map(getHistoCount).entries();


        if (msPerUpdate < maxMsPerUpdate) {
          msPerUpdate += 50; // begin to not update screen so much over time
        }
        cyclesPerUpdate = kCodonsPerSecond * msPerUpdate; // one update per second, or 1.8.

        // OPTIMISE i should not be creating a new array each frame!
        for (h=0;h<pepTable.length;h++) {
          aacdata[pepTable[h].Codon] = pepTable[h].Histocount ;
        }
        // aacdata = abc;


        let array = [
          `File: ${chalk.rgb(255, 255, 255).inverse(justNameOfDNA.toUpperCase())}.${extension} `,
          `Done: ${chalk.rgb(128, 255, 128).inverse( twosigbitsTolocale(percentComplete*100))} % Remain: ${ twosigbitsTolocale(timeRemain) } sec `,
          `@i ${charClock.toLocaleString()} Lines: ${breakClock.toLocaleString()} Files: ${howMany} Filesize: ${Math.round(baseChars/1000)/1000} MB Elapsed: ${Math.round(runningDuration/1000)} sec KB remain: ${kbRemain}`,
          `Next update: ${msPerUpdate.toLocaleString()}ms  Codon Opacity: ${twosigbitsTolocale(opacity*100)}% `,
          `CPU: ${bytes(kBytesPerSec*1024)}/s Codons per sec: ${Math.round(kCodonsPerSecond).toLocaleString()} Acids/pixel: ${twosigbitsTolocale(codonsPerPixel)} Pixels painted: ${colClock.toLocaleString()}`,
          `[ Codons: ${genomeSize.toLocaleString()} ]  Last Acid: ${terminalRGB(aminoacid, red, green, blue)}`,
          `[ clean: ${ cleanString(rawDNA)} ] Output png: ${justNameOfPNG}] ${showFlags()}`];


          clearScreen();
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
        }
        function isHighlightTriplet(array) {
          return array.DNA == triplet;
        }
        function isCurrentPeptide(pep) {
          // return p.Codon == peptide || p.Codon == triplet;
          return pep.Codon == peptide;
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

          let theMatch = dnaTriplets.find(isTriplet)

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
                log(terminalRGB(aminoacid.charAt(0), red, green, blue));
                if(colClock % 20 ==0 ){
                  out(` [ ${colClock} ] `);
                  out(terminalRGB(rawDNA + " ", 64, 128, 64));
                  out();
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
