# ADR-0016: SHARED.md is edited straight on dev and read live by /oneezy-agents

Date: 2026-10-12. Status: accepted. Amends ADR-0011 (global blocks only), which made the global block the one way `SHARED.md` reaches a harness. Ticket: oneezy/skills#87.

## Context

`SHARED.md` reached a harness only through the global block skills-sync writes into `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, at the latest release's commit. Claude.ai, ChatGPT and Claude Cowork have no global instructions file, only custom instructions Justin types, so they never got it. A text change also took a pull request into `dev`, a promotion to `main` and a release before any harness saw it. Justin asked for one line in each harness's custom instructions and an edit he can make himself without that cycle, and asked whether the file should live in Google Drive instead.

## Decision

1. **A skill loads it.** `/oneezy-agents`, in the oneezy plugin, reads `SHARED.md` and follows it for the session. Justin's custom instructions in Claude, ChatGPT and Cowork say "use my oneezy-agents skill".
2. **Live from `dev`.** The skill fetches https://raw.githubusercontent.com/oneezy/skills/dev/SHARED.md first, then falls back to the global block on that machine, then to the copy packaged with the skill (`references/SHARED.md`), and names the copy it used.
3. **Edited straight on `dev`.** Justin edits `SHARED.md` in the GitHub app or site and commits to `dev`: no pull request, no promotion. It is a text change only Justin makes; agents propose wording and commit it only on his yes.
4. **The rest follows a release.** Global blocks and the packaged copy take the text with the next release, as before. `node scripts/oneezy-capabilities.mjs --write` refreshes the packaged copy; a stale copy is a note, never a failed check, so Justin's direct commits never turn `dev` red.

## Considered options

- **Google Drive:** one link Justin edits like a document, but Hermes, Codex CLI and cloud containers cannot read Drive, and ChatGPT needs its Drive connector switched on in every chat, so the skill would fail in the harnesses that need it most.
- **Edit on `main`:** the file `main` serves is what harnesses read, but `dev` would keep the old text, every branch cut from `dev` would read and edit that old text, and the next promotion could conflict.
- **A `land/*` branch per edit:** keeps `dev` and `main` level and releases at once, but Justin would name a branch in GitHub's commit dialog on every edit.
- **Packaged copy only:** no fetch needed, but a text change waits for a release and, in ChatGPT, for Justin's ChatGPT update line.

## Consequences

- `dev` can hold rules `main` does not yet carry; the live copy wins, and the skill says so when it falls back to an older one.
- GitHub's raw file service may serve the previous text for a few minutes after a commit.
- The oneezy plugin now carries `SHARED.md`, which the glossary used to rule out.
