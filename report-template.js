const asciiart = `
      MADE IN NEW ZEALAND
      ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
      ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
      ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
      by Tom Atkinson            aminosee.funk.nz
       ah-mee no-see       "I See It Now - I AminoSee it!"
`;
// module.exports = () => {
//   this.pepTable = pepTable;
//   console.log("data module");
//   getPepTable() {
//     return pepTable;
//   }
// }
// module.exports.pep
// Linux exit codes:
// 1 - Catchall for general errors
// 2 - Misuse of shell builtins (according to Bash documentation)
// 3 - Job array empty
// 4 - Render lock failed.
// 5 - Crash during DNA render.
// 6 - Failed to allocate correct image size (doh!)
// 126 - Command invoked cannot execute
// 127 - “command not found”
// 128 - Invalid argument to exit
// 128+n - Fatal error signal “n”
// 130 - Script terminated by Control-C
// 255\* - Exit status out of range
const extensions = [ "txt", "fa", "mfa", "gbk", "dna", "fasta", "fna", "fsa", "mpfa", "gb", "gff"];

function showFlags() {
  return `${(  force ? "F" : "-"    )}${(  args.updates || args.u ? `U` : "-"    )}${(  userCPP != -1 ? `C${userCPP}` : "--"    )}${(  args.keyboard || args.k ? `K` : "-"    )}${(  args.spew || spew ? `Spew` : "-"    )}${( verbose ? "V" : "-"  )}${(  artistic ? "A" : "-"    )}${(  args.ratio ? `${ratio}` : "960px fixed"    )}${(dimension? "M" + dimension:"M?")}C${onesigbitTolocale(codonsPerPixel)}${(reg?"REGMARKS":"NOREG")}`;
}
function testSummary() {
  return `TEST
  Filename: <b>${justNameOfDNA}</b>
  Registration Marks: ${( reg ? true : false )}
  ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
  Your custom flags: TEST${(  force ? "F" : ""    )}${(  userCPP != -1 ? `C${userCPP}` : ""    )}${(  devmode ? "D" : ""    )}${(  args.ratio || args.r ? `${ratio}` : ""    )}${(  args.magnitude || args.m ? `M${dimension}` : ""    )}
  ${(  artistic ? `Artistic Render` : `Science`    )} Mode
  Hilbert dimension: ${dimension} / ${computerWants} limit
  Theoretical Limit: ${maxmag} hard coded
  Max pix: ${maxpix.toLocaleString()}
  Hilbert Curve Pixels: ${hilbPixels[dimension]}`;
}
function renderSummary() {
  maxpix += 0; // cast it into a number from whatever the heck data type it was before!
  return `
  Canonical Filename: <b>${justNameOfDNA}</b>
  Source: ${justNameOfCurrentFile}
  Run ID: ${timestamp} Host: ${hostname}
  AminoSee version: ${version}
  Highlight set: ${isHighlightSet} ${(isHighlightSet ? peptide + " " + triplet : peptide)}
  ${ ( peptide || triplet ) ?  "Highlights: " + (peptide || triplet) : " "}
  Your custom flags: ${(  force ? "F" : ""    )}${(  userCPP != -1 ? `C${userCPP}` : ""    )}${(  devmode ? "D" : ""    )}${(  args.ratio || args.r ? `${ratio}` : "   "    )}${(  args.magnitude || args.m ? `M${dimension}` : "   "    )}
  ${(  artistic ? `Artistic Mode` : `Science Mode`    )}
  Aspect Ratio: ${ratio}
  Input bytes: ${baseChars.toLocaleString()}
  Output bytes: ${rgbArray.length.toLocaleString()}
  Estimated Codons by file size: ${Math.round(estimatedPixels).toLocaleString()}
  Actual Codons matched: ${genomeSize.toLocaleString()}
  Estimate accuracy: ${Math.round(((estimatedPixels / genomeSize)-1)*100)}%
  Non-Base Clock: ${errorClock.toLocaleString()}
  Bases Clock: ${charClock.toLocaleString()}
  Codons per pixel linear image: ${twosigbitsTolocale(codonsPerPixel)}
  Codons per pixel hilbert: ${twosigbitsTolocale(codonsPerPixelHILBERT)}
  Pixels linear: ${colClock.toLocaleString()}
  Pixels hilbert: ${hilbPixels[dimension].toLocaleString()}
  Scale down factor:  ${twosigbitsTolocale(shrinkFactor)}
  overSampleFactor: ${twosigbitsTolocale(overSampleFactor)}
  Amino acid blend opacity: ${Math.round(opacity*10000)/100}%
  Users Max magnitude: ${ ( magnitude != false ? `${magnitude}/ 10 ` : "Not Set" ) } Max pix:${maxpix.toLocaleString()}
  Hilbert Magnitude: ${dimension} / ${defaultMagnitude}
  Hilbert Curve Pixels: ${hilbPixels[dimension]}
  Darken Factor ${twosigbitsTolocale(darkenFactor)}
  Highlight Factor ${twosigbitsTolocale(highlightFactor)}
  Time used: ${runningDuration.toLocaleString()} miliseconds`;
}



