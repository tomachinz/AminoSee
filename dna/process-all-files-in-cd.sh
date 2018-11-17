# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;
aminosee megabase.fa -v -f -d -z 1
aminosee megabase.fa -v -f -d -z 2
aminosee megabase.fa -v -f -d -z 3
aminosee megabase.fa -v -f -d -z 4
aminosee megabase.fa -v -f -d -z 5
aminosee megabase.fa -v -f -d -z 6
aminosee megabase.fa -v -f -d -z 8
aminosee megabase.fa -v -f -d -z 255


aminosee z_Brown-Kiwi-aptMan1.fa -v -f -d -z 255
aminosee z_Brown-Kiwi-aptMan1.fa -v -f -d -z 128
aminosee z_Brown-Kiwi-aptMan1.fa -v -f -d -z 64
aminosee z_Brown-Kiwi-aptMan1.fa -v -f -d -z 32
aminosee z_Brown-Kiwi-aptMan1.fa -v -f -d -z 16



find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1


find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
