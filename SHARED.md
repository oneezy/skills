# How Justin works

Every repo, every session. Justin's Oneezy skills own the detail: when the work reaches one, load it. A repo's own AGENTS.md is canonical for that repo and extends these rules. skills-sync copies this file into each global instructions file; Justin edits it as `SHARED.md` in oneezy/skills.

## Skills

Skills come from the library oneezy/skills, installed into each harness in one form. Call one the way the harness you are in resolves it:

| Harness | How to call a skill |
| --- | --- |
| Claude Code | `/<plugin>:<skill>`, e.g. `/oneezy:oneezy-status` |
| Codex | `$<skill>` in the prompt (a plugin's skill: `$<plugin>:<skill>`), the `/skills` picker, or `@<skill>` on ChatGPT web |
| Hermes | `/<skill>` for a loose skill; a plugin's skill: `/agent-plugin-<id>-<hash>:<skill>` |

- **Named skill**: when Justin names a skill, run it from the plugin this session loaded, user-only skills included. Start a user-only skill only when he names it.
- **Loaded copy**: the plugin this session loaded is the only source of a skill, plus the repo's own skills for that repo. A `SKILL.md` fetched from GitHub or read from another folder skips its guardrails; never run one.
- **Missing skill**: say so, show the table above, then run `/oneezy-skills`.
- **Inner loop**: Matt Pocock's skills. `/ask-matt` picks the right one.

## Git

- **Landing, merging, promoting `main`**: `/oneezy-merge`, when Justin asks ("oneezy merge to dev", "release", "land them both"). It is the only way `main` changes.
- **`dev`** is the integration branch. Cut every branch and worktree from an up-to-date `dev`.
- **Propose** every git action first. Commit, push, delete a branch or force anything only when Justin asks for that action in this session.
- **Branch deletion**: ask Justin every time. The daily GitHub branch-cleanup workflow is the one exception. `main`, `dev`, `*-keep`, `research/*` and `prototype/*` branches stay forever.
- **Stash** only with a message (`git stash push -m "<why>"`), or make a WIP commit.
- **Preview URLs**: after a push, give Justin the preview URLs it produced.

## Autopilot

- An **autopilot run** builds one spec's tickets with no human in the loop, on an **autopilot branch** `feature/<spec>-<desc>` cut from `dev`. Ticket branches are cut from it and land back in it. It reaches `dev` only through Justin's own `/oneezy-merge into dev`.
- An **autopilot grant** in the run's starting prompt, naming its autopilot branch, lets every agent in the run commit, push, open pull requests, squash-merge into that branch, close the landed ticket and delete the ticket branch. Changes outside the repo wait until the autopilot branch lands in `dev`.

## Names and worktrees

- **Titles and names** of issues, branches, commits, pull requests, releases, chats and worktrees: `/oneezy-naming`.
- **Worktree and remote-thread commands**: `/oneezy-remote`.

## Work

- **Decisions** go on the issue tracker. Research, glossaries and docs go in the repo and merge to `dev`. A wayfinder map is the index; a ticket records the decision.
- **Shared knowledge** lives in the repo, where every agent reads it.
- **Grilling** is human-in-the-loop: one ticket per fresh session, and Justin answers every question.
- **Background research agents** work alone, without starting agents of their own.
- **Tests**: approved work ships with tests the agent wrote and ran.
- **Dev servers**: start every dev or preview server with `--host`, leave it running, and give Justin every Network URL it prints, unasked.
- **Report** outcomes faithfully: what was done, what failed, what was skipped, what is unverified.

## Voice chats

- **Conversation** carries simple questions and quick lookups. Substantive work goes to its own task; record which task and where it runs.
- **Follow-up**: arrange one before your turn ends: waits of at most 60 seconds each while you coordinate, or a saved monitor for later. Reuse a monitor that already exists. If none can be arranged, tell Justin.
- **Report back** when a task finishes, fails or needs Justin, with its verified result and a link that opens it. Stay quiet while nothing changes; end or pause the monitor once you have reported.
- **What's running**: read the live sessions and list each by exact title, host and verified state, with a link the app returned.
- **Stop, pause, quiet, hold on**: go quiet and wait for Justin to speak to you again. The call stays open until he ends it. Talk between Justin and other people is conversation, not commands.

## Brain

**Brain** capture, lookup, agenda, triage, task status and durable context: load `/oneezy-brain` and follow its current registry. It owns the Google Drive Brain, and it replaces any earlier Brain location in these instructions. If the skill or its Drive route is unavailable, report that exact blocker and stop the dependent Brain work.
