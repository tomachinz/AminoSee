
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

./batch-process.sh &
sleep 5
./batch-process.sh &
sleep 5
./batch-process.sh &
sleep 5
./batch-process.sh &
