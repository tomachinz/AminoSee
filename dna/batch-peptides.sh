#!/bin/sh
echo input was: $1
echo
# sleep 2
aminosee_do () {
	echo AminoSee batch script with seven parameters
	echo
	echo $1 $2 $3 $4 $5 $6 $7
	echo
  nice -n 4 aminosee -q --maxpix=5000000 $1 $2 $3 $4 $5 $6 $7
	echo
	echo Batch Peptides Script Finished: $1 $2 $3 $4 $5 $6 $7
	echo
	sleep 1
}

series_peptides () {
	echo START RENDER with four parameters:
	echo $1 $2 $3 $4
	echo
  aminosee_do  --index    $1 $2 $3 $4
  aminosee_do  --peptide=Glutamic_acid $1 $2 $3 $4
  aminosee_do  --peptide=Aspartic_acid $1 $2 $3 $4
  aminosee_do  --peptide=Ochre $1 $2 $3 $4
  aminosee_do  --peptide=Amber $1 $2 $3 $4
  aminosee_do  --peptide=Opal $1 $2 $3 $4
  aminosee_do  --peptide=Methionine $1 $2 $3 $4
  aminosee_do  --peptide=Cysteine $1 $2 $3 $4
  aminosee_do  --peptide=Glycine $1 $2 $3 $4
  aminosee_do  --peptide=Alanine $1 $2 $3 $4
  aminosee_do  --peptide=Valine $1 $2 $3 $4
  aminosee_do  --peptide=Leucine $1 $2 $3 $4
  aminosee_do  --peptide=Isoleucine $1 $2 $3 $4
  aminosee_do  --peptide=Phenylalanine $1 $2 $3 $4
  aminosee_do  --peptide=Proline $1 $2 $3 $4
  aminosee_do  --peptide=Tryptophan $1 $2 $3 $4
  aminosee_do  --peptide=Serine $1 $2 $3 $4
  aminosee_do  --peptide=Threonine $1 $2 $3 $4
  aminosee_do  --peptide=Glutamine $1 $2 $3 $4
  aminosee_do  --peptide=Asparagine $1 $2 $3 $4
  aminosee_do  --peptide=Tyrosine $1 $2 $3 $4
  aminosee_do  --peptide=Arginine $1 $2 $3 $4
  aminosee_do  --peptide=Lysine $1 $2 $3 $4
  aminosee_do  --peptide=Histidine  $1 $2 $3 $4
	echo
}

find_way_peptides () {
  echo STARTING SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16

  if [ $(uname)="Darwin" ]; then
    echo macos
    DASHF=" -f "
  fi

  if [ $(uname)="Linux" ]; then
    echo linux
    DASHF=" "
  fi
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000                    $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --maxpix=5000000 --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;

  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
}



if [ -z "$1" ]; then
  echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]
  echo
	echo will now run aminosee batch using the files:
	echo *
	echo
	nice -n 1 aminosee   --maxpix=5000000  --index -q *
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Glutamic_acid
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Aspartic_acid
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Ochre
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Amber
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Opal
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Methionine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Cysteine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Glycine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Alanine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Valine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Leucine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Isoleucine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Phenylalanine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Proline
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Tryptophan
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Serine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Threonine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Glutamine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Asparagine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Tyrosine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Arginine
	nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Lysine
	nice -n 2 aminosee   --maxpix=5000000                    *  --peptide=Histidine
  exit
else
  series_peptides $1 $2 $3 $4
fi
