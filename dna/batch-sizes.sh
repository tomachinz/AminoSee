#!/bin/sh
FAST=megabase.fa
QUICK=Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa

aminosee_do () {
  nice -n $1 aminosee $2 $3 $4 $5 $6 -q
  echo "nice -n $1 aminosee $2 $3 $4 $5 $6     &"
}



many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3 $4 $5 $6
  echo "-------------------------------------------"
  echo "                                         =///"


  aminosee_do 1 $1 $2 $3 $4 $5 $6               --ratio=gold &
  sleep 3
  aminosee_do 2 $1 $2 $3 $4 $5 $6       -c 10   --ratio=gold &
  aminosee_do 3 $1 $2 $3 $4 $5 $6       -c 50   --ratio=gold &
  aminosee_do 4 $1 $2 $3 $4 $5 $6       -c 100  --ratio=gold &
  aminosee_do 5 $1 $2 $3 $4 $5 $6       -c 500  --ratio=gold &
  aminosee_do 6 $1 $2 $3 $4 $5 $6       -c 1000 --ratio=gold


  aminosee_do 1  --ratio=sqr -m 1 --reg $1 $2 $3 $4 $5 $6 &
  sleep 3
  aminosee_do 2  --ratio=sqr -m 2 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 3  --ratio=sqr -m 3 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 4  --ratio=sqr -m 4 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 5  --ratio=sqr -m 5 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 6  --ratio=sqr -m 6 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 7  --ratio=sqr -m 7 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 7  --ratio=sqr -m 8 --reg $1 $2 $3 $4 $5 $6 &
  aminosee_do 7  --ratio=sqr -m 9 --reg $1 $2 $3 $4 $5 $6



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
