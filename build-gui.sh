#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo open ./build-lib.sh
sleep 1
mkdir -p build
rm -rf ./build/TOBEDELETED
mkdir -p build/TOBEDELETED
mv -v ./build/* build/TOBEDELETED

# yarn upgrade
npm upgrade

 ./build-credits.sh
 ./build-lib.sh
 ./gource.sh
 
sleep 30

# echo Requires: npm, electron, electron-packager
# echo Requires: npm, electron, electron-packager
# echo Requires: npm, electron, electron-packager

# echo "And now some bloated electron stuff"
# mkdir -p dist/root/node_modules/electron
# mkdir -p dist/root/node_modules/electron/dist
# cp -r node_modules/electron/dist/*  dist/root/node_modules/electron/dist

#
# echo COPYING LIBRARIES INTO /lib
# mkdir -p lib
# mkdir -p lib/node_modules
# mkdir -p lib/node_modules/sliced/
# mkdir -p lib/node_modules/deep-defaults
# mkdir -p lib/node_modules/terminal-kit/lib/termconfig
# mkdir -p lib/node_modules/electron/dist
#
# echo GENERATE VERSION NUMBER IMPORT
npm run genversion
#

cp -v node_modules/dat.gui/build/dat.gui.min.js src/public
# cp -v node_modules/sliced/index.js lib/node_modules/sliced
# cp -v node_modules/deep-defaults/lib/index.js lib/node_modules/deep-defaults/lib
# cp -v node_modules/get-cursor-position/build/Release/pos.node lib
# cp -v node_modules/open/xdg-open lib
# cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  lib/termconfig
# # CP -V node_modules/electron/dist lib/electron/dist
# cp -r node_modules/electron/dist/* dist/root/node_modules/electron/dist
# path-to-executable/electron/dist
#


echo "Move a bunch of files into $TARGET then run pkg on it"
mkdir -p $TARGET
mkdir -p $TARGET/dna

echo COPYING LIBRARIES INTO /dist/*
mkdir -p $TARGET/dist
mkdir -p $TARGET/dist/root
# cp -r -v docs/* $TARGET/dist/root


# cp -v -r dna/megabase.fa $TARGET/dna
# cp -v -r dna/1KB_TestPattern.txt $TARGET/dna
# cp -v -r dna/3MB_TestPattern.fa $TARGET/dna
# cp -r images $TARGET
# cp -r imports $TARGET
# cp -r bin $TARGET
# cp -r src/  $TARGET
# cp -r package.json $TARGET
# cp -r README.md $TARGET
# cp -r -v docs/* $TARGET
# rm -v $TARGET/public/gource.mp4
# echo COPY AND RENAME package-electron.json $TARGET/package.json
# cp -v package-electron.json $TARGET/package.json
# cp -v electron.html $TARGET
# cp -v main.js $TARGET
# cp -v renderer.js $TARGET
# cp -r node_modules $TARGET

# mkdir "build/THIS FOLDER IS AUTOMATICALLY WIPED BY SCRIPTS"

# cd $TARGET
# pwd
# npm install -v
# npm install pkg
# npm update
# npm run gui &
# cp -r ../dist .
# electron .
# npm run electron
# RUN ELECTRON BUILD BEFORE COPYING THE DIST SHELLS, AND TESTING
# electron-packager ./ --platform=darwin,win32,linux --arch=x64 --prune --overwrite  --output ./dist/electron

# npm run start --no-image
# npm run start megabase.fa --image

# cd ../../
# echo RUNNING AGAIN IN 60 seconds
# pwd
# sleep 50
# echo RUNNING AGAIN IN 10 seconds
# echo RUNNING AGAIN IN 10 seconds
# echo RUNNING AGAIN IN 10 seconds
# echo RUNNING AGAIN IN 10 seconds
# echo RUNNING AGAIN IN 10 seconds
# echo RUNNING AGAIN IN 10 seconds
# sleep 10
# pwd
# cd ../
#
# open ./build.sh
