
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

nice -n 2  ./batch-process.sh $1 $2 $3 $4 $5 $6 &
echo Starting next quarter in 15 s
sleep 15
nice -n 4 ./batch-process.sh $1 $2 $3 $4 $5 $6 &
echo Starting next quarter in 15 s
sleep 15
nice -n 6 ./batch-process.sh $1 $2 $3 $4 $5 $6 &
echo Starting next quarter in 15 s
sleep 15
nice -n 8 ./batch-process.sh $1 $2 $3 $4 $5 $6
