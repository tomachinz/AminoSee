

# AminoSee DNA Viewer
by Tom Atkinson

A node command to convert any DNA sequence into an abstract image, and a built-in web server to show your work to others. Your renders will end up in ~/AminoSee_Output or create a folder with that name in the same folder as your DNA to enable zero-conf cluster rendering (it uses lock files to synchronise the nodes).

Tested with FASTA .fa and GBK files on macOS, Linux and Windows. Just feed it a file, simple as:

```aminosee dna/megabase.fa```

To render the sample DNA included in this repo.

No file size limit - tested with a 3.11 GB Chimpanzee genome - AminoSee streams through the file - one line at a time - and outputs a pixel of colour for each triplet found. AminoSee makes an estimate of how many amino acids are present, and starts blending for example 100 codons per pixel in a 9 megapixels image. Smaller microbes and the C.Elegans worm can be seen at 1 pixel per codon resolution on a large 4k monitor! I get about 2 MB/s on my 2015 Mac. To remove the limit use --maxpix 69000000 but I think you will find the default of 9 megapixels is fine.

## What can I see?
DNA structures like repeats, genes, chromosomes, centromere, telomeres etc - which otherwise would appear as incredibly thin 1-pixel-thick lines.

## Why on Earth?
I got the idea while looking at raw DNA and pondering if that advent of 4K monitors mite allow me to "See" all the information. In particular, I'm interested in seeing if it could be useful for cross-species comparisons, criminal forensics, visualisation and animation of mutations over time.

It is possible to see large chromosomal structures such as the Telomeres (grip points at the endings), the Centromeres (place in middle where chromosome breaks in two), and generally check how different the species look.

## And the real reason?
I was wondering how to prove or disprove the official Sumerian account of human history. The hypothesis being that if the Annunaki had spent tens of thousands of years meddling with our DNA, perhaps this will show up visually compared to the natural mutations of ~6 million years which is the separation from homo sapiens to a common Chimp ancestor AFAIK. If the story is true, it might be possible to see something happening around 340,000 to 450,000 years ago, I'm focussing on the fused chromosome 2-pq in humans which is normally 2p and 2q in other apes; and the Y chromosome for its slow rate of mutation to begin with.

```Among the living primates, Humans are most closely related to the apes, which include the lesser apes (Gibbon) and the great apes (Chimpanzee, Gorilla and Orangutan). These so-called hominoids — that is, the gibbons, great apes and humans — emerged and diversified during the Miocene epoch, approximately 23 million to 5 million years ago. The last common ancestor that humans had with chimpanzees lived about 6 million to 7 million years ago. Source: https://www.scientificamerican.com/article/fossil-reveals-what-last-common-ancestor-of-humans-and-apes-looked-liked/ ```

## How on earth is it done?
It creates full colour images and was designed to enable inter-species comparisons by enabling a visual diff; to understand the role of the regulatory “non-coding” junk DNA; as a thought experiment and exercise in processing enormous datasets; but most of all just purely out of curiosity and to inspire youth to get into science.
A new way to view DNA data which maps a spectrum of colour hues to each amino acid, encoding all the information visually. It can take an infinite file size as input, and crunch this into a linear render (left to right, top to bottom), and also a space filling Hilbert curve (top left to centre to top right via all corners).


## 3D and 2D Hilbert mapping
An experimental 3D mode enables visitors to http://aminosee.funk.nz/ to interactively fly through the DNA using the keyboard and mouse for a closer look! This even works on modern mobiles, but a desktop computer running macOS, Windows, or Linux is suggested. You can currently browse though his renderings in the /output/ folder where there is of a handful of organisms such a human, primates, Octopus, Eucalyptus, Cannabis, Alligator, and the Brown Kiwi, with more coming soon, my computer is not powerful enough.

I'm about to get in touch with some universities and genomics researchers worldwide, once the code has settled down a bit, hoping to gain some feedback and suggestions on the final colours for each amino acid, which I am still open to, and planning a way to customise it.

Motto: “I can see it now - I can AminoSee it!”

Amino.See.No.Evil (AminoSee) is a DNA visualisation written in NodeJS, ThreeJS and Carlo. It does this with a terminal command and batch scripts that can be run (such as batch-peptides.sh in ./dna), Its been tested with Fasta or GBK files I downloaded. AminoSee assigns a unique colour hue to each amino acid and start/stop codon,

This is done to enhance the visual prominence of genetic structures -

The bunching of the curve preserves local sequence proximity such that 90% of the DNA that is close to its neighbour - such as genes - are also close in proximity in the image - even at different resolutions, which is almost impossible when converted 1D into higher dimensions. Genomics researchers can convert any file containing ASCII blocks of DNA (tested with popular formats Fasta, GBK, and also just .txt) into an image. A unique visualisation of DNA / RNA residing in text files, AminoSee is a way to render arbitrarily large files - due to support for streamed processing - into a static size PNG image. Special thanks and shot-outs to David Hilbert who invented it in 1891! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be automated by scripts in /dna/ folder is soon to be enhanced with a front-end GUI. AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. The dna/batch-peptides.sh script is currently required for bulk rendering. Alternatively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options allow one to filter by peptide.


