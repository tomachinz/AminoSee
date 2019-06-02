#!/bin/sh
aminosee_do () {
  nice -n $1 aminosee $2 $3 $4 $5 $6     &
  sleep 5
  echo "done $2 $3 $4 $5 $6"
}
aminosee_do_foreground () {
  nice -n $1 aminosee $2 $3 $4 $5 $6
  echo "done $2 $3 $4 $5 $6"
}


many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3 $4 $5 $6
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee_do 1 $1 $2 $3 $4 $5 $6 --reg
  aminosee_do 2 $1 -c 10  --reg $2 $3 $4 $5 $6
  aminosee_do 2 $1 -c 100  --reg $2 $3 $4 $5 $6
  # aminosee_do 3 $1 -c 200 --ratio=gold  --reg $2 $3 $4 $5 $6
  # aminosee_do 4 $1 -c 400 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do 5 $1 -c 500 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do 5 $1 -c 1000 --ratio=sqr --reg $2 $3 $4 $5 $6

  aminosee_do_foreground 9  --ratio=sqr -m 8 --reg $1 $2 $3 $4 $5 $6
  aminosee_do_foreground 2  --ratio=sqr -m 6 --reg $1 $2 $3 $4 $5 $6
  aminosee_do_foreground 9  --ratio=sqr -m 5 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 8             --ratio=sqr -m 4 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 9             --ratio=sqr -m 3 --reg $1 $2 $3 $4 $5 $6
  aminosee * --art
}



many_size_hilbert $1 $1 $2 $3 $4 $5 $6
# sleep 2
# many_size_hilbert $1 $1 $2 $3 $4 $5 $6 *
# many_size_hilbert megabase.fa
