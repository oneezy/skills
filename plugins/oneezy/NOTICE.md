# NOTICE

`oneezy` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/oneezy` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.50.2
- Commit: a0353afe9362840d49124cfa297995bd3c6e9989 (2026-10-13T16:27:50-07:00)
- License: no LICENSE file in the library
- Skills: oneezy-agents, oneezy-brain, oneezy-debug, oneezy-estimate, oneezy-meeting, oneezy-merge, oneezy-migrate, oneezy-naming, oneezy-remote, oneezy-skills, oneezy-status

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/oneezy/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/oneezy` installs it; Hermes lists its skills as `agent-plugin-oneezy-80c7eb0f:<skill>`.
