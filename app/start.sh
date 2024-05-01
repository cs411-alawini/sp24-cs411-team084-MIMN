#!/bin/bash

source /env/bin/activate
sudo systemctl stop redis.service
sudo systemctl start redis.service
node server.js