# NOTICE

`trident` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/trident` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.49.0
- Commit: 1c4af435b1b77d1485b53e478631d9f796855078 (2026-10-12T23:51:58Z)
- License: no LICENSE file in the library
- Skills: oneezy-app-route, oneezy-ui-component

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/trident/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/trident` installs it; Hermes lists its skills as `agent-plugin-trident-fb2b9bb1:<skill>`.
