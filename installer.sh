#!/bin/sh
whereis aminosee
which aminosee
echo Current dir:
pwd
echo This should be run from root the AminoSee repo
echo "About to run: git log; npm install; npm link; sudo npm link aminosee; aminosee --demo"
git log
sleep 2
git status
sleep 1
npm install
echo "If the following works, your source code install is up:"
echo npm run start
npm run start
#npm link
#echo about to run this as regular user:
echo npm link
     npm link
sleep 1
echo to install for all users enter admin pass. then you can juust type "aminosee" at the shell
sudo npm link aminosee
echo "If the following works, you can now just type aminosee at the command prompt: doing it now as test"
echo aminosee --test -m8
sleep 1
aminosee --test -m8
sleep 1
echo "If you didnt see some colourful Hilbert patterns try:"
echo "npm run start --test -m8"
echo
whereis aminosee
which aminosee
# locate aminosee  | grep aminosee$ &
sleep 1
echo about to run
COMMMAND="sudo ln -s /usr/local/lib/node_modules/aminosee/bin/aminosee /usr/local/bin/aminosee"
echo $COMMAND
sleep 5
eval $($COMMAND)
