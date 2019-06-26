#!/bin/sh
FAST=megabase.fa
QUICK=Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa

aminosee_do () {
  nice -n $1 aminosee $2 $3 $4 $5 $6     &
  echo "nice -n $1 aminosee $2 $3 $4 $5 $6     &"
}
aminosee_do_foreground () {
  nice -n $1 aminosee $2 $3 $4 $5 $6
  echo "nice -n $1 aminosee $2 $3 $4 $5 $6"
}


many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3 $4 $5 $6
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee_do 1 $1 $2 $3 $4 $5 $6                --ratio=gold  --reg
  aminosee_do 2 $1 $2 $3 $4 $5 $6        -c 10   --ratio=gold  --reg
  aminosee_do 3 $1 $2 $3 $4 $5 $6       -c 100  --ratio=gold  --reg
  aminosee_do 6 $1 $2 $3 $4 $5 $6       -c 500 --ratio=gold  --reg
  aminosee_do_foreground 7 $1 $2 $3 $4 $5 $6       -c 1000 --ratio=gold  --reg

  aminosee_do 1  --ratio=sqr -m 8 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 2  --ratio=sqr -m 6 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 3  --ratio=sqr -m 5 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 4  --ratio=sqr -m 4 --reg $1 $2 $3 $4 $5 $6
  aminosee_do 5  --ratio=sqr -m 3 --reg $1 $2 $3 $4 $5 $6
  aminosee_do_foreground 6  --ratio=sqr -m 7 --reg $1 $2 $3 $4 $5 $6
}



many_size_hilbert $1 $1 $2 $3 $4 $5 $6
many_size_hilbert $FAST $QUICK
many_size_hilbert *
