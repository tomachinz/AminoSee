const AminoSeeNoEvil = require('./aminosee-cli')
const pushCli = AminoSeeNoEvil.pushCli;
const bruteForce = AminoSeeNoEvil.bruteForce;
const alog = AminoSeeNoEvil.log;
const server = require('./aminosee-server')
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron') // Modules to control application life and create native browser window
const extensions = [ "txt", "fa", "mfa", "gbk", "dna"] // replace with that from data.js
const path = require('path')
const spawn = require('cross-spawn');
let threads = [ ]; // these will be threads from spawn
let mainWindow, devmode, consoleWindow; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.


require('./carlo.js').run();


// app.commandLine.appendSwitch('remote-debugging-port', '5432')
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')
app.commandLine.appendSwitch('host-rules', 'MAP * funk.co.nz')
app.commandLine.appendSwitch('host-rules', 'MAP * localhost')
// app.commandLine.appendSwitch('devmode', 'true')
// app.commandLine.appendSwitch('devmode', 'true')

let start = function() {
  createWindow();
  pushCli(`dna/3MB_TestPattern.txt --serve --verbose --image`)
}

app.on('ready', start)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  AminoSeeNoEvil.gracefulQuit(130, `Electron app closing`)
  app.quit()
  // }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
function updateProgress(number) {
  mainWindow.setProgressBar(number); // -1 remove progress, 0-1 is percentage, 2+ means show indeterminate
}
function toggleDevmode() {
  if (devmode) {
    devmode = false;
    mainWindow.webContents.toggleDevTools();
  } else {
    devmode = true;
    mainWindow.webContents.toggleDevTools();
  }
}
function log(txt) {
  let d = new Date().getTime();
  let a = 'a';// app.remote.process.argv;
  // console.log(`process.argv: [${process.argv}]`)
  alog(`main.js: [${d} txt: ${txt} argv: ${a}]`);
}
function showOpenFolderDialog() {
  const options = {
    title: 'Open multiple DNA files or folders',
    buttonLabel: 'Convert DNA to Image with AminoSee',
    filters: [
      { name: 'TXT', extensions: ['txt'] },
      { name: 'FA',  extensions: ['fa']  },
      { name: 'FNA', extensions: ['fna']  },
      { name: 'FSA', extensions: ['fsa']  },
      { name: 'MFA', extensions: ['mfa'] },
      { name: 'GBK', extensions: ['gbk'] },
      { name: 'GB',  extensions: ['gb'] },
      { name: 'DNA', extensions: ['dna'] }
    ],
    buttonLabel : "Artistic",
    defaultPath : "dna",
    properties: [ 'multiSelections', 'openDirectory' ],
    message: 'Any text file containing DNA as ASCII base pairs like: ACGTUacgtu'
  };
  const selectedPaths = dialog.showOpenDialog();
  mainWindow.setProgressBar(2); // -1 remove progress, 0-1 is percentage, 2+ means show indeterminate
  log(`selectedPaths: ${selectedPaths}`)
  // pushCli(selectedPaths +  " --force --image --html");
  bruteForce(selectedPaths +  " --force --image --html");
}
function showOpenDialog() {
  const options = {
    title: 'Open multiple DNA files or folders',
    filters: [
    { name: 'All Files', extensions: ['*'] }

    // filters: [
    //   { name: 'TXT', extensions: ['txt'] },
    //   { name: 'FA',  extensions: ['fa']  },
    //   { name: 'FNA', extensions: ['fna']  },
    //   { name: 'FSA', extensions: ['fsa']  },
    //   { name: 'MFA', extensions: ['mfa'] },
    //   { name: 'GBK', extensions: ['gbk'] },
    //   { name: 'GB',  extensions: ['gb'] },
    //   { name: 'DNA', extensions: ['dna'] }
    ],
    buttonLabel : "Render DNA",
    defaultPath : "dna",
    properties: [ 'multiSelections', 'openFile', 'openDirectory' ],
    message: 'Any text file containing DNA as ASCII base pairs like: ACGTUacgtu'
  };
  const selectedPaths = dialog.showOpenDialog(options);
  mainWindow.setProgressBar(2); // -1 remove progress, 0-1 is percentage, 2+ means show indeterminate
  log(`selectedPaths: ${selectedPaths}`);
  createTerminal();


  pushCli(selectedPaths);
  // bruteForce(selectedPaths);
}
function createTerminal() {
  console.log(`Starting AminoSee now with CLI:`);

    realTerm = require( "terminal-kit" ).realTerminal ;
    realTerm.blue( "Enter your name: " ) ;
    realTerm.inputField( function( error , name ) {
    	realTerm.green( "\nHello %s!\n" , name ) ;
    	process.exit() ;
    } ) ;
}
function createWindow () {
  const electron = require('electron');
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  const consoleWidth = 640;
  const padding = 64;
  let mainWidth = width - (consoleWidth + padding)
  let mainHeight = Math.round( height / 2)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: mainWidth,
    height: mainHeight,
    title: "AminoSee DNA Viewer [Open DNA File]",
    backgroundColor: '#011224',
    x: padding,
    y: padding,
    icon: path.join(__dirname, 'public/favicon.png')
  })

  // mainWindow.setSize(dispWidth-256, dispHeight);
  // , type: 'desktop' , vibrancy: 'light' , titleBarStyle: 'default', fullscreenWindowTitle: false
  consoleWindow = new BrowserWindow({
    parent: mainWindow,
    width: consoleWidth,
    height: mainHeight,
    title: "Terminal Console",
    backgroundColor: '#011224',
    frame: true,
    icon: path.join(__dirname, 'public/favicon.png'),
    x: padding + mainWidth,
    y: padding
  })
  // , type: 'toolbar'

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('console.html')
  mainWindow.loadFile('public/electron.html')
  consoleWindow.loadFile('public/console.html')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  buildMenus()
  setupEvents()
}
// module.exports.receieveLogs = function (txt) { //receieveLogs
//   ipcMain.send('logs', txt)
// }

