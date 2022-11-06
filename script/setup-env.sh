#!/usr/bin/env bash

read -s -p "Bot Token: " token

cat > .env << EOF
TOKEN=$token
EOF
