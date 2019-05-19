#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo COPYING LIBRARIES INTO /lib
mkdir -p lib
mkdir -p lib/node_modules
mkdir -p lib/node_modules/sliced/
mkdir -p lib/node_modules/deep-defaults
mkdir -p lib/node_modules/terminal-kit/lib/termconfig

echo GENERATE VERSION NUMBER IMPORT
npm run genversion

cp -v node_modules/sliced/index.js lib/node_modules/sliced
cp -v node_modules/deep-defaults/lib/index.js lib/node_modules/deep-defaults/lib
cp -v node_modules/get-cursor-position/build/Release/pos.node lib
cp -v node_modules/opn/xdg-open lib
cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  lib/termconfig
# CP -V node_modules/electron/dist lib/electron/dist


echo COPYING LIBRARIES INTO /dist/*
cp -r -v lib/* dist/Aminosee_macos
cp -r -v lib/* dist/Aminosee_linux
cp -r -v lib/* dist/Aminosee_win



echo "Move a bunch of files into $TARGET then run pkg on it"
mkdir build
mkdir $TARGET
mkdir -p $TARGET/dna

cp -v -r dna/megabase.fa $TARGET/dna
cp -r images $TARGET
cp -r imports $TARGET
cp -r lib $TARGET
cp -r bin $TARGET
cp -r aminosee-cli.js $TARGET
cp -r aminosee-gui-web.js $TARGET
cp -r bundle.js $TARGET
cp -r package.json $TARGET
cp -r README.md $TARGET
cp -r bundle.js $TARGET
cp -r settings.js $TARGET
cp -r index.html $TARGET
cp -r console.js $TARGET
cp -r favicon.ico $TARGET
cp -r favicon.png $TARGET
cp -r -v dist $TARGET

echo COPY AND RENAME package-electron.json $TARGET/package.json
cp -v package-electron.json $TARGET/package.json
cp -v electron.html $TARGET
cp -v main.js $TARGET
cp -v renderer.js $TARGET
cp -r node_modules $TARGET

mkdir "build/THIS FOLDER IS AUTOMATICALLY WIPED BY SCRIPTS"

cd $TARGET
pwd
# npm install -v
npm install pkg
# npm update
npm run gui &
cp -r ../dist .

npm run electron
# RUN ELECTRON BUILD BEFORE COPYING THE DIST SHELLS, AND TESTING

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
