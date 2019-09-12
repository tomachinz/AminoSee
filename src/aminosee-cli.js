const wideScreen = 140 // shrinks terminal display
const windows7 = 100
let termDisplayHeight = 16 // the stats about the file etc
let termHistoHeight = 30 // this histrogram
const radMessage = `
  🧬  MADE IN NEW ZEALAND
╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
by Tom Atkinson          aminosee.funk.nz
ah-mee no-see         "I see it now...  I AminoSee it!"
`

const siteDescription = "A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI using the Carlo, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stoRed in text files, output to PNG graphics file, then launches an WebGL this.browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by peptide."

// const interactiveKeysGuide = `
// Interactive control:    D (demo full RGB test)    T (short test)   Q (graceful quit next save)
// V (toggle verbose mode) B (live DNA to screen)    Esc (graceful quit)    Control-C (fast quit)
// W (webserver)           C (clear scrn)            U (updates stats)       X (search ~ for DNA)
// O (open images after render)                      or [space]       G  (experimental carlo GUI)
// `
const interactiveKeysGuide = `
Interactive control:    D (demo full RGB test)    T (short test)   Q (graceful quit next save)
V (toggle verbose mode) B (live DNA to screen)    Esc (graceful quit)    Control-C (fast quit)
W (webserver)           C (clear scrn)            U (updates stats)       X (search ~ for DNA)
O (open images after render)                      or [space]
`
const helixEmoji =" 🧬  "
const lineBreak = `
`
// const settings = require('./aminosee-settings');
const version = require("./aminosee-version")
const server = require("./aminosee-server")
const data = require("./aminosee-data")
// const StdInPipe = require('./aminosee-stdinpipe');
const doesFileExist = data.doesFileExist
const doesFolderExist = data.doesFolderExist
const createSymlink = data.createSymlink
const asciiart = data.asciiart
const extensions = data.extensions
const saySomethingEpic = data.saySomethingEpic
const readParseJson = data.readParseJson
// OPEN SOURCE PACKAGES FROM NPM
const path = require("path")
const open = require("open")
const Preferences = require("preferences")
const beautify = require("json-beautify")
const spawn = require("cross-spawn")
const stream = require("stream")
const async = require("async-kit") // amazing lib
const term = require("terminal-kit").terminal
const MyManHilbert = require("hilbert-2d") // also contains magic
// const Readable = require('stream').Readable
// const Writable = require('stream').Writable
// const Transform = require('stream').Transform
// const request = require('request');
const es = require("event-stream")
const minimist = require("minimist")
const fetch = require("node-fetch")
const keypress = require("keypress")
// const parse = require('parse-apache-directory-index');
const fs = require("fs-extra") // drop in replacement = const fs = require('fs')
const histogram = require("ascii-histogram")
const bytes = require("bytes")
const PNG = require("pngjs").PNG
const os = require("os")
const humanizeDuration = require("humanize-duration")
const appFilename = require.main.filename //     /bin/aminosee.js is 11 chars
const hostname = os.hostname()
const chalk = require("chalk")
const obviousFoldername = "AminoSee_webroot" // descriptive for users
const netFoldername = "output" // terse for networks
const funknzlabel = "aminosee.funk.nz"
const dummyFilename = "50KB_TestPattern.txt"
const closeBrowser = "If the process apears frozen, it's waiting for your this.browser or image viewer to quit. Escape with [ CONTROL-C ] or use --no-image --no-html"
// const tomachisBirthday = new Date( 221962393 ) // Epoch timestamp: 221962393 is Date and time (GMT): Thursday, January 13, 1977 12:13:13 AM or 1:13:13 PM GMT+13:00 DST in New Zealand Time.
const tomachisBirthday = new Date(  ) // Epoch timestamp: 221962393 is Date and time (GMT): Thursday, January 13, 1977 12:13:13 AM or 1:13:13 PM GMT+13:00 DST in New Zealand Time.
const defaultC = 1 // back when it could not handle 3+GB files.
const artisticHighlightLength = 36 // px only use in artistic this.mode. must be 6 or 12 currently
const defaultMagnitude = 8 // max for auto setting
const defaultPreviewDimension = 5 // was 500 MB per page before.
const theoreticalMaxMagnitude = 10 // max for auto setting
const overSampleFactor = 4 // your linear image divided by this will be the hilbert image size.
const maxCanonical = 32 // max length of canonical name
const hilbPixels = [ 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864 ] // I've personally never seen a mag 9 or 10 image, cos my computer breaks down. 67 Megapixel hilbert curve!! the last two are breaking nodes heap and call stack both.
const widthMax = 960 // i wanted these to be tall and slim kinda like the most common way of diagrammatically showing chromosomes
const defaultPort = 4321
const max32bitInteger = 2147483647
const minUpdateTime = 200
const openLocalHtml = false // affects auto-open HTML.
const fileLockingDelay = 2000
const targetPixels = 4660000 // for big genomes use setting flag -c 1 to achieve highest resolution and bypass this taret max render size
// let bodyParser = require('body-parser');
// const gv = require('genversion');
// let gui = require('./public/aminosee-gui-web.js');
// let imageStack = server.imageStack;
// let imageStack = require('./public/aminosee-gui-web.js').imageStack;
// BigInt.prototype.toJSON = function() { return this.toString(); }; // shim for big int
// BigInt.prototype.toBSON = function() { return this.toString(); }; // Add a `toBSON()` to enable MongoDB to store BigInts as strings
let autoStartGui = true
let cfile, streamLineNr, renderLock, jobArgs, killServersOnQuit, webserverEnabled, cliInstance, tx, ty, termPixels, cliruns, gbprocessed, projectprefs, userprefs, genomesRendered, progato, commandString, batchSize, quiet, url, port, status, remain, lastHammered, darkenFactor, highlightFactor, loopCounter, webroot, tups,  opensFile , opensHtml , opensImage, previousImage
// let theGUI
tups = opensFile = opensHtml = opensImage = 0 // terminal flossing
let opens = 0 // session local counter to avoid having way too many windows opened.
let dnaTriplets = data.dnaTriplets
let progressTime = 500 // ms
termPixels = 69 // chars
remain = 0 // files in the batch
tx = ty = cliruns = gbprocessed = 0
let isShuttingDown = false
let threads = [] // an array of AminoSeNoEvil instances.
let clear = false
let debug = false // should be false for PRODUCTION
let brute = false // used while accelerating the render 20x
webserverEnabled = false
genomesRendered = [dummyFilename]
renderLock = false
module.exports = () => {
	mode("exports")
	setupApp()
	mode("module exit")
	log( `S: ${status} ` )
}
function startGUI() {
	cliInstance.gui = true
	cliInstance.keyboard = true
	cliInstance.serve = true
	// cliInstance.setupKeyboardUI();
	// output("Starting carlo GUI - press Control-C to quit")
	// const carlo = require("./aminosee-carlo").run( generateTheArgs() )
	output(".")
	// server.start( generateTheArgs() )
	// destroyKeyboardUI()
	// return carlo
}
function generateTheArgs() {
	if ( typeof cliInstance === "undefined" ) {
		webroot = locateWebroot()
		cliInstance = {
			verbose: false,
			webroot: webroot,
			outputPath: path.join( webroot, netFoldername ),
			openHtml: false,
			background: false,
			currentURL: url
		}
	}
	const theArgs = {
		port: defaultPort,
		verbose: cliInstance.verbose,
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
	// log("sending args from CLI:")
	// log( theArgs )
	return theArgs
}
function populateArgs(procArgv) { // returns args
	const options = {
		boolean: [ "artistic", "clear", "chrome", "devmode", "debug", "demo", "dnabg", "explorer", "file", "force", "fullscreen", "firefox", "gui", "html", "image", "keyboard", "list", "progress", "quiet", "reg", "recycle", "redraw", "slow", "serve", "safari", "test", "updates", "verbose", "view" ],
		string: [ "url", "output", "triplet", "peptide", "ratio" ],
		alias: { a: "artistic", b: "dnabg", c: "codons", d: "devmode", f: "force", finder: "explorer", h: "help", k: "keyboard", m: "magnitude", o: "output", p: "peptide", i: "image", t: "triplet", u: "updates", q: "quiet", r: "reg", w: "width", v: "verbose", x: "explorer", view: "html" },
		default: { brute: false, debug: false, gui: false, html: true, image: true, index: true, clear: false, explorer: false, quiet: false, keyboard: true, progress: false, redraw: true, updates: true, stop: false, serve: false, fullscreen: false },
		stopEarly: false
	} // NUMERIC INPUTS: codons, magnitude, width, maxpix
	let args = minimist(procArgv.slice(2), options)
	bugtxt( args )
	return args
}
// function bruteForce(cs) {

	// return false

// 	let pepTable = data.pepTable
// 	output("Fast Batch Enabled. Length: " + pepTable.length)
// 	for (let i=1; i < data.pepTable.length-1; i++) {
// 		let pep =  data.pepTable[i].Codon
// 		setTimeout( () => {
// 			output( " > " + pep)
// 			let job = { _: [ cs ],
// 				peptide: pep,
// 				q: false,
// 				gui: false,
// 				keyboard: false,
// 				k: false,
// 				progress: false,
// 				redraw: true,
// 				updates: false,
// 			}
// 			// newJob( job );
// 		}, 800 * i)
// 	}
// }
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
		let thread = newJob(jobArgs)
		threads.push( thread )
		output(`NUMBER OF THREADS: ${threads.length}`)
	}



}
function setupApp() {
	[ userprefs, projectprefs ] = setupPrefs()
	lastHammered = new Date()

	// if ( this.updateProgress == true ) {
	// 	progato = term.progressBar( {
	// 		width: 80 ,
	// 		title: "Daily tasks:" ,
	// 		eta: true ,
	// 		percent: true ,
	// 		inline: true,
	// 		items: remain
	// 	} )
	// }
	cliInstance = new AminoSeeNoEvil()
	threads.push( cliInstance )
	termSize()
	webroot = locateWebroot()
	cliInstance.setupJob( populateArgs( process.argv ), "module exports"  )
	cliInstance.outputPath = path.join( webroot, netFoldername) // ~/AminoSee_webroot/output

}
function newJob( job ) { // used node and CLI tool.
	// output( job )
	let nuThread = new AminoSeeNoEvil()
	// populateArgs( process.argv )
	// nuThread.setupJob( process.argv );
	nuThread.setupJob( job, `new job ${job}` ) // do stuff that is needed even just to run "aminosee" with no options.
	return nuThread
}

class AminoSeeNoEvil {
	constructor(o) { // CLI commands, this.files, *
		if ( typeof o === "undefined" ) {
			// this.outputPath = locateWebroot()
		} else {
			this.outputPath = o
		}
		output( logo() );
		[ projectprefs, userprefs] = setupPrefs()
		this.red = this.green = this.blue = this.alpha = 0
		term.on("resize", () => {
			this.resized()
		})
		process.stdout.on("resize", () => {
			this.resized()
		})
	}


