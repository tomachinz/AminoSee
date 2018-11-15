

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
npm link aminosee
```


###Links
You can create an inline link by wrapping link text in brackets [ ], and then wrapping the URL in parentheses ( ). You can also use the keyboard shortcut command + k to create a link.

This site was built using [AminoSee Official Site](https://www.funk.co.nz/aminosee/).


##To Do List

- [x] Node CLI to convert DNA into PNG
- [x] A funky WebGL way to look at linear colour maps
- [ ] Link the two together by feeding the PNG into the WebGL
- [ ] Remove use of String, convert to Streaming architecture (half done)
- [ ] Finish the UI, it's possible to move forward using W but but backwards with S not work.
- [ ] Test if array map is faster than for loops, its currently done with for loops
- [ ] Implement GPU acceleration for transcoding step. It uses GPU for the WebGL viewer.




Style	Syntax	Keyboard shortcut	Example	Output
Bold	** ** or __ __	command/control + b	**This is bold text**	This is bold text
Italic	* * or _ _	command/control + i	*This text is italicized*	This text is italicized
Strikethrough	~~ ~~		~~This was mistaken text~~	This was mistaken text
Bold and italic	** ** and _ _		**This text is _extremely_ important**	This text is extremely
