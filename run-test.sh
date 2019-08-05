test_do #!/bin/sh
# test should run quickly and quit.
FAST='dna/50KB_TestPattern.txt'
MEDIUM='dna/3MB_TestPattern.txt'
SLOW='dna/27MB_TestPattern.txt'
NICE=1
test_do () {
  success $1 "START__ $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 _________"
  nice aminosee $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  # NICE=$((NICE + 1))
  success $1 "END____ $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 _________"
}

success () {
  echo __________________________________________
  echo $1 $2
  echo
}
npm run genversion
nice npm run credits &
echo aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
echo STOPPPING SERVER
aminosee --stop
echo STARTING SERVER TO RUN IN BACKGROUND
aminosee --serve &
aminosee
test_do "FORCED RENDER OF SMALL GENOME: $FAST" -f $FAST $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "QUIET MODE" -q $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "VERBOSE MODE" -v $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "USING INCORRECT SINGLE DASH FOR -help" -help $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "THREE OF SAME FILE IN A ROW: $FAST WITH PEPTIDE=AMBER" $FAST $FAST $FAST --peptide=amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "Wonky caps: -p=aspartic_ACID" $FAST $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --force --peptide="aspartic_ACID"
test_do "gluTAMIC_aCID" $FAST -fb --peptide="gluTAMIC_aCID" $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "PROGRESS BARS" $MEDIUM $FAST $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --force --peptide=opal -q --progress --dnabg
test_do "GARBAGE FILENAMES FUZZING" $SLOW actualFileToThelieftistoseeifbatchrendersthroughthis junk asdfadsf $FAST * qwert  dna/1KB_TestPattern.txt  txt.txt.txt $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do "Triplet ACT Square ratio"  $FAST     $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --triplet=ACT --ratio=sqr
test_do "Triplet TTT and Proline (was not designed to do both)" $FAST     $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --triplet=TTT --peptide=Proline --ratio=sqr
test_do "Triplet CAT ratio sqr" $FAST     $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --triplet=CAT --ratio=sqr
test_do "m5 Golden" $FAST     $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  -m5 --ratio=gol
test_do "c100 Golden" $FAST $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  -c100 --ratio=golden
echo KEYBOARD MODE TEST
test_do "Ochre"         $FAST      $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --force --ratio=gol --peptide=Ochre --keyboard
test_do "Amber"         $FAST      $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12   --force --no-updates -m7 --ratio=sqr --peptide=Amber
test_do "Methionine"    $FAST      $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --no-updates -m5 --peptide=Methionine --ratio=sqr
test_do " -m 8 --peptide=Cysteine" $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  -m 8 --peptide=Cysteine
test_do "-c 69 --ratio=GOLDEN --peptide=Tryptophan" $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  -c 69 --ratio=GOLDEN --peptide=Tryptophan
test_do "-c10" $SLOW  $MEDIUM *  -c10 -q -v --debug $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
test_do " --ratio=GOL" $MEDIUM *  $FAST --keyboard $1 $2 $3 $4 --ratio=GOL
test_do "*  $SLOW  $MEDIUM" *  $SLOW  $MEDIUM -c10 -k $1 $2 $3 $4
test_do "GGG" $FAST  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --reg -t=ggg
test_do "*" *  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12      &
echo
echo "-------------------------------------------"
echo ABOUT TO START OPENING WINDOWS AROUND THE PLACE
echo "-------------------------------------------"
echo
sleep 1
echo THIS SHOULD OPEN REPORT EVEN IF IT ALREADY EXISTS
test_do "html" $FAST -p=proline --html
nice aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  -q --ratio=fix --peptide=Arginine --html
nice aminosee --help  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12   --no-image &
nice aminosee --demo   $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12   --no-html --image &
echo calibration TESTS ARE KNOWN TO BE BUGGY AT PRESENT:
test_do "Calibration" --test
test_do "doing aminosee serve and opening a file" --serve $MEDIUM  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  --no-html --explorer
# open http://localhost:4321 &
sleep 1
echo KILLING ALL AMINOSEE SERVERS IN 5 seconds
sleep 1
# clear
echo "                                         =///"
echo "-------------------------------------------"
echo NEARLY COMPLETED TESTING FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  $6
echo LETS TYR THE ELECTRON APP GUI
echo "-------------------------------------------"
echo "                                         =///"
# npm run gui &
# sleep 1

clear
# killall "aminosee.funk.nz 27MB_TestPattern 34.94MB"
lighthouse http://localhost:4321  --view;
eslint src/aminosee-cli.js
vows --spec --isolate
echo Stopping server in 1 second
sleep 1
killall node
killall aminosee.funk.nz
sleep 1

echo "                                         =///"
echo "-------------------------------------------"
echo COMPLETED TESTING FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12  $6
echo "-------------------------------------------"
echo "                                         =///"

echo ALL TESTS NON-BLOCKING!
echo done
echo
echo will compile macOS binary in 2 minutes
sleep 120

npm run macos
sleep 60
./build-gui.sh
