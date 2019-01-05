aminosee_do () {
    nice aminosee $1 $2 $3 $4 $5 $6
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee_do $1 $2 $3
  aminosee_do $1 $2 $3   --peptide=Ochre &
  aminosee_do $1 $2 $3   --peptide=Glutamic
  aminosee_do $1 $2 $3   --peptide=Aspartic &
  aminosee_do $1 $2 $3   --peptide=Amber
  aminosee_do $1 $2 $3   --peptide=Cysteine &
  aminosee_do $1 $2 $3   --peptide=Glycine
  aminosee_do $1 $2 $3   --peptide=Alanine &
  aminosee_do $1 $2 $3   --peptide=Methionine
  aminosee_do $1 $2 $3   --peptide=Valine &
  aminosee_do $1 $2 $3   --peptide=Leucine
  aminosee_do $1 $2 $3   --peptide=Isoleucine &
  aminosee_do $1 $2 $3   --peptide=Phenylalanine
  aminosee_do $1 $2 $3   --peptide=Tryptophan &
  aminosee_do $1 $2 $3   --peptide=Serine
  aminosee_do $1 $2 $3   --peptide=Threonine &
  aminosee_do $1 $2 $3   --peptide=Opal
  aminosee_do $1 $2 $3   --peptide=Glutamine &
  aminosee_do $1 $2 $3   --peptide=Asparagine
  aminosee_do $1 $2 $3   --peptide=Tyrosine &
  aminosee_do $1 $2 $3   --peptide=Arginine
  aminosee_do $1 $2 $3   --peptide=Lysine &
  aminosee_do $1 $2 $3   --peptide=Histidine
  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
}
find_way_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"

  if [ $(uname)=Darwin ]; then
    echo macos
    DASHF=" -f"
  fi

  if [ $(uname)=Linux ]; then
    echo linux
    DASHF=" "
  fi

  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2  $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Ochre $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Glutamic $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Aspartic $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Amber $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Cysteine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Glycine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Alanine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Methionine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Valine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Leucine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Isoleucine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Phenylalanine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Tryptophan $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Serine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Threonine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Opal $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Glutamine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Asparagine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Tyrosine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Arginine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Lysine $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Histidine $3 $4 $5 $6  \;
  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}
parallel_peptides $1 $2 $3 $4 $5 $6
parallel_peptides $1 $2 $3 $4 $5 $6 --reg
find_way_peptides
find_way_peptides --reg
