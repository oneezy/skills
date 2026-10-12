import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {detect, locate, parseClaude, parseCodex, render, trace} from '../skills/oneezy/oneezy-debug/scripts/trace.mjs';

const claude = [
  {type: 'user', timestamp: '2026-10-12T10:00:00.000Z', message: {content: 'earlier prompt'}},
  {type: 'assistant', timestamp: '2026-10-12T10:00:01.000Z', message: {content: [{type: 'tool_use', id: 'old', name: 'Bash', input: {command: 'ls'}}]}},
  {type: 'user', timestamp: '2026-10-12T10:01:00.000Z', message: {content: '<command-name>/oneezy:oneezy-debug</command-name> sync my skills'}},
  {type: 'user', isMeta: true, timestamp: '2026-10-12T10:01:00.100Z', message: {content: 'injected context'}},
  {type: 'assistant', timestamp: '2026-10-12T10:01:01.000Z', message: {model: 'test-model', content: [
    {type: 'tool_use', id: 'a', name: 'Skill', input: {skill: 'oneezy:oneezy-skills'}},
  ]}},
  {type: 'user', timestamp: '2026-10-12T10:01:01.250Z', toolUseResult: {}, message: {content: [{type: 'tool_result', tool_use_id: 'a', content: 'ok'}]}},
  {type: 'assistant', timestamp: '2026-10-12T10:01:02.000Z', message: {content: [
    {type: 'tool_use', id: 'b', name: 'Bash', input: {command: 'npx skills-sync | x', description: 'Sync | the skills'}},
    {type: 'tool_use', id: 'c', name: 'Read', input: {file_path: '/p/oneezy-status/SKILL.md'}},
  ]}},
  {type: 'user', timestamp: '2026-10-12T10:01:05.500Z', toolUseResult: {}, message: {content: [
    {type: 'tool_result', tool_use_id: 'b', is_error: true, content: 'Exit code 1'},
  ]}},
  {type: 'assistant', timestamp: '2026-10-12T10:01:06.000Z', message: {content: [{type: 'tool_use', id: 'd', name: 'mcp__github__issue_write', input: {}}]}},
];

test('Claude Code: scopes to the last typed prompt and times each tool call', () => {
  const t = parseClaude(claude);
  assert.equal(t.turnStart, '2026-10-12T10:01:00.000Z');
  assert.equal(t.model, 'test-model');
  assert.deepEqual(t.skills, ['oneezy-debug', 'oneezy-skills', 'oneezy-status']);
  assert.deepEqual(t.steps.map(s => [s.title, s.ok]), [
    ['Skill · oneezy:oneezy-skills', true],
    ['Bash · Sync | the skills', false],
    ['Read · SKILL.md', null],
    ['github · issue_write', null],
  ]);
  const block = render({available: true, harness: 'Claude Code (cloud)', link: 'https://claude.ai/code/session_x', ...t});
  assert.match(block, /\| ✅ \| Skill · oneezy:oneezy-skills \| 10:01:01\.000 \| 250 ms \|/);
  assert.match(block, /\| ❌ \| Bash · Sync \\\| the skills \| 10:01:02\.000 \| 3\.5 s \|/);
  assert.match(block, /\| ⏳ \| github · issue_write \| 10:01:06\.000 \| running \|/);
  assert.match(block, /Times measured from the Claude Code transcript\./);
});

const codex = [
  {timestamp: '2026-10-12T10:00:00.000Z', type: 'session_meta', payload: {id: 't1'}},
  {timestamp: '2026-10-12T10:00:00.010Z', type: 'turn_context', payload: {model: 'codex-test'}},
  {timestamp: '2026-10-12T10:00:01.000Z', type: 'event_msg', payload: {type: 'user_message', message: '$oneezy-debug'}},
  {timestamp: '2026-10-12T10:00:02.000Z', type: 'response_item', payload: {type: 'function_call', name: 'shell', call_id: 'c1',
    arguments: JSON.stringify({command: ['cat', '/home/u/.codex/skills/oneezy-debug/SKILL.md']})}},
  {timestamp: '2026-10-12T10:00:02.400Z', type: 'response_item', payload: {type: 'function_call_output', call_id: 'c1',
    output: JSON.stringify({output: '...', metadata: {exit_code: 0}})}},
  {timestamp: '2026-10-12T10:00:03.000Z', type: 'response_item', payload: {type: 'custom_tool_call', name: 'apply_patch', call_id: 'c2',
    input: '*** Begin Patch\n*** Update File: a.md\n'}},
  {timestamp: '2026-10-12T10:01:13.000Z', type: 'response_item', payload: {type: 'custom_tool_call_output', call_id: 'c2', output: 'Exit code: 1\nfailed'}},
];

test('Codex: reads the rollout, exit codes and SKILL.md loads', () => {
  const t = parseCodex(codex);
  assert.equal(t.turnStart, '2026-10-12T10:00:01.000Z');
  assert.equal(t.model, 'codex-test');
  assert.deepEqual(t.skills, ['oneezy-debug']);
  assert.deepEqual(t.steps.map(s => [s.title, s.ok]), [
    ['shell · cat /home/u/.codex/skills/oneezy-debug/SKILL.md', true],
    ['apply_patch · *** Update File: a.md', false],
  ]);
  assert.match(render({available: true, harness: 'Codex', link: 'codex resume t1', ...t}), /\| 1 m 10 s \|/);
});

test('detect and locate read only the environment and the transcript folders', () => {
  assert.equal(detect({CLAUDECODE: '1'}), 'claude');
  assert.equal(detect({CODEX_THREAD_ID: 't1'}), 'codex');
  assert.equal(detect({}), null);
  const home = mkdtempSync(join(tmpdir(), 'debug-'));
  mkdirSync(join(home, 'projects', '-repo'), {recursive: true});
  writeFileSync(join(home, 'projects', '-repo', 's1.jsonl'), claude.map(e => JSON.stringify(e)).join('\n'));
  const env = {CLAUDECODE: '1', CLAUDE_CONFIG_DIR: home, CLAUDE_CODE_SESSION_ID: 's1', CLAUDE_CODE_REMOTE: 'true', CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_abc'};
  assert.equal(locate('claude', env).link, 'https://claude.ai/code/session_abc');
  const t = trace({harness: 'claude', env});
  assert.equal(t.available, true);
  assert.equal(t.steps.length, 4);
  assert.equal(locate('claude', {CLAUDE_CODE_SESSION_ID: 's1', CLAUDE_CODE_ENTRYPOINT: 'cli', CLAUDE_CONFIG_DIR: home}).link, 'claude --resume s1');
  assert.equal(trace({harness: null, env: {}}).available, false);
  assert.match(render({available: false}), /not available in this harness/);
});
