
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'

aminosee megabase.fa  -m 1  -v -d

aminosee megabase.fa  -m 1  -v -d --triplet=GTA


aminosee megabase.fa  -m 1  -v -d --peptide=Ochre
aminosee megabase.fa  -m 1  -v -d --peptide="Glutamic acid"
aminosee megabase.fa  -m 1  -v -d --peptide="Aspartic acid"
aminosee megabase.fa  -m 1  -v -d --peptide=Amber
aminosee megabase.fa  -m 1  -v -d --peptide=Cysteine
aminosee megabase.fa  -m 1  -v -d --peptide=Glycine
aminosee megabase.fa  -m 1  -v -d --peptide=Alanine
aminosee megabase.fa  -m 1  -v -d --peptide=Methionine
aminosee megabase.fa  -m 1  -v -d --peptide=Valine
aminosee megabase.fa  -m 1  -v -d --peptide=Leucine
aminosee megabase.fa  -m 1  -v -d --peptide=Isoleucine
aminosee megabase.fa  -m 1  -v -d --peptide=Phenylalanine
aminosee megabase.fa  -m 1  -v -d --peptide=Tryptophan
aminosee megabase.fa  -m 1  -v -d --peptide=Serine
aminosee megabase.fa  -m 1  -v -d --peptide=Threonine
aminosee megabase.fa  -m 1  -v -d --peptide=Opal
aminosee megabase.fa  -m 1  -v -d --peptide=Glutamine
aminosee megabase.fa  -m 1  -v -d --peptide=Asparagine
aminosee megabase.fa  -m 1  -v -d --peptide=Tyrosine
aminosee megabase.fa  -m 1  -v -d --peptide=Arginine
aminosee megabase.fa  -m 1  -v -d --peptide=Lysine
aminosee megabase.fa  -m 1  -v -d --peptide=Histidine
aminosee megabase.fa  -m 1  -v -d --peptide=Proline

aminosee megabase.fa  -m 1  -v -d --triplet=AAA
aminosee megabase.fa  -m 1  -v -d --triplet=GGG
aminosee megabase.fa  -m 1  -v -d --triplet=CCC
aminosee megabase.fa  -m 1  -v -d --triplet=TTT
aminosee megabase.fa  -m 1  -v -d --triplet=ACG

aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 1  -v -d --triplet=AAA
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 1  -v -d --triplet=GGG
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 1  -v -d --triplet=CCC
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 1  -v -d --triplet=TTT
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 1  -v -d --triplet=ACG

aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d --triplet=AAA
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d --triplet=GGG
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d --triplet=CCC
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d --triplet=TTT
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d --triplet=ACG


# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 12  -v -d --triplet=TAA
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d --triplet=TGG
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d --triplet=TCC
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d --triplet=ATT
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d --triplet=TCG

if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;

  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 1  -v -d --triplet=AAA {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 1  -v -d --triplet=GGG {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 1  -v -d --triplet=CCC {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 1  -v -d --triplet=TTT {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 1  -v -d --triplet=ACG {} \;

  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=AAA {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=GGG {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=CCC {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=TTT {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=ACG {} \;

  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d --triplet=AAA {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d --triplet=GGG {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d --triplet=CCC {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d --triplet=TTT {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d --triplet=ACG {} \;

  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-updates --peptide Lysine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Histidine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Proline {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Threonine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f-no-clear --no-updates --peptide  tryptophan {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f-no-clear --no-updates --peptide  serine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f  --no-updates --peptide opal {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Glutamine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Asparagine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Tyrosine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Arginine {} \;
  #
  #
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide tryptophan {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  serine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  opal {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  alanine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  proline {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=AAA {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=GGG {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=CCC {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=TTT {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --triplet=ACG {} \;

  find *.fa *.mfa *.gbk *.txt -exec aminosee  {} -v -d \;

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d {} \;

  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide tryptophan  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide serine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --no-updates --peptide opal  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Glutamine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Asparagine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Tyrosine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {}  -no-updates -m 4  -v -d --peptide Arginine \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Lysine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Histidine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Proline  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d --peptide Threonine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d  \;
fi
