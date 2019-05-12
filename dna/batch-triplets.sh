#!/bin/sh
aminosee_do () {
    nice aminosee $1 $2 $3 $4 $5 $6
    sleep 1
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
  aminosee_do $1 $2 $3   --triplet=CCC
  aminosee_do $1 $2 $3   --triplet=CAT &
  aminosee_do $1 $2 $3   --triplet=TAG &
  aminosee_do $1 $2 $3   --triplet=TAC &
  aminosee_do $1 $2 $3   --triplet=CAC &
  aminosee_do $1 $2 $3   --triplet=TAT


  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
}
find_way_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING SERIAL DECODE FOR $1 $2 $3
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
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=ACG $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=CGT $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=GTA $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=TAC $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=AGT $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=CTA $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=GAC $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=TCG $3 $4 $5 $6  \;
  find $DASHF *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --triplet=GTT $3 $4 $5 $6  \;

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED SERIAL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}
find_way_peptides
# find_way_peptides --reg
parallel_peptides $1 $2 $3 $4 $5 $6
# parallel_peptides $1 $2 $3 $4 $5 $6 --reg
