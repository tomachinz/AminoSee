
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

parallel_file () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
aminosee $1  -m 1  -v -d &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Ochre &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide="Glutamic acid"&
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide="Aspartic acid" &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Amber &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Cysteine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Glycine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Alanine

nice aminosee $1  -m 1  -v -d  --peptide=Methionine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Valine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Leucine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Isoleucine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Phenylalanine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Tryptophan &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Serine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Threonine

nice aminosee $1  -m 1  -v -d  --peptide=Opal &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Glutamine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Asparagine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Tyrosine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Arginine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Lysine &
sleep 1
nice aminosee $1  -m 1  -v -d  --peptide=Histidine &
sleep 1
aminosee $1  -m 1  -v -d  --peptide=Proline

aminosee $1   -m 10   -v -d &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Ochre &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide="Glutamic acid" &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide="Aspartic acid" &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Amber &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Cysteine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Glycine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Alanine

nice aminosee $1   -m 10   -v -d  --peptide=Methionine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Valine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Leucine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Isoleucine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Phenylalanine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Tryptophan &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Serine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Threonine

nice aminosee $1   -m 10   -v -d  --peptide=Opal &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Glutamine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Asparagine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Tyrosine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Arginine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Lysine &
sleep 1
nice aminosee $1   -m 10   -v -d  --peptide=Histidine &
sleep 1
aminosee $1   -m 10   -v -d  --peptide=Proline

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

parallel_file megabase.fa
parallel_file AAA-to-TTT-50k.txt
parallel_file Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa
parallel_file 64-codons-test-pattern.txt
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
