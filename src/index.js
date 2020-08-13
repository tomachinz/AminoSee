#!/usr/bin/env node
"use strict"
process.title = "aminosee.funk.nz (starting)"
// require("./aminosee-cli.js")() // toms way
// require("./aminosee-carlo.js")() // toms way

require('./aminosee-carlo.js').run();
