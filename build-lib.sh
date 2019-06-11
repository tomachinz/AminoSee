#!/bin/sh
ERASED="build"
BUILDFOLDER="build/AminoSee_build_"
TIMESTAMP=$(date +%s)
TARGET="$BUILDFOLDER$TIMESTAMP"
echo GENERATE VERSION NUMBER IMPORT
npm run genversion
echo GENERATE BROWSERIFY BUNDLE
npm run browserify
echo GENERATE CREDITS.TXT
npm run credits

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
mkdir -p dist/root/lib
mkdir -p build/toms_source/
mkdir  ./dist/AminoSee_macos
mkdir  ./dist/AminoSee_win
mkdir  ./dist/AminoSee_linux


# cp -v public/aminosee-web-gui.js                                 dist/root/public/aminosee-web-gui.js
# cp -v aminosee-serve.js                                          dist/root/aminosee-serve.js
# cp -v aminosee-cli.js                                            dist/root/
# cp -v aminosee-settings.js                                       dist/root/
# cp -v main.js                                                    dist/root/
# cp -v renderer.js                                                dist/root/
# cp -v mastdinpipe.js                                             dist/root/
#
#
# cp -v public/aminosee-web-gui.js                                 build/toms_source/
# cp -v aminosee-serve.js                                          build/toms_source/
# cp -v aminosee-cli.js                                            build/toms_source/
# cp -v aminosee-settings.js                                       build/toms_source/
#
cp -v node_modules/sliced/index.js                               dist/root/node_modules/sliced/index.js
cp -v node_modules/deep-defaults/lib/index.js                    dist/root/node_modules/deep-defaults/lib
cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  dist/root/node_modules/termconfig
cp -v node_modules/terminal-kit/lib/termconfig/xterm.generic.js  dist/root/termconfig
cp -v node_modules/get-cursor-position/build/Release/pos.node    dist/root
cp -v node_modules/opn/xdg-open                                  dist/root
cp -r node_modules/terminal-kit/*                 dist/root/node_modules/terminal-kit
cp -r node_modules/lazyness/*                     dist/root/node_modules/lazyness

cp -r lib/*                                       dist/root/lib
cp -r public/*                                       dist/root/public#
#
#
# echo creating distributions
# echo COPYING LIBRARIES INTO /dist/* APP ROOT FOLDERS
cp -r  dist/root/* dist/Aminosee_macos
cp -r  dist/root/* dist/Aminosee_linux
cp -r  dist/root/* dist/Aminosee_win
