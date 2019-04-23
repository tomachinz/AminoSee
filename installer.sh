#!/bin/sh
echo "About to run: npm install; npm link; sudo npm link aminosee; aminosee demo"
git pull
npm install
npm run build
npm run gui &
npm link
sudo npm link aminosee
aminosee demo
echo "If you don't see a demo try: npm run demo"


# for the electron app part, try this:
npm run gui

# and also - to build the elecron app
npm run build
