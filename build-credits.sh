#!/bin/sh
CREDITS="credits.txt"
TIMESTAMP=$(date +%s)
TOMSSOURCE=toms_source_temp.txt
echo GENERATE CREDITS.TXT FILE
echo "Thanks to Christos Georghiou who designed the 'See No Evil Hear No Evil Monkeys' http://christosgeorghiou.com/" > $CREDITS

cat public/aminosee-gui-web.js                >       build/toms.txt
cat aminosee-server.js                                          >>       build/toms.txt
cat aminosee-cli.js                                             >>       build/toms.txt
cat aminosee-settings.js                                        >>       build/toms.txt
cat main.js                                                     >>       build/toms.txt
cat renderer.js                                                 >>       build/toms.txt
cat stdinpipe.js                                              >>       build/toms.txt

mkdir -p build
cat  build/toms.txt | wc


# npm list # for bystanders
npm list | wc -l >>  $CREDITS # actually
echo ' open source node npm packages used. ' >>  $CREDITS
echo 'as at $TIMESTAMP'
echo >>  $CREDITS
npm list >>  $CREDITS
clear

cat  $CREDITS
# open $CREDITS
  
