#!/usr/bin/env bash
# Sync Justin's skills from the library. add <owner/repo> and update go through npx skills, which owns the lock.
set -euo pipefail
case "${1:-}" in
  add)
    shift
    lib="${SKILLS_REPO:-$HOME/.skills-sync}"
    [ -d "$lib/skills" ] || npx --yes @oneezy/skills-sync --quiet
    (cd "$lib" && npx --yes skills@latest add "$@" --all)
    exec npx --yes @oneezy/skills-sync --quiet
    ;;
  update)
    lib="${SKILLS_REPO:-$HOME/.skills-sync}"
    (cd "$lib" && npx --yes skills@latest update -p -y)
    exec npx --yes @oneezy/skills-sync --quiet
    ;;
  *)
    exec npx --yes @oneezy/skills-sync "$@"
    ;;
esac
