// strict
let targetPixels = 8800000 // arbitrarily huge amount of pixels as target max resolution (8.8MP).
// let targetPixels = 5000000 // arbitrarily huge amount of pixels as target max resolution (8.8MP).
// if estimated pixels is less than this, the render will show 1 pixel per codon
let defaultMagnitude = 8 // each +1 is 4x more pixels
const defaultC = 1 // back when it could not handle 3+GB files.
const artisticHighlightLength = 36 // px only use in artistic this.mode. must be 6 or 12 currently
const maxCanonical = 32 // max length of canonical name
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ] // I've personally never seen a mag 9 or 10 image, cos my computer breaks down. 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
const widthMax = 960 // i wanted these to be tall and slim kinda like the most common way of diagrammatically showing chromosomes
const defaultPort = 4321
const minUpdateTime = 2000
const openLocalHtml = false // affects auto-open HTML.
const fileLockingDelay = 2000
const defaultPreviewDimension = 5 // was 500 MB per page before.
const theoreticalMaxMagnitude = 10 // max for auto setting
const overSampleFactor = 4 // your linear image divided by this will be the hilbert image size.
const blackPoint = 128 // use 255 to remove effect, it increase colour saturation
const wideScreen = 140 // shrinks terminal display
const windows7 = 100 // shitty os, shitty terminal, ah well
let termDisplayHeight = 15 // the stats about the file etc
let termHistoHeight = 30 // this histrogram
let raceDelay = 100 // so i learnt a lot on this project. one day this line shall disappear replaced by promises.
const settings = require("./aminosee-settings")
const version = require("./aminosee-version")
const server = require("./aminosee-server")
const data = require("./aminosee-data")
const template = require("./aminosee-html-template")
const description = settings.description
const interactiveKeysGuide = `
Interactive control:    D (demo full RGB test)    T (short test)   Q (graceful quit next save)
V (toggle verbose mode) B (live DNA to screen)    Esc (graceful quit)    Control-C (fast quit)
W (webserver)           C (clear scrn)            U (updates stats)       X (search ~ for DNA)
O (open images after render)                      or [space]
`
const helixEmoji =" 🧬  "
const htmlTemplate = template.htmlTemplate
const asciiart = data.asciiart
const doesFileExist = data.doesFileExist
const doesFolderExist = data.doesFolderExist
const createSymlink = data.createSymlink
const extensions = data.extensions
const saySomethingEpic = data.saySomethingEpic
const onesigbitTolocale = data.onesigbitTolocale
const hsvToRgb = data.hsvToRgb

// OPEN SOURCE PACKAGES FROM NPM
const path = require("path")
const open = require("open")
// const open = require( path.join(__dirname, '../../node_modules/open/xdg-open') )
const Preferences = require("preferences")
const beautify = require("json-beautify")
const spawn = require("cross-spawn")
const async = require("async-kit") // amazing lib
const termkit = require("terminal-kit") //.terminal
const term = termkit.terminal
// const MyManHilbert = require("hilbert-2d") // also contains magic
const MyManHilbert = require("../node_modules/hilbert-2d/hilbert") // also contains magic
const exec = require("child_process").exec // node standard lib
const es = require("event-stream")
const minimist = require("minimist")
const fetch = require("node-fetch")
const keypress = require("keypress")
const fs = require("fs-extra") // drop in replacement = const fs = require('fs')
const histogram = require("ascii-histogram")
const bytes = require("bytes")
const PNG = require("pngjs").PNG
const os = require("os")
const humanizeDuration = require("humanize-duration")
const chalk = require("chalk")
const internalIp = require("internal-ip").v4()
// const StdInPipe = require('./aminosee-stdinpipe');
// const stream = require("stream")
// const Readable = require('stream').Readable
// const Writable = require('stream').Writable
// const Transform = require('stream').Transform
// const request = require('request');
// const parse = require('parse-apache-directory-index');
const hostname = os.hostname()
const obviousFoldername = "AminoSee_webroot" // descriptive for users
const netFoldername = "output" // terse for networks
const funknzlabel = "aminosee.funk.nz"
const dummyFilename = "50KB_TestPattern.txt"
const closeBrowser = "If the process apears frozen, it's waiting for your this.browser or image viewer to quit. Escape with [ CONTROL-C ] or use --no-image --no-html"
const tomachisBirthday = new Date( 221962393 ) // Epoch timestamp: 221962393 is Date and time (GMT): Thursday, January 13, 1977 12:13:13 AM or 1:13:13 PM GMT+13:00 DST in New Zealand Time.

// const targetPixels = 1000000 // for web
// let bodyParser = require('body-parser');
// const gv = require('genversion');
// let gui = require('./public/aminosee-gui-web.js');

// BigInt.prototype.toJSON = function() { return this.toString(); }; // shim for big int
// BigInt.prototype.toBSON = function() { return this.toString(); }; // Add a `toBSON()` to enable MongoDB to store BigInts as strings

let autoStartGui = true
let cfile, streamLineNr, renderLock, jobArgs, killServersOnQuit, webserverEnabled, cliInstance, tx, ty, cliruns, gbprocessed, projectprefs, userprefs, genomesRendered, progato, commandString, batchSize, quiet, url, port, status, remain, lastHammered, darkenFactor, highlightFactor, loopCounter, webroot, tups,  opensFile , opensHtml , opensImage, previousImage, isHighlightSet, aminosee_json, hilpix, usersMagnitude, shrinkFactor, codonsPerPixelHILBERT, ishighres, ispreview, cpuhit, bruteRemain
// let theGUI
tups = opensFile = opensHtml = opensImage = 0 // terminal flossing
let opens = 0 // session local counter to avoid having way too many windows opened.
let dnaTriplets = data.dnaTriplets
let progressTime = 500 // ms
let termPixels = 69 // chars
remain = 0 // files in the batch
tx = ty = cliruns = gbprocessed = cpuhit = 0
usersMagnitude = defaultMagnitude
let isShuttingDown = false
let threads = [] // an array of AminoSeNoEvil instances.
let clear = false
let debug = false // should be false for PRODUCTION
let brute = false // used while accelerating the render 20x
let setuplock = false // used while accelerating the render 20x
let verbose = false
ispreview = false
webserverEnabled = false
genomesRendered = []
renderLock = false
isHighlightSet = false
aminosee_json = status = "initialising"
module.exports = () => {
  setupApp()
}

