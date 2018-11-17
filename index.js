// "use strict";

//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.co.nz
//        ah-mee no-see       "I See It Now - I AminoSee it!"

let devmode = false; // kills the auto opening of reports etc
let verbose = false; // not recommended. will slow down due to console.
let force = false; // force overwrite existing PNG and HTML reports
let artistic = false; // for Charlie
let CRASH = false; // hopefully not
let clear; // clear the terminal each update
let msPerUpdate = 200; // milliseconds per  update
const maxMsPerUpdate = 12000; // milliseconds per update
let cyclesPerUpdate = 100; // start valuue only this is auto tuneded to users computer speed based on msPerUpdate
let codonsPerPixel = 1; // this gives an AMAZING regular texture. current contender for the standard. .
const minimist = require('minimist')
const fetch = require("node-fetch");
const path = require('path');
const opn = require('./node_modules/opn');
const parse = require('./node_modules/parse-apache-directory-index');
let fs = require("fs");
let request = require('request');
let histogram = require('ascii-histogram');
let bytes = require('bytes');
let Jimp = require('jimp');
let PNG = require('pngjs').PNG;
const appPath = require.main.filename;
let codonRGBA, geneRGBA, mixRGBA = [0,0,0,0]; // codonRGBA is colour of last codon, geneRGBA is temporary pixel colour before painting.
const widthMax = 1920/2;
const golden = true;
const resSD = 960*768;
const resHD = 1920*1080;
const res4K = 1920*1080*4;
let rgbArray = []; // um.
const maxcolorpix = resSD; // for large genomes
const colormapsize = resSD*4; // custom fit.
let red = 0;
let green = 0;
let blue = 0;
let alpha = 0;
let charClock = 0; // its 'i' from the main loop
let errorClock = 0; // increment each non DNA, such as line break. is reset after each codon
let breakClock = 0;
let streamLineNr = 0;
let genomeSize = 0;
let proteinBrightness = 0.7;
let startStopBrightness = 2.1;
let opacity = proteinBrightness / codonsPerPixel; // 0.9 is used to make it brighter, also due to line breaks
const proteinHighlight = 6; // px only use in artistic mode.
const startStopHighlight = 6; // px only use in artistic mode.
let filename, filenamePNG, reader, hilbertPoints, herbs, levels, progress, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, textFile, rawDNA, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, fileUploadShowing, testColors, chunksMax, chunksize, chunksizeBytes, baseChars, cpu, subdivisions, renderSummary, contextBitmap, aminoacid, colClock, start, updateClock, percentComplete, kBytesPerSecond, pixelStacking, isStartStopCodon, justNameOfDNA, justNameOfPNG, sliceDNA, filenameHTML, howManyFiles;
process.title = "aminosee.funk.nz";
rawDNA ="@"; // debug
filename = "[LOADING]"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.
const extensions = [ "txt", "fa", "mfa", "gbk", "dna"];
let status = "load";
setupFNames();
// opn("megabase.aminosee_z2_artistic.png"); // <-- this can crash the flow

module.exports = () => {
  status = "exports";
  welcomeMessage();

  const args = minimist(process.argv.slice(2), {
    boolean: [ 'artistic' ],
    boolean: [ 'devmode' ],
    boolean: [ 'clear' ],
    string: [ 'width'],
    string: [ 'codons'],
    alias: { a: 'artistic', c: 'codons', f: 'force', d: 'devmode', w: 'width', v: 'verbose' },
    default: { clear: true },
    '--': true,

  });

  console.dir(args);
  if (args.width || args.w) {
    widthMax = Math.round(args.width || args.w);
    if (widthMax < 1) {
      widthMax = 1;
    } else if (widthMax > 10000) {
      widthMax = 10000;
    }
    output("using custom width: "+ widthMax);
  }
  if (args.codons || args.c || args.z ) {
    codonsPerPixel = Math.round(args.codons || args.c || args.z); // javascript is amazing
    if (codonsPerPixel < 1) {
      codonsPerPixel = 1;
    } else if (codonsPerPixel > 6000) {
      codonsPerPixel = 6000;
    }
    opacity = 0.95 / codonsPerPixel;
    output(`shrink the image by blending ${codonsPerPixel} codons per pixel.`);
  }
  if (args.artistic || args.a) {
    output(`artistic enabled. Start (Methione = Green) and Stop codons (Amber, Ochre, Opal) interupt the pixel timing creating columns. protein coding codons are diluted they are made ${Math.round(opacity*100).toLocaleString()}% translucent and ${codonsPerPixel} of them are blended together to make one colour that is then faded across ${proteinHighlight} pixels horizontally. The start/stop codons get a whole pixel to themselves, and are faded across ${startStopHighlight} pixels horizontally.`);
    artistic = true;
  } else {
    output("1:1 science mode enabled.");
    artistic = false;
  }
  if (args.verbose || args.v) {
    output("verbose enabled.");
    verbose = true;
  }
  if (args.devmode || args.debug || args.d) {
    output("devmode enabled.");
    devmode = true;
  }
  if (args.force || args.f) {
    output("force overwrite enabled.");
    force = true;
  }
  if (args.help || args.h) {
    output("Hello. I've not made a help file yet.");
  }

  if (args.clear || args.c) {
    output("screen clearing enabled.");
    clear = true;
  } else {
    output("clear screen disabled.");
    clear = false;
  }

  let cmd = args._[0];
  howManyFiles = args._.length;
  output("howManyFiles: "+ howManyFiles+ " cmd: " + cmd)
  if (howManyFiles > 0) {
    filename = path.resolve(cmd);
  } else {
    log("no files provided, exiting")
    setTimeout(() => {
      printRadMessage();
      output("bye");
      process.exit();
    }, 1000);
  }
  switch (cmd) {
    case 'unknown':
    output(` [unknown argument] ${cmd}`);
    break;

    case 'serve':
    launchNonBlockingServer();
    break;

    case 'help':
    helpCmd(args);
    break;

    case 'tick':
    createTick();
    break

    default:
    if (cmd == undefined) {
      output(`cmd == undefined [all args] ${args._}`);
      status = "no command";
      // output(radMessage);
      // launchBlockingServer();
      // launchNonBlockingServer();
    } else {
      output(` [all args] ${args._}`);
      status = "pre-streaming";
      // processNewStreamingMethod(filename);
      // processOldWayNonStreamed(filename);

      for (cli = 0; cli < howManyFiles; cli++) {
        status = "args loop";

        asterix = args._[cli]
        output(` [ file batch ${cli+1} done, ${howManyFiles-cli} to go! ] ${asterix}`);
        setupFNames();
        output( terminalRGB( asterix, 200,100,64) );
        processNewStreamingMethod(asterix);
      }
      // https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
    }
    break;
  }
  status = "global";
}
function cmdTest() {
  output("started from CLI");
}

