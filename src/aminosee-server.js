const aminosee = require('./aminosee-cli');
const data = require('./aminosee-data');
const doesFileExist   = data.doesFileExist;
const doesFolderExist = data.doesFolderExist;
const createSymlink   = data.createSymlink;
const deleteFile      = data.deleteFile;
const recordFile      = data.recordFile;
const alog = aminosee.log;
const Preferences = require('preferences');
const http = require('http');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const httpserver = require('http-server'); // cant have - in js
const spawn = require('cross-spawn');
const fs = require('fs-extra'); // drop in replacement = const fs = require('fs')
const lockFileMessage = `
aminosee.funk.nz DNA Viewer by Tom Atkinson.
This is a temporary lock file, so I dont start too many servers. Its safe to erase these files, and I've made a script in /dna/ to batch delete them all in one go. Normally these are deleted when render is complete, or with Control-C and graceful shutdown.`;
// const version = aminosee.version;
// const webserverEnabled = true;
const defaulturl = `http://localhost:4321/?devmode`
let outputPath, filenameServerLock, url, projectprefs, userprefs, port, cliruns, gbprocessed;
url = defaulturl
port = 4321;

[ userprefs, projectprefs ] = setupPrefs();

function setupPrefs() {
  projectprefs = new Preferences('nz.funk.aminosee.project', {
    aminosee: {
      opens: 0,
      genomes: [ `megabase`, '50KB_TestPattern' ],
      url: defaulturl
    }
  }, {
    encrypt: false,
    file: path.join( outputPath + '/aminosee_project.conf'),
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
function log(txt) {
  output( txt )
}
// function getArgs() {
//   return this.args;
// }
function output(txt) {
    console.log(chalk.inverse(`${defaulturl} `) + ' [' + txt + ']');
}

function buildServer() {
  const appFilename = require.main.filename; //     /bin/aminosee.js is 11 chars
  const appPath = path.normalize(appFilename.substring(0, appFilename.length-15));// cut 4 off to remove /dna

  // this.openHtml = true;
  // that.setupKeyboardUI();
  // output("HELLO**********************")
  output(`Building server to ${outputPath}`)
  data.saySomethingEpic();
  let sFiles = [
    { "source": appPath + 'public',            "dest": outputPath + '/public' },
    { "source": appPath + 'public/favicon.ico',"dest": outputPath + '/favicon.ico' }
  ];
  for (let i=0; i<sFiles.length; i++) {
    let element = sFiles[i]
    // log('building ' + element.source );//.toString());
    createSymlink(path.normalize(path.resolve(element.source)), path.normalize(path.resolve(element.dest)));
  }

}


function startCrossSpawnHttp(p) { // Spawn background server
  let didStart = false;
  if (p !== undefined) { port = p }
  let options = [ outputPath + "/", `-p`, port, '-o' ]
  output(chalk.yellow(`starting up with ${options.toString()}`))
  let evilSpawn
  try {
    evilSpawn = spawn('http-server', options, { stdio: 'pipe' });
    didStart = true;
  } catch(err) {
    output(err)
    didStart = false;
  }
  evilSpawn.stdout.on('data', (data) => {
    output(data);
  });
  evilSpawn.stderr.on('data', (data) => {
    output( `error with ${chalk.inverse(url)}`);
    didStart = false;
    if ( data.indexOf('EADDRINUSE') != -1 ) {
      output(`Port ${port} is in use`);
    } else if ( data.indexOf('ENOENT') != -1 ) {
      output(`ENOENT error`);
      // output( data );
    } else {
      output(`Unknown error:`);
      output( data );
    }
  });
  evilSpawn.on('close', (code) => {
    output( chalk.inverse(`Server process quit with` ) + ` [${code}] Use --kill to get forceful about starting that server`);
  });
  log(chalk.bgBlue.yellow("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?"));
  log("Control-C to quit. This requires http-server, install that with:");
  log("sudo npm install --global http-server");
  return didStart
}
function starthttpserver(options) {
  if ( options === undefined ) {
    options = [ outputPath, `-p`, port, '-o' ]
  }

  const theserver = require('http-server');
  theserver.createServer(options);
}
function startServeHandler() {
  setOutputPath()

  const handler = require('serve-handler');
  const http = require('http');
  let www =  path.resolve(os.homedir() + "/AminoSee_Output");
  // let www = path.resolve(outputPath);
  // output(`www = ${www}`);
  const serveHandler = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options

    response.write('struth!');
    return handler(request, response);//, options);
  })
  let options = {
    public: www,
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
      output(`Running at ` + chalk.underline(getServerURL()));
    });
    return true
  } catch(err) {
    aminosee.log(`Caught err while trying to start server. Probably already running.`)
    // aminosee.bugtxt(err)
    return false
  }
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
  output(`Stopping server`);
  log(filenameServerLock)
  deleteFile(filenameServerLock);
  if (serverLock()) {
    const killServe =    spawn('nice', ['killall', 'node', '', '0'], { stdio: 'pipe' });
    const killAminosee = spawn('nice', ['killall', 'aminosee.funk.nz', '', '0'], { stdio: 'pipe' });
    if (server != undefined) {
      log("closing server")
      // server.close();
    } else {
      log("no server running")
    }
  }
  try {
    fs.unlinkSync(filenameServerLock, (err) => {
      log("Removing server locks OK...")
      if (err) { log('ish'); console.warn(err);  }
    });
  } catch (err) {
    log("No server locks to remove: " + err);
  }
}


