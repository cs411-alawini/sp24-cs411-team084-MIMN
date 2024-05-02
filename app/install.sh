#!/bin/bash

npm install
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
deactivate