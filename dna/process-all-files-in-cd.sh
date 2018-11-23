
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


aminosee megabase.fa  -m 4  -v -d -t AAA
aminosee megabase.fa  -m 4  -v -d -t GGG
aminosee megabase.fa  -m 4  -v -d -t CCC
aminosee megabase.fa  -m 4  -v -d -t TTT
aminosee megabase.fa  -m 4  -v -d -t ACG

aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d -t AAA
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d -t GGG
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d -t CCC
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d -t TTT
aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 8  -v -d -t ACG


# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 12  -v -d -t TAA
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -t TGG
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -t TCC
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -t ATT
# aminosee Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa  -m 12  -v -d -t TCG

if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t AAA {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t GGG {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t CCC {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t TTT {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t ACG {} \;

  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d -t AAA {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d -t GGG {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d -t CCC {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d -t TTT {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 9  -v -d -t ACG {} \;

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

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t AAA {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t GGG {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t CCC {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t TTT {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -t ACG {} \;

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
