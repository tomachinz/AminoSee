# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -d -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -d -f {} \;


find . -name "*.fa" "*.mfa" "*.gbk" "*.txt" "*.dna" -type f -print0 | xargs -0 aminosee -d
