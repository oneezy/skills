## Land

For a normal requested update/add/playground change, use the landing path below. A development, review-only or no-publication request instead uses an isolated review branch and stops at the verified artifact; never push land/* or promote main in that scope. Preserve existing rollout branches and dirty work.

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

Then follow the authorized landing or review scope; the report names the skill as Justin will call it (`/play-unslop`).
