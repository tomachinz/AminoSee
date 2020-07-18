opn() {
  echo Open in Finder $OPN
  ls -la $OPN
  echo
  open $OPN
}
OPN="$HOME/Desktop/4TB"; opn
OPN="$HOME/Desktop/HotelVermont"; opn


bsync ~/AminoSee_webroot /Volumes/HotelVermont/Users/tom/AminoSee_webroot
# CLONECOMMAND="/usr/bin/rsync --update --archive --verbose --stats  --dry-run tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/output/  /Users/tom/AminoSee_webroot/output/"
# DRYCOMMAND="/usr/bin/rsync --update --archive --verbose --stats              tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/output/  /Users/tom/AminoSee_webroot/output/ "
# WETCOMMAND="/usr/bin/rsync --update --archive --verbose --stats              tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_webroot/output/  /Users/tom/AminoSee_webroot/output/ "
# eval $CLONECOMMAND
# echo
# echo remove the --dry-run to do it for real:
# echo
# echo $DRYCOMMAND
# sleep 2
# echo $COMMAND
# eval $DRYCOMMAND
# /usr/bin/rsync --archive --verbose  --dry-run --stats --exclude='**/*linear*' tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_Output/ /Users/tom/AminoSee_Output/
#/usr/bin/rsync --archive --verbose --delete --dry-run --stats /Users/tom/AminoSee_Output/ /Volumes/aminosee/dna/AminoSee_Output/
# CLONECOMMAND="/usr/bin/rsync --archive --verbose --stats  --dry-run  --exclude={'*_linear_*'} tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_Output/  /Users/tom/AminoSee_Output/ "
# WETCOMMAND="/usr/bin/rsync --archive --verbose --stats  --exclude={'*_linear_[ABCDEFGHIJKLMNOPQRSTUVWXYZ]'} /Users/tom/AminoSee_Output/ tom@cheese.funk.nz:/home/tom/Sites/AminoSee/dna/AminoSee_Output/ "

#
# DRYCOMMAND="/usr/bin/rsync --update --archive --verbose --stats --delete /Users/tom/AminoSee_webroot/output/  /Users/tom/Dropbox/Sites/funk.co.nz/aminosee/output/"
# echo ABout to run:
# echo $DRYCOMMAND
# sleep 2
# eval $DRYCOMMAND
# echo
# echo That was from running:
# echo $DRYCOMMAND
