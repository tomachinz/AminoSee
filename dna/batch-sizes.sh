#!/bin/sh
aminosee_do () {
  sleep 5
  nice -n $1 aminosee $2 $3 $4 $5 $6     &
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
  aminosee_do 1 $1 --force $2 $3 $4 $5 $6
  # aminosee_do 1 $1 -m 1 $2 $3 $4 $5 $6
  aminosee_do 2 $1 -c 100 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do 2 $1 -c 150 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do 3 $1 -c 200 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do 4 $1 -c 400 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do 5 $1 -c 500 --ratio=gold  --reg $2 $3 $4 $5 $6
  aminosee_do_foreground -c 250 --ratio=gold  --reg  $2 $3 $4 $5 $6
  aminosee_do 8 $1 -c 8  --ratio=gold --reg $2 $3 $4 $5 $6

  aminosee_do 2             --ratio=sqr -m 8 --reg $1 $2 $3 $4 $5 $6
  aminosee_do_foreground 9  --ratio=sqr -m 7 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 8             --ratio=sqr -m 6 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 9             --ratio=sqr -m 5 --reg $1 $2 $3 $4 $5 $6
  # aminosee_do 4             -m 2 $1 $2 $3 $4 $5 $6
  # aminosee_do 5             -m 3 $1 $2 $3 $4 $5 $6
  # aminosee_do 6             -m 4 $1 $2 $3 $4 $5 $6
  # aminosee_do 7             -m 5 $1 $2 $3 $4 $5 $6
  # aminosee_do_foreground 1  -m 9 $1 $2 $3 $4 $5 $6


  # aminosee_do 1   -c 64 $1 $2 $3 $4 $5 $6
  # aminosee_do_foreground 2 -c 4 $1 $2 $3 $4 $5 $6
  # aminosee_do 3            -c 1024 $1 $2 $3 $4 $5 $6
  # echo "ATTEMPTING TO RENDER AT DIMENSION 9 THIS MAY RUN OUT OF MEMORY"
  # aminosee_do_foreground 5  -c 7 $1 $2 $3 $4 $5 $6
  # aminosee_do 6             -c 8 $1 $2 $3 $4 $5 $6
  # aminosee_do_foreground 6  -c 10 $1 $2 $3 $4 $5 $6
  # aminosee_do 6            -c 20 $1 $2 $3 $4 $5 $6
  # aminosee_do_foreground 6 -c 40 $1 $2 $3 $4 $5 $6
  # aminosee_do 7            -c 100 $1 $2 $3 $4 $5 $6
  # aminosee_do_foreground 8 -c 128 $1 $2 $3 $4 $5 $6
  # aminosee_do 7            -c 500 $1 $2 $3 $4 $5 $6
  # sleep 1
  # echo "ATTEMPTING TO RENDER AT DIMENSION 9 THIS MAY RUN OUT OF MEMORY"
  # aminosee_do 9 $1 -m 9 $1 $2 $3 $4 $5 $6

}



many_size_hilbert --reg $1 $1 $2 $3 $4 $5 $6
# sleep 2
# many_size_hilbert $1 $1 $2 $3 $4 $5 $6 *
# many_size_hilbert megabase.fa
