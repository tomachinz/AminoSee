

# AminoSee DNA Viewer
by Tom Atkinson

A new way to view DNA data which maps a spectrum of colour hues to each amino acid, encoding all the information visually. It can take an infinite file size as input, and crunch this into a linear render (left to right, top to bottom), and also a space filling Hilbert curve (top left to center to top right via all corners).

Tested with files as large as an entire Chimpanzee genome which ids 3.11 GB - AminoSee streams through the file without loading it completely at the file size, makes an estimate of how many codon triplets are present, and starts blending just over 100 codons per pixel in a 9 megapixels image. Smaller microbes and the C.Elegans worm can be seen at 1 pixel per codon resolution on a large 4k monitor! I get about 2 MB/s on my 2015 Mac.

## What?
DNA structures like repeats, genes, chromosomes, centromere, telomeres etc - which otherwise would appear as incredibly thin 1-pixel-thick lines.

## Why on Earth?
I got the idea while looking at raw DNA and pondering if that advent of 4K monitors mite allow me to "See" all the information. In particular, I'm interesting in cross-species comparisons, forensics, visulisation large chromosomal structures such as the Telemeres (grip points at the endings), the Centromeres (place in middle where chromosome breaks in two), and generally check how different the species look.

Another reason, was thinking about ways to prove *or disprove* the Sumerian account of human history. The hypothesis being that the Annunaki had been trying to create fertile hydrids for quite some period.  with our DNA for a solar precession or two. It might be possible to see something happening around 340,000 to 450,000 years ago, I'm focussing on 2A 2B, and the Y chromosome to start. It would be tricky to prove but visuals might help.

## How on earth is it done?
It creates full colour images and was designed to enable inter-species comparisons by enabling a visual diff; to understand the role of the regulatory “non-coding” junk DNA; as a thought experiment and exercise in processing enormous datasets; but most of all just purely out of curiosity and to inspire youth to get into science.


## 3D and 2D Hilbert mapping
An experimental 3D mode enables visitors to http://aminosee.funk.nz/ to interactively fly through the DNA using the keyboard and mouse for a closer look! This even works on modern mobiles, but a desktop computer running macOS, Windows, or Linux is suggested. You can currently browse though his renderings in the /output/ folder where there is of a handful of organisms such a human, primates, Octopus, Eucalyptus, Cannabis, Alligator, and the Brown Kiwi, with more coming soon, my computer is not powerful enough.

I'm about to get in touch with some universities and genomics researchers worldwide, once the code has settled down a bit, hoping to gain some feedback and suggestions on the final colours for each amino acid, which I am still open to, and planning a way to customise it.

***Strapline: “I can see it now - I can AminoSee it!”***



Amino.See.No.Evil (AminoSee) is a DNA visualisation written in NodeJS, ThreeJS and Electron. It does this with a terminal command and batch scripts that can be run (such as batch-peptides.sh in ./dna), Its been tested with Fasta or GBK files I downloaded. AminoSee assigns a unique colour hue to each amino acid and start/stop codon,

This is done to enhance the visual prominence of genetic structures -

The bunching of the curve preserves local sequence proximity such that 90% of the DNA that is close to its neighbour - such as genes - are also close in proximity in the image - even at different resolutions, which is almost impossible when converted 1D into higher dimensions. Genomics researchers can convert any file containing ASCII blocks of DNA (tested with popular formats Fasta, GBK, and also just .txt) into an image. A unique visualisation of DNA / RNA residing in text files, AminoSee is a way to render arbitrarily large files - due to support for streamed processing - into a static size PNG image. Special thanks and shot-outs to David Hilbert who invented it in 1891! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be automated by scripts in /dna/ folder is soon to be enhanced with a front-end GUI. AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. The dna/batch-peptides.sh script is currently required for bulk rendering. Alternatively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options allow one to filter by peptide.


"description": "Allows genomics researchers to convert any file containing ASCII blocks of DNA (Fasta, GBK, .txt) into an image. A unique visualisation of DNA / RNA residing in text files, AminoSee is a way to render arbitrarily large files - due to support for streamed processing - into a static size PNG image using a pseudo-Hilbert infinite space filling curve written in the 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. In a diectory with DNA files try running aminosee *. Alternatively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by peptide.",

