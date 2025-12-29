#!/bin/bash

# Navigate to the cicd directory
cd "$(dirname "$0")"

# Prepare .env for local deployment
if [ ! -f .env ] && [ -f ../backend/.env ]; then
    echo "Copying local .env from backend..."
    cp ../backend/.env .env
fi

# Pull latest images
docker compose pull

# Check and generate SSL certificates
if [ ! -f ./nginx/certs/nginx-selfsigned.crt ]; then
    echo "Generating self-signed SSL certificates..."
    mkdir -p ./nginx/certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./nginx/certs/nginx-selfsigned.key \
        -out ./nginx/certs/nginx-selfsigned.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
fi

# Restart services
docker compose up -d --build

# Prune unused images
docker image prune -f
