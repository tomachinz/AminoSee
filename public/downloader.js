const devmode = true;
self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
self.requestFileSystemSync;
// const maxcolorpix = 262144 * 1  ; // for large genomes
const resHD = 1920*1080;
const res4K = 1920*1080*4;
const maxcolorpix = resHD  ; // for large genomes
// const maxcolorpix = 4096 * 4  ; // for large genomes
let colormapsize, codonsPerPixel, opacity, filename, basepairs, codons; // actual colours used for small genomes
// datasets = [
//   {
//     "name": "Chimpanzee",
//     "about": "ftp://hgdownload.soe.ucsc.edu/goldenPath/currentGenomes/Pan_troglodytes/bigZips/README.txt",
//     "data": "ftp://hgdownload.soe.ucsc.edu/goldenPath/currentGenomes/Pan_troglodytes/bigZips/panTro6.fa.gz"
//   },
//   {
//     "name": "Human",
//     "about": "ftp://hgdownload.soe.ucsc.edu/goldenPath/currentGenomes/Homo_sapiens/chromosomes/README.txt",
//     "data": "ftp://hgdownload.soe.ucsc.edu/goldenPath/currentGenomes/Homo_sapiens/chromosomes/chr2.fa.gz"
//   }];



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
  postMessage(txt);
  // postMessage(JSON.stringify(txt));
}
function log(txt) {
  if (devmode) {
    console.log(txt);
  }
}
function init() {
  // make a HISTOGRAM of amino acids found.
  for (i=0; i < aminoAcidColours.length; i++) {
    aminoAcidColours[i].Histocount = 0;
  }
  log( aminoAcidColours );

  return "Web worker getting outa bed, putting on the coffee";
}
function onError(e) {
  output('ERROR: ' + e.toString());
}

