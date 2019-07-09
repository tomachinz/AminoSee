// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// for the Electron Desktop App
// const { ipcMain } = require('electron')
// const { ipcRenderer } = require('electron')
// const { dialog } = require('electron').remote;
const { app, BrowserWindow, Menu, dialog, ipcRenderer } = require('electron'); // Modules to control application life and create native browser window
// import { app, BrowserWindow, Menu, dialog, ipcRenderer } from('electron'); // Modules to control application life and create native browser window
// console.log(process.argv.toString())


if (window.addEventListener) {
  window.addEventListener('load',pageLoaded,false); //W3C
} else {
  window.attachEvent('onload',pageLoaded); //IE
}
function log(txt) {
  console.log(txt);
}
function pageLoaded() {
  let supercontainer = document.getElementById('supercontainer');
  let dragitem = document.getElementById('dragitem')

  node.addEventListener('dragover', function(evt) {
    log(evt)
  })
  node.addEventListener('drop', function(evt) {
    log(evt)
  })

  dragitem.addEventListener('dragstart', (evt) => {
    evt.dataTransfer.effectAllowed = 'copy'
    evt.preventDefault()
    ipcRenderer.send('ondragstart', `${__dirname}/abc.txt`)
  })

  supercontainer.ondragstart = (evt) => {
    evt.preventDefault()
    ipcRenderer.send('ondragstart', 'favicon.ico')
    supercontainer.classList.add('showdropzone')
  }

  supercontainer.ondragover = () => {
    supercontainer.classList.add('showdropzone')
    return false;
  };

  supercontainer.ondragleave = () => {
    supercontainer.classList.remove('showdropzone')
    return false;

  };

  supercontainer.ondragend = () => {
    supercontainer.classList.remove('showdropzone')
    return false;
  };

  supercontainer.ondrop = (evt) => {
    supercontainer.classList.remove('showdropzone')
    evt.preventDefault();
    for (let f of evt.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f.path)
    }
    return false;
  };


  initBitmap();
  init3D();
  setScene();
  setupFNames();
  //
  animate();
  // // setupColorPicker();
  // stat("[pageLoaded] Welcome to the Amino See DNA viewer");
  // if (devmode) {
  //   stat("devmode");
  //   togglePause();
  //   toggleSpin();
  //   togglePause(); // done twice to re-trigger the autopause
  // }
}

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(`asynchronous: ${arg}`) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping sent from renderer')






dialog.showOpenDialog((filenames) => {
  if (filesNames === undefined ) {
    console.log("no files were selected");
    return;
  } else {
    console.log(`Renderer thread got: ${filesNames}`);

  }

} )
document.getElementById('choosefiles').addEventListener('change', filesIpc, false);





// function setupColorPicker() {
//
//   var cloudCanvas = document.getElementById('cloudCanvas');
//   toggleFileUpload();
//   document.getElementById('choosefiles')
//   value_for_Event_Label = "File Chooser"
// }

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


function filesIpc(evt) {
  document.getElementById('cancel').classList.remove('hidden');
  // alert(evt.toString());
  let choosefiles = evt.target.files;
  let commandString = " --html ";
  for (i=0; i<choosefiles.length; i++) {
    // alert(choosefiles[i].toString());
    commandString += choosefiles[i].toString();

    // downloader.postMessage({
    //   aTopic: 'do_LoadURL',
    //   filename: choosefiles[i],
    //   url: choosefiles[i],
    //   type: 'text/plain'
    // });
  }
  ipcRenderer.send('do_LoadFile', {
    aTopic: 'do_LoadURL',
    filename: commandString,
    url: choosefiles[i],
    type: 'text/plain'
  })
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
