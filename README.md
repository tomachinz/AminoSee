

# AminoSee DNA Viewer
by Tom Atkinson

*A terminal command in node renders a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs.*

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
Eventually, I'm hoping to have some prebuilt binaries for Mac, Windows and Linux using Electron. Today, the only way to get the DNA converter on your machine is via source code:

## Install from Source Code
Currently the only way to run it yourself is to run it from source code. This requires the previous install of:
- https://nodejs.org/en/download/
- https://git-scm.com/ 
- https://electronjs.org/

Download this repo to your machine:
```
git clone https://github.com/tomachinz/AminoSee
cd AminoSee
npm install
echo Use sudo npm link to enable command "aminosee" for all users
npm link
sudo npm link aminosee
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
wget https://www.funk.co.nz/aminosee/dna/megabase.fa
aminosee megabase.fa
```
###Official Site
This site was built using [AminoSee Official Site](https://www.funk.co.nz/aminosee/).


##To Do List

- [x] Node CLI to convert DNA into PNG
- [x] A funky WebGL way to look at linear colour maps
- [ ] Link the two together by feeding the PNG into the WebGL
- [ ] Remove use of String, convert to Streaming architecture (half done)
- [ ] Finish the UI, it's possible to move forward using W but but backwards with S not work.
- [ ] Test if array map is faster than for loops, its currently done with for loops
- [ ] Implement GPU acceleration for transcoding step. It uses GPU for the WebGL viewer.
- [ ] During transcoding the histogram shows totals for codons these always show zero still
