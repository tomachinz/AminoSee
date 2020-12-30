const open = require("open")
const httpserver = require("http-server") // cant have - in js
// const aminosee = require("./aminosee-cli")
// const error = require("./aminosee-cli").error
const data = require("./aminosee-data")
const doesFileExist   = data.doesFileExist
// const doesFolderExist = data.doesFolderExist
const createSymlink   = data.createSymlink
const deleteFile      = data.deleteFile
const recordFile      = data.recordFile
// const fixedWidth			= aminosee.fixedWidth
const Preferences = require("preferences")
const chalk = require("chalk")
// const term = require("terminal-kit").terminal
const path = require("path")
const os = require("os")
const spawn = require("cross-spawn")
const fs = require("fs-extra") // drop in replacement = const fs = require('fs')
const defaulturl = "http://localhost:4321"
const appFilename = require.main.filename //     /bin/aminosee.js is 11 chars
const defaultPort = 43210
const backupPort = 4321

// const useSymlinks = false
const iip = require("internal-ip")
const internalIp = iip.v4()

let debug = false
let autoStartGui = false
let starts = -1
let outputPath, filenameServerLock, url, projectprefs, userprefs, port, cliruns, gbprocessed, args, theserver, genomes, webroot, fragment

output(chalk.yellow(`init web server`))

// setArgs()

module.exports = (options) => {
	var tcpPortUsed = require("tcp-port-used")
	fragment = "not-set"
	port = defaultPort
	// fragment = aminosee.justNameOfDNA
	process.title = `aminosee.funk.nz_server ${fragment}`
	output(`AminoSee built-in webserver ${ chalk.underline( fragment )}`)

	// setArgs(options);
	// [ userprefs, projectprefs ] = setupPrefs()
	setupPrefs()
	log(appFilename)

	tcpPortUsed.check(port, "127.0.0.1")
	.then(function(inUse) {
		output(`tcp-port-used Port ${port} inUse: ${inUse}`)
		if ( inUse == false ) {
			try {
				start()
				return args.openPage
			} catch(err) {
				return "port in use" // err
			}
		} else {
			output("busy")
		}
	}, function(err) {
		console.error("tcp-port-used Error on check:", err.message)
		console.log("exit")
	})
}

function setArgs( TheArgs ) {
	webroot = path.resolve( os.homedir(), "AminoSee_webroot")
	port = defaultPort
	output("setArgs running")
	if ( typeof TheArgs === "undefined" ) {
		args = {
			verbose: false,
			webroot: webroot,
			path: webroot,
			output: path.join( webroot, "output"),
			serve: true,
			openHtml: false,
			currentURL: "/index.html#shouldnotopen",
			gzip: true,
			directoryListing: true,
			background: false,
			debug: false
		}
		log("using default args")
		log(`args: ${args.toString()}`)

	} else {
		args = TheArgs
		output("using dynamic args")
		output(`TheArgs: ${TheArgs.toString()}`)
	}
	filenameServerLock = path.resolve( webroot, "output", "aminosee_server_lock.txt")

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
	// output( `log txt: ${txt}` )

	if ( args ) {
		if ( args.verbose) {
			if ( args.verbose == true) {
				output( txt )
			}
		}
	}

}
function notQuiet(txt) {
	log(txt)
}
function output(txt) {
	if ( typeof txt === "undefined" || !debug ) {	console.log(); return }
	console.log(`server: ${txt}`)
}
/** https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js/26038979
* Look ma, it's cp -R.
* @param {string} src The path to the thing to copy.
* @param {string} dest The path to the new copy.
*/
function copyRecursiveSync(src, dest) {
	log(`Will try to recursive copy from ${src} to ${dest}`)
	var exists = doesFileExist(src)
	var stats = exists && fs.statSync(src)
	var isDirectory = exists && stats.isDirectory()
	var existsDest = doesFileExist(dest)
	if (existsDest) {
		log(`Remove the ${dest} folder or file, then I can rebuild the web-server`)
		log(chalk.italic( `rm -rfv ${dest}` ))
		return false
	} else {
		output("creating")
	}
	if (exists && isDirectory) {
		exists = doesFileExist(dest)
		if (exists) {
			log("Remove the /public/ folder and also /index.html, then I can rebuild the web-server")
			// return false
		} else {
			fs.mkdirSync(dest)
		}
		fs.readdirSync(src).forEach(function(childItemName) {
			log(childItemName)
			copyRecursiveSync(path.join(src, childItemName),
			path.join(dest, childItemName))
		})
	} else {
		log("making symlink ")
		fs.linkSync(src, dest)
	}
	log("done")
}

