const aminosee = require('./aminosee-cli');

// let pjson = require('../package.json');
let fs = require('fs');
let path = require('path');
// let log = aminosee.log;
// module.exports.settings = settings;

// console.log(pjson.version); // This will print the version
const base = process.env.PWD;

// *********** SETTINGS FILE ENABLES CLIENT TO SEE VALUES IN package.json
let packagefile = base + '/package.json';

function gracefulShutdown() {
  aminosee.log("[custom sigterm received] @Aminosee settings.js");

  aminosee.gracefulQuit();
  // process.exit(); // now the "exit" event will fire
}
process.on("SIGTERM", () => {
  // aminosee.log('SIGTERM');
  // aminosee.gracefulQuit();

  // aminosee.quit(130, 'SIGTERM');
  // quit();
  process.exitCode = 130;
  process.exit(); // now the "exit" event will fire
});
process.on("SIGINT", function() {
  // aminosee.log('SIGINT');
  // aminosee.gracefulQuit();
  // aminosee.quit(130, 'SIGINT');

});

// module.exports = function getSettings() {
//   const settings = {
//     name: process.env.npm_package_name,
//     description: process.env.npm_package_description,
//     platform: process.platform,
//     version: process.env.npm_package_version,
//     strap: process.env.npm_package_strap
//   }
//
//   return settings;
// }
const settings = {
  name: process.env.npm_package_name,
  description: process.env.npm_package_description,
  platform: process.platform,
  version: process.env.npm_package_version,
  strap: process.env.npm_package_strap
}

module.exports.settings = settings;
// module.exports.version = version;


// console.log(settings.version)
// var fs = require('fs');

// fs.readFile(path.resolve(process.cwd() + "/package.json"), 'utf8', function(err, contents) {
  // obj = JSON.parse(contents);
  // console.log(obj.version +  " this version");
  // console.log('after calling readFile');

// });

// console.log('before calling readFile');


// https://www.valentinog.com/blog/http-requests-node-js-async-await/
const fetch = require("node-fetch");
const url = "https://raw.githubusercontent.com/tomachinz/AminoSee/master/package.json";
const getData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json.version +  " github latest version");
  } catch (error) {
    console.log(error);
  }
};
// getData(url);
