#/usr/bin/rsync --archive --verbose --delete --dry-run --stats /Users/tom/AminoSee_Output/ /Volumes/aminosee/dna/AminoSee_Output/
COMMAND="/usr/bin/rsync --archive --verbose --delete --dry-run --stats tom@cheese:/home/tom/Sites/AminoSee/dna/AminoSee_Output/  /Users/tom/AminoSee_Output/"
eval $COMMAND
echo
echo remove the --dry-run to do it for real:
echo $COMMAND
