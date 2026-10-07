// Exercise the canonical platform wrapper in an isolated fixture; never target a user's instructions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = process.env.SKILLS_SYNC_CLI;
assert.ok(tool && fs.statSync(tool).isFile(), 'SKILLS_SYNC_CLI must identify the reviewed built CLI');
const dev = fs.mkdtempSync(path.join(os.tmpdir(), 'oneezy-canonical-sync-'));
const project = path.join(dev, 'fixture');
const windows = process.platform === 'win32';
const script = path.join(repo, 'skills/oneezy/oneezy-skills/scripts', windows ? 'sync.ps1' : 'sync.sh');
try {
  fs.mkdirSync(path.join(project, '.git'), {recursive: true});
  fs.mkdirSync(path.join(project, 'src'), {recursive: true});
  const original = {
    'AGENTS.md': '# Existing project\r\nPreserve pinned https://github.com/oneezy/brain as history.\r\nKeep unrelated instructions and dirty work.\r\n',
    'AGENTS.override.md': '# Existing override\n',
    'src/CLAUDE.local.md': '@pinned.md\n# Nested instructions\n',
  };
  for (const [name, body] of Object.entries(original)) fs.writeFileSync(path.join(project, name), body);
  fs.writeFileSync(path.join(project, 'dirty.txt'), 'Uncommitted content\n');
  const args = ['--repo', repo, '--agents', 'codex,claude-code', '--no-global', '--no-remember', '--no-pull', '--no-restore', '--no-wsl', '--no-layers', '--dev', dev, '--projects', 'fixture', '--json', '-y'];
  const run = (extra) => {
    const result = spawnSync(windows ? 'pwsh' : 'bash', [...(windows ? ['-File'] : []), script, ...extra, ...args], {cwd: repo, encoding: 'utf8', env: process.env});
    assert.equal(result.status, 0, result.error?.message ?? result.stderr + result.stdout);
    return JSON.parse(result.stdout);
  };
  run(['--plan']);
  for (const [name, body] of Object.entries(original)) assert.equal(fs.readFileSync(path.join(project, name), 'utf8'), body);
  assert.equal(fs.existsSync(path.join(project, 'CLAUDE.md')), false);
  const applied = run([]);
  assert.ok(applied.entrypoints.every(item => item.state === 'current'));
  for (const [name, body] of Object.entries(original)) assert.ok(fs.readFileSync(path.join(project, name), 'utf8').startsWith(body));
  assert.ok(fs.readFileSync(path.join(project, 'CLAUDE.md'), 'utf8').startsWith('@AGENTS.md\n'));
  assert.equal(fs.readFileSync(path.join(project, 'dirty.txt'), 'utf8'), 'Uncommitted content\n');
  const repeated = run([]);
  const instructionWrites = repeated.actions.filter(action => action.kind === 'write' && action.note?.includes('instructions'));
  assert.equal(instructionWrites.length, 0);
  const status = run(['status']);
  assert.ok(status.entrypoints.every(item => item.state === 'current'));
  console.log(JSON.stringify({scope: 'temporary test fixture; no desktop instruction execution', platform: process.platform, tool, script, paths: applied.entrypoints.map(item => path.relative(project, item.path)), secondInstructionWrites: instructionWrites.length, states: status.entrypoints.map(item => item.state)}, null, 2));
} finally {
  fs.rmSync(dev, {recursive: true, force: true});
}
