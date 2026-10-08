| Justin says | do |
|---|---|
| sync, my skills are missing, nothing | the script with no arguments |
| update my skills, update everything | **Change**: `update` |
| update / upgrade the Matt Pocock (or any source's) skills | **Change**: `update <source> --to latest` |
| upgrade X to 1.4.0, downgrade X to 1.3.0 | **Change**: `update <source> --to <version>` |
| downgrade X, go back to the previous release | **Change**: `update <source> --to previous` |
| what version of X am I on, what versions does X have | the script with `versions <source>`; read the `*` line |
| add `<owner/repo>`, add this skill (a link to one) | **Add** |
| add X to my playground, play with X, test this skill | **Playground**: copy |
| make a skill that does X in my playground | **Playground**: create |
| remove X from my playground | **Playground**: remove |
| move X from my playground into oneezy (or trident) | **Playground**: promote |
| what is linked, what is missing | `status` |
| remove the links | `unlink` |
| show what it would do | `--plan` |

A `<source>` is a source id from `skills-sync.json`: Matt Pocock's skills are `matt-pocock`, PStack is `pstack`, Anthropic's frontend-design is `anthropic`, diagram-design is `diagram-design`. "Upgrade" and "update" mean the same thing.

No arguments is a quiet sync: the first run on a machine clones the library into `~/.skills-sync`; every run pulls it, installs every third-party skill exactly at the commit the committed lock records (nothing moves upstream on a sync), rebuilds the layers and links every skill into the user folders (`~/.claude/skills`, `~/.agents/skills`). Nothing changed, nothing printed. The WSL fan-out happens only when Justin runs the tool himself, without `--quiet`. `status`, `unlink`, `versions` and `--plan` pass through as they are.
