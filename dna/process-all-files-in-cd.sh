# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -z 4000 --artistic 
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -z 4000 --artistic
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -z 4000 --artistic
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -z 4000 --artistic
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -z 4000 --artistic
