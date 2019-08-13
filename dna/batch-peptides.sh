#!/bin/sh
aminosee_do () {
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 START RENDER
  sleep 1
  aminosee -q $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --no-image &
  sleep 1
  nice aminosee --index -c360 $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --no-image
  echo
  echo
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 FINISHED RENDER
  echo
  echo
}
best_way () {
  aminosee $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -q &
  sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --junk
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Stop Codons"
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamic_acid &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Aspartic_acid
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Ochre &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Amber &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Opal
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Methionine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Cysteine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glycine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Alanine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Valine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Leucine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Isoleucine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Phenylalanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Proline
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tryptophan &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Serine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Threonine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Asparagine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tyrosine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Arginine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Lysine &
  aminosee_do $1 $2 $3 $4 --peptide=Histidine
}
series_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING MULTI-THREAD DECODE FOR  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  echo "-------------------------------------------"
  echo "                                         =///"
  sleep 1
  aminosee    $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 1
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamic_acid
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Aspartic_acid
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Ochre
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Amber
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Opal
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Methionine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Cysteine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glycine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Alanine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Valine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Leucine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Isoleucine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Phenylalanine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Proline
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tryptophan
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Serine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Threonine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Asparagine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tyrosine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Arginine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Lysine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Histidine
  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  echo "-------------------------------------------"
  echo "                                         =///"
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee    $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 1
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamic_acid &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Aspartic_acid &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Ochre
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Amber &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Opal &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Methionine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Cysteine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glycine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Alanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Valine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Leucine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Isoleucine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Phenylalanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Proline
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tryptophan &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Serine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Threonine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Asparagine
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tyrosine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Arginine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Lysine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide=Histidine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7

  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Stop Codons"
  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  echo "-------------------------------------------"
  echo "                                         =///"
}

asterix_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee    *        $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 1
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamic_acid &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Aspartic_acid &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Ochre
  nice aminosee      * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Amber &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Opal &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Methionine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Cysteine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glycine
  nice aminosee    * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Alanine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Valine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Leucine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Isoleucine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Phenylalanine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Proline
  nice aminosee    * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tryptophan &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Serine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Threonine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Glutamine &
  nice aminosee    * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Asparagine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Tyrosine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Arginine &
  nice aminosee  -q  * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Lysine &
  nice aminosee    * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 --quiet  --peptide=Histidine

  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Stop Codons"
  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  echo "-------------------------------------------"
  echo "                                         =///"
}

find_way_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  echo "-------------------------------------------"
  echo "                                         =///"

  if [ $(uname)=Darwin ]; then
    echo macos
    DASHF=" -f "
  fi

  if [ $(uname)=Linux ]; then
    echo linux
    DASHF=" "
  fi
  find $DASHF *.fa *.mfa *.gbk *.txt -exec nice aminosee $1 $2 $3 $4 $5 $6 $7 "{}" \;



  #
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2 $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Glutamic_acid" $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Aspartic_acid" $3 $4 $5 $6 $7 "{}" \;
  # # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Start Codons" $3 $4 $5 $6 $7 "{}" \;
  # # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Stop Codons" $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Ochre $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Amber $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Cysteine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Glycine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Alanine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Methionine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Valine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Leucine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Isoleucine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Phenylalanine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Tryptophan $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Serine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Threonine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Opal $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Glutamine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Asparagine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Tyrosine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Arginine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Lysine $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Histidine $3 $4 $5 $6 $7 "{}" \;


  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
}
echo $1 $2 $3 $4 $5 $6 $7
# parallel_peptides 50KB_TestPattern.txt  megabase.fa
# series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
parallel_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
sleep 1
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
sleep 5
asterix_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12


# series_peptides * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# find_way_peptides $1 $2 $3 $4 $5 $6 $7
# parallel_peptides  --reg $1 $2 $3 $4 $5 $6 $7
# find_way_peptides  --reg
