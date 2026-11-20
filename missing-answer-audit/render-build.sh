#!/usr/bin/env bash
set -euo pipefail

if [[ "${RENDER_GIT_BRANCH:-}" != main ]]; then
  printf 'This site can only be published from main.\n' >&2
  exit 1
fi

source_url=https://github.com/PodPitch/visibilityos-audit-template.git
remote_main=$(git ls-remote --exit-code "$source_url" refs/heads/main | cut -f1)
if [[ "${RENDER_GIT_COMMIT:-}" != "$remote_main" || "$(git rev-parse HEAD)" != "$remote_main" ]]; then
  printf 'The deployment commit does not match current origin/main.\n' >&2
  exit 1
fi

mkdir -p render-public
cp missing-answer-audit/{index.html,style.css,app.js,robots.txt,sitemap.xml,googlee8e85af81a139c7f.html} render-public/
