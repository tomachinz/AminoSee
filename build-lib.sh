#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo GENERATE CREDITS.TXT
nice npm run credits &
echo GENERATE VERSION NUMBER IMPORT needs to be run in ./
npm run genversion
echo GENERATE BROWSERIFY BUNDLE
npm run browserify

echo COPYING LIBRARIES INTO dist/root
echo items in dist/root will go in the root of the dist folder
# echo
mkdir -p dist
mkdir -p dist/root
mkdir -p dist/root/public
mkdir -p dist/root/termconfig
mkdir -p dist/root/node_modules
mkdir -p dist/root/node_modules/terminal-kit
mkdir -p dist/root/node_modules/lazyness
mkdir -p dist/root/node_modules/sliced/
mkdir -p dist/root/node_modules/deep-defaults
mkdir -p dist/root/node_modules/deep-defaults/lib
mkdir -p dist/root/node_modules/termconfig
mkdir -p dist/AminoSee_macos
mkdir -p dist/AminoSee_win
mkdir -p dist/AminoSee_linux
# mkdir -p dist/electron

mkdir -p build
mkdir -p build/toms_source/

# wget  --output-document src/public/es6-promise.auto.min.js        https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js &
# wget  --output-document src/public/fetch.min.js                   https://cdnjs.cloudflare.com/ajax/libs/fetch/1.0.0/fetch.min.js &

# cp -v public/aminosee-web-gui.js                                 dist/root/public/aminosee-web-gui.js
# cp -v aminosee-serve.js                                          dist/root/aminosee-serve.js
# cp -v aminosee-cli.js                                            dist/root/
# cp -v aminosee-settings.js                                       dist/root/
# cp -v main.js                                                    dist/root/
# cp -v renderer.js                                                dist/root/
# cp -v aminosee-stdinpipe.js                                      dist/root/

cp -v node_modules/sliced/index.js                               dist/root/node_modules/sliced/index.js
cp -v node_modules/deep-defaults/lib/index.js                      dist/root/node_modules/deep-defaults/lib
cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  dist/root/node_modules/termconfig
cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  dist/root/termconfig
cp -v node_modules/get-cursor-position/build/Release/pos.node    dist/root
cp -v node_modules/open/xdg-open                                 dist/root
cp -r node_modules/terminal-kit/*                                dist/root/node_modules/terminal-kit
cp -r node_modules/lazyness/*                                    dist/root/node_modules/lazyness
# cp -r public/*                                                   dist/root/public

# for the awesome shell window:
cp    node_modules/xterm/dist/xterm.js                           src/public/
cp    node_modules/xterm/dist/xterm.css                          src/public/
cp    node_modules/xterm/dist/xterm.js.map                       src/public/
cp    node_modules/three/build/three.min.js                      src/public/
cp    node_modules/parallax-js/dist/parallax.min.js              src/public/

#
# echo creating distributions
# echo COPYING LIBRARIES INTO /dist/* APP ROOT FOLDERS
cp -r  docs/* dist/Aminosee_macos
cp -r  docs/* dist/Aminosee_linux
cp -r  docs/* dist/Aminosee_win

./gource.sh
