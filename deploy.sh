#\!/bin/bash
set -e

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd /opt/docker/apps/portfolio

echo "==> [1/5] Git pull..."
git stash
git pull
git stash pop 2>/dev/null || true

echo "==> [2/5] Installing dependencies..."
npm install --legacy-peer-deps

echo "==> [3/5] Building..."
npm run build

echo "==> [4/5] Restarting container..."
sudo docker compose restart portfolio

echo "==> Deploy complete\!"
