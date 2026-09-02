#!/usr/bin/env bash
set -euo pipefail

SITE_DIR="/opt/spinly/site"
LOCK_FILE="/tmp/spinly-deploy-site.lock"
BRANCH="main"
REPO_URL="https://github.com/EugenKoulik/SpinlySite.git"

# В CI нет tty — не даём git зависать/падать на запросе логина (репозиторий публичный).
export GIT_TERMINAL_PROMPT=0
export GIT_ASKPASS=true           # если git всё же спросит пароль — вернётся пусто, не зависнет
export GCM_INTERACTIVE=never      # на случай Git Credential Manager

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
    echo "another site deploy is already running; exiting." >&2
    exit 0
fi

cd "$SITE_DIR"

# Публичный репо — фетчим по прямому URL и отключаем любые credential-хелперы для этой команды.
git -c credential.helper= -c credential.interactive=false \
    fetch --prune "$REPO_URL" "$BRANCH"
remote_rev="$(git rev-parse FETCH_HEAD)"
local_rev="$(git rev-parse HEAD)"

if [ "$local_rev" = "$remote_rev" ]; then
    echo "already up to date ($local_rev); nothing to deploy."
    exit 0
fi

echo "deploying site: $local_rev -> $remote_rev"
git reset --hard FETCH_HEAD
echo "site updated to $remote_rev"
