# NOTICE

`frontend-design` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: anthropics/skills (ref `main`, skills under `skills`)
- Version: unversioned upstream
- Commit: dbd4588f9e1033efb41dad4bef2f7947c8993d44 (2026-10-09T18:45:49Z)
- License: no LICENSE among the source's attribution files
- Skills: frontend-design

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/frontend-design/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/frontend-design` installs it; Hermes lists its skills as `agent-plugin-frontend-design-7429eb2e:<skill>`.
