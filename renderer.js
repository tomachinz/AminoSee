// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// for the Electron Desktop App

document.getElementById('supercontainer').ondragstart = (event) => {
    event.preventDefault()
    ipcRenderer.send('ondragstart', '/path/to/item')
}



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
  setupColorPicker();
  stat("[pageLoaded] Welcome to the Amino See DNA viewer");
  if (devmode) {
    stat("devmode");
    togglePause();
    toggleSpin();
    togglePause(); // done twice to re-trigger the autopause
  }
}

function setupColorPicker() {

  var canvas = document.getElementById('cloudCanvas');
  toggleFileUpload();
  document.getElementById('choosefiles')
  value_for_Event_Label = "File Chooser"
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


function stat(txt) {
  document.getElementById("status").innerHTML = "<div id='status'>" + txt + "</div>";
  document.getElementById("stats").innerHTML = getStats();
  console.log(" [stat] "+ txt);
}
//

function statModal(txt, callback) {
  document.getElementById('modalBox').innerHTML = `
  <div id="modalBox" class="modalCentered">
  ${txt}
  <input type="button" id="modalBoxButton" value="OK [ENTER]" onclick="togglePause()">
  </div>
  `;
}


function handleFileSelect(evt) {
  document.getElementById('cancel').classList.remove('hidden');
  let choosefiles = evt.target.files;
  console.log("file loading is being sent to background web worker... " + choosefiles.length + " files.");
  // downloader.postMessage(choosefiles);
  // Ensure that the progress bar displays 100% at the end.
  progress.style.width = '100%';
  progress.textContent = '100%';
  setTimeout("document.getElementById('progress_bar').className='';", 100);

  for (i=0; i<choosefiles.length; i++) {
    downloader.postMessage({
      aTopic: 'do_LoadURL',
      filename: choosefiles[i],
      url: choosefiles[i],
      type: 'text/plain'
    });
  }
};
function cancel() {
  // worker.terminate();
  downloader.terminate();
}
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