function removeFileExtension(f) {
  return f.substring(0, f.length - (getFileExtension(f).length+1));
}
function setupFNames() {
  let ext = ".aminosee_z" + codonsPerPixel;
  justNameOfDNA = replaceFilepathFileName(filename);
  // let posi = filename.indexOf(justNameOfDNA);
  // chop the extension for display:
  const extension = getFileExtension(filename);
  justNameOfDNA = removeFileExtension(justNameOfDNA);

  ( artistic ? ext += "_artistic" : ext += "_sci")

  // filenamePNG = filename.substring(0, filename.length-posi) + "/images/"  + ext + ".png";
  filenamePNG = removeFileExtension(filename) + ext + ".png";
  filenameHTML = removeFileExtension(filename) + ext + ".html";

  justNameOfPNG = justNameOfDNA + ext + ".png";
  justNameOfHTML = justNameOfDNA+ ext + ".html";

  output("FILENAMES SETUP AS: ");
  output(justNameOfDNA + " canonical name format: " + extension);
  output(justNameOfPNG);
  output(justNameOfHTML);
}

function launchNonBlockingServer() {

  const server = require('node-http-server');
  log("appPath " + appPath);
  server.deploy(
    {
      port: 3210,
      root: appPath
    }
  );



  // const server = require('http-server');
  // const { get, post } = server.router;
  // Launch server
  // server({ port: 3210 }, [
  //   get('/', ctx => 'Hello world!')
  // ]);

  //
  // const handleReq = function (req) {
  //   console.log("listening", req);
  // }
  //  server = httpServer.createServer({
  //   port: 3210,
  //   root: '../',
  //   robots: true,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Credentials': 'true'
  //   },
  // }, [get('/', ctx => 'Hello world!')]);


  // });
  // try {
  //   server.listen(3210);
  //   server.callback(null, handleReq);
  // } catch(e) {
  //   console.warn(e);
  // }
}

function openMiniWebsite() {
  // opn(`http://127.0.0.1:3210/${justNameOfHTML}`);

  opn('http://127.0.0.1:3210/');
  stat("Personal mini-Webserver starting up around now (hopefully) on port 3210");
  stat("visit http://127.0.0.1:3210/ in your browser to see 3D WebGL visualisation");
  console.log(terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10));
  console.log(terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200));
  stat("Control-C to quit");

}
function welcomeMessage() {
  printRadMessage();
  output('Welcome to the AminoSeeNoEvil DNA Viewer!');
  output('This CLI is to convert ASCII text files into .png graphics');
  output('works with .mfa .fa .gbk DNA text files');
  output(' ');
  output('flags:');
  output('     --verbose -v                          Verbose (dev mode)');
  // output('     --help -h                                    Help (todo)');
  output('     --force -f     (Overwrite existing .png file if present)');
  output('     --devmode -d         (dont automatically open the image)');
  output('     --artistitc -a  (creates a visual rhythm in the picture)');
  output('     --codons -c  1-6000            (default is 1 per pixel )');
  output(' ');
  output('use * to process all files in current directory');
  output('use serve to run the web server');
  output(terminalRGB('if you need some DNA try:', 255,255,200));
  output('wget https://www.funk.co.nz/aminosee/dna/megabase.fa');
  output(' ');
  output('usage: ');
  output('     aminosee [human-genome-DNA.txt]     (render file to image)');
  // output('     aminosee serve               (run viewer micro web server)');
  output('     aminosee *                       (render all files in dir)');
  output('     aminosee * -c 4 --force   (-c 4 reduces image size to 25%)');

}

