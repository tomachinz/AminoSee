// "use strict";
//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.co.nz
//        ah-mee no-see       "I See It Now - I AminoSee it!"
const defaultMagnitude = 7; //  = 4.194304 megapixels
const maxMagnitude = 8; // max for auto setting
let darkenFactor = 0.75;
let highlightFactor = 2;
const defaultC = 1; // back when it could not handle 3+GB files.
const artisticHighlightLength = 18; // px only use in artistic mode. must be 6 or 12 currently
let spewThresh = 1000;
let devmode = false; // kills the auto opening of reports etc
let verbose = false; // not recommended. will slow down due to console.
let force = false; // force overwrite existing PNG and HTML reports
let artistic = false; // for Charlie
let spew = false; // firehose your screen with DNA
let report = true; // html reports
const overSampleFactor = 0.8;

let clear, updates;
const maxMsPerUpdate = 12000; // milliseconds per update
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
process.title = "aminosee.funk.co.nz";
const defaultFilename = "AminoSeeTestPatterns"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
let filename = defaultFilename;
let rawDNA ="@"; // debug
const extensions = [ "txt", "fa", "mfa", "gbk", "dna"];
let status = "load";
console.log("Amino\x1b[40mSee\x1b[37mNoEvil");
let interactiveKeysGuide = "";
let filenameTouch, maxpix, estimatedPixels, args, filenamePNG, extension, reader, hilbertPoints, herbs, levels, progress, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, textFile, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, fileUploadShowing, testColors, chunksMax, chunksize, chunksizeBytes, baseChars, cpu, subdivisions, contextBitmap, aminoacid, colClock, start, updateClock, percentComplete, bytesPerSec, pixelStacking, isHighlightCodon, justNameOfDNA, justNameOfPNG, justNameOfHILBERT, sliceDNA, filenameHTML, howMany, timeRemain, runningDuration, kbRemain, width, triplet, updatesTimer, pngImageFlags;
let codonsPerPixel, CRASH, cyclesPerUpdate, red, green, blue, alpha, charClock, errorClock, breakClock, streamLineNr, genomeSize, filesDone, spewClock, opacity, codonRGBA, geneRGBA, currentTriplet, progato, dimension, shrinkFactor, reg;




