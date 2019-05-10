#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo running from:
pwd
mkdir -p build
mkdir -p build/TOBEDELETED
ls -la build
echo ERASING EVERYTHING IN  build in 10 seconds!
echo ERASING EVERYTHING IN  build in 10 seconds!
echo ERASING EVERYTHING IN  build in 10 seconds!
echo ERASING EVERYTHING IN  build in 10 seconds!

cd build
pwd
rm -rf TOBEDELETED
sleep 10
mkdir -p TOBEDELETED
mv * TOBEDELETED
cd ../

echo done
sleep 1

echo "Move a bunch of files into $TARGET then run pkg on it"
mkdir build
mkdir $TARGET
mkdir -p $TARGET/dna
cp -v -r dna/megabase.fa $TARGET/dna

  # node_modules/electron/dist

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

# cp -r package-electron.json $TARGET/package.json
cp -r electron.html $TARGET
cp -r main.js $TARGET
cp -r renderer.js $TARGET


cp -r node_modules $TARGET
mkdir "build/THIS FOLDER IS AUTOMATICALLY WIPED BY SCRIPTS"

cd $TARGET
pwd
npm install -v
npm install pkg
npm update
npm run electron

npm run build
# RUN ELECTRON BUILD BEFORE COPYING THE DIST SHELLS, AND TESTING
cp -r ../dist .

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
