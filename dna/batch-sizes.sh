#!/bin/sh
FAST=megabase.fa
QUICK=Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa

aminosee_do () {
  nice aminosee --quiet --ratio=sqr --reg $1 $2 $3 $4 $5 $6 &
  echo "nice -n $1 aminosee $2 $3 $4 $5 $6     &"
  sleep 1
}



many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3 $4 $5 $6
  echo "-------------------------------------------"
  echo "                                         =///"



  aminosee_do   -m1  $1 $2 $3 $4 $5 $6
  aminosee_do   -m2  $1 $2 $3 $4 $5 $6
  aminosee_do   -m3  $1 $2 $3 $4 $5 $6
  aminosee_do   -m4  $1 $2 $3 $4 $5 $6
  aminosee_do   -m5  $1 $2 $3 $4 $5 $6
  aminosee_do   -m6  $1 $2 $3 $4 $5 $6
  aminosee_do   -m7  $1 $2 $3 $4 $5 $6
  nice aminosee --reg -m8  $1 $2 $3 $4 $5 $6
  aminosee  --reg -m9  $1 $2 $3 $4 $5 $6

    # aminosee_do $1 $2 $3 $4 $5 $6
    # aminosee_do $1 $2 $3 $4 $5 $6       -c 10
    # aminosee_do $1 $2 $3 $4 $5 $6       -c 50
    # aminosee_do $1 $2 $3 $4 $5 $6       -c 100
    # aminosee_do $1 $2 $3 $4 $5 $6       -c 500
    # aminosee_do $1 $2 $3 $4 $5 $6       -c 1000 --ratio=gold
    #


}



many_size_hilbert $1 $1 $2 $3 $4 $5 $6
# many_size_hilbert $FAST $QUICK
# many_size_hilbert *

echo "  _____                  _   _                     _____      U  ___ u   _    ";
echo " |\" ___|      ___       | \ |\"|         ___       |_ \" _|      \/\"_ \/ U|\"|u  ";
echo "U| |_  u     |_\"_|     <|  \| |>       |_\"_|        | |        | | | | \| |/  ";
echo "\|  _|/       | |      U| |\  |u        | |        /| |\   .-,_| |_| |  |_|   ";
echo " |_|        U/| |\u     |_| \_|       U/| |\u     u |_|U    \_)-\___/   (_)   ";
echo " )(\\,-  .-,_|___|_,-.  ||   \\,-. .-,_|___|_,-.  _// \\_        \\     |||_  ";
echo "(__)(_/   \_)-' '-(_/   (_\")  (_/   \_)-' '-(_/  (__) (__)      (__)   (__)_) ";
