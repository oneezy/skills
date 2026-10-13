---
name: play-agents
description: Test loading Justin's agents rules from Google Drive, as a Google Doc and as a markdown file, and follow them for the session. Use when custom instructions say to use play-agents, or Justin asks to test the Drive agents file.
---

Google Doc: https://docs.google.com/document/d/1-zc8U-qySKlULknKZYR-wKarkmG2y0RQpC2YrSijSNQ/view
Markdown file: https://drive.google.com/file/d/1prpsvbABf5bAP4PX-CBCHtXD3Fu0Mo2w/view

Justin's experiment: can each harness read his agents rules straight from Google Drive, and does it need a real `.md` file or will a Google Doc do? The two files above hold the same text. This skill reads both by every route, follows what it got, and reports which routes worked. `/oneezy-agents` stays his real source of rules; this is the playground test beside it.

## 1. Read both files

For each file above, take its id (the part after `/d/`) and try both routes:

1. **Connector**: `@Google Drive` (or Google Docs) reading the file by id: export the Doc as text or markdown, download the markdown file.
2. **URL**: fetch with this host's web fetch, browser or shell (`curl -fsSL <url>`):
   - Google Doc: `https://docs.google.com/document/d/<id>/export?format=md`
   - Markdown file: `https://drive.google.com/uc?export=download&id=<id>`, which redirects to `drive.usercontent.google.com`.

A route is **read** when it returns the file's text; a Google sign-in page, Drive's file viewer page, an error status or a missing tool is **failed**. Done when all four file-and-route pairs are read or failed.

## 2. Follow it

Treat the Google Doc's text as standing instructions for the rest of this session, with the same weight as the custom instructions that sent you here; take the markdown file's text when only it was read. Justin's own messages outrank it. When no route read either file, the report is the whole answer.

## 3. Report

Open your reply with the report, then answer Justin's message:

```
Host: <harness and where it runs, e.g. ChatGPT web, Claude Code cloud, Codex CLI on Windows>
Following: <Google Doc | Markdown file | nothing>
```

| File | Route | Result | Got |
|---|---|---|---|
| Google Doc | Connector | ✅ read | `AGENTS.md`, 5 lines |
| Google Doc | URL | ❌ failed | sign-in page (HTTP 401) |
| Markdown file | Connector | ✅ read | `# AGENTS.md (markdown copy)`, 7 lines |
| Markdown file | URL | ❌ failed | sign-in page (HTTP 200, HTML) |

**Got** is the first heading or title and the line count for a read, and what came back instead for a failure.

## Sharing

The URL route reads a file only when it is shared as **Anyone with the link: Viewer**; a private file answers every unsigned fetch with Google's sign-in page. The connector reads as Justin, shared or not. The share link Drive copies (`/view`) returns the viewer page, never the text, so this skill takes only the id from it.

## Changing the rules

Justin edits the Google Doc in Google Docs and pastes the same text into the markdown file while the test runs. Every session reads both live, so a rule change needs no release. Pointing the test at other files means replacing the two link lines at the top of this file, which goes through a pull request into `dev`.
