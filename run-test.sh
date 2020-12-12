#!/bin/sh
# test should run quickly and quit.
FAST='dna/50KB_TestPattern.txt'
MEDIUM='dna/3MB_TestPattern.txt'
SLOW='dna/27MB_TestPattern.txt'
NETWORK='/Volumes/aminosee/dna/3MB_TestPattern.txt'
npm run genversion
echo trying to get to root of project...:
cd ../dna
cd ../
ls
sleep 1
rm src/dist

pwd
test_do () {
  echo ____________________ $*
  echo
  nice aminosee $*
  echo
}
echo STOPPPING SERVER
aminosee --stop
echo STARTING SERVER TO RUN IN BACKGROUND
echo 
aminosee --serve &
test_do "aminosee serve" --serve $MEDIUM --no-image & 
sleep 1
aminosee 
echo QUIET MODE
aminosee -q
echo aminosee $*  --no-image
aminosee $*  --no-image
test_do "KEYBOARD MODE" $FAST $*  --no-image  --peptide=Methionine --keyboard
test_do "regmarks" $FAST $*  --reg
test_do "Networked cluster render test $NETWORK" -fv --peptide=Phenylalanine $FAST $NETWORK $MEDIUM $*
test_do "Test use of --maxpix=5000000" --maxpix=5000000 -v $SLOW $MEDIUM $FAST $NETWORK $*
test_do "Forced re-render verbose no image" -fv $MEDIUM $FAST $*  --no-image
test_do "Demo -m4 no image" --demo -m4 --no-image $*
test_do "Test -m5" --demo -m4 -q $*
test_do "Test -m5" --test -m5 
test_do "Test -m5" --test -p=Green -m4 $*
test_do 'Curious back walk bug debug' -d --debug $FAST Influenza-A-virus-H9N2-NC_004905.gbk Streptococcus_virus_2972.gbk $*
test_do "QUIET MODE WITH PARAMS" -q $*  --no-image
test_do "VERBOSE MODE" -v  -p=Lysine  $*  --no-image
test_do "USING INCORRECT SINGLE DASH FOR -help" -help $*  --no-image
test_do "THREE OF SAME FILE IN A ROW: $FAST WITH PEPTIDE=AMBER" $FAST $FAST $FAST --peptide=amber $*  --no-image
test_do "Wonky caps aspartic_ACID" $FAST  --force --peptide=aspartic_ACID $*  --no-image
test_do "gluTAMIC_aCID" $FAST -fb --peptide="gluTAMIC_aCID" $*  --no-image
test_do "PROGRESS BARS" $SLOW $MEDIUM $FAST $*  --force --peptide=opal -q --progress --dnabg $*  --no-image
test_do "GARBAGE FILENAMES FUZZING like   txt.txt.txt etc" -q $SLOW actualFileToThelieftistoseeifbatchrendersthroughthis junk asdfadsf $FAST qwert txt.txt.txt $*  --no-image

echo THE NEXT ONES RENDER NON-STANDARD
test_do "Triplet ACT Square ratio disable keyboard" --no-keyboard $FAST $MEDIUM --triplet=ACT --ratio=sqr $*  --no-image
test_do "Triplet TTT and ochre was not designed to do both" $FAST    --triplet=TTT --peptide=ochre --ratio=sqr $*  --no-image
test_do "Triplet CAT ratio sqr" $FAST $MEDIUM   --triplet=CAT --ratio=sqr $* --no-image
test_do "m5 Golden" $FAST $MEDIUM  -m5 --ratio=gol $* --no-image
test_do "c100 Golden" $FAST $MEDIUM  -c100 --ratio=golden $* --no-image
test_do "c100 Golden regmarks" $FAST $MEDIUM  -c2 --regmarks --ratio=gol $* --no-image
# test_do "Amber"         $FAST      $*  --no-image    --force --no-updates -m7 --ratio=sqr --peptide=Amber
# test_do "Methionine"    $FAST      $*  --no-image   --no-updates -m5 --peptide=Methionine --ratio=sqr
# test_do " -m 8 --peptide=Cysteine" $*  --no-image   -m 8 --peptide=Cysteine
# test_do "-c 69 --ratio=GOLDEN --peptide=Tryptophan" $*  --no-image   -c 69 --ratio=GOLDEN --peptide=Tryptophan
# test_do "-c10" $SLOW  $MEDIUM *  -c10 -q -v --debug $*  --no-image
# test_do " --ratio=GOL" $MEDIUM *  $FAST --keyboard $* --ratio=GOL
# test_do "*  $SLOW  $MEDIUM" *  $SLOW  $MEDIUM -c10 -k $*
# test_do "GGG" $FAST  $*  --no-image   --reg -t=ggg
# test_do "*" *  $*  --no-image       &
echo
echo "-------------------------------------------"
echo "-------------------------------------------"
echo ABOUT TO START OPENING WINDOWS AROUND THE PLACE
echo "-------------------------------------------"
echo "-------------------------------------------"
echo
sleep 1
echo THIS SHOULD OPEN REPORT EVEN IF IT ALREADY EXISTS
test_do "html PROLINE" $* $FAST --html
nice aminosee --image -q --ratio=fix --peptide=Arginine $*  --no-image
nice aminosee --help   --no-image $*  --no-image
nice aminosee --demo --no-html --explorer $*  --no-image
# echo calibration TESTS ARE KNOWN TO BE BUGGY AT PRESENT:
test_do "Calibration" --test $* --no-image
# open http://localhost:4321 &
sleep 1
echo KILLING ALL AMINOSEE SERVERS IN 5 seconds
sleep 1
# clear
echo "                                         =///"
echo "-------------------------------------------"
echo NEARLY COMPLETED TESTING FOR $*  --no-image   $6
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
echo COMPLETED TESTING FOR $*  --no-image   $6
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
