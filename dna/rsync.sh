#/usr/bin/rsync --archive --verbose --delete --dry-run --stats /Users/tom/AminoSee_Output/ /Volumes/aminosee/dna/AminoSee_Output/
CLONECOMMAND="/usr/bin/rsync --archive --verbose --delete --dry-run --stats  --exclude={"*_linear_*"} tom@cheese:/home/tom/Sites/AminoSee/dna/AminoSee_Output/  /Users/tom/AminoSee_Output/"
DRYCOMMAND="/usr/bin/rsync --archive --verbose --stats  --exclude={"*_linear_*"} tom@cheese:/home/tom/Sites/AminoSee/dna/AminoSee_Output/  /Users/tom/AminoSee_Output/"
WETCOMMAND="/usr/bin/rsync --archive --verbose --stats  --exclude={"*_linear_[ABCDEFGHIJKLMNOPQRSTUVWXYZ]"} /Users/tom/AminoSee_Output/ tom@cheese:/home/tom/Sites/AminoSee/dna/AminoSee_Output/  "

eval $CLONECOMMAND
echo
echo remove the --dry-run to do it for real:
echo
echo $DRYCOMMAND
sleep 2
echo $COMMAND
eval $DRYCOMMAND
# /usr/bin/rsync --archive --verbose  --dry-run --stats --exclude='**/*linear*' tom@cheese:/home/tom/Sites/AminoSee/dna/AminoSee_Output/ /Users/tom/AminoSee_Output/