function openMiniWebsite(f) {
  try {
    opn(`${serverURL}/${f}`);
  } catch(e) {
    error(`during openMiniWebsite: ${e} URL: ${serverURL}/${f}`);
  }
  stat("Personal mini-Webserver starting up around now (hopefully) on port 3210");
  stat(`visit ${serverURL} in your browser to see 3D WebGL visualisation`);
  console.log(terminalRGB("ONE DAY this will serve up a really cool WebGL visualisation of your DNA PNG. That day.... is not today though.", 255, 240,10));
  console.log(terminalRGB("IDEA: Maybe send some bitcoin to the under-employed creator tom@funk.co.nz to convince him to work on it?", 240, 240,200));
  stat("Control-C to quit");

}
function saveJSON() {
    log( pepTable.sort( compareHistocount ) ); // least common amino acids in front
    // var jsonObj = JSON.parse(jsonData);
    // console.log(jsonObj);
    // stringify JSON Object
    let histoJSON = path.normalize( path.resolve(`${currentOutputPath}/${justNameOfDNA}/${justNameOfDNA}_histogram.json`) );
    output(`currentOutputPath is ${currentOutputPath}`);
    fs.writeFile(histoJSON, JSON.stringify(pepTable), 'utf8', function (err) {
      if (err) {
        error("occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("Amino acid histogram JSON file has been saved to: " + histoJSON);

    });
}
function welcomeMessage() {
  output('usage:');
  output('    aminosee [files/*] --flags            (to process all files)');
  output(' ');
  output(terminalRGB('TIP: if you need some DNA in a hurry try this random clipping of 1MB human DNA:', 255,255,200));
  output('wget https://www.funk.co.nz/aminosee/dna/megabase.fa');
  output(' ');
  output('examples:    ');
  output('     aminosee Human-Chromosome-DNA.txt --force (force overwrite fresh render)');
  output('     aminosee chr1.fa -m 8                 (render at 2048x2048)');
  output('     aminosee * --peptide="Glutamic acid" (use quotes if there is a space)');
  output('     aminosee * --triplet=GGT (must be only 3 characters of ATCGU)');
  output('     aminosee test                 (generate calibration images)');
  output('     aminosee serve                (fire up the mini web server)');
  output('     aminosee help   <<-----               (shows options flags)');
  output('     aminosee demo   <<-----           (run demo - beta version)');
  output('     aminosee chr1.fa  chrX.fa  chrY.fa         (render 3 files)');
  output('     aminosee *         (render all files with default settings)');
  term.down(termStatsHeight);
  printRadMessage();
}

function helpCmd(args) {
  output('Welcome to the AminoSeeNoEvil DNA Viewer!');
  output(`This CLI is to convert sequence found in ASCII/RTF-8 text files - tested with .mfa .fa .gbk up to  into .png graphics. works with .mfa .fa .gbk DNA text files. It's been tested with files up to 3 GB, and uses asynchronous streaming architecture! Pass the name of the DNA file via command line, and it will put the images in a folder called 'output' in the same folder.`);
  output(' ');
  output(chalk.inverse("Help section"));
  output("Hello!");
  output("Author:         tom@funk.co.nz or +64212576422");
  output("calls only between 2pm and 8pm NZT (GMT+11hrs)");
  output(" ");
  output("Donations can be sent to my bitcoin address with thanks:");
  output("15S43axXZ8hqqaV8XpFxayZQa8bNhL5VVa");
  output("https://www.funk.co.nz/blog/online-marketing/pay-tom-atkinson");
  output("variables:");
  output('     --ratio=(square|golden|fixed) (default fixed proportions)');
  output('     --width=1920 -w960  (default 960px requires fixed ratio)');
  output('     --magnitude=[0-8] -m8 (debug setting to limit memory use)');
  output('     --triplet=[ATCGU][ATCGU][ATCGU]      (highlight triplet)');
  output('     --codons=[1-999] -c[1-999]   (reduces quality 1 is best)');
  output('flags:');
  output('     --verbose -v                              (verbose mode)');
  output('     --help -h                            (show this message)');
  output('     --force -f             (ignore locks overwrite existing)');
  output('     --devmode -d  (will skip locked files even with --force)');
  output('     --artistitc -a  (creates a visual rhythm in the picture)');
  output('     --spew -s          (spew DNA bases to the screen during)');
  output('     --no-clear              (dont clear the terminal during)');
  output('     --no-update                       (dont provide updates)');
  output('     --reg    (put registration marks @ 25% 50% 75% and 100%)');
  output('     --test                (create calibration test patterns)');
  output('     --keyboard -k (enable interactive mode, use control-c to end)');
  output("Calibrate your DNA with aminosee --test  ");
  output("run aminosee * to process all dna in current dir");
}


      let dnaTriplets = [
        {
          "DNA": "AAA",
          "Codon": "Lysine",
          "Hue": 313,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AAC",
          "Codon": "Asparagine",
          "Hue": 266,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AAG",
          "Codon": "Lysine",
          "Hue": 313,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AAT",
          "Codon": "Asparagine",
          "Hue": 266,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ACA",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ACC",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ACG",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ACT",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AGA",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AGC",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AGG",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "AGT",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ATA",
          "Codon": "Isoleucine",
          "Hue": 157,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ATC",
          "Codon": "Isoleucine",
          "Hue": 157,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ATG",
          "Codon": "Methionine",
          "Hue": 110,
          "Alpha": 1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "ATT",
          "Codon": "Isoleucine",
          "Hue": 157,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CAA",
          "Codon": "Glutamine",
          "Hue": 250,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CAC",
          "Codon": "Histidine",
          "Hue": 329,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CAG",
          "Codon": "Glutamine",
          "Hue": 250,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CAT",
          "Codon": "Histidine",
          "Hue": 329,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CCA",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CCC",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CCG",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CCT",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CGA",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CGC",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CGG",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CGT",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CTA",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CTC",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CTG",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "CTT",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GAA",
          "Codon": "Glutamic acid",
          "Hue": 16,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GAC",
          "Codon": "Aspartic acid",
          "Hue": 31,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GAG",
          "Codon": "Glutamic acid",
          "Hue": 16,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GAT",
          "Codon": "Aspartic acid",
          "Hue": 31,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GCA",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GCC",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GCG",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GCT",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GGA",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GGC",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GGG",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GGT",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GTA",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GTC",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GTG",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "GTT",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TAA",
          "Codon": "Ochre",
          "Hue": 0,
          "Alpha": 1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TAC",
          "Codon": "Tyrosine",
          "Hue": 282,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TAG",
          "Codon": "Amber",
          "Hue": 47,
          "Alpha": 1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TAT",
          "Codon": "Tyrosine",
          "Hue": 282,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TCA",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TCC",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TCG",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TCT",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TGA",
          "Codon": "Opal",
          "Hue": 240,
          "Alpha": 1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TGC",
          "Codon": "Cysteine",
          "Hue": 63,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TGG",
          "Codon": "Tryptophan",
          "Hue": 188,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TGT",
          "Codon": "Cysteine",
          "Hue": 63,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TTA",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TTC",
          "Codon": "Phenylalanine",
          "Hue": 172,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TTG",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "TTT",
          "Codon": "Phenylalanine",
          "Hue": 172,
          "Alpha": 0.1,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "NNN",
          "Codon": "Non-coding",
          "Hue": 120,
          "Alpha": 1.0,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        },
        {
          "DNA": "",
          "Codon": "NoMatchError",
          "Hue": 120,
          "Alpha": 0,
           "Histocount": 0, "src": null, "z": null, "index": 0,
        }
      ]
      ;

        //PARSE SOURCE CODE
        // https://www.npmjs.com/package/parse-apache-directory-index
          let renderStats = [{ "justNameOfDNA": "loading data.js"}];
          let pepTable   = [
            {
              "Codon": "Non-coding NNN",
              "Description": "Expressed as NNN Codon",
              "Hue": 120,
              "Alpha": 0,
                "Histocount": 0, "src": null, "z": null, "index": 0,
            },
            {
              "Codon": "Ochre",
              "Description": "STOP Codon",
              "Hue": 0,
              "Alpha": 1,
                "Histocount": 0, "src": null, "z": null, "index": 1,
            },
            {
              "Codon": "Glutamic acid",
              "Description": "Group III: Acidic amino acids",
              "Hue": 16,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 2,
            },
            {
              "Codon": "Aspartic acid",
              "Description": "Group III: Acidic amino acids",
              "Hue": 31,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 3,
            },
            {
              "Codon": "Amber",
              "Description": "STOP Codon",
              "Hue": 47,
              "Alpha": 1,
               "Histocount": 0, "src": null, "z": null, "index": 4,
            },
            {
              "Codon": "Cysteine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 63,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 5,
            },
            {
              "Codon": "Glycine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 78,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 6,
            },
            {
              "Codon": "Alanine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 94,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 7,
            },
            {
              "Codon": "Methionine",
              "Description": "START Codon",
              "Hue": 110,
              "Alpha": 1,
               "Histocount": 0, "src": null, "z": null, "index": 8,
            },
            {
              "Codon": "Valine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 125,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 9,
            },
            {
              "Codon": "Leucine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 141,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 10,
            },
            {
              "Codon": "Isoleucine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 157,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 11,
            },
            {
              "Codon": "Phenylalanine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 172,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 12,
            },
            {
              "Codon": "Tryptophan",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 188,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 13,
            },
            {
              "Codon": "Serine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 203,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 14,
            },
            {
              "Codon": "Threonine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 219,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 15,
            },
            {
              "Codon": "Opal",
              "Description": "STOP Codon",
              "Hue": 240,
              "Alpha": 1,
               "Histocount": 0, "src": null, "z": null, "index": 16,
            },
            {
              "Codon": "Glutamine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 250,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 17,
            },
            {
              "Codon": "Asparagine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 266,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 18,
            },
            {
              "Codon": "Tyrosine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 282,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 19,
            },
            {
              "Codon": "Arginine",
              "Description": "Group IV: Basic amino acids",
              "Hue": 297,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 20,
            },
            {
              "Codon": "Lysine",
              "Description": "Group IV: Basic amino acids",
              "Hue": 313,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 21,
            },
            {
              "Codon": "Histidine",
              "Description": "Group IV: Basic amino acids",
              "Hue": 329,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 22,
            },
            {
              "Codon": "Start Codons",
              "Description": "Count of Methionine",
              "Hue": 120,
              "Alpha": 0.0,
               "Histocount": 0, "src": null, "z": null, "index": 23,
            },
            {
              "Codon": "Stop Codons",
              "Description": "One of Opal, Ochre, or Amber",
              "Hue": 120,
              "Alpha": 0.0,
               "Histocount": 0, "src": null, "z": null, "index": 24,
            },
            {
              "Codon": "Proline",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 344,
              "Alpha": 0.1,
               "Histocount": 0, "src": null, "z": null, "index": 25,
            }
          ]
          ;
          const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by peptide.`;


          module.exports.pepTable = pepTable;
          module.exports.asciiart = asciiart;
          module.exports.extensions = extensions;
