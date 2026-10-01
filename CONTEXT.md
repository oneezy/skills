# Glossary

The words this library uses, one meaning each. Implementation lives in the tool's README and the ADRs, not here.

- **Library**: this repository. One place holding every skill Justin uses: the ones he writes and the ones he pins from others.
- **Own skill**: a skill authored here, under `skills/`. Edited here and nowhere else.
- **Group**: a folder directly under `skills/` that holds own skills rather than a `SKILL.md`. A group's name is a plugin id (`oneezy`, `trident`). A folder under `skills/` that holds `SKILL.md` itself is a **flat** own skill, still accepted.
- **Source**: a third-party repository the library takes skills from (`matt-pocock`, `pstack`), declared in the **manifest** with a **policy**.
- **Policy**: how a source moves. **Follow** takes the tip of its branch at every refresh; **pin** holds one commit until edited. A **pin** on a single skill overrides its source's policy.
- **Config**: `skills-sync.json`, the one committed, hand-edited declaration: library metadata, the two **switches** (`skills`, `plugins`), sources with selections, renames and pins, and plugin ids.
- **Local file**: `skills-sync.local.json`, gitignored, the per-machine answers (harnesses, projects, WSL distros, unavailable skills, link mode).
- **Lock**: `skills-lock.json`, the one tool-written record of what is installed: source, path, content hash and resolved commit per third-party skill, in the `npx skills` format so older tools keep restoring.
- **Snapshot**: the selected folders of one source at its resolved commit, kept under `upstream/<source>/` at their upstream paths. Generated; never edited.
- **Refresh**: resolving every source (latest by default; a **pin** is the exception), snapshotting, writing the lock, rebuilding the working set. **Frozen** refresh uses the lock's commits and moves nothing.
- **Working set**: `.agents/skills/`, one entry per skill the harnesses see: a link for an own skill, a copy of the snapshot for a third-party one (with its **transform** applied, such as a rename).
- **Layer**: a harness's project folder inside the library (`.claude/skills/`, `.goose/skills/`, `.hermes/skills/`), one link per working-set entry.
- **User folder**: a harness's home-level skills folder (`~/.claude/skills`, `~/.agents/skills`, …), one link per working-set entry, so every project on the machine sees the set.
- **Sync**: making the layers and user folders match the working set. Idempotent; silent when nothing changed.
- **Wrapper**: the `oneezy-skills` skill and its scripts, the way an agent runs the tool.
- **Plugin**: a package of skills a harness installs as one unit, namespaced by its id (`/oneezy:oneezy-brain`). The library builds one per group and one per source into `plugins/<id>/`, committed beside the source.
- **Form**: how a harness gets the skills: the **loose-skill form** (links to the working set) or the **plugin form** (an installed plugin). One form is active per host; plugins where a host supports them, links as the fallback.
- **Catalog**: a marketplace file at the root that lists the plugins and points at `./plugins/<id>` (`.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`).
- **Build**: generating plugins, catalogs and artifacts from the own skills and the snapshots. **Check** validates frontmatter, flows and generated-file drift, writes nothing, and is a command, never a hook.
- **Artifact**: an archive of one plugin for the ChatGPT upload, under `artifacts/`.
- **Release**: one upload of an artifact to ChatGPT, recorded in the lock by plugin id, release id and hash.
- **Reference token**: how prose names a skill (`/oneezy-brain`), a plugin or app (`@GitHub`), a file (`docs/agents/references.md`): the identity, never the invocation.
- **Registry**: `skills-registry.json`, the generated index of every skill's identity, host invocation forms, plugin, source and relationships. Deferred until the Skills app exists.
- **Flow**: `flow.yaml` beside an own skill's `SKILL.md`: its steps, references and outcomes in machine-readable form, describing what the skill does today.
- **Harness**: a coding agent product that reads skills (Claude Code, Codex, Goose, Hermes). **Host** is the same thing seen from a reference token.