var keypress = require('keypress');
function setupKeyboardUI() {
interactiveKeysGuide += `
Interactive control:    D            (devmode)  Q   (graceful quit next save)
V       (verbose mode)  S (spew DNA to screen)  Control-C      (instant quit)
F      (Overwrite png)  W        (wipe screen)  U       (stats update on/off)`;

  // make `process.stdin` begin emitting "keypress" events
  keypress(process.stdin);

  // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    log('got "keypress"', key);

    if (key && key.ctrl && key.name == 'c') {
      process.stdin.pause();
      status = "TERMINATED WITH CONTROL-C";
      console.log(status);
      // printRadMessage();
      updates = false;
      quit();
      args = [];
      if (devmode) {
        output("Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rendered but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry.")
      } else {
        removeLocks();
      }
      process.exit()
    }
    if (key && key.name == 'q') {
      status = "GRACEFUL QUIT";
      output(status);
      // printRadMessage();
      // updates = false;
      args = [];
      howMany = 0;
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
    if (key && key.name == 'Space' ||  key.name == 'Enter') {
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
  });

try {
  process.stdin.setRawMode(true);

} catch(err) {
  output(`Could not use interactive keyboard due to: ${err}`)
}
  process.stdin.resume();
}
// setupKeyboardUI()


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
    string: [ 'codons'],
    string: [ 'magnitude'],
    string: [ 'triplet'],
    string: [ 'peptide'],
    string: [ 'ratio'],
    string: [ 'width'],
    alias: { a: 'artistic', c: 'codons', d: 'devmode', f: 'force', m: 'magnitude', p: 'peptide', t: 'triplet', r: 'ratio', s: 'spew', w: 'width', v: 'verbose' },
    default: { clear: true, updates: true },
    '--': true
  });

  log(args);

  if (args.codons || args.c) {
    userCPP = Math.round(args.codons || args.c); // javascript is amazing
    output(`shrink the image by blending ${userCPP} codons per pixel.`);
    isHilbertPossible = false;
    codonsPerPixel = userCPP;

  } else {
    codonsPerPixel = defaultC;
    userCPP = -1;
  }

  if (args.magnitude || args.m) {
    if (isHilbertPossible) {
      magnitude = Math.round(args.magnitude || args.m);
      if (magnitude < 1 || magnitude > 12) {
        magnitude = defaultMagnitude;
        output("Magnitude must be an odd number between 1 and 9.");
      } else if (magnitude > 7) {
        output(`Magnitude 8 requires 700 mb ram and takes a while`);
      } else if (magnitude > 8) {
        output(`This will give your machine quite a hernia. It's in the name of science but.`);
        output(`On my machine, magnitude 8 requires 1.8 GB of ram and 9+ crashes nodes heap and 10+ crashes the max call stack, so perhaps this will run OK in the 2020 AD`);
      } else if (magnitude == 2 || magnitude == 4 || magnitude ==6 || magnitude == 8 ||magnitude == 10) {
        magnitude--;
      }
    } else {
      output("Can't set magnitude and codons per pixel at the same time. Remove your -c option to set magnitude")
    }
  } else {
    magnitude = defaultMagnitude;
  }
  maxpix = hilbPixels[magnitude]; // times two is for anti-alias effect.

  log(`using magnitude ${magnitude}: or  ${maxpix} px max`);

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
  if (args.reg) {
    reg = true;
    output(`using regmarks`)
  }
  if (args.triplet || args.t) {
    triplet = args.triplet || args.t;
    triplet = triplet.toUpperCase();
    let tempColor = codonToRGBA(triplet);
    let tempHue = tripletToHue(triplet);
    if (tempColor != [13, 255, 13, 255]){ // this colour is a flag for error
      output(`Found ${triplet} with colour: ${tempHue} ${tempColor}`);
    } else {
      output(`Error could not lookup triplet: ${triplet}`);
      // output(`Will highlight Start/Stop codons instead (default)`);
      triplet = "none";
    }

    output(`Custom triplet ${triplet} set. Will highlight these codons, they are Hue ${tripletToHue(triplet)}° in colour`);
  } else {
    log(`No custom triplet chosen. (default)`);
    triplet = "none";
  }
  if (args.peptide || args.p) {
    peptide = args.peptide || args.p;
    output(` tidyPeptideName(peptide) ${tidyPeptideName(peptide)} codons`);
    peptide = tidyPeptideName();

    if (peptide != "none") { // this colour is a flag for error
      output("Found ${peptide} with colour: "  + pepToColor(peptide));
    } else {
      output("Error could not lookup peptide: ${peptide}");
      // output(`Will highlight Start/Stop codons instead (default)`);
      peptide = "none";
    }

    output(`Custom peptide ${peptide} set. Will highlight these codons, they are Hue ${peptideToHue(peptide)}° in colour`);
  } else {
    log(`No custom peptide chosen. (default)`);
    peptide = "none";
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
    output("will open html instead of image");
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
  if (args.test) {
    output("output test patterns");
    updates = true;
    pngImageFlags = "_test_pattern";
    generateTestPatterns();
  }

  let cmd = args._[0];
  log(args._);
  howMany = args._.length ;
  // filename = path.resolve(cmd);

  log("howMany: " + howMany+ " cmd: " + cmd)
  if (howMany > 0) {
    // filename = path.resolve(args._[0]);
  } else {
    log("try using aminosee * in a directory with DNA")
    quit();
    // setTimeout(() => {
    //   // printRadMessage();
    //   quit();
    // }, 1);
  }
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
      // output(radMessage);
      // launchBlockingServer();
      // launchNonBlockingServer();
      return true;
    } else {
      // status = "highland";
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
function tidyPeptideName() {
  let clean = pepTable.filter(aPeptideCodon);
  if (clean.length > 0 ) {
    return clean[0].Codon;
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

  out(".");
  if (howMany < 1) {
    output("");
    quit();
  }
  try {
    if (args._) {
      current = args._[0];
    } else {
      output("Finished processing.")
      quit(1);
      return true;
    }
  } catch(e) {
    output("Finished processing.")
    quit(1);
    return true;
  }
  log(` [ howMany  ${howMany} ${status} ${filename} ${current}]`)

  // if (status != "bye" || status != "cmd" || status != "exports" || status != "polling") {
  //   if (status != "bye" || status != "cmd" || status != "exports" || status != "polling") {
  //   output("THIS IS NOT RIGHT")
  //   return true;
  // }
  if (status == "removelocks" || status == "polling") {
    current = args._.pop();

  }
  if (current == undefined) {
    quit()
    return false;
  }
  status = "polling";
  howMany = args._.length;
  filename = path.resolve(current);
  log("current: " + filename)
  let pollAgainFlag = false;
  let willStart = true;
  log( " current is " + current   + args)

  if (!checkFileExtension(getFileExtension(current))) {
    log("checkFileExtension: " + current)
    theSwitcher(false);
    return false;
  }
  if (filename == defaultFilename) {
    log("skipping default: " + defaultFilename);
    log("checkFileExtension: " + filename)
    theSwitcher(false);
    return false;
  }
  if (!checkFileExtension(getFileExtension(filename))) {
    log("getFileExtension(current): " + getFileExtension(filename));
    log("checkFileExtension(getFileExtension(current)): " + checkFileExtension(getFileExtension(filename)))
    theSwitcher(false);
    return false;
  } else {

    baseChars = getFilesizeInBytes(filename);
    autoconfCodonsPerPixel();
    setupFNames();

    if (!okToOverwritePNG(filenamePNG)) {
      log("okToOverwritePNG(filenamePNG) == true && !force: " + okToOverwritePNG(filenamePNG));
      log(filenamePNG + " not exist, continuing.");
      theSwitcher(false);
      return false;
    } else {
      if (!checkLocks(filenameTouch)) {
        log("!checkLocks(filenameTouch) " + !checkLocks(filenameTouch));
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
  if (bool) {
    printRadMessage();

    // setTimeout(() => {
    status = "paint";
    touchLock(filenameTouch); // <--- THIS IS WHERE RENDER STARTS

    // return true;
    // }, 3000);
    return true;
  } else  {
    status = "polling"
    output(howMany);
    if (howMany > 0 ) {
      pollForStream();
    } else {
      output("none");
    }
    return false;
  }
}
async function initStream(f) {
  status = "init";
  log(status.toUpperCase());
  start = new Date().getTime();
  timeRemain, runningDuration, charClock, percentComplete, genomeSize, colClock, opacity = 0;
  msPerUpdate = 200;
  codonRGBA, geneRGBA, mixRGBA = [0,0,0,0]; // codonRGBA is colour of last codon, geneRGBA is temporary pixel colour before painting.
  rgbArray = [];
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




  // filename = f;
  filename = path.resolve(f); // set a global. i know. god i gotta stop using those.
  autoconfCodonsPerPixel();
  setupFNames();
  log(` [ func parm: ${f} ]`);
  log(` [ cli parameter: ${filename} ]`);
  log(` [ canonical:     ${justNameOfDNA} ]`);

  if (getFilesizeInBytes(f) == -1) {
    log("Problem with file.");
    return false;
  } else {
    baseChars = getFilesizeInBytes(f);
  }
  extension = getFileExtension(f);
  log("[FILESIZE] " + baseChars.toLocaleString() + " extension: " + extension);


  percentComplete = 0;
  genomeSize = 0; // number of codons.
  pixelStacking = 0; // how we fit more than one codon on each pixel
  colClock = 0; // which pixel are we painting?
  timeRemain = 0;
  log("STARTING MAIN LOOP");
  // touchLock();

  if (updatesTimer) {
    clearTimeout(updatesTimer);
  }


  if (updates) {
    drawHistogram();
  } else {
    progato = whack_a_progress_on();
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

    output('Error while reading file: ' + filename, err.reason);
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

function renderSummary() {
  return `
  Filename: <b>${justNameOfDNA}</b>
  ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
  Your custom flags: ${(  force ? "F" : " "    )}${(  userCPP != -1 ? `C${userCPP}` : " "    )}${(  devmode ? "D" : " "    )}${(  args.ratio || args.r ? `${ratio}` : "   "    )}${(  args.magnitude || args.m ? `M${magnitude}` : "   "    )}
  ${(  artistic ? `Artistic Mode` : `Science Mode`    )}
  Aspect Ratio: ${ratio}
  Input bytes: ${baseChars.toLocaleString()}
  Output bytes: ${rgbArray.length.toLocaleString()};
  Estimated Codons by file size: ${Math.round(estimatedPixels).toLocaleString()}
  Actual Codons matched: ${genomeSize.toLocaleString()}
  Estimate accuracy: ${Math.round(((estimatedPixels / genomeSize)-1)*100)}%
  Error Clock: ${errorClock.toLocaleString()}
  CharClock: ${charClock.toLocaleString()}
  Codons per pixel: ${twosigbitsTolocale(codonsPerPixel)} integer
  Pixels: ${colClock.toLocaleString()} (colClock)
  Linear scale down:  ${twosigbitsTolocale(shrinkFactor)}
  overSampleFactor: ${overSampleFactor}
  Amino acid blend opacity: ${Math.round(opacity*10000)/100}%

  Max magnitude: ${magnitude} / 10 Max pix:${maxpix.toLocaleString()}
  Hilbert Magnitude: ${dimension} / ${maxMagnitude}
  Hilbert Curve Pixels: ${hilbPixels[dimension]}
  Darken Factor ${twosigbitsTolocale(darkenFactor)}
  Highlight Factor ${twosigbitsTolocale(highlightFactor)}
  Time used: ${runningDuration.toLocaleString()} miliseconds`;
}

// CODONS PER PIXEL
function autoconfCodonsPerPixel() { // requires baseChars maxpix defaultC
  let existing = userCPP;
  estimatedPixels = baseChars / 3; // divide by 4 times 3
  let computersGuess = pixelsToHilMagnitude(estimatedPixels);

  if (codonsPerPixel < defaultC) {
    codonsPerPixel = defaultC;
  } else if (codonsPerPixel > 6000) {
    codonsPerPixel = 6000;
  } else if (codonsPerPixel == NaN || codonsPerPixel == undefined) {
    codonsPerPixel = defaultC;
  }

  if (args.magnitude || args.m) {
    if ( magnitude < computersGuess) {
      output(`It mite be possible to get higher resolution with --magnitude ${computersGuess}`)
    } else if ( magnitude < computersGuess ) {
      output(`Your --magnitude of ${magnitude} is larger than my default of ${computersGuess}`)
    }
  } else {
    if ( magnitude < computersGuess) {
      output(`It mite be possible to get higher resolution with --magnitude ${computersGuess}`)
      // default of 6
    } else {
      if ( computersGuess < maxMagnitude) {
        output(`Image is not super large, fitting output to --magnitude ${computersGuess}`)
        magnitude = computersGuess;
      } else {
        output(`Image is big. Limiting size to --magnitude ${maxMagnitude}`)
        magnitude = maxMagnitude;
      }
    }
  }

  maxpix = hilbPixels[ magnitude ];

  log(`magnitude is ${magnitude} new maxpix: ${maxpix} `)
  if (estimatedPixels < (maxpix) ) { // for sequence smaller than the screen
    if (userCPP != -1)  {
      output("its not recommended to use anything other than --codons 1 for small genomes, better to reduce the --magnitude")
    } else {
      codonsPerPixel = defaultC; // normally we want 1:1 for smalls
    }
  } else if (estimatedPixels > maxpix ){ // for seq bigger than screen        codonsPerPixel = estimatedPixels / maxpix*overSampleFactor;
    codonsPerPixel = (estimatedPixels * overSampleFactor) / maxpix;
    if (userCPP != -1) {
      if (userCPP < codonsPerPixel) {
        output(terminalRGB(`WARNING: Your target Codons Per Pixel setting ${userCPP} will make an estiamted ${Math.round(estimatedPixels / userCPP).toLocaleString()} is likely to exceed the max image size of ${maxpix.toLocaleString()}, sometimes this causes an out of memory error. My machine spit the dummy at 1.7 GB of virtual memory use by node, lets try yours. We reckon ${codonsPerPixel} would be better but will give it a try...`))
      } else {
        codonsPerPixel = userCPP; // they picked a smaller size than me. therefore their computer less likely to melt.
      }
    }
  }

  if (userCPP != -1 && userCPP != codonsPerPixel) {
    output(terminalRGB(`Your selected codons per pixel setting was alterered from ${existing} to ${codonsPerPixel} `, 255, 255, 255));
  } else {
    log(`no change to your chosen cpp ${userCPP}`);
  }
  if (artistic == true) {
    codonsPerPixel = codonsPerPixel / artisticHighlightLength; // to pack it into same image size
  }

  // codonsPerPixel = Math.round(codonsPerPixel);
  if (codonsPerPixel < defaultC) {
    codonsPerPixel = defaultC;
  }
  opacity = 0.969 / codonsPerPixel;
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

  // codonsPerPixel = Math.round(codonsPerPixel);
  return codonsPerPixel;
}

function removeFileExtension(f) {
  return f.substring(0, f.length - (getFileExtension(f).length+1));
}

function setupFNames() {
  extension = getFileExtension(filename);
  justNameOfDNA = removeSpacesForFilename(removeFileExtension(replaceFilepathFileName(filename)));
  if (justNameOfDNA.length > 22 ) {
    justNameOfDNA = justNameOfDNA.substring(0,11) + justNameOfDNA.substring(justNameOfDNA.length-11,justNameOfDNA.length);
  }
  log("CWD:")
  let filePath = path.resolve(path.dirname(filename)) ;
  log("filePath in setupFname: " + filePath);

  let ext = "." + extension;

  ext += ".m" + magnitude;


  let pngAmino = `_c${Math.round(codonsPerPixel*10)/10}`

  if (args.ratio || args.r) {
    pngAmino += `_${ratio}`;
  }
  if ( triplet != "none" ) {
    pngAmino += `_${removeSpacesForFilename(triplet).toUpperCase()}`;
  } else if (peptide != "none") {
    pngAmino += `_${removeSpacesForFilename(peptide).toUpperCase()}`;
  }

  ( artistic ? pngAmino += "_artistic" : pngAmino += "_sci")

  justNameOfPNG =     `${justNameOfDNA}${ext}_aminosee${pngAmino}.png`;
  justNameOfHILBERT =     `${justNameOfDNA}${ext}_hilbert.png`;
  justNameOfHTML =     `${justNameOfDNA}${ext}_aminosee.html`;

  filenameTouch =   filePath + "/" + justNameOfDNA + ext + pngAmino + ".aminosee.touch";
  filenamePNG =     filePath + "/" + justNameOfPNG;
  filenameHTML =    filePath + "/" + justNameOfHTML;
  filenameHILBERT = filePath + "/" + justNameOfHILBERT;

  output("FILENAMES SETUP AS: ");
  output(justNameOfDNA + "." + extension);
  output(justNameOfPNG);
  output(justNameOfHTML);
  output(filenameTouch);
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
  // printRadMessage();
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
  log("SAVING")
  if (report) {
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
function saveHTML() {


  fs.writeFileSync(filenameHTML, htmlTemplate(), function (err) {
    if (err) { output(`Error saving HTML: ${err}`) }
    output('Saved report to: ' + filenameHTML);
  });

  // setImmediate(() => {
  //   log("saveHTML done");
  // });
}
function touchLock(f) {

  fs.writeFile(f, "aminosee.funk.co.nz temp lock file. safe to erase.", function (err) {
    if (err) { console.dir(err); console.warning("Touch file error") }
    log('Touched lockfile OK: ' + f);
    log('Starting init from touchLock')
    initStream(filename);
  });

}
function removeLocks() {
  try {
    // fs.unlinkSync(filenameTouch);
    fs.unlinkSync(filenameTouch, (err) => {
      if (err) { log (err) }
      pollForStream();
    });

  } catch (err) {
    log("removeLocks err: " + err);
    pollForStream();
  }

  // try {
  //   fs.unlink(filenameTouch, function (err) {
  //     if (err) { console.dir(err); console.warn("Touch file error") }
  //     log('Removed touch file: ' + filenameTouch);
  //   });
  // } catch (e) {
  //   log("removeLocks err: " + e);
  // }

}
function getFilesizeInBytes(f) {
  try {
    return baseChars = fs.statSync(f).size;
  } catch(e) {
    output("File error: " + e);
    return -1;
  }
}
function getFileExtension(f) {
  let lastFive = f.slice(-5);
  log(`lastFive ${lastFive}`)
  return lastFive.replace(/.*\./, '').toLowerCase();
}
function checkFileExtension(f) {
  let value = extensions.indexOf(getFileExtension(f));
  if ( value < 0) {
    log(`checkFileExtension FAIL: ${extension}  ${value} `);
    return false;
  } else {
    log(`checkFileExtension GREAT SUCCESS: ${extension}  ${value} `);
    return true;
  }
}

function quit(n) {
  process.exitCode = 1;
  status = "bye";
  updates = false;
  // msPerUpdate = 0;
  // removeLocks();

  clearTimeout(updatesTimer);

  // clearTimeout();
  // output("press Control-C again to quit; or.... try T to output test patterns");
  // process.stdin.setRawMode(false);
  // process.stdin.resume();
  // printRadMessage();
  if (n=1) {
    process.exit;
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
function htmlTemplate() {
  var html = `<html>
  <head>
  <title>${justNameOfDNA} :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson</title>
  <meta name="description" content="V${siteDescription}">
  <link rel="stylesheet" type="text/css" href="https://www.funk.co.nz/aminosee/public/AminoSee.css">
  <link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
  <link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
  <link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet">
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

<h1>AminoSee Render Summary for ${justNameOfDNA}</h1>
<div class="fineprint" style="text-align: right; float: right;">
<pre>
${renderSummary()}
</pre>
</div>
<a href="#scrollDownToSeeImage" class="button" title"Click To Scroll Down To See Image"><br />
<img width="128" height="128" style="border: 4px black;" src="${justNameOfHILBERT}">
Scroll To Image
</a>


<div id="monkeys">
<div><a href="http://aminosee.funk.co.nz/">
<input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollDownToSeeImage'"><br>

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
<table>
<thead>
<tr>
<th>Amino Acid</th>
<th>Hue</th>
<th>RGB</th>
<th>Count</th>
<th>Description</th>
</tr>
</thead>
<tbody>
`;
// pepTable   = [Codon, Description, Hue, Alpha, Histocount]
for (i=0; i<pepTable.length; i++) {
  let theHue = pepTable[i].Hue;
  log(theHue);
  let c = hsvToRgb( theHue, 0.5, 1.0 );
  // const c = hsvToRgb( pepTable[i].Hue );
  html += `
  <tr style="background-color: hsl(${theHue}, 50%, 100%);">
  <td style="background-color: white;">${pepTable[i].Codon}</td>
  <td style="background-color: hsl(${theHue}, 50%, 100%);">${theHue}°</td>
  <td>${c[0]},${c[1]},${c[2]}  #NOTWORK</td>
  <td>${pepTable[i].Histocount}</td>
  <td>${pepTable[i].Description}</td>
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
<a name="scrollDownToSeeImage" ></a>
<a href="${justNameOfHILBERT}" ><img src="${justNameOfHILBERT}"></a>

<h2>About Start and Stop Codons</h2>
<p>The codon AUG is called the START codon as it the first codon in the transcribed mRNA that undergoes translation. AUG is the most common START codon and it codes for the amino acid methionine (Met) in eukaryotes and formyl methionine (fMet) in prokaryotes. During protein synthesis, the tRNA recognizes the START codon AUG with the help of some initiation factors and starts translation of mRNA.

Some alternative START codons are found in both eukaryotes and prokaryotes. Alternate codons usually code for amino acids other than methionine, but when they act as START codons they code for Met due to the use of a separate initiator tRNA.

Non-AUG START codons are rarely found in eukaryotic genomes. Apart from the usual Met codon, mammalian cells can also START translation with the amino acid leucine with the help of a leucyl-tRNA decoding the CUG codon. Mitochondrial genomes use AUA and AUU in humans and GUG and UUG in prokaryotes as alternate START codons.

In prokaryotes, E. coli is found to use AUG 83%, GUG 14%, and UUG 3% as START codons. The lacA and lacI coding regions in the E coli lac operon don’t have AUG START codon and instead use UUG and GUG as initiation codons respectively.</p>
<h2>Linear Projection</h2>
The following image is in raster order, top left to bottom right:
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
    output("An png image has already been generated for this DNA: " + f)
    output("use -f to overwrite");
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

function arrayToPNG() {

  // clearTimeout();
  let pixels, height, width = 0;
  pixels = (rgbArray.length / 4) + 1 ;// to avoid the dreaded "off by one error"... one exra pixel wont bother nobody
  log(`pixels ${pixels}`);
  if (colClock==0) {
    output("No DNA or RNA in this file sorry?! You sure you gave a file with sequences? " + filename);
    return;
  }

  if (ratio == "sqr" || ratio == "hil") {
    width = Math.round(Math.sqrt(pixels));
    height = width;
    while ( pixels > width*height) {
      log(`width ${width} height ${height}`)
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
  if ( pixels < width*height) {
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
      pollForStream();
    }));

  }
  function openOutputs() {
    status ="open outputs";

    output("Input DNA: " + filename)
    output("Saved PNG: " + filenamePNG);
    if ( ratio=="hil" ) {
      output("Saved Hilbert projection: " + filenameHILBERT);
    }


    log(renderSummary());

    if (!devmode) {
      output("Opening your image. If process blocked either quit browser AND image viewer or [ CONTROL-C ]");

      if (openHtml) {
        opn(filenameHTML).then(() => {
          log("browser closed");
        }).catch();
      } else if (isHilbertPossible) {
        opn(filenameHILBERT).then(() => {
          log("hilbert image closed");
        }).catch();
      } else {
        opn(filenamePNG).then(() => {
          log("regular png image closed");
        }).catch();
      }
    } else {
      log("devmode: open outputs completed without opening images, due to your -d flag: " + filenamePNG)
    }
    log("Thats us cousin");

  }
  function generateTestPatterns() {
    output("TEST PATTERNS GENERATION");
    output("use -m to try different dimensions 8 is biggest or maybe 9 fresh after a reboot ");
    output("use -a to remove registration marks it looks a little cleaner without them ");
    log(hilbPixels);
    for (test = 1; test <= magnitude; test++) {
      let filePath = path.resolve(__dirname) ;
      let regmarks;
      ( ratio == true || reg == true  ?  regmarks = "" :  regmarks = "_reg" )
      filenameHILBERT = filePath + "/dna/AminoSee_Calibration_" + test + regmarks + ".png";
      output("@");
      out(`Magnitude ${test} curve generation. ${hilbPixels[test]} pixels `);
      dimension = test;
      patternsToPngAndMainArray(); // call with no array for test
      filenamePNG = filePath + "/dna/AminoSee_Linear_" + test + regmarks + ".png";
      arrayToPNG();
    }
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

    for (i = 0; i < hilpix; i++) {
      dot(i, 30000);
      let hilbX, hilbY;
      [hilbX, hilbY] = h.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
      let cursorLinear  = 4 * i ;
      let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth));

      let perc = i / hilpix;
      let thinWhite = 250;
      let thinWhiteSlice = Math.round(perc * 1000 ) % thinWhite;

      hilbertImage[hilbertLinear] =   255*perc; // slow ramp of red
      hilbertImage[hilbertLinear+1] = ( i % Math.round( perc *32) ) / (perc *32) *  255; // SNAKES! crazy bio snakes.
      hilbertImage[hilbertLinear+2] = (perc *2550)%255; // creates 10 segments to show each 10% mark in blue
      hilbertImage[hilbertLinear+3] = 255; // slight edge in alpha

      if (thinWhiteSlice < 5 && devmode) { // 5 one out of 10,000
        log(`@i ${i}   hilbX, hilbY `);
        hilbertImage[hilbertLinear+0] = 255 ;
        hilbertImage[hilbertLinear+1] = 255 - (hilbertImage[hilbertLinear+1]/8);
        hilbertImage[hilbertLinear+2] = 255;
        hilbertImage[hilbertLinear+3] = 255;
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

    }

    function resampleByFactor(shrinkFactor) {
      let sampleClock = 0;
      // let fac = 1/shrinkFactor;
      for (z = 0; z<hilbPixels[dimension]; z++) {
        let sum = z*4;
        let clk = sampleClock*4;
        sampleClock++;
        rgbArray[sum+0] = rgbArray[clk+0]*shrinkFactor;
        rgbArray[sum+1] = rgbArray[clk+1]*shrinkFactor;
        rgbArray[sum+2] = rgbArray[clk+2]*shrinkFactor;
        rgbArray[sum+3] = 255;
        while(z+1/shrinkFactor < sampleClock) {
          sampleClock++;
          clk = sampleClock*4;
          rgbArray[sum+0] += rgbArray[clk+0]*shrinkFactor;
          rgbArray[sum+1] += rgbArray[clk+1]*shrinkFactor;
          rgbArray[sum+2] += rgbArray[clk+2]*shrinkFactor;
        }
      }
    }
    function pixelsToHilMagnitude(p) { // give it pix it returns magnitude
      dim = 0;
      while (p > hilbPixels[dim]) {
        // status = "set hilbert dim";
        log(`image size ${p} too large for ${hilbPixels[dim]} `);
        dim++;
        if (dim >= maxMagnitude) {
          output("WARNING: This will exceed nodes heap memory and/or call stack.")
        }
      }
      return dim;
    }
    function dot(i, x) {
      if (i % x == 0 ) {
        out('.');
      }
    }
    function saveHilbert(array) {
      status = "getting in touch with my man... hilbert";
      let perc = 0;
      let height, width, pixels;
      pixels = array.length/4; // safety margin of 69 pixels back at the end.
      dimension = pixelsToHilMagnitude(pixels)-1;
      // magnitude = dimension; // mag is the users choice, dimnension is the value we use
      log(`image size ${pixels} will use dimension ${dimension} yielding ${hilbPixels[dimension]} pixels `);



      const h = require('hilbert-2d');
      let hilpix = hilbPixels[dimension];
      let hilbertImage = [hilpix*4];
      let linearpix = rgbArray.length /4;
      shrinkFactor = hilpix / linearpix;
      log(`shrinkFactor pre ${shrinkFactor} = hilpix ${hilpix} / linearpix ${linearpix }`);
      resampleByFactor(shrinkFactor);
      log(filenameHILBERT);
      log(`shrinkFactor post ${shrinkFactor}`);

      width = Math.sqrt(hilpix);
      height = width;
      hilbertImage = [hilpix*4]; //  x = x, y % 960

      for (i = 0; i < hilpix; i++) {
        dot(i, 64000);
        let hilbX, hilbY;
        [hilbX, hilbY] = h.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
        let cursorLinear  = 4 * i ;
        let hilbertLinear = 4 * ((hilbX % width) + (hilbY * width));
        let perc = i / hilpix;
        let thinWhite = 250;
        let thinWhiteSlice = Math.round(perc * 1000 ) % thinWhite;
        if (thinWhiteSlice < 1 && devmode) {

          hilbertImage[hilbertLinear] =   255*perc;
          hilbertImage[hilbertLinear+1] = ( i % Math.round( perc *32) ) / (perc *32) *  255;
          hilbertImage[hilbertLinear+2] = (perc *2550)%255;
          hilbertImage[hilbertLinear+3] = 255 - ((i%2)*24);

          hilbertImage[hilbertLinear+0] = 255 ;
          hilbertImage[hilbertLinear+1] = 255 - (hilbertImage[hilbertLinear+1]/8);
          hilbertImage[hilbertLinear+2] = 255;
          hilbertImage[hilbertLinear+3] = 255;
        } else {

          hilbertImage[hilbertLinear] =   rgbArray[cursorLinear];
          hilbertImage[hilbertLinear+1] = rgbArray[cursorLinear+1];
          hilbertImage[hilbertLinear+2] = rgbArray[cursorLinear+2];
          hilbertImage[hilbertLinear+3] = 255;//rgbArray[cursorLinear+3];

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
      hilbert_img_png.data = Buffer.from(hilbert_img_data);
      let wstream = fs.createWriteStream(filenameHILBERT);
      new Promise(resolve =>
        hilbert_img_png.pack()
        .pipe(wstream)
        .on('finish', resolve));

      }

      function removeSpacesForFilename(string) {
        return string.replace(' ', '');
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
          console.log("["+ status +"] " + txt);
        } else {
          // BgBlack = "\x1b[40m"

          console.log(txt);
        }
      }
      function log(txt) {
        if (verbose && devmode) {
          let d = new Date().getTime();
          console.log(status + " [ " + d.toLocaleString() + " ] " + txt + " ");
        } else if (verbose){
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
      function clearPrint(t) {
        if (clear) {
          // process.stdout.write('\x1B[2J\x1B[0f'); // CURSOR TO TOP LEFT????
          // console.log('\033c');
          // process.stdout.write("\x1B[2J"); // CLEAR TERMINAL SCREEN????
          // console.log('\x1Bc');
          // process.stdout.write('\x1B[2J\x1B[0f');
          // process.stdout.write("\033[<0>;<0>H"); // pretty good
          // process.stdout.write("\033[<0>;<0>f"); // cursor to 0,0
          process.stdout.write('\033c'); // <-- this is really the best one
          // put cursor to L,C:  \033[<L>;<C>H
          // put cursor to L,C:  \033[<L>;<C>f


        } else {
          log("noclear");
        }
        printRadMessage();
        console.log(t)
      }

      function prettyDate() {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today  = new Date();

        return today.toLocaleString(options) + "  " + today.toLocaleDateString(options); // Saturday, September 17, 2016
      }
      function printRadMessage() {

        console.log(terminalRGB("╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐\r", 255, 60, 250) );
        console.log(terminalRGB("╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘\r", 128, 128, 255) );
        console.log(terminalRGB("╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─\r", 128, 240, 240) );
        console.log(terminalRGB(" by Tom Atkinson          aminosee.funk.co.nz      \r", 225, 225, 130) );
        console.log(terminalRGB("  ah-mee-no-see     'I See It Now - I AminoSee it!' \r", 255, 180, 90) );
        console.log("       " + prettyDate());
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
          total : 100
        });

        var iv = setInterval(function () {
          calcUpdate();
          // bar.tick();
          bar.update(percentComplete*100);
          if (bar.completed) {
            clearInterval(iv);
          }
        }, 400);
        return bar;
      }
      function twosigbitsTolocale(num){
        return (Math.round(num*100)/100).toLocaleString();
      }
      function drawHistogram() {
        if (updates == false) {
          // status = "Stats display disabled ";
          // status += args._;
          return status;
        }

        calcUpdate();

        let kCodonsPerSecond = Math.round((genomeSize+1) / (runningDuration+1));
        let bytesPerSec = Math.round((charClock+1) / (runningDuration+1));


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
        text += ` @i ${charClock.toLocaleString()} File: ${chalk.rgb(255, 255, 255).inverse(justNameOfDNA.toUpperCase())}.${extension}  Line breaks: ${breakClock.toLocaleString()} Files: ${howMany} DNA Filesize: ${Math.round(baseChars/1000)/1000} MB `;
        text += lineBreak;
        text += chalk.rgb(128, 255, 128).inverse(`[ ${twosigbitsTolocale(percentComplete*100)}% done Time remain: ${twosigbitsTolocale(timeRemain)} sec Elapsed: ${Math.round(runningDuration/1000)} sec KB remain: ${kbRemain}`);
          text += chalk.rgb(128, 255, 128).inverse(`[ ${status.toUpperCase()} ]`);

          ( artistic ? text += `[ Artistic Mode 1:${artisticHighlightLength}] ` : text += " [ Science Mode 1:1] " )

          text += lineBreak;
          text += ` Next update: ${msPerUpdate.toLocaleString()}ms `;
          // ( peptide != "none" ? text += ` Highlight peptide: ${peptide}° ` :  )
          // ( triplet != "none" ? text += ` Highlight triplet: ${triplet}° ` :  )

          // text += lineBreak;
          text += `[ Codons: ${genomeSize.toLocaleString()} ]  Last Acid: `;
          text += terminalRGB(aminoacid, red, green, blue);
          text += lineBreak + `[ CPU: ${bytes(bytesPerSec)}/s Codons per sec: ${Math.round(kCodonsPerSecond).toLocaleString()} ] `;
          // text += lineBreak;
          text += `[ Mb Codons per pixel: ${twosigbitsTolocale(codonsPerPixel)} Pixels painted: ${colClock.toLocaleString()} ] `;
          text += `[ Codon Opacity: ${twosigbitsTolocale(opacity*100)}%] `;
          text += lineBreak;
          text += lineBreak;
          text += histogram(aacdata, { bar: '/', width: 40, sort: true, map:  aacdata.Histocount} );
          text += lineBreak;
          text += `[ raw:   ${ removeLineBreaks(rawDNA)} ]  [ clean: ${ cleanString(rawDNA)} ] `;
          text += lineBreak;
          text += `Output png: ${justNameOfPNG}]`;
          text += interactiveKeysGuide;


          if (status == "paint" || updates) {
            updatesTimer = setTimeout(() => {
              clearPrint(drawHistogram()); // MAKE THE HISTOGRAM AGAIN LATER
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
        function isHighlightPeptide(pep) {
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
          return (pep.Codon == "Start Codons" );
        }
        function isStopTOTAL(pep) {
          return (pep.Codon == "Stop Codons" );
        }
        function isNoncoding(pep) {
          return pep.Codon == "Non-coding NNN";
        }
        function isPeptide(pep) {
          return pep.Codon == peptide;
        }
        function tripletToHue(str) {
          return array.find(isHighlightTriplet).Hue;
        }
        function peptideToHue(pep) {
          return pepTable.find(isHighlightPeptide).Hue;
        }
        function getCodonIndex(str) {
          return pepTable.indexOf(str);
        }
        function getTripletIndex(str) {
          return dnaTriplets.find( (dna) => {dna.DNA == str} )
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
                    // pepTable[pepTable.find(isStopTOTAL)].Histocount++;

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
                out(terminalRGB(aminoacid.charAt(0), red, green, blue));
                if(colClock % 10 ==0 ){
                  out(` [ ${colClock} ] `);
                  out(terminalRGB(rawDNA + " ", 64, 128, 64));
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
        by Tom Atkinson          aminosee.funk.co.nz
        ah-mee no-see         "I See It Now - I AminoSee it!"
`, 96, 64, 245);

        const lineBreak = `
`;