function setupEvents() {
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(`asynchronous: ${arg}`) // prints "ping"
    event.reply('asynchronous-reply', 'pong')
  })
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(`synchronous: ${arg}`) // prints "ping"
    event.returnValue = 'pong'
  })
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(`asynchronous msg: ${arg}`) // prints "ping"
    event.sender.send('asynchronous-reply', 'pong')
  })
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(`synchronous msg: ${arg}`) // prints "ping"
    event.returnValue = 'pong'
  })
  ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      file: filePath,
      icon: 'favicon.png'
    })
  })
}

function buildMenus() {
  // const theMenu = BrowserWindow.menu
  // toggleDevmode();
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open DNA or RNA...',
          accelerator: 'CmdOrCtrl+o',
          role: 'open',
          click() {
            showOpenDialog();
          }
        },

        {
          label: 'Process Entire Folder...',
          // accelerator: 'CmdOrCtrl+,',
          role: 'open',
          click() {
            showOpenFolderDialog();
          }
        },

        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          role: 't'
        },
        {
          label: 'Test',
          accelerator: 'CmdOrCtrl+T',
          role: 'options',
          click() {
            pushCli('--test');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        // {role: 'undo'},
        // {role: 'redo'},
        // {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Visit Official Site',
          click () { require('electron').shell.openExternal('http://aminosee.funk.nz') }
        }
      ]
    },
    {
      label: 'Developer',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator:
          process.platform == 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click() {
            toggleDevmode();
          }
        }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services'},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
    // Edit menu
    template[2].submenu.push(
      {type: 'separator'},
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          {role: 'stopspeaking'}
        ]
      }
    )
    // Window menu
    template[4].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function manageThreads(time) {
  if (lockTimer === undefined) { clearTimeout(lockTimer) }
  if ( this.isShuttingDown) { return false }
  var that = this;
  log( threads[0].percentComplete() )
  this.lockTimer = setTimeout( () => {
    log( threads[0].percentComplete() )
    manageThreads(time * 1.618)
  }, time );
}


module.exports.updateProgress = updateProgress;