function saveHistogram() {
  fs.writeFile(filenameHTML, legend(), function (err) {
    if (err) throw err;
    output('Saved histogram to: ' + filenameHTML);
  });
}
function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}
function getFileExtension(f) {
  let lastFive = f.slice(-5);
  return lastFive.replace(/.*\./, '').toLowerCase();
}
function parseFileForStream() {
  // var extensions = ["jpg", "jpeg", "txt", "png"];  // Globally defined
  // Get extension and make it lowercase
  // This uses a regex replace to remove everything up to
  // and including the last dot
  start = new Date().getTime();
  baseChars = getFilesizeInBytes(filename);

  const extension = getFileExtension(filename);
  output("[FILESIZE] " + baseChars.toLocaleString() + " extension: " + extension);

  if (extensions.indexOf(extension) < 0) {
    output("WRONG FILE EXTENSION: " + extension);
    return false;
  } else {
    log("File ext ok. Now checking PNG.")
    // if there is a png, dont render just quit
    if (checkIfPNGExists() == false) {
      try {
        fs.readFile(filenamePNG, function (err, data) {
          if (err) {
            // NO EXISTING PNG FOUND
            output("preparing to begin ingest stream: " + filename);
            return true;
          } else {
            log("Image MAYBE already rendered, use --force to overwrite");
            return false;
          }
        });
      } catch(e) {
        log("Unable to access disk.");
        console.warn(e);
        return true;
      }
    } else {
      log("Image already rendered, use --force to overwrite");
      return false;
    }
  }
  return true;
}
function processLine(l) {
  rawDNA = l;
  // output(l);
  let lineLength = l.length; // replaces baseChars
  let codon = "";

  for (column=0; column<lineLength; column++) {
    // build a three digit codon
    let c = cleanChar(l.charAt(column)); // has to be ATCG
    charClock++;
    // ERROR DETECTING
    // IMPLMENTED AFTER ENABLEDING "N" TO AFFECT THE IMAGE
    // ITS AT THE STAGE WHERE IT CAN EAT ANY FILE WITH DNA
    // BUT IF ANY META DATA CONTAINS THE WORD "CAT", "TAG" etc these are taken as coding (its a bug)
    while ( c == ".") { // biff it and get another
      // log(c);
      codon =  ""; // we wipe it because... codons should not cross line break boundaries.
      column++;
      c = cleanChar(l.charAt(column)); // line breaks
      charClock++;
      errorClock++;
      red = 0;
      green = 0;
      blue = 0;

      if (column > lineLength) {
        // log("BREAK - END OF LINE")
        breakClock++;
        break
      }
    }
    codon += c; // add the base
    // log(c);
    if (codon.length ==  3) {
      pixelStacking++;
      genomeSize++;
      codonRGBA = codonToRGBA(codon); // this will report alpha info
      if (CRASH) {
        output("IM CRASHING Y'ALL: " + codon);
        crashReport();
        process.exit();
      }
      codon = "";// wipe for next time

      // if ALPHA come back 1 = its a START/STOP codon
      // if ALPHA is 0.1 it is an amino acid that needs custom ALPHA
      alpha = codonRGBA[3].valueOf(); // either 0.1 or 1.0
      if (alpha == 1.0) { // 255 = 1.0
        isStartStopCodon = true;
      } else if (alpha == 0.1) { // protein coding codon
        isStartStopCodon = false;
      } else if (alpha == 0.0) {
        log("erm... why is alpha at 0.0? setting to 255");
      }
      alpha = 255;

      if (artistic != true) {
        // science mode blacks the pixel everytime:
        // mixRGBA[0] += 0; // red
        // mixRGBA[1] += 0; // green
        // mixRGBA[2] += 0; // blue
        // the first section TRUE does start/stop codons
        // the FALSE section does Amino acid codons
        if (isStartStopCodon) { // 255 = 1.0
          mixRGBA[0] += codonRGBA[0].valueOf() * startStopBrightness * opacity; // red
          mixRGBA[1] += codonRGBA[1].valueOf() * startStopBrightness * opacity; // green
          mixRGBA[2] += codonRGBA[2].valueOf() * startStopBrightness * opacity; // blue
          // paintPixel(); // unlike artistic mode it blends normally
        } else {
          //  not a START/STOP codon. Stack multiple codons per pixel.
          // HERE WE ADDITIVELY BUILD UP THE VALUES with +=
          mixRGBA[0] +=   parseFloat(codonRGBA[0].valueOf()) * opacity;
          mixRGBA[1] +=   parseFloat(codonRGBA[1].valueOf()) * opacity;
          mixRGBA[2] +=   parseFloat(codonRGBA[2].valueOf()) * opacity;
        }
        //  blends colour on one pixel
        if (pixelStacking >= codonsPerPixel) {
          red = mixRGBA[0];
          green = mixRGBA[1];
          blue = mixRGBA[2];
          paintPixel(); // FULL BRIGHTNESS
          // reset inks, using codonsPerPixel cycles for each pixel:
          mixRGBA[0] =   0;
          mixRGBA[1] =   0;
          mixRGBA[2] =   0;
          red = 0;
          green = 0;
          blue = 0;

        }
        // end science mode
      } else {


        // the first section TRUE does start/stop codons
        // the FALSE section does Amino acid codons
        if (isStartStopCodon) { // 255 = 1.0
          // FADE PREVIOUS COLOUR
          red = mixRGBA[0] * 1.5; // NOT SURE WHAT BRIGHTNESS IT WILL BE
          green = mixRGBA[0] * 1.5; // TRYING TO BRIGHTEN IT
          blue = mixRGBA[0] * 1.5;
          paintPixel(); // BRIGHTEN THE FIRST PIXEL BECAUSE ITS DIM
          red = red * 0.5;
          green = green * 0.5;
          blue = blue * 0.5;
          alpha = 200;
          paintPixel(); // DARKEST SPACER
          alpha = 255;
          red = 200;
          green = 200;
          blue = 200;
          red +=   parseFloat(codonRGBA[0].valueOf()) * 0.99;
          green += parseFloat(codonRGBA[1].valueOf()) * 0.99;
          blue +=  parseFloat(codonRGBA[2].valueOf()) * 0.99;
          paintPixel(); // BRIGHT OFF-WHITE SYNC DOT PIXEL
          // THIS IS THE FULL COLOUR OF THE CODON:
          // UNLIKE SCIENCE MODE, WE GIVE IT IT'S OWN PIXEL:
          red = codonRGBA[0].valueOf();
          green = codonRGBA[1].valueOf();
          blue = codonRGBA[2].valueOf();
          paintPixel(); // BRIGHT FULL SATURATION START STOP CODON
          red = red / 1.5;
          green = green / 1.5;
          blue = blue / 1.5;
          paintPixel();
          red = red / 1.5;
          green = green / 1.5;
          blue = blue / 1.5;
          paintPixel();

        } else {
          //  not a START/STOP codon. Stack four colours per pixel.
          //  isStartStopCodon = false;

          // HERE WE ADDITIVELY BUILD UP THE VALUES with +=
          mixRGBA[0] +=   parseFloat(codonRGBA[0].valueOf()) * opacity;
          mixRGBA[1] +=   parseFloat(codonRGBA[1].valueOf()) * opacity;
          mixRGBA[2] +=   parseFloat(codonRGBA[2].valueOf()) * opacity;
        }
        // blends colour on one pixel
        if (pixelStacking >= codonsPerPixel) {

          red = 0;
          green = 0;
          blue = 0; // START WITH BLACK
          paintPixel();
          red = mixRGBA[0];
          green = mixRGBA[1];
          blue = mixRGBA[2];
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();
          red = red / 1.1;
          green = green / 1.1;
          blue = blue / 1.1;
          paintPixel();

          // reset inks:
          pixelStacking = 0;
          mixRGBA[0] ==   0;
          mixRGBA[1] ==   0;
          mixRGBA[2] ==   0;
        } // artistic mode
      } // artistic

    } // END OF MAIN LOOP!
  }
}
function legend() {
  var html = `<html>
  <head>
  <link rel="stylesheet" type="text/css" href="https://www.funk.co.nz/aminosee/public/AminoSee.css">
  <link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
  <link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
  <link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet">
  </head>
  <body>
  <h1>Histogram for ${justNameOfDNA}</h1>

  <a href="#scrollDownToSeeImage" class="button" title"Click To Scroll Down To See Image">Scroll To Image</a>


  <div id="monkeys">
  <div><a href="http://aminosee.funk.co.nz/">
  <input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollDownToSeeImage'"><br>

  <img src="https://www.funk.co.nz/aminosee/aminosee/seenoevilmonkeys.jpg">

  <!-- <h1>AminoSeeNoEvil</h1> -->
  <h1>Amino<span style="color: #888888;">See</span><span style="color: #dddddd;">NoEvil</span></h1>
  <div class="hidable">
  <h2 id="h2">DNA/RNA Chromosome Viewer</h2>
  <p id="description" class="fineprint hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon triplet</p>



  </div>
  </a>
  </div>
  </div>
  <table>
  <thead>
  <tr>
  <th>Amino Acid</th>
  <th>Hue</th>
  <th>RGB</th>
  <th>Count</th>
  <th>Description</th>
  </tr>
  </thead>
  <tbody>
  `;
  // histoGRAM = [Codon, Description, Hue, Alpha, Histocount]
  for (i=0; i<histoGRAM.length; i++) {
    let theHue = histoGRAM[i].Hue;
    log(theHue);
    let c = hsvToRgb( theHue, 0.5, 1.0 );
    // const c = hsvToRgb( histoGRAM[i].Hue );
    html += `
    <tr style="background-color: hsl(${theHue}, 50%, 100%);">
    <td style="background-color: white;">${histoGRAM[i].Codon}</td>
    <td style="background-color: hsl(${theHue}, 50%, 100%);">${theHue}°</td>
    <!--  <td>${c[0]},${c[1]},${c[2]}  #NOTWORK</td> -->
    <td>${histoGRAM[i].Histocount}</td>
    <td>${histoGRAM[i].Description}</td>
    </tr>
    `
  }
  html += `
  </tbody>
  <tfoot>
  <tr>
  <td>19 Amino Acids, 4 Start/Stop codes, 1 NNN</td>
  <td>.</td>
  <td>.</td>
  <td>.</td>
  <td>.</td>
  </tr>
  </tfoot>
  </table>
  <a name="scrollDownToSeeImage" ></a>
  <a href="${justNameOfPNG}" ><img src="${justNameOfPNG}"></a>

  <h2>About Start and Stop Codons</h2>
  <p>The codon AUG is called the START codon as it the first codon in the transcribed mRNA that undergoes translation. AUG is the most common START codon and it codes for the amino acid methionine (Met) in eukaryotes and formyl methionine (fMet) in prokaryotes. During protein synthesis, the tRNA recognizes the START codon AUG with the help of some initiation factors and starts translation of mRNA.

  Some alternative START codons are found in both eukaryotes and prokaryotes. Alternate codons usually code for amino acids other than methionine, but when they act as START codons they code for Met due to the use of a separate initiator tRNA.

  Non-AUG START codons are rarely found in eukaryotic genomes. Apart from the usual Met codon, mammalian cells can also START translation with the amino acid leucine with the help of a leucyl-tRNA decoding the CUG codon. Mitochondrial genomes use AUA and AUU in humans and GUG and UUG in prokaryotes as alternate START codons.

  In prokaryotes, E. coli is found to use AUG 83%, GUG 14%, and UUG 3% as START codons. The lacA and lacI coding regions in the E coli lac operon don’t have AUG START codon and instead use UUG and GUG as initiation codons respectively.</p>
  `;
  return html;
}
function processNewStreamingMethod(f) {
  var fs = require('fs')
  , es = require('event-stream');

  filename = f; // set a global. i know. god i gotta stop using those.
  setupFNames();
  output(` [ cli parameter: ${f} ]`);
  output(` [ justNameOfDNA: ${justNameOfDNA} ]`);

  if (parseFileForStream() == true) {
    output(justNameOfDNA + " was parsed OK. ");
  } else {
    output("STOPPING. parseFileForStream returned false for: " + filename);
    return false;
  };
  percentComplete = 0;
  genomeSize = 0; // number of codons.
  pixelStacking = 0; // how we fit more than one codon on each pixel
  colClock = 0; // which pixel are we painting?
  alpha = 255;
  log("STARTING MAIN LOOP");
  status = "args loop";
  clearPrint(drawHistogram()); // MAKE THE HISTOGRAM

  var s = fs.createReadStream(f).pipe(es.split()).pipe(es.mapSync(function(line){
    // pause the readstream
    s.pause();
    streamLineNr++;
    // process line here and call s.resume() when rdy
    // function below was for logging memory usage
    processLine(line);
    // resume the readstream, possibly from a callback
    s.resume();
  })
  .on('error', function(err){
    output('Error while reading file: ' + filename, err);
  })
  .on('end', function(){
    clearPrint('Stream complete.');
    status ="complete";
    // finalUpdate(); // last update
    percentComplete = 100;
    renderSummary += `
    Filename: ${justNameOfDNA}
    Image Size: ${Math.round(colormapsize/100000)/10} Megapixels
    Input bytes: ${baseChars}
    Codons per pixel: ${codonsPerPixel}
    Codon triplets matched: ${genomeSize}
    Amino acid blend opacity: ${Math.round(opacity*10000)/100}%
    Error Clock: ${errorClock}
    `;
    log("preparing to store: " + colormapsize.toLocaleString() + " pixels");
    log("length in bytes rgba " + rgbArray.length.toLocaleString());
    // finalUpdate();
    // let renderSummary = "";
    arrayToPNG(); // fingers crossed!
    status = "saving";
    // if (!devmode) {
    // saveHistogram();
    // }
  }));
}
function helpCmd(args) {
  output("Help section." + args);
}

