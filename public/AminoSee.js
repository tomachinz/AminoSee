let reader, hilbertPoints, herbs, levels, zoom, progress, status, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, textFile, dna, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, filename, justNameOfFile, filenamePNG;
let spline, point, vertices, colorsReady, canvas, material, colorArray, playbackHead, usersColors, controlsShowing, devmode, fileUploadShowing, colormapsize, testColors;

let chunksMax, chunksize, chunksizeBytes, codonsPerPixel, basepairs, cpu, subdivisions, userFeedback, contextBitmap;
// const maxcolorpix = 262144 * 1  ; // for large genomes
const maxcolorpix = 4096 * 16  ; // for large genomes
const linewidth = 32;
let autostopdelay = 300; // seconds
colormapsize = maxcolorpix; // custom fit.
// let downloaderDisabled = new Worker('./public/downloader.js');
let downloaderDisabled;
const resHD = 1920*1080;
const res4K = 1920*1080*4;

if(window.addEventListener) {
  window.addEventListener('load',pageLoaded,false); //W3C
} else {
  window.attachEvent('onload',pageLoaded); //IE
}

function pageLoaded() {
  // initBitmap();
  init3D();
  setScene();
  setupFNames();

  animate();
  // setupColorPicker();
  stat("[pageLoaded] Welcome to the Amino See DNA viewer");
  if (devmode) {
    stat("devmode");
    togglePause();
    toggleSpin();
    togglePause(); // done twice to re-trigger the autopause
  }
}

function setupColorPicker() {

  var cloudCanvas = document.getElementById('cloudCanvas');
  contextBitmap = cloudCanvas.getContext('2d');

  // draw cloud
  contextBitmap.beginPath();
  contextBitmap.moveTo(170, 80);
  contextBitmap.bezierCurveTo(130, 100, 130, 150, 230, 150);
  contextBitmap.bezierCurveTo(250, 180, 320, 180, 340, 150);
  contextBitmap.bezierCurveTo(420, 150, 420, 120, 390, 100);
  contextBitmap.bezierCurveTo(430, 40, 370, 30, 340, 50);
  contextBitmap.bezierCurveTo(320, 5, 250, 20, 250, 50);
  contextBitmap.bezierCurveTo(200, 5, 150, 20, 170, 80);
  contextBitmap.closePath();
  contextBitmap.lineWidth = 5;
  contextBitmap.fillStyle = '#8ED6FF';
  contextBitmap.fill();
  contextBitmap.strokeStyle = '#0000ff';
  contextBitmap.stroke();

  // save cloudCanvas image as data url (png format by default)
  var dataURL = cloudCanvas.toDataURL();

  var img = new Image();
  var img = document.createElement('img');
  img.onload = function(e) {
    ctx.drawImage(img, 0, 0, cloudCanvas.width, cloudCanvas.height);
    var url = cloudCanvas.toDataURL(); // Read succeeds, cloudCanvas won't be dirty.
  };
  img.crossOrigin = ''; // no credentials flag. Same as img.crossOrigin='anonymous'
  img.src = 'rhino.jpg';
  var rhinoCanv = document.getElementById('rhinoCanv');
  var ctx   = rhinoCanv.getContext('2d');
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
  };
  var color = document.getElementById('color');
  function pick(event) {
    var x = event.layerX;
    var y = event.layerY;
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = 'rgba(' + data[0] + ', ' + data[1] +
    ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    color.style.background =  rgba;
    color.textContent = rgba;
  }
  rhinoCanv.addEventListener('mousemove', pick);

  img.src = dataURL;
  var myImageData = contextBitmap.createImageData(64, 64);
  var myImageData = contextBitmap.getImageData(0, 0, 64, 64);

}

function reset() {
  // clearScene();
  // init3D();
  genericSceneSetup();
  setScene();
  animate();
}

function changeLevels() {
  // paused = true;
  // levels = document.getElementById('levels').value;
  genericSceneSetup();

  setScene();
  stat("New value: " + levels);

  // paused = false;
  animate();
}

