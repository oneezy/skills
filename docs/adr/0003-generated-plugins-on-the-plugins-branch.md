# ADR-0003: Built plugins live on the `plugins` branch; the catalogs on `main` point there with `git-subdir`

Date: 2026-09-30. Status: accepted. Decided on oneezy/skills#18 and #20 under Justin's autopilot grant.

## Context

A git-hosted Claude Code marketplace resolves relative plugin paths from its own clone, so a package listed as `./plugins/x` must be committed on the branch users add. Committing built packages on `dev`/`main` would duplicate every `SKILL.md`, which makes `npx skills update` treat the library's own skills as ambiguous, and would put generated files under review on every change. Claude Code's `github` source reaches a ref but not a subdirectory; `git-subdir` reaches both. Codex's catalog has the same source type.

## Decision

`build --plugins` writes `plugins/<id>/`, gitignored. CI's publish job commits `plugins/` (with the lock it was built from) to the branch `plugins`, append-only, skipping unchanged trees, recording the `main` commit and every upstream commit in the message, and refusing an older `main` than the one last published. The committed catalogs on `dev`/`main` list each plugin as `{ "source": "git-subdir", "url": "oneezy/skills", "path": "plugins/<id>", "ref": "plugins" }`. The `.claude-plugin/plugin.json` inside a package carries no `version`, so Claude Code tracks the `plugins` commit; the portable and legacy manifests carry `0.<commit count>.0+<sha>`.

## Consequences

- `/plugin marketplace add oneezy/skills` clones `main` and pulls packages from `plugins`; a new publish is a new version for every user on `marketplace update`.
- Builds are a pure function of the committed lock (CI refreshes frozen), so the `plugins` branch is reproducible from `main`.
- The workflow never commits to `dev` or `main` and ignores pushes to `plugins`, so a generated commit cannot trigger another.
- Reversal means committing `plugins/` on `main` and switching the catalogs to relative paths, at the cost above.
