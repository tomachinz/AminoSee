# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -s -v -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -s -v -f {} \;

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -s -v -z 1200
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -s -v
