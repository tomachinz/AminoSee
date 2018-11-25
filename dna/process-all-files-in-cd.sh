
echo List files without ./ in front
# find . | awk '{sub(/.\//," ")}1'


aminosee AAA-to-TTT-50k.txt -d -f --peptide=LEUCINE &
aminosee 64-codons-test-pattern.txt -d -f --peptide=LEUCINE &

aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --peptide=LEUCINE &
aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --peptide=LEUCINE &

aminosee megabase.fa -d -f --peptide=LEUCINE &
aminosee megabase.fa -d -f --peptide=SERINE &

aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --peptide=LEUCINE &
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 10 -d -f --peptide=SERINE &

aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --peptide=LEUCINE &
aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa  -m 10 -d -f --peptide=SERINE &

aminosee chrX.fa -d -f --peptide=LEUCINE &
aminosee chrX.fa -m 10  -d -f --peptide=SERINE &

aminosee chr1.fa -d -f --peptide=LEUCINE &
aminosee chr1.fa -m 10  -d -f --peptide=SERINE

aminosee z_Brown-Kiwi-aptMan1.fa -d -f --peptide=LEUCINE &
aminosee z_Brown-Kiwi-aptMan1.fa -m 10 -d -f --peptide=SERINE


aminosee AAA-to-TTT-50k.txt -d -f --artistic  &
aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --artistic  &
aminosee megabase.fa -d -f --artistic --peptide=LEUCINE &
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --artistic  &
aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --artistic  &
aminosee chrX.fa -d -f --artistic &
aminosee chr1.fa -d -f --artistic &



aminosee AAA-to-TTT-50k.txt -d -f --artistic --peptide=LEUCINE &
aminosee 64-codons-test-pattern.txt -d -f --artistic --peptide=LEUCINE &

aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --artistic --peptide=LEUCINE &
aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --artistic --peptide=LEUCINE &

aminosee megabase.fa -d -f --artistic --peptide=LEUCINE &
aminosee megabase.fa -d -f --artistic --peptide=SERINE &

aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --artistic --peptide=LEUCINE &
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --artistic --peptide=SERINE &

aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --artistic --peptide=LEUCINE &
aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --artistic --peptide=SERINE &

aminosee chrX.fa -d -f --artistic --peptide=LEUCINE &
aminosee chrX.fa -d -f --artistic --peptide=SERINE &

aminosee chr1.fa -d -f --artistic --peptide=LEUCINE &
aminosee chr1.fa -d -f --artistic --peptide=SERINE

aminosee_do () {
  nice -n $3 aminosee $1 -d $4 &
  echo "done"
  sleep $2
}
aminosee_do_foreground() {
  aminosee $1 -d $4
}

parallel_file () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"

# aminosee $1  -m 1  -v -d &
aminosee_do_foreground $1 $2 0 &
aminosee_do $1 $2 1   --peptide=Ochre &
aminosee_do $1 $2 2   --peptide=Glutamic &
aminosee_do $1 $2 3   --peptide=Aspartic &
aminosee_do $1 $2 4   --peptide=Amber
aminosee_do $1 $2 5   --peptide=Cysteine
aminosee_do $1 $2 6   --peptide=Glycine
aminosee_do_foreground $1 $2 0 --peptide=Alanine

aminosee_do $1 $2 1   --peptide=Methionine &
aminosee_do $1 $2 2   --peptide=Valine
aminosee_do_foreground $1 $2 3  --peptide=Leucine
aminosee_do $1 $2 4   --peptide=Isoleucine &
aminosee_do $1 $2 5   --peptide=Phenylalanine
aminosee_do $1 $2 6   --peptide=Tryptophan
aminosee_do $1 $2 7   --peptide=Serine
aminosee_do_foreground $1 $2 0   --peptide=Threonine

aminosee_do $1 $2 1   --peptide=Opal &
aminosee_do $1 $2 2   --peptide=Glutamine
aminosee_do $1 $2 3   --peptide=Asparagine
aminosee_do_foreground $1 0 4   --peptide=Tyrosine
aminosee_do $1 $2 5   --peptide=Arginine &
aminosee_do_foreground $1 $2 6   --peptide=Lysine
aminosee_do_foreground $1 $2 0   --peptide=Histidine &

#
#
# aminosee $1 -m 10 -v -d &
# aminosee_do $1 $2 1 aminosee $1   -m 10   -v -d  --peptide=Ochre &
# aminosee_do $1 $2 2 aminosee $1   -m 10   -v -d  --peptide="Glutamic acid" &
# aminosee_do $1 $2 3 aminosee $1   -m 10   -v -d  --peptide="Aspartic acid" &
# aminosee_do $1 $2 4 aminosee $1   -m 10   -v -d  --peptide=Amber &
# aminosee_do $1 $2 5 aminosee $1   -m 10   -v -d  --peptide=Cysteine &
# aminosee_do $1 $2 6 aminosee $1   -m 10   -v -d  --peptide=Glycine &
# aminosee_do $1 $2 7 aminosee $1   -m 10   -v -d  --peptide=Alanine
#
#
# aminosee_do $1 $2 1 aminosee $1   -m 10   -v -d  --peptide=Methionine &
# # aminosee_do $1 $2 2 aminosee $1   -m 10   -v -d  --peptide=Valine &
# # aminosee_do $1 $2 3 aminosee $1   -m 10   -v -d  --peptide=Leucine &
# # aminosee_do $1 $2 4 aminosee $1   -m 10   -v -d  --peptide=Isoleucine &
# # aminosee_do $1 $2 5 aminosee $1   -m 10   -v -d  --peptide=Phenylalanine &
# # aminosee_do $1 $2 6 aminosee $1   -m 10   -v -d  --peptide=Tryptophan &
# # aminosee_do $1 $2 7 aminosee $1   -m 10   -v -d  --peptide=Serine &
# sleep 5
# aminosee_do $1 $2 8 aminosee $1   -m 10   -v -d  --peptide=Threonine
#
# aminosee_do $1 $2 1 aminosee $1   -m 10   -v -d  --peptide=Opal &
# aminosee_do $1 $2 2 aminosee $1   -m 10   -v -d  --peptide=Glutamine &
# aminosee_do $1 $2 3 aminosee $1   -m 10   -v -d  --peptide=Asparagine &
# aminosee_do $1 $2 4 aminosee $1   -m 10   -v -d  --peptide=Tyrosine &
# aminosee_do $1 $2 5 aminosee $1   -m 10   -v -d  --peptide=Arginine &
# aminosee_do $1 $2 6 aminosee $1   -m 10   -v -d  --peptide=Lysine &
# aminosee_do $1 $2 7 aminosee $1   -m 10   -v -d  --peptide=Histidine &
# aminosee $1 -m 10 -v -d  --peptide=Proline

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}
parallel_file megabase.fa 0
parallel_file Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 1

parallel_file chrX.fa 5
parallel_file chr1.fa 10
parallel_file homo-sapien-hs_ref_GRCh38.p12_chr2.mfa 10
parallel_file homo-sapien-hs_ref_GRCh38.p12_chr2.gbk 10

parallel_file AAA-to-TTT-50k.txt 0
parallel_file 64-codons-test-pattern.txt 0

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
  find -f *.fa *.mfa *.gbk *.txt -exec parallel_file {} 2 \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec parallel_file {} 2 \;
fi
