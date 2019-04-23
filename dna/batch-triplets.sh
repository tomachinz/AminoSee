#!/bin/sh
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
  aminosee_do $1 $2 $3   --triplet=AAA &
  aminosee_do $1 $2 $3   --triplet=TTT &
  aminosee_do $1 $2 $3   --triplet=GGG &
  aminosee_do $1 $2 $3   --triplet=CCC &
  aminosee_do $1 $2 $3   --triplet=CAT &
  aminosee_do $1 $2 $3   --triplet=TAG &
  aminosee_do $1 $2 $3   --triplet=TAC &
  aminosee_do $1 $2 $3   --triplet=CAC &
  aminosee_do $1 $2 $3   --triplet=TAT &


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
parallel_peptides $1 $2 $3 $4 $5 $6 --reg --fix
# find_way_peptides
# find_way_peptides --reg
