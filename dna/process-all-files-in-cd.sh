# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d --no-clear --zoom 1 -f {} \;
aminosee megabase.fa -v -f -d -z 1
aminosee megabase.fa -v -f -d -z 2
aminosee megabase.fa -v -f -d -z 3
aminosee megabase.fa -v -f -d -z 4

aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 255
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 128
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 64
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 32
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 16
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 8
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 4
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 3
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -v -f -d -z 2

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 10

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d --no-clear --zoom 1
