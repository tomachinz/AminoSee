#!/bin/sh
aminosee_do () {
  nice -n 1 aminosee   $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 5
  nice -n 15 aminosee --slow --quiet --no-image --no-html --index * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
}

series_peptides () {
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 START RENDER

  aminosee_do        $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --quiet  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  aminosee_do  --image  --peptide=Histidine  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12

  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 END RENDER

}

find_way_peptides () {
  echo STARTING SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11

  if [ $(uname)=Darwin ]; then
    echo macos
    DASHF=" -f "
  fi

  if [ $(uname)=Linux ]; then
    echo linux
    DASHF=" "
  fi
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index                      $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide="Start Codons" $1 $2 $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide="Stop Codons" $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 "{}" \;


  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
}

series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
sleep 6
series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
sleep 6
series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
sleep 6
find_way_peptides

#
# nice -n 1 aminosee  --maxpix=4200000 --index  *   -q --no-image  &
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamic_acid
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Aspartic_acid
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Ochre
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Amber
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Opal
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Methionine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Cysteine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glycine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Alanine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Valine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Leucine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Isoleucine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Phenylalanine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Proline
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tryptophan
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Serine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Threonine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Asparagine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tyrosine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Arginine
# nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Lysine
# nice -n 2 aminosee  --maxpix=4200000 --index                *  --peptide=Histidine
#
#
# # asterix_peptides () {
#   # echo "                                         =///"
#   # echo "-------------------------------------------"
#   # echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
#   # echo "-------------------------------------------"
#
#   nice -n 1 aminosee  --maxpix=4200000 --index  *   -q --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
#   nice -n 2 aminosee  --maxpix=4200000 --index                *  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
