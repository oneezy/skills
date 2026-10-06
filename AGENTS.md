# AGENTS.md

## Agent skills

Own skills live in `skills/<plugin>/<skill>/` in bare Agent Skills form plus a `flow.yaml`; a folder directly under `skills/` with no `SKILL.md` is a group, and its name is the plugin id (`oneezy` for Justin's `oneezy-*` skills, `trident` for the Trident monorepo's). Edit an own skill there and nowhere else: `.agents/skills/`, `.claude/skills/` and the other layers are links written by `npx @oneezy/skills-sync` (source in `oneezy/tools`) and not committed. Prose names a skill as `` `/name` ``, a plugin or app as `` `@Name` ``, a file by its path; `flow.yaml` lists the steps, references and outcomes; the rules are in `docs/agents/references.md`.

Third-party skills come from the sources in `skills-sync.json` (`matt-pocock`, `pstack`), snapshotted under `upstream/` by `refresh` and never edited here; latest is the default, and a `pin` in the config holds one skill at one commit. Generated and committed, never hand-edited: `skills-lock.json`, `plugins/<id>/`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`; regenerate them with `npx @oneezy/skills-sync build`, and run `npx @oneezy/skills-sync check` before committing (CI, `.github/workflows/library.yml`, runs the same check on every pull request and only checks; it is a command, never a git hook). Every `main` commit that changes a package is released as `release-<n>` by the same workflow (`docs/agents/release.md`); never tag or publish by hand. A branch named `land/<topic>` lands with no review: `.github/workflows/land.yml` checks it, squashes it into `dev`, promotes `main` and releases; that is how `/oneezy-skills` adds a skill. Changes to `.github/` still go through a pull request. Uploading a plugin to ChatGPT is Justin's hand-run checklist, `docs/agents/chatgpt-upload.md`. Generated and ignored: `upstream/`, `artifacts/`, the layers and `skills-sync.local.json`, this machine's answers.

### Running a skill by name

A message that starts with `/<name>` runs that skill, even in a project thread, where it reaches you as plain text rather than a command. If the skill is in your list, invoke it. If it is not, which is always the case for skills marked `disable-model-invocation` (`/wayfinder`, `/grill-me`, `/to-tickets`, `/oneezy-merge` and others), Read `~/.claude/skills/<name>/SKILL.md` and follow it, with the rest of the message as its arguments. Never strip `disable-model-invocation` to make a skill appear: refresh puts it back, and it keeps skills that push or merge from starting on their own. If a library skill is missing from the session, run `npx --yes @oneezy/skills-sync@latest -y --agents claude-code --global --no-projects --no-wsl --quiet` first.

### Issue tracker

Issues are tracked as GitHub Issues on `oneezy/skills`, operated through `gh api` REST calls (never `gh issue` or GraphQL, which cloud sessions block). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
