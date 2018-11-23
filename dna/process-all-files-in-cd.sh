
echo List files without ./ in front
# find . | awk '{sub(/.\//," ")}1'


if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide tryptophan {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --peptide serine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --peptide opal {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --peptide alanine {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d  --peptide proline {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
#   # find -f *.fa *.mfa *.gbk *.txt -exec aminosee --peptide Tryptophan -v -d {} \;
#   find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d {} \;
#   find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d {} \;
#   find -f *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide tryptophan {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide serine {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide opal {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --peptide proline {} \;

  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d {} \;
fi
