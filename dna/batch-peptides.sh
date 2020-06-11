#!/bin/sh
echo input was: $1
echo
sleep 2
aminosee_do () {
	echo AminoSee batch script
	echo
	echo $1 $2 $3 $4
	echo
  nice -n 4 aminosee -q --maxpix=5000000 $1 $2 $3 $4
	echo
	echo just finished: $1 $2 $3 $4
	echo
	sleep 1
}

series_peptides () {
  echo $1 $2 $3 $4 START RENDER
	echo
  aminosee_do      $1 $2 $3 $4
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
  echo $1 $2 $3 $4  END RENDER
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
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee                     $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee --quit --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;

  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
}



if [ -z "$1" ]; then
  echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]  or *
  echo
	nice -n 1 aminosee   --maxpix=5000000  -q --no-image *
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


# THIS HELPS DUE TO * PASSING MORE THAN 9 FILES INTO THE BATCH



asterix_peptides () {
  # echo "                                         =///"
  # echo "-------------------------------------------"
  echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  # echo "-------------------------------------------"

  nice -n 1 aminosee   --maxpix=5000000  *   $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000  --no-html --quiet *  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
  nice -n 2 aminosee   --maxpix=5000000                *  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16
}
