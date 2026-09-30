# skills

Justin's agent skills, plus the third-party skills he installs, in one repo.

- `skills/<name>/` holds the skills authored here, in bare Agent Skills form (`SKILL.md`, optional `scripts/`, `references/`, `agents/openai.yaml`). Others install them with `npx skills add oneezy/skills`.
- `.agents/skills/` is the working set every harness reads: third-party skills installed by `npx skills add <owner>/<repo>` and pinned in `skills-lock.json`, plus one link per skill in `skills/`.
- `.claude/skills/` is generated: one link per entry of `.agents/skills`, for Claude Code. It is not committed.

After a clone or pull, and after adding or editing a skill, run `skills-sync` from the tools repo (`clis/skills-sync-cli`). It rebuilds the two layers here and links every skill into `~/.claude/skills` and `~/.agents/skills`, so every project on the host sees the same set.
