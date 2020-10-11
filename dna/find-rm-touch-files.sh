#!/bin/bash
# example: AminoSee_BUSY_LOCK_Pongoabelii._c11__Lysine_fix_sci.txt
# COMMAND=" find   .  | grep AminoSee_BUSY_LOCK "
COMMAND=" find   ~/AminoSee_webroot/  | grep LOCK "
PREVIEW="$1 | xargs $XARGPARAM $ ls -laH $ "
DELETE="$1  | xargs $XARGPARAM $ rm -v $ "



if [ $(uname)=Darwin ]; then
   echo macos
   find -f ~/AminoSee_webroot/ | grep LOCK | xargs -J $ ls -laH $
   echo "DELETING THE FILES ABOVE IN 7 SECONDS"
   sleep 7
   find -f ~/AminoSee_webroot/ | grep LOCK | xargs -J $ rm -v $
fi

if [ $(uname)=Linux ]; then
  echo linux
  find   ~/AminoSee_webroot/  | grep LOCK  | xargs -I $ ls -laH $
  echo "DELETING THE FILES ABOVE IN 7 SECONDS"
  sleep 7
  find   ~/AminoSee_webroot/  | grep LOCK  | xargs -I $ rm -v $

fi
