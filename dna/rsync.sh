opn() {
  echo Open in Finder $OPN
  ls -la $OPN
  echo
  open $OPN
}
OPN="$HOME/Desktop/4TB"; opn
OPN="$HOME/Desktop/HotelVermont"; opn
escapespace() {
  echo Escaping spaces in folders for: $*
  echo
	SOURCE=$(echo "$1" | sed "s/ /\\\ /g")
	DEST=$(echo "$2"   |   sed "s/ /\\\ /g")
  SOURCENOESCAPE="$1"
  DESTNOESCAPE="$2"

  # use -z for files -d for dirs
  echo SOURCE DIRECTORY
  checkifexists "$SOURCENOESCAPE"
  echo DESTINATION DIRECTORY
  checkifexists "$DESTNOESCAPE"
  echo
  sleep 1
}
twowayupdate() {
  escapespace "$1" "$2"
  COMMAND=" -arv --update --stats --exclude={$EXCLUDE} $SOURCE $DEST | pv"
  runrsync
  COMMAND=" -arv --update --stats --exclude={$EXCLUDE} $DEST $SOURCE | pv"
  runrsync
}
hardlinkeddirectory() {
  escapespace "$1" "$2"
  COMMAND=" --hard-links --recursive  --stats --exclude={$EXCLUDE} $SOURCE $DEST | pv"
  runrsync
  COMMAND=" -arv --update --stats --exclude={$EXCLUDE} $DEST $SOURCE | pv"
  runrsync
}

dodu() {
  echo
  echo "Source: ============ $SOURCE"
	echo "Destination: ======= $DEST"
  echo
}
printsourcedest() {
  dodu
	echo "showing SOURCE sub-dir sizes (and checking they exist!)... $SOURCE"
	echo
  eval cd "$SOURCE"
  pwd
  eval cd "$DEST"

  pwd
  echo
  sleep 1
  eval cd "$SOURCE" 	nice du -d 1 -h &

	echo Source pwd: $(pwd)
	echo "=========================================="
	echo
	echo "showing DESTINATION sub-dir sizes... $DEST"
	echo
  sleep 1
	du -d 1 -h &
	sleep 2
  dodu
}
runrsync() {
  echo
	echo COPYING WITH RSYNC FROM $SOURCE TO $DEST
	echo MAKE SURE BOTH PATHS HAVE TRAILING SLASH!!
	echo
  printsourcedest
  echo
  echo rsync --dry-run $COMMAND
  echo
	echo doing 	DRY-RUN that above in 1 seconds...
	sleep 1
	eval nice -n 18 rsync --dry-run $COMMAND
  echo
  echo completed Dry-run, now proceeding for real
  echo
	echo COPYING WITH RSYNC FROM $SOURCE TO $DEST
	echo MAKE SURE BOTH PATHS HAVE TRAILING SLASH!!
	echo
  echo
  echo rsync $COMMAND
  echo
	echo doing FOR REAL that above in 6 seconds...
	sleep 6
	eval "sudo nice -n 10 rsync $COMMAND"
  echo
	echo
	echo DONE!
  echo
	echo "=========================================="
	echo continuing in 10 seconds
  sleep 10
}

twowayupdate /Users/tom/AminoSee_webroot/output/  /Volumes/HotelVermont/Users/tom/AminoSee_webroot/output/

hardlinkeddirectory /Users/tom/AminoSee_webroot/output/ /Users/tom/Dropbox/Sites/funk.co.nz/aminosee/output/

# bsync ~/AminoSee_webroot /Volumes/HotelVermont/Users/tom/AminoSee_webroot
# CLONECOMMAND="/usr/bin/rsync --update --archive --verbose --stats  --dry-run tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/output/  /Users/tom/AminoSee_webroot/output/"
# DRYCOMMAND="/usr/bin/rsync --update --archive --verbose --stats              tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/output/  /Users/tom/AminoSee_webroot/output/ "
# WETCOMMAND="/usr/bin/rsync --update --archive --verbose --stats              tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/output/  /Users/tom/AminoSee_webroot/output/ "
# /usr/bin/rsync --archive --verbose  --dry-run --stats --exclude='**/*linear*' tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_Output/ /Users/tom/AminoSee_Output/
#/usr/bin/rsync --archive --verbose --delete --dry-run --stats /Users/tom/AminoSee_Output/ /Volumes/aminosee/dna/AminoSee_Output/
# CLONECOMMAND="/usr/bin/rsync --archive --verbose --stats  --dry-run  --exclude={'*_linear_*'} tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_Output/  /Users/tom/AminoSee_Output/ "
# WETCOMMAND="/usr/bin/rsync --archive --verbose --stats  --exclude={'*_linear_[ABCDEFGHIJKLMNOPQRSTUVWXYZ]'} /Users/tom/AminoSee_Output/ tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_Output/ "
