# macos
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d -f --no-clear --zoom 100 -f {} \;

# linux
# find -f *.fa *.mfa *.gbk  -exec aminosee -v -d -f --no-clear --zoom 100 -f {} \;
aminosee megabase.fa -d
aminosee megabase.fa -d -z 2
aminosee megabase.fa -d -z 3
aminosee megabase.fa -d -z 4


find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -d  --zoom 10
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -d  --zoom 10
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -d  --zoom 10
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -d  --zoom 10
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -d  --zoom 10

find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -d  --zoom 20
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -d  --zoom 20
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -d  --zoom 20
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -d  --zoom 20
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -d  --zoom 20



find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d -f --no-clear --zoom 100
find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d -f --no-clear --zoom 100
find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d -f --no-clear --zoom 100
find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d -f --no-clear --zoom 100
find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d -f --no-clear --zoom 100

aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -z 255
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -z 128
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -z 64
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -z 32
aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -z 16
