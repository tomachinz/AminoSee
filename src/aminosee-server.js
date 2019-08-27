const open = require("open")
const httpserver = require("http-server") // cant have - in js
// httpServer = require('../lib/http-server');

const aminosee = require("./aminosee-cli")
const data = require("./aminosee-data")
const doesFileExist   = data.doesFileExist
const doesFolderExist = data.doesFolderExist
const createSymlink   = data.createSymlink
const deleteFile      = data.deleteFile
const recordFile      = data.recordFile
const fixedWidth			= aminosee.fixedWidth
const termSize				= aminosee.termSize
const Preferences = require("preferences")
const chalk = require("chalk")
const term = require("terminal-kit").terminal
const path = require("path")
const os = require("os")
const spawn = require("cross-spawn")
const fs = require("fs-extra") // drop in replacement = const fs = require('fs')
let debug = false
let autoStartGui = false
let starts = -1
const lockFileMessage = `
aminosee.funk.nz DNA Viewer by Tom Atkinson.
This is a temporary lock file, so I dont start too many servers. Its safe to erase these files, and I've made a script in /dna/ to batch delete them all in one go. Normally these are deleted when render is complete, or with Control-C and graceful shutdown.`
// const version = aminosee.version;
// const webserverEnabled = true;
const defaulturl = "http://localhost:4321"
let outputPath, filenameServerLock, url, projectprefs, userprefs, port, cliruns, gbprocessed, args, theserver, genomes
let webroot = path.resolve( os.homedir(), "AminoSee_webroot")
port = 4321
backupPort = 43210
process.title = "aminosee.funk.nz_server";
[ userprefs, projectprefs ] = setupPrefs()

