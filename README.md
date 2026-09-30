# skills

Justin's agent skills and the third-party skills he uses, in one library. Vocabulary in `CONTEXT.md`, decisions in `docs/adr/`, how skills name each other in `docs/agents/references.md`.

## Install

```
npx skills add oneezy/skills                 # Justin's own skills, for anyone
npx @oneezy/skills-sync                      # the whole library on one of Justin's machines (inside a clone)
/plugin marketplace add oneezy/skills        # Claude Code: plugins oneezy, trident, matt-pocock, pstack
codex plugin marketplace add oneezy/skills   # Codex: the same four
```

A plugin skill runs as `/<plugin>:<skill>` (`/oneezy:oneezy-status`); a linked skill keeps its bare name (`/oneezy-status`). The first `npx @oneezy/skills-sync` run asks which harnesses, whether to link the user folders, which projects to include and (on Windows) which WSL distros, and remembers the answers; every later run, and `--watch`, is silent and idempotent. The tool lives in `oneezy/tools` under `clis/skills-sync`.

## Layout

| Path | What |
|---|---|
| `skills/<plugin>/<skill>/` | own skills, grouped by the plugin that packages them: `oneezy/` holds Justin's six, `trident/` the two for the Trident monorepo |
| `skills/<plugin>/<skill>/SKILL.md` | the skill, in bare Agent Skills form (plus optional `scripts/`, `references/`, `agents/openai.yaml`) |
| `skills/<plugin>/<skill>/flow.yaml` | what the skill does today: steps with stable ids, references, outcomes |
| `skills-sources.json` | the manifest: third-party sources with their policy, selections, renames, pins and attribution files, and the plugins |
| `upstream/<source>/` | snapshots of each source's selected folders at the lock's commit, never edited |
| `plugins/<id>/`, `artifacts/` | built plugin packages and ChatGPT upload archives |
| `.legacy/` | prompt-era files, no skills |

A folder directly under `skills/` with no `SKILL.md` is a group, and its name is the plugin id. Skill folder names never change, so `/oneezy-brain` is the same skill whether linked or installed as `/oneezy:oneezy-brain`.

Third-party skills come from two sources: `matt-pocock` follows `main` of `mattpocock/skills` (37 skills, `writing-for-agents` pinned to one commit) and `pstack` follows `main` of `cursor/plugins` under `pstack/` (47 skills, `tdd` and `teach` renamed `pstack-tdd` and `pstack-teach` beside Matt's). Add a source with `npx @oneezy/skills-sync add <owner/repo>`; move the following sources to their tip with `refresh`.

## Generated versus committed

| File | Written by | In git |
|---|---|---|
| `skills/`, `skills-sources.json`, `docs/` | hand | committed |
| `skills-sources-lock.json` | `refresh`: commit and date per source, path and hash per skill, releases | committed |
| `skills-lock.json` | `refresh`, in the `npx skills` format for older tooling | committed |
| `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` | `build --catalogs`: one plugin per group and per source, fetched from the `plugins` branch | committed |
| `skills-registry.json` | `build --registry`: every skill's identity, host invocation forms and relationships | committed |
| `upstream/` | `refresh` | ignored |
| `plugins/`, `artifacts/` | `build`; CI publishes `plugins/` to the `plugins` branch from `main` | ignored |
| `.agents/skills/`, `.claude/skills/`, `.goose/`, `.hermes/`, `skills-sync.json` | `sync`: this machine's working set, layers and remembered answers | ignored |

`check` fails when a committed generated file drifts from what the manifest, the lock and the flows would produce, so the generated files are regenerated, never hand-edited.
