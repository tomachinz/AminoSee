#!/bin/sh
# test should run quickly and quit.
w
aminosee
aminosee -f
aminosee -h & 
aminosee help &
aminosee -v

echo 'nice aminosee $1 $2 $3 $4 $5 $6   --peptide="aspartic ACID"'
nice aminosee $1 $2 $3 $4 $5 $6  --peptide="aspartic ACID"

echo 'doing   $1 $2 $3 $4 $5 $6  --peptide="gluTAMIC aCID"'
nice aminosee       $1 $2 $3 $4 $5 $6 -f --peptide="gluTAMIC aCID"

echo "nice aminosee $1 $2 $3 $4 $5 $6 --triplet ggg --ratio=sqr"
nice aminosee       $1 $2 $3 $4 $5 $6 --triplet ggg --ratio=sqr

echo "nice aminosee $1 $2 $3 $4 $5 $6 -m5 --ratio=gol"
nice aminosee       $1 $2 $3 $4 $5 $6 -m5 --ratio=gol

echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --ratio=gol --peptide=Ochre"
nice aminosee       $1 $2 $3 $4 $5 $6 -f --ratio=gol --peptide=Ochre

echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --no-updates -m7 --ratio=sqr --peptide=Amber"
nice aminosee       $1 $2 $3 $4 $5 $6 -f --no-updates -m7 --ratio=sqr --peptide=Amber

echo "nice aminosee $1 $2 $3 $4 $5 $6 --no-updates -m5 --peptide=Methionine --ratio=sqr"
nice aminosee       $1 $2 $3 $4 $5 $6 --no-updates -m5 --peptide=Methionine --ratio=sqr

echo "nice aminosee $1 $2 $3 $4 $5 $6 -m 8 --peptide=Cysteine"
nice aminosee       $1 $2 $3 $4 $5 $6 -m 8 --peptide=Cysteine

echo "nice aminosee $1 $2 $3 $4 $5 $6 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan"
nice aminosee       $1 $2 $3 $4 $5 $6 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan

aminosee 27MB_TestPattern.txt  3MB_TestPattern.txt -f --no-updates --no-clear -v --debug
#
echo 'nice aminosee *'
nice aminosee * &
sleep 2

echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --no-updates --ratio=fix --peptide=Arginine --html"
nice aminosee       $1 $2 $3 $4 $5 $6 -f --no-updates --ratio=fix --peptide=Arginine --html &
sleep 2

echo "nice aminosee $1 $2 $3 $4 $5 $6  test --image --ratio square"
nice aminosee       $1 $2 $3 $4 $5 $6  test --image --ratio square &
sleep 2

echo "nice aminosee help"
nice aminosee help &
sleep 2


echo background demo
nice aminosee demo --no-html --no-image &
sleep 2

echo "doing aminosee serve and opening a file"
nice aminosee serve &
echo only works on linux:
open http://127.0.0.1:8081 &
sleep 2

clear
echo "                                         =///"
echo "-------------------------------------------"
echo COMPLETE TESTING FOR $1 $2 $3 $4 $5 $6 $6
echo "-------------------------------------------"
echo "                                         =///"
