---
name: oneezy-skills
description: "Keep Justin's skills in sync from the skills library (oneezy/skills). Use when Justin says 'sync my skills', 'update skills', 'install skills', 'add <owner/repo> skills', 'my skills are missing', or when a /oneezy-* skill he asks for is not available in this session."
argument-hint: "empty to sync | add <owner/repo> | update | status | unlink"
---

One library, `oneezy/skills`, is the source of truth for every skill Justin uses. Nothing is committed into projects and nothing is installed into a harness's settings. This skill runs the sync tool and reports.

## Do

Run the script beside this file. It calls `npx --yes @oneezy/skills-sync` with the arguments given, so `npx` (Node 20+) and `git` must be on the path.

- Windows: `powershell -File <this skill folder>/scripts/sync.ps1 [args]`
- Linux, macOS, WSL, cloud: `bash <this skill folder>/scripts/sync.sh [args]`

| Justin says | run |
|---|---|
| sync, update, my skills are missing, nothing | no arguments |
| add `<owner/repo>` (a new third-party library) | `add <owner/repo>` |
| update Matt's (or any third-party) skills to upstream | `update` |
| what is linked, what is missing | `status` |
| remove the links | `unlink` |
| show what it would do | `--plan` |

The first run on a machine with no library clones `oneezy/skills` into `~/.skills-sync`, restores the third-party skills the lock pins, and links every skill into `~/.claude/skills` and `~/.agents/skills`. Every later run is silent and changes nothing unless something changed. On Windows it also syncs the WSL distros it remembers.

## Report

One line per change the tool printed, then its summary line. Say plainly when a skill is reported gone upstream (it names the fix) or when something was left alone as a conflict. If a skill Justin asked for is still missing after a sync, say which and stop; do not improvise a copy.

## Never

- Edit a skill through a link in a user folder or a project. Own skills are edited in the library's `skills/<name>/`; third-party skills are updated with `update`, never by hand.
- Write hooks, settings or copies into any harness or project. The tool links; that is all.
