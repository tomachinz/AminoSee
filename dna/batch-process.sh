
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

aminosee_do () {
    nice aminosee $1 $2 $3 $4 $5 $6
}

many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee_do $1 -m 1 --no-updates $2 $3
  # sleep 4
  aminosee_do $1 -m 2 --no-updates $2 $3 &
  # sleep 4
  aminosee_do $1 -m 3  --no-updates $2 $3 &
  # sleep 4
  aminosee_do $1 -m 4 --no-updates $2 $3 &
  # sleep 4
  aminosee_do $1 -m 5 --no-updates $2 $3 &
  # sleep 4
  aminosee_do $1 -m 6 --no-updates $2 $3 &
  # sleep 4
  aminosee_do $1 -m 7 --no-updates $2 $3
  # sleep 4
  aminosee_do $1 -m 8 --no-updates $2 $3
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee_do $1 $2 $3
  aminosee_do $1 $2 $3   --peptide=Ochre
  aminosee_do $1 $2 $3   --peptide=Glutamic
  aminosee_do $1 $2 $3   --peptide=Aspartic
  aminosee_do $1 $2 $3   --peptide=Amber
  aminosee_do $1 $2 $3   --peptide=Cysteine
  aminosee_do $1 $2 $3   --peptide=Glycine
  aminosee_do $1 $2 $3   --peptide=Alanine
  aminosee_do $1 $2 $3   --peptide=Methionine
  aminosee_do $1 $2 $3   --peptide=Valine
  aminosee_do $1 $2 $3   --peptide=Leucine
  aminosee_do $1 $2 $3   --peptide=Isoleucine
  aminosee_do $1 $2 $3   --peptide=Phenylalanine
  aminosee_do $1 $2 $3   --peptide=Tryptophan
  aminosee_do $1 $2 $3   --peptide=Serine
  aminosee_do $1 $2 $3   --peptide=Threonine
  aminosee_do $1 $2 $3   --peptide=Opal
  aminosee_do $1 $2 $3   --peptide=Glutamine
  aminosee_do $1 $2 $3   --peptide=Asparagine
  aminosee_do $1 $2 $3   --peptide=Tyrosine
  aminosee_do $1 $2 $3   --peptide=Arginine
  aminosee_do $1 $2 $3   --peptide=Lysine
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
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2  $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Ochre $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Glutamic $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Aspartic $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Amber $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Cysteine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Glycine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Alanine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Methionine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Valine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Leucine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Isoleucine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Phenylalanine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Tryptophan $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Serine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Threonine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Opal $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Glutamine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Asparagine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Tyrosine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Arginine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Lysine $3 $4 $5 $6  \;
  find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {} $1 $2   --peptide=Histidine $3 $4 $5 $6  \;
  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

parallel_peptides megabase.fa -f
parallel_peptides $1 $2 $3 $4 $5 $6

aminosee_do * --reg
many_size_hilbert megabase.fa
many_size_hilbert $1 $2 $3 $4 $5 $6
find_way_peptides $1 $2 $3 $4 $5 $6

parallel_peptides streptococcus_virus_2972_uid15254-NC_007019.gbk
parallel_peptides streptococcus_phage_5093_uid38299-NC_012753.gbk
parallel_peptides "Octopus_bimaculoides_37653_chrUn.fa"
parallel_peptides "chrY Pan troglodytes C0471 Clint.gbk"
parallel_peptides "homo-sapien-hs_ref_GRCh38.p12_chr2.fa"
parallel_peptides Gorilla-C2AB-9595_ref_gorGor4_chr2B.mfa
parallel_peptides Gorilla-C2AB-9595_ref_gorGor4_chr2A.gbk
parallel_peptides Gorilla-C2AB-9595_ref_gorGor4_chr2A.fa
parallel_peptides Brown-Kiwi-aptMan1.fa
parallel_peptides "Cannabis sativa subsp. indica cultivar LA Confidential.fa"
parallel_peptides "Eucalyptus grandis cultivar BRASUZ1.gbk"

many_size_hilbert Brown-Kiwi-aptMan1.fa 10
# many_size_hilbert homo-sapien-hs_ref_GRCh38.p12_chr2.fa 10
  # find -f *.fa *.mfa *.gbk *.txt | xargs -0 | aminosee -d

# if [ $(uname)=Darwin ]; then
#   echo macos
#   # find -f *.fa *.mfa *.gbk *.txt
#   # sleep 2
#   # find -f *.fa *.mfa *.gbk *.txt -exec parallel_peptides {}   \;
#   find -f *.fa *.mfa *.gbk *.txt -exec  parallel_peptides {}  $1 -f -d $2  $3 $4 $5 $6  \;
#   find -f *.fa *.mfa *.gbk *.txt -exec  aminosee {}           $1 -f -d $2  $3 $4 $5 $6  \;
# fi
#
# if [ $(uname)=Linux ]; then
#   echo linux
#   find *.fa *.mfa *.gbk *.txt
#   sleep 2
#   find *.fa *.mfa *.gbk *.txt -exec parallel_peptides {} $1 -f -d $2 $3 $4 $5 $6    \;
#   find *.fa *.mfa *.gbk *.txt -exec aminosee {}          $1 -f -d $2 $3 $4 $5 $6    \;
# fi

# many_size_hilbert megabase.fa 1
# many_size_hilbert Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 2

aminosee * -f -d -m 8
aminosee * -f -d --ratio=golden
aminosee * -f -d --ratio=fix
aminosee --test -r

many_size_hilbert megabase.fa
many_size_hilbert "chrY Pan troglodytes C0471 Clint.gbk"
