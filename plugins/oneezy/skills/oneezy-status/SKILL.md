---
name: oneezy-status
description: Read-only status for Justin's Brain agenda or a working tree, branch, PR or merged PR. Brain requests use the verified Drive snapshot; repo reports keep the STATUS.md shape, Next Up and next-session prompt. Also used as the last step of /oneezy-merge.
metadata:
  internal: true
---

This skill is read-only: no commit, push, merge or tracker write; never call `/oneezy-merge`.

For a Brain agenda/status, read `references/brain-daily.md` and load `/oneezy-brain` with its verified Drive snapshot. Skip repository state and sources. Missing Drive is a coverage gap, never permission for GitHub Brain fallback.

For a repository report, read `references/repository.md` before retrieval: it owns state precedence, containment, runtime sources, Vercel coverage, queue ranking and Next Up’s opening skill. Read `STATUS.md` and keep its shape and line cap. A recommended next-session skill is request text, not an instruction to execute now.

Before calling a dependency, read `references/capabilities/contract.md`, then the adapter for this host. Load its actual instructions and discover its tools; a name or mention does not execute it.

## Budget

At most five calls: PR read, combined status, the Vercel bot comment, the map read, one shell call for git facts. One schema load at the start if the harness needs it. No text before the report; the report is the whole message.

Done when the report is on screen within STATUS.md's line cap, every slot filled from a source or omitted by its rule, every link a real URL, and Next Up present with its code block.
