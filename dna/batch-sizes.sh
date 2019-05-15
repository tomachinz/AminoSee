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
  # aminosee_do 1 $1      $2 $3 $4 $5 $6
  # aminosee_do 1 $1 -m 1 $2 $3 $4 $5 $6
  # aminosee_do 2 $1 -m 2 $2 $3 $4 $5 $6
  # aminosee_do 3 $1 -m 3 $2 $3 $4 $5 $6
  # aminosee_do 4 $1 -m 4 $2 $3 $4 $5 $6
  # aminosee_do 5 $1 -m 5 $2 $3 $4 $5 $6
  # aminosee_do 6 $1 -m 6 $2 $3 $4 $5 $6
  # aminosee_do_foreground 7 $1 -m 7 $2 $3 $4 $5 $6
  # aminosee_do 8 $1 -m 8 $2 $3 $4 $5 $6

  aminosee_do 2             -m 8 $1 $2 $3 $4 $5 $6
  aminosee_do 3             -m 1 $1 $2 $3 $4 $5 $6
  aminosee_do 4             -m 2 $1 $2 $3 $4 $5 $6
  aminosee_do 5             -m 3 $1 $2 $3 $4 $5 $6
  aminosee_do 6             -m 4 $1 $2 $3 $4 $5 $6
  aminosee_do 7             -m 5 $1 $2 $3 $4 $5 $6
  aminosee_do 8             -m 6 $1 $2 $3 $4 $5 $6
  aminosee_do_foreground 9  -m 7 $1 $2 $3 $4 $5 $6
  aminosee_do_foreground 1      $1 $2 $3 $4 $5 $6

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
