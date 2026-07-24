#!/bin/bash
# deploy.sh - Deployment script for Aigenthix Website
# Called by GitHub Actions self-hosted runner on push to main

set -e

APP_DIR=~/Aigenthix_Website_design

echo "========================================="
echo "  Aigenthix Website - Auto Deploy"
echo "  $(date)"
echo "========================================="

# Navigate to project directory
cd "$APP_DIR"

# Pull latest changes
echo "[1/4] Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# Rebuild and restart Docker containers
echo "[2/4] Rebuilding Docker containers..."
sudo docker compose down
sudo docker compose up -d --build

# Clean up old images
echo "[3/4] Cleaning up old Docker images..."
sudo docker image prune -f

# Health check
echo "[4/4] Verifying deployment..."
sleep 20
echo ""
echo "Container Status:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
