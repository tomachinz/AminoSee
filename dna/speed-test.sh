#!/bin/sh

echo SPEED TEST!!!!

nice -n 1 ./run-test.sh --no-updates &
sleep 1
nice -n 2 ./run-test.sh --no-updates &
sleep 2
nice -n 3 ./run-test.sh --no-updates &
sleep 3
nice -n 4 ./run-test.sh --no-updates &
sleep 4
nice -n 5 ./run-test.sh --no-updates &
sleep 5
nice -n 6 ./run-test.sh

echo "SPEED TEST COMPLETE"
echo "SPEED TEST COMPLETE"
echo "SPEED TEST COMPLETE"
echo "SPEED TEST COMPLETE"
echo "SPEED TEST COMPLETE"
echo "SPEED TEST COMPLETE"
echo "SPEED TEST COMPLETE"
