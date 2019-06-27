const aminosee = require('./aminosee-cli');
const server = require('./aminosee-server')


module.exports = randomAnimal => {

  // genDNA(99)
  console.log('hello ');
  // genDNA(9999);
  cliInstance = AminoSeeNoEvil();
  cliInstance.addJob(process.argv); // do stuff that is needed even just to run "aminosee" with no options.


}



function genDNA(iterations) { // generate random DNA
  let randomDNA = "";
  let possibleBases = "ACGTacgt";
  for (let i=0; i < Math.round(iterations)*3; i++) {
    randomDNA += possibleBases.charAt( Math.floor( Math.random() * possibleBases.length ) );
  }
  console.log(randomDNA);
  return randomDNA;
}
