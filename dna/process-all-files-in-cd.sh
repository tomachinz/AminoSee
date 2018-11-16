# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -s -v -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -s -v -f {} \;

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -s -v
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -s -v

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -z 4000
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -z 4000
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -z 4000
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -z 4000
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -z 4000
