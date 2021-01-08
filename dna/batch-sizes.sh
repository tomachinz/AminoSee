#!/bin/sh

aminosee_do () {
  echo $*
  echo 
  nice -n 8 aminosee --no-updates $* &
  sleep 4
  echo .
}

many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $*
  echo "-------------------------------------------"
  echo "                                         =///"

  # aminosee_do --reg --maxpix 1024 $*
  # aminosee_do --reg --maxpix 4096 $*
  aminosee_do --reg --maxpix 16384 $*
  aminosee_do --reg --maxpix 65536 $*
  aminosee_do --reg --maxpix 262144 $*
  aminosee_do --reg --maxpix 999999 $*
  aminosee_do --reg --maxpix 1048576 $*
  aminosee_do --reg --maxpix 4194304 $*
  # aminosee_do --reg --maxpix 16777216 $*

  sleep 2
  aminosee_do --ratio sqr  -m4  $* 
  aminosee_do --ratio sqr  -m5  $* 
  aminosee_do --ratio sqr  -m6  $* 
  aminosee_do --ratio sqr  -m7  $* 
  aminosee_do --ratio sqr  -m8  $* 
 
  # sleep 10
  # aminosee_do --ratio sqr  -m9  $* 
}

many_size_hilbert $*