function init3D() {



  // create a simple instance
  // by default, it only adds horizontal recognizers
  hammerIt(document.getElementById('canvas'));
  filename = "64-codons-test-pattern.fa";
  fileUploadShowing = false;
  devmode = true;
  perspective = false;
  paused = false;
  spinning = true;
  colorsReady = false;
  basepairs = 3;
  zoom = 2; //  defalt 2
  levels = 2;
  distance = 900;
  colorArray = []; // an array of color maps
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  mouseX = 0;
  mouseY = 0;
  progress = document.querySelector('.percent');
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  color = new THREE.Color();
  userFeedback = "";

  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('File API support detected. Groovy.');
  } else {
    stat('The File APIs are not fully supported in this browser. They are needed for loading the super massive DNA text files.');
  }

  if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    stat(WEBGL.getWebGLErrorMessage());
  }

  stat("initialisation: zoom levels distance subdivisions " +   zoom + ", " +  levels  + ", " + distance);

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  document.addEventListener( 'keypress', onKeyPress, false );
  document.addEventListener('keydown', onKeyDown, false);
  document.getElementById('choosefiles').addEventListener('change', handleFileSelect, false);
  window.addEventListener( 'resize', onWindowResize, false );

  // downloaderDisabled.onmessage = function(e) {
  //   console.log("DOWNLOADER DISABLED")
  //   return true;
  //
  //   switch (e.data.aTopic) {
  //
  //     case 'do_IncreaseDetail':
  //     // lessdetail();
  //     break;
  //
  //     case 'do_ReduceDetail':
  //     // moredetail();
  //     break;
  //
  //     case 'do_WorkerSendColors':
  //     // usersColors = e.data.colors;
  //     paused = true;
  //     togglePause();
  //     toggleFileUpload(); // hide that sucka so we can look at shit
  //     toggleControls();
  //     break;
  //
  //     case 'do_NewColorsArray':
  //     stat('do_NewColorsArray byteLength ' + e.data.colors.byteLength);
  //     stat('do_NewColorsArray length ' + e.data.colors.length);
  //     if (e.data.colors) {
  //       // applyColorsArray(e.data.colors);
  //       stat(`do_NewColorsArray was called, but I've disabled it. e.data.colors:  ${e.data.colors}`);
  //     } else if (!e.data.colors) {
  //       console.log("[error colors blah] " + e.data);
  //     }
  //     break;
  //
  //     case 'do_UpdateColorMapSize':
  //     colormapsize = e.data.colormapsize;
  //     basepairs = e.data.basepairs;
  //     codonsPerPixel = e.data.codonsPerPixel;
  //     codons = e.data.codons;
  //     filename = e.data.filename;
  //
  //     opacity = 1 / codonsPerPixel;
  //     stat('basepairs ' + basepairs);
  //     stat('do_UpdateColorMapSize colormapsize '+colormapsize);
  //     break;
  //
  //     case 'do_PercentUpdate':
  //
  //     colormapsize = e.data.colormapsize;
  //     basepairs = e.data.basepairs;
  //     codonsPerPixel = e.data.codonsPerPixel;
  //     codons = e.data.codons;
  //
  //
  //     filename  = "um ok lets fix that"
  //     // filename = e.data.filename;
  //     // let percentEvent = { loaded: e.data.loaded, total: e.data.total }
  //     let percentLoaded = Math.round((e.data.loaded / e.data.total) * 100);
  //     // stat('do_PercentUpdate'+e.data.percent);
  //     // updateProgress(percentEvent);
  //     updatePercent(e.data.percent);
  //     cpu = e.data.cpu;
  //     let txt = percentLoaded + "%";
  //     stat(txt);
  //     break;
  //
  //     case 'do_FileInfo':
  //     userFeedback = e.data.userFeedback;
  //     Math.round(cpu/1000) + " K iops "
  //     stat("[userFeedback] " + userFeedback);
  //     document.getElementById('cancel').classList.remove('hidden');
  //     toggleFileUpload();
  //     break;
  //
  //
  //
  //     default:
  //     console.log("[downloader DEFAULT] " + e.data);
  //   }
  // };

  // downloaderDisabled.postMessage({
  //   aTopic: 'do_Wakeup'
  // });

  // downloaderDisabled.postMessage({
  //   aTopic: 'do_LoadURL',
  //   filename: './AAA-to-TTT-repeated-8-times.txts',
  //   url: '/aminosee/aminosee/AAA-to-TTT-repeated-8-times.txt',
  //   type: 'text/plain'
  // });
  // downloaderDisabled.postMessage({
  //   aTopic: 'do_LoadURL',
  //   filename: './64-codons-test-pattern.txt',
  //   url: '/aminosee/aminosee/64-codons-test-pattern.txt',
  //   type: 'text/plain'
  // });
  // downloaderDisabled.postMessage({
  //   aTopic: 'do_LoadURL',
  //   filename: './example-mfa.txt',
  //   url: '/aminosee/aminosee/example-mfa.txt',
  //   type: 'text/plain'
  // });
  // downloaderDisabled.postMessage({
  //   aTopic: 'do_LoadURL',
  //   filename: './example-fa.txt',
  //   url: '/aminosee/aminosee/example-fa.txt',
  //   type: 'text/plain'
  // });
  // downloaderDisabled.postMessage({
  //   aTopic: 'do_LoadURL',
  //   filename: './example-sequence.txt',
  //   url: '/aminosee/aminosee/example-sequence.txt',
  //   type: 'text/plain'
  // });
  // downloaderDisabled.postMessage({
  //   aTopic: 'do_LoadURL',
  //   filename: './Gorilla-C2AB-9595_ref_gorGor4_chr2A.mfa',
  //   url: '/aminosee/aminosee/Gorilla-C2AB-9595_ref_gorGor4_chr2A.mfa',
  //   type: 'text/plain'
  // });
}
function updateColorMapSize() {

}
// init3D();
function ab2str(buf) {
  // return "out of depth";
  return String.fromCharCode.apply(null, new Uint16Array(buf));
  // return String.fromCodePoint(buf);
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


function letsdothis() {
  colorsReady = true; // flag to switch palettes
  // paused = true;
  stat("Your file has been mapped!");
  reset();
  animate();
}
function destroyScene() {
  geometry1 = new THREE.BufferGeometry(); // bottom row with curves
  geometry2 = new THREE.BufferGeometry(); // bottom row with curves
  geometry3 = new THREE.BufferGeometry(); // bottom row with curves
  geometry4 = new THREE.BufferGeometry(); // top row with straight lines
  geometry5 = new THREE.BufferGeometry(); // top row with straight lines
  geometry6 = new THREE.BufferGeometry(); // 2D HAXORED
}
function setScene() {

  genericSceneSetup();
  geometry1 = new THREE.BufferGeometry(); // bottom row with curves
  geometry2 = new THREE.BufferGeometry(); // bottom row with curves
  geometry3 = new THREE.BufferGeometry(); // bottom row with curves
  geometry4 = new THREE.BufferGeometry(); // top row with straight lines
  geometry5 = new THREE.BufferGeometry(); // top row with straight lines
  geometry6 = new THREE.BufferGeometry(); // 2D HAXORED
  buildColours();
  buildHilbert();
  // buildColours();

  // console.log("herbs: "+herbs);
  // Create lines and add to scene
  material = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors, linewidth: linewidth  } );

  // var line, p, scale = 0.3, d = 225;
  var line, p;
  var scale = 0.45; //
  var d = 300; // distance is the inter object space
  var parameters =  [
    [ material, scale * 1.5, [ - d, - d / 2, 0 ], geometry1 ],
    [ material, scale * 1.5, [   0, - d / 2, 0 ], geometry2 ],
    [ material, scale * 1.5, [   d, - d / 2, 0 ], geometry3 ],

    [ material, scale * 1.5, [ - d, d / 2, 0 ], geometry4 ],
    [ material, scale * 1.5, [   0, d / 2, 0 ], geometry5 ],
    [ material, scale * 1.5, [   d, d / 2, 0 ], geometry6 ],
  ];

  for ( var i = 0; i < parameters.length; i++ ) {

    p = parameters[ i ];
    line = new THREE.Line( p[ 3 ],  p[ 0 ] );
    line.scale.x = line.scale.y = line.scale.z =  p[ 1 ];
    line.position.x = p[ 2 ][ 0 ];
    line.position.y = p[ 2 ][ 1 ];
    line.position.z = p[ 2 ][ 2 ];
    scene.add( line );

  }
}
function genericSceneSetup() {
  scene = new THREE.Scene();

  // ******* COLOR ARRAYS
  testTones = [];
  spectrumLines = [];
  spectrumCurves = [];
  // testColors = [];
  // this genericSceneSetup gets called during reset
  // if (colorsReady != true) {
  //   usersColors = [];
  // } else {
  //   stat("test")
  // }


  cameraPerspective = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
  cameraOrthographic = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, 1, 10000 );

  if (perspective) {
    camera = cameraPerspective;
  } else {
    camera = cameraOrthographic;
  }

  camera.position.z = distance;

  canvas = document.getElementById("canvas");
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  stat('Getting in touch with my man Hilbert')
  // var hilbertPoints = hilbert3D( new THREE.Vector3( 0,0,0 ), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
  hilbertPoints = hilbert3D( new THREE.Vector3( 0,0,0 ), 200.0, levels, 0, 1, 2, 3, 4, 5, 6, 7 );
  hilbertPoints2D = hilbert2D( new THREE.Vector3( 0,0,0 ), 200.0, levels, 0, 1, 2, 3 );

  herbs = hilbertPoints.length;
  herbs2D = hilbertPoints2D.length;
  subdivisions = maxcolorpix / herbs;
  // stat(subdivisions);
  colormapsize = maxcolorpix;
  stat('[subdivisions, colormapsize, maxcolorpix] ' , subdivisions, colormapsize, maxcolorpix);

  // 262144 polygons
  //  32768 polygons

}
function removeEntity(object) {
  var selectedObject = scene.getObjectByName(object.name);
  selectedObject.parent.remove( selectedObject );

}
function clearScene() {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const object = scene.children[i];
    if (object.type === 'Mesh') {
      removeEntity(object);

      object.geometry.dispose();
      object.material.dispose();
      scene.remove(object);
    }
  }

  render();
}

