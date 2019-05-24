#!/bin/sh
# test should run quickly and quit.
w
aminosee
aminosee -f
aminosee -h
aminosee help
aminosee -v

# aminosee_test () {
echo 'doing  *  $1 $2 $3 $4 $5  --peptide="aspartic ACID"'
nice aminosee * $1 $2 $3 $4 $5 --no-clear --peptide="aspartic ACID"


echo 'doing   $1 $2 $3 $4 $5  --peptide="gluTAMIC aCID"'
nice aminosee $1 $2 $3 $4 $5 -f --peptide="gluTAMIC aCID"

echo "doing   $1 $2 $3 $4 $5 --triplet ggg --ratio=sqr"
nice aminosee $1 $2 $3 $4 $5 --triplet ggg --ratio=sqr

echo "doing  $1 $2 $3 $4 $5 -m5 --ratio=gol"
nice aminosee $1 $2 $3 $4 $5 -m5 --ratio=gol

echo "doing  $1 $2 $3 $4 $5 -f --ratio=gol --peptide=Ochre"
nice aminosee $1 $2 $3 $4 $5 -f --ratio=gol --peptide=Ochre

echo "doing  $1 $2 $3 $4 $5 -f --no-updates -m7 --ratio=sqr --peptide=Amber"
nice aminosee $1 $2 $3 $4 $5 -f --no-updates -m7 --ratio=sqr --peptide=Amber

echo "doing  $1 $2 $3 $4 $5 --no-updates -m5 --peptide=Methionine --ratio=sqr"
nice aminosee $1 $2 $3 $4 $5 --no-updates -m5 --peptide=Methionine --ratio=sqr

echo "doing  $1 $2 $3 $4 $5 -m 8 --peptide=Cysteine"
nice aminosee $1 $2 $3 $4 $5 -m 8 --peptide=Cysteine

echo "doing  $1 $2 $3 $4 $5 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan"
nice aminosee $1 $2 $3 $4 $5 --no-updates -c 500 --ratio=GOLDEN --peptide=Tryptophan

echo "doing  $1 $2 $3 $4 $5 -f --no-updates --ratio=fix --peptide=Arginine --html"
nice aminosee $1 $2 $3 $4 $5 --no-updates --ratio=fix --peptide=Arginine --html

echo "doing   $1 $2 $3 $4 $5 demo --no-html --no-image"
nice aminosee $1 $2 $3 $4 $5 demo --no-html --no-image

echo "doing   $1 $2 $3 $4 $5 test --image --ratio square"
nice aminosee $1 $2 $3 $4 $5 test --image --ratio square

echo "doing aminosee help"
nice aminosee help

echo "doing aminosee serve"
nice aminosee serve &

echo 'doing  *  $1 $2 $3 $4 $5  --peptide="aspartic ACID"'
nice aminosee * $1 $2 $3 $4 $5


# }
# aminosee test --peptide=Ochre &
# sleep 2
# aminosee test --peptide=Methionine &
# sleep 4
# aminosee test --peptide=Opal
# aminosee_test test
# aminosee serve &
# aminosee --art *
# aminosee demo
# aminosee_test      *       --peptide=Ochre
# # aminosee_test            $1 $2 2 $3 $4 --peptide=Glutamic &
# # aminosee_test            $1 $2 3 $3 $4 --peptide=Aspartic &
# # aminosee_test            $1 $2 4 $3 $4 --peptide=Amber &
# aminosee_test      *       --peptide "aspartic acid"
# # aminosee_test            $1 $2 6 $3 $4 --peptide=Glycine &
# # aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Alanine
#
# aminosee_test      *       --peptide="Methionine"
# # aminosee_test            $1 $2 2 $3 $4 --peptide=Valine &
# # aminosee_test_foreground $1 $2 3 $3 $4 --peptide=Leucine &
# # aminosee_test            $1 $2 4 $3 $4 --peptide=Isoleucine &
# aminosee_test     *       --peptide="GLUTAMIC ACID"
# # aminosee_test            $1 $2 6 $3 $4 --peptide=Tryptophan
# # aminosee_test            $1 $2 7 $3 $4 --peptide=Serine &
# # aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Threonine
#
# aminosee_test             --peptide=Opal
# # aminosee_test            $1 $2 2 $3 $4 --peptide=Glutamine &
# # aminosee_test            $1 $2 3 $3 $4 --peptide=Asparagine &
# # aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Tyrosine &
# # aminosee_test             --peptide=Arginine
# # aminosee_test_foreground $1 $2 6 $3 $4 --peptide=Lysine
# # aminosee_test_foreground $1 $2 0 $3 $4 --peptide=Histidine &
#
# # aminosee Human-Chromosome-DNA.txt --force
# # aminosee chr1.fa -m 8
# # aminosee * --peptide="Glutamic acid"
# # aminosee * --triplet=GGT   # (must be only 3 characters of ATCGU)
# # aminosee test                # (generate calibration images)
# # aminosee serve                #(fire up the mini web server)
# # aminosee help  # <<-----        #       (shows options flags)
# # aminosee demo  # <<-----         #  (run demo - beta version)
# # aminosee chr1.fa  chrX.fa  chrY.fa  #       (render 3 files)
# # aminosee *       #  (render all files with default settings)
#
# echo "                                         =///"
# echo "-------------------------------------------"
# echo FINISHED PARALLEL DECODE FOR $1
# echo "-------------------------------------------"
# echo "                                         =///"
#
# sleep 12
# batch-process.sh
# w
#
#
#
#
#
#
#
#
#

# nice ./batch-triplets.sh --no-updates  *
# nice ./batch-sizes.sh --no-updates  *
# nice ./batch-peptides.sh  --no-updates  *
#
#
# # nice aminosee * --no-updates $1 $2 $3
# # nice aminosee * --no-updates $1 $2 $3
# # nice aminosee * -f --no-updates -d --peptide=Amber $1 $2 $3
# # nice aminosee * -f --no-updates -d --peptide=Ochre $1 $2 $3
# #
# # aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa -f --peptide=Proline --no-updates -v
# # aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -k -v
# # aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -v
# # aminosee megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa AAA-to-TTT-50k.txt megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -v
# # aminosee megabase.fa AAA-to-TTT-50k.txt Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa megabase.fa 37653_ref_Octopus_bimaculoides_v2_0_chrUn.fa -f --peptide=Proline -v
# #
# # aminosee_test $1 $2 $3 $4 $5 --no-updates --peptide=Glutamic
# # aminosee_test $1 --no-updates --peptide=Glutamic &
# # aminosee_test AAA-to-TTT-50k.txt megabase.fa  --peptide=Aspartic --no-updates &
# # aminosee_test Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa AAA-to-TTT-50k.txt --peptide=Amber --no-updates &
# # aminosee_test megabase.fa Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa AAA-to-TTT-50k.txt --peptide=Tryptophan --no-clear &
# # aminosee_test * --no-updates -v &
echo "                                         =///"
echo "-------------------------------------------"
echo COMPLETE TESTING FOR $1 $2 $3
echo "-------------------------------------------"
echo "                                         =///"
