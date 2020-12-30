#!/bin/sh
PACKAGER="brew install"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
     echo linux-gnu detected
     PACKAGER="sudo apt install"
     apt update
elif [[ "$OSTYPE" == "darwin"* ]]; then
     echo macOS detected
     PACKAGER="brew install"
     brew update
elif [[ "$OSTYPE" == "cygwin" ]]; then
     echo detected cygwin POSIX compatibility layer and Linux environment emulation for Windows
elif [[ "$OSTYPE" == "msys" ]]; then
     echo detected Lightweight shell and GNU utilities compiled for Windows
elif [[ "$OSTYPE" == "win32" ]]; then
     echo detected Windows
elif [[ "$OSTYPE" == "freebsd"* ]]; then
     echo detected FreeBSD
else
     echo unknown os
fi

echo Installing linux dependencies: gource, ffmpeg, lighthouse

install () {
    echo installing $1 with
    echo $PACKAGER $1
    $PACKAGER $1
    echo 
    sleep 1
}

install gource
install ffmpeg
npm install lighthouse

echo done

echo running main 🧬 AminoSee installer
sleep 1


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
aminosee --test -m8
# locate aminosee  | grep aminosee$ &
sleep 1
echo about to create symlinks in /usr/local/bin
COMMMAND="sudo ln -s /usr/local/lib/node_modules/aminosee/bin/aminosee /usr/local/bin/aminosee"
echo $COMMAND
sleep 1
eval $COMMAND