onmessage = function(e) {
  log("%c [worker] [onmessage] 'background: #aff; color: #004;'");
  log("[worker] [onmessage] ");
  switch (e.data.aTopic) {

    case 'do_Wakeup':
    output(init());

    case 'do_LoadURL':
    // output("Using URL ");
    filename = e.data.url;
    fetch(e.data.url)
    .then(function(response) {
      return response.text();
    })
    .then(function do_LoadURL(txt) {
      // send a bunch of colour back:
      // postMessage(colors);
      let colors = deCodons(txt);
      postMessage({ // do_NewColorsArray
        aTopic: 'do_NewColorsArray',
        colors: colors,
      });
      console.log("[do_LoadURL] " + colors);
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



function stashedItAway() {

  try {
    var fs = requestFileSystemSync(TEMPORARY, 1024 * 1024 /*1MB*/);

    // output('Got file system. ');
    //
    // if (data.filename) {
    //   output('[data.filename] ' + data.filename );
    // } else if (data.url) {
    //   output('[data.url] ' + data.url );
    // }

    fileEntry = fs.root.getFile(data.filename, {create: true});

    // output('Got file entry. File length: ' + fileEntry.length);
    // output('Got file entry. File size: ' + fileEntry.size);

    var urlArrayBuffer = makeRequest(data.url);
    // output('Got URL. Download size: ' + urlArrayBuffer.size)



    const cacheAvailable = 'caches' in self;
    const options = {
      headers: {
        'Content-Type': 'text/plain'
      }
    }
    if (cacheAvailable) {
      const request = new Request('/aminosee/aminosee/example-sequence.txt');
      const textBlob = new Blob([request], {type: 'text/plain'});
      const stringResponse = new Response(textBlob).then(function (text) {
        return text
      });;
      log("[stringResponse] " + stringResponse);
    } else {
      log("No caches!");
    }
    // output({
    //   result: stringResponse
    // });

    const request = new Request(data.url);
    const textResponse = new Reponse(request, options)

    var blob = new Blob([new Uint8Array(urlArrayBuffer)], {type: data.type});
    var colourblob = new Blob([new Uint8Array(6969)], {type: data.type});

    try {
      output('Begin writing colourblob len '+ colourblob.size);
      fileEntry.createWriter().write(colourblob);
      output('Writing complete');
      output(fileEntry.toURL());
    } catch (e) {
      onError(e);
    }

  } catch (e) {
    onError(e);
  }
}

// remove anything that isn't ATCG, convert U to T
function normaliseChars(rawDNA) {

  basepairs = rawDNA.length;

  // test first 1k for start of DNA
  // this is to get the cut position for removing the header
  const first1k = rawDNA.substring(0,1000);
  // ignore anything at the start of the file, it starts with 6 letters of base
  var regexp = /[ATCGUatcgu][ATCGUatcgu][ATCGUatcgu][ATCGUatcgu][ATCGUatcgu][ATCGUatcgu]/;

  log(first1k.substring(0,200));
  // log(first1k.match(regexp));
  let startIndex = first1k.indexOf(first1k.match(regexp));
  // log(first1k.substring(startIndex, 100));
  log("Old length: "+rawDNA.length);
  log("Cutting the header, and new start at position: " +startIndex);
  let dna = rawDNA.substring(startIndex, rawDNA.length);
  log("New length: "+dna.length);

  // var cleanDNA = "";
  // infoRefesh = true;
  // var chunk = ; // how often to update the status

  // if the file is super huge break it to chunksMax
  // if the file is medium use more than 1 chunk
  // if the file is small use 1 chunk
  // if you have less bytes than chunks

  let cleanDNA = "";
  let updates = 0;
  let cyclesPerUpdate = 1000;
  let perfteststart = new Date().getTime();

  for (i=0; i<dna.length; i++) {
    var char = dna.charAt(i).toUpperCase();
    if (char == "A" || char == "C" || char == "G" || char == "T" || char == "U") {
      if (char == "U") {
        cleanDNA += "T"; // convert RNA into DNA
      } else {
        cleanDNA += char; // add it to the clean string
      }
    }
    // see how long it takes to do 1 million base
    // then rig updates for once per second based on that perf
    updates++;

    if (updates>cyclesPerUpdate) {
      timeToUpdate = new Date().getTime() - perfteststart;
      cyclesPerUpdate = Math.round((1000/timeToUpdate) * cyclesPerUpdate);     // i divide by one second so i get updates each 1000 ms
      cyclesPerUpdate += 100; // race condition fix oopsie
      output("Your machine is processing " + cyclesPerUpdate + " per second.");
      percent(i, dna.length, cyclesPerUpdate);
      updates = 0;
      perfteststart = new Date().getTime();
    }
  }
  basepairs = dna.length;
  updateColorMapSize();
  return cleanDNA;
}
function updateColorMapSize() {
  cyclesPerUpdate = 0; // remove display of CPU usage

  // THIS IS SENT ONCE AFTER CLEANING THE FILE
  var msg = {
    aTopic: 'do_UpdateColorMapSize',
    colormapsize: colormapsize,
    basepairs: basepairs,
    codonsPerPixel: codonsPerPixel,
    codons: basepairs/3,
    filename: filename
  };
  log(msg);
  postMessage(msg);

}
function lessdetail() {
  postMessage({
    aTopic: 'do_ReduceDetail'
  });
}
function moredetail() {
  postMessage({
    aTopic: 'do_IncreaseDetail'
  });
}
function deCodons(rawDNA) {
  // document.body.appendChild( "<div>working</div>" );
  let userFeedback = "";
  let dna = normaliseChars(rawDNA);
  basepairs = dna.length;
  codons = basepairs / 3;
  if (codons > maxcolorpix) {
    // BIG DNA
    codonsPerPixel = codons / maxcolorpix;
    colormapsize = maxcolorpix; // MAXIMUM RESOLUTION
  } else {
    // SMALL DNA
    codonsPerPixel = 1;
    colormapsize = codons;
  }

  // alert(codonsPerPixel);
  output("codonsPerPixel YEAH BABY " + codonsPerPixel);
  if (codonsPerPixel<1.0) {
    // small piece of DNA, use one codon per pixel
    codonsPerPixel = 1;
  } else {
    // big DNA. reduce it to fit maxcolorpix:

  }
  opacity = 1 / codonsPerPixel;
  // output("opacity " + opacity);
  userFeedback += `
  Filename: ${filename}
  DNA base pairs: ${basepairs}
  Codon triplets: ${codons}
  Codons per pixel: ${codonsPerPixel}
  Color pixels: ${colormapsize}
  Amino acid opacity: ${opacity}
  `;
  if (basepairs%3!=0) {
    userFeedback += "WARNING: Your file appears to be corrupt. The number of characters in DNA sequences must be a multiple of 3. Your length after header trimming is: " + basepairs;
  }

  postMessage({
    aTopic: 'do_FileInfo',
    userFeedback: userFeedback
  });
  // newColours = [];
  // var d = 0; // Counter for chunk updates
  // playbackHead = 0;
  //
  // for (i=0; i<dna.length; i+=3) {
  //   var codon = dna.substring(i, i+3);
  //   if (Math.random()*10000 > 9998) {
  //     log(i + codon);
  //   }
  // }
  // stat("mapping colours "+codonsPerPixel+" codons per polygon"+percent+"%");
  // updateProgress(percent);

  // 4 bytes per channel
  log("download worker is preparing to send ArrayBuffer size: " + colormapsize + " pixels");
  const buffer = new ArrayBuffer(colormapsize*4);
  let usersColors = new Uint8ClampedArray(buffer);


  let temp;// = [0,0,0,0];
  let colorClock = 0;
  let red, green, blue, alpha = 0;
  let updates, perfteststart, timeToUpdate, cyclesPerUpdate;
  updates = 0;
  perfteststart = new Date().getTime();
  cyclesPerUpdate = 1000; // see how long it takes to do 1000 bases

  for (i=0; i<dna.length; i+=3) {
    var codon = dna.charAt(i) + dna.charAt(i+1) + dna.charAt(i+2);
    // build an ASCII triplet:
    // search the triplet in the table:
    // returns Typed Array
    let temp = codonToRGBA(codon); // this will report alpha info
    // log(temp[0], temp[1], temp[2], temp[3], );
    // log(temp);
    // console.warn(temp);
    if (temp[3] = 0.1) {
      alpha = opacity * 255;
    } else {
      alpha = 0.9 * 255;
    }
    red += temp[0] * alpha;
    green += temp[1] * alpha;
    blue += temp[2] * alpha;
    // console.warn("separates building up ", red, green, blue, alpha);
    if (colorClock >= codonsPerPixel*3) {
      usersColors.set([red, green, blue, alpha], colorClock*4);
      // log("[usersColors.get(colorClock*4)]  " + usersColors.get(colorClock*4));
      colorClock++;
      red  = 0;
      green = 0;
      blue = 0;
      alpha = 0;
    }
    // see how long it takes to do 1 million base
    // then rig updates for once per second based on that perf
    updates++;
    if (updates>cyclesPerUpdate) {
      // i divide by one second so i get updates each 1000 ms
      timeToUpdate = new Date().getTime() - perfteststart;
      cyclesPerUpdate = Math.round((1000/timeToUpdate) * cyclesPerUpdate);
      output("Your machine is processing " + cyclesPerUpdate + " per second.");
      percent(i, dna.length, cyclesPerUpdate);
      updates = 0;
      perfteststart = new Date().getTime();
    }

  }
  let tmp;
  for (i=0; i<usersColors.length; i++) {
    tmp += usersColors[i].valueOf();
  }
  output("[tmp] " + tmp);
  return usersColors;
}
// const buffer = new ArrayBuffer(colormapsize*4);
// const clampyColors = new Uint8ClampedArray(buffer);


function percent(i, tot, cyclesPerUpdate) {
  // this should remove the path just the filename:

  let msg = {
    aTopic: 'do_PercentUpdate',
    percent: Math.round(i/tot*10)*1000,
    loaded: i,
    total: tot,
    cpu: cyclesPerUpdate,
    filename: filename.substring(filename.lastIndexOf("/"), filename.length).substring(1, filename.length)
  };
  log(msg);
  postMessage(msg);

}
// take 3 letters, convert into a Uint8ClampedArray with 4 items
function codonToRGBA(cod) {
  let color = new Uint8ClampedArray(4); // 4 bytes for RGBA
  color[0] = 0; // red
  color[1] = 0; // green
  color[2] = 0; // blue
  color[3] = 0; // alpha
  let tempcolor = [13,255,13]; // this colour means "ERROR".

  let alpha = opacity; // if ten pixels are stacked, they are each 10% as bright.
  for (z=0;z<aminoAcidColours.length;z++) {
    if (cod == aminoAcidColours[z].DNA) { // SUCCESSFUL MATCH (convert to map)

      aminoAcidColours[z].Histocount++;
      let hue = aminoAcidColours[z].Hue / 360;
      // log(hue);
      if (aminoAcidColours[z].Codon == "WHITE") {
        tempcolor = [255,255,255]; // white.
      } else {
        tempcolor = hsvToRgb(hue, 0.5, 1);
      }
      let aminoacid = aminoAcidColours[z].Codon;

      // log("%c " + cod + " , " + aminoAcidColours[z].DNA + " Hue: " + aminoAcidColours[z].Hue + " "  + aminoacid + " hsvToRgb: " + tempcolor, `background: rgb( ${tempcolor} ) ; color: #fff)`);
      // 0.1 means blend equally with other colours
      // 0.8 means blend brightly
      if (aminoAcidColours[z].Alpha == 0.8) {
        // blend with other codons on same pixel
        alpha = 1.0; // start stop codons are very bright.
        // output("start stop codon");
      } else {
        alpha = opacity;
      }
      color = [tempcolor], [alpha];
      color[0] = tempcolor[0];
      color[1] = tempcolor[1];
      color[2] = tempcolor[2];
      color[3] = alpha;
    }
  }
  // console.warn(color[0], color[1], color[2], color[3]);
  // console.warn(color);
  // log(aminoAcidColours);

  return(tempcolor);
}
const aminoAcidColours = [
  {
    "DNA": "AAA",
    "Codon": "Lysine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 313,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AAC",
    "Codon": "Asparagine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 266,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AAG",
    "Codon": "Lysine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 313,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AAT",
    "Codon": "Asparagine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 266,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "ACA",
    "Codon": "Threonine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 219,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "ACC",
    "Codon": "Threonine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 219,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "ACG",
    "Codon": "Threonine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 219,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "ACT",
    "Codon": "Threonine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 219,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AGA",
    "Codon": "Arginine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 297,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AGC",
    "Codon": "Serine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 203,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AGG",
    "Codon": "Arginine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 297,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "AGT",
    "Codon": "Serine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 203,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "ATG",
    "Codon": "Methionine",
    "Source": "START Codon",
    "Hue": 120,
    "Saturation": 100,
    "Alpha": 0.8
  },
  {
    "DNA": "CAA",
    "Codon": "Glutamine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 250,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CAC",
    "Codon": "Histidine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 329,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CAG",
    "Codon": "Glutamine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 250,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CAT",
    "Codon": "Histidine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 329,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CCA",
    "Codon": "Proline",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 344,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CCC",
    "Codon": "Proline",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 344,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CCG",
    "Codon": "Proline",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 344,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CCT",
    "Codon": "Proline",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 344,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CGA",
    "Codon": "Arginine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 297,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CGC",
    "Codon": "Arginine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 297,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CGG",
    "Codon": "Arginine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 297,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "CGT",
    "Codon": "Arginine",
    "Source": "Group IV: Basic amino acids",
    "Hue": 297,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GAA",
    "Codon": "Glutamic acid",
    "Source": "Group III: Acidic amino acids",
    "Hue": 16,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GAC",
    "Codon": "Aspartic acid",
    "Source": "Group III: Acidic amino acids",
    "Hue": 31,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GAG",
    "Codon": "Glutamic acid",
    "Source": "Group III: Acidic amino acids",
    "Hue": 16,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GAT",
    "Codon": "Aspartic acid",
    "Source": "Group III: Acidic amino acids",
    "Hue": 31,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GCA",
    "Codon": "Alanine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 94,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GCC",
    "Codon": "Alanine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 94,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GCG",
    "Codon": "Alanine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 94,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GCT",
    "Codon": "Alanine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 94,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GGA",
    "Codon": "Glycine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 78,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GGC",
    "Codon": "Glycine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 78,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GGG",
    "Codon": "Glycine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 78,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "GGT",
    "Codon": "Glycine",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 78,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TAA",
    "Codon": "Ochre",
    "Source": "STOP Codon",
    "Hue": 0,
    "Saturation": 100,
    "Alpha": 0.8
  },
  {
    "DNA": "TAA",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TAC",
    "Codon": "Tyrosine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 282,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TAG",
    "Codon": "Amber",
    "Source": "STOP Codon",
    "Hue": 47,
    "Saturation": 100,
    "Alpha": 0.8
  },
  {
    "DNA": "TAG",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TAT",
    "Codon": "Tyrosine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 282,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TCA",
    "Codon": "Serine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 203,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TCA",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TCC",
    "Codon": "Serine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 203,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TCC",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TCG",
    "Codon": "Serine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 203,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TCG",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TCT",
    "Codon": "Serine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 203,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TCT",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TGA",
    "Codon": "Opal",
    "Source": "STOP Codon",
    "Hue": 240,
    "Saturation": 100,
    "Alpha": 0.8
  },
  {
    "DNA": "TGA",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TGC",
    "Codon": "Cysteine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 63,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TGC",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TGG",
    "Codon": "Tryptophan",
    "Source": "Group I: Nonpolar amino acids",
    "Hue": 188,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TGG",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TGT",
    "Codon": "Cysteine",
    "Source": "Group II: Polar, uncharged amino acids",
    "Hue": 63,
    "Saturation": 100,
    "Alpha": 0.1
  },
  {
    "DNA": "TGT",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 93,
    "Alpha": 0.1
  },
  {
    "DNA": "TTA",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 86,
    "Alpha": 0.1
  },
  {
    "DNA": "TTC",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 79,
    "Alpha": 0.1
  },
  {
    "DNA": "TTG",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 72,
    "Alpha": 0.1
  },
  {
    "DNA": "TTT",
    "Codon": "WHITE",
    "Source": "Telomeric",
    "Hue": 0,
    "Saturation": 65,
    "Alpha": 0.1
  }
];











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
