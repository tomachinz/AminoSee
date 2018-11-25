
echo List files without ./ in front
# find . | awk '{sub(/.\//," ")}1'


# aminosee AAA-to-TTT-50k.txt -d -f --ratio="hilbert" --peptide=LEUCINE &
# aminosee 64-codons-test-pattern.txt -d -f --ratio="hilbert" --peptide=LEUCINE &
#
# aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --ratio="hilbert" --peptide=LEUCINE &
# aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --ratio="hilbert" --peptide=LEUCINE &
#
# aminosee megabase.fa -m 1 -d -f &
# aminosee megabase.fa -m 2 -d -f --peptide=SERINE &
# aminosee megabase.fa -m 3 -d -f &
# aminosee megabase.fa -m 4 -d -f --peptide=SERINE &
# aminosee megabase.fa -m 5 -d -f &
# aminosee megabase.fa -m 6 -d -f --peptide=SERINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 2 -d -f &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 3 -d -f --peptide=SERINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4 -d -f &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 5 -d -f --peptide=SERINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 6 -d -f &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 7 -d -f --peptide=SERINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 8 -d -f --peptide=SERINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 9   -d -f --peptide=LEUCINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 10 -d -f$3 --peptide=SERINE &
# aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f$3 --peptide=LEUCINE &
# aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa  -m 10 -d -f --peptide=PROLINE
#
# aminosee chrX.fa -d -f --ratio="hilbert" --peptide=LEUCINE &
# aminosee chrX.fa -m 10  -d -f --ratio="hilbert" --peptide=SERINE &
#
# aminosee chr1.fa -d -f --ratio="hilbert" --peptide=LEUCINE &
# aminosee chr1.fa -m 10  -d -f --ratio="hilbert" --peptide=SERINE
#
# aminosee z_Brown-Kiwi-aptMan1.fa -d -f --ratio="hilbert" --peptide=LEUCINE &
# aminosee z_Brown-Kiwi-aptMan1.fa -m 10 -d -f --ratio="hilbert" --peptide=SERINE
#
#
# aminosee AAA-to-TTT-50k.txt -d -f --ratio="hilbert" --artistic  &
# aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --ratio="hilbert" --artistic  &
# aminosee megabase.fa -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --ratio="hilbert" --artistic  &
# aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --ratio="hilbert" --artistic  &
# aminosee chrX.fa -d -f --ratio="hilbert" --artistic &
# aminosee chr1.fa -d -f --ratio="hilbert" --artistic
#
#
#
# aminosee AAA-to-TTT-50k.txt -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee 64-codons-test-pattern.txt -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
#
# aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee streptococcus_virus_2972_uid15254-NC_007019.gbk -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
#
# aminosee megabase.fa -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee megabase.fa -d -f --ratio="hilbert" --artistic --peptide=SERINE &
#
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -d -f --ratio="hilbert" --artistic --peptide=SERINE &
#
# aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa -d -f --ratio="hilbert" --artistic --peptide=SERINE &
#
# aminosee chrX.fa -d -f --ratio="hilbert" --artistic --peptide=LEUCINE
# aminosee chrX.fa -d -f --ratio="hilbert" --artistic --peptide=SERINE &
#
# aminosee chr1.fa -d -f --ratio="hilbert" --artistic --peptide=LEUCINE &
# aminosee chr1.fa -d -f --ratio="hilbert" --artistic --peptide=SERINE

aminosee_do () {
  nice -n $3 aminosee $1 -d $4 $5 $6 &
  echo "done"
  sleep $2
}
aminosee_do_foreground() {
  aminosee $1 -d $4 $5 $6
}

parallel_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee_do $1 $2 1 -m 1
  aminosee_do $1 $2 2 -m 2
  aminosee_do $1 $2 3 -m 3
  aminosee_do $1 $2 4 -m 4
  aminosee_do $1 $2 5 -m 5
  aminosee_do $1 $2 6 -m 6
  aminosee_do $1 $2 7 -m 7
  aminosee_do_foreground $1 $2 0 -m 8
  aminosee_do_foreground $1 $2 0 -m 9
  aminosee_do_foreground $1 $2 0 -m 10
}

parallel_file () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"


  aminosee_do_foreground $1 $2 0 $3   &
  aminosee_do $1 $2 1 $3 --peptide=Ochre &
  aminosee_do $1 $2 2 $3 --peptide=Glutamic &
  aminosee_do $1 $2 3 $3 --peptide=Aspartic &
  aminosee_do $1 $2 4 $3 --peptide=Amber
  aminosee_do $1 $2 5 $3 --peptide=Cysteine
  aminosee_do $1 $2 6 $3 --peptide=Glycine
  aminosee_do_foreground $1 $2 0 $3--peptide=Alanine


# aminosee $1  -m 1  -v -d &
aminosee_do_foreground $1 $2 0 $3 &
aminosee_do $1 $2 1 $3 --peptide=Ochre &
aminosee_do $1 $2 2 $3 --peptide=Glutamic &
aminosee_do $1 $2 3 $3 --peptide=Aspartic &
aminosee_do $1 $2 4 $3 --peptide=Amber
aminosee_do $1 $2 5 $3 --peptide=Cysteine
aminosee_do $1 $2 6 $3 --peptide=Glycine
aminosee_do_foreground $1 $2 0 --peptide=Alanine

