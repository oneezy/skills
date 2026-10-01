# Sync Justin's skills from the library: one call to the published tool, the skill's words mapped to its commands.
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Argv)
$ErrorActionPreference = "Stop"
if ($null -eq $Argv) { $Argv = @() }
$first = if ($Argv.Count) { $Argv[0] } else { "" }
$mapped = @(switch ($first) {
  ""       { "--quiet" }
  "add"    { $Argv; "--quiet" }
  "update" { "refresh"; $Argv | Select-Object -Skip 1; "--quiet" }
  default  { $Argv }
})
npx --yes @oneezy/skills-sync @mapped
exit $LASTEXITCODE
