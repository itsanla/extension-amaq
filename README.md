# Amazon Q Auto-Accept Extension

VS Code extension yang secara otomatis menerima dan menjalankan perintah dari Amazon Q Developer.

## Features

- Auto-accept Amazon Q Developer commands
- Toggle on/off dengan keyboard shortcut
- Status indicator di status bar

## Usage

- **Toggle**: `Ctrl+Shift+Alt+A`
- **Command Palette**: "Amazon Q: Toggle Auto-Accept"

## Installation

1. Download `.vsix` file dari releases
2. Install via VS Code: `Extensions > Install from VSIX`

## Development

```bash
git clone https://github.com/itsanla/extension-amaq.git
cd extension-amaq
pnpm install
pnpm run compile
```

### Build & Package

```bash
./package-extension.sh
./install-dev.sh
```

## Requirements

- VS Code ^1.80.0
- Amazon Q Developer extension