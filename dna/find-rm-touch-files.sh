#!/bin/bash

# COMMAND=" find   .  | grep AminoSee_BUSY_LOCK "
COMMAND=" find   ~/AminoSee_webroot/  | grep AminoSee_BUSY_LOCK "
PREVIEW="$1 | xargs $XARGPARAM $ ls -laH $ "
DELETE="$1  | xargs $XARGPARAM $ rm -v $ "



if [ $(uname)=Darwin ]; then
   echo macos
   find . | grep AminoSee_BUSY_LOCK | xargs -J $ ls -laH $
   echo "DELETING THE FILES ABOVE IN 7 SECONDS"
   sleep 7
   find . | grep AminoSee_BUSY_LOCK | xargs -J $ rm -v $
fi

if [ $(uname)=Linux ]; then
  echo linux
  find   .  | grep AminoSee_BUSY_LOCK  | xargs -I $ ls -laH $
  echo "DELETING THE FILES ABOVE IN 7 SECONDS"
  sleep 7
  find   .  | grep AminoSee_BUSY_LOCK  | xargs -I $ rm -v $

fi



#
#
#
#
#
#
# pwd
# echo find $DASHF . -name $LOCKFILES
#      find $DASHF . -name $LOCKFILES
#
# echo "About to delete these touch files matching: $LOCKFILES"
# sleep 5
# echo "Deleting these touch files: $LOCKFILES"
#     find $DASHF . -name $LOCKFILES -exec rm -v {} \;
#     find ./output/ -name AminoSee_BUSY_LOCK*.txt  -exec rm -v {} \;
#     find ./output/ -name AminoSee_BUSY_LOCK*.txt  -exec rm -v {} \;
#     find  .  -name 'AminoSee_BUSY_LOCK*.txt' -exec rm -v {} \;
# sleep 2

# find -f ./output/  'AminoSee_BUSY_LOCK*.txt'
# find -f ./output/ | grep linear | grep -E "linear_[ABCDEFGHIJKLMNOPQRSTUVWXYZ]"
# macos
# find ./output/ -name AminoSee_BUSY_LOCK*.txt  -exec rm -v {} \;
# find   .  -name 'AminoSee_BUSY_LOCK*.txt'  -exec rm -v {} \;

# linux
# find   .  | grep AminoSee_BUSY_LOCK
