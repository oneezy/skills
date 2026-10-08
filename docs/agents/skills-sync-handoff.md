# Skills Sync desktop rollout

Use the canonical Oneezy Skills wrapper with skills-sync 0.7.2 or later in the supported 0.7 series. Desktop Claude/Codex use native plugins, verified before their owned loose links are removed. --links rolls back only the tool's owned plugin installation; cloud sessions default to links. No command here uploads ChatGPT plugins or changes schedules.

Inspect the real host's user profile, CODEX_HOME, CLAUDE_CONFIG_DIR, current library, remembered selections, installed CLI help and WSL distributions. Preserve dirty author work, pins, backup trees and foreign links. Use a fresh durable checkout of the approved published library; never reset or clean an existing dirty checkout. Inspect the release.json source revision and verify origin advertises the same full SHA before rollout. A held source review may use SKILLS_SYNC_CLI pointing to its built CLI and its explicitly approved remote branch, but is not a published rollout.

Before any build in a fresh clone run the canonical wrapper with refresh --frozen. This restores the committed source snapshots and preserves pins. Then run capability generation/tests, build --check and check. For source editing, generate authored capability copies before build and run the Brain planner/provider tests. Do not hand-edit generated plugin packages.

```powershell
$skillsRepo = '<verified durable clean library checkout>'
$revision = '<full verified published commit SHA>'
$script = Join-Path $skillsRepo 'skills/oneezy/oneezy-skills/scripts/sync.ps1'
# SKILLS_SYNC_CLI, when present, selects an explicitly reviewed local build.
pwsh -File $script refresh --frozen --repo $skillsRepo --no-remember --json
if ($LASTEXITCODE) { throw 'frozen restore failed' }
node --test (Join-Path $skillsRepo 'scripts/oneezy-capabilities.test.mjs')
if ($LASTEXITCODE) { throw 'capability tests failed' }
pwsh -File $script build --check --repo $skillsRepo --no-remember --json
if ($LASTEXITCODE) { throw 'generated drift' }
pwsh -File $script check --repo $skillsRepo --no-remember --json
if ($LASTEXITCODE) { throw 'library check failed' }
# --help prints the actual tool version; --version is not a supported command.
pwsh -File $script --help

$common = @('--repo', $skillsRepo, '--expect-revision', $revision,
  '--remote-ref', 'refs/heads/main', '--agents', 'codex,claude-code',
  '--plugins', '--global', '--no-projects', '--no-wsl',
  '--no-pull', '--no-remember', '--json')
pwsh -File $script @common --plan
if ($LASTEXITCODE) { throw 'plan conflict; preserve affected destinations' }
# Execute only the inspected, already authorized host selections.
pwsh -File $script @common
if ($LASTEXITCODE) { throw 'apply conflict; preserve affected destinations' }
pwsh -File $script status @common
if ($LASTEXITCODE) { throw 'unverified entrypoint or skill/cache' }
pwsh -File $script @common
if ($LASTEXITCODE) { throw 'repeat verification failed' }
```

For Linux/WSL use bash skills/oneezy/oneezy-skills/scripts/sync.sh with the same revision, explicit host and reviewed project arguments. Inspect and verify each native home separately. Do not assume Windows links provide a native installation. WSL fan-out must retain the expected revision and remote ref. Use --dev and --projects only for the user's selected inspected repositories; a blanket project or marketplace selection is not required.

The tool preflights source SKILL.md/references and the source revision before rollout; it verifies the affected installed skill/link or native cache before each declared instruction write. Instruction blocks retain surrounding bytes/imports, reject overrides/linked parents/malformed blocks, compare before-images and verify readback. Independent valid destinations may complete when another has a conflict. Record exact commits, versions, source paths, cache/link targets, instruction hashes and conflicts. Preserve historical pinned skills and foreign ownership rather than claiming a migration completed.

Completion requires separate evidence for Windows Codex, Windows Claude, each selected WSL host and cloud delivery. A new session must verify actual skill loading and the available Drive connector route. A prepared handoff, source tests, or file readback alone proves none of those runtime actions. Report an absent CLI, inaccessible host, unverified cache, duplicate/foreign skill or missing connector as a specific blocker.
