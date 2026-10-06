#!/usr/bin/env bash
# Sync Justin's skills from the library: one call to the published tool, the skill's words mapped to its commands.
set -euo pipefail
case "${1:-}" in
  "") exec npx --yes @oneezy/skills-sync@latest --quiet ;;
  add) exec npx --yes @oneezy/skills-sync@latest "$@" --quiet ;;
  *) exec npx --yes @oneezy/skills-sync@latest "$@" ;;
esac