function buildHilbert() {
  spline = new THREE.CatmullRomCurve3( hilbertPoints );
  vertices = [];
  point = new THREE.Vector3();
  stat(colormapsize);
  for ( var i = 0; i < herbs * subdivisions; i++ ) {
    var t = i / (herbs * subdivisions);
    spline.getPoint( t, point );
    vertices.push( point.x, point.y, point.z );
  }

  // 2D VERSION FOR USE WITH GEO 6
  let vertices2D = [];
  for ( var i = 0; i < herbs2D; i++ ) {
    point = hilbertPoints2D[ i ];
    vertices2D.push( point.x, point.y, point.z );
  }

  geometry1.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  // geometry1.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) );
  geometry2.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  geometry3.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  // geometry3.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) );

  // colorsReady = false;

  if (colorsReady == true) {// USER THE USERS COLORS
    stat('colorsReady ' + colorsReady);
    geometry1.addAttribute( 'color', new THREE.Float32BufferAttribute( testColors, 3 ) );
    geometry2.addAttribute( 'color', new THREE.Float32BufferAttribute( testColors, 3 ) );
    geometry3.addAttribute( 'color', new THREE.Float32BufferAttribute( testColors, 3 ) );
  } else { // USER A TEST TONE
    geometry1.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumCurves, 3 ) );
    geometry2.addAttribute( 'color', new THREE.Float32BufferAttribute( testTones, 3 ) );
    geometry3.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumCurves, 3 ) );
  }

  //  STRAIGHT LINE VERSION
  vertices = [];
  for ( var i = 0; i < herbs; i++ ) {
    point = hilbertPoints[ i ];
    vertices.push( point.x, point.y, point.z );
  }



  geometry4.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) ); // 2D TEST
  // geometry4.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) ); // 2D TEST
  geometry5.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

  geometry6.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) ); // 2D TEST
  // geometry6.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) ); // 2D TEST

  if (colorsReady) { // USER THE USERS COLORS
    geometry4.addAttribute( 'color', new THREE.Float32BufferAttribute( testColors, 3 ) );
    geometry6.addAttribute( 'color', new THREE.Float32BufferAttribute( testColors, 3 ) );
  } else { // USER A TEST TONE
    geometry4.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumLines, 3 ) );
    geometry6.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumLines, 3 ) );
  }
  geometry5.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumLines, 3 ) );

}

