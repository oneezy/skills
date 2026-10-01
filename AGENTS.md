# AGENTS.md

## Agent skills

Own skills live in `skills/<plugin>/<skill>/` in bare Agent Skills form plus a `flow.yaml`; a folder directly under `skills/` with no `SKILL.md` is a group, and its name is the plugin id (`oneezy` for Justin's `oneezy-*` skills, `trident` for the Trident monorepo's). Edit an own skill there and nowhere else: `.agents/skills/`, `.claude/skills/` and the other layers are links written by `npx @oneezy/skills-sync` (source in `oneezy/tools`) and not committed. Prose names a skill as `` `/name` ``, a plugin or app as `` `@Name` ``, a file by its path; `flow.yaml` lists the steps, references and outcomes; the rules are in `docs/agents/references.md`.

Third-party skills come from the sources in `skills-sync.json` (`matt-pocock`, `pstack`), snapshotted under `upstream/` by `refresh` and never edited here; latest is the default, and a `pin` in the config holds one skill at one commit. Generated and committed, never hand-edited: `skills-lock.json`, `plugins/<id>/`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`; regenerate them with `npx @oneezy/skills-sync build`, and run `npx @oneezy/skills-sync check` before committing (CI runs the same check; it is a command, never a git hook). Generated and ignored: `upstream/`, `artifacts/`, the layers and `skills-sync.local.json`, this machine's answers.

### Issue tracker

Issues are tracked as GitHub Issues on `oneezy/skills` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
