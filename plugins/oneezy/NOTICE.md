# NOTICE

`oneezy` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/oneezy` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.48.0
- Commit: 11e219ff939fbc19626a513644d5fae20385ac44 (2026-10-12T23:55:33Z)
- License: no LICENSE file in the library
- Skills: oneezy-brain, oneezy-debug, oneezy-estimate, oneezy-meeting, oneezy-merge, oneezy-migrate, oneezy-naming, oneezy-remote, oneezy-skills, oneezy-status

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/oneezy/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/oneezy` installs it; Hermes lists its skills as `agent-plugin-oneezy-80c7eb0f:<skill>`.
