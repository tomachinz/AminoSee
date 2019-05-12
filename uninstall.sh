#!/bin/sh
echo "About to remove aminosee npm links"
npm unlink
sudo npm unlink aminosee
echo "The following command should show error:"
aminosee demo
