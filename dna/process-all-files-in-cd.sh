# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -d -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -d -f {} \;

find . -name "*.fa" -type f -print0 | xargs -0 aminosee -d
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -d
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -d
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -d
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -d
find . -name "*.asn" -type f -print0 | xargs -0 aminosee -d
