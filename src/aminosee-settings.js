const aminosee = require('./aminosee-cli')
// let pjson = require('../package.json')
// let packagefile = path.join(base, 'package.json')
let fs = require('fs')
let path = require('path')
const fetch = require('node-fetch');

// console.log(pjson.version); // This will print the version
const base = process.env.PWD;

// *********** SETTINGS FILE ENABLES CLIENT TO SEE VALUES IN package.json

function gracefulShutdown() {
  aminosee.log("[custom sigterm received] @Aminosee settings.js")
  // aminosee.gracefulQuit()
}


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
  strap: process.env.npm_package_strap,
  verbose: false
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
const url = "https://raw.githubusercontent.com/tomachinz/AminoSee/master/package.json";
const getData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json.version +  " github latest version");
  } catch (error) {
    console.log(`settings: ${error}`);
  }
};
// getData(url);
