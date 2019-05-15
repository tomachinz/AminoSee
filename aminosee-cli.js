
// "use strict";
//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.nz
//        ah-mee no-see       "I See It Now - I AminoSee it!"
process.title = "aminosee.funk.nz";

const extensions = [ "txt", "fa", "mfa", "gbk", "dna", "fasta", "fna", "fsa", "mpfa", "gb", "gff"];
const refimage = "Reference image - all amino acids blended together"
const closeBrowser = " ";//If the process apears frozen, it's waiting for your browser or image viewer to exit. Escape with [ CONTROL-C ] or use --no-image --no-html"
const lockFileMessage = "aminosee.funk.nz DNA Viewer by Tom Atkinson. This is a temp lock file, to enable parallel cluster rendering, usually it means an AminoSee was quit before finishing. Safe to erase. Normally deleting when render is complete.";
const debugColumns = 80;
const targetPixels = 9000000; // for big genomes use setting flag -c 1 to achieve highest resolution and bypass this taret max render size
const defaultC = 1; // back when it could not handle 3+GB files.
const artisticHighlightLength = 18; // px only use in artistic mode. must be 6 or 12 currently
const defaultMagnitude = 7; // max for auto setting
const theoreticalMaxMagnitude = 12; // max for auto setting
const overSampleFactor = 1.9; // your linear image needs to be 2 megapixels to make 1 megapixel hilbert
const maxCanonical = 32; // max length of canonical name
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ]; // I've personally never seen a mag 9 or 10 image, cos my computer breaks down. 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
const widthMax = 960; // i wanted these to be tall and slim kinda like the most common way of diagrammatically showing chromosomes
const timestamp = Math.round(+new Date()/1000);
let maxMsPerUpdate = 30000; // milliseconds per updatelet maxpix = targetPixels; // maxpix can be changed downwards by algorithm for small genomes in order to zoom in
let termDisplayHeight = 31;
let termStatsHeight = 8;
let maxpix = targetPixels;
let raceDelay = 69; // so i learnt a lot on this project. one day this line shall disappear replaced by promises.
let raceTimer = false;
let dimension; // var that the hilbert projection is be downsampled to
let darkenFactor = 0.25; // if user has chosen to highlight an amino acid others are darkened
let highlightFactor = 4.0; // highten brightening.
let spewThresh = 16969; // spew mode creates matrix style terminal filling each thresh cycles
let devmode = false; // kills the auto opening of reports etc
let verbose = false; // not recommended. will slow down due to console.
let force = false; // force overwrite existing PNG and HTML reports
let artistic = false; // for Charlie
let spew = false; // firehose your screen with DNA
let report = true; // html reports can be dynamically disabled
let test = false;
let updates = true;
let stats = true;
let recycEnabled = false; // bummer had to disable it
let renderLock = false; // not rendering right now obviously
let msPerUpdate = 200; // min milliseconds per update
let stream = require('stream');
let util = require('util');
const path = require('path');
const async = require('async-kit'); // amazing lib
let term = require('terminal-kit').terminal;
// let term = require( path.normalize(appPath + 'node_modules/terminal-kit') ).terminal ;
let gv = require('genversion');
let MyManHilbert = require('hilbert-2d'); // also contains magic
let Readable = require('stream').Readable
let Writable = require('stream').Writable
let Transform = require('stream').Transform
let es = require('event-stream');
const minimist = require('minimist')
const highland = require('highland')
const fetch = require("node-fetch");
const keypress = require('keypress');
// const open = require('open'); //path-to-executable/xdg-open
const open = require('open'); //path-to-executable/xdg-open
const parse = require('parse-apache-directory-index');
// const fs = require("fs");
// const fs = require('fs') // this is no longer necessary
const fs = require('fs-extra'); // drop in replacement
let clear = false;
const request = require('request');
const histogram = require('ascii-histogram');
const bytes = require('bytes');
const Jimp = require('jimp');
const PNG = require('pngjs').PNG;
let PNGReader = require('png.js');
let ProgressBar = require('progress');
const chalk = require('chalk');


const clog = console.log;
const os = require("os");
const hostname = os.hostname();
const appFilename = require.main.filename;
let appPath = path.normalize(appFilename.substring(0, appFilename.length-15));// + /bin/aminosee.js has 11 chars; cut 4 off to remove /dna
const outputPath = path.normalize(path.resolve(process.cwd()) + "/output"); // current working diretory is in /bin/aminosee.js
const defaultFilename = "dna/megabase.fa"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
let currentOutputPath = path.normalize(path.resolve(process.cwd()+'/output')); // support "aminosee dna/megabase" meaning the dna file is not in same dir
const testFilename = "AminoSeeTestPatterns"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
let nextFile = ""; // for batch jobs like *
let highlightTriplets = [];
let isHighlightSet = false;
let isHilbertPossible = true; // set false if -c flags used.
let isDiskFinLinear = true; // flag shows if saving png is complete
let isDiskFinHilbert = true; // flag shows if saving hilbert png is complete
let isDiskFinHTML = true; // flag shows if saving html is complete
let willRecycleSavedImage = false; // allows all the regular processing to mock the DNA render stage
let filename = testFilename;
let rawDNA ="@"; // debug
let status = "load";
// let StdInPipe = require('./stdinpipe');
// let pipeInstance = new StdInPipe();
gv.generate(appPath +'lib/version.js', function (err, version) {
  if (err) {
    throw err;
  } else {
    log("Generated version file");
  }
});
let version = require('./lib/version');

out( `v${version}` );

console.log(`${chalk.rgb(255, 255, 255).inverse("Amino")}${chalk.rgb(196,196,196).inverse("See")}${chalk.rgb(128,128,128).inverse("No")}${chalk.rgb(64, 64, 64).inverse("Evil")}`);
let interactiveKeysGuide = "";
let hilbertImage, keyboard, filenameTouch, estimatedPixels, args, filenamePNG, extension, reader, hilbertPoints, herbs, levels, progress, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, textFile, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, fileUploadShowing, testColors, chunksMax, chunksize, chunksizeBytes, cpu, subdivisions, contextBitmap, aminoacid, colClock, start, updateClock, bytesPerSec, pixelStacking, isHighlightCodon, justNameOfDNA, justNameOfPNG, justNameOfHILBERT, sliceDNA, filenameHTML, howMany, timeElapsed, runningDuration, kbRemain, width, triplet, updatesTimer, pngImageFlags, codonsPerPixel, codonsPerPixelHILBERT, CRASH, red, green, blue, alpha, errorClock, breakClock, streamLineNr, filesDone, spewClock, opacity, codonRGBA, geneRGBA, currentTriplet, currentPeptide,  progato, shrinkFactor, reg, image, loopCounter, percentComplete, charClock, baseChars, bigIntFileSize, currentFile, currentPepHighlight, justNameOfCurrentFile, server, openHtml, openFileExplorer, pixelStream;
BigInt.prototype.toJSON = function() { return this.toString(); }; // shim for big int
BigInt.prototype.toBSON = function() { return this.toString(); }; // Add a `toBSON()` function to enable MongoDB to store BigInts as strings

percentComplete = charClock = baseChars = genomeSize = 1;

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



