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
| what is installed, what is missing, am I done | `status` (the end-of-run `status --json` shows the same) |
| clean up my branches | `branches --plan`, show it, then `branches` on his yes (needs `GITHUB_TOKEN` or `GH_TOKEN`; ADR-0013) |
| take the tool off this machine | `unlink --plan`, then `unlink` on his yes (this machine only; run it inside each WSL distro too) |
| show what it would do | `--plan` |

A `<source>` is a source id from `skills-sync.json`: Matt Pocock's skills are `matt-pocock`, PStack is `pstack`, Anthropic's frontend-design is `anthropic`, diagram-design is `diagram-design`. "Upgrade" and "update" mean the same thing.

No arguments is a quiet sync, and it needs no checkout of the library: it reads the latest release of `oneezy/skills` on GitHub and, per harness found on the machine, writes the skills block into the global instructions file, keeps the one session-start hook entry, and brings the plugins in through the harness's own route (Claude Code: the claude.ai account plugins, nothing installed; Codex and Hermes: plugins from GitHub). Nothing is cloned, remembered or asked. Third-party skills are the committed lock's: a sync never moves a source. Nothing changed, nothing printed. On Windows the same sync runs inside every WSL distro. `status`, `unlink`, `branches`, `versions` and `--plan` pass through as they are; `status` reads GitHub and the machine and writes nothing. `hook` is what the harness's hook entry runs; do not run it by hand.

Old flags (`-y`, `--agents`, `--global`, `--no-projects`, `--no-pull`, `--no-remember`, `--repo` and the rest) still work on a machine command, do nothing, and are named once on stderr. Do not pass them. A library command (`update`, `add`, `versions`) takes `--repo <clone>`.

Every request ends with `status --json` and its open manual steps (`SKILL.md`, step 6).
