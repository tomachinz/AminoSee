#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo open ./build-lib.sh
sleep 1
open ./build-lib.sh

echo Requires: npm, electron, electron-packager
echo Requires: npm, electron, electron-packager
echo Requires: npm, electron, electron-packager

echo "And now some bloated electron stuff"
mkdir -p dist/root/node_modules/electron
mkdir -p dist/root/node_modules/electron/dist
cp -r node_modules/electron/dist/*  dist/root/node_modules/electron/dist

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
# npm run genversion
#
# cp -v node_modules/sliced/index.js lib/node_modules/sliced
# cp -v node_modules/deep-defaults/lib/index.js lib/node_modules/deep-defaults/lib
# cp -v node_modules/get-cursor-position/build/Release/pos.node lib
# cp -v node_modules/opn/xdg-open lib
# cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  lib/termconfig
# # CP -V node_modules/electron/dist lib/electron/dist
# cp -r node_modules/electron/dist/* dist/root/node_modules/electron/dist
# path-to-executable/electron/dist
#


echo "Move a bunch of files into $TARGET then run pkg on it"
mkdir build
mkdir $TARGET
mkdir -p $TARGET/dna

echo COPYING LIBRARIES INTO /dist/*
mkdir -p $TARGET/dist
mkdir -p $TARGET/dist/root
# cp -r -v dist/root/* $TARGET/dist/root


cp -v -r dna/megabase.fa $TARGET/dna
cp -r images $TARGET
cp -r imports $TARGET
cp -r lib $TARGET
cp -r bin $TARGET
cp -r aminosee-cli.js $TARGET
cp -r aminosee-gui-web.js $TARGET
cp -r aminosee-server.js $TARGET
cp -r settings.js $TARGET
cp -r data.js $TARGET
cp -r bundle.js $TARGET
cp -r package.json $TARGET
cp -r README.md $TARGET
cp -r bundle.js $TARGET
cp -r settings.js $TARGET
cp -r index.html $TARGET
cp -r console.js $TARGET
cp -r favicon.ico $TARGET
cp -r favicon.png $TARGET
cp -r -v dist/root/* $TARGET

echo COPY AND RENAME package-electron.json $TARGET/package.json
cp -v package-electron.json $TARGET/package.json
cp -v electron.html $TARGET
cp -v main.js $TARGET
cp -v renderer.js $TARGET
# cp -r node_modules $TARGET

mkdir "build/THIS FOLDER IS AUTOMATICALLY WIPED BY SCRIPTS"

cd $TARGET
pwd
npm install -v
# npm install pkg
# npm update
# npm run gui &
# cp -r ../dist .
electron .
# npm run electron
# RUN ELECTRON BUILD BEFORE COPYING THE DIST SHELLS, AND TESTING

electron-packager ./ --platform=darwin,win32,linux --arch=x64 --prune --overwrite  --output ./dist/electron


# npm run start --no-image
# npm run start megabase.fa --image

cd ../../
echo RUNNING AGAIN IN 60 seconds
pwd
sleep 50
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
sleep 10
pwd
cd ../

open ./build.sh