function buildColours() {
  stat("colour map pixels: "+ maxcolorpix);
  stat("herbs*subdivisions "+ herbs*subdivisions);

  testTones = []; // wipe it
  spectrumCurves = [];
  stat('herbs*subdivisions '+herbs*subdivisions);
  // HIGH RES COLOUR BANDS
  for ( var i = 0; i < herbs*subdivisions ; i++ ) {
    // alternative black and white
    color.setHSL(i%8/8, i%4/4, i%2 );
    testTones.push( color.r, color.g, color.b );
    // slow high res colours
    color.setHSL( i / colormapsize, 0.5, 0.5 );
    spectrumCurves.push( color.r, color.g, color.b );
  }
  stat('testTones.length '+testTones.length);

  // LOWER RESOLUTION COLOURS FOR STRAIGHT LINES
  for ( var i = 0; i < herbs; i++ ) {
    color.setHSL( i / herbs, 1.0, 0.5 );
    spectrumLines.push( color.r, color.g, color.b );
  }
}

function errorHandler(evt) {
  switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
    alert('File Not Found!');
    break;
    case evt.target.error.NOT_READABLE_ERR:
    alert('File is not readable');
    break;
    case evt.target.error.ABORT_ERR:
    break; // noop
    default:
    alert('An error occurred reading this file.');
  };
}

function updateProgress(evt) {
  // evt is an ProgressEvent.
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      updatePercent(percentLoaded);
    }
  }
}
function updatePercent(p) {
  progress.style.width = p + '%';
  progress.textContent = p + '%';
}
function infoUpdate(x) {
  console.log("infoUpdate: " + x);
  // stat(x);
  infoRefesh = true;
}
function replaceFilepathFileName(f) {
  return f.replace(/^.*[\\\/]/, '');
}
function setupFNames() {
  filenamePNG = filename + "_" + codonsPerPixel + "_aminosee.png"; // for some reason this needs to be here. hopefully the open source community can come to rescue and fix this Kludge.  watch it break when you remove it.
  justNameOfFile = replaceFilepathFileName(filename);
}

