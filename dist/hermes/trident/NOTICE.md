# NOTICE

`trident` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: `skills/trident` of oneezy/skills (https://github.com/oneezy/skills)
- Version: 0.43.4
- Commit: 85ed251aa34c7de66f663ed20f97461c3113e105 (2026-10-10T20:03:14-07:00)
- License: no LICENSE file in the library
- Skills: oneezy-app-route, oneezy-ui-component

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/trident/` in the library: this package without the flag, each skill's `name` set to its folder. `hermes plugins install oneezy/skills/dist/hermes/trident` installs it; Hermes lists its skills as `agent-plugin-trident-fb2b9bb1:<skill>`.
