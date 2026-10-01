#!/usr/bin/env bash
# Sync Justin's skills from the library: one call to the published tool, the skill's words mapped to its commands.
set -euo pipefail
case "${1:-}" in
  "") exec npx --yes @oneezy/skills-sync --quiet ;;
  add) exec npx --yes @oneezy/skills-sync "$@" --quiet ;;
  update) shift; exec npx --yes @oneezy/skills-sync refresh "$@" --quiet ;;
  *) exec npx --yes @oneezy/skills-sync "$@" ;;
esac
