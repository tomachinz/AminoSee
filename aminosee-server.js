const aminosee = require('./aminosee-cli');
const data = require('./aminosee-data');
const alog = aminosee.log;

const doesFileExist   = data.doesFileExist;
const doesFolderExist = data.doesFolderExist;
const createSymlink   = data.createSymlink;

const http = require('http');
const chalk = require('chalk');
const path = require('path');
const os = require("os");
const httpserver = require('http-server'); // cant have - in js
const spawn = require('cross-spawn');
const fs = require('fs-extra'); // drop in replacement = const fs = require('fs')
const lockFileMessage = `
aminosee.funk.nz DNA Viewer by Tom Atkinson.
This is a temporary lock file, so I dont start too many servers. Its safe to erase these files, and I've made a script in /dna/ to batch delete them all in one go. Normally these are deleted when render is complete, or with Control-C and graceful shutdown.`;
const version = aminosee.version;
// let terminalRGB = function (txt) { aminosee.terminalRGB(txt) }
// let terminalRGB = require('./aminosee-cli').terminalRGB;
let outputPath, filenameServerLock;
function log(txt) {
  if (alog) { alog(txt) } else { console.log( txt ) }
}

let port = 4321;

  function buildServer() {
    const appFilename = require.main.filename; //     /bin/aminosee.js is 11 chars
    const appPath = path.normalize(appFilename.substring(0, appFilename.length-15));// cut 4 off to remove /dna

    // this.openHtml = true;
    webserverEnabled = true;
    // that.setupKeyboardUI();
    output(`Building server`)
    data.saySomethingEpic();
    let sFiles = [
      { "source": appPath + 'public',            "dest": outputPath + '/public' },
      { "source": appPath + 'public/home.html', "dest": process.cwd() + '/index.html' },
      { "source": appPath + 'public/favicon.ico',"dest": outputPath + '/favicon.ico' },
    ];
    for (i=0; i<sFiles.length; i++) {
      let element = sFiles[i]
      log('buildling ' + element.source );//.toString());
      // aminosee.createSymlink(path.normalize(path.resolve(element.source)), path.normalize(path.resolve(element.dest)));
    }

  }
function startCrossSpawnHttp() {
  // Spawn background server
  // const evilSpawn = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' });
  // const evilSpawn = spawn('http-server', [server.getServerURL(justNameOfDNA), '--port', port, '0'], { stdio: 'pipe' });
  const evilSpawn = spawn('http-server', ['--directory', outputPath,  '--port', port], { stdio: 'pipe' });
  evilSpawn.stdout.on('data', (data) => {
    output(`${chalk.inverse('aminosee-server')}${chalk(': ')}${data}`);
  });
  evilSpawn.stderr.on('data', (data) => {
    output(`${chalk.inverse('aminosee-server error')}${chalk(': ')}${data}`);
  });
  evilSpawn.on('close', (code) => {
    output(`child process quit with code ${code}`);
  });
  log(`Personal mini-Webserver starting up around now (hopefully) on port ${port} ${outputPath}`);
  //  log(`visit ${server.getServerURL()} in your browser to see 3D WebGL visualisation`);
  log(terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10));
  log(terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200));
  log("Control-C to quit. This requires http-server, install that with:");
  log("sudo npm install --global http-server");
  return port
}

function startServeHandler() {
  setOutputPath()

  const handler = require('serve-handler');
  const http = require('http');
  let www =  path.resolve(os.homedir() + "/AminoSee_Output");
  // let www = path.resolve(outputPath);
  output(`www = ${www}`);
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


  http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
      console.error(`err from createServer ${createServer}`);
    }).on('data', (chunk) => {
      output('data from web');
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      // BEGINNING OF NEW STUFF

      body = Buffer.concat(body).toString();
      response.end(body);

      response.on('error', (err) => {
        console.error(err);
      });
      body += ' AminoSee was here ';
      response.statusCode = 200;
      // response.setHeader('Content-Type', 'application/json');
      response.setHeader('Content-Type', 'application/html');
      // Note: the 2 lines above could be replaced with this next one:
      // response.writeHead(200, {'Content-Type': 'application/json'})

      const responseBody = { headers, method, url, body };

      // response.write(JSON.stringify(responseBody));
      response.write(body);
      response.end();
      // Note: the 2 lines above could be replaced with this next one:
      // response.end(JSON.stringify(responseBody))

      // END OF NEW STUFF
    });
  }).listen(options.port);
}

