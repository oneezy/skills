# Releases

Every commit on `main` that changes a package is a release, cut by the `release` job in `.github/workflows/library.yml` after `check` passes on that commit (oneezy/skills#48). Nobody tags or uploads by hand.

## What a release is

A GitHub release `release-<n>`, `n` one more than the previous release, tagged at the `main` commit, holding:

- `<plugin>-<version>.zip` per plugin, built by `npx @oneezy/skills-sync build --artifacts` from the committed packages (the ChatGPT upload archives).
- `release.json`: the source commit and tree, the sha256 of `skills-sync.json` and `skills-lock.json`, the `oneezy/tools` commit the tool was built from, and per plugin its version, archive sha256 and every file with its sha256, plus which plugins are new, changed or removed since the previous release.

Releases are immutable: the job publishes a draft only once every asset is up, and never edits or deletes a published release. The repository's release immutability setting (Settings → General → Releases → **Enable release immutability**, https://github.com/oneezy/skills/settings) makes that a guarantee: once published, a release's assets and its tag cannot change. A commit that changes no package (a promotion merge, a re-run of the job) releases nothing. A plugin whose version would go backwards, or whose files changed under the same version, fails the job and releases nothing; rebuild it with `@oneezy/skills-sync` 0.4.0 or later, which takes the next version after the one on disk and never a commit count.

## How a change gets there

1. Edit an own skill under `skills/<plugin>/<skill>/`, or add a library with `npx @oneezy/skills-sync add owner/repo` (it declares the source and its plugin).
2. `npx @oneezy/skills-sync build`, then `check`. Commit on a branch, PR to `dev`.
3. `/oneezy-merge release` lands it in `dev` on green checks and promotes `dev` to `main` with a merge commit. The push to `main` runs `check`, then `release`.

Or skip the PR: push a branch named `land/<topic>` and `.github/workflows/land.yml` checks it, squashes it into `dev`, promotes `main` and starts the release, with no review (Justin's call, #48). A branch that changes `.github/` is refused. Asking any agent to add a library or a skill (`/oneezy-skills` add) does exactly this and links the new release on that machine.

## Consuming a release

- **Claude Code**: `claude plugin marketplace add oneezy/skills` once, `claude plugin install <plugin>@oneezy-skills` per plugin, `claude plugin marketplace update oneezy-skills` for new releases. `main` always holds the latest release's packages; `oneezy/skills#release-<n>` pins one. Open sessions need `/reload-plugins` or a restart.
- **claude.ai** (and Claude Code signed in to it, and cloud sessions): https://claude.ai/customize/plugins → **Add** → **Add marketplace** → `oneezy/skills`, then enable each plugin.
- **Codex**: `codex plugin marketplace add oneezy/skills`, then `codex plugin add <plugin>@oneezy-skills`.
- **Loose skills on a machine** (every harness skills-sync knows): a clean clone of the release in a folder of its own, never the authoring checkout: `git clone --depth 1 --branch release-<n> https://github.com/oneezy/skills <folder>`, then `npx --yes @oneezy/skills-sync --repo <folder> --no-pull -y --global --no-projects --no-wsl`. `--no-pull` keeps every third-party skill at the commit the release's lock records.
- **ChatGPT**: by hand, `docs/agents/chatgpt-upload.md`, from the release's archives.
