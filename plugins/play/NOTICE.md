# NOTICE

`play` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/play` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.46.0
- Commit: 59ae4c3da7c1027f0f442829ff0f3220c9d30ca7 (2026-10-12T00:36:54Z)
- License: no LICENSE file in the library
- Skills: play-unslop

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/play/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/play` installs it; Hermes lists its skills as `agent-plugin-play-aba4cc9b:<skill>`.
