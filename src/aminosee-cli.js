const radMessage = `
MADE IN NEW ZEALAND
╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
by Tom Atkinson          aminosee.funk.nz
ah-mee no-see         "I see it now...  I AminoSee it!"
`;

const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stoRed in text files, output to PNG graphics file, then launches an WebGL this.browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by this.peptide.`;

const interactiveKeysGuide = `
Interactive control:    D            (devmode)  Q   (graceful quit next save)
V       ( verbose mode)  B ( live DNA to screen)  Control-C      (fast quit)
S    (start webserver)  W (toggle screen clear) U       (stats update on/off)
Esc     (graceful quit) O (toggle show files after in GUI)
`;
const lineBreak = `
`;
// const settings = require('./aminosee-settings');
const version = require('./aminosee-version');
const server = require('./aminosee-server');
const data = require('./aminosee-data');
// const StdInPipe = require('./aminosee-stdinpipe');
const doesFileExist = data.doesFileExist;
const doesFolderExist = data.doesFolderExist;
const createSymlink = data.createSymlink;
const asciiart = data.asciiart;
const extensions = data.extensions;
const saySomethingEpic = data.saySomethingEpic;
const readParseJson = data.readParseJson;
const debug = false; // should be false for PRODUCTION
// OPEN SOURCE PACKAGES FROM NPM
const path = require('path');
const Preferences = require("preferences");
const beautify = require("json-beautify");

const spawn = require('cross-spawn');
const stream = require('stream');
const async = require('async-kit'); // amazing lib
const term = require('terminal-kit').terminal;
const MyManHilbert = require('hilbert-2d'); // also contains magic
// const Readable = require('stream').Readable
// const Writable = require('stream').Writable
// const Transform = require('stream').Transform
// const request = require('request');
const es = require('event-stream');
const minimist = require('minimist')
const fetch = require("node-fetch");
const keypress = require('keypress');
const open = require('open'); //path-to-executable/xdg-open
// const parse = require('parse-apache-directory-index');
const fs = require('fs-extra'); // drop in replacement = const fs = require('fs')
const histogram = require('ascii-histogram');
const bytes = require('bytes');
const PNG = require('pngjs').PNG;
const os = require("os");
const humanizeDuration = require('humanize-duration')
// const appFilename = require.main.filename; //     /bin/aminosee.js is 11 chars
// const appPath = path.normalize(appFilename.substring(0, appFilename.length-15));// cut 4 off to remove /dna
const hostname = os.hostname();
const chalk = require('chalk');
const obviousFoldername = "/AminoSee_Output"; // descriptive for users
const netFoldername = "/output"; // terse for networks
const funknzlabel = "aminosee.funk.nz"
const closeBrowser = "If the process apears frozen, it's waiting for your this.browser or image viewer to quit. Escape with [ CONTROL-C ] or use --no-image --no-html";
const defaultC = 1; // back when it could not handle 3+GB files.
const artisticHighlightLength = 12; // px only use in artistic this.mode. must be 6 or 12 currently
const defaultMagnitude = 8; // max for auto setting
const theoreticalMaxMagnitude = 10; // max for auto setting
const overSampleFactor = 4; // your linear image divided by this will be the hilbert image size.
const maxCanonical = 32; // max length of canonical name
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ]; // I've personally never seen a mag 9 or 10 image, cos my computer breaks down. 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
const widthMax = 960; // i wanted these to be tall and slim kinda like the most common way of diagrammatically showing chromosomes
const defaultPort = 4321;
const max32bitInteger = 2147483647;
const minUpdateTime = 500;
const openLocalHtml = false; // affects auto-open HTML.
const wideScreen = 140; // shrinks terminal display
// let bodyParser = require('body-parser');
// const gv = require('genversion');
// let gui = require('./public/aminosee-gui-web.js');
let imageStack = server.imageStack;
// let imageStack = require('./public/aminosee-gui-web.js').imageStack;
// BigInt.prototype.toJSON = function() { return this.toString(); }; // shim for big int
// BigInt.prototype.toBSON = function() { return this.toString(); }; // Add a `toBSON()` to enable MongoDB to store BigInts as strings
const targetPixels = 8000000; // for big genomes use setting flag -c 1 to achieve highest resolution and bypass this taret max render size
let isElectron, jobArgs, killServersOnQuit, webserverEnabled, cliInstance, tx, ty, termPixels, cliruns, gbprocessed, projectprefs, userprefs, genomes, progato, commandString, batchSize, quiet, url, port;
let opens = 0; // session local counter to avoid having way too many windows opened.
let dnaTriplets = data.dnaTriplets;
termPixels = 69;
tx = ty = cliruns = gbprocessed = 0;
let isShuttingDown = false;
let threads = []; // an array of AminoSeNoEvil instances.
let clear = false;
module.exports = () => {
  isElectron = false;
  mode('exports');
  log(`isElectron: [${isElectron}]`)
  if (isElectron == true) {
    output("Electron mode enabled")
  } else {
    setupApp();
    cliInstance = new AminoSeeNoEvil();
    cliInstance.setupJob( populateArgs( process.argv )  );
    // cliInstance = newJob( populateArgs( process.argv ) ); // populate args returns the args.
  }
}
function populateArgs(procArgv) { // returns args
  const options = {
    boolean: [ 'artistic', 'clear', 'chrome', 'devmode', 'debug', 'demo', 'dnabg', 'explorer', 'file', 'force', 'firefox', 'gui', 'html', 'image', 'keyboard', 'list', 'progress', 'quiet', 'reg', 'recycle', 'redraw', 'serve', 'safari', 'test', 'updates', 'verbose', 'view' ],
    string: [ 'url', 'outpath', 'triplet', 'peptide', 'ratio', 'port' ],
    alias: { a: 'artistic', b: 'dnabg', c: 'codons', d: 'devmode', f: 'force', h: 'help', k: 'keyboard', m: 'magnitude', o: 'outpath', out: 'outpath', output: 'outpath', p: 'peptide', i: 'image', t: 'triplet', u: 'updates', q: 'quiet', r: 'reg', w: 'width', v: 'verbose', x: 'explorer', finder: 'explorer', view: 'html'  },
    default: { html: true, image: true, dnabg: false, clear: false, explorer: false, quiet: false, keyboard: false, progress: true, redraw: true, updates: true, serve: true, gui: true },
    stopEarly: false
  } // NUMERIC INPUTS: codons, magnitude, width, maxpix
  let args = minimist(procArgv.slice(2), options)
  log(args)
  // log( process.argv.slice(2) )
  // return minimist( process.argv.slice(2), options);
  return args;
  // return this.args;
}
function bruteForce(cs) {
  let pepTable = data.pepTable;
  output("Fast Batch Enabled. Length: " + pepTable.length);
  for (let i=1; i < data.pepTable.length-1; i++) {
    let pep =  data.pepTable[i].Codon
    setTimeout( () => {
      output( ` > ` + pep);
      let job = { _: [ cs ],
        peptide: pep,
        quiet: true,
        q: false,
        gui: false,
        keyboard: false,
        k: false,
        progress: false,
        redraw: true,
        updates: false,
      }
      newJob( job );
    }, 800 * i)
  }
}
function pushCli(cs) { // used by Electron GUI
  commandString = `node aminosee ${cs} --image --force --quiet`;// let commandArray = [`node`, `aminosee`, commandString];
  output(chalk.inverse(`Starting AminoSee now with CLI:`) + ` isElectron: [${isElectron}]`)
  let commandArray = commandString.split(" ");
  jobArgs = populateArgs( commandArray );
  // log(`pushCli: ${jobArgs.toString()} commandString: ${commandString}`);
  log(`Command: ${commandString}`);
  log(jobArgs);

  for (let i=0; i < commandArray.length; i++) {
    let job = commandArray[i];
    if (charAtCheck(job)) { // no files can start with - first char this.file
      // if (fileSystemChecks(job)) {
      log(`pushing job into render queuee: [${job}]`)
      jobArgs._.push(job)
      // } else {
      //   log(`umm: [${job}]`)
      // }
    } else {
      log(`configuring parameter: [${job}]`)
    }
  }
  // populateArgs( job )

  let thread = newJob(jobArgs);
  // let thread = newJob( commandString );
  threads.push( thread );
}
function setupApp() {
  [ userprefs, projectprefs ] = setupPrefs();

  if ( this.progress ) {
    progato = term.progressBar( {
      width: 80 ,
      title: 'Daily tasks:' ,
      eta: true ,
      percent: true ,
      items: this.howMany
    } ) ;
  }

}
function newJob( job ) { // used node and CLI tool.
  output( job )
  let nuThread = new AminoSeeNoEvil();
  nuThread.setupJob( job ); // do stuff that is needed even just to run "aminosee" with no options.
  return nuThread;
}

class AminoSeeNoEvil {
  constructor() { // CLI commands, this.files, *
    output(logo());
    this.outputPath = getOutputFolder();
    // [ projectprefs, userprefs] = setupPrefs();
  }
  // return number of AminoSee objects
  static get COUNT() {
    return AminoSeeNoEvil.count;
  }

  setupJob( args ) {
    mode('setup job')
    // do stuff aside from creating any changes. eg if you just run "aminosee" by itself.
    // for each render batch sent through newJob, here is where "this" be instantiated once per newJob
    // for each DNA file, run setupProject
    log(`setupJob args: ${ args }`);



    this.args = args; // populateArgs(procArgv);// this.args;
    webserverEnabled = true;

    batchSize = this.howMany;
    isShuttingDown = false;
    this.force = "strange";

    this.usersPeptide = "not set"
    this.usersTriplet = "not set"
    this.percentComplete = 0;
    try {
      this.howMany = args._.length;
    } catch(err) {
      this.howMany = 0;
    }
    this.loopCounter = 0;
    this.startDate = new Date(); // required for touch locks.
    this.started = this.startDate.getTime(); // required for touch locks.
    this.rawDNA = "this aint sushi";
    this.termDisplayHeight = 31;
    this.termStatsHeight = 9;
    this.timestamp = Math.round(+new Date()/1000);
    this.outFoldername = "";
    this.genomeSize = 0;
    this.killServersOnQuit = true;
    this.isElectron = true;
    this.maxMsPerUpdate  = 30000; // milliseconds per updatethis.maxpix = targetPixels; //
    this.timeRemain = 1;
    this.debugGears = 1;
    this.done = 0;
    this.suopIters = 0;
    this.raceDelay = 69; // so i learnt a lot on this project. one day this line shall disappear replaced by promises.
    this.darkenFactor = 0.125; // if user has chosen to highlight an amino acid others are darkened
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
    this.willRecycleSavedImage = false; // allows all the this.regular processing to mock the DNA render stage
    this.codonsPerSec = 0;
    this.peakRed  = 0.1010101010;
    this.peakGreen  = 0.1010101010;
    this.peakBlue  = 0.1010101010;
    this.rawDNA ="@loading DNA Stream..."; // this.debug
    this.outFoldername = `/AminoSee_Output`;
    this.justNameOfDNA = 'aminosee-is-looking-for-files-containing-ascii-DNA.txt';
    this.browser = 'firefox';
    // this.currentFile = funknzlabel;
    // this.nextFile = funknzlabel;
    // this.dnafile = funknzlabel;
    this.dimension = defaultMagnitude; // var that the hilbert projection is be downsampled to
    this.msPerUpdate  = minUpdateTime; // min milliseconds per update its increased for long renders
    this.now = new Date();
    this.termMarginTop = (term.height - this.termDisplayHeight - this.termStatsHeight) / 4;
    this.maxpix = targetPixels;
    this.termPixels = 69;//Math.round((term.width) * (term.height-8));
    this.runningDuration = 1; // ms
    this.pepTable = data.pepTable;
    this.streamLineNr = 0;
    this.termMarginLeft = 2;
    this.peptide = this.triplet = this.currentTriplet = this.currentPeptide = "none";
    // termSize();
    // this.resized(tx, ty);
    // this.previousImage = this.justNameOfDNA
    // server.buildServer()
    // output(logo());
    this.setNextFile();
    if ( args.debug || debug == true) {
      this.debug = true;
      output('debug mode ENABLED');
    } else {
      this.debug = false;
    }
    url = projectprefs.aminosee.url;
    if (url === undefined) {
      url = `http://localhost:4321`;
    }
    if ( args.url ) {
      url = args.url;
      projectprefs.aminosee.url = url;
      output(`Custom URL set: ${url}`);
    } else {
      log(`Using URL prefix: ${url}`)
    }
    if ( args.progres ) {
      this.updateProgress = true; // whether to show the progress bars
      log('progress bars enabled');
    } else {
      this.updateProgress = false; // whether to show the progress bars
      log('Disabled progress bars')
    }

    this.devmode = false;
    if ( args.devmode || args.d) { // needs to be at top sochanges can be overridden! but after this.debug.
      output("devmode enabled.");
      this.toggleDevmode(); // make sure debug is set first above
    }
    if ( args.recycle ) { // needs to be at top so  changes can be overridden! but after this.debug.
      output("recycle mode enabled. (experimental)");
      this.recycEnabled = true;
    } else { this.recycEnabled = false }

    if ( args.outpath || args.output || args.out || args.o) {
      this.usersOutpath = path.normalize(path.resolve( args.outpath));
      this.usersOutpath = this.usersOutpath.replace("~", os.homedir);
      if (doesFileExist(this.usersOutpath)) {
        if (fs.statSync(this.usersOutpath).isDirectory == true) {
          output(`Using custom output path ${this.usersOutpath}`);
          this.outputPath = this.usersOutpath;
        } else {
          this.error(`${this.usersOutpath} is not a directory`);
        }
      } else {
        this.usersOutpath = path.resolve(path.normalize( args.outpath));
        this.error(`Could not find output path: ${this.usersOutpath}, creating it this.now`);
        this.outputPath = this.usersOutpath;
        if ( this.mkdir() ) {
          log('Success');
        } else {
          this.error("That's weird. Couldn't create a writable output folder at: " + this.outputPath + " maybe try not using custom flag? --output");
          // this.outputPath = homedirPath;
          this.quit(0, `cant create output folder`);
          // return false;
        }
      }
    } else {
      this.outputPath = getOutputFolder();
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
    if ( args.port ) {
      this.port = Math.round( args.port );
      output
    } else {
      this.port = defaultPort;
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
    if ( args.image || args.i && args.quiet ) {
      this.openImage = true;
      log(`will automatically open image`)
    } else {
      log(`will not open image`)
      this.openImage = false;
    }
    if ( args.any || args.a) {
      this.anyfile = true;
      output(`will ignore filetype extensions list and try to use any file`)
    } else {
      log(`will only open files with extensions: ${extensions}`)
      this.anyfile = false;
    }
    if ( args.codons || args.c) {
      this.userCPP = Math.round( args.codons || args.c); // javascript is amazing
      output(`codons per pixel ${ this.userCPP }`);
      this.codonsPerPixel = this.userCPP;
    } else {
      this.codonsPerPixel = defaultC;
      this.userCPP = "auto";
    }
    // let computerWants = this.optimumDimension (linearpix);
    if ( args.maxpix ) {
      let usersPix = Math.round( args.maxpix )
      if ( usersPix < 1000000 ) {
        output(`maxpix too low. using 1,000,000`)
        this.maxpix = 1000000;
      } else {
        this.maxpix = usersPix
        if ( usersPix > targetPixels ) {
          output(`Wow cool, you want to use more than 9 mega-pixels, using: ${usersPix.toLocaleString()}`)
        }
      }
    }
    if ( args.magnitude || args.m ) {
      this.magnitude = "custom";
      this.dimension = Math.round( args.magnitude );
      if ( this.dimension < 3 ) {
        this.dimension = 3;
        output("Magnitude must be an integer number between 3 and 9. Using -m 3 for 4096 pixel curve.");
      } else if ( this.dimension > theoreticalMaxMagnitude) {
        this.dimension = theoreticalMaxMagnitude;
        this.maxpix = 32000000;
        output("Magnitude must be an integer number between 3 and 9 or so. 9 you may run out of memory.");
      } else if (  this.dimension > 6 &&  this.dimension < 9) {
        output(`Using custom output magnitude: ${ this.dimension }`);
      }
    } else {
      // this.magnitude = defaultMagnitude;
      this.magnitude = "auto";
      this.dimension = defaultMagnitude;
      output(`Using auto magnitude with limit ${defaultMagnitude}th dimension`)
    }
    bugtxt(` this.maxpix: ${  this.maxpix } this.dimension: ${ this.dimension }`);
    if ( args.ratio || args.r ) {
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
      this.userRatio = "custom";
    } else {
      bugtxt(`No custom ratio chosen. (default)`);
      this.ratio = "fix";
      this.userRatio = "auto";
    }
    log(`Using ${ this.ratio } aspect ratio`);

    if ( args.triplet || args.t) {
      this.usersTriplet = args.triplet;
      output(this.usersTriplet )
      this.triplet = this.tidyTripletName(this.usersTriplet );
      this.currentTriplet = this.triplet;
      if (this.triplet !== "none") { //uses global this.currentTriplet
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
      this.usersPeptide = args.peptide;
      this.peptide = tidyPeptideName( this.usersPeptide );
      if ( this.peptide !== "none"  ) { // this colour is a flag for  this.error
        this.isHighlightSet = true;
        output(`User has set highlight mode to ${ this.peptide }`);
      } else {
        output(`Sorry, could not lookup users peptide: ${ this.usersPeptide } using ${ this.peptide }`);
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
      output(`artistic enabled. Start (Methione =  green ) and Stop codons (Amber, Ochre, Opal) interupt the pixel timing creating columns. protein coding codons are diluted they are made ${ twosigbitsTolocale( this.opacity *100)}% translucent and ${ twosigbitsTolocale( this.codonsPerPixel )} of them are blended together to make one colour that is then faded across ${ artisticHighlightLength } pixels horizontally. The start/stop codons get a whole pixel to themselves, and are faded across ${ this.highlightFactor } pixels horizontally.`);
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
      bugtxt(`os.platform(): ${os.platform()} ${process.cwd()}`)
      this.verbose = true;
      this.termDisplayHeight++;
    } else {
      log(`verbose mode disabled`)
      this.verbose = false; }
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

      if ( cliruns > 69 || gbprocessed  > 0.1 || opens > 24 && Math.random() > 0.8) {
        output(`Easter egg: enabling dnabg mode!!`)
        this.dnabg = true
      } // if you actually use the program, this easter egg starts showing raw DNA as the background after 100 megs or 69 runs.
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
      } else {
        // output("Webserver Disabled ")
        // webserverEnabled = false;
      }
      if ( args.clear || args.c) {
        output("screen clearing enabled.");
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
        output(`using regmarks`)
      } else {
        log(`no regmarks`)
        this.reg = false;
      }
      if ( args.test) {
        this.test = true;
      } else {
        this.test = false;
      }
      // test = this.test;
      if ( args.stop ) {
        this.webserverEnabled = false;
        server.stop();
        if (this) {
          this.gracefulQuit(130)
        } else {
          cliInstance.gracefulQuit(130);
        }
      }
      if ( args.gui) {
        log(`Running AminoSee graphical user interface...`)
        // electron.
      } else {
        output("Disabled the GUI (graphical user interface)")
        this.openHtml = false;
        this.openFileExplorer = false;
        this.openImage = false;
      }
      if ( args.quiet || args.q) { // needs to be at top so changes can be overridden! but after this.debug.
        output("quiet mode enabled.");
        this.quiet = true;
        this.verbose = false;
        this.dnabg = false;
        this.updates = false;
        this.clear = false;
        webserverEnabled = false;
        this.raceDelay = 1; // yeah it makes it go faster
      } else {
        this.quiet = false;
        log('not using quiet mode. ')
      }
      quiet = this.quiet
      if ( this.isHighlightSet ) {
        output(`Custom peptide ${blueWhite( this.peptide )} set. Others will be mostly transparent. Triplet: ${ blueWhite( this.triplet ) }`);
      } else {
        log(`No custom peptide set.`);
      }
      bugtxt( `args: [${args.toString()}]`)
      if ( args.get ) {
        this.downloadMegabase( this.pollForStream); //.then(out("megabase done"));//.catch(log("mega fucked up"));
      }
      if ( args.demo ) {
        this.demo = true;
        output("Demo mode activated")

        runDemo();
      } else {
        this.demo = false;
      }
      if ( args.list ) {
        output("List DNA")
        listDNA();
      }
      if ( args.brute ) {
        this.brute = true;
        // bruteForce( args._[0] )
      } else {
        this.brute = false;
      }

      bugtxt(`the args -->> ${this.args}`)

      if ( webserverEnabled ) {
        let serverURL = server.start( this.outputPath );
        output(`started at ${serverURL}`)
      }

      if ( this.howMany > 0 ) {
        output(chalk.green(`${chalk.underline("Job items:")} ${this.howMany}`))
        log("Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω Ω ")
        mode("Ω first command " + this.howMany)
        // try {
        //   this.currentFile = args._[0]
        //   this.dnafile =  path.resolve( this.currentFile )
        //   if ( !charAtCheck(this.currentFile) ||  this.currentFile == funknzlabel ) {  return false }
        // } catch(err) {
        //   this.resetAndPop(`not a file`);
        // }
        this.prepareState('Ω first command ॐ')
      } else if ( this.test == true ) {
        output('Ω Running test Ω')
        this.generateTestPatterns(bugout);
      } else {
        mode("no command");
        if ( cliruns < 3) {
          output("FIRST RUN!!! Opening the demo... use the command aminosee demo to see this first run demo in future");
          this.firstRun();
        } else {
          log('not first run')
        }
        output(`Try running  --->>>        aminosee help`);
        output(`usage        --->>>        aminosee [*/dna-file.txt] [--help|--test|--demo|--force|--html|--image|--keyboard]     `); //" Closing in 2 seconds.")
        output(`example      --->>>        aminosee Human_Genome.txt Gorilla.dna Chimp.fa Orangutan.gbk --image `); //" Closing in 2 seconds.")
        if ( this.verbose == true && this.quiet == false) {
          this.helpCmd(args);
        } else if ( !this.quiet) {
          output(' ');
          // log('Closing in ')
          const carlo = require('./carlo');
          this.keyboard = true;
          this.setupKeyboardUI();
          // countdown('Press [Q] to exit or wait ', 15000, process.exit);
          countdown('Press [Q] to exit or wait ', 15000);

        } else {
          output();
          countdown('Closing in ', 700, AminoSeeNoEvil.quit);
        }

        return true;
      }
    }
    setupProgress() {
      if ( this.updateProgress == true) {
        //
        // let thingsToDo = [
        // 	'update my lib' ,
        // 	'data analyzing' ,
        // 	'serious business' ,
        // 	'decrunching data' ,
        // 	'do my laundry' ,
        // 	'optimizing'
        // ];

        // let countDown = this.howMany ;
        // progato = term.progressBar( {
        // 	width: 80 ,
        // 	title: 'Daily tasks:' ,
        // 	eta: true ,
        // 	percent: true ,
        // 	items: this.howMany
        // } ) ;
        // this.startProgress();
        //



        progato = term.progressBar({
          width: term.width - 20,
          title: `Booting up at ${ formatAMPM( new Date())} on ${hostname}`,
          eta: true,
          percent: true,
          inline: true
        });

        term.moveTo(1 + this.termMarginLeft,1 + this.termMarginTop);
        this.drawProgress();
      }
    }
    startProgress() {
      if ( this.howMany < 0 ) { return false }
      let task = this.currentFile
      progato.startItem( task ) ;

      // Finish the task in...
      setTimeout( this.doneProgress.bind( null , this.currentFile ) , 500 + Math.random() * 1200 ) ;

      // Start another parallel task in...
      setTimeout( this.startProgress , 400 + Math.random() * 400 ) ;
    }


    doneProgress( task ) {
      progato.itemDone( task ) ;

      if ( this.howMany < 0 ) {
        setTimeout( function() { term( '\n' ) ; process.exit() ; } , 200 ) ;
      }
    }
    destroyProgress() { // this.now thats a fucking cool name if ever there was!
      // if (this.howMany == -1) {
      // }
      if ( this.updateProgress == true) {
        if ( progato !== undefined) {
          progato.stop();
          //  progato = null;
        }
      }
      clearTimeout( this.updatesTimer);
      clearTimeout( this.progTimer);
      clearTimeout( this.lockTimer);
      deleteFile( this.fileServerLock );
    }
    // bugtxt(txt) { // full this.debug output
    //   if (this.quiet == false && this.debug == true && this.devmode == true && this.verbose == true)  {
    //     bugout(txt);
    //   } else {
    //     if (this.verbose == true ) {
    //       redoLine(txt);
    //     }
    //   }
    // }





    termSize() {
      tx = term.width;
      ty = term.height
      termPixels = (tx) * (ty-8);
      this.termPixels = termPixels;
    }

    resized(tx, ty) {
      clearCheck();
      termSize();
      termDrawImage(this.filePNG, `resized`);
      this.setDebugCols();
      tx = term.width; ty = term.height
      output(`Terminal resized: ${tx} x ${ty} and has at least ${termPixels} chars`)
      this.debugColumns = this.setDebugCols(); // Math.round(term.width / 3);
      this.msPerUpdate  = minUpdateTime;

      if ( this.updates == true) {
        if (tx > 400) {     // cover entire screen!
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
      clearTimeout( this.updatesTimer )
      this.drawHistogram();
    }
    cli(argumentsArray) {
      output(`cli argumentsArray [${argumentsArray.toString()}]`)
    }

    getRenderObject() { // return part of the histogramJson obj
      // this.calculateShrinkage();
      bugtxt(`codonsPerPixelHILBERT inside this.getRenderObject is ${ this.codonsPerPixelHILBERT }`)
      let linearimage, refimage;
      for (let h=0; h < this.pepTable.length; h++) {
        const pep =  this.pepTable[h];
        this.currentPeptide = pep.Codon;
        this.pepTable[h].hilbert_master = this.aminoFilenameIndex(h)[0];
        this.pepTable[h].linear_master = this.aminoFilenameIndex(h)[1];
        this.pepTable[h].hilbert_preview = this.aminoFilenameIndex(h)[0];
        this.pepTable[h].linear_preview = this.aminoFilenameIndex(h)[1];

        // bugtxt( this.pepTable[h].src);
      }
      this.currentPeptide = "none"; // get URL for reference image
      refimage = this.aminoFilenameIndex(-1)[0];
      linearimage = this.aminoFilenameIndex(-1)[1];
      this.pepTable.sort( this.compareHistocount )
      // bugtxt( this.pepTable ); // least common amino acids in front
      genomes = dedupeArray( genomes )
      let zumari = {
        original_source: this.justNameOfCurrentFile,
        full_path: this.file,
        maxpix:  this.maxpix,
        name: this.justNameOfDNA,
        refimage:  refimage,
        linearimage: linearimage,
        runid: this.timestamp,
        url: url,
        cliruns: cliruns,
        gbprocessed: gbprocessed,
        genomes: genomes,
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
        dimension:  this.dimension,
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
      return beautify( histogramJson, null, 2, 100);
    }



    // cliruns = "!";
    //  gbprocessed  = "!";





    setupProject() { // blank all the variables
      if ( this.renderLock == true ) {
        this.error(`Renderlock failed in setupProject ${ this.currentFile } , ${ this.nextFile} ${this.args}`)
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
      this.isDiskFinHTML = true;
      this.isDiskFinHilbert = true;
      this.isDiskFinLinear = true;
      this.isStorageBusy = false;
      // this.currentFile = this.args._[0].toString();
      // this.dnafile = path.resolve( this.currentFile )

      for (let h=0; h< this.pepTable.length; h++) {
        this.pepTable[h].Histocount = 0;
        this.pepTable[h].z = h;
        this.pepTable[h].src = this.aminoFilenameIndex(h)[0];
      }
      for (let h=0; h < dnaTriplets.length; h++) {
        dnaTriplets[h].Histocount = 0;
      }
      if (this.test) {
        this.dnafile = "Running Test"
      } else {
        this.setNextFile();
        this.autoconfCodonsPerPixel();
      }
      termSize();
    }

    progUpdate(obj) {  // allows to disable all the prog bars in one place
      if ( this.updateProgress == true) {
        if ( progato !== undefined && obj !== undefined) {
          this.fastUpdate();
          redoLine(`Progress ${obj}`)
          progato.update(obj);
        }
      } else {
        bugtxt(`progress dummy function: ${obj}`)
      }
    }

    setupKeyboardUI() {
      this.keyboard = true;
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

        if ( key ) {
          if ( key.name == 't') {
            mode('pushing this.test onto render queue')
            that.args._.push('test');
          }
          if ( key.name == 'c') {
            clearCheck();
          }
          if ( key.ctrl && key.name == 'c') {
            process.stdin.pause(); // stop sending control-c here, send that.now to parent, which is gonna kill us on the second go with control-c
            this.status  = "TERMINATED WITH CONTROL-C";
            isShuttingDown = true;
            if (that.devmode == true) {
              setTimeout(()=> {
                output(`Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly that.test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rende that.red  but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry; this way AminoSee will skip the large genome becauyse it has a lock file, saving me CPU during development. Lock files are safe to delete.`)
              }, 500)
            } else {
              that.removeLocks();
            }
            log( this.status );
            // that.updates = false;
            // args = [];
            that.debug = true;
            that.devmode = true;
            killServersOnQuit = true;
            server.stop();
            destroyKeyboardUI();
            // setTimeout(()=> {
            that.gracefulQuit(130);
            // }, 500)
          }
          if ( key.name == 'q' || key.name == 'Escape') {
            output("Gracefull Shutdown in progress... will finish this render then quit.")
            killServersOnQuit = false;
            that.gracefulQuit();
            // that.quit(7, 'Q / Escape - leaving webserver running in background')
          }
          if ( key.name == 'b') {
            clearCheck();
            that.togglednabg();
          }
          // if ( key.name == 's') {
          //   clearCheck();
          //   that.toggleServer();
          // }
          if ( key.name == 'f') {
            that.toggleForce();
          }
          if ( key.name == 'd') {
            clearCheck();
            that.toggleDebug();
          }
          if ( key.name == 'v') {
            clearCheck();
            that.toggleVerbose();
          }
          if ( key.name == 'o') {
            clearCheck();
            that.toggleOpen();
          }
          if ( key.name == 'o') {
            clearCheck();
            that.toggleOpen();
          }
          if ( key.name == 'w') {
            term.clear();
            that.toggleClearScreen();
          }
          // if ( key.name == 't') {
          //   linearpixbert();
          // }
          if ( key.name == 'Space' || key.name == 'Enter') {
            clearCheck();
            that.msPerUpdate  = 200;
          }
          if ( key.name == 'u') {
            that.msPerUpdate  = 200;
            if ( that.updates == true) {
              that.updates = false;
              clearTimeout( that.updatesTimer);
            } else {
              that.updates = true;
              that.drawHistogram();
            }
          }
        }


      });
      // process.on('exit', function () {
      // disable mouse on exit, so that the state
      // is back to normal for the terminal
      // keypress.disableMouse(process.stdout);
      // });

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
      clearCheck();
      log(`dnabg mode ${this.dnabg}`);
    }
    toggleServer() {
      webserverEnabled = !webserverEnabled;
      if (webserverEnabled) {
        log('start server')

        pushCli('serve');
        // server.start( this.outputPath )(this);
        // this.blockingServer();
      } else {
        killServers();
      }

    }
    toggleDebug() {
      this.debug = !this.debug;
      if (this.debug == true) {
        this.raceDelay  += 1000; // this helps considerably!
      }
      if (this.debug == false) {
        this.raceDelay  -= 100;
      }
      output("AminoSee has been slowed to " + this.raceDelay );
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
        this.progress = true; // EXPERIMENTAL FEATURES
        this.keyboard = true; // EXPERIMENTAL FEATURES
        this.termDisplayHeight++;
        this.raceDelay += 500; // this helps considerably!
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
      mode( `Graceful shutdown in progress... ${threads.length} threads code ${code}`);
      output(this.status )
      this.removeLocks(process.exit());
      var that = this;
      isShuttingDown = true;
      bugtxt( this.status );
      bugtxt("webserverEnabled: " + webserverEnabled + " killServersOnQuit: "+ killServersOnQuit)
      try {
        this.nextFile = "shutdown";
        this.howMany = 0;
      } catch(e) {

      }
      try {
        if (code = 130) {
          this.args._ = [];
          this.calcUpdate();
          // this.destroyProgress();
          this.removeLocks(process.exit());
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

    setNextFile() {
      this.nextFile = "Loading";
      try {
        this.nextFile = this.args._[1]; // not the last but the second to last
      } catch(e) {
        this.nextFile = "Finished";
      }
      if ( this.nextFile == undefined) {
        this.nextFile = "Finished";
        return false;
      } else { return true; }
    }
    pollForStream(reason) { // render lock must be off before calling. aim: start the render, or look for work
      // take current file and test if it can be rendered
      mode('pre-polling ' + reason);
      log(this.status )
      // var that = this;
      if ( this.renderLock == true ) {
        bugtxt(`thread re-entry inside pollForStream: ${ this.justNameOfDNA} ${ this.busy() } ${ this.storage() } reason: ${reason}`);
        this.error("bag vibes")
        return false;
      } else {
        log(`Not rendering presently. ${this.busy()}`)
      }
      if ( this.howMany < 0 ) {
        mode(`outa work - last render`)
        this.quit(0);
        return false;
      }
      if ( this.dnafile === undefined || this.currentFile === undefined) {
        reason = `this.dnafile == undefined`
        // this.popAndPollOrBust(reason);
        this.quit(0, reason);
        return false;
      }
      if ( this.isShuttingDown == false && this.howMany <= 0 ) { this.quit(0, "ran out of files to process") }
      if ( doesFolderExist(this.dnafile ) ) { // && this.currentFile !== ""
      if (this.currentFile == undefined) { return false; }
      let newCommand = `${this.currentFile}/*`
      let msg = `${this.dnafile }
      Folder (${this.currentFile}) provided as input instead of a file. ${this.howMany} If you meant to render everything in there, try using an asterix on CLI: aminosee ${newCommand}`
      // output(msg)
      // pushCli(newCommand)
      this.popAndPollOrBust(msg)
      // this.resetAndPop(msg)
      return false;
    }
    if (!this.checkFileExtension( this.currentFile)) {
      let msg = `${this.currentFile} wrong file extension. Must be one of ${ extensions } `
      out( this.busy() )
      if ( this.howMany > 0 ) {
        this.popAndPollOrBust(msg)
      }
      return false;
    }
    // if (doesFileExist(this.dnafile )  === false) {
    //   this.popAndPollOrBust(`${this.dnafile }  No File Found`);
    //   return false;
    // }
    // if ( !this ) { this.popAndPollOrBust("WTF GOING ON?!"); return }
    if ( this.currentFile == funknzlabel) { // maybe this is to get past my lack of understanding of processing of this.args.
      this.popAndPollOrBust(`For some odd reason... yeah Im gonna get back to you on that unset variable`);
      return false;
    }

    if (charAtCheck(this.dnafile )  == false) {
      this.popAndPollOrBust("charAtCheck returned false: "+ this.dnafile ) ;
      this.error(`breakpoint`)
      return false;
    }
    if (this.extension == "zip") {
      streamingZip(this.dnafile ) ;
    }
    ///////////////// BEGIN PARSING DNA FILE //////////////////////////////
    ///////////////// Check if it's been rendered etc
    mode(`pollForStream ${reason}`)
    this.setupProject();
    this.autoconfCodonsPerPixel();
    this.setupFNames(); // will have incorrect Hilbert file name. Need to wait until after render to check if exists.
    let msg = `>>> PREFLIGHT <<< ${ this.howMany } ${ fixedWidth(24,  this.currentFile)} then ${ fixedWidth(24,  this.nextFile)} reason: ${reason}`
    log(msg);
    redoLine(msg)
    log('Checking for previous render'+ this.filePNG)

    if (doesFileExist(this.filePNG) && this.force == false) {
      bugtxt(`isStorageBusy ${this.isStorageBusy} Storage: [${this.isStorageBusy}]`)
      termDrawImage(this.filePNG, `File already rendered`);
      let msg = `Already rendered ${ maxWidth(60, this.justNameOfPNG) }.`;
      log(msg);
      this.openOutputs();
      setTimeout( () => {
        this.popAndPollOrBust(msg);
      }, this.raceDelay)
      return false;
    } else {
      log(`Job to be rendered.`)
    }

    // if (doesFileExist(this.filePNG) && this.force == false) {
    //   bugtxt(`isStorageBusy ${this.isStorageBusy}`)
    //   termDrawImage(this.filePNG, `File already rendered`);
    //   let msg = `Already rendered ${ maxWidth(60, this.justNameOfPNG) }. Storage: [${this.isStorageBusy}]`;
    //   output(msg);
    //   this.openOutputs();
    //   this.popAndPollOrBust(msg);
    //   return false;
    // } else {
    //   log(`Job to be rendered.`)
    // }
    if ( this.checkFileExtension( this.currentFile ) == false)  {
      this.popAndPollOrBust("File Format not supported: " + chalk.inverse( this.getFileExtension( this.currentFile)) + ` supported: ${ extensions }`)
      return false;
    }
    if (doesFolderExist(this.dnafile ) ) {
      msg = `${this.currentFile} is a folder not a file, will try to re-issue job as ${this.currentFile}/* to process all in dir`
      // pushCli( `${basename( this.currentFile )}/*` );
      this.popAndPollOrBust(msg);
      return true;
    }
    if (this.howMany < 0) { isShuttingDown = true;}

    if ( this.checkLocks( this.fileTouch)) {
      output("Render already in progress by another thread for: " + this.justNameOfPNG);
      log("Either use --force or delete this lock file: ");
      log(`Touchfile: ${chalk.underline( this.fileTouch )}`);
      setTimeout( () => {
        if ( this.renderLock == false ) {
          this.popAndPollOrBust('Polling');
        } else {
          output("Render already in progress by another thread for: " + this.justNameOfPNG + " due to presence of " + this.fileTouch); // <---  another node maybe working on, NO RENDER
        }
      }, this.raceDelay )
      return false;
    }
    mode("Lock OK proceeding to render...");
    log(chalk.cyan( this.status ))
    setTimeout( () => {
      if ( this.renderLock == false ) {
        this.touchLockAndStartStream(); // <--- THIS IS WHERE MAGIC STARTS
      } else {
        this.error("Breakpoint")
      }
    }, this.raceDelay)
  }

  firstRun() {
    output(chalk.bgRed   ("First run demo!"));
    output(chalk.bgYellow("First run demo!"));
    output(chalk.bgGreen ("First run demo!"));
    runDemo();
  }
  //   startStreamingPng() {
  //     pixelStream = pStream(); // readable stream
  //     pixelStream.pipe(new PNG({
  //       width: 960,
  //       inputHasAlpha: true
  //     }))
  //     .on('parsed', function() {
  //       this.pack().pipe(fs.createWriteStream('streaming-out.png'));
  //     });
  //   }
  //   pStream() { // returns require('module');adable to push pixels into
  //   const through2 = require('through2');
  //   const Readable = require('readable-stream').Readable;
  //   const stream = Readable({objectMode: true});   /* 1 */
  //   stream._read = () => {};                       /* 2 */
  //   // setInterval(() => {                            /* 3 */
  //   //   stream.push({
  //   //     x: Math.random()
  //   //   });
  //   // }, 100);
  //   const getX = through2.obj((data, enc, cb) => { /* 4 */
  //     cb(null, `${data.x.toString()}\n`);
  //   });
  //   stream.pipe(getX).pipe(process.stdout);        /* 5 */
  //   return stream;
  // }
  resetAndPop(reason){
    if (reason === undefined) { this.error('must set a reason when using reset') }
    // if (this.renderLock == true) { output("ERROR: thread entered resetAndPop()"); return false}
    mode(`RESET JOB. Reason ${reason} Storage: (${ this.storage()} ${ this.busy()}) current: ${ this.currentFile } next: ${ this.nextFile}`)
    output(this.status );
    output( reason );
    this.setIsDiskBusy( false )
    // this.isDiskFinHTML = this.isDiskFinLinear = this.isDiskFinHilbert = true;
    // this.isStorageBusy = false;
    this.renderLock = false;
    this.percentComplete = 0;
    this.howMany = this.args._.length;
    if (this.howMany >= 0) {
      this.popAndPollOrBust(`reset ` + reason);
    } else {
      this.destroyProgress();
      this.quit(0, reason);
    }
  }
  prepareState( reason ) {
    mode(`Preparing for work reason: ${reason}`);
    if ( this.renderLock == true ) { // re-entrancy filter
      this.error('look thread re-rentry: ' + reason);
    }
    if ( this.test == true ) { // uses a loop not polling.
      this.error('test is in look for work?');
    }
    if (this.howMany <= 0) {
      mode('Happiness.');
      saySomethingEpic();
      log(chalk.bgRed.yellow(this.status ));
      // this.printRadMessage( this.status )
      this.quit(0, this.status  )
      return false;
    }
    let file;
    try {
      file = this.args._[0].toString();

    } catch(err) {
      log(`this.args._[0].toString() = ${this.args._[0].toString()}`)
    }

    if ( file == funknzlabel ) {
      this.error('funknzlabel')
      // this.popAndPollOrBust('funknzlabel ' + file);
      return false;
    }
    this.currentFile = file;
    this.dnafile = path.resolve(file);
    this.setNextFile();
    this.pollForStream(`Ready: ${this.currentFile}`);
    return false;
  }
  initStream() {
    mode("Initialising Stream");
    output(this.status)
    output(this.status)
    output(this.status)
    output(this.status)
    output(this.status)
    output(this.status)
    if ( isShuttingDown == true ) { output("Sorry shutting down."); return false;}
    if ( this.renderLock == false) {
      this.error("RENDER LOCK FAILED. This is an  this.error I'd like reported. Please run with --devmode option enabled and send the logs to aminosee@funk.co.nz");
      this.resetAndPop('render lock failed inside initStream');
      return false;
    } else {
      out('Begin')
    }
    bugtxt("isElectron: " + isElectron  );
    termSize();
    this.termSize();
    mode("Ω first command " + this.howMany + " " + this.currentFile);
    this.setIsDiskBusy( false );
    this.autoconfCodonsPerPixel();
    this.autoconfCodonsPerPixel();
    // this.mkRenderFolders(); // create /images etc
    // this.setupProgress();
    this.rawDNA = "@"
    this.extension = this.getFileExtension( this.currentFile );
    this.percentComplete = 0;
    this.genomeSize = 1; // number of codons.
    this.pixelStacking = 0; // how we fit more than one codon on each pixel
    this.pixelClock = 0; // which pixel are we painting?
    this.msElapsed  = 0;

    this.rgbArray = [];
    initialiseArrays();

    this.hilbertImage = [];
    bugtxt(`Loading ${ this.dnafile } Filesize ${bytes( this.baseChars)}`);
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
      this.recycleOldImage( this.filePNG );
      // recycleHistogram
      return false;
    } else {
      log('Not recycling');
    }
    // startStreamingPng();
    process.title = `aminosee.funk.nz (${ this.justNameOfDNA} ${bytes( this.estimatedPixels*4)} ${ this.highlightOrNothin() } c${ this.codonsPerPixel })`;
    this.streamStarted();

    try {
      var that = this;
      var closure = this.dnafile;
      var readStream = fs.createReadStream( closure ).pipe(es.split()).pipe(es.mapSync(function(line){
        readStream.pause(); // pause the readstream during processing
        that.processLine(line); // process line here and call readStream.resume() when ready
        readStream.resume();
      })
      .on('start', function(err){
        mode("streaming start");
        output(`streaming start ${err}`);
      })
      .on('error', function(err){
        mode(`stream error ${err}`);
        output(that.status )
        // output(`while starting stream: [${ closure }] renderLock: [${ this.renderLock}] storage: [${this.storage()}]`);
        // this.streamStopped();
      })
      .on('end', function() {
        mode("stream end");

      })
      .on('close', function() {
        mode("stream close");
        that.streamStopped();

      }));
    } catch(e) {
      output("Catch in Init ERROR:"  + e)
    }

    log("FINISHED INIT " + that.howMany);
    // term.up( this.termStatsHeight);
    // clearCheck();
    term.eraseDisplayBelow();
  }
  streamStarted() {
    mode(`Stream started at ${ formatAMPM(this.startDate) }`);
    this.tLock();
    var that = this;
    output(`Started render of ${this.justNameOfPNG} next is ${this.nextFile}`);
    if ( this.renderLock == true ) {
      if ( this.updates == true) {
        this.drawHistogram();

      }
      this.progUpdate({ title: 'DNA File Render step 1/3', items: this.howMany, syncMode: true })
      setTimeout(() => {
        that.manageLocks(10000) // 10 seconds
      }, 5000);
    } else {
      output(`Thread entered streamStarted`);

    }
  }
  manageLocks(time) {
    if ( this.lockTimer !== undefined) { clearTimeout(this.lockTimer) }
    if ( isShuttingDown) { return false }
    var that = this;

    this.lockTimer = setTimeout( () => {
      if ( that.renderLock == true ) {
        that.fastUpdate();
        if (  that.percentComplete < 0.9 &&  that.timeRemain > 20000 ) { // helps to eliminate concurrency issues
          that.tLock();
          that.manageLocks(time*2)
        } else {
          log('Over 90% done / less than 20 seconds: ' + nicePercent(that.percentComplete) + ' time remain: ' + humanizeDuration( that.timeRemain))
        }
      } else {
        out("Stopped")
      }
    }, time);
  }
  streamStopped() {
    mode('stream stopped')
    out("Stream ending event");
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
    this.justNameOfDNA: <b>${ this.justNameOfDNA}</b>
    Registration Marks: ${( this.reg ? true : false )}
    ${ ( this.peptide || this.triplet ) ?  "Highlights: " + ( this.peptide || this.triplet) : " "}
    Your custom flags: TEST${(  this.force ? "F" : ""    )}${(  this.userCPP == "auto"  ? `C${ this.userCPP }` : ""    )}${(  this.devmode ? "D" : ""    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : ""    )}${(  this.args.magnitude || this.args.m ? `M${ this.dimension }` : ""    )}
    ${(  this.artistic ? ` Artistic this.mode` : ` Science this.mode`    )}
    Max magnitude: ${ this.dimension } ${ this.dimension } / 10 Max pix: ${ this.maxpix.toLocaleString()}
    Hilbert Magnitude: ${ this.dimension } / ${defaultMagnitude}
    Hilbert Curve Pixels: ${hilbPixels[ this.dimension ]}`;
  }
  renderObjToString() {
    const unknown = 'unknown until render complete';
    return `
    Canonical this.justNameOfDNA: ${ this.justNameOfDNA}
    Source: ${ this.justNameOfCurrentFile}
    Full path: ${this.dnafile }
    Started: ${ formatAMPM(this.startDate) } Finished: ${ formatAMPM(new Date())} Used: ${humanizeDuration( this.runningDuration )} ${ this.isStorageBusy ? ' ' : '(ongoing)'}
    Machine load averages: ${ this.loadAverages()}
    DNA Input bytes: ${ bytes( this.baseChars ) } ${ bytes( this.bytesPerMs * 1000 ) }/sec
    Image Output bytes: ${ this.isStorageBusy == true ? bytes( this.rgbArray.length ) : '(busy)' }
    Pixels (linear): ${ this.pixelClock.toLocaleString()} Image aspect Ratio: ${ this.ratio }
    Pixels (hilbert): ${hilbPixels[ this.dimension ].toLocaleString()} ${(  this.dimension ? "(auto)" : "(manual -m)")}
    Custom flags: ${ this.showFlags()} "${( this.artistic ? "Artistic mode" : "Science mode" )}" render style
    Estimated Codons: ${Math.round( this.estimatedPixels).toLocaleString()} (filesize % 3)
    Actual Codons matched: ${ this.genomeSize.toLocaleString()} ${ this.isStorageBusy ? ' ' : '(so far)' }
    Estimate accuracy: ${ this.isStorageBusy ? Math.round((( this.estimatedPixels /  this.genomeSize))*100) + '% of actual ': '(still rendering...) ' }
    Non-coding characters: ${ this.errorClock.toLocaleString()}
    Coding characters: ${ this.charClock.toLocaleString()}
    Codons per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )} (linear) ${ this.isStorageBusy ? twosigbitsTolocale( this.codonsPerPixelHILBERT ) : unknown } (hilbert projection)
    Linear to Hilbert reduction: ${ this.isStorageBusy ?  twosigbitsTolocale( this.shrinkFactor) : unknown } Oversampling: ${ twosigbitsTolocale(overSampleFactor)}
    Amino acid blend opacity: ${Math.round(this.opacity *10000)/100}%
    Max pix setting: ${ this.maxpix.toLocaleString()}
    ${ this.dimension }th Hilbert curve infintite recursion dimension
    Darken Factor ${ twosigbitsTolocale(this.darkenFactor)} / Highlight Factor ${ twosigbitsTolocale( this.highlightFactor)}
    Gigabytes processed on this profile: ${ gbprocessed.toLocaleString()} Run ID: ${ this.timestamp } ${ cliruns}th run on ${ hostname }
    Total renders: ${ userprefs.aminosee.completed } Project opens: ${ projectprefs.aminosee.opens } (only increments when using --image --help --html or --explorer)
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
    if (this.dnafile  == funknzlabel) { log('no'); return false; }
    this.baseChars = this.getFilesizeInBytes( this.dnafile );
    if ( this.baseChars < 0) { // switch to streaming pipe this.mode,
      this.error("Are you streaming std in? That part isn't written yet!")
      this.isStreamingPipe = true; // cat Human.genome | aminosee
      this.estimatedPixels = 696969; // 696969 flags a missing value in this.debug
      this.magnitude = this.dimension = 6; // close to 69
      log("Could not get filesize, setting for image size of 696,969 pixels, maybe use --codons 1 this is rendered with --codons 696");
      this.baseChars = 696969; // 696969 flags a missing value in this.debug
      this.codonsPerPixel = 696; // small images with _c69 in this.file
      process.exit();
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
      // output(`Manual zoom level override enabled at: ${ this.userCPP } codons per pixel.`);
      this.codonsPerPixel = this.userCPP;
    } else {
      // log("Automatic codons per pixel setting")
    }

    if ( this.estimatedPixels >  this.maxpix ) { // for seq bigger than screen        this.codonsPerPixel = this.estimatedPixels /  this.maxpix*overSampleFactor;
      this.codonsPerPixel = Math.round( this.estimatedPixels /  this.maxpix ); // THIS IS THE CORE FUNCTION
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
        bugtxt('For genomes smaller than 1843200 codons, I switched to square this.ratio for better comparison to the Hilbert images. Use --ratio=fixed or --ratio=golden to avoid this. C. Elegans worm is big enough, but not Influenza.')
      } else {
        bugtxt('Genomes <  1840000 codons. square this.ratio enabled')
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
    // bugtxt(`Call to highlight this.dnafile made`)
    let ret = "";
    if ( this.isHighlightSet == false) {
      ret += `__Reference`;
    } else {
      if ( this.currentTriplet.toLowerCase() != "none" || this.triplet.toLowerCase() != "none") {
        ret += `_${spaceTo_( this.currentTriplet).toUpperCase()}`;
      } else if ( this.currentPeptide != "none") {
        ret += `_${spaceTo_( tidyPeptideName( this.peptide ) )}`;
      } else {
        ret += `__Reference`;
      }
    }
    // log(`ret: ${ret} this.currentTriplet: ${currentTriplet}  this.currentPeptide ${ this.currentPeptide}`);
    return ret;
  }
  setupHilbertFilenames() {
    this.calculateShrinkage(); // REQUIRES INFO FROM HERE FOR HILBERT BUT THAT INFO NOT EXIST UNTIL WE KNOW HOW MANY PIXELS CAME OUT OF THE DNA!
    this.fileHILBERT = `${ this.outputPath }/${ this.justNameOfDNA }/images/${ this.generateFilenameHilbert() }`;
  }


  generateFilenameHistogram() {
    this.fileHistogram = path.normalize( path.resolve(`${ this.outputPath }/${ this.justNameOfDNA}/aminosee_histogram.json`) );
    return this.fileHistogram;
  }

  generateFilenameTouch() { // we need the *fullpath* of this one
    let justTouch = `AminoSee_BUSY_LOCK_${ this.extension }${ this.highlightFilename() }_c${ onesigbitTolocale( this.codonsPerPixel ) }${ this.getImageType() }.txt`;

    // this.fileTouch = path.resolve(`${ this.outputPath }/${ this.justNameOfDNA }/${ this.justTouch }`);
    // log(`this.debug for justTouch: ${ this.justTouch }`);
    // log(`this.debug for generateFilenameTouch: ${ this.fileTouch }`);
    return           justTouch;
  }
  generateFilenamePNG() {
    this.justNameOfPNG =         `${ this.justNameOfDNA}.${ this.extension }_linear${ this.highlightFilename() }_c${ onesigbitTolocale( this.codonsPerPixel )}${ this.getImageType() }.png`;
    return this.justNameOfPNG;
  }
  generateFilenameHilbert() {
    if ( this.test) {
      // the this.dnafile should be set already fingers crossed.
      // this.justNameOfHILBERT =     `${ this.justNameOfDNA}.${ this.extension }_HILBERT${ this.highlightFilename() }_m${ this.dimension }_c${ onesigbitTolocale( this.codonsPerPixelHILBERT )}${ this.getRegmarks()}.png`;

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

    if (isShuttingDown) {     output(`isShuttingDown: [${ isShuttingDown }]`)  }
    // this.calculateShrinkage(); // REQUIRES INFO FROM HERE FOR HILBERT BUT THAT INFO NOT EXIST UNTIL WE KNOW HOW MANY PIXELS CAME OUT OF THE DNA!
    this.dnafile = path.resolve(this.currentFile);
    this.justNameOfCurrentFile  = basename( this.dnafile );
    this.extension = this.getFileExtension( this.currentFile );
    this.justNameOfDNA = spaceTo_( this.removeFileExtension( this.justNameOfCurrentFile));
    if ( this.justNameOfDNA.length > maxCanonical ) {
      this.justNameOfDNA = this.justNameOfDNA.replace('_', '');
    }
    if ( this.justNameOfDNA.length > maxCanonical ) {
      this.justNameOfDNA = this.justNameOfDNA.substring(0,maxCanonical/2) + this.justNameOfDNA.substring( this.justNameOfDNA.length-( maxCanonical /2), this.justNameOfDNA.length);
    }
    this.fileTouch =   this.qualifyPath( this.generateFilenameTouch()  );
    this.fileHTML =    this.qualifyPath( this.generateFilenameHTML()   );
    this.filePNG =     this.qualifyPath(`images/${ this.generateFilenamePNG()     }`);
    this.fileHILBERT = this.qualifyPath(`images/${ this.generateFilenameHilbert() }`);
    this.fullURL          = `${url}/${this.justNameOfDNA}/${this.justNameOfHTML}`;
    // this.fancyFilenames();
    this.setNextFile();
  }
  qualifyPath(f) {
    return path.resolve( `${ this.outputPath }/${ this.justNameOfDNA }/${ f }` );
  }




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

  helpCmd(args) {

    output(chalk.bgBlue.bold.italic(`Welcome to the AminoSee DNA Viewer!`));
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
    output('  -- magnitude [0-8] -m9 crashes my mac 4096x4096 -m8 maximum 2048x2048 resolution');
    output(chalk.bgBlue (`FLAGS:`));
    output('  --ratio=[square|golden|fixed] fixed is default: 960px width variable height aspect');
    output('  --ratio=fix --ratio=golden --ratio=sqr aspect ratio proportions');
    output('  --verbose -v                               verbose mode');
    output('  --help -h                             show this message');
    output('  --force -f              ignore locks overwrite existing');
    output('  --devmode -d   will skip locked files even with --force');
    output('  --artistitc -a   creates a visual rhythm in the picture');
    output('  --dnabg -b   spew DNA bases to background during render');
    output('  --clear --no-clear       dont clear the terminal during');
    output('  --reg     put registration marks @ 25% 50% 75% and 100%');
    output('  --test                 create calibration test patterns');
    output('  --keyboard -k enable interactive mode, use control-c to end');
    output('  --firefox --chrome --safari changes default browser to open images');
    output('  --clear');
    output('  --html --no-html             open HTML report when done');
    output('  --updates --no-updates           turn off stats display');
    output('  --image                            open image when done');
    output('  --explorer  --file open file explorer / Finder to view files');
    output('  --no-gui               disables all GUI except terminal');
    output('  --quiet  -q               full quiet mode / server mode');
    output(chalk.bgBlue (`EXAMPLES:`));
    output('     aminosee Human-Chromosome-DNA.txt --force overwrite w/ fresh render');
    output('     aminosee chr1.fa -m 8                  render at 2048x2048');
    output('     aminosee chr1.fa  chrX.fa  chrY.fa          render 3 files');
    output('     aminosee * --peptide="Glutamic acid" (use quotes if there is a space');
    output('     aminosee * --triplet=GGT (highlight only this specific version of amino acid');
    output('     aminosee test                 (generate calibration images');
    output('     aminosee serve                (fire up the mini web server');
    output('     aminosee demo   <<-----           (run demo - beta version');
    output('     aminosee help   <<-----           (shows this docs message');
    output('     aminosee *         (render all files with default settings');
    term.down( this.termStatsHeight);
    if ( this.quiet == false) {
      this.printRadMessage( [ `software version ${version}` ] );
    }

    this.setupKeyboardUI(); // allows fast quit with [Q]

    if ( this.help == true) {
      this.openHtml = true;
      this.openImage = true;
      this.openFileExplorer = true;
      // if ( this.keyboard == true) { // this not need done twice
      // }
      // countdown('Press [Q] to quit this.now, [S] to launch a web server in background thread or wait ', 4000, blockingServer());
      // countdown('Press [S] to launch a web server in background thread or quit in ', 4000);
      // setTimeout( () => {
      //   countdown("Closing in " , 6000, process.exit  );
      // }, 4000)
    } else {
      // output('This is a terminal CLI (command line interface) program. Run it from the DOS prompt / Terminal.app / shell.', 4000);
      // countdown('Press [Q] to quit now, closing in ', 4000 );
    }
  }

  mkRenderFolders() {
    log(`Making render folders for ${ this.justNameOfDNA}`)
    // this.mkdir(); // create the output dir if it not exist
    this.mkdir( this.justNameOfDNA ); // render dir
    this.mkdir(`${ this.justNameOfDNA}/images`);
  }
  fancyFilenames() {
    term.eraseDisplayBelow();
    output(chalk.bold(`Render Filenames for ${ this.justNameOfDNA}:`));
    output(chalk.rgb(255, 255, 255).inverse( fixedWidth( this.debugColumns*2, `Input DNA File: ${ this.dnafile }`)));
    output(chalk.rgb(200,200,200).inverse(  fixedWidth( this.debugColumns*2, `Linear PNG: ${ this.justNameOfPNG }`)));
    output(chalk.rgb(150,150,150).inverse(  fixedWidth( this.debugColumns*2, `Hilbert PNG: ${ this.justNameOfHILBERT }`)));
    output(chalk.rgb(100,100,180).inverse.underline(  fixedWidth( this.debugColumns*2, `HTML ${ this.fileHTML }`)));
    output(chalk.rgb(80,80,120).bgBlue.inverse(fixedWidth( this.debugColumns*2, `${ this.fileTouch }`)));
    output(chalk.rgb(0,0,128).bgWhite.inverse(fixedWidth( this.debugColumns*2, `${ this.fullURL }`)));
  }
  setIsDiskBusy(boolean) {
    if (boolean) { // busy!
      out(`Disk is locked! (this is ok)`)
      this.isStorageBusy = true;
      this.isDiskFinHTML = false;
      this.isDiskFinHilbert = false;
      this.isDiskFinLinear = false;
      // this.renderLock = true;
    } else { // free!
      out(`Disk is unlocked! (this is ok)`)
      this.isStorageBusy = false;
      this.isDiskFinHTML = true;
      this.isDiskFinHilbert = true;
      this.isDiskFinLinear = true;
      // this.renderLock = false;
    }
  }



  saveDocsSync() {
    let pixels = 0;
    mode('saveDocsSync ' + this.justNameOfPNG);
    if ( this.renderLock == false) {
      this.error("How is this even possible. renderLock should be true until all storage is complete");
      return false;
    }
    // this.percentComplete = 1; // to be sure it shows 100% complete
    try {
      pixels = ( this.rgbArray.length / 4);
    }
    catch (err) {
      this.resetAndPop(`EXCEPTION DURING this.rgbArray.length / 4 = ${err}`);
      return false;
    }
    if ( pixels < 64) {
      this.resetAndPop(`Either there is too little DNA in this file for render at ${ this.codonsPerPixel } codons per pixel, or less than 64 pixels rendered: ${pixels} pixels rendered from ${ this.currentFile }`);
      data.saySomethingEpic();
      return false;
    }
    this.setIsDiskBusy( true );
    log(chalk.inverse(`Finished linear render of ${ this.justNameOfDNA} ${ pixels } = ${ this.pixelClock }`))
    term.eraseDisplayBelow();

    if (this.test) { // the calibration generates its own image
      this.shrinkFactor = 1;
    } else { // regular DNA processing
      cliruns = userprefs.aminosee.cliruns;
      cliruns++;
      userprefs.aminosee.cliruns = cliruns; // increment run counter. for a future high score table stat and things maybe.

      gbprocessed  = userprefs.aminosee.gbprocessed;
      gbprocessed +=  this.baseChars / 1024 / 1024 / 1024; // increment disk counter.
      userprefs.aminosee.gbprocessed = gbprocessed; // i have a superstition this way is less likely to conflict with other threads

      genomes = projectprefs.aminosee.genomes;
      genomes.push(this.justNameOfDNA);
      projectprefs.aminosee.genomes = dedupeArray( genomes );
    }
    // clearTimeout( updatesTimer)
    this.calcUpdate();
    this.setupHilbertFilenames();
    this.fancyFilenames();

    var that = this; // closure
    mode('async.series')
    // async.waterfall( [
    async.series( [
      function ( cb ) {
        mode('async start ' + that.currentFile)
        that.savePNG( cb );
      },
      function ( cb ) {
        that.saveHTML(  ); // saveHTML no longer calls htmlFinished, its so that.openOutputs has time to open it
        cb();
      },
      function ( cb ) {
        that.saveHilbert( cb )
      }
    ])
    .exec( function( error, results ) {
      output( 'Saving complete............... next: ' + this.nextFile ) ;
      // that.postRenderPoll(`End of async.series`)
      if ( error ) { log( 'Doh! ' + error ) ; }
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
    if ( this.isHilbertPossible == false ) { mode('not saving html - due to hilbert not possible'); this.isDiskFinHTML = true; }
    if ( this.report == false ) { mode('not saving html - due to report disabled. peptide: ' + this.peptide); this.isDiskFinHTML = true; }
    if ( this.test ) { log('not saving html - due to test');  this.isDiskFinHTML = true;  }
    if ( this.willRecycleSavedImage == true && this.recycEnabled == true) {
      mode("Didnt save HTML report because the linear file was recycled.");
      this.isDiskFinHTML = true;
    }
    if (this.isDiskFinHTML == true ) { // set just above
      this.htmlFinished();
      if ( cb !== undefined ) { cb() }
      return false;
    }
    mode("saving HTML");
    this.pepTable.sort( this.compareHistocount )

    let histogramJson =  this.getRenderObject();
    let histogramFile = this.generateFilenameHistogram();
    if ( doesFileExist( histogramFile ) ) {
      let loadedJson = readParseJson( histogramFile );
      this.pepTable = loadedJson.pepTable
    }
    let hypertext
    if ( this.test === true ) {
      hypertext = this.htmlTemplate( this.testSummary() );
    } else {
      hypertext = this.htmlTemplate( histogramJson );
    }

    let histotext = JSON.stringify(histogramJson);
    let filename;
    this.fileWrite( this.fileHTML, hypertext );
    this.fileWrite( histogramFile, histotext );
    if (this.userCPP == "auto" && this.magnitude == "auto" && this.artistic == false) {
      if ( debug ) {
        filename = `${ this.outputPath }/${ this.justNameOfDNA}/main.html`
      } else {
        filename = `${ this.outputPath }/${ this.justNameOfDNA}/index.html`
      }
      this.fileWrite(filename, hypertext, cb); // the main.html is only written is user did not set --codons or --magnitude or --peptide or --triplet or --artistic
    } else if (this.artistic && this.userCPP == "auto") {
      this.fileWrite(`${ this.outputPath }/${ this.justNameOfDNA}/artistic.html`, hypertext, cb);
    }
    this.htmlFinished();
    // if ( cb !== undefined ) { cb() }
  }
  fileWrite(file, contents, cb) {
    this.mkRenderFolders();
    // var that = this;
    try {
      fs.writeFile(file, contents, 'utf8', function (err, cb) {
        if (err) {
          bugtxt(`[FileWrite] Issue with saving: ${ file } ${err}`)
        } else {
          try {
            bugtxt('Set permissions for file: ' + file);
            // fs.chmodSync(file, 0o777); // not work with strict this.mode
            fs.chmodSync(file, '0777');
          } catch(e) {
            log('Could not set permission for file: ' + file + ' due to ' + e);
          }
        }
        out('$ ' + file);
        if ( cb !== undefined ) { cb() }
      });
      out('¢');
    } catch(err) {
      log(`[catch] Issue with saving: ${file} ${err}`);
      if ( cb !== undefined ) { cb() }
    }
  }
  touchLockAndStartStream() { // saves CPU waste. delete lock when all files are saved, not just the png.
    mode("touchLockAndStartStream");
    if ( this.renderLock == true ) {
      output(`Thread re-entry during locking`)
      return false;
    } else {
      log(`Locking threads for render`)
    }
    this.renderLock = true;
    // output("Start")
    this.tLock( );
    this.initStream()
  }
  blurb() {
    return `Started DNA render ${ this.currentFile } at ${ formatAMPM( this.startDate)}, and after ${humanizeDuration( this.runningDuration)} completed ${ nicePercent(this.percentComplete)} of the ${bytes(  this.baseChars)} file at ${bytes( this.bytesPerMs*1000)} per second.
    Estimated ${humanizeDuration( this.timeRemain)} to go with ${  this.genomeSize.toLocaleString()} r/DNA triplets decoded, and ${ this.pixelClock.toLocaleString()} pixels painted.
    It was the ${this.howMany}th file of ${batchSize} issued by ${ isElectron ? 'Electron GUI' : 'Terminal CLI' } running on ${ os.platform() } on ${os.hostname()}.
    ${ this.memToString()} currently ${this.busy()}
    CPU load:    [ ${ this.loadAverages()} ]`
  }
  tLock(cb) {
    this.calcUpdate();
    const outski = `
    AminoSee DNA Viewer by Tom Atkinson.

    ${ asciiart }

    This is a temporary lock file, placed during rendering to enable parallel cluster rendering over LAN networks, if this is here after processing has completed, usually it means an AminoSee had quit before finishing with --devmode enabled, or... had crashed. If the file is here when idle, it prevents the render and will cause AminoSee to skip the DNA. It's SAFE TO ERASE THESE FILES (even during the render, you might see it come back alive or not). Run the script /dna/find-rm-touch-files.sh to batch delete them all in one go. Normally these are deleted when render is completed, or with Control-C during graceful shutdown on SIGINT and SIGTERM. If they didn't they are super useful to the author for debugging, you can send to aminosee@funk.co.nz

    Input: ${ this.dnafile }
    Your output path : ${ this.outputPath }

    ${ this.blurb() }
    ${ version } ${ this.timestamp } ${ hostname }

    ${this.renderObjToString()}`; //////////////// <<< END OF TEMPLATE
    //////////////////////////////////////////
    this.fileWrite(
      this.fileTouch,
      outski,
      cb
    );
    if ( this.msElapsed > 10000) {
      termDrawImage(this.filePNG, `lock file`);
    }
    if ( !this.quiet ) {
      // term.saveCursor()
      // term.moveTo(0, term.height - 5);
      // output(chalk.bgWhite.rgb(48,48,64).inverse( this.blurb() ));
      out('*')
      // term.restoreCursor()
    }
  }
  fileBug(err) {
    bugtxt(err + " the file was: " + this.currentFile);
  }
  static deleteFile(file) {
    try {
      fs.unlinkSync(file, (err) => {
        bugtxt("Removing file OK...")
        if (err) { fileBug(err)  }
      });
    } catch (err) {
      fileBug(err)
    }
  }

  removeLocks(cb) { // just remove the lock files.
    this.percentComplete = 1;
    mode('remove locks');
    bugtxt('remove locks with ' + this.howMany + ' files in queue. this.fileTouch: ' + this.fileTouch)
    this.renderLock = false
    this.howMany--
    clearTimeout( this.updatesTimer);
    clearTimeout( this.progTimer);

    if (this.devmode == true) {
      output(`Because you are using --devmode, the lock file is not deleted. This is useful during development of the app because when I interupt the render with Control-c, AminoSee will skip that file next time, unless I use --force. Lock files are safe to delete at any time.`)
    } else {
      deleteFile( this.fileTouch);
    }

    if ( cb !== undefined ) { cb() }
  }
  // check if its cool to poll for stream but dont pop the array:

  popAndPollOrBust(reason) { // ironic its now a .shift()
    // pop the array, the poll for stream or quit
    bugtxt( `popAndPollOrBust: ${this.busy()} `)
    let file;
    out(`pop ${ this.howMany } reason: ${reason}`)
    if ( this.test ) {
      this.error(`Test mode.`)
      log(`Test mode.`)
    }
    if ( this.renderLock == true) {
      this.error(`Thread re-entered popAndPollOrBust due to: ${reason}`)
    } else { out(`About to pop / shift`) }
    try {
      file = this.args._.shift().toString(); // file = this.args._.pop().toString();
      // file = this.args._.pop().toString(); // file = this.args._.pop().toString();
    } catch(e) {
      this.quit(0, 'no more commands' );
      return false;
    }
    this.howMany = this.args._.length;
    this.setNextFile();

    if ( file.indexOf('...') != -1) {
      mode( 'Cant use files with three dots in the file ... (for some reason?)');
      this.popAndPollOrBust(this.status );
      // this.quit(0, 'no more commands' );
      return false;
    }
    if ( file === undefined) {
      mode('undefined after resolve: ' + file)
      // this.quit(0, 'no more commands' );
      return false;
    }
    try {
      this.dnafile = path.resolve( file );
      this.currentFile = file;
    } catch(err) {
      log('failed file system checks: '+ file)
    }
    log( chalk.inverse(`${this.busy()} Checking job ${fixedWidth(3,  this.howMany )}: `) +  ' ' + chalk.bgBlue.white( fixedWidth(40, this.currentFile)) + this.highlightOrNothin() +  ' Closing: ' + reason );
    // if ( fileSystemChecks(this.dnafile )  == true ) {
    // this.popAndPollOrBust(`failed filesystem checks`);
    // } else {
    // }
    // this.touchLockAndStartStream();
    var that = this;
    setTimeout( () => {
      that.prepareState(`chompsky ` + ( this.test ? 'test mode' : 'dna mode' ) ); // <<<<-------------- THATS WHERE THE ACTION GOES
    }, this.raceDelay)
    // this.prepareState(`chompsky ` + ( this.test ? 'test mode' : 'dna mode' ) ); // <<<<-------------- THATS WHERE THE ACTION GOES

  }
  postRenderPoll(reason) { // renderLock on late, off early
    if ( reason === undefined) { this.error(`reason must be defined for postRenderPoll`) }
    output(chalk.inverse(`Finishing saving (${reason}), ${this.busy()} waiting on ${ this.storage() } ${ this.howMany } files to go.`));
    if ( this.renderLock !== true) { // re-entrancy filter
      output(chalk.bgRed("Not rendering (may halt), thread entered postRenderPoll: " + reason))
      return true
    }
    // if (this.test) { this.isDiskFinHTML = true }
    // try to avoid messing with globals of a already running render!
    // sort through and load a file into "nextFile"
    // if its the right this.extension go to sleep
    // check if all the disk is finished and if so change the locks
    // log(chalk.inverse( fixedWidth(24, this.justNameOfDNA))  + " postRenderPoll reason: " + reason);
    if ( this.isDiskFinLinear !== false && this.isDiskFinHilbert !== false  && this.isDiskFinHTML !== false ) {
      output(` [ storage threads ready: ${chalk.inverse( this.storage() )} ] test: ${this.test}`);
      this.setIsDiskBusy( false );
      this.openOutputs();

      if ( this.test ) {
        this.renderLock = false;
        this.runCycle()
      } else {

        this.removeLocks();
        this.resetAndPop(`Great success with render of (${this.justNameOfDNA}) but: ${this.busy()} ${this.storage()}`);

      }

    } else {
      output(` [ ${reason} wait on storage: ${chalk.inverse( this.storage() )}  ] `);
    }
  }
  getFilesizeInBytes(file) {
    try {
      const stats = fs.statSync(file)
      const fileSizeInBytes = stats.size
      return fileSizeInBytes
    } catch(err) {
      this.resetAndPop("File not found: " + file);
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
    let value = extensions.indexOf( this.getFileExtension(f) );
    if ( value < 0) {
      bugtxt(`checkFileExtension FAIL: ${f}  ${value} `);
      return false;
    } else {
      bugtxt(`checkFileExtension GREAT SUCCESS: ${f}  ${value} `);
      return true;
    }
  }

  quit(code, reason) {
    if ( reason === undefined) {
      if ( this !== undefined) {
        reason = this.status
      } else {
        reason = `not set`
      }
    }
    mode('quit ' + reason);
    // this.calcUpdate();
    isShuttingDown = true;
    if (code == undefined) { code = 0 } // dont terminate with 0
    log(`Received quit(${code}) ${reason}`);
    if ( this.isDiskFinLinear && this.isDiskFinHilbert && this.isDiskFinHTML) {
      if ( this.renderLock == true ) {
        log("still rendering") // maybe this happens during gracefull shutdown
        return false;
      }
    } else {
      log("still saving to storage") // maybe this happens during gracefull shutdown
    }
    if (this.howMany > 0 ) {
      output(`There is more work (${this.howMany}) . Rendering: ${this.busy()} Load: ${os.loadavg()}`);
      if ( this.renderLock ) {
        return true;
      }
    }
    if (code == 0) {
      if (isElectron == true){
        output("Electron mode clean exit.")
      } else {
        output("CLI mode clean exit.")
      }
      if ( this.keyboard ) {
        destroyKeyboardUI();
      }

    } else {
      output(chalk.bgWhite.red (`process.exit going on. last file: ${ this.dnafile } currently: ${this.busy()} percent complete ${  this.percentComplete}`));
    }
    if (killServersOnQuit == true) {
      if (webserverEnabled == true) { // control-c kills server
        server.stop()
      }
    } else if (webserverEnabled == true) {
      log("If you get a lot of servers running, use Control-C instead of [Q] to issues a 'killall node' command to kill all of them")
    }
    if ( this.keyboard == true) {
      try {
        process.stdin.setRawMode(false);
        // process.stdin.resume();
      } catch(e) {  bugtxt( "Issue with keyboard this.mode: " + e ) }
    }
    term.eraseDisplayBelow();
    // this.printRadMessage([ ` ${(killServersOnQuit ?  'AminoSee has shutdown' : ' ' )}`, `${( this.verbose ?  ' Exit code: '+ code : '' )}`,  (killServersOnQuit == false ? server.getServerURL() : ' '), this.howMany ]);
    this.destroyProgress();
    process.exitCode = code;
    this.removeLocks();
    destroyKeyboardUI();

    if (code > 0) {
      setImmediate(() => {
        setTimeout( () => {
          process.stdout.write(`${code} ${reason}`)
          this.args._ = [];
          term.processExit(code);
          process.exit()
        }, this.raceDelay  * 2)
      })
    }

  }
  processLine(l) {
    // mode('process line')
    this.status = 'process line ' + this.howMany;
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
        codon =  ""; // we wipe it because... codons should not cross line break boundaries.
        column++;
        c = cleanChar(l.charAt(column)); // line breaks
        this.charClock++;
        this.errorClock++;
        this.red  = 0;
        this.green  = 0;
        this.blue  = 0;
        if (column > lineLength) {
          this.breakClock++;
          break
        }
      }
      codon += c; // add the base
      if (codon == "..." || codon == "NNN") {
        this.currentTriplet = codon;
        if (codon == "NNN" ) {
          // this.pepTable.find(isNoncoding).Histocount++;
          this.pepTable.find("Non-coding").Histocount++;
        }
        codon="";
        bugtxt( this.red + this.green + this.blue );
        if ( this.red + this.green + this.blue >0) { // this is a fade out to show headers.
          //  this.red  -= this.codonsPerPixel;
          //  this.green -= this.codonsPerPixel;
          //  this.blue -= this.codonsPerPixel;
          this.red--;
          this.green--;
          this.blue--;
          // this.paintPixel();
        } else {
          // do nothing this maybe a non-coding header section in the file.
          // this.status   = "header";
          //  this.msPerUpdate  = 100;
        }
        this.errorClock++;


      } else if (codon.length ==  3) {
        this.currentTriplet = codon;
        this.pixelStacking++;
        this.genomeSize++;
        this.codonRGBA =  this.codonToRGBA(codon); // this will this.report this.alpha info
        this.brightness = this.codonRGBA[0] +  this.codonRGBA[1] +  this.codonRGBA[2] + this.codonRGBA[3];
        this.isHighlightCodon = false; // always false during regular render!
        let pixelGamma = 1; // normal render
        // output( this.isHighlightSet )
        // HIGHLIGHT codon --triplet Tryptophan
        if ( this.isHighlightSet ) {
          if (codon == this.triplet) { // this block is trying to decide if a) regular render b) highlight pixel c) darken pixel
            this.isHighlightCodon = true;
          } else if (this.aminoacid == this.peptide) {
            this.isHighlightCodon = true;
          }
          if (this.isHighlightCodon) {
            pixelGamma = this.highlightFactor * this.opacity;
          } else {
            pixelGamma = this.darkenFactor * this.opacity ;
          }
        } else {
          pixelGamma = this.opacity ;
        }
        this.mixRGBA[0] += parseFloat( this.codonRGBA[0].valueOf() * pixelGamma ); // * red
        this.mixRGBA[1] += parseFloat( this.codonRGBA[1].valueOf() * pixelGamma ); // * green
        this.mixRGBA[2] += parseFloat( this.codonRGBA[2].valueOf() * pixelGamma ); // * blue
        this.mixRGBA[3] += 255 * pixelGamma; // * full opacity


        if (this.isHighlightCodon && !this.isHighlightSet) {
          this.mixRGBA[3] += 255 * pixelGamma; // * full opacity
        } else {
          this.mixRGBA[3] += 64 * pixelGamma;// image is mostly transparent because you see through 21 layers!
        }






        //  blends colour on one pixel
        if ( this.pixelStacking >= this.codonsPerPixel) {


          if ( this.artistic != true) { // REGULAR MODE


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

  aminoFilenameIndex(id) { // return the this.dnafile for this amino acid for the report
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
    t += `_${ this.ratio }`;
    this.artistic ? t += "_artistic" : t += "_sci"
    this.reg == true ? t += "_reg" : t += ""  // registration marks
    return t;
  }


  htmlTemplate(histogramJson) {
    // let histogramJson;
    if (histogramJson == undefined) {
      histogramJson = this.getRenderObject();
      // ;
    }
    var html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8"/>
    <head>
    <title>${ this.justNameOfDNA} :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson :: ${ this.currentFile }</title>
    <meta name="description" content="${ siteDescription }">
    <link rel="stylesheet" type="text/css" href="https://dev.funk.co.nz/aminosee/public/AminoSee.css">
    <link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
    <link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
    <link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet">
    <!-- ////////////////////////////////////////
    ${radMessage}
    -->

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
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-P8JX');</script>
    <!-- End Google Tag Manager -->

    <nav style="position: fixed; top: 8px; left: 8px; z-index:9999; background-color: #123456;"> <a href="../../" class="button">AminoSee Home</a> | <a href="../" class="button">Parent</a>  </nav>

    <h1>AminoSee DNA Render Summary for ${ this.currentFile }</h1>
    <h2>${ this.justNameOfDNA}</h2>
    ${( this.test ? " this.test " : this.imageStack( histogramJson ))}



    <a href="#scrollLINEAR" class="button" title"Click To Scroll Down To See LINEAR"><br />
    <img width="128" height="128" style="border: 4px black; background: black;" src="images/${ this.justNameOfPNG}">
    1D Linear Map Image
    </a>
    <a href="#scrollHILBERT" class="button" title"Click To Scroll Down To See 2D Hilbert Map"><br />
    <img width="128" height="128" style="border: 4px black background: black;" src="images/${ this.justNameOfHILBERT}">
    2D Hilbert Map Image
    </a>



    <div id="monkeys">


    <div id="render_summary" style="text-align: right; float: right;">
    <h2>Render Summary</h2>
    <div class="fineprint">
    <pre>
    ${ this.renderObjToString( histogramJson )}
    </pre>
    </div>
    </div>


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
    http://localhost:4321/aminosee/output/50KB_TestPattern/50KB_TestPattern.txt_linear__Reference_c1_sci.png
    <table>
    <thead>
    <tr>
    <th>Amino Acid</th>
    <th>Hue&#xB0;</th>
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
    </tr>`;
    // this.pepTable   = [Codon, Description, Hue, Alpha, Histocount]
    for (let i = 0; i < this.pepTable.length; i++) {
      let thePep = this.pepTable[i].Codon;
      let theHue = this.pepTable[i].Hue;
      let c =      hsvToRgb( theHue / 360, 0.5, 1.0 );
      let richC = hsvToRgb( theHue / 360, 0.95, 0.75 );
      let imghil = this.aminoFilenameIndex(i)[0]; // first elemewnt in array is the hilbert image
      let imglin = this.aminoFilenameIndex(i)[1]; // second element is linear

      if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
        html += `<!-- ${thePep} -->`;
      } else {
        html += `
        <tr style="background-color: hsl( ${theHue} , 50%, 100%);" onmouseover="mover(${i})" onmouseout="mout(${i})">
        <td style="background-color: white;"> ${ this.pepTable[i].Codon} </td>
        <td style="background-color: rgb(${richC});"><p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${theHue}&#xB0;</p></td>
        <td style="background-color: rgb(${c}); color: black; font-weight: bold; "> <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${c}</p></td>
        <td>${ this.pepTable[i].Histocount.toLocaleString()}</td>
        <td>${ this.pepTable[i].Description}</td>
        <td style="background-color: white;"><a href="images/${ imghil }" class="button" title="Amino filter: ${ thePep }"><img width="48" height="16" class="blackback" src="images/${ imghil }" alt="${ this.justNameOfDNA } ${ thePep }"></a></td>
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
    bugtxt("checkLocks RUNNING: " + fullPathOfLockFile);
    if ( this.force == true) {
      bugtxt("Not checking locks - this.force mode enabled.");
      return false;
    }
    try {
      fs.lstatSync(fullPathOfLockFile).isDirectory();
      log('locked')
      return true;
    } catch(e){
      bugtxt("No lockfile found - proceeding to render" );
      return false;
    }
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
  recycleHistogram(histoURL, cb) {
    log("FETCH");
    fetch( histoURL )
    .then(response => response.json())
    .then(histogramJson => {
      log(`histogramJson [ ${histogramJson} ]`);
      if ( cb !== undefined) { cb() }
    }).catch();
  }
  recycleOldImage(pngfile) {
    mode(`RECYCLING ${ this.justNameOfDNA }`)

    recycleHistogram( path.resolve( generateFilenameHistogram() ))
    output(`recycled json`);

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
      // this.prepareState(`recycle fail`);
      this.pollForStream(`recycle fail`)
      return false;
    }
  }

  skipExistingFile (fizzle) { // skip the file if TRUE render it if FALSE
    if ( this.force == true && this.currentFile == funknzlabel ) {  return true; } // true means to skip render
    let result = doesFileExist(fizzle) ;
    bugtxt('skipExistingFile ' + fizzle + "force: " + this.force + " result: " + result)
    bugtxt(`The file is: ${fizzle} which ${( result ? 'DOES' : 'does NOT')} exist`)
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


  calculateShrinkage() { // danger: can change this.file of Hilbert images!

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
      this.magnitude = 'custom'
      this.dimension = this.magnitude; // users choice over ride all this nonsense
      output(`Ideal magnitude: ${computerWants} using custom magnitude: ${ this.dimension }`);
    } else {
      this.magnitude = 'auto';
      log(`Ideal magnitude: ${computerWants} using auto-magnitude: ${ this.dimension }`);
    }

    let hilpix = hilbPixels[ this.dimension ];;
    this.hilbertImage = [hilpix*4];
    this.shrinkFactor = linearpix / hilpix;//  array.length / 4;
    this.codonsPerPixelHILBERT = this.codonsPerPixel /  this.shrinkFactor;
    log(`Linear pix: ${linearpix.toLocaleString()} > reduction: X${  this.shrinkFactor } = ${hilbPixels[ this.dimension ].toLocaleString()} pixels ${ this.dimension }th this.dimension hilbert curve`);
    this.codonsPerPixelHILBERT = this.codonsPerPixel* this.shrinkFactor;
    this.fileHILBERT = `${ this.outputPath }/${ this.justNameOfDNA}/images/${ this.generateFilenameHilbert() }`;

    bugtxt(` this.shrinkFactor pre ${  this.shrinkFactor } = linearpix ${linearpix } /  hilpix ${hilpix}  `);
    bugtxt(`this.fileHILBERT after shrinking: ${ this.fileHILBERT } this.dimension: ${ this.dimension }  this.shrinkFactor post ${ twosigbitsTolocale( this.shrinkFactor)} this.codonsPerPixel ${ this.codonsPerPixel } this.codonsPerPixelHILBERT ${ this.codonsPerPixelHILBERT }`);
  }


  // resample the large 760px wide linear image into a smaller square hilbert curve
  saveHilbert(cb) {
    mode('maybe save hilbert');
    if ( this.renderLock == false ) { this.error('locks should be on during hilbert curve') }
    if ( this.isHilbertPossible  == true ) {
      log("projecting linear array to 2D hilbert curve");
      this.isDiskFinHilbert = false; // concurrency protection
    } else {
      log("Cant output hilbert image when using artistic mode");
      this.isDiskFinHilbert = true; // doesnt trigger a re-poll.
      // hilbertFinished();
      cb();
      return false;
    }
    this.setupHilbertFilenames();
    // if ( this.skipExistingFile( this.fileHILBERT) == true ) {
    //   output("Existing hilbert image found - skipping projection: " + this.fileHILBERT);
    //   if ( this.openImage) {
    //     bugtxt('opening');
    //     this.openOutputs();
    //   } else {
    //     log("Use --image to see this in default browser")
    //   }
    //   this.isDiskFinHilbert = true;
    //   this.previousImage = this.fileHILBERT;
    //   var closure = () => { return this.fileHILBERT }
    //   cb();
    //   return false;
    // }
    term.eraseDisplayBelow();
    mode('save hilbert');
    output(chalk.bgBlue.yellow( " Getting in touch with my man from 1891...   ॐ    David Hilbert    ॐ    " ));// In the " + this.dimension + "th dimension and reduced by " + threesigbitsTolocale( this.shrinkFactor) );
    bugtxt( this.justNameOfDNA);
    let hilpix = hilbPixels[ this.dimension ];
    this.resampleByFactor( this.shrinkFactor );
    let hWidth = Math.sqrt(hilpix);
    let hHeight  = hWidth;
    this.hilbertImage = [ hilpix ]; // wipe the memory
    this.percentComplete = 0;
    this.debugFreq = Math.round(hilpix / 100);
    this.progUpdate({ title: 'Hilbert Curve', items: this.howMany, syncMode: true })
    for (let i = 0; i < hilpix; i++) {
      if ( i % this.debugFreq == 0) {
        this.percentComplete = i/hilpix;
        this.progUpdate( this.percentComplete )
        redoLine(`Space filling ${nicePercent(this.percentComplete)} `);
      }

      let hilbX, hilbY;
      [hilbX, hilbY] = hilDecode(i, this.dimension, MyManHilbert);
      let cursorLinear  = 4 * i ;
      let hilbertLinear = 4 * ((hilbX % hWidth) + (hilbY * hWidth));
      this.percentComplete = i / hilpix;
      // if ((Math.round(  this.percentComplete * 1000) % 100) === 0) {
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
        bugtxt("BREAKING at positon ${i} due to ran out of source image. this.rgbArray.length  = ${rgbArray.length}");
        bugtxt(` @i ${i} `);
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
    let wstream = fs.createWriteStream( this.fileHILBERT);
    var that = this;
    new Promise(resolve => {
      hilbert_img_png.pack()
      .pipe(wstream)
      .on('finish', (err) => {
        that.hilbertFinished();
        if ( cb !== undefined ) { cb() }
      })
    }).then( out('Hilbert done') ).catch( out('.') );
  }
  htmlFinished() {
    this.isDiskFinHTML = true;
    mode(`HTML done. Waiting on (${ this.storage()})`);
    output( this.status )
    this.postRenderPoll('htmlFinished ' + this.fileHTML);
  }
  hilbertFinished() {
    mode(`Hilbert curve done. Waiting on (${ this.storage()})`);
    this.isDiskFinHilbert = true;
    termDrawImage(this.fileHILBERT, `hilbert curve`)
    setTimeout( () => {
      this.postRenderPoll('hilbertFinished ' + this.fileHILBERT);
    }, this.raceDelay)
  }

  linearFinished() {
    this.isDiskFinLinear = true;
    if ( this.artistic || this.quiet == false ) {
      this.previousImage = this.filePNG;
      // termDrawImage(this.previousImage, `linear finished`)
    }
    if ( this.test ) {
      mode(`Calibration linear generation done. Waiting on (${ this.storage()})`);
    } else {
      mode(`DNA linear render done. Waiting on (${ this.storage()})`);
    }
    this.postRenderPoll('linearFinished ' + this.filePNG);
  }

  bothKindsTestPattern( cb ) {
    if (this.renderLock == false) {
      this.error("error render lock fail in test patterns")
      return false;
    }
    let h = require('hilbert-2d');
    let hilpix = hilbPixels[ this.dimension ];
    const testWidth = Math.round(Math.sqrt(hilpix));
    const linearWidth = Math.round(Math.sqrt(hilpix));

    this.hilbertImage = [ hilpix*4 ]; // setup arrays
    this.rgbArray = [ hilpix*4 ];
    output( `Generating hilbert curve of the ${ this.dimension }th dimension out of: ${this.howMany}`);
    bugtxt( chalk.bgWhite(`Math.sqrt(hilpix): [${Math.sqrt(hilpix)}])`));
    bugtxt( this.fileHILBERT );

    this.percentComplete = 0;
    let d = Math.round(hilpix/100);
    for (let i = 0; i < hilpix; i++) {
      let hilbX, hilbY;
      [hilbX, hilbY] = hilDecode(i, this.dimension, h);
      let cursorLinear  = 4 * i ;
      let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth));
      this.percentComplete =  (i+1) / hilpix;
      this.dot(i, d, ' ॐ  ' + nicePercent(this.percentComplete));
      this.hilbertImage[hilbertLinear] =   255 * this.percentComplete; // slow ramp of  this.red
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



    // this.setIsDiskBusy( true );
    const hilbertImage = this.hilbertImage;
    const rgbArray = this.rgbArray;
    // this.saveDocsSync();

    var hilbert_img_data = Uint8ClampedArray.from( hilbertImage );
    var hilbert_img_png = new PNG({
      width: testWidth,
      height: testWidth,
      colorType: 6,
      bgColor: {
        red: 0,
        green: 0,
        blue: 0
      }
    })
    hilbert_img_png.data = Buffer.from( hilbert_img_data );
    let wstreamHILBERT = fs.createWriteStream( this.fileHILBERT );

    new Promise(resolve => {
      hilbert_img_png.pack()
      .pipe(wstreamHILBERT)
      .on('finish', (err, resolve) => {
        // if (err) { log(`not sure if that saved: ${err}`)}
        // if (resolve) { log(`not sure if that saved: ${err} ${ this.storage()} `) }
        // this.isDiskFinHilbert = true;
        this.hilbertFinished();
      })
    }).then(  ).catch( out('HILBERT catch') );
    // new Promise(resolve =>
    //   hilbert_img_png.pack()
    //   .pipe(wstreamHILBERT)
    //   .on('finish', resolve)
    // );
    var img_data = Uint8ClampedArray.from( rgbArray );
    var img_png = new PNG({
      width: testWidth,
      height: testWidth,
      colorType: 6,
      bgColor: {
        red: 0,
        green: 0,
        blue: 0
      }
    })
    img_png.data = Buffer.from( img_data );
    let wstreamLINEAR = fs.createWriteStream( this.filePNG );
    new Promise(resolve => {
      img_png.pack()
      .pipe(wstreamLINEAR)
      .on('finish', (err, resolve) => {
        // if (err) { log(`not sure if that saved: ${err}`)}
        // if (resolve) { log(`not sure if that saved: ${err} ${ this.storage()} `) }
        this.isDiskFinHTML = true;
        this.linearFinished()
        termDrawImage( this.filePNG, `linear curve` )
        if (cb !== undefined) { cb() }

      })
    }).then().catch();



    // new Promise(resolve =>
    //   img_png.pack()
    //   .pipe(wstreamLINEAR)
    //   .on('finish', resolve)
    // );

    // setTimeout( () => {
    //   this.isDiskFinHTML = true;
    //   this.linearFinished();
    //   this.hilbertFinished();
    //   if (cb !== undefined) { cb() }
    // }, 4000)
    //




  }
  saveLinearPNG(cb, filename, array) { // FAILED REFACTOR
    this.filePNG = this.dnafile;
    this.width = width;
    this.height = height;
    this.rgbArray = array;
    this.savePNG(cb)
  }
  savePNG(cb) {
    let pixels, height, width = 0;
    try {
      pixels = ( this.rgbArray.length / 4);
    }
    catch (err) {
      this.resetAndPop(`NOT ENOUGH PIXELS ${err}`);
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
      this.resetAndPop(`MEGA FAIL: TOO MANY ARRAY PIXELS NOT ENOUGH IMAGE SIZE: array pixels: ${pixels} <  width x height = ${width*height}`);
      return false;
    }
    var stringy = {
      file: this.filePNG,
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
    let wstream = fs.createWriteStream( this.filePNG );
    var that = this;
    let retProm =  new Promise((resolve) => {
      img_png.pack()
      .pipe(wstream)
      .on('finish', (err) => {
        if (err) { log(`Could not create write stream: ${ this.filePNG} due to ${err}`) }
        bugtxt("linear Save OK " +  that.storage());
        that.linearFinished();
      })
      resolve();
    }).then( bugtxt('LINEAR then') ).catch( bugtxt('LINEAR catch') );

    if ( cb !== undefined ) { cb() }
    return retProm;
  }
  openOutputs() {
    mode("open files "+ this.currentFile);
    // output( this.status );
    // output( this.status );
    if ( this.currentFile == funknzlabel ) { return false }
    if ( this.devmode == true )  { log( this.renderObjToString() ); }
    log( closeBrowser ); // tell user process maybe blocked
    bugtxt(` this.openHtml, this.openImage, this.openFileExplorer `, this.openHtml, this.openImage, this.openFileExplorer );
    if ( this.openFileExplorer === true) {
      output(`Opening render output folder in File Manager ${ this.outputPath }`);
      // bgOpen()
      open(this.outputPath, () => {
        this.opensFile++;
        log("file manager closed");
      }).catch(function () { log(`open(${ this.outputPath })`) });
    }


    if ( this.openHtml == true) {
      output(`Opening ${ this.justNameOfHTML} DNA render summary HTML report.`);
      this.opensHtml++;
      projectprefs.aminosee.opens++; // increment open counter.
      // open( server.getServerURL( this.justNameOfDNA), { wait: false } );
      if (openLocalHtml == true) {
        open( this.fileHTML, {wait: false}).then(() => {
          log("browser closed");
        }).catch(function () {  this.error(`open( ${this.fileHTML} )`)});
      } else {
        open( url + this.justNameOfDNA + `/main.html`, {app: 'firefox', wait: false}).then(() => {
          log("browser closed");
        }).catch(function () {  this.error("open( this.fileHTML)")});

      }
    } else {
      log(`Not opening HTML`)
    }
    if ( this.isHilbertPossible  === true && this.openImage === true) {
      log(`Opening ${ this.justNameOfHILBERT} 2D hilbert space-filling image.`);
      this.opensImage++;
      projectprefs.aminosee.opens++; // increment open counter.
      open( this.fileHILBERT).then(() => {
        log("hilbert image closed");
      }).catch(function () {  this.error("open( this.fileHILBERT)") });
    } else if ( this.openImage === true) { // open the linear if there is no hilbert, for art mode
      output(`Opening ${ this.justNameOfPNG} 1D linear projection image.`);
      this.opensImage++;
      projectprefs.aminosee.opens++; // increment open counter.
      open( this.filePNG ).then(() => {
        log("regular png image closed");
      }).catch(function () {  this.error("open( this.filePNG )") });
    } else {
      log(`Use --html or --image to automatically open files after render, and "aminosee demo" to generate this.test pattern and download a 1 MB DNA file from aminosee.funk.nz`)
      log(`values of this.openHtml ${ this.openHtml }   this.openImage ${ this.openImage}`);
    }
    if ( this.opensFile > 3) { // notice the s
      log('i figured that was enough windows, will not open more windows')
      this.openFileExplorer = false;
      return false;
    }
    if ( this.opensImage > 3) {
      log('i figured that was enough windows, will not open more windows')
      this.openImage = false;
      return false;
    }
    if ( this.opensHtml > 3) {
      log('i figured that was enough windows, will not open more windows')
      this.openHtml = false;
      return false;
    }
    if ( opens == 0 ) {
      log(`not opening ${opens} times`)
    } else {
      log(`opening ${opens} times`)
    }
  }

  getRegmarks() {
    return ( this.reg == true ? "_reg" : "" )
  }
  mkdir(relative, cb) { // returns true if a fresh dir was created
    if ( relative === undefined) { relative = ''}
    let dir2make = path.resolve( `${ this.outputPath }/${relative}` );
    if ( doesFolderExist(this.outputPath) == false ) {
      try {
        fs.mkdirSync(this.outputPath, function (err, result) {
          if (result) { log(`Success: ${result}`) }
          if (err) { log(`Could not create output folder: ${relative} ${err}`) }
        });
      } catch(e) {
        bugtxt(`Error creating folder: ${e} at location: ${dir2make}`)
        this.error(`Quiting due to lack of permissions in this directory [${ this.outputPath }] `);
      }
    }
    if ( doesFolderExist(dir2make) === false ) {
      log(`Creating fresh directory: ${dir2make}`);
      try {
        fs.mkdirSync(dir2make, function (err, result) {
          if (result) { log(`Success: ${result}`) }
          if (err) {  this.error(`Fail: ${err}`) }
          if ( cb !== undefined ) { cb() }
        });
      } catch(e) { bugtxt(`${e} This is normal`); if ( cb !== undefined ) { cb() } }
      return true; // true because its first run
    } else {
      bugtxt(`Directory ${ relative } already exists - This is normal.`)
      if ( cb !== undefined ) { cb() }
      return false;
    }
  }

  generateTestPatterns(cb) {
    this.howMany = this.dimension;
    this.openHtml = false;
    this.report = false;
    this.test = true;
    this.updates = true;
    this.pngImageFlags = "_test_pattern";

    this.setupProject()

    // if ( this.magnitude == "auto") {
    //
    //   this.dimension = defaultMagnitude;
    // }
    if ( this.args.ratio || this.args.r) {
      log("Looks better with --ratio=square in my humble opinion")
    } else {
      this.ratio = "sqr";
    }

    output("output test patterns to /calibration/ folder. dnafile: " + this.dnafile ) ;
    this.mkdir('calibration');
    if ( this.howMany < 0 ) { this.quit(0); return false;}
    if ( this.dimension > 10 ) { log(`I think this will crash node, only one way to find out!`); }
    output(`TEST PATTERNS GENERATION    m${ this.dimension} c${ this.codonsPerPixel }`);
    log("Use -m to try different dimensions. -m 9 requires 1.8 GB RAM");
    log("Use --no-reg to remove registration marks at 0%, 25%, 50%, 75%, 100%. It looks a little cleaner without them ");
    bugtxt(`pix      ${hilbPixels[ this.dimension]} `);

    this.loopCounter = 0; // THIS REPLACES THE FOR LOOP, INCREMENET BY ONE EACH FUNCTION CALL AND USE IF.
    this.howMany =  this.dimension;// - this.loopCounter;
    if ( cb !== undefined ) {
      this.runCycle(cb); // runs in a callback loop
    } else {
      this.runCycle(); // runs in a callback loop
    }
  }
  runCycle(cb) {
    if (this.renderLock == true) {
      this.error(`Thread re-entered runCycle ${this.loopCounter}`)
      return false;
    }
    this.loopCounter++
    this.howMany--;
    if (this.loopCounter+1 >  this.dimension) {
      this.testStop();
      // this.saveHTML(this.openOutputs);
      // termDrawImage();
      if ( cb !== undefined ) { cb() }
      // this.quit(0);
      return false;
    }
    output('test cycle ' + this.loopCounter);
    this.testInit ( this.loopCounter ); // will enable locks

    // let closure = function ()  { log('closure'); return this.runCycle(cb) }
    let that = this;

    // both kinds is currently making it's own calls to postRenderPoll
    this.bothKindsTestPattern(() => { // renderLock must be true
      this.setIsDiskBusy( true )
      // this.saveDocsSync();
      // that.isDiskFinHTML = true;
      // this.renderLock = false;
      output(`test patterns returned`)
      // that.runCycle(cb)
      // closure();
      // this.postRenderPoll(`test patterns returned`);
      // if ( cb ) { cb() }
    }); // <<--------- sets up both linear and hilbert arrays but only saves the Hilbert.
    return true;
  }
  async testPromise() {
    let teethPromise = brushTeeth();
    let tempPromise = getRoomTemperature();

    // Change clothes based on room temperature
    var clothesPromise = tempPromise.then(function(temp) {
      // Assume `changeClothes` also returns a Promise
      if(temp > 20) {
        return changeClothes("warm");
      } else {
        return changeClothes("cold");
      }
    });
    /* Note that clothesPromise resolves to the result of `changeClothes`
    due to Promise "chaining" magic. */

    // Combine promises and await them both
    await Promise.all(teethPromise, clothesPromise);
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
    this.fileHTML    = testPath + "/" + this.justNameOfDNA + ".html";
    this.filePNG     = testPath + "/" + this.justNameOfPNG;
    this.fileHILBERT = testPath + "/" + this.justNameOfHILBERT;
    this.fileTouch   = testPath + "/" + this.justNameOfDNA + "_LOCK.touch";
    this.dnafile = this.justNameOfDNA;
    this.currentFile = this.justNameOfDNA;
    this.baseChars = hilbPixels[  magnitude ];
    this.maxpix = hilbPixels[defaultMagnitude];
    this.genomeSize =  this.baseChars;
    this.estimatedPixels =  this.baseChars;
    this.charClock =  this.baseChars;
    this.pixelClock =  this.baseChars;
    this.setIsDiskBusy( false )
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
  resampleByFactor( shrinkX ) {
    this.shrinkFactor = shrinkX;
    let sampleClock = 0;
    let brightness = 1/ shrinkX;
    let downsampleSize = hilbPixels[ this.dimension ]; // 2X over sampling high grade y'all!
    let antiAliasArray = [ downsampleSize  * 4 ]; // RGBA needs 4 cells per pixel
    log(`Resampling linear image of size in pixels ${this.pixelClock.toLocaleString()} by the factor ${ twosigbitsTolocale( shrinkX)}X brightness per amino acid ${brightness} destination hilbert curve pixels ${downsampleSize.toLocaleString()} `);
    this.debugFreq = Math.round(downsampleSize/100);
    // SHRINK LINEAR IMAGE:
    this.progUpdate({ title: 'Resample by X' + shrinkX, items: this.howMany, syncMode: true })
    for (let z = 0; z<downsampleSize; z++) { // 2x AA this.pixelClock is the number of pixels in linear
      if ( z % this.debugFreq == 0) {
        this.percentComplete = z/downsampleSize;
        this.progUpdate(  this.percentComplete )
      }
      let sum = z*4;
      let clk = sampleClock*4; // starts on 0
      antiAliasArray[sum+0] = this.rgbArray[clk+0]*brightness;
      antiAliasArray[sum+1] = this.rgbArray[clk+1]*brightness;
      antiAliasArray[sum+2] = this.rgbArray[clk+2]*brightness;
      antiAliasArray[sum+3] = this.rgbArray[clk+3]*brightness;
      this.dot(z, this.debugFreq, `z: ${z.toLocaleString()}/${downsampleSize.toLocaleString()} samples remain: ${( this.pixelClock - sampleClock).toLocaleString()}`);
      while(sampleClock  < z* shrinkX) {
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
  optimumDimension (pix) { // give it pix it returns a  this.dimension that fits inside it
    let dim = 0;
    let rtxt = `[HILBERT] Calculating largest Hilbert curve image that can fit inside ${ twosigbitsTolocale(pix)} pixels, and over sampling factor of ${overSampleFactor}: `;
    while (pix > (hilbPixels[dim] * overSampleFactor)) {
      // rtxt += ` dim ${dim}: ${hilbPixels[dim]} `;
      if (dim % 666 == 0 && dim > 666) {
        // rtxt+= (`ERROR this.optimumDimension  [${hilbPixels[dim]}] pix ${pix} dim ${dim} `);
      }
      if (dim > defaultMagnitude) {
        if (  this.dimension && dim > theoreticalMaxMagnitude ) {
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

    rtxt+= ` <<<--- chosen  this.dimension: ${dim} `;
    bugtxt(rtxt);
    if (this.devmode == true) { bugtxt(rtxt) }
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
  error(err) {
    mode(`Error: [${err}] ${this.justNameOfDNA} ${this.busy()}`)
    if ( this.quiet == false ) {
      output();
      output( chalk.bgRed( this.status  + ' /  this.error start {{{ ----------- ' + chalk.inverse( err.toString() ) + ' ----------- }}} end. Not rendering (may halt), thread entered postRenderPoll: ${reason}'))
      output();
    }
    if ( debug ) {
      throw new Error(err)
      // process.exit();
    }
  }

  clout(txt) {
    if (txt == undefined) {
      txt = " ";
      return false;
    }
    if (txt.substring(0,5) == ' this.error' &&  !this.quiet) {
      console.warn(`[ ${txt} ] `);
    } else {
      log( chalk.rgb( this.red, this.green, this.blue )(`[ `) + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(` ]`));
      // redoLine( chalk.rgb( this.red, this.green, this.blue )(`[ `) + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(` ]`));
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
    returnText += terminalRGB(`  ah-mee-no-see     'I See It Now - I AminoSee it!'   ${array[4]}`, 255, 180,  90);
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
    while ( array.length < 9 ) {
      array.push("    ________");
    }
    let radMargin = this.termMarginLeft;
    if ( this.renderLock == false) { radMargin = 3; }
    term.eraseLine();
    // output();term.eraseLine();
    output( terminalRGB(array[0], 200, 32,   32) ); term.eraseLine();
    term.right(radMargin);
    if ( term.width > wideScreen ) {
      output( terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${array[1]}`, 255, 60,  250) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${array[2]}`, 170, 150, 255) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${array[3]}`, 128, 240, 240) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${array[4]}`, 225, 225, 130) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`  ah-mee-no-see     'I See It Now - I AminoSee it!'   ${array[5]}`, 255, 180,  90) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`   ${ this.prettyDate()}   v${version} ${array[6]}`          , 220, 120,  70) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(array[7], 200, 105,   60) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(array[8], 200, 32,   32) ); term.eraseLine();
    } else {
      output( terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐ ${array[1]}`, 255, 60,  250) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤  ${array[2]}`, 170, 150, 255) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘ ${array[3]}`, 128, 240, 240) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(` by Tom Atkinson       ${array[4]}`, 225, 225, 130) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`  ah-mee-no-see        ${array[5]}`, 255, 180,  90) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(`${ this.prettyDate()} v${version} ${array[6]} `, 220, 120,  70) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(array[7], 200, 105,   60) ); term.right(radMargin); term.eraseLine();
      output( terminalRGB(array[8], 200, 32,   32) ); term.eraseLine();
    }

    // term.right(radMargin);
    // output(); term.right(radMargin); term.eraseLine();
  }


  fastUpdate() {

    this.present = new Date().getTime();
    this.runningDuration = ( this.present - this.started) + 1; // avoid division by zero
    this.msElapsed  = deresSeconds( this.runningDuration); // ??!! ah i see


    if ( this.charClock == 0 ||  this.baseChars == 0) {
      this.percentComplete = 0.01;//(( this.charClock+1) / ( this.baseChars+1)); // avoid div by zero below a lot
    } else {
      this.percentComplete = this.charClock /  this.baseChars; // avoid div by zero below a lot
    }
    if (this.isStorageBusy == true) { // render just finished so make percent 100% etc
      this.percentComplete = 1;
    }
    if (  this.percentComplete > 1) {
      bugtxt(`percentComplete is over 1: ${  this.percentComplete} `)
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
    let msg = `${ nicePercent(this.percentComplete)} remain ${humanizeDuration( this.timeRemain)} `
    if ( isShuttingDown ) {
      msg += " SHUTTING DOWN "
    } else {
      wTitle(msg);
    }
    output(msg)
  }

  getHistoCount(item, index) {
    return [ item.Codon, item.Histocount];
  }
  formatMs(date) { // nice ms output
    return  deresSeconds(date.getTime()) -  this.now.getTime();
  }


  drawProgress() {
    this.fastUpdate();
    progato.update(  this.percentComplete ) ;

    if (this.howMany >= 0 ) {
      clearTimeout( this.progTimer)
      this.progTimer = setTimeout(() => {
        if (  this.percentComplete < 0.99 &&  this.timeRemain > 2001) {
          this.drawProgress();
          // electron.updatePercent( this.percentComplete )
        } else {
          progato.stop();
        }
      }, 500);
    }
  }



  drawHistogram() {
    if ( this.updatesTimer) { clearTimeout( this.updatesTimer )};
    if ( this.renderLock == false ) { log("render lock failed inside drawHistogram"); this.rawDNA = "!"; return false; }
    if ( this.updateProgress == true) {  this.fastUpdate(); this.progUpdate( this.percentComplete ); }
    if ( !this.updates ) { bugtxt("updates disabled"); return false; }
    // let tb = new term.TextBuffer( )
    // let textBuffer = "";
    // let abc = this.pepTable.map(getHistoCount).entries();
    this.calcUpdate();
    this.debugColumns = this.setDebugCols(); // Math.round(term.width / 3);
    termSize();
    let text = " ";
    let aacdata = [];

    for (let h=0;h< this.pepTable.length;h++) {       // OPTIMISE i should not be creating a new array each frame!
      aacdata[ this.pepTable[h].Codon] = this.pepTable[h].Histocount ;
    }
    let array = [
      `Load: ${ this.loadAverages()}     Files: ${this.howMany}`,
      `| File: ${chalk.bgWhite.inverse( fixedWidth(40, this.justNameOfDNA))}.${ this.extension } ${chalk.inverse( this.highlightOrNothin())}`,
      `| i@${ fixedWidth(10, this.charClock.toLocaleString())} Breaks:${ fixedWidth(6, this.breakClock.toLocaleString())} Filesize:${ fixedWidth(7, bytes(  this.baseChars ))}`,
      `| Next update:${ fixedWidth(6,  this.msPerUpdate .toLocaleString())}ms Codon Opacity: ${ twosigbitsTolocale( this.opacity *100)}%`,
      `| CPU: ${ fixedWidth(10, bytes( this.bytesPerMs*1000))}/s ${ fixedWidth(5, this.codonsPerSec.toLocaleString())}K acids/s`,
      `| Next file >>> ${maxWidth(24, this.nextFile)}`,
      `| Codons:${ fixedWidth(14, " " +  this.genomeSize.toLocaleString())} Pixels:${ fixedWidth(10, " " + this.pixelClock.toLocaleString())} Last Acid: ${chalk.inverse.rgb(ceiling( this.red ), ceiling( this.green ), ceiling( this.blue )).bgWhite.bold( fixedWidth(16, "  " + this.aminoacid + "   ") ) } Host: ${hostname}`,
      `  Sample: ${ fixedWidth(60, this.rawDNA) } ${ this.showFlags()}`,
      `  RunID: ${chalk.rgb(128, 0, 0).bgWhite( this.timestamp )} acids per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )}`
    ];
    if ( this.clear == true) {
      term.up( this.termStatsHeight);
    } else {
      log('nc')
    }
    // clearCheck();

    if ( this.dnabg  == true) {
      if ( this.clear == true) {
        term.moveTo(1,1);
      }
      this.rawDNA = this.rawDNA.substring(0, termPixels);
      output(chalk.inverse.grey.bgBlack( this.rawDNA) );
      // term.up(rawDNA.length/term.width);
      // if ( this.clear== true) {
      term.moveTo(1 + this.termMarginLeft,1);
      output(`     To disable real-time DNA background use any of --no-dnabg --no-updates --quiet -q  (${tx},${ty})`);
      // }
    }
    this.rawDNA = funknzlabel;
    term.moveTo(1 + this.termMarginLeft,1 + this.termMarginTop);
    this.printRadMessage(array);
    // term.right( this.termMarginLeft );
    output(`Done: ${chalk.rgb(128, 255, 128).inverse( nicePercent(this.percentComplete) )} Elapsed: ${ fixedWidth(12, humanizeDuration( this.msElapsed )) } Remain: ${humanizeDuration( this.timeRemain)}`);
    output(`${ twosigbitsTolocale( gbprocessed )} GB All time total on ${chalk.yellow(hostname)} ${ cliruns.toLocaleString()} jobs run total`);
    this.progUpdate( this.percentComplete );
    output(`Report URL: ${chalk.underline( this.fullURL )}`)
    term.down(1);
    term.right( this.termMarginLeft );
    output();
    if (term.height > this.termStatsHeight + this.termDisplayHeight) {
      output(histogram(aacdata, { bar: '/', width: this.debugColumns*2, sort: true, map: aacdata.Histocount} ));
      output();
      output();
      if (this.keyboard) {
        output(interactiveKeysGuide);
      }
      output();
      // term.up(5);
      // log(`Last red: ${ this.peakRed } Last  green : ${ this.peakGreen } Last  blue : ${ this.peakBlue }`)
      // term.up(this.termDisplayHeight - 2)
    } else {
      output();
      output(chalk.italic(`Increase the height of your terminal for realtime histogram. Genome size: ${ this.genomeSize}`));
      output();
    }

    if ( this.renderLock == true && this.howMany >= 0 ) { // dont update if not rendering
      if ( this.msPerUpdate  <  this.maxMsPerUpdate ) {
        this.msPerUpdate  += 100; // this.updates will slow over time on big jobs
        if (this.devmode == true) {
          this.msPerUpdate  += 100; // this.updates will slow over time on big jobs
          if (this.debug == true) {
            this.msPerUpdate  += 100;
          }
        }
      }
      this.updatesTimer = setTimeout(() => {
        if ( this.renderLock == true && this.howMany >= 0 ) { // this.status   == "stream") { // || this.updates) {
          this.drawHistogram(); // MAKE THE HISTOGRAM AGAIN LATER
        }
      },  this.msPerUpdate );
      bugtxt("drawing again in " +  this.msPerUpdate )
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
    isNormalTriplet(normaltrip) {
      return dnaTriplets => dnaTriplets.DNA.toUpperCase() === normaltrip.toUpperCase();
    }

    tidyTripletName(str) {
      for ( let i =0; i < dnaTriplets.length; i++) {
        if ( spaceTo_( dnaTriplets[i].DNA.toUpperCase() ) == spaceTo_( str.toUpperCase() ) ) {
          return dnaTriplets[i].DNA
        }
      }
      return "none";
    }

    tripletToCodon(str) {
      this.currentTriplet = str;
      return dnaTriplets.find( this.isTriplet).DNA;
    }
    tripletToHue(str) {
      console.warn(str);
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
    // take 3 letters, convert into a Uint8ClampedArray with 4 items


    codonToRGBA(cod) {
      // STOP CODONS are hard coded as   index 24 in this.pepTable array       "Description": "One of Opal, Ochre, or Amber",
      // START CODONS are hard coded as  ndex 23 in this.pepTable array       "Description": "Count of Methionine",
      // Non-coding NNN this.triplets are hard coded as index 0 in this.pepTable array
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
              // bugtxt(`codon index for ${ fixedWidth(20, this.aminoacid)} is ${getCodonIndex(this.aminoacid)} or acidesc = ${acidesc}`)
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

          let hue = dnaTriplets[z].Hue / 360;
          let tempcolor = hsvToRgb(hue, 1, 1);
          //  this.red ,  this.green ,  this.blue , ALPHA
          this.red    = tempcolor[0];
          this.green  = tempcolor[1];
          this.blue   = tempcolor[2];

          if ( this.isHighlightSet ) {

            if (this.aminoacid == this.peptide ) {
              this.alpha = 255;
              // log(`isHighlightSet    ${ this.isHighlightSet}   this.aminoacid ${this.aminoacid}
            } else {
              this.alpha = 32; // non highlight alpha makes them almost fully translucent
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







    // stream.pipe(tr).pipe(process.stdout);
    /** https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js/26038979
    * Look ma, it's cp -R.
    * @param {string} src The path to the thing to copy.
    * @param {string} dest The path to the new copy.
    */
    // copyRecursiveSync(src, dest) {
    //   log(`Will try to recursive copy from ${src} to ${dest}`)
    //   var exists = doesFileExist(src);
    //   var stats = exists && fs.statSync(src);
    //   var isDirectory = exists && stats.isDirectory();
    //   var existsDest = doesFileExist(dest);
    //   if (existsDest) {
    //     log(`Remove the ${dest} folder or file, then I can rebuild the web-server`);
    //     return false;
    //   }
    //   if (exists && isDirectory) {
    //     var exists = doesFileExist(dest);
    //     if (exists) {
    //       log("Remove the /public/ folder and also /index.html, then I can rebuild the web-server");
    //       return false;
    //     } else {
    //       fs.mkdirSync(dest);
    //     }
    //     fs.readdirSync(src).forEach(function(childItemName) {
    //       log(childItemName);
    //       copyRecursiveSync(path.join(src, childItemName),
    //       path.join(dest, childItemName));
    //     });
    //   } else {
    //     fs.linkSync(src, dest);
    //   }
    // };


    imageStack(histogramJson) {
      mode('imageStack')
      let html = " ";
      let summary = histogramJson.summary;
      let pepTable = histogramJson.pepTable;
      let name = summary.name;
      // let refimage = summary.refimage;
      // let linearimage = summary.linearimage;
      // let i = -1;
      let quant = pepTable.length; // Ω first command ॐ
      //   <li>Ω <a href="images/${refimage}">Reference (combined image) <br/>
      //  <img src="images/${refimage}" id="stack_reference" width="20%" height="20%" style="z-index: ${i}; position: fixed; top: 50%; left: 50%; transform: translate(${(i*4)-40},${(i*4)-40})" alt="${name} Reference image" title="${name} Reference image" onmouseover="mover(this)" onmouseout="mout(this)"></a></li>
      html += `<ul id="stackOimages">
      `;

      histogramJson.pepTable.forEach(function(item) {
        // log(item.toString());
        let thePep = item.Codon;
        let theHue = item.Hue;
        let c =      hsvToRgb( theHue/360, 0.5, 1.0 );
        let z =      item.z;
        let i =      item.index + 1;

        let linear_master =    item.src;
        let hilbert_master =    item.src;
        let linear_preview =    item.src;
        let hilerbt_preview =    item.src;

        // this.pepTable[h].hilbert_master = this.aminoFilenameIndex(h)[0];
        // this.pepTable[h].linear_master = this.aminoFilenameIndex(h)[1];
        // this.pepTable[h].hilbert_preview = this.aminoFilenameIndex(h)[0];
        // this.pepTable[h].linear_preview = this.aminoFilenameIndex(h)[1];

        let vector = i - (quant/2);
        let zoom = 3;
        // bugtxt( src );
        html +=  i +". ";
        if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
          html += `<!-- ${thePep.Codon} -->`;
        } else {
          html += `
          <li>${i} <a href="images/${src}" title="${name} ${thePep}">${thePep} <br/>
          <img src="images/${src}" id="stack_${i}" width="20%" height="20%" style="z-index: ${i}; position: fixed; z-index: ${i}; top: 50%; left: 50%; transform: translate(${(i*zoom)-100}px,${(i*zoom)-100}px)" alt="${name} ${thePep}" title="${name} ${thePep}" onmouseover="mover(${i})" onmouseout="mout(${i})"></a></li>
          `;
        }
      });
      html += `</ul> <!-- END stackOimages MA man -->`;
      return html;
    }
    output(txt) { // console out
      output("WRONG " + txt);
    }
  } // <<< --- END OF CLASS

  function bugtxt(txt) { // full this.debug output
    if (this !== undefined) {
      if (this.quiet == false && this.debug == true && this.devmode == true && this.verbose == true)  {
        bugout(txt);
      } else {
        if (this.verbose == true ) {
          // redoLine(txt);
        }
      }
    } else if (cliInstance !== undefined) {
      if (cliInstance.quiet == false && cliInstance.debug == true && cliInstance.devmode == true && cliInstance.verbose == true)  {
        bugout(txt);
      } else {
        if (cliInstance.verbose == true ) {
          // redoLine(txt);
        }
      }
    } else if (debug == true){
      log(txt)
    } else {
      // redoLine(txt)
    }

  }
  function output(txt) {
    if (txt == undefined) { txt = " "}
    // console.log('refusing');
    // return false;
    // if (debug && this !== undefined) {
    // bugout(txt)
    // } else {
    term.eraseLine();
    console.log( txt );
    term.eraseLine();
    // }
    wTitle( txt )
  }
  function out(txt) {
    let that = gimmeDat();
    if ( that.quiet == false || debug ) {
      process.stdout.write(chalk.blue(` [ `) + txt + chalk.blue(` ] `))
    }
  }
  function log(txt) {
    if (this !== undefined) {
      if (this.quiet == false && this.devmode == true && this.verbose == true ) {
        // output( fixedWidth(69, `devmode log: [${txt}] `));
        output( `devmode log: [${txt}] `);
      } else if (this.quiet == false){
        redoLine(txt);
      }
    } else if (debug == true) {
      redoLine(txt)
    }
    wTitle(txt) // put it on the terminal windowbar or in tmux
  }
  function wTitle(txt) {
    // if (this !== undefined) {
    //   let that = this;
    // } else if (cliInstance !== undefined){
    //   let that = cliInstance;
    // }
    if (this == undefined) {
      // let that = gimmeDat();
      term.windowTitle(`-[${txt}]`);
    } else {
      term.windowTitle(`@[${txt}] ${ this.args}`);
      // term.windowTitle(`[${this.howMany}] ${ this.highlightOrNothin() } ${this.status } ${ this.justNameOfDNA } ${maxWidth(120,txt)} (next: ${ this.nextFile}) (AminoSee@${hostname})`);
    }

  }
  function bugout(txt) {
    if (txt == undefined) { txt = 'txt not set' }
    // let mem = process.memoryUsage();
    let splitScreen = "";
    if (cliInstance !== undefined ) {
      let debugColumns = this.debugColumns;
      if (this.test === true) {
        splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( debugColumns - 10,  `[Test: ${this.howMany} ${ nicePercent(this.percentComplete) } Highlt${( this.isHighlightSet ? this.peptide + " " : " ")} >>>    `));
      } else {
        splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( debugColumns - 10,  `[Jbs: ${this.howMany} this.status  : ${ this.status } Crrnt: ${maxWidth(12, this.currentFile)} Nxt: ${maxWidth(12, this.nextFile)} ${ nicePercent(this.percentComplete) } ${ cliInstance.storage()} Highlt${( this.isHighlightSet ? this.peptide + " " : " ")} >>>    `));
      }
      splitScreen += fixedWidth( debugColumns,` ${txt} `);
      term.eraseLine();
      process.stdout.write(splitScreen);
      // splitScreen = chalk.gray.inverse( fixedWidth( debugColumns - 10, `Cpp: ${ this.codonsPerPixel }  G: ${ this.genomeSize.toLocaleString()} Est: ${ onesigbitTolocale( this.estimatedPixels/1000000)} megapixels ${bytes(  this.baseChars )} RunID: ${ this.timestamp } H dim: ${hilbPixels[ this.dimension ]}]  ${ formatAMPM( this.now )} and ${ this.formatMs( this.now )}ms`));
    } else if (cliInstance !== undefined){
      let debugColumns = Math.round(term.Width / 3);
      splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( debugColumns - 10,  `[Args: ${cliInstance.args._.length} ${ cliInstance.nicePercent()} ${ cliInstance.storage()} >>>    `));
        splitScreen += fixedWidth( debugColumns,` ${txt} `);
        term.eraseLine();
        process.stdout.write(splitScreen);
        // splitScreen = chalk.gray.inverse( fixedWidth( debugColumns - 10, ` ${ formatAMPM( Date() )} and ${ this.formatMs( Date().getTime() )}ms`));
      } else {
        redoLine( maxWidth( tx, txt) );
      }

      // output(splitScreen);
    }
    function deleteFile(file) {
      try {
        fs.unlinkSync(file, (err) => {
          bugtxt("Removing file OK...")
          if (err) { bugtxt(err)  }
        });
      } catch (err) {
        bugtxt(err)
      }
    }
    function termSize() {
      tx = term.width;
      ty = term.height
      termPixels = (tx) * (ty-8);
    }
    function destroyKeyboardUI() {
      process.stdin.pause(); // stop eating the this.keyboard!
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
        return `>`;
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
      return chalk.bgBlue.white.bold(txt);
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


    function runDemo() {
      var that = cliInstance;
      async.series( [
        function( cb ) {
          newJob('test')
          cb()
        },
        function( cb ) {
          that.openImage = true;
          that.peptide = 'Opal'; // Blue TESTS
          that.ratio = 'sqr';
          that.generateTestPatterns(cb);
          that.openOutputs();
        },
        function( cb ) {
          // that.openImage = true;
          that.peptide = 'Ochre'; // Red TESTS
          that.ratio = 'sqr';
          that.generateTestPatterns(cb);
        },
        function( cb ) {
          // that.openImage = true;
          that.peptide = 'Arginine'; //  PURPLE TESTS
          that.ratio = 'sqr';
          that.generateTestPatterns(cb);
        },
        function( cb ) {
          // that.openImage = true;
          that.peptide = 'Methionine'; //  that.green  TESTS
          that.ratio = 'sqr';
          that.generateTestPatterns(cb);
        },
        function ( cb ) {
          this.openOutputs();
          if ( cb !== undefined ) { cb() }
        },
        function( cb ) {
          server.start( that.outputPath );
          that.mkRenderFolders();
          symlinkGUI(cb);
        }
      ] )
      .exec( function( error ) {
        if ( error ) { log( 'Doh!' ) ; }
        else { log( 'WEEEEE DONE Yay! Done!' ) ; }
      } ) ;

    }
    function setupPrefs() {
      let o = getOutputFolder();
      log(`output = ${o}`);
      projectprefs = new Preferences('nz.funk.aminosee.project', {
        aminosee: {
          opens: 0,
          genomes: [ `megabase`, '50KB_TestPattern' ],
          url: `http://localhost:4321`
        }
      }, {
        encrypt: false,
        file: path.resolve( o + '/aminosee_project.conf'),
        format: 'yaml'
      });

      userprefs = new Preferences('nz.funk.aminosee.user', {
        aminosee: {
          cliruns: 0,
          guiruns: 0,
          gbprocessed: 0,
          completed: 0
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
      genomes = projectprefs.aminosee.genomes;
      url = projectprefs.aminosee.url;
      return [ userprefs, projectprefs ]
    }
    function logo() {
      return `${chalk.rgb(255, 255, 255).inverse("Amino")}${chalk.rgb(196,196,196).inverse("See")}${chalk.rgb(128,128,128).inverse("No")}${chalk.grey.inverse("Evil")}       v${chalk.rgb(255,255,0).bgBlue(version)}`;
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


        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, hue + 1/3);
        g = hue2rgb(p, q, hue);
        b = hue2rgb(p, q, hue - 1/3);
      }

      return [ r * 255, g * 255, b * 255 ];
    }
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
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
    function basename(f) {
      return path.basename(f);
      // if (f == undefined) { f = "was_not_set";  console.warn(f); }
      // return f.replace(/^.*[\\\/]/, '');
    }



    function fileSystemChecks(file) { // make sure file is writable or folder exists etc
      let problem = false;
      let name = basename(file)
      let msg = `Stats for file ${name}` + lineBreak;
      if (file === undefined) { return false; }
      if (!doesFileExist(file)) {
        file = path.resolve(file);
      }
      if (!doesFileExist(file)) {
        return false;
      }
      let isDir = doesFolderExist(file);

      try {
        // Check if the file is ACTUALLY FOLDER.
        isDir ? msg += 'is not a folder, ' : msg += 'is a folder (will re-issue the job as ), '

        if (!isDir) { ///////// ONLY FILES
          // Check if the file exists in the current directory.
          fs.access(file, fs.constants.F_OK, (err) => {
            if(err) {  msg +=  'does not exist, '   } else  { msg += 'exists, '  }
          });

          // Check if the file is readable.
          fs.access(file, fs.constants.R_OK, (err) => {
            if(err) {  msg +=  'is not readable, '  } else  { msg += 'is readable, ' }
          });

          // Check if the file is writable.
          fs.access(file, fs.constants.W_OK, (err) => {
            if(err) {  msg +=  'is not writable, '} else  { msg += 'is writeable, '  }
          });

          // Check if the file exists in the current directory, and if it is writable.
          fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
            if (err) {
              msg += 'does not exist or is read-only, '
            } else {
              msg += `exists, and it is writable, `
            }
          });
        }
      } catch(e) {
        output(chalk.inverse("Caught ERROR:") + e)
      }

      bugtxt(msg + ', and that is all.');
      return !problem;
    }
    function terminalRGB(_text, _r, _g, _b) {
      return chalk.rgb(_r,_g,_b)(_text);
    }
    function showCountdown() {
      countdown(`Closing in ${humanizeDuration(max32bitInteger)}`, 5000, this.gracefulQuit());
    }
    function countdown(text, timeMs, cb) {
      redoLine(text + humanizeDuration ( deresSeconds(timeMs) ) );
      if ( timeMs > 0 ) {
        setTimeout(() => {
          if ( cb !== undefined ) {
            countdown(text, timeMs - 500, cb);
          } else {
            countdown(text, timeMs - 500);
          }
        },  500 )
      } else {
        redoLine(' ');
        if ( cb !== undefined ) { cb() }
      }
    }
    function mode(txt) { // good for this.debugging
      wTitle(txt);
      var that = gimmeDat()
      if ( that.debug ) {
        out(txt);
        that.status   = txt;
      } else if (that.quiet == false){
        redoLine(txt);
        cliInstance.status   = txt;
      }
    }
    function gimmeDat() {
      let that;
      if ( cliInstance !== undefined) {  that = cliInstance }
      if ( this !== undefined)        {  that = this }
      if ( that === undefined)        {  that = false }
      return that;
    }
    function redoLine(txt) {
      term.eraseLine();
      output(maxWidth( term.width - 2, txt));
      var that = gimmeDat();
      if (that && that.debug ) {
        output(maxWidth( term.width - 2, txt));
      }
      term.up( 1 ) ;
    }
    function deresSeconds(ms){
      return Math.round(ms/1000) * 1000;
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
    function formatAMPM(date) { // nice time output
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
    function killServers() {
      output("ISSUING 'killall node' use 'Q' key to quit without killing all node processes!")
      this.renderLock = false;
      spawn('nice', ['killall', 'node', '', '0'], { stdio: 'pipe' });
      spawn('nice', ['killall', 'aminosee.funk.nz', '', '0'], { stdio: 'pipe' });
      if (server != undefined) {
        log("closing server")
        server.close();
      } else {
        bugtxt("no server running?")
      }
      try {
        fs.unlinkSync( this.fileServerLock, (err) => {
          bugtxt("Removing server locks OK...")
          if (err) {
            log(`ish ${err}`);
          }
        });
      } catch (err) {
        bugtxt("No server locks to remove: " + err);
      }
    }
    function charAtCheck(file) { // if the this.dnafile starts with - return false
      if ( file === undefined) { return false }
      if ( file.charAt(0) == '-') {
        log(`cant use files that begin with a dash - ${ file }`)
        return false;
      } else { return true }
    }
    function bgOpen(file, options, callback) {
      if ( file === undefined) { this.error(`file must be supplied`) }
      if ( options === undefined) { let options = { wait: false } }
      if ( callback === undefined) { open( file, options )  } else {
        open( file, options, callback);
      }
      projectprefs.aminosee.opens++; // increment open counter.
    }

    //
    // function testParse() {
    //   return parse(`
    //     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
    //     <html>
    //     <head>
    //     <title>Index of /foo/bar</title>
    //     </head>
    //     <body>
    //     <h1>Index of /foo/bar</h1>
    //     <table><tr><th><img src="/icons/blank.gif" alt="[ICO]"></th><th><a href="?C=N;O=D">Name</a></th><th><a href="?C=M;O=A">Last modified</a></th><th><a href="?C=S;O=A">Size</a></th><th><a href="?C=D;O=A">Description</a></th></tr><tr><th colspan="5"><hr></th></tr>
    //     <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="beep/">beep/</a>           </td><td align="right">25-May-2016 11:53  </td><td align="right">  - </td><td>&nbsp;</td></tr>
    //     <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="boop20160518/">boop20160518/</a>        </td><td align="right">19-May-2016 17:57  </td><td align="right">  - </td><td>&nbsp;</td></tr>
    //     <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="jazz20160518/">jazz20160518/</a>         </td><td align="right">19-May-2016 19:04  </td><td align="right">  - </td><td>&nbsp;</td></tr>
    //     <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="punk20160518/">punk20160518/</a>    </td><td align="right">19-May-2016 17:47  </td><td align="right">  - </td><td>&nbsp;</td></tr>
    //     <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="space20160518/">space20160518/</a>       </td><td align="right">19-May-2016 19:03  </td><td align="right">  - </td><td>&nbsp;</td></tr>
    //     <tr><th colspan="5"><hr></th></tr>
    //     </table>
    //     </body></html>`);
    //   }
    function listDNA() {
      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xhr = new XMLHttpRequest('https://www.funk.co.nz/aminosee/output/');
      let txt = xhr.responseText;
      // testParse();
      // parse("https://www.funk.co.nz/aminosee/output/")
      output('list')
      output(txt)
      // parse(txt)
    }
    // function savePNG2(cb, filename, array, height, width ) {
    //
    //   var img_data = Uint8ClampedArray.from( array );
    //   var img_png = new PNG({
    //     width: width,
    //     height: height,
    //     colorType: 6,
    //     bgColor: {
    //       red: 0,
    //       green: 0,
    //       blue: 0
    //     }
    //   })
    //
    //   img_png.data = Buffer.from(img_data);
    //   let wstream = fs.createWriteStream( this.dnafile );
    //   new Promise(resolve => {
    //     img_png.pack()
    //     .pipe(wstream)
    //     .on('finish', (err) => {
    //       bugtxt("HILBERT Save OK ");
    //       if ( cb !== undefined ) { cb() }
    //       if ( err ) { log("Error: " + err)}
    //     })
    //   }).then( log('PNG2 then') ).catch( log('PNG2 catch') );
    // }
    process.on("SIGTERM", () => {
      cliInstance.gracefulQuit();
      // this.destroyProgress();
      process.exitCode = 130;
      cliInstance.quit(130);
      process.exit(); // this.now the "exit" event will fire
    });
    process.on("SIGINT", function() {
      cliInstance.gracefulQuit();
      // this.destroyProgress();
      process.exitCode = 130;
      cliInstance.quit(130);
      process.exit(); // this.now the "exit" event will fire
    });
    function termDrawImage(fullpath, reason, cb) {
      // if (fullpath === undefined) { fullpath = previousImage }
      // if (fullpath === undefined) { return false }
      if (reason === undefined) { reason = `BUG. Reminder: always set a reason` }
      // if ( that.force == true) { return false }
      if ( quiet === true ) { out('quiet'); return false; }
      // term.saveCursor()
      clearCheck();
      // term.moveTo( 0, 0 )
      out('loading terminal image');
      // output(chalk.inverse("Terminal image: " +  basename(fullpath)))
      term.drawImage( fullpath, { shrink: { width: tx / 2,  height: ty } }, () => {
        output("Terminal image: " + chalk.inverse(  basename(fullpath) ) + " " +  reason)
        // term.restoreCursor();
        if ( cb !== undefined ) { cb() }
      })
    }
    function nicePercent(percent) {
      if (percent === undefined) { percent = this.percentComplete }
      return minWidth(5, (Math.round(  percent*1000) / 10) + "%");
    }
    function tidyPeptideName(str) { // give it "OPAL" it gives "Opal". GIVE it aspartic_ACID or "gluTAMic acid". also it gives "none"
    if (str == undefined) {
      output(`error with str it equals ${str} will return "none"`)
      return "none";
    }
    try {
      str = spaceTo_( str.toUpperCase() )
    } catch(e) {
      output(`error with str it equals ${str} will return "none"`)
      return "none";
    }
    for ( let i = 0; i < data.pepTable.length; i++) {
      let compareTo = spaceTo_( data.pepTable[i].Codon.toUpperCase() )
      if ( compareTo == str ) {
        // output(`str  ${str} = ${compareTo}  compareTo: ${data.pepTable[i].Codon} ` + chalk.yellow(`<--  GREAT SUCCESS`))
        return data.pepTable[i].Codon
      } else {
        // output(`str  ${str} = ${compareTo}  compareTo: ${data.pepTable[i].Codon}`)
      }
    }
    return "none";
  }
  // function gracefulQuit(code) {
  //   cliInstance.gracefulQuit(code);
  // }
  // hilDecode(i, dimension) {
  //   let x, y;      // bugtxt(`i, this.dimension  ${i} ${ this.dimension }`)
  //   [x, y] = MyManHilbert.decode(16,i); // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
  //   if ( this.dimension % 2 == 0 ) { // if even number
  //     let newY = x;      // ROTATE IMAGE CLOCKWISE 90 DEGREES IF this.dimension IS EVEN NUMBER FRAMES
  //     x = y
  //     y = newY;
  //   }
  //   return [ x, y ];
  // }
  function hilDecode(i, dimension) {
    // bugtxt(`i, this.dimension  ${i} ${ this.dimension }`)
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
  function   clearCheck() { // maybe clear the terminal
    if ( this.clear == true) {
      clearScreen();
    } else {
      process.stdout.write('[nc]');
      term.eraseDisplayBelow();
    }
  }
  function clearScreen() {
    term.clear();
  }
  function stopWork(reason) {
    if (reason === undefined) { this.error(`You have to give a reason`) }
    cliInstance.gracefulQuit(0, reason)
  }
  function getOutputFolder() {
    let outpath, clusterRender, outFoldername;
    // to make network / cluster render just "magically work":
    // look in current dir for specially named folders
    // /AminoSee_Output/
    // /output/
    // if found, use those as they are thought to be network SHARES
    // if not found setup and use local home folder ~/AminoSee_Output
    // this way you can create a network cluster quickly by just moving your ~/AminoSee_Output into the same folder as your DNA files
    // next time you run, it will put the render in same folder
    log(`OS: ${os.platform()} Home: ${os.homedir} process.cwd() + obviousFoldername: ${process.cwd() + obviousFoldername}`)

    // FIRST check for special folders in current directory
    // THEN if not found, create and use dirs in home directory
    if (doesFolderExist( path.resolve( process.cwd() + obviousFoldername) ) ) {
      clusterRender = true;
      outFoldername = obviousFoldername;
    } else if (doesFolderExist(path.resolve(process.cwd() + netFoldername))) {
      clusterRender = true;
      outFoldername = netFoldername;
    } else if (doesFolderExist(path.resolve(os.homedir + obviousFoldername))) {
      clusterRender = false;
      outFoldername = obviousFoldername;
    } else if (doesFolderExist(path.resolve(os.homedir + netFoldername))) {
      clusterRender = false;
      outFoldername = netFoldername;
    }

    if (clusterRender) {
      outpath = path.normalize(path.resolve(process.cwd() + outFoldername))  // default location after checking overrides
      log("CLUSTER OUTPUT FOLDER ENABLED")
      log(`Enabled by the prseence of a /output/ or /AminoSee_Output/ folder in *current* dir. If not present, local users homedir ~/AminoSee_Output`);
    } else {
      outpath = path.normalize(path.resolve(os.homedir + outFoldername))  // default location after checking overrides
      log("HOME DIRECTORY OUTPUT ENABLED")
    }
    return outpath;
  }
  function dedupeArray(a) {
    return [...new Set(a)];
  }
  function getArgs() {
    return this.args;
  }
  function initialiseArrays() {
    if ( this.brute == false) { return false; }

    for (let i = 0; i < cliInstance.pepTable.length; i++) {
      cliInstance.pepTable[i].lm_rgbArray = []
      cliInstance.pepTable[i].hm_rgbArray = []
    }

  }
  // function runDemo() {
  //   async.series( [
  //     function( cb ) {
  //       this.openImage = true;
  //       this.peptide = 'Opal'; // Blue TESTS
  //       this.ratio = 'sqr';
  //       this.generateTestPatterns(cb);
  //     },
  //     function( cb ) {
  //       // this.openImage = true;
  //       this.peptide = 'Ochre'; // Red TESTS
  //       this.ratio = 'sqr';
  //       this.generateTestPatterns(cb);
  //     },
  //     function( cb ) {
  //       // this.openImage = true;
  //       this.peptide = 'Arginine'; //  PURPLE TESTS
  //       this.ratio = 'sqr';
  //       this.generateTestPatterns(cb);
  //     },
  //     function( cb ) {
  //       // this.openImage = true;
  //       this.peptide = 'Methionine'; //  this.green  TESTS
  //       this.ratio = 'sqr';
  //       this.generateTestPatterns(cb);
  //     }
      // function ( cb ) {
      //   this.args._[0] = this.currentFile;
      //   this.currentFile = '*';
      //   this.args._.push( this.currentFile); // DEMO
      //   this.pollForStream();
      // },
      // function( cb ) {
      //   server.start( this.outputPath );
      //   this.mkRenderFolders();
      //   // symlinkGUI(cb);
      // }
  //   ])
  //   .exec( function( error, results ) {
  //     if (  this.error ) { log( 'Doh!' ) ; }
  //     else { log( 'WEEEEE DONE Yay! Done!' ) ; }
  //   });
  // }
  module.exports.getOutputFolder = getOutputFolder;
  module.exports.nicePercent = nicePercent;
  module.exports.createSymlink = createSymlink;
  module.exports.log = log;
  module.exports.out = out;
  module.exports.output = output;
  module.exports.AminoSeeNoEvil = AminoSeeNoEvil;
  module.exports.newJob = newJob;
  module.exports.pushCli = pushCli;
  module.exports.bruteForce = bruteForce;
  module.exports.terminalRGB = terminalRGB;
  module.exports.showCountdown = showCountdown;
  module.exports.stopWork = stopWork;
  module.exports.setupPrefs = setupPrefs;
  module.exports.fileWrite = (a,b,c) => { this.fileWrite(a,b,c) }
  // module.exports.deleteFile = (file) => { deleteFile(file) }
  module.exports.deleteFile = deleteFile;
  module.exports.maxWidth = maxWidth;
  module.exports.maxWidth = maxWidth;
  module.exports.getArgs = getArgs;
