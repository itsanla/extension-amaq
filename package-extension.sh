#!/bin/bash
# Install vsce jika belum ada
npm install -g vsce

# Package ekstensi menjadi .vsix
vsce package

# Install ke VSCode
code --install-extension *.vsix