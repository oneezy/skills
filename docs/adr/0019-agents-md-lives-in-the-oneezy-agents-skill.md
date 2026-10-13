# ADR-0019: Justin's rules live only in the oneezy-agents skill's references/agents.md

Date: 2026-10-13. Status: accepted. Supersedes decision 3 of ADR-0017 (one source, outside every package) and decision 4 of ADR-0018 (the source stays outside the skill and is copied in).

## Context

ADR-0017 kept Justin's rules in a loose file, `skills/oneezy/agents.md`, so an edit there never changed a package, and `node scripts/oneezy-capabilities.mjs --write` copied it into `skills/oneezy/oneezy-agents/references/agents.md`. ADR-0018 made the packaged copy the only one sessions read. Two `agents.md` files with the same text, one copied from the other, read to Justin as the global rules being taken from a repo file. He wants one global file, the one inside the skill, edited directly. The repo's root `AGENTS.md` is separate: it guides only work on oneezy/skills and was never part of this chain.

## Decision

1. **One file.** Justin's rules are `skills/oneezy/oneezy-agents/references/agents.md`, edited in place. The loose `skills/oneezy/agents.md` and the copy step in `scripts/oneezy-capabilities.mjs` are removed.
2. **A rule edit is a skill edit.** It changes the oneezy package, so it lands like any skill change: bump `library.version`, run `npx @oneezy/skills-sync build` and `check`, and push a `land/<topic>` branch (or a pull request into `dev`). The release that follows carries it to every harness.
3. **The root `AGENTS.md` stays repo-only.** Nothing is copied from it or into it.

## Considered options

- **Keep the loose file and the copy:** an edit never drifts the build, but there are two files with one meaning, and Justin rejected it.
- **Let `build --check` skip `references/agents.md`:** a commit straight to `dev` from the GitHub site would stay green, but `plugins/` and `dist/hermes/` would ship stale text, and it needs a change to skills-sync in oneezy/tools. Not now.

## Consequences

- An edit to `references/agents.md` that is committed without a rebuild turns `build --check` red until `build` runs and the version is bumped. The agent route in `/oneezy-agents` ("Changing a rule") does both.
- `scripts/oneezy-capabilities.test.mjs` fails if `skills/oneezy/agents.md` comes back.
