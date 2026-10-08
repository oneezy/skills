---
name: oneezy-brain
description: Capture, find, triage and update Justin's Brain in Google Drive. Use for remember this, save to my brain, what do we need to do, today's agenda, exact-ID lookup, mark done, or update memory and context. Orchestrates configured source plugins; capture never approves execution.
---

Read `references/location.md` first. Resolve its private registry through the authorized Drive account, then read live List and Schema. Drive owns current Brain tasks and context. GitHub issues and Spaces are retained history; never use them as fallback task state. If the route is unavailable, report the exact gap and stop dependent writes.

## Choose the operation

| Request | Operation |
| --- | --- |
| Remember, capture, note to self | Match source identity and meaning; update a matched Inbox subject or capture a new stable ID |
| What do we need to do, agenda | Read Backlog; render the agenda in `references/operations.md` |
| Pull up ID, find a subject | Exact-ID lookup across both tabs, or search meaning; load the owning context Doc |
| Select this | Explicit same-ID promotion; the item leaves Inbox |
| Done, status, move, rename | Update the exact authoritative record and modified time |
| Keep as knowledge, memory or reference | Update the canonical Doc; link any task; retire capture only on an explicit disposition |
| Archive, discard, restore | Apply Justin's disposition to the same ID; preserve history |
| Collect source updates | Follow `references/ingestion.md`; use configured accounts/scopes only |

Choose existing collection, organization, folder and project from the crosswalk and live records. Collections are personal/work; legacy AI ancestry maps into Work. Do not invent categories. Tentative ideas stay in Inbox. Priority, energy, estimates, owners and deadlines require evidence; unsupported cells stay blank with an explicit note. Appointments use date_start. GTD waiting and someday are separate from the seven task statuses.

Before a write, read `references/operations.md`. Serialize agent writers, reread exact targets, preserve user edits, apply one narrow native batch and read back by immutable ID. `scripts/drive-plan.mjs` plans capture, lookup, update, promotion, recovery and allowlisted publication from live snapshots; it performs no transport or installation. Use native Docs revision guards. Sheets has no revision compare-and-swap: refuse changed rows and verify after saving.

Load Drive/Sheets/Docs skills for those operations. A Brain daily brief uses /oneezy-status Brain mode; a requested meeting format uses /oneezy-meeting with this verified Drive snapshot. Follow dependency invocation policy; a mention does not execute a plugin.

Never store credentials, change sharing, revive paused schedules, send messages or execute unrelated tasks as a capture side effect. Wayfinder engineering tickets remain separate. Historical `scripts/brain.py` is explicit read-only evidence access and refuses GitHub writes.

Done means the save is read back, the ID has one writable location, context stays linked, and the answer includes its actual entry link. Source edits, installed plugins, local harness loading and scheduled execution are separate milestones.
