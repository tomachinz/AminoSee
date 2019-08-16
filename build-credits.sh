#!/bin/sh
CREDITS="src/public/credits.txt"
TIMESTAMP=$(date +%s)
DATE=$(date)
TOMSSOURCE="toms_source_temp.txt"
echo GENERATE CREDITS.TXT FILE
mkdir -p build
rm -rf build/TOBEDELETED
mv build/* build/TOBEDELETED
rm -v $CREDITS


cat src/public/aminosee-gui-web.js                                  >>       build/toms_source.txt
cat src/public/aminosee-web-socket.js                               >>       build/toms_source.txt
cat src/aminosee-server.js                                          >>       build/toms_source.txt
cat src/aminosee-data.js                                            >>       build/toms_source.txt
cat src/aminosee-cli.js                                             >>       build/toms_source.txt
cat src/aminosee-carlo.js                                           >>       build/toms_source.txt
cat src/aminosee-settings.js                                        >>       build/toms_source.txt
cat src/aminosee-version.js                                         >>       build/toms_source.txt
cat src/aminosee-stdinpipe.js                                       >>       build/toms_source.txt
# cat src/main.js                                                     >>       build/toms_source.txt
# cat src/renderer.js                                                 >>       build/toms_source.txt
# cat src/console.js                                                  >>       build/toms_source.txt
cat src/ascii-logo.txt                                              >>       build/toms_source.txt
cat src/index.html                                                  >>       build/toms_source.txt

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
echo "File drag and drop code by http://twitter.com/craigbuckler Craig Buckler" >> $CREDITS
echo "http://optimalworks.net/ OptimalWorks.net http://sitepoint.com/"  >> $CREDITS
echo "2D Hilbert code: Dylan Grafmyre, Thomas Diewald ( http://www.openprocessing.org/visuals/?visualID=15599 ) " >> $CREDITS
echo "Based on OpenShift guest https://github.com/mrdoob/three.js/blob/8413a860aa95ed29c79cbb7f857c97d7880d260f/examples/canvas_lines_colors.html" >> $CREDITS

echo >> $CREDITS
# npm list # for bystanders
echo Count of packages used: >> $CREDITS
npm list > __aminoseeTEMP.txt
cat __aminoseeTEMP.txt | wc -l >> $CREDITS
echo >> $CREDITS
echo as at $DATE the following open source node npm packages used: >>  $CREDITS
echo >> $CREDITS
echo >>  $CREDITS
cat __aminoseeTEMP.txt  >>  $CREDITS
rm __aminoseeTEMP.txt
# tail $CREDITS
# clear
# cat $CREDITS
# open $CREDITS
# sleep 1
echo Finished building $CREDITS

trap 'exit 0' TERM
(killall -m tail 2>&1) >/dev/null
sleep 2
echo Finished building $CREDITS
exit 0
