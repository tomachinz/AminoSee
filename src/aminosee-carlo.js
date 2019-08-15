const carlo = require('carlo');
const os = require('os');
const path = require('path')
// const socket = require('./public/aminosee-web-socket')
const Preferences = require('preferences');
const si = require('systeminformation');
const data = require('./aminosee-data');
const aminosee = require('./aminosee-cli');
const setupPrefs = aminosee.setupPrefs;
const pushCli = aminosee.pushCli;
const port = 6543;

async function runCarlo() {
  const [backend] = await carlo.loadParams();
  const alexaTop5 = [
    'https://google.com', 'https://youtube.com',
    'https://facebook.com', 'https://baidu.com',
    'https://wikipedia.org'];
    for (const url of alexaTop5) {
      const button = document.createElement('button');
      button.textContent = url;
      button.onclick = () => backend.showMyWindow(url);
      document.body.appendChild(button);
      document.body.appendChild(document.createElement('br'));
    }

    // Call the function that was exposed in Node.
    const data = await env();
    const genomes = await aminosee();

    for (const type in data) {
      const div = document.createElement('div');
      div.textContent = `${type}: ${data[type]}`;
      document.body.appendChild(div);
    }
    for (const type in genomes) {
      const div = document.createElement('div');
      div.textContent = `${type}: ${data[type]}`;
      document.body.appendChild(div);
    }

  }

  // function startCarlo() {
  //   (async () => {
  //     // Launch the browser.
  //     const app = await carlo.launch();
  //
  //     // Terminate Node.js process on app window closing.
  //     app.on('exit', () => process.exit());
  //
  //     // Tell carlo where your web files are located.
  //     // app.serveFolder(__dirname);
  //
  //     // Expose 'env' function in the web environment.
  //     await app.exposeFunction('env', _ => process.env);
  //     await app.exposeFunction('aminosee', _ => ['hello world', 'megabase']);
  //     // app.serveFolder( path.resolve( os.homedir + "/AminoSee_output" ) );
  //     // app.serveFolder( path.resolve( os.homedir + "/AminoSee_output" ) );
  //     // app.serveFolder( path.join(__dirname, 'www'));
  //
  //     // Navigate to the main page of your app.
  //     // await app.load('public/home.html');
  //     await app.load('http://localhost:4321/').then( () => { console.log(`rugby was the winner`) }).catch( await app.load('http://localhost:43210/') );
  //   })();
  // }
  // startCarlo();
  //
  // function setupPrefs() {
  //   let output = getOutputFolder();
  //   projectprefs = new Preferences('nz.funk.aminosee.project', {
  //     aminosee: {
  //       opens: 0,
  //       genomes: [ `megabase`, '50KB_TestPattern' ],
  //       url: `http://localhost:4321`
  //     }
  //   }, {
  //     encrypt: false,
  //     file: path.resolve( output + '/aminosee_project.conf'),
  //     format: 'yaml'
  //   });
  //
  //   userprefs = new Preferences('nz.funk.aminosee.user', {
  //     aminosee: {
  //       cliruns: 0,
  //       guiruns: 0,
  //       gbprocessed: 0,
  //       completed: 0
  //     }
  //   }, {
  //     encrypt: false,
  //     file: path.resolve( os.homedir(), '.config/preferences/nz.funk.aminosee.conf'),
  //     format: 'yaml'
  //   });
  //   // Preferences can be accessed directly
  //   userprefs.aminosee.cliruns++; // increment run counter. for a future high score table stat and things maybe.
  //   cliruns = userprefs.aminosee.cliruns;
  //   gbprocessed  = userprefs.aminosee.gbprocessed;
  //   genomes = projectprefs.aminosee.genomes;
  //   url = projectprefs.aminosee.url;
  //   return [ userprefs, projectprefs ]
  // }




  /**
   * Copyright 2018 Google Inc., PhantomJS Authors All rights reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */


  // const os = require('os');
  // const path = require('path');
  // const si = require('systeminformation');

  // args: process.env.DEV === 'true' ? ['--auto-open-devtools-for-tabs', '--allow-insecure-localhost', '--webpack-dev-server', '--https'] : [],


  async function run() {
    let app;
    try {
      app = await carlo.launch(
          { //             localDataDir: path.join(__dirname, '/AminoSee_Output' ),
          // userDataDir: path.join(__dirname, '.carlosysteminfo' ),

            bgcolor: '#012345',
            title: 'AminoSee DNA Viewer',
            width: 1400,
            height: 600,
            channel: ['canary', 'stable'],
            icon: path.join(__dirname, 'public/512_icon.png'),
            args: [ '--allow-insecure-localhost', '--webpack-dev-server'],
            serveOrigin: `http://localhost:${port}`
          });
    } catch(e) {
      // New window is opened in the running instance.
      console.log('Reusing the running instance');
      return;
    }
    app.on('exit', () => process.exit());
    // New windows are opened when this app is started again from command line.
    // app.on('window', window => window.load('http://10.0.0.24:43210/public/'));
    // app.on('window', window => window.load('www/index.html'));

    // let o =  path.join(os.homedir(), '/AminoSee_Output');
    // let o = path.join(__dirname, 'public');
    // let o = path.join(__dirname, 'www');
    let o = path.resolve(__dirname);
    console.log(`serving: ${o}`)
    await app.serveFolder(o);
    await app.exposeFunction('systeminfo', systeminfo);
    await app.exposeFunction('pushCli', pushCli);
    await app.load('www/systeminfo.html');

    // await app.runCarlo()
    // await app.load('http://10.0.0.24:43210/public/');
    // await app.load('public/index.html');
    return app;
  }

  async function systeminfo() {
    const info = {};
    await Promise.all([
      si.battery().then(r => info.battery = r),
      si.cpu().then(r => info.cpu = r),
      si.osInfo().then(r => info.osInfo = r),
    ]);
    return info;
  }

  module.exports = { run };
  // module.exports.startCarlo = { startCarlo };