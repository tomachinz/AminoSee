#!/bin/sh
aminosee_do () {
  nice -n 1 aminosee   $1 $2 $3 $4 $5 $6 $7 $8 $9
  # sleep 5
#  nice -n 15 aminosee --slow --quiet --no-image --no-html --index * $1 $2 $3 $4 $5 $6 $7 $8 $9
}

series_peptides () {
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 START RENDER

  aminosee_do        $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --quiet  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9
  aminosee_do  --image  --peptide=Histidine  $1 $2 $3 $4 $5 $6 $7 $8 $9

  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 END RENDER

}

find_way_peptides () {
  echo STARTING SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9

  if [ $(uname)=Darwin ]; then
    echo macos
    DASHF=" -f "
  fi

  if [ $(uname)=Linux ]; then
    echo linux
    DASHF=" "
  fi
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index                      $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide="Start Codons" $1 $2 $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide="Stop Codons" $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -q  --index  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;


  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
}

series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9
find_way_peptides &
asterix_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9
#
# sleep 3
# series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9
# sleep 3
# series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9
# sleep 3
# series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9
# sleep 3
# sleep 3
# sleep 60
# series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9
# sleep 3

#
# nice -n 1 aminosee --index  *   -q --no-image  &
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Glutamic_acid
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Aspartic_acid
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Ochre
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Amber
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Opal
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Methionine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Cysteine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Glycine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Alanine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Valine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Leucine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Isoleucine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Phenylalanine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Proline
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Tryptophan
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Serine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Threonine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Glutamine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Asparagine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Tyrosine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Arginine
# nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Lysine
# nice -n 2 aminosee --index                *  --peptide=Histidine
#

asterix_peptides () {
  # echo "                                         =///"
  # echo "-------------------------------------------"
  echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  # echo "-------------------------------------------"

  nice -n 1 aminosee --index  *   -q --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 &
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index  --no-html --quiet *  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9
  nice -n 2 aminosee --index                *  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 $8 $9
}
