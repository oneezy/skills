---
name: oneezy-debug
description: Open the answer with a debug block (harness, session link, skills run, a timed table of steps). Use when Justin types /oneezy-debug, alone or with another skill or request, or asks for a debug trace of a run.
argument-hint: "empty, or the skill or request to run under the debug block"
---

Run the request, then open the answer with the **debug block**. Every value in the block is **measured** (read from a transcript, an environment variable or a clock this run read) or **reported** (your own account of it), and says which. A value the harness does not expose reads `not available in this harness`, so the block never carries a guessed link, time or skill.

## Steps

1. **Run the request.** Run the rest of Justin's message (a skill, a request, or nothing) exactly as you would without this skill. When the harness has no transcript the script can read (`references/harnesses.md`), keep a step list as you go: a short title, the clock read before it, whether it passed. Done when the request's own work is finished and the answer is not yet written.
2. **Build the block.** With a shell, run `node scripts/trace.mjs` from this skill's folder. When it prints a block, that is the block, unedited. When it prints `Transcript not available`, or there is no shell, read `references/harnesses.md` and fill the template below from your step list. Done when every line has a value or `not available in this harness`, each marked measured or reported.
3. **Answer.** Print the block first, then the answer. The block goes first even when the other skill says its output is the whole message: Justin asked for both.

## Template

```
**🐞 Debug** · <harness> · <measured | reported>
- Session: <link or resume command> (<measured | reported>)
- Model: <model> (<measured | reported>)
- Skills: `<skill>`, `<skill>` (<measured | reported>)
- Turn started: <ISO time, UTC> (<measured | reported>)

| Status | Step | Started (UTC) | Took |
|---|---|---|---|
| ✅ | <tool · what it did> | <HH:MM:SS.mmm> | <850 ms, 2.1 s> |

Times <measured from the clock | reported | not available in this harness>.
```

- One row per action (a tool call, a skill load, a search), in the order they ran. Status is ✅ passed, ❌ failed, ⏳ still running.
- A failed step keeps its row, and the answer says what failed and why.
- Skills lists every skill loaded this turn, this one included.
