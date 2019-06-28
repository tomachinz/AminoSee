#!/bin/bash
  if [ $(uname)=Darwin ]; then
    # echo macos
    DASHF=" -f "
  fi

  if [ $(uname)=Linux ]; then
    # echo linux
    DASHF=" "
  fi

LOCKFILES='AminoSee_BUSY_LOCK*.txt'

pwd
echo "About to delete files matching: $LOCKFILES"
echo find $DASHF . -name $LOCKFILES
     find $DASHF . -name $LOCKFILES

echo "About to delete these touch files matching: $LOCKFILES"
sleep 5
echo "Deleting these touch files: $LOCKFILES"
    find $DASHF . -name $LOCKFILES -exec rm -v {} \;
sleep 2

 # find -f .  -name '*_LOCK*.aminosee.touch'
 # macos


 # find   .  -name 'AminoSee_BUSY_LOCK*.txt'
 # linux


 # find   .  -name '*Glutamic*acid*'
  # find   .  -name '*_*ic*acid*png' -exec rm -v {} \;
