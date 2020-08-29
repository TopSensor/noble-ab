#!/bin/bash
ln -s $SNAP/lib/arm-linux-gnueabihf/libreadline.so.7.0 $SNAP/lib/arm-linux-gnueabihf/libreadline.so.6
$SNAP/usr/bin/btmgmt power on 
