#!/bin/sh
# test should run quickly and quit.
FAST='dna/50KB_TestPattern.txt'
MEDIUM='dna/3MB_TestPattern.txt'
SLOW='dna/27MB_TestPattern.txt'
NETWORK='/Volumes/aminosee/dna/3MB_TestPattern.txt'
# 12='--no-image'
npm run genversion
echo trying to get to root of project...:
cd ../dna
cd ../
pwd
test_do () {
  echo __________________________________________
  echo
  echo
  echo START
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10
  nice aminosee $2 $3 $4 $5 $6 $7 $8 $9 $10
  echo
  echo
  echo
  echo END
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
}

echo STOPPPING SERVER
aminosee --stop
echo QUIET MODE
aminosee -q
echo aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
echo STARTING SERVER TO RUN IN BACKGROUND
aminosee --serve &
test_do "NETWORKED CLUSTER RENDER TEST $NETWORK" -fv --peptide=Phenylalanine $FAST $NETWORK $MEDIUM
test_do "FORCED RENDER (HAS BUG SEEMS TO BLOCK TEST)" -fv $MEDIUM $FAST $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "CALIBRATION IMAGES" --demo --no-image
test_do 'Curious back walk bug' -d --debug $FAST Influenza-A-virus-H9N2-NC_004905.gbk Streptococcus_virus_2972.gbk $1
test_do "QUIET MODE WITH PARAMS" -q $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "VERBOSE MODE" -v  -p=Lysine  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "USING INCORRECT SINGLE DASH FOR -help" -help $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "THREE OF SAME FILE IN A ROW: $FAST WITH PEPTIDE=AMBER" $FAST $FAST $FAST --peptide=amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "Wonky caps aspartic_ACID" $FAST  --force --peptide=aspartic_ACID $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "gluTAMIC_aCID" $FAST -fb --peptide="gluTAMIC_aCID" $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
test_do "PROGRESS BARS" $MEDIUM $FAST $1 $2 --force --peptide=opal -q --progress --dnabg $3 $4 $5 $6 $7 $8 $9 $10  --no-image
# tes_do "GARBAGE FILENAMES FUZZING like   txt.txt.txt etc" $SLOW actualFileToThelieftistoseeifbatchrendersthroughthis junk asdfadsf $FAST qwert txt.txt.txt $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image

echo THE NEXT ONES RENDER NON-STANDARD
test_do "Triplet ACT Square ratio"  $FAST $MEDIUM --triplet=ACT --ratio=sqr
test_do "Triplet TTT and ochre was not designed to do both" $FAST    --triplet=TTT --peptide=ochre --ratio=sqr
test_do "Triplet CAT ratio sqr" $FAST $MEDIUM   --triplet=CAT --ratio=sqr
test_do "m5 Golden" $FAST $MEDIUM  -m5 --ratio=gol
test_do "c100 Golden" $FAST $MEDIUM  -c100 --ratio=golden
test_do "c100 Golden regmarks " $FAST $MEDIUM  -c2 --regmarks --ratio=gol
echo KEYBOARD MODE TEST
test_do "Ochre KEYBOARD HANGS TEST"         $FAST      $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image  --peptide=Methionine --keyboard
# test_do "Amber"         $FAST      $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image    --force --no-updates -m7 --ratio=sqr --peptide=Amber
# test_do "Methionine"    $FAST      $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image   --no-updates -m5 --peptide=Methionine --ratio=sqr
# test_do " -m 8 --peptide=Cysteine" $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image   -m 8 --peptide=Cysteine
# test_do "-c 69 --ratio=GOLDEN --peptide=Tryptophan" $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image   -c 69 --ratio=GOLDEN --peptide=Tryptophan
# test_do "-c10" $SLOW  $MEDIUM *  -c10 -q -v --debug $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
# test_do " --ratio=GOL" $MEDIUM *  $FAST --keyboard $1 $2 $3 $4 --ratio=GOL
# test_do "*  $SLOW  $MEDIUM" *  $SLOW  $MEDIUM -c10 -k $1 $2 $3 $4
# test_do "GGG" $FAST  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image   --reg -t=ggg
# test_do "*" *  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image       &
echo
echo "-------------------------------------------"
echo "-------------------------------------------"
echo ABOUT TO START OPENING WINDOWS AROUND THE PLACE
echo "-------------------------------------------"
echo "-------------------------------------------"
echo
sleep 1
echo THIS SHOULD OPEN REPORT EVEN IF IT ALREADY EXISTS
test_do "html PROLINE" $1 $FAST --html
nice aminosee --image -q --ratio=fix --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
nice aminosee --help   --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
nice aminosee --demo --no-html --explorer $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image
echo calibration TESTS ARE KNOWN TO BE BUGGY AT PRESENT:
test_do "Calibration" --test $1 --no-image
test_do "doing aminosee serve and opening a file" --serve $MEDIUM  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image    &
# open http://localhost:4321 &
sleep 1
echo KILLING ALL AMINOSEE SERVERS IN 5 seconds
sleep 1
# clear
echo "                                         =///"
echo "-------------------------------------------"
echo NEARLY COMPLETED TESTING FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image   $6
echo LETS TYR THE ELECTRON APP GUI
echo "-------------------------------------------"
echo "                                         =///"
# npm run gui &
# sleep 1

clear
lighthouse http://localhost:4321  --view --output-path=./test/ --save-assets

ESLINT="test/eslint-errors.txt"
rm $ESLINT >/dev/null
touch $ESLINT
tail -f $ESLINT &
eslint src/aminosee-cli.js > $ESLINT

vows --spec --isolate
aminosee --stop
echo Stopping server in 1 second
sleep 1
killall node
killall aminosee.funk.nz
sleep 1

echo "                                         =///"
echo "-------------------------------------------"
echo COMPLETED TESTING FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10  --no-image   $6
echo "-------------------------------------------"
echo "                                         =///"

echo ALL TESTS NON-BLOCKING!
echo done
# echo
# echo will compile macOS binary in 2 minutes
# sleep 120
#
# npm run macos
# sleep 60
# ./build-gui.sh
sleep 1
trap 'exit 0' TERM
(killall -m tail 2>&1) >/dev/null
exit 0
