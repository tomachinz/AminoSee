#!/bin/sh
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'
NICE=1
aminosee_do () {
  sleep 1
  nice -n $NICE aminosee $1 $2 $3 $4 $5 $6 $7 $8 &
  sleep 1
  nice -n $NICE aminosee --quiet --index -m5 $1 $2 $3 $4 $5 $6 $7 $8  *
  NICE=($NICE+1)
  echo $NICE
}


aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 * &
aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 * &
aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 * &
aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 *

open ./batch-peptides.sh * &
open ./batch-peptides.sh * &
open ./batch-peptides.sh *


find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2 $3 $4 $5 $6 $7 $8   \;
