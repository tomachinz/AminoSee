#!/bin/sh
echo script input was: $*
echo
aminosee_do () {
  nice aminosee --quiet --ratio=sqr --reg $*  &
  sleep 3
}



size_hilbert () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $*
  echo "-------------------------------------------"
  echo "                                         =///"

	aminosee_do   -m9  $*
	aminosee_do   -m8  $*
  aminosee_do   -m7  $*
  aminosee_do   -m6  $*
  aminosee_do   -m5  $*
}

many_size_hilbert () {
	echo START RENDER with
	echo $*
	echo
  size_hilbert   $*
  size_hilbert  --peptide=Glutamic_acid $*
  size_hilbert  --peptide=Aspartic_acid $*
  size_hilbert  --peptide=Ochre $*
  size_hilbert  --peptide=Amber $*
  size_hilbert  --peptide=Opal $*
  size_hilbert  --peptide=Methionine $*
  size_hilbert  --peptide=Cysteine $*
  size_hilbert  --peptide=Glycine $*
  size_hilbert  --peptide=Alanine $*
  size_hilbert  --peptide=Valine $*
  size_hilbert  --peptide=Leucine $*
  size_hilbert  --peptide=Isoleucine $*
  size_hilbert  --peptide=Phenylalanine $*
  size_hilbert  --peptide=Proline $*
  size_hilbert  --peptide=Tryptophan $*
  size_hilbert  --peptide=Serine $*
  size_hilbert  --peptide=Threonine $*
  size_hilbert  --peptide=Glutamine $*
  size_hilbert  --peptide=Asparagine $*
  size_hilbert  --peptide=Tyrosine $*
  size_hilbert  --peptide=Arginine $*
  size_hilbert  --peptide=Lysine $*
  size_hilbert  --peptide=Histidine  $*
	echo
	echo done
	sleep 1
}


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
	nice -n 1 aminosee  *
	nice -n 2 aminosee  *  --peptide=Glutamic_acid
	nice -n 2 aminosee  *  --peptide=Aspartic_acid
	nice -n 2 aminosee  *  --peptide=Ochre
	nice -n 2 aminosee  *  --peptide=Amber
	nice -n 2 aminosee  *  --peptide=Opal
	nice -n 2 aminosee  *  --peptide=Methionine
	nice -n 2 aminosee  *  --peptide=Cysteine
	nice -n 2 aminosee  *  --peptide=Glycine
	nice -n 2 aminosee  *  --peptide=Alanine
	nice -n 2 aminosee  *  --peptide=Valine
	nice -n 2 aminosee  *  --peptide=Leucine
	nice -n 2 aminosee  *  --peptide=Isoleucine
	nice -n 2 aminosee  *  --peptide=Phenylalanine
	nice -n 2 aminosee  *  --peptide=Proline
	nice -n 2 aminosee  *  --peptide=Tryptophan
	nice -n 2 aminosee  *  --peptide=Serine
	nice -n 2 aminosee  *  --peptide=Threonine
	nice -n 2 aminosee  *  --peptide=Glutamine
	nice -n 2 aminosee  *  --peptide=Asparagine
	nice -n 2 aminosee  *  --peptide=Tyrosine
	nice -n 2 aminosee  *  --peptide=Arginine
	nice -n 2 aminosee  *  --peptide=Lysine
	nice -n 2 aminosee  *  --peptide=Histidine
	echo
	echo end of batch peptides
}



if [ -z "$1" ]; then
  echo usage: ./batch-peptides.sh [ASCII-DNA-File.txt]
  echo
	echo will now run aminosee batch using the files:
	echo *
	echo ow doing "find way" brute forcing it
  exit
	find_way_peptides
else
	many_size_hilbert $*
fi
