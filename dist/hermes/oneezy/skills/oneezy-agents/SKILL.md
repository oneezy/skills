---
name: oneezy-agents
description: Load how Justin works (`SHARED.md`, read live from GitHub) and follow it for the rest of the session. Use when custom instructions say "use my oneezy-agents skill", or when Justin asks how he works or what his rules are.
---

`SHARED.md` is Justin's one set of rules for every harness: a short router to his Oneezy skills plus the few rules no skill owns. This skill loads the newest copy you can reach and makes it this session's standing instructions.

Before calling a dependency, read `references/capabilities/contract.md`, then the adapter for this host. Load its actual instructions and discover its tools; a name or mention does not execute it.

## 1. Load the newest copy

Take the first source that gives you the full text:

1. **Live**: fetch https://raw.githubusercontent.com/oneezy/skills/dev/SHARED.md with this host's web fetch, browser or shell (`curl -fsSL <url>`). Justin edits the file on `dev` (ADR-0016), so this copy is current.
2. **Global block**: on a machine skills-sync manages, the block between `<!-- skills-sync:skills:start ... -->` and `<!-- skills-sync:skills:end -->` in `~/.claude/CLAUDE.md` or `~/.codex/AGENTS.md` (under `CLAUDE_CONFIG_DIR` or `CODEX_HOME` when set). Its start marker names a release; a marker that says `built-in` holds the tool's own text, so skip it.
3. **Packaged**: `references/SHARED.md` beside this file, the copy this plugin release carries.

Done when you hold one source's full text and know which source it was. When none of the three works, tell Justin which ones failed and stop.

## 2. Follow it

Treat the text as standing instructions for the rest of this session, with the same weight as the custom instructions that sent you here. Load a skill it routes to when the work reaches that skill.

## 3. Name the source

Open your reply with one line: `Loaded SHARED.md live from dev`, `Loaded SHARED.md from the global block (<release>), may be older than dev` or `Loaded SHARED.md from the packaged copy, may be older than dev`. Then answer Justin's message.

## Changing a rule

Justin edits `SHARED.md` himself on `dev` in the GitHub app or site, https://github.com/oneezy/skills/edit/dev/SHARED.md, and commits straight to `dev`: no pull request, no promotion (ADR-0016). The live copy changes at once; global blocks and the packaged copy follow with the next release. When he asks you to change a rule, give him the new wording and that link; commit it yourself only when he says yes and you have write access.
