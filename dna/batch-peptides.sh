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

asterix_way_peptides () {

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
}

find_way_peptides () {

  echo STARTING SERIAL DECODE FOR $*  $11 $12 $13 $14 $15 $16
  if [ $(uname)="Darwin" ]; then
    echo macos
		# DASHF=" -f  "
		DASHF=" -L  $* | grep -E \"(txt|mfa|gbk|txt|fa)\""
  fi
	
  if [ $(uname)="Linux" ]; then
    echo linux
    DASHF=" "
  fi
	

		
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ aminosee $ 
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $                     
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Glutamic_acid
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Aspartic_acid
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Ochre
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Amber
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Cysteine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Glycine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Alanine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Methionine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Valine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Leucine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Isoleucine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Phenylalanine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Tryptophan
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Serine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Threonine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Opal
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Glutamine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Asparagine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Tyrosine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Arginine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Lysine
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -I $ nice aminosee $  --peptide=Histidine
	
sleep 10 
	
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ aminosee $ $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $                     $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Glutamic_acid $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Aspartic_acid $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Ochre $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Amber $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Cysteine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Glycine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Alanine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Methionine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Valine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Leucine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Isoleucine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Phenylalanine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Tryptophan $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Serine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Threonine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Opal $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Glutamine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Asparagine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Tyrosine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Arginine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Lysine $*
	find  -L  * | grep -E "(txt|mfa|gbk|txt|fa)" | xargs -J $ nice aminosee $  --peptide=Histidine $*
	
	


}	
 


if [ -z "$1" ]; then
	echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]
	echo
	echo will now run aminosee batch using find:
	echo 
	# exit
	# find_way_peptides --reg --index --maxpix 1000000 -q
	find_way_peptides  --no-updates
else
	# series_peptides $* --reg --index --maxpix 1000000 --no-updates -q &
	echo series $*
	series_peptides -q $* 
fi
