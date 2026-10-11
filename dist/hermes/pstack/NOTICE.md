# NOTICE

`pstack` is a plugin package built by @oneezy/skills-sync; its files are copies, not the place to edit.

- Source: cursor/plugins (ref `main`, skills under `pstack/skills`)
- Version: 0.15.17
- Commit: 11713c683fe4add4fd403ea880580abbc9e0875f (2026-10-11T10:14:38+02:00)
- License: MIT, see LICENSE
- Skills: architect, arena, automate-me, blast-radius, bro, create-verification-skill, figure-it-out, how, interrogate, maintain-verification-skill, make-bot-ui, no-comments, poteto-mode, principle-attack-the-premise, principle-boundary-discipline, principle-build-the-lever, principle-encode-lessons-in-structure, principle-exhaust-the-design-space, principle-experience-first, principle-fix-root-causes, principle-foundational-thinking, principle-guard-the-context-window, principle-laziness-protocol, principle-make-operations-idempotent, principle-migrate-callers-then-delete-legacy-apis, principle-minimize-reader-load, principle-model-the-domain, principle-never-block-on-the-human, principle-outcome-oriented-execution, principle-prove-it-works, principle-redesign-from-first-principles, principle-separate-before-serializing-shared-state, principle-sequence-verifiable-units, principle-subtract-before-you-add, principle-test-behavior-not-implementation, principle-type-system-discipline, recall, reflect, setup-pstack, show-me-your-work, swarm, pstack-tdd (renamed from tdd), pstack-teach (renamed from teach), technical-writing, typescript-best-practices, unslop, why

Every `SKILL.md` under `skills/` carries `metadata.internal: true`: the library's own copies are the ones `npx skills` installs and updates, and these are skipped (`INSTALL_INTERNAL_SKILLS=1` re-exposes them).

Hermes rejects that flag (its portable loader takes only string-valued metadata), so the copy it loads is `dist/hermes/pstack/` in the library: this package without the flag and every other non-string metadata entry, each skill's `name` set to its folder, and without the Claude Code and Codex manifests. `hermes plugins install oneezy/skills/dist/hermes/pstack` installs it; Hermes lists its skills as `agent-plugin-pstack-7171b73f:<skill>`.
