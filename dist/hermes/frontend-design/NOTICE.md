# NOTICE

`frontend-design` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: anthropics/skills (ref `main`, skills under `skills`)
- Version: unversioned upstream
- Commit: 683bc88e56f3e09ba94f7055977f3d3aa499f202 (2026-10-05T06:46:42-07:00)
- License: no LICENSE among the source's attribution files
- Skills: frontend-design

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/frontend-design/` in the library: this package without the flag, each skill's `name` set to its folder. `hermes plugins install oneezy/skills/dist/hermes/frontend-design` installs it; Hermes lists its skills as `agent-plugin-frontend-design-7429eb2e:<skill>`.