aminosee_do $1 $2 1 $3 --peptide=Methionine &
aminosee_do $1 $2 2 $3 --peptide=Valine
aminosee_do_foreground $1 $2 3$3 --peptide=Leucine
aminosee_do $1 $2 4 $3 --peptide=Isoleucine &
aminosee_do $1 $2 5 $3 --peptide=Phenylalanine
aminosee_do $1 $2 6 $3 --peptide=Tryptophan
aminosee_do $1 $2 7 $3 --peptide=Serine
aminosee_do_foreground $1 $2 0 $3 --peptide=Threonine

aminosee_do $1 $2 1 $3 --peptide=Opal &
aminosee_do $1 $2 2 $3 --peptide=Glutamine
aminosee_do $1 $2 3 $3 --peptide=Asparagine
aminosee_do_foreground $1 0 4 $3 --peptide=Tyrosine
aminosee_do $1 $2 5 $3 --peptide=Arginine &
aminosee_do_foreground $1 $2 6 $3 --peptide=Lysine
aminosee_do_foreground $1 $2 0 $3 --peptide=Histidine &

#
#
# aminosee $1 -m 10 -v -d &
# aminosee_do $1 $2 1 aminosee $1   -m 10   -v -d$3 --peptide=Ochre &
# aminosee_do $1 $2 2 aminosee $1   -m 10   -v -d$3 --peptide="Glutamic acid" &
# aminosee_do $1 $2 3 aminosee $1   -m 10   -v -d$3 --peptide="Aspartic acid" &
# aminosee_do $1 $2 4 aminosee $1   -m 10   -v -d$3 --peptide=Amber &
# aminosee_do $1 $2 5 aminosee $1   -m 10   -v -d$3 --peptide=Cysteine &
# aminosee_do $1 $2 6 aminosee $1   -m 10   -v -d$3 --peptide=Glycine &
# aminosee_do $1 $2 7 aminosee $1   -m 10   -v -d$3 --peptide=Alanine
#
#
# aminosee_do $1 $2 1 aminosee $1   -m 10   -v -d$3 --peptide=Methionine &
# # aminosee_do $1 $2 2 aminosee $1   -m 10   -v -d$3 --peptide=Valine &
# # aminosee_do $1 $2 3 aminosee $1   -m 10   -v -d$3 --peptide=Leucine &
# # aminosee_do $1 $2 4 aminosee $1   -m 10   -v -d$3 --peptide=Isoleucine &
# # aminosee_do $1 $2 5 aminosee $1   -m 10   -v -d$3 --peptide=Phenylalanine &
# # aminosee_do $1 $2 6 aminosee $1   -m 10   -v -d$3 --peptide=Tryptophan &
# # aminosee_do $1 $2 7 aminosee $1   -m 10   -v -d$3 --peptide=Serine &
# sleep 5
# aminosee_do $1 $2 8 aminosee $1   -m 10   -v -d$3 --peptide=Threonine
#
# aminosee_do $1 $2 1 aminosee $1   -m 10   -v -d$3 --peptide=Opal &
# aminosee_do $1 $2 2 aminosee $1   -m 10   -v -d$3 --peptide=Glutamine &
# aminosee_do $1 $2 3 aminosee $1   -m 10   -v -d$3 --peptide=Asparagine &
# aminosee_do $1 $2 4 aminosee $1   -m 10   -v -d$3 --peptide=Tyrosine &
# aminosee_do $1 $2 5 aminosee $1   -m 10   -v -d$3 --peptide=Arginine &
# aminosee_do $1 $2 6 aminosee $1   -m 10   -v -d$3 --peptide=Lysine &
# aminosee_do $1 $2 7 aminosee $1   -m 10   -v -d$3 --peptide=Histidine &
# aminosee $1 -m 10 -v -d$3 --peptide=Proline

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec parallel_file {} 30 --artistic \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec parallel_file {} 30  --artistic \;
fi


parallel_hilbert megabase.fa 0
parallel_hilbert Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 5
parallel_hilbert chrX.fa 10
parallel_hilbert chr1.fa 15
parallel_hilbert homo-sapien-hs_ref_GRCh38.p12_chr2.mfa 20
parallel_hilbert homo-sapien-hs_ref_GRCh38.p12_chr2.gbk 20
parallel_hilbert AAA-to-TTT-50k.txt 0
parallel_hilbert 64-codons-test-pattern.txt 0

parallel_file megabase.fa 0
parallel_file Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 1
parallel_file chrX.fa 5
parallel_file chr1.fa 10
parallel_file homo-sapien-hs_ref_GRCh38.p12_chr2.mfa 20
parallel_file homo-sapien-hs_ref_GRCh38.p12_chr2.gbk 20
parallel_file AAA-to-TTT-50k.txt 0
parallel_file 64-codons-test-pattern.txt 0

# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 12  -v -d -f--triplet=TAA
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=TGG
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=TCC
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=ATT
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -f--triplet=TCG
#
