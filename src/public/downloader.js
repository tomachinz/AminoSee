const devmode = true;
self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
self.requestFileSystemSync;

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
      console.log("DISABLED CACHE FOR NOW");
      return;
      const request = new Request('/AminoSee_Calibration_7.png');
      const textBlob = new Blob([request], {type: 'text/plain'});
      const stringResponse = new Response(textBlob).then(function (text) {
        return text
      });
      log("[stringResponse] " + stringResponse);

    } else {
      log("No caches!");
    }
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
