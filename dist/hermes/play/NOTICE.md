# NOTICE

`play` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/play` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.47.0
- Commit: 5930114daa6ab2e029962d385082a1e64e5fb0c2 (2026-10-11T19:14:38-07:00)
- License: no LICENSE file in the library
- Skills: play-agents, play-unslop

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/play/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/play` installs it; Hermes lists its skills as `agent-plugin-play-aba4cc9b:<skill>`.
