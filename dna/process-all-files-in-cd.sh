
echo List files without ./ in front
find . | awk '{sub(/.\//," ")}1'


if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear {} \;
  # find -f *.fa *.mfa *.gbk *.txt -exec aminosee --peptide Tryptophan -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d --no-clear {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 4  -v -d --no-clear {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 15 -v -d --no-clear {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -m 20 -v -d --no-clear {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d --no-clear {} \;
fi