module.exports = () => {
  version = require('./lib/version');
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
    boolean: [ 'file' ],
    boolean: [ 'explorer' ],
    string: [ 'codons'],
    string: [ 'magnitude'],
    string: [ 'triplet'],
    string: [ 'peptide'],
    string: [ 'ratio'],
    string: [ 'width'],
    unknown: [ true ],
    alias: { a: 'artistic', c: 'codons', d: 'devmode', f: 'force', m: 'magnitude', p: 'peptide', i: 'image', t: 'triplet', r: 'reg', s: 'spew', w: 'width', v: 'verbose', x: 'explorer' },
    default: { updates: true, explorer: false }
  });
  let cmd = args._[0];
  out(`cmd ${cmd}`);
  log("args is currently " + args.toString());
  log("args._ is currently " + args._.toString());
  log("args is currently " + args.toString());

  //
  // console.log(`stdin pipe: ${pipeInstance.checkIsPipeActive()}`);
  // const stdin = pipeInstance.stdinLineByLine();
  // stdin.on('line', console.log);

  if (args.keyboard || args.k) {
    keyboard = true;
    termDisplayHeight += 3; // display bigger
    if (verbose) {
      termDisplayHeight++;
    }
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
  if (args.image || args.i) {
    openImage = true;
    output(`will automatically open image`)
  } else {
    log(`will not open image`)
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
    output(`codons per pixel ${userCPP}`);
    codonsPerPixel = userCPP;
  } else {
    codonsPerPixel = defaultC;
    userCPP = -1;
  }

  if (args.magnitude || args.m) {
    magnitude = Math.round(args.magnitude || args.m);
    if (isHilbertPossible) {
      if (magnitude < 1 ) {
        dimension = 1;
        // maxpix = 4096 * 16; // sixteen times oversampled in reference to the linear image.
        output("Magnitude must be an integer number between 3 and 9. Using -m 3 for 4096 pixel curve.");
      } else if ( magnitude > theoreticalMaxMagnitude) {
        dimension = theoreticalMaxMagnitude;
        maxpix = 64000000;
        output("Magnitude must be an integer number between 3 and 9.");
      } else if (magnitude > 6 && magnitude < 9) {
        maxpix = 16000000;
        output(`Magnitude 8 requires 700 mb ram and takes a while. It's 2048x2048.`);
      } else if (magnitude > 8) {
        maxpix = 32000000;
        output(`This setting will give your machine quite the hernia. It's in the name of science but.`);
        output(`On my machine, magnitude 8 requires 1.8 GB of ram and 9+ crashes nodes heap and 10+ crashes the max call stack, so perhaps this will run OK in the 2020 AD`);
      }
    }
  } else {
    magnitude = defaultMagnitude;
  }

  log(`maxpix: ${maxpix} dimension: ${dimension}`);
  if (args.ratio) {
    ratio = args.ratio;
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
      log(`No custom ratio chosen. (default)`);
      ratio = "fix";
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
      error(`could not lookup peptide: ${users} using ${peptide}`);
    }
  } else {
    log(`No custom peptide chosen. (default)`);
    peptide = "none";
  }
  if ( peptide == "none" && triplet == "none") {
    // DISABLE HIGHLIGHTS
    darkenFactor = 1.0;
    highlightFactor = 1.0; // set to zero to i notice any bugs
    isHighlightSet = false;
  } else {
    output(`peptide  ${peptide} triplet ${triplet}`);
    isHighlightSet = true;
    report = false; // disable html report
  }

  if (args.artistic || args.art || args.a) {
    output(`artistic enabled. Start (Methione = Green) and Stop codons (Amber, Ochre, Opal) interupt the pixel timing creating columns. protein coding codons are diluted they are made ${twosigbitsTolocale(opacity*100)}% translucent and ${twosigbitsTolocale(codonsPerPixel)} of them are blended together to make one colour that is then faded across ${artisticHighlightLength} pixels horizontally. The start/stop codons get a whole pixel to themselves, and are faded across ${highlightFactor} pixels horizontally.`);
    artistic = true;
    isHilbertPossible = false;
    pngImageFlags += "_art";
    if  (args.ratio)  {
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
    termDisplayHeight++;
  }
  if (args.html) {
    output("will open html after render")
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
    toggleDevmode();
  } else {
    devmode = false;
  }
  if (args.force || args.f) {
    output("force overwrite enabled.");
    force = true;
  }
  if (args.file || args.explorer || args.x) {
    log("will open folder in File Manager / Finder / Explorer when done.");
    openFileExplorer = true;
    if (cmd == 'calibration' || cmd == 'test' || cmd == 'open') {
      openOutputs();
    }
  } else {
    openFileExplorer = false;
  }
  if (args.help || args.h) {
    helpCmd(args);
  }


  if (args.clear || args.c) {
    log("screen clearing enabled.");
    clear = true;
  } else {
    log("clear screen disabled.");
    clear = false;
    termDisplayHeight--;
  }
  if (args.updates || args.u) {
    log("statistics updates enabled");
    updates = true;
  } else {
    log("statistics updates disabled");
    updates = false;
    maxMsPerUpdate = 5000;
  }
  log(`args: ${args._}`);
  howMany = args._.length ;

  if (args.test) {
    test = true;
    cmd = "test";
    generateTestPatterns();
  } else {
    test = false;
  }
  // firstRun();

  switch (cmd) {
    case 'unknown':
    output(` [unknown argument] ${cmd}`);
    break;

    case 'get':
    downloadMegabase(pollForStream); //.then(out("megabase done"));//.catch(log("mega fucked up"));
    break;

    case 'test':
    generateTestPatterns();
    break;

    case 'demo':
    runDemo();
    break;

    case 'serve':
    launchNonBlockingServer();
    cmd = 'serve';
    break;

    case 'help':
    helpCmd(args);
    break;

    case 'firstrun':
    firstRun();
    break;

    case 'list':
    listDNA();
    break

    default:
    if (cmd == undefined) {
      currentFile = args._[0];
      // currentFile = args._.pop();
      // filename = path.resolve(currentFile); //
      // args._.push(currentFile);
      status = "no command";

      if (mkdir(`calibration`) == true && mkdir('output') == true) {
        output("FIRST RUN!!! Opening the demo... use the command aminosee demo to see this first run demo in future");
        firstRun();
      } else {
        log('not first run')
      }

      output(`Try running  --->>>        aminosee demo`);//" Closing in 2 seconds.")
      output(`usage        --->>>        aminosee [*/dna-file.txt] [--help|--test|--demo|--force|--html|--image|--keyboard]     `);//" Closing in 2 seconds.")
      log(`your cmd: ${currentFile} howMany ${howMany}`);
      // setTimeout(() => {
      //   quit(1);
      // }, 2000);
      pollForStream();
      return true;
    } else {
      status = "Ω";
      out(status);
      currentFile = args._[0];
      // currentFile = args._.pop();
      filename = path.resolve(currentFile); //
      log(filename)
      // args._.push(filename);
      // args._.push(filename);

      // args._.push("hello-world.txt");
      isDiskFinHTML = isDiskFinHilbert = isDiskFinLinear = true;

      pollForStream();
      // theSwitcher(true); // <--- GOOD

      return true;
    }
    status = "leaving switch";
    out("ॐ");
    log(status)
  }
  status = "global";
  out(".");
}
term.on('resize', function(width, height) {
  // clearCheck();
  clearScreen();
  console.info('Terminal resized: ' + width + ', ' + height);
});
function isThisFirstRun() { // true is first run by user

}

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
      gracefulQuit();

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



  });

  try {
    process.stdin.setRawMode(true);

  } catch(err) {
    output(`Could not use interactive keyboard due to: ${err}`)
  }
  process.stdin.resume();
}

function toggleVerbose() {
  verbose = !verbose;
  out(`verbose mode ${verbose}`);
}
function toggleSpew() {
  spew = !spew;
  out(`spew mode ${spew}`);
}
function toggleDevmode() {
  devmode = !devmode;
  out(`devmode ${devmode}`);
  if (devmode) {
    verbose = true;
    updates = false;
    clear = false;
    raceDelay = 6969;
    openHtml = false;
    openImage = false;
    openFileExplorer = false;
    termDisplayHeight++;
  }
}
function toggleForce() {
  force = !force;
  out(`force overwrite ${force}`);
}

