#!/bin/sh
echo "About to run: npm install; npm link; sudo npm link aminosee; aminosee demo"
git pull
npm install
echo "If the following works, your source code install is up:"
npm run start
npm link
echo about to run this as regular user:
echo npm link aminosee
     npm link aminosee
echo to install for all users enter admin pass. then you can juust type "aminosee" at the shell
sudo npm link aminosee
echo "If the following works, you can now just type aminosee at the command prompt:"
aminosee demo
echo "If you don't see a demo try:"
echo "npm run demo"

./node_modules/.bin/electron-rebuild


echo "IDEA: try starting the experimental GUI mode with "
echo npm run start

# and also - to build the elecron app
