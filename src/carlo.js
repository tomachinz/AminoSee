const carlo = require('carlo');
const data = require('./aminosee-data');
const aminosee = require('./aminosee-cli');
const Preferences = require("preferences");
const setupPrefs = aminosee.setupPrefs;

async function run() {
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

  function startCarlo() {
    (async () => {
      // Launch the browser.
      const app = await carlo.launch();

      // Terminate Node.js process on app window closing.
      app.on('exit', () => process.exit());

      // Tell carlo where your web files are located.
      // app.serveFolder(__dirname);

      // Expose 'env' function in the web environment.
      await app.exposeFunction('env', _ => process.env);
      await app.exposeFunction('aminosee', _ => ['hello world', 'megabase']);

      // Navigate to the main page of your app.
      // await app.load('public/home.html');
      await app.load('http://localhost:4321/public/index.html').then( () => { console.log(`rugby was the winner`) }).catch( await app.load('http://localhost:43210/public/index.html') );
    })();
  }
  startCarlo();
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