"description": "Allows genomics researchers to convert any file containing ASCII blocks of DNA (Fasta, GBK, .txt) into an image. A unique visualisation of DNA / RNA residing in text files, AminoSee is a way to render arbitrarily large files - due to support for streamed processing - into a static size PNG image using a pseudo-Hilbert infinite space filling curve written in the 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Carlo, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. In a directory with DNA files try running aminosee *. Alternatively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options allow one to filter by peptide.",

const siteDescription = `A unique visualisation of DNA or RNA residing in text files, AminoSee is a way to render huge genomics files into a PNG image using an infinite space filling curve from 18th century! Computation is done locally, and the files do not leave your machine. A back-end terminal daemon cli command that can be scripted is combined with a front-end GUI in Carlo, AminoSee features asynchronous streaming processing enabling arbitrary size files to be processed. It has been tested with files in excess of 4 GB and does not need the whole file in memory at any time. Due to issues with the 'aminosee *' command, a batch script is provided for bulk rendering in the dna/ folder. Alternatively use the GUI to Drag and drop files to render a unique colour view of RNA or DNA sto this.red  in text files, output to PNG graphics file, then launches an WebGL this.browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs. Command line options allow one to filter by this.peptide.`;




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
Prebuilt binaries of v1.18.19 for Mac, Windows and Linux. This is a CLI program, so run it from a terminal with a space and a DNA file and press enter:

https://www.funk.co.nz/aminosee/dist/AminoSee_linux.zip	 AminoSee_linux.zip 2019-07-16 09:23	25M	 
https://www.funk.co.nz/aminosee/dist/AminoSee_macos.zip	 AminoSee_macos.zip 2019-07-16 09:23	22M	 
https://www.funk.co.nz/aminosee/dist/AminoSee_win.zip	   AminoSee_win.zip   2019-07-16 09:23	22M

Then you run `aminosee human.dna` to render an image of the DNA.

## Install from Source Code
Run it yourself from source code.

### Install from source requires the previous install of:
- https://nodejs.org/en/download/
- https://git-scm.com/
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

- [x] Implement streaming architecture
- [x] Node CLI to convert DNA into PNG
- [ ] Zip file open
- [ ] Implement streaming for PNG saving
- [ ] A funky WebGL way to look at linear colour maps
- [ ] Link the two together by feeding the PNG into the WebGL
- [ ] Implement GPU acceleration for transcoding step.
- [ ] During transcoding the histogram shows totals for codons these always show zero still
- [ ] Rewrite code engine in Vulkan GPU language

# Contributors and Credits
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

## The Colour Lookup Table   
```
**Amino Acids**  **Hue°**	**RGB*     **Count**     **Description**
Amber	        47°   255,227,128       666,921   STOP CODONS
Tryptophan    188°  128,238,255       893,683   Group I: Nonpolar amino acids
Methionine    110°  149,255,128       944,572   START Codon
Opal          240°  128,128,255       991,394   STOP Codon
Ochre         0°    255,128,128     1,046,848	  STOP Codon Mystery_chrX Ochre
Aspartic acid 31°   255,193,128     1,148,847	  Group III: Acidic amino acids
Histidine     329°  255,128,193     1,658,210	  Group IV: Basic amino acids
Tyrosine      282°  217,128,255     1,693,723   Group II: Polar, uncharged amino acids
Cysteine      63°   249,255,128     1,713,072   Group II: Polar, uncharged amino acids  
Glutamic acid 16°   255,162,128     1,812,490	  Group III: Acidic amino acids
Glutamine     250°  149,128,255     1,912,419	  Group II: Polar, uncharged amino acids    
Alanine       94°   183,255,128     1,942,961	  Group I: Nonpolar amino acids  
Asparagine    266°  183,128,255     2,053,997	  Group II: Polar, uncharged amino acids  
Arginine      297°  249,128,255     2,357,076	  Group IV: Basic amino acids    
Proline       344°  255,128,162     2,379,170	  Group I: Nonpolar amino acids    
Glycine       78°   217,255,128     2,411,578	  Group I: Nonpolar amino acids    
Valine        125°  128,255,138     2,503,263	  Group I: Nonpolar amino acids  
Threonine     219°  128,172,255     2,513,447	  Group II: Polar, uncharged amino acids
Lysine        313°  255,128,227     2,966,509	  Group IV: Basic amino acids
Phenylalanine 172°  128,255,238     3,020,290	  Group I: Nonpolar amino acids
Isoleucine    157°  128,255,206     3,097,667	  Group I: Nonpolar amino acids  
Serine        203°  128,206,255     4,389,976	  Group II: Polar, uncharged amino acids
Leucine       141°  128,255,172     5,447,658	  Group I: Nonpolar amino acids

```
