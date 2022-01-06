import { Terminal } from 'xterm';

let term = new Terminal();

term.open(document.getElementById('xterm-container'));
term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $  and AminoSeeNoEvil!!!!!!!!!!!!!')


if (typeof console  != "undefined") {
  if (typeof console.log != 'undefined') {
    console.olog = console.log;
  }
} else {
  console.olog = function() {};
}




console.log = function(message) {
  console.olog(message);
  $('#debugDiv').append('<p>' + message + '</p>');
};
console.error = console.debug = console.info =  console.log
console.log("hello world")
