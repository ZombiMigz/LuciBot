#!/bin/sh
set -e

PROJECT="lucibot-493305"
ZONE="us-west1-a"
INSTANCE="lucibot"
IMAGE="us-west1-docker.pkg.dev/lucibot-493305/lucibot/lucibot:latest"

echo "Deploying $IMAGE to $INSTANCE ($ZONE)..."

# Pull latest image and restart container on the VM
gcloud compute ssh "$INSTANCE" \
  --project="$PROJECT" \
  --zone="$ZONE" \
  --command="
    docker-credential-gcr configure-docker --registries=us-west1-docker.pkg.dev &&
    docker pull $IMAGE &&
    docker ps -q | xargs -r docker stop &&
    docker run -d --restart=always $IMAGE
  "

echo "Deploy complete."
