#!/bin/sh
whereis aminosee
echo Current dir:
pwd
echo This should be run from root the AminoSee repo
echo "About to run: git log; npm install; npm link; sudo npm link aminosee; aminosee --demo"
git log
npm install
echo "If the following works, your source code install is up:"
npm run start
#npm link
echo about to run this as regular user:
echo npm link aminosee
#    npm link aminosee
echo to install for all users enter admin pass. then you can juust type "aminosee" at the shell
sudo npm link aminosee
echo "If the following works, you can now just type aminosee at the command prompt: doing it now as test"
echo aminosee --demo
sleep 1
aminosee --demo
sleep 1
echo "If you didnt see some colourful Hilbert patterns try:"
echo "npm run start --demo"
whereis aminosee
locate aminosee  | grep aminosee$ &
