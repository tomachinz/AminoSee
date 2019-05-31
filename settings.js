let aminosee = require('./aminosee-cli');
// let pjson = require('../package.json');
let fs = require('fs');

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
  aminosee.log('SIGTERM');
  gracefulShutdown();
  process.exit(); // now the "exit" event will fire
});
process.on("SIGINT", function() {
  aminosee.log('SIGINT');
  gracefulShutdown();
  process.exit(); // now the "exit" event will fire
});


module.exports = function getSettings() {
  const settings = {
    name: process.env.npm_package_name,
    description: process.env.npm_package_description,
    platform: process.platform,
    version: process.env.npm_package_version,
    strap: process.env.npm_package_strap
  }

  return settings;
}



// console.log(settings.version)
