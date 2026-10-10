# Releases

Every commit on `main` that changes a package is a release, cut by the `release` job in `.github/workflows/library.yml` after `check` passes on that commit (oneezy/skills#48). Nobody tags or uploads by hand.

## What a release is

A GitHub release `release-<n>`, `n` one more than the previous release, tagged at the `main` commit, holding:

- `<plugin>-<version>.zip` per plugin, built by `npx @oneezy/skills-sync build --artifacts` from the committed packages (the ChatGPT upload archives).
- `release.json` (schema 3): the source commit and tree, the sha256 of `skills-sync.json` and `skills-sync.lock.json`, the `oneezy/tools` commit the tool was built from, and per plugin its version, archive sha256 and every file with its sha256, plus which plugins are new, changed or removed since the previous release.

Releases are immutable: the job publishes a draft only once every asset is up, and never edits or deletes a published release. The repository's release immutability setting (Settings → General → Releases → **Enable release immutability**, https://github.com/oneezy/skills/settings) makes that a guarantee: once published, a release's assets and its tag cannot change. A commit that changes no package (a promotion merge, a re-run of the job) releases nothing. Authored plugins use the explicit `library.version` in `skills-sync.json`, shared by every authored group. Increment patch for `🐛 fix(scope): subject`, minor for `✨ feat(scope): subject`, major for `!` or a `BREAKING CHANGE:` footer. Other conventional types do not bump. Choose the highest bump once per release; the generator never bumps for file changes. The reusable calculator in `oneezy/tools`, `packages/skills-sync/scripts/release-version.mjs`, prints the next version without changing files or publishing. Complete automated version edits, tags and changelogs remain tracked in oneezy/tools#135; layerdbiz/tridentcubed#157 adopts that tool.

An authored plugin with changed files under the same version, or a lower semantic version, fails the release. Third-party plugins use their source's locked upstream version: different commits and pinned skills are recorded separately. An upstream snapshot can change without a new version, and an intentional downgrade retains the older upstream version. An unversioned source has `version: null`; no substitute version is assigned. Each plugin's release record includes `versionScheme` (`authored` or `upstream`), commit, content digest and archive digest. Migration from old generated versions uses these rules; a synthetic wrapper minor cannot block a correct upstream version. GitHub bundle tags remain `release-<n>` and identify immutable archives separately from their source versions.

## How a change gets there

1. Edit an own skill under `skills/<plugin>/<skill>/`, or add a library with `npx @oneezy/skills-sync add owner/repo` (it declares the source and its plugin).
2. For authored changes, set `library.version` to the planned semantic release version, then `npx @oneezy/skills-sync build` and `check`. Commit on a branch, PR to `dev`.
3. `/oneezy-merge release` lands it in `dev` on green checks and promotes `dev` to `main` with a merge commit. The push to `main` runs `check`, then `release`.

Or skip the PR: push a branch named `land/<topic>` and `.github/workflows/land.yml` checks it, squashes it into `dev`, promotes `main` and starts the release, with no review (Justin's call, #48). A branch that changes `.github/` is refused. Asking any agent to add a library or a skill, update, upgrade or downgrade a source, or add, remove or promote a playground skill (`/oneezy-skills`) does exactly this, links the new release on that machine and runs `/oneezy-migrate`.

## Consuming a release

- **Claude Code**: `claude plugin marketplace add oneezy/skills` once, `claude plugin install <plugin>@oneezy-skills` per plugin, `claude plugin marketplace update oneezy-skills` for new releases. `main` always holds the latest release's packages; `oneezy/skills#release-<n>` pins one. Open sessions need `/reload-plugins` or a restart.
- **claude.ai** (and Claude Code signed in to it, and cloud sessions): https://claude.ai/customize/plugins → **Add** → **Add marketplace** → `oneezy/skills`, then enable each plugin.
- **Codex**: `codex plugin marketplace add oneezy/skills`, then `codex plugin add <plugin>@oneezy-skills`.
- **Loose skills on a machine** (every harness skills-sync knows): a clean clone of the release in a folder of its own, never the authoring checkout: `git clone --depth 1 --branch release-<n> https://github.com/oneezy/skills <folder>`, then `npx --yes @oneezy/skills-sync --repo <folder> --no-pull -y --global --no-projects --no-wsl`. `--no-pull` keeps every third-party skill at the commit the release's lock records.
- **ChatGPT**: by hand, `docs/agents/chatgpt-upload.md`, from the release's archives.
