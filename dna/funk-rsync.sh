# COMMAND="--update --verbose --stats --exclude={'*_linear__[ABCDEFGHIJKLMNOPQRSTUVWXYZ]'} $HOME/AminoSee_webroot/output/ tom@cheese:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/ "
COMMAND="--update --verbose --stats --exclude={'*_linear__**'} $HOME/AminoSee_webroot/output/ $HOME/Dropbox/Sites/funk.co.nz/aminosee/output/ "
# COMMAND="--update --verbose --stats --exclude={'*_linear__[ABCDEFGHIJKLMNOPQRSTUVWXYZ]'} $HOME/AminoSee_webroot/output/ tomachi2@direct.funk.co.nz:/home/tomachi2/funk.co.nz/aminosee/output/ "
COMMAND=" --archive  --update --verbose --stats  --exclude='*_linear*__*'  ~/AminoSee_webroot/output/ tomachi2@direct.funk.co.nz:/home/tomachi2/funk.co.nz/aminosee/output/ "


runrsync() {
  # removelocks $SOURCE
  echo
	echo COPYING WITH RSYNC FROM $SOURCE TO $DEST
	echo MAKE SURE BOTH PATHS HAVE TRAILING SLASH!!
	echo
  echo
  echo rsync --dry-run $COMMAND
  echo
	echo doing 	DRY-RUN that above in 1 seconds...
	sleep 1
	eval "rsync --dry-run $COMMAND"
  echo
  echo completed Dry-run, now proceeding for real
  echo
	echo COPYING WITH RSYNC FROM $SOURCE TO $DEST
	echo MAKE SURE BOTH PATHS HAVE TRAILING SLASH!!
	echo
  echo
  echo rsync $COMMAND
  echo
	echo doing FOR REAL that above in 2 seconds...
	sleep 2
	eval "rsync $COMMAND"
  echo

}

runrsync
