#!/bin/sh

echo Test watcher
echo Test watcher $1 $2 $3

sleep 2

while true; do
  nice ./run-test.sh --no-updates $1 $2 $3
  sleep 10
done
