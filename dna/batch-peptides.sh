#!/bin/sh
aminosee_do () {
  # echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 START RENDER
  nice -n 1  aminosee -q --no-image --no-html $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 1
  nice -n 10 aminosee --quiet --index -m5 --ratio=sqr --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  # echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 FINISHED RENDER
}

parallel_peptides () {
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  # echo "-------------------------------------------"
  # echo "                                         =///"
  aminosee_do       $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
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
  aminosee_do           --peptide=Histidine  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12

  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Stop Codons"
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo FINISHED TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  # echo "-------------------------------------------"
  # echo "                                         =///"
}

asterix_peptides () {
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  # echo "-------------------------------------------"
  # echo "                                         =///"
  nice -n 1 aminosee  *  --slow -q --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 1
  nice -n 2 aminosee --slow --quiet *  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee --slow --quiet *  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee                *  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12

  nice -n 1 aminosee  *  --slow -q --ratio=sqr --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  sleep 1
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee --slow --quiet --ratio=sqr  *  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 3 aminosee              --ratio=sqr    *  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12


  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Stop Codons"
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo FINISHED TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  # echo "-------------------------------------------"
  # echo "                                         =///"
}

find_way_peptides () {
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo STARTING SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  # echo "-------------------------------------------"
  # echo "                                         =///"

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
echo  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# parallel_peptides 50KB_TestPattern.txt  megabase.fa
# series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
parallel_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
sleep 10
parallel_peptides --quiet --slow $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
sleep 2
echo DONE

# echo WILL NOW RENDER ALL IN FOLDER
# echo WILL NOW RENDER ALL IN FOLDER
# sleep 10
asterix_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12



# sleep 10
# series_peptides * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# find_way_peptides $1 $2 $3 $4 $5 $6 $7
# parallel_peptides  --reg $1 $2 $3 $4 $5 $6 $7
# find_way_peptides  --reg
