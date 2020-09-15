#!/bin/sh
FAST=megabase.fa
QUICK=Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa

aminosee_do () {
  nice -n 8 aminosee --quiet --ratio=sqr --reg $*  &
  sleep 2
}



many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $*
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee     -m10 --quiet --ratio=sqr --reg $*  &
  aminosee_do   -m9  $*
  aminosee_do   -m8  $*
  aminosee_do   -m7  $*
  aminosee_do   -m6  $*
  aminosee_do   -m5  $*

    # aminosee_do $*
    # aminosee_do $*        -c 10
    # aminosee_do $*        -c 50
    # aminosee_do $*        -c 100
    # aminosee_do $*        -c 500
    # aminosee_do $*        -c 1000
}



many_size_hilbert $*
# many_size_hilbert $FAST $QUICK
# many_size_hilbert *

echo "  _____                  _   _                     _____      U  ___ u   _    ";
echo " |\" ___|      ___       | \ |\"|         ___       |_ \" _|      \/\"_ \/ U|\"|u  ";
echo "U| |_  u     |_\"_|     <|  \| |>       |_\"_|        | |        | | | | \| |/  ";
echo "\|  _|/       | |      U| |\  |u        | |        /| |\   .-,_| |_| |  |_|   ";
echo " |_|        U/| |\u     |_| \_|       U/| |\u     u |_|U    \_)-\___/   (_)   ";
echo " )(\\,-  .-,_|___|_,-.  ||   \\,-. .-,_|___|_,-.  _// \\_        \\     |||_  ";
echo "(__)(_/   \_)-' '-(_/   (_\")  (_/   \_)-' '-(_/  (__) (__)      (__)   (__)_) ";
