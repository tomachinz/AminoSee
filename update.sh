#!/bin/sh
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
echo "About to run: git reset --hard HEAD~1   !!!!!!!!!!!"
pwd
git status
sleep 5
echo "1 second"
sleep 1
git reset --hard HEAD~1
git pull
npm i
npm run test
npm build-all
npm electron-all
