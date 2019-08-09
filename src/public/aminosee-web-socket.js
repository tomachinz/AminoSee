var Terminal = require('xterm').Terminal;

// var term = new Terminal();
let term = new Terminal({
  cursorBlink: true,
})
term.open(document.getElementById('terminal'));
term.write('Greets from \x1B[1;3;31mxterm.js\x1B[0m $ ')

// var os = require('os');
var pty = require('node-pty');

// Initialize node-pty with an appropriate shell
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd(),
  env: process.env
});

// Initialize xterm.js and attach it to the DOM
const xterm = new Terminal();
xterm.open(document.getElementById('xterm'));

// Setup communication between xterm.js and node-pty
xterm.on('data', (data) => {
  ptyProcess.write(data);
});
ptyProcess.on('data', function (data) {
  xterm.write(data);
});


// import Terminal from 'xterm'

let channel = socket.channel("terminal:1", {})
channel.join()
channel.on('output', ({output}) => term.write(output)) // From the Channel




term.open(document.getElementById('terminal-container'))
term.on('data', (data) => channel.push('input', {input: data})) // To the Channel

aminosee('test').then(result => document.body.textContent = result);







/*  from: https://www.sitepoint.com/html5-file-drag-and-drop/ goes with
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
		}

	}


	// output file information
	function ParseFile(file) {
    let fullpath = path.resolve( file.name );

		Output(
			"<p>File information: <strong>" + file.name +
      "</strong> path: <strong>" + fullpath +
      "</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);

	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			    filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		// fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			// filedrag.addEventListener("dragover", FileDragHover, false);
			// filedrag.addEventListener("dragleave", FileDragHover, false);
			// filedrag.addEventListener("drop", FileSelectHandler, false);
			// filedrag.style.display = "block";

			// remove submit button
			// submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();
