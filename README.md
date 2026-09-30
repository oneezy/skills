# skills

Justin's agent skills, plus pins for the third-party skills he uses, in one small repo.

Committed:

- `skills/<name>/` holds the skills authored here, in bare Agent Skills form (`SKILL.md`, optional `scripts/`, `references/`, `agents/openai.yaml`). Others install them with `npx skills add oneezy/skills`.
- `skills-lock.json` pins every third-party skill (source repo and content hash). Add one with `npx skills add <owner>/<repo>`; refresh them with `npx skills update`.

Generated, never committed:

- `skills-sync.json` remembers this machine's sync answers.
- `.agents/skills/` is the working set every harness reads: the third-party skills restored from the lock, plus one link per skill in `skills/`.
- `.claude/skills/`, `.goose/skills/`, `.hermes/skills/` are one link per working-set entry, for each harness.

## Use it

```
git clone https://github.com/oneezy/skills
cd skills
npx skills-sync
```

The first run asks which harnesses, whether to link the user folders, which projects to include, and (on Windows) which WSL distros; it remembers the answers. Every later run, and `npx skills-sync --watch`, is silent and idempotent. See the tool's README in `oneezy/tools` under `clis/skills-sync`.
