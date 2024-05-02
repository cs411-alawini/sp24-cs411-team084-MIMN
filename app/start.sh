#!/bin/bash

source env/bin/activate
sudo systemctl start redis.service
node server.js
sudo systemctl stop redis.service
deactivate