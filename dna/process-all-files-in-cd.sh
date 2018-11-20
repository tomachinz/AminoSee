
#if [ -c "$1" ]; then

if [ $(uname)=Darwin ]; then
  echo macos
  find -f *.fa *.mfa *.gbk *.txt -exec aminosee -v -d --no-clear {} \;
fi

if [ $(uname)=Linux ]; then
  echo linux
  find *.fa *.mfa *.gbk *.txt -exec aminosee -v -d --no-clear {} \;
fi




# warmup:
# CROSS PLATFORM XARGS BATCH:
#find -f .  | grep -E "(\.fa|\.mfa|\.gbk|\.txt)" | xargs -0  aminosee -d --no-clear
#  find  . | sed   -e 's/.\///' | xargs -0  aminosee -d --no-clear
# aminosee megabase.fa -d -f
# aminosee megabase.fa -d -c 2
# aminosee megabase.fa -d -c 3
# aminosee megabase.fa -d -c 4
# aminosee * -d
# aminosee * -d
# aminosee * -d
# aminosee * --no-clear -c -d 8
# aminosee * --no-clear -c -d 7
# aminosee * --no-clear -c 6


#
#
#
# find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -d  --zoom 10
# find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -d  --zoom 10
# find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -d  --zoom 10
# find . -name "*.txt" -type f -print0 | xargs -0 aminosee -d  --zoom 10
# find . -name "*.dna" -type f -print0 | xargs -0 aminosee -d  --zoom 10
#
# find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -d  --zoom 20
# find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -d  --zoom 20
# find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -d  --zoom 20
# find . -name "*.txt" -type f -print0 | xargs -0 aminosee -d  --zoom 20
# find . -name "*.dna" -type f -print0 | xargs -0 aminosee -d  --zoom 20
#
#  # find . | grep -E "(\.fa|\.mfa|\.gbk)" | xargs -0  aminosee
#
# find . -name "*.fa"  -type f -print0 | xargs -0 aminosee -v -d  --no-clear --zoom 100
# find . -name "*.mfa" -type f -print0 | xargs -0 aminosee -v -d  --no-clear --zoom 100
# find . -name "*.gbk" -type f -print0 | xargs -0 aminosee -v -d  --no-clear --zoom 100
# find . -name "*.txt" -type f -print0 | xargs -0 aminosee -v -d  --no-clear --zoom 100
# find . -name "*.dna" -type f -print0 | xargs -0 aminosee -v -d  --no-clear --zoom 100
#
# aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -c 255
# aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -c 128
# aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -c 64
# aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -c 32
# aminosee homo-sapien-hs_ref_GRCh38.p12_chr2.fa -d -c 16