const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Electron, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alertively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA sto this.red  in text files, output to PNG graphics file, then launches an WebGL this.browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options alow one to filter by this.peptide.`;




[![Tom explains his AminoSee DNA Viewer App](http://img.youtube.com/vi/QerMTQs2bDs/0.jpg)](http://www.youtube.com/watch?v=QerMTQs2bDs "Video Title")

## 2D Demo
See some real life DNA rendered... you really have to see the image at the link below to get this.
![Clint the Chimp Y Chromosome](https://www.funk.co.nz/aminosee/output/chrYPan%20troC0471%20Clint.gbk_HILBERT__reg_c10.3_fix_sci.png)
Meta data about the image above can be found at the report URL below, it shows 7,625,504 DNA base pairs over 262144 pixels. An intermediate linear image is generated as a side effect and packs about 10 codons per pixel of information by blending the colours at 10% opacity each in this case:
https://www.funk.co.nz/aminosee/output/chrYPan%20troC0471%20Clint.gbk_AMINOSEE-REPORT__reg_c10.3_fix_sci.html
- Features histogram to count frequency of each Amino Acid
- Features filtered image where each Amino Acid is bright and solid, others dim and translucent

## 3D Demo (only showing test patterns presently)
Head over to https://www.funk.co.nz/aminosee for the 3D Hilbert Curve projection (that is planned- currently only showing colour spectrum test patterns).

Soon the demo page will host many images I've generated while developing the software. It can take my machine about 3 minutes to process an entire human chromosome.


## Easy Install
Prebuilt binaries for Mac, Windows and Linux. This is a CLI program, so run it from a terminal:

https://www.funk.co.nz/aminosee/dist/linux.zip linux.zip	28-Dec-2018 20:40	35M	 
https://www.funk.co.nz/aminosee/dist/macos.zip macos.zip	28-Dec-2018 20:42	33M	 
https://www.funk.co.nz/aminosee/dist/win32.zip win32.zip	28-Dec-2018 20:38	30M

## Install from Source Code
Run it yourself from source code.

### Install from source requires the previous install of:
- https://nodejs.org/en/download/
- https://git-scm.com/
- https://electronjs.org/
- https://www.python.org/downloads/
- on windows:  npm install -g windows-build-tools (as admin)

Paste this into a terminal on to your machine, link makes it so you can just type aminosee * in any directory to render those files.
```
git clone https://github.com/tomachinz/AminoSee
cd AminoSee
npm install
npm link
sudo npm link aminosee
```
### Windows
If you see an error like  get-cursor-position@1.0.3 install: `node-gyp rebuild` then you need to click the Start button, type in cmd.exe but right click and "Run as Administrator":
```
sudo npm install -g windows-build-tools
```

## Updates
From the source code folder:
```
git pull
```

## Link so you can run 'aminosee' anywhere
Now you should be able to just run `aminosee` from your terminal, anywhere. If thats not an option then you'd perhaps need to run `node bin/aminosee.js` each time, which the files in your path. Best to use to use npm link.
https://codurance.com/2016/12/21/how-to-use-npm-link/
https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af
https://timber.io/blog/creating-a-real-world-cli-app-with-node/

## How To Convert DNA into PNG

```
aminosee dna.txt
```

First get some DNA or RNA. I built the app using .fa, .mfa, and .gbk files as references. You should be able to see ATCATCGGGTTT type lettering through the file. It's case insenstive. All other letters are filtered out and codons need to be grouped as three consecutive bytes with no line breaks midway.

### Example DNA
Head over to https://www.funk.co.nz/aminosee/dna/ to grab a test file.

For example, this will grab a 1 Megabyte demo file:
```
cd dna
wget https://www.funk.co.nz/aminosee/dna/megabase.fa
aminosee megabase.fa
```
or alternatively, this will do the above, render it, and also generate test calibration images, and fire up the built-in web-server:
```
aminosee demo
```

### Official Site
This site was built using [AminoSee Official Site](https://www.funk.co.nz/aminosee/).

### Documentation


## To Do List

- [x] Node CLI to convert DNA into PNG
- [x] A funky WebGL way to look at linear colour maps
- [ ] Link the two together by feeding the PNG into the WebGL
- [ ] Remove use of String, convert to Streaming architecture (half done)
- [ ] Finish the UI, it's possible to move forward using W but but backwards with S not work.
- [ ] Test if array map is faster than for loops, its currently done with for loops
- [ ] Implement GPU acceleration for transcoding step. It uses GPU for the WebGL viewer.
- [ ] During transcoding the histogram shows totals for codons these always show zero still

#Contributors and Credits
I need a kind sponsor to please to purchase a license for AminoSee to use Georghiou's original image
- Christos Georghiou designed the "See No Evil Hear No Evil Monkeys" http://christosgeorghiou.com/
-  on ShutterStock ID: 8798836 https://www.shutterstock.com/image-vector/vector-illustration-hear-no-evil-see-8798836
- David Hilbert in 1891 designed the curve used in this program
- Giuseppe Peano in 1890 inspired Hilbert to create his space filling curve


## Images
- https://www.quantamagazine.org/how-cells-pack-tangled-dna-into-neat-chromosomes-20180222/
- https://www.sciencenews.org/article/art-dna-folding
- https://www.cell.com/cell/fulltext/S0092-8674(14)01497-4 "A 3D Map of the Human Genome at Kilobase Resolution Reveals Principles of Chromatin Looping"
- https://www.quantamagazine.org/how-cells-pack-tangled-dna-into-neat-chromosomes-20180222/
