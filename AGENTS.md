# AGENTS.md

## Agent skills

Skills authored in this repo are named `oneezy-<name>` (`/oneezy-merge`, `/oneezy-status`, `/oneezy-estimate`); the prefix is how Justin tells his skills from installed ones. Each lives in `.agents/skills/<name>` with a copy in `.claude/skills/<name>`.

### Issue tracker

Issues are tracked as GitHub Issues on `oneezy/skills` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
