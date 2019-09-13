#!/bin/sh
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
# wget http://cheese:8080/job/AminoSee/build?token=ACGTGTAGCAGTAGCTGATGTCGTGCATGCTGATGA
wget http://jenkins.tomachi.co/job/AminoSee/build?token=ACGTGTAGCAGTAGCTGATGTCGTGCATGCTGATGA 
pwd
git status
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
sleep 5
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
sleep 1
echo "1 second"
sleep 1
git reset --hard HEAD
git pull
git status
npm i
npm audit
npm run test &
sleep 10
echo Building all in 2 minutes
sleep 60
echo Building all in 1 minute
sleep 50
echo Building all in 10 seconds
sleep 10
w
time npm run build-all
w
