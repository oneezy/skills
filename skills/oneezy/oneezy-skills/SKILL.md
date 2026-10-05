---
name: oneezy-skills
description: "Keep Justin's skills in sync from the skills library (oneezy/skills), and add new ones to it. Use when Justin says 'sync my skills', 'update skills', 'install skills', 'add <owner/repo> skills', 'add this skill', 'my skills are missing', or when a /oneezy-* skill he asks for is not available in this session."
argument-hint: "empty to sync | add <owner/repo or skill URL> | update | status | unlink | --plan"
---

One library, oneezy/skills, holds every skill Justin uses: his own under `skills/`, third-party ones declared in `skills-sync.json`. The published tool, `@oneezy/skills-sync`, links them into every harness. This skill runs the tool through the script beside this file and reports what it printed; for an add it also lands the change in the library and releases it.

## Do

Run the script for the platform. It makes one call, `npx --yes @oneezy/skills-sync@latest`, with Justin's words mapped to the tool's arguments, so `npx` (Node 20+) and `git` must be on the path.

- Windows: `powershell -File <this skill folder>/scripts/sync.ps1 [args]`
- Linux, macOS, WSL, cloud: `bash <this skill folder>/scripts/sync.sh [args]`

| Justin says | run |
|---|---|
| sync, update, my skills are missing, nothing | no arguments |
| add `<owner/repo>`, add this skill (a link to one) | the **Add** steps below |
| update Matt's (or any third-party) skills to upstream | `update` |
| what is linked, what is missing | `status` |
| remove the links | `unlink` |
| show what it would do | `--plan` |

No arguments is a quiet sync: the first run on a machine clones the library into `~/.skills-sync`; every run pulls it, moves third-party skills to upstream's tip when a pull is due (a pinned skill stays at its pin), rebuilds the layers and links every skill into the user folders (`~/.claude/skills`, `~/.agents/skills`). Nothing changed, nothing printed. The WSL fan-out happens only when Justin runs the tool himself, without `--quiet`. `update` is the tool's `refresh`; `status`, `unlink` and `--plan` pass through as they are.

## Add

Justin asking for an add is his word to land it with no review. Pushing a `land/<topic>` branch is the whole hand-off: the `land` workflow (`.github/workflows/land.yml`) checks it, squashes it into `dev`, promotes `main` and releases, so no session merges anything. The add is done when the new release is out and the skills are linked on this machine. The add is written in a fresh clone of its own, never in the library this machine syncs from (`~/.skills-sync`, or the checkout it links to): a library with local changes stops pulling.

1. **Name the source.** `owner/repo` takes every skill under the repo's `skills/` (or its root). A link to one skill, `https://github.com/<owner>/<repo>/tree/<ref>/<path>/<name>`, is `<owner>/<repo>#<ref>` with `--root <path> --skills <name>`. Several named skills of one repo go in one `--skills a,b`. A source already declared in `skills-sync.json` is not added again: edit its `skills` list in the clone instead, then run the tool's `refresh` there.
2. **Write it in a clone.** Clone `https://github.com/oneezy/skills` at `dev` into a temporary folder, branch `land/add-<id>`, then in that folder run the script with `add <source> [flags] --repo .`, then `build --repo .`, then `check --repo .`. Done when `check` exits 0 and the new plugin is under `plugins/`.
3. **Push and wait.** Commit (conventional subject, the harness's attribution trailers) and `git push -u origin land/add-<id>`. Then watch over REST (`gh api`): the `land` run for that branch (`repos/oneezy/skills/actions/runs?branch=land/add-<id>`), then the `library` release run it starts on `main`. Done when `repos/oneezy/skills/releases/latest` is a new `release-<n>`. A red `land` run lands nothing: report its failing step and stop.
4. **Link it here.** Run the script with `--pull --quiet` and delete the temporary folder.

A push refused for lack of access to oneezy/skills ends the add: say so in one line, and that a session with oneezy/skills in scope (the AI Workflow project, or Claude Code on the PC) can run the same add.

## Report

One line per change the tool printed, then its summary line; an add ends with the release tag and the skills it linked. Say plainly when a skill is reported gone upstream (the tool names the fix: deselect it in `skills-sync.json`, or keep a copy under `skills/` as an own skill) and when something was left alone as a conflict. If a skill Justin asked for is still missing after a sync, say which and stop; the fix belongs in the library.

## Boundaries

- The tool links; that is all it writes into a harness or a project. Hooks and settings stay untouched, and `check` is a command people and CI run, never a hook.
- Own skills are edited in the library, `skills/<group>/<name>/`, where every link points. Third-party skills change through `update` only; the copies the tool makes stay as it wrote them.
