---
name: oneezy-skills
description: "Keep Justin's skills in sync from the skills library (oneezy/skills), move third-party sources between versions, add new ones, and run his playground. Use when Justin says 'sync my skills', 'update my skills', 'update the Matt Pocock skills', 'upgrade X', 'downgrade X to the previous release', 'what version of X am I on', 'install skills', 'add <owner/repo> skills', 'add this skill', 'add X to my playground', 'make a skill that does X in my playground', 'test this skill', 'remove X from my playground', 'move X from my playground into oneezy', 'my skills are missing', or when a /oneezy-* skill he asks for is not available in this session."
argument-hint: "empty to sync | update [<source>] | upgrade|downgrade <source> [to <version>|previous] | versions <source> | add <owner/repo or skill URL> | play add|create|remove|promote ... | status | unlink | --plan"
metadata:
  internal: true
---

One library, oneezy/skills, holds every skill Justin uses: his own under `skills/<group>/`, third-party ones from the sources in `skills-sync.json`, each recorded per source in `skills-sync.lock.json` with its upstream version and commit. The published tool, `@oneezy/skills-sync`, installs and links them. This skill runs the tool through the script beside this file; for any change to the library it lands the change as a release, links it here, then runs `/oneezy-migrate`.

## Do

Run the script for the platform. It makes one call, `npx --yes @oneezy/skills-sync@latest`, with the arguments given, so `npx` (Node 20+) and `git` must be on the path.

- Windows: `powershell -File <this skill folder>/scripts/sync.ps1 [args]`
- Linux, macOS, WSL, cloud: `bash <this skill folder>/scripts/sync.sh [args]`

