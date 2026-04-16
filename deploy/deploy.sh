#!/bin/sh
set -e

PROJECT="lucibot-493305"
ZONE="us-west1-a"
INSTANCE="lucibot"
IMAGE="us-west1-docker.pkg.dev/lucibot-493305/lucibot/lucibot:latest"

echo "Deploying $IMAGE to $INSTANCE ($ZONE)..."

gcloud compute instances update-container "$INSTANCE" \
  --project="$PROJECT" \
  --zone="$ZONE" \
  --container-image="$IMAGE"

echo "Deploy complete."
