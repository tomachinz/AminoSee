#!/bin/sh
# test should run quickly and quit.
w
npm run genversion
aminosee
sleep 1
aminosee -f
sleep 1
aminosee -v
sleep 1
aminosee -q
sleep 1
FAST='50KB_TestPattern.txt'
# echo 'nice aminosee $1 $2 $3 $4 $5 $6   --peptide="aspartic ACID"'
nice aminosee $FAST $1 $2 $3 $4 $5 $6  --peptide="aspartic ACID" --no-image --no-html --no-explorer

# echo 'doing   $1 $2 $3 $4 $5 $6  --peptide="gluTAMIC aCID"'
nice aminosee  $FAST      $1 $2 $3 $4 $5 $6 -f --peptide="gluTAMIC aCID"  --no-image --no-html --no-explorer

echo TESTING GARBAGE FILENAMES FUZZING THAT KINDA THING
nice aminosee 27MB_TestPattern.txt asdfadsf 50KB_TestPattern.txt * qwert  1KB_TestPattern.txt  --no-image --no-html --no-explorer

# echo "nice aminosee $1 $2 $3 $4 $5 $6 --triplet ggg --ratio=sqr"
nice aminosee   $FAST     $1 $2 $3 $4 $5 $6 --triplet ggg --ratio=sqr  --no-image --no-html --no-explorer

# echo "nice aminosee $1 $2 $3 $4 $5 $6 -m5 --ratio=gol"
nice aminosee   $FAST     $1 $2 $3 $4 $5 $6 -m5 --ratio=gol  --no-image --no-html --no-explorer

echo nice aminosee  $1 $2 $3 $4 $5 $6 -c100 --ratio=sqr
nice aminosee  $FAST $1 $2 $3 $4 $5 $6 -c100 --ratio=sqr  --no-image --no-html --no-explorer

echo KEYBOARD MODE TEST
echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --ratio=gol --peptide=Ochre --keyboard"
nice aminosee  $FAST      $1 $2 $3 $4 $5 $6 -f --ratio=gol --peptide=Ochre --keyboard --no-image --no-html --no-explorer

# echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --no-updates -m7 --ratio=sqr --peptide=Amber"
nice aminosee  $FAST      $1 $2 $3 $4 $5 $6 -f --no-updates -m7 --ratio=sqr --peptide=Amber --no-image --no-html --no-explorer

# echo "nice aminosee $1 $2 $3 $4 $5 $6 --no-updates -m5 --peptide=Methionine --ratio=sqr"
nice aminosee  $FAST     $1 $2 $3 $4 $5 $6 --no-updates -m5 --peptide=Methionine --ratio=sqr --no-image --no-html --no-explorer

# echo "nice aminosee $1 $2 $3 $4 $5 $6 -m 8 --peptide=Cysteine"
nice aminosee       $1 $2 $3 $4 $5 $6 -m 8 --peptide=Cysteine --no-image --no-html --no-explorer

# echo nice aminosee       $1 $2 $3 $4 $5 $6 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan
nice aminosee       $1 $2 $3 $4 $5 $6 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan --no-image --no-html --no-explorer

aminosee 27MB_TestPattern.txt  3MB_TestPattern.txt *  -c10 -q -v --debug $1 $2 $3 $4 --no-image --no-html --no-explorer
aminosee 3MB_TestPattern.txt *  50KB_TestPattern.txt --keyboard $1 $2 $3 $4 --no-image --no-html --no-explorer
aminosee *  27MB_TestPattern.txt  3MB_TestPattern.txt -c10 -k $1 $2 $3 $4 --no-image --no-html --no-explorer

# sleep 2
#
# echo 'nice aminosee *'
nice aminosee *  $1 $2 $3 $4 $5 $6  --no-image --no-html --no-explorer   &
sleep 8

echo
# echo "-------------------------------------------"
# echo HALFWAY TESTING FOR $1 $2 $3 $4 $5 $6 $6
echo ABOUT TO START OPENING WINDOWS AROUND THE PLACE
# echo "-------------------------------------------"
echo


# echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --no-updates --ratio=fix --peptide=Arginine --html &"
nice aminosee   $1 $2 $3 $4 $5 $6 -q --ratio=fix --peptide=Arginine --html &

# echo "nice aminosee $1 $2 $3 $4 $5 $6  test --image --ratio square &"
# nice aminosee       $1 $2 $3 $4 $5 $6  test --image --ratio square &
sleep 1

# echo "nice aminosee help &"
nice aminosee help  $1 $2 $3 $4 $5 $6  --no-image &
sleep 1


# echo background demo
nice aminosee demo   $1 $2 $3 $4 $5 $6  --no-html --image &
sleep 1

# echo "doing aminosee serve and opening a file"
nice aminosee serve 3MB_TestPattern.txt  $1 $2 $3 $4 $5 $6  --no-html --explorer &
# echo only works on linux:
# open http://127.0.0.1:8081 &
sleep 1
echo KILLING ALL AMINOSEE SERVERS IN 5 seconds
sleep 1
clear

echo "                                         =///"
echo "-------------------------------------------"
echo NEARLY COMPLETED TESTING FOR $1 $2 $3 $4 $5 $6 $6
echo LETS TYR THE ELECTRON APP GUI
echo "-------------------------------------------"
echo "                                         =///"
npm run gui &
sleep 1
echo "                                         =///"
echo "-------------------------------------------"
echo COMPLETED TESTING FOR $1 $2 $3 $4 $5 $6 $6
echo "-------------------------------------------"
echo "                                         =///"
clear
killall aminosee.funk.nz
killall "aminosee.funk.nz 27MB_TestPattern 34.94MB"
