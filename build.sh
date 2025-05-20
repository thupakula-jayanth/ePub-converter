#!/usr/bin/env bash

# Update package list and install system dependencies
#apt-get update && apt-get install -y \
#  libgirepository1.0-dev \
#  gobject-introspection \
#  gir1.2-gtk-3.0 \
 #libcairo2-dev \
  #libgdk-pixbuf2.0-dev \
  #libpango1.0-dev \
  #libgtk-3-dev \
 # python3-gi \
 # python3-gi-cairo \
#  build-essential \
 # pkg-config \
  #cmake

# Upgrade pip
#pip install --upgrade pip

# Install Python dependencies
#pip install -r requirements.txt

#!/bin/bash
set -e

echo "Updating system packages..."
apt update && apt install -y gobject-introspection libgirepository1.0-dev

echo "Installing Python dependencies..."
pip install -r requirements.txt


