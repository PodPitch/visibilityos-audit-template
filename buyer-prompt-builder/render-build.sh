#!/usr/bin/env bash
set -euo pipefail

if [[ "${RENDER_GIT_BRANCH:-}" != main ]]; then
  printf 'This site can only be published from main.\n' >&2
  exit 1
fi

remote_main=$(git ls-remote --exit-code origin refs/heads/main | cut -f1)
if [[ "${RENDER_GIT_COMMIT:-}" != "$remote_main" || "$(git rev-parse HEAD)" != "$remote_main" ]]; then
  printf 'The deployment commit does not match current origin/main.\n' >&2
  exit 1
fi

mkdir -p render-public
cp buyer-prompt-builder/{index.html,style.css,app.js,robots.txt,sitemap.xml} render-public/
