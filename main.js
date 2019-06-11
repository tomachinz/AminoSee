// import
// const aminosee = require('./aminosee-cli.js')
const AminoSeeNoEvil = require('./aminosee-cli.js')
const aminosee = require('./aminosee-cli.js')
const server = require('./aminosee-server')
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron') // Modules to control application life and create native browser window
const extensions = [ "txt", "fa", "mfa", "gbk", "dna"] // replace with that from data.js
const path = require('path')
const spawn = require('cross-spawn');
let threads = [ ]; // these will be threads from spawn
let mainWindow, devmode




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// app.commandLine.appendSwitch('remote-debugging-port', '8315')
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')
app.commandLine.appendSwitch('devmode', 'true')
// require('electron').remote.process.argv;
function toggleDevmode() {
  if (devmode) {
    devmode = false;
    mainWindow.webContents.toggleDevTools();
  } else {
    devmode = true;
    mainWindow.webContents.toggleDevTools();
  }
  // togglePause();
}
function log(txt) {
  let d = new Date().getTime();
  let a = 'a';// app.remote.process.argv;
  console.log(`process.argv: [${process.argv}]`)
  console.log(`main.js: [${d} txt: ${txt} argv: ${a}]`);
}

function showOpenDialog() {
  // defaultPath: '~',
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
    properties: ['openFile', 'openDirectory', 'multiSelections'],
    message: 'Any text file containing ASCII base pairs like: ACGTUacgtu'
  };
  const selectedPaths = dialog.showOpenDialog();
  pushCli(selectedPaths);
  // threads.push(selectedPaths);
  // aminosee.cli([commandString, '-v', '', '0']);
}
function pushCli(commandString) {
  // let threads = [ spawn('aminosee'  , ['serve', '', '', '0'], { stdio: 'pipe' }) ];
  // threads.push( spawn('aminosee'  , [commandString, '--no-gui'], { stdio: 'pipe' }) );
  console.log(`Starting AminoSee now with CLI:`);
  commandString = `${commandString} --html`;

  let commandArray = commandString.split("\\s+");

  console.log(`commandString: [${commandString}]`);
  // let aWeeJobby = AminoSeeNoEvil('test');
  // aWeeJobby.addJob('demo');
  aminosee.addJob(commandArray)
  // aminosee.cli(commandString)
  // setTimeout(() => {
  //   console.log(`!random!`);
  //   pushCli('w hi')
  // }, Math.random() * 30000)
  // threads.push( spawn('aminosee'  , [commandString, '--html'], { stdio: 'pipe' }) );
  // threads.push( spawn('w'  , ['hi'], { stdio: 'pipe' }) );
  //
  // threads[0].stdout.on('data', (data) => {
  //   console.log(`aminosee main.js [ ${data} ]`);
  // });
  // threads[0].stderr.on('data', (data) => {
  //   console.log(`aminosee main.js [ ${data} ]`);
  // });
  // threads[0].on('close', (code) => {
  //   // console.log(`aminosee main.js [ ${data} ]`);
  //   console.log(`child process exited with code ${code}`);
  //   threads.pop();
  // });
  // console.log(`threads.length: [ ${threads.length}]`);
  // console.log(`process.title: [ ${threads.title}]`);
}
function createWindow () {
  const electron = require('electron');
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize


  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: Math.round(width*0.6),
    height:  Math.round(height*0.4),
    title: "AminoSee",
    backgroundColor: '#011224',
    x: 0,
    y:0,
    icon: path.join(__dirname, 'public/favicon.png')
  })

  // mainWindow.setSize(dispWidth-256, dispHeight);
  // , type: 'desktop' , vibrancy: 'light' , titleBarStyle: 'default', fullscreenWindowTitle: false
  let consoleWindow = new BrowserWindow({parent: mainWindow, width: 640, height: 400, title: "Console Output",  backgroundColor: '#011224', frame: true, icon: 'favicon.png', x: width-256, y: 0})
  // , type: 'toolbar'
  // , type: 'toolbar'

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the app.
  mainWindow.loadFile('electron.html')
  consoleWindow.loadFile('console.html')

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
    console.log(arg) // prints "ping"
    event.sender.send('asynchronous-reply', 'pong')
  })
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
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
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          role: 'options'
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






app.on('ready', function() {
  createWindow();
  // pushCli(`help`)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
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
