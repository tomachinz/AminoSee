
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


aminosee_do () {
  nice -n $1 aminosee $2 $3 $4 $5 $6 $7 &
  sleep 5
}
aminosee_do_foreground() {
  nice -n $1 aminosee $2 $3 $4 $5 $6 $7
}

many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee_do            1 -m 3 $1 $2 $3
  aminosee_do            2 -m 4 $1 $2 $3
  aminosee_do            3 -m 5 $1 $2 $3
  aminosee_do_foreground 4 -m 6 $1 $2 $3
  aminosee_do_foreground 5 -m 7 $1 $2 $3
  aminosee_do_foreground 6 -m 8 $1 $2 $3
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
aminosee_do            $1 $2 0 $3 $4 &
aminosee_do            $1 $2 1 $3 $4 --peptide=Ochre
aminosee_do            $1 $2 2 $3 $4 --peptide=Glutamic
aminosee_do_foreground            $1 $2 3 $3 $4 --peptide=Aspartic
aminosee_do            $1 $2 4 $3 $4 --peptide=Amber
aminosee_do            $1 $2 5 $3 $4 --peptide=Cysteine
aminosee_do            $1 $2 6 $3 $4 --peptide=Glycine
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Alanine

aminosee_do            $1 $2 1 $3 $4 --peptide=Methionine
aminosee_do            $1 $2 2 $3 $4 --peptide=Valine
aminosee_do_foreground $1 $2 3 $3 $4 --peptide=Leucine
aminosee_do            $1 $2 4 $3 $4 --peptide=Isoleucine
aminosee_do            $1 $2 5 $3 $4 --peptide=Phenylalanine
aminosee_do            $1 $2 6 $3 $4 --peptide=Tryptophan
aminosee_do            $1 $2 7 $3 $4 --peptide=Serine
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Threonine

aminosee_do            $1 $2 1 $3 $4 --peptide=Opal
aminosee_do            $1 $2 2 $3 $4 --peptide=Glutamine
aminosee_do            $1 $2 3 $3 $4 --peptide=Asparagine
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Tyrosine
aminosee_do            $1 $2 5 $3 $4 --peptide=Arginine
aminosee_do_foreground $1 $2 6 $3 $4 --peptide=Lysine
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Histidine

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

# aminosee * -d &


parallel_peptides Brown_Kiwi_NW_013982187v1.fa
parallel_peptides Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa
parallel_peptides Human-GRCh38.p12_chr2.gbk
parallel_peptides Human-GRCh38.p12_chr2.fa
many_size_hilbert Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa
many_size_hilbert Human-GRCh38.p12_chr2.gbk
parallel_peptides Caenorhabditis_elegans.WBcel235.dna_sm.toplevel.fa
parallel_peptides Chimp_Clint_chrY.gb
parallel_peptides Octopus_Bimaculoides_v2_0_chrUn.fa
parallel_peptides chrY Pan troglodytes C0471 Clint.gbk
parallel_peptides homo-sapien-hs_ref_GRCh38.p12_chr2.fa

sleep 60


if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec parallel_peptides {} 10  \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec parallel_peptides {} 10   \;
fi
#
# many_size_hilbert megabase.fa 1
# many_size_hilbert Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 2

aminosee * -d -m 7
aminosee * -d -m 8
aminosee * -d -m 9