function checkIfPNGExists() {
  output("checkIfPNGExists RUNNING");
  if (force == true) {
    log("force == true");
    return false;
  } else {
    log("force == false");
  }
  let imageExists, result;
  imageExists = false;
  // log("fs.lstatSync(filenamePNG)" + fs.lstatSync(filenamePNG)).isDirectory();
  try {
    result = fs.lstatSync(filenamePNG).isDirectory;
    // output("[result]" + result);
    output("An png image has already been generated for this DNA: " + filenamePNG)
    output("use -f to overwrite");
    imageExists = true;
  } catch(e){
    // Handle error
    if(e.code == 'ENOENT'){
      //no such file or directory
      output(e);
    }
    output("Output png will be saved to: " + filenamePNG );
    imageExists = false;
  }
  // output("value of imageExists is "+ imageExists);
  return imageExists;
}

function stat(txt) {
  console.log(txt);
}

function toBuffer(ab) {
  var buf = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

function arrayToPNG() {

  let pixels, height, width;
  let golden = true; // golden section ratio.

  bytes = rgbArray.length;
  pixels = (rgbArray.length / 4) + 1 ; // to avoid the dreaded "off by one error"... one exra pixel wont bother nobody

  // if (golden) { // thanks to https://www.omnicalculator.com/math/golden-ratio

  // if (square || golden) {
  //   width = Math.round(Math.sqrt(pixels + 2));
  //   height = width;
  // }
  if (golden) {
    width = Math.sqrt(pixels + 2);
    height = width;
    let phi = ((Math.sqrt(5) + 1) / 2) ; // 1.618033988749895
    width =  ( height * phi ) - height; // 16.18 * 6.18 = 99.99
    height = pixels / width;
    width = Math.round(width);
    height = Math.round(height);
    output("GOLDEN CHECK: pixels: " + pixels + " width x height = " + (width*height));
  } else {
    if (pixels <= widthMax) {
      width = pixels;
      height = 1;
    } else {
      width = widthMax;
      height = Math.round((pixels / widthMax) - 0.49); // you can have half a line. more and its an extra vert line
      if (height<1) {
        height=1;
      }
    }
  }

  output("Raw image bytes: " + bytes.toLocaleString());
  output("Pixels: " + pixels.toLocaleString());
  output("Dimensions: " + width + "x"   + height);
  output("GOLDEN CHECK: width x height = " + (width*height).toLocaleString());
  output("First 100  bytes: " + rgbArray.slice(0,99));

  var img_data = Uint8ClampedArray.from(rgbArray);
  var img_png = new PNG({width: width, height: height})
  img_png.data = Buffer.from(img_data);
  img_png.pack().pipe(fs.createWriteStream(filenamePNG));
  // createTick();
  setImmediate(() => {
    output("Input DNA: " + filename)
    output("Saved PNG: " + filenamePNG);
    // output("value returned by parseFileForStream " + parseFileForStream());
    if (!devmode) {
      output("Opening your image in 3 seconds... either quit image viewer or Control-c ")
      output("To prevent automatically opening the image, use --devmode option")
      setTimeout(() => {
        opn(filenamePNG);
      }, 3000);
    }
  });
}



function replaceFilepathFileName(f) {
  return f.replace(/^.*[\\\/]/, '');
}
function makeRequest(url) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // Note: synchronous
    xhr.responseType = 'arraybuffer';
    xhr.send();
    return xhr.response;
  } catch(e) {
    return "XHR Error " + e.toString();
  }
}
function output(txt) {
  console.log("["+ status +"] " + txt);
}
function log(txt) {
  if (verbose) {
    let d = new Date().getTime();
    process.stdout.write("[ " + d.toLocaleString() + " ] " + txt + " ");
  } else {
    process.stdout.write(".");
  }
}
function isAminoAcid(acid) {
  return acid.Codon === acid;
}
function init() {
  // make a HISTOGRAM of amino acids found.
  for (i=0; i < aminoacidcolours.length; i++) {
    aminoacidcolours[i].Histocount = 0;

  }
  for (i=0; i < histoGRAM.length; i++) {
    histoGRAM[i].Histocount = 0;
    // histoGRAM[i].Histocount  = 0;
  }
}
function onError(e) {
  output('ERROR: ' + e.toString());
}

