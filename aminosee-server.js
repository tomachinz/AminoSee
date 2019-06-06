const http = require('http');
const chalk = require('chalk');
const path = require('path');
const os = require("os");
let aminosee = require('./aminosee-cli');

let port = 4321;

function startServeHandler() {
  const handler = require('serve-handler');
  const http = require('http');
  let www =  path.resolve(os.homedir() + "/AminoSee_Output");
  // let www = path.resolve(outputPath);
  console.log(`www = ${www}`);
  const serveHandler = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options
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
    response.write('bloody hell');
    return handler(request, response);//, options);
  })
  serveHandler.listen(options, () => {
    console.log(`Running at ` + chalk.underline(getServerURL()));
  });
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

module.exports.close = function() {
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

};
module.exports.setOutputPath = function(o) {
  outputPath = o;
  console.log(o);
};
module.exports.stop = function() {
  console.log("Stoping server");
};
module.exports.open = function (relative) {
  console.log("Opening page: " + relative);
}
module.exports.getServerURL = function (path) {
  // return 'http://127.0.0.1:8081';

  let internalIp = require('internal-ip');
  if (path == undefined) {
    path = "/megabase/main.html";
  } else {
    path = `/${path}/main.html`;
  }
  serverURL = `http://${internalIp.v4.sync()}:${port}${path}`;
  console.log(`serverURL ${serverURL}`);
  return serverURL;
}
