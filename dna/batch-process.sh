
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


aminosee_do () {
    nice aminosee $2 -d $3 $4 $5 $6
}

many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee_do 1 $1 -m 1 --no-updates
  sleep 4
  aminosee_do 2 $1 -m 2 --no-updates &
  sleep 4
  aminosee_do 3 $1 -m 3  --no-updates &
  sleep 4
  aminosee_do 4 $1 -m 4 --no-updates &
  sleep 4
  aminosee_do 5 $1 -m 5 --no-updates &
  sleep 4
  aminosee_do 6 $1 -m 6 --no-updates &
  sleep 4
  aminosee_do 7 $1 -m 7 --no-updates
  sleep 4
  aminosee_do 8 $1 -m 8 --no-updates
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
aminosee_do 0 $1 $2
aminosee_do 1 $1 $2  --peptide=Ochre
aminosee_do 2 $1 $2  --peptide=Glutamic
aminosee_do 3 $1 $2  --peptide=Aspartic
aminosee_do 4 $1 $2  --peptide=Amber
aminosee_do 5 $1 $2  --peptide=Cysteine
aminosee_do 6 $1 $2  --peptide=Glycine
aminosee_do 0 $1 $2  --peptide=Alanine

aminosee_do 1 $1 $2  --peptide=Methionine
aminosee_do 2 $1 $2  --peptide=Valine
aminosee_do 3 $1 $2  --peptide=Leucine
aminosee_do 4 $1 $2  --peptide=Isoleucine
aminosee_do 5 $1 $2  --peptide=Phenylalanine
aminosee_do 6 $1 $2  --peptide=Tryptophan
aminosee_do 7 $1 $2  --peptide=Serine
aminosee_do 0 $1 $2  --peptide=Threonine

aminosee_do 1 $1 $2  --peptide=Opal
aminosee_do 2 $1 $2  --peptide=Glutamine
aminosee_do 3 $1 $2  --peptide=Asparagine
aminosee_do 0 $1 $2  --peptide=Tyrosine
aminosee_do 5 $1 $2  --peptide=Arginine
aminosee_do 6 $1 $2  --peptide=Lysine
aminosee_do 0 $1 $2  --peptide=Histidine

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

# aminosee * -d &
#
#
# parallel_peptides megabase.fa
# parallel_peptides streptococcus_virus_2972_uid15254-NC_007019.gbk
# parallel_peptides streptococcus_phage_5093_uid38299-NC_012753.gbk
# parallel_peptides "Octopus_bimaculoides_37653_chrUn.fa"
# parallel_peptides "chrY Pan troglodytes C0471 Clint.gbk"
# parallel_peptides "homo-sapien-hs_ref_GRCh38.p12_chr2.fa"
# parallel_peptides Gorilla-C2AB-9595_ref_gorGor4_chr2B.mfa
# parallel_peptides Gorilla-C2AB-9595_ref_gorGor4_chr2A.gbk
# parallel_peptides Gorilla-C2AB-9595_ref_gorGor4_chr2A.fa
# parallel_peptides Brown-Kiwi-aptMan1.fa
# parallel_peptides "Cannabis sativa subsp. indica cultivar LA Confidential.fa"
# parallel_peptides "Eucalyptus grandis cultivar BRASUZ1.gbk"

# many_size_hilbert Brown-Kiwi-aptMan1.fa 10
# many_size_hilbert homo-sapien-hs_ref_GRCh38.p12_chr2.fa 10

if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec parallel_peptides 5 {}   \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec parallel_peptides 5{}    \;
fi

# many_size_hilbert megabase.fa 1
# many_size_hilbert Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 2

aminosee * -f -d -m 8
aminosee * -f -d --ratio=golden
aminosee --test -r

many_size_hilbert megabase.fa
many_size_hilbert "chrY Pan troglodytes C0471 Clint.gbk"