function toggleClearScreen() {
  clear = !clear;
  out("clear screen toggled.");
}
function toggleUpdates() {
  updates = !updates;
  out(`stats updates toggled to: ${updates}`);
}
function gracefulQuit() {
  status = "GRACEFUL QUIT IN 5 SECONDS";
  out(status);
  args = [];
  howMany = -1;
  calcUpdate();
  setTimeout(quit, 5000);
  // whack_a_progress_on();
}
function background(callback) {
  // const spawn = require('cross-spawn');

  // Spawn NPM asynchronously
  // const evilSpawn = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'pipe' }); // inline can quit
  // const evilSpawn = spawn('aminosee', ['open', 'explorer'], { stdio: 'inherit' }); // background
  // evilSpawn.stdout.on('data', (data) => {
  //   console.log(`${chalk.inverse('aminosee serve')}${chalk(': ')}${data}`);
  // });
  // evilSpawn.stderr.on('data', (data) => {
  //   console.log(`${chalk.inverse('aminosee error')}${chalk(': ')}${data}`);
  // });
  // evilSpawn.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });
}
function bgOpen(file, options) {
  if (options == undefined) {
    options = { wait: false }
  }
  (async () => {
    await open(file, options);
  })();
}
function runDemo() {


  async.waterfall( [
    function w1( callback ) {
      symlinkGUI();
      generateTestPatterns(callback);
    },
    function w2( callback ) {
      // openHtml = true;
      // openImage = true;
      openHtml = false;
      openImage = false;
      // openFileExplorer = false;
      currentFile = testFilename;
      // bgOpen(currentOutputPath + '/calibration');
      callback();
    },
    function w3( callback ) {
      regmarks = true;
      generateTestPatterns();
      callback();
    },
    function w4( callback ) {
      callback();
    },
    function w4( callback ) {
      currentFile = defaultFilename;
      args._[0] = currentFile;
      args._.push(currentFile);
      downloadMegabase(pollForStream);
      pollForStream();
      // initStream(args._[0])
      // theSwitcher(false);
      // let thisJob = createJob().then(log('thisJob CONTINUE')).catch(log('thisJob LATCH'));
      // launchNonBlockingServer();
      callback();
    }
  ])
  .timeout( 200 )
  .then( function(  ) {
    log("fubar")
  } )
  .catch( function( error ) {
    log("sleepy")
  } )
  .execArgs( () => {log("Fooos")});

}
function downloadMegabase(cb) {
  currentFile = 'megabase.fa';
  let promiseMegabase = new Promise(function(resolve,reject) {
    try {
      var exists = doesFileExist(currentFile);
    } catch(err) {
      out(maxWidth(5, "e:" + err));
    }
    if (exists) {
      resolve()
      cb()
    } else {
      if (runTerminalCommand(`wget https://www.funk.co.nz/aminosee/dna/megabase.fa`)) {
        resolve();
        cb()
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
function runTerminalCommand(str) {
  console.log(`[ running terminal command ---> ] ${str}`);
  const exec = require("child_process").exec
  exec(str, (error, stdout, stderr) => {
    error(error);
    output(stdout);
    error(stderr);
    if (error) {
      return false;
    } else {
      return true;
    }
  })
}
// function streamingZip(f) {
//   zipfile = path.resolve(f);
//   fs.createReadStream(zipfile)
//   .pipe(unzipper.Parse())
//   .pipe(stream.Transform({
//     objectMode: true,
//     transform: function(entry,e,cb) {
//       var zipPath = entry.path;
//       var type = entry.type; // 'Directory' or 'File'
//       var size = entry.size;
//       var cb = function (byte) {
//         console.log(byte);
//       }
//       if (zipPath === "this IS the file I'm looking for") {
//         entry.pipe(fs.createWriteStream('dna'))
//         .on('finish',cb);
//       } else {
//         entry.autodrain();
//         cb();
//       }
//     }
//   }));
// }

function listDNA() {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest('https://www.funk.co.nz/aminosee/output/');
  let txt = xhr.responseText;
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
function createJob(cb) {
  return new Promise(function(resolve,reject) {
    ( cb ? resolve() : reject() )
  })
}
function pollForStream() {
  if (test) {
    return false;
  }
  if (renderLock) {
    return false;
  }
  if (!(isDiskFinLinear && isDiskFinHilbert && isDiskFinHTML)){
    log(` [is disk finished writing? linear hilbert html ] ${isDiskFinLinear  + " " +  isDiskFinHilbert  + " " +  isDiskFinHTML }`);
    return false;
  } else {
    log(` [ disk finished. continuing to render next file ] ${isDiskFinLinear  + " " +  isDiskFinHilbert  + " " +  isDiskFinHTML }`);
  }
  if (howMany < 1) {
    log("FINITO");
    return false;
  }

  status = "polling";
  log(` [polling ${nicePercent()} ${status} ${new Date()}`);
    clearCheck();

    try {
      nextFile = args._[1];
    } catch(e) {
      nextFile = "Finished. Due to: "+ e;
    }

    try {
      if (args._) {
        currentFile = args._[0];
        currentFile = args._.pop();
        log(chalk.bgWhite(`pop ${currentFile} howMany ${howMany}`) +  chalk(nextFile) );
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
    log(` [ howMany  ${howMany} ${status} ${filename} ${currentFile}]`)


    if (currentFile == undefined) {
      // quit()
      return false;
    }

    howMany = args._.length;
    filename = path.resolve(currentFile);
    log("currentFile: " + filename)
    let pollAgainFlag = false;
    let willStart = true;
    log( " currentFile is " + currentFile   + args)
    try {
      if (!fs.statSync(filename).isFile) {
        output("This is not a file: " + filename)
        theSwitcher(false);
        return false;
      }
    } catch(err) {
      error("HANDLED ERROR: " + err);
      output("statSync: false " + filename)
      theSwitcher(false);
      return false;
    }

    if (filename == defaultFilename) { // maybe this is to get past my lack of understanding of processing of args.
      log("skipping default: " + defaultFilename); // it was rendered same file twice i think
      log("checkFileExtension: " + filename)
      theSwitcher(false);
      return false;
    }
    log("POLLING FILENAME: " + filename)
    if (!checkFileExtension(getFileExtension(filename))) {
      log("getFileExtension(filename): " + getFileExtension(filename));
      log("checkFileExtension(getFileExtension(filename)): " + checkFileExtension(getFileExtension(filename)))
      theSwitcher(false);
      return false;
    } else {

      autoconfCodonsPerPixel();
      status ="polling";
      setupFNames();



      if (okToOverwritePNG(filenamePNG) == false) {
        out("existing linear png found for: " + justNameOfDNA);
        if (openHtml || openImage || args.image == true) {
          output("use --no-image suppress automatic opening of the image.")
          openOutputs();
        } else {
          output("use --force to overwrite  --image to automatically open   ");
        }

        recycleOldImage(filenamePNG); // recycled with new hilbert
        return false; // just straight quit both images are rendered
      }



      let temp = !checkLocks(filenameTouch);
      if (temp) {
        log("!checkLocks(filenameTouch) " + temp);
        theSwitcher(false); // <---- FAIL
        return false;
      } else {
        log(`Polling filenameTouch ${filenameTouch}`);
        theSwitcher(true); // <--- GOOD
        return true;
      }
    }


    // log(`willStart   ${willStart}  pollAgainFlag ${pollAgainFlag}  defaultFilename  ${defaultFilename}  ${filename}  howMany   ${howMany}   status ${status}`);

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
  function firstRun() {
    output(chalk.bgRed("First run demo!"));
    output(chalk.bgYellow("First run demo!"));
    output(chalk.bgGreen("First run demo!"));

    runDemo();
  }
  function pStream() { // returns readable to push pixels into
    const stream = new Readable({
      objectMode: true,
      read() {}
    })
    return stream
  }
  async function initStream(f) {
    status = "init";
    isDiskFinHTML = false;
    isDiskFinHilbert = false;
    isDiskFinLinear = false;
    mkdir(`output`);
    mkdir(`output/${justNameOfDNA}`);
    mkdir(`output/${justNameOfDNA}/images`);
    log("stream");
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
    genomeSize = 1;
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
    setupFNames();
    extension = getFileExtension(f);
    log(` [ func parm: ${f} ]`);
    log(` [ cli parameter: ${filename} ]`);
    log(` [ canonical:     ${justNameOfDNA} ]`);
    log(` [FILESIZE] ${baseChars.toLocaleString()} extension: ${extension}`);

    percentComplete = 0;
    genomeSize = 1; // number of codons.
    pixelStacking = 0; // how we fit more than one codon on each pixel
    colClock = 0; // which pixel are we painting?
    timeElapsed = 0;
    status = "init";
    clearCheck();
    output(`STARTING RENDER ${filename}`);
    output(" ");
    output(" ");
    output(" ");
    output(" ");
    output(" ");
    output(" ");
    output(" ");
    output(" ");
    output(" ");
    term.up(termDisplayHeight + termStatsHeight*2);
    clearCheck();
    term.eraseDisplayBelow();
    if (updatesTimer) {
      clearTimeout(updatesTimer);
    }
    if (willRecycleSavedImage == true) {
      log("AM PLANNING TO RECYCLE TODAY (joy)")
      recycleOldImage(filenamePNG);
      // saveDocuments();
      return;
    }
    pixelStream = pStream();
    pixelStream.pipe(new PNG({
      width: 960,
      inputHasAlpha: true
    }))
    .on('parsed', function() {
      this.pack().pipe(fs.createWriteStream('streaming-out.png'));
    });


    process.title = `aminosee.funk.nz ${justNameOfDNA} ${bytes(estimatedPixels*4)}`;


    try {
      var readStream = fs.createReadStream(filename).pipe(es.split()).pipe(es.mapSync(function(line){
        status = "wait stream";
        readStream.pause(); // pause the readstream during processing
        streamLineNr++;
        processLine(line); // process line here and call readStream.resume() when ready
        readStream.resume();
      })
      .on('error', function(err){
        status = "stream error";
        error('while reading file: ' + filename, err.reason);
        error(err)
        log(status)
      })
      .on('end', function() {
        status = "stream end";
        log("Stream ending event");
      })
      .on('close', function() {
        status = "stream close";
        log("Stream closed.");
        // pixelStream.close();
        progato = null;
        currentTriplet = "none";
        currentTriplet = triplet;
        setImmediate( calcUpdate )

        return saveDocuments();
      }));
    } catch(e) {
      error("ERROR:"  + e)
    }

    clearCheck();
    drawHistogram();
    log("FINISHED INIT");
    term.up(termStatsHeight);
    term.eraseDisplayBelow();
  }
  function showFlags() {
    return `${(  force ? "F" : "-"    )}${(  args.updates || args.u ? `U` : "-"    )}${(  userCPP != -1 ? `C${userCPP}` : "--"    )}${(  args.keyboard || args.k ? `K` : "-"    )}${(  args.spew || spew ? `K` : "-"    )}${( verbose ? "V" : "-"  )}${(  artistic ? "A" : "-"    )}${(  args.ratio || args.r ? `${ratio}` : "---"    )}${(dimension? "M" + dimension:"")}C${onesigbitTolocale(codonsPerPixel)}${(reg?"REG":"")}`;
  }
  function testSummary() {
    return `TEST
    Filename: <b>${justNameOfDNA}</b>
    Registration Marks: ${( reg ? true : false )}
    ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
    Your custom flags: TEST${(  force ? "F" : ""    )}${(  userCPP != -1 ? `C${userCPP}` : ""    )}${(  devmode ? "D" : ""    )}${(  args.ratio || args.r ? `${ratio}` : ""    )}${(  args.magnitude || args.m ? `M${dimension}` : ""    )}
    ${(  artistic ? ` Artistic Mode` : ` Science Mode`    )}
    Max magnitude: ${dimension} / 10 Max pix: ${maxpix.toLocaleString()}
    Hilbert Magnitude: ${dimension} / ${defaultMagnitude}
    Hilbert Curve Pixels: ${hilbPixels[dimension]}`;
  }
  function renderSummary() {
    maxpix += 0; // cast it into a number from whatever the heck data type it was before!
    return `
    Canonical Filename: <b>${justNameOfDNA}</b>
    Source: ${justNameOfCurrentFile}
    Run ID: ${timestamp} Host: ${hostname}
    AminoSee version: ${version}
    Highlight set: ${isHighlightSet} ${(isHighlightSet ? peptide + " " + triplet : peptide)}
    ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
    Your custom flags: ${(  force ? "F" : ""    )}${(  userCPP != -1 ? `C${userCPP}` : ""    )}${(  devmode ? "D" : ""    )}${(  args.ratio || args.r ? `${ratio}` : "   "    )}${(  args.magnitude || args.m ? `M${dimension}` : "   "    )}
    ${(  artistic ? `Artistic Mode` : `Science Mode`    )}
    Aspect Ratio: ${ratio}
    Input bytes: ${baseChars.toLocaleString()}
    Output bytes: ${rgbArray.length.toLocaleString()}
    Estimated Codons by file size: ${Math.round(estimatedPixels).toLocaleString()}
    Actual Codons matched: ${genomeSize.toLocaleString()}
    Estimate accuracy: ${Math.round(((estimatedPixels / genomeSize)-1)*100)}%
    Non-Base Clock: ${errorClock.toLocaleString()}
    Bases Clock: ${charClock.toLocaleString()}
    Codons per pixel linear image: ${twosigbitsTolocale(codonsPerPixel)}
    Codons per pixel hilbert: ${twosigbitsTolocale(codonsPerPixelHILBERT)}
    Pixels linear: ${colClock.toLocaleString()}
    Pixels hilbert: ${hilbPixels[dimension].toLocaleString()}
    Scale down factor:  ${twosigbitsTolocale(shrinkFactor)}
    overSampleFactor: ${twosigbitsTolocale(overSampleFactor)}
    Amino acid blend opacity: ${Math.round(opacity*10000)/100}%
    Users Max magnitude: ${ ( magnitude != false ? `${magnitude}/ 10 ` : "Not Set" ) } Max pix:${maxpix.toLocaleString()}
    Hilbert Magnitude: ${dimension} / ${defaultMagnitude}
    Hilbert Curve Pixels: ${hilbPixels[dimension]}
    Darken Factor ${twosigbitsTolocale(darkenFactor)}
    Highlight Factor ${twosigbitsTolocale(highlightFactor)}
    Time used: ${runningDuration.toLocaleString()} miliseconds`;
  }
  function sanitiseMagnitude() {
    let computersGuess = pixTodefaultMagnitude(estimatedPixels); // give it pixels it gives magnitude
    log(`image estimatedPixels ${estimatedPixels}   computersGuess ${computersGuess}`)

    if (dimension != undefined || dimension == false || dimension == NaN) {
      if ( dimension < computersGuess) {
        log(`It mite be possible to get higher resolution with --magnitude ${computersGuess}`)
      } else if ( dimension < computersGuess ) {
        log(`Your --magnitude of ${dimension} is larger than my default of ${computersGuess}`)
      }
    } else {
      if ( dimension < computersGuess) {
        log(`It mite be possible to get higher resolution with --magnitude ${computersGuess} your choice was ${dimension}`)
        // default of 6
      } else {
        if ( computersGuess < defaultMagnitude) {
          log(`Image is not super large, fitting output to --magnitude ${computersGuess}`)
          dimension = computersGuess;
        } else {
          log(`Image is big. Limiting size to --magnitude ${defaultMagnitude}`)
          dimension = defaultMagnitude;
        }
      }
    }

    log(`users magnitude is ${magnitude} using dimension of ${dimension} new maxpix: ${maxpix}`);
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
      dimension = pixTodefaultMagnitude(estimatedPixels);
    }
    estimatedPixels = baseChars / 3; // divide by 4 times 3


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

    if (codonsPerPixel < defaultC) {
      codonsPerPixel = defaultC;
    } else if (codonsPerPixel > 6000) {
      codonsPerPixel = 6000;
    } else if (codonsPerPixel == NaN || codonsPerPixel == undefined) {
      codonsPerPixel = defaultC;
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
    return f.substring(0, f.length - (getFileExtension(f).length+1));
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
        ret += `_${spaceTo_( tidyPeptideName( currentPeptide ) )}`;
      } else {
        ret += `-reference`;
      }
    }
    // log(`ret: ${ret} currentTriplet: ${currentTriplet} currentPeptide ${currentPeptide}`);
    return ret;
  }

  function setupFNames() {
    status = "setupFName";
    log(`f: ${currentFile}`)
    justNameOfCurrentFile = replaceoutputPathFileName( currentFile );
    // currentOutputPath = path.normalize(path.resolve(currentFile)); // full path of file
    // currentOutputPath = currentOutputPath.substring(0, currentOutputPath.length - justNameOfCurrentFile.length) + "output"; // just the path now
    extension = getFileExtension(currentFile);
    justNameOfDNA = spaceTo_(removeFileExtension(justNameOfCurrentFile));
    if (justNameOfDNA.length > maxCanonical ) {
      justNameOfDNA = justNameOfDNA.replace('_', '');
    }
    if (justNameOfDNA.length > maxCanonical ) {
      justNameOfDNA = justNameOfDNA.substring(0,maxCanonical/2) + justNameOfDNA.substring(justNameOfDNA.length-(maxCanonical/2),justNameOfDNA.length);
    }
    mkdir(`output/${justNameOfDNA}`);
    let ext = spaceTo_(getImageType());
    filenameTouch = `${currentOutputPath}/${justNameOfDNA}/${generateFilenameTouch()}`;
    filenameHTML =  `${currentOutputPath}/${justNameOfDNA}/${generateFilenameHTML()}`;
    filenamePNG =     `${currentOutputPath}/${justNameOfDNA}/images/${generateFilenamePNG()}`;
    filenameHILBERT = `${currentOutputPath}/${justNameOfDNA}/images/${generateFilenameHilbert()}`;
    log(`ext: ${highlightFilename() + ext} pep ${peptide} status ${status} currentOutputPath ${currentOutputPath} isHighlightSet ${isHighlightSet} filenameTouch ${filenameTouch}`);
  }
  function symlinkGUI() { // does:  ln -s /Users.....AminoSee/public, /Users.....currentWorkingDir/output/public
    let fullSrc, fullDest;
    mkdir('output');
    fullSrc = path.normalize( path.resolve(appPath + '/public') );
    fullDest = path.normalize( path.resolve(currentOutputPath + '/public') );
    createSymlink(fullSrc  , fullDest);

    fullSrc = path.normalize( path.resolve(appPath + '/public/index.html') );
    fullDest = path.normalize( path.resolve(process.cwd() + '/index.html') ); // Protects users privacy in current working directory
    createSymlink(fullSrc, fullDest);
    fullSrc = path.normalize( path.resolve(appPath + '/node_modules') );
    fullDest = path.normalize( path.resolve(currentOutputPath + '/node_modules') ); // MOVES INTO ROOT
    createSymlink(fullSrc, fullDest);
  }
  function destroyGUI() {

  }
  function startLocalWebServer() {
    fullSrc = path.normalize( path.resolve(appPath + '/public/lws.config.js') );
    fullDest = path.normalize( path.resolve(process.cwd() + '/lws.config.js') ); // MOVES INTO ROOT
    createSymlink(fullSrc, fullDest);


    // var PromisaryNote = function () {
    const LocalWebServer = require('local-web-server')
    const localWebServer = new LocalWebServer()
    server = localWebServer.listen({
      configFile: 'output/lws.config.js'
    });
    // .then(function () {
    //   console.log("Promise Resolved");
    // }).catch(function () {
    //   console.log("Promise Rejected");
    // });
    output("Hello");
    return new Promise(function (resolve, reject) {
      if (true === true)
      resolve();
      else
      reject();
    });
    // }

  }
  function createSymlink(src, dest) { // source is the original, dest is the symlink
    output(src, " --> " , dest);
    try { // the idea is to copy the GUI into the output folder to.... well enable it to render cos its a web app!
      let existing = doesFileExist(dest);
      if (existing == true) {
        log(`symlink already appears to be in place at: ${dest}`);
        return false;
      } else {
        // fs.symlink(src, dest, function (err, result) {
        //   if (err) { console.warn(`Just a slight issue creating a symlink: ${err}`)}
        //   if (result) { log(`Great Symlink Success ${result}`)}
        // });
        fs.symlinkSync(src, dest, function (err, result) {
          if (err) { console.warn(`Just a slight issue creating a symlink: ${err}`)}
          if (result) { log(`Great Symlink Success ${result}`)}
        });
      }
    } catch(e) {
      log("Symlink ${} could not created. Probably not an error. " + maxWidth(12,e));
    }
  }
  function getServerURL(path) {
    let internalIp = require('internal-ip');
    if (path == undefined) {
      path = "/";
    }
    serverURL = `http://${internalIp.v4.sync()}:3210${path}`;
    return serverURL;
  }
  function launchNonBlockingServer(path) {
    startServeHandler();
    serverURL =  getServerURL();
    printRadMessage([
      `Interactive keyboard mode ENABLED`,
      `use keyboard to control AminoSee`, `local webserver is running from:`,
       chalk.underline(outputPath),
      'use Control-C to stop',
       `${serverURL} <-- only your LAN  http://localhost:3210 <-- only your machine`
     ]);
    if (path == undefined) { path = "/" }
    setupKeyboardUI();
    symlinkGUI();
    // openMiniWebsite(path);
  }
  function startServeHandler() {

    const handler = require('serve-handler');
    const http = require('http');

    const server = http.createServer((request, response) => {
      // You pass two more arguments for config and middleware
      // More details here: https://github.com/zeit/serve-handler#options
      let options = {
        public: './',
        renderSingle: true,
        symlinks: true,
        unlisted: [
          ".DS_Store",
          ".git"
        ],
        directoryListing: [
          "/output/**",
          "/public/**",
          "/calibration/*"
        ]
      }
      return handler(request, response, options);
    })
    let port = 4321;//3210;
    server.listen(port, () => {
      console.log(`Running at http://localhost:${port}`);
    });
  }
  function startCrossSpawnHttp() {

    // const spawn = require('cross-spawn');
    //
    // // Spawn NPM asynchronously
    // // const evilSpawn = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' });
    // const evilSpawn = spawn('http-server', ['', '', '', '0'], { stdio: 'pipe' });
    // evilSpawn.stdout.on('data', (data) => {
    //   console.log(`${chalk.inverse('aminosee serve')}${chalk(': ')}${data}`);
    // });
    //
    // evilSpawn.stderr.on('data', (data) => {
    //   console.log(`${chalk.inverse('aminosee error')}${chalk(': ')}${data}`);
    // });
    //
    // evilSpawn.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });
    // port: 3210,
    // https: true,
    // log: ({
    // format: 'stats'
    // }),
    // directory: currentOutputPath,
    // sp a: 'index.html',
    // websocket: 'src/websocket-server.js'

    // stat("Personal mini-Webserver starting up around now (hopefully) on port 3210");
    // stat(`visit ${serverURL} in your browser to see 3D WebGL visualisation`);
    // log(terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10));
    // log(terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200));
    // stat("Control-C to quit");
  }
  function openMiniWebsite(path) {
    out(`Opening URL: ${getServerURL()}`)
    try {
      open(`${getServerURL()}`);
    } catch(e) {
      error(`during openMiniWebsite: ${e} URL: ${getServerURL()}`);
    }
  }
  function welcomeMessage() {

    output('usage:');
    output('    aminosee [files/*] --flags            (to process all files)');
    output(' ');
    output(terminalRGB('TIP: if you need some DNA in a hurry try this random clipping of 1MB human DNA:', 255,255,200));
    output('wget https://www.funk.co.nz/aminosee/dna/megabase.fa');
    output(' ');
    output('examples:    ');
    output('     aminosee Human-Chromosome-DNA.txt --force (force overwrite fresh render)');
    output('     aminosee chr1.fa -m 8                 (render at 2048x2048)');
    output('     aminosee * --peptide="Glutamic acid" (use quotes if there is a space)');
    output('     aminosee * --triplet=GGT (must be only 3 characters of ATCGU)');
    output('     aminosee test                 (generate calibration images)');
    output('     aminosee serve                (fire up the mini web server)');
    output('     aminosee help   <<-----               (shows options flags)');
    output('     aminosee demo   <<-----           (run demo - beta version)');
    output('     aminosee chr1.fa  chrX.fa  chrY.fa         (render 3 files)');
    output('     aminosee *         (render all files with default settings)');
    term.down(termStatsHeight);
    printRadMessage();

  }





  function saveDocuments(callback) {
    status = "save"; // <-- this is the true end point of the program!
    term.eraseDisplayBelow();
    percentComplete = 1; // to be sure it shows 100% complete
    out(status);
    clearTimeout(updatesTimer);
    calcUpdate();
    calculateShrinkage();
    output(chalk.rgb(255, 255, 255).inverse(fixedWidth(debugColumns, `Input DNA File: ${filename}`)));
    output(chalk.rgb(200,200,200).inverse(  fixedWidth(debugColumns, `Linear PNG: ${justNameOfPNG}`)));
    output(chalk.rgb(150,150,150).inverse(  fixedWidth(debugColumns, `Hilbert PNG: ${justNameOfHILBERT}`)));
    output(chalk.rgb(100,100,180).inverse(  fixedWidth(debugColumns, `HTML ${justNameOfHTML}`)));
    output(chalk.rgb(80,80,120).inverse(    fixedWidth(debugColumns, `${filenameTouch.substring(filenameTouch.length -24, -1)} LOCKFILE`)));

    mkdir(justNameOfDNA);
    mkdir(`${justNameOfDNA}/images`);

    if (willRecycleSavedImage == false) {
      arrayToPNG(function () {
        linearFinished();
        removeLocks();
      });
    } else {
      setImmediate(() => {
        removeLocks();
      });
    }

    if (isHilbertPossible) {
      log("projecting linear array to 2D hilbert curve");
      saveHilbert(rgbArray);
    } else {
      output("Cant output hilbert image when using artistic mode");
      hilbertFinished() ;
    }

    let promiseHTML = new Promise(function(resolve,reject) {
      if (report == true) { // report when highlight set
        status = "saving html report";
        out(status);
        saveHTML();
      } else {
        status = "not saving html report";
        out(status);
        htmlFinished();
        resolve();
      }
    });

    // if (report == true) { // report when highlight set
    //   status = "saving html report";
    //   out(status);
    //   saveHTML();
    //
    //
    //
    // } else {
    //   status = "not saving html report";
    //   out(status);
    //   htmlFinished();
    // }

    log(renderSummary());

    // updates = true;
    status = "removelocks";
    setImmediate(() => {
      openOutputs();
    });
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
  function saveHTML() {
    status = "report"
    if (willRecycleSavedImage == true) {
      log("Didnt save HTML report because the linear file was recycled. Use --html to enable and auto open when done.");
      htmlFinished();
      if (openHtml) {
        openOutputs();
      } else {  return  false;}
    }
    if (report == false){
      log("Didnt save HTML report because reports = false they were disabled. Use --html to enable and auto open when done.");
      htmlFinished();
      return;
    } else {
      out(status);
    }
    log( pepTable.sort( compareHistocount ) ); // least common amino acids in front

    // var jsonObj = JSON.parse(jsonData);
    // console.log(jsonObj);
    // stringify JSON Object
    let histogramFile = path.normalize( path.resolve(`${currentOutputPath}/${justNameOfDNA}/${justNameOfDNA}_histogram.json`) );
    let hypertext = htmlTemplate();
    log(`currentOutputPath is ${currentOutputPath}`);
    fileWrite(histogramFile, JSON.stringify(this.pepTable), 'utf8');

    // fs.writeFile(histogramFile, JSON.stringify(this.pepTable), 'utf8', function (err) {
    //   if (err) {
    //     error("occured while writing JSON Object to File.");
    //     htmlFinished();
    //     return console.log(err);
    //   } else {
    //     fs.chmodSync(histogramFile, 0o777);
    //   }
    //   log("Amino acid histogram JSON file has been saved to: " + histogramFile);
    //   fs.writeFile(filenameHTML, hypertext, function (err) {
    //     if (err) {
    //       output(`Error saving HTML: ${err}`)
    //     } else {
    //       fs.chmodSync(filenameHTML, 0o777);
    //     }
    //     output('Saved html report to:');
    //     output(chalk.underline( filenameHTML ));
    //   });
    //   fileWrite(`${currentOutputPath}/${justNameOfDNA}/index.html`, hypertext, 'utf8', htmlFinished());
    //
    // });
  }
  function fileWrite(file, contents, encoding, cb) {
    try {
      fs.writeFile(file, contents, encoding, function (err) { // OVERWRITE index.html so there is always the latest showing
        if (err) { error(`Issue with saving: ${file} ${err}`) } else {
          fs.chmodSync(file, 0o777);
        }
      });
    } catch(err) {
      error(`Issue with saving: ${file} ${err}`);
    }
    if (cb != undefined) {
      // setTimeout((cb) => {
        cb();
      // }, raceDelay)
    }
  }
  function touchLockAndStartStream(fTouch) {
    renderLock = true;
    isDiskFinHTML, isDiskFinHilbert, isDiskFinLinear = false;
    output("Starting render");
    term.eraseDisplayBelow();
    fileWrite(
      fTouch,
      lockFileMessage + ` ${version} ${timestamp} ${hostname} ${radMessage}`,
      'utf8',
      () => { initStream(filename)  }
    );
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
    // isDiskFinHTML = true;
    renderLock = false;

    if (howMany > 0 ) {
      log("Unlocked and about to poll...");
      setTimeout(() => {
        pollForStream();
      }, raceDelay);
    } else {
      log("and thats's all she wrote folks.");
    }

  }

  function getFilesizeInBytes(file) {
    try {
      const stats = fs.statSync(file)
      const fileSizeInBytes = stats.size
      return fileSizeInBytes
    } catch(err) {
      console.warn("File not found: " + file);
      return -1; // -1 is signal for failure or unknown size (stream).
    }

  }

  // function getFilesizeInBytes(f) {
  //   baseChars = 69;
  //   bigIntFileSize = 69696969696969n; // test of big int.
  //   try {
  //     baseChars = fs.fstatSync(f, { bigint: false }).size;
  //     bigIntFileSize = fs.fstatSync(f, { bigint: true } ).size;
  //     log(`File exists with size ${baseChars} at: ${path}`);
  //     return baseChars;
  //   } catch(e) {
  //     baseChars = -1;
  //     output(`Cant stat filesize of ${path} File error: ${e}`);
  //     return baseChars;
  //   }
  //   log(`f ${path} baseChars ${baseChars} file: ${file} big int filesize: ${bigIntFileSize}`);
  //   return baseChars; // debug flag. basically i should never see -69 appearing in error logs
  // }
  function getFileExtension(f) {
    let lastFive = f.slice(-5);
    log(`lastFive ${lastFive}`)
    return lastFive.replace(/.*\./, '').toLowerCase();
  }
  function checkFileExtension(f) {
    let value = extensions.indexOf(getFileExtension(f));
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
    if (server != undefined) {
      log("closing server")
      server.close();
    } else {
      log("no server runningh")
    }
    // status = "bye";
    // log(status);
    if ( howMany > 0 ) {
      log("Continuing...");
      pollForStream();
    } else {
      log(`process.exit type bye. last file: ${filename}`);
      clearTimeout(updatesTimer);
      if (server != undefined) {
        server.close()
      }


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
    status = "stream";

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
      codon += c; // add the base
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

  function aminoFilenameIndex(id) { // return the filename for this amino acid for the report
    let backupPeptide = peptide;
    let backupHighlight = isHighlightSet;
    if (id == undefined || id == -1) { // for the reference image
      currentPepHighlight = false;
      currentPeptide = "";
    } else {
      currentPepHighlight = true;
      currentPeptide = pepTable[id].Codon;
    }
    peptide = currentPeptide; // bad use of globals i agree, well i aint getting paid for this, i do it for the love, so yeah
    isHighlightSet = currentPepHighlight;
    let ret = generateFilenameHilbert();
    peptide = backupPeptide;
    isHighlightSet = backupHighlight;
    return ret;
  }
  function getImageType() {
    let t = "";
    if (args.ratio) {
      t += `_${ratio}`;
    }
    ( artistic ? t += "_artistic" : t += "_sci")
    return t;
  }
  function generateFilenameTouch() { // we only need the fullpath of this one
    return                  `${justNameOfDNA}.${extension}_LOCK${highlightFilename()}_c${onesigbitTolocale(codonsPerPixel)}${getImageType()}.aminosee.touch`;
  }
  function generateFilenamePNG() {
    justNameOfPNG =         `${justNameOfDNA}.${extension}_linear${highlightFilename()}_c${onesigbitTolocale(codonsPerPixel)}${getImageType()}.png`;
    return justNameOfPNG;
  }
  function generateFilenameHilbert() {
    if (test) {
      // the filename should be set already fingers crossed.
    } else {
      justNameOfHILBERT =     `${justNameOfDNA}.${extension}_HILBERT${highlightFilename()}_m${dimension}_c${onesigbitTolocale(codonsPerPixelHILBERT)}${getRegmarks()}.png`;
    }
    return justNameOfHILBERT;
  }
  function generateFilenameHTML() {
    justNameOfHTML =        `${justNameOfDNA}.${extension}_m${dimension}_c${onesigbitTolocale(codonsPerPixel)}${getRegmarks()}${getImageType()}.html`;
    return justNameOfHTML;
  }
  function imageStack() {
    let hhh = " ";
    let backupPeptide = peptide;
    let backupHighlight = isHighlightSet;

    hhh += `<a href="images/${aminoFilenameIndex()}" onmouseover="mover()" onmouseout="mout()"><img  src="images/${aminoFilenameIndex()}" id="stack_reference" width="256" height="256" style="z-index: ${999}; position: absolute; top: 0px; left: 0px;" alt="${refimage}" title="${refimage}"></a>`;

    for (i=0; i<pepTable.length; i++) {
      let thePep = spaceTo_( pepTable[i].Codon );
      let theHue = pepTable[i].Hue;
      let c =      hsvToRgb( theHue/360, 0.5, 1.0 );

      if (thePep != "Non-coding_NNN"  && thePep != "Start_Codons" && thePep != "Stop_Codons") {
        hhh += `<a href="${aminoFilenameIndex(i)}" onmouseover="mover(${i})" onmouseout="mout(${i})"><img src="images/${aminoFilenameIndex(i)}" id="stack_${i}" width="256" height="256" style="z-index: ${1000+i}; position: absolute; top: ${i*2}px; left: ${i*12}px;" alt="${pepTable[i].Codon}" title="${pepTable[i].Codon}"></a>`;
      } else {
        log("non-coding nnn image not output");
      }
    }
    currentPeptide = "none"; // hack to address globals
    aminoFilenameIndex(); // hack to address globals
    peptide = backupPeptide;
    isHighlightSet = backupHighlight;
    return hhh;
  }

  function htmlTemplate() {
    var html = `<html>
    <head>
    <title>${justNameOfDNA} :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson :: ${currentFile}</title>
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
    <script src="node_modules/hammerjs/hammer.min.js"></script>
    <!-- script src="https://www.funk.co.nz/aminosee/bundle.js"></script -->

    <script src="/public/aminosee-gui-web.js"></script>


    <script>
    let page = "report";
    function mover(i) {
      if (i == undefined) {
        i = "stack_reference"; // reference image
      } else {
        i = "stack_" + i; // reference image
      }
      let el = document.getElementById(i);
      el.style.zIndex = 6969;
    }

    function mout(i) {
      if (i == undefined) {
        i = "stack_reference"; // reference image
      } else {
        i = "stack_" + i; // reference image
      }
      let el = document.getElementById(i);
      el.style.zIndex = 100+i;
    }
    </script>
    <style>
    border: 1px black;
    backround: black;
    padding: 4px;
    </style>
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

  <h1>AminoSee DNA Render Summary for ${currentFile}</h1>
  <h2>${justNameOfDNA}</h2>
  ${( test ? " test " : imageStack())}


  <div class="fineprint" style="text-align: right; float: right;">
  <pre>
  ${renderSummary()}
  </pre>
  </div>

  <a href="#scrollLINEAR" class="button" title"Click To Scroll Down To See LINEAR"><br />
  <img width="128" height="128" style="border: 4px black; background: black;" src="images/${justNameOfPNG}">
  1D Linear Map Image
  </a>
  <a href="#scrollHILBERT" class="button" title"Click To Scroll Down To See 2D Hilbert Map"><br />
  <img width="128" height="128" style="border: 4px black background: black;" src="images/${justNameOfHILBERT}">
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
  <td style="background-color: white;"> All amino acids combined =   </td>
  <td>
  <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">n/a</p>
  </td>
  <td style="color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">n/a</p> </td>
  <td>${genomeSize}</td>
  <td>n/a</td>
  <td style="background-color: white;">
  <a href="images/${aminoFilenameIndex()}" class="button" title="Reference Image"><img width="48" height="16" class="blackback" src="images/${aminoFilenameIndex()}" alt="Reference Image ${justNameOfDNA}"></a>
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
    if (thePep.Codon == "Start Codons" || thePep.Codon == "Stop Codons" || thePep.Codon == "Non-coding NNN") {
      html += `<!-- ${thePep.Codon} -->`;
    } else {
      html += `
      <tr style="background-color: hsl( ${theHue} , 50%, 100%);" onmouseover="mover(${i})" onmouseout="mout(${i})">
      <td style="background-color: white;"> ${pepTable[i].Codon} </td>
      <td style="background-color: rgb(${lightC});">
      <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${theHue}&#xB0;</p>
      </td>
      <td style="background-color: rgb(${c}); color: white; font-weight: bold; "> <p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${c}</p> </td>
      <td>${pepTable[i].Histocount.toLocaleString()}</td>
      <td>${pepTable[i].Description}</td>
      <td style="background-color: white;">
      <a href="images/${aminoFilenameIndex(i)}" class="button" title="Amino filter: ${spaceTo_(pepTable[i].Codon)}"><img width="48" height="16" class="blackback" src="images/${aminoFilenameIndex(i)}" alt="${spaceTo_(pepTable[i].Codon)}"></a>
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
  <a href="${justNameOfHILBERT}" ><img src="${justNameOfHILBERT}" width-"99%" height="auto"></a>

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
  output(siteDescription);
  output("Author:         tom@funk.co.nz or +64212576422");
  output("calls only between 2pm and 8pm NZT (GMT+11hrs)");

  welcomeMessage();
  output('Welcome to the AminoSeeNoEvil DNA Viewer!');
  output(`This CLI is to convert sequence found in ASCII/RTF-8 text files - tested with .mfa .fa .gbk up to  into .png graphics. works with .mfa .fa .gbk DNA text files. It's been tested with files up to 3 GB, and uses asynchronous streaming architecture! Pass the name of the DNA file via command line, and it will put the images in a folder called 'output' in the same folder.`);
  output(' ');
  output(chalk.inverse("Help section"));
  output("Hello!");
  output("Author:         tom@funk.co.nz or +64212576422");
  output("calls only between 2pm and 8pm NZT (GMT+11hrs)");
  output(" ");
  output("Donations can be sent to my bitcoin address with thanks:");
  output("15S43axXZ8hqqaV8XpFxayZQa8bNhL5VVa");
  output("https://www.funk.co.nz/blog/online-marketing/pay-tom-atkinson");
  output("variables:");
  output('     --ratio=(square|golden|fixed) (default fixed proportions)');
  output('     --width=1920 -w960  (default 960px requires fixed ratio)');
  output('     --magnitude=[0-8] -m8 (debug setting to limit memory use)');
  output('     --triplet=[ATCGU][ATCGU][ATCGU]      (highlight triplet)');
  output('     --codons=[1-999] -c[1-999]   (reduces quality 1 is best)');
  output('flags:');
  output('     --verbose -v                              (verbose mode)');
  output('     --help -h                            (show this message)');
  output('     --force -f             (ignore locks overwrite existing)');
  output('     --devmode -d  (will skip locked files even with --force)');
  output('     --artistitc -a  (creates a visual rhythm in the picture)');
  output('     --spew -s          (spew DNA bases to the screen during)');
  output('     --no-clear              (dont clear the terminal during)');
  output('     --no-update                       (dont provide updates)');
  output('     --reg    (put registration marks @ 25% 50% 75% and 100%)');
  output('     --test                (create calibration test patterns)');
  output('     --keyboard -k (enable interactive mode, use control-c to end)');

  output("Calibrate your DNA with aminosee --test  ");
  output("run aminosee * to process all dna in current dir");
}
function checkLocks(ffffff) { // return false if locked.
  log("checkLocks RUNNING: " + ffffff);
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
function decodePNG(file, callback) {
  // var fs = require('fs'),
  //   PNG = require('pngjs').PNG;
  out("Recyling...")
  fs.createReadStream(file)
  .pipe(new PNG({
    filterType: 4
  }))
  .on('parsed', function() {
    rgbArray = [this.length];
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;



        // invert color
        rgbArray[idx] = this.data[idx];
        rgbArray[idx+1] = this.data[idx+1];
        rgbArray[idx+2] = this.data[idx+2];
        rgbArray[idx+3] = this.data[idx+3];
      }
    }
    // this.pack().pipe(fs.createWriteStream('out.png'));
    callback();
    return rgbArray;
  });
}
function recycleOldImage(f) {
  renderLock = false;
  isDiskFinHilbert = false;
  isDiskFinHTML = true;
  isDiskFinLinear = true; // true because we are RECYCLING baby

  try {
    // var oldimage = new PNG.load(f);
    output(chalk.inverse(" RECYCLING EXISTING LINEAR FILE ")+chalk(" " + justNameOfDNA))
    rgbArray = decodePNG(f, function () {
      calculateShrinkage();
      saveHilbert(this.data);
      linearFinished();
    });

  } catch(e) {
    output(`Failure during recycling: ${e} will poll for work`);
    isDiskFinHilbert = true;
    pollForStream();
    return false;
  }
}
function okToOverwritePNG(f) { // true to continue, false to abort
  log("okToOverwritePNG RUNNING");
  if (force == true) {
    log("Not checking - force mode enabled.");
    return true;
  }

  try {
    // result = fs.lstatSync(f);
    result = doesFileExist(f);
    // log("[fstatSync result]" + result);
    if (result) {
      out("previous projection found for " + justNameOfDNA );
      return false;
    } else {
      out("begin projection for " + justNameOfDNA );
      return true;
    }
    if (result.isFile && recycEnabled == true) {
      log("Recycling previously rendered linear file.");
      willRecycleSavedImage = true;
      isDiskFinLinear = true;
      return true; // this will cause the render to start but will use willRecycleSavedImage to skip the ingest
    }
    return false;
  } catch(e){
    output("Output png will be saved to: " + f );
    return true;
  }
  return true;
}
function doesFileExist(f) {
  let ret = false;
  try {
    ret = fs.existsSync(f);
  } catch(e) {
    error(e)
  }
  log(`doesFileExist: ${ret}`)
  return ret;
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
  let computerWants = pixTodefaultMagnitude(linearpix);
  out(`Ideal magnitude: ${computerWants} (new) previous magnitude: ${dimension}`);

  if ( computerWants > defaultMagnitude ) {
    out(`This genome could be output at a higher resolution of ${hilbPixels[computerWants].toLocaleString()} than the default of ${computerWants}, you could try -m 8 or -m 9 if your machine is muscular, but it might core dump. -m10 would be 67,108,864 pixels but node runs out of stack before I get there on my 16 GB macOS. -Tom.`)
    dimension = defaultMagnitude;

  } else if (computerWants < 0) {
    dimension = 0; // its an array index
  } else {
    dimension = computerWants; // give him what he wants
  }

  if (args.magnitude || args.m) {
    dimension = magnitude; // users choice over ride all this nonsense
  } else {
    magnitude = dimension;
  }

  let hilpix = hilbPixels[dimension];;
  hilbertImage = [hilpix*4];
  shrinkFactor = linearpix / hilpix;//  array.length / 4;
  codonsPerPixelHILBERT = codonsPerPixel / shrinkFactor;
  out(`Linear image size ${linearpix.toLocaleString()} to be down sampled by ${shrinkFactor} for a ${dimension}th dimension hilbert curve of ${hilbPixels[dimension].toLocaleString()} pixels`);
  log(`shrinkFactor pre ${shrinkFactor} = linearpix ${linearpix } /  hilpix ${hilpix}  `);
  // dimension; // for filenames
  // codonsPerPixelHILBERT = twosigbitsTolocale( codonsPerPixel*shrinkFactor );
  codonsPerPixelHILBERT = codonsPerPixel*shrinkFactor;
  setupFNames();
  log(`filenameHILBERT after shrinking: ${filenameHILBERT} dimension: ${dimension} shrinkFactor post ${twosigbitsTolocale(shrinkFactor)} codonsPerPixel ${codonsPerPixel} codonsPerPixelHILBERT ${codonsPerPixelHILBERT}`);
}
// resample the large 760px wide linear image into a smaller square hilbert curve
function saveHilbert(array) {
  term.eraseDisplayBelow();
  if (doesFileExist(filenameHILBERT)) {
    out("Existing hilbert image found - skipping projection" );
    if (openImage) {
      openOutputs();
    } else {
      log("Use --image to open in default browser")
    }
    hilbertFinished();
    return false;
  }
  output( "Getting in touch with my man from 1891... Hilbert. In the " + dimension + "th dimension and reduced by " + threesigbitsTolocale(shrinkFactor) + "X  ----> " + justNameOfHILBERT);
  output("    ॐ    ");
  out(justNameOfDNA);
  // term.up(1);
  status = "hilbert";
  // output(status);
  let hilpix = hilbPixels[dimension];;
  let height, width;
  // sanitiseMagnitude();
  resampleByFactor(shrinkFactor);
  width = Math.sqrt(hilpix);
  height = width;
  let perc = 0;
  // whack_a_progress_on();
  for (i = 0; i < hilpix; i++) {
    let hilbX, hilbY;
    [hilbX, hilbY] = hilDecode(i, dimension, MyManHilbert);
    let cursorLinear  = 4 * i ;
    let hilbertLinear = 4 * ((hilbX % width) + (hilbY * width));
    let perc = i / hilpix;
    percentComplete = perc;
    dot(i, 20000, "Space filling " + fixedWidth(6, " " + (perc*100)) + "% of " + hilpix.toLocaleString());
    // output("Space filling " + fixedWidth(10, (perc*100) + "%") + " of " + hilpix.toLocaleString());

    hilbertImage[hilbertLinear+0] = rgbArray[cursorLinear+0];
    hilbertImage[hilbertLinear+1] = rgbArray[cursorLinear+1];
    hilbertImage[hilbertLinear+2] = rgbArray[cursorLinear+2];
    hilbertImage[hilbertLinear+3] = rgbArray[cursorLinear+3];
    if (reg) {
      paintRegMarks(hilbertLinear, hilbertImage, perc);
    }
    if (i-4 > rgbArray.length) {
      log("BREAKING at positon ${i} due to ran out of source image. rgbArray.length  = ${rgbArray.length}");
      log(` @i ${i} `);
      break;
    }
  }
  out("Done projected 100% of " + hilpix.toLocaleString());


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
    .on('finish', () => {
      log("Finished hilbert png save.");
      hilbertFinished();
    }));
  }
  function htmlFinished() {
    setImmediate(() => {
      isDiskFinHTML = true;
      setTimeout(() => {
        pollForStream();
      }, raceDelay);
      openOutputs();
    });
  }
  function hilbertFinished() {
    isDiskFinHilbert = true;
    setImmediate(() => {
      pollForStream();
    });
  }
  function linearFinished() {
    setImmediate(() => {
      isDiskFinLinear = true;
      setTimeout(() => {
        pollForStream();
      }, raceDelay);
    });
  }
  function bothKindsTestPattern() {
    let h = require('hilbert-2d');
    let hilpix = hilbPixels[dimension];
    let linearpix = hilpix;// * 4;
    let hilbertImage = [hilpix*4];
    rgbArray = [linearpix*4];
    width = Math.round(Math.sqrt(hilpix));
    height = width;
    linearWidth = Math.round(Math.sqrt(hilpix));
    linearHeight = linearWidth;

    if (howMany == -1) {
      log("Error -1: no remaining files to process");
      return false;
    } else {
      howMany = dimension;
    }

    output(`Generating hilbert curve of the   ${dimension}th dimension remaining: ${howMany}`);
    log(filenameHILBERT);
    let perc = 0;
    for (i = 0; i < hilpix; i++) {
      dot(i, 20000);
      let hilbX, hilbY;
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
      return hilbertImage;
    }

    function arrayToPNG(callback) {
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
          out(`linear image height: ${height} pixels by 960`);
          height++;
        }
      }
      if ( pixels <= width*height) {
        log("Image allocation check: " + pixels + " < width x height = " + ( width * height ));
      } else {
        output(`MEGA FAIL: TOO MANY ARRAY PIXELS NOT ENOUGH IMAGE SIZE: array pixels: ${pixels} <  width x height = ${width*height}`);
        process.exit();
      }

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
          log("Finished linear png save.");
          // openOutputs();
          if (callback != undefined) {
            log("running callback");
            callback();
          } else {
            log("quit - no callback");
            // quit();
          }
          linearFinished();
        })
      ).then(log("hello")).catch(log("handle the jandal"));
    }

    function asyncPNG(img_png) {

    }
    function syncPNG(img_png, callback) {

    }

    function openOutputs() {
      status ="open outputs";
      if (devmode)  { log(renderSummary()); }
      log(`openHtml, openImage, openFileExplorer`, openHtml, openImage, openFileExplorer);
      setImmediate(function () {
        if (openFileExplorer === true) {
          output(`Opening ${justNameOfDNA} DNA renders in File Manager`);
          bgOpen(currentOutputPath);

          // open(currentOutputPath).then(() => {
          //   log("file manager closed");
          // }).catch(function () { error(`open(${currentOutputPath})`)});
        }
        if (openHtml === true) {
          output(`Opening ${justNameOfDNA} DNA render summary HTML report.`);
          bgOpen(filenameHTML, {app: 'firefox', wait: false} );
          // open(filenameHTML).then(() => {
          //   log("browser closed");
          // }).catch(function () { error("open(filenameHTML)")});
        }
        if (isHilbertPossible === true && openImage === true) {
          output(`Opening ${justNameOfDNA} 2D hilbert space-filling image.`);
          bgOpen(filenameHILBERT)
          // open(filenameHILBERT).then(() => {
          // log("hilbert image closed");
          // }).catch(function () { error("open(filenameHILBERT)") });
        } else if (openImage === true) {
          output(`Opening ${justNameOfDNA} 1D linear projection image.`);
          bgOpen(filenamePNG)
          // open(filenamePNG).then(() => {
          //   log("regular png image closed");
          // }).catch(function () { error("open(filenamePNG)") });
        } else {
          log(`Use --html or --image to automatically open files after render, and "aminosee demo" to generate test pattern and download a 1 MB DNA file from aminosee.funk.nz`)
          log(`values of openHtml ${openHtml}   openImage ${openImage}`);
        }
        output(closeBrowser); // tell user process is blocked
      });
      log("Thats us cousin'! Sweet as a Kina in a creek as they say (in NZ).");
    }
    function getRegmarks() {
      return ( reg == true ? "_reg" : "" )
    }
    function mkdir(short) { // returns true if a fresh dir was created
      dir2make = `${path.resolve(process.cwd())}/${short}`
      if (doesFileExist(dir2make) === false) {
        log(`Creating fresh directory: ${dir2make}`);
        try {
          fs.mkdirSync(dir2make, function (err, result) {
            if (result) { log(`Success: ${result}`) }
            if (err) { error(`Fail: ${err}`) }
          });
        } catch(e) { console.warn(`Error creating folder: ${e} at location: ${dir2make}`)}
        return true; // true because its first run
      } else {
        log(`Directory ${short} already exists: ${dir2make}`)
        return false;
      }
      console.warn("Exiting due to lack of permissions in this directory");
      howMany = 0;
      quit(1);
      gracefulQuit();
      return false;
    }
    function generateTestPatterns(cb) {
      test = true;
      updates = true;
      pngImageFlags = "_test_pattern";
      if (args.magnitude || args.m) {
        magnitude = Math.round(args.magnitude || args.m);
      } else {
        magnitude = defaultMagnitude;
      }
      output("output test patterns to /output/calibration/ folder. filename: " + filename);
      mkdir('output');
      mkdir('output/calibration');
      // currentOutputPath = path.normalize( path.resolve(process.cwd() + '/output/calibration') );
      if (howMany == -1) { quit(1); return false;}
      // if (magnitude > 8) { magnitude = 8}
      // if (howMany == -1) { return false } // for gracefull quit feature
      output(`TEST PATTERNS GENERATION    m${magnitude} c${codonsPerPixel}`);
      output("Use -m to try different dimensions. -m 9 requires 1.8 GB RAM");
      output("Use --no-reg to remove registration marks at 0%, 25%, 50%, 75%, 100%. It looks a little cleaner without them ");
      log(`pix      ${hilbPixels[magnitude]} `);
      log(`magnitude      ${magnitude} `);
      log(`defaultMagnitude      ${defaultMagnitude} `);


      loopCounter = 0; // THIS REPLACES THE FOR LOOP, INCREMENET BY ONE EACH FUNCTION CALL AND USE IF.


      updatesTimer = setTimeout(() => {
        runCycle(cb);
      }, raceDelay);

      // openOutputs();

      log(`done with JUST ONE CYCLE OF generateTestPatterns(). Filenames:`);
      log(currentOutputPath);
      log(filenameTouch);
      log(filenamePNG);
      // log(filenameHILBERT);
      log(filenameHTML);
      if (howMany != -1) {
        openOutputs();
      } else {
        out("_")
      }
    }
    function runCycle(cb) {

      // for (test = 0; test <= magnitude; test++) {
      fakeReportInit(loopCounter);
      dimension = loopCounter;
      // let hilbertImage = bothKindsTestPattern(); // sets up globals to call generic function with no DNA for test
      bothKindsTestPattern(); // sets up globals to call generic function with no DNA for test

      arrayToPNG(function () { // hilbert
        log('finished linear test')

        // hilbertFinished();
        loopCounter++
        if (loopCounter > magnitude) { fakeReportStop(); saveHTML(); removeLocks(); if (cb != undefined) { cb() }  return false; }


        updatesTimer = setTimeout(() => {
          setImmediate( () => { runCycle(cb)} ); // helps with race conditions - gives time for ye olde garbage collector
        }, raceDelay);

        // runCycle();
        return true;
      });

      // arrayToPNG(function () {
      //   log('finished linear test')
      // });
    }
    function fakeReportStop() {
      // openImage = true;
      genomeSize = 1;
      baseChars = 1;
      charClock = -1; // gets around zero length check
      colClock = -1; // gets around zero length check
      calcUpdate();
    }
    function fakeReportInit(magnitude) {
      start = new Date().getTime();
      test, dimension = magnitude; // mags for the test
      let testPath = currentOutputPath + "/calibration"; //
      let regmarks = getRegmarks();
      isHilbertPossible = true;
      report = false;
      justNameOfDNA = `AminoSee_Calibration${ regmarks }`;
      justNameOfPNG = `${justNameOfDNA}_LINEAR_${ magnitude }.png`;
      justNameOfHILBERT = `${justNameOfDNA}_HILBERT_${ magnitude }.png`;

      filenameHTML    = testPath + "/" + justNameOfDNA + ".html";
      filenamePNG     = testPath + "/" + justNameOfPNG;
      filenameHILBERT = testPath + "/" + justNameOfHILBERT;

      baseChars = hilbPixels[ magnitude ];
      genomeSize = baseChars;
      errorClock = 0;
      charClock = baseChars;
      colClock = baseChars;

      percentComplete = 1;
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



    // this will destroy the main array by first upsampling then down sampling
    function resampleByFactor(shrinkFactor) {
      let sampleClock = 0;
      let brightness = 1/shrinkFactor;
      let downsampleSize = hilbPixels[dimension]; // 2X over sampling high grade y'all!
      let antiAliasArray = [ downsampleSize  * 4 ]; // RGBA needs 4 cells per pixel
      // output(`Resampling linear image of size in pixels ${colClock.toLocaleString()} by the factor ${twosigbitsTolocale(shrinkFactor)}X brightness per amino acid ${brightness} destination hilbert curve pixels ${downsampleSize.toLocaleString()} `);

      // SHRINK LINEAR IMAGE:
      for (z = 0; z<downsampleSize; z++) { // 2x AA colClock is the number of pixels in linear
        if (z % 5000 == 0) {
          log(`z: ${z.toLocaleString()}/${downsampleSize.toLocaleString()} samples remain: ${(colClock - sampleClock).toLocaleString()}`);
        }

        let sum = z*4;
        let clk = sampleClock*4; // starts on 0

        antiAliasArray[sum+0] = rgbArray[clk+0]*brightness;
        antiAliasArray[sum+1] = rgbArray[clk+1]*brightness;
        antiAliasArray[sum+2] = rgbArray[clk+2]*brightness;
        antiAliasArray[sum+3] = rgbArray[clk+3]*brightness;

        while(sampleClock  < z*shrinkFactor) {
          if (sampleClock % 5000 == 0) {
            log(`z: ${z.toLocaleString()}/${downsampleSize.toLocaleString()} samples remain: ${(colClock - sampleClock).toLocaleString()}`);
          }
          clk = sampleClock*4;

          antiAliasArray[sum+0] += rgbArray[clk+0]*brightness;
          antiAliasArray[sum+1] += rgbArray[clk+1]*brightness;
          antiAliasArray[sum+2] += rgbArray[clk+2]*brightness;
          antiAliasArray[sum+3] += rgbArray[clk+3]*brightness;

          sampleClock++;
        }
        sampleClock++;
      }
      rgbArray = antiAliasArray;
    }
    function pixTodefaultMagnitude(pix) { // give it pix it returns a magnitude that fits inside it
      let dim = 0;
      let ret = `[HILBERT] Calculating largest Hilbert curve image that can fit inside ${twosigbitsTolocale(pix)} pixels, and over sampling factor of ${overSampleFactor}: `;
      while (pix > (hilbPixels[dim] * overSampleFactor)) {
        ret += ` dim ${dim}: ${hilbPixels[dim]} `;

        if (dim % 666 == 0 && dim > 666) {
          ret+= (`ERROR pixTodefaultMagnitude [${hilbPixels[dim]}] pix ${pix} dim ${dim} `);
        }
        if (dim > defaultMagnitude) {
          if (magnitude && dim > theoreticalMaxMagnitude ) {
            output("HELLO: This will likely exceed nodes heap memory and/or call stack. mag 11 sure does. spin up the fans.")
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

      ret+= ` <<<--- chosen magnitude: ${dim} `;
      log(ret);
      return dim;
    }
    function dot(i, x, t) {
      if (i % x == 0 ) {
        if (!t) {
          t = `[${i}]`;
        }
        out(t);
      }
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

    function replaceoutputPathFileName(f) {
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
        console.log(maxWidth(debugColumns+(3*devmode), `[${fixedWidth(12, currentFile)} ${(isDiskFinLinear ? "LIN" : "OK ")}${(isDiskFinHilbert ? "Hil" : "OK ")}${(isDiskFinHTML ? "HTM" : "OK ")}  ${(isHighlightSet ? peptide + " " : " ")}Jobs: ${howMany} ${nicePercent()} G: ${genomeSize} ${bytes( baseChars )} ${status} RunID: ${timestamp} H dim: ${hilbPixels[dimension]}] `) + ">>> " + txt);
      } else {
        console.log(txt);
      }
    }
    function log(txt) {
      // cursorToLeft();
      if (verbose) {
        term.eraseLine();
        output(txt);
        if (devmode) {
          let d = Math.round(+new Date());
          txt = maxWidth(debugColumns+(3*devmode), `@${d} LCK ${renderLock} `) + txt;
        }
      }
    }
    function out(t) {
      if (t.substring(0,5) == 'error') {
        console.warn(`[ ${t} ] `);
      } else {
        term.eraseLine();
        console.log(t);
        term.up(1);
        // process.stdout.write(`[ ${t} ] `);
      }
    }
    function error(e) {
      out('error start {{{ ----------- ' + chalk.inverse( e.toString() ) + chalk(" ") + ' ----------- }}} end');
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
      let byteIndex = colClock * 4; // 4 bytes per pixel. RGBA.

      rgbArray.push(Math.round(red));
      rgbArray.push(Math.round(green));
      rgbArray.push(Math.round(blue));
      rgbArray.push(Math.round(alpha));

      // new streaming method
      // pixelStream.push(Math.round(red));
      // pixelStream.push(Math.round(green));
      // pixelStream.push(Math.round(blue));
      // pixelStream.push(Math.round(alpha));

      pixelStacking = 0;
      colClock++;
    }
    function cursorToTopLeft() {
      process.stdout.write('\033[<0>;<0>H');
      process.stdout.write('\033[<0>;<0>f');
      // process.stdout.write('\x1B[0f'); // CURSOR TO TOP LEFT <-- works on macos and linux
      clearCheck();
    }
    function cursorToLeft() {
      term.eraseDisplayBelow();
      term.up( 1 ) ;

      // process.stdout.write('\033[<0>;<0>f');
    }
    function clearCheck() {
      term.eraseDisplayBelow();
      if (clear) {
        clearScreen();
      }
    }
    function clearScreen() {
      process.stdout.write("\x1Bc");
      process.stdout.write("\x1B[2J"); // CLEAR TERMINAL SCREEN????
      process.stdout.write('\033c'); // <-- maybe best for linux? clears the screen
    }


    function prettyDate() {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today  = new Date();

      return today.toLocaleString(options) + "  " + today.toLocaleDateString(options); // Saturday, September 17, 2016
    }
    function printRadMessage(array) {
      if (array == undefined) {
        array = ["    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:",currentOutputPath]
      }
      while ( array.length < 8 ) {
        array.push("    ________","    ________");
      }
      console.log(terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${array[0]}`, 255, 60,  250) );
      console.log(terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${array[1]}`, 170, 150, 255) );
      console.log(terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${array[2]}`, 128, 240, 240) );
      console.log(terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${array[3]}`, 225, 225, 130) );
      console.log(terminalRGB(`  ah-mee-no-see     'I See It Now - I AminoSee it!'   ${array[4]}`, 255, 180,  90) );
      console.log(terminalRGB(`   ${prettyDate()}   v${version}            ${array[5]}`                 , 220, 120,  70) );
      console.log(terminalRGB(array[6], 200, 105,   60) );
      console.log(terminalRGB(array[7], 180, 32,   32) );
    }

    function crashReport() {
      log(cleanDNA);
    }
    function wTitle(txt) {
      term.windowTitle(`${justNameOfDNA} ${maxWidth(120,txt)} AminoSee@${hostname}`);
    }
    function calcUpdate() { // DONT ROUND KEEP PURE NUMBERS
      percentComplete = (charClock+69) / (baseChars+69); // avoid div by zero below
      let now = new Date().getTime();
      runningDuration = (now - start) + 1;
      timeElapsed = Math.round(runningDuration / 1000);
      timeRemain = Math.round((timeElapsed / (percentComplete + 0.001)) - timeElapsed);
      kbRemain = (baseChars - charClock)/1000;
      bytesPerSec = Math.round( (charClock+1) / runningDuration*1000 );
      wTitle(`${nicePercent()} ${bytes(Math.round(bytesPerSec/1000)*1000)} /sec ${threesigbitsTolocale(timeRemain/60)} min remain`);
    }
    function getHistoCount(item, index) {
      return [ item.Codon, item.Histocount];
    }
    function whack_a_progress_on() {
      out(nicePercent());
      // var bar = new ProgressBar({
      //   schema: ':bar',
      //   total : 1000
      // });
      calcUpdate();
      out(nicePercent());
      var iv = setInterval(function () {
        calcUpdate();
        out("    " + nicePercent());
        // bar.update(percentComplete*1000);           // bar.tick();
        if (percentComplete > 1) {
          clearInterval(iv);
        }
      }, 1500);
    }
    function onesigbitTolocale(num){
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
    function fixedWidth(wide, str) {
      return minWidth(wide, maxWidth(wide, str));
      // return maxWidth(wide, minWidth(wide, str));
    }
    function maxWidth(wide, str) { // shorten it if you need to
      if (str) {
        if (str.length > wide) { str = str.substring(0,wide) }
        return str;
      } else {
        return "str went missing?!"
      }
    }
    function minWidth(wide, str) { // make it wider
      while(str.length < wide) { str = " " + str }
      return str;
    }
    function drawHistogram() {
       output(" ");
      calcUpdate();
      if (updates == false || howMany == -1) {
        log(nicePercent());
        progato = whack_a_progress_on();

        updatesTimer = setTimeout(() => {
          drawHistogram(); // MAKE THE [ 12% ] APPEAR AGAIN LATER
        }, maxMsPerUpdate);
        return status;
      }
      let codonsPerSec =(genomeSize+1) / (runningDuration*1000);
      let text = " ";
      let aacdata = [];
      let abc = pepTable.map(getHistoCount).entries();
      if (msPerUpdate < maxMsPerUpdate) {
        msPerUpdate += 50; // updates will slow over time on big jobs
      }
      for (h=0;h<pepTable.length;h++) {       // OPTIMISE i should not be creating a new array each frame!
        aacdata[pepTable[h].Codon] = pepTable[h].Histocount ;
      }
      let array = [
        `| File: ${chalk.inverse(fixedWidth(35,  justNameOfDNA+"           ")) + chalk("")}${ ( isHighlightSet ? "Highlight: " + chalk.rgb(255, 255, 0).inverse(peptide) : "" )}`,
        `| Done: ${chalk.rgb(128, 255, 128).inverse( nicePercent() )} Elapsed:${ fixedWidth(4, twosigbitsTolocale(timeElapsed)) } Remain:${ fixedWidth(4,  twosigbitsTolocale(timeRemain)) } sec`,
        `| @i${fixedWidth(10, charClock.toLocaleString())} Breaks:${ fixedWidth(6, breakClock.toLocaleString())} Filesize:${fixedWidth(7, bytes(baseChars))}`,
        `| Next update: ${fixedWidth(5, msPerUpdate.toLocaleString())}ms Codon Opacity: ${twosigbitsTolocale(opacity*100)}%`,
        `| CPU:${fixedWidth(10, bytes(bytesPerSec))}/s ${fixedWidth(5, codonsPerSec.toLocaleString())}K acids/s`,
        `| Files left: ${howMany} Next: ${nextFile}`,
        ` Codons:${fixedWidth(14, genomeSize.toLocaleString())} Last Acid:${chalk.rgb(red, green, blue).bgWhite( fixedWidth(18, aminoacid) ) } Host: ${hostname} Pixels:${fixedWidth(10, colClock.toLocaleString())}`,
        ` Sample: ${ fixedWidth(60, cleanString(rawDNA)) } ${showFlags()}`,
        `| RunID: ${chalk.rgb(128, 0, 0).bgWhite(timestamp)} acids per pixel: ${twosigbitsTolocale(codonsPerPixel)}` ];

        if (status == "save") {
          output("Saving... ");
        } else {
          term.eraseDisplayBelow();
          term.up(termStatsHeight);
          printRadMessage(array);
          console.log(); // white space
          console.log(histogram(aacdata, { bar: '/', width: 40, sort: true, map:  aacdata.Histocount} ));
          output(interactiveKeysGuide);
          log(    isDiskFinHTML, isDiskFinHilbert, isDiskFinLinear);
          term.up(termDisplayHeight);
        }
        if (status == "stream") { // || updates) {
          updatesTimer = setTimeout(() => {
            drawHistogram(); // MAKE THE HISTOGRAM AGAIN LATER
          }, msPerUpdate);
        } else {
          out(status);
          if (status == "hilbert") {
            log("NOT CLEARING UPDATE TIMER: " + status)
            // clearTimeout(updatesTimer);
          }
          updatesTimer = setTimeout(() => {
            drawHistogram();
          }, 60); // <--- Set to maximum time
          // }, maxMsPerUpdate); // <--- Set to maximum time
        }
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
      function throttleOut(ratio, str){
        if (Math.random() < ratio) { return str }
        return "";
      }
      function isDirtyPep(dirtyString) {
        // if (dirtyString) {
        //
        // } else {
        //   dirtyString = ""
        // }
        dirtyString = dirtyString + "";
        throttleOut(0.001, `your dirty string: ${dirtyString.substring(0,4).toUpperCase()}`);
        return pepTable => pepTable.Codon.substring(0,4).toUpperCase() == dirtyString.substring(0,4).toUpperCase();
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
        return minWidth(4, (Math.round(percentComplete*1000) / 10) + "%");
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
        out(fixedWidth(12,`tidy: ${str} dirty:${" " + isDirtyPep(str)} clean: ${clean}`));
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
          log("tidyPeptideName " + clean)
          if ( clean == undefined ) {
            clean = pepTable.find(isDirtyPep(str));
            if ( clean == undefined ) {
              clean = "none";
            }
          }
        }
        clean = spaceTo_( clean );
        let blah = isDirtyPep(str) + " ";
        log(`isDirtyPep(${str}) ${blah} clean: ${clean}`)
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
                let startStops = -1; // for the start/stop codon histogram
                if (aminoacid == "Amber" || aminoacid == "Ochre" || aminoacid == "Opal" ) {
                  startStops = pepTable.indexOf("Stop Codons");
                } else if (aminoacid == "Methionine") {
                  startStops = pepTable.indexOf("Start Codons");
                }
                if (startStops > -1) { // good ole -1 as an exception flag. oldskool.

                  log(startStops);
                  pepTable[ startStops ].Histocount++;
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
              if(colClock % 2 ==0 ){
                out(` [ ${colClock} ] `);
                out(terminalRGB(rawDNA + " ", 64, 128, 64));
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
            /** https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js/26038979
            * Look ma, it's cp -R.
            * @param {string} src The path to the thing to copy.
            * @param {string} dest The path to the new copy.
            */
            function recursiveSync(src, dest) {
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
