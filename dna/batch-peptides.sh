#!/bin/sh
aminosee_do () {
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 START RENDER
  aminosee * -qd --index --maxpix=4200000 --ratio=sqr  $1 $2 $3 $4 $5
  nice aminosee --quiet --index --maxpix=4200000 --ratio=sqr --no-image --no-html  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice aminosee -qd --index --maxpix=4200000 --ratio=sqr * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 START RENDER

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

nice -n 1 aminosee  --maxpix=4200000 --index  *   -q --no-image  &
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamic_acid
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Aspartic_acid
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Ochre
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Amber
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Opal
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Methionine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Cysteine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glycine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Alanine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Valine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Leucine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Isoleucine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Phenylalanine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Proline
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tryptophan
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Serine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Threonine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Asparagine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tyrosine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Arginine
nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Lysine
nice -n 2 aminosee  --maxpix=4200000 --index                *  --peptide=Histidine


# asterix_peptides () {
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo STARTING MULTI-THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7
  # echo "-------------------------------------------"

  nice -n 1 aminosee  --maxpix=4200000 --index  *   -q --no-image $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Aspartic_acid $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Ochre $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Amber $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Opal $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Methionine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Cysteine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glycine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Alanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Valine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Leucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Isoleucine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Phenylalanine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Proline $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tryptophan $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Serine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Threonine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Glutamine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Asparagine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Tyrosine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Arginine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index  --no-html --quiet *  --peptide=Lysine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
  nice -n 2 aminosee  --maxpix=4200000 --index                *  --peptide=Histidine $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12


  # sleep 1
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Start Codons"
  # aminosee_do $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 -peptide="Stop Codons"
  # echo "                                         =///"
  # echo "-------------------------------------------"
  # echo FINISHED TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  # echo "-------------------------------------------"
  # echo "                                         =///"
# }
#
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
  find $DASHF *.fa *.mfa *.gbk *.txt -exec nice aminosee -qd --index --maxpix=4200000 --ratio=sqr $1 $2 $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Glutamic_acid $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Aspartic_acid $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide="Start Codons" $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide="Stop Codons" $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Ochre $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Amber $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Cysteine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Glycine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Alanine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Methionine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Valine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Leucine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Isoleucine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Phenylalanine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Tryptophan $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Serine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Threonine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Opal $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Glutamine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Asparagine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Tyrosine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Arginine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Lysine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee -qd --index --maxpix=4200000 --ratio=sqr --peptide=Histidine $3 $4 $5 $6 $7 "{}" \;


  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
}
# echo  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# # parallel_peptides 50KB_TestPattern.txt  megabase.fa
# # series_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# # asterix_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
# # sleep 10
# # asterix_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 &
# # sleep 10
# # parallel_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# echo DONE

# echo WILL NOW RENDER ALL IN FOLDER
# echo WILL NOW RENDER ALL IN FOLDER
# sleep 10
# asterix_peptides $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12



# sleep 10
# series_peptides * $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12
# find_way_peptides $1 $2 $3 $4 $5 $6 $7
# parallel_peptides  --reg $1 $2 $3 $4 $5 $6 $7
find_way_peptides
