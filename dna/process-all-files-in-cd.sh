# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;
aminosee megabase.fa -v -f -z -d 1
aminosee megabase.fa -v -f -z -d 2
aminosee megabase.fa -v -f -z -d 3
aminosee megabase.fa -v -f -z -d 4
aminosee megabase.fa -v -f -z -d 5
aminosee megabase.fa -v -f -z -d 6
aminosee megabase.fa -v -f -z -d 8
aminosee megabase.fa -v -f -z -d 255


find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -z 4000 --artistic --devmode
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -z 4000 --artistic --devmode
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -z 4000 --artistic --devmode
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -z 4000 --artistic --devmode
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -z 4000 --artistic --devmode