function setArgs( TheArgs ) {
	if ( TheArgs === undefined ) {
		args = {
			verbose: false,
			webroot: webroot,
			output: path.join( webroot, "output"),
			serve: true,
			gzip: true
		}
		log("using default args")

	} else {
		args = TheArgs
		log("using dynamic args")
	}
	outputPath = args.output
	filenameServerLock = path.resolve( webroot, "aminosee_server_lock.txt")
	debug = args.debug
	if ( args.debug ) {
		debug = true
		log("debug mode ENABLED")
	} else {
		debug = false
		log( "debug mode DISABLED")
	}
	if ( debug ) {
		log( "args received: ")
		console.log( args )
		log( "args received: ")
	}
}
function setupPrefs() {
	let projconf = path.join( webroot, "aminosee_project.conf" )
	projectprefs = new Preferences("nz.funk.aminosee.project", {
		aminosee: {
			opens: 0,
			genomes: [ "megabase", "50KB_TestPattern" ],
			url: defaulturl
		}
	}, {
		encrypt: false,
		file: projconf,
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
	cliruns = userprefs.aminosee.cliruns
	gbprocessed  = userprefs.aminosee.gbprocessed
	genomes = projectprefs.aminosee.genomes
	url = projectprefs.aminosee.url
	return [ userprefs, projectprefs ]

}
function log(txt) {
	if ( args ) {
		if ( args.verbose) {
			if ( args.verbose == true) {
				output( txt )
			}
		}
	}

}
// function getArgs() {
//   return this.args;
// }
function output(txt) {
	console.log(chalk.bgBlue(" [ " + txt.substring(0, term.width -10  )+ " ]"))
}

function buildServer() {
	const appFilename = require.main.filename //     /bin/aminosee.js is 11 chars
	// const appPath = path.normalize(appFilename.substring(0, appFilename.length-15));// cut 4 off to remove /dna
	const appPath = __dirname

	this.openHtml = true
	// that.setupKeyboardUI();
	// output("HELLO**********************")
	output(`Building server to ${webroot}  ${url}`)
	data.saySomethingEpic()
	let sFiles = [
		{ "source": path.join( appPath , "public"),             "dest": path.join( webroot , "public" )},
		{ "source": path.join( appPath , "aminosee.html"),      "dest": path.join( webroot , "aminosee.html")},
		{ "source": path.join( appPath , "public", "favicon.ico"), "dest": path.join( webroot , "favicon.ico")}
	]
	for (let i=0; i<sFiles.length; i++) {
		let element = sFiles[i]
		// log('building ' + element.source );//.toString());
		createSymlink(path.resolve(element.source), path.resolve(element.dest))
	}

}
function selfSpawn(p) {
	let didStart = false
	if (p !== undefined) { port = p }
	// let options = 				[ webroot, `-p${port}`, "-o", ( args.justNameOfDNA ? args.justNameOfDNA  : "/" ), ( args.gzip ? "--gzip" : "") ]
	// let optionsAminoSee = [ webroot, `-p${port}`, "-o", ( args.justNameOfDNA ? args.justNameOfDNA  : "/" ), ( args.gzip ? "--gzip" : "") ]
	// output(options.toString())
	output(chalk.yellow(`Starting BACKGROUND web server at ${chalk.underline(getServerURL())}`))
	// console.log(options)
	let evilSpawn
	try {
		// evilSpawn = spawn("http-server", options, { stdio: "pipe" })
		evilSpawn = spawn("aminosee", "--serve", { stdio: "pipe" })
		didStart = true
	} catch(err) {
		log(err)
		didStart = false
	}
	evilSpawn.stdout.on("data", (data) => {
		output(data)
	})
	evilSpawn.stderr.on("data", (data) => {
		log( `error with ${chalk.inverse(url)}`)
		didStart = false
		if ( data.indexOf("EADDRINUSE") != -1 ) {
			output(`Port ${port} is in use`)
		} else if ( data.indexOf("ENOENT") != -1 ) {
			output("ENOENT error")
			log( data )
		} else {
			output("Unknown error:")
			log( data )
		}
	})
	evilSpawn.on("close", (code) => {
		output( chalk.inverse("Server process quit with" ) + ` [${code}] Use --kill to get forceful about starting that server`)
	})
	log(chalk.bgBlue.yellow("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?"))
	log("Control-C to quit. This requires http-server, install that with:")
	log( chalk.italic( "sudo npm install --global http-server"))
	return didStart
}

function spawnBackground(p) { // Spawn background server
	let didStart = false
	if (p !== undefined) { port = p }
	// let options = [ webroot, `-p${port}`, "-o", ( args.justNameOfDNA ? args.justNameOfDNA  : "/" ), ( args.gzip ? "--gzip" : "") ]
	let options = [ webroot, `-p${port}`, "-o", ( args && args.justNameOfDNA ? args.justNameOfDNA  : "/" ), ( args && args.gzip ? "--gzip" : "") ]
	// let optionsAminoSee = [ webroot , "", "-p", port ]
	output(options.toString())
	output(chalk.yellow(`Starting BACKGROUND web server at ${chalk.underline(getServerURL())}`))
	console.log(options)
	let evilSpawn
	try {
		evilSpawn = spawn("http-server", options, { stdio: "pipe" })
		// evilSpawn = spawn('aminosee', optionsAminoSee, { stdio: 'pipe' });
		didStart = true
	} catch(err) {
		log(err)
		didStart = false
	}
	evilSpawn.stdout.on("data", (data) => {
		output(data)
	})
	evilSpawn.stderr.on("data", (data) => {
		log( `error with ${chalk.inverse(url)}`)
		didStart = false
		if ( data.indexOf("EADDRINUSE") != -1 ) {
			output(`Port ${port} is in use`)
		} else if ( data.indexOf("ENOENT") != -1 ) {
			output("ENOENT error")
			log( data )
		} else {
			output("Unknown error:")
			log( data )
		}
	})
	evilSpawn.on("close", (code) => {
		output( chalk.inverse("Server process quit with" ) + ` [${code}] Use --kill to get forceful about starting that server`)
	})
	log(chalk.bgBlue.yellow("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?"))
	log("Control-C to quit. This requires http-server, install that with:")
	log( chalk.italic( "sudo npm install --global http-server"))
	return didStart
}
function foregroundserver(options) {
	process.title = "aminosee.funk.nz_server"

	var root = path.join(__dirname)
	output( `webroot ${webroot}` )
	var server = httpserver.createServer({
		root: webroot,
		robots: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": "true"
		}
	})

	try {
		server.listen(port)
	} catch(err) {
		if ( err.indexOf("EADDRINUSE") !== -1 ) {
			output(`port ${port} in use, trying backup port: ${backupPort}`)
			// server.listen(backupPort)
		} else {
			output(`unknown error starting server: ${err}`)
		}
	}

	return server


	if ( options === undefined ) {
		options = [ webroot, "-p", port, "-o" ]
	}
	log(`FOREGROUND server path: ${webroot} ${port} ${url}`)
	theserver = httpserver.createServer(options)
	return theserver
}
function startServeHandler(o, port) {

	const handler = require("serve-handler")
	const http = require("http")
	// let www =  path.resolve(os.homedir() , "AminoSee_webroot")
	const serveHandler = http.createServer((request, response) => {
		response.write("struth!")
		// More details here: github.com/zeit/serve-handler#options
		// var response = handler
		return handler(request, response)//, options);
	})
	let options = {
		public: webroot,
		port: port,
		trailingSlash: true,
		renderSingle: true,
		cleanUrls: true,
		symlinks: true,
		directoryListing: true,
		unlisted: [
			".DS_Store",
			".git"
		],
	}
	try {
		serveHandler.listen(options, () => {
			log("Running at " + chalk.underline(getServerURL()))
		})
		return true
	} catch(err) {
		aminosee.log("Caught err while trying to start server. Probably already running.")
		// aminosee.bugtxt(err)
		return false
	}
	output("startServeHandler complete")
}


// function aminoseeServer(){
module.exports = (options) => {


	// http.createServer((request, response) => {
	//   const { headers, method, url } = request;
	//   let body = [];
	//   request.on('error', (err) => {
	//     console.error(`err from createServer ${createServer}`);
	//   }).on('data', (chunk) => {
	//     output('data from web');
	//     body.push(chunk);
	//   }).on('end', () => {
	//     body = Buffer.concat(body).toString();
	//     // BEGINNING OF NEW STUFF
	//     body = Buffer.concat(body).toString();
	//     response.end(body);
	//     response.on('error', (err) => {
	//       console.error(err);
	//     });
	//     body += ' AminoSee was here ';
	//     response.statusCode = 200;
	//     // response.setHeader('Content-Type', 'application/json');
	//     response.setHeader('Content-Type', 'application/html');
	//     // Note: the 2 lines above could be replaced with this next one:
	//     // response.writeHead(200, {'Content-Type': 'application/json'})
	//
	//     const responseBody = { headers, method, url, body };
	//
	//     // response.write(JSON.stringify(responseBody));
	//     response.write(body);
	//     response.end();
	//     // Note: the 2 lines above could be replaced with this next one:
	//     // response.end(JSON.stringify(responseBody))
	//     // END OF NEW STUFF
	//   });
	// }).listen(options.port);
}


function stop() {
	setArgs()
	output(`Stopping server. OS: ${os.platform()}`)
	log(`removing lock file... ${filenameServerLock}`)
	deleteFile(filenameServerLock)
	log("...lock file removed.")
	if ( os.platform() == "win32" || os.platform() == "win64") {
		output("not sure how to kill a process on windows. maybe try:")
		output( chalk.italic( "taskkill /IM 'aminosee.funk.nz_server' /F"))

	} else {
		try {
			spawn("killall", ["aminosee.funk.nz_server", "", "0"], { stdio: "pipe" })
		} catch(err) {
			if ( err.indexOf("ENOENT") !== -1 ) {
				output("Unable to shutdown server with 'killall aminosee.funk.nz_server' perhaps this is running on windows? Try task manager")
			} else {
				output(`Unknown error: ${err}`)
			}
		}
	}

}


function close() {
	try {
		if (serveHandler !== undefined) {
			output("Stoping server")
			serveHandler.close()
		} else {
			output("no server")
		}
	} catch(e) {
		// aminosee.bugtxt(e);
	}
	try {
		httpserver.close()
	} catch(e) {
		// aminosee.bugtxt(e);
	}
}
function readLockPort(file) {
	return Math.round( (fs.readFileSync(file))) // my way of casting it to a number
}


function start(a) { // return the port number
	starts++
	if ( starts > 3 ) {
		output("you seem to be trying to start the server too much. odd.")
		return false
	}
	setArgs(a)
	log("Attempting to start server with args:")
	if ( args.verbose ) {
		console.log( a )
	}
	process.title = "aminosee.funk.nz_server"
	outputPath = args.output
	filenameServerLock = path.resolve( webroot, "aminosee_server_lock.txt")
	// if ( args.stop == true ) { log("Two issues...: you call the start function but args object is configured for stop = true, and you need to call setArgs(args) prior to start()") }
	setupPrefs()
	buildServer()
	output(`web root: ${webroot}`)
	let options = [ webroot, "-p", port, "-o" ]
	// let options = [ webroot , "", "-p", port, "-o" ]
	if ( serverLock() == true ) {
		stop() // sounds odd, but helps avoid port in use issue :)
		port = readLockPort(filenameServerLock)
		log(`Server already started, using lock file port of (${port}). If you think this is not true, remove the lock file: ${ path.normalize( filenameServerLock )}`)
		output("Restarting server")
		start()
		open( url , {wait: false}).then(() => {
			log("browser closed")
		}).catch(function () {
			deleteFile(filenameServerLock)
		 })
	} else {
		log("No locks found, Starting server ")
		if ( args.serve == true ) {
			// selfSpawn()
			spawnBackground() // works great but relies on http-server being installed globally
		} else {
			foregroundserver() // blocking version
			output("Backround")
		}
		log(`filenameServerLock: ${filenameServerLock}`)
	}
	return port
}


function error(err) {
	output(err)
	if (debug) {
		process.exit()
	}
}

function openPage(relative) {
	output("Opening page: " + relative)
}
function getServerURL(fragment) {

	let internalIp = require("internal-ip")
	let indexfile = ""
	// if ( args.devmode ) {
	// indexfile = "aminosee.html"
	// }
	if (fragment == undefined) {
		fragment = "/"
	} else {
		fragment = `/output/${fragment}/${indexfile}`
	}
	let serverURL = `http://${internalIp.v4.sync()}:${port}${fragment}`
	output(`serverURL returns ${serverURL} and also ${url}`)
	if ( serverURL !== url ) {
		output("Maybe this is a bug, and I am exploring various web servers and runinng multiples in this version, so I got confused. You mite want to set the server URL base with:")
		output(`aminosee --url=${serverURL}`)
		log("this is useful if you have a front-side proxy or are uploading your files to static hosting at a different domain eg I used --url=https://www.funk.co.nz/aminosee for my site")
	}
	return serverURL
}

// module.exports.serverLock = function(cb) {
function serverLock() {
	// output(`Checking server lock at: ${filenameServerLock}`)
	if ( doesFileExist(filenameServerLock) ) {
		log("Server already running ")
		return true
	} else {
		log("Server starting up...")
		// output('Server NOT already running ');
		recordFile(filenameServerLock, port, () => {
		})
		return false
	}
}

function symlinkGUI(cb) { // does:  ln -s /Users.....AminoSee/public, /Users.....currentWorkingDir/output/public
	this.mkdir("public")
	let fullSrc, fullDest
	fullSrc = path.normalize( path.resolve(appPath , "public") )
	fullDest = path.normalize( path.resolve(this.webroot , "public") )
	createSymlink(fullSrc, fullDest)
	fullSrc = path.normalize( path.resolve(appPath , "aminosee.html") )
	fullDest = path.normalize( path.resolve(this.webroot , "aminosee.html") ) // Protects users privacy in current working directory
	createSymlink(fullSrc, fullDest)
	fullSrc = path.normalize( path.resolve(appPath , "node_modules") )
	fullDest = path.normalize( path.resolve(this.webroot , "node_modules") ) // MOVES INTO ROOT
	createSymlink(fullSrc, fullDest)
	if (cb !== undefined) {
		cb()
	}
}

module.exports.foregroundserver = () => { foregroundserver() }
module.exports.getServerURL = () => { getServerURL()}
module.exports.startServeHandler = () => { startServeHandler() }
module.exports.spawnBackground = () => { spawnBackground() }
module.exports.stop = stop
module.exports.start = start
module.exports.close = close
module.exports.setArgs = setArgs
