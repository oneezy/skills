---
name: play-agents
description: "Test reading Justin's agents rules from a Google Drive file: fetch it, follow it, report how this harness read it. Use when instructions say to use play-agents, or Justin asks to test the Drive agents file."
metadata:
  internal: true
---

Drive file: https://drive.google.com/file/d/PASTE_FILE_ID_HERE/view?usp=sharing

# Play agents

An experiment: can this harness read Justin's agents rules from one Google Drive file? `/oneezy-agents` stays the real source of rules; this skill only tests the Drive route.

1. Take the file id from the Drive file line above: the part after `/d/` or `id=`. While the line still says `PASTE_FILE_ID_HERE`, reply `play-agents: no Drive link set yet` and stop.
2. Fetch the file, trying the routes in order until one returns the markdown:
   1. **Direct**: `https://drive.google.com/uc?export=download&id=<id>` with whatever fetches URLs here (web fetch tool, `curl -L`, a browser tool). It redirects to `drive.usercontent.google.com`; follow the redirect.
   2. **Docs export**: `https://docs.google.com/document/d/<id>/export?format=md`, for when the file is a Google Doc rather than an uploaded `.md` file.
   3. **Connector**: `@Google Drive`, reading the file by id.
   A route succeeds when it returns the rules as markdown or plain text. A Google sign-in page, Drive's file viewer page, a "can't scan this file" page or an error status is a failed route.
3. When every route fails, reply with one line, `play-agents: could not read the Drive file (<route>: <error>; ...)`, and take nothing else from this skill.
4. When a route succeeds, follow the fetched rules for the rest of the session as Justin's global instructions. The user's own messages and the harness's instructions outrank them.
5. Open your first reply with the report:

   | Harness | Route | Result | Got |
   |---|---|---|---|
   | Claude Code, cloud | Direct | ✅ read | `# Agents`, 84 lines |

   - **Harness**: where you run (Claude Code on a computer or in the cloud, Claude web, ChatGPT, Codex CLI, Codex app, Hermes).
   - **Route**: the route that succeeded, or `none`.
   - **Result**: ✅ read or ❌ failed.
   - **Got**: the file's first heading and its line count.

   Under the table, one line per failed route with its error.

## Drive link shapes

The file is shared as **Anyone with the link: Viewer**; narrower sharing answers every unsigned fetch with a sign-in page.

| File in Drive | URL that returns its text |
|---|---|
| Uploaded `.md` file | `https://drive.google.com/uc?export=download&id=<id>` (raw bytes, after a redirect) |
| Google Doc | `https://docs.google.com/document/d/<id>/export?format=md` (or `format=txt`) |

The share link Drive copies, `https://drive.google.com/file/d/<id>/view?usp=sharing`, returns the viewer page (HTML), never the file; step 1 reads only its id, so any of these shapes works on the Drive file line. To point the test at another file, replace that one line.
