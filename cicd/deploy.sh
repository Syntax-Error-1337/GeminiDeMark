#!/bin/bash

# Navigate to the cicd directory
cd "$(dirname "$0")"

# Pull latest images
docker-compose pull

# Restart services
docker-compose up -d --build

# Prune unused images
docker image prune -f
