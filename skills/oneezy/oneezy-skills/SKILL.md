---
name: oneezy-skills
description: "Keep Justin's skills in sync from the skills library (oneezy/skills). Use when Justin says 'sync my skills', 'update skills', 'install skills', 'add <owner/repo> skills', 'my skills are missing', or when a /oneezy-* skill he asks for is not available in this session."
argument-hint: "empty to sync | add <owner/repo> | update | status | unlink | --plan"
---

One library, oneezy/skills, holds every skill Justin uses: his own under `skills/`, third-party ones declared in `skills-sync.json`. The published tool, `@oneezy/skills-sync`, links them into every harness. This skill runs the tool through the script beside this file and reports what it printed.

## Do

Run the script for the platform. It makes one call, `npx --yes @oneezy/skills-sync`, with Justin's words mapped to the tool's arguments, so `npx` (Node 20+) and `git` must be on the path.

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

No arguments is a quiet sync: the first run on a machine clones the library into `~/.skills-sync`; every run pulls it, moves third-party skills to upstream's tip when a pull is due (a pinned skill stays at its pin), rebuilds the layers and links every skill into the user folders (`~/.claude/skills`, `~/.agents/skills`). Nothing changed, nothing printed. The WSL fan-out happens only when Justin runs the tool himself, without `--quiet`.

`add` and `update` are the tool's `add` and `refresh`: they write the library (config, snapshots, lock, working set) and nothing outside it. Once either has changed the library, run the script again with no arguments so what it brought in gets linked. `status`, `unlink` and `--plan` pass through as they are.

## Report

One line per change the tool printed, then its summary line. Say plainly when a skill is reported gone upstream (the tool names the fix: deselect it in `skills-sync.json`, or keep a copy under `skills/` as an own skill) and when something was left alone as a conflict. If a skill Justin asked for is still missing after a sync, say which and stop; the fix belongs in the library.

## Boundaries

- The tool links; that is all it writes into a harness or a project. Hooks and settings stay untouched, and `check` is a command people and CI run, never a hook.
- Own skills are edited in the library, `skills/<group>/<name>/`, where every link points. Third-party skills change through `update` only; the copies the tool makes stay as it wrote them.
