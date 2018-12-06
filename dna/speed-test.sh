
echo Test watcher



# while true; do
# done
nice -n 1 ./run-test.sh 0 &
sleep 5
nice -n 2 ./run-test.sh 0 &
sleep 5
nice -n 3 ./run-test.sh 0
sleep 5
nice -n 4 ./run-test.sh 0
sleep 1
nice -n 4 ./run-test.sh 0
sleep 1
nice -n 4 ./run-test.sh 0
sleep 1

echo "COMPLETE"
echo "COMPLETE"
echo "COMPLETE"
