#!/bin/bash
# Path ke folder ekstensi VSCode
EXTENSIONS_DIR="$HOME/.vscode/extensions"

# Nama ekstensi (sesuaikan dengan package.json)
EXTENSION_NAME=$(node -p "require('./package.json').name")
PUBLISHER=$(node -p "require('./package.json').publisher")

# Buat symlink
ln -sf "$(pwd)" "$EXTENSIONS_DIR/$PUBLISHER.$EXTENSION_NAME"

echo "Ekstensi berhasil di-link ke VSCode"
echo "Restart VSCode untuk mengaktifkan ekstensi"