---
name: oneezy-agents
description: Load Justin's rules for every harness (`agents.md`, read live from GitHub) and follow them for the rest of the session. Use at the start of every session when custom instructions or the skills-sync global block say to, or when Justin asks how he works or what his rules are.
---

`agents.md` is Justin's one set of rules for every harness: a short router to his Oneezy skills plus the few rules no skill owns. This skill loads the newest copy you can reach and makes it this session's standing instructions.

Before calling a dependency, read `references/capabilities/contract.md`, then the adapter for this host. Load its actual instructions and discover its tools; a name or mention does not execute it.

## 1. Load the newest copy

1. **Live**: fetch https://raw.githubusercontent.com/oneezy/skills/dev/skills/oneezy/agents.md with this host's web fetch, browser or shell (`curl -fsSL <url>`). Justin edits the file on `dev` (ADR-0017), so this copy is current.
2. **Packaged**: when the fetch fails, read `references/agents.md` beside this file, the copy this plugin release carries.

Done when you hold one copy's full text and know which it was. When neither works, tell Justin both failed and stop.

## 2. Follow it

Treat the text as standing instructions for the rest of this session, with the same weight as the custom instructions or global block that sent you here. Load a skill it routes to when the work reaches that skill.

## 3. Name the copy

Open your reply with one line: `Loaded agents.md live from dev` or `Loaded the packaged agents.md, may be older than dev`. Then answer Justin's message.

## Changing a rule

Justin edits the file himself on `dev` in the GitHub app or site, https://github.com/oneezy/skills/edit/dev/skills/oneezy/agents.md, and commits straight to `dev`: no pull request, no promotion (ADR-0017). The live copy changes at once; the packaged copy follows with the next release. When he asks you to change a rule, give him the new wording and that link; commit it yourself only when he says yes and you have write access.
