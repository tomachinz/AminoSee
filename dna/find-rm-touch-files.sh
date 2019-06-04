#!/bin/bash
  if [ $(uname)=Darwin ]; then
    # echo macos
    DASHF=" -f "
  fi

  if [ $(uname)=Linux ]; then
    # echo linux
    DASHF=" "
  fi

LOCKFILES='*_BUSY_LOCK*.aminosee.txt'

pwd
echo "About to delete these touch files:  *_LOCK*.aminosee.touch "
echo find $DASHF . -name $LOCKFILES
     find $DASHF . -name $LOCKFILES

echo "About to delete these touch files:  *_LOCK*.aminosee.touch "
sleep 5
echo "Deleting these touch files: $LOCKFILES"
    find $DASHF . -name $LOCKFILES -exec rm -v {} \;
sleep 2

 # fnd -f .  -name '*_LOCK*.aminosee.touch'
 # macos


 # find   .  -name '*_LOCK*.aminosee.touch'
 # linux


 # find   .  -name '*Glutamic*acid*'
  # find   .  -name '*_*ic*acid*png' -exec rm -v {} \;
