
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

parallel_file () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
  aminosee $1  -m 1  -v -d
  aminosee $1  -m 1  -v -d  --peptide=Ochre &
  aminosee $1  -m 1  -v -d  --peptide="Glutamic acid" &
  aminosee $1  -m 1  -v -d  --peptide="Aspartic acid" &
  aminosee $1  -m 1  -v -d  --peptide=Amber &

  aminosee $1  -m 1  -v -d  --peptide=Cysteine &
  aminosee $1  -m 1  -v -d  --peptide=Glycine &
  aminosee $1  -m 1  -v -d  --peptide=Alanine &
  aminosee $1  -m 1  -v -d  --peptide=Methionine &

  aminosee $1  -m 1  -v -d  --peptide=Valine &
  aminosee $1  -m 1  -v -d  --peptide=Leucine &
  aminosee $1  -m 1  -v -d  --peptide=Isoleucine &
  aminosee $1  -m 1  -v -d  --peptide=Phenylalanine &

  aminosee $1  -m 1  -v -d  --peptide=Tryptophan &
  aminosee $1  -m 1  -v -d  --peptide=Serine &
  aminosee $1  -m 1  -v -d  --peptide=Threonine &
  aminosee $1  -m 1  -v -d  --peptide=Opal


  aminosee $1  -m 1  -v -d  --peptide=Glutamine &
  aminosee $1  -m 1  -v -d  --peptide=Asparagine &
  aminosee $1  -m 1  -v -d  --peptide=Tyrosine &
  aminosee $1  -m 1  -v -d  --peptide=Arginine &

  aminosee $1  -m 1  -v -d  --peptide=Lysine &
  aminosee $1  -m 1  -v -d  --peptide=Histidine &
  aminosee $1  -m 1  -v -d  --peptide=Proline &


  aminosee $1   -m 10   -v -d
  aminosee $1   -m 10   -v -d  --peptide=Ochre &
  sleep 1
  aminosee $1   -m 10   -v -d  --peptide="Glutamic acid" &
  sleep 1
  aminosee $1   -m 10   -v -d  --peptide="Aspartic acid" &
  sleep 1
  aminosee $1   -m 10   -v -d  --peptide=Amber &
  sleep 1

  aminosee $1   -m 10   -v -d  --peptide=Cysteine &
  aminosee $1   -m 10   -v -d  --peptide=Glycine &
  aminosee $1   -m 10   -v -d  --peptide=Alanine &
  aminosee $1   -m 10   -v -d  --peptide=Methionine &
  sleep 2

  aminosee $1   -m 10   -v -d  --peptide=Valine &
  aminosee $1   -m 10   -v -d  --peptide=Leucine &
  aminosee $1   -m 10   -v -d  --peptide=Isoleucine &
  aminosee $1   -m 10   -v -d  --peptide=Phenylalanine &
  sleep 2

  aminosee $1   -m 10   -v -d  --peptide=Tryptophan &
  aminosee $1   -m 10   -v -d  --peptide=Serine &
  aminosee $1   -m 10   -v -d  --peptide=Threonine &
  aminosee $1   -m 10   -v -d  --peptide=Opal &
  sleep 2

  aminosee $1   -m 10   -v -d  --peptide=Glutamine &
  aminosee $1   -m 10   -v -d  --peptide=Asparagine &
  aminosee $1   -m 10   -v -d  --peptide=Tyrosine &
  aminosee $1   -m 10   -v -d  --peptide=Arginine &
  sleep 2

  aminosee $1   -m 10   -v -d  --peptide=Lysine &
  aminosee $1   -m 10   -v -d  --peptide=Histidine &
  aminosee $1   -m 10   -v -d  --peptide=Proline

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

parallel_file AAA-to-TTT-50k.txt
parallel_file 64-codons-test-pattern.txt
parallel_file megabase.fa
parallel_file Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa
parallel_file chrX.fa
parallel_file chr1.fa
parallel_file homo-sapien-hs_ref_GRCh38.p12_chr2.mfa
parallel_file homo-sapien-hs_ref_GRCh38.p12_chr2.gbk
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 12  -v -d -f--triplet=TAA
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=TGG
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=TCC
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=ATT
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=TCG
#

if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec parallel_file {} \; sleep 5;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec parallel_file {}  \; sleep 5;
fi
