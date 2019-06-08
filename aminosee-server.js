const aminosee = require('./aminosee-cli');
const http = require('http');
const chalk = require('chalk');
const path = require('path');
const os = require("os");
const httpserver = require('http-server'); // cant have - in js
const lockFileMessage = `
aminosee.funk.nz DNA Viewer by Tom Atkinson.
This is a temporary lock file, so I dont start too many servers. Its safe to erase these files, and I've made a script in /dna/ to batch delete them all in one go. Normally these are deleted when render is complete, or with Control-C and graceful shutdown.`;
const version = aminosee.version;
let outputPath = aminosee.outputPath;//path.normalize(path.resolve(os.homedir + outFoldername))  // default location after checking overrides
let filenameServerLock = outputPath
setOutputPath(outputPath)
// let port = 4321;
let port = 43210;

function startServeHandler() {
  const handler = require('serve-handler');
  const http = require('http');
  let www =  path.resolve(os.homedir() + "/AminoSee_Output");
  // let www = path.resolve(outputPath);
  console.log(`www = ${www}`);
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
      console.log(`Running at ` + chalk.underline(getServerURL()));
    });
    return true
  } catch(err) {
    aminosee.log(`Caught err while trying to start server. Probably already running.`)
    aminosee.bugtxt(err)
    return false
  }
}


module.exports = (options) => {

  http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      console.log('data from web');
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
function start(outputPath) {
  this.outputPath = outputPath;
  if (serverLock()) {
    console.log("Server already started. If you think this is not true, remove the lock file: " + filenameServerLock);
    return false
  } else {
    console.log("Starting server");
    return startServeHandler();
  }
};
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

module.exports.startServeHandler = startServeHandler;

function close() {
  try {
    if (serveHandler != undefined) {
      console.log("Stoping server");
      serveHandler.close();
    } else {
      console.log("no server");
    }
  } catch(e) {
    aminosee.bugtxt(e);
  }
} module.exports.close = close

function setOutputPath(o) {
  this.outputPath = o;
  this.filenameServerLock = path.resolve(`${outputPath}/aminosee_server_lock.txt`);
  console.log(o);
} module.exports.setOutputPath = setOutputPath

function stop() {
  console.log("Stoping server");
  // aminosee.deleteFile(filenameServerLock);
} module.exports.stop = stop;

module.exports.open = function (relative) {
  console.log("Opening page: " + relative);
}
// module.exports.getServerURL = function (path) {
function getServerURL(path) {
  return '?';

  let internalIp = require('internal-ip');
  if (path == undefined) {
    path = "/megabase/main.html";
  } else {
    path = `/${path}/main.html`;
  }
  serverURL = `http://${internalIp.v4.sync()}:${port}${path}`;
  // console.log(`serverURL ${serverURL}`);
  return serverURL;
}
module.exports.getServerURL = getServerURL;

// module.exports.serverLock = function(cb) {
function serverLock() {
  if (aminosee.doesFileExist(filenameServerLock)) {
    log('Server already running ');
    return true;
  } else { return false }
}