#!/bin/sh
echo script input was: $*
echo


series_peptides () {
	echo START RENDER with
	echo $*
	echo
  nice -n 1 aminosee      $*
  nice -n 4 aminosee  --peptide=Glutamic_acid $*
  nice -n 4 aminosee  --peptide=Aspartic_acid $*
  nice -n 4 aminosee  --peptide=Ochre $*
  nice -n 4 aminosee  --peptide=Amber $*
  nice -n 4 aminosee  --peptide=Opal $*
  nice -n 4 aminosee  --peptide=Methionine $*
  nice -n 4 aminosee  --peptide=Cysteine $*
  nice -n 4 aminosee  --peptide=Glycine $*
  nice -n 4 aminosee  --peptide=Alanine $*
  nice -n 4 aminosee  --peptide=Valine $*
  nice -n 4 aminosee  --peptide=Leucine $*
  nice -n 4 aminosee  --peptide=Isoleucine $*
  nice -n 4 aminosee  --peptide=Phenylalanine $*
  nice -n 4 aminosee  --peptide=Proline $*
  nice -n 4 aminosee  --peptide=Tryptophan $*
  nice -n 4 aminosee  --peptide=Serine $*
  nice -n 4 aminosee  --peptide=Threonine $*
  nice -n 4 aminosee  --peptide=Glutamine $*
  nice -n 4 aminosee  --peptide=Asparagine $*
  nice -n 4 aminosee  --peptide=Tyrosine $*
  nice -n 4 aminosee  --peptide=Arginine $*
  nice -n 4 aminosee  --peptide=Lysine $*
  nice -n 4 aminosee  --peptide=Histidine  $*
	echo
	echo done
	sleep 1

}

find_way_peptides () {

	echo
	nice -n 1 aminosee  $*
	nice -n 2 aminosee  $*  --peptide=Glutamic_acid
	nice -n 2 aminosee  $*  --peptide=Aspartic_acid
	nice -n 2 aminosee  $*  --peptide=Ochre
	nice -n 2 aminosee  $*  --peptide=Amber
	nice -n 2 aminosee  $*  --peptide=Opal
	nice -n 2 aminosee  $*  --peptide=Methionine
	nice -n 2 aminosee  $*  --peptide=Cysteine
	nice -n 2 aminosee  $*  --peptide=Glycine
	nice -n 2 aminosee  $*  --peptide=Alanine
	nice -n 2 aminosee  $*  --peptide=Valine
	nice -n 2 aminosee         $*  --peptide=Leucine
	nice -n 2 aminosee  $*  --peptide=Isoleucine
	nice -n 2 aminosee  $*  --peptide=Phenylalanine
	nice -n 2 aminosee  $*  --peptide=Proline
	nice -n 2 aminosee  $*  --peptide=Tryptophan
	nice -n 2 aminosee  $*  --peptide=Serine
	nice -n 2 aminosee  $*  --peptide=Threonine
	nice -n 2 aminosee  $*  --peptide=Glutamine
	nice -n 2 aminosee  $*  --peptide=Asparagine
	nice -n 2 aminosee  $*  --peptide=Tyrosine
	nice -n 2 aminosee  $*  --peptide=Arginine
	nice -n 2 aminosee  $*  --peptide=Lysine
	nice -n 2 aminosee         $*  --peptide=Histidine
	echo
	echo end of batch peptides

	
	#
	#
	#
  # echo STARTING SERIAL DECODE FOR $*  $11 $12 $13 $14 $15 $16
  # if [ $(uname)="Darwin" ]; then
  #   echo macos
	# 	# DASHF=" -f  "
	# 	DASHF=" -L  $* | grep -E \"(txt|mfa|gbk|txt|fa)\""
  # fi
	#
  # if [ $(uname)="Linux" ]; then
  #   echo linux
  #   DASHF=" "
  # fi
	#
	#
	# find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ aminosee --image $ $*
	# find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $                     $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Glutamic_acid $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Aspartic_acid $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Ochre $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Amber $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Cysteine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Glycine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Alanine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Methionine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Valine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Leucine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Isoleucine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Phenylalanine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Tryptophan $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Serine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Threonine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Opal $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Glutamine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Asparagine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Tyrosine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Arginine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Lysine $*
  # find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Histidine $*
	#
	#
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee                     $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Glutamic_acid $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Aspartic_acid $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Ochre $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Amber $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Cysteine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Glycine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Alanine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Methionine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Valine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Leucine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Isoleucine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Phenylalanine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Tryptophan $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Serine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Threonine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Opal $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Glutamine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Asparagine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Tyrosine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Arginine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Lysine $* "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Histidine $* "{}" \;

  echo FINISHED SERIAL DECODE FOR  $*
	#
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --index                 $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Glutamic_acid $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Aspartic_acid $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Ochre $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Amber $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Cysteine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Glycine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Alanine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Methionine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Valine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Leucine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Isoleucine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Phenylalanine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Tryptophan $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Serine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Threonine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Opal $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Glutamine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Asparagine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Tyrosine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Arginine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Lysine $* "{}" \;
	# find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Histidine $* "{}" \;
}



if [ -z "$1" ]; then
	echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]
	echo
	echo will now run aminosee batch using the files:
	echo *
	echo ow doing "find way" brute forcing it
	# exit
	find_way_peptides
	find_way_peptides --reg --index
else
	series_peptides $*
fi
