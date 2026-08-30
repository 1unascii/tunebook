#!/bin/bash
# Deploy Tuneopedia on the production server.
# Run from the project root: ./deploy.sh

set -e

echo "=== Pulling latest code ==="
git pull

echo "=== Updating abcjs fork submodule ==="
git submodule update --init

echo "=== Installing PHP dependencies ==="
composer install --no-dev --optimize-autoloader

echo "=== Installing Node dependencies + patching abcjs ==="
npm install

echo "=== Building frontend assets ==="
npm run build

echo "=== Running migrations ==="
php artisan migrate --force

echo "=== Clearing caches ==="
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "=== Done! ==="
