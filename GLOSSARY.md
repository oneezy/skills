# Glossary

The words this library uses, one meaning each. Implementation lives in the tool's README and the ADRs, not here.

- **Library**: this repository. One place holding every skill Justin uses: the ones he writes and the ones he pins from others.
- **Own skill**: a skill authored here, under `skills/`. Edited here and nowhere else.
- **Group**: a folder directly under `skills/` that holds own skills rather than a `SKILL.md`. A group's name is a plugin id (`oneezy`, `trident`, `play`). A folder under `skills/` that holds `SKILL.md` itself is a **flat** own skill, still accepted.
- **Playground**: the `play` group, where Justin tries a skill (his own idea, or one copied from another repo) before **promoting** it into `oneezy` or `trident`. Every skill in it is named `play-<name>`.
- **Source**: a third-party repository the library takes skills from (`matt-pocock`, `pstack`, `anthropic`, `diagram-design`), declared in the **config** with the `ref` it follows.
- **Version**: a source's upstream release as plain semver (`1.3.1`, never `v1.3.1`): its nearest release tag, else its plugin or package manifest's version, else none. Shown as `1.3.1 (+4 commits)` when the commit is past the release.
- **Hold**: a `version` on a source in the config; the source stays at that release until the config changes. No `version` means latest.
- **Pin**: a commit in the config that holds one skill while its source follows its `ref`, moved by editing the commit. A `ref` that is itself a commit holds the whole source.
- **Config**: `skills-sync.json`, the one committed, hand-edited declaration: library metadata, the two **switches** (`generate.skills`, `generate.plugins`), sources with selections, renames and pins, and plugin ids.
- **Machine facts**: what a run finds out about the machine it runs on: which harnesses are installed and where, WSL distros. Detected every time, never written down. _Avoid_: local file (`skills-sync.local.json`, retired by ADR-0012).
- **Lock**: `skills-sync.lock.json`, the one tool-written record of what is installed, grouped per source: repo, ref, version, commit and date, then each skill's upstream path and content hash. Replaced `skills-lock.json` (the `npx skills` format) with skills-sync 0.5.0.
- **Snapshot**: the selected folders of one source at its resolved commit, kept under `upstream/<source>/` at their upstream paths. Generated; never edited.
- **Update**: resolving the named sources (every one when none is named) at latest, at their **hold**, or at the version asked for (`--to <version>|previous|latest`), snapshotting, writing the lock, rebuilding the working set, and reporting each moved source's old and new version with the upstream changelog between them. Run by the daily **upstream check**, or when asked. **Refresh** is its old name. **Frozen** refresh uses the lock's commits and moves nothing; every **sync** runs it.
- **Migration note**: a changelog entry that asks something of a consumer (a renamed file convention, a removed skill). `/oneezy-migrate` applies them across Justin's repos.
- **Working set**: `.agents/skills/`, one entry per skill the harnesses see: a link for an own skill, a copy of the snapshot for a third-party one (with its **transform** applied, such as a rename).
- **Layer**: a harness's project folder inside the library (`.claude/skills/`, `.goose/skills/`, `.hermes/skills/`), one link per working-set entry.
- **User folder**: a harness's home-level skills folder (`~/.claude/skills`, `~/.agents/skills`, …), one link per working-set entry, so every project on the machine sees the set.
- **Sync**: making every harness on a machine match the latest release, in its one **form**, with its **hook** and **global block** in place. Changes only what differs; silent when nothing changed.
- **Wrapper**: the `oneezy-skills` skill and its scripts, the way an agent runs the tool.
- **Plugin**: a package of skills a harness installs as one unit, namespaced by its id (`/oneezy:oneezy-brain`). The library builds one per group and one per source into `plugins/<id>/`, committed beside the source.
- **Form**: how a harness gets the skills: the **loose-skill form** (links to the working set) or the **plugin form** (an installed plugin). Each harness gets exactly one, never both: the plugin form wherever it has a plugin route, the loose-skill form only where it has none.
- **Account plugin**: a plugin switched on in Justin's claude.ai account. Claude Code receives it as `<id>@synced`, on his machines and in the cloud.
- **Catalog**: a marketplace file at the root that lists the plugins and points at `./plugins/<id>` (`.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`).
- **Build**: generating plugins, catalogs and artifacts from the own skills and the snapshots. **Check** validates frontmatter, flows and generated-file drift, writes nothing, and is a command, never a hook.
- **Artifact**: an archive of one plugin for the ChatGPT upload, under `artifacts/`.
- **Release**: one upload of an artifact to ChatGPT, recorded in `artifacts/releases.json` by plugin id, release id and hash.
- **Reference token**: how prose names a skill (`/oneezy-brain`), a plugin or app (`@GitHub`), a file (`docs/agents/references.md`): the identity, never the invocation.
- **Registry**: `skills-registry.json`, the generated index of every skill's identity, host invocation forms, plugin, source and relationships. Deferred until the Skills app exists.
- **Flow**: `flow.yaml` beside an own skill's `SKILL.md`: its steps, references and outcomes in machine-readable form, describing what the skill does today.
- **Harness**: a coding agent product that reads skills (Claude Code, Codex, Goose, Hermes). **Host** is the same thing seen from a reference token.
- **Harness default**: a skill, plugin or hook a harness ships with or that came from outside the library. Never touched.
- **Hook**: the one session-start entry the tool writes into a harness's settings; it runs a quiet sync and reports checkout drift.
- **Global block**: the tool's marked section in a harness's global instructions file (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`). Never in a repository.
- **Upstream check**: the daily comparison of every unheld source with its upstream; any difference lands as an **update**.
- **Machine command**: a command that acts on the machine or repositories it runs on (`sync`, `status`, `hook`, `branches`, `unlink`). A **library command** changes the library (`update`, `add`, `versions`, `rename`) and runs as a workflow in it.
- **Keep suffix**: `-keep` at the end of a branch name. Such a branch is never deleted; neither are `main` and `dev`.
- **Archive tag**: `archive/<name>`, the tag a branch closed without merging gets before it is deleted.

- **Capability contract**: the portable obligations for resolving, authorizing and verifying a dependency.
- **Host adapter**: the supported discovery and action route for one product surface.
- **Capability catalog**: the maintained inventory of dependency identities and dated evidence, including unknowns.
- **Delivery**: one installed or saved instance of a source artifact; standalone and bundled skills are separate deliveries.
