
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee --peptide Tryptophan -v -d {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux
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