function getStats() {
  var t = `
  <h6>${justNameOfFile}</h6>
  <pre>
  Polygons: ${herbs * subdivisions} `;
  if (perspective) {
    t+= " perspective view "
  } else {
    t+= " orthographic view "
  }
  if (basepairs>3) {
    t += `
    DNA basepairs: ${Math.round(basepairs/100000)/10} Megabases, Codons per pixel: ${codonsPerPixel}`;
  }
  if (cpu>3) {
    t += ` CPU: ${Math.round(cpu/1000)} K IOPs `;
  }
  t+= `
  Pseudo Hilbert Curve fractal order: ${levels} points: ${herbs} spline segments per point: ${subdivisions}
  Palette size: ${colormapsize} Line width ${linewidth} (requires Safari) ${userFeedback}`;
  // <div id="stats" class="stats whitetext">
  // </div>

  if (paused) {
    t+= " PAUSED - PRESS P TO RESUME "
  }
  t+= "  </pre>";
  return t;
}

// let groovyTerminal = ['.', '..', '...', '....', '.....'];

function stat(txt) {
  // document.getElementById("status").innerHTML = "<div id='status'>" + txt + "</div>";
  document.getElementById("status").innerHTML = txt;
  document.getElementById("stats").innerHTML = getStats();




  console.log(" [stat] "+ txt);
  // groovyTerminal.push(txt);
  // groovyTerminal.pop();
  // groovyTerminal.shift();
  // console.log("START OF GROOVY TERM " + groovyTerminal.toString());

}
// function employWebWorker()
function workReceived(e) {
  stat("[workReceived] " + e.data.result);
}

function statModal(txt, callback) {
  document.getElementById('modalBox').innerHTML = `
  ${txt}
  <input type="button" id="modalBoxButton" value="OK [ENTER]" onclick="togglePause()">`;
  // document.getElementById('modalBox').innerHTML = `
  // <div id="modalBox" class="modalCentered">
  // ${txt}
  // <input type="button" id="modalBoxButton" value="OK [ENTER]" onclick="togglePause()">
  // </div>
  // `;
}
function statModalOkCallback() {
}

function handleFileSelect(evt) {
  document.getElementById('cancel').classList.remove('hidden');

  let choosefiles = evt.target.files;
  console.log("file loading is being sent to background web worker... " + choosefiles.length + " files.");
  // downloaderDisabled.postMessage(choosefiles);
  // Ensure that the progress bar displays 100% at the end.
  progress.style.width = '100%';
  progress.textContent = '100%';
  setTimeout("document.getElementById('progress_bar').className='';", 100);

  for (i=0; i<choosefiles.length; i++) {
    // downloaderDisabled.postMessage({
    //   aTopic: 'do_LoadURL',
    //   filename: choosefiles[i],
    //   url: choosefiles[i],
    //   type: 'text/plain'
    // });
  }


};

function cancel() {
  // worker.terminate();
  downloaderDisabled.terminate();
}

function testColour() {
  colorsReady = false;
  // paused = true;
  // render();

  stat("testColour to " + colormapsize);
  // wipe them red and reset:
  testColors = [];

  // HIGH RES COLOUR BANDS
  // for ( var i = 0; i < colormapsize; i++ ) {
  for ( var i = 0; i < herbs*subdivisions; i++ ) {
    color.setHSL( i / herbs ,0.5, (i%4)/3 );
    testColors.push( color.r, color.g, color.b );
  }
  colorsReady = true;
  // isPaused = false;
  // render();
  // reset();
  // destroyScene();
  genericSceneSetup();
  changeLevels();
}
function applyColorsArray(buffer) {
  stat("[received colors] " + buffer.byteLength/4);
  cyclesPerUpdate = 0;
  // const buffer = new ArrayBuffer(colormapsize*4);
  const clampyColors = new Uint8ClampedArray(buffer);

  // buildColours();
  let usersColors = [];

  contextBitmap.beginPath();
  contextBitmap.moveTo(0, 0);
  // HIGH RES COLOUR BANDS
  for ( var i = 0; i < clampyColors.length; i++ ) {

    log(clampyColors[i], clampyColors[i+1], clampyColors[i+2]);
    // alternative black and white
    // let temp = clampyColors[i]; // 4 bytes
    color.setRGB(clampyColors[i], clampyColors[i+1], clampyColors[i+2]);
    usersColors.push( color.r, color.g, color.b , opacity);
    // drawPixel(i, color, opacity, clampyColors.length);
    contextBitmap.lineTo(getPixX(i), getPixY(i));
    // console.log("%c Hue: " + color.r + ', '+ color.g + ', '+ color.b + ' background: rgb(' + color.r + ', '+ color.g + ', '+ color.b +  ' ) ; color: #fff');
  }
  contextBitmap.closePath();
  contextBitmap.lineWidth = 5;
  contextBitmap.fillStyle = '#8ED6FF';
  contextBitmap.fill();
  contextBitmap.strokeStyle = '#0000ff';
  contextBitmap.stroke();
  letsdothis();
}

