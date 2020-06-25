#!/bin/sh
echo input was: $1
echo


series_peptides () {
	echo START RENDER with four parameters:
	echo $1 $2 $3 $4
	echo
  nice -n 4 aminosee --no-keyboard -q     $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Glutamic_acid $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Aspartic_acid $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Ochre $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Amber $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Opal $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Methionine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Cysteine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Glycine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Alanine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Valine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Leucine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Isoleucine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Phenylalanine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Proline $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Tryptophan $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Serine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Threonine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Glutamine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Asparagine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Tyrosine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Arginine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Lysine $1 $2 $3 $4
  nice -n 4 aminosee --no-keyboard -q   --peptide=Histidine  $1 $2 $3 $4
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
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee                     $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;

  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7

	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --index                 $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;
}



if [ -z "$1" ]; then
  echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]
  echo
	echo will now run aminosee batch using the files:
	echo *
	echo
	nice -n 1 aminosee --no-keyboard   *
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Glutamic_acid
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Aspartic_acid
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Ochre
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Amber
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Opal
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Methionine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Cysteine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Glycine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Alanine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Valine
	nice -n 2 aminosee --no-keyboard          *  --peptide=Leucine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Isoleucine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Phenylalanine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Proline
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Tryptophan
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Serine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Threonine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Glutamine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Asparagine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Tyrosine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Arginine
	nice -n 2 aminosee --no-keyboard  --quiet *  --peptide=Lysine
	nice -n 2 aminosee                        *  --peptide=Histidine
	echo
	echo end of batch peptides - now doing "find way" brute forcing it
  # exit
	find_way_peptides
else
  series_peptides $1 $2 $3 $4
fi
