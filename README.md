

# AminoSee DNA Viewer
by Tom Atkinson

*A terminal command in node renders a unique colour view of RNA or DNA stored in text files, output to PNG graphics file, then launches an WebGL browser that projects the image onto a 3D Hilbert curve for immersive viewing, using THREEjs.*

## Easy Install
Eventually, I'm hoping to have some prebuilt binaries for Mac, Windows and Linux using Electron. Today, the only way to get the DNA converter on your machine is via source code:

## Install from Source Code
Download this repo to your machine:
```
git clone https://github.com/tomachinz/AminoSee
cd AminoSee
npm install
echo Use sudo npm link to enable command "aminosee" for all users
sudo npm link
```
Now you should be able to just run `aminosee` from your terminal.

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