	setupJob( args, reason ) {
		mode("setup job " + reason + this.busy())
		log( `setup job:  ${status}   ${reason} ${ maxWidth(32,   args.toString() ) }` )
		// [ userprefs, projectprefs ] = setupPrefs()

		// do stuff aside from creating any changes. eg if you just run "aminosee" by itself.
		// for each render batch sent through newJob, here is where "this" be instantiated once per newJob
		// for each DNA file, run setupRender
		// server.setArgs( args )
		isShuttingDown = false
		streamLineNr = 0
		loopCounter = 0
		renderLock = false // not rendering right this.now obviously
		darkenFactor = 0.25 // if user has chosen to highlight an amino acid others are darkened
		highlightFactor = 4.0 // highten brightening.
		loopCounter = 0
		this.raceDelay = 69 // so i learnt a lot on this project. one day this line shall disappear replaced by promises.
		this.charClock = 0
		this.pixelClock = 0
		this.peptide = this.triplet = this.focusTriplet = this.focusPeptide = "Reference" // used to be "none" is now "Reference"
		this.usersPeptide = "not set"
		this.usersTriplet = "not set"
		this.rawDNA = "this aint sushi"
		this.force = "strange"
		this.startDate = new Date() // required for touch locks.
		this.timestamp = new Date()
		this.now = this.startDate
		this.percentComplete = 0
		this.outFoldername = ""
		this.genomeSize = 0
		this.killServersOnQuit = true
		this.maxMsPerUpdate  = 15000 // milliseconds per updatethis.maxpix = targetPixels; //
		this.timeRemain = 1
		this.debugGears = 1
		this.done = 0
		this.devmode = false // kills the auto opening of reports etc
		this.quiet = false
		this.verbose = false // not recommended. will slow down due to console.
		this.force = false // this.force overwrite existing PNG and HTML reports
		this.artistic = false // for Charlie
		this.dnabg = false // firehose your screen with DNA!
		this.report = true // html reports can be dynamically disabled
		this.test = false
		this.updates = true
		this.updateProgress = true // whether to show the progress bars
		this.stats = true
		this.recycEnabled = false // bummer had to disable it
		this.clear = true // this.clear the terminal screen while running
		this.openImage = true // open the png
		this.openHtml = true
		 opensHtml = 0 // how many times have we popped up a browser.
		this.highlightTriplets = []
		this.isHighlightSet = false
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
		this.termPixels = 69//Math.round((term.width) * (term.height-8));
		this.runningDuration = 1 // ms
		this.termMarginLeft = 2
		this.errorClock = 0
		batchSize = remain
		this.pepTable = data.pepTable
		this.args = args // populateArgs(procArgv); // this.args;
		// this.currentFile = args._[0].toString()
		if ( args.demo ) {
			this.demo = true
      this.test = true
			remain++
			batchSize++
		}
		if ( args.test  ) {
			this.test = true
			remain++
			batchSize++
			// if ( !args.image ) {
			// 	this.openImage = false
			// }
			// error("stopping due to test")
			// return false
		}
		try {
			this.currentFile = args._[0].toString()
		} catch(err) {
			this.currentFile = __filename
			remain = 0
			batchSize = 0
		}
		cfile = this.currentFile
		remain = args._.length
		batchSize = remain

		this.dnafile = path.resolve( cfile )
		this.justNameOfDNA = this.genomeCanonicalisaton( this.dnafile )
		this.currentFile = path.resolve(__dirname, "dna" , dummyFilename)
		this.outputPath = path.join( webroot, netFoldername)
		this.imgPath = path.resolve( this.outputPath, this.justNameOfDNA, "images")
		this.extension = this.getFileExtension( this.currentFile )
		this.started = this.startDate.getTime() // required for touch locks.
		this.dimension = defaultMagnitude // var that the hilbert projection is be downsampled to
		this.msPerUpdate  = minUpdateTime // min milliseconds per update its increased for long renders
		this.termMarginTop = (term.height -  termDisplayHeight -   termHistoHeight ) / 4
		this.maxpix = targetPixels
		this.setNextFile()
		termSize()
		// this.resized(tx, ty);
		this.previousImage = this.justNameOfDNA
		// output(logo());

		if ( args.quiet || args.q ) { // needs to be at top to cut back clutter during batch rendering
			this.quiet = true
		} else {
			this.quiet = false
		}


		if ( args.fullscreen == true) {
			log("fullscreen terminal output enabled")
			this.fullscreen = true

		} else {
			this.fullscreen = false
			notQuiet("inline terminal output enabled")
			// process.exit()
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
		if ( args.slow ) {
			let amount = 3000
			this.raceDelay += amount
			output(`${humanizeDuration( amount )} delay time added between jobs`)
		}
		if ( args.delay ) {
			let amount = Math.round( args.delay )
			if ( amount > 1 && amount << 60000) {
				this.raceDelay = amount
				output(`Custom delay between jobs of ${humanizeDuration( amount )}`)
			}
		}
		if ( args.debug ) {
			debug = true
			output("debug mode ENABLED")
		} else {
			debug = false
		}
		url = projectprefs.aminosee.url
		if ( typeof url === "undefined" ) {
			url = `http://${hostname}:4321`
		}
		if ( args.url ) {
			url = args.url
			projectprefs.aminosee.url = url
		}
		if ( args.progress ) {
			this.updateProgress = true // whether to show the progress bars
			log("progress bars enabled")
		} else {
			this.updateProgress = false // whether to show the progress bars
			log("Disabled progress bars")
		}
		this.devmode = false
		if ( args.devmode || args.d) { // needs to be at top sochanges can be overridden! but after debug.
			output("devmode enabled.")
			this.toggleDevmode() // make sure debug is set first above
		}
		if ( args.recycle ) { // needs to be at top so  changes can be overridden! but after debug.
			output("♻ recycle mode enabled. (experimental)")
			this.recycEnabled = true
		} else { this.recycEnabled = false }
		if ( args.keyboard || args.k ) {
			log("KEYBOARD MODE HAS SOME BUGS ATM SORRY")
			this.keyboard = true
			 termDisplayHeight += 4 // display bigger
			if ( this.verbose == true) {
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
		if ( this.keyboard == true) {
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
			log("will automatically open image")
		} else {
			log("will not open image")
			this.openImage = false
		}
		if ( args.any || args.a) {
			this.anyfile = true
			output("will ignore filetype extensions list and try to use any file")
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
		if ( args.maxpix ) {
			let usersPix = Math.round( args.maxpix )
			if ( usersPix < 1000000 ) {
				output("maxpix too low. using --maxpix=1000000")
				this.maxpix = 1000000
			} else {
				this.maxpix = usersPix
				if ( usersPix > targetPixels ) {
					output(`Nice, using custom resolution: ${usersPix.toLocaleString()}`)
				}
			}
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
				this.maxpix = 32000000
				output("Magnitude must be an integer number between 3 and 9 or so. 9 you may run out of memory.")
			} else if (  this.dimension > 2 &&  this.dimension < 9) {
				output(`Using custom output magnitude: ${ this.dimension }`)
			}
		} else {
			this.magnitude = "auto"
			this.dimension = defaultMagnitude
			log(`Using auto magnitude with limit ${defaultMagnitude}th dimension`)
		}
		log(`Max pixels: ${ this.maxpix } Hilbert curve dimension: ${ this.dimension } ${ this.magnitude }`)
		if ( args.ratio || args.r ) {
			this.ratio = args.ratio.toLowerCase()
			if ( this.ratio == "fixed" || this.ratio == "fix") {
				this.ratio = "fix"
			} else if ( this.ratio == "square" || this.ratio == "sqr") {
				this.ratio = "sqr"
			} else if ( this.ratio == "hilbert" || this.ratio == "hilb" || this.ratio == "hil" ) {
				this.ratio = "hil"
			} else if ( this.ratio == "gol" || this.ratio == "gold" || this.ratio == "golden" ) {
				this.ratio = "gol"
			} else {
				log("No custom this.ratio chosen. (default)")
				this.ratio = "sqr"
			}
			this.pngImageFlags += this.ratio
			this.userRatio = "custom"
		} else {
			log("No custom ratio chosen. (default)")
			this.ratio = "sqr"
			this.userRatio = "auto"
		}
		log(`Using aspect ratio: ${  chalk.inverse(this.ratio) } `)

		if ( args.triplet || args.t) {
			this.usersTriplet = args.triplet
			output(this.usersTriplet )
			this.triplet = this.tidyTripletName(this.usersTriplet )
			this.focusTriplet = this.triplet
			if (this.triplet !== "Reference") {
				output(`Found triplet ${ this.triplet } with colour ${ this.tripletToHue( this.triplet )}°`)
				this.isHighlightSet = true
				output(`Custom triplet ${chalk.bgWhite.blue ( this.triplet )} set. Others will be mostly transparent.`)
			} else {
				output(`Error could not lookup this.triplet: ${ this.triplet }`)
				this.triplet = "Reference"
			}
		} else {
			log("No custom triplet chosen. (default)")
			this.triplet = "Reference"
		}
		if ( args.peptide || args.p) {
			this.usersPeptide = args.peptide
			this.peptide = tidyPeptideName( this.usersPeptide )

			if ( this.peptide !== "Reference"  ) { // this colour is a flag for  this.error
				this.isHighlightSet = true
				this.index = false // disable html report
				output(blueWhite(`Custom peptide: ${ this.usersPeptide } using ${ this.peptide }`))
			} else {
				output(blueWhite(`Sorry, could not lookup users peptide: ${ this.usersPeptide } using ${ this.peptide }`))
			}
		} else {
			log("No custom peptide chosen. Will render standard reference type image")
			this.peptide = "Reference"
		}
		this.focusPeptide = this.peptide
		if ( this.peptide == "Reference" && this.triplet == "Reference") {
			this.isHighlightSet = false
			this.index = true // disable html report
			this.report = true
		} else {
			output(`Peptide  ${ chalk.inverse(this.focusPeptide) } triplet ${ chalk.inverse( this.triplet )}`)
			this.isHighlightSet = true
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
		} else if ( args.codons ) {
			log("Will only output index file is -c flag is not used")
			this.index = false
		}

		if ( args.verbose || args.v) {
			output("verbose enabled. AminoSee version: " + version)
			bugtxt(`os.platform(): ${os.platform()} ${process.cwd()}`)
			this.verbose = true
			// termDisplayHeight -= 2
		} else {
			log("verbose mode disabled")
			this.verbose = false
		}
		if ( args.html ) {
			output("will open html in firefox after render")
			this.openHtml = true
		} else {
			log("not opening html")
			this.openHtml = false
		}
		if ( args.html == true || args.chrome || args.firefox  || args.safari  || args.report  || args.open) {
			output("opening html")
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
		// if ( cliruns > 69 || gbprocessed  > 0.2 || opens > 24 && Math.random() > 0.994) {
		//   log(`Easter egg: enabling dnabg mode!!`)
		//   this.dnabg = true
		// } // if you actually use the program, this easter egg starts showing raw DNA as the background after 100 megs or 69 runs.
		if ( args.force || args.f) {
			output("force overwrite enabled.")
			this.force = true
		}
		if ( args.explorer || args.finder) {
			output("will open folder in File Manager / Finder / File Explorer when done.")
			this.openFileExplorer = true
		} else {
			log("will not open folder in File Manager / Finder / File Explorer when done.")
			this.openFileExplorer = false
		}
		if ( args.help || args.h) {
			this.help = true
			autoStartGui = false
			setTimeout( () => {
				this.helpCmd()
			}, this.raceDelay)
		} else {
			this.help = false
		}
		this.background = false // spawn background process for long running server
		if ( args.foreground == true ) {
			this.background = false // spawn background process for long running server
			this.serve = true
			this.keyboard = true
			countdown("shutdown in ", 360000, () => { process.exit() } )
		}

		killServersOnQuit = true // aminosee --serve will quit after spawning foreground in background

		if ( args.serve ) {
			webserverEnabled = true
			this.serve = true
			this.keyboard = true
			// killServersOnQuit = false
		} else {
			log("Webserver run in foreground, will exit with app, use --serve to spawn background process ")
			this.serve = false
		}

		if ( args.clear ) {
			log("screen clearing enabled.")
			this.clear = true
		} else {
			log("clear screen disabled.")
			this.clear = false
		}
		if ( args.updates || args.u) {
			log("statistics this.updates enabled")
			this.updates = true
		} else {
			log("statistics this.updates disabled")
			this.updates = false
			this.maxMsPerUpdate  = 5000
			this.clear = false
		}
		if ( args.reg || args.r) { // NEEDS TO BE ABOVE TEST
			this.reg = true
			output("using regmarks")
		} else {
			log("no regmarks")
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
		}
		if ( args.gui ) {
			log("Running AminoSee graphical user interface... use --no-gui to prevent GUI")
			this.gui = true
		} else { this.gui = false }


		if ( this.isHighlightSet ) {
			output(`Custom peptide: ${blueWhite( this.focusPeptide )}  Triplet: ${ blueWhite( this.triplet ) }`)
		} else {
			log("No custom peptide set.")
		}
		bugtxt( `args: [${args.toString()}]`)
		if ( args.get ) {
			this.downloadMegabase( this.pollForStream) //.then(out("megabase done"));//.catch(log("mega fucked up"));
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
			output("Using brute force")
			brute = true
			// bruteForce( args._[0] )
		} else {
			brute = false
		}

		if ( args.quiet || args.q ) { // needs to be at bottom so changes cant be overridden! but after debug .
			log("quiet mode enabled.")
			webserverEnabled = false
			this.quiet = true
			this.verbose = false
			this.dnabg = false
			this.updates = false  //this.updates
			this.clear = false
			this.openImage = false
			this.raceDelay = 1 // yeah it makes it go faster
		} else {
			this.quiet = false
			log("not using quiet mode. ")
		}
		if ( args.delay ) {
			let  n = Math.round( args.delay )
			if ( n > 1 ) {
				this.raceDelay = n
				output(`Set custom delay to ${humanizeDuration( n) }`)
			}
		}
		/////////////////////////////////////////////////////
		output(`devmode ${this.devmode}`)
		if (this.devmode == true) {
			this.quiet = false
			this.verbose = true
			this.updates = false
			this.clear = false
			this.openHtml = false
			this.openImage = false
			this.view = false
			this.openFileExplorer = false
			this.progress = true // EXPERIMENTAL FEATURES
			this.keyboard = true // EXPERIMENTAL FEATURES
			termDisplayHeight++
			this.raceDelay += 200 // this helps considerably!
			progressTime *= 0.5 // double it
			if (debug == true) {
				this.raceDelay += 200 // this helps considerably!
			}
			output("AminoSee has been slowed to " + blueWhite( this.raceDelay ))
		} else {
			// this.raceDelay -= 1000 // if you turn devmode on and off a lot it will slow down
			// this.verbose = false
			// this.updates = true
			// this.clear = true
			// this.openHtml = true
			// this.openImage = true
			// this.openFileExplorer = true
			// termDisplayHeight--
		}

		/////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////

		this.setupProgress()

		quiet = this.quiet
		bugtxt(`the args -->> ${this.args}`)

		// notQuiet(`OUTPUT FOLDER:   ${ blueWhite( path.normalize( this.outputPath )) }`)


		remain = args._.length
		if ( this.test == true ) {
			output("Ω Running test Ω")
			remain = this.dimension
			// this.dimension = args.magnitude
			this.generateTestPatterns(() => {
        this.quit(0, "test patterns")
      })
		} else if ( this.demo == true ) {
			mode("demo mode")
			remain = this.dimension
			runDemo()
		}


		if ( remain > 0 ) {
			mode(remain + " Ω first command Ω ")
			output(chalk.green(`${chalk.underline("Job items Ω ")} ${batchProgress()} ` ))
			log(this.outputPath)
			this.dnafile = args._.toString()
			// this.slowSkipNext()
			// this.fastReset("first command")
			if ( !this.test ) {
				this.pollForStream()
			} else if ( this.demo ) {
        runDemo()
      } else {
        this.generateTestPatterns()
      }


			// setImmediate( () => {
			// 	log("prepare state returned")               // this.pollForStream();
			// 	setImmediate( () => {
			// 		log(`----------------- ${ this.justNameOfDNA  } -----------------`)
			// 	})
			// })
			// })


		} else if ( remain < 1  ) {
      let time = 35000
			mode("no command")
      //

      if ( this.quiet ) {
				time = 1000
        log("exiting")
        // process.exit()
        this.quit(0, "no command")
        return
	}
      if ( cliruns < 3) {
				output("FIRST RUN!!! Opening the demo... use the command aminosee demo to see this first run demo in future")
				this.firstRun()
				isShuttingDown = false
			} else {
				log("not first run")
			}
			termSize()
			log(`Your terminal size: (${tx},${ty})`)
			if ( tx > 82 ) {
				notQuiet(`Try running -->>>    ${ chalk.italic( "aminosee Human_Genome.txt Gorilla.dna Chimp.fa Orangutan.gbk --image")}`)
				notQuiet(`usage      --->>>    ${ chalk.italic( "aminosee [*/dna-file.txt] [--help|--test|--demo|--force|--html|--image|--keyboard]    ")}`)
			}
			notQuiet(`example    --->>>    ${ chalk.italic( "aminosee --help ")}`)
			notQuiet(`user interface ->    ${ chalk.italic( "aminosee --gui ")}`)
			notQuiet()


      log(`will hold CLI for ${humanizeDuration(time)}`)

			if ( !isShuttingDown && !this.serve ) {
				output("quick " + time)
				printRadMessage(["Welcome... this is a CLI app run from the terminal, see above", "[Q] or [Esc] key to exit now", " ", "PRESS ANY KEY", "to open the interface", chalk.italic( "aminosee --help"), " " + (batchProgress()) ])
				output( interactiveKeysGuide )
				cliInstance.setupKeyboardUI()
				listGenomes()
				if ( this.gui ) {
					log("GUI")
					startGUI()
					pushCli("--test")
					// return true
				} else {
					cliInstance.updatesTimer = countdown("closing in ", time, () => {
						mode("time out from no command")
						destroyKeyboardUI()
						if ( this.gui == false ) { // if the GUI is up, dont exit
							isShuttingDown = true
							this.quit(1, "no command and no gui or server")
						} else {
							output("waiting for GUI or server to close")
							this.quit(0, "no command. gui is true.")
						}
					})
				}
			}
			isShuttingDown = true
		}


		if ( webserverEnabled ) {
			// server.stop()
			output(`Starting mini server at: ${ webroot } `)
			output(`Using URL: ${ chalk.underline( url )}`)
			this.setupKeyboardUI()
			autoStartGui = false
			// output(`Server running at: ${ chalk.underline( url ) } to stop use: aminosee --stop `)
			// server.setArgs( generateTheArgs() )
			// this.currentURL = server.foregroundserver()
			this.currentURL = this.generateURL()
			// this.currentURL = server.start( generateTheArgs() )
			server( generateTheArgs() )
			webserverEnabled = false
		}

		// if ( this.gui == true && this.quiet == false ) {
		// 	theGUI = startGUI()
		// } else {
		// 	log( "Try using  --gui for the graphical user interface!")
		// }

	}
	setupProgress() {
		if ( this.updateProgress == true  ) {
			if ( remain > 0 ) {
        progato = term.progressBar({
          width: term.width - 20,
          title: `Booting ${this.justNameOfPNG} at ${ formatAMPM( new Date())} on ${hostname}`,
          eta: true,
          percent: true,
          inline: true
        })
			}
		}
	}
	startProgress() {
		if ( remain < 0 ) { return false }
		let task = this.currentFile
		progato.startItem( task )

		// Finish the task in...
		// setTimeout( this.doneProgress.bind( null , this.currentFile ) , 500 + Math.random() * 1200 ) ;

		// Start another parallel task in...
		// setTimeout( this.startProgress , 400 + Math.random() * 400 ) ;
	}


	doneProgress( task ) {
		progato.itemDone( task )

		if ( remain < 0 ) {
			setTimeout( function() { term( "\n" )  } , 200 )
		}
	}
	destroyProgress() { // this.now thats a fucking cool name if ever there was!
		// if (remain == -1) {
		// }
		if ( this.updateProgress == true) {
			if ( typeof progato !== "undefined" ) {
				progato.stop()
				//  progato = null;
			}
		}
		clearTimeout( this.updatesTimer)
		clearTimeout( this.progTimer)
		clearTimeout( this.lockTimer)
		deleteFile( this.fileServerLock )
	}
	// bugtxt(txt) { // full debug output
	//   if (this.quiet == false && debug == true && this.devmode == true && this.verbose == true)  {
	//     bugout(txt);
	//   } else {
	//     if (this.verbose == true ) {
	//       redoline(txt);
	//     }
	//   }
	// }





	// termSize() {
	//   tx = term.width;
	//   ty = term.height
	//   termPixels = (tx) * (ty-8);
	//   this.termPixels = termPixels;
	// }



	resized(tx, ty) {
		clearCheck()
		// term.clear()

		// term.erase()
		termSize()
		termDrawImage(this.filePNG, "resized")
		this.setDebugCols()
		tx = term.width; ty = term.height
		output(`Terminal resized: ${tx} x ${ty} and has at least ${termPixels} chars. Fullscreen mode enabled, use --no-fullscreen to prevent`)
		if ( this.args.fulscreen == false) {
			this.fullscreen = false
		} else {
			this.fullscreen = true

		}
		this.colDebug = this.setDebugCols() // Math.round(term.width / 3);
		this.msPerUpdate  = minUpdateTime
		// cliInstance.msPerUpdate  = minUpdateTime;

		// if ( this.updates == true) {
		//   if (tx > 400) {     // cover entire screen!
		//     this.termMarginLeft = this.colDebug * 2;
		//   } else {
		//     this.termMarginLeft = 2;
		//   }
		//   this.msPerUpdate  = minUpdateTime
		// } else {
		//   this.termMarginLeft = 0;
		//   this.msPerUpdate  =  this.maxMsPerUpdate ;
		// }
		if ( this.dnabg == true) {
			this.termMarginTop = Math.round(((term.height -  termDisplayHeight) -   termHistoHeight ) / 3)
		} else {
			if ( this.clear == true) {
				this.termMarginTop = Math.round(((term.height -  termDisplayHeight) -   termHistoHeight ) / 6)
			} else {
				this.termMarginTop = 0
			}
		}
		if ( renderLock == true ) { this.drawHistogram() }
	}
	cli(argumentsArray) {
		log(`cli argumentsArray [${argumentsArray.toString()}]`)
	}

	getRenderObject() { // return part of the histogramJson obj
		for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
			const pep =  this.pepTable[ p ]
			this.focusPeptide = pep.Codon
			if ( this.focusPeptide == "Reference" ) { // index 0
				// this.pepTable[ p ].hilbert_master = hilbertimage
				// this.pepTable[ p ].linear_master = linearimage
				// this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[0]
				// this.pepTable[ p ].linear_preview = this.aminoFilenameIndex( p )[1]
				// this.pepTable[ p ].mixRGBA = this.tripletToRGBA(pep.Codon) // this will this.report this.alpha info
			}
			if ( pep.Codon == "Reference" ) { this.pepTable[ p ].Histocount = this.genomeSize }
			this.pepTable[ p ].hilbert_master = this.aminoFilenameIndex( p )[0]
			this.pepTable[ p ].linear_master = this.aminoFilenameIndex( p )[1]
			this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[0]
			this.pepTable[ p ].linear_preview = this.aminoFilenameIndex( p )[1]
			this.pepTable[ p ].mixRGBA = this.tripletToRGBA(pep.Codon) // this will this.report this.alpha info
			log(`ext: ${ this.extension } this.pepTable[ p ].src ${ this.pepTable[ p ].src} codons per pixel: ${this.codonsPerPixelHILBERT}` )
		}

		this.focusPeptide = this.peptide // get URL for reference image
		// this.pepTable.sort( this.compareHistocount )
		this.pepTable.sort( this.compareHue )
		// if ( this.dimension > defaultPreviewDimension ) {
		//
		// }
		// bugtxt( this.pepTable ) // least common amino acids in front
		let zumari = {
			original_source: this.justNameOfCurrentFile,
			full_path: this.dnafile,
			maxpix:  this.maxpix,
			name: this.justNameOfDNA,
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
			codonsPerPixelHILBERT: this.codonsPerPixelHILBERT,
			pixelClock: this.pixelClock,
			pixhilbert: hilbPixels[ this.dimension ],
			shrinkFactor: this.shrinkFactor,
			overSampleFactor: overSampleFactor,
			opacity: this.opacity,
			magnitude:  this.magnitude,
			dimension:  this.dimension,
			previewdimension: 5,
			darkenFactor: darkenFactor,
			highlightFactor: highlightFactor,
			correction: "Expand",
			finish: new Date(),
			blurb: this.blurb(),
			runningDuration: this.runningDuration,
			totalmem: os.totalmem(),
			platform: os.platform(),
			loadavg: os.loadavg()
		}
		let histogramJson = {
			pepTable: this.pepTable,
			summary: zumari,
			args: this.args
		}
		if ( debug == true && this.quiet == false) {
			console.log( histogramJson  )
		}

		// output( beautify( histogramJson, null, 2, 100) )
		return histogramJson
	}


	setupRender(file) { // blank all the variables
		if ( renderLock ) { error("draining threads from setupRender"); return false }
		this.startDate = new Date() // required for touch locks.
		this.started = this.startDate.getTime() // required for touch locks.
		this.baseChars =  this.genomeSize = this.charClock = this.codonsPerSec =  this.red  =  this.green  =  this.blue  = 0
		this.peakRed  =  this.red
		this.peakGreen  =  this.green
		this.peakBlue  =  this.blue
		this.peakAlpha  =  this.alpha
		this.percentComplete = 0
		this.pixelClock = 0
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
		// this.currentFile = this.args._[0].toString();
		this.dnafile = path.resolve( this.currentFile )
		this.justNameOfDNA = this.genomeCanonicalisaton( this.dnafile )
		for (let h=0; h < dnaTriplets.length; h++) {
			dnaTriplets[h].Histocount = 0
		}
		this.outputPath = path.join( webroot, "output")
		this.setNextFile()
		this.autoconfCodonsPerPixel()
		//
		if (this.test) {
			this.testInit()
		} else {
			this.setupLinearNames() // will not include Hilbert file name. Need to wait until after render and calcHilbertFilenames
		}
		this.rgbArray = []
		this.antiAliasArray = []
		for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
			this.pepTable[ p ].Histocount = 0
			this.pepTable[ p ].z = p
			this.pepTable[ p ].src = this.aminoFilenameIndex( p )[0]

			// IMAGE DATA ARRAYS
			this.pepTable[ p ].mixRGBA  = [0,0,0,0]
			if ( brute == true ) {
				this.pepTable[ p ].hm_array = [0,0,0,0]
				this.pepTable[ p ].lm_array = [0,0,0,0]
				// FILENAMES
				this.pepTable[ p ].hilbert_master = this.aminoFilenameIndex( p )[0]
				this.pepTable[ p ].linear_master = this.aminoFilenameIndex( p )[1]
				this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[0]
				this.pepTable[ p ].linear_preview = this.aminoFilenameIndex( p )[1]
			}
		}
		// termSize()
	}

	progUpdate(obj) {  // allows to disable all the prog bars in one place
		if ( this.updateProgress == true) {
			if ( typeof progato !== "undefined" && obj ) {
				// this.fastUpdate()
				// redoline(`Progress ${obj}`)
				progato.update(obj)
			}
		} else {
			// redoline(`progress dummy function: ${obj}`)
			// bugtxt(`progress dummy function: ${obj}`)
		}
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
		}
		process.stdin.resume() // means start consuming
		// listen for the "keypress" event
		process.stdin.on("keypress", function (ch, key) {
			output(`got keypress: ${ chalk.inverse( key.name )}`)

			if ( key ) {

				if ( key.name == "q" || key.name == "escape" ) {
					killServersOnQuit = false
					// killAllTimers()
					that.gracefulQuit(0, "Q esc")
				} else if ( !key.ctrl || key.name !== "c") {
					if ( autoStartGui && key.name == "g") {
						output(`Starting GUI from key command: ${key.name} ${status}`)
						killAllTimers()
						if ( status == "module exit" ) {
							startGUI()
						}
					}
				}
				// Interactive control:    D (demo full RGB test)    T (short test)   Q (graceful quit next save)
				// V (toggle verbose mode) B (live DNA to screen)    Esc (graceful quit)    Control-C (fast quit)
				// W (webserver)           C (clear scrn)            U (updates stats)       X (search ~ for DNA)
				// O (open images after render)                      or [space]       G  (experimental carlo GUI)

				if ( key.ctrl && key.name == "c") {
					process.stdin.pause() // stop sending control-c here, send now to parent, which is gonna kill us on the second go with control-c
					status  = "TERMINATED WITH CONTROL-C"
					that.gracefulQuit(0, "Control-c")
					destroyKeyboardUI()

					if ( renderLock == true && this.timeRemain < 10000) {
						that.msPerUpdate = 800
						output("Closing in 5 seconds")
						setTimeout(()=> {
							that.gracefulQuit(130, "Control-c")
						}, 500)
					} else {
						that.gracefulQuit(130, "Control-c")
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
					if ( that.updates == true) {
						that.updates = false
						killAllTimers()
						// clearTimeout( that.updatesTimer);
					} else {
						that.updates = true
						// that.drawHistogram()
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
		this.verbose = !this.verbose
		log(`verbose mode ${this.verbose}`)
	}



	togglednabg() {
		this.dnabg = !this.dnabg
		clearCheck()
		log(`dnabg mode ${this.dnabg}`)
	}
	toggleServer() {
		webserverEnabled = !webserverEnabled
		if ( webserverEnabled ) {
			log("start server")

			// pushCli('--serve');
			// output( server.foregroundserver() )
			server.start( generateTheArgs() )
			autoStartGui = false

		} else {
			killServers()
		}

	}
	toggleDebug() {
		debug = !debug
		if (debug == true) {
			this.raceDelay  += 1000 // this helps considerably!
		}
		if (debug == false) {
			this.raceDelay  -= 100
		}
		output("AminoSee has been slowed to " + this.raceDelay )
	}
	toggleDevmode() {
		this.devmode = !this.devmode

	}
	toggleForce() {
		this.force = !this.force
		log(`force overwrite ${this.force}`)
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
	gracefulQuit(code, reason) {
		if ( typeof code === "undefined" ) {
			code = 0
		}
		mode( `Graceful shutdown in progress... code ${code} reason ${reason}`)
		server.stop()
		if ( renderLock ) {
			output( blueWhite( `R: ${status} still rendering: ${this.justNameOfPNG}` ) )
		}
		bugtxt("webserverEnabled: " + webserverEnabled + " killServersOnQuit: "+ killServersOnQuit)
		// printRadMessage(  status )
		isShuttingDown = true
		this.args._= []
		cliInstance.args._= []
		remain = 1
		batchSize = 0
		// debug = true
		// this.devmode = true
		this.updates = false
		if (this.devmode == true) {
			output("Because you are using --devmode, the lock file is not deleted. This is useful during development because I can quickly that.test new code by starting then interupting the render with Control-c. Then, when I use 'aminosee * -f -d' I can have new versions rende that.red  but skip super large genomes that would take 5 mins or more to render. I like to see that they begin to render then break and retry; this way AminoSee will skip the large genome becauyse it has a lock file, saving me CPU during development. Lock files are safe to delete.")
		} else {
			deleteFile( this.fileTouch ) // removeLocks( this.fileTouch, this.devmode );
		}
		// killAllTimers()
		destroyKeyboardUI()
		this.destroyProgress()
		this.quit(code, "graceful")
	}

	downloadMegabase(cb) {
		this.currentFile = "megabase.fa"
		cfile = this.currentFile
		let promiseMegabase = new Promise(function(resolve,reject) {
			try {
				var exists = doesFileExist( this.currentFile)
			} catch(err) {
				log(maxWidth(5, "e:" + err))
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
		return fixedWidth(18, this.currentFile) + " " + fixedWidth(18, this.nextFile)
	}
	runTerminalCommand(str) {
		output(`[ running terminal command ---> ] ${str}`)
		const exec = require("child_process").exec
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
		// output(a);
		return a.Codon.toUpperCase().substring(0, 4) == this.focusPeptide.toUpperCase().substring(0, 4)
	}
	pepToColor(pep) {
		let temp = this.focusPeptide
		this.focusPeptide = pep // aPeptideCodon depends on this global
		let clean = this.pepTable.filter(aPeptideCodon)
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
		// return `${(isDiskFinLinear ? 'Linear ' : '')} ${(isDiskFinHilbert ? 'Hilbert ' : '')} ${(isDiskFinHTML ? 'HTML ' : '' )}`;
		return `${( !this.isDiskFinLinear ? "Linear" : "OK ")} ${( !this.isDiskFinHilbert ? "Hilbert" : "OK ")} ${( !this.isDiskFinHTML ? "HTML" : "OK " )}`
	}

	setNextFile() {
		try {
			this.nextFile = this.args._[1] // not the last but the second to last
		} catch(e) {
			this.nextFile = "...Finito..."
		}
		if ( typeof this.nextFile === "undefined" ) {
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
		if ( remain < 1 ) { return }

	}
	pollForStream( reason ) {
		let file
		mode( batchProgress()+ " pre-polling " + reason)
		if ( renderLock == true ) {
			mode(`removing thread ${ this.justNameOfDNA} ${ this.busy() } ${ this.storage() } reason: ${reason}`)
			error( `P: ${ maxWidth(24,  status)} ` )
			return false
		} else {
			redoline(`Polling for work... ${this.busy()} ${batchProgress()} ${nicePercent()} ${streamLineNr}`)
		}
		if ( this.test == true || this.demo ) { // uses a loop not polling.
			// error("test is in look for work?")
			log("test is in look for work?")
			return false
		}
		mode(`Validating file ${batchProgress()}`)
		if ( this.isStorageBusy ) {
			error(`thread re-entry in prepare state ${this.justNameOfPNG}`)
			return false
		}
		try {
			file = this.args._[0].toString()
			remain = this.args._.length
		} catch(err) {
			remain = 0
			// return false
		}
		if (remain <= 0) {
			mode("Happiness.")
			data.saySomethingEpic()
			log(chalk.bgRed.yellow( `R: ${status} ` ))
			if ( !this.quiet ) {
				printRadMessage(  status )
			}
			if ( killServersOnQuit ) {
				// output("Control-c to stop server")
				setTimeout( () => {
				this.quit(0,  status )
			}), 10
			} else {
				output("Control-c to stop server")
				this.quit(0,  status )
			}
			return false
		}

		mode(`Checking file ${batchProgress()}`)

		if ( file.indexOf("...") !== -1) {
			mode( "Cant use files with three dots in the file ... (for some reason?)")
			this.fastReset( status )
			return false
		}
		if ( file === undefined) {
			mode("undefined after resolve: " + file)
			this.fastReset( status )
			return false
		}
		if ( fileSystemChecks( file )  == false ) {
			mode(`failed filesystem check: ${ file }`)
			this.fastReset( `R: ${status} ` )
			return false
		}

		this.genomeCanonicalisaton(file)
		remain = this.args._.length
		this.setNextFile()
		this.currentFile = file

		let msg =  `Checking job ${ batchProgress() }: ${ blueWhite(  this.highlightOrNothin() )} ${fixedWidth(tx /2, file)} verbose`

		if ( this.verbose ) {
			output(msg)
		} else {
			redoline(msg)
		}

		try {
			this.dnafile = path.resolve( file )
		} catch(err) {
			mode(	"failed file system checks: " + file)
			if ( this.verbose ) {
				redoline(status)
			}
			this.fastReset( status )
			return false
		}





		this.currentFile = file
		this.dnafile = path.resolve(file)
		webroot = locateWebroot( this.dnafile )
		this.outputPath = path.resolve( webroot, "output")
		this.imgPath = path.resolve( this.outputPath, this.justNameOfDNA, "images")

		// see if we have writable folder:
		if ( this.mkdir() ) {
			log("Success")
		} else {
			error("That's weird. Couldn't create a writable output folder at: " + this.outputPath + ". You can set custom output path with --output=~/newpath")
			this.slowSkipNext("no write permission")
		}
		if ( file == funknzlabel ) {
			error("funknzlabel")
			this.slowSkipNext("funknzlabel " + file)
			return false
		}

		if ( remain < 0 ) {
			reason = "outa work - last render"
			mode(reason)
			this.quit(0, reason)
			return false
		}
		if ( this.dnafile === undefined || this.currentFile === undefined) {
			reason = "dnafile === undefined"
			mode(reason)
			this.slowSkipNext(reason)
			return false
		}

		if ( isShuttingDown == false && remain <= 0 ) { this.quit(0, "ran out of files to process") }
		if ( this.test ) { log("RETURNING FALSE"); return false }
		// if ( this.currentFile == funknzlabel) { // maybe this is to get past my lack of understanding of processing of this.args.
		// 	this.slowSkipNext("For some odd reason... yeah Im gonna get back to you on that unset variable")
		// 	return false
		// }
		if ( this.demo == true ) {
			output("demo mode (disabled?)")
			// runDemo()
			return false
		}
		if (!this.checkFileExtension( this.dnafile )) {
			let msg = maxWidth( tx/2, `${ batchProgress() } wrong file extension. ${this.dnafile}`)
			notQuiet( msg )
			log( `Must be one of ${ extensions }`)
			if ( remain > 0 && !renderLock) {
				this.fastReset(msg)
			} else {
				error("Bargle!")
			}
			return false
		}
		if ( doesFolderExist(this.dnafile ) ) { // FOLDER CHECK
			let asterix = `${ this.currentFile }/*`
			let msg = `If you meant to render everything in (${this.currentFile}), try using an asterix on CLI:  ${chalk.italic.bold(  "aminosee " +  asterix)}`
			notQuiet(msg)
			log(`${this.dnafile}`)
			// countdown(`opening ${asterix} in `, 1000, () => {
			log(`Pushing folder for processing... ${asterix} (disabled)`)
			// pushCli(asterix);
			// })
			// this.slowSkipNext(msg)
			this.fastReset(msg)
			return false
		}

		if (doesFileExist(this.dnafile ) == false) {
			this.fastReset(`${this.dnafile } No File Found`)
			return false
		}
		if (charAtCheck(this.dnafile ) == false) {
			this.fastReset("charAtCheck returned false: "+ this.dnafile )
			return false
		}

		///////////////// BEGIN MODIFYING GLOBALS //////////////////////////////
		if ( renderLock ) { error("draining threads from reset"); return false }
		mode("setup render " + this.busy() + " " + this.currentFile)
		this.setupRender( this.currentFile )
		msg = `>>> PREFLIGHT <<< ${ remain } ${ path.normalize( this.currentFile )} reason: ${reason}`
		log(msg)
		redoline(msg)
		log("Checking for previous render"+ this.filePNG)
		if (this.extension == "zip") {
			// streamingZip(this.dnafile )
			this.fastReset(`${this.dnafile }  ZIP file`)
			return false
		}
		if ( this.checkFileExtension( this.currentFile ) == false)  {
			msg = `File Format not supported: (${ this.getFileExtension( this.currentFile)}) Please try: ${ extensions }`
			mode(msg)
			log( msg )
			this.fastReset(msg)
			return false
		}
		if (doesFolderExist(this.dnafile ) ) {
			msg = `${this.currentFile} is a folder not a file, will try to re-issue job as ${this.currentFile}/* to process all in dir`
			// pushCli( `${basename( this.currentFile )}/*` );
			this.slowSkipNext(msg)
			return true
		}
		if (doesFileExist(this.filePNG)) {
			log(`isStorageBusy ${this.isStorageBusy} Storage: [${this.isStorageBusy}]`)
			termDrawImage(this.filePNG, "Done! ")
			let msg = `Already rendered image: ${  maxWidth(tx / 3, this.justNameOfPNG)}.`
			log(msg)
			if ( this.force == false ) {
				this.openOutputs()
				this.slowSkipNext(msg)
				return false
			}
			log("But lets render it again...")
		}
		if ( this.checkLocks( this.fileTouch )) {
			let msg = batchProgress() + " Render already in progress by another thread: "
			output(msg +  blueWhite( path.basename( this.justNameOfPNG ))) // <---  another node maybe working on, NO RENDER
			mode(msg + this.justNameOfPNG)
			log("Use --force or delete this file with:")
			log( chalk.italic(`rm ${path.normalize( this.fileTouch )}`) )
			this.slowSkipNext(msg)
			return false
		}
		mode(`Lock OK proceeding to render ${ this.justNameOfPNG } in ${ humanizeDuration( fileLockingDelay ) }... ${ this.busy() }`)
		log( `S: ${status} ` )
		this.justNameOfPNG = this.generateFilenamePNG()
		setTimeout( () => {
			if ( renderLock == false) {
				this.touchLockAndStartStream() // <<<<------------- THIS IS WHERE MAGIC STARTS!!!!
			} else {
				log("Stopped")
			}
		}, this.raceDelay)
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
	fastReset(reason){
		mode(`FAST RESET JOB ${batchProgress()} (${ this.storage()} ${ this.busy()}) Reason ${reason} Storage:  current: ${ this.currentFile } next: ${ this.nextFile}`)
		status = maxWidth( tx / 2, status)
		if ( renderLock ) { error("draining threads from reset"); return false }
		log( status)
		if ( reason === undefined ) { error("must set a reason when using reset") }
		this.setIsDiskBusy( false )
		try {
			remain = this.args._.length
		} catch(err) {
			remain = 0
			this.quit(0, "Finito hombre")
			return false
		}
		if (remain < 1 ) {
			if ( renderLock) {
				output("not resetting")
			} else{
				this.gracefulQuit(0, "fast reset")
				// this.destroyProgress()
				// destroyKeyboardUI()
				// isShuttingDown = true
				// this.quit(0, " resetting " + reason)
			}

			return false
		}
		this.currentFile = this.args._.shift()
		this.setNextFile()
		// setTimeout( () => {
			if ( !renderLock ) {
				this.pollForStream( maxWidth(12, status ))
			}

		// }, this.raceDelay)
	}
	initStream() {
		mode("Initialising Stream: " + this.justNameOfPNG)
		output( chalk.rgb(64, 128, 255).bold( status ))
		output(`OUTPUT FOLDER: ${ blueWhite( blueWhite( path.normalize( this.outputPath )))}`)
		this.setNextFile()
		// this.timestamp = Math.round(+new Date()/1000)
		this.runid = new Date().getTime()

		if ( isShuttingDown == true ) { output(`Shutting down after this render ${ blueWhite(this.justNameOfPNG)}`) }
		if ( renderLock == false) {
			error("RENDER LOCK FAILED. This is an  error I'd like reported. Please run with --verbose --devmode option enabled and send the logs to aminosee@funk.co.nz")
			this.slowSkipNext("render lock failed inside initStream")
			return false
		}
		// term.down( termDisplayHeight /4)
		// this.termSize();
		this.setIsDiskBusy( false )
		// this.mkRenderFolders() // create /images etc
		this.rawDNA = "@"
		this.percentComplete = 0
		this.genomeSize = 0 // number of codons.
		this.pixelStacking = 0 // how we fit more than one codon on each pixel
		this.pixelClock = 0 // which pixel are we painting?
		this.msElapsed  = 0
		this.rgbArray = []
		tups = 0
		this.initialiseArrays()

		// this.hilbertImage = [];
		output(`${batchProgress()} 🚄 Init stream of ${ this.dnafile } Filesize ${bytes( this.baseChars)}`)
		// if ( this.quiet == false ) {
		//   term.up( termDisplayHeight +   termHistoHeight *2);
		//   term.eraseDisplayBelow();
		// }

		killAllTimers()
		this.progUpdate({ title: `Transcribe est. ${this.baseChars.toLocaleString()} nucleotides ${this.justNameOfDNA}`, items: remain, syncMode: true })

		if ( this.willRecycleSavedImage && this.recycEnabled) {
			output(`Skipped DNA render stage of ${ this.justNameOfDNA}`)
			log("AM PLANNING TO RECYCLE TODAY (joy)")
			this.recycleOldImage( this.filePNG )
			return false
		} else {
			log("Not recycling")
		}
		// startStreamingPng();
		procTitle( `${bytes( this.baseChars )} c${ this.codonsPerPixel } m${this.dimension}`)

		try {
			// var that = this
			let closure = path.resolve( this.dnafile )
			let readStream = fs.createReadStream( closure ).pipe(es.split()).pipe(es.mapSync(function(line){
				readStream.pause() // pause the readstream during processing
				cliInstance.processLine(line) // process line here and call readStream.resume() when ready
				setImmediate( () => {
					readStream.resume()
				})
			})
				.on("start", function(){
					mode("streaming start " + cliInstance.busy())
					log(status)
				})
				.on("error", function(err){
					mode(`stream error ${err} file: ${cliInstance.dnafile} closure ${closure}`)
					error( `R: ${status} ` )
					// output(`while starting stream: [${ closure }] renderLock: [${ renderLock}] storage: [${this.storage()}]`);
				})
				.on("end", function() {
					mode("stream end " + cliInstance.busy())
					log(status)
				})
				.on("close", function() {
					mode("stream close " + cliInstance.busy())
					log(status)
					cliInstance.streamStopped()
					bugtxt(`globalVariablesDoSuck: ${	cliInstance.focusPeptide}`)
					// this.streamStopped();
				}))
		} catch(e) {
			if ( e == "EISDIR") {
				output("[EISDIR] Attempted to red a directory as if it were a file.")
			} else {
				output("Unknown error was caught during streaming init " + e)
			}
		}
		this.streamStarted()

		// output("FINISHED INIT " + cliInstance.howMany);

	}
	initialiseArrays() {
		if ( brute == false) { return false }

		for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop

			this.pepTable[p].lm_array = [0,0,0,0]
			this.pepTable[p].hm_array = [0,0,0,0]
			this.pepTable[p].mixRGBA  = [0,0,0,0]
			this.pepTable[p].linear_master = this.generateFilenamePNG( this.pepTable[p].Codon )//  this.aminoFilenameIndex(p)[1]
			this.pepTable[p].hilbert_master =  this.generateFilenameHilbert( this.pepTable[p].Codon )//  this.aminoFilenameIndex(p)[0]
			log(`initialise ${p}`)
			bugtxt( this.pepTable[p] )		}

	}
	diskStorm(cb) {
		log("WE BE STORMIN")
		if ( brute == false) { runcb(cb); return false }
		killAllTimers()
		log("LIKE NORMAN")

		for ( let p = 1; p < this.pepTable.length; p++ ) { // standard peptide loop
			let pep = this.pepTable[ p ]
			let currentLinearArray  =  this.pepTable[ p ].lm_array
			let currentHilbertArray =  this.pepTable[ p ].hm_array
			// saveLinearPNG();

			mode("disk storm " + p)
			let pixels, width, height = 0
			let pwh = this.pixWidHeight()

			pixels = pwh[0]
			width  = pwh[1]
			height = pwh[2]

			let fullpath = path.resolve( this.outputPath, this.justNameOfDNA, "images", pep.linear_master)
			log(`Saving amino acid layer ext ${this.extension} cppH ${this.codonsPerPixelHILBERT} ${ pep.Codon } ${pixels} ${width} ${height} size: ${currentLinearArray.length} ${fullpath}`)
			genericPNG( currentLinearArray, width, height, fullpath)

			fullpath = path.resolve( this.outputPath, this.justNameOfDNA, "images", pep.hilbert_master)
			log(`saving to ${fullpath}`)
			if ( p == this.pepTable.length -1 ) { // trigger the callback on the last one
				genericPNG( currentHilbertArray, width, height, fullpath , () => {
					this.hilbertFinished()
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
			error("streamStarted")
			return false
		}
		mode(`Stream of ${this.currentFile} started at ${ formatAMPM(this.startDate) }`)
		this.calcUpdate()
		// this.tLock();
		// var that = this;
		// output(`Started ${ ( this.force ? 'forced ' : '' ) }render of ${this.justNameOfPNG} next is ${this.nextFile}`);
		setTimeout(() => {
			clearCheck()
			term.eraseDisplayBelow()
			if ( renderLock == true ) {
				this.manageLocks(fileLockingDelay)
				this.drawHistogram()
			} else {
				log(`render of ${ this.justNameOfPNG } completed`)
				killAllTimers()
			}
		}, fileLockingDelay)
	}
	manageLocks(time) {
		if ( this.lockTimer !== undefined) { clearTimeout(this.lockTimer) }
		if ( isShuttingDown == true ) { return false }
		var that = this

		this.lockTimer = setTimeout( () => {
			if ( renderLock == true ) {
				that.fastUpdate()
				if (  that.percentComplete < 0.9 &&  that.timeRemain > 20000 ) { // helps to eliminate concurrency issues
					that.mkRenderFolders("manage locks")
					that.tLock()
					if (time < 60001) { time + 5000 }
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
		mode("stream stopped")
		log( blueWhite("Stream ending event"))
		term.eraseDisplayBelow()
		this.percentComplete = 1
		this.calcUpdate()
		this.percentComplete = 1
		streamLineNr = 0
		// clearTimeout( this.updatesTimer);
		// clearTimeout( this.progTimer);
		// clearTimeout( this.lockTimer);
		killAllTimers()

		this.focusTriplet = this.triplet
		this.focusPeptide = this.peptide
		// setTimeout( ()=> {
		this.saveDocsSync()
		// }, this.raceDelay)

	}
	showFlags() {
		return `${(  this.force ? "F" : "-"    )}${( this.updates ? "U" : "-" )}C_${ this.userCPP }${( this.keyboard ? "K" : "-" )}${(  this.dnabg ? "B" : "-"  )}${( this.verbose ? "V" : "-"  )}${(  this.artistic ? "A" : "-"    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : "---"    )}${( this.dimension ? "M" + this.dimension : "-")}${( this.reg?"REG":"")} C${ onesigbitTolocale( this.codonsPerPixel )}${( brute ? "BRUTE" : "-" )}${( this.index ? "I" : "-" )}`
	}
	testSummary() {
		return `TEST
				this.justNameOfDNA: <b>${ this.justNameOfDNA}</b>
				Registration Marks: ${( this.reg ? true : false )}
				${ ( this.peptide || this.triplet ) ?  "Highlights: " + ( this.peptide || this.triplet) : " "}
				Your custom flags: TEST${(  this.force ? "F" : ""    )}${(  this.userCPP == "auto"  ? `C${ this.userCPP }` : ""    )}${(  this.devmode ? "D" : ""    )}${(  this.args.ratio || this.args.r ? `${ this.ratio }` : ""    )}${(  this.args.magnitude || this.args.m ? `M${ this.dimension }` : ""    )}
				${(  this.artistic ? " Artistic this.mode" : " Science this.mode"    )}
				Max magnitude: ${ this.dimension } ${ this.dimension } / 10 Max pix: ${ this.maxpix.toLocaleString()}
				Hilbert Magnitude: ${ this.dimension } / ${defaultMagnitude}
				Hilbert Curve Pixels: ${hilbPixels[ this.dimension ]}`
	}
	renderObjToString() {
		const unknown = "unknown until render complete"
		return `
				Canonical Name: ${ this.justNameOfDNA }
				Canonical PNG: ${ this.justNameOfPNG }
				Source: ${ this.justNameOfCurrentFile}
				Full path: ${this.dnafile }
				Started: ${ formatAMPM(this.startDate) } Finished: ${ formatAMPM(new Date())} Used: ${humanizeDuration( this.runningDuration )} ${ this.isStorageBusy ? " " : "(ongoing)"}
				Machine load averages: ${ this.loadAverages()}
				DNA Input bytes: ${ bytes( this.baseChars ) } ${ bytes( this.bytesPerMs * 1000 ) }/sec
				Image Output bytes: ${ this.isStorageBusy == true ? bytes( this.rgbArray.length ) : "(busy)" }
				Pixels (linear): ${ this.pixelClock.toLocaleString()} Image aspect Ratio: ${ this.ratio }
				Pixels (hilbert): ${hilbPixels[ this.dimension ].toLocaleString()} ${(  this.dimension ? "(auto)" : "(manual -m)")}
				Custom flags: ${ this.showFlags()} "${( this.artistic ? "Artistic mode" : "Science mode" )}" render style
				Estimated Codons: ${Math.round( this.estimatedPixels).toLocaleString()} (filesize % 3)
				Actual Codons matched: ${ this.genomeSize.toLocaleString()} ${ this.isStorageBusy ? " " : "(so far)" }
				Estimate accuracy: ${ this.isStorageBusy ? Math.round((( this.estimatedPixels /  this.genomeSize))*100) + "% of actual ": "(still rendering...) " }
				Non-coding characters: ${ this.errorClock.toLocaleString()}
				Coding characters: ${ this.charClock.toLocaleString()}
				Codons per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )} (linear) ${ this.isStorageBusy ? twosigbitsTolocale( this.codonsPerPixelHILBERT ) : unknown } (hilbert projection)
				Linear to Hilbert reduction: ${ this.isStorageBusy ?  twosigbitsTolocale( this.shrinkFactor) : unknown } Oversampling: ${ twosigbitsTolocale(overSampleFactor)}
				Max pix setting: ${ this.maxpix.toLocaleString()}
				${ this.dimension }th Hilbert curve infintite recursion dimension
				Darken Factor ${ twosigbitsTolocale(darkenFactor)} / Highlight Factor ${ twosigbitsTolocale( highlightFactor)}
				Gigabytes processed on this profile: ${ gbprocessed.toLocaleString()} Run ID: ${ this.timestamp } ${ cliruns}th run on ${ hostname }
				Total renders: ${ userprefs.aminosee.completed } Project opens: ${ projectprefs.aminosee.opens } (only increments when using --image --help --html or --explorer)
				AminoSee version: ${version}`
	}



	// CODONS PER PIXEL
	autoconfCodonsPerPixel() {
		mode("autoconf")
		if ( renderLock ) { error("thread entered autoconf") ; return false}
		if ( this.test ) { log("Not configuring - due to test"); return false}
		if (this.dnafile  == funknzlabel) { log("no"); return false }
		this.baseChars = this.getFilesizeInBytes( this.dnafile )
		if ( this.baseChars < 0) { // switch to streaming pipe this.mode,
			return false
			// error("Are you streaming std in? That part isn't written yet!")
			// this.isStreamingPipe = true; // cat Human.genome | aminosee
			// this.estimatedPixels = 696969; // 696969 flags a missing value in debug
			// this.dimension = this.dimension = 6; // close to 69
			// log("Could not get filesize, setting for image size of 696,969 pixels, maybe use --codons 1 this is rendered with --codons 696");
			// this.baseChars = 696969; // 696969 flags a missing value in debug
			// this.codonsPerPixel = 696; // small images with _c69 in this.file
			// process.exit();
			return true
		} else { // use a file
			this.isStreamingPipe = false // cat Human.genome | aminosee
			this.estimatedPixels =  this.baseChars / 3 // divide by 4 times 3
			if ( this.estimatedPixels > 256 ) {
				if ( this.magnitude == "auto") {
					log(`est pixels : ${this.estimatedPixels}` )
					this.dimension = optimumDimension ( this.estimatedPixels, this.magnitude )
				}
			} else {
				let msg = "Not enough pixels to form image"
				renderLock = false
				this.slowSkipNext(msg)
				return false
			}
		}

		if ( this.estimatedPixels < this.maxpix ) { // for sequence smaller than the screen
			if ( this.userCPP !== "auto" )  {
				log("its not recommended to use anything other than --codons 1 for small genomes")
			} else {
				this.codonsPerPixel = 1 // normally we want 1:1 for small genomes
			}
		}

		if ( this.userCPP !== "auto" ) {
			output(`Manual zoom level override enabled at: ${ this.userCPP } codons per pixel.`)
			this.codonsPerPixel = this.userCPP
		} else {
			log("Automatic codons per pixel setting")
		}

		if ( this.estimatedPixels > this.maxpix ) { // for seq bigger than screen        this.codonsPerPixel = this.estimatedPixels /  this.maxpix*overSampleFactor;
			this.codonsPerPixel = Math.round( this.estimatedPixels /  this.maxpix ) // THIS IS THE CORE FUNCTION
			if ( this.userCPP == "auto" ) {
				if ( this.userCPP < this.codonsPerPixel) {
					log( terminalRGB(`WARNING: Your target Codons Per Pixel setting ${ this.userCPP } will make an estimated ${Math.round( this.estimatedPixels / this.userCPP).toLocaleString()} is likely to exceed the max image size of ${ this.maxpix.toLocaleString()}, sometimes this causes an out of memory  this.error. My machine spit the dummy at 1.7 GB of virtual memory use by node, lets try yours. We reckon ${ this.codonsPerPixel } would be better, higher numbers give a smaller image.`))
				}
			} else {
				this.codonsPerPixel = this.userCPP // they picked a smaller size than me. therefore their computer less likely to melt.
			}
		}

		if ( this.codonsPerPixel < defaultC) {
			this.codonsPerPixel = defaultC
		} else if ( this.codonsPerPixel > 6000) {
			this.codonsPerPixel = 6000
		} else if ( isNaN( this.codonsPerPixel ) || this.codonsPerPixel === undefined) {
			error("codonsPerPixel == NaN || this.codonsPerPixel === undefined")
			this.codonsPerPixel = defaultC
		}
		if ( this.artistic == true) {
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
		// then drop the auto value by 1 for each below the default.
		if ( this.magnitude == "custom" ) {
			let increase = defaultMagnitude - this.dimension
			this.codonsPerPixel = this.codonsPerPixel + increase
			notQuiet(`Increased codons per pixel by ${increase} to ${this.codonsPerPixel}`)
		} else {
			log(`Codons per pixel is ${this.codonsPerPixel}`)

		}
		return this.codonsPerPixel
	}

	removeFileExtension(f) {
		return f.substring(0, f.length - ( this.getFileExtension(f).length+1))
	}
	highlightFilename(talkwithpep) { // return small fragment of the filename
		if ( typeof talkwithpep == "undefined" ) { talkwithpep = "Reference" }
		let ret = ""
		if ( this.isHighlightSet ) {
			if ( this.triplet !== "Reference") {
				ret += `__${spaceTo_( this.triplet ).toUpperCase()}` // looks better uppercase
			} else if ( talkwithpep  !== "Reference") {
				ret += `__${spaceTo_( tidyPeptideName( talkwithpep ) )}`
			}
		} else {
			ret += "_Reference"
		}
		log(`return: ${ blueWhite( ret )} this.focusTriplet: ${this.focusTriplet} talkwithpep ${ talkwithpep}`)
		return ret
	}
	calcHilbertFilenames() {
		// REQUIRES RENDERING TO MEMORY PRIOR
		this.focusPeptide = this.peptide
		this.justNameOfHILBERT =  this.generateFilenameHilbert( this.focusPeptide )
		this.fileHILBERT = path.resolve( this.outputPath, this.justNameOfDNA, "images", this.justNameOfHILBERT)
	}
	generateURL() {
		if ( this.index && !this.artistic ) {
			this.currentURL = `${url}/output/${this.justNameOfDNA}/`
		} else if (this.artistic) {
			this.currentURL = `${url}/output/${this.justNameOfDNA}/artistic.html`
		} else {
			this.currentURL = `${url}/output/${this.justNameOfDNA}/${this.justNameOfHTML}`
		}
		return this.currentURL
	}

	generateFilenameHistogram( focus ) {
		this.fileHistogram = path.resolve( this.outputPath, this.justNameOfDNA, "aminosee_histogram.json")
		return this.fileHistogram
	}

	generateFilenameTouch( focus ) { // we need the *fullpath* of this one
		if ( focus === undefined ) {
			focus = this.peptide
		}
		return `AminoSee_BUSY_LOCK_${ maxWidth(12, this.justNameOfPNG )}_c${ onesigbitTolocale( this.codonsPerPixel ) }${ this.highlightFilename( focus ) }${ this.getImageType() }.txt`
	}
	generateFilenamePNG( focus ) {
		if ( focus === undefined ) {
			focus = this.peptide
		}
		this.justNameOfPNG = `${ this.justNameOfDNA}.${ this.extension }_linear_c${ onesigbitTolocale( this.codonsPerPixel )}${ this.highlightFilename( focus ) }${this.getImageType() }.png`
		return this.justNameOfPNG
	}


	generateFilenameHilbert( focus ) { // needs  this.dimension estimatedPixels
		if ( focus === undefined ) {
			focus = this.focusPeptide
		}
		if ( this.test) {
			// the this.dnafile should be set already fingers crossed.
			this.justNameOfHILBERT =     `${ this.justNameOfDNA}.${ this.extension }_HILBERT_m${ this.dimension }_c${ onesigbitTolocale( this.codonsPerPixelHILBERT )}${ this.highlightFilename( focus ) }${ this.getRegmarks()}.png`
		} else {
			bugtxt(`Generating filenames: n ${ this.pixelClock }  ${ this.justNameOfDNA} [${ this.codonsPerPixelHILBERT }] optimumDimension:  this.magnitude:  ${ this.magnitude } ${this.pixelClock} ${this.dimension}` )
			this.justNameOfHILBERT =     `${ this.justNameOfDNA}.${ this.extension }_HILBERT_m${ this.dimension }_c${ onesigbitTolocale (this.codonsPerPixelHILBERT) }${ this.highlightFilename( focus ) }${ this.getRegmarks()}.png`
			this.fileHILBERT = path.resolve( this.imgPath, this.justNameOfHILBERT )
		}
		log(`generateFilenameHilbert: ${this.justNameOfHILBERT} focus: ${blueWhite(focus)}`)
		return this.justNameOfHILBERT
	}
	generateFilenameHTML() {
		this.justNameOfHTML =        `${ this.justNameOfDNA}.${ this.extension }_m${ this.dimension }${ this.getRegmarks()}${ this.getImageType() }.html`
		return this.justNameOfHTML
	}
	genomeCanonicalisaton( file ) {
		this.currentFile = file
		this.dnafile = path.resolve(file)
		this.justNameOfCurrentFile = basename( this.dnafile )
		this.extension = this.getFileExtension( file )
		this.justNameOfDNA = spaceTo_( this.removeFileExtension( this.justNameOfCurrentFile ))
		if ( this.justNameOfDNA.length > maxCanonical ) {
			this.justNameOfDNA = this.justNameOfDNA.replace("_", "")
		}
		if ( this.justNameOfDNA.length > maxCanonical ) {
			this.justNameOfDNA = this.justNameOfDNA.substring( 0, maxCanonical/2 ) + this.justNameOfDNA.substring( this.justNameOfDNA.length - ( maxCanonical /2), this.justNameOfDNA.length)
		}
		return this.justNameOfDNA
	}
	setupLinearNames() { // must not be called during creation of hilbert image
		if ( renderLock ) {
		  error("thread re-entry inside setupLinearNames")
		  return false
		}
		let msg = `Setup linear names: ${ this.currentFile } highlight set: ${this.isHighlightSet} peptide: ${this.peptide} focus: ${this.focusPeptide} triplet ${this.triplet}`
		this.focusPeptide = this.peptide
		mode(msg)
		log(msg)
		if (isShuttingDown) {     output(`isShuttingDown: [${ isShuttingDown }]`)  }

		// DNA CANONICALISATION
		// this.genomeCanonicalisaton()
		const cppBackup = this.codonsPerPixel
		const hcpBackup = this.codonsPerPixelHILBERT

		//
		// if ( brute == true ) {
		// for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
		// 		// previewCodonsPerPixel
		// 		// this.pepTable[p].linear_preview  =
		// 		// this.pepTable[p].hilbert_preview =
		// 		out(`initialise ${i}`)
		// 	}
		// }

		this.justNameOfPNG = this.generateFilenamePNG()
		this.fileTouch =   path.resolve( this.outputPath, this.justNameOfDNA, this.generateFilenameTouch()  )
		this.fileHTML =    path.resolve( this.outputPath, this.justNameOfDNA, this.generateFilenameHTML()   )
		this.filePNG =     path.resolve( this.imgPath, this.justNameOfPNG )
		this.fileHILBERT = path.resolve( this.imgPath, this.generateFilenameHilbert(this.pixelClock, this.magnitude ))
		this.currentURL = this.generateURL()
		// if ( this.index ) {
		// 	this.currentURL = `${url}/output/${this.justNameOfDNA}/`
		// } else {
		// 	this.currentURL = `${url}/output/${this.justNameOfDNA}/${this.justNameOfHTML}`
		// }

		// this.fancyFilenames();
		this.setNextFile()
	}
	qualifyPath(f) {
		return path.resolve( this.outputPath, this.justNameOfDNA, f  )
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
		// const evilSpawn = spawn('http-server', [server.getServerURL( this.justNameOfDNA), '--port', port, '0'], { stdio: 'pipe' });
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
		termDrawImage( path.resolve(__filename, "src", "public", "512_icon.png"), "--help section", () => {
			output( blueWhite( chalk.bold.italic("Welcome to the AminoSee DNA Viewer!")))
			output(siteDescription)
			output(chalk.bgBlue ("USAGE:"))
			output("    aminosee [files/*] --flags            (to process all files")
			terminalRGB("TIP: if you need some DNA in a hurry try this random clipping of 1MB human DNA:", 255,255,200)
			output("wget https://www.funk.co.nz/aminosee/dna/megabase.fa")
			output("This CLI is to convert sequence found in ASCII/RTF-8 text files - tested with .mfa .fa .gbk up to  into .png graphics. works with .mfa .fa .gbk DNA text files. It's been tested with files up to 3 GB, and uses asynchronous streaming architecture! Pass the name of the DNA file via command line, and it will put the images in a folder called 'output' in the same folder.")
			output(chalk.bgBlue ("HELP:"))
			output("Author:         tom@funk.co.nz or +64212576422")
			output("calls only between 2pm and 8pm NZT (GMT+11hrs)")
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
			output("  -- magnitude [0-8] -m9 crashes my mac 4096x4096 -m8 maximum 2048x2048 resolution")
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


		if ( this.help == true) {
			this.openHtml = true
			this.openImage = true
			this.openFileExplorer = true
			// if ( this.keyboard == true) { // this not need done twice
			// }
			// countdown('Press [Q] to quit this.now, [S] to launch a web server in background thread or wait ', 15000, blockingServer());
			// countdown('Press [S] to launch a web server in background thread or quit in ', 4000);
			setTimeout( () => {
			  countdown("Closing in " , 6000, () => {
					this.quit(1,"Help")
				} )
			}, 4000)
		}
	}

	mkRenderFolders(reason) {
		log(`Making render folders for ${ this.filePNG}`)
		this.mkdir() // create the webroot dir if it not exist
		this.mkdir( "output" )
		this.mkdir( path.join( "output", this.justNameOfDNA ) ) // genome render dir
		this.mkdir( path.join( "output", this.justNameOfDNA, "images" ) ) // genome render dir
		log(`Done making render folders for ${ this.justNameOfDNA} ${reason}`)
	}
	fancyFilenames() {
		// if ( this.updates ) {
		// 	term.up(9)
		// 	term.eraseDisplayBelow()
		// }

		output()
		output(chalk.bold(`Render Filenames for ${ this.justNameOfDNA}:`))
		output(chalk.rgb(255, 255, 255).inverse(    fixedWidth( this.colDebug*2,  `Input DNA File: ${ path.normalize( this.dnafile )}`)))
		output(chalk.rgb(200,200,200).inverse(      fixedWidth( this.colDebug*2,  `Linear PNG: ${ this.justNameOfPNG }`)))
		output(chalk.rgb(150,150,150).inverse(      fixedWidth( this.colDebug*2,  `Hilbert PNG: ${ this.justNameOfHILBERT }`)))
		output(chalk.rgb(100,100,180).inverse.underline(fixedWidth( this.colDebug*2, `HTML: ${ path.normalize( this.fileHTML )}`)))
		log(chalk.white.bgBlue.inverse(        fixedWidth( this.colDebug*2,  `Lockfile: ${ path.normalize( this.fileTouch )}`)))
		output(blueWhite(fixedWidth( this.colDebug*2,  `URL: ${ chalk.underline( this.currentURL )}`)))
	}
	setIsDiskBusy(boolean) {
		if (boolean) { // busy!
			redoline(`locking storage... (saving ${this.justNameOfDNA})`)
			this.isStorageBusy = true
			this.isDiskFinHTML = false
			this.isDiskFinHilbert = false
			this.isDiskFinLinear = false
			procTitle( "storage" )
		} else { // free!
			log(`storage unlocked (closing ${this.justNameOfDNA})`)
			this.isStorageBusy = false
			this.isDiskFinHTML = true
			this.isDiskFinHilbert = true
			this.isDiskFinLinear = true
			procTitle( "render completed" )
		}
	}

	saveDocsSync() {
		let pixels // = 0;
		mode(`Saving... ${ path.normalize( this.justNameOfPNG ) } to ${this.outputPath}  ratio: ${this.ratio}`)
		procTitle(  "saving" )
		log( `S: ${status} ` )
		if ( renderLock == false) {
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
			rollbackFolder( path.resolve( this.outputPath, this.justNameOfDNA) )
			// error(msg)
			// renderLock = false
			// this.slowSkipNext(msg)
			return false
		}
		if ( pixels < 64) {
			let msg = `less than 64 pixels produced: pixels = ${pixels}`
			mode(msg)
			rollbackFolder( path.resolve( this.outputPath, this.justNameOfDNA) )
			data.saySomethingEpic()
			renderLock = false
			setTimeout( () => {
				if ( !renderLock ) {
					mode(`${batchProgress()} Either there is too little DNA in this file for render at ${ this.codonsPerPixel } codons per pixel, or less than 64 pixels rendered: ${pixels} pixels rendered from ${ this.currentFile }` )
					deleteFile( this.fileTouch )
					renderLock = false
					this.slowSkipNext( `R: ${status} ` )
				} else {
					output("DRAINING surplus thread...")
				}
			}, this.raceDelay)
			return false
		}
		this.setIsDiskBusy( true )
		log(chalk.inverse(`Finished linear render of ${ this.justNameOfDNA}. Array length: ${ pixels.toLocaleString() } = ${ this.pixelClock.toLocaleString() } saving images`))
		// term.eraseDisplayBelow()

		if (this.test) { // the calibration generates its own image
			this.shrinkFactor = 1
		} else { // regular DNA processing
			userprefs.aminosee.cliruns++ // = cliruns // increment run counter. for a future high score table stat and things maybe.
			cliruns = userprefs.aminosee.cliruns
			gbprocessed  = userprefs.aminosee.gbprocessed
			gbprocessed +=  this.baseChars / 1024 / 1024 / 1024 // increment disk counter.
			userprefs.aminosee.gbprocessed = gbprocessed // i have a superstition this way is less likely to conflict with other threads
			genomesRendered.join( dedupeArray( projectprefs.aminosee.genomes) )
			genomesRendered.push( this.justNameOfDNA )
			genomesRendered = dedupeArray( genomesRendered ) // de dupe in case of re-renders
			projectprefs.aminosee.genomes = dedupeArray( genomesRendered )
			log( `genomesRendered ${genomesRendered}` )
		}

		let { shrinkFactor, codonsPerPixelHILBERT } = calculateShrinkage( this.pixelClock, this.dimension, this.codonsPerPixel )
		this.shrinkFactor = shrinkFactor
		this.codonsPerPixelHILBERT =  codonsPerPixelHILBERT
		this.savePNG( () => {
			log("master linear done")
		})
		this.prepareHilbertArray()
		this.calcHilbertFilenames()
		this.fancyFilenames()
		this.mkRenderFolders()
		mode("main render async.series")

		this.savePNG( this.saveHilbert( this.saveHTML( this.postRenderPoll() )))


		log( "Saving complete............... next: " + cliInstance.nextFile )




		// async.waterfall( [
		// async.series( [
		// 	function ( cb ) {
		// 		mode("async start " + cliInstance.currentFile)
		// 		cliInstance.savePNG(cb)
		// 		log(status)
		// 	},
		// 	function ( cb ) {
		// 		cliInstance.saveHilbert( cb )
		// 	},
		// 	function ( cb ) {
		// 		cliInstance.saveHTML( cb )
		// 	}
		// ])
		// 	.exec( function( error ) {
		// 		cliInstance.setNextFile()
		// 		setTimeout( () => {
		// 			cliInstance.postRenderPoll("End of async.series")
		// 		}, cliInstance.raceDelay)
		//
		// 		if ( error ) { log( "Doh! " + error )  }
		// 	})

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
	saveHTML(cb) {
		mode("maybe save HTML")
		if ( this.isHilbertPossible == false ) { mode("not saving html - due to hilbert not possible"); this.isDiskFinHTML = true }
		if ( this.report == false ) { mode("not saving html - due to report disabled. peptide: " + this.focusPeptide); this.isDiskFinHTML = true }
		if ( this.test ) { mode("not saving html - due to test");  this.isDiskFinHTML = true  }
		if ( this.willRecycleSavedImage == true && this.recycEnabled == true) {
			mode("Didnt save HTML report because the linear file was recycled.")
			this.isDiskFinHTML = true
		}
		if (this.isDiskFinHTML == true ) { // set just above
			output(`status ${status} not saving`)
			this.htmlFinished()
			runcb(cb)
			return false
		}
		mode("saving HTML")
		this.pepTable.sort( this.compareHistocount )
		let histogramJson =  this.getRenderObject()
    let histogramFile = this.generateFilenameHistogram()
		bugtxt(`globalVariablesDoSuck: ${	this.focusPeptide}`)
		// output( beautify( histogramJson , null, 2, 100) )


		// if ( doesFileExist( histogramFile ) ) {
		//   let loadedJson = readParseJson( histogramFile )
		//   console.log( beautify( JSON.stringify( loadedJson ), null, 2, 100) )
		//   this.pepTable = loadedJson.pepTable
		// }
		// process.exit();
		let hypertext, filename
		if ( this.test == true ) {
			hypertext = this.htmlTemplate( this.testSummary() )
		} else {
			hypertext = this.htmlTemplate( histogramJson )
		}
		// this.htmlFinished()
		// return
		// let histotext = beautify( JSON.stringify( histogramJson ), null, 2, 100);
		// let histotext =  JSON.stringify( histogramJson )
		let histotext =  histogramJson.toString()
		log(histotext)
		if (this.userCPP == "auto" && this.magnitude == "auto" && this.artistic == false && this.index == false) {
			if ( debug ) {
				filename = path.resolve( this.outputPath, this.justNameOfDNA, "main.html")
			} else {
				filename = path.resolve( this.outputPath, this.justNameOfDNA, "index.html")
			}
			this.fileWrite(filename, hypertext, cb) // the main.html is only written is user did not set --codons or --magnitude or --peptide or --triplet or --artistic
		} else if (this.artistic && this.userCPP == "auto") {
			this.fileWrite( path.resolve( this.outputPath, this.justNameOfDNA, "artistic.html"), hypertext, cb)
		}

		if ( this.index ) {
			filename = path.resolve( this.outputPath, this.justNameOfDNA, "index.html")
			this.fileWrite( filename, hypertext )
		}
		this.fileWrite( this.fileHTML, hypertext )
		this.fileWrite( histogramFile, histotext )
		this.htmlFinished()
		runcb(cb)
		log(`peptide: ${this.peptide} focus ${this.focusPeptide}`)
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
						fs.chmodSync(file, "0777")
					} catch(e) {
						log("Could not set permission for file: " + file + " due to " + e)
					}
					try {
						fs.utimesSync( file, tomachisBirthday, tomachisBirthday ) //
					} catch( err ) {
						output(`Unknown error: ${blueWhite( err )}`)
					}
				}
				log("$ " + file)
				runcb(cb)
			})
			log("¢")
		} catch(err) {
			log(`[catch] Issue with saving: ${file} ${err}`)
			runcb( cb )
		}
	}
	touchLockAndStartStream() { // saves CPU waste. delete lock when all files are saved, not just the png.
		mode("touchLockAndStartStream")
		log("I feel like touching a mutex lock and dancing")
		if ( renderLock ) { error("draining threads while locking"); return false }
		log("Locking threads for render")
		renderLock = true
		this.tLock()
		setTimeout( () => {
			if ( renderLock ) {
				this.initStream()
			} else {
				error("was put to sleep by another thread?")
			}
		}, this.raceDelay)
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
		renderLock = true
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
		this.fileWrite(
			this.fileTouch,
			outski,
			cb
		)
		if ( this.msElapsed > 10000) {
			termDrawImage( this.filePNG, "lock file")
		}
		if ( !this.quiet ) {
			// term.saveCursor()
			// output(chalk.bgWhite.rgb(48,48,64).inverse( this.blurb() ));
			out("*")
			// term.restoreCursor()
		}
		term.eraseDisplayBelow()
	}
	fileBug(err) {
		bugtxt(err + " the file was: " + this.currentFile)
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



	slowSkipNext( reason ) { // CAN ONLY RUN WHEN IDLE
		mode(`${batchProgress()} next file ${this.busy()}`)
		let msg = `${batchProgress()} -->> ${chalk.italic(reason)}`
		if ( this.verbose ) {
			output( msg )
		} else if ( !this.quiet ) {
			redoline( msg )
		}
		if ( renderLock ) { error(reason) }
		setTimeout( () => {
			if ( !renderLock ) {
				this.fastReset( `R: ${status} ` )
			} else {
				error("thread activated inside slow skip") ; return false
				// output("DRAINING surplus thread...")
			}
		}, this.raceDelay)
	}
	postRenderPoll(reason) { // renderLock on late, off early
		log(`post render reason: ${ blueWhite( reason )}`)

		if ( reason === undefined) { ("reason must be defined for postRenderPoll") }
		if ( this.verbose ) {
			log(chalk.inverse(`Finishing saving (${reason}), ${this.busy()} waiting on ${ this.storage() } ${ remain } files to go.`))
		}

		if ( renderLock == false ) { // re-entrancy filter
			log(chalk.bgRed("another thread has continued"))
      if ( !this.test ) {
        return false

      }
		}

		// try to avoid messing with globals of a already running render!
		// sort through and load a file into "nextFile"
		// if its the right this.extension go to sleep
		// check if all the disk is finished and if so change the locks
		if ( this.isDiskFinLinear == true && this.isDiskFinHilbert == true && this.isDiskFinHTML == true ) {
			renderLock = false
			log(` [ storage threads ready: ${chalk.inverse( this.storage() )} ] test: ${this.test} reason: ${reason}`)
			this.setIsDiskBusy( false )
			this.openOutputs()

			if ( this.test == true ) {
				renderLock = false
				if ( remain > 1) {
					output(` [ Starting another cycle in ${ humanizeDuration( this.raceDelay )}`)
					var that = this
					setTimeout( () => {
						if ( renderLock == false ) {
							output("now")
							renderLock = true
							// that.runCycle()
							cliInstance.runCycle()
						} else {
							output("busy")
						}
					}, this.raceDelay)
				} else {
					remain--
					renderLock = false
					// this.quit(1, "Finished test")
				}


			} else {
				log("DONE")
				clearTimeout( this.updatesTimer)
				clearTimeout( this.progTimer)
				removeLocks( this.fileTouch, this.devmode)
				if ( remain < 1) {
					isShuttingDown = true
				}
				setTimeout( () => {
					let msg = `${batchProgress()} Great success with render of (${this.justNameOfPNG})
${this.justNameOfHILBERT}`
					notQuiet(msg)
					saySomethingEpic()
					renderLock = false
					this.slowSkipNext(msg)
				}, this.raceDelay )
			}
		} else {
			log(` [ ${reason} wait on storage: ${chalk.inverse( this.storage() )}  ] `)
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
			output( chalk.inverse(msg) )
			renderLock = false
			this.slowSkipNext(msg)
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
		if ( reason === undefined) {
			error("must set reason")
			if ( this !== undefined) {
				reason =  status
			} else {
				reason = "not set"
			}
		}
		mode("quit " + reason)
		if (code === undefined) { code = 0 } // dont terminate with 0
		log(`Received quit(${code}) ${reason}`)
		if ( renderLock == true ) {
			output("still rendering") // maybe this happens during graceful shutdown
      if ( code !== 130 ) {
        return false
      }
		}

		if ( this.isStorageBusy ) {
			output("still saving to storage - will exit after save") // maybe this happens during graceful shutdown
		}


		// if ( this.keyboard == true) {
		//   try {
		//     process.stdin.setRawMode(false);
		//     // process.stdin.resume();
		//   } catch(e) {  bugtxt( "Issue with keyboard this.mode: " + e ) }
		// }


		term.eraseDisplayBelow()
		// printRadMessage([ ` ${(killServersOnQuit ?  'AminoSee has shutdown' : ' ' )}`, `${( this.verbose ?  ' Exit code: '+ code : '' )}`,  (killServersOnQuit == false ? server.getServerURL() : ' '), remain ]);
		this.destroyProgress()
		process.exitCode = code
		deleteFile( this.fileTouch ) // removeLocks( this.fileTouch, this.devmode );
		destroyKeyboardUI()
		// if ( this.keyboard && this.gui == false) {
		// 	destroyKeyboardUI()
		// } else {
		// 	output("Not disabling keyboard mode.")
		// }
		if (code == 0) {
			log("CLI mode clean exit.")
			return true
		} else {
			log(chalk.bgWhite.red (`Active process.exit going on. last file: ${ this.dnafile } currently: ${this.busy()} percent complete ${  this.percentComplete}`))
		}

		if (remain > 0 ) {
			output(`There is more work (${remain}) . Rendering: ${this.busy()} Load: ${os.loadavg()}`)
			if ( renderLock ) {
				output("shutdown halted due to rendering")

				return true
			}
		}

		isShuttingDown = true

		if (killServersOnQuit == true) {
			if (webserverEnabled == true) { // control-c kills server
				server.stop()
			}
		} else if (webserverEnabled == true) {
			log("If you get a lot of servers running, use Control-C instead of [Q] to issues a 'killall node' command to kill all of them")
		}
		killAllTimers()
		if (code > 0) {
			setImmediate(() => {
				setTimeout( () => {
					process.stdout.write(`${code} ${reason}`)
					this.args._ = []
					term.processExit(code)
					process.exit()
				}, this.raceDelay)
			})
		}
	}
	processLine(l) { // need to implement the format here: https://rdrr.io/rforge/seqTools/man/countGenomeKmers.html
		if ( renderLock == false ) { error("thread entered process line!")}
		renderLock = true
		streamLineNr++
		status = `Streaming line: ${streamLineNr} ${ maxWidth(64, status) }`
		if ( debounce(500 )) { this.progUpdate( this.percentComplete ) }


		if (this.rawDNA.length < this.termPixels) {
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
			while ( c == "." && c !== "N") { // biff it and get another
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

				if ( brute == true ) {
					for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
						this.focusPeptide = this.pepTable[ p ].Codon
						pixelGamma = this.getGamma( triplet,  this.triplet,	this.focusPeptide  )
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
					this.focusPeptide = this.peptide
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
		} else if ( brute == true || this.isHighlightSet == true) {
			pixelGamma = darkenFactor
		} else {
			pixelGamma = 1
		}
		// if ( debounce(1000) == true ) {
		// 	redoline(`${pixelGamma} ${current} ${triplet} ${this.aminoacid} ${peptide} ${lastHammered}`)
		// }
		return pixelGamma
	}
	renderPixel() {
		if ( this.artistc == true ) { // artistic mode WILL BE MANY PIXELS from that one pixel
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

    if ( debug ) {
      console.log( this.printRGB() )
    }
		// this.rgbArray.push(Math.round( this.red ))
		// this.rgbArray.push(Math.round( this.green ))
		// this.rgbArray.push(Math.round( this.blue ))
		// this.rgbArray.push(Math.round( this.alpha))

		if ( brute == true ) {
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
		let returnedHil, returnedPNG
		let backupHighlight = this.isHighlightSet
		// output(`codons per pixel hilibert: ${this.codonsPerPixelHILBERT}`)
		if (id === undefined || id < 1) { // for the reference image
			this.focusPeptide = "Reference"
			this.isHighlightSet = false
		} else {
			this.focusPeptide = this.pepTable[id].Codon
			this.isHighlightSet = true
		}
		// if ( renderLock == true ) {
		returnedHil  = this.generateFilenameHilbert(  ) // this.isHighlightSet needs to be false for reference
		// } else {
		//   returnedHil = "rendering..."
		// }

		returnedPNG = this.generateFilenamePNG() // this.isHighlightSet needs to be false for reference
		this.focusPeptide = this.peptide
		this.isHighlightSet = backupHighlight
		return [ returnedHil, returnedPNG ]
	}
	getImageType() {
		let t = ""
		t += `_${ this.ratio }`
		this.artistic ? t += "_artistic" : t += "_sci"
		this.reg == true ? t += "_reg" : t += ""  // registration marks
		return t
	}


	htmlTemplate(histogramJson) {
		// let histogramJson;
		if (histogramJson === undefined) {
			histogramJson = this.getRenderObject()
			// ;
		}
		var html = `<!DOCTYPE html>
				<html lang="en">
				<head>
				<meta charset="utf-8"/>
				<head>
				<title>${ this.justNameOfDNA} :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson :: ${ this.currentFile }</title>
				<meta name="description" content="${ siteDescription }">
				<link rel="stylesheet" type="text/css" href="../../public/AminoSee.css">
				<link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
				<link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
				<link href="https://www.funk.co.nz/css/funk2019.css" rel="stylesheet">
				<!-- ////////////////////////////////////////
				${radMessage}
				-->
				<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
				<script>
				(adsbygoogle = window.adsbygoogle || []).push({
					google_ad_client: "ca-pub-0729228399056705",
					enable_page_level_ads: true
				});
				</script>

				<!-- REMOTE LOADED STYLES
				<script src="https://www.funk.co.nz/aminosee/public/three.min.js"></script>
				<script src="https://www.funk.co.nz/aminosee/public/jquery.min.js"></script>
				<script src="https://www.funk.co.nz/aminosee/public/hilbert3D.js"></script>
				<script src="https://www.funk.co.nz/aminosee/public/hilbert2D.js"></script>
				<script src="https://www.funk.co.nz/aminosee/public/WebGL.js"></script>
				<script src="https://www.funk.co.nz/aminosee/public/hammer.min.js"></script>


				-->

				<script async src="../../public/three.min.js"></script>
				<script async src="../../public/jquery.min.js"></script>
				<script async src="../../public/hilbert3D.js"></script>
				<script async src="../../public/hilbert2D.js"></script>
				<script async src="../../public/WebGL.js"></script>
				<script async src="../../public/hammer.min.js"></script>
 				<script async src="../../public/aminosee-gui-web.js"></script>
				<style>
				border: 1px black;
				backround: black;
				padding: 4px;
				</style>
				</head>
				<body class="dark handylinks">
				<!-- Google Tag Manager -->
				<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8JX"
				height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
				<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-P8JX');</script>
				<!-- End Google Tag Manager -->

				<nav style="position: fixed; top: 8px; left: 8px; z-index:9999; background-color: #123456;" class="handylinks">
				    <a href="../../" class="button handylinks">AminoSee Home</a> | <a href="../" class="button">Parent</a>
        </nav>
				<h1>${ this.justNameOfDNA}</h1>
				<h2>AminoSee DNA Render Summary for ${ this.currentFile } ${ this.artistc ? "Artistic" : "Science" } render mode</h2>
				<h3>M${this.dimension}C${this.codonsPerPixel}H${onesigbitTolocale( this.codonsPerPixelHILBERT )}</h3>

<div id="stack_wrapper">
				${( this.test ? " this.test " : this.imageStack( histogramJson ))}
</div>
				<table style="background-color: white; color: black;">
				<thead>
				<tr class="light">
				<th class="light" >Amino Acid</th>
				<th>Hue&#xB0;</th>
				<th>RGB</th>
				<th>Count</th>
				<th>Description</th>
				<th>Hilbert PNG</th>
			<!--	<th>Linear PNG</th> -->
				</tr>
				</thead>
				<tbody>
				`
		// this.pepTable   = [Codon, Description, Hue, Alpha, Histocount]
		for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
			let thePep = this.pepTable[p].Codon
			let theHue = this.pepTable[p].Hue
			let c =      hsvToRgb( theHue / 360, 0.5, 1.0 )
			let richC = hsvToRgb( theHue / 360, 0.95, 0.75 )
			// let imghil = this.aminoFilenameIndex(p)[0] // first elemewnt in array is the hilbert image
			let imghil = this.pepTable[p].hilbert_master
			// let imglin = this.aminoFilenameIndex(p)[1] // second element is linear
			let imglin = this.pepTable[p].linear_master // second element is linear
			if ( thePep == "Reference" ) {  this.pepTable[p].Histocount = this.genomeSize  }
			if ( thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
				html += `<!-- ${thePep} -->`
			} else {
				html += `
						<!--  onmouseover="mover(this)" onmouseout="mout(this)" -->
						<tr class="pepTable" id="row_${p}" style="tr { background-color: yellow; } tr:hover { background-color: rgb(${c}); }" onmouseover="mover(${p})" onmouseout="mout(${p})" onclick="mover(${p})">
						<td style="background-color: white;">${p}. ${ this.pepTable[p].Codon} </td>
						<td style="background-color: rgb(${richC});"><p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${theHue}&#xB0;</p></td>
						<td style="background-color: rgb(${c}); color: black; font-weight: bold; "> <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${c}</p></td>
						<td>${ this.pepTable[p].Histocount.toLocaleString()}</td>
						<td>${ this.pepTable[p].Description}</td>
						<td style="background-color: white; color: black;"><a href="images/${ imghil }" class="button" title="Amino filter: ${ thePep }"><img width="48" height="16" class="blackback" src="images/${ imghil }" alt="${ this.justNameOfDNA } ${ thePep }"></a></td>
						<!-- <td style="background-color: white;"> <a href="images/${ imglin }" class="button" title="Amino filter: ${ thePep }"><img width="48" height="16" class="blackback" src="images/${ imglin }" alt="${ this.justNameOfDNA } ${ thePep }"></a> </td> -->
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

				<a href="#scrollLINEAR" class="button" title"Click To Scroll Down To See LINEAR"><br />
				<img id="oi" width="64" height="64" style="border: 4px black; background: black;" src="images/${ this.pepTable[0].linear_master }">
				1D Linear Map Image
				</a>
				<a href="#scrollHILBERT" class="button" title"Click To Scroll Down To See 2D Hilbert Map"><br />
				<img width="64" height="64" style="border: 4px black background: black;" src="images/${ this.pepTable[0].hilbert_master }">
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
				<p id="description" class="fineprint hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon</p>



				</div>
				</a>
				</div>
				</div>

				<div>`



		html += `</div>

				<br /><br />
				<a name="scrollHILBERT" ></a>



				<a name="scrollLINEAR" ></a>
				<a href="images/${ this.pepTable[0].linear_master }" ><img src="images/${ this.pepTable[0].linear_master  }" width-"99%" height="auto"></a>



				<h2>About Start and Stop Codons</h2>
				<p>The codon AUG is called the START codon as it the first codon in the transcribed mRNA that undergoes translation. AUG is the most common START codon and it codes for the amino acid methionine (Met) in eukaryotes and formyl methionine (fMet) in prokaryotes. During protein synthesis, the tRNA recognizes the START codon AUG with the help of some initiation factors and starts translation of mRNA.

				Some alternative START codons are found in both eukaryotes and prokaryotes. Alternate codons usually code for amino acids other than methionine, but when they act as START codons they code for Met due to the use of a separate initiator tRNA.

				Non-AUG START codons are rarely found in eukaryotic genomes. Apart from the usual Met codon, mammalian cells can also START translation with the amino acid leucine with the help of a leucyl-tRNA decoding the CUG codon. Mitochondrial genomes use AUA and AUU in humans and GUG and UUG in prokaryotes as alternate START codons.

				In prokaryotes, E. coli is found to use AUG 83%, GUG 14%, and UUG 3% as START codons. The lacA and lacI coding this.regions in the E coli lac operon don’t have AUG START codon and instead use UUG and GUG as initiation codons respectively.</p>
				<h2>Linear Projection</h2>
				The following image is in raster order, top left to bottom right:
				<a name="scrollLINEAR" ></a>
				<a href="images/${ this.pepTable[0].linear_master }" ><img src="images/${ this.pepTable[0].linear_master  }" width="99%" height="auto" style="border: 4px black; background: black;" ></a>
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
				`
		return html
	}

	checkLocks(fullPathOfLockFile) { // return TRUE if locked.
		bugtxt("checkLocks RUNNING: " + fullPathOfLockFile)
		if ( this.force == true) {
			bugtxt("Not checking locks - this.force mode enabled.")
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
				log(`histogramJson [ ${histogramJson} ]`)
				runcb(cb)
			}).catch()
	}
	recycleOldImage(pngfile) {
		mode(`RECYCLING ${ this.justNameOfDNA }`)

		recycleHistogram( path.resolve( generateFilenameHistogram() ))
		log("recycled json")

		try {
			// var oldimage = new PNG.load(f);
			output(chalk.inverse("RECYCLING EXISTING LINEAR FILE ") + chalk(" " + this.justNameOfDNA))
			this.rgbArray = decodePNG(pngfile, function () {
				this.isDiskFinHilbert = false
				this.isDiskFinHTML = true
				this.isDiskFinLinear = true
				this.calcHilbertFilenames()
				this.rgbArray = this.data
				// this.saveHilbert( this.hilbertFinished);
				saveDocuments()
			})
		} catch(e) {
			output(`Failure during recycling: ${e} will poll for work`)
			this.isDiskFinHilbert = true
			this.pollForStream("recycle fail")
			return false
		}
	}

	skipExistingFile (fizzle) { // skip the file if TRUE render it if FALSE
		if ( this.force == true && this.currentFile == funknzlabel ) {  return true } // true means to skip render
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
	prepareHilbertArray(cb) {
		this.continueHilbertArray(cb)
	}

	continueHilbertArray(cb) {
		mode("maybe save hilbert "+ this.busy())
		log(`H: ${status}`)
		if ( renderLock == false ) { error("locks should be on during hilbert curve") }

		if ( this.isHilbertPossible  == false ) {
			this.hilbertFinished()
			runcb(cb)
			return false
		}

		if (brute == true) {
			log("Converting 256-bit images to 24-bit image with alpha...")
			for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
				this.pepTable[p].lm_array = Uint8ClampedArray.from( this.pepTable[p].lm_array )
			}
		}

		term.eraseDisplayBelow()
		mode("save hilbert")
		procTitle( `m${ this.dimension } hilbert curve`)

		notQuiet(chalk.bgBlue.yellow( " Getting in touch with my man from 1891...   ॐ    David Hilbert    ॐ    ") )
		bugtxt( this.justNameOfDNA)
		let hilpix = hilbPixels[ this.dimension ]

		this.antiAliasArray = this.resampleByFactor( this.shrinkFactor )

		this.hWidth = Math.sqrt(hilpix)
		this.hHeight  = this.hWidth
		this.hilbertImage = [ ] // wipe the memory
		this.percentComplete = 0
		this.debugFreq = Math.round(hilpix / 100)
		this.progUpdate({ title: "Hilbert Curve", items: remain, syncMode: true })
		for (let i = 0; i < hilpix; i++) {
			if ( i % this.debugFreq == 0) {
				this.percentComplete = i/hilpix
				this.progUpdate( this.percentComplete )
				redoline(`Space filling ${nicePercent( this.percentComplete )} `)
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

			if (brute == true) {
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

		if ( brute ) {
			for ( let p = 0; p < this.pepTable.length; p++ ) { // standard peptide loop
				this.pepTable[p].hilbert_master = this.aminoFilenameIndex(p)[0]
				this.pepTable[p].linear_master = this.aminoFilenameIndex(p)[1]
				this.pepTable[p].hilbert_preview = this.aminoFilenameIndex(p)[0]
				this.pepTable[p].linear_preview = this.aminoFilenameIndex(p)[1]
			}
		}
		log("Done projected 100% of " + hilpix.toLocaleString())
		runcb(cb)

	}




	// resample the large 760px wide linear image into a smaller square hilbert curve
	saveHilbert(cb) {
		if ( !this.isHilbertPossible ) { this.hilbertFinished() ; return false }
		// clearTimeout( updatesTimer)
		this.diskStorm( () => {
			log("disk storm has returned")
		})
		this.calcHilbertFilenames()

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
					that.hilbertFinished()
					runcb(cb)
				})
		}).then( out("Hilbert done") ).catch( out("hb catch") )
	}
	htmlFinished() {
		mode(`HTML done (${this.justNameOfHTML}). Waiting on (${ this.storage()})`)
		this.isDiskFinHTML = true
		this.postRenderPoll( `R: ${status} ` )
	}
	hilbertFinished() {
		mode(`Hilbert curve done (${this.justNameOfHILBERT}). Waiting on (${ this.storage()})`)
		log( `H: ${status} ` )
    if ( remain < 5) {
      this.openOutputs()
    }
		termDrawImage(this.fileHILBERT, "hilbert curve")

		if ( brute ) {
			if ( this.isDiskFinHilbert ) { this.postRenderPoll("brute finished" ) }
		} else {
			this.isDiskFinHilbert = true
			this.postRenderPoll( "hilbertFinished" )
		}
	}

	linearFinished() {
		this.isDiskFinLinear = true
		if ( this.artistic || this.quiet == false ) {
			this.previousImage = this.filePNG
		}
		if ( this.test ) {
			mode(`Calibration linear generation done. Waiting on (${ this.storage()})`)
		} else {
			mode(`DNA linear render done (${this.justNameOfPNG}). Waiting on (${ this.storage()})`)
		}
		log(`Finished ${this.filePNG}`)
		this.postRenderPoll( `R: ${status} ` )
	}

	bothKindsTestPattern( cb ) {
		if (renderLock == false) {
			error("error render lock fail in test patterns")
			return false
		}
		renderLock = true

		let h = require("hilbert-2d")
		let hilpix = hilbPixels[ this.dimension ]
		const testWidth = Math.round(Math.sqrt(hilpix))
		const linearWidth = Math.round(Math.sqrt(hilpix))

		this.hilbertImage = [ hilpix*4 ] // setup arrays
		this.rgbArray = [ hilpix*4 ]
		log( `Generating hilbert curve of the ${ this.dimension + 1 }th dimension with ${remain} remaining.`)
		bugtxt( chalk.bgWhite(`Math.sqrt(hilpix): [${Math.sqrt(hilpix)}])`))
		bugtxt( this.fileHILBERT )

		this.percentComplete = 0
		let d = Math.round(hilpix/100)
		for (let i = 0; i < hilpix; i++) {
			streamLineNr++
			let hilbX, hilbY;
			[hilbX, hilbY] = hilDecode(i, this.dimension, h)
			let cursorLinear  = 4 * i
			let hilbertLinear = 4 * ((hilbX % linearWidth) + (hilbY * linearWidth))
			this.percentComplete =  (i+1) / hilpix
			dot(i, d, " ॐ  " + nicePercent(this.percentComplete))
			this.hilbertImage[hilbertLinear] =   255 * this.percentComplete // slow ramp of  this.red
			this.hilbertImage[hilbertLinear+1] = ( i % Math.round(  this.percentComplete * 32) ) / (  this.percentComplete *32) *  255 // SNAKES! crazy bio snakes.
			this.hilbertImage[hilbertLinear+2] = (  this.percentComplete *2550)%255 // creates 10 segments to show each 10% mark in  this.blue
			this.hilbertImage[hilbertLinear+3] = 255 // slight edge in this.alpha
			if ( this.reg ) {
				this.paintRegMarks(hilbertLinear, this.hilbertImage,  this.percentComplete)
			} else {
				if ( this.focusPeptide == "Opal") {
					this.hilbertImage[hilbertLinear]  = 0 //  this.red
					this.hilbertImage[hilbertLinear+1]  = 0 //  this.green
				} else if ( this.focusPeptide == "Ochre") {
					this.hilbertImage[hilbertLinear+2]  = 0 //  this.blue
					this.hilbertImage[hilbertLinear+1]  = 0 //  this.green
				} else if ( this.focusPeptide == "Methionine") {
					this.hilbertImage[hilbertLinear]  = 0 //  this.red
					this.hilbertImage[hilbertLinear+2]  = 0 //  this.blue
				} else if ( this.focusPeptide == "Arginine") { // PURPLE
					this.hilbertImage[hilbertLinear+1]  = 0 //  this.blue
				}
			}
			this.rgbArray[cursorLinear+0] = this.hilbertImage[hilbertLinear+0]
			this.rgbArray[cursorLinear+1] = this.hilbertImage[hilbertLinear+1]
			this.rgbArray[cursorLinear+2] = this.hilbertImage[hilbertLinear+2]
			this.rgbArray[cursorLinear+3] = this.hilbertImage[hilbertLinear+3]
		}
		notQuiet( `Completed hilbert curve of the ${ this.dimension }th dimension out of: ${remain}`)

		this.setIsDiskBusy( true )
		const hilbertImage = this.hilbertImage
		const rgbArray = this.rgbArray
		// this.saveDocsSync();

		var hilbert_img_data = Uint8ClampedArray.from( hilbertImage )
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
		hilbert_img_png.data = Buffer.from( hilbert_img_data )
		let wstreamHILBERT = fs.createWriteStream( this.fileHILBERT )

		new Promise(resolve => {
			hilbert_img_png.pack()
				.pipe(wstreamHILBERT)
				.on("finish", (err, resolve) => {
					// if (err) { log(`not sure if that saved: ${err}`)}
					// if (resolve) { log(`not sure if that saved: ${err} ${ this.storage()} `) }
					this.hilbertFinished()
				})
		}).then(  ).catch( out("HILBERT catch") )
		// new Promise(resolve =>
		//   hilbert_img_png.pack()
		//   .pipe(wstreamHILBERT)
		//   .on('finish', resolve)
		// );
		var img_data = Uint8ClampedArray.from( rgbArray )
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
		img_png.data = Buffer.from( img_data )
		let wstreamLINEAR = fs.createWriteStream( this.filePNG )
		new Promise(resolve => {
			img_png.pack()
				.pipe(wstreamLINEAR)
				.on("finish", (err, resolve) => {
					// if (err) { log(`not sure if that saved: ${err}`)}
					// if (resolve) { log(`not sure if that saved: ${err} ${ this.storage()} `) }
					// this.isDiskFinHTML = true
					// this.isDiskFinLinear = true;
					this.linearFinished()
					termDrawImage( this.filePNG, "linear curve", cb )
					runcb(cb)
				})
		}).then().catch()



		// new Promise(resolve =>
		//   img_png.pack()
		//   .pipe(wstreamLINEAR)
		//   .on('finish', resolve)
		// );

		// setTimeout( () => {
		//   this.isDiskFinHTML = true;
		//   this.linearFinished();
		//   this.hilbertFinished();
		// }, 4000)
		//




	}
	pixWidHeight() {
		let pix, wid, hite = 0

		try {
			pix = ( this.rgbArray.length / 4)
		}
		catch (err) {
			this.fastReset(`NOT ENOUGH PIXELS ${err}`)
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
			this.fastReset(msg)
			return false
		}
		let a =  [ pix, wid, hite ]
		return a
	}


	savePNG(cb) {
		log("savePNG: " +this.filePNG)
		let width, height = 0
		let pwh = this.pixWidHeight()

		// pixels = pwh[0]
		width  = pwh[1]
		height = pwh[2]

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
		log( stringy )

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

		//
		// genericPNG( this.rgbArray, width, height, this.filePNG , cb)
		// return true

		// error("breakpoint")
		// process.exit()

		img_png.data = Buffer.from(img_data)
		let wstream = fs.createWriteStream( this.filePNG )
		var that = this
		let retProm =  new Promise(() => {
			img_png.pack()
				.pipe(wstream)
				.on("finish", (err) => {
					if (err) { log(`Could not create write stream: ${ that.filePNG } due to ${err}`) }
					bugtxt("linear Save OK " +  that.storage())
					that.linearFinished()
					runcb(cb)
				})
			// resolve();
		}).then().catch()
		return retProm
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
		// return false
		mode("open files " + this.justNameOfPNG)
		log( blueWhite(  status ) )
		// output(  status );
		if ( isShuttingDown ) { output("Shutting down..."); return false }
		if ( this.currentFile == funknzlabel ) { return false }
		if ( this.devmode == true )  { log( this.renderObjToString() ) }
		if ( this.test == true && this.quiet == true) {
			return false
			// this.openOutputs()
		}
		log( closeBrowser ) // tell user process maybe blocked
		log(" this.openHtml, this.openImage, this.openFileExplorer ", this.openHtml, this.openImage, this.openFileExplorer )
		if ( this.openFileExplorer == true) {
			opensFile++

			log(`Opening render output folder in File Manager ${ opensFile }th time ${ this.outputPath }`)
			// bgOpen()
			open(this.outputPath, () => {
				log("file manager closed")
			}).catch(function () { log(`open(${ this.outputPath })`) })
		}


		if ( this.openHtml == true) {
			mode(`Opening ${ this.justNameOfHTML} DNA render summary HTML report.`)
			notQuiet( status )
			opensHtml++
			projectprefs.aminosee.opens++ // increment open counter.
			// open( server.getServerURL( this.justNameOfDNA), { wait: false } );
			if (openLocalHtml == true) {
				open( this.fileHTML, {app: this.browser, wait: false}).then(() => {
					log("browser closed")
				}).catch(function (err) {
					this.openError(err)
				})
			} else {
				// url + "/" + this.justNameOfDNA + "/"
				open(				this.currentURL , {app: this.browser, wait: false}).then(() => {
					log("browser closed")
				}).catch(function (err) {
					this.openError(err)
				})
			}
		} else {
			log("Not opening HTML")
		}
		if ( this.openImage == true ) {
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
			log(`values of this.openHtml ${ this.openHtml }   this.openImage ${ this.openImage}`)
		}
		if (  opensFile  > 2) { // notice the s
		  log("no more windows")
		  this.openFileExplorer = false
		  return false
		}
		if (  opensImage > 2) {
		  log("no more windows")
		  this.openImage = false
		  return false
		}
		if (  opensHtml > 2) {
		  log("no more windows")
		  this.openHtml = false
		  return false
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
		let dir2make
		let ret = true

		if ( relative === undefined || relative == "/") {
			relative = "output"
			// dir2make = path.resolve( this.outputPath ) // just make the output folder itself if not present
			dir2make = webroot // just make the output folder itself if not present
		} else {
		  dir2make = path.join( webroot, relative )
		}
		log(webroot + " creating folder: "+ dir2make)

		if ( doesFolderExist(this.outputPath) == false ) {
			try {
				fs.mkdirSync(this.outputPath, function (err, result) {
					if (result) { log(`Success: ${result}`) }
					if (err) { log(`Could not create output folder: ${relative} ${err}`) }
				})
			} catch(e) {
				bugtxt(`Error creating folder: ${e} at location: ${dir2make}`)
				// error(`Quiting due to lack of permissions in this directory [${ this.outputPath }] `);
			}
		}
		if ( doesFolderExist(dir2make) == false ) {
			log(`Creating fresh directory: ${dir2make}`)
			try {
				fs.mkdirSync(dir2make, function (err, result) {
					if (result) { log(`Success: ${result}`) }
					if (err) {  error(`Fail: ${err}`) }
					runcb(cb)
				})
			} catch(e) { bugtxt(`${e} This is normal`); runcb(cb) }
		} else {
			log(`Directory ${ relative } already exists - This is normal.`)
			runcb(cb)
			// ret =  false;
		}
		return ret
	}

	generateTestPatterns(cb) {
		// renderLock = true
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

		if ( this.args.ratio || this.args.r) {
			log("Looks better with --ratio=square in my humble opinion")
		} else {
			this.ratio = "sqr"
		}

		output("output test patterns to /calibration/ folder. dnafile: " + this.dnafile )
		this.mkdir()
		this.mkdir( "calibration")
		// if ( remain < 0 ) {
		// 	reason = `calibration ${remain} `
		// 	runcb(cb)
		// 	this.quit(0, reason)
		// 	return false
		// }
		if ( this.dimension > 10 ) { log("I think this will crash node, only one way to find out!") }
		output(`TEST PATTERNS GENERATION    m${ this.dimension} c${ this.codonsPerPixel }`)
		log("Use -m to try different dimensions. -m 9 requires 1.8 GB RAM")
		log("Use --no-reg to remove registration marks at 0%, 25%, 50%, 75%, 100%. It looks a little cleaner without them ")
		bugtxt(`pix      ${hilbPixels[ this.dimension]} `)

		if ( cb !== undefined ) {
			this.runCycle(cb) // runs in a callback loop
		} else {
			this.runCycle() // runs in a callback loop
		}
	}
	runCycle(cb) {

		if (renderLock == false) {
			error(`Thread re-entered runCycle ${loopCounter}`)
			runcb( cb )
			return false
		}
		remain--
		loopCounter++
		this.testInit ( loopCounter ) // will enable locks

		if ( loopCounter > batchSize || isShuttingDown || remain < 1 ) {
			this.testStop()
			runcb( cb )
			// this.quit(1, "test complete")
			return false
		}

		output( blueWhite(`Test cycle ${loopCounter}   ${batchProgress()} remain`))
		if ( loopCounter > 9 ) {
			output(  chalk.italic("Normally this level of nested curves will crash the node callstack!!!" ) )
		}


		this.setIsDiskBusy( true )
		// both kinds is currently making it's own calls to postRenderPoll
		this.bothKindsTestPattern((cb) => { // renderLock must be true
			log(`test patterns returned ${this.storage()}`)
			// this.openOutputs()
			this.setIsDiskBusy( false )
			this.postRenderPoll("test patterns returned")
		    renderLock = false
		    			this.testStop()

		    runcb( cb )
		}) // <<--------- sets up both linear and hilbert arrays but only saves the Hilbert.
		// this.updates = false
		// this.drawHistogram()
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
		this.percentComplete = 1
		this.genomeSize = 0
		this.baseChars = 0
		this.charClock = -1 // gets around zero length check
		// this.pixelClock = -1; // gets around zero length check
		// this.quit(0, 'test stop');
		this.isShuttingDown = true
		killAllTimers()
		this.destroyProgress()
		destroyKeyboardUI()
	}
	testInit ( magnitude ) {
		magnitude--
		renderLock = true

		let testPath = path.resolve(webroot , "calibration")
		let regmarks = this.getRegmarks()
		let highlight = ""

		this.isHilbertPossible = true
		this.report = false
		this.errorClock = streamLineNr =  0
		this.percentComplete = 0.0001
		this.runningDuration = 1
		this.focusTriplet = "Reference"
		this.ratio = "sqr"
		this.dimension = remain = magnitude

		// NON INDEPENDANT VARS. THESE ARE STAND-INS FOR A WAY TO FILTER THE IMAGE BY RED / GREEN / BLUE
		// IN THIS CASE HAS NOTHING TO DO WITH PEPTIDES :)
		if ( this.focusPeptide == "Opal" || this.focusPeptide == "Blue") {
			highlight += "_BlueAt10Percent"
		} else if ( this.focusPeptide == "Ochre" || this.focusPeptide == "Red") {
			highlight += "_RedRamp"
		} else if ( this.focusPeptide == "Methionine" || this.focusPeptide == "Green") {
			highlight += "_GreenPowersTwo"
		} else if ( this.focusPeptide == "Arginine" || this.focusPeptide == "Purple") {
			highlight += "_Purple"
		}
		// TEST INIT
		this.justNameOfDNA = `AminoSee_Calibration${ highlight }${ regmarks }`
		this.justNameOfPNG = `${ this.justNameOfDNA}_LINEAR_${  magnitude }.png`
		this.justNameOfHILBERT = `${ this.justNameOfDNA}_HILBERT_${  magnitude }.png`
		this.fileHTML    = path.resolve(testPath, this.justNameOfDNA + ".html")
		this.filePNG     = path.resolve(testPath, this.justNameOfPNG)
		this.fileHILBERT = path.resolve(testPath, this.justNameOfHILBERT)
		this.fileTouch   = path.resolve(testPath, this.justNameOfDNA + "_LOCK.txt")
		this.dnafile = this.justNameOfDNA

		this.currentFile = this.justNameOfDNA
		cfile = this.currentFile

		this.baseChars = hilbPixels[  magnitude ]
		this.maxpix = hilbPixels[defaultMagnitude]
		this.genomeSize =  this.baseChars
		this.estimatedPixels =  this.baseChars
		this.charClock =  this.baseChars
		this.pixelClock =  this.baseChars
		remain = batchSize -  magnitude
		output(`magnitude ${magnitude} remain ${remain} batchSize ${batchSize}`)
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
		if (gears === undefined) { gears = this.debugGears } else { this.debugGears = gears} // wow that is one line
		return this.estimatedPixels / (( this.codonsPerSec + 1) * gears) // numbers get bigger on fast machines.
	}


	// this will destroy the main array by first upsampling then down sampling
	resampleByFactor( shrinkX ) {
		let sampleClock = 0
		let brightness = 1/ shrinkX
		let downsampleSize = hilbPixels[ this.dimension ] // 2X over sampling high grade y'all!
		let antiAliasArray = [ downsampleSize  * 4 ] // RGBA needs 4 cells per pixel
		log(`Resampling linear image of size in pixels ${this.pixelClock.toLocaleString()} by the factor ${ twosigbitsTolocale( shrinkX)}X brightness per amino acid ${brightness} destination hilbert curve pixels ${downsampleSize.toLocaleString()} `)
		this.debugFreq = Math.round(downsampleSize/100)
		// SHRINK LINEAR IMAGE:
		this.progUpdate({ title: "Resample by X" + shrinkX, items: remain, syncMode: true })
		for (let z = 0; z<downsampleSize; z++) { // 2x AA this.pixelClock is the number of pixels in linear
			if ( z % this.debugFreq == 0) {
				this.percentComplete = z / downsampleSize
				this.progUpdate(   this.percentComplete  )
				redoline(  this.percentComplete )
			}
			let sum = z*4
			let clk = sampleClock*4 // starts on 0
			antiAliasArray[sum+0] = this.rgbArray[clk+0]*brightness
			antiAliasArray[sum+1] = this.rgbArray[clk+1]*brightness
			antiAliasArray[sum+2] = this.rgbArray[clk+2]*brightness
			antiAliasArray[sum+3] = this.rgbArray[clk+3]*brightness
			// this.dot(z, this.debugFreq, `z: ${z.toLocaleString()}/${downsampleSize.toLocaleString()} samples remain: ${( this.pixelClock - sampleClock).toLocaleString()}`);
			while(sampleClock  < z* shrinkX) {
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
		if (txt === undefined || this.quiet == true) { return false}
		term.eraseDisplayBelow
		redoline(txt)
		if ( this.updates == true && renderLock == true) {
			term.right( this.termMarginLeft )
		}
		process.stdout.write(`[${txt}] `)
	}


	clout(txt) {
		if (txt === undefined) {
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

		if ( brute == true ) {
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
		if (array === undefined) {
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
		if (this.isStorageBusy == true) { // render just finished so make percent 100% etc
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
		if ( this.progress ) {
			this.progUpdate( this.percentComplete )
		}
		wTitle(msg)
		return msg
	}

	getHistoCount(item, index) {
		return [ item.Codon, item.Histocount]
	}
	formatMs(date) { // nice ms output
		return  deresSeconds(date.getTime()) -  this.now.getTime()
	}


	drawProgress() {
		this.fastUpdate()
		progato.update(  this.percentComplete )
		if (remain >= 0 ) {
			clearTimeout( this.progTimer)
			this.progTimer = setTimeout(() => {
				if (  this.percentComplete < 0.99 &&  this.timeRemain > 2001) {
					this.drawProgress()
				} else {
					progato.stop()
				}
			}, progressTime)
		}
	}



	drawHistogram() {
		// return
		if ( isShuttingDown == true ) { output("closing...press U to update or Q to quit"); return }
    if ( this.test || this.demo ) { log("test or demo"); return }
		if ( renderLock == false ) {
			output( blueWhite( "surprise!"))
			this.rawDNA = "!"
      // setTimeout( () => {
      //   this.runCycle()
      // }, this.raceDelay*2)
			return false
		}
		if ( this.updatesTimer) { clearTimeout( this.updatesTimer )}


		if ( remain >= 0 ) { // dont update if not rendering / during shutdown
			if ( this.msPerUpdate  <  this.maxMsPerUpdate ) {
				this.msPerUpdate  += 50 // this.updates will slow over time on big jobs
				if (this.devmode == true) {
					this.msPerUpdate  += 100 // this.updates will slow over time on big jobs
					if (debug == true) {
						this.msPerUpdate  += 100
					}
				}
			}
			this.updatesTimer = setTimeout(() => {
				if ( isShuttingDown ) {
					output("Shutting down")
				} else {
					this.drawHistogram() // MAKE THE HISTOGRAM AGAIN LATER
					// out("draw")
					// log("drawing again if rendering in " +  this.msPerUpdate )
				}
			},  this.msPerUpdate )
		} else { log("update finished") }

		this.fastUpdate()
		this.progUpdate( this.percentComplete )

		if ( this.updates == false ) {
			redoline(`${blueWhite( nicePercent(this.percentComplete) )} elapsed: `  + blueWhite(`${ fixedWidth(10, humanizeDuration( this.msElapsed )) }         ${humanizeDuration( this.timeRemain)} remain ${ chalk.bold( this.justNameOfPNG )}`))
			return false
		}
		tups++
		if ( tups <= 2 ) { return }
		let aacdata = []
		let text = this.calcUpdate()
		this.colDebug = this.setDebugCols() // Math.round(term.width / 3);
		// termSize()
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
			`  RunID: ${chalk.rgb(128, 0, 0).bold( this.timestamp )} acids per pixel: ${ twosigbitsTolocale( this.codonsPerPixel )}   Term x,y: (${tx},${ty}) ${chalk.inverse( this.highlightOrNothin())} ${this.peptide} ${status}`
		]
		clearCheck()
		if ( this.fullscreen == true ) {
			term.moveTo(1 + this.termMarginLeft,1)
		}
		if ( this.dnabg == true ) {
			this.rawDNA = this.rawDNA.substring(0, termPixels)
			output(chalk.inverse.grey.bgBlack( this.rawDNA) )
			term.moveTo(1 + this.termMarginLeft,1)

			output(`     To disable real-time DNA background use any of --no-dnabg --no-updates --quiet -q  (${tx},${ty})`)
		}
		this.rawDNA = funknzlabel

		if ( this.fullscreen == true) {
			term.moveTo(1 + this.termMarginLeft,1)
		}
		term.up( termDisplayHeight)

		printRadMessage(array)
		output(`${chalk.rgb(128, 255, 128)( nicePercent(this.percentComplete) )} elapsed: ${ fixedWidth(12, humanizeDuration( this.msElapsed )) }  /  ${humanizeDuration( this.timeRemain)} remain`)
		output(`${ twosigbitsTolocale( gbprocessed )} GB All time total on ${chalk.yellow( hostname )} ${ cliruns.toLocaleString()} jobs run total`)
		// this.progUpdate( this.percentComplete )
		output(`Report URL:  ${chalk.underline(  blueWhite( maxWidth(tx - 16, this.currentURL )))}`)
		output(`Input file:  ${chalk.underline(  blueWhite( path.normalize( this.dnafile )))}`)
		output(`Output path: ${chalk.underline(  blueWhite( path.join( this.outputPath, this.justNameOfDNA)))}`)
		output( this.printRGB() )
		term.right( this.termMarginLeft )
		term.eraseDisplayBelow()

		if (term.height - 32  >   termHistoHeight  +  termDisplayHeight && tx - 8 > wideScreen) {
			if ( this.fullscreen == true ) { output( this.blurb() ) }
			output()
			if (this.keyboard) {
				output(interactiveKeysGuide)
			}
			output( histogram(aacdata, { bar: "/", width: this.colDebug*2, sort: true, map: aacdata.Histocount} ))
			output()
			if ( brute == true ) {
				output( `${  this.rgbArray.length  } this.pepTable[5].lm_array.length: ${this.pepTable[5].lm_array.length} ` )
			}
			term.up(  termHistoHeight )
		} else {
			output(chalk.bold.italic(" Increase the size of your terminal for realtime histogram."))
			output(`   Genome size: ${ this.genomeSize.toLocaleString()}`)
			if ( this.quiet == false && this.clear == true ) {
				term.up(  2 )
			}


		}

	}
  printRGB() {
    return `Last Acid: ${ chalk.inverse.rgb(
			ceiling( this.red ),
			ceiling( this.green ),
			ceiling( this.blue )).bgWhite.bold( fixedWidth(16, "  " + this.aminoacid + "   ") )
		} Last pixel: ` + chalk.bold(
			chalk.rgb(this.peakRed, 0, 0).inverse.bgBlue(  fixedWidth(7, `R:  ${this.peakRed}` )) +
				chalk.rgb(0, this.peakGreen, 0).inverse.bgRed( fixedWidth(10, `G:  ${this.peakGreen}` )) +
				chalk.rgb(0, 0, this.peakBlue).inverse.bgYellow(fixedWidth(8, `B:  ${this.peakBlue}` )) +
				chalk.rgb(this.peakAlpha, this.peakAlpha, this.peakAlpha).inverse.bgBlue(maxWidth(8, `A:  ${this.peakAlpha}` )))
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
	highlightOrNothin() { // no highlight, no return!
		this.focusPeptide = this.peptide
		return ( cliInstance.isHighlightSet ?  cliInstance.peptideOrNothing() + cliInstance.tripletOrNothing()  : "" )
		// return ( this.isHighlightSet ?  this.peptideOrNothing() + this.tripletOrNothing()  : "" )
	}
	peptideOrNothing() {
		return ( this.focusPeptide == "Reference" ? "" : this.focusPeptide )
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
		// return p.Codon == this.focusPeptide || p.Codon == this.triplet;
		return pep.Codon.toLowerCase() == this.focusPeptide.toLowerCase()
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
		return pep.Codon == this.focusPeptide
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
		return 120
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

				if ( this.isHighlightSet ) {
					if (this.aminoacid == this.focusPeptide ) {
						this.alpha = 255
					} else {
						this.alpha = 16 // non highlight alpha makes them almost fully translucent
					}
				} else {
					this.alpha = 255 // only custom this.focusPeptide pngs are transparent
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


	imageStack(histogramJson) {
		mode("imageStack")
		let html = " "
		// let summary = histogramJson.summary
		let pepTable = histogramJson.pepTable
		// output(beautify(summary))

		html += `<ul id="stackOimages">
				`
		for ( let p = 0; p < pepTable.length; p++ ) { // standard peptide loop
			let item = pepTable[p]
			let thePep = item.Codon
			let theHue = item.Hue
			let c =      hsvToRgb( theHue/360, 0.5, 1.0 )
			let z =      item.z
			let name =   item.name
			let proportion = (p / pepTable.length) - 0.5
			let style =  `
			position: absolute;
      top:  50%;
      left: 50%;
      transform: translate(
       calc(var(--mouse-y, 0) * ${proportion * 100}%),
       calc(var(--mouse-x, 0) * ${proportion * 100}%));
      border: 1px dashed hsv(${theHue/360}, 0.5, 1.0);
      z-index: ${p+1};
`
  			// style = "border: 1px dashed blue;"
			// let linear_master =    item.linear_master;
			// let hilbert_master =    item.hilbert_master;
			// let linear_preview =    item.linear_master;
			// let hilbert_preview =    item.hilbert_master;
			let src = pepTable[p].hilbert_master
			// this.pepTable[p].hilbert_master = this.aminoFilenameIndex(p)[0]
			// this.pepTable[p].linear_master = this.aminoFilenameIndex(p)[1]
			// this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[0];
			// this.pepTable[ p ].linear_preview = this.aminoFilenameIndex( p )[1];

			// let zoom = 3
			// bugtxt( src );
			// html +=  ". ";
			if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
				html += `<!-- ${thePep.Codon}  width="20%" height="20%" -->`
			} else {
				html += `
						<li class="stack" id="stack_${p}" style="${style}">
						{${p}} <a href="images/${src}" title="${name} ${thePep}">${thePep} <br/>
						<img src="images/${src}" alt="${name} ${thePep}" title="${name}" onmouseover="mover(${p})" onmouseout="mout(${p})"></a>
						</li>
						`
			}
		}

		// histogramJson.pepTable.forEach(function(item) {
		//   // log(item.toString());
		//   let thePep = item.Codon
		//   let theHue = item.Hue
		//   let c =      hsvToRgb( theHue/360, 0.5, 1.0 )
		//   let z =      item.z
		//   let i =      item.index + 1
		//   let name =   item.name
		//   let linear_master =    item.linear_master
		//   let hilbert_master =    item.hilbert_master
		//   let linear_preview =    item.linear_master
		//   let hilbert_preview =    item.hilbert_master
		//   let src = hilbert_master
		//   // this.pepTable[ p ].hilbert_master = this.aminoFilenameIndex( p )[0];
		//   // this.pepTable[ p ].linear_master = this.aminoFilenameIndex( p )[1];
		//   // this.pepTable[ p ].hilbert_preview = this.aminoFilenameIndex( p )[0];
		//   // this.pepTable[ p ].linear_preview = this.aminoFilenameIndex( p )[1];
		//
		//   let vector = i - (quant/2)
		//   let zoom = 3
		//   // bugtxt( src );
		//   html +=  i +". "
		//   if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
		//     html += `<!-- ${thePep.Codon} -->`
		//   } else {
		//     html += `
		//     <li>${i} <a href="images/${src}" title="${name} ${thePep}">${thePep} <br/>
		//     <img src="images/${src}" id="stack_${i}" width="20%" height="20%" style="z-index: ${i}; position: fixed; z-index: ${i}; top: 50%; left: 50%; transform: translate(${(i*zoom)-100}px,${(i*zoom)-100}px)" alt="${name} ${thePep}" title="${name} ${thePep}" onmouseover="mover(${i})" onmouseout="mout(${i})"></a></li>
		//     `
		//   }
		// })
		html += "</ul> <!-- END stackOimages MA man -->"
		return html
	}
} // <<< --- END OF CLASS

function bugtxt(txt) { // full debug output
	// if (this !== undefined) {
	// 	if (this.quiet == false && debug == true && this.devmode == true && this.verbose == true)  {
	// 		bugout(txt)
	// 	} else {
	// 		if (this.verbose == true ) {
	// 			redoline(txt)
	// 		}
	// 	}
	// } else

	// if (cliInstance !== undefined) {
		if (cliInstance.quiet == false && cliInstance.debug == true && cliInstance.devmode == true && cliInstance.verbose == true)  {
			bugout(txt)
		} else {
			if (cliInstance.verbose == true ) {
				// redoline(txt);
			}
		}
	// } else if (debug == true){
		// log(`bugout: ${txt}`)
	// } else {
		// redoline(txt)
	// }

}
function output(txt) {
	if (typeof txt == "undefined") { txt = " "} else {
		if ( cliInstance ) {
			if ( typeof cliInstance.justNameOfPNG == "undefined" ) {
				wTitle(`${  txt }`) // put it on the terminal windowbar or in tmux
			}
		}
	}
	term.eraseLine()
	if ( debug ) {
		bugout( txt )
	} else {
		console.log( txt )
	}
	term.eraseLine()
}
function out(txt) {
	// let that = gimmeDat();
	// if ( that.quiet == false || debug ) {
	// term.column(1)
	if (debug ) {
		process.stdout.write(chalk.blue(" [ ") + removeNonAscii( txt ) + chalk.blue(" ] "))
	} else {
		process.stdout.write(".")
		// redoline(chalk.bold(`   [ `)  + chalk.rgb(64,80,100).inverse( fixedWidth( 50, removeNonAscii(txt)))  + chalk.bold(` ]`  ));
	}
}
function debounce( ms ) {
	if ( ms === undefined ) { ms = 150 } // half second
	let d = new Date().getTime()
	if ( d + ms > lastHammered ) {
		lastHammered = d + ms*2
		return true
	}
	return false
}
function log(txt  ) {
	if ( debug || typeof cliInstance !== "undefined") {
    if (cliInstance) {
      if (cliInstance.verbose && cliInstance.quiet == false) {
        output( `${helixEmoji}: ${txt} `)
      } else {
    	wTitle(`${ txt  }`)
      }
    }
  }
}
function batchProgress() {
	return `[${threads.length}] ${remain}/${batchSize}:${streamLineNr}`
}
function wTitle(txt) {
	if ( !debounce() ) {
		return false
	}
	if (typeof this == "undefined") {
		txt = hostname
	}

	txt = `${batchProgress()} | ${ removeNonAscii(  maxWidth( 48, txt ))} @${hostname} ` + ( isShuttingDown ? " SHUTTING DOWN " : " " )// + new Date()

	if (typeof cliInstance !== "undefined") {
			cliInstance.progUpdate( this.percentComplete )
			txt += `${cliInstance.justNameOfPNG} ${new Date().getTime()}`

	}
	term.windowTitle(helixEmoji +  txt )
}
function bugout(txt) {
	if (typeof txt == "undefined") { return  }
	let splitScreen = ""
	if (typeof cliInstance !== "undefined" ) {
		let colWidth = Math.round(tx / 3) - 1
		if (cliInstance.test == true) {
			splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( colWidth - 10,  `[Test: ${remain} ${ nicePercent(cliInstance.percentComplete) } Highlt${( cliInstance.isHighlightSet ? cliInstance.focusPeptide + " " : " ")} >>>    `))
		} else {
			splitScreen += chalk.rgb(64,64,64).inverse( fixedWidth( colWidth - 10,  `[ ${batchProgress()} ${new Date().getTime()} ${ status } ${ nicePercent(cliInstance.percentComplete) } ] >>>   `))
		}
		splitScreen += fixedWidth( colWidth*2,` ${ removeNonAscii( txt)} `)
	} else {
		splitScreen += txt
	}
	term.eraseLine()
	console.log(splitScreen)
}
function deleteFile(file) {
	let ret = false
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
	cliInstance.termPixels = termPixels
	return [ tx, ty]
}
function destroyKeyboardUI() {
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
function onesigbitTolocale(num) {
	return (Math.round(num*10)/10).toLocaleString()
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
	if ( str === undefined) { return "0" }
	if (str) {
		if (str.length > wide) { str = str.substring(0,wide) }
	}
	return str
}
function minWidth(wide, str) { // make it wider
	if ( str === undefined) { str = " ~@~ " + wide}
	while(str.length < wide) { 	str = str  +  " " }
	return str
}
function minWidthRight(wide, str) { // make it wider
	if ( str === undefined) { return " " }
	while(str.length < wide) { str += " ~ " }
	return str
}
function blueWhite(txt) {
	return chalk.rgb(0,0,100).bgWhite.inverse.bold( maxWidth( tx * 0.7,  txt))
}
function spaceTo_(str) {
	// log(str);
	if (str === undefined) {
		return ""
	} else {
		str += ""
		while(str.indexOf(" ") > -1) { str = str.replace(" ", "_") }
		return str
	}
}


function runDemo() {
	var that = cliInstance
	// async.parallel( [
	async.waterfall( [
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

      // }, this.raceDelay )

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
function setupPrefs() {
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
	return [ userprefs, projectprefs ]
}
function logo() {
	return `${helixEmoji + chalk.rgb(255, 255, 255).inverse(" Amino")}${chalk.rgb(196,196,196).inverse("See")}${chalk.rgb(128,128,128).inverse("No")}${chalk.grey.inverse("Evil ") }  v${blueWhite(chalk.rgb(255,255,0)(version))} AminoSee DNA Viewer`
	// process.stdout.write(`v${chalk.rgb(255,255,0).bgBlue(version)}`);
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
function hsvToRgb(h, s, v) {
	var r, g, b

	var i = Math.floor(h * 6)
	var f = h * 6 - i
	var p = v * (1 - s)
	var q = v * (1 - f * s)
	var t = v * (1 - (1 - f) * s)

	switch (i % 6) {
	case 0: r = v, g = t, b = p; break
	case 1: r = q, g = v, b = p; break
	case 2: r = p, g = v, b = t; break
	case 3: r = p, g = q, b = v; break
	case 4: r = t, g = p, b = v; break
	case 5: r = v, g = p, b = q; break
	}

	return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ]
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
	return path.basename(f)
	// if (f === undefined) { f = "was_not_set";  console.warn(f); }
	// return f.replace(/^.*[\\\/]/, '');
}



function fileSystemChecks(file) { // make sure file is writable or folder exists etc
	let problem = false
	let name = basename( path.resolve(file))
	let msg = `Stats for file ${name}` + lineBreak
	if (file === undefined) { return false }
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
	// runcb(cb)
	// return false
	if (text == "") { return }
	let msg =  chalk.rgb(100,140,180)( "@ " + text + humanizeDuration ( deresSeconds(timeMs)))
	if ( this.quiet ) {
		log(msg)
	} else {
		redoline(msg)
	}
	if ( timeMs > 0 ) {
		cliInstance.progTimer = setTimeout(() => {
			if ( typeof cb !== "undefined" ) {
				countdown(text, timeMs - 500, cb)
			} else {
				countdown(text, timeMs - 500)
			}
		},  500 )
	} else {
		runcb(cb)
	}
}
function mode(txt) { // good for debugging
	wTitle(txt)
	var that = gimmeDat()
	status = txt
	if ( debug ) {
		// redoline(txt);
		console.log(txt)
	} else if (that.quiet == false){
		log(`@${txt}`)
	}
}
function gimmeDat() {
	let that
	if ( cliInstance !== undefined) {  that = cliInstance }
	if ( this !== undefined)        {  that = this }
	if ( that === undefined)        {  that = false }
	return that
}
function redoline(txt) {
	term.eraseLine()
	// output(maxWidth( term.width - 2, txt));
	// output(` [ ${ maxWidth( tx / 2, removeNonAscii( txt ))} ] `)
	console.log(` [ ${ maxWidth( tx / 2,  txt )} ] `)
	term.up( 1 )
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
	if ( file === undefined) { return false }
	if ( file.charAt(0) == "-") {
		log(`cant use files that begin with a dash - ${ file }`)
		return false
	} else { return true }
}
function bgOpen(file, options, callback) {
	if ( file === undefined) { error("file must be supplied") }
	if ( options === undefined) { let options = { wait: false } }
	if ( callback === undefined) { open( file, options )  } else {
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
//       runcb(cb)
//       if ( err ) { log("Error: " + err)}
//     })
//   }).then( log('PNG2 then') ).catch( log('PNG2 catch') );
// }
process.on("SIGTERM", () => {
	let sig = "SIGTERM"
	output(`${batchProgress()} Received ${sig} signal`)
  if ( remain > 0 || streamLineNr > 0 ) {
    destroyKeyboardUI()
  } else {
    output(`ignoring but unlocking keyboard ${batchProgress()}`)
  }

	// cliInstance.gracefulQuit(130, sig)
	// cliInstance.destroyProgress();
	// process.exitCode = 130;
	// cliInstance.quit(130, "SIGTERM");
	// process.exit() // this.now the "exit" event will fire
})
process.on("SIGINT", function() {
	let sig = "SIGINT"
	output(`Received ${sig} signal`)
	// cliInstance.destroyProgress()
	cliInstance.gracefulQuit(130, sig)
	process.exitCode = 130
	// cliInstance.quit(130, "SIGINT")
	setTimeout( () => {
		process.exit() // this.now the "exit" event will fire
	}, cliInstance.raceDelay )
})
function termDrawImage(fullpath, reason, cb) {
	// return true
	if ( this.quiet || !this.openImage ) { log("not opening"); return false }
	if (fullpath === undefined) { fullpath = previousImage }
	if (fullpath === undefined) { log("not opening"); return false }
	if (reason === undefined) { reason = "BUG. Reminder: always set a reason" }
	// if ( that.force == true) { return false }
	if ( quiet == true ) { out("quiet"); return false }
	// term.saveCursor()
	// clearCheck();
	// output(chalk.inverse("Terminal image: " +  basename(fullpath)))
	// setTimeout( () => {
		output("Loading image: " +   path.normalize( fullpath ))
		term.drawImage( fullpath, { shrink: { width: tx * 0.8,  height: ty  * 0.8 } }, () => {
			// term.drawImage( fullpath, { shrink: { width: tx * 0.8,  height: ty  * 0.8, left: tx/2, top: ty/2 } }, () => {
			output(`Terminal image: ${ chalk.inverse(  basename(fullpath) ) } ${ reason}`)
			// term.restoreCursor();
			runcb(cb)
		})
	// },  1)
	// }, 10000 )


}
function nicePercent(percent) {
	if (percent === undefined) { percent = cliInstance.percentComplete; log("% was undef") }
	return minWidth(4, (Math.round(  percent*1000) / 10)) + "%"
}
function tidyPeptideName(str) { // give it "OPAL" it gives "Opal". GIVE it aspartic_ACID or "gluTAMic acid". also it gives "Reference"
	if (str === undefined) {
		log(`no str was set: ${str} will return "Reference"`)
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
	if ( this.clear == true) {
		term.clear()
		term.eraseDisplayBelow()
	} else {
		term.eraseDisplayBelow()
		process.stdout.write("[nc] "+ status)
	}
}
function stopWork(reason) {
	if (reason === undefined) { error("You have to give a reason") }
	cliInstance.gracefulQuit(0, reason)
}
function locateWebroot( filename ) {

	if ( filename === undefined ) {
		filename = __filename //path.resolve( __dirname) // check executable dir
		log("Found alongside executable: " + filename)
	} else {
		log( blueWhite(`using: ${filename}`))
	}
	// output( blueWhite("ATTEMPTING TO CAUSE EXCEPTIPON"))
	// if ( process ) {
	// 	try {
	// 		if ( process.cwd() ){
	// 			output( blueWhite("ok"))
	//
	// 		}
	// 	} catch( err ) {
	// 		output( blueWhite("not so much ok"))
	// 	}
	// }
	// output(  )
	// return


	let clusterRender = false

	log(`If the following paths contain a directory named ${obviousFoldername} they will be used for output:`)

	webroot =  path.resolve( path.dirname( filename ), obviousFoldername) // support drag and drop in the GUI

	if (doesFolderExist(webroot)) { // support drag and drop in the GUI
		clusterRender = true
	} else {
		webroot = path.resolve( process.cwd(), obviousFoldername) // support current working directory at CLI terminal
	}
	if (!clusterRender && doesFolderExist( webroot )) {
		clusterRender = true
	}
	if (!clusterRender && !doesFolderExist( webroot )) {
		webroot = path.resolve( os.homedir(), obviousFoldername ) // ~/AminoSee_webroot
	}

	if (clusterRender == true) {
		log( shiznit( batchProgress() + "   🚄 CLUSTER FOLDER ENABLED   ") )
		log( blueWhite( path.normalize( webroot )))
		log("Enabled by the prseence of a /output/ or /AminoSee_webroot/ folder in *current* dir. If not present, local users homedir ~/AminoSee_webroot")
	} else {
		log(`HOME FOLDER ENABLED: ${ blueWhite( path.normalize( webroot ))} for ${ path.normalize( filename )}`)
	}
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
const blackPoint = 64
function expand( red, green, blue, alpha) {
	let max = Math.min( red, green, blue ) // find brightest channel

	let min = Math.min( red, green, blue ) // find brightest channel
	if ( min > blackPoint ) {
		let scaleBlack = blackPoint / min
		if ( red == min ) {
			red = blackPoint
			if ( green == max) {
				blue *= scaleBlack / 2
			} else {
				green *= scaleBlack / 2
			}
		} else if ( green == min) {
			green = blackPoint
			if ( red == max) {
				blue *= scaleBlack / 2
			} else {
				red *= scaleBlack / 2
			}
		} else if ( blue == min ) {
			blue = blackPoint
			if ( green == max) {
				red *= scaleBlack / 2
			} else {
				green *= scaleBlack / 2
			}
		}
	}
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
  if ( this.focusPeptide == "Reference" ) {
    return expand( [ Math.round(red * scaleGamma), Math.round(green * scaleGamma), Math.round(blue * scaleGamma), Math.round( ( this.isHighlightSet ? alpha * scaleGamma : 255 )  )] )
  } else {
    return [ Math.round(red * scaleGamma), Math.round(green * scaleGamma), Math.round(blue * scaleGamma), Math.round( ( this.isHighlightSet ? alpha * scaleGamma : 255 )  )]
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
				// that.linearFinished();
				runcb(cb)
			})
		resolve()
	}).then( bugtxt("LINEAR then") ).catch( bugtxt("LINEAR catch") )

}
// function runDemo() {
//   async.series( [
//     function( cb ) {
//       this.openImage = true;
//       this.focusPeptide = 'Opal'; // Blue TESTS
//       this.ratio = 'sqr';
//       this.generateTestPatterns(cb);
//     },
//     function( cb ) {
//       // this.openImage = true;
//       this.focusPeptide = 'Ochre'; // Red TESTS
//       this.ratio = 'sqr';
//       this.generateTestPatterns(cb);
//     },
//     function( cb ) {
//       // this.openImage = true;
//       this.focusPeptide = 'Arginine'; //  PURPLE TESTS
//       this.ratio = 'sqr';
//       this.generateTestPatterns(cb);
//     },
//     function( cb ) {
//       // this.openImage = true;
//       this.focusPeptide = 'Methionine'; //  this.green  TESTS
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
	if (arr === undefined) {
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
	// give it a large number of pixels
	// it will choose a hilbert dimension
	// and return the shrinkage factor, codons per pixel hilbert
	let dimension, hilpix, codonsPerPixelHILBERT, shrinkFactor
	let bestFit = optimumDimension (linearpix, "auto")

	if ( bestFit > defaultMagnitude ) {
		output(`This genome could be output at a higher resolution of ${hilbPixels[bestFit].toLocaleString()} than the default of ${bestFit}, you could try -m 8 or -m 9 if your machine is muscular, but it might core dump. -m10 would be 67,108,864 pixels but node runs out of stack before I get there on my 16 GB macOS. -Tom.`)
		dimension = defaultMagnitude
	} else if (bestFit < 2) {
		  dimension = 2 // its an array index
			let msg = `That image is too small to make an image out of: ${linearpix}`
			output(blueWhite(msg))
			rollbackFolder( path.resolve( cliInstance.outputPath, cliInstance.justNameOfDNA ) )
			return false
	}

	if ( this.magnitude == "custom" ) {
		dimension = this.dimension // users choice over ride all this nonsense
	} else {
		dimension = bestFit // give him what he wants
	}


	hilpix = hilbPixels[ dim ]
	shrinkFactor = linearpix / hilpix // THE GUTS OF IT
	codonsPerPixelHILBERT = cpp * shrinkFactor
	this.codonsPerPixelHILBERT = codonsPerPixelHILBERT
	output(`bestFit ${bestFit} shrinkFactor [${shrinkFactor}] codons per pixel [${codonsPerPixelHILBERT}]`)
	return {
		shrinkFactor: shrinkFactor,
		codonsPerPixelHILBERT: codonsPerPixelHILBERT
	}
}
function optimumDimension (pix, magauto) { // give it pix it returns a HILBERT dimension that fits inside it with good over-sampling margins
	if ( pix == 0 ) {
		cliInstance.error(`zero values. ${streamLineNr}`)
		return 7
	}
	let dim = 1
	let rtxt = `[HILBERT] Calculating largest Hilbert curve image that can fit inside ${ twosigbitsTolocale(pix)} pixels, and over sampling factor of ${overSampleFactor}: `
	while (pix > (hilbPixels[dim] * overSampleFactor)) {
		if (dim > defaultMagnitude) {
			if ( magauto == "custom"  ) {
				if ( dim > theoreticalMaxMagnitude) {
					output(`Hilbert dimensions above 8 will likely exceed nodes heap memory and/or call stack. mag 11 sure does. spin up the fans. Capped your custom dimension to the ${ theoreticalMaxMagnitude }th order.`)
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

	rtxt+= ` <<<--- chosen dimension: ${dim} `
	log(`rtxt ${rtxt}`)
	return dim
}
function runcb( cb ) {
  log("runcb")
	if( typeof cb !== "undefined") {
		bugtxt(blueWhite( "run callback"))
		if( typeof cb === "function") {
			cb()
		}
	}
}
function removeNonAscii(str) {

	if ((str===null) || (str==""))
		return false
	else
		str = str.toString()

	return str.replace(/[^\x20-\x7E]/g, "")
}
function procTitle( txt ) {
	process.title = `aminosee.funk.nz (${ maxWidth( 32, txt + " " + cliInstance.justNameOfPNG) + " " + cliInstance.highlightOrNothin()})`
}
function removeLocks(lockfile, devmode, cb) { // just remove the lock files.
	mode( "remove locks")
	bugtxt( "remove locks with " + remain + " files in queue. fileTouch: " + lockfile )
  if (this.test || this.demo) {  return }
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
	if ( devmode == true ) {
		output("Because you are using --devmode, the lock file is not deleted. This is useful during development of the app because when I interupt the render with Control-c, AminoSee will skip that file next time, unless I use --force. Lock files are safe to delete at any time.")
	} else {
		deleteFile( lockfile )
	}
	runcb( cb )
}
function notQuiet( txt ) {
	if (cliInstance.quiet == true) {
		process.stdout.write(".")
	} else {
		output( txt )
	}
}
function killAllTimers() {
	if ( this.updatesTimer) {
		clearTimeout( this.updatesTimer )
	}
	if ( this.progTimer) {
		clearTimeout( this.progTimer )
	}
	if ( this.lockTimer) {
		clearTimeout( this.lockTimer )
	}
	if ( cliInstance.updatesTimer) {
		clearTimeout( cliInstance.updatesTimer )
	}
	if ( cliInstance.progTimer) {
		clearTimeout( cliInstance.progTimer )
	}
	if ( cliInstance.lockTimer) {
		clearTimeout( cliInstance.lockTimer )
	}
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
function rollbackFolder(fullpath) {
	if ( path.basename(fullpath) !== cliInstance.justNameOfDNA ) {
		error(`internal state not consistent: ${path.basename(fullpath)} !== ${cliInstance.justNameOfDNA}`)
		return
	} else {
		output("here goes nothing, about to remove folder: "+ path.basename(fullpath))
	}
	deleteFile( cliInstance.filePNG )
	deleteFile( cliInstance.fileHILBERT )
	deleteFile( cliInstance.fileTouch )
	deleteFile( cliInstance.fileHistogram )
	deleteFile( cliInstance.fileHTML )
	deleteFile( path.resolve(fullpath, "index.html" ) )
	deleteDirectory( path.resolve(fullpath, "images" ) )
	deleteDirectory( fullpath )
}
function dot(i, x, t) {
	// this.debugFreq = throttledFreq();
	if (i % x == 0 ) {
		if (!t) {
			t = `[ ${i} ]`
		}
		redoline(t)
		// cliInstance.progUpdate(  cliInstance.percentComplete)
	}
}
function listGenomes() {
	let dd = dedupeArray( genomesRendered )
	for( let g =0; g < dd.length; g++) {
		output(`${g}. ${dd[g]}`)

	}
}
function error(err) {
	mode(`💩 Error: [${ maxWidth(16,  err)}] ${cliInstance.justNameOfDNA} ${cliInstance.busy()}`)

	cliInstance.calcUpdate()
	if ( debug == true ) {
		if ( cliInstance.quiet == false ) {
			output()
			output( "💩 " + chalk.bgRed(  status  + ` /  error start {{{ ----------- ${ chalk.inverse( err.toString() ) }  ----------- }}} `))
			output()
		}

		output(`DEBUG MODE IS ENABLED. STOPPING: ${err}`)
		// process.exit()
		throw new Error(err)
	} else {
		cliInstance.raceDelay += 250
		output()
		notQuiet(`💩 Caught error: ${err} INCREASING DELAY BY 250 ms`)
		output()
	}
}
module.exports.removeLocks = removeLocks
module.exports.removeNonAscii = removeNonAscii
module.exports.locateWebroot = locateWebroot
module.exports.nicePercent = nicePercent
module.exports.createSymlink = createSymlink
module.exports.log = log
module.exports.out = out
module.exports.output = output
module.exports.AminoSeeNoEvil = AminoSeeNoEvil
module.exports.newJob = newJob
module.exports.pushCli = pushCli
module.exports.terminalRGB = terminalRGB
module.exports.stopWork = stopWork
module.exports.setupPrefs = setupPrefs
module.exports.fileWrite = (a,b,c) => { this.fileWrite(a,b,c) }
module.exports.deleteFile = deleteFile
module.exports.maxWidth = maxWidth
module.exports.maxWidth = maxWidth
module.exports.fixedWidth = fixedWidth
module.exports.getArgs = getArgs
module.exports.termSize = termSize
