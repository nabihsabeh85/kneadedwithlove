#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v git >/dev/null 2>&1; then
  echo "Git is not installed."
  echo "Run: xcode-select --install"
  echo "Then run this script again."
  exit 1
fi

git init
git add .
git commit -m "first commit" || true
git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin https://github.com/nabihsabeh85/kneadedwithlove.git
else
  git remote add origin https://github.com/nabihsabeh85/kneadedwithlove.git
fi

git push -u origin main

echo "Deployed to https://github.com/nabihsabeh85/kneadedwithlove"
