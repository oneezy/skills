# AGENTS.md

Before working here, read `docs/agents/library.md` and `docs/agents/skill-loading.md`. For dependency discovery, read `docs/agents/capabilities.md`. For Brain work, load `/oneezy-brain`; it owns routing and locations.

### Issue tracker

Issues are tracked as GitHub Issues on `oneezy/skills`, operated through `gh api` REST calls (never `gh issue` or GraphQL, which cloud sessions block). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
