#!/bin/bash
# example: AminoSee_BUSY_LOCK_Pongoabelii._c11__Lysine_fix_sci.txt
# COMMAND=" find   .  | grep AminoSee_BUSY_LOCK "
MACCOMMAND="find  ~/AminoSee_webroot/output/*  | grep Reference "
LINUXCOMMAND="find   ~/AminoSee_webroot/output/  | grep Reference "
PREVIEW="$1 | xargs $XARGPARAM $ ls -laH $ "
DELETE="$1  | xargs $XARGPARAM $ rm -v $ "


  # if [ $(uname)=Darwin ]; then
  #    echo macos
  #    echo $MACCOMMAND | xargs -J $ ls -laH $
  #    echo "DELETING THE FILES ABOVE IN 7 SECONDS"
  #    echo $MACCOMMAND | xargs -J $ rm -v $
  #    sleep 7
  #    eval $MACCOMMAND | xargs -J $ rm -v $
  # fi

  if [ $(uname)=Linux ]; then
    echo linux
    echo $LINUXCOMMAND | xargs -I $ ls -laH $
    echo "DELETING THE FILES ABOVE IN 7 SECONDS"
    echo $LINUXCOMMAND | xargs -I $ rm -v $
    sleep 7
    eval $LINUXCOMMAND | xargs -I $ rm -v $
  fi
LINUXCOMMAND="find   ~/AminoSee_webroot/output/  | grep .html"

sleep 1 

  if [ $(uname)=Linux ]; then
    echo linux
    echo $LINUXCOMMAND | xargs -I $ ls -laH $
    echo "DELETING THE FILES ABOVE IN 7 SECONDS"
    echo $LINUXCOMMAND | xargs -I $ rm -v $
    sleep 7
    eval $LINUXCOMMAND | xargs -I $ rm -v $
  fi
  