const onBrowserMessage = function (e) {
  output("onBrowserMessage");
  switch (e.data.aTopic) {


    case 'do_FileInfo':
    renderSummary = e.data.renderSummary;
    Math.round(cpu/1000) + " K iops "
    stat("[renderSummary] " + renderSummary);
    break;


    default:
    output("[downloader DEFAULT] ");// + e.data);
  }
}

onmessage = function(e) {
  log("%c [worker] [onmessage] 'background: #aff; color: #004;'");
  log("[worker] [onmessage] ");
  switch (e.data.aTopic) {

    case 'do_Wakeup':
    output(init());

    case 'do_LoadURL':
    fetch(e.data.url)
    .then(function(response) {
      return response.text();
    })
    .then(function do_LoadURL(txt) {
      // send a bunch of colour back:
      output("in side onmessage -   ");
      do_NewColorsArray(colors);
    });
    break;

    default:
    log("[downloader received no topic for this msg:] " + e.data);
  }

  var fileEntry, urlArrayBuffer;
  var data = e.data;
  // file = data.file;
  let files = e.data.files;
  // var userfiles = data.userfiles;

  numberOfFiles = e.data.length;

  // Make sure we have the right parameters.
  if (numberOfFiles >= 1 ) {
    output( "[working with] " + numberOfFiles + " files.");
    fetch(data[0].name)
    .then(function(response) {
      return response.text();
    })
    .then(function(txt) {
      output("[fetch file] " + txt.substring(0,500));
    });
  } else if (!data.filename || !data.url || !data.type ) {
    output("this function requires a file or url of plane text ASCII DNA base pairs");
    // return;
  }
}

function saveBitmap() {
  try {
    var fs = requestFileSystemSync(TEMPORARY, 1920 * 1080 * 3 ); /*  6220800 bytes 24 bit */
  } catch(e) {
    console.warn(e);
  }
  helloWorldBitmap("test");
}


// it used to chop the headers
// but not it just helps with the streaming read design.
function parseFileMeta() {
  // show users a sample of their file
  const first1k = rawDNA.substring(0,999);
  baseChars = rawDNA.length; // Size of file in bytes
  // ignore anything at the start of the file, it starts with 6 letters of base
  // var regexp = "/[ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun][ATCGUNatcgun]/";
  output("baseChars " + baseChars);
  output(removeLineBreaks(first1k.substring(0,360)));
}

// remove anything that isn't ATCG, convert U to T
function cleanChar(c) {
  // log(c);
  char = c.toUpperCase();
  if (char == "A" || char == "C" || char == "G" || char == "T" || char == "U") {
    if (char == "U") {
      return "T"; // convert RNA into DNA
    } else {
      return char; // add it to the clean string
    }
  } else {
    return "."; // remove line breaks etc.
  }
}
function removeLineBreaks(txt) {
  return txt.replace(/(\r\n\t|\n|\r\t)/gm,"");
}
function cleanString(s) {
  let ret = "";
  // remove line breaks:
  s = removeLineBreaks(s);

  for (i=0; i< s.length; i++) {
    ret += cleanChar(s.charAt(i));
  }
  return ret;
}
function paintPixel() {
  status = "paint";
  let byteIndex = colClock * 4; // 4 bytes per pixel. RGBA.

  rgbArray.push(Math.round(red));
  rgbArray.push(Math.round(green));
  rgbArray.push(Math.round(blue));
  rgbArray.push(Math.round(alpha));
  pixelStacking = 0;
  colClock++;
}

function clearPrint(t) {
  if (clear) {
    // process.stdout.write('\x1B[2J\x1B[0f');
    // process.stdout.write("\r\x1b[K");
    // process.stdout.write('\033c');
    // console.log('\033c');
    // process.stdout.write("\x1B[2J");
    console.log('\x1Bc');

  } else {
    output("noclear");
  }
  printRadMessage();
  process.stdout.write(t)

}

function renderPixels() {

}


function prettyDate() {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today  = new Date();

  return today.toLocaleString(options) + "  " + today.toLocaleDateString(options); // Saturday, September 17, 2016
}
function printRadMessage() {
  console.log(terminalRGB("╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐\r", 255, 60, 250) );
  console.log(terminalRGB("╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘\r", 128, 128, 255) );
  console.log(terminalRGB("╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─\r", 128, 240, 240) );
  console.log(terminalRGB(" by Tom Atkinson           aminosee.funk.co.nz      \r", 225, 225, 130) );
  console.log(terminalRGB("  ah-mee-no-see      'I See It Now - I AminoSee it!' \r", 255, 180, 90) );
  console.log("        " + prettyDate() + "\r");
}

