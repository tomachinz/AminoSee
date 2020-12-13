#!/bin/sh

aminosee_do () {
  echo $*
  echo 
  nice -n 8 aminosee --no-updates $* &
  sleep 2
  echo .
}

many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $*
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee_do --ratio sqr       $*
  # aminosee_do --ratio sqr  -m9  $* 
  aminosee_do --ratio sqr  -m8  $* 
  aminosee_do --ratio sqr  -m7  $* 
  aminosee_do --ratio sqr  -m6  $* 
  aminosee_do --ratio sqr  -m5  $* 
  aminosee_do --ratio sqr  -m4  $* 

  # aminosee_do --reg -c 4        $*
  # aminosee_do --reg -c 16       $* 
  # aminosee_do --reg -c 64       $* 
}

many_size_hilbert $*
