#!/bin/sh
echo List files without ./ in front
echo If using --force, make it the 2nd parameter. eg
echo  "./batch-peptides.sh megabase.fa --force *"
echo Then you can re-render all but not thrash your CPU
find . | awk '{sub(/.\//," ")}1'
NICE=1

if [ -z "$1" ]; then
  echo useage:
  echo ./batch-process.sh Brown_Kiwi.dna
  echo ./batch-process.sh *
  echo
  echo processing all files in current directory: $(pwd)
  echo
  ./batch-peptides.sh $* &
  sleep 1
  ./batch-peptides.sh $* &
  sleep 1
  ./batch-peptides.sh $* &
  sleep 1
  ./batch-peptides.sh $*
else
  echo batch processing:
  echo
  echo ===========================
  echo $*
  echo ===========================
  ./batch-peptides.sh  $1 &
  sleep 1
  ./batch-peptides.sh  $1 &
  sleep 1
  ./batch-peptides.sh  $1

  ./batch-peptides.sh  $2 &
  sleep 1
  ./batch-peptides.sh  $2 &
  sleep 1
  ./batch-peptides.sh  $2

  ./batch-peptides.sh  $* &
  sleep 1
  ./batch-peptides.sh  $* &
  sleep 1
  ./batch-peptides.sh  $* &
  sleep 1
  ./batch-peptides.sh
fi



#
# echo
echo sleeping for a minute and then rendering all in current directory
# echo
sleep 60
# ./batch-peptides.sh
find -f *.fa *.mfa *.gbk *.txt -exec  ./batch-peptides.sh  {}   \;
