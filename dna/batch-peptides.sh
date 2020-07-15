#!/bin/sh
echo input was: $1
echo


series_peptides () {
	echo START RENDER with ten parameters:
	echo $*
	echo
  nice -n 1 aminosee      $*
  nice -n 4 aminosee -q   --peptide=Glutamic_acid $*
  nice -n 4 aminosee -q   --peptide=Aspartic_acid $*
  nice -n 4 aminosee -q   --peptide=Ochre $*
  nice -n 4 aminosee -q   --peptide=Amber $*
  nice -n 4 aminosee -q   --peptide=Opal $*
  nice -n 4 aminosee -q   --peptide=Methionine $*
  nice -n 4 aminosee -q   --peptide=Cysteine $*
  nice -n 4 aminosee -q   --peptide=Glycine $*
  nice -n 4 aminosee -q   --peptide=Alanine $*
  nice -n 4 aminosee -q   --peptide=Valine $*
  nice -n 4 aminosee -q   --peptide=Leucine $*
  nice -n 4 aminosee -q   --peptide=Isoleucine $* 
  nice -n 4 aminosee -q   --peptide=Phenylalanine $*
  nice -n 4 aminosee -q   --peptide=Proline $*
  nice -n 4 aminosee -q   --peptide=Tryptophan $*
  nice -n 4 aminosee -q   --peptide=Serine $*
  nice -n 4 aminosee -q   --peptide=Threonine $*
  nice -n 4 aminosee -q   --peptide=Glutamine $*
  nice -n 4 aminosee -q   --peptide=Asparagine $*
  nice -n 4 aminosee -q   --peptide=Tyrosine $*
  nice -n 4 aminosee -q   --peptide=Arginine $*
  nice -n 4 aminosee -q   --peptide=Lysine $*
  nice -n 4 aminosee      --peptide=Histidine  $*
	echo
	echo done
	sleep 1


	echo START RENDER with ten parameters:
	echo $*
	echo
  nice -n 1 aminosee -m5 --index    $*
  nice -n 4 aminosee -m5     --peptide=Glutamic_acid $*
  nice -n 4 aminosee -m5     --peptide=Aspartic_acid $*
  nice -n 4 aminosee -m5     --peptide=Ochre $*
  nice -n 4 aminosee -m5     --peptide=Amber $*
  nice -n 4 aminosee -m5     --peptide=Opal $*
  nice -n 4 aminosee -m5     --peptide=Methionine $*
  nice -n 4 aminosee -m5     --peptide=Cysteine $*
  nice -n 4 aminosee -m5     --peptide=Glycine $*
  nice -n 4 aminosee -m5     --peptide=Alanine $*
  nice -n 4 aminosee -m5     --peptide=Valine $*
  nice -n 4 aminosee -m5     --peptide=Leucine $*
  nice -n 4 aminosee -m5     --peptide=Isoleucine $*
  nice -n 4 aminosee -m5     --peptide=Phenylalanine $*
  nice -n 4 aminosee -m5     --peptide=Proline $*
  nice -n 4 aminosee -m5     --peptide=Tryptophan $*
  nice -n 4 aminosee -m5     --peptide=Serine $*
  nice -n 4 aminosee -m5     --peptide=Threonine $*
  nice -n 4 aminosee -m5     --peptide=Glutamine $*
  nice -n 4 aminosee -m5     --peptide=Asparagine $*
  nice -n 4 aminosee -m5     --peptide=Tyrosine $*
  nice -n 4 aminosee -m5     --peptide=Arginine $*
  nice -n 4 aminosee -m5     --peptide=Lysine $*
  nice -n 4 aminosee -m5       --peptide=Histidine  $*
	echo
	echo done
	sleep 1

}

find_way_peptides () {

	echo
	nice -n 1 aminosee  *
	nice -n 2 aminosee --quiet *  --peptide=Glutamic_acid
	nice -n 2 aminosee --quiet *  --peptide=Aspartic_acid
	nice -n 2 aminosee --quiet *  --peptide=Ochre
	nice -n 2 aminosee --quiet *  --peptide=Amber
	nice -n 2 aminosee --quiet *  --peptide=Opal
	nice -n 2 aminosee --quiet *  --peptide=Methionine
	nice -n 2 aminosee --quiet *  --peptide=Cysteine
	nice -n 2 aminosee --quiet *  --peptide=Glycine
	nice -n 2 aminosee --quiet *  --peptide=Alanine
	nice -n 2 aminosee --quiet *  --peptide=Valine
	nice -n 2 aminosee         *  --peptide=Leucine
	nice -n 2 aminosee --quiet *  --peptide=Isoleucine
	nice -n 2 aminosee --quiet *  --peptide=Phenylalanine
	nice -n 2 aminosee --quiet *  --peptide=Proline
	nice -n 2 aminosee --quiet *  --peptide=Tryptophan
	nice -n 2 aminosee --quiet *  --peptide=Serine
	nice -n 2 aminosee --quiet *  --peptide=Threonine
	nice -n 2 aminosee --quiet *  --peptide=Glutamine
	nice -n 2 aminosee --quiet *  --peptide=Asparagine
	nice -n 2 aminosee --quiet *  --peptide=Tyrosine
	nice -n 2 aminosee --quiet *  --peptide=Arginine
	nice -n 2 aminosee --quiet *  --peptide=Lysine
	nice -n 2 aminosee         *  --peptide=Histidine
	echo
	echo end of batch peptides

		echo
		nice -n 1  aminosee --index -m5  *
		nice -n 2  aminosee -m5 --quiet *  --peptide=Glutamic_acid
		nice -n 2  aminosee -m5 --quiet *  --peptide=Aspartic_acid
		nice -n 2  aminosee -m5 --quiet *  --peptide=Ochre
		nice -n 2  aminosee -m5 --quiet *  --peptide=Amber
		nice -n 2  aminosee -m5 --quiet *  --peptide=Opal
		nice -n 2  aminosee -m5 --quiet *  --peptide=Methionine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Cysteine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Glycine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Alanine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Valine
		nice -n 2  aminosee --index -m5         *  --peptide=Leucine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Isoleucine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Phenylalanine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Proline
		nice -n 2  aminosee -m5 --quiet *  --peptide=Tryptophan
		nice -n 2  aminosee -m5 --quiet *  --peptide=Serine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Threonine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Glutamine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Asparagine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Tyrosine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Arginine
		nice -n 2  aminosee -m5 --quiet *  --peptide=Lysine
		nice -n 2  aminosee -m5         *  --peptide=Histidine
		echo
		echo end of batch peptides




  echo STARTING SERIAL DECODE FOR $*  $11 $12 $13 $14 $15 $16
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

	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --index                 $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
	find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -m5 --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;
}



if [ -z "$1" ]; then
  echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]
  echo
	echo will now run aminosee batch using the files:
	echo *
	echo ow doing "find way" brute forcing it
  # exit
	find_way_peptides
else
  series_peptides $*
fi