// if less than resHD basepairs (about 2M), the number of pixels is the same as the codons
// if more than resHD basepairs, number of pixels is basepairs / codonsPerPixel
// in future i'd like to use "sub pixel interpolation" for now its 1:1, 2:1, 3:1 etc
// probably the 4k setting will be better.
// UPDATE actully its' just passed in as "len" now
function getPixX(i) {
  var x = colormapsize % 1920;
}
function getPixY(i) {
  var y = Math.round(( colormapsize / 1920 ) -0.5) ; // i use rounding to count the first "1" as 1920 / 1920, but not 1919/1920
  if (y<0) {
    alert("oops");
    y=0;
  }
}

// function drawPixel(i, color, opacity, len) {
//
//   // draw cloud
//
//   contextBitmap.lineTo(130, 100, 130, 150, 230, 150);
//   contextBitmap.bezierCurveTo(250, 180, 320, 180, 340, 150);
//   contextBitmap.bezierCurveTo(420, 150, 420, 120, 390, 100);
//   contextBitmap.bezierCurveTo(430, 40, 370, 30, 340, 50);
//   contextBitmap.bezierCurveTo(320, 5, 250, 20, 250, 50);
//   contextBitmap.bezierCurveTo(200, 5, 150, 20, 170, 80);
//   contextBitmap.closePath();
//   contextBitmap.lineWidth = 5;
//   contextBitmap.fillStyle = '#8ED6FF';
//   contextBitmap.fill();
//   contextBitmap.strokeStyle = '#0000ff';
//   contextBitmap.stroke();
// }
function toggleFileUpload() {
  if (!fileUploadShowing) {
    document.getElementById('fileheader').style.visibility = 'visible';
    document.getElementById('fileheader').style.display = 'block';
    document.getElementById('fileupload').value = 'Hide Upload [F]';
    fileUploadShowing = true;
    document.getElementById('choosefiles').focus();

  } else {
    document.getElementById('fileheader').style.visibility = 'hidden';
    document.getElementById('fileheader').style.display = 'none';
    document.getElementById('fileupload').value = 'Upload DNA Text [F]ile';
    fileUploadShowing = false;
  }
}
function toggleControls() {
  controlsShowing = !controlsShowing;
  if (controlsShowing) {
    stat('Controls Hidden [H]');
    document.getElementById('hide').value = 'Show Controls [H]';
    document.getElementById('stats').style.visibility = 'hidden';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('controls').style.visibility = 'hidden';
    document.getElementById('description').classList.add('hidden');
    document.getElementById('description').classList.add('hidden');
    document.getElementById('monkeys').classList.add('tiny');
    // document.getElementById('nav').style.visibility = 'hidden';
    // document.getElementById('description').style.visibility = 'hidden';
    // document.getElementById('description').style.display = 'none';
    // document.getElementById('description').classList.remove('hidable');    // document.getElementById('description').classList.remove('hidable');
  } else {
    stat('Controls Showing [H]');
    document.getElementById('hide').value = 'Hide Controls [H]';
    document.getElementById('stats').style.visibility = 'visible';
    document.getElementById('stats').style.display = 'block';
    document.getElementById('controls').style.visibility = 'visible';
    document.getElementById('description').classList.remove('hidden');
    document.getElementById('description').classList.add('hidable');
    document.getElementById('h2').classList.remove('hidden');
    document.getElementById('monkeys').classList.remove('tiny');
    // document.getElementById('description').style.display = 'block';
    // document.getElementById('description').style.visibility = 'visible';
    // document.getElementById('nav').style.visibility = 'visible';
  }
  let value_for_Event_Label =
  dataLayer.push({
    'event' : 'AminoSee',
    'eventCategory' : 'AminoSee_hideControls',
    'eventAction' : 'toggleControls',
    'eventLabel' : controlsShowing
    // 'eventValue' : value_for_Event_Value
  });
  console.log("tracked bool: " + controlsShowing);
}
// ONE DAY I FOUND OUT IT LOOKS COOL TO NOT RESET CAMERA AFTER SWITCH
// I FORGOT TO PUT A RESET IN THE
function getAmongstIt() {
  perspective = !perspective;
  if (perspective) {
    stat('Getting Amongst It');
    document.getElementById('perspective').value = "Orthographic [V]iew";
    // camera = cameraOrthographic;
    // reset();
    camera = cameraPerspective;
  } else {
    stat('Back to regular');
    document.getElementById('perspective').value = "Perspective [V]iew";
    camera = cameraOrthographic;
    // reset();
    // camera = cameraPerspective;
  }
}
function toggleView() {
  perspective = !perspective;
  if (perspective) {
    stat('Switched to perspective mode');
    document.getElementById('perspective').value = "Orthographic [V]iew";
    camera = cameraPerspective;
    reset();
  } else {
    stat('Switched to Orthographic mode');
    document.getElementById('perspective').value = "Perspective [V]iew";
    camera = cameraOrthographic;
    reset();
  }
}
let timeout;
function setTimeoutPause() {


  if (devmode) {
    timeout = setTimeout(togglePause, autostopdelay*10); // pause after 5 minutes
  } else {
    timeout = setTimeout(togglePause, autostopdelay*1000); // pause after 5 minutes
  }
}
function togglePause() {
  paused = !paused;
  if (paused == true) {
    let txt = "Paused - Press [P] to start";
    stat(txt);
    statModal(txt, togglePause);
    document.getElementById('pause').value = "Play [P]";
    // document.getElementById('status').classList.replace('headingStatus', 'hidden');
    document.getElementById('modalBox').classList.replace('hidden', 'modalCentered');
    if (timeout) {
      clearTimeout(timeout);
    }
    // paused is whack in the middle of the screen
  } else {
    let txt = "Resumed - Press [P] to pause";
    stat(txt);
    document.getElementById('pause').value = "Pause [P]";
    // document.getElementById('status').classList.replace('hidden', 'headingStatus');
    document.getElementById('modalBox').classList.replace('modalCentered', 'hidden');
    if (timeout) {
      clearTimeout(timeout);
    }
    if (document.getElementById('autostop').checked) {
      setTimeoutPause();
    }
  }

  animate();
}
function toggleSpin() {
  spinning = !spinning;
  if (spinning) {
    stat('Model slowly rotates with time');
    document.getElementById('spin').value = "Stop Rotation [R]";
  } else {
    stat('Model not rotating');
    document.getElementById('spin').value = "Rotate [R]";
  }
  // animate();
}

