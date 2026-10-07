# Reviewed Skills Sync desktop handoff

Run this through the existing authorized desktop Codex task. This document prepares execution; it does not report that desktop execution happened. Do not patch desktop AGENTS.md or CLAUDE.md by hand.

| Artifact | Exact reviewed revision |
| --- | --- |
| Tool, `oneezy/tools` | `93fe8b37448186928c38580bcb79302f5d4133f1`, branch `feat/skills-sync-instructions`, draft PR 124 |
| Runnable source and generated package, `oneezy/skills` | `cf0afbb8429f27033daa41830909bf943137f334`, branch `feat/skills-sync-instructions`, stacked on PR 56 |
| Package input source | `fb2d968323dbdd3a5dcc0f294f184e80f64da42f` |
| Generated Oneezy package | `plugins/oneezy/`, version `0.40.0+fb2d968323db` |
| Reproducible archive | `artifacts/oneezy-0.40.0+fb2d968323db.zip`, SHA-256 `2d97f7968d087193638d6efe1ce1d2a1f0ae7909c6f5afe18d2d577193c311d1` |

The archive is built locally from the committed package; no account upload or release was performed. The tool is development version 0.6.0; its npm publication is outside this held review. **Set `SKILLS_SYNC_CLI` to the reviewed local build.** The script's package-version floor alone is not proof that npm has this code. Use the exact source revision above, not the default branch or old installed skill wrapper.

## Prerequisites and target inventory

1. Use an actual connected-computer execution route on Justin's Windows desktop. Resolve its user profile, `CODEX_HOME`, `CLAUDE_CONFIG_DIR`, installed harnesses, current remembered library, `skills-sync.local.json`, selected repositories and WSL distributions. Record exact paths; this cloud session could not inspect them. Inspect existing rollout and dirty work before modifying anything.
2. Make fresh, durable isolated checkouts of both exact commits. Never reset, clean, overwrite or switch the separate dirty checkout. The library must remain available after sync because managed links point into it. Keep an existing host-library selection intact during this review with `--no-remember`; explicitly pin this reviewed library for every review run. A later normal sync still needs an authorized tool/source rollout. Do not claim the whole fleet is updated from this handoff.
3. Build prerequisites: git access, Node 24+, pnpm 12.9.1; PowerShell 7 for the Windows wrapper. The runtime CLI requires Node 20+, but this tools workspace requires 24+. Use current supported authentication and preserve access, trust and approval gates. No plugin install, permission edit, npm publication or cloud upload is necessary for this propagation check.
4. Inspect active Codex overrides, nested instruction files, Claude imports and any additional configured instruction directories or managed policy. Existing source/pins/history stay. The manifest covers verified Codex/Claude Code user paths and selected project instruction paths; report unsupported or unselected active routes separately instead of asserting universal coverage.
5. Use only inspected installed agents and explicitly selected project names under the actual dev root. Do not pass `--projects '*'` or a blanket marketplace update as a default. If a manifest/template, link, malformed block, concurrent edit or dependency conflicts, leave it intact and report that destination. Continue independent accessible destinations. Never use a different writer or elevated route to bypass denial.

## Windows commands

Set the following paths from the desktop inventory. `skillsRepo` and `toolsRepo` identify new durable review checkouts; `devRoot` and `projectCsv` identify the selected real repositories. Keep the literal full commit SHAs.

```powershell
$skillsRepo = '<durable-reviewed-skills-checkout>'
$toolsRepo = '<durable-reviewed-tools-checkout>'
$devRoot = '<inspected-desktop-dev-root>'
$projectCsv = '<selected-project-name-1,selected-project-name-2>'
$agentCsv = 'codex,claude-code' # Keep only the inspected installed agents.

git clone https://github.com/oneezy/tools.git $toolsRepo
if ($LASTEXITCODE) { throw 'tools clone failed' }
git -C $toolsRepo checkout --detach 93fe8b37448186928c38580bcb79302f5d4133f1
if ($LASTEXITCODE) { throw 'tools checkout failed' }
git clone https://github.com/oneezy/skills.git $skillsRepo
if ($LASTEXITCODE) { throw 'skills clone failed' }
git -C $skillsRepo checkout --detach cf0afbb8429f27033daa41830909bf943137f334
if ($LASTEXITCODE) { throw 'skills checkout failed' }

Push-Location $toolsRepo
try {
  npx --yes pnpm@12.9.1 install --frozen-lockfile
  if ($LASTEXITCODE) { throw 'dependency installation failed' }
  npx --yes pnpm@12.9.1 --filter @oneezy/skills-sync test
  if ($LASTEXITCODE) { throw 'tool tests failed' }
} finally { Pop-Location }
$env:SKILLS_SYNC_CLI = Join-Path $toolsRepo 'packages/skills-sync/dist/src/cli.js'
node $env:SKILLS_SYNC_CLI --version # Must be 0.6.0.
if ($LASTEXITCODE) { throw 'reviewed CLI unavailable' }
$syncScript = Join-Path $skillsRepo 'skills/oneezy/oneezy-skills/scripts/sync.ps1'

# Frozen restoration materializes committed upstream snapshots; it does not request an update.
pwsh -File $syncScript refresh --frozen --repo $skillsRepo --no-remember --json
if ($LASTEXITCODE) { throw 'frozen restoration failed' }
node --test (Join-Path $skillsRepo 'scripts/oneezy-capabilities.test.mjs')
if ($LASTEXITCODE) { throw 'source preservation tests failed' }
pwsh -File $syncScript build --check --repo $skillsRepo --no-remember --json
if ($LASTEXITCODE) { throw 'generated artifact drift' }
pwsh -File $syncScript check --repo $skillsRepo --no-remember --json
if ($LASTEXITCODE) { throw 'library check failed' }
node (Join-Path $skillsRepo 'scripts/verify-oneezy-sync.mjs')
if ($LASTEXITCODE) { throw 'canonical Windows wrapper fixture failed' }

$common = @('--repo', $skillsRepo, '--agents', $agentCsv,
  '--global', '--dev', $devRoot, '--projects', $projectCsv,
  '--no-pull', '--no-remember', '--no-wsl', '--json')
pwsh -File $syncScript @common --plan
if ($LASTEXITCODE) { throw 'plan has a failure' }
# Review every planned path and conflict. Only continue within the existing desktop authorization.
pwsh -File $syncScript @common
if ($LASTEXITCODE) { throw 'one or more targets failed; preserve and report each conflict' }
pwsh -File $syncScript status @common
if ($LASTEXITCODE) { throw 'instruction/dependency readback failed' }
pwsh -File $syncScript @common # Expected: zero managed instruction writes.
if ($LASTEXITCODE) { throw 'repeat verification failed' }
```

