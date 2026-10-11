# NOTICE

`diagram-design` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: cathrynlavery/diagram-design (ref `main`, skills under `skills`)
- Version: 2.6.74
- Commit: 7a2e22170ee838e859d8142ba825d83f8b6375e6 (2026-10-10T21:10:13Z)
- License: MIT, see LICENSE
- Skills: diagram-design

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/diagram-design/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/diagram-design` installs it; Hermes lists its skills as `agent-plugin-diagram-design-eefb781a:<skill>`.
