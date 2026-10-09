## Report

After the canonical script, invoke `/oneezy-status` in Skills Sync mode with the command, exit code, complete actions and before/after readbacks. Its `references/skills-sync.md` owns the report shape. A landed change includes the actual release tag and `/oneezy-migrate` report; held source work includes its draft PR and tests. A missing requested skill remains a named blocker.

## Boundaries

- Never remove or deselect a third-party skill to make room for one of Justin's, or to fix a name clash: rename his copy (`play-<name>`, or a rename in the config).
- Keep `disable-model-invocation` wherever upstream sets it.
- The tool owns skill links and the instruction blocks declared in `skills-sync.entrypoints.json`. Run the canonical script to propagate entrypoints; preserve text outside its managed blocks. Hooks and settings stay untouched, and `check` is a command people and CI run, never a hook.
- Own skills are edited in the library, `skills/<group>/<name>/`, where every link points. Third-party skills change through **Change** only; the copies the tool makes stay as it wrote them.
- Nothing updates on its own: no schedule, no refresh on sync. A source moves only when Justin asks.