function startGUI() {
  cliInstance.gui = true
  cliInstance.keyboard = true
  cliInstance.serve = true
  // cliInstance.setupKeyboardUI();
  // output("Starting carlo GUI - press Control-C to quit")
  // const carlo = require("./aminosee-carlo").run( generateTheArgs() )
  output("start gui.")
  // server.start( generateTheArgs() )
  // destroyKeyboardUI()
  // return carlo
}
function generateTheArgs() {
  webroot = locateWebroot()
  url = `http://${internalIp}:${port}`
  log(`webroot: ${webroot} ${url}`)
  let theArgs = {
    verbose: verbose,
    webroot: webroot,
    outputPath: path.join( webroot, netFoldername ),
    openHtml: false,
    background: false,
    currentURL: url
  }


  if ( typeof cliInstance === "undefined" ) {
    error(`typeof cliInstance === "undefined"`)

  } else {
    // log(`Not undefined: ${cliInstance}`)

    theArgs = {
      port: defaultPort,
      verbose: verbose,
      output: cliInstance.outputPath,
      serve: true,
      gzip: true,
      logip: true,
      webroot: webroot,
      openHtml: cliInstance.openHtml,
      https: true,
      background: cliInstance.background,
      currentURL: cliInstance.currentURL
    }
  }
  log("generateTheArgs")

  return theArgs
}
function populateArgs(procArgv) { // returns args
  const options = {
    boolean: [ "artistic", "brute", "clear", "chrome", "devmode", "debug", "demo", "dnabg", "explorer", "file", "force", "fullscreen", "firefox", "gui", "html", "image", "keyboard", "list", "progress", "quiet", "reg", "recycle", "redraw", "slow", "serve", "safari", "test", "updates", "verbose", "view" ],
    string: [ "url", "output", "triplet", "peptide", "ratio" ],
    alias: { a: "artistic", b: "dnabg", c: "codons", d: "devmode", f: "force", finder: "explorer", h: "help", k: "keyboard", m: "magnitude", o: "output", p: "peptide", i: "image", t: "triplet", u: "updates", q: "quiet", r: "reg", w: "width", v: "verbose", x: "explorer", v: "verbose", view: "html" },
    default: { brute: false, debug: false, keyboard: false, progress: true, redraw: true, updates: true, stop: false, serve: false, fullscreen: false , html: true, image: false, index: false, clear: false, explorer: false, quiet: false, gui: false },
    stopEarly: false
  } // NUMERIC INPUTS: codons, magnitude, width, maxpix
  let args = minimist(procArgv.slice(2), options)
  // bugtxt( args )
  return args
}
function bruteForce(cs) {
	let pepTable = data.pepTable
  bruteRemain = pepTable.length
  remain = cliInstance.args._.length
  output( blueWhite( `Fast Batch Mode Enabled aka brute mode. Length: ${bruteRemain} x ${remain} = ${bruteRemain * remain}. Adding jobs to queue.`))

  for (let gen = 0; gen < remain; gen++) {
    cfile = cliInstance.args._.pop() // remove and add each in again 23 times! for each amino acid. focus pep will be set durign post render, and bruteRemain--
    for (let i = 0; i < bruteRemain; i++) {
      let pep =  data.pepTable[i].Codon
        let job = { _: [ cfile ],
          peptide: pep,
          quiet: cliInstance.quiet,
          gui: false,
          keyboard: cliInstance.keyboard,
          progress: cliInstance.progress,
          redraw: true,
          updates: cliInstance.updates,
        }
        log( `pushing job to stack: ${pep}` )
        cliInstance.args._.push(cfile)
    }
  }
  bugtxt( beautify(cliInstance.args._))
  remain = cliInstance.args._.length
  batchSize = remain
}
function pushCli(cs) {
  commandString = `aminosee ${cs}`// let commandArray = [`node`, `aminosee`, commandString];
  output(chalk.inverse(`Starting AminoSee now with pushClI:
    ${chalk.italic( commandString )}`))

    if ( renderLock ) {
      output("Job is already running, adding it to the queue")
      jobArgs.push( cs )
    } else {
      let commandArray = commandString.split(" ")
      jobArgs = populateArgs( commandArray )
      log(`Command: ${commandString}`)
      log(jobArgs)
      for (let i=0; i < commandArray.length; i++) {
        let job = commandArray[i]
        if (charAtCheck(job)) { // no files can start with - first char this.file
          if (fileSystemChecks(job)) {
            log(`pushing job into render queuee: [${job}]`)
            jobArgs._.push(job)
          } else {
            log(`umm: [${job}]`)
          }
        } else {
          log(`configuring parameter: [${job}]`)
        }
      }
      // let thread = newJob(jobArgs)
      // threads.push( thread )
      // output(`NUMBER OF THREADS: ${threads.length}`)
    }



  }
  function setupApp() {
    if ( renderLock === true) { error("draining thread from setupApp"); return false }
    // output(`Setting up`)
    printlogo()

    lastHammered = new Date()


    termSize()
    cliInstance = new AminoSeeNoEvil()
    threads.push( cliInstance )
    // webroot = locateWebroot()
    // cliInstance.resized()
    cliInstance.setupJob( populateArgs( process.argv ), "module exports", () => {
        log(`done`)
    })

  }
  // function newJob( job ) { // used node and CLI tool.
  //   let nuThread = new AminoSeeNoEvil()
  //   populateArgs( process.argv )
  //   return nuThread
  // }

  class AminoSeeNoEvil {
    constructor(o) { // CLI commands, this.files, *
      output("constructing")
      if ( typeof o === "undefined" ) {
        this.outputPath = locateWebroot()
      } else {
        this.outputPath = o
      }
      this.setupPrefs()
      this.red = this.green = this.blue = this.alpha = 0
      term.on("resize", () => {
        this.resized()
      })
      process.stdout.on("resize", () => {
        this.resized()
      })
    }


    setupJob( args, reason, cb ) {

      if ( setuplock ) { error(`this should not fire more than once per genome?!`) }
      setuplock = true
      if ( typeof reason === "undefined") { error(`reason must not be undef`); return false;}
      if ( renderLock === true ) { error("setup job: draining threads"); return false }

      mode("setup job ")
      this.setupPrefs()
      // do stuff aside from creating any changes. eg if you just run "aminosee" by itself.
      // for each render batch sent through newJob, here is where "this" be instantiated once per newJob
      // for each DNA file, run setupRender
      // server.setArgs( args )
      isShuttingDown = false
      streamLineNr = 0
      loopCounter = 0
      // renderLock = false // not rendering right this.now obviously
      darkenFactor = 0.25 // if user has chosen to highlight an amino acid others are darkened
      highlightFactor = 4.0 // highten brightening.
      loopCounter = 0
      this.charClock = 0
      this.pixelClock = 0
      this.peptide = this.triplet = this.focusTriplet = this.usersPeptide = "Reference" // used to be "none" is now "Reference"
      this.usersTriplet = "not set"
      this.rawDNA = "this aint sushi"
      this.startDate = new Date() // required for touch locks.
      this.timestamp = new Date()
      this.now = this.startDate
      this.percentComplete = 0
      this.outFoldername = ""
      this.genomeSize = 0
      this.killServersOnQuit = true
      this.maxMsPerUpdate  = 15000 // milliseconds per update
      this.timeRemain = 1
      this.debugGears = 1
      this.done = 0
      this.devmode = false // kills the auto opening of reports etc
      this.quiet = false
      verbose = false // not recommended. will slow down due to console.
      this.force = false // this.force overwrite existing PNG and HTML reports
      this.artistic = false // for Charlie
      this.dnabg = false // firehose your screen with DNA!
      this.report = true // html reports can be dynamically disabled
      this.test = false
      this.updates = true
      this.progress = true // whether to show the progress bars
      this.stats = true
      this.recycEnabled = false // bummer had to disable it
      this.clear = true // this.clear the terminal screen while running
      this.openImage = true // open the png
      this.openHtml = true
      opensHtml = 0 // how many times have we popped up a browser.
      this.highlightTriplets = []
      this.isHilbertPossible = true // set false if -c flags used.
      this.isDiskFinLinear = true // flag shows if saving png is complete
      this.isDiskFinHilbert = true // flag shows if saving hilbert png is complete
      this.isDiskFinHTML = true // flag shows if saving html is complete
      this.isStorageBusy = false // true just after render while saving to disk. helps percent show 100% etc.
      this.willRecycleSavedImage = false // allows all the this.regular processing to mock the DNA render stage
      this.codonsPerSec = 0
      this.peakRed  = 0.001
      this.peakGreen  = 0.1010101010
      this.peakBlue  = 0.1010101010
      this.peakAlpha  = 0.1010101010
      this.rawDNA ="...ACTCGGCTGATACG...GTGTGG" // this.debug
      this.outFoldername = obviousFoldername
      this.browser = "firefox"
      termPixels = 69//Math.round((term.width) * (term.height-8));
      this.runningDuration = 1 // ms
      this.termMarginLeft = 2
      this.errorClock = 0
      remain = args._.length
      this.pepTable = data.pepTable
      this.args = args // populateArgs(procArgv); // this.args;

      if ( args.demo ) {
        this.demo = true
        this.test = true
        remain++
      }
      if ( args.test  ) {
        this.test = true
        remain++
      }
      // try {
      //   cfile = args._[0]
      //   this.dnafile = path.resolve( cfile )
      // } catch(err) {
      //   cfile = path.join( 'dna', '50KB_TestPattern' )
      //   log(err)
      // }
      batchSize = remain


      this.setNextFile()
      this.outputPath = path.join( webroot, netFoldername)
      this.extension = this.getFileExtension( cfile)
      this.started = this.startDate.getTime() // required for touch locks.
      this.dimension = defaultMagnitude // var that the hilbert projection is be downsampled to
      this.magnitude = "auto"
      this.msPerUpdate  = minUpdateTime // min milliseconds per update its increased for long renders
      this.termMarginTop = (term.height -  termDisplayHeight -   termHistoHeight ) / 4
      termSize()
      this.previousImage = this.shortnameGenome
      // printlogo()

      if ( args.quiet || args.q ) { // needs to be at top to cut back clutter during batch rendering
        this.quiet = true
        // this.keyboard = false
        // destroyKeyboardUI()
      } else {
        this.quiet = false
      }
      if ( args.maxpix ) {
        let usersPix = Math.round( args.maxpix )
        if ( usersPix < 100000 ) {
          output("maxpix too low. using --maxpix=1000000")
          this.maxpix = targetPixels
        } else {
          this.maxpix = usersPix
          if ( usersPix > targetPixels ) {
            output(`Nice, using custom resolution: ${usersPix.toLocaleString()}`)
          }
          targetPixels = this.maxpix
        }
      } else {
        this.maxpix = targetPixels
      }
      targetPixels = this.maxpix
      if ( args.fullscreen === true) {
        log("fullscreen terminal output enabled")
        this.fullscreen = true

      } else {
        this.fullscreen = false
        log("inline terminal output enabled")
      }


      if ( args.webroot ) {
        args.webroot = args.webroot.replace("~", os.homedir())

        webroot = path.resolve( args.webroot )
        output(`Setting webroot folder to ${ path.normalize( webroot )}`)

        if (doesFolderExist( webroot )) {
          this.usersOutpath = path.resolve( webroot, "output" )
          if (doesFolderExist(this.usersOutpath)) {
            log(`Using custom webroot ${webroot}`)
          } else {
            this.mkdir("output")
          }
        } else {
          log(`Could not find webroot path: ${ webroot }, will create it now`)
          this.mkdir()
          this.mkdir("output")
          this.outputPath = this.usersOutpath
        }
      }
      bugtxt(`output path: ${ this.outputPath }`)
      if ( args.delay ) {
        let amount = Math.round( args.delay )
        if ( amount > 1 && amount << 60000) {
          raceDelay = amount
          output(`Custom delay between jobs of ${humanizeDuration( amount )}`)
        }
      }
      if ( args.slow ) {
        let amount = 4000
        raceDelay += amount
        output(`${humanizeDuration( amount )} delay time added between jobs`)
      }

      if ( args.debug || debug === true) {
        debug = true
        output("💩 debug mode ENABLED 💩")
      } else {
        debug = false
      }

      if ( args.url ) {
        url = args.url
        projectprefs.aminosee.url = url
        output(`Setting project preferences to: ${url} but projectprefs.aminosee.url ${projectprefs.aminosee.url}`)
      } else if (typeof projectprefs.aminosee.url === "undefined") {
        url = `http://${hostname}:4321`
      } else {
        url = projectprefs.aminosee.url
      }


      if ( args.progress ) {
        this.progress = true // whether to show the progress bars
        log("progress bars enabled")
      } else {
        this.progress = false // whether to show the progress bars
        log("Disabled progress bars")
      }
      this.devmode = false
      if ( args.devmode || args.d ) { // needs to be at top sochanges can be overridden! but after debug.
        this.toggleDevmode() // make sure debug is set first above
      }
      if ( args.recycle ) { // needs to be at top so  changes can be overridden! but after debug.
        output("♻ recycle mode enabled. (experimental)")
        this.recycEnabled = true
      } else { this.recycEnabled = false }
      if ( args.keyboard || args.k ) {
        log("💩 KEYBOARD MODE HAS SOME BUGS ATM SORRY 💩")
        this.keyboard = true
        termDisplayHeight += 4 // display bigger
        if ( verbose === true) {
          termDisplayHeight++
        }
      } else {
        this.keyboard = false
      }
      if ( args.port ) {
        this.port = Math.round( args.port )
      } else {
        this.port = defaultPort
      }
      if ( this.keyboard === true) {
        notQuiet("interactive keyboard mode enabled")
        this.setupKeyboardUI()
      } else {
        log("interactive keyboard mode disabled")
      }
      this.openHtml = true
      // this.browser = "chrome"
      if ( args.chrome) {
        this.openImage = true
        this.openHtml = true
        this.browser = "chrome"
      } else if ( args.firefox) {
        this.openImage = true
        this.openHtml = true
        this.browser = "firefox"
      } else if ( args.safari) {
        this.openImage = true
        this.openHtml = true
        this.browser = "safari"
      }
      log(`Browser set to ${ this.browser } options: --chrome --firefox --safari`)
      if ( args.image || args.i ) {
        this.openImage = true
        output("will automatically open image")
      } else {
        log("will not open image")
        this.openImage = false
      }
      if ( args.any || args.a) {
        this.anyfile = true
        output("will ignore filetype extensions - and try to use any file as ASCII DNA. If it contains words like CAT this may work. Unlikely to.")
      } else {
        log(`will only open files with extensions: ${extensions}`)
        this.anyfile = false
      }
      if ( args.codons || args.c) {
        this.userCPP = Math.round( args.codons || args.c) // javascript is amazing
        output(`codons per pixel ${ this.userCPP }`)
        this.codonsPerPixel = this.userCPP
      } else {
        this.codonsPerPixel = defaultC
        this.userCPP = "auto"
      }

      // this is weird: load the value into dimension; if set its custom if not its auto.
      if ( args.magnitude || args.m ) {
        output( args.magnitude )
        this.dimension = Math.round( args.magnitude )
        this.magnitude = "custom"
        if ( this.dimension < 3 ) {
          this.dimension = 3
          output("Magnitude must be an integer number between 3 and 9. Using -m 3 for 4096 pixel curve.")
        } else if ( this.dimension > theoreticalMaxMagnitude) {
          this.dimension = theoreticalMaxMagnitude
          output("Magnitude must be an integer number between 3 and 9 or so. 9 you may run out of memory.")
        } else if (  this.dimension > 2 &&  this.dimension < 9) {
          output(`Using custom output magnitude: ${ this.dimension }`)
          defaultMagnitude = this.dimension
        }
      } else {
        this.magnitude = "auto"
        this.dimension = defaultMagnitude
        log(`Using auto magnitude with limit ${defaultMagnitude}th dimension`)
      }
      usersMagnitude = this.dimension
      log(`Max pixels: ${ this.maxpix } Hilbert curve dimension: ${ this.dimension } mag setting: ${ this.magnitude }`)
      if ( args.ratio || args.r ) {
        this.ratio = args.ratio.toLowerCase()
        this.userRatio = "custom"
        if ( this.ratio == "fixed" || this.ratio == "fix") {
          this.ratio = "fix"
        } else if ( this.ratio == "square" || this.ratio == "sqr") {
          this.ratio = "sqr"
        } else if ( this.ratio == "hilbert" || this.ratio == "hilb" || this.ratio == "hil" ) {
          this.ratio = "hil"
        } else if ( this.ratio == "gol" || this.ratio == "gold" || this.ratio == "golden" ) {
          this.ratio = "gol"
        } else {
          log("Custom aspect ratio should be one of:  fixed, square, or golden (using default)")
          this.ratio = "fix"
          this.userRatio = "auto"
        }
      } else {
        log("No custom ratio chosen. (using default)")
        this.ratio = "fix"
        this.userRatio = "auto"
      }
      this.pngImageFlags += this.ratio

      log(`Using aspect ratio: ${  chalk.inverse(this.ratio) } `)

      if ( args.triplet || args.t) {
        this.usersTriplet = args.triplet
        output(this.usersTriplet )
        this.triplet = this.tidyTripletName(this.usersTriplet )
        this.focusTriplet = this.triplet
        if (this.triplet !== "Reference") {
          output(`Found triplet ${ this.triplet } with colour ${ this.tripletToHue( this.triplet )}°`)
          isHighlightSet = true
          output(`Custom triplet ${chalk.bgWhite.blue ( this.triplet )} set. Others will be mostly transparent.`)
        } else {
          output(`Error could not lookup triplet: ${ this.triplet }`)
          this.triplet = "Reference"
        }
      } else {
        log("No custom triplet chosen. (default)")
        this.triplet = "Reference"
      }
      if ( args.peptide || args.p) {
        this.peptide = this.usersPeptide = tidyPeptideName( args.peptide )
        if ( this.peptide !== "Reference"  ) { // this colour is a flag for  this.error
          isHighlightSet = true
          this.index = false // disable html report
        }
      } else {
        log("No custom peptide chosen. Will render standard reference type image")
        this.peptide = this.usersPeptide = "Reference"
      }
      if ( this.peptide == "Reference" && this.triplet == "Reference") {
        isHighlightSet = false
        this.index = true
        this.report = true
      } else {
        isHighlightSet = true
        this.index = false // disable html report
        this.report = false
      }
      if ( args.artistic || args.art || args.a) {
        output(`Artistic mode enabled. Colours are blended at a lower resolution and then spread out in columns for effect. It is faded across ${ artisticHighlightLength } pixels horizontally.`)
        this.artistic = true
        this.isHilbertPossible = false
        this.pngImageFlags += "_art"
        this.codonsPerPixel = artisticHighlightLength
        if ( args.ratio)  {
          output("artistic mode is best used with fixed width ratio, but lets see")
        } else {
          this.ratio = "fix"
        }
      } else {
        log("1:1 science mode enabled.")
        this.artistic = false
      }
      if ( args.index ) {
        notQuiet("INDEX.HTML will also be written out")
        this.index = true
        this.report = true
      } else {
        log("Can not output index.html file when a focus flag is in use eg (like --peptide=Alanine or --triplet=AAA)")
        this.index = false
      }

      if ( args.verbose || args.v) {
        output("verbose enabled. AminoSee version: " + version)
        bugtxt(`os.platform(): ${os.platform()} ${process.cwd()}`)
        verbose = true
        termDisplayHeight -= 2
      } else {
        log("verbose mode disabled")
        verbose = false
      }
      if ( args.html ) {
        output("will open html in firefox after render")
        this.openHtml = true
      } else {
        log("not opening html")
        this.openHtml = false
      }
      if ( args.html === true || args.chrome || args.firefox  || args.safari  || args.report  || args.open) {
        output(`opening html set true ${this.shortnameGenome}`)
        this.openHtml = true
      } else {
        log("not opening html")
        this.openHtml = false
      }
      if ( args.dnabg || args.s) {
        log("dnabg mode enabled.")
        this.dnabg = true
      } else {
        log("dnabg mode disabled.")
        this.dnabg = false
      }
      if ( cliruns > 69 || gbprocessed  > 0.2 || opens > 24 && Math.random() > 0.994) {
        log("Easter egg: enabling dnabg mode!!")
        this.dnabg = true // for laffs
      } // after processing 200 megabytes, this easter egg starts showing raw DNA as the background after 100 megs or 69 runs.
      if ( args.force === true) {
        output("force overwrite enabled.")
        this.force = true
      } else {
        log("No force overwrite")
      }
      if ( args.explorer || args.finder) {
        output("will open folder in File Manager / Finder / File Explorer when done.")
        this.openFileExplorer = true
      } else {
        log("will not open folder in File Manager / Finder / File Explorer when done.")
        this.openFileExplorer = false
      }
      if ( args.help ) {
        this.help = true
        autoStartGui = false
        this.helpCmd()
      } else {
        this.help = false
      }
      this.background = true // spawn background process for long running server
      if ( args.foreground === true ) {
        this.background = false // spawn background process for long running server
        this.serve = true
        this.keyboard = true
        killServersOnQuit = false
        // countdown("shutdown in ", 360000, () => { out('foreground ended') } )
      }

      killServersOnQuit = true // aminosee --serve will quit after spawning foreground in background

      if ( args.serve === true) {
        output(`Webserver enabled`)
        webserverEnabled = true
        killServersOnQuit = false
        this.serve = true
        this.keyboard = true
        // countdown("shutdown in ", 360000, () => { out('foreground ended') } )
      } else {
        log("Foreground webserver will exit with app, use --serve to spawn background process ")
        killServersOnQuit = true
        // this.serve = false
        // webserverEnabled = false
      }

      if ( args.clear ) {
        log("screen clearing enabled.")
        this.clear = true
      } else {
        log("clear screen disabled.")
        this.clear = false
      }
      if ( args.updates || args.u) {
        log("statistics updates enabled")
        this.updates = true
      } else {
        log("statistics this.updates disabled")
        this.updates = false
        this.maxMsPerUpdate  = 5000
        this.clear = false
      }
      if ( args.reg || args.r) { // NEEDS TO BE ABOVE TEST
        this.reg = true
        notQuiet("using regmarks")
      } else {
        notQuiet("no regmarks")
        this.reg = false
      }

      if ( args.stop ) {
        output("GUI diabled. Use --gui to enable")
        server.stop()
        webserverEnabled = false
        autoStartGui = false
        this.gui = false
        this.openHtml = false
        this.openFileExplorer = false
        this.openImage = false
        this.gui = false
        this.serve = false
        // this.quit(1, `--stop`)
      }
      // if ( args.gui ) {
      //   log("Running AminoSee graphical user interface... use --no-gui to prevent GUI")
      //   this.gui = true
      // } else { this.gui = false }


      if ( isHighlightSet ) {
        output(`Custom peptide: ${blueWhite( this.peptide )}  Triplet: ${ blueWhite( this.triplet ) }`)
      } else {
        log("No custom peptide set.")
      }
      bugtxt( `args: [${args.toString()}]`)
      if ( args.get ) {
        this.downloadMegabase( this.preRenderReset)
      }
      if ( args.demo ) {
        this.demo = true
        this.args._.push( "demo")
        remain = args._.length

        output("Demo mode activated")
      } else {
        this.demo = false
        log("Demo mode not activated")
      }
      if ( args.list ) {
        output("List DNA")
        listDNA()
      }
      if ( args.brute ) {
        output("Using brute force. And, ideally, Chuck Norris!")
        brute = true
        bruteForce()
      } else {
        brute = false
        bruteRemain = 0
      }

      if ( args.quiet || args.q ) { // needs to be at bottom so changes cant be overridden! but after debug .
        log("quiet mode enabled.")
        webserverEnabled = false
        this.quiet = true
        verbose = false
        this.dnabg = false
        this.updates = false  //this.updates
        this.clear = false
        this.openImage = false
      } else {
        this.quiet = false
        log("not using quiet mode. ")
      }
      if ( args.delay ) {
        let  n = Math.round( args.delay )
        if ( n > 1 ) {
          raceDelay = n
          notQuiet(`Set custom delay to ${humanizeDuration( n) }`)
        }
      }


      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////

      if (this.devmode === true) {
        this.quiet = false
        verbose = true
        this.updates = false
        this.clear = false
        this.openHtml = false
        this.openImage = false
        this.view = false
        this.openFileExplorer = false
        this.progress = true // EXPERIMENTAL FEATURES
        this.keyboard = true // EXPERIMENTAL FEATURES
        termDisplayHeight++
        raceDelay += 200 // this helps considerably!
        progressTime *= 0.5 // double it
        if (debug === true) {
          raceDelay += 1000 // this helps considerably!
        }
        log("AminoSee has been slowed to " + blueWhite( raceDelay ))
      } else {
        // raceDelay -= 1000 // if you turn devmode on and off a lot it will slow down
        // verbose = false
        // this.updates = true
        // this.clear = false
        // this.openHtml = true
        // this.openImage = false
        // this.openFileExplorer = false
        termDisplayHeight--
      }

      /////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////


      quiet = this.quiet
      bugtxt(`the args -->> ${this.args}`)
      log(`Output folder:  ${ blueWhite( path.normalize( this.outputPath )) }`)
      remain = args._.length

      if ( this.test === true ) {
        output("Ω Running test Ω")
        remain = this.dimension
        this.generateTestPatterns(() => {
          out(`finished with test pattern`)
          runcb( cb )
          // this.quit(0, "test patterns")
        })
        return false
      }

      if ( this.demo === true ) {
        mode("demo mode")
        remain = this.dimension
        runDemo()
        return false
      }

      // output(`webserverEnabled: ${webserverEnabled}`)
      if ( webserverEnabled === true ) {
        output(`Starting webserver`)
        let theargs =  generateTheArgs()
        bugtxt(theargs)
        server.stop() // kludge? maybe remove later
        url = projectprefs.aminosee.url
        output()
        this.setupKeyboardUI()
        autoStartGui = false
        // output(`Server running at: ${ chalk.underline( url ) } to stop use: aminosee --stop `)
        server.setArgs(theargs)
        // server()
        // this.currentURL = server.foregroundserver()
        // this.currentURL = this.generateURL()
        // this.currentURL = server.start( theargs )

        // server.start(theargs)
        // output( theargs )
        // output(`starting server in a tick`)
        // runcb( () => {
        log(`starting server now`)
        try {
          // server( theargs )
          server.start( this.currentURL )

        } catch (err) {
          output(`error starting server: ${fixedWidth(tx/2, err)}`)
        }
        //   webserverEnabled = false
        // })


      } else {
        log("Not starting server")
      }

      if ( this.serve ) { return }

      if ( remain > 0 ) {
        mode(remain + " Ω work remaining Ω  first command")
        log("about to run linear names")

        this.shortnameGenome = this.genomeCanonicalisaton()
        this.imgPath = path.resolve( this.outputPath, this.shortnameGenome, "images")
        this.setupProgress()

        this.setupLinearNames()

        notQuiet(chalk.green(`${batchProgress()} ${chalk.underline("Job items Ω ")}` ))
        log(this.outputPath)
        this.dnafile = args._.toString()
        this.pollForStream(`first command`) // <<<<<<<<<<<<--------------- THIS IS WHERE IT ALL HAPPENS

      } else {
        let time = 5000
        mode("no command")

        if ( cliruns < 3) {
          output("FIRST RUN!!! Opening the demo... use the command aminosee demo to see this first run demo in future")
          this.firstRun()
          isShuttingDown = false
        } else {
          log("not first run")
        }
        termSize()
        log(`Your terminal size: (${tx},${ty})`)

        // output(`remain ${remain}`)

        log(`will hold CLI for ${humanizeDuration(time)}`)
        listGenomes()
        if ( this.quiet ) {
          time = 1000
          log("exiting")
          this.quit(0, "no command")
          return
        }
        if ( this.help || verbose ) {
          output(`Welcome... this is a CLI app run from the terminal, see above [Q] or [Esc] key to exit now `)
          output( interactiveKeysGuide )
          cliInstance.setupKeyboardUI()
          if ( this.gui ) {
            log("GUI")
            startGUI()
            pushCli("--test")
            return true
          } else {
            // cliInstance.updatesTimer = countdown("closing in ", time, () => {
            //   mode("time out from no command")
            //   destroyKeyboardUI()
            //   this.quit(0, "no command")
            // })
          }
        }
      }


      // output("Hello. And this is where the module exits.")

      // if ( this.gui === true && this.quiet == false ) {
      // theGUI = startGUI()
      // } else {
      // log( "Try using  --gui for the graphical user interface!")
      // }

    }
    setupProgress() {
      mode(`setup progress`)
      notQuiet( status )
      if ( this.progress === true ) {
        progato = term.progressBar( {
          width: 80,
          inline: true,
          title: batchProgress() ,
          eta: true ,
          items: remain,
          percent: true,
          syncMode: true
        })
        this.progressTick()
      }
    }
    startProgress() {
      if ( remain < 0 ) {
        return false
      }
      let task = cfile
      progato.startItem( task )
    }
    progressTick() {
      this.fastUpdate()
      if ( progato && progato === "nullnuts" ) {
        return
      }
      progato.update( this.percentComplete )
      if (remain >= 0 ) {
        clearTimeout( this.progTimer )
        this.progTimer = setTimeout(() => {
          if (  this.percentComplete < 0.99 &&  this.timeRemain > 2001) {
            this.progressTick()
          } else {
            progato.stop()
          }
        }, progressTime)
      }
    }
    doneProgress( task ) {
      progato.itemDone( task )
      if ( remain < 0 ) {
        setTimeout( function() { term( "\n" )  } , 200 )
      }
    }
    destroyProgress() { // this.now thats a fucking cool name if ever there was!
      mode(`removing progress`)

      if ( this.progress === true) {
        // if ( typeof progato !== "undefined" ) {
          try {
            progato.stop()
            progato = "nullnuts";
          } catch(e) {}
        // }
      }
      clearTimeout( this.updatesTimer)
      clearTimeout( this.progTimer)
      clearTimeout( this.lockTimer)
    }
    // bugtxt(txt) { // full debug output
    //   if (this.quiet == false && debug === true && this.devmode === true && verbose === true)  {
    //     bugout(txt);
    //   } else {
    //     if (verbose === true ) {
    //       redoline(txt);
    //     }
    //   }
    // }





    // termSize() {
    //   tx = term.width;
    //   ty = term.height
    //   termPixels = (tx) * (ty-8);
    //   termPixels = termPixels;
    // }



    resized(tx, ty) {
      clearCheck()
      // term.clear()

      // term.erase()
      termSize()
      this.setDebugCols()
      tx = term.width; ty = term.height
      log(`Terminal resized: ${tx} x ${ty} and has at least ${termPixels} chars. Fullscreen mode enabled, use --no-fullscreen to prevent`)

      this.colDebug = this.setDebugCols() // Math.round(term.width / 3);
      this.msPerUpdate  = minUpdateTime
      // cliInstance.msPerUpdate  = minUpdateTime;

      if ( this.dnabg === true) {
        this.termMarginTop = Math.round(((term.height -  termDisplayHeight) -   termHistoHeight ) / 3)
      } else {
        if ( this.clear === true) {
          this.termMarginTop = Math.round(((term.height -  termDisplayHeight) -   termHistoHeight ) / 6)
        } else {
          this.termMarginTop = 0
        }
      }
      if ( isShuttingDown ) { this.quit(0, `resized`) }
      if ( debounce() ) { wTitle(`resized`) }
    }
    cli(argumentsArray) {
      log(`cli argumentsArray [${argumentsArray.toString()}]`)
    }

    getRenderObject() { // return part of the histogramJson obj
      if ( renderLock === false) { error(`must be rendering when called`); }
      mode(`building render object`)

      for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
        const codon =  this.pepTable[ p ].Codon
        bugtxt(`codon = ${codon}`)
        this.peptide = codon // for these filename generators below

        if ( codon == "Reference" ) { this.pepTable[ p ].Histocount = this.genomeSize }
        this.pepTable[p].src = this.generateFilenamePNG( codon )
        this.pepTable[p].mixRGBA = this.tripletToRGBA(codon)
        this.pepTable[p].linear_master = this.generateFilenamePNG( codon )
        this.pepTable[p].linear_preview = this.generateFilenamePNG( codon )
        this.pepTable[p].hilbert_master =  this.generateFilenameHilbert( codon )
        this.pepTable[p].hilbert_preview =  this.generateFilenameHilbert( codon )

        if ( ishighres === false ) { // preview is the master for these
          this.pepTable[ p ].hilbert_master = this.generateFilenameHilbert( codon )
          this.pepTable[ p ].hilbert_preview = this.generateFilenameHilbert( codon )
        } else {
          if ( ispreview ) {
            this.pepTable[ p ].hilbert_preview = this.generateFilenameHilbert( codon )
          } else {
            this.pepTable[p].hilbert_master = this.generateFilenameHilbert( codon )
          }
        }
        log(`ext: ${ this.extension } codon ${codon} index ${p} codons per pixel: ${codonsPerPixelHILBERT}` )
      }
      this.peptide = this.usersPeptide
      this.filePNG = path.resolve( this.imgPath, this.generateFilenamePNG( this.usersPeptide )) // run this to fix nasty globals issue
      this.fileHILBERT = path.resolve( this.generateFilenameHilbert( this.usersPeptide )) // run this to fix nasty globals issue
      // this.pepTable.sort( this.compareHue )

      let zumari = {
        original_source: cfile,
        full_path: this.dnafile,
        maxpix:  this.maxpix,
        name: this.shortnameGenome,
        hilbertimage:  this.fileHILBERT,
        linearimage:  this.filePNG,
        runid: this.timestamp,
        url: url,
        cliruns: cliruns,
        gbprocessed: gbprocessed,
        hostname: hostname,
        version: version,
        flags:
        ( this.force ? "F" : ""    ) +
        ( this.userCPP == "auto"  ? `C${ this.userCPP }` : ""    )+
        (  this.devmode ? "D" : ""    )+
        (  this.args.ratio || this.args.r ? `${ this.ratio }` : "   "    )+
        (  this.args.magnitude || this.args.m ? `M${ this.dimension }` : "   " ),
        aspect: this.ratio,
        bytes:  this.baseChars,
        estimatedPixels: this.estimatedPixels,
        genomeSize:  this.genomeSize,
        accuracy: this.estimatedPixels / this.genomeSize,
        noncoding:  this.errorClock,
        codonsPerPixel:  this.codonsPerPixel,
        codonsPerPixelHILBERT: codonsPerPixelHILBERT,
        pixelClock: this.pixelClock,
        pixhilbert: hilbPixels[ this.dimension ],
        shrinkFactor: shrinkFactor,
        overSampleFactor: overSampleFactor,
        opacity: this.opacity,
        magnitude:  this.magnitude,
        dimension:  this.dimension,
        previewdimension: defaultPreviewDimension,
        blackPoint: blackPoint,
        darkenFactor: darkenFactor,
        highlightFactor: highlightFactor,
        correction: "Expand",
        finish: new Date(),
        blurb: this.blurb(),
        runningDuration: this.runningDuration,
        totalmem: os.totalmem(),
        platform: os.platform(),
        loadavg: os.loadavg(),
        ishighres: ishighres
      }
      let histogramJson = {
        summary: zumari,
        args: this.args,
        pepTable: this.pepTable
      }
      if ( debug === true && this.quiet == false) {
        // console.log( histogramJson  )
        // output( beautify( histogramJson, null, 2, 100) )

      }
      aminosee_json = histogramJson
      return histogramJson
    }


    setupRender(file) { // blank all the variables
      if ( renderLock === true) { error("draining threads from render setup"); return false }
      mode(`setup render`)
      // output(blueWhite(status))
      // output(status)
      this.startDate = new Date() // required for touch locks.
      this.started = this.startDate.getTime() // required for touch locks.
      this.baseChars =  this.genomeSize = this.charClock = this.codonsPerSec =  this.red  =  this.green  =  this.blue  = 0
      this.peakRed  =  this.red
      this.peakGreen  =  this.green
      this.peakBlue  =  this.blue
      this.peakAlpha  =  this.alpha
      this.focusTriplet = "Reference"
      this.breakClock = 0
      this.msElapsed = this.runningDuration = this.charClock = this.percentComplete = this.genomeSize = this.pixelClock = 0
      this.codonRGBA = this.mixRGBA = [0,0,0,0] // this.codonRGBA is colour of last codon,  this.mixRGBA is sum so far
      this.msPerUpdate = minUpdateTime // milliseconds per  update
      this.red   = 0
      this.green = 0
      this.blue  = 0
      this.alpha = 0
      this.charClock = 0 // its 'i' from the main loop
      this.errorClock = 0 // increment each non DNA, such as line break. is reset after each codon
      this.breakClock = 0
      streamLineNr = 0
      this.genomeSize = 1
      this.opacity  = 1 / this.codonsPerPixel // 0.9 is used to make it brighter, also due to line breaks
      this.isDiskFinHTML = true
      this.isDiskFinHilbert = true
      this.isDiskFinLinear = true
      this.isStorageBusy = false
      ispreview = false // only set true after saving out highres docs


      this.dnafile = path.resolve( cfile )
      this.shortnameGenome = this.genomeCanonicalisaton( this.dnafile )
      for (var h=0; h < dnaTriplets.length; h++) {
        dnaTriplets[h].Histocount = 0
      }
      this.outputPath = path.join( webroot, "output")
      this.setNextFile()
      this.autoconfCodonsPerPixel()
      if (this.test) {
        // output(`MAYBE DID I SKIP TEST`)
        // this.testInit()
        return false
      }
      this.setNextFile()


      this.rgbArray = []
      this.antiAliasArray = []
      mode(`setup render`)

      for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
        this.pepTable[ p ].Histocount = 0
        this.pepTable[ p ].z = p
        this.pepTable[ p ].src = this.aminoFilenameIndex( p )[1]

        // IMAGE DATA ARRAYS
        this.pepTable[ p ].mixRGBA  = hsvToRgb(this.pepTable[p].Hue, 0.5, 1.0)
        this.pepTable[ p ].hm_array = [] // garbage collect
        this.pepTable[ p ].lm_array = []
        // FILENAMES
        this.pepTable[ p ].linear_master =  this.aminoFilenameIndex( p )[0]
        this.pepTable[ p ].linear_preview = this.aminoFilenameIndex( p )[1]
        this.pepTable[ p ].hilbert_master = this.aminoFilenameIndex( p )[2]
        if ( ishighres === true ) {
          this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[3]
        } else {
          this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[3]

        }
      }
       this.aminoFilenameIndex( 0 )[0]
    }



    setupKeyboardUI() {
      this.keyboard = true
      // make `process.stdin` begin emitting "keypress" events
      keypress(process.stdin)
      // keypress.enableMouse(process.stdout); // wow mouse events in the term?
      // process.stdin.on('mousepress', function (info) {
      //   bugout('got "mousepress" event at %d x %d', info.x, info.y);
      // });
      var that = this
      try {
        process.stdin.setRawMode(true)
      } catch(err) {
        log(`Could not use interactive keyboard due to: ${err}`)
        notQuiet("Probably you are running from a shell script. --keyboard mode requires interactive shell.")
        destroyKeyboardUI()
      }
      process.stdin.resume() // means start consuming
      // listen for the "keypress" event
      process.stdin.on("keypress", function (ch, key) {
        // term.down(1)
        if ( typeof key === "undefined") {
          log("undefined key")
          return
        }
        out(`got keypress: ${ chalk.inverse( key.name )}`)

        if ( key ) {

          if ( key.name == "q" || key.name == "escape" ) {
            killServersOnQuit = false
            that.gracefulQuit(0, "Q esc")
          } else if ( !key.ctrl || key.name !== "c") {
            if ( autoStartGui && key.name == "g") {
              output(`Starting GUI from key command: ${key.name} ${status}`)
              // killAllTimers()
              if ( status == "module exit" ) {
                startGUI()
              }
            }
          }
          // Interactive control:    D (demo full RGB test)    T (short test)   Q (graceful quit next save)
          // V (toggle verbose mode) B (live DNA to screen)    Esc (graceful quit)    Control-C (fast quit)
          // W (webserver)           C (clear scrn)            U (updates stats)       X (search ~ for DNA)
          // O (open images after render)                      or [space]       G  (experimental carlo GUI)

          if ( key.ctrl && (key.name == "c" || key.name == "d"  )) {
            process.stdin.pause() // stop sending control-c here, send now to parent, which is gonna kill us on the second go with control-c
            status  = "TERMINATED WITH CONTROL-C"
            cliInstance.gracefulQuit(130, "Control-c bo")
            destroyKeyboardUI()
            if ( renderLock === true && this.timeRemain < 10000) {
              cliInstance.msPerUpdate = 800
              output("Closing in 5 seconds. Press [Esc] or [Q] key")
              setTimeout(()=> {
                cliInstance.gracefulQuit(130, "Control-c")
                output(blueWhite("Press control-c again to exit"))
              }, 5000)
            } else {
              cliInstance.quit(130, "Control-c")
            }
          }
          if ( key.name == "s") {
            mode("demo")
            this.demo = true
            runDemo()
          }
          if ( key.name == "t") {
            mode("pushing this.test onto render queue")
            cliInstance.args._.push("test")
            cliInstance.howMany = cliInstance.args.length
            cliInstance.generateTestPatterns()
          }
          if ( key.name == "c") {
            clearCheck()
          }
          if ( key.name == "d") {
            runDemo()
            // that.toggleDebug()
          }
          if ( key.name == "b") {
            clearCheck()
            that.togglednabg()
          }
          if ( key.name == "g" || key.name == "enter") {
            startGUI()
          }
          if ( key.name == "s") {
            clearCheck()
            that.toggleServer()
          }
          if ( key.name == "f") {
            that.toggleForce()
          }

          if ( key.name == "v") {
            clearCheck()
            that.toggleVerbose()
          }
          if ( key.name == "o") {
            clearCheck()
            that.toggleOpen()
          }
          if ( key.name == "o") {
            clearCheck()
            that.toggleOpen()
          }
          if ( key.name == "w") {
            term.clear()
            that.toggleClearScreen()
          }
          if ( key.name == "space" || key.name == "enter") {
            clearCheck()
            that.msPerUpdate  = minUpdateTime
          }
          if ( key.name == "u") {
            that.msPerUpdate  = minUpdateTime
            if ( that.updates === true) {
              that.updates = false
              killAllTimers()
              // clearTimeout( that.updatesTimer);
            } else {
              that.updates = true
            }
          }
        }


      })
      // process.on('exit', function () {
      // disable mouse on exit, so that the state
      // is back to normal for the terminal
      // keypress.disableMouse(process.stdout);
      // });

    }
    toggleOpen() {
      this.openHtml = ! this.openHtml
      if ( this.openHtml) {
        this.openImage = true
        this.openFileExplorer = true
      } else {
        this.openImage = false
        this.openFileExplorer = false
      }
      log(`Will ${( this.openHtml ? "" : "not " )} open images, reports and file explorer when done.`)
    }
    toggleVerbose() {
      verbose = !verbose
      log(`verbose mode ${verbose}`)
    }



    togglednabg() {
      this.dnabg = !this.dnabg
      clearCheck()
      log(`dnabg mode ${this.dnabg}`)
    }
    toggleServer() {
      webserverEnabled = !webserverEnabled
      if ( webserverEnabled ) {
        output("start server")

        // pushCli('--serve');
        // output( server.foregroundserver() )
        // server.start( generateTheArgs() )
        autoStartGui = false

      } else {
        killServers()
      }

    }
    toggleDebug() {
      debug = !debug
      if (debug === true) {
        raceDelay  += 1000 // this helps considerably!
      }
      if (debug == false) {
        raceDelay  -= 100
      }
      output("AminoSee has been slowed to " + raceDelay )
    }
    toggleDevmode() {
      this.devmode = !this.devmode

    }
    toggleForce() {
      this.force = !this.force
      log(`force overwrite toggled ${this.force}`)
    }

    toggleClearScreen() {
      this.clear = !clear
      log("clear screen toggled.")
    }
    toggleUpdates() {
      this.updates = !this.updates
      log(`stats this.updates toggled to: ${this.updates}`)
      if ( this.updates) {
        this.drawHistogram()
      }
    }
    gracefulQuit(code, reason) { // delete the locks files and exit if not projecting a hilbert
      if ( typeof code === "undefined" ) {
        code = 0
        reason = "no reason"
      }
      mode( `Graceful shutdown in progress... ${code} ${reason} `)

      bugtxt("webserverEnabled: " + webserverEnabled + " killServersOnQuit: "+ killServersOnQuit)
      isShuttingDown = true
      this.args._= []
      cliInstance.args._= []
      // remain = 1
      batchSize = 0
      // debug = true
      // this.devmode = true
      this.updates = false
      if (this.devmode === true) {
        output("Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly that.test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rende that.red  but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry; this way AminoSee will skip the large genome becauyse it has a lock file, saving me CPU during development. Lock files are safe to delete.")
      } else {
        deleteFile( this.fileTouch ) // removeLocks( this.fileTouch, this.devmode );
      }

      server.stop()

      if ( this.isStorageBusy) {
        output( status + blueWhite( `${status} stopping rendering: ${this.justNameOfPNG}` ) )
      } else {
        output(`will terminate after saving this hilbert projection`)
        setImmediate( () => { printRadMessage( `exiting` ); this.quit(0, "graceful"); })
      }
    }

    downloadMegabase(cb) {
      cfile = "megabase.fa"

      if (typeof cb === "undefined") {
        error(`you need to pass callback to downloadMegabase`)
      }
      let promiseMegabase = new Promise(function(resolve,reject) {
        try {
          var exists = doesFileExist( cfile)
        } catch(err) {
          log("e:" + err)
        }
        if (exists) {
          resolve()
          runcb(cb)
        } else {
          if (runTerminalCommand("wget https://www.funk.co.nz/aminosee/dna/megabase.fa")) {
            resolve()
          } else {
            reject()
          }
          runcb(cb)
        }
      })

      output(chalk.rgb(255,255,255)("Getting some DNA..."))
      // promiseMegabase.resolve();
      return promiseMegabase
    }

    nowAndNext() {
      return fixedWidth(18, cfile) + " " + fixedWidth(18, this.nextFile)
    }
    runTerminalCommand(str) {
      output(`[ running terminal command ---> ] ${str}`)
      exec(str, ( error, stdout, stderr) => {
        error("runTerminalCommand " +  this.error)
        output(stdout)
        error("runTerminalCommand " + stderr)
        if ( this.error) {
          return false
        } else {
          return true
        }
      })
    }



    aPeptideCodon(a) {
      return a.Codon.toUpperCase().substring(0, 4) == this.peptide.toUpperCase().substring(0, 4)
    }
    pepToColor(pep) {
      let temp = this.peptide
      this.peptide = pep // aPeptideCodon depends on this global
      let clean = this.pepTable.filter(aPeptideCodon)
      this.peptide = this.usersPeptide
      if (clean.length > 0 ) {
        return hsvToRgb(clean[0].Hue, 0.5, 1.0)
      } else {
        return [0,0,0,0]
      }
    }
    createJob(cb) {
      return new Promise(function(resolve,reject) {
        ( cb ? resolve() : reject() )
      })
    }


    storage() {
      return `${( !this.isDiskFinLinear ? "Linear" : "OK ")} ${( !this.isDiskFinHilbert ? "Hilbert" : "OK ")} ${( !this.isDiskFinHTML ? "HTML" : "OK " )}`
    }

    setNextFile() {
      remain = this.args._.length
      if ( this.args._.length > 0 ) {
        cfile = this.args._[0]
      } else if ( !this.test ){
        this.quit(0, `set next file`);
        return false;
      }

      try {
        this.nextFile = path.basename( path.resolve( this.args._[1] )) // not the last but the second to last
      } catch(e) {
        this.nextFile = "...Finito..."
      }

      this.dnafile = path.resolve( cfile )
      cfile = path.basename( this.dnafile )
      this.shortnameGenome = this.genomeCanonicalisaton()
      // mode( `${batchProgress()} checking file ${cfile} ${remain}` )
      // procTitle( status )

      if ( typeof this.args._[1] === "undefined" ) {
        this.nextFile = "...Loading..."
        return false
      } else if (doesFileExist( this.nextFile)) {
        if ( this.checkFileExtension( path.resolve( this.nextFile )) == false ) {
          this.nextFile += chalk.inverse(" (will skip) ")
        } else {
          this.nextFile += chalk.inverse(" (will render) ")
        }
        return true
      }
    }
    pollForStream( reason ) {
      let msg
      mode( `pre-polling ${reason}`)
      redoline(status)
      if ( renderLock === true ) {
        mode(`removing thread ${ cfile } ${ this.busy() } ${ this.storage() } reason: ${reason}`)
        error( `P: ${ maxWidth(24,  status)} ` )
        return false
      } else {
        mode(`Polling for work... ${reason} ${streamLineNr}`)
      }
      this.setNextFile()

      if ( this.test === true || this.demo ) { // uses a loop not polling.
        // error("test is in look for work?")
        log("test is in look for work?")
        return false
      }
      mode(`Validating file`)
      if ( this.isStorageBusy ) {
        error(`thread re-entry in prepare state ${this.justNameOfPNG}`)
        return false
      }

      // terminateIfUndef(cfile)
      if (remain <= 0) {
        mode("Happiness.")
        data.saySomethingEpic()
        log(chalk.bgRed.yellow( `R: ${status} ` ))
        this.quit(0, status)
        return false
      }

      mode(`parsing file`)

      if ( cfile.indexOf("...") !== -1 || cfile.indexOf("AminoSee_BUSY") !== -1 ) {
        mode( "Cant use files with three dots in the file ... (for some reason?)")
        this.preRenderReset( status )
        return false
      }
      if ( cfile.indexOf("AminoSee_BUSY") !== -1 ) {
        mode( "Stating lock files hmmm")
        this.preRenderReset( status )
        return false
      }
      if ( typeof cfile === "undefined") {
        mode("undefined after resolve: " + cfile)
        this.preRenderReset( status )
        return false
      }
      if ( fileSystemChecks( cfile )  == false ) {
        mode(`Failed filesystem check: ${ cfile } (probably file was not found)`)
        bugtxt(status)
        this.preRenderReset( `R: ${status} ` )
        return false
      }
      redoline(status)
      this.genomeCanonicalisaton(cfile)
      remain = this.args._.length

      // try {
      //   this.dnafile = path.resolve( cfile )
      // } catch(err) {
      //   mode(	"failed file system checks: " + cfile)
      //   notQuiet( status )
      //   this.preRenderReset( status )
      //   return false
      // }


      webroot = locateWebroot( this.dnafile )
      this.outputPath = path.resolve( webroot, "output")
      this.imgPath = path.resolve( this.outputPath, this.shortnameGenome, "images")

      // see if we have writable folder:
      if ( this.mkdir() ) {
        bugtxt("Success writable folder")
      } else {
        error("That's weird. Couldn't create a writable output folder at: " + this.outputPath + ". You can set custom output path with --output=~/newpath")
        this.preRenderReset("no write permission")
      }
      if ( cfile == funknzlabel ) {
        error("funknzlabel")
        this.preRenderReset("funknzlabel " + cfile)
        return false
      }

      if ( remain < 0 ) {
        reason = "outa work - last render"
        mode(reason)
        this.quit(0, reason)
        return false
      }
      if ( typeof this.dnafile === "undefined" || typeof cfile === "undefined") {
        reason = "dnafile is undefined"
        mode(reason)
        this.preRenderReset(reason)
        return false
      }

      if ( isShuttingDown == false && remain <= 0 ) { this.quit(0, "ran out of files to process") }
      if ( this.test ) { log("RETURNING FALSE"); return false }
      // if ( cfile == funknzlabel) { // maybe this is to get past my lack of understanding of processing of this.args.
      // 	return false
      // }
      if ( this.demo === true ) {
        output("demo mode (disabled?)")
        runDemo()
        return false
      }
      if (!this.checkFileExtension( this.dnafile )) {
        let msg = `${ batchProgress() } wrong file extension: ${cfile}. Must be one of ${ extensions }`
        notQuiet(msg)
        if ( remain > 0 && !renderLock) {
          this.preRenderReset(msg)
        } else {
          error("Bargle!")
        }
        return false
      }
      if ( doesFolderExist(this.dnafile ) ) { // FOLDER CHECK
        let asterix = `${ cfile }/*`
        let msg = `If you meant to render everything in (${cfile}), try using an asterix on CLI:  ${chalk.italic.bold(  "aminosee " +  asterix)}`
        notQuiet(msg)
        log(`${this.dnafile}`)
        // countdown(`opening ${asterix} in `, 1000, () => {
        log(`Pushing folder for processing... ${asterix} (disabled)`)
        // pushCli(asterix);
        // })
        this.preRenderReset(msg)
        return false
      }

      if (doesFileExist(this.dnafile ) == false) {
        this.preRenderReset(`${this.dnafile } No File Found`)
        return false
      }
      if (charAtCheck(this.dnafile ) == false) {
        this.preRenderReset("charAtCheck returned false: "+ this.dnafile )
        return false
      }
      if ( this.checkFileExtension( cfile ) == false)  {
        msg = `File Format not supported: (${ this.getFileExtension( cfile)}) Please try: ${ extensions }`
        mode(msg)
        log( msg )
        this.preRenderReset(msg)
        return false
      }
      if (doesFolderExist(this.dnafile ) ) {
        msg = `${cfile} is a folder not a file, will try to re-issue job as ${cfile}/* to process all in dir`
        mode(msg)
        this.preRenderReset(msg)
        return true
      }


      ///////////////// BEGIN MODIFYING GLOBALS //////////////////////////////
      if ( renderLock ) { error("draining threads from reset"); return false }
      mode("setup render " + this.busy() + " " + cfile)
      msg = `>>> PREFLIGHT <<< ${ remain } ${this.usersPeptide} ${ path.normalize( cfile )} reason: ${reason}`
      log(msg)
      redoline(msg)
      if (this.extension === "zip") {
        // streamingZip(this.dnafile )
        msg = `${cfile } is a ZIP file`
        // this.safelyPoll(msg)
        this.preRenderReset(msg)

        return false
      }
      this.justNameOfPNG = this.generateFilenamePNG( this.usersPeptide )
      this.filePNG = path.resolve( this.imgPath,  this.justNameOfPNG )
      this.setupRender( cfile )
      mode(`Checking for previous render of ${   this.filePNG } ${this.usersPeptide}`)
      log(status)

      if (doesFileExist(this.filePNG)) {
        let msg = `Already rendered -->>  ${this.justNameOfPNG}`
        mode(msg)
        output( blueWhite( msg ))
        addToRendered(this.shortnameGenome) // in case histogram file is deleted
        this.openOutputs()
        this.previousImage = this.filePNG
        if ( verbose ) {
          mode(`drawing image`)
          termDrawImage(this.filePNG, msg, () => { log( status ) })
        }
        if ( !this.force ) {
          mode( `${status} so skipping.`)
          // notQuiet(status)
          setTimeout( () => {
            cliInstance.preRenderReset(status)
          }, raceDelay)
          return false // flow goes via preRenderReset above
        } else {
          mode( `${status} But lets render it again anyway?!`)
          // output( status )
        }
      }


      // if ( renderLock == false) {
      if ( this.isInProgress( this.fileTouch )) {
        let msg = "Render already in progress"
        output( blueWhite( msg )) // <---  another node maybe working on, NO RENDER
        mode(msg + this.justNameOfPNG)
        log("Use --force to continue to replace the image or delete the touch file:")
        log( chalk.italic(`rm ${path.normalize( this.fileTouch )}`) )
        this.preRenderReset (msg)
        return false
      }
      mode(`Lock OK proceeding to render ${ this.justNameOfPNG } in ${ raceDelay } ms... ${ this.busy() }`)
      log( `S: ${status} ` )
      this.setupRender( cfile )

      if ( renderLock === false) {
        setTimeout( () => {
          if ( renderLock === false) {
            this.touchLockAndStartStream() // <<<<------------- THIS IS WHERE MAGIC STARTS!!!!
          } else {
            output(`wtf`)
          }

        }, raceDelay)
      } else {
        output(`double wtf`)
      }
    }

    firstRun() {
      output(chalk.bgRed   ("First run demo!"))
      output(chalk.bgYellow("First run demo!"))
      output(chalk.bgGreen ("First run demo!"))
      runDemo()
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
    preRenderReset(reason){
      mode(`${batchProgress()} Pre render reset`) //  (${ this.storage()} ${ this.busy()}) Reason ${reason} Storage:  current: ${ cfile } next: ${ this.nextFile}`)
      status = maxWidth( tx / 2, status)
      log( status)

      if ( renderLock ) { error("draining threads from reset"); return false }
      if ( typeof reason === "undefined" ) { error("must set a reason when using reset") }
      if ( remain < 1 ) { this.quit(0, "finished") ; return false }

      if ( brute ) { // incrementally render all amino acids via disk thrashing
        bruteRemain--
        if (bruteRemain <= 0 ) { // or set back to 24
          bruteRemain = data.pepTable.length
          output(`completed brute-disk rendering method!`)
        } else {
          this.peptide = this.usersPeptide = data.pepTable[ bruteRemain - 1 ].Codon // good ole off by one error
          output(`brute remain ${bruteRemain}. Forcing change of usersPeptide to ${this.usersPeptide}`)
        }
      }


      this.setIsDiskBusy( false )
      killAllTimers()
      try {
        remain = this.args._.length
      } catch(err) {
        remain = 0
        // return false
      }
      if (remain < 1 ) {
        this.quit(0, "Finito hombre")
        return false
      }
      cfile = this.args._.shift()
      this.setNextFile()

      setTimeout( () => {

        if ( !renderLock ) {
          this.safelyPoll(`>>> next file`)
        } else {
          error("dabba do rendering")
        }
      }, raceDelay)
    }
    initStream() {

      if ( isShuttingDown === true ) { output(`Shutting down after this render ${ blueWhite(this.justNameOfPNG)}`) }
      if ( renderLock === false ) {
        error("RENDER LOCK FAILED. This is an  error I'd like reported. Please run with --verbose --devmode option enabled and send the logs to aminosee@funk.co.nz")
        return false
      }
      mode(`Initialising Stream: 🚄 ${this.usersPeptide} ${this.shortnameGenome} Filesize ${bytes( this.baseChars)}`)
      notQuiet( chalk.rgb(64, 128, 255).bold( status ))
      log(`Output folder --->> ${ blueWhite( blueWhite( cfile ))}`)
      this.timestamp = Math.round(+new Date()/1000)
      cpuhit = 0 // used to try and track down a race condition darn it
      this.runid = new Date().getTime()


      // this.mkRenderFolders() // create /images etc
      this.rawDNA = "@"
      this.percentComplete = 0
      this.genomeSize = 0 // number of codons.
      this.pixelStacking = 0 // how we fit more than one codon on each pixel
      this.pixelClock = 0 // which pixel are we painting?
      this.msElapsed  = 0
      this.rgbArray = []
      this.hilbertImage = [];
      tups = 0
      killAllTimers()


      this.initialiseArrays()
      // this.setupProgress()
      this.setIsDiskBusy( false )

      // if ( this.quiet == false ) {
      //   term.up( termDisplayHeight +   termHistoHeight *2);
      //   term.eraseDisplayBelow();
      // }

      this.progressTick()

      if ( this.willRecycleSavedImage && this.recycEnabled) {
        output(`Skipped DNA render stage of ${ this.shortnameGenome}`)
        log("AM PLANNING TO RECYCLE TODAY (joy)")
        this.recycleOldImage( this.filePNG )
        return false
      } else {
        log("Not recycling")
      }
      // startStreamingPng();
      let msg = `Streaming ${this.usersPeptide} ${bytes( this.baseChars )} c${ this.codonsPerPixel } m${this.dimension}`
      procTitle( "streaming" )
      mode( msg )

      try {
        let closure = path.resolve( this.dnafile )
        let readStream = fs.createReadStream( closure ).pipe(es.split()).pipe(es.mapSync(function(line){
          readStream.pause() // pause the readstream during processing
          cliInstance.processLine(line) // process line here and call readStream.resume() when ready
          setImmediate( () => {
            readStream.resume()
          })
        })
        .on("start", function(){
          mode(`${batchProgress()} on start`)
          log(status)
        })
        .on("error", function(err){
          mode(`stream error ${err} file: ${cfile} while starting stream. renderLock: ${ renderLock } storage: ${this.storage()}`)
          error( status )
        })
        .on("end", function() {
          mode("stream end " + cliInstance.busy())
          log(status)
        })
        .on("close", function() {
          mode(`stream close ${cliInstance.busy()} ${cliInstance.justNameOfPNG} ${cliInstance.usersPeptide}`)
          log(status)
          cliInstance.streamStopped()
        }))
      } catch(e) {
        if ( e == "EISDIR") {
          mode("[EISDIR] Attempted to read a directory as if it were a file.")
        } else {
          mode("Unknown error was caught during streaming init " + e)
        }
        error( status )
      }
      this.streamStarted()
    }
    initialiseArrays() {
      mode(`initialise arrays ${this.usersPeptide}`)
      for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
        this.pepTable[p].lm_array = [0,0,0,0]
        this.pepTable[p].hm_array = [0,0,0,0]
        this.pepTable[p].mixRGBA  = [0,0,0,0]
        this.pepTable[p].linear_master = this.generateFilenamePNG( this.aminoFilenameIndex(p)[1] )
        this.pepTable[p].hilbert_master =  this.generateFilenameHilbert( this.aminoFilenameIndex(p)[0] )
        // output(`${status} ${this.pepTable[p].linear_master}`)
        // this.pepTable[p].linear_master = this.generateFilenamePNG( "Reference" )//  this.aminoFilenameIndex(p)[1]
        // this.pepTable[p].hilbert_master =  this.generateFilenameHilbert( "Reference" )//  this.aminoFilenameIndex(p)[0]

      }
      // this.filePNG = path.resolve( this.imgPath, )
    }
    diskStorm(cb) {
      log("WE BE STORMIN")
      if ( brute === false) { runcb(cb); return false }
      // killAllTimers()
      output("LIKE NORMAN")

      for ( let p = 1; p < this.pepTable.length; p++ ) { // standard peptide loop
        let pep = this.pepTable[ p ]
        let currentLinearArray  =  this.pepTable[ p ].lm_array
        let currentHilbertArray =  this.pepTable[ p ].hm_array

        mode("disk storm " + p)
        let pixels, width, height = 0
        let pwh = this.pixWidHeight()

        pixels = pwh[0]
        width  = pwh[1]
        height = pwh[2]

        let fullpath = path.resolve( this.outputPath, this.shortnameGenome, "images", pep.linear_master)
        log(`Saving amino acid layer ext ${ this.extension } cppH ${ codonsPerPixelHILBERT } ${ pep.Codon } ${pixels} ${width} ${height} size: ${currentLinearArray.length} ${fullpath}`)
        genericPNG( currentLinearArray, width, height, fullpath)

        fullpath = path.resolve( this.outputPath, this.shortnameGenome, "images", pep.hilbert_master)
        log(`saving to ${fullpath}`)
        if ( p == this.pepTable.length -1 ) { // trigger the callback on the last one
          genericPNG( currentHilbertArray, width, height, fullpath , () => {
            // this.hilbertFinished() // DISK STORM
          })
        } else {
          genericPNG( currentHilbertArray, width, height, fullpath)
        }
        this.pepTable[ p ].lm_array = [] // try save memory
        this.pepTable[ p ].hm_array = [] // try save memory

      }
      cb()
    }
    streamStarted() {
      if ( renderLock == false ) {
        log("streamStarted")
        return false
      }
      mode(`Starting stats display for ${cfile} started at ${ formatAMPM(this.startDate) }`)
      this.calcUpdate()
      this.manageLocks(fileLockingDelay)


      setImmediate(() => {
        term.eraseDisplayBelow()
        if ( renderLock === true ) {
          this.drawHistogram()
        } else {
          out("streaming")
          error(`render finished too fast for stats ${ this.justNameOfPNG }`)
        }
      })
    }
    manageLocks(time) {
      // if ( typeof this.lockTimer !== "undefined") { clearTimeout(this.lockTimer) }
      // clearTimeout(this.lockTimer)
      if ( isShuttingDown === true ) { return false }
      var that = this

      this.lockTimer = setTimeout( () => {
        if ( renderLock === true ) {
          that.fastUpdate()
          if (  that.percentComplete < 0.9 &&  that.timeRemain > 20000 ) { // helps to eliminate concurrency issues
            // that.mkRenderFolders("manage locks")
            if ( debounce(10000) === true ) {
              that.tLock()
            }
            if (time < 60001) { time + 10000 }
            that.manageLocks(time)
          } else {
            log("Over 90% done / less than 20 seconds: " + nicePercent(that.percentComplete) + " time remain: " + humanizeDuration( that.timeRemain))
          }
        } else {
          out("Stopped")
        }
      }, time)
    }

    streamStopped() {
      ishighres = this.genomeSize > hilbPixels[ defaultPreviewDimension ]
      this.setIsDiskBusy(true)

      mode( (ishighres ? "HIGH RESOLUTION" : "STANDARD ") + " resolution streaming disk read stopped.")
      log( blueWhite( status ) )
      term.eraseDisplayBelow()
      this.percentComplete = 1
      this.calcUpdate()
      this.percentComplete = 1
      streamLineNr = 0

      killAllTimers()

      let pixels // = 0;
      mode(`Preparing to save ${this.usersPeptide} ${ this.justNameOfPNG } to ${this.outputPath} ratio: ${this.ratio}`)
      procTitle(  "saving" )
      log( `S: ${status} ` )
      if ( renderLock === false) {
        error("How is this even possible. renderLock should be true until all storage is complete. Jenkins!")
        return false
      }
      this.percentComplete = 1 // to be sure it shows 100% complete
      this.calcUpdate()
      this.percentComplete = 1 // to be sure it shows 100% complete
      try {
        pixels = ( this.rgbArray.length / 4)
      }
      catch (err) {
        let msg = `EXCEPTION DURING this.rgbArray.length / 4 = ${err}`
        rollbackFolder()
        error(msg)
        removeLocks( this.fileTouch, this.devmode, msg )
        return false
      }
      redoline(chalk.inverse(`Finished linear render of ${ this.shortnameGenome}. Array length: ${ pixels.toLocaleString() } = ${ this.pixelClock.toLocaleString() } saving images`))
      if ( pixels < 64 ) {
        let msg = `less than 64 pixels produced: pixels = ${pixels}`
        mode(msg)
        rollbackFolder()
        data.saySomethingEpic()
        if ( !renderLock ) {
          mode(`${batchProgress()} Either there is too little DNA in this file for render at ${ this.codonsPerPixel } codons per pixel, or less than 64 pixels rendered: ${pixels} pixels rendered from ${ cfile }` )
        } else {
          error("DRAINING surplus thread...")
        }
        out(blueWhite(`Less than 64 pixels`))
        this.setIsDiskBusy(false)
        rollbackFolder()
        removeLocks( this.fileTouch, this.devmode, msg )
        return false
      }

      if (this.test === true) { // the calibration generates its own image
        shrinkFactor = 1
      } else { // regular DNA processing
        userprefs.aminosee.cliruns++ // = cliruns // increment run counter. for a future high score table stat and things maybe.
        cliruns = userprefs.aminosee.cliruns
        gbprocessed  = userprefs.aminosee.gbprocessed
        gbprocessed +=  this.baseChars / 1024 / 1024 / 1024 // increment disk counter.
        userprefs.aminosee.gbprocessed = gbprocessed // i have a superstition this way is less likely to conflict with other threads
        addToRendered( this.shortnameGenome )
      }

      this.saveDocsSync( () => { log(`stream closed, saving to storage initiated`) })

    }
    showFlags() {
      return `${(  this.force ? "F" : "-"    )}${( this.updates ? "U" : "-" )}C_${ this.userCPP }${( this.keyboard ? "K" : "-" )}${(  this.dnabg ? "B" : "-"  )}${( verbose ? "V" : "-"  )}${(  this.artistic ? "A" : "-"    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : "---"    )}${( this.dimension ? "M" + this.dimension : "-")}${( this.reg?"REG":"")} C${ onesigbitTolocale( this.codonsPerPixel )}${( brute ? "BRUTE" : "-" )}${( this.index ? "I_" : "_" )}${ this.maxpix.toLocaleString() }`
    }
    testSummary() {
      return `TEST
      this.shortnameGenome: <b>${ this.shortnameGenome}</b>
      Registration Marks: ${( this.reg ? true : false )}
      ${ isHighlightSet ?  "Highlights: " + ( this.peptide || this.triplet) : " "}
      Your custom flags: TEST${(  this.force ? "F" : ""    )}${(  this.userCPP == "auto"  ? `C${ this.userCPP }` : ""    )}${(  this.devmode ? "D" : ""    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : ""    )}${(  this.args.magnitude || this.args.m ? `M${ this.dimension }` : ""    )}
      ${(  this.artistic ? " Artistic this.mode" : " Science this.mode"    )}
      Max magnitude: ${ this.dimension } / 10 Max pix: ${ this.maxpix.toLocaleString()}
      Hilbert Magnitude: ${ this.dimension } / ${defaultMagnitude}
      Hilbert Curve Pixels: ${hilbPixels[ this.dimension ]}`
    }
    renderObjToString() {
      const unknown = "unknown until render complete"
      return `
      Canonical Name: ${ this.shortnameGenome }
      Canonical PNG: ${ this.justNameOfPNG }
      Source: ${ cfile}
      Full path: ${this.dnafile }
      Started: ${ formatAMPM(this.startDate) } Finished: ${ formatAMPM(new Date())} Used: ${humanizeDuration( this.runningDuration )} ${ this.isStorageBusy ? " " : "(ongoing)"}
      Machine load averages: ${ this.loadAverages()}
      Bandwidth: ${ bytes( this.bytesPerMs * 1000 ) } / sec DNA Filesize: ${ bytes( this.baseChars ) }
      Image Output bytes: ${ this.isStorageBusy === true ? bytes( this.rgbArray.length ) : "(busy)" }
      Pixels (linear): ${ this.pixelClock.toLocaleString()} Image aspect Ratio: ${ this.ratio }
      Pixels (hilbert): ${hilbPixels[ this.dimension ]} ${(  this.dimension ? "(auto)" : "(manual -m)")} Dimension ${ this.dimension } Hilbert curve
      Linear to Hilbert reduction: ${ this.isStorageBusy ?  twosigbitsTolocale( shrinkFactor) : unknown } Oversampling: ${ twosigbitsTolocale(overSampleFactor)}
      Custom flags: ${ this.showFlags()} "${( this.artistic ? "Artistic mode" : "Science mode" )}" render style
      Estimated Codons: ${Math.round( this.estimatedPixels).toLocaleString()} (filesize % 3)
      Actual Codons matched: ${ this.genomeSize.toLocaleString()} ${ this.isStorageBusy ? " " : "(so far)" }
      Estimate accuracy: ${ this.isStorageBusy ? Math.round((( this.estimatedPixels /  this.genomeSize))*100) + "% of actual ": "(still rendering...) " }
      Non-coding characters: ${ this.errorClock.toLocaleString()}
      Coding characters: ${ this.charClock.toLocaleString()}
      Codons per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )} (linear) ${ this.isStorageBusy ? twosigbitsTolocale( codonsPerPixelHILBERT ) : unknown } (hilbert projection)
      Max pix setting: ${ this.maxpix.toLocaleString()}
      Darken Factor ${ twosigbitsTolocale(darkenFactor)} / Highlight Factor ${ twosigbitsTolocale( highlightFactor)} Black Point: ${blackPoint}
      ${ onesigbitTolocale( gbprocessed ) } Gigabytes processed on ${ hostname }:
      Render serial: ${ cliruns.toLocaleString() } Render UID: ${ this.timestamp }
      AminoSee version: ${version}`
    }



    // CODONS PER PIXEL
    autoconfCodonsPerPixel() {
      mode("autoconf")
      // dont mess with globals if not appropriate
      if ( renderLock ) { error("thread entered autoconf") ; return false}
      if ( this.test ) { log("Not configuring - due to test"); return false}
      if ( this.dnafile == funknzlabel ) { error("no"); return false }
      // grab an estimate based on file size
      this.baseChars = this.getFilesizeInBytes( this.dnafile ) // returns -1 if streaming standard in infinitely
      if ( this.baseChars < 0) { // switch to streaming pipe this.mode,
        // return false
        // error("Are you streaming std in? That part isn't written yet!")
        // this.isStreamingPipe = true; // cat Human.genome | aminosee
        // this.estimatedPixels = 696969; // 696969 flags a missing value in debug
        // this.dimension = this.dimension = 6; // close to 69
        // log("Could not get filesize, setting for image size of 696,969 pixels, maybe use --codons 1 this is rendered with --codons 696");
        // this.baseChars = 696969; // 696969 flags a missing value in debug
        this.codonsPerPixel = 696; // small images with _c69 in this.file
        error(`this.baseChars < 0`)
        // return true
      } else { // use a file
        this.isStreamingPipe = false // cat Human.genome | aminosee
        this.estimatedPixels =  this.baseChars / 3 // divide by 4 times 3
        if ( this.estimatedPixels > 1024 ) {
          log(`est pixels : ${this.estimatedPixels}` )
          this.dimension = optimumDimension ( this.estimatedPixels, "auto" )
        } else {
          let msg = "Not enough pixels to form image"
          output(msg)
          this.preRenderReset(msg)
          return false
        }
      }


      if ( this.estimatedPixels < this.maxpix ) { // for sequence smaller than the screen
        if ( this.userCPP !== "auto" )  {
          output("its not recommended to use anything other than --codons 1 for small genomes")
          this.codonsPerPixel = this.usersCPP
        } else {
          this.codonsPerPixel = 1 // normally we want 1:1 for small genomes
        }
      }

      if ( this.userCPP !== "auto" ) {
        output(`Manual zoom level override enabled at: ${ this.userCPP } codons per pixel.`)
        this.codonsPerPixel = this.userCPP
      } else {
        bugtxt("Automatic codons per pixel setting")
      }

      if ( this.estimatedPixels > this.maxpix ) { // for seq bigger than screen        this.codonsPerPixel = this.estimatedPixels /  this.maxpix*overSampleFactor;
        this.codonsPerPixel = Math.round( this.estimatedPixels /  this.maxpix ) // THIS IS THE CORE FUNCTION
        if ( this.userCPP == "auto" ) {
          if ( this.userCPP < this.codonsPerPixel) {
            output( terminalRGB(`WARNING: Your target Codons Per Pixel setting ${ this.userCPP } will make an estimated ${Math.round( this.estimatedPixels / this.userCPP).toLocaleString()} is likely to exceed the max image size of ${ this.maxpix.toLocaleString()}, sometimes this causes an out of memory  this.error. My machine spit the dummy at 1.7 GB of virtual memory use by node, lets try yours. We reckon ${ this.codonsPerPixel } would be better, higher numbers give a smaller image.`))
          }
        } else {
          this.codonsPerPixel = this.userCPP // they picked a smaller size than me. therefore their computer less likely to melt.
        }
      }

      if ( this.codonsPerPixel < defaultC) {
        this.codonsPerPixel = defaultC
      } else if ( this.codonsPerPixel > 6000) {
        this.codonsPerPixel = 6000
      } else if ( isNaN( this.codonsPerPixel ) || typeof this.codonsPerPixel === "undefined") {
        error("codonsPerPixel is NaN || this.codonsPerPixel is undefined")
        this.codonsPerPixel = defaultC
      }
      if ( this.artistic === true) {
        this.codonsPerPixel *= artisticHighlightLength
        log(`Using ${ this.codonsPerPixel } this.codonsPerPixel for art this.mode`)
      }
      ///////// ok i stopped messing with this.codonsPerPixel this.now

      if ( this.estimatedPixels > 18432000 ) { // if user has not set aspect, small bacteria and virus will be square this.ratio. big stuff is fixed.
        if ( this.userRatio == "auto") {
          log("For large genomes over 18,432,000 codons, I switch to fixed ratio for better comparison to the Hilbert images. Use --ratio=square or --ratio=golden to avoid this.")
          this.ratio = "fix" // small genomes like "the flu" look better square.
        } else {
          this.ratio = "sqr" // small genomes like "the flu" look better square.
        }
      }

      /// if user has set -m5 to reduce size from the default -m7
      // then keep dimension auto value lower by 1 than default
      if ( this.magnitude == "custom" ) {
        let increase = defaultMagnitude - this.dimension
        this.codonsPerPixel = this.codonsPerPixel + increase
        output(`Increased codons per pixel by ${increase} to ${this.codonsPerPixel}`)
      }
      log(`Codons per pixel is ${this.codonsPerPixel}`)

      return this.codonsPerPixel
    }

    removeFileExtension(f) {
      return f.substring(0, f.length - ( this.getFileExtension(f).length+1))
    }

    calcHilbertFilename() {
      mode(`calc hilbert filename`)
      // REQUIRES RENDERING TO MEMORY PRIOR

      // let { shrinkFactor, codonsPerPixelHILBERT } =
      calculateShrinkage( this.pixelClock, this.dimension, this.codonsPerPixel )
      // log(`calcHilbertFilename shrinkFactor, codonsPerPixelHILBERT ${shrinkFactor}, ${codonsPerPixelHILBERT}`)

      for ( let p = 0; p < this.pepTable.length; p++ ) { // add correct filenames to json file
        const pep =  spaceTo_( this.pepTable[p].Codon )
        if ( ishighres ) {
          this.pepTable[p].hilbert_preview = this.generateFilenameHilbert( pep )
        } else {
          this.pepTable[p].hilbert_preview = this.generateFilenameHilbert( pep )
          this.pepTable[p].hilbert_master = this.generateFilenameHilbert( pep )
        }
        bugtxt(`calc Hilbert Filename ${p} ${pep} master ${this.pepTable[p].hilbert_master }`)
      }

      // bugtxt(`codons per pixel hilbert ${codonsPerPixelHILBERT}`)

      this.justNameOfHILBERT =  this.generateFilenameHilbert( this.peptide )
      this.fileHILBERT = path.resolve( this.imgPath, this.justNameOfHILBERT)
      return this.justNameOfHILBERT
    }
    generateURL() {
      mode(`Generate URL ${this.justNameOfHTML}`)
      if ( this.index && !this.artistic ) {
        this.currentURL = `${url}/output/${this.shortnameGenome}/`
      } else if (this.artistic) {
        this.currentURL = `${url}/output/${this.shortnameGenome}/artistic.html`
      } else {
        this.currentURL = `${url}/output/${this.shortnameGenome}/${this.justNameOfHTML}`
      }
      return this.currentURL
    }

    generateFilenameHistogram() {
      mode(`Gen name histogram`)
      // http://10.0.2.3/aminosee/output///aminosee_histogram.json
      return path.resolve( this.outputPath, this.shortnameGenome, "aminosee_histogram.json")
    }

    generateFilenameTouch( focus ) { // we need the *fullpath* of this one
      // mode(`Gen name touch ${focus}`)
      if ( typeof focus === "undefined" ) {
        focus = "Reference"
      }
      return `AminoSee_BUSY_LOCK_${ maxWidth(12, this.justNameOfPNG )}_c${ onesigbitTolocale( this.codonsPerPixel ) }${ highlightFilename( focus ) }${ this.getImageType() }.txt`
    }
    generateFilenamePNG( focus ) {
      let ret
      if ( typeof focus === "undefined" || focus === "not set" || focus === "") {
        focus = "Reference"
      }
      bugtxt(`focus is set to ${focus}`)
      ret = `${ this.shortnameGenome}.${ this.extension }.aminosee_linear_c${ onesigbitTolocale( this.codonsPerPixel )}${ highlightFilename( focus ) }${this.getImageType() }.png`
      return ret
    }


    generateFilenameHilbert( focus ) { // needs  this.dimension estimatedPixels
      mode(`Gen name Hilbert ${focus}`)
      let thename
      if ( typeof focus === "undefined" ) {
        focus = "Reference"
      }
      thename = `${ this.shortnameGenome}.${ this.extension }.aminosee_HILBERT_m${ this.dimension }_c${ onesigbitTolocale( codonsPerPixelHILBERT )}${ highlightFilename( focus ) }${ this.getRegmarks()}.png`
      const pos = thename.substring("NaN")
      if ( pos > 0 ) {
        error(`thename contains NaN at pos ${pos}) ${thename}`)
      }
      // this.justNameOfHILBERT =  thename
      // this.fileHILBERT = path.resolve( this.imgPath, thename )
      return thename
    }
    generateFilenameHTML() {
      mode(`Generate filename for HTML`)
      this.justNameOfHTML = `${ this.shortnameGenome}.${ this.extension }.aminosee_m${ this.dimension }${ this.getRegmarks()}${ this.getImageType() }.html`
      return this.justNameOfHTML
    }
    genomeCanonicalisaton() {
      mode(`Generate shorter name based on input DNA filename: ${cfile}`)
      bugtxt( status )
      this.dnafile = path.resolve(cfile)
      this.extension = this.getFileExtension( this.dnafile )
      cfile = path.basename(this.dnafile)
      this.shortnameGenome = spaceTo_( this.removeFileExtension( cfile ))
      if ( this.shortnameGenome.length > maxCanonical ) {
        this.shortnameGenome = this.shortnameGenome.replace("_", "")
      }
      if ( this.shortnameGenome.length > maxCanonical ) {
        this.shortnameGenome = this.shortnameGenome.substring( 0, maxCanonical/2 ) + this.shortnameGenome.substring( this.shortnameGenome.length - ( maxCanonical /2), this.shortnameGenome.length)
      }
      this.imgPath = path.resolve( this.outputPath, this.shortnameGenome, "images")
      this.setupLinearNames()
      return this.shortnameGenome
    }
    setupLinearNames() { // must not be called during creation of hilbert image
      let msg = `Setup linear names: ${ cfile } highlight set: ${isHighlightSet} peptide: ${this.peptide} users focus: ${this.usersPeptide} triplet ${this.triplet}`
      // mode(msg)
      // output(msg)

      this.fileTouch =   path.resolve( this.outputPath, this.shortnameGenome, this.generateFilenameTouch( this.usersPeptide )  )
      this.fileHTML =    path.resolve( this.outputPath, this.shortnameGenome, this.generateFilenameHTML()   )
      this.filePNG =     path.resolve( this.outputPath, this.shortnameGenome, "images", this.generateFilenamePNG( this.usersPeptide ) )
      this.currentURL = this.generateURL()
    }
    qualifyPath(f) {
      return path.resolve( this.outputPath, this.shortnameGenome, f  )
    }




    selfSpawn() {

      const evilSpawn = spawn("aminosee", ["serve", "", "", "0"], { stdio: "pipe" })
      evilSpawn.stdout.on("data", (data) => {
        output(`${chalk.inverse("aminosee-cli serve")}${chalk(": ")}${data}  ${evilSpawn.name}`)
      })

      evilSpawn.stderr.on("data", (data) => {
        output(`${chalk.inverse("aminosee-cli  this.error")}${chalk(": ")}${data}`)
      })

      evilSpawn.on("close", (code) => {
        output(`child process quit with code ${code}`)
      })

    }

    startCrossSpawnHttp() {
      const spawn = require("cross-spawn")


      // Spawn NPM asynchronously
      // const evilSpawn = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' });
      // const evilSpawn = spawn('http-server', [server.getServerURL( this.shortnameGenome), '--port', port, '0'], { stdio: 'pipe' });
      const evilSpawn = spawn("http-server", ["--directory", this.outputPath,  "--port", port, "0"], { stdio: "pipe" })
      evilSpawn.stdout.on("data", (data) => {
        output(`${chalk.inverse("aminosee serve")}${chalk(": ")}${data}`)
      })

      evilSpawn.stderr.on("data", (data) => {
        output(`${chalk.inverse("aminosee  this.error")}${chalk(": ")}${data}`)
      })

      evilSpawn.on("close", (code) => {
        output(`child process quit with code ${code}`)
      })

      // port: port,
      // https: true,
      // log: ({
      // format: 'stats'
      // }),
      // directory: this.outputPath,
      // sp a: 'index.html',
      // websocket: 'src/websocket-server.js'

      log("Personal mini-Webserver starting up around this.now (hopefully) on port ${port}")
      // log(`visit ${server.getServerURL()} in your this.browser to see 3D WebGL visualisation`);
      log( terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10))
      log( terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200))
      log("Control-C to quit. This requires http-server, install that with:")
      log("sudo npm install --global http-server")
    }

    helpCmd() {
      mode("Showing help command --help")
      const image = path.resolve(path.dirname(__filename), "public", "favicon.png") // display logo in term
      output(`image: ${image}` )
      termDrawImage( image , "--help section", () => {
        output( blueWhite( chalk.bold.italic("Welcome to the AminoSee DNA Viewer!")))
        output(description)
        output(chalk.bgBlue ("USAGE:"))
        output("    aminosee [files/*] --flags            (to process all files")
        terminalRGB("TIP: if you need some DNA in a hurry try this random clipping of 1MB human DNA:", 255,255,200)
        output("wget https://www.funk.co.nz/aminosee/dna/megabase.fa")
        output("This CLI is to convert sequence found in ASCII/RTF-8 text files - tested with .mfa .fa .gbk up to  into .png graphics. works with .mfa .fa .gbk DNA text files. It's been tested with files up to 3 GB, and uses asynchronous streaming architecture! Pass the name of the DNA file via command line, and it will put the images in a folder called 'output' in the same folder.")
        output(chalk.bgBlue ("HELP:"))
        output("Author:         tom@funk.co.nz or +64212576422")
        output("calls only between 2pm and 8pm NZT (GMT+11hrs)")
        output(chalk.bgBlue ("SUPPORT:"))
        output("Donations can be sent to my bitcoin address with thanks:")
        output("15S43axXZ8hqqaV8XpFxayZQa8bNhL5VVa")
        output("https://www.funk.co.nz/blog/online-marketing/pay-tom-atkinson")
        output(chalk.bgBlue ("VARIABLES:"))
        output("  --peptide=\"Amino Acid\"  use quotes for two word compounds")
        output("  --triplet=[ATCGU]..   -t=GGG            any 3 nucleotides")
        output("  --codons [1-999] -c2       reduce detail to half size res")
        output("  --codons [1-999] -c100         packs 100 codons per pixel")
        output("  --magnitude [0-8] -m9 crashes my mac 4096x4096 -m8 maximum 2048x2048 resolution")
        output(chalk.bgBlue ("FLAGS:"))
        output("  --ratio=[square|golden|fixed] fixed is default: 960px width variable height aspect")
        output("  --ratio=fix --ratio=golden --ratio=sqr aspect ratio proportions")
        output("  --verbose -v                               verbose mode")
        output("  --help -h                             show this message")
        output("  --force -f              ignore locks overwrite existing")
        output("  --devmode -d   will skip locked files even with --force")
        output("  --artistitc -a   creates a visual rhythm in the picture")
        output("  --dnabg -b   spew DNA bases to background during render")
        output("  --clear --no-clear       dont clear the terminal during")
        output("  --reg     put registration marks @ 25% 50% 75% and 100%")
        output("  --test                 create calibration test patterns")
        output("  --keyboard -k enable interactive mode, use control-c to end")
        output("  maybe dont use interactive keyboard mode in batch scripts")
        output("  --firefox --chrome --safari changes default browser to open images")
        output("  --clear")
        output("  --html --no-html             open HTML report when done")
        output("  --updates --no-updates           turn off stats display")
        output("  --image                            open image when done")
        output("  --explorer  --file open file explorer / Finder to view files")
        output("  --no-gui               disables all GUI except terminal")
        output("  --quiet  -q               full quiet mode / server mode")
        output(chalk.bgBlue ("EXAMPLES:"))
        output("     aminosee Human-Chromosome-DNA.txt --force overwrite w/ fresh render")
        output("     aminosee chr1.fa -m 8                  render at 2048x2048")
        output("     aminosee chr1.fa  chrX.fa  chrY.fa          render 3 files")
        output("     aminosee * --peptide=\"Glutamic acid\" (use quotes if there is a space")
        output("     aminosee * --triplet=GGT (highlight only this specific version of amino acid")
        output("     aminosee test                 (generate calibration images")
        output("     aminosee serve                (fire up the mini web server")
        output("     aminosee demo   <<-----           (run demo - beta version")
        output("     aminosee help   <<-----           (shows this docs message")
        output("     aminosee dna/*  (render all files in dna/ default settings")
        term.down(   termHistoHeight )
        if ( this.quiet == false) {
          printRadMessage( [ `software version ${version}` ] )
        }
      })

      if ( this.keybaord ) {
        this.setupKeyboardUI() // allows fast quit with [Q]
      }


      if ( this.help === true) {
        this.openHtml = true
        this.openImage = true
        this.openFileExplorer = true
        // if ( this.keyboard === true) { // this not need done twice
        // }
        // countdown('Press [Q] to quit this.now, [S] to launch a web server in background thread or wait ', 15000, blockingServer());
        // countdown('Press [S] to launch a web server in background thread or quit in ', 4000);
        // setTimeout( () => {
        //   countdown("Closing in " , 6000, () => {
        //     this.quit(1,"Help")
        //   } )
        // }, 4000)
      }
      this.quit(1,"Help")

    }

    mkRenderFolders(reason) {
      bugtxt(`Making render folders for ${ this.filePNG}`)
      this.mkdir() // create the webroot dir if it not exist
      this.mkdir( "output" )
      this.mkdir( path.join( "output", this.shortnameGenome ) ) // genome render dir
      this.mkdir( path.join( "output", this.shortnameGenome, "images" ) ) // genome render dir
      bugtxt(`Done making render folders for ${ this.shortnameGenome} ${reason}`)
    }
    fancyFilenames() {
      output()
      log(chalk.bold(`Render Filenames for ${ this.shortnameGenome}:`))
      output(chalk.rgb(255,255,255).inverse(    fixedWidth( this.colDebug*2.5,  `Input DNA File: ${ cfile } `)))
      output(chalk.rgb(200,200,200).inverse(    fixedWidth( this.colDebug*2.5,  `Linear PNG: ${ this.justNameOfPNG }`      )))
      output(chalk.rgb(150,150,150).inverse(    fixedWidth( this.colDebug*2.5,  `Hilbert PNG: ${ this.justNameOfHILBERT }` )))
      output(chalk.rgb(100,100,180).inverse(    fixedWidth( this.colDebug,  `HTML: ${ fixedWidth( this.colDebug, this.fileHTML )}`)))
      log(chalk.white.bgBlue.inverse(           fixedWidth( this.colDebug*2.5,  `Lockfile: ${ this.fileTouch }`)))
      output(blueWhite(`URL: ${ fixedWidth( this.colDebug,  this.currentURL )}`))
    }
    setIsDiskBusy(boolean) {
      if (boolean) { // busy!
        mode(`locking storage (${status} saving ${this.shortnameGenome} ${this.justNameOfPNG} ${this.justNameOfHILBERT})`)
        this.isStorageBusy = true
        this.isDiskFinHTML = false
        this.isDiskFinHilbert = false
        this.isDiskFinLinear = false
      } else { // free!
        mode(`${batchProgress()} storage unlocked (closing ${this.shortnameGenome})`)
        // output(status)
        this.isStorageBusy = false
        this.isDiskFinHTML = true
        this.isDiskFinHilbert = true
        this.isDiskFinLinear = true
      }
      procTitle( status )
    }

    saveDocsSync(cb) {




      this.setIsDiskBusy(true)
      this.mkRenderFolders()
      this.calcHilbertFilename()
      this.projectHilbertImage( () => { out(`Hilbert projection done.`) } )
      // this.fancyFilenames()
      //



      this.saveHTML( () => { log(`save html`) })


      setTimeout(  () => {
        this.saveHilbert( this.savePNG( () => {
          log(`save png images cb`)
        })) // <--- that's some callback hell right there!
      }, raceDelay)

      log(`saving ${ ishighres ? ispreview ? 'preview' : 'highres' : 'lowres'  }`)
      cb()
    }
    compareHue(a,b) {
      if (a.Hue < b.Hue)
      return -1
      if (a.Hue > b.Hue)
      return 1
      return 0
    }
    compareHistocount(a,b) {
      if (a.Histocount < b.Histocount)
      return -1
      if (a.Histocount > b.Histocount)
      return 1
      return 0
    }
    saveHistogram(cb) {

    }

    saveHTML( cb ) {
      status = ""
      if ( this.isHilbertPossible === false ) { status += "Hilbert not possible. "; this.report = false }
      if ( this.report === false ) { status += "Report is disabled. "; this.report = false }
      if ( this.test ) { status += "Test. ";  this.report = false  }
      if ( this.isDiskFinHTML ) { status += "It was already saved. ";  this.report = false  }
      if ( this.recycEnabled ) { status += "It was recycled. ";  this.report = false  }

      // if (this.report === false ) { // set just above
      //   output(`Not saving HTML due to ${status}`)
      //   // runcb(cb)
      //   this.htmlFinished()
      //   cb()
      //   return false
      // }
      mode("Saving HTML")

      // this.pepTable.sort( this.compareHistocount )
      let histogramJson =  this.getRenderObject()
      let histogramFile = this.generateFilenameHistogram()
      bugtxt(`globalVariablesDoSuck: ${	this.usersPeptide}`)
      // output( beautify( histogramJson , null, 2, 100) )

      let hypertext
      if ( this.test === true ) {
        hypertext = htmlTemplate( this.testSummary() )
      } else {
        hypertext = htmlTemplate( histogramJson )
      }

      let histotext = beautify( histogramJson , null, 2, 100);
      // let histotext =  JSON.stringify( histogramJson )
      // let histotext =  histogramJson.toString()
      bugtxt(histotext)



      if ( debug ) {
        this.fileWrite(path.resolve( this.outputPath, this.shortnameGenome, "debug.html"), hypertext)
      }

      if ( this.dimension > defaultPreviewDimension ) {
        this.fileWrite(path.resolve( this.outputPath, this.shortnameGenome, "highres.html"), hypertext)
        log( blueWhite(`Writing high resolution report for the directory ${this.shortnameGenome}`))
      } else if ( this.dimension = defaultPreviewDimension ) {
        this.index = true
      }

      if ( this.index || !ishighres ) { // if it wont make the users computer explode... set it as index page!
        this.fileWrite(path.resolve( this.outputPath, this.shortnameGenome, "index.html"), hypertext)
        log( blueWhite(`Writing default report for the directory ${this.shortnameGenome}`))
      }

      if ( this.artistic ) {
        this.fileWrite( path.resolve( this.outputPath, this.shortnameGenome, "artistic.html"), hypertext)
      }

      this.fileWrite( this.fileHTML, hypertext )

        this.fileWrite( histogramFile, histotext, () => {
          output("Finished Writing " + histogramFile)

          this.htmlFinished()
          runcb(cb)

        })
      output("Writing " + histogramFile)

    }
    fileWrite(file, contents, cb) {
      this.mkRenderFolders()
      // var that = this;
      try {
        fs.writeFile(file, contents, "utf8", function (err, cb) {
          if (err) {
            bugtxt(`[FileWrite] Issue with saving: ${ file } ${err}`)
          } else {
            try {
              bugtxt("Set permissions for file: " + file)
              // fs.chmodSync(file, 0o777); // not work with strict this.mode
              if ( doesFileExist(file) ) {
                fs.chmodSync(file, "0777")
              }

            } catch(e) {
              bugtxt("Could not set permission for file: " + file + " due to " + e)
            }
            // try {
            //   fs.utimesSync( file, tomachisBirthday, tomachisBirthday ) //
            // } catch( err ) {
            //   output(`Unknown error setting utimesSync: ${file}, ${tomachisBirthday}, ${blueWhite( err )}`)
            // }
          }
          log("$ " + file)
        })
        log("¢")
      } catch(err) {
        log(`[catch] Issue with saving: ${file} ${err}`)
      }
      if (typeof cb !== "undefined") { runcb( cb ) }

    }
    touchLockAndStartStream() { // saves CPU waste. delete lock when all files are saved, not just the png.
      mode("touchLockAndStartStream")
      log("I feel like touching a mutex lock and dancing")
      if ( renderLock === true ) { error("draining threads while locking"); return false }
      redoline("Locking threads for render")
      renderLock = true
      this.tLock()
      setTimeout( () => {
        if ( renderLock === true ) {
          this.initStream()
        } else {
          error(`was put to sleep by another thread that finished?! ${cfile}`)
        }
      }, raceDelay)
    }
    blurb() {
      let msg = `
      Started DNA render ${ this.justNameOfPNG } at ${ formatAMPM( this.startDate)}, and after ${humanizeDuration( this.runningDuration)} completed ${ nicePercent(this.percentComplete)} of the ${bytes(  this.baseChars)} file at ${bytes( this.bytesPerMs*1000)} per second.
      Estimated ${humanizeDuration( this.timeRemain)} to go with ${  this.genomeSize.toLocaleString()} r/DNA triplets decoded, and ${ this.pixelClock.toLocaleString()} pixels painted.
      File ${remain} / ${batchSize} on ${ os.platform() } on ${ hostname }.
      ${ this.memToString()} currently ${this.busy()}
      CPU load:    [ ${ this.loadAverages()} ] ${ version } ${ this.timestamp } ${ hostname }
      Batch ID: ${this.timestamp} Render ID: ${this.runid}
      `
      // output(msg)
      return msg
    }
    tLock(cb) {
      mode(`tLock`)
      this.calcUpdate()
      const outski = `
      AminoSee DNA Viewer by Tom Atkinson.

      ${ asciiart }

      This is a temporary lock file, placed during rendering to enable parallel cluster rendering over LAN networks, if this is here after processing has completed, usually it means an AminoSee had quit before finishing with --devmode enabled, or... had crashed. If the file is here when idle, it prevents the render and will cause AminoSee to skip the DNA. It's SAFE TO ERASE THESE FILES (even during the render, you might see it come back alive or not). Run the script /dna/find-rm-touch-files.sh to batch delete them all in one go. Normally these are deleted when render is completed, or with Control-C during graceful shutdown on SIGINT and SIGTERM. If they didn't they are super useful to the author for debugging, you can send to aminosee@funk.co.nz

      Input: ${ this.dnafile }
      Your output path : ${ this.outputPath }

      ${ this.blurb() }
      ${ this.renderObjToString() }` //////////////// <<< END OF TEMPLATE
      //////////////////////////////////////////

      if ( renderLock === true ) {
        this.fileWrite(
          this.fileTouch,
          outski
        )
      } else {
        if (typeof cb === "Function") { runcb(cb) }
      }

    }
    fileBug(err) {
      bugtxt(err + " the file was: " + cfile)
    }
    // static deleteFile(file) {
    // 	try {
    // 		fs.unlinkSync(file, (err) => {
    // 			bugtxt("Removing file OK...")
    // 			if (err) { fileBug(err)  }
    // 		})
    // 	} catch (err) {
    // 		fileBug(err)
    // 	}
    // }



    safelyPoll( reason ) { // get to Polling safely
      if ( renderLock ) {
        error("thread activated inside slow skip")
        return false
      }
      mode(`safely polling ${reason}`)

      setTimeout( () => {
        this.fastUpdate()
        if ( renderLock ) { error(reason); return false; }
        if ( remain < 1 ) { this.quit(0, "Finished batch"); return false; }
        // this.setNextFile()
        // log( `remain ${remain} ${cfile}`)
        this.pollForStream(`safe polling`)
      }, raceDelay)
    }
    createPreviews(cb) {
      mode(`Setting up previews ${this.justNameOfHILBERT}`)
      // printRadMessage([`setting up previews`, status])
      output(status)
      if ( this.test ) { return false; }
      renderLock = true
      ispreview = true
      this.ratio = "sqr"
      this.hilbertImage = [] // wipe the memory!!
      this.antiAliasArray = []
      this.dimension = defaultMagnitude = defaultPreviewDimension // 5
      this.magnitude = "auto"
      const pixels =  hilbPixels[ defaultPreviewDimension ] // 65536
      this.maxpix = pixels * overSampleFactor
      // let { shrinkFactor, codonsPerPixelHILBERT } =  calculateShrinkage( this.pixelClock, defaultPreviewDimension, this.codonsPerPixel ) // danger: can change this.file of Hilbert images!
      // codonsPerPixelHILBERT = codonsPerPixelHILBERT
      // output(`previews codonsPerPixelHILBERT ${shrinkFactor}, ${codonsPerPixelHILBERT}`)
      // output(`previews codonsPerPixelHILBERT ${shrinkFactor}, ${codonsPerPixelHILBERT}`)
      // output(`previews codonsPerPixelHILBERT ${shrinkFactor}, ${codonsPerPixelHILBERT}`)

      // output(blueWhite(`ShrinkFactor ${shrinkFactor}`) + `making smaller resolution previews from source pixels ${ this.pixelClock.toLocaleString()} codons per pixel ${this.codonsPerPixel} new codons per pixel ${shrinkFactor} ${this.dimension} to ${defaultPreviewDimension} `)
      // output(blueWhite(`Creating previews at magnitude ${this.magnitude} ${this.dimension}`) + ` from source pixels ${ this.pixelClock.toLocaleString()} codons per pixel ${this.codonsPerPixel} new codons per pixel ${codonsPerPixelHILBERT} ${this.dimension} to ${defaultPreviewDimension} `)
      this.setIsDiskBusy(true)

      this.index = true // auto enable html report for preveiws
      this.isDiskFinHilbert = false;
      // this.isDiskFinLinear = true;
      // this.isDiskFinHTML = true;
      this.isStorageBusy = true;
      this.hWidth = Math.sqrt(pixels)
      this.hHeight  = this.hWidth
      this.index = true;
      this.args.magnitude = defaultPreviewDimension
      calculateShrinkage( this.pixelClock, this.dimension, this.codonsPerPixel )
      output(codonsPerPixelHILBERT )

      this.isDiskFinLinear = true

      this.saveDocsSync( () => { log(`saving previews to storage initiated`) })


    }
    postRenderPoll(reason) { // renderLock on late, off early
      mode(`Post render [${reason}] Waiting on (${ this.storage()})`)

      if ( typeof reason === "undefined") { error("reason must be defined for postRenderPoll"); return false; }

      log( status )
      //
      // if ( verbose ) {
      //   redoline(chalk.inverse(`Finishing saving (${reason}), ${this.busy()} waiting on ${ this.storage() } ${ remain } files to go.`))
      // }

      if ( renderLock === false ) { // re-entrancy filter
        error(chalk.bgRed(`another thread has continued because: ${reason}`))
        if ( !this.test ) {
          return false
        }
      }

      // try to avoid messing with globals of a already running render!
      // sort through and load a file into "nextFile"
      // if its the right this.extension go to sleep  <----- bug ?
      // check if all the disk is finished and if so change the locks
      if ( this.isDiskFinLinear === true && this.isDiskFinHilbert === true && this.isDiskFinHTML === true ) {
        log(`this.dimension ${this.dimension} > defaultPreviewDimension ${defaultPreviewDimension} is test: ${this.test}`)
        out(`Finished saving`)
        this.openOutputs()
        this.setIsDiskBusy( false )
        addToRendered(this.shortnameGenome) // in case histogram file is deleted

        if ( this.test === true ) {
          if ( remain > 1 && renderLock ) {
            out(blueWhite( ` [ Starting another cycle in ${ humanizeDuration( raceDelay )}`))

              setTimeout( () => {
                if ( renderLock ) {
                  renderLock = false
                  this.runCycle()
                } else {
                  out("not running")
                }
              }, raceDelay)
            } else {
              out(`finished tests`)
              // remain--
              // this.quit(0,"test "+ remain)
            }
            return

          }
          let msg = `Great success with render`
          mode(msg)
          notQuiet(status)
          saySomethingEpic()
          killAllTimers()

          if (ishighres && !ispreview) {
            this.renderLock = true
            mode(`Creating lowres previews in ${raceDelay} ms`)
            output( status )

            this.hilbertImage = []
            // setTimeout( () => {
              this.createPreviews( () => {

                this.dimension = defaultMagnitude = usersMagnitude // 5
                bugtxt(`finished saving PREVIEW docs, setting dimension back to: ${usersMagnitude}`)


                mode(`Previews created from high res render ${this.justNameOfPNG}`)
                removeLocks( this.fileTouch, this.devmode, status )
                return
              })
            // }, raceDelay )
          } else {
            mode(`Used ${ishighres ? 'highres' : 'lowres'} output resolution for ${this.usersPeptide}`)
            output( status )
            removeLocks( this.fileTouch, this.devmode, status )
          }
        } else { //  disk is not finished
          output(` [ post render ${reason} wait on storage: ${chalk.inverse( this.storage() )}  ] `)
        }
      }
      getFilesizeInBytes(file) {
        try {
          const stats = fs.statSync(file)
          const fileSizeInBytes = stats.size
          return fileSizeInBytes
        } catch(err) {
          let msg = "File not found: " + file
          mode(msg)
          error( chalk.inverse(msg) )
          renderLock = false
          this.safelyPoll(`getFilesizeInBytes`)
          return -1 // -1 is signal for failure or unknown size (stream).
        }
      }
      // getFilesizeInBigIntBytes(f) {
      //   this.baseChars = 69;
      //   bigIntFileSize = 69696969696969n; // this.test of big int.
      //   try {
      //     this.baseChars = fs.fstatSync(f, { bigint: false }).size;
      //     bigIntFileSize = fs.fstatSync(f, { bigint: true } ).size;
      //     log(`File exists with size ${ this.baseChars} at: ${path}`);
      //     return  this.baseChars;
      //   } catch(e) {
      //     this.baseChars = -1;
      //     output(`Cant stat filesize of ${path} File  : ${e}`);
      //     return  this.baseChars;
      //   }
      //   log(`f ${path}  this.baseChars ${ this.baseChars} file: ${file} big int filesize: ${bigIntFileSize}`);
      //   return  this.baseChars; // debug flag. basically i should never see -69 appearing in  this.error logs
      // }
      getFileExtension(f) {
        if ( typeof f == "undefined") { return "none supplied" }
        let lastFour = f.slice(-4)
        bugtxt(`getFileExtension ${f}`)
        return lastFour.replace(/.*\./, "").toLowerCase()
      }
      checkFileExtension(f) {
        let value = extensions.indexOf( this.getFileExtension(f) )
        if ( value < 0) {
          bugtxt(`checkFileExtension FAIL: ${f}  ${value} `)
          return false
        } else {
          bugtxt(`checkFileExtension GREAT SUCCESS: ${f}  ${value} `)
          return true
        }
      }

      quit(code, reason) {
        log(`received shutdown signal ${code} ${reason}`)


        if (killServersOnQuit === false) {
          out(`Webserver running in foreground. use control-c to kill.`)
          log("If you get a lot of servers running, use Control-C instead of [Q] to issues a 'killall node' command to kill all of them")
          // return
        }




        if ( typeof reason === "undefined") {
          error("must set reason")
          if ( this !== undefined) {
            reason =  status
          } else {
            reason = "not set"
          }
        }
        mode("quit " + reason)
        if (typeof code == "undefined") { code = 0 } // dont terminate with 0
        log(`Received quit(${code}) ${reason}`)
        killAllTimers()
        destroyKeyboardUI()
        if ( renderLock === true ) {
          output("halting render") // maybe this happens during graceful shutdown
        }
        if ( this.isStorageBusy ) {
          output("still saving to storage - will exit after save") // maybe this happens during graceful shutdown
          return
        }
        if ( !isShuttingDown ) {
          bugtxt(`Not shutting down yet`)
          return
        }

        if (code == 0) {
          log("CLI mode clean exit.")
          return true
        } else {
          log(chalk.bgWhite.red ("Goodbye"))
        }

        if (remain > 0 ) {
          error(`There is more work (${remain}). Rendering: ${this.justNameOfPNG} ${this.timeRemain}`)
          if ( this.isStorageBusy ) {
            output("shutdown halted due to saving")
            return true
          }
        }
        ///////////////////// below here is defo gonna quit

        if (webserverEnabled === true) { // control-c kills server
          server.stop()
        }


        // term.eraseDisplayBelow()
        this.destroyProgress()
        process.exitCode = code
        deleteFile( this.fileTouch )
        killAllTimers()
        printRadMessage([ ` ${(killServersOnQuit ?  'AminoSee has shutdown' : ' ' )}`, `${( verbose ?  ' Exit code: '+ code : '' )}`,  (killServersOnQuit == false ? server.getServerURL() : ' '), remain ]);
      }
      processLine(l) { // need to implement the format here: https://rdrr.io/rforge/seqTools/man/countGenomeKmers.html
        if ( renderLock === false ) { error("thread entered process line!")}
        renderLock = true
        streamLineNr++
        status = `Streaming line: ${streamLineNr}`
        if ( debounce(500 )) { this.progressTick() }


        if (this.rawDNA.length < termPixels) {
          this.rawDNA = cleanString(l) + this.rawDNA
        }
        let pixelGamma = 1 //this.getGamma( pep );
        let lineLength = l.length // replaces  this.baseChars
        let triplet = ""
        this.focusTriplet = this.peptide
        this.isHighlightCodon = false
        for (let column=0; column<lineLength; column++) {
          // build a three digit triplet one char at a time
          let c = cleanChar(l.charAt(column)) // has to be ATCG or a . for cleaned chars and line breaks
          this.charClock++
          while ( c == "." || c == "N") { // cleanChar turns everything else into either . or N - biff it and get another
            // ERROR DETECTING
            // IMPLMENTED AFTER ENABLEDING "N" TO AFFECT THE IMAGE
            // ITS AT THE STAGE WHERE IT CAN EAT ANY FILE WITH DNA
            // BUT IF ANY META DATA CONTAINS THE WORD "CAT", "TAG" etc these are taken as coding (its a bug)
            triplet =  "" // we wipe it because... triplets should not cross line break boundaries.
            column++
            c = cleanChar(l.charAt(column)) // line breaks
            this.charClock++
            this.errorClock++
            // this.red  = 0
            // this.green = 0
            // this.blue  = 0
            // this.alpha = 0
            if (column > lineLength) {
              this.breakClock++
              break
            }
          }
          triplet += c // add the base to triplet the working triplet memory
          this.currentTriplet = triplet
          if (triplet == "..." || triplet == "NNN") {
            // this.pepTable.find("Non-coding NNN").Histocount++
            if (triplet == "NNN" ) {
              // this.alpha = 255
              // this.renderPixel() // dont push to memory instead keep stacking adding to same values
              // let r = this.pepTable.find( (pep) => { pep.Codon == triplet })
              // this line will be removed at some stage:
              // this.mixRGBA[0] += parseFloat( this.codonRGBA[0].valueOf() * pixelGamma ) // * red
              // this.mixRGBA[1] += parseFloat( this.codonRGBA[1].valueOf() * pixelGamma ) // * green
              // this.mixRGBA[2] += parseFloat( this.codonRGBA[2].valueOf() * pixelGamma ) // * blue
              // this.mixRGBA[3] += 255 * pixelGamma // * alpha
            }
            triplet=""
            this.errorClock++
          } else if (triplet.length ==  3) {
            this.aminoacid = tripletToAminoAcid( triplet )
            this.pixelStacking++
            this.genomeSize++
            this.codonRGBA =  this.tripletToRGBA( triplet ) // this will this.report this.alpha info
            pixelGamma = this.getGamma( triplet, this.triplet, this.peptide )

            // this line will be removed at some stage:
            this.mixRGBA[0] += parseFloat( this.codonRGBA[0].valueOf() * pixelGamma ) // * red
            this.mixRGBA[1] += parseFloat( this.codonRGBA[1].valueOf() * pixelGamma ) // * green
            this.mixRGBA[2] += parseFloat( this.codonRGBA[2].valueOf() * pixelGamma ) // * blue
            this.mixRGBA[3] += parseFloat( this.codonRGBA[3].valueOf() * pixelGamma ) // * alpha
            // this.mixRGBA[3] += 255 * pixelGamma

            if ( brute === true ) {
              for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
                this.peptide = this.pepTable[ p ].Codon
                pixelGamma = this.getGamma( triplet,  this.triplet,	this.peptide  )
                //
                // this.highlightRGBA = this.tripletToRGBA(triplet) // this will this.report this.alpha info
                // this.darkenRGBA = 		this.tripletToRGBA(triplet) // this will this.report this.alpha info
                //
                // mix is only zerod by renderPixel()
                this.pepTable[ p ].mixRGBA[0] += parseFloat( this.codonRGBA[0].valueOf() * pixelGamma ) // * red
                this.pepTable[ p ].mixRGBA[1] += parseFloat( this.codonRGBA[1].valueOf() * pixelGamma ) // * green
                this.pepTable[ p ].mixRGBA[2] += parseFloat( this.codonRGBA[2].valueOf() * pixelGamma ) // * blue
                this.pepTable[ p ].mixRGBA[3] += parseFloat( this.codonRGBA[3].valueOf() * pixelGamma ) // * blue
              }
              this.peptide = this.usersPeptide
            }

            //  blends colour on one pixel
            if ( this.pixelStacking >= this.codonsPerPixel ) {
              this.renderPixel() // dont push to memory instead keep stacking adding to same values
            } // end pixel stacking
            triplet = "" // wipe for next time
          } // end codon.length ==  3
        } // END OF column LOOP! thats one to three chars but mixRGBA can survive columns if pixelStacking not high enough to paint
      } // end processLine

      getGamma( current, triplet, peptide ) {
        let pixelGamma = 0.99 // normal render
        if ( current == triplet ) { // this block is trying to decide if a) regular render b) highlight pixel c) darken pixel
          pixelGamma = highlightFactor
        } else if ( this.aminoacid == peptide) {
          pixelGamma = highlightFactor
        } else if ( brute === true || isHighlightSet === true) {
          pixelGamma = darkenFactor
        } else {
          pixelGamma = 1
        }
        // if ( debounce(1000) === true ) {
        // 	redoline(`${pixelGamma} ${current} ${triplet} ${this.aminoacid} ${peptide} ${lastHammered}`)
        // }
        return pixelGamma
      }
      renderPixel() {
        if ( this.artistc === true ) { // artistic mode WILL BE MANY PIXELS from that one pixel
          this.renderArtistic()
          return
        }
        // REGULAR MODE
        let bc = balanceColour(
          this.mixRGBA[0],
          this.mixRGBA[1],
          this.mixRGBA[2],
          this.mixRGBA[3]
        )
        this.red =   bc[0]
        this.green = bc[1]
        this.blue  = bc[2]
        this.alpha = bc[3]



        if ( brute === true ) {
          for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
            // log(`mixRGBA ${this.pepTable[p].mixRGBA}`)
            bc = balanceColour(
              this.pepTable[p].mixRGBA[0],
              this.pepTable[p].mixRGBA[1],
              this.pepTable[p].mixRGBA[2],
              this.pepTable[p].mixRGBA[3]
            )
            this.pepTable[p].mixRGBA = bc
            // this.pepTable[ p ].lm_array.push(Math.round( bc[0] ))// this.red ))
            // this.pepTable[ p ].lm_array.push(Math.round( bc[1] ))// this.green ))
            // this.pepTable[ p ].lm_array.push(Math.round( bc[2] ))// this.blue ))
            // this.pepTable[ p ].lm_array.push(Math.round( bc[3] ))// this.alpha))
            // this.pepTable[ p ].mixRGBA = [0,0,0,0]
          }
        }

        this.paintPixel() // FULL BRIGHTNESS JUST ONE PIXEL


        // reset inks, using this.codonsPerPixel cycles for each pixel:
        this.mixRGBA[0] =   0
        this.mixRGBA[1] =   0
        this.mixRGBA[2] =   0
        this.mixRGBA[3] =   0
        this.red   = 0
        this.green = 0
        this.blue  = 0
        this.alpha = 0
        // end science this.mode
      }
      renderArtistic() {

        // ************ ARTISTIC this.mode
        if (this.isHighlightCodon) {
          if ( artisticHighlightLength >= 12) {
            this.red  =  this.mixRGBA[0]/12
            this.green  =  this.mixRGBA[1]/12
            this.blue  =  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()



            this.red  =  this.mixRGBA[0]/12
            this.green  =  this.mixRGBA[1]/12
            this.blue  =  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
            this.red  +=  this.mixRGBA[0]/12
            this.green  +=  this.mixRGBA[1]/12
            this.blue  +=  this.mixRGBA[2]/12
            this.paintPixel()
          }
          this.red  +=  this.mixRGBA[0]/3
          this.green  +=  this.mixRGBA[1]/3
          this.blue  +=  this.mixRGBA[2]/3
          this.paintPixel()
          this.red  +=  this.mixRGBA[0]/3
          this.green  +=  this.mixRGBA[1]/3
          this.blue  +=  this.mixRGBA[2]/3
          this.paintPixel()
          this.red  =  this.mixRGBA[0]
          this.green  =  this.mixRGBA[1]
          this.blue  =  this.mixRGBA[2]
          this.paintPixel()
          this.red  += 200
          this.green  += 200
          this.blue  += 200
          this.paintPixel()
          this.red  =  this.mixRGBA[0]/2
          this.green  =  this.mixRGBA[1]/2
          this.blue  =  this.mixRGBA[2]/2
          this.paintPixel()
          this.red  = 0
          this.green  = 0
          this.blue  = 0
          this.paintPixel() // END WITH BLACK
          this.pixelStacking = 0
          this.mixRGBA[0] =   0
          this.mixRGBA[1] =   0
          this.mixRGBA[2] =   0
          // // non highlight pixel end
        } else {  // ARTISTIC MODE BELOW
          this.red  = 0
          this.green  = 0
          this.blue  = 0
          this.alpha = 255 // Full black
          this.paintPixel() // 1. START WITH BLACK
          this.red  =  this.mixRGBA[0]/2
          this.green  =  this.mixRGBA[1]/2
          this.blue  =  this.mixRGBA[2]/2
          this.alpha = 128 // HALF TRANSLUCENT GLINT
          this.paintPixel() // 2.
          this.red  += 99 // <-- THIS IS THE WHITE GLINT
          this.green  += 99 // <-- THIS IS THE WHITE GLINT
          this.blue  += 99 // <-- THIS IS THE WHITE GLINT
          this.alpha = 255 // fully opaque from here
          this.paintPixel() // 3.
          this.red  =  this.mixRGBA[0]
          this.green  =  this.mixRGBA[1]
          this.blue  =  this.mixRGBA[2]
          this.paintPixel() // 4. <<--- Full colour pixel! from here it fades out

          for(let ac = 0; ac < artisticHighlightLength - 5; ac++ ) { // Subtract the four pix above and the one below
            this.red  =  this.red  / 1.2
            this.green  =  this.green  / 1.2
            this.blue  =  this.blue  / 1.2
            this.paintPixel() // 12 - 4 = 7 cycles hopefully
          }

          this.red  =  this.red  / 1.1
          this.green  =  this.green  / 1.1
          this.blue  =  this.blue  / 1.1
          this.alpha = 128
          this.paintPixel() // 12th.
          // reset inks:
          this.pixelStacking = 0
          this.mixRGBA[0] =   0
          this.mixRGBA[1] =   0
          this.mixRGBA[2] =   0
        }



      }
      aminoFilenameIndex(id) { // return the png files for the report
        let hilbert_master, linear_master, hilbert_preview, linear_preview
        const backupBoolean =  isHighlightSet

        this.peptide = data.pepTable[id].Codon
        // bugtxt(`id = ${id} peptide = ${this.peptide}`)

        // if (typeof id === "undefined" || id < 1) { // for the reference image
        //   isHighlightSet = false
        // } else {
        //   isHighlightSet = true
        // }

        // hilbert_master  =
        linear_master = this.generateFilenamePNG( this.peptide ) // isHighlightSet needs to be false for reference

        if ( ispreview ) { // master is high res, preview is low res file from this pass
          hilbert_master = this.pepTable.hilbert_master
          hilbert_preview =  this.generateFilenameHilbert( this.peptide )
        } else {
          hilbert_master = this.generateFilenameHilbert( this.peptide )
          hilbert_preview = hilbert_master // prev and master are the same
        }

        isHighlightSet = backupBoolean
        this.peptide = this.usersPeptide
        return [ hilbert_master, linear_master, hilbert_preview, linear_preview ]
      }
      getImageType() {
        let t = ""
        t += `_${ this.ratio }`
        this.artistic ? t += "_artistic" : t += "_sci"
        this.reg === true ? t += "_reg" : t += ""  // registration marks
        // bugtxt(`image type ${t}`)
        return t
      }




      isInProgress( fullPathOfLockFile ) { // return TRUE if locked.
        bugtxt("isInProgress RUNNING: " + fullPathOfLockFile)
        if ( this.force === true) {
          log("Not checking locks - force mode enabled.")
          return false
        }
        try {
          fs.lstatSync(fullPathOfLockFile).isDirectory()
          log("locked")
          return true
        } catch(e){
          bugtxt("No lockfile found - proceeding to render" )
          return false
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
        .on("parsed", function() {
          this.rgbArray = [this.length]
          for (let  y = 0; y < this.height; y++) {
            for (let  x = 0; x < this.width; x++) {
              var idx = (this.width * y + x) << 2



              // invert color
              this.rgbArray[idx] = this.data[idx]
              this.rgbArray[idx+1] = this.data[idx+1]
              this.rgbArray[idx+2] = this.data[idx+2]
              this.rgbArray[idx+3] = this.data[idx+3]
            }
          }
          // this.pack().pipe(fs.createWriteStream('out.png'));
          callback()
          return this.rgbArray
        })
      }
      recycleHistogram(histoURL, cb) {
        log("FETCH")
        fetch( histoURL )
        .then(response => response.json())
        .then(histogramJson => {
          // bugtxt(`histogramJson [ ${histogramJson} ]`)
          runcb(cb)
        }).catch()
      }
      recycleOldImage(pngfile) {
        mode(`RECYCLING ${ this.shortnameGenome }`)

        recycleHistogram( path.resolve( generateFilenameHistogram() ))
        log("recycled json")

        try {
          // var oldimage = new PNG.load(f);
          output(chalk.inverse("RECYCLING EXISTING LINEAR FILE ") + chalk(" " + this.shortnameGenome))
          this.rgbArray = decodePNG(pngfile, function () {
            this.isDiskFinHilbert = false
            this.isDiskFinHTML = true
            this.isDiskFinLinear = true
            this.calcHilbertFilename()
            this.rgbArray = this.data
            saveDocuments()
          })
        } catch(e) {
          output(`Failure during recycling: ${e} will poll for work`)
          this.isDiskFinHilbert = true
          this.preRenderReset(`recycle fail`)
          // this.pollForStream("recycle fail")
          return false
        }
      }

      skipExistingFile (fizzle) { // skip the file if TRUE render it if FALSE
        if ( this.force === true && cfile == funknzlabel ) {  return true } // true means to skip render
        let result = doesFileExist(fizzle)
        bugtxt("skipExistingFile " + fizzle + "force: " + this.force + " result: " + result)
        bugtxt(`The file is: ${fizzle} which ${( result ? "DOES" : "does NOT")} exist`)
        return this.result
      }




      stat(txt) {
        output(`stat: ${txt}`)
      }

      toBuffer(ab) {
        var buf = new Buffer(ab.byteLength)
        var view = new Uint8Array(ab)
        for (let  i = 0; i < buf.length; ++i) {
          buf[i] = view[i]
        }
        return buf
      }
      makeWide(txt) {
        let len = txt.length
        if (len > 14) {
          txt = `[${txt.slice(14)}]`
        } else if (len > 13) {
          txt = `[ ${txt.slice(13)}]`
        } else if (len < 13) {
          txt = `[ ${txt.slice(12)} ]`
        }
        return txt
      }
      projectHilbertImage(cb) {
        mode(`Project hilbert image ${ ishighres ? 'high res' : 'low res' }`)
        log( status )
        if ( renderLock === false ) { error("locks should be on during hilbert curve") }

        if ( this.isHilbertPossible === false ) {
          this.isDiskFinHilbert = true
          runcb(cb)
          return false
        }

        // if (brute === true) {
        //   log("Converting 256-bit images to 24-bit image with alpha...")
        //   for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
        //     this.pepTable[p].lm_array = Uint8ClampedArray.from( this.pepTable[p].lm_array )
        //   }
        // }

        term.eraseDisplayBelow()
        mode("Hilbert Curve")
        procTitle( status )
        hilpix = hilbPixels[ this.dimension ]
        calculateShrinkage( this.pixelClock, this.dimension, this.codonsPerPixel )
        output(chalk.bgBlue.red( " Getting in touch with my man from 1891...   ॐ    David Hilbert    ॐ    " + shrinkFactor) )
        // output()

        this.antiAliasArray = this.resampleByFactor()
        this.hWidth = Math.sqrt(hilpix)
        this.hHeight  = this.hWidth
        this.hilbertImage = [ ] // wipe the memory
        this.percentComplete = 0
        this.debugFreq = Math.round(hilpix / 100)
        this.progressTick()
        for (let i = 0; i < hilpix; i++) {
          if ( i % this.debugFreq == 0) {
            this.percentComplete = i/hilpix
            this.progressTick()
            // redoline(`Space filling ${nicePercent( this.percentComplete )} `)
          }

          let hilbX, hilbY;
          [hilbX, hilbY] = hilDecode(i, this.dimension, MyManHilbert)
          let cursorLinear  = 4 * i
          let hilbertLinear = 4 * ((hilbX % this.hWidth) + (hilbY * this.hWidth))
          this.percentComplete = i / hilpix
          // if ((Math.round(  this.percentComplete * 1000) % 100) === 0) {
          // }

          this.hilbertImage[hilbertLinear + 0] = this.rgbArray[cursorLinear + 0]
          this.hilbertImage[hilbertLinear + 1] = this.rgbArray[cursorLinear + 1]
          this.hilbertImage[hilbertLinear + 2] = this.rgbArray[cursorLinear + 2]
          this.hilbertImage[hilbertLinear + 3] = this.rgbArray[cursorLinear + 3]

          if (brute === true) {
            for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
              this.pepTable[p].hm_array[hilbertLinear + 0] = this.pepTable[p].lm_array[cursorLinear + 0]
              this.pepTable[p].hm_array[hilbertLinear + 1] = this.pepTable[p].lm_array[cursorLinear + 1]
              this.pepTable[p].hm_array[hilbertLinear + 2] = this.pepTable[p].lm_array[cursorLinear + 2]
              this.pepTable[p].hm_array[hilbertLinear + 3] = this.pepTable[p].lm_array[cursorLinear + 3]
            }
          }

          if ( this.reg) {
            this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete)
          }
          if (i-4 > this.rgbArray.length) {
            bugtxt("BREAKING at positon ${i} due to ran out of source image. this.rgbArray.length  = ${rgbArray.length}")
            bugtxt(` @i ${i} `)
            break
          }
        }
        //

        // if ( brute === true ) {
        //   for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
        //     this.pepTable[p].hilbert_master = this.aminoFilenameIndex(p)[0]
        //     this.pepTable[p].linear_master = this.aminoFilenameIndex(p)[1]
        //     this.pepTable[p].hilbert_preview = this.aminoFilenameIndex(p)[0]
        //     this.pepTable[p].linear_preview = this.aminoFilenameIndex(p)[1]
        //   }
        // }
        // log("Done projected 100% of " + hilpix.toLocaleString())

        this.hilbertFinished()
        cb()

      }




      // resample the large 760px wide linear image into a smaller square hilbert curve
      saveHilbert(cb) {
        mode(`save hilbert map`)
        log( status )
        // if ( this.isDiskFinHilbert ) { error(`double thread trying to render hilbert maps jesus christo`)}
        if ( !this.isHilbertPossible ) {
          this.isDiskFinHilbert = true
          return false
        }
        // clearTimeout( updatesTimer)
        this.isDiskFinHilbert = false
        this.calcHilbertFilename()
        // var hilbert_img_data = Uint8ClampedArray.from( this.hilbertImage )
        var hilbert_img_data = this.hilbertImage
        var hilbert_img_png = new PNG({
          width: this.hWidth,
          height: this.hHeight,
          colorType: 6,
          bgColor: {
            red: 0,
            green: 0,
            blue: 0
          }
        })

        hilbert_img_png.data = Buffer.from(hilbert_img_data)
        let wstream = fs.createWriteStream( this.fileHILBERT)
        var that = this
        new Promise(resolve => {
          hilbert_img_png.pack()
          .pipe(wstream)
          .on("finish", (err) => {
            // that()
            // runcb(cb)
            // this.hilbertFinished(cfile)
          })
        }).then().catch()
        this.hilbertFinished(cfile)
        if (typeof cb !== "undefined") { runcb(cb) }
      }
      htmlFinished() {
        this.isDiskFinHTML = true
        this.peptide = this.usersPeptide
        this.postRenderPoll( `HTML done` )
      }
      hilbertFinished() {
        mode(`Hilbert curve done (${this.justNameOfHILBERT}). Waiting on (${ this.storage()})`)
        out( status )
        this.isDiskFinHilbert = true

        // termDrawImage(this.fileHILBERT, "hilbert curve", () => {
          this.postRenderPoll( "hilbert done" )
        // })
      }

      linearFinished() {
        mode(`Finished writing linear image`)
        this.isDiskFinLinear = true
        if ( this.artistic || this.quiet == false ) {
          this.previousImage = this.filePNG
        }
        if ( this.test ) {
          mode(`Calibration linear generation done. Waiting on (${ this.storage()})`)
        } else {
          mode(`DNA transcode done, waiting on (${ this.storage()})`)
        }
        out(status)
        this.postRenderPoll( `linear done` )
      }

      writeTestPattern( cb ) {
        if (renderLock == false) {
          error("error render lock fail in test patterns")
          return false
        }
        notQuiet( `Generating hilbert curve of the ${ this.dimension + 1 }th dimension with ${remain} remaining. File: ${this.fileHILBERT}`)

        // renderLock = true

        // MyManHilbert
        hilpix = hilbPixels[ this.dimension ]
        const testWidth = Math.round(Math.sqrt(hilpix))
        const linearWidth = Math.round(Math.sqrt(hilpix))
        const testPath = path.resolve(webroot , "calibration")
        const highlight = ""


        this.hilbertImage = [ hilpix*4 ] // setup arrays
        this.rgbArray = [ hilpix*4 ]
        // this.fileHILBERT = path.resolve(testPath, `AminoSee_Calibration${ this.dimension }${this.getRegmarks()}`)
        this.fileHILBERT = path.resolve(testPath, this.justNameOfHILBERT)
        // this.filePNG     = path.resolve(testPath, `AminoSee_Calibration${ this.dimension }${this.getRegmarks()}`)
        this.filePNG     = path.resolve(testPath, this.justNameOfPNG)

        this.percentComplete = 0
        let d = Math.round(hilpix/100)
        for (let i = 0; i < hilpix; i++) {
          streamLineNr++
          let hilbX, hilbY;
          [hilbX, hilbY] = hilDecode(i, this.dimension, MyManHilbert)
          let cursorLinear  = 4 * i
          let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth))
          this.percentComplete =  (i+1) / hilpix
          dot(i, d, " ॐ  " + nicePercent(this.percentComplete))
          this.hilbertImage[hilbertLinear] =   255 * this.percentComplete // slow ramp of  this.red
          this.hilbertImage[hilbertLinear+1] = ( i % Math.round(  this.percentComplete * 32) ) / (  this.percentComplete *32) *  255 // SNAKES! crazy bio snakes.
          this.hilbertImage[hilbertLinear+2] = (  this.percentComplete *2550)%255 // 2550 creates 10 segments to show each 10% mark in  this.blue
          this.hilbertImage[hilbertLinear+3] = 255 // slight edge in this.alpha
          if ( this.reg ) {
            this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete)
          } else {
            if ( this.peptide == "Opal") {
              this.hilbertImage[hilbertLinear]  = 0 //  this.red
              this.hilbertImage[hilbertLinear+1]  = 0 //  this.green
            } else if ( this.peptide == "Ochre") {
              this.hilbertImage[hilbertLinear+2]  = 0 //  this.blue
              this.hilbertImage[hilbertLinear+1]  = 0 //  this.green
            } else if ( this.peptide == "Methionine") {
              this.hilbertImage[hilbertLinear]  = 0 //  this.red
              this.hilbertImage[hilbertLinear+2]  = 0 //  this.blue
            } else if ( this.peptide == "Arginine") { // PURPLE
              this.hilbertImage[hilbertLinear+1]  = 0 //  this.blue
            }
          }
          this.rgbArray[cursorLinear+0] = this.hilbertImage[hilbertLinear+0]
          this.rgbArray[cursorLinear+1] = this.hilbertImage[hilbertLinear+1]
          this.rgbArray[cursorLinear+2] = this.hilbertImage[hilbertLinear+2]
          this.rgbArray[cursorLinear+3] = this.hilbertImage[hilbertLinear+3]
        }
        bugtxt( chalk.bgWhite(`Math.sqrt(hilpix): [${Math.sqrt(hilpix)}])`))
        bugtxt( this.fileHILBERT )

        log( `Completed hilbert curve of the ${ this.dimension }th dimension out of: ${remain}`)



        //
        //
        saveIMAGE(this.filePNG, this.rgbArray, testWidth, testWidth, () => { this.linearFinished() } )
        saveIMAGE(this.fileHILBERT, this.hilbertImage, testWidth, testWidth, () => { this.hilbertFinished() } )

        return true
      }
      pixWidHeight() {
        let pix, wid, hite = 0

        try {
          pix = ( this.rgbArray.length / 4)
        }
        catch (err) {
          this.preRenderReset(`NOT ENOUGH PIXELS ${err}`)
          return false
        }

        if ( this.ratio == "sqr" ) {
          wid = Math.round(Math.sqrt(pix))
          hite = wid
          while ( pix > wid * hite) {
            log(` [w: ${wid} h: ${hite}] `)
            wid++
            hite++
          }
        } // SQUARE RATIO

        if ( this.ratio == "gol") {
          let phi = ((Math.sqrt(5) + 1) / 2)  // 1.618033988749895
          let bleed = pix * phi // was a good guess!
          wid = Math.sqrt(bleed) // need some extra pixels sometimes
          hite = wid // 1mp = 1000 x 1000
          hite =  ( wid * phi ) - wid // 16.18 - 6.18 = 99.99
          wid = bleed / hite
          hite = Math.round(hite)
          wid = Math.round(wid) - hite
        } else if ( this.ratio == "fix") {
          if (pix <= widthMax) {
            wid = pix
            hite = 1
          } else {
            wid = widthMax
            hite = Math.round(pix / widthMax) // you can have half a line. more and its an extra vert line
            if (hite<1) {
              hite=1
            }
          }
          while ( pix > wid * hite) {
            log(`linear image hite: ${hite} pixels by 960`)
            hite++
          }
        } // GOLDEN RATIO

        if ( pix <= wid * hite) {
          log("Image allocation is OK: " + pix + " <= width x hite = " + ( wid * hite ))
        } else {
          let msg = `MEGA FAIL: TOO MANY ARRAY PIXELS NOT ENOUGH IMAGE SIZE: array pixels: ${pix} <  width x hite = ${wid * hite}`
          error(msg)
          this.preRenderReset(msg)
          return false
        }
        let a =  [ pix, wid, hite ]
        return a
      }


      savePNG(cb) {
        mode("savePNG: " + this.filePNG)
        let width, height = 0
        let pwh = this.pixWidHeight()

        // pixels = pwh[0]
        width  = pwh[1]
        height = pwh[2]


        //           saveIMAGE(this.filePNG, this.rgbArray, width, height)
        //           this.linearFinished()
        // return true

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

        var img_data = Uint8ClampedArray.from( this.rgbArray )
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


        img_png.data = Buffer.from(img_data)
        let wstream = fs.createWriteStream( this.filePNG )
        var that = this
        let retProm =  new Promise(() => {
          img_png.pack()
          .pipe(wstream)
          .on("finish", (err) => {
            // if (err) { log(`Could not create write stream: ${ that.filePNG } due to ${err}`) }
            bugtxt("linear Save OK " +  that.storage())
            that.linearFinished()
          })
          // resolve();
        }).then().catch()

        if (typeof cb !== "undefined") { runcb(cb) }
      }
      openError(err) {
        if ( err == "ENOENT") {
          output(`Got file not found trying to launch browser: ${ chalk.inverse( this.browser ) }`)
          if ( this.browser == "chrome" || this.browser == "safari") {
            this.browser == "firefox"
          } else if ( this.browser == "firefox" ) {
            this.browser == "chrome"
          }
          output(`Switching to use ${this.browser}`)
        }
        error(`open( ${this.fileHTML} )`)
      }
      openOutputs() {
        return false
        mode("open files " + this.justNameOfPNG)
        log( blueWhite(  status ) )
        if ( isShuttingDown ) { output(`${batchProgress()} Shutting down... `); return false }
        if ( cfile == funknzlabel ) { return false }
        if ( this.devmode === true )  { log( this.renderObjToString() ) }
        log( closeBrowser ) // tell user process maybe blocked
        bugtxt(" this.openHtml, this.openImage, this.openFileExplorer ", this.openHtml, this.openImage, this.openFileExplorer )
        if ( this.openFileExplorer === true) {
          opensFile++
          log(`Opening render output folder in File Manager ${ opensFile }th time ${ this.outputPath }`)
          bgOpen()
          open(this.outputPath, () => {
            log("file manager closed")
          }).catch(function () { log(`open(${ this.outputPath })`) })
        }


        if ( this.openHtml === true) {
          mode(`Opening ${ this.justNameOfHTML} DNA render summary HTML report.`)
          notQuiet( status )
          opensHtml++
          projectprefs.aminosee.opens++ // increment open counter.
          // open( server.getServerURL( this.shortnameGenome), { wait: false } );
          if (openLocalHtml === true) {
            open( this.fileHTML, {app: this.browser, wait: false}).then(() => {
              log("browser closed")
            }).catch(function (err) {
              this.openError(err)
            })
          } else {
            // url + "/" + this.shortnameGenome + "/"
            open(				this.currentURL , {app: this.browser, wait: false}).then(() => {
              log("browser closed")
            }).catch(function (err) {
              this.openError(err)
            })
          }
        } else {
          log("Not opening HTML")
        }
        if ( this.openImage === true ) {
          log(`Opening ${ this.justNameOfHILBERT} 2D hilbert space-filling image.`)
          opensImage++
          projectprefs.aminosee.opens++ // increment open counter.
          open( this.fileHILBERT ).then(() => {
            log("hilbert image closed")
          }).catch(function () {  })
        }
        if ( this.isHilbertPossible == false) { // open the linear if there is no hilbert, for art mode
          output(`Opening ${ this.justNameOfPNG} 1D linear projection image.`)
          opensImage++
          projectprefs.aminosee.opens++ // increment open counter.
          open( this.filePNG ).then(() => {
            log("regular png image closed")
          }).catch(function () { })
        } else {
          log("Use --html or --image to automatically open files after render, and \"aminosee demo\" to generate this.test pattern and download a 1 MB DNA file from aminosee.funk.nz")
          // log(`values of this.openHtml ${ this.openHtml }   this.openImage ${ this.openImage}`)
        }
        // if (  opensFile  > 2) { // notice the s
        //   log("no more windows")
        //   this.openFileExplorer = false
        //   return false
        // }
        // if (  opensImage > 2) {
        //   log("no more windows")
        //   this.openImage = false
        //   return false
        // }
        // if (  opensHtml > 2) {
        //   log("no more windows")
        //   this.openHtml = false
        //   return false
        // }
        // if ( opens == 0 ) {
        //   log(`not opening ${opens} times`)
        // } else {
        //   log(`opening ${opens} times`)
        // }
      }

      getRegmarks() {
        return ( this.reg === true ? "_reg" : "" )
      }
      mkdir(relative, cb) { // returns true if a fresh dir was created
        let dir2make
        let ret = false // fingers crossed
        if ( typeof relative === "undefined" || relative == "/") {
          relative = "output"
          // dir2make = path.resolve( this.outputPath ) // just make the output folder itself if not present
          dir2make = webroot // just make the output folder itself if not present
        } else {
          dir2make = path.join( webroot, relative )
        }
        bugtxt(webroot + " creating folder: "+ dir2make)

        if ( doesFolderExist(this.outputPath) == false ) {
          try {
            fs.mkdirSync(this.outputPath, function (err, result) {
              if (result) { bugtxt(`mkdir Success: ${result}`) }
              if (err) { log(`Could not create output folder: ${relative} ${err}`) }
            })
          } catch(e) {
            bugtxt(`Error creating folder: ${e} at location: ${dir2make}`)
            error(`Quiting due to lack of permissions in this directory [${ this.outputPath }] `);
            ret = false
          }
        }
        if ( doesFolderExist(dir2make) == false ) {
          log(`Creating fresh directory: ${dir2make}`)
          try {
            fs.mkdirSync(dir2make, function (err, result) {
              if (result) { bugtxt(`mkdir Success: ${result}`); ret = true }
              if (err) {  error(`Fail: ${err}`) }
            })
          } catch(e) { bugtxt(`${e} This is normal`); }
        } else {
          bugtxt(`Directory ${ relative } already exists - This is normal.`)
          ret = true
        }
        if (typeof cb !== "undefined") { runcb(cb) }
        return ret
      }

      generateTestPatterns(cb) {
        this.setupRender()
        loopCounter = 1
        this.openHtml = false
        this.report = false
        this.test = true
        this.updates = true
        this.pngImageFlags = "_test_pattern"
        if ( this.magnitude == "auto") {
          this.dimension = defaultMagnitude - 1
        } else {
          notQuiet(`using custom dimension: ${ this.dimension }`)
          this.dimension = this.args.magnitude
        }
        batchSize = this.dimension
        remain = this.dimension

        if ( this.ratio !==  "sqr" ) {
          log(`Looks better with --ratio=square in my humble opinion, your using ${this.ratio}`)
        } else {
          this.ratio = "sqr"
        }

        output("output test patterns to /calibration/ folder. cfile: " + cfile )
        this.mkdir()
        this.mkdir( "calibration")
        if ( remain < 0 ) {
          reason = `calibration ${remain} `
          runcb(cb)
          this.quit(0, reason)
          return false
        }
        if ( this.dimension > 10 ) { log("I think this will crash node, only one way to find out!") }
        output(`TEST PATTERNS GENERATION    m${ this.dimension} c${ this.codonsPerPixel }`)
        log("Use -m to try different dimensions. -m 9 requires 1.8 GB RAM")
        log("Use --no-reg to remove registration marks at 0%, 25%, 50%, 75%, 100%. It looks a little cleaner without them ")
        bugtxt(`pix      ${hilbPixels[ this.dimension]} `)

        this.runCycle() // runs in a callback loop
        runcb(cb)
      }
      runCycle() {
        if (renderLock === true) {
          error(`Thread re-entered runCycle ${loopCounter}`)
          return false
        }
        renderLock = true;
        mode(`test cycle ${loopCounter}`)
        log(status)
        remain--
        loopCounter++
        this.testInit ( loopCounter ) // will enable locks

        if ( loopCounter > batchSize || isShuttingDown || remain < 1 ) {
          // this.testStop()
          // this.quit(1, "test complete")
          return false
        }

        output( blueWhite(`${batchProgress()} Test cycle ${loopCounter} remain`))
        if ( loopCounter > 9 ) {
          output(  chalk.italic("Normally this level of nested curves will crash the node callstack!!!" ) )
        }

        this.setIsDiskBusy( true )
        this.isDiskFinHTML = true

        // both kinds is currently making it's own calls to postRenderPoll
        this.writeTestPattern((cb) => { // renderLock must be true
          mode(`test patterns returned ${this.storage()}` )
          output(status)
          this.testStop()
          // this.postRenderPoll(status)
        }) // <<--------- sets up both linear and hilbert arrays but only saves the Hilbert.
      }
      async testPromise() {
        let teethPromise = brushTeeth()
        let tempPromise = getRoomTemperature()

        // Change clothes based on room temperature
        var clothesPromise = tempPromise.then(function(temp) {
          // Assume `changeClothes` also returns a Promise
          if(temp > 20) {
            return changeClothes("warm")
          } else {
            return changeClothes("cold")
          }
        })
        /* Note that clothesPromise resolves to the result of `changeClothes`
        due to Promise "chaining" magic. */

        // Combine promises and await them both
        await Promise.all(teethPromise, clothesPromise)
      }
      testStop () {
        mode(`test stop`)
        this.percentComplete = 1
        this.genomeSize = 0
        this.baseChars = 0
        this.charClock = -1 // gets around zero length check
        // this.pixelClock = -1; // gets around zero length check
        // this.quit(0, 'test stop');
        // this.isShuttingDown = true
        // renderLock = false
        // killAllTimers()
        this.destroyProgress()
        destroyKeyboardUI()
      }
      testInit ( magnitude ) {
        magnitude--
        // if ( renderLock === true ) { error(`threads inside test init`); return false; }
        // renderLock = true
        notQuiet(`webroot ${webroot} ${magnitude}`)

        let testPath = path.resolve(webroot , "calibration")
        let regmarks = this.getRegmarks()
        let highlight = ""
        this.dimension = remain = magnitude

        this.isHilbertPossible = true
        this.report = false
        this.errorClock = streamLineNr =  0
        this.percentComplete = 0.0001
        this.runningDuration = 1
        this.focusTriplet = "Reference"
        this.ratio = "sqr"
        log(`testPath ${testPath}  cfile ${cfile}`)
        // NON INDEPENDANT VARS. THESE ARE STAND-INS FOR A WAY TO FILTER THE IMAGE BY RED / GREEN / BLUE
        // IN THIS CASE HAS NOTHING TO DO WITH PEPTIDES :)
        if ( this.peptide == "Opal" || this.peptide == "Blue") {
          highlight += "_BlueAt10Percent"
        } else if ( this.peptide == "Ochre" || this.peptide == "Red") {
          highlight += "_RedRamp"
        } else if ( this.peptide == "Methionine" || this.peptide == "Green") {
          highlight += "_GreenPowersTwo"
        } else if ( this.peptide == "Arginine" || this.peptide == "Purple") {
          highlight += "_Purple"
        }
        // TEST INIT
        cfile = `AminoSee_Calibration${ highlight }${ regmarks }`
        this.shortnameGenome = cfile
        this.justNameOfPNG = `${ cfile }_LINEAR_${  magnitude }.png`
        this.justNameOfHILBERT = `${ cfile }_HILBERT_${  magnitude }.png`

        this.fileHTML    = path.resolve(testPath, cfile + ".html")
        this.filePNG     = path.resolve(testPath, this.justNameOfPNG)
        this.fileHILBERT = path.resolve(testPath, this.justNameOfHILBERT) //           cfile = `AminoSee_Calibration${ highlight }${ regmarks }`
        this.fileTouch   = path.resolve(testPath, cfile + "_LOCK.txt")
        this.dnafile = cfile
        // <<<--- use this cfile global mostly
        this.baseChars = hilbPixels[  magnitude ]
        this.maxpix = hilbPixels[defaultMagnitude]
        this.genomeSize =  this.baseChars
        this.estimatedPixels =  this.baseChars
        this.charClock =  this.baseChars
        this.pixelClock =  this.baseChars // DURING TEST PIXEL CLOCK = HILBERT CLOCK
        remain = batchSize -  magnitude
        bugtxt(`cfile ${cfile } magnitude ${magnitude} remain ${remain} batchSize ${batchSize}`)
        return true
      }

      paintRegMarks(hilbertLinear, hilbertImage,  percentComplete) {
        let thinWhiteSlice = (Math.round( percentComplete * 1000 )) % 250 // 1% white bands at 0%, 25%, 50%, 75%, 100%
        if (thinWhiteSlice < 1) { // 5 one out of 10,000
          // this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete);
          this.hilbertImage[hilbertLinear+0] = 255 - ( this.hilbertImage[hilbertLinear+0])
          this.hilbertImage[hilbertLinear+1] = 255 - ( this.hilbertImage[hilbertLinear+1])
          this.hilbertImage[hilbertLinear+2] = 255 - ( this.hilbertImage[hilbertLinear+2])
          this.hilbertImage[hilbertLinear+3] = 128
          if (thinWhiteSlice % 2) {
            this.hilbertImage[hilbertLinear+0] = 255
            this.hilbertImage[hilbertLinear+1] = 255
            this.hilbertImage[hilbertLinear+2] = 255
            this.hilbertImage[hilbertLinear+3] = 255
          }
        }
      }
      throttledFreq(gears) { // used to prevent super fast computers from spitting too much output
        if (typeof gears === "undefined") { gears = this.debugGears } else { this.debugGears = gears} // wow that is one line
        return this.estimatedPixels / (( this.codonsPerSec + 1) * gears) // numbers get bigger on fast machines.
      }


      // this will destroy the main array by first upsampling then down sampling
      resampleByFactor() {
        let sampleClock = 0
        let brightness = 1/ shrinkFactor
        let downsampleSize = hilbPixels[ this.dimension ] // 2X over sampling high grade y'all!
        let antiAliasArray = [ downsampleSize  * 4 ] // RGBA needs 4 cells per pixel
        log(`Resampling linear image of size in pixels ${this.pixelClock.toLocaleString()} to ${downsampleSize.toLocaleString()} by the factor ${ twosigbitsTolocale( shrinkFactor)}X brightness per amino acid ${brightness} destination hilbert curve pixels ${downsampleSize}`)
        this.debugFreq = Math.round(downsampleSize/100)
        // SHRINK LINEAR IMAGE:
        mode( "Resample by X" + shrinkFactor )
        this.progressTick()
        for (let z = 0; z<downsampleSize; z++) { // 2x AA this.pixelClock is the number of pixels in linear
          if ( z % this.debugFreq == 0) {
            this.percentComplete = z / downsampleSize
            this.progressTick()
            redoline(  this.percentComplete )
          }
          let sum = z*4
          let clk = sampleClock*4 // starts on 0
          antiAliasArray[sum+0] = this.rgbArray[clk+0]*brightness
          antiAliasArray[sum+1] = this.rgbArray[clk+1]*brightness
          antiAliasArray[sum+2] = this.rgbArray[clk+2]*brightness
          antiAliasArray[sum+3] = this.rgbArray[clk+3]*brightness
          // this.dot(z, this.debugFreq, `z: ${z.toLocaleString()}/${downsampleSize.toLocaleString()} samples remain: ${( this.pixelClock - sampleClock).toLocaleString()}`);
          while(sampleClock  < z* shrinkFactor) {
            clk = sampleClock*4
            antiAliasArray[sum+0] += this.rgbArray[clk+0]*brightness
            antiAliasArray[sum+1] += this.rgbArray[clk+1]*brightness
            antiAliasArray[sum+2] += this.rgbArray[clk+2]*brightness
            antiAliasArray[sum+3] += this.rgbArray[clk+3]*brightness
            sampleClock++
          }
          sampleClock++
        }
        // this.rgbArray = antiAliasArray
        return antiAliasArray
      }







      makeRequest(url) {
        try {
          var xhr = new XMLHttpRequest()
          xhr.open("GET", url, false) // Note: synchronous
          xhr.responseType = "arraybuffer"
          xhr.send()
          return xhr.response
        } catch(e) {
          return "XHR Error " + e.toString()
        }
      }
      busy() {
        return ( renderLock ? "BUSY" : "IDLE")
      }


      setDebugCols() {
        if (term.width > 200) {
        } else {
          this.colDebug = term.width - 2
        }
        this.colDebug = Math.round(term.width  / 3)-1
        return Math.round(term.width / 3)
      }

      // static output(txt) {
      //   wTitle(txt) // put it on the terminal windowbar or in tmux
      //   output(txt);
      // }
      // output(txt) {
      //   output(txt);
      // }
      out(txt) {
        if (typeof txt === "undefined" || this.quiet === true) { return false}
        term.eraseDisplayBelow
        redoline(txt)
        if ( this.updates === true && renderLock === true) {
          term.right( this.termMarginLeft )
        }
        process.stdout.write(`[${txt}] `)
      }


      clout(txt) {
        if (typeof txt === "undefined") {
          txt = " "
          return false
        }
        if (txt.substring(0,5) == " this.error" &&  !this.quiet) {
          console.warn(`[ ${txt} ] `)
        } else {
          log( chalk.rgb( this.red, this.green, this.blue )("[ ") + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(" ]"))
          // redoline( chalk.rgb( this.red, this.green, this.blue )(`[ `) + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(` ]`));
          // output(chalk.rgb( this.red, this.green, this.blue )(`[ `) + chalk(txt) + chalk.rgb( this.red, this.green, this.blue )(`[ `));
        }
      }





      paintPixel() {
        // let byteIndex = this.pixelClock * 4 // 4 bytes per pixel. RGBA.
        this.rgbArray.push(Math.round( this.red ))
        this.rgbArray.push(Math.round( this.green ))
        this.rgbArray.push(Math.round( this.blue ))
        this.rgbArray.push(Math.round( this.alpha))
        this.peakRed  =  this.red
        this.peakGreen  =  this.green
        this.peakBlue  =  this.blue
        this.peakAlpha =  this.alpha
        this.pixelStacking = 0
        this.pixelClock++

        if ( brute === true ) {
          for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
            this.pepTable[ p ].lm_array.push(Math.round( this.pepTable[ p ].mixRGBA[ 0 ]))
            this.pepTable[ p ].lm_array.push(Math.round( this.pepTable[ p ].mixRGBA[ 1 ]))
            // this.pepTable[ p ].lm_array.push( 255 * (i/20)  )
            // this.pepTable[ p ].lm_array.push(Math.random() * 255  )
            this.pepTable[ p ].lm_array.push(Math.round( this.pepTable[ p ].mixRGBA[ 2 ]))
            this.pepTable[ p ].lm_array.push(Math.round( this.pepTable[ p ].mixRGBA[ 3 ]))
            this.pepTable[ p ].mixRGBA = [0,0,0,0]
          }
        }

      }




      returnRadMessage(array) {
        let returnText = ""
        if (typeof array === "undefined") {
          array = ["    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:", this.outputPath ]
          // array = [ "    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:"," " ];
        }
        while ( array.length < 8 ) {
          array.push("    ________","    ________")
        }
        returnText += terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${array[0]}`, 255, 60,  250)
        returnText += terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${array[1]}`, 170, 150, 255)
        returnText += terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${array[2]}`, 128, 240, 240)
        returnText += terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${array[3]}`, 225, 225, 130)
        returnText += terminalRGB(`  ah-mee-no-see     'I See It Now - I AminoSee it!'   ${array[4]}`, 255, 180,  90)
        returnText += terminalRGB(`   ${ prettyDate(new Date())}   v${version}            ${array[5]}`          , 220, 120,  70)
        returnText += terminalRGB(array[6], 200, 105,   60)
        returnText += terminalRGB(array[7], 200, 32,   32)
        return returnText
      }



      fastUpdate() {
        this.present = new Date().getTime()
        this.runningDuration = ( this.present - this.started) + 1 // avoid division by zero
        this.msElapsed  = deresSeconds( this.runningDuration) // ??!! ah i see


        if ( this.charClock == 0 ||  this.baseChars == 0) {
          this.percentComplete = 0//(( this.charClock+1) / ( this.baseChars+1)); // avoid div by zero below a lot
        } else {
          this.percentComplete = this.charClock /  this.baseChars // avoid div by zero below a lot
        }
        if (this.isStorageBusy === true) { // render just finished so make percent 100% etc
          this.percentComplete = 1
        }
        if (  this.percentComplete > 1) {
          bugtxt(`percentComplete is over 1: ${  this.percentComplete} `)
          this.timeRemain = 1 // close to 0 its ms.
          this.percentComplete = 1
        } else {
          this.timeRemain = deresSeconds(( this.runningDuration / (  this.percentComplete )) - this.msElapsed ) // everything in ms
        }
      }
      calcUpdate() { // DONT ROUND KEEP PURE NUMBERS
        this.fastUpdate()
        this.bytesRemain = (  this.baseChars - this.charClock)
        this.bytesPerMs = Math.round( ( this.charClock) / this.runningDuration )
        this.codonsPerSec = (  this.genomeSize+1) / ( this.runningDuration*1000)
        let msg = `${ nicePercent(this.percentComplete)} | ${humanizeDuration( this.timeRemain)} | `
        if ( isShuttingDown ) {
          msg = " SHUTTING DOWN " + msg
        }
        wTitle(msg)
        return msg
      }

      getHistoCount(item, index) {
        return [ item.Codon, item.Histocount ]
      }
      formatMs(date) { // nice ms output
        return  deresSeconds(date.getTime()) -  this.now.getTime()
      }






      drawHistogram() {

        if ( isShuttingDown === true ) { output("closing...press U to update or Q to quit"); this.quit(0, "shutdown while drawing") }
        if ( this.test || this.demo ) { log("test or demo"); return }
        if ( renderLock === false ) {
          error( "surprise! race condition from nam.")
          this.rawDNA = "!"
          // this.safelyPoll(`drawHistogram`)
          return false
        }
        if ( this.updatesTimer) { clearTimeout( this.updatesTimer )}


        if ( remain >= 0 ) { // dont update if not rendering / during shutdown
          if ( this.msPerUpdate  <  this.maxMsPerUpdate ) {
            this.msPerUpdate  += 50 // this.updates will slow over time on big jobs
            if (this.devmode === true) {
              this.msPerUpdate  += 100 // this.updates will slow over time on big jobs
              if (debug === true) {
                this.msPerUpdate  += 100
              }
            }
          }
          this.updatesTimer = setTimeout(() => {
            if ( isShuttingDown ) {
              output("Shutting down")
            } else {
              this.drawHistogram() // MAKE THE HISTOGRAM AGAIN LATER
              log("drawing again if rendering in " +  this.msPerUpdate )
            }
          },  this.msPerUpdate )
        } else { log("update finished") }

        this.progressTick()
        if ( this.updates === false ) {
          if (debounce()){
            const msg = `${batchProgress()} / ${humanizeDuration( this.timeRemain)} /`
            wTitle(msg)
            redoline(`[${chalk.bold( maxWidth(tx-6 , status + " " + this.justNameOfPNG  ))} / ${this.printRGB()}]`)
          }
          return false
        }
        tups++
        if ( tups <= 2 ) { return }
        let aacdata = []
        let text = this.calcUpdate()
        this.colDebug = this.setDebugCols() // Math.round(term.width / 3);
        for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop

          aacdata[ this.pepTable[ p ].Codon] = this.pepTable[ p ].Histocount
        }
        let array = [
          ` Load: ${ this.loadAverages()}  Files: ${remain}/${batchSize}`,
          `| File: ${chalk.bgWhite.inverse( this.justNameOfPNG)}.${ this.extension }`,
          `| i@${ fixedWidth(10, this.charClock.toLocaleString())} Breaks:${ fixedWidth(6, this.breakClock.toLocaleString())} Filesize:${ fixedWidth(7, bytes(  this.baseChars ))}`,
          `| Next update:${ fixedWidth(6,  this.msPerUpdate .toLocaleString())}ms Pixels:${ fixedWidth(10, " " + this.pixelClock.toLocaleString())}  Host: ${hostname}`,
          `| CPU: ${ fixedWidth(10, bytes( this.bytesPerMs*1000))} /sec ${ fixedWidth(5, this.codonsPerSec.toLocaleString())}K acids /sec`,
          `| Next file >>> ${maxWidth(24, this.nextFile)}`,
          `| Codons:${ fixedWidth(14, " " +  this.genomeSize.toLocaleString())}`,
          `  DNA Sample: ${ fixedWidth(tx/4, this.rawDNA) } ${ this.showFlags()}`,
          `  RunID: ${chalk.rgb(128, 0, 0).bold( this.runid )} acids per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )}   Term x,y: (${tx},${ty}) ${chalk.inverse( highlightOrNothin())} ${this.peptide} ${status}`
        ]
        clearCheck()
        if ( this.fullscreen === true ) {
          term.moveTo(1 + this.termMarginLeft,1)
        }
        if ( this.dnabg === true ) {
          this.rawDNA = this.rawDNA.substring(0, termPixels)
          output(chalk.inverse.grey.bgBlack( this.rawDNA) )
          term.moveTo(1 + this.termMarginLeft,1)

          output(`     To disable real-time DNA background use any of --no-dnabg --no-updates --quiet -q  (${tx},${ty})`)
        }
        this.rawDNA = funknzlabel

        if ( this.fullscreen === true) {
          term.moveTo(1 + this.termMarginLeft,1)
        }
        term.up( termDisplayHeight)

        printRadMessage(array)
        output(`${chalk.rgb(128, 255, 128)( nicePercent(this.percentComplete) )} elapsed: ${ fixedWidth(12, humanizeDuration( this.msElapsed )) }  /  ${humanizeDuration( this.timeRemain)} remain`)
        output(`${ twosigbitsTolocale( gbprocessed )} GB All time total on ${chalk.yellow( hostname )} ${ cliruns.toLocaleString()} jobs run total`)
        this.progressTick()
        output(`Report URL:  ${chalk.underline(  blueWhite( maxWidth(tx - 16, this.currentURL )))}`)
        output(`Input file:  ${chalk.underline(  blueWhite( path.normalize( this.dnafile )))}`)
        output(`Output path: ${chalk.underline(  blueWhite( path.join( this.outputPath, this.shortnameGenome)))}`)
        output( this.printRGB() )
        term.right( this.termMarginLeft )
        if ( this.clear === true ) {
          term.eraseDisplayBelow()
          output("term.eraseDisplayBelow")
        }

        if (term.height - 32  >   termHistoHeight  +  termDisplayHeight && tx - 8 > wideScreen) {
          if ( this.fullscreen === true ) { output( this.blurb() ) }
          output()
          if (this.keyboard) {
            output(interactiveKeysGuide)
          }
          output( histogram(aacdata, { bar: "/", width: this.colDebug*2, sort: true, map: aacdata.Histocount} ))
          output()
          // if ( brute === true ) {
          //   output( `${  this.rgbArray.length  } this.pepTable[5].lm_array.length: ${this.pepTable[5].lm_array.length} ` )
          // }
          term.up(  termHistoHeight )
        } else {
          output(chalk.bold.italic(" Increase the size of your terminal for realtime histogram."))
          output(`   Genome size: ${ this.genomeSize.toLocaleString()}`)
          if ( this.quiet == false && this.clear === true ) {
            term.up(  2 )
          }


        }

      }
      printRGB() {
        let ret = `Last Acid: ${ chalk.inverse.rgb(
          ceiling( this.red ),
          ceiling( this.green ),
          ceiling( this.blue )).bgWhite.bold( fixedWidth(16, "  " + this.aminoacid + "   ") )
        }`
        ret += "Last pixel: "
        ret += chalk.bold(
          chalk.rgb( this.mixRGBA[0], this.mixRGBA[1], this.mixRGBA[2]).bgBlack.inverse( "RGB: " )) +
          chalk.rgb( this.mixRGBA[0], 0, 0).inverse.bgBlue(  fixedWidth(7, `R:  ${this.mixRGBA[0]}` )) +
          chalk.rgb(0, this.mixRGBA[1], 0).inverse.bgRed( fixedWidth(10, `G:  ${this.mixRGBA[1]}` )) +
          chalk.rgb(0, 0, this.mixRGBA[2]).inverse.bgYellow(fixedWidth(8, `B:  ${this.mixRGBA[2]}` )) +

          chalk.rgb(this.red, 0, 0).inverse.bgBlue(  fixedWidth(7, `R:  ${this.red}` )) +
          chalk.rgb(0, this.green, 0).inverse.bgRed( fixedWidth(10, `G:  ${this.green}` )) +
          chalk.rgb(0, 0, this.blue).inverse.bgYellow(fixedWidth(8, `B:  ${this.blue}` )) // +
          //
          // chalk.rgb(this.peakRed, 0, 0).inverse.bgBlue(  fixedWidth(7, `R:  ${this.peakRed}` )) +
          // chalk.rgb(0, this.peakGreen, 0).inverse.bgRed( fixedWidth(10, `G:  ${this.peakGreen}` )) +
          // chalk.rgb(0, 0, this.peakBlue).inverse.bgYellow(fixedWidth(8, `B:  ${this.peakBlue}` )) +
          // chalk.rgb(this.peakAlpha, this.peakAlpha, this.peakAlpha).inverse.bgBlue(maxWidth(8, `A:  ${this.peakAlpha}` ))
          ret += ` ${this.pixelStacking}`

          // log(ret)
          return ret
        }
        memToString() {
          let memReturn = "Memory load: [ "
          // const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
          const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          arr.reverse()
          const used = process.memoryUsage()
          for (let key in used) {
            memReturn += `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB `
          }
          return memReturn + " ] "
        }
        loadAverages() {
          const l0 = os.loadavg()[0]
          const l1 = os.loadavg()[1]
          const l2 = os.loadavg()[2]
          return twosigbitsTolocale(l0) + " / " + twosigbitsTolocale(l1) + " / " + twosigbitsTolocale(l2)
        }
        peptideOrNothing() {
          return ( this.peptide == "Reference" ? "" : this.peptide )
        }
        tripletOrNothing() {
          return ( this.triplet == "Reference" ? "" : this.triplet )
        }
        isTriplet( obj ) { // GTC = true ABC = false
          const elTripo = obj.DNA
          const result = cleanChar(elTripo.substring(0,1)) + cleanChar(elTripo.substring(1,2))  +  cleanChar(elTripo.substring(2,3))
          if (result.length == 3) {
            return true
          } else {
            return false
          }
        }
        isHighlightTriplet(array) {
          return array.DNA == this.triplet
        }
        isfocusPeptide(pep) {
          return pep.Codon.toLowerCase() == this.peptide.toLowerCase()
        }
        isStartCodon(pep) {
          return pep.Codon == "Methionine"
        }
        isStopCodon(pep) {
          return (pep.Codon == "Amber" || pep.Codon == "Ochre" || pep.Codon == "Opal" )
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
          return ""
        }
        isNormalTriplet(normaltrip) {
          return dnaTriplets => dnaTriplets.DNA.toUpperCase() === normaltrip.toUpperCase()
        }

        tidyTripletName(str) {
          for ( let i =0; i < dnaTriplets.length; i++) {
            if ( spaceTo_( dnaTriplets[i].DNA.toUpperCase() ) == spaceTo_( str.toUpperCase() ) ) {
              return dnaTriplets[i].DNA
            }
          }
          return "Reference"
        }


        tripletToHue(str) {
          console.warn(str)
          let hue = dnaTriplets.find( this.isTriplet).Hue
          if (hue !== undefined) {
            return hue
          } else {
            return 120
          }
        }
        peptideToHue(str) {
          console.warn(`str ${str}`)
          let peptide = this.pepTable.find( (pep) => { pep.Codon == str })
          console.warn(peptide)
          return peptide.Hue
        }
        getCodonIndex(str) {
          return this.pepTable.indexOf(str)
        }
        getTripletIndex(str) {
          return dnaTriplets.indexOf( str )
        }
        // take 3 letters, convert into a Uint8ClampedArray with 4 items


        tripletToRGBA(currentTriplet) {
          // STOP CODONS are hard coded as   index 24 in this.pepTable array       "Description": "One of Opal, Ochre, or Amber",
          // START CODONS are hard coded as  ndex 23 in this.pepTable array       "Description": "Count of Methionine",
          // Non-coding NNN this.triplets are hard coded as index 0 in this.pepTable array
          this.aminoacid = "ERROR"
          this.debugFreq = this.throttledFreq(3)

          let theMatch = dnaTriplets.find( this.isTriplet).DNA
          for (let z=0; z < dnaTriplets.length; z++) {
            if (currentTriplet == dnaTriplets[z].DNA) { // SUCCESSFUL MATCH (convert to map)
              this.aminoacid = dnaTriplets[z].Codon
              dnaTriplets[z].Histocount++
              // this.dot( this.genomeSize, this.debugFreq, `z = ${z} theMatch ${theMatch} <==> ${currentTriplet} ${this.aminoacid}`); // show each 10,000th (or so) base pair.
              for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
                if (this.aminoacid == this.pepTable[ p ].Codon) {
                  this.pepTable[ p ].Histocount++
                  const acidesc = this.pepTable[ p ].Description
                  if (acidesc == "Stop Codons") {
                    this.pepTable[21].Histocount++
                  } else if (acidesc == "Start Codon") {
                    this.pepTable[20].Histocount++
                  }
                  break
                }
              }

              let hue = dnaTriplets[z].Hue / 360
              let tempcolor = hsvToRgb(hue, 1, 1)
              this.red    = tempcolor[0]
              this.green  = tempcolor[1]
              this.blue   = tempcolor[2]

              if ( isHighlightSet === true ) {
                if (this.aminoacid == this.peptide ) {
                  this.alpha = 255
                } else {
                  this.alpha = 16 // non highlight alpha makes them almost fully translucent
                }
              } else {
                this.alpha = 255 // only custom this.peptide pngs are transparent
              }
              return [ this.red ,  this.green ,  this.blue , this.alpha]
            }
          }
          if ( this.aminoacid == "ERROR" ) {
            this.aminoacid = "ERROR " + currentTriplet
          }
          return [0,0,0,0] // this colour means "ERROR".
        }






        //PARSE SOURCE CODE
        // https://www.npmjs.com/package/parse-apache-directory-index
        // stream.pipe(tr).pipe(process.stdout);






        setupPrefs() {
          locateWebroot()
          this.outputPath = path.resolve( webroot, "output")

          projectprefs = new Preferences("nz.funk.aminosee.project", {
            aminosee: {
              cliruns: 0,
              gbprocessed: 0,
              opens: 0,
              genomes: [ "megabase", "50KB_TestPattern" ],
              url: "http://localhost:4321",
              port: defaultPort
            }
          }, {
            encrypt: false,
            file: path.resolve( os.homedir(), obviousFoldername, "aminosee_project.conf"),
            format: "yaml"
          })

          userprefs = new Preferences("nz.funk.aminosee.user", {
            aminosee: {
              cliruns: 0,
              guiruns: 0,
              gbprocessed: 0,
              completed: 0
            }
          }, {
            encrypt: false,
            file: path.resolve( os.homedir(), ".config", "preferences", "nz.funk.aminosee.conf"),
            format: "yaml"
          })
          // Preferences can be accessed directly
          userprefs.aminosee.cliruns++ // increment run counter. for a future high score table stat and things maybe.
          cliruns++
          if (  userprefs.aminosee.cliruns > cliruns ) {
            cliruns = Math.round( userprefs.aminosee.cliruns )
          }
          gbprocessed  = Math.round( userprefs.aminosee.gbprocessed )
          genomesRendered = projectprefs.aminosee.genomes
          url = projectprefs.aminosee.url
          log( 	blueWhite(`webroot 		 = ${webroot}`) )
          log( 	blueWhite(`cliruns 		 = ${cliruns}`) )
          log( 	blueWhite(`url 				 = ${url}`) )
          log( 	blueWhite(`gbprocessed = ${gbprocessed}`) )
          log(`Preferences setup`)
          return [ userprefs, projectprefs ]
        }













      } // <<< --- END OF CLASS




      function bugtxt(txt) { // full debug output
        // if (debug === true) {
        //   bugout(txt)
        // }
      }
      function output(txt) {
        cpuhit++
        if (typeof txt === "undefined" || typeof cliInstance === "undefined") { console.log() ; return; }

        wTitle(`${  txt }`) // put it on the terminal windowbar or in tmux

        if (cliInstance.quiet === true) {
          redoline(txt)
        } else if (debug === true) {
          bugout( txt )
        } else {
          term.column(0)
          term.eraseLine()
          console.log( txt )
        }
      }
      function out(txt) {
        cpuhit++
        if (typeof txt === "undefined") { txt = ` > ${cpuhit} ${status} ` }
        if ( debug === true ) {
          // process.stdout.write( removeNonAscii( txt ) )
          bugout(txt)
        } else {
          process.stdout.write(".")
        }
      }
      function debounce( ms ) {
        if ( typeof ms === "undefined" ) { ms = 500 } // half second
        let d = new Date().getTime()
        if ( d + ms > lastHammered ) {
          lastHammered = d + ms*2
          return true
        }
        return false
      }
      function log(txt  ) {
        // return
        if ( debug === true || verbose ) {
          bugout( txt )
        } else if (verbose) {
          console.log( txt )
        } else {
          redoline( txt )
        }
      }
      function batchProgress() {
        return `[${ 1 + batchSize - remain} / ${batchSize} : ${cliInstance.usersPeptide} ${renderLock ? nicePercent( cliInstance.percentComplete ) + ' busy ' + streamLineNr : 'idle'} ${ highlightFilename (this.focus)} ${cfile} ${ brute ? 'brute force': ''}]`
      }
      function wTitle(txt) {
        terminateIfUndef(txt)
        if ( !debounce() || typeof cfile === "undefined" || typeof hostname === "undefined" || typeof txt === "undefined") {
          return false
        }
        runid = cliInstance.runid
        txt = `${helixEmoji} ${ removeNonAscii( maxWidth( 48, txt ))} | ${batchProgress()} ${cfile}@${hostname} ${new Date().getTime()}`
        term.windowTitle( txt )
      }
      function bugout(txt) {

        console.log( `${helixEmoji}: ${cpuhit} ${maxWidth(16, status)} ${cliInstance.usersPeptide} ${remain} ${txt} `)

      }
      function deleteFile(file) {
        let ret = false
        if ( !doesFileExist(file) ) { return false }
        try {
          fs.unlinkSync(file, (err) => {
            log(`Removing file OK... ${fixedWidth(64, file)}`)
            ret = true
            if (err) {
              log(`Removing file error... ${fixedWidth(64, file)}`)
              log(err)
            }
          })
        } catch (err) {
          log(`Removing file caught exception... ${fixedWidth(64, file)}`)
          log(err)
        }
        return ret
      }
      function deleteDirectory( folder ) {
        let ret = false
        try {
          fs.rmdirSync(folder, (err) => {
            log(`Removing folder OK... ${fixedWidth(64, folder)}`)
            ret = true
            if (err) {
              log(`Removing folder error... ${fixedWidth(64, folder)}`)
              log(err)
            }
          })
        } catch (err) {
          log(`Removing folder caught exception... ${fixedWidth(64, folder)}`)
          log(err)
        }
        return ret
      }
      function termSize() {
        tx = term.width
        ty = term.height
        termPixels = (tx) * (ty-8)
      }
      function destroyKeyboardUI() {
        // log(`Disabling keyboard UI`)
        process.stdin.pause() // stop eating the this.keyboard!
        try {
          process.stdin.setRawMode(false) // back to cooked this.mode
        } catch(err) {
          log(`Could not disable raw mode this.keyboard: ${err}`)
          // process.stdin.resume() // DONT EVEN THINK ABOUT IT.
        }
      }
      function ceiling(number) {
        number = Math.ceil(number) // round into integer
        if (number > 255) {
          number = 255
        } else if (number < 0 ){
          number = 0
        }
        return number
      }

      function twosigbitsTolocale(num){
        return (Math.round(num*100)/100).toLocaleString()
      }
      // function threesigbitsTolocale(num){
      // 	return (Math.round(num*1000)/1000).toLocaleString()
      // }
      // function fixedRightSide(wide, str) {
      // 	return maxWidth(wide, minWidthRight(wide, str))
      // }
      function fixedWidth(wide, str) { // return strings all the same length
        return minWidth(wide, maxWidth(wide, str))
      }
      function maxWidth(wide, str) { // shorten it if you need to
        if ( typeof str === "undefined") { return "0" }
        if (str) {
          if (str.length > wide) { str = str.substring(0,wide) }
        }
        return str
      }
      function minWidth(wide, str) { // make it wider
        if ( typeof str === "undefined") { str = " ~@~ " + wide}
        while(str.length < wide) { 	str = str  +  " " }
        return str
      }
      function minWidthRight(wide, str) { // make it wider
        if ( typeof str === "undefined") { return " " }
        while(str.length < wide) { str += " ~ " }
        return str
      }
      function blueWhite(txt) {
        return chalk.rgb(0,0,100).bgWhite.inverse.bold( txt  )
        // return chalk.rgb(0,0,100).bgWhite.inverse.bold( maxWidth( tx * 0.7,  txt))
      }
      function spaceTo_(str) {
        // log(str);
        if (typeof str === "undefined") {
          return ""
        } else {
          str += ""
          while(str.indexOf(" ") > -1) { str = str.replace(" ", "_") }
          return str
        }
      }


      function runDemo() {
        mode(`run demo`)
        var that = cliInstance
        async.parallel( [
        // async.waterfall( [
          function( cb ) {
            output("blue")
            that.openImage = true
            that.peptide = "Opal" // Blue TESTS
            // that.peptide = "Blue" // Blue TESTS
            that.ratio = "sqr"
            that.generateTestPatterns(() => {
              output("hello ghello")
              that.openOutputs()
              cb()
            })
            // setTimeout( () => {

            // }, raceDelay )

          },
          function( cb ) {
            output("RED")
            that.openOutputs()
            that.openImage = false
            that.peptide = "Ochre" // Red TESTS
            that.ratio = "sqr"
            that.generateTestPatterns(cb)
          },
          function( cb ) {
            output("PURPLE")
            that.openOutputs()
            that.peptide = "Arginine" //  PURPLE TESTS
            that.ratio = "sqr"
            that.generateTestPatterns(cb)
          },
          function( cb ) {
            that.openOutputs()
            that.peptide = "Methionine" //  that.green  TESTS
            that.ratio = "sqr"
            that.generateTestPatterns(cb)
          },
          function ( cb ) {
            that.openOutputs()
            cb()
          },
          function( cb ) {
            if ( webserverEnabled ) {
              output("server started: " +   server( generateTheArgs() ))
              autoStartGui = false
            }
            remain = 0
            cb()
          }
        ] )
        .exec( function( error ) {
          if ( error ) { log( "Doh!" )  }
          else { log( "WEEEEE DONE Yay! Done!" )  }
        } )

      }
      // function setupPrefs(that) {
      //   locateWebroot()
      //   that.outputPath = path.resolve( webroot, "output")
      //
      //   projectprefs = new Preferences("nz.funk.aminosee.project", {
      //     aminosee: {
      //       cliruns: 0,
      //       gbprocessed: 0,
      //       opens: 0,
      //       genomes: [ "megabase", "50KB_TestPattern" ],
      //       url: "http://localhost:4321",
      //       port: defaultPort
      //     }
      //   }, {
      //     encrypt: false,
      //     file: path.resolve( os.homedir(), obviousFoldername, "aminosee_project.conf"),
      //     format: "yaml"
      //   })
      //
      //   userprefs = new Preferences("nz.funk.aminosee.user", {
      //     aminosee: {
      //       cliruns: 0,
      //       guiruns: 0,
      //       gbprocessed: 0,
      //       completed: 0
      //     }
      //   }, {
      //     encrypt: false,
      //     file: path.resolve( os.homedir(), ".config", "preferences", "nz.funk.aminosee.conf"),
      //     format: "yaml"
      //   })
      //   // Preferences can be accessed directly
      //   userprefs.aminosee.cliruns++ // increment run counter. for a future high score table stat and things maybe.
      //   cliruns++
      //   if (  userprefs.aminosee.cliruns > cliruns ) {
      //     cliruns = Math.round( userprefs.aminosee.cliruns )
      //   }
      //   gbprocessed  = Math.round( userprefs.aminosee.gbprocessed )
      //   genomesRendered = projectprefs.aminosee.genomes
      //   url = projectprefs.aminosee.url
      //   log( 	blueWhite(`webroot 		 = ${webroot}`) )
      //   log( 	blueWhite(`cliruns 		 = ${cliruns}`) )
      //   log( 	blueWhite(`url 				 = ${url}`) )
      //   log( 	blueWhite(`gbprocessed = ${gbprocessed}`) )
      //
      //   return [ userprefs, projectprefs ]
      // }
      function printlogo() {
        console.log(`${helixEmoji + chalk.rgb(255, 255, 255).inverse(" Amino")}${chalk.rgb(196,196,196).inverse("See")}${chalk.rgb(128,128,128).inverse("No")}${chalk.grey.inverse("Evil ") } DNA Visualisation v${chalk.rgb(255,255,0)(version)} by Tom Atkinson`)
      }
      function removeLineBreaks(txt) {
        return txt.replace(/(\r\n\t|\n|\r\t)/gm,"")
      }
      // remove anything that isn't ATCG, convert U to T
      function cleanChar(c) {
        let char = c.toUpperCase()
        if (char == "A" || char == "C" || char == "G" || char == "T" || char == "U") {
          if (char == "U") {
            return "T" // convert RNA into DNA
          } else {
            return char // add it to the clean string
          }
        } else if ( char == "N" ) {
          return "N"
        } else {
          return "." // remove line breaks etc. also helps  this.error detect codons.
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
        r /= 255, g /= 255, b /= 255

        var max = Math.max(r, g, b), min = Math.min(r, g, b)
        var hue, s, l = (max + min) / 2

        if (max == min) {
          hue = s = 0 // achromatic
        } else {
          var d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

          switch (max) {
            case r: hue = (g - b) / d + (g < b ? 6 : 0); break
            case g: hue = (b - r) / d + 2; break
            case b: hue = (r - g) / d + 4; break
          }

          hue /= 6
        }

        return [ hue, s, l ]
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
        var r, g, b

        if (s == 0) {
          r = g = b = l // achromatic
        } else {


          var q = l < 0.5 ? l * (1 + s) : l + s - l * s
          var p = 2 * l - q

          r = hue2rgb(p, q, hue + 1/3)
          g = hue2rgb(p, q, hue)
          b = hue2rgb(p, q, hue - 1/3)
        }

        return [ r * 255, g * 255, b * 255 ]
      }
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
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
        r /= 255, g /= 255, b /= 255

        var max = Math.max(r, g, b), min = Math.min(r, g, b)
        var h, s, v = max

        var d = max - min
        s = max == 0 ? 0 : d / max

        if (max == min) {
          h = 0 // achromatic
        } else {
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
          }

          h /= 6
        }

        return [ h, s, v ]
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
        return path.basename(f)
        // if (typeof f === "undefined") { f = "was_not_set";  console.warn(f); }
        // return f.replace(/^.*[\\\/]/, '');
      }



      function fileSystemChecks(file) { // make sure file is writable or folder exists etc
        let problem = false
        let name = basename( path.resolve(file))
        let msg = `Stats for file ${name}`
        if (typeof file === "undefined") { return false }
        if (!doesFileExist(file)) {
          file = path.resolve(file)
        }
        if (!doesFileExist(file)) {
          return false
        }
        let isDir = doesFolderExist(file)

        try {
          // Check if the file is ACTUALLY FOLDER.
          isDir ? msg += "is not a folder, " : msg += "is a folder (will re-issue the job as ), "

          if (!isDir) { ///////// ONLY FILES
            // Check if the file exists in the current directory.
            fs.access(file, fs.constants.F_OK, (err) => {
              if(err) {  msg +=  "does not exist, "   } else  { msg += "exists, "  }
            })

            // Check if the file is readable.
            fs.access(file, fs.constants.R_OK, (err) => {
              if(err) {  msg +=  "is not readable, "  } else  { msg += "is readable, " }
            })

            // Check if the file is writable.
            fs.access(file, fs.constants.W_OK, (err) => {
              if(err) {  msg +=  "is not writable, "} else  { msg += "is writeable, "  }
            })

            // Check if the file exists in the current directory, and if it is writable.
            fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
              if (err) {
                msg += "does not exist or is read-only, "
              } else {
                msg += "exists, and it is writable, "
              }
            })
          }
        } catch(e) {
          output(chalk.inverse("Caught ERROR:") + e)
        }

        bugtxt(msg + ", and that is all.")
        return !problem
      }
      function terminalRGB(_text, _r, _g, _b) {
        term.eraseLine()
        console.log(  chalk.bgBlack( fixedWidth( (tx - 8)  -	this.radMargin, " "  )  )  )
        term.up(1)
        console.log( chalk.rgb(_r,_g,_b).bold.bgBlack(" " +_text) )
        return chalk.rgb(_r,_g,_b).bold(_text)
        // return chalk.rgb(_r,_g,_b).inverse(_text)
        // return chalk.rgb(_r,_g,_b).bgBlack(_text)
      }
      function countdown(text, timeMs, cb) {
        if ( this.quiet || text == "" ) {
          log(msg)
          return false
        }

        let msg =  chalk.rgb(100,140,180)( "@ " + text + humanizeDuration ( deresSeconds(timeMs)))
        redoline(msg)

        if ( timeMs > 0 ) {
          cliInstance.progTimer = setTimeout(() => {
            if ( typeof cb !== "undefined" ) {
              countdown(text, timeMs - 500, cb)
            } else {
              countdown(text, timeMs - 500)
            }
          },  500 )
        } else {
          redoline(`countdown`)
          runcb(cb)
        }
      }
      function mode(txt) { // good for debugging
        status = txt
        txt = batchProgress() + txt
        wTitle(txt)
        if ( cliInstance.devmode || debug ) {
          // console.log(txt)
        } else if ( !cliInstance.quiet ) {
          // redoline(txt)
        } else {
          // out(`.`);
        }
      }
      function gimmeDat() {
        let that
        if ( typeof cliInstance !== "undefined") {  that = cliInstance }
        if ( typeof this === "undefined")        {  that = this }
        if ( typeof that === "undefined")        {  that = false }
        return that
      }
      function redoline(txt) {
        if (debug === true) {
          txt = `[${cpuhit} ${renderLock ? 'busy' : 'idle'}] ${ txt } ] `
        } else {
          // if (debounce(25) === true) {
            term.eraseLine()
            console.log( maxWidth( tx/2, txt ))
            term.eraseLine()
            term.column( 0 )
            term.up( 1 )
          }
        // }
      }
      function deresSeconds(ms){
        return Math.round(ms/1000) * 1000
      }
      //
      // function streamingZip(f) {
      // 	zipfile = path.resolve(f)
      // 	fs.createReadStream(zipfile)
      // 		.pipe(unzipper.Parse())
      // 		.pipe(stream.Transform({
      // 			objectMode: true,
      // 			transform: function(entry,e,cb) {
      // 				var zipPath = entry.path
      // 				var type = entry.type // 'Directory' or 'File'
      // 				var size = entry.size
      // 				var cb = function (byte) {
      // 					output(byte)
      // 				}
      // 				if (zipPath == "this IS the file I'm looking for") {
      // 					entry.pipe(fs.createWriteStream("dna"))
      // 						.on("finish",cb)
      // 				} else {
      // 					entry.autodrain()
      // 					if ( cb !== undefined ) { cb( ) }
      // 				}
      // 			}
      // 		}))
      // }
      function formatAMPM(date) { // nice time output
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var secs   = date.getSeconds()
        var ampm = hours >= 12 ? "pm" : "am"
        hours = hours % 12
        hours = hours ? hours : 12 // the hour '0' should be '12'
        minutes = minutes < 10 ? "0"+minutes : minutes
        secs = secs < 10 ? "0"+secs : secs
        var strTime = hours + ":" + minutes + ":" + secs + " " + ampm
        return strTime
      }
      function killServers() {
        output("ISSUING 'killall node' use 'Q' key to quit without killing all node processes!")
        spawn("nice", ["killall", "node", "", "0"], { stdio: "pipe" })
        spawn("nice", ["killall", "aminosee.funk.nz_server", "", "0"], { stdio: "pipe" })
        spawn("nice", ["killall", "aminosee.funk.nz", "", "0"], { stdio: "pipe" })
        if ( server !== undefined && webserverEnabled ) {
          log("closing server")
          server.stop()
        } else {
          bugtxt("no server running?")
        }

      }
      function charAtCheck(file) { // if the this.dnafile starts with - return false
        if ( typeof file === "undefined") { return false }
        if ( file.charAt(0) == "-") {
          log(`cant use files that begin with a dash - ${ file }`)
          return false
        } else { return true }
      }
      function bgOpen(file, options, callback) {
        if ( typeof file === "undefined") { error("file must be supplied") }
        if ( typeof options === "undefined") { let options = { wait: false } }
        if ( typeof callback === "undefined") { open( file, options )  } else {
          open( file, options, callback)
        }
        projectprefs.aminosee.opens++ // increment open counter.
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
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
        var xhr = new XMLHttpRequest("https://www.funk.co.nz/aminosee/output/")
        let txt = xhr.responseText
        // testParse();
        // parse("https://www.funk.co.nz/aminosee/output/")
        output("list")
        output(txt)
        // parse(txt)
      }

      // process.on("SIGTERM", () => {
      //   let sig = `${batchProgress()} SIGTERM RECEIVED`
      //   output(sig)
      //   if ( remain > 0 || streamLineNr > 0 ) {
      //     sig += `ignoring but unlocking keyboard ${batchProgress()}`
      //     destroyKeyboardUI()
      //   } else {
      //     sig += `not unlocking keyboard ${batchProgress()}`
      //   }
      //   if (debounce()) {
      //     notQuiet(`${sig}`)
      //   }
      //   output(sig)
      //   // cliInstance.gracefulQuit(130, sig)
      //   // cliInstance.destroyProgress();
      //   // process.exitCode = 130;
      //   // cliInstance.quit(130, "SIGTERM");
      //   cliInstance.quit(0, `sigterm`)
      //   // setTimeout( () => {
      //   //   process.exit() // this.now the "exit" event will fire
      //   // }, raceDelay )
      //
      // })
      process.on("SIGINT", function() {
        let sig = "SIGINT"
        output(`Received ${sig} signal`)
        output(`Received ${sig} signal`)
        cliInstance.gracefulQuit(130, sig)
        process.exitCode = 130
        cliInstance.quit(130, "SIGINT")
        setImmediate( () => {
          cliInstance.destroyProgress()
          process.exit() // this.now the "exit" event will fire
        })
      })
        function termDrawImage(fullpath, reason, cb) {
        if (cliInstance.quiet || typeof fullpath === "undefined" || typeof reason === "undefined") {
          log( `${cfile} ${reason}` )
          return false
        }
        // output()
        term.saveCursor()
        log(`Terminal image: ${ chalk.inverse(  path.basename(fullpath) ) } ${ reason}`)
        term.drawImage( fullpath, { shrink: { width: tx * 0.8,  height: ty  * 0.8, left: tx/2, top: ty/2 } }, () => {
          term.restoreCursor()
          runcb(cb)
        })
      }
      function nicePercent(percent) {
        if (typeof percent === "undefined") { percent = cliInstance.percentComplete; }
        const ret = minWidth(4, (Math.round(  percent*1000) / 10)) + "%"
        // redoline(`progress ${ret}`)
        return ret
      }
      function tidyPeptideName(str) { // give it "OPAL" it gives "Opal". GIVE it aspartic_ACID or "gluTAMic acid". also it gives "Reference"
        if (typeof str === "undefined") {
          error(`no str was set: ${str} will return "Reference" instead`)
          return "Reference"
        }
        try {
          str = spaceTo_( str.toUpperCase() )
        } catch(e) {
          log(`no str was set: ${str} will return "Reference"`)
          return "Reference"
        }
        for ( let i = 0; i < data.pepTable.length; i++) {
          let compareTo = spaceTo_( data.pepTable[i].Codon.toUpperCase() )
          if ( compareTo == str ) {
            return data.pepTable[i].Codon
          }
        }
        return "Reference"
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
        [x, y] = MyManHilbert.decode(16,i) // <-- THIS IS WHERE THE MAGIC HILBERT HAPPENS
        // ROTATE IMAGE CLOCKWISE 90 DEGREES IF this.dimension IS EVEN NUMBER FRAMES
        if ( dimension % 2 == 0 ) { // if even number
          let newY = x
          x = y
          y = newY
        }
        return [ x, y ]
      }
      function clearCheck() { // maybe clear the terminal
        if ( this.clear === true) {
          term.clear()
          term.eraseDisplayBelow()
        } else {
          term.eraseDisplayBelow()
          // process.stdout.write(" "+ status)
          // console.log(this.clear + " [c] "+ status)
        }
      }
      function stopWork(reason) {
        if (typeof reason === "undefined") { error("You have to give a reason") }
        // cliInstance.gracefulQuit(0, reason)
      }
      function locateWebroot( filename ) {
        let clusterRender = false

        if ( typeof filename === "undefined" ) {
          filename =  process.cwd()
        }

        // log(`If your DNA source directory paths contain a directory with a magic name: '${obviousFoldername}' then will be used for output instead of your home folder at $HOME or ~`)

        webroot =  path.resolve( path.dirname( filename ), obviousFoldername) // support drag and drop in the GUI

        if ( doesFolderExist(webroot) ) { // support drag and drop in the GUI
          clusterRender = true
        } else { // if the current folder has an output dir, then use it (disabled cluster render)
          webroot = path.resolve( process.cwd(), obviousFoldername) // support current working directory at CLI terminal
        }
        if (!clusterRender && doesFolderExist( webroot )) {
          clusterRender = true
        }
        if (!clusterRender && !doesFolderExist( webroot )) {
          webroot = path.resolve( os.homedir(), obviousFoldername ) // ~/AminoSee_webroot
        }

        if (clusterRender === true) {
          // output( shiznit( batchProgress() + "   🚄 CLUSTER FOLDER ENABLED   ") )
          // log( blueWhite( path.normalize( webroot )))
          // log("Enabled by the prseence of a /output/ or /AminoSee_webroot/ folder in *current* dir. If not present, local users homedir ~/AminoSee_webroot")
        } else {
        }
        // log(`HOME FOLDER ENABLED: ${ blueWhite( path.normalize( webroot ))} for ${ path.normalize( filename )}`)
        return webroot
      }
      function shiznit(txt) {
        txt = maxWidth( tx / 2, txt)
        return chalk.bgRgb(32,32,0).bold("   ") + chalk.bgRgb(64,64,0).bold("   ") + chalk.bgRgb(128,128,0).bold("   ") + chalk.bgRgb(196,196,0).bold("   ") + chalk.bgRgb(32,32,0).rgb(255,255,200).bold(txt)
      }
      function dedupeArray(a) {
        return [...new Set(a)]
      }
      function getArgs() {
        return this.args
      }
      function expand( red, green, blue, alpha) {

        red = parseInt(red)
        green = parseInt(green)
        blue = parseInt(blue)

        let scaleBlack = 1
        let maxi = Math.max( red, green, blue ) // find brightest channel
        let mini = Math.min( red, green, blue ) // find brightest channel
        // log(`expand: rgba [${red} ${green} ${blue}] min [${mini}] max [${maxi}] scaleBlack [${scaleBlack}] blackPoint [${blackPoint}]`)

        if ( mini > blackPoint ) { // if the colour is too unsaturated
          scaleBlack = blackPoint / mini // if the min is 100, and blackPoint is 64,
          // scaleBlack will be 0.64 * 100 = 64
          if ( red == mini ) {
            red = blackPoint
            if ( green == maxi) {
              blue *= scaleBlack
            } else {
              green *= scaleBlack
            }
          } else if ( green == mini) {
            green = blackPoint
            if ( red == maxi) {
              blue *= scaleBlack
            } else {
              red *= scaleBlack
            }
          } else if ( blue == mini ) {
            blue = blackPoint
            if ( green == maxi) {
              red *= scaleBlack
            } else {
              green *= scaleBlack
            }
          }
        } else {
          bugtxt("not expanding")
        }
        bugtxt(`expand: rgba [${red} ${green} ${blue}] mini [${mini}] maxi [${maxi}] scaleBlack [${scaleBlack}] blackPoint [${blackPoint}]`)
        return [red, green, blue, alpha ]
      }
      function balanceColour( red, green, blue, alpha) {
        // find the brightest channel, eg red, green or blue
        // examples
        // RGBA: [ 7236.384615384615, 446 711.5 6078.884615384615 8077.961538461538 ]
        let max = Math.max( red, green, blue ) // find brightest channel

        let scaleGamma = 255 / max // calculate scale factor from 255 / max
        if ( alpha < max / 2 ) {
          alpha /= 1.8
        } else {
          alpha *= 1.8
        }
        if ( alpha > max ) {
          alpha = max
        }
        if ( !isHighlightSet ) {
          return expand( Math.round(red * scaleGamma), Math.round(green * scaleGamma), Math.round(blue * scaleGamma), Math.round( 255   ) )
        } else {
          return [ Math.round(red * scaleGamma), Math.round(green * scaleGamma), Math.round(blue * scaleGamma), Math.round(  alpha * scaleGamma  )]
        }


        // return  [ Math.round(red * scaleGamma), Math.round(green * scaleGamma), Math.round(blue * scaleGamma), Math.round(alpha * scaleGamma)]
      }
      function genericPNG(rgbArray, width, height, filename, cb) {
        var img_data = Uint8ClampedArray.from( rgbArray )
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

        img_png.data = Buffer.from(img_data)
        let wstream = fs.createWriteStream( filename ) // this.filePNG
        let retProm =  new Promise((resolve) => {
          img_png.pack()
          .pipe(wstream)
          .on("finish", (err) => {
            if (err) { log(`Could not create write stream: ${ filename } due to ${err}`) }
            // bugtxt("linear Save OK " +  that.storage());
            that.linearFinished();
            runcb(cb)
          })
          resolve()
        }).then( bugtxt("LINEAR then") ).catch( bugtxt("LINEAR catch") )

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
      //   this.args._[0] = cfile;
      //   cfile = '*';
      //   this.args._.push( cfile); // DEMO
      //   this.pollForStream();
      // },
      // function( cb ) {
      //   server.start( this.args );
      //   this.mkRenderFolders();
      //   // symlinkGUI(cb);
      // }
      //   ])
      //   .exec( function( error, results ) {
      //     if (  this.error ) { log( 'Doh!' ) ; }
      //     else { log( 'WEEEEE DONE Yay! Done!' ) ; }
      //   });
      // }

      function printRadMessage(arr) {
        // return
        // output( returnRadMessage(arr) );
        if (typeof arr === "undefined" || typeof arr !== "Array") {
          arr = ["    ", "    ", "    ", "    ", "    ", "", "Output path:", cliInstance.outputPath ]
          // arr = [ "    ________", "    ________", "    ________", "    ________", "    ________", "", "Output path:"," " ];
        }
        while ( arr.length < 9 ) {
          arr.push("    ")
        }
        for  (let i = 0; i < arr.length; i++) {
          let item = arr[i]  + " "
          while (item.length < 36) {
            item = item + " "
          }
          arr[i] = item
        }

        // let  this.radMargin  = cliInstance.termMarginLeft
        this.radMargin = 16
        output(" ")
        // term.right( this.radMargin )
        terminalRGB( helixEmoji + chalk.rgb(255, 32, 32).bgBlack(arr[0]) , 12, 34, 56)
        term.eraseLine()
        term.right( this.radMargin )
        if ( tx > wideScreen ) {
          terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐  ${arr[1]}`, 255, 60,  250); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘  ${arr[2]}`, 170, 150, 255); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─  ${arr[3]}`, 128, 240, 240); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(` by Tom Atkinson          aminosee.funk.nz            ${arr[4]}`, 225, 225, 130); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`  ah-mee-no-see     'I See It Now - I AminoSee it!'   ${arr[5]}`, 255, 180,  90); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`   ${ prettyDate(new Date())}   v${version} ${arr[6]}`          , 220, 120,  70); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(arr[7], 220, 80,   80); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(arr[8], 255, 32,   32); term.eraseLine()
        } else if ( tx >= windows7 && tx <= wideScreen ) {
          terminalRGB(`╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐ ${arr[1]}`, 255, 60,  250); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`╠═╣││││││││ │╚═╗├┤ ├┤  ${arr[2]}`, 170, 150, 255); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘ ${arr[3]}`, 128, 240, 240); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(` by Tom Atkinson       ${arr[4]}`, 225, 225, 130); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`  ah-mee-no-see        ${arr[5]}`, 255, 180,  90); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`${ prettyDate(new Date())} v${version} ${arr[6]} `, 220, 120,  70); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(arr[7], 220, 80,   80); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(arr[8], 255, 32,   32); term.eraseLine()
        } else if ( tx < windows7  ){
          terminalRGB(`╔═╗ ${arr[1]}`, 255, 60,  250) ; term.right( this.radMargin )// term.eraseLine()
          terminalRGB(`╠═╣ ${arr[2]}`, 170, 150, 255) ; term.right( this.radMargin )// term.eraseLine()
          terminalRGB(`╩ ╩ ${arr[3]}`, 128, 240, 240) ; term.right( this.radMargin ) //term.eraseLine()
          terminalRGB(`    ${arr[4]}`, 225, 225, 130) ; term.right( this.radMargin ) //term.eraseLine()
          terminalRGB(`  ah-mee-no-see ${arr[5]}`, 255, 180,  90); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(`${ prettyDate(new Date())} v${version} ${arr[6]} `, 220, 120,  70); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(arr[7], 220, 80,   80); term.right( this.radMargin ); term.eraseLine()
          terminalRGB(arr[8], 255, 32,   32); term.eraseLine()




        }

      }

      function cleanString(s) {
        let ret = ""
        s = removeLineBreaks(s)

        for (let i=0; i< s.length; i++) {
          ret += cleanChar(s.charAt(i))
        }
        return ret
      }
      function prettyDate(today) {
        var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        return today.toLocaleString(options) + "  " + today.toLocaleDateString(options) // Saturday, September 17, 2016
      }
      function calculateShrinkage( linearpix, dim, cpp ) { // danger: can change this.file of Hilbert images!
        if ( linearpix == 0 || dim == 0 || cpp == 0 ) { error(`division by zero`) }
        // give it a large number of pixels
        // it will choose a hilbert dimension
        // and return the shrinkage factor, codons per pixel hilbert
        let dimension, shrinkFactor
        let bestFit = optimumDimension (linearpix, "auto")

        if ( bestFit > defaultMagnitude ) {
          output(`This genome could be output at a higher resolution of ${hilbPixels[bestFit].toLocaleString()} than the default of ${bestFit}, you could try -m 8 or -m 9 if your machine is muscular, but it might core dump. -m10 would be 67,108,864 pixels but node runs out of stack before I get there on my 16 GB macOS. -Tom.`)
          dimension = defaultMagnitude
        } else if (bestFit < 2) {
          dimension = 2 // its an array index
          let msg = `That image is too small to make an image out of: ${linearpix} ispreview: ${ispreview}`
          output(blueWhite(msg))
          rollbackFolder()
          return false
        }

        if ( cliInstance.magnitude == "custom" ) {
          dimension = cliInstance.dimension // users choice over ride all this nonsense
        } else {
          dimension = bestFit // give him what he wants
        }

        // hilpix = hilbPixels[ cliInstance.dimension ]

        hilpix = hilbPixels[ dim ]
        shrinkFactor = linearpix / hilpix // THE GUTS OF IT
        codonsPerPixelHILBERT = cliInstance.codonsPerPixel * shrinkFactor
        log(`bestFit ${bestFit} shrinkFactor [${shrinkFactor}] codons per pixel [${codonsPerPixelHILBERT}]`)
        return shrinkFactor
        // return { // using globals again no point returning anything
        //   shrinkFactor: shrinkFactor,
        //   codonsPerPixelHILBERT: cppHILBERT
        // }
      }
      function optimumDimension (pix, magauto) { // give it pix it returns a HILBERT dimension that fits inside it with good over-sampling margins
        if ( pix == 0 ) {
          error(`zero values. ${streamLineNr}`)
          return 7
        }
        let dim = 1
        let rtxt = `[HILBERT] Calculating largest Hilbert curve image that can fit inside ${ twosigbitsTolocale(pix)} pixels, and over sampling factor of ${overSampleFactor}: `
        while (pix > (hilbPixels[dim] * overSampleFactor)) {
          if (dim > defaultMagnitude) {
            if ( magauto == "custom"  ) {
              if ( dim > theoreticalMaxMagnitude) {
                bugtxt(`Hilbert dimensions above 8 will likely exceed nodes heap memory and/or call stack. mag 11 sure does. spin up the fans. Capped your custom dimension to the ${ theoreticalMaxMagnitude }th order.`)
                dim = theoreticalMaxMagnitude
              }
              break
            } else {
              dim = defaultMagnitude
              break
            }
          }
          dim++
        }
        if (dim > 0) { dim-- } // was off by 1
        shrinkFactor = pix / hilbPixels[ dim ]
        codonsPerPixelHILBERT = cliInstance.codonsPerPixel * shrinkFactor
        rtxt+= ` <<<--- chosen dimension: ${dim} shrinkFactor ${shrinkFactor} cpp: ${codonsPerPixelHILBERT} cpp ${cliInstance.codonsPerPixel}`
        bugtxt(`rtxt ${rtxt}`)
        return dim
      }
      function runcb( cb ) {
        let msg = "cb "
        if( typeof cb !== "undefined") {
          if( typeof cb === "function") {
            msg +=  "cb is a function"
            bugtxt( cb )
          } else {
            error( "cb is not a function?")
            bugtxt( cb )
            return
          }
          // setImmediate( () => { cb() } )
          cb()
        } else {
          error(`you didn't pass a callback?! its undefined: ${cb}`)
        }
        bugtxt(msg)
      }
      function removeNonAscii(str) {

        if ((str===null) || (str==""))
        return false
        else
        str = str.toString()

        return str.replace(/[^\x20-\x7E]/g, "")
      }
      function procTitle( txt ) {
        if ( typeof cliInstance.justNameOfPNG !== "undefined" && cliInstance.justNameOfPNG !== "unset" ) { // check if not set as a string called unset also
          process.title = `aminosee.funk.nz (m${ cliInstance.dimension }d${raceDelay} ${status} ${highlightOrNothin()}${ maxWidth( 32, cliInstance.justNameOfPNG )} ${txt})`
        } else {
          process.title = `aminosee.funk.nz (startup ${url})`
        }
      }
      function removeLocks(lockfile, devmode, reason) { // just remove the lock files.
        mode( "remove locks")
        bugtxt( "remove locks with " + remain + " files in queue. fileTouch: " + lockfile )
        if (cliInstance.test || cliInstance.demo) {  return }
        renderLock = false
        procTitle( "remove locks")

        remain--


        if ( typeof devmode === "undefined" ) {
          devmode = false
        }
        if ( typeof cb === "undefined" ) {
          cb = function(lockfile) {
            log(`no callback sent when removing locks for: ${blueWhite(lockfile)}`)
          }
        }
        if ( devmode === true ) {
          notQuiet("Because you are using --devmode, the lock file is not deleted. This is useful during development of the app because when I interupt the render with Control-c, AminoSee will skip that file next time, unless I use --force. Lock files are safe to delete at any time.")
        } else {
          deleteFile( lockfile )
        }
        cliInstance.preRenderReset(reason)
        // runcb( cb )
      }
      function notQuiet( txt ) {
        if (cliInstance.quiet || typeof txt === "undefined" ) {
          txt = "."
        } // verbose !== true ||
        // process.stdout.write(txt)
        bugtxt(txt)
        // console.log(txt)
        return txt
      }
      function killAllTimers() {
        // if ( renderLock || remain > 0 ) { return; }
        mode(`killing timers`)
        // if ( this.updatesTimer) {
        //   clearTimeout( this.updatesTimer )
        // }
        // if ( this.progTimer) {
        //   clearTimeout( this.progTimer )
        // }
        // if ( this.lockTimer) {
        //   clearTimeout( this.lockTimer )
        // }
        if ( cliInstance.updatesTimer) {
          clearTimeout( cliInstance.updatesTimer )
        }
        if ( cliInstance.progTimer) {
          clearTimeout( cliInstance.progTimer )
        }
        if ( cliInstance.lockTimer) {
          clearTimeout( cliInstance.lockTimer )
        }
        progato = "nullnuts"
      }
      function tripletToAminoAcid(triplet) {
        this.aminoacid = "error"
        for ( let p = 0; p < dnaTriplets.length; p++ ) { // TRIPLET LOOP
          if ( dnaTriplets[p].DNA == triplet ) {
            this.aminoacid = dnaTriplets[p].Codon
            break
          }
        }
        return this.aminoacid
      }
      function rollbackFolder() {
        const fullpath = path.resolve( cliInstance.outputPath, cliInstance.shortnameGenome)

        output(`Rolling back folder ${path.basename(fullpath)}`)
        if ( path.basename(fullpath) !== cliInstance.shortnameGenome ) {
          error(`Stopping, as internal state not consistent: ${ path.basename(fullpath)} !== ${cliInstance.shortnameGenome} `)
          return
        }
        deleteFile( cliInstance.fileTouch )
        deleteFile( cliInstance.fileHistogram )
        deleteFile( cliInstance.fileHTML )
        deleteDirectory( path.resolve( fullpath, "images" ) )
        deleteDirectory( fullpath )
      }
      function dot(i, x, t) {
        // this.debugFreq = throttledFreq();
        if (i % x == 0 ) {
          if (!t) {
            t = `[ ${i} ]`
          }
          redoline(t)
        }
      }
      function listGenomes() {
        let dd = dedupeArray( genomesRendered )
        if ( dd.length > 0 ) {
          for( let g =0; g < dd.length; g++) {
            output(`${g}. ${dd[g]}`)
          }
        } else {
          output(`usage:`)
          output(`aminosee *`)
          output(`aminosee --help`)

          if ( tx > 82 ) {
            notQuiet(`>>>    ${ chalk.italic( "aminosee Human_Genome.txt Gorilla.dna Chimp.fa Orangutan.gbk --image")}`)
            notQuiet(`>>>    ${ chalk.italic( "aminosee [*/dna-file.txt] [--help|--test|--demo|--force|--html|--image|--keyboard]    ")}`)
          }
          notQuiet(`>>>    ${ chalk.italic( "aminosee --help ")}`)
          notQuiet(`>>>    ${ chalk.italic( "aminosee --gui ")}`)
          notQuiet()
        }

      }
      function saveIMAGE(filename, imagedata, width, height, cb) {
        log("saveIMAGE: " + filename)

        var img_data = Uint8ClampedArray.from( imagedata )
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


        img_png.data = Buffer.from( img_data )
        let wstream = fs.createWriteStream( filename )
        var that = this
        let retProm =  new Promise(() => {
          img_png.pack()
          .pipe(wstream)
          .on("finish", (err) => {
            // if (err) { log(`Could not create write stream: ${ that.filePNG } due to ${err}`) }
            bugtxt("linear Save OK ")
            runcb( cb )
            // that.linearFinished()
          })
          // resolve();
        }).then().catch()



      }
      function error(err) {
        mode(`💩 Error during ${status}: [${ maxWidth(16,  err)}] ${cliInstance.shortnameGenome} ${cliInstance.busy()}`)
        // output( `💩 error: ${status}` )
        cliInstance.calcUpdate()
        if ( debug === true ) {
          if ( cliInstance.quiet == false ) {
            output()
            output( "💩 " + chalk.bgRed(  status  + ` /  error start {{{ ----------- ${ chalk.inverse( err.toString() ) }  ----------- }}} `))
            output()
          }

          output(`DEBUG MODE IS ENABLED. STOPPING: ${err}`)
          // output( beautify(aminosee_json) )

          throw new Error(err)
        } else {
          raceDelay *= 1.5
          // output()
          // output()
        }
        output(`💩 Caught error: ${err}. Increasing delay by 50% to ms to ${ onesigbitTolocale( raceDelay )} ms`)
      }
      function setupKeyboardUI2() {

        this.keyboard = true
        // make `process.stdin` begin emitting "keypress" events
        keypress(process.stdin)
        // keypress.enableMouse(process.stdout); // wow mouse events in the term?
        // process.stdin.on('mousepress', function (info) {
        //   bugout('got "mousepress" event at %d x %d', info.x, info.y);
        // });
        var that = this
        try {
          process.stdin.setRawMode(true)
        } catch(err) {
          log(`Could not use interactive keyboard due to: ${err}`)
          notQuiet("Probably you are running from a shell script. --keyboard mode requires interactive shell.")
          destroyKeyboardUI()
        }
        process.stdin.resume() // means start consuming
        // listen for the "keypress" event
        process.stdin.on("keypress", function (ch, key) {
          // term.down(1)
          if ( typeof key === "undefined") {
            log("undefined key")
            return
          }
          out(`got keypress: ${ chalk.inverse( key.name )}`)

          if ( key ) {

            if ( key.name == "q" || key.name == "escape" ) {
              killServersOnQuit = false
              // that.gracefulQuit(0, "Q esc")
            } else if ( !key.ctrl || key.name !== "c") {
              if ( autoStartGui && key.name == "g") {
                output(`Starting GUI from key command: ${key.name} ${status}`)
                if ( status == "module exit" ) {
                  startGUI()
                }
              }
            }
            // Interactive control:    D (demo full RGB test)    T (short test)   Q (graceful quit next save)
            // V (toggle verbose mode) B (live DNA to screen)    Esc (graceful quit)    Control-C (fast quit)
            // W (webserver)           C (clear scrn)            U (updates stats)       X (search ~ for DNA)
            // O (open images after render)                      or [space]       G  (experimental carlo GUI)

            if ( key.ctrl && (key.name == "c" || key.name == "d"  )) {
              process.stdin.pause() // stop sending control-c here, send now to parent, which is gonna kill us on the second go with control-c
              status  = "TERMINATED WITH CONTROL-C"
              that.gracefulQuit(0, "Control-c bo")
              destroyKeyboardUI()
              // if ( renderLock === true && this.timeRemain < 10000) {
              //   that.msPerUpdate = 800
              //   output("Closing in 5 seconds. Press [Esc] or [Q] key")
              //   setTimeout(()=> {
              //     // that.gracefulQuit(130, "Control-c")
              //     output(blueWhite("Press control-c again to exit"))
              //   }, 5000)
              // } else {
              //   // that.quit(130, "Control-c")
              // }
            }
            if ( key.name == "s") {
              mode("demo")
              this.demo = true
              runDemo()
            }
            if ( key.name == "t") {
              mode("pushing this.test onto render queue")
              cliInstance.args._.push("test")
              cliInstance.howMany = cliInstance.args.length
              cliInstance.generateTestPatterns()
            }
            if ( key.name == "c") {
              clearCheck()
            }
            if ( key.name == "d") {
              runDemo()
              // that.toggleDebug()
            }
            if ( key.name == "b") {
              clearCheck()
              that.togglednabg()
            }
            if ( key.name == "g" || key.name == "enter") {
              startGUI()
            }
            if ( key.name == "s") {
              clearCheck()
              that.toggleServer()
            }
            if ( key.name == "f") {
              that.toggleForce()
            }

            if ( key.name == "v") {
              clearCheck()
              that.toggleVerbose()
            }
            if ( key.name == "o") {
              clearCheck()
              that.toggleOpen()
            }
            if ( key.name == "o") {
              clearCheck()
              that.toggleOpen()
            }
            if ( key.name == "w") {
              term.clear()
              that.toggleClearScreen()
            }
            if ( key.name == "space" || key.name == "enter") {
              clearCheck()
              that.msPerUpdate  = minUpdateTime
            }
            if ( key.name == "u") {
              that.msPerUpdate  = minUpdateTime
              if ( that.updates === true) {
                that.updates = false
                // killAllTimers()
                // clearTimeout( that.updatesTimer);
              } else {
                that.updates = true
              }
            }
          }


        })
        // process.on('exit', function () {
        // disable mouse on exit, so that the state
        // is back to normal for the terminal
        // keypress.disableMouse(process.stdout);
        // });


      }
      function addToRendered( organism ) {
        genomesRendered.join( projectprefs.aminosee.genomes ) // pull from storage slush them all together
        genomesRendered.push( organism ) // add this sucka
        genomesRendered = dedupeArray( genomesRendered ) // de dupe in case of that slush above
        projectprefs.aminosee.genomes = genomesRendered // store it
        log( `Completed Renders of ${genomesRendered.length} Genomes in total on this machine, including ${cliInstance.justNameOfPNG} ${cliInstance.usersPeptide}`)
        bugtxt( beautify( genomesRendered ) )
      }
      function terminateIfUndef(xx) {
        if (typeof xx === "undefined") {
          error(`xx is undef`)
          // cliInstance.quit(13, status)
        }
      }
      function highlightOrNothin() { // no highlight, no return!
        return ( cliInstance.isHighlightSet ?  cliInstance.peptideOrNothing() + cliInstance.tripletOrNothing()  : "" )
      }
      function highlightFilename(pep) { // return small fragment of the filename
        if ( typeof pep === "undefined" ) { pep = "Reference" ; bugtxt(pep)}
        let ret = "_"
        if (pep == "not set" || pep == "Reference") {
          ret += "Reference"
        } else if ( pep  !== "Reference") {
          ret += `_${spaceTo_( tidyPeptideName( pep ) )}`
        } else if ( this.triplet !== "Reference") {
          ret += `_${spaceTo_( cliInstance.triplet ).toUpperCase()}` // looks better uppercase
        } else {
          ret += "Reference"
        }
        // bugtxt(`${isHighlightSet} this.triplet ${ cliInstance.triplet} return: ${ blueWhite( ret )} this.focusTriplet: ${cliInstance.focusTriplet} pep ${ pep}`)
        return ret
      }
      module.exports.AminoSeeNoEvil = AminoSeeNoEvil
      module.exports.removeLocks = removeLocks
      module.exports.removeNonAscii = removeNonAscii
      module.exports.locateWebroot = locateWebroot
      module.exports.nicePercent = nicePercent
      module.exports.createSymlink = createSymlink
      module.exports.error = error
      module.exports.fixedWidth = fixedWidth
      module.exports.fileWrite = (a,b,c) => { this.fileWrite(a,b,c) }
      module.exports.deleteFile = deleteFile
      module.exports.getArgs = getArgs
      module.exports.ishighres = ishighres
      module.exports.log = log
      module.exports.out = out
      module.exports.output = output
      // module.exports.newJob = newJob
      module.exports.pushCli = pushCli
      module.exports.terminalRGB = terminalRGB
      module.exports.maxWidth = maxWidth
      module.exports.maxWidth = maxWidth
      module.exports.termSize = termSize
      module.exports.setupKeyboardUI2 = setupKeyboardUI2
      module.exports.stopWork = stopWork
