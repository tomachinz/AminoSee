#!/bin/bash
  if [ $(uname)=Darwin ]; then
    # echo macos
    DASHF=" -f "
  fi

  if [ $(uname)=Linux ]; then
    # echo linux
    DASHF=" "
  fi

cwd
echo "About to delete these touch files:  *_LOCK*.aminosee.touch "
echo find $DASHF . -name '*_LOCK*.aminosee.touch'
sleep 1
find $DASHF . -name '*_LOCK*.aminosee.touch'
echo "About to delete these touch files:  *_LOCK*.aminosee.touch "
sleep 5
echo "Delete these touch files:  *_LOCK*.aminosee.touch "
find $DASHF . -name '*_LOCK*.aminosee.touch' -exec rm -v {} \;
sleep 2