function close() {
  try {
    if (serveHandler != undefined) {
      output("Stoping server");
      serveHandler.close();
    } else {
      output("no server");
    }
  } catch(e) {
    // aminosee.bugtxt(e);
  }
}
function start(o) { // return the port number
  if ( o === undefined && doesFolderExist(path.resolve(`/snapshot/`) )  ) {
    o = `/snapshot/public`
  }
  output(`Attempting to start server at: ${ o } on port ${ port }`)
  setupPrefs()
  outputPath = o;
  setOutputPath(o)
  if ( serverLock() ) {
    output("Server already started. If you think this is not true, remove the lock file: " + filenameServerLock);
    startCrossSpawnHttp(43210)
  } else {
    output("No locks found, Starting server ");
    log(`filenameServerLock: ${filenameServerLock}`)
    buildServer();
    // starthttpserver();
    // if ( startCrossSpawnHttp(port) == false ) {
    //   output(`Problem with port ${port} `);
    //   port = 43210;
      startCrossSpawnHttp(port)
    // }
  }
  return port
}
function setOutputPath(o) {
  if (o === undefined) { o = aminosee.outputPath }
  output(`AMINOSEE.OUTPUTPATH = ${aminosee.outputPath}`)
  outputPath = o;
  filenameServerLock = path.resolve(`${outputPath}/aminosee_server_lock.txt`);
  // output(`(server) im planning to run server at: ` + outputPath);
}
function setArgs(a) {
  if (a === undefined) { error(`args needs to be set!`) }
  outputPath = o;
  filenameServerLock = path.resolve(`${outputPath}/aminosee_server_lock.txt`);
  // output(`(server) im planning to run server at: ` + outputPath);
}
function error(err) {
  output(err)
  if (debug) {
    process.exit()
  }
}

function open(relative) {
  output("Opening page: " + relative);
}
// module.exports.getServerURL = function (path) {
function getServerURL(fullpath) {
  return '? its a bug';

  let internalIp = require('internal-ip');
  if (fullpath == undefined) {
    fullpath = "/megabase/main.html";
  } else {
    fullpath = `/${fullpath}/main.html`;
  }
  serverURL = `http://${internalIp.v4.sync()}:${port}${fullpath}`;
  output(`serverURL ${serverURL}`);
  return serverURL;
}

// module.exports.serverLock = function(cb) {
function serverLock() {
  // output(`Checking server lock at: ${filenameServerLock}`)
  if ( doesFileExist(filenameServerLock) ) {
    // output('Server already running ');
    return true;
  } else {
    // output('Server NOT already running ');
    recordFile(filenameServerLock, port, () => {
      output('Server starting up');
    })
    return false
  }
}


function terminalRGB(_text, _r, _g, _b) {
  return chalk.rgb(_r,_g,_b)(_text);
};
function symlinkGUI(cb) { // does:  ln -s /Users.....AminoSee/public, /Users.....currentWorkingDir/output/public
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

module.exports.getServerURL = () => { getServerURL() }
module.exports.startServeHandler = () => { startServeHandler() }
module.exports.startCrossSpawnHttp = () => { startCrossSpawnHttp() }
module.exports.open = open
module.exports.stop = stop
module.exports.start = start
module.exports.setOutputPath = setOutputPath
module.exports.close = close
