#!/bin/sh
CREDITS="credits.txt"
TIMESTAMP=$(date +%s)
DATE=$(date)
TOMSSOURCE=toms_source_temp.txt
echo GENERATE CREDITS.TXT FILE
mkdir -p build
rm -rf build/TOBEDELETED
mv build/* build/TOBEDELETED
rm -v $CREDITS


cat src/public/aminosee-gui-web.js                                  >>       build/toms_source.txt
cat src/aminosee-server.js                                          >>       build/toms_source.txt
cat src/aminosee-data.js                                            >>       build/toms_source.txt
cat src/aminosee-cli.js                                             >>       build/toms_source.txt
cat src/aminosee-settings.js                                        >>       build/toms_source.txt
cat src/aminosee-version.js                                         >>       build/toms_source.txt
cat src/aminosee-stdinpipe.js                                       >>       build/toms_source.txt
cat src/main.js                                                     >>       build/toms_source.txt
cat src/renderer.js                                                 >>       build/toms_source.txt
cat src/console.js                                                  >>       build/toms_source.txt
cat src/ascii-logo.txt                                              >>       build/toms_source.txt

LINES=$(cat build/toms_source.txt | wc -l)

cp src/ascii-logo.txt $CREDITS
tail -f $CREDITS &
echo >> $CREDITS
echo "Thanks to Christos Georghiou who designed the 'See No Evil Hear No Evil Monkeys' http://christosgeorghiou.com/" >> $CREDITS
echo >> $CREDITS
echo "Checkout the music from the drummer who wrote $LINES of code for this app at https://www.funk.co.nz/tomachi" >> $CREDITS
echo $LINES lines of code >> $CREDITS
echo "File drag and drop code by http://twitter.com/craigbuckler" >> $CREDITS
echo "http://optimalworks.net/ http://sitepoint.com/"  >> $CREDITS
echo >> $CREDITS
# npm list # for bystanders
npm list | wc -l >>  $CREDITS # actually
echo >> $CREDITS
echo as at $DATE the following open source node npm packages used: >>  $CREDITS
echo >> $CREDITS
echo >>  $CREDITS
npm list >>  $CREDITS
# clear
# cat $CREDITS
open $CREDITS
sleep 1
killall tail
