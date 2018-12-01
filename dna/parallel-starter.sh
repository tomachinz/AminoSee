
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

nice ./batch-process.sh &
echo Starting next quearter in 15 s
sleep 15
nice ./batch-process.sh &
echo Starting next quearter in 15 s
sleep 15
nice ./batch-process.sh &
echo Starting next quearter in 15 s
sleep 15
nice ./batch-process.sh &
