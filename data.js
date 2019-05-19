
// "use strict";
//       MADE IN NEW ZEALAND
//       ╔═╗┌┬┐┬┌┐┌┌─┐╔═╗┌─┐┌─┐  ╔╦╗╔╗╔╔═╗  ╦  ╦┬┌─┐┬ ┬┌─┐┬─┐
//       ╠═╣││││││││ │╚═╗├┤ ├┤    ║║║║║╠═╣  ╚╗╔╝│├┤ │││├┤ ├┬┘
//       ╩ ╩┴ ┴┴┘└┘└─┘╚═╝└─┘└─┘  ═╩╝╝╚╝╩ ╩   ╚╝ ┴└─┘└┴┘└─┘┴└─
//       by Tom Atkinson            aminosee.funk.nz
//        ah-mee no-see       "I See It Now - I AminoSee it!"

// module.exports = () => {
//   this.pepTable = pepTable;
//   console.log("data module");
//   getPepTable() {
//     return pepTable;
//   }
// }
// module.exports.pep

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
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AAC",
          "Codon": "Asparagine",
          "Hue": 266,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AAG",
          "Codon": "Lysine",
          "Hue": 313,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AAT",
          "Codon": "Asparagine",
          "Hue": 266,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ACA",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ACC",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ACG",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ACT",
          "Codon": "Threonine",
          "Hue": 219,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AGA",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AGC",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AGG",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "AGT",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ATA",
          "Codon": "Isoleucine",
          "Hue": 157,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ATC",
          "Codon": "Isoleucine",
          "Hue": 157,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ATG",
          "Codon": "Methionine",
          "Hue": 110,
          "Alpha": 1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "ATT",
          "Codon": "Isoleucine",
          "Hue": 157,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CAA",
          "Codon": "Glutamine",
          "Hue": 250,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CAC",
          "Codon": "Histidine",
          "Hue": 329,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CAG",
          "Codon": "Glutamine",
          "Hue": 250,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CAT",
          "Codon": "Histidine",
          "Hue": 329,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CCA",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CCC",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CCG",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CCT",
          "Codon": "Proline",
          "Hue": 344,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CGA",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CGC",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CGG",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CGT",
          "Codon": "Arginine",
          "Hue": 297,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CTA",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CTC",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CTG",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "CTT",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GAA",
          "Codon": "Glutamic acid",
          "Hue": 16,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GAC",
          "Codon": "Aspartic acid",
          "Hue": 31,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GAG",
          "Codon": "Glutamic acid",
          "Hue": 16,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GAT",
          "Codon": "Aspartic acid",
          "Hue": 31,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GCA",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GCC",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GCG",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GCT",
          "Codon": "Alanine",
          "Hue": 94,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GGA",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GGC",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GGG",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GGT",
          "Codon": "Glycine",
          "Hue": 78,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GTA",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GTC",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GTG",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "GTT",
          "Codon": "Valine",
          "Hue": 125,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TAA",
          "Codon": "Ochre",
          "Hue": 0,
          "Alpha": 1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TAC",
          "Codon": "Tyrosine",
          "Hue": 282,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TAG",
          "Codon": "Amber",
          "Hue": 47,
          "Alpha": 1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TAT",
          "Codon": "Tyrosine",
          "Hue": 282,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TCA",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TCC",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TCG",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TCT",
          "Codon": "Serine",
          "Hue": 203,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TGA",
          "Codon": "Opal",
          "Hue": 240,
          "Alpha": 1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TGC",
          "Codon": "Cysteine",
          "Hue": 63,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TGG",
          "Codon": "Tryptophan",
          "Hue": 188,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TGT",
          "Codon": "Cysteine",
          "Hue": 63,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TTA",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TTC",
          "Codon": "Phenylalanine",
          "Hue": 172,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TTG",
          "Codon": "Leucine",
          "Hue": 141,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "TTT",
          "Codon": "Phenylalanine",
          "Hue": 172,
          "Alpha": 0.1,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "NNN",
          "Codon": "Non-coding",
          "Hue": 120,
          "Alpha": 1.0,
          "Histocount": 0, "src": null, "z": null,
        },
        {
          "DNA": "",
          "Codon": "NoMatchError",
          "Hue": 120,
          "Alpha": 0,
          "Histocount": 0, "src": null, "z": null,
        }
      ]
      ;

        //PARSE SOURCE CODE
        // https://www.npmjs.com/package/parse-apache-directory-index

          let pepTable   = [
            {
              "Codon": "Non-coding NNN",
              "Description": "Expressed as NNN Codon",
              "Hue": 120,
              "Alpha": 0,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Ochre",
              "Description": "STOP Codon",
              "Hue": 0,
              "Alpha": 1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Glutamic acid",
              "Description": "Group III: Acidic amino acids",
              "Hue": 16,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Aspartic acid",
              "Description": "Group III: Acidic amino acids",
              "Hue": 31,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Amber",
              "Description": "STOP Codon",
              "Hue": 47,
              "Alpha": 1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Cysteine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 63,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Glycine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 78,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Alanine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 94,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Methionine",
              "Description": "START Codon",
              "Hue": 110,
              "Alpha": 1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Valine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 125,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Leucine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 141,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Isoleucine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 157,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Phenylalanine",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 172,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Tryptophan",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 188,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Serine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 203,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Threonine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 219,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Opal",
              "Description": "STOP Codon",
              "Hue": 240,
              "Alpha": 1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Glutamine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 250,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Asparagine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 266,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Tyrosine",
              "Description": "Group II: Polar, uncharged amino acids",
              "Hue": 282,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Arginine",
              "Description": "Group IV: Basic amino acids",
              "Hue": 297,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Lysine",
              "Description": "Group IV: Basic amino acids",
              "Hue": 313,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Histidine",
              "Description": "Group IV: Basic amino acids",
              "Hue": 329,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Start Codons",
              "Description": "Count of Methionine",
              "Hue": 120,
              "Alpha": 0.0,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Stop Codons",
              "Description": "One of Opal, Ochre, or Amber",
              "Hue": 120,
              "Alpha": 0.0,
              "Histocount": 0, "src": null, "z": null,
            },
            {
              "Codon": "Proline",
              "Description": "Group I: Nonpolar amino acids",
              "Hue": 344,
              "Alpha": 0.1,
              "Histocount": 0, "src": null, "z": null,
            }
          ]
          ;
          const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by peptide.`;


          module.exports.pepTable = pepTable;
