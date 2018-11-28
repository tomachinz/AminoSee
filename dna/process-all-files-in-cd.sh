
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


aminosee_do () {
  nice -n $3 aminosee $1 -d $4 $5 $6 &
  echo "done $1 -d $4 $5 $6"
  sleep $2
}
aminosee_do_foreground() {
  nice -n $3 aminosee $1 -d $4 $5 $6
  echo "done $1 -d $4 $5 $6"
}

many_size_hilbert() {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"

  aminosee_do            $1 $2 1 -m 1
  aminosee_do            $1 $2 2 -m 2
  aminosee_do            $1 $2 3 -m 3
  aminosee_do            $1 $2 4 -m 4
  aminosee_do            $1 $2 5 -m 5
  aminosee_do_foreground $1 $2 6 -m 6
  aminosee_do_foreground $1 $2 7 -m 7
  aminosee_do_foreground $1 $2 8 -m 8
}

parallel_peptides () {
  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING PARALLEL DECODE FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"
aminosee_do            $1 $2 0 $3 $4
aminosee_do            $1 $2 1 $3 $4 --peptide=Ochre &
aminosee_do            $1 $2 2 $3 $4 --peptide=Glutamic &
aminosee_do            $1 $2 3 $3 $4 --peptide=Aspartic &
aminosee_do            $1 $2 4 $3 $4 --peptide=Amber &
aminosee_do            $1 $2 5 $3 $4 --peptide=Cysteine
aminosee_do            $1 $2 6 $3 $4 --peptide=Glycine &
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Alanine

aminosee_do            $1 $2 1 $3 $4 --peptide=Methionine &
aminosee_do            $1 $2 2 $3 $4 --peptide=Valine &
aminosee_do_foreground $1 $2 3 $3 $4 --peptide=Leucine &
aminosee_do            $1 $2 4 $3 $4 --peptide=Isoleucine &
aminosee_do            $1 $2 5 $3 $4 --peptide=Phenylalanine
aminosee_do            $1 $2 6 $3 $4 --peptide=Tryptophan
aminosee_do            $1 $2 7 $3 $4 --peptide=Serine &
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Threonine

aminosee_do            $1 $2 1 $3 $4 --peptide=Opal &
aminosee_do            $1 $2 2 $3 $4 --peptide=Glutamine &
aminosee_do            $1 $2 3 $3 $4 --peptide=Asparagine &
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Tyrosine &
aminosee_do            $1 $2 5 $3 $4 --peptide=Arginine
aminosee_do_foreground $1 $2 6 $3 $4 --peptide=Lysine
aminosee_do_foreground $1 $2 0 $3 $4 --peptide=Histidine &

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
}

# aminosee * -d &

parallel_peptides megabase.fa 1
aminosee_do Gorilla-C2AB-9595_ref_gorGor4_chr2B.mfa 5
aminosee_do Gorilla-C2AB-9595_ref_gorGor4_chr2A.gbk 5
aminosee_do Gorilla-C2AB-9595_ref_gorGor4_chr2A.fa 5

parallel_peptides "Cannabis sativa subsp. indica cultivar LA Confidential.fa" 60
parallel_peptides "Eucalyptus grandis cultivar BRASUZ1.gbk" 60
parallel_peptides "Octopus_bimaculoides_37653_chrUn.fa" 60
parallel_peptides "chrY Pan troglodytes C0471 Clint.gbk" 60
parallel_peptides "homo-sapien-hs_ref_GRCh38.p12_chr2.fa" 60




if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee_do {} 60  \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec aminosee_do {} 60   \;
fi
#
# many_size_hilbert megabase.fa 1
# many_size_hilbert Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa 2

aminosee * -d
