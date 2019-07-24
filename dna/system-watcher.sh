#!/bin/sh

echo System watcher starting

# while true; do
  nice w | sed "s/.........................................................//"
  df -h | grep home
  du -d 1 -h

  echo running again in 20 sec

  sleep 5
  echo running again in 15 sec
  sleep 5
  echo running again in 10 sec
  sleep 5
  echo running again in 5 sec
  sleep 5
  echo running again now

# done
