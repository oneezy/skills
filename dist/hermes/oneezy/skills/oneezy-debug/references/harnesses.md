# What each harness exposes

Read this when `scripts/trace.mjs` prints `Transcript not available`, or there is no shell. Find the row for the harness you are in, then fill each block line from its column. A cell that says `not available in this harness` goes into the block as written.

| Harness | Recognise it by | Session | Times |
|---|---|---|---|
| Claude Code (CLI, desktop, cloud) | `CLAUDECODE=1`; `CLAUDE_CODE_ENTRYPOINT` names the surface; `CLAUDE_CODE_REMOTE=true` in the cloud | Cloud: `CLAUDE_CODE_REMOTE_SESSION_ID` is `cse_<x>`, the link is `https://claude.ai/code/session_<x>`. Local: `claude --resume <CLAUDE_CODE_SESSION_ID>` | The script reads `~/.claude/projects/<cwd>/<session>.jsonl` (measured) |
| Codex (CLI, app, IDE) | `CODEX_THREAD_ID` is set in the shell | `codex resume <CODEX_THREAD_ID>` | The script reads `~/.codex/sessions/**/rollout-*-<thread>.jsonl` (measured) |
| Cowork (Claude desktop) | Your system prompt names Cowork | With `CLAUDECODE=1` in its shell, the Claude Code row applies. Otherwise not available in this harness | Clock read in the shell (measured) |
| Hermes | Your system prompt names Hermes | not available in this harness | Clock read in the terminal tool (measured) |
| ChatGPT (web, desktop, mobile) | Your system prompt names ChatGPT | not available in this harness; the link is in the browser's address bar, for Justin to paste | Clock read in the Python tool when it is on (measured); otherwise not available in this harness |
| Claude.ai chat (web, desktop, mobile) | Your system prompt names Claude.ai, with no shell of your own | not available in this harness | Clock read in the code execution tool when it is on (measured); otherwise not available in this harness |

## Clock reads

A clock read is one command run just before a step, and its time is that step's start; the next read ends it. The read itself is not a row.

- bash: `date -u +%H:%M:%S.%3N`
- PowerShell 7: `Get-Date -AsUTC -Format HH:mm:ss.fff`
- Python: `datetime.now(timezone.utc).strftime('%H:%M:%S.%f')[:-3]`

## Hand-filled lines

- **Harness**: the row you matched. From an environment variable it is measured; from your system prompt it is reported.
- **Model**: your system prompt's model name, reported.
- **Skills**: the skills you loaded or read a `SKILL.md` for this turn, reported.
- **Status**: from the command's exit code or the tool's error, measured; your own judgement of a step with no tool, reported.