function buildServer() {
	const appPath = __dirname
	this.openHtml = true
	output(`Building server to ${webroot}  ${url}`)
	data.saySomethingEpic()
	let sFiles = [
		{ "source": path.join( appPath, "public" ),                "dest": path.join( webroot , "public"  )},
		{ "source": path.join( appPath, "public", "index.html"),"dest": path.join( webroot , "index.html")},
		{ "source": path.join( appPath, "public", "index.html"),"dest": path.join( webroot , "404.html")},
		{ "source": path.join( appPath, "public", "favicon.ico"),  "dest": path.join( webroot , "favicon.ico")}
	]
	for (let i=0; i<sFiles.length; i++) {
		let element = sFiles[i]
		log(`${element.source} --->> ${element.dest}` )//.toString());
		// createSymlink(path.resolve(element.source), path.resolve(element.dest))
		copyRecursiveSync(path.resolve(element.source), path.resolve(element.dest))
	}

}

function selfSpawn() {
	let didStart = false
	process.title = "aminosee_evilspawn"
	output( `selfSpawn ${args}` )
	let evilSpawn
	try {
		evilSpawn = spawn("aminosee", "--foreground", { stdio: "pipe" })
		didStart = true
	} catch(err) {
		log(`Bargle! ${  err }`)
		didStart = false
	}
	evilSpawn.stdout.on("data", (data) => {
		process.stdout.write(data)
		// console.log(data)
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
	if (typeof p !== "undefined") { port = p }
	let options = [ webroot, `-p${port}`, "-o", ( args && args.justNameOfDNA ? args.justNameOfDNA  : "/" ), ( args && args.gzip ? "--gzip" : ""), "-d" ]
	output(options.toString())
	output(chalk.yellow(`Starting BACKGROUND web server at ${chalk.underline(getServerURL())}`))
	console.log(options)
	let evilSpawn
	try {
		evilSpawn = spawn("http-server", options, { stdio: "pipe" })
		evilSpawn.process.title = "aminosee_http"
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
function foregroundserver() {
	process.title = "aminosee.funk.nz (server)"
	let didStart = false
	// var root = path.join(__dirname)
	output( `server launching in foreground at webroot ${webroot}`)
	try {
		var server = httpserver.createServer({
			path: webroot,
			root: webroot,
			robots: true,
			directoryListing: true,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": "true"
			}
		})
		didStart = true
	} catch(err) {
		if ( err.indexOf("EADDRINUSE") !== -1 ) {
			output(`port ${port} in use, trying backup port: ${backupPort}`)
		} else {
			output(`unknown error starting server: ${err}`)
		}
	}


	output(`listen on port ${port}`)
	// stop()
	// try {
	// 	server.listen(port)
	// 	didStart = true
	// } catch(err) {
	// 	if ( err.indexOf("EADDRINUSE") !== -1 ) {
	// 		output(`port ${port} in use, trying backup port: ${backupPort}`)
	// 	} else {
	// 		// output(`unknown error starting server: ${err}`)
	// 		output(`probably the address is in use`)
	// 	}
	// }
	if ( !didStart ) {
		try {
			try {
				output(`port ${port} in use, trying backup port: ${backupPort}`)
				server.listen(backupPort)
				didStart = true
				port = backupPort
			} catch(err) {
				if ( err.indexOf("EADDRINUSE") !== -1 ) {
					output(`backup Port ${backupPort} in use also`)
				} else {
					output(`unknown error starting server: ${err}`)
				}
			}

		} catch(err) {
			if ( err.indexOf("EADDRINUSE") !== -1 ) {
				output(`backup Port ${backupPort} in use also`)
			} else {
				output(`unknown error starting server: ${err}`)
			}
		}
	} else {
		return args.openPage
	}


	// return server


	// if ( options === undefined ) {
	// 	options = [ webroot, "-p", port, "-o" ]
	// }
	options = [ webroot, `-p${port}`, "-o", webroot, "--gzip", "-d" ]

	// log(`FOREGROUND server path: ${webroot} ${port} ${url}`)
	// theserver = httpserver.createServer(options)
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
	aminosee.output("startServeHandler complete")
}




function stop() {
	setArgs()
	log(`Stopping server. OS: ${os.platform()} removing lock file... ${filenameServerLock}`)
	deleteFile(filenameServerLock)
	log("...lock file removed.")
	if ( os.platform() == "win32" || os.platform() == "win64") {
		output("not sure how to kill a process on windows. maybe try:")
		output( chalk.italic( "taskkill /IM 'aminosee.funk.nz_server' /F"))
	} else {
		try {
			spawn("killall", ["aminosee.funk.nz (server)", "", "0"], { stdio: "pipe" })
		} catch(err) {
			if ( err.indexOf("ENOENT") !== -1 ) {
				output("Unable to shutdown server with 'killall aminosee.funk.nz_server' perhaps this is running on windows? Try task manager")
			} else {
				output(`Unknown error: ${err}`)
			}
		}
		try {
			spawn("killall", ["aminosee.funk.nz (server)", "", "0"], { stdio: "pipe" })
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

function start() { // return the port number
	output(chalk.yellow(`Starting web server at ${chalk.underline(getServerURL())}`))
	log( args )
	filenameServerLock = path.join( args.webroot, "output", "aminosee_server_lock.txt")
	// if ( args.stop == true ) { stop(); return true }
	stop(); // kludge
	setupPrefs()
	buildServer()
	output(`web root: ${webroot}`)
	let options = [ webroot, "-p", port, "-o", "--gzip", "-d" ] // -o open -i autoindex
	// let options = [ webroot , "", "-p", port, "-o" ]
	if ( serverLock() == true ) {
		port = readLockPort(filenameServerLock)
		output(`Server already started, using lock file port of (${port}) from: ${ path.normalize( filenameServerLock )}`)
		output("Restarting server")
		deleteFile(filenameServerLock)
		stop()
		port = backupPort
		foregroundserver()


	} else {
		log("No locks found, starting server ")
		if ( args.background == true ) {
			selfSpawn( options )
		} else {
			output("Foreground")
			foregroundserver( options )
			if ( args.html ) {
				output(`Opening url ${url}`)
				open( `${url}/output/${args.currentGenome}`, {wait: false}).then(() => {
					log("browser closed")
				}).catch(function () {
				})
			} else {
				output(`Not opening url ${url}`)
			}

		}
		log(`filenameServerLock: ${filenameServerLock}`)
	}
	return args.openPage
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
function getServerURL() {

	let indexfile = ""
	// if ( args.devmode ) {
	// indexfile = "aminosee-web.html"
	// }
	fragment = "not-set"// args.justNameOfDNA
	if (typeof fragment === "undefined") {
		fragment = "/"
	} else {
		fragment = `/output/${fragment}/${indexfile}`
	}
	let serverURL = `http://${internalIp}:${port}${fragment}`
	output(`serverURL returns ${serverURL} and fragment ${fragment} the port ${port}`)

	if ( serverURL !== url ) {
		output("Maybe this is a bug, and I am exploring various web servers and runinng multiples in this version, so I got confused. You mite want to set the server URL base with:")
		output(`aminosee --url=${serverURL}`)
		log("this is useful if you have a front-side proxy or are uploading your files to static hosting at a different domain eg I used --url=https://www.funk.co.nz/aminosee for my site")
	}
	return serverURL
}

// module.exports.serverLock = function(cb) {
function serverLock() {
	log(`Checking server lock at: ${filenameServerLock}`)
	if ( doesFileExist(filenameServerLock) ) {
		log("Server already running ")
		return true
	} else {
		log("Server starting up...")
		recordFile(filenameServerLock, port, () => {
			output(`server started`)
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
	fullSrc = path.normalize( path.resolve(appPath , "aminosee-web.html") )
	fullDest = path.normalize( path.resolve(this.webroot , "index.html") ) // Protects users privacy in current working directory
	createSymlink(fullSrc, fullDest)
	fullSrc = path.normalize( path.resolve(appPath , "node_modules") )
	fullDest = path.normalize( path.resolve(this.webroot , "node_modules") ) // MOVES INTO ROOT
	createSymlink(fullSrc, fullDest)
	if (typeof cb !== "undefined") {
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
