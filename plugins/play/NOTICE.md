# NOTICE

`play` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/play` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.48.0
- Commit: de821d606934891742cb1fdc4d02d86eec2e54c3 (2026-10-12T23:52:33Z)
- License: no LICENSE file in the library
- Skills: play-agents, play-unslop

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/play/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/play` installs it; Hermes lists its skills as `agent-plugin-play-aba4cc9b:<skill>`.
