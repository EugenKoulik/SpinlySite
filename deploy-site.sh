#!/usr/bin/env bash
set -euo pipefail

SITE_DIR="/opt/spinly/site"
LOCK_FILE="/tmp/spinly-deploy-site.lock"
BRANCH="main"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
    echo "another site deploy is already running; exiting." >&2
    exit 0
fi

cd "$SITE_DIR"
git fetch --prune origin "$BRANCH"
local_rev="$(git rev-parse HEAD)"
remote_rev="$(git rev-parse "origin/$BRANCH")"
if [ "$local_rev" = "$remote_rev" ]; then
    echo "already at origin/$BRANCH ($local_rev); nothing to deploy."
    exit 0
fi

echo "deploying site: $local_rev -> $remote_rev"
git reset --hard "origin/$BRANCH"

echo "site updated to $remote_rev"
