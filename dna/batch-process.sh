#!/bin/sh
echo List files without ./ in front
echo If using --force, make it the 2nd parameter. eg
echo  "./batch-peptides.sh megabase.fa --force *"
echo Then you can re-render all but not thrash your CPU
find . | awk '{sub(/.\//," ")}1'
NICE=1
aminosee_do () {
  sleep 1
  nice -n $NICE aminosee $1 $2 $3 $4 $5 $6 $7 $8 * &
  sleep 1
  nice -n $NICE aminosee --quiet --index -m5 $1 *

}


aminosee_do $1 &
sleep 2
aminosee_do $1 &
sleep 2
aminosee_do $1 * &
sleep 2
aminosee_do $1 $2 $3 $4 $5 $6 $7 $8

open ./batch-peptides.sh * &
sleep 2
 ./batch-peptides.sh * &
sleep 2
 ./batch-peptides.sh *


find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2 $3 $4 $5 $6 $7 $8   \;
