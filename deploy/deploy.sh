#!/bin/sh
set -e

PROJECT="lucibot-493305"
ZONE="us-west1-a"
INSTANCE="lucibot"
REGISTRY_URL="us-west1-docker.pkg.dev/lucibot-493305/lucibot"
IMAGE_TAG="${IMAGE_TAG:-${1:-latest}}"
IMAGE="$REGISTRY_URL/lucibot:$IMAGE_TAG"
CONTAINER_DECLARATION="$(mktemp)"

cleanup() {
  rm -f "$CONTAINER_DECLARATION"
}
trap cleanup EXIT

echo "Deploying $IMAGE to $INSTANCE ($ZONE)..."

cat > "$CONTAINER_DECLARATION" <<EOF
spec:
  containers:
  - name: lucibot
    image: $IMAGE
    stdin: false
    tty: false
  restartPolicy: Always
EOF

gcloud compute instances add-metadata "$INSTANCE" \
  --quiet \
  --project="$PROJECT" \
  --zone="$ZONE" \
  --metadata-from-file="gce-container-declaration=$CONTAINER_DECLARATION"

gcloud compute instances reset "$INSTANCE" \
  --quiet \
  --project="$PROJECT" \
  --zone="$ZONE"

echo "Deploy complete."
