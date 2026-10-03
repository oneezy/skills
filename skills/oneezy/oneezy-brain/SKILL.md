---
name: oneezy-brain
description: Justin's memory. Use whenever Justin says "remember this", "save this to my brain", "brain this", "add to my brain", "note to self", or asks "what's on the agenda", "what's in my brain", "what do I need to do today", "what's most important", or "mark X done". Reads and writes the GitHub-issues brain in oneezy/brain.
argument-hint: "remember <thing> | agenda [personal|work|ai] | what's in my brain about <topic> | done <thing>"
---

Justin's brain is a tree of GitHub issues in `oneezy/brain`: **Brain > area > category > entry**. Areas are Personal, Work and AI. An entry is one thing Justin wants kept: a task, a date, an idea, a fact. This skill is the only way an agent writes there. It never touches wayfinder tickets (anything labelled `wayfinder:*`), and `/wayfinder` never touches entries (anything labelled `brain`).

## The tool

Run the script that ships beside this file with an available Python 3 executable (`py -3` on Windows when installed, `python3` elsewhere, or the Codex bundled Python). It needs only `gh`, logged in as Justin. Pass `--json` when you will act on the output.

```
py -3 <this skill folder>/scripts/brain.py tree
py -3 <this skill folder>/scripts/brain.py remember --area work --category "Clients/Trident" --title "..." [--list next-action] [--priority high] [--due 2026-10-01] [--body "..."] [--via claude-code]
py -3 <this skill folder>/scripts/brain.py agenda [--area personal] [--limit 5]
py -3 <this skill folder>/scripts/brain.py find <words>
py -3 <this skill folder>/scripts/brain.py done <number> [--note "..."]
py -3 <this skill folder>/scripts/brain.py trash <number>
py -3 <this skill folder>/scripts/brain.py move <number> --area ai --category Skills
py -3 <this skill folder>/scripts/brain.py update <number> --list waiting-for --title "..." --body-file revised-body.txt --expect-updated-at 2026-09-28T19:59:21Z --json
```

`--help` on any subcommand owns the flags.

## Map the request

| Justin says | Do |
|---|---|
| remember this, save to my brain, brain this, note to self, don't let me forget | **Remember** |
| what's on the agenda, what do I need to do, what's most important, what's in my brain | **Agenda** |
| what's in my brain about X, did I save anything about X | `find X`, then answer from the hits |
| mark X done, I did X, X is finished | `find X`, confirm the match, `done <number>` |
| forget X, trash X | `find X`, confirm, `trash <number>` |
| that belongs under Y, move X to Y | `move` |
| an existing entry is now waiting, or its status text is stale | `find X`, read the issue, then `update <number>` |

### Remember

1. **Choose area and category** from what Justin said, without asking. Clients and repos are Work; skills, memory, plugins, harnesses, devices are AI; everything else is Personal. Pick the category whose description fits; run `tree` once per session if unsure of the names. When nothing fits, use the area's `Inbox`. Never invent a category; the tree is edited by hand.
2. **Choose the GTD list.** A date means `calendar` with `--due`. A concrete next step means `next-action`. Something someone else must do first means `waiting-for`. A wish or idea with no commitment means `someday-maybe`. A fact to keep means `reference`. Unsure means `inbox` (the default).
3. **Priority** only when Justin's words carry it (urgent, critical, important, whenever, low). Otherwise none.
4. **Title** is Justin's words trimmed to one line, present tense, no trailing period. Extra detail goes in `--body`. Pass `--via` with the harness name.
5. **Run `remember`**, then read the result back in one line: the linked number, the title, where it was filed, the labels. Never claim it was saved without the number from the tool.

Several things in one breath become several entries. When something already in the brain changes, update that entry or add a historical comment instead of creating a duplicate.

### Update an existing entry

Read the open issue first. Use `update <number> --list <list>` to change its GTD list, and `--title` or `--body-file` to correct stale text. The body file contains the complete replacement body; retain valid details and history. Use `--expect-updated-at` from the issue read to refuse an edit if someone changed it meanwhile. A due date in an existing waiting-for entry does not require changing its list to calendar. The command refuses closed issues, categories, ambiguous list labels, and wayfinder issues, then reads back the updated issue. Report its number and verified state.

### Agenda

Run `agenda` (with `--area` when Justin names one) and print its block as is. The block has a fixed shape: **Do now** (past due, due within three days, critical), **Coming up** (due within two weeks, high), **Waiting on others**, then the inbox count. Do not list everything; the script already caps each section. Below the block add at most two sentences: what to take first and why, and whether the inbox needs a clarify pass (ten or more unclarified entries). If Justin asks in the morning, this is the whole answer.

## Rules

- Write only through `remember`, `update`, `done`, `trash`, `move` and `gh issue comment` on entries. Never edit the tree, the labels, or a wayfinder ticket from this skill.
- The tree is dumb on purpose. Wayfinder map oneezy/brain#3, ticket #4, decides the real layout; until then, file into the nearest category and move on.
- Read back every write. Report the number the tool returned, not a guess.
- One entry per thing. Dates go in `Due:` lines, never in titles.
- Never print secrets into an entry. Bills carry amounts, not account numbers.
