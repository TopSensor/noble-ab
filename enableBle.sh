#!/bin/bash
#ln -s $SNAP/lib/arm-linux-gnueabihf/libreadline.so.7.0 $SNAP/lib/arm-linux-gnueabihf/libreadline.so.6
ngrok http -region=sa -hostname=tsbt.sa.ngrok.io 3000
ngrok tcp --remote-addr 3.tcp.ngrok.io:23398 22
sudo $SNAP/usr/bin/btmgmt power on 
