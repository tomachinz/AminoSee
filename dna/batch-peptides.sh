#!/bin/sh
aminosee_do () {
  echo $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  nice aminosee  $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  sleep 2
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING TWIN THREAD DECODE FOR $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee_do $1 $2 $3 $4 $5 $6 $7
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Start Codons" &
  # aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Stop Codons"
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Glutamic acid" &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Aspartic acid"
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Ochre &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Amber
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Opal &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Methionine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Cysteine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Glycine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Alanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Valine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Leucine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Isoleucine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Phenylalanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Proline
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Tryptophan &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Serine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Threonine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Glutamine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Asparagine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Tyrosine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Arginine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Lysine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Histidine &

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

  aminosee_do $1 $2 $3 $4 $5 $6 $7
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Start Codons" &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Stop Codons"
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Glutamic acid" &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide="Aspartic acid"
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Ochre &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Amber
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Opal &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Methionine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Cysteine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Glycine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Alanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Valine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Leucine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Isoleucine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Phenylalanine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Proline
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Tryptophan &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Serine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Threonine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Glutamine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Asparagine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Tyrosine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Arginine &
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Lysine
  aminosee_do $1 $2 $3 $4 $5 $6 $7  --peptide=Histidine &

  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Glutamic acid" $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Aspartic acid" $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Start Codons" $3 $4 $5 $6 $7 "{}" \;
  # find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide="Stop Codons" $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Ochre $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Amber $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Cysteine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Glycine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Alanine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Methionine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Valine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Leucine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Isoleucine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Phenylalanine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Tryptophan $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Serine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Threonine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Opal $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Glutamine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Asparagine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Tyrosine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Arginine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Lysine $3 $4 $5 $6 $7 "{}" \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee $1 $2   --peptide=Histidine $3 $4 $5 $6 $7 "{}" \;


  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED SERIAL DECODE FOR $1 $2 $3 $4 $5 $6 $7
  echo "-------------------------------------------"
  echo "                                         =///"
}
find_way_peptides $1 $2 $3 $4 $5 $6 $7
parallel_peptides $1 $2 $3 $4 $5 $6 $7
# parallel_peptides  --reg $1 $2 $3 $4 $5 $6 $7
# find_way_peptides  --reg
