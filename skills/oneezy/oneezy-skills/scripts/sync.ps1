# Sync Justin's skills from the library. add <owner/repo> and update go through npx skills, which owns the lock.
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
$ErrorActionPreference = "Stop"
$lib = if ($env:SKILLS_REPO) { $env:SKILLS_REPO } else { Join-Path $HOME ".skills-sync" }
switch ($Args[0]) {
  "add" {
    if (-not (Test-Path (Join-Path $lib "skills"))) { npx --yes @oneezy/skills-sync --quiet }
    Push-Location $lib
    try { npx --yes skills@latest add @($Args[1..($Args.Length - 1)]) --all } finally { Pop-Location }
    npx --yes @oneezy/skills-sync --quiet
  }
  "update" {
    Push-Location $lib
    try { npx --yes skills@latest update -p -y } finally { Pop-Location }
    npx --yes @oneezy/skills-sync --quiet
  }
  default {
    npx --yes @oneezy/skills-sync @Args
  }
}
exit $LASTEXITCODE
