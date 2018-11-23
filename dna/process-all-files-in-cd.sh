
echo List files without ./ in front
# find . | awk '{sub(/.\//," ")}1'



if [ $(uname)=Darwin ]; then
  echo macos

  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f --no-clear  {} \;

  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f --no-clear  --peptide tryptophan {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f --no-clear  --peptide serine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide opal {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Glutamine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Asparagine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Tyrosine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Arginine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Lysine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Histidine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Proline {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide Threonine {} \;

  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide tryptophan {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide serine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide opal {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide alanine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --no-clear  --peptide proline {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f {} \;

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide tryptophan {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide serine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide opal {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Glutamine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Asparagine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Tyrosine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Arginine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Lysine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Histidine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Proline {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide Threonine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d {} \;
fi
#
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide tryptophan
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide serine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide opal
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Glutamine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Asparagine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Tyrosine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Arginine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Lysine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Histidine
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Proline
# aminosee  Caenorhabditis_elegans-WBcel235-dna-chromosome-V.fa -m 4  -v -d  --no-clear  --peptide Threonine
