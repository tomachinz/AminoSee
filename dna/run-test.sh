#!/bin/sh
# test should run quickly and quit.
#!/bin/sh
echo aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
aminosee_do () {
  success "$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12"
  nice aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --no-image --no-html --no-explorer
}
success () {
  echo $1
  echo $1
  echo $1
  echo $1
  echo $1
  sleep 1
}
w
npm run genversion

aminosee
aminosee -f $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
aminosee -q $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
echo SHOW VERBOSE
aminosee -v $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
echo USING INCORRECT SINGLE DASH FOR -help
aminosee -help

# sleep 1
FAST='50KB_TestPattern.txt'
MEDIUM='3MB_TestPattern.txt'
SLOW='27MB_TestPattern.txt'
aminosee_do $FAST $FAST $FAST --peptide=amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12

aminosee_do $FAST $1 $2 $3 $4 $5 $6 --force --peptide="aspartic_ACID"
aminosee_do $FAST -fb --peptide="gluTAMIC_aCID" $1 $2 $3 $4 $5 $6

success "PROGRESS bars test --> "
aminosee_do $SLOW $MEDIUM $1 $2 $3 $4 $5 $6 --force --peptide=opal -q --progress
success "PROGRESS bars peptide-opal force"

echo GARBAGE FILENAMES FUZZING THAT KINDA THING
aminosee_do $SLOW actualFileToThelieftistoseeifbatchrendersthroughthis junk asdfadsf $FAST * qwert  1KB_TestPattern.txt  txt.txt.txt $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
success garbage-filenames

aminosee_do $FAST     $1 $2 $3 $4 $5 $6 --triplet=ACT --ratio=sqr
aminosee_do $FAST     $1 $2 $3 $4 $5 $6 --triplet=ACT --peptide=Alanine --ratio=sqr
aminosee_do $FAST     $1 $2 $3 $4 $5 $6 --triplet=CAT --ratio=sqr
aminosee_do $FAST     $1 $2 $3 $4 $5 $6 -m5 --ratio=gol
aminosee_do $FAST $1 $2 $3 $4 $5 $6 -c100 --ratio=sqr

echo KEYBOARD MODE TEST
aminosee_do $FAST      $1 $2 $3 $4 $5 $6 --force --ratio=gol --peptide=Ochre --keyboard
aminosee_do $FAST      $1 $2 $3 $4 $5 $6  --force --no-updates -m7 --ratio=sqr --peptide=Amber
aminosee_do $FAST     $1 $2 $3 $4 $5 $6 --no-updates -m5 --peptide=Methionine --ratio=sqr
aminosee_do      $1 $2 $3 $4 $5 $6 -m 8 --peptide=Cysteine
aminosee_do      $1 $2 $3 $4 $5 $6 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan
aminosee_do $SLOW  $MEDIUM *  -c10 -q -v --debug $1 $2 $3 $4
aminosee_do $MEDIUM *  $FAST --keyboard $1 $2 $3 $4
aminosee_do *  $SLOW  $MEDIUM -c10 -k $1 $2 $3 $4
aminosee_do $FAST  $1 $2 $3 $4 $5 $6 --reg -t=GGG
# sleep 2
#
# echo 'aminosee_do*'
aminosee_do *  $1 $2 $3 $4 $5 $6     &
sleep 8

echo
# echo "-------------------------------------------"
# echo HALFWAY TESTING FOR $1 $2 $3 $4 $5 $6 $6
echo ABOUT TO START OPENING WINDOWS AROUND THE PLACE
# echo "-------------------------------------------"
echo
echo THIS SHOULD OPEN REPORT EVEN IF IT ALREADY EXISTS
aminosee_do $FAST -p=proline --html

# echo "nice aminosee $1 $2 $3 $4 $5 $6 -f --no-updates --ratio=fix --peptide=Arginine --html &"
nice aminosee $1 $2 $3 $4 $5 $6 -q --ratio=fix --peptide=Arginine --html

# echo "nice aminosee $1 $2 $3 $4 $5 $6  test --image --ratio square &"
# nice aminosee       $1 $2 $3 $4 $5 $6  test --image --ratio square &
# sleep 1

# echo "nice aminosee help &"
nice aminosee --help  $1 $2 $3 $4 $5 $6  --no-image &
sleep 1


# echo background demo
nice aminosee --demo   $1 $2 $3 $4 $5 $6  --no-html --image &
sleep 1

echo calibration TESTS ARE KNOWN TO BE BUGGY AT PRESEDNT:
aminosee --test

# echo "doing aminosee serve and opening a file"
nice aminosee serve $MEDIUM  $1 $2 $3 $4 $5 $6  --no-html --explorer &
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
