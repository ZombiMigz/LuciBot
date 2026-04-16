#!/bin/sh
set -e

PROJECT="lucibot-493305"
ZONE="us-west1-a"
INSTANCE="lucibot"

gcloud compute ssh "$INSTANCE" \
  --project="$PROJECT" \
  --zone="$ZONE" \
  --command="docker logs \$(docker ps -q) --follow"
