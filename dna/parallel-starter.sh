
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

nice ./batch-process.sh $1 $2 $3 $4 $5 $6 &
echo Starting next quarter in 15 s
sleep 15
nice ./batch-process.sh $1 $2 $3 $4 $5 $6 &
echo Starting next quarter in 15 s
sleep 15
nice ./batch-process.sh $1 $2 $3 $4 $5 $6  &
# echo Starting next quarter in 15 s
# sleep 15
# nice ./batch-process.sh $1 $2 $3 $4 $5 $6