function hammerIt(elm) {
  hammertime = new Hammer(elm, {});
  hammertime.get('pinch').set({
    enable: true
  });
  var posX = 0,
  posY = 0,
  scale = 1,
  last_scale = 1,
  last_posX = 0,
  last_posY = 0,
  max_pos_x = 0,
  max_pos_y = 0,
  transform = "",
  el = elm;

  hammertime.on('doubletap pan pinch panend pinchend', function(ev) {
    stat(ev.type +" gesture detected.")

    if (ev.type == "doubletap") {
      zoom = 4; //  defalt 2
    }
    if (ev.type == "pinch") {
    }

    //pan
    if (scale != 1) {
      posX = last_posX + ev.deltaX;
      posY = last_posY + ev.deltaY;
      max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
      max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
      if (posX > max_pos_x) {
        posX = max_pos_x;
      }
      if (posX < -max_pos_x) {
        posX = -max_pos_x;
      }
      if (posY > max_pos_y) {
        posY = max_pos_y;
      }
      if (posY < -max_pos_y) {
        posY = -max_pos_y;
      }
    }


    //pinch
    if (ev.type == "pinch") {
      scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
    }
    if(ev.type == "pinchend"){last_scale = scale;}

    //panend
    if(ev.type == "panend"){
      last_posX = posX < max_pos_x ? posX : max_pos_x;
      last_posY = posY < max_pos_y ? posY : max_pos_y;
    }

    if (scale != 1) {
      transform =
      "translate3d(" + posX + "px," + posY + "px, 0) " +
      "scale3d(" + scale + ", " + scale + ", 1)";
    }

    camera.translateZ( -5  * scale );


    if (transform) {
      el.style.webkitTransform = transform;
    }
  });
}


