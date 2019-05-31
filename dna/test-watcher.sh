#!/bin/sh

echo Test watcher starting in two seconds
echo Test watcher $1 $2 $3

sleep 2

while true; do
  nice ./run-test.sh  $1 $2 $3  --no-html --no-image --no-explorer
  echo running again in 2 mins
  sleep 30
  echo 1.5mins
  sleep 30
  echo 1 min
  sleep 30
  echo 30 secs
  sleep 25
  echo running again in 5 seconds
  echo running again in 5 seconds
  echo running again in 5 seconds
  echo running again in 5 seconds
  echo running again in 5 seconds
  sleep 5
  nice git pull
done
