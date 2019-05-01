#!/bin/sh
aminosee_do () {
  nice -n $1 aminosee $3 $4 $5 $6    $2 &
  echo "done $2 $3 $4 $5 $6"
  sleep 1
}
aminosee_do_foreground () {
  nice -n $1 aminosee $3 $4 $5 $6    $2
  echo "done $2 $3 $4 $5 $6"
  sleep 1
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

  aminosee_do 1            $1 -c 1 $2 $3 $4 $5 $6
  aminosee_do 1            $1 -c 2 $2 $3 $4 $5 $6
  aminosee_do_foreground 2 $1 -c 3 $2 $3 $4 $5 $6
  aminosee_do 3            $1 -c 5 $2 $3 $4 $5 $6
  aminosee_do 4            $1 -c 6 $2 $3 $4 $5 $6
  aminosee_do_foreground 5 $1 -c 16 $2 $3 $4 $5 $6
  # aminosee_do 6            $1 -c 32 $2 $3 $4 $5 $6
  aminosee_do 7            $1 -c 64 $2 $3 $4 $5 $6
  # aminosee_do_foreground 8 $1 -c 128 $2 $3 $4 $5 $6
  aminosee_do 7            $1 -c 256 $2 $3 $4 $5 $6
  aminosee_do_foreground 8 $1 -c 512 $2 $3 $4 $5 $6
  # echo "ATTEMPTING TO RENDER AT DIMENSION 9 THIS MAY RUN OUT OF MEMORY"


  # sleep 1
  # echo "ATTEMPTING TO RENDER AT DIMENSION 9 THIS MAY RUN OUT OF MEMORY"
  # aminosee_do 9 $1 -m 9 $2 $3 $4 $5 $6

}



many_size_hilbert $1 $2 $3 $4 $5 $6
# sleep 2
# many_size_hilbert $1 $2 $3 $4 $5 $6 *
# many_size_hilbert megabase.fa
