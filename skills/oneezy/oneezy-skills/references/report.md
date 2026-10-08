## Report

One line per change the tool printed, then its summary line; a landed change ends with the release tag, then the `/oneezy-migrate` report. Say plainly when a skill is reported gone upstream (the tool names the fix: deselect it in `skills-sync.json`, or keep a copy under `skills/` as an own skill) and when something was left alone as a conflict. If a skill Justin asked for is still missing after a sync, say which and stop; the fix belongs in the library.

## Boundaries

- Never remove or deselect a third-party skill to make room for one of Justin's, or to fix a name clash: rename his copy (`play-<name>`, or a rename in the config).
- Keep `disable-model-invocation` wherever upstream sets it.
- The tool owns skill links and the instruction blocks declared in `skills-sync.entrypoints.json`. Run the canonical script to propagate entrypoints; preserve text outside its managed blocks. Hooks and settings stay untouched, and `check` is a command people and CI run, never a hook.
- Own skills are edited in the library, `skills/<group>/<name>/`, where every link points. Third-party skills change through **Change** only; the copies the tool makes stay as it wrote them.
- Nothing updates on its own: no schedule, no refresh on sync. A source moves only when Justin asks.
