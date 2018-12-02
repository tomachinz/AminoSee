

# nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa  -f --no-updates -d
# nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa  -f --no-updates -d
# nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa  -f --no-updates -d


aminosee_test () {
  echo "doing "
  nice aminosee megabase.fa Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -f --no-updates  $1 $2 $3

  sleep 60
  echo "backgrounded..."
}

  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING TESTING FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"


  # nice aminosee megabase.fa megabase.fa Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -f --no-updates -d $1 $2 $3
  # nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa  -f --no-updates -d $1 $2 $3
  # nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa megabase.fa   -f --no-updates -d $1 $2 $3

aminosee_test megabase.fa megabase.fa Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa

aminosee_test
aminosee_test             --peptide=Ochre
# aminosee_test            $1 $2 2 $3 $4 --peptide=Glutamic &
# aminosee_test            $1 $2 3 $3 $4 --peptide=Aspartic &
# aminosee_test            $1 $2 4 $3 $4 --peptide=Amber &
aminosee_test             --peptide=Cysteine
# aminosee_test            $1 $2 6 $3 $4 --peptide=Glycine &
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Alanine

aminosee_test             --peptide=Methionine
# aminosee_test            $1 $2 2 $3 $4 --peptide=Valine &
# aminosee_test_foreground $1 $2 3 $3 $4 --peptide=Leucine &
# aminosee_test            $1 $2 4 $3 $4 --peptide=Isoleucine &
aminosee_test             --peptide=Phenylalanine
# aminosee_test            $1 $2 6 $3 $4 --peptide=Tryptophan
# aminosee_test            $1 $2 7 $3 $4 --peptide=Serine &
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Threonine

aminosee_test             --peptide=Opal
# aminosee_test            $1 $2 2 $3 $4 --peptide=Glutamine &
# aminosee_test            $1 $2 3 $3 $4 --peptide=Asparagine &
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Tyrosine &
aminosee_test             --peptide=Arginine
# aminosee_test_foreground $1 $2 6 $3 $4 --peptide=Lysine
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Histidine &

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"
