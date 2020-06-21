#!/bin/sh
echo List files without ./ in front
echo If using --force, make it the 2nd parameter. eg
echo  "./batch-peptides.sh megabase.fa --force *"
echo Then you can re-render all but not thrash your CPU
find . | awk '{sub(/.\//," ")}1'
NICE=1

if [ -z "$1" ]; then
  echo useage:
  echo ./batch-procecss.sh Brown_Kiwi.dna
  echo
  echo processing all files in current directory: $(pwd)
  echo
  ./batch-peptides.sh  &
  sleep 2
  ./batch-peptides.sh  &
  sleep 2
  ./batch-peptides.sh
else
  echo processing $1 $2 $3 $4
  echo
  ./batch-peptides.sh  $1 $2 $3 $4 $5 $6 $7 $8 &
  sleep 2
  ./batch-peptides.sh  $1 $2 $3 $4 $5 $6 $7 $8 &
  sleep 2
  ./batch-peptides.sh  $1 $2 $3 $4 $5 $6 $7 $8
fi



#
# echo
# echo sleeping for an hour and then rendering all in current directory
# echo
# sleep 3600
# ./batch-peptides.sh
# find -f *.fa *.mfa *.gbk *.txt -exec  ./batch-peptides.sh  {}   \;