| Justin says | do |
|---|---|
| sync, my skills are missing, nothing | the script with no arguments |
| update my skills, update everything | **Change**: `update` |
| update / upgrade the Matt Pocock (or any source's) skills | **Change**: `update <source> --to latest` |
| upgrade X to 1.4.0, downgrade X to 1.3.0 | **Change**: `update <source> --to <version>` |
| downgrade X, go back to the previous release | **Change**: `update <source> --to previous` |
| what version of X am I on, what versions does X have | the script with `versions <source>`; read the `*` line |
| add `<owner/repo>`, add this skill (a link to one) | **Add** |
| add X to my playground, play with X, test this skill | **Playground**: copy |
| make a skill that does X in my playground | **Playground**: create |
| remove X from my playground | **Playground**: remove |
| move X from my playground into oneezy (or trident) | **Playground**: promote |
| what is linked, what is missing | `status` |
| remove the links | `unlink` |
| show what it would do | `--plan` |

A `<source>` is a source id from `skills-sync.json`: Matt Pocock's skills are `matt-pocock`, PStack is `pstack`, Anthropic's frontend-design is `anthropic`, diagram-design is `diagram-design`. "Upgrade" and "update" mean the same thing.

No arguments is a quiet sync: the first run on a machine clones the library into `~/.skills-sync`; every run pulls it, installs every third-party skill exactly at the commit the committed lock records (nothing moves upstream on a sync), rebuilds the layers and links every skill into the user folders (`~/.claude/skills`, `~/.agents/skills`). Nothing changed, nothing printed. The WSL fan-out happens only when Justin runs the tool himself, without `--quiet`. `status`, `unlink`, `versions` and `--plan` pass through as they are.

## Land

Every change below is written in a fresh clone and landed the same way. Justin asking for the change is his word to land it with no review.

1. **Clone.** `git clone https://github.com/oneezy/skills` at `dev` into a temporary folder and create branch `land/<topic>` there. Never change the library this machine syncs from (`~/.skills-sync`, or the checkout it links to): a library with local changes stops pulling.
2. **Build and check.** After the change, in the clone: the script with `build --repo .`, then `check --repo .`. Done when `check` exits 0. Nothing changed in the clone (`git status` clean): there is nothing to land; report that and stop.
3. **Push.** Commit (conventional subject, the harness's attribution trailers) and `git push -u origin land/<topic>`. The `land` workflow (`.github/workflows/land.yml`) checks it, squashes it into `dev`, promotes `main` and releases; no session merges anything.
4. **Wait.** Over REST (`gh api`): the `land` run for the branch (`repos/oneezy/skills/actions/runs?branch=land/<topic>`), then the `library` release run it starts on `main`. Done when `repos/oneezy/skills/releases/latest` is a new `release-<n>`. A red `land` run lands nothing: report its failing step and stop.
5. **Link it here.** The script with `--pull --quiet`, then delete the temporary folder.
6. **Migrate.** Run `/oneezy-migrate` with the update report (the `--json` output from the change), or with "no update report" after a playground change. It changes nothing when no note applies.

A push refused for lack of access to oneezy/skills ends the change: say so in one line, and that a session with oneezy/skills in scope (the AI Workflow project, or Claude Code on the PC) can run the same request.

## Change

Moves third-party sources between upstream versions. Topic: `update-<sources>` (`update-all` when none is named).

1. In the clone, the script with `update [<source>] [--to <version>|previous|latest] --json --repo .`. `update` with no source moves every source to latest except one the config holds at a `version`. Keep the JSON: `updated` lists each source that moved with `from`, `to` (each `{ version, commit, ahead }`), `direction` and `changelog`; `config` lists the config change a hold needs. `{ "refused": ... }` (a version the source never released) ends the change: report the versions it names.
2. Apply `config` to `skills-sync.json` in the clone: `{ source, version: "1.3.0" }` sets `sources.<source>.version` to that string; `version: null` removes the key. This is what makes a downgrade or an exact version stick on every machine, and what clears it again on "update X" (`--to latest` prints the removal when a hold exists). The tool never writes the config itself.
3. **Land**, then the report: per moved source `<source>: <from version> → <to version>` (with `(+N commits)` when `ahead` is set, and the short commits), then the changelog's headings and its breaking or migration lines, not the whole text; `changelog: none (<reason>)` when the tool gave none. A downgrade lists what it undoes. Nothing moved: "every source is already at latest" (or at its held version) and no land.

## Add

Brings a new third-party source in. Topic: `add-<id>`.

1. **Name the source.** `owner/repo` takes every skill under the repo's `skills/` (or its root). A link to one skill, `https://github.com/<owner>/<repo>/tree/<ref>/<path>/<name>`, is `<owner>/<repo>#<ref>` with `--root <path> --skills <name>`. Several named skills of one repo go in one `--skills a,b`. A source already declared in `skills-sync.json` is not added again: edit its `skills` list in the clone instead, then run `update <source> --repo .` there.
2. In the clone, the script with `add <source> [flags] --repo .`. Done when the new plugin is under `plugins/` after **Land**'s build.
3. **Land**. The report ends with the release tag and the skills it linked.

## Playground

The `play` group (`skills/play/`) is where Justin tries a skill before it joins `oneezy` or `trident`. It is packaged and released like any group (`/play:<name>` as a plugin), and linked by its bare name (`/play-<name>`). Every skill in it is named `play-<name>`, always; `check` fails on one that is not. Topic: `play-<verb>-<name>`.

- **Copy** ("add PStack's unslop to my playground"): find the skill in its repo (a declared source's repo and `root` from `skills-sync.json`, or the repo Justin names), `git clone --depth 1` that repo into another temporary folder, and copy the skill's folder to `skills/play/play-<name>/`. In its `SKILL.md` frontmatter set `name: play-<name>` and add, inside `metadata:` (create the map when missing), `origin-repo: <owner/repo>`, `origin-path: <path of the folder upstream>`, `origin-commit: <full commit>`. Copy the nearest `LICENSE` at or above the skill's folder upstream into the skill's folder, so its notice travels with the copy. Change nothing else; the source keeps its own copy (`/unslop` stays).
- **Create** ("make a skill that does X in my playground"): write `skills/play/play-<name>/SKILL.md` (frontmatter `name` and a `description` that says what it does and when to use it, then the instructions) and a `flow.yaml` beside it in the shape `docs/agents/references.md` gives.
- **Remove**: delete `skills/play/play-<name>/`. The build drops its links and, with the last one, the `play` package.
- **Promote** ("move X from my playground into oneezy"): `git mv skills/play/play-<name> skills/<group>/<prefix>-<name>` with `group` `oneezy` and prefix `oneezy-` (for Trident, `trident` and `trident-`) unless Justin names the group or the new name; set the frontmatter `name` and `flow.yaml`'s `skill` to the new name, change every `/play-<name>` in the library's prose to the new token, and add the skill to that plugin's `description` in `skills-sync.json`.

Then **Land**; the report names the skill as Justin will call it (`/play-unslop`).

## Report

One line per change the tool printed, then its summary line; a landed change ends with the release tag, then the `/oneezy-migrate` report. Say plainly when a skill is reported gone upstream (the tool names the fix: deselect it in `skills-sync.json`, or keep a copy under `skills/` as an own skill) and when something was left alone as a conflict. If a skill Justin asked for is still missing after a sync, say which and stop; the fix belongs in the library.

## Boundaries

- Never remove or deselect a third-party skill to make room for one of Justin's, or to fix a name clash: rename his copy (`play-<name>`, or a rename in the config).
- Keep `disable-model-invocation` wherever upstream sets it.
- The tool links; that is all it writes into a harness or a project. Hooks and settings stay untouched, and `check` is a command people and CI run, never a hook.
- Own skills are edited in the library, `skills/<group>/<name>/`, where every link points. Third-party skills change through **Change** only; the copies the tool makes stay as it wrote them.
- Nothing updates on its own: no schedule, no refresh on sync. A source moves only when Justin asks.