function crashReport() {
  dnaTail();
}
function drawHistogram() {
  percentComplete = Math.round(charClock / baseChars * 10000) / 100;
  let now = new Date().getTime();
  let runningDuration = now - start;
  let kCodonsPerSecond = Math.round(genomeSize+1 / runningDuration+1);
  let kBytesPerSecond = Math.round(charClock+1 / runningDuration+1);
  let timeRemain = Math.round(runningDuration * ((baseChars-charClock)/charClock+1)/1000);
  let text = status + lineBreak;
  let aacdata = [];

  if (msPerUpdate < maxMsPerUpdate) {
    msPerUpdate += 20; // begin to not update screen so much over time
  }
  cyclesPerUpdate = kCodonsPerSecond * msPerUpdate; // one update per second, or 1.8.

  // OPTIMISE i should not be creating a new array each frame!
  for (h=0;h<histoGRAM.length;h++) {
    aacdata[histoGRAM[h].Codon] = histoGRAM[h].Histocount ;
  }
  text += lineBreak;

  text += ` @i ${charClock.toLocaleString()} File: ${terminalRGB(justNameOfDNA, 255, 255, 255)} Line breaks: ${breakClock}`;
  // text += terminalRGB(aminoacid, red, green, blue);
  text += lineBreak;

  if (status == "complete" || status == "stopped") {
    text += `  [ PROCESSING COMPLETE | Time used: ${runningDuration.toLocaleString()}]`;
    percentComplete = 100;
    msPerUpdate = 0;
    output(text);
    output(" DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE DONE ");
    clearTimeout();
    status = "stopped";
  } else {
    if (status == "args loop" || status == "global" || status == "paint") {

      if (status == "saving") {
        text += terminalRGB("   [ SAVING IMAGE ]", 128, 255, 128);
      }

      if (baseChars - charClock > 10 || status != "complete") {
        setTimeout(() => {

          clearPrint(drawHistogram()); // MAKE THE HISTOGRAM AGAIN LATER

        }, msPerUpdate);
        output("updates should continue.")

      } else {
        output("updates should stop.")
      }
    }
  }
  if (artistic) {  }
  ( artistic ? text += ` [ Artistic Mode 1:${proteinHighlight}]` : text += " [ Science Mode 1:1]" )
  text += `[ Time remain: ${timeRemain.toLocaleString()}sec Elapsed: ${Math.round(runningDuration/1000)}sec KB remain: ${(Math.round((baseChars - charClock)/1000)).toLocaleString()} Next update: ${msPerUpdate.toLocaleString()}ms ]`;
  text += `
  [ ${percentComplete}% done Codons: ${genomeSize.toLocaleString()}]  Last Acid: `;
  text += terminalRGB(aminoacid, red, green, blue);
  text += lineBreak;
  text += ` [ CPU ${Math.round(kBytesPerSecond/1000).toLocaleString()} Kb/s ${Math.round(kCodonsPerSecond).toLocaleString()} Codons/s  ] `;
  text += lineBreak;
  text += `[ Mb Codons per pixel: ${codonsPerPixel} Pixels painted: ${colClock.toLocaleString()} ] `;

  text += `[ DNA Filesize: ${Math.round(baseChars/1000)/1000} MB Codon Opacity: ${opacity}] `;
  text += lineBreak;

  text += "\r";
  text += "\r";
  text += "\r";
  text += histogram(aacdata, { bar: '/', width: 40, sort: true, map:  aacdata.Histocount} );
  text += "\r";
  text += `  [ raw:   ${ removeLineBreaks(rawDNA)} ]  [ clean: ${ cleanString(rawDNA)} ] `;
  text += "                  " + filename;
  // text +=  (verbose ! "V" : " ")+(devmode ! "D" : " ")+(artistic ! "A" : "S")+codonsPerPixel+(golden ! "GOLD" : "T960")
  return text;
}

function isCodon(cdn) {
  return cdn == this.Codon;
}
// *
// take 3 letters, convert into a Uint8ClampedArray with 4 items
function codonToRGBA(cod) {
  // log(cod);
  aminoacid = "ERROR";
  for (z=0; z<aminoacidcolours.length; z++) {
    if (cod == aminoacidcolours[z].DNA) { // SUCCESSFUL MATCH (convert to map)
      aminoacid = aminoacidcolours[z].Codon;
      aminoacidcolours[z].Histocount++;

      for (h=0; h<histoGRAM.length; h++) {

        if (aminoacid == histoGRAM[h].Codon) {
          histoGRAM[h].Histocount++;

          if (aminoacid == "Amber" || aminoacid == "Ochre" || aminoacid == "Opal" ) {
            histoGRAM.indexOf("STOP Codon").Histocount++;
          } else if (aminoacid == "Methione") {
            histoGRAM[histoGRAM.indexOf("START Codon")].Histocount++;

          }
          break
        }
      }

      alpha = aminoacidcolours[z].Alpha;
      let hue = aminoacidcolours[z].Hue / 360;
      let tempcolor = hsvToRgb(hue, 1, 1);
      // RED, GREEN, BLUE, ALPHA
      red   = tempcolor[0];
      green = tempcolor[1];
      blue  = tempcolor[2];

      // log(terminalRGB(aminoacid, red, green, blue));

      return [red, green, blue, alpha];
    }
  }
  if ( aminoacid == "ERROR" ) {
    aminoacid = "ERROR " + cod;
    CRASH = true;
  }
  return [13,255,13,128]; // this colour means "ERROR".
}


function terminalRGB(_text, _r, _g, _b) {
  return "\x1b[38;2;" + _r + ";" + _g + ";" + _b + "m" + _text + "\x1b[0m";
};

