# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -s -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -s -f {} \;

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -s
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -s
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -s
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -s
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -s
find . -name "*.asn" -type f -print0 | xargs -0 aminosee -s
