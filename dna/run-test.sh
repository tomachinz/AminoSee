w

aminosee_test () {
  echo "doing  $1 $2 $3 $4 $5"
  nice aminosee $1 $2 $3 $4 $5 --no-updates -m 5 --ratio=gol     --peptide=Ochre

  echo "doing  $1 $2 $3 $4 $5"
  nice aminosee $1 $2 $3 $4 $5 -f --no-updates -m 1 --ratio=sqr --peptide=Cysteine

  echo "doing  $1 $2 $3 $4 $5"
  nice aminosee $1 $2 $3 $4 $5 --no-updates -m 5 $1 $2 $3 $4 $5 --peptide=Methionine

  echo "doing  $1 $2 $3 $4 $5"
  nice aminosee $1 $2 $3 $4 $5 --no-updates -m 10 $1 $2 $3 $4 $5 --peptide=Phenylalanine

  echo "doing  $1 $2 $3 $4 $5"
  nice aminosee $1 $2 $3 $4 $5 --no-updates -c 500 $1 $2 $3 $4 $5  --peptide=Opal

  echo "doing  $1 $2 $3 $4 $5"
  nice aminosee $1 $2 $3 $4 $5 --no-updates --ratio=fix $1 $2 $3 $4 $5 --peptide=Arginine

  echo "backgrounded... sleeping for 10 seconds"
  sleep 10
  echo "resuming..."
}

  echo "                                         =///"
  echo "-------------------------------------------"
  echo STARTING TESTING FOR $1 $2 $3
  echo "-------------------------------------------"
  echo "                                         =///"

nice ./batch-peptides.sh megabase.fa -f &

nice aminosee megabase.fa megabase.fa Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa --no-updates $1 $2 $3
nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa --no-updates $1 $2 $3
nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa megabase.fa  -f --no-updates -d --peptide=Amber $1 $2 $3
nice aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa megabase.fa  -f --no-updates -d --peptide=Ochre $1 $2 $3
#
# aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa -f --peptide=Proline --no-updates -v
# aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -k -v
# aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -v
# aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -v
# aminosee megabase.fa AAA-to-TTT-50k.txt Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -v
#
# aminosee_test $1 $2 $3 $4 $5 --no-updates --peptide=Glutamic
# aminosee_test $1 --no-updates --peptide=Glutamic &
# aminosee_test AAA-to-TTT-50k.txt megabase.fa  --peptide=Aspartic --no-updates &
# aminosee_test Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa AAA-to-TTT-50k.txt --peptide=Amber --no-updates &
# aminosee_test megabase.fa Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa AAA-to-TTT-50k.txt --peptide=Tryptophan --no-clear &
# aminosee_test * --no-updates -v &


aminosee_test      *       --peptide=Ochre
# aminosee_test            $1 $2 2 $3 $4 --peptide=Glutamic &
# aminosee_test            $1 $2 3 $3 $4 --peptide=Aspartic &
# aminosee_test            $1 $2 4 $3 $4 --peptide=Amber &
aminosee_test      *       --peptide=Cysteine
# aminosee_test            $1 $2 6 $3 $4 --peptide=Glycine &
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Alanine

aminosee_test      *       --peptide=Methionine
# aminosee_test            $1 $2 2 $3 $4 --peptide=Valine &
# aminosee_test_foreground $1 $2 3 $3 $4 --peptide=Leucine &
# aminosee_test            $1 $2 4 $3 $4 --peptide=Isoleucine &
aminosee_test     *       --peptide=Phenylalanine
# aminosee_test            $1 $2 6 $3 $4 --peptide=Tryptophan
# aminosee_test            $1 $2 7 $3 $4 --peptide=Serine &
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Threonine

aminosee_test             --peptide=Opal
# aminosee_test            $1 $2 2 $3 $4 --peptide=Glutamine &
# aminosee_test            $1 $2 3 $3 $4 --peptide=Asparagine &
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Tyrosine &
# aminosee_test             --peptide=Arginine
# aminosee_test_foreground $1 $2 6 $3 $4 --peptide=Lysine
# aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Histidine &

  echo "                                         =///"
  echo "-------------------------------------------"
  echo FINISHED PARALLEL DECODE FOR $1
  echo "-------------------------------------------"
  echo "                                         =///"

  sleep 12
  batch-process.sh
w
