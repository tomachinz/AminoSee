
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt
  sleep 2
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t AAA {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t GGG {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t CCC {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t TTT {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t ACG {} \;



  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f --no-clear --no-updates --peptide Lysine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Histidine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Proline {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Threonine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f-no-clear --no-updates --peptide  tryptophan {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f-no-clear --no-updates --peptide  serine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  -f --no-clear  --no-updates --peptide opal {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Glutamine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Asparagine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Tyrosine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  Arginine {} \;
  #
  #
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide tryptophan {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  serine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  opal {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  alanine {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f-no-clear --no-updates --peptide  proline {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t AAA {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t GGG {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t CCC {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t TTT {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear -t ACG {} \;

  find *.fa *.mfa *.gbk *.txt -exec aminosee  {} -v -d \;

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d {} \;

  find *.fa *.mfa *.gbk *.txt
  sleep 2
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d -f  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide tryptophan  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide serine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --no-updates --peptide opal  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Glutamine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Asparagine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Tyrosine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {}  -no-updates -m 4  -v -d -f --peptide Arginine \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Lysine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Histidine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Proline  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee {} -m 4 -v -d -f --peptide Threonine  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d  \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d  \;
fi
