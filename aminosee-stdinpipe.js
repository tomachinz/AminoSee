// https://gist.github.com/rjz/9501304

// Depends on `through`
//
//     $ npm install through
//
// Usage:
//
//     $ echo 'hello' | node stdin-and-fs-stream.js
//     $ echo 'hello' > tmp && node stdin-and-fs-stream.js tmp
//
var fs = require('fs'),
    through = require('through');

var tr = through(function (buf) {
  console.log(buf.toString());
});


var stream;

if (process.argv.length > 2) {
  stream = fs.createReadStream(process.argv[2]);
}
else {
  stream = process.stdin;
  setImmediate(function () {
    stream.push(null);
  });
}

stream.pipe(tr).pipe(process.stdout);


// returns ReadStream

const EventEmitter = require('events');
module.exports = 'Hello world';
module.exports = function (c) {
  this.isPipingNow = false;
  this.isComplete = false;
  this.filename = "stdinpipe.txt";
  this.filesize = -1; // -1 is flag to indicate std in stream of infinite size.
  if (c == undefined || c.isNaN) {
    this.codonsPerPixel = 32; // equivalent to CLI flag -c 32 this squeezes 32 amino acid codons per pixel due to the assumption you are piping std in because it is a very ENORMOUS file!
  } else {
    this.codonsPerPixel = c; // users setting
  }
  this.checkIsPipeActive = function () {
    return this.isPipingNow;
  }
  this.checkComplete = function () {
    return this.isComplete;
  }
  this.stdinLineByLine = function () {
    const stdin = new EventEmitter();
    let buff = "";

    process.stdin
    .on('data', data => {
      this.isPipingNow = true;
      console.log("std in has data streams")
      buff += data;
      lines = buff.split(/[\r\n|\n]/);
      buff = lines.pop();
      lines.forEach(line => stdin.emit('line', line));
    })
    .on('end', () => {
      console.log("std in stream has finished")

      if (buff.length > 0) stdin.emit('line', buff);
      this.isComplete = true;
      this.isPipingNow = false;
    });

    return stdin;
  }
  // return readStream = process.stdin
}
// sets up event listener that masquerades as a file with size -1
// aminosee will detect -1 and process the file
// otherwise, it maybe best to give the filename as arguments and let aminosee read it from disk

// function stdInPipeAsFile() {
//
// }
// function stdinLineByLine() {
//
// }

// const stdin = stdinLineByLine();
// stdin.on('line', console.log);
