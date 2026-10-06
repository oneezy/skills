---
name: oneezy-migrate
description: "Apply the breaking and migration notes of third-party skill updates across Justin's repos (brain, skills, tools, ai-workflow, Trident), or say in one line that none applies. Use after every /oneezy-skills update, upgrade, downgrade or add, and when Justin says 'migrate my repos', 'migrate my repos to Matt 1.3.1' or 'catch up on what upstream changed'."
argument-hint: "an update report (skills-sync update --json) | <source> [<from>] <to>, e.g. 'matt-pocock 1.3.1'"
metadata:
  internal: true
---

Third-party skills change their conventions: Matt Pocock's 1.3.0 renamed `CONTEXT.md` to `GLOSSARY.md`, so a repo still holding `CONTEXT.md` and the skills that read it disagree. This skill reads what upstream says changed, finds which of Justin's repos still follow the old convention, changes them through each repo's own landing path, and reports one line per repo. Most runs find nothing: then nothing is changed and the whole report is one line.

## Input

One of:

- **An update report**: the JSON `npx --yes @oneezy/skills-sync@latest update --json` prints (from `/oneezy-skills`). Its `updated` array holds, per source that moved, `id`, `from` and `to` (each `{ version, commit, ahead }`), `direction` (`upgrade` or `downgrade`) and `changelog`, the upstream `CHANGELOG.md` sections between the two versions (null with `changelogReason` when there is none). A new source (`from` null) has no notes to apply.
- **A range Justin names**: "migrate my repos to Matt 1.3.1" is source `matt-pocock` up to `1.3.1`. Read the notes yourself from the source's `CHANGELOG.md` (`git clone --depth 1 --filter=blob:none https://github.com/<repo>` at the tag, or `ref`; the repo is in `skills-sync.json`, the nearest `CHANGELOG.md` at or above its `root`). With no lower version, take every section up to the named one: each note is applied only where its old convention is still present, so a wide range changes nothing already migrated.

A downgrade undoes notes: apply them in reverse only when Justin asked for the downgrade by version and the old convention is what that version's skills read; otherwise report the notes and change nothing.

## Do

1. **Extract the notes.** From the changelog text keep only what asks something of a consumer: sections or entries saying breaking, migration, rename, removed, "if you have an existing …", or a file or folder convention the skills read or write. Ignore entries that only change a skill's own wording. No such note: report `no migration notes for <source> <from> → <to>; nothing changed` and stop.
2. **Match a recipe.** `MIGRATIONS.md` beside this file holds every migration already worked out, keyed by source and version. A note with no recipe: write one there in the same shape (what to find, what to change, what to leave alone), then use it; it lands with the skills repo's change.
3. **Check each repo.** For every repo in the table below, look for the recipe's old convention (its `find`). Work in a fresh clone of the repo's base branch in a temporary folder, never in a checkout someone is working in. A repo where nothing matches is `no change`.
4. **Change and land.** In each repo that matches, apply the recipe on one branch, run the repo's own fast checks (its AGENTS.md names them), commit with a conventional subject naming the source and version (`docs: GLOSSARY.md replaces CONTEXT.md (matt-pocock 1.3.0)`), and land it the repo's way:

| Repo | Base | Lands by |
|---|---|---|
| `oneezy/skills` | `dev` | push `land/migrate-<slug>`; `.github/workflows/land.yml` squashes it into `dev`, promotes `main` and releases (run `npx --yes @oneezy/skills-sync@latest build --repo .` and `check --repo .` first) |
| `oneezy/brain` | `dev` | a ready pull request; its automerge workflow merges it on green |
| `oneezy/tools` | `dev` | a ready pull request; its automerge workflow merges it on green |
| `oneezy/ai-workflow` | `main` | a ready pull request; its automerge workflow merges it on green |
| `layerdbiz/tridentcubed` | its AGENTS.md says | a ready pull request to that base |

A pull request body says which upstream note it applies and links the source's changelog. A change under `.github/` never goes through `land/*` (the workflow refuses it) and never relies on automerge (which skips it): open the pull request and say it waits on Justin's merge. A repo this session cannot reach (not cloned, not in scope, push refused) is reported as `not reached` with the change it needs, so another session can run it.

## Report

One line per repo, in the table's order: `<repo>: <what changed>, <PR link or land/... branch>`, `no change`, or `not reached (<why>); needs <change>`. When every repo is `no change`, the report is the single line `<source> <from> → <to>: nothing to migrate`. Then one line per note left unapplied, with why.

## Boundaries

- Never re-run a third-party setup skill to apply a rename (`/setup-matt-pocock-skills` renames nothing, and its GitHub template writes `gh issue` commands, which undo the REST-only `docs/agents/issue-tracker.md` these repos keep).
- Change what the repo reads today: its own files and live docs. Dated records (`docs/research/`, `.research/`, ADR history, changelogs) and test fixtures of other tools (the skills-viewer examples in `oneezy/tools`) say what was true when written and stay as they are.
- Third-party skills are never edited, deselected or removed to fit a repo; the repo changes, or the note is reported.
- Own skills that name another repo's file (`skills/trident/*` naming Trident's `packages/ui/CONTEXT.md`) change in the same skills-repo landing as that repo's rename, never before it.
