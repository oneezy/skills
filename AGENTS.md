# AGENTS.md

## Agent skills

Skills authored in this repo are named `oneezy-<name>` (`/oneezy-merge`, `/oneezy-status`, `/oneezy-estimate`); the prefix is how Justin tells his skills from installed ones. Each lives in `skills/<name>/` in bare Agent Skills form. Do not edit `.agents/skills/<name>` or `.claude/skills/<name>` for an own skill: those are links that `skills-sync` (in `oneezy/tools`, `clis/skills-sync-cli`) regenerates. Third-party skills are installed into `.agents/skills` with `npx skills add <owner>/<repo>` and pinned in `skills-lock.json`.

### Issue tracker

Issues are tracked as GitHub Issues on `oneezy/skills` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
