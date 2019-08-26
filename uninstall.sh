#!/bin/sh
whereis aminosee
echo "About to remove aminosee npm links by running:"
echo sudo npm unlink aminosee
sleep 1
sudo npm unlink aminosee
echo "The following command should show error:"
aminosee demo
whereis aminosee