function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
// left = 37
// up = 38
// right = 39
// down = 40
function onKeyDown( event ) {
  let isValidKey = true;
  let value_for_Event_Label = "";
  let value_for_Event_Value = "";
  stat("onKeyDown " + event);
  if (event.keyCode === 37) {
    cursorLeft();
    value_for_Event_Label = "ArrowLeft"
  }
  else if (event.keyCode === 38) {
    cursorUp();
    value_for_Event_Label = "ArrowLeft"

  } else if (event.keyCode === 39) {
    cursorRight();
    value_for_Event_Label = "ArrowLeft"
  } else if (event.keyCode === 40) {
    cursorDown();
    value_for_Event_Label = "ArrowLeft"
  } else {
    isValidKey = false;
  }

  if (isValidKey == true) {
    dataLayer.push({
      'event' : 'AminoSee',
      'eventCategory' : 'AminoSee_keypress',
      'eventAction' : event.key,
      'eventLabel' : value_for_Event_Label,
      'eventValue' : value_for_Event_Value
    });
    console.log("tracked key: " + value_for_Event_Label);
  } else {
    console.log("Invalid key");
  }
}
function triggerFileClick() {
  console.log("triggerFileClick");
  // document.getElementById('file').trigger('click');
  $("file").trigger("click");
}
function onKeyPress( event ) {
  let isValidKey = true;
  let value_for_Event_Label = "";
  let value_for_Event_Value = "";

  if (event.key.toUpperCase() === "P") {
    togglePause();
    value_for_Event_Label = "Pause"
  }
  else if (event.key === "Enter") {
    togglePause();
    value_for_Event_Label = "Enter Key"
  }
  else if (event.key.toUpperCase() === "T") {
    testColour();
    value_for_Event_Label = "Test Colours"
  }
  else if (event.key.toUpperCase() === "F") {
    toggleFileUpload();
    document.getElementById('choosefiles')
    value_for_Event_Label = "File Chooser"
  }
  else if (event.key.toUpperCase() === "R") {
    toggleSpin();
    value_for_Event_Label = "Rotate"
  }
  else if (event.key.toUpperCase() === "G") {
    getAmongstIt();
    value_for_Event_Label = "GetAmongstIt"
  }
  else if (event.key.toUpperCase() === "V") {
    toggleView();
    value_for_Event_Label = "View"
  }
  else if (event.key.toUpperCase() === "U") {
    reset();
    value_for_Event_Label = "Reset"
  }
  else if (event.key.toUpperCase() === "H") {
    toggleControls();
    value_for_Event_Label = "Hide"
  }
  else if (event.key.toUpperCase() === "W") {
    camera.position.z -= 10;
    value_for_Event_Label = "Forwards"
  }
  else if (event.key.toUpperCase() === "S") {
    camera.position.x += 10;
    value_for_Event_Label = "Backwards"
  }
  else if (event.key.toUpperCase() === "A") {
    camera.position.x -= 10;
    value_for_Event_Label = "Left"
  }
  else if (event.key.toUpperCase() === "D") {
    camera.position.z -= 10;
    value_for_Event_Label = "Right"
  } else if (event.key === "+") {
    moredetail();
    value_for_Event_Label = "Increase Detail"
  }
  else if (event.key === "-") {
    lessdetail();
    value_for_Event_Label = "Decrease Detail"
  } else {
    isValidKey = false;
  }
  if (isValidKey == true) {
    dataLayer.push({
      'event' : 'AminoSee',
      'eventCategory' : 'AminoSee_keypress',
      'eventAction' : event.key,
      'eventLabel' : value_for_Event_Label,
      'eventValue' : value_for_Event_Value
    });
    console.log("tracked key: " + value_for_Event_Label);
  } else {
    console.log("Invalid key");
  }

}
function cursorLeft() {
  camera.rotation.y += 5;
}
function cursorRight() {
  camera.rotation.y -= 5;
}
function cursorUp() {
  camera.rotation.x += 5;
}
function cursorDown() {
  camera.rotation.x -= 5;
}
function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
  if ( event.touches.length > 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function animate() {
  if (paused != true) {
    requestAnimationFrame( animate );

  }
  render();

}

function render() {
  camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  camera.position.y += ( - mouseY + 200 - camera.position.y ) * 0.05;
  camera.lookAt( scene.position );

  if (spinning) {
    var time = Date.now() * 0.0000065;
  } else {
    var time = 0;
  }
  for ( var i = 0; i < scene.children.length; i ++ ) {
    var object = scene.children[ i ];
    if ( object.isLine ) {
      object.rotation.y = time * ( i % 2 ? 1 : -1 );
    }
  }
  renderer.render( scene, camera );
}
function changeZoom() {
  paused = true;
  setScene();
  paused = false;
  animate();

}
function autostopChanged() {
  tickobox = document.getElementById('autostop').checked;
  // alert(tickobox);
  if (!tickobox) { // RUN FOR AGES
    autostopdelay = 36000; // 10 hours
    paused = true;
    togglePause();

  } else { // STOP QUICK
    // togglePause();
    autostopdelay = 300;
    togglePause();
    togglePause();
    // togglePause();
  }
}
function moredetail() {
  levels++;
  if (levels<6) {
    stat("Increasing detail level to " + levels);
  } else {
    if (confirm('This may freeze your browser are you sure?')) {
      stat("Increasing detail level to " + levels + " (crashes browser)");
    } else {
      levels = 5;
      stat("Max levels");
    }
  }
  changeLevels();
}
function lessdetail() {
  levels--;
  if (levels<1) {
    levels = 0;
    stat("Decreasing detail level to " + levels + " (min)");
  } else {
    stat("Decreasing detail level to " + levels);
  }
  changeLevels();
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

  return [ r * 255, g * 255, b * 255 ];
}
function log(txt) {
  if (devmode) {
    console.log(txt);
  }
}
