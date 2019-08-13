#!/bin/bash
if [ $(uname)=Darwin ]; then
  # echo macos
  XARGPARAM=" -J "
  FINDPARAM=" -f ./output/ "
fi

if [ $(uname)=Linux ]; then
  # echo linux
  XARGPARAM=" -I "
  FINDPARAM=" "
fi
COMMAND="find  -f ./output/  | grep -E '_linear_[ABCDEFGHIJKLMNOPQRSTUVWXYZ].*_fix_sci.png' "
PREVIEW="$COMMAND | xargs $XARGPARAM $ ls -laH $ "
DELETE="$COMMAND  | xargs $XARGPARAM $ rm -v $ "
CONFIG="list-of-files-to-be-deleted.txt"
doit () {
  echo DOIT: "$1"
  PREVIEW="$1 | xargs $XARGPARAM $ ls -laH $ "
  DELETE="$1  | xargs $XARGPARAM $ rm -v $ "
  echo SCRIPT $0 REMOVE ALL LINEAR FILES in ./output/ THAT ARENT REFERENCE:
  echo
  echo PREVIEW: $PREVIEW
  echo ACTUAL:  $DELETE
  echo
  eval $1 > $CONFIG
  eval $PREVIEW
  cat $CONFIG
  sleep 2

  sleep 1
  eval $1 > $CONFIG

  echo
  echo ABOUT TO REMOVE ALL THOSE FILES ABOVE IN TEN SECONDS!
  sleep 5
  echo in 5 seconds
  sleep 2
  echo in 3 seconds
  sleep 1
  echo in 2 seconds
  sleep 1

  cat $CONFIG | eval "xargs $XARGPARAM $ ls -la $"

  echo in 1 seconds
  sleep 1

  # macos
  cat $CONFIG | xargs -J $ rm -v $
  # linux:
  # cat $CONFIG | xargs -I $ rm -v $


}

doit "$COMMAND"
COMMAND="find -f ./output/ | grep -E 'AminoSee_BUSY_LOCK.*.txt' "
doit "$COMMAND"

# find  -f ./output/ |   grep -E '_linear_[ABCDEFGHIJKLMNOPQRSTUVWXYZ].*'  | xargs -J $ rm -v $ 
# COMMAND="find -f ./output/ | grep -E 'AminoSee_BUSY_LOCK.*.txt' "
