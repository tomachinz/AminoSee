#!/bin/sh
aminosee_do () {
  echo $1 $2 $3 $4 $5 $6 $7  --no-image --no-html --no-explorer
  nice aminosee --quiet --no-image --no-html -c200 --recycle  $1 $2 $3 $4 $5 $6 $7 &
  sleep 1
  nice aminosee  $1 $2 $3 $4 $5 $6 $7  --quiet  --no-image --no-html --no-explorer
}
best_way () {
  nice aminosee $1 $2 $3 $4 $5 $6 $7
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Stop Codons"
  aminosee $1    $2 $3 $4  --peptide=Glutamic_acid &
  aminosee $1    $2 $3 $4  --peptide=Aspartic_acid
  aminosee_do $1 $2 $3 $4  --peptide=Ochre &
  aminosee_do $1 $2 $3 $4  --peptide=Amber &
  aminosee_do $1 $2 $3 $4  --peptide=Opal
  aminosee_do $1 $2 $3 $4  --peptide=Methionine &
  aminosee_do $1 $2 $3 $4  --peptide=Cysteine &
  aminosee_do $1 $2 $3 $4  --peptide=Glycine &
  aminosee_do $1 $2 $3 $4  --peptide=Alanine
  aminosee_do $1 $2 $3 $4  --peptide=Valine &
  aminosee_do $1 $2 $3 $4  --peptide=Leucine &
  aminosee_do $1 $2 $3 $4  --peptide=Isoleucine &
  aminosee_do $1 $2 $3 $4  --peptide=Phenylalanine &
  aminosee_do $1 $2 $3 $4  --peptide=Proline
  aminosee_do $1 $2 $3 $4  --peptide=Tryptophan &
  aminosee_do $1 $2 $3 $4  --peptide=Serine &
  aminosee_do $1 $2 $3 $4  --peptide=Threonine &
  aminosee_do $1 $2 $3 $4  --peptide=Glutamine &
  aminosee_do $1 $2 $3 $4  --peptide=Asparagine &
  aminosee_do $1 $2 $3 $4  --peptide=Tyrosine
  aminosee_do $1 $2 $3 $4  --peptide=Arginine &
  aminosee_do $1 $2 $3 $4  --peptide=Lysine &
  nice aminosee $1 $2 $3 $4 --peptide=Histidine
}
series_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee_do $1 $2 $3 $4 $5 $6 $7
  aminosee_do $1 $2 $3 $4  --peptide=Glutamic_acid
  aminosee_do $1 $2 $3 $4  --peptide=Aspartic_acid
  aminosee_do $1 $2 $3 $4  --peptide=Ochre
  aminosee_do $1 $2 $3 $4  --peptide=Amber
  aminosee_do $1 $2 $3 $4  --peptide=Opal
  aminosee_do $1 $2 $3 $4  --peptide=Methionine
  aminosee_do $1 $2 $3 $4  --peptide=Cysteine
  aminosee_do $1 $2 $3 $4  --peptide=Glycine
  aminosee_do $1 $2 $3 $4  --peptide=Alanine
  aminosee_do $1 $2 $3 $4  --peptide=Valine
  aminosee_do $1 $2 $3 $4  --peptide=Leucine
  aminosee_do $1 $2 $3 $4  --peptide=Isoleucine
  aminosee_do $1 $2 $3 $4  --peptide=Phenylalanine
  aminosee_do $1 $2 $3 $4  --peptide=Proline
  aminosee_do $1 $2 $3 $4  --peptide=Tryptophan
  aminosee_do $1 $2 $3 $4  --peptide=Serine
  aminosee_do $1 $2 $3 $4  --peptide=Threonine
  aminosee_do $1 $2 $3 $4  --peptide=Glutamine
  aminosee_do $1 $2 $3 $4  --peptide=Asparagine
  aminosee_do $1 $2 $3 $4  --peptide=Tyrosine
  aminosee_do $1 $2 $3 $4  --peptide=Arginine
  aminosee_do $1 $2 $3 $4  --peptide=Lysine
  aminosee_do $1 $2 $3 $4  --peptide=Histidine
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
  aminosee_do $1 $2 $3 $4  --peptide="Glutamic_acid" &
  aminosee_do $1 $2 $3 $4  --peptide="Aspartic_acid" &
  aminosee_do $1 $2 $3 $4  --peptide=Ochre
  aminosee_do $1 $2 $3 $4  --peptide=Amber &
  aminosee_do $1 $2 $3 $4  --peptide=Opal &
  aminosee_do $1 $2 $3 $4  --peptide=Methionine &
  aminosee_do $1 $2 $3 $4  --peptide=Cysteine &
  aminosee_do $1 $2 $3 $4  --peptide=Glycine
  aminosee_do $1 $2 $3 $4  --peptide=Alanine &
  aminosee_do $1 $2 $3 $4  --peptide=Valine &
  aminosee_do $1 $2 $3 $4  --peptide=Leucine &
  aminosee_do $1 $2 $3 $4  --peptide=Isoleucine &
  aminosee_do $1 $2 $3 $4  --peptide=Phenylalanine &
  aminosee_do $1 $2 $3 $4  --peptide=Proline
  aminosee_do $1 $2 $3 $4  --peptide=Tryptophan &
  aminosee_do $1 $2 $3 $4  --peptide=Serine &
  aminosee_do $1 $2 $3 $4  --peptide=Threonine &
  aminosee_do $1 $2 $3 $4  --peptide=Glutamine &
  aminosee_do $1 $2 $3 $4  --peptide=Asparagine &
  aminosee_do $1 $2 $3 $4  --peptide=Tyrosine &
  aminosee_do $1 $2 $3 $4  --peptide=Arginine &
  aminosee_do $1 $2 $3 $4  --peptide=Lysine &
  nice aminosee $1 $2 $3 $4 $5 $6 $7  --peptide=Histidine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7

  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Stop Codons"
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
  nice aminosee -q  * $1 $2 $3 $4  --peptide=Glutamic_acid &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Aspartic_acid &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Ochre
aminosee_do -q  * $1 $2 $3 $4  --peptide=Amber &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Opal &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Methionine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Cysteine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Glycine
aminosee_do -q  * $1 $2 $3 $4  --peptide=Alanine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Valine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Leucine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Isoleucine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Phenylalanine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Proline
aminosee_do -q  * $1 $2 $3 $4  --peptide=Tryptophan &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Serine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Threonine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Glutamine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Asparagine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Tyrosine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Arginine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Lysine &
aminosee_do -q  * $1 $2 $3 $4  --peptide=Histidine &
aminosee_do -q  * $1 $2 $3 $4 $5 $6 $7

  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Stop Codons"
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

parallel_peptides $1 $2 $3 $4 $5 $6 $7
sleep 1
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
echo WILL NOW RENDER ALL IN FOLDER
sleep 5
asterix_peptides $1 $2 $3 $4 $5 $6 $7

# series_peptides $1 $2 $3 $4 $5 $6 $7 --keyboard
# series_peptides * $1 $2 $3 $4 $5 $6 $7 --keyboard
# find_way_peptides $1 $2 $3 $4 $5 $6 $7
# parallel_peptides  --reg $1 $2 $3 $4 $5 $6 $7
# find_way_peptides  --reg