let aminoacidcolours = [
  {
    "DNA": "AAA",
    "Codon": "Lysine",
    "Hue": 313,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AAC",
    "Codon": "Asparagine",
    "Hue": 266,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AAG",
    "Codon": "Lysine",
    "Hue": 313,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AAT",
    "Codon": "Asparagine",
    "Hue": 266,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ACA",
    "Codon": "Threonine",
    "Hue": 219,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ACC",
    "Codon": "Threonine",
    "Hue": 219,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ACG",
    "Codon": "Threonine",
    "Hue": 219,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ACT",
    "Codon": "Threonine",
    "Hue": 219,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AGA",
    "Codon": "Arginine",
    "Hue": 297,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AGC",
    "Codon": "Serine",
    "Hue": 203,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AGG",
    "Codon": "Arginine",
    "Hue": 297,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "AGT",
    "Codon": "Serine",
    "Hue": 203,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ATA",
    "Codon": "Isoleucine",
    "Hue": 157,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ATC",
    "Codon": "Isoleucine",
    "Hue": 157,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "ATG",
    "Codon": "Methionine",
    "Hue": 110,
    "Alpha": 1,
    "Histocount": 0,
  },
  {
    "DNA": "ATT",
    "Codon": "Isoleucine",
    "Hue": 157,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CAA",
    "Codon": "Glutamine",
    "Hue": 250,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CAC",
    "Codon": "Histidine",
    "Hue": 329,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CAG",
    "Codon": "Glutamine",
    "Hue": 250,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CAT",
    "Codon": "Histidine",
    "Hue": 329,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CCA",
    "Codon": "Proline",
    "Hue": 344,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CCC",
    "Codon": "Proline",
    "Hue": 344,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CCG",
    "Codon": "Proline",
    "Hue": 344,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CCT",
    "Codon": "Proline",
    "Hue": 344,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CGA",
    "Codon": "Arginine",
    "Hue": 297,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CGC",
    "Codon": "Arginine",
    "Hue": 297,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CGG",
    "Codon": "Arginine",
    "Hue": 297,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CGT",
    "Codon": "Arginine",
    "Hue": 297,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CTA",
    "Codon": "Leucine",
    "Hue": 141,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CTC",
    "Codon": "Leucine",
    "Hue": 141,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CTG",
    "Codon": "Leucine",
    "Hue": 141,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "CTT",
    "Codon": "Leucine",
    "Hue": 141,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GAA",
    "Codon": "Glutamic acid",
    "Hue": 16,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GAC",
    "Codon": "Aspartic acid",
    "Hue": 31,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GAG",
    "Codon": "Glutamic acid",
    "Hue": 16,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GAT",
    "Codon": "Aspartic acid",
    "Hue": 31,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GCA",
    "Codon": "Alanine",
    "Hue": 94,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GCC",
    "Codon": "Alanine",
    "Hue": 94,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GCG",
    "Codon": "Alanine",
    "Hue": 94,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GCT",
    "Codon": "Alanine",
    "Hue": 94,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GGA",
    "Codon": "Glycine",
    "Hue": 78,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GGC",
    "Codon": "Glycine",
    "Hue": 78,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GGG",
    "Codon": "Glycine",
    "Hue": 78,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GGT",
    "Codon": "Glycine",
    "Hue": 78,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GTA",
    "Codon": "Valine",
    "Hue": 125,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GTC",
    "Codon": "Valine",
    "Hue": 125,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GTG",
    "Codon": "Valine",
    "Hue": 125,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "GTT",
    "Codon": "Valine",
    "Hue": 125,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TAA",
    "Codon": "Ochre",
    "Hue": 0,
    "Alpha": 1,
    "Histocount": 0,
  },
  {
    "DNA": "TAC",
    "Codon": "Tyrosine",
    "Hue": 282,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TAG",
    "Codon": "Amber",
    "Hue": 47,
    "Alpha": 1,
    "Histocount": 0,
  },
  {
    "DNA": "TAT",
    "Codon": "Tyrosine",
    "Hue": 282,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TCA",
    "Codon": "Serine",
    "Hue": 203,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TCC",
    "Codon": "Serine",
    "Hue": 203,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TCG",
    "Codon": "Serine",
    "Hue": 203,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TCT",
    "Codon": "Serine",
    "Hue": 203,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TGA",
    "Codon": "Opal",
    "Hue": 240,
    "Alpha": 1,
    "Histocount": 0,
  },
  {
    "DNA": "TGC",
    "Codon": "Cysteine",
    "Hue": 63,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TGG",
    "Codon": "Tryptophan",
    "Hue": 188,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TGT",
    "Codon": "Cysteine",
    "Hue": 63,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TTA",
    "Codon": "Leucine",
    "Hue": 141,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TTC",
    "Codon": "Phenylalanine",
    "Hue": 172,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TTG",
    "Codon": "Leucine",
    "Hue": 141,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "TTT",
    "Codon": "Phenylalanine",
    "Hue": 172,
    "Alpha": 0.1,
    "Histocount": 0,
  },
  {
    "DNA": "NNN",
    "Codon": "Non-coding",
    "Hue": 120,
    "Alpha": 1.0,
    "Histocount": 0,
  },
  {
    "DNA": "",
    "Codon": "NoMatchError",
    "Hue": 120,
    "Alpha": 0,
    "Histocount": 0,
  }
]
;
/*
***************************************
***************************************
***************************************
*/


/**
* Converts an RGB color value to HSL. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes r, g, and b are contained in the set [0, 255] and
* returns h, s, and l in the set [0, 1].
*
* @param   Number  r       The red color value
* @param   Number  g       The green color value
* @param   Number  b       The blue color value
* @return  Array           The HSL representation
*/
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

/**
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  l       The lightness
* @return  Array           The RGB representation
*/
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

/**
* Converts an RGB color value to HSV. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSV_color_space.
* Assumes r, g, and b are contained in the set [0, 255] and
* returns h, s, and v in the set [0, 1].
*
* @param   Number  r       The red color value
* @param   Number  g       The green color value
* @param   Number  b       The blue color value
* @return  Array           The HSV representation
*/
function rgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}

/**
* Converts an HSV color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSV_color_space.
* Assumes h, s, and v are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  v       The value
* @return  Array           The RGB representation
*/
function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
}

