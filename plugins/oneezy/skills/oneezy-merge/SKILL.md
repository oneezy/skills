---
name: oneezy-merge
description: "Land the current branch and end with one status report. Bare, or 'this pr': commit, push, open the PR, wait for every check on it. 'into <branch>': the same, then squash-merge on green checks and delete the landed branch. 'release', 'both', 'dev and main': the same into dev, then promote dev to main."
disable-model-invocation: true
argument-hint: "empty or 'this pr' to open for review; 'into dev' to merge; 'release' (or 'both', 'dev and main') to merge into dev and promote to main"
metadata:
  internal: true
---

Invoking this skill is Justin's word to commit and push the current branch. It does the actions for its mode and ends by running `/oneezy-status`, exactly once; that report is the only message. Works in any repo on GitHub, whatever its checks are (GitHub Actions, Vercel, other apps); nothing is hardcoded.

## Mode, from the arguments

- **open**: no argument, or words that name no branch (`this pr`, `pr`, `branch`). Commit, push, open the PR, wait for the checks, report. Nothing is merged or deleted: Justin checks the branch.
- **land**: the argument names one branch (`into dev`, `to dev`, `dev`). Everything in open, then squash-merge on green checks, fast-forward, delete the landed branch. The target is the named branch and only that branch; `main` alone is a target only when the argument says `main`.
- **release**: `release`, `both`, `dev and main`, `into dev and main`, `to dev and main`. Everything in land into `dev`, then promote `dev` to `main` (step 5). When the current branch is `dev` itself, or the branch is already landed, release is only the promotion.

PR base: the named branch in land mode, `dev` in release mode. In open mode, `dev` when origin has it, else origin's default branch.

## Quiet

No text between steps. The status report is the only message. One exception: a check that fails before a report can be built (push refused, PR refused, promotion refused) is reported in one line, and the walk stops.

## Steps

Each step names its calls. Nothing exploratory runs between them; one schema load at the start if the harness needs it.

1. **Commit and push**, one shell call: stage the session's files, commit with a conventional subject carrying the ticket number and the harness's attribution trailers, `git push -u origin <branch>`. Done when the push is accepted.
2. **Open the PR**, one call, against the base. Body: `## Summary` holding `Closes #<n>` and the **snapshot** (at most five bullets of what landed; the status report reuses them verbatim), `## Evidence` (before and after, one line each), `## Merge Danger` (door: one-way or two-way; blast radius: one word, one line why). Done when the PR number is returned.
3. **Wait for the checks** on the PR's head commit: its check runs (`gh api repos/<owner>/<repo>/commits/<sha>/check-runs`: every GitHub Actions job and app check, the repo's own CI among them) and its commit statuses (`.../commits/<sha>/status`: Vercel and other status apps). While any check run is queued or in progress, or any status is pending, sleep 90 seconds in the background and read again, nothing else. Done when every one has finished. Green means every check run concluded success, skipped or neutral and every status is success; any other conclusion (failure, cancelled, timed out, action required) or status (failure, error) is red: skip steps 4 and 5. A head with no check and no status after the first 90-second wait is green with nothing checked, and the report says so.
4. **Land** (land and release modes, all checks green): squash-merge with the expected head SHA, title = PR title plus `(#<pr>)`. Then one shell call: fetch, verify `origin/<base>` contains the squash commit (stop if not), check out the base, fast-forward, delete the remote branch and the local branch once. A refused delete is left for the report, not retried. Another session's worktree is never touched; this session's own cannot remove itself.
5. **Promote** (release mode only): fast-forward `main` to `dev` on origin (`git push origin origin/dev:main`). When origin refuses because `main` is not an ancestor of `dev` (the repo promotes through release PRs), open a PR `dev` → `main` titled `release: promote dev to main (<the landed PR's prefix or ticket>)` whose body lists the commits since the last promotion, merge it with a merge commit (never squash: `dev` must stay an ancestor of `main`), and verify `origin/main` contains the merge. Then one shell call: fetch, fast-forward the local `main` ref (`git fetch origin main:main` when `main` is not checked out anywhere; `git pull --ff-only` in the checkout that has it), and verify the promotion by what holds for either path: `origin/dev` is an ancestor of `origin/main` (`git merge-base --is-ancestor origin/dev origin/main`) and the two trees are identical (`git diff --quiet origin/dev origin/main`). After a merge-commit promotion `main` has a commit `dev` lacks, so the two never point at the same commit; that is expected. Nothing is deleted: `dev` and `main` are permanent. Then wait for the checks on `origin/main`'s new head as in step 3 (in a repo whose push to `main` cuts a release, such as oneezy/skills, that job is among them) and keep the release it made for the report. Done when `main` contains `dev` with the same tree and its checks are green.
6. **Report**: run `/oneezy-status`. It reads the state and renders the message, Next Up and the next session's prompt included. In release mode the Git line names both moves: the squash into `dev` and the promotion of `main`, and the release tag when a job on `main` cut one.

Budget: open mode at most four calls before the report, land mode at most six, release mode at most ten, not counting the background sleeps.

## Not this skill

Publishing a package (`npm publish`), tagging a version by hand, or writing release notes is a release skill's job, not a merge's; a release a repo's own workflow cuts on `main` is reported, never made here. When a repo needs one by hand, say so in the report's Next Up and stop.
