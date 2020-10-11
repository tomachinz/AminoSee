#!/bin/sh
CREDITS="src/public/credits.txt"
TIMESTAMP=$(date +%s)
DATE=$(date)
TOMSSOURCE="build/temp_file_for_credits.txt"
echo GENERATE CREDITS.TXT FILE at $CREDITS
echo
mkdir -p build

rm -f $TOMSSOURCE
rm -v $CREDITS
touch $TOMSSOURCE
touch $CREDITS
cp src/ascii-logo.txt $CREDITS
tail -f $CREDITS &

cat src/public/aminosee-gui-web.js                                  >>       $TOMSSOURCE
cat src/public/aminosee-web-socket.js                               >>       $TOMSSOURCE
cat src/aminosee-html-template.js                                          >>       $TOMSSOURCE
cat src/aminosee-server.js                                          >>       $TOMSSOURCE
cat src/aminosee-data.js                                            >>       $TOMSSOURCE
cat src/aminosee-cli.js                                             >>       $TOMSSOURCE
# cat src/aminosee-carlo.js                                           >>       $TOMSSOURCE
cat src/aminosee-settings.js                                        >>       $TOMSSOURCE
cat src/aminosee-version.js                                         >>       $TOMSSOURCE
cat src/aminosee-stdinpipe.js                                       >>       $TOMSSOURCE
# cat src/main.js                                                     >>       $TOMSSOURCE
# cat src/renderer.js                                                 >>       $TOMSSOURCE
# cat src/console.js                                                  >>       $TOMSSOURCE
cat src/ascii-logo.txt                                              >>       $TOMSSOURCE
cat src/index.html                                                  >>       $TOMSSOURCE

LINES=$(cat $TOMSSOURCE | wc -l)


echo >> $CREDITS
echo "Thanks to Christos Georghiou who designed the 'See No Evil Hear No Evil Monkeys' http://christosgeorghiou.com/" >> $CREDITS
echo >> $CREDITS
echo "Checkout the music from the drummer who wrote $LINES of code for this app at https://www.funk.co.nz/tomachi" >> $CREDITS
echo $LINES lines of code >> $CREDITS
echo "File drag and drop code by http://twitter.com/craigbuckler" >> $CREDITS
echo "http://optimalworks.net/ http://sitepoint.com/"  >> $CREDITS
echo "File drag and drop code by http://twitter.com/craigbuckler Craig Buckler" >> $CREDITS
echo "http://optimalworks.net/ OptimalWorks.net http://sitepoint.com/"  >> $CREDITS
echo "2D Hilbert code: Dylan Grafmyre, Thomas Diewald http://www.openprocessing.org/visuals/?visualID=15599 " >> $CREDITS
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