module.exports.start = start;

function stop() {
  if (serverLock()) {
    const killServe = spawn('nice', ['killall', 'node', '', '0'], { stdio: 'pipe' });
    const killAminosee = spawn('nice', ['killall', 'aminosee.funk.nz', '', '0'], { stdio: 'pipe' });
    if (server != undefined) {
      log("closing server")
      server.close();
    } else {
      bugtxt("no server running")
    }
  }
  try {
    fs.unlinkSync(filenameServerLock, (err) => {
      bugtxt("Removing server locks OK...")
      if (err) { log('ish'); console.warn(err);  }
    });
  } catch (err) {
    bugtxt("No server locks to remove: " + err);
  }
}; module.exports.stop = stop;


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
  output(`Attempting to start server at: ${ o }`)
  outputPath = o;
  setOutputPath(o)
  if (serverLock()) {
    output("Server already started. If you think this is not true, remove the lock file: " + filenameServerLock);
  } else {
    output("No locks found, Starting server");
    buildServer();
    startCrossSpawnHttp()
    // startServeHandler();
  }
  return port
};
function setOutputPath(o) {
  if (o === undefined) { o = aminosee.outputPath }
  outputPath = o;
  filenameServerLock = path.resolve(`${outputPath}/aminosee_server_lock.txt`);
  output(`(server) im planning to run server at: ` + outputPath);
}

function stop() {
  output("Stoping server");
  // aminosee.deleteFile(filenameServerLock);
}

function open(relative) {
  output("Opening page: " + relative);
}
// module.exports.getServerURL = function (path) {
function getServerURL(path) {
  return '? its a bug';

  let internalIp = require('internal-ip');
  if (path == undefined) {
    path = "/megabase/main.html";
  } else {
    path = `/${path}/main.html`;
  }
  serverURL = `http://${internalIp.v4.sync()}:${port}${path}`;
  // output(`serverURL ${serverURL}`);
  return serverURL;
}

// module.exports.serverLock = function(cb) {
function serverLock() {
  if (doesFileExist(filenameServerLock)) {
    log('Server already running ');
    return true;
  } else { return false }
}
// function log(txt) {
//   output(txt)
//   // aminosee.output(txt)
// }
// function doesFileExist(f) {
//   let result = false;
//   if (f == undefined) { return false; } // adds stability to this rickety program!
//   f = path.resolve(f);
//   try {
//     result = fs.existsSync(f);
//     if (result == true ) {
//       return true; //file exists
//     } else {
//       result = false;
//     }
//   } catch(err) {
//     output("Shell be right mate: " + err)
//     result = false;
//   }
//   return result;
// }
// function doesFolderExist(f) {
//   if (doesFileExist(f)) {
//     return fs.lstatSync(f).isDirectory()
//   } else {
//     log('Folder not exist')
//     return false;
//   }
// }
function output(txt) {
  console.log(`server: ${txt} (server)`);
  // aminosee.output(txt)
}
// module.exports.startServeHandler = startServeHandler;
function terminalRGB(_text, _r, _g, _b) {
    return chalk.rgb(_r,_g,_b)(_text);

    if (_r+_g+_b >= 256.0) {
      _text += "\x1b[44m"; // add some black background if its a light colour
    }
    return "\x1b[38;2;" + _r + ";" + _g + ";" + _b + "m" + _text + "\x1b[0m";
  };
module.exports.getServerURL = () => { getServerURL() }
module.exports.startServeHandler = () => { startServeHandler() }
module.exports.startCrossSpawnHttp = () => { startCrossSpawnHttp() }
module.exports.open = open
module.exports.stop = stop
module.exports.start = start
module.exports.setOutputPath = setOutputPath
module.exports.close = close
