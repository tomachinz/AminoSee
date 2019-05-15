#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo COPYING LIBRARIES INTO /lib
mkdir -p lib
mkdir -p dist
mkdir -p dist/node_modules
# mkdir -p dist/node_modules/sliced/
mkdir -p dist/node_modules/deep-defaults
mkdir -p dist/node_modules/deep-defaults/lib
mkdir -p dist/node_modules/termconfig

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
cp -r -v lib/* bin
cp -r -v dist/node_modules bin

cp -r  lib/* dist/Aminosee_macos
cp -r  lib/* dist/Aminosee_linux
cp -r  lib/* dist/Aminosee_win

cp -r -v dist/node_modules dist/Aminosee_macos
cp -r    dist/node_modules dist/Aminosee_linux
cp -r    dist/node_modules dist/Aminosee_win
