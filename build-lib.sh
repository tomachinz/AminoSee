#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo COPYING LIBRARIES INTO dist/root
echo items in dist/root will go in the root of the dist folder
echo
mkdir -p dist
mkdir -p dist/root
mkdir -p dist/root/node_modules
# mkdir -p dist/node_modules/sliced/
mkdir -p dist/root/node_modules/deep-defaults
mkdir -p dist/root/node_modules/deep-defaults/lib
mkdir -p dist/root/node_modules/termconfig

# mkdir -p lib/termconfig
# cp -r -v node_modules/deep-defaults dist/node_modules
# cp -r -v node_modules/terminal-kit dist/node_modules

# cp -v node_modules/sliced/index.js dist/node_modules/sliced/index.js
cp -v node_modules/deep-defaults/lib/index.js dist/node_modules/deep-defaults/lib/index.js
cp -r dist/docs dist/Aminosee_macos
# cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  dist/node_modules/termconfig

# THIS ONE IS ODD:
cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  lib/termconfig
cp -v node_modules/get-cursor-position/build/Release/pos.node lib
cp -v node_modules/opn/xdg-open lib

# CP -V node_modules/electron/dist lib/electron/dist

echo GENERATE VERSION NUMBER IMPORT
npm run genversion
echo GENERATE BROWSERIFY BUNDLE
npm run build-browserify

echo creating distributions
cp -r dist/docs dist/Aminosee_macos
cp -r dist/docs dist/Aminosee_linux
cp -r dist/docs dist/Aminosee_win

echo COPYING LIBRARIES INTO /dist/* APP ROOT FOLDERS
cp -r -v lib/* dist/root/lib

cp -r  dist/root/* dist/Aminosee_macos
cp -r  dist/root/* dist/Aminosee_linux
cp -r  dist/root/* dist/Aminosee_win
