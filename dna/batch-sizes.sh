#!/bin/sh
FAST=megabase.fa
QUICK=Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa

aminosee_do () {
  nice -n 8 aminosee --force --quiet --ratio=sqr --reg $*
}



many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $*
  echo "-------------------------------------------"
  echo "                                         =///"

  # aminosee     -m10 --quiet --ratio=sqr --reg $*  &
  # aminosee_do   -m9  $* &
  # sleep 1
  # aminosee_do   -m8  $* &
  # sleep 1
  # aminosee_do   -m7  $* &
  # sleep 1
  # aminosee_do   -m6  $* &
  # sleep 1
  # aminosee_do   -m5  $*
  # aminosee_do   -m4  $*
  # aminosee_do   -m3  $*
  aminosee_do $*         &
  aminosee_do $*        -c 2 &
  aminosee_do $*        -c 5 &
  aminosee_do $*        -c 10 &
  aminosee_do $*        -c 20
   
}



many_size_hilbert $*
# many_size_hilbert $FAST $QUICK
# many_size_hilbert *
