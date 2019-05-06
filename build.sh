#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
mkdir -p build

ls -la build
echo ERASING EVERYTHING IN  build in 10 seconds!
echo ERASING EVERYTHING IN  build in 10 seconds!
echo ERASING EVERYTHING IN  build in 10 seconds!
echo ERASING EVERYTHING IN  build in 10 seconds!
cd build
pwd
sleep 10

mv -r * TOBEDELETED
rm -rv *
cd ../
mkdir -p build

echo done
sleep 1

echo "Move a bunch of files into $TARGET then run pkg on it"
mkdir build
mkdir $TARGET
mkdir "build/THIS FOLDER IS AUTOMATICALLY WIPED BY SCRIPTS"
cp -r images $TARGET
cp -r imports $TARGET
cp -r lib $TARGET
cp -r aminosee-cli.js $TARGET
cp -r aminosee-gui-web.js $TARGET
cp -r bundle.js $TARGET
cp -r package.json $TARGET
cp -r README.md $TARGET
cp -r bundle.js $TARGET
cp -r index.html $TARGET
cp -r favicon.png $TARGET
cp -r favicon.ico $TARGET
cd build
npm run build

cd ../
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
echo RUNNING AGAIN IN 10 seconds
sleep 10
$0