// source: https://github.com/oliver-moran/jimp/blob/master/packages/core/src/index.js#L117
function isRawRGBAData(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number' &&
    (Buffer.isBuffer(obj.data) ||
    obj.data instanceof Uint8Array ||
    (typeof Uint8ClampedArray === 'function' &&
    obj.data instanceof Uint8ClampedArray)) &&
    (obj.data.length === obj.width * obj.height * 4 ||
      obj.data.length === obj.width * obj.height * 3)
    );
  }


  //PARSE SOURCE CODE
  // https://www.npmjs.com/package/parse-apache-directory-index

  function testParse() {
    console.log(parse(`
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
      <html>
      <head>
      <title>Index of /foo/bar</title>
      </head>
      <body>
      <h1>Index of /foo/bar</h1>
      <table><tr><th><img src="/icons/blank.gif" alt="[ICO]"></th><th><a href="?C=N;O=D">Name</a></th><th><a href="?C=M;O=A">Last modified</a></th><th><a href="?C=S;O=A">Size</a></th><th><a href="?C=D;O=A">Description</a></th></tr><tr><th colspan="5"><hr></th></tr>
      <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="beep/">beep/</a>           </td><td align="right">25-May-2016 11:53  </td><td align="right">  - </td><td>&nbsp;</td></tr>
      <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="boop20160518/">boop20160518/</a>        </td><td align="right">19-May-2016 17:57  </td><td align="right">  - </td><td>&nbsp;</td></tr>
      <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="jazz20160518/">jazz20160518/</a>         </td><td align="right">19-May-2016 19:04  </td><td align="right">  - </td><td>&nbsp;</td></tr>
      <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="punk20160518/">punk20160518/</a>    </td><td align="right">19-May-2016 17:47  </td><td align="right">  - </td><td>&nbsp;</td></tr>
      <tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="space20160518/">space20160518/</a>       </td><td align="right">19-May-2016 19:03  </td><td align="right">  - </td><td>&nbsp;</td></tr>
      <tr><th colspan="5"><hr></th></tr>
      </table>
      </body></html>
      `));

    }



    function createTick(n) {
      var fname = n + new Date().getTime() + "-tick.png";
      var img_width = 16;
      var img_height = 16;
      var tick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 133, 110, 6, 97, 137, 82, 249, 97, 142, 79, 255, 93, 142, 74, 255, 90, 140, 71, 255, 90, 142, 70, 255, 79, 129, 60, 250, 115, 134, 92, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 152, 125, 15, 111, 151, 96, 255, 223, 255, 209, 255, 174, 253, 148, 255, 158, 249, 126, 255, 141, 249, 103, 255, 71, 145, 43, 255, 68, 143, 42, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 158, 131, 20, 111, 153, 96, 255, 216, 255, 201, 255, 172, 247, 145, 255, 156, 244, 124, 255, 139, 242, 102, 255, 72, 145, 44, 255, 75, 144, 47, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 158, 131, 25, 110, 154, 94, 255, 196, 252, 178, 255, 157, 242, 125, 255, 144, 239, 110, 255, 129, 237, 91, 255, 70, 145, 42, 255, 70, 142, 43, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 132, 153, 128, 30, 107, 155, 90, 255, 177, 245, 151, 255, 134, 233, 100, 255, 125, 230, 87, 255, 114, 229, 73, 255, 69, 146, 41, 255, 66, 140, 40, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 126, 154, 120, 55, 103, 155, 83, 255, 154, 236, 125, 255, 111, 223, 71, 255, 109, 222, 69, 255, 109, 225, 69, 255, 69, 146, 40, 255, 63, 133, 41, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 116, 142, 107, 82, 100, 154, 79, 255, 145, 229, 114, 255, 103, 218, 62, 255, 105, 218, 65, 255, 106, 220, 66, 255, 69, 145, 39, 255, 67, 125, 49, 82, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71, 119, 56, 249, 126, 178, 106, 255, 122, 174, 104, 255, 128, 194, 105, 255, 140, 226, 109, 255, 105, 215, 65, 255, 103, 214, 63, 255, 104, 215, 63, 255, 84, 167, 53, 255, 78, 139, 54, 255, 78, 142, 54, 255, 71, 127, 50, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 91, 8, 240, 63, 157, 29, 255, 134, 222, 103, 255, 153, 229, 124, 255, 166, 233, 140, 255, 110, 213, 73, 255, 100, 210, 61, 255, 100, 210, 61, 255, 125, 221, 91, 255, 124, 221, 89, 255, 78, 179, 43, 255, 54, 122, 29, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 78, 7, 42, 39, 106, 14, 253, 60, 156, 26, 255, 120, 210, 88, 255, 127, 217, 96, 255, 119, 214, 85, 255, 96, 207, 56, 255, 98, 209, 59, 255, 95, 204, 56, 255, 70, 166, 37, 255, 57, 131, 30, 253, 48, 108, 24, 53, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 87, 9, 42, 42, 107, 18, 249, 63, 160, 28, 255, 107, 201, 73, 255, 121, 212, 88, 255, 108, 210, 72, 255, 87, 194, 50, 255, 62, 153, 30, 255, 50, 118, 25, 249, 43, 103, 23, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 93, 13, 38, 46, 109, 22, 241, 68, 166, 32, 255, 99, 197, 63, 255, 89, 185, 55, 255, 54, 141, 24, 255, 44, 108, 20, 241, 36, 93, 19, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 97, 12, 26, 47, 110, 25, 230, 68, 162, 37, 255, 46, 127, 17, 255, 39, 98, 16, 230, 33, 89, 13, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 93, 21, 16, 50, 112, 26, 223, 41, 101, 19, 225, 20, 72, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      var img_data = Uint8ClampedArray.from(tick);
      var img_png = new PNG({width: img_width, height: img_height})
      img_png.data = Buffer.from(img_data);
      img_png.pack().pipe(fs.createWriteStream(fname));
    }



    let histoGRAM = [
      {
        "Codon": "Non-coding NNN",
        "Description": "Expressed as NNN Codon",
        "Hue": 120,
        "Alpha": 0,
        "Histocount": 0,
      },
      {
        "Codon": "Ochre",
        "Description": "STOP Codon",
        "Hue": 0,
        "Alpha": 1,
        "Histocount": 0,
      },
      {
        "Codon": "Glutamic acid",
        "Description": "Group III: Acidic amino acids",
        "Hue": 16,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Aspartic acid",
        "Description": "Group III: Acidic amino acids",
        "Hue": 31,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Amber",
        "Description": "STOP Codon",
        "Hue": 47,
        "Alpha": 1,
        "Histocount": 0,
      },
      {
        "Codon": "Cysteine",
        "Description": "Group II: Polar, uncharged amino acids",
        "Hue": 63,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Glycine",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 78,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Alanine",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 94,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Methionine",
        "Description": "START Codon",
        "Hue": 110,
        "Alpha": 1,
        "Histocount": 0,
      },
      {
        "Codon": "Valine",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 125,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Leucine",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 141,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Isoleucine",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 157,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Phenylalanine",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 172,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Tryptophan",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 188,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Serine",
        "Description": "Group II: Polar, uncharged amino acids",
        "Hue": 203,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Threonine",
        "Description": "Group II: Polar, uncharged amino acids",
        "Hue": 219,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Opal",
        "Description": "STOP Codon",
        "Hue": 240,
        "Alpha": 1,
        "Histocount": 0,
      },
      {
        "Codon": "Glutamine",
        "Description": "Group II: Polar, uncharged amino acids",
        "Hue": 250,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Asparagine",
        "Description": "Group II: Polar, uncharged amino acids",
        "Hue": 266,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Tyrosine",
        "Description": "Group II: Polar, uncharged amino acids",
        "Hue": 282,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Arginine",
        "Description": "Group IV: Basic amino acids",
        "Hue": 297,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Lysine",
        "Description": "Group IV: Basic amino acids",
        "Hue": 313,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "Histidine",
        "Description": "Group IV: Basic amino acids",
        "Hue": 329,
        "Alpha": 0.1,
        "Histocount": 0,
      },
      {
        "Codon": "TOTAL Start Codons",
        "Description": "Count of Methionine",
        "Hue": 120,
        "Alpha": 0.0,
        "Histocount": 0,
      },
      {
        "Codon": "TOTAL Stop Codons",
        "Description": "One of Opal, Ochre, or Amber",
        "Hue": 120,
        "Alpha": 0.0,
        "Histocount": 0,
      },
      {
        "Codon": "Proline",
        "Description": "Group I: Nonpolar amino acids",
        "Hue": 344,
        "Alpha": 0.1,
        "Histocount": 0,
      }
    ]
    ;


    const radMessage =
    terminalRGB(`
      ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
      ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
      ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
      by Tom Atkinson          aminosee.funk.co.nz
      ah-mee no-see         "I See It Now - I AminoSee it!"
      `, 96, 64, 245);

      const lineBreak = `
      `;
