#!/bin/bash
# Download portable Node.js into .tools/ (no system Node required).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="v22.14.0"
TOOLS="$ROOT/.tools"

arch="$(uname -m)"
case "$arch" in
  arm64) PLATFORM="darwin-arm64" ;;
  x86_64) PLATFORM="darwin-x64" ;;
  *)
    echo "Unsupported architecture: $arch"
    exit 1
    ;;
esac

DIR="node-${VERSION}-${PLATFORM}"
TARBALL="${DIR}.tar.xz"
URL="https://nodejs.org/dist/${VERSION}/${TARBALL}"
DEST="$TOOLS/$DIR"

if [ -x "$DEST/bin/node" ]; then
  echo "Bundled Node already installed at $DEST"
  exit 0
fi

mkdir -p "$TOOLS"
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

echo "Downloading Node ${VERSION} (${PLATFORM})…"
curl -fsSL "$URL" -o "$tmpdir/$TARBALL"
tar -xJf "$tmpdir/$TARBALL" -C "$tmpdir"
rm -rf "$DEST"
mv "$tmpdir/$DIR" "$DEST"

echo "Installed: $DEST/bin/node ($("$DEST/bin/node" -v))"
