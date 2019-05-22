const http = require('http');
const chalk = require('chalk');
const path = require('path');
const os = require("os");

let options = {
  port: 4321
}
function startServeHandler() {
  const handler = require('serve-handler');
  const http = require('http');
  // let www =  path.normalize( path.join(os.homedir() ,  outFoldername));
  let www = path.resolve(os.homedir() + "/AminoSee_Output");
  console.log(`www = ${www}`);
  const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options
    let options = {
      public: www,
      port: 4321,
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
    response.write('bloody hell');
    return handler(request, response);//, options);
  })
  server.listen(options, () => {
    console.log(`Running at ` + chalk.underline(getServerURL()));
  });
}
function getServerURL(path) {
  return 'http://127.0.0.1:8081';

  let internalIp = require('internal-ip');
  let port = 4321;
  if (path == undefined) {
    path = "/megabase";
  } else {
    path = `${outFoldername}/${path}`;
  }
  serverURL = `http://${internalIp.v4.sync()}:${port}${path}`;
  console.log(`serverURL ${serverURL}`);
  return serverURL;
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
module.exports.start = function() {
  console.log("Starting server");
  return startServeHandler();
};
module.exports.startServeHandler = startServeHandler;
module.exports.stop = function() {
  console.log("Stoping server");
};
module.exports.open = function (relative) {
  console.log("Opening page: " + relative);
}
module.exports.getServerURL = function (path) {
  return 'http://127.0.0.1:8081';

  let internalIp = require('internal-ip');
  let port = 4321;
  if (path == undefined) {
    path = "/megabase";
  } else {
    path = `${outFoldername}/${path}`;
  }
  serverURL = `http://${internalIp.v4.sync()}:${port}${path}`;
  console.log(`serverURL ${serverURL}`);
  return serverURL;
}