For user folders only, replace `--dev/--projects` with `--no-projects`. For selected projects only, replace `--global` with `--no-global`. Keep the same target arguments for plan, apply, status and repeat. Preserve JSON output per run and record each exit status. A nonzero apply may include completed independent destinations; inspect its actions before any retry. Do not repeatedly run a refused destination.

## WSL and other supported computers

Windows review deliberately uses `--no-wsl`. The default WSL fan-out would otherwise use an npm executable; do not let an unpublished version or a different tool replace the reviewed build. Inventory actual distro names on the desktop, then run each authorized distro independently with its own Linux Node/workspace build and durable source checkout at the exact revisions above. Use its actual home, dev root and selected project names; do not translate or guess Windows profile paths.

On an accessible Linux/macOS/WSL host, after the same frozen tool install/test and source restoration, use:

```bash
export SKILLS_SYNC_CLI='<reviewed-tools-checkout>/packages/skills-sync/dist/src/cli.js'
skills_repo='<durable-reviewed-skills-checkout>'
dev_root='<inspected-host-dev-root>'
project_csv='<selected-project-names>'
script="$skills_repo/skills/oneezy/oneezy-skills/scripts/sync.sh"
common=(--repo "$skills_repo" --agents codex,claude-code --global
  --dev "$dev_root" --projects "$project_csv"
  --no-pull --no-remember --no-wsl --json)
bash "$script" "${common[@]}" --plan
# Review paths and conflicts; execute only the authorized accessible destinations.
bash "$script" "${common[@]}"
bash "$script" status "${common[@]}"
bash "$script" "${common[@]}"
```

Check each exit code before the next dependent step; preserve output and continue another independent computer/distro if this one fails. Do not use fallback around access denial. Managed links and these commands do not install or upload host plugins.

## Required verification and report

Read every path returned in `entrypoints`. Global roots resolve from the actual environment: Codex AGENTS.md plus existing AGENTS.override.md; Claude CLAUDE.md. Selected projects include primary and existing override/nested instruction files. New Claude root instructions import existing AGENTS fallbacks; bytes outside the marked block remain intact. Verify linked Brain SKILL.md and declared dependency files equal the reviewed source. Record before/after digests, exact paths, preserved imports/pins/dirty work, conflicts, status and zero repeat writes.

Start fresh Codex/Claude sessions after file verification. Confirm the loaded instructions delegate to the actual Oneezy Brain workflow. Load the actual available Google Drive/Sheets/Docs connector instructions through that host's adapter and perform an authorized read-only Brain registry lookup. Verify current account, Drive routing and required writer capability without capturing test rows. A mention, file readback or installed ChatGPT connector alone does not prove desktop agent loading/access. Missing native instructions/tools remain exact host dependency blockers; no GitHub Brain fallback.

Executed here: 97 tool tests passed (two existing skips); five capability and six release script tests passed; typecheck/format/lint had zero errors and five existing warnings; frozen restore, canonical build/check and package reproduction passed. Check counted 11 own skills, 10 flows and 649 generated files. Canonical Linux wrapper fixtures preserved CRLF, imports, pinned history and dirty content; plan/apply/status/repeat passed with four current entrypoints and zero repeat instruction writes. Audit, inventory, captured help and verification JSON live under `docs/research/2026-10-07-*`.

Still pending: actual Windows desktop/global and selected repository files, every inventoried WSL distro, PowerShell wrapper execution, fresh desktop agent loading and desktop connector access. No native/connected desktop filesystem route exists in this source session, so none was substituted with cloud files. The stale standalone cloud Meeting requires a separately authorized exact delivery refresh or retirement; a bundle update alone is insufficient. Cloud upload, deletion, npm publication, merging and fleet rollout are held.

Automatic approval review rejected `claude plugin validate` because it may transmit plugin source to Anthropic. That route was stopped and not retried. Do not treat the local schema/build checks as completion of that separate validation.
