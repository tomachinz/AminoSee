
if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee --peptide Tryptophan -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -w 1 -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -w 8 -v -d --no-clear {} \;
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d --no-clear {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt -exec aminosee -v -d --no-clear {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -w 1 -v -d --no-clear {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee -w 8 -v -d --no-clear {} \;
  find *.fa *.mfa *.gbk *.txt -exec aminosee --artistic -c 2500  -v -d --no-clear {} \;
fi
