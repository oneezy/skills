#!/usr/bin/env node
// Build the /oneezy-debug block for the current turn from the harness's own transcript, so every value in it is
// measured. Claude Code writes ~/.claude/projects/<cwd>/<session>.jsonl and Codex writes
// ~/.codex/sessions/**/rollout-*-<thread>.jsonl; both stamp every tool call and result. Any other harness gets
// `available: false`, and the skill fills the block by hand.
//
//   node trace.mjs                       the block, as Markdown
//   node trace.mjs --json                the trace, as JSON
//   node trace.mjs --transcript <file>   read this transcript instead of finding one
//   node trace.mjs --harness claude|codex
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {homedir} from 'node:os';
import {basename, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const NA = 'not available in this harness';

export function detect(env = process.env) {
  if (env.CLAUDECODE === '1' || env.CLAUDE_CODE_ENTRYPOINT) return 'claude';
  if (env.CODEX_THREAD_ID || env.CODEX_SESSION_ID || env.CODEX_SANDBOX) return 'codex';
  return null;
}

function lines(text) {
  return text.split('\n').filter(Boolean).flatMap(line => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
}

function clip(text, max = 70) {
  const flat = String(text ?? '').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

function skillOf(path) {
  const match = String(path ?? '').match(/([^/\\\s'"]+)[/\\]SKILL\.md/);
  return match?.[1] ?? null;
}

function claudeTitle(name, input = {}) {
  if (name === 'Skill') return `Skill · ${input.skill}`;
  if (name === 'Bash') return `Bash · ${input.description || input.command}`;
  if (['Read', 'Write', 'Edit', 'NotebookEdit'].includes(name)) return `${name} · ${basename(String(input.file_path ?? ''))}`;
  if (name === 'Grep' || name === 'Glob') return `${name} · ${input.pattern}`;
  if (name === 'Agent' || name === 'Task') return `${name} · ${input.description ?? ''}`;
  if (name === 'WebFetch') return `WebFetch · ${input.url}`;
  if (name === 'WebSearch') return `WebSearch · ${input.query}`;
  const mcp = name.match(/^mcp__(.+?)__(.+)$/);
  if (mcp) return `${mcp[1]} · ${mcp[2]}`;
  return name;
}

// Claude Code: a turn starts at the last user entry that is a typed prompt (not a tool result, not harness-injected).
export function parseClaude(entries) {
  let start = -1;
  entries.forEach((entry, i) => {
    if (entry.type === 'user' && !entry.isMeta && !entry.toolUseResult &&
      !(Array.isArray(entry.message?.content) && entry.message.content.some(part => part.type === 'tool_result'))) start = i;
  });
  const turn = entries.slice(start + 1);
  const steps = [];
  const byId = new Map();
  const skills = new Set();
  const typed = JSON.stringify(entries[start]?.message?.content ?? '').match(/<command-name>\/?([^<]+)<\/command-name>/);
  if (typed) skills.add(typed[1].split(':').pop());
  let model = null;
  for (const entry of turn) {
    const content = Array.isArray(entry.message?.content) ? entry.message.content : [];
    if (entry.type === 'assistant') {
      model = entry.message?.model ?? model;
      for (const part of content.filter(part => part.type === 'tool_use')) {
        const step = {title: claudeTitle(part.name, part.input), start: entry.timestamp, end: null, ok: null};
        if (part.name === 'Skill') skills.add(String(part.input?.skill ?? '').split(':').pop());
        const read = part.name === 'Read' && skillOf(part.input?.file_path);
        if (read) skills.add(read);
        steps.push(step);
        byId.set(part.id, step);
      }
    }
    if (entry.type === 'user') {
      for (const part of content.filter(part => part.type === 'tool_result')) {
        const step = byId.get(part.tool_use_id);
        if (step) Object.assign(step, {end: entry.timestamp, ok: part.is_error !== true});
      }
    }
  }
  return {turnStart: entries[start]?.timestamp ?? turn[0]?.timestamp ?? null, model, skills: [...skills], steps};
}

function codexArgs(payload) {
  if (payload.type === 'local_shell_call') return {command: payload.action?.command};
  if (payload.type === 'custom_tool_call') return {input: payload.input};
  try { return JSON.parse(payload.arguments ?? '{}'); } catch { return {raw: payload.arguments}; }
}

function codexTitle(name, args) {
  const command = args.cmd ?? args.command;
  if (command) return `${name} · ${Array.isArray(command) ? command.join(' ') : command}`;
  if (args.input) return `${name} · ${String(args.input).split('\n').find(line => /^\*\*\* (Add|Update|Delete) File/.test(line)) ?? ''}`;
  return name;
}

function codexOk(output) {
  let text = output;
  if (typeof output === 'object' && output !== null) text = output.content ?? output.output ?? JSON.stringify(output);
  try {
    const exit = JSON.parse(text)?.metadata?.exit_code;
    if (exit !== undefined) return exit === 0;
  } catch { /* plain text output */ }
  const code = String(text ?? '').match(/(?:Process exited with code|Exit code:?)\s*(-?\d+)/i);
  return code ? Number(code[1]) === 0 : true;
}

// Codex: each rollout line is {timestamp, type, payload}; a turn starts at the last user_message event.
export function parseCodex(entries) {
  let start = -1;
  entries.forEach((entry, i) => {
    if (entry.type === 'event_msg' && entry.payload?.type === 'user_message') start = i;
  });
  const steps = [];
  const byId = new Map();
  const skills = new Set();
  let model = null;
  for (const entry of entries) if (entry.type === 'turn_context') model = entry.payload?.model ?? model;
  for (const entry of entries.slice(start + 1)) {
    const payload = entry.payload ?? {};
    if (entry.type !== 'response_item') continue;
    if (['function_call', 'custom_tool_call', 'local_shell_call'].includes(payload.type)) {
      const name = payload.name ?? 'shell';
      const args = codexArgs(payload);
      const step = {title: codexTitle(name, args), start: entry.timestamp, end: null, ok: null};
      const read = skillOf(JSON.stringify(args));
      if (read) skills.add(read);
      steps.push(step);
      if (payload.call_id) byId.set(payload.call_id, step);
    }
    if (['function_call_output', 'custom_tool_call_output'].includes(payload.type)) {
      const step = byId.get(payload.call_id);
      if (step) Object.assign(step, {end: entry.timestamp, ok: codexOk(payload.output)});
    }
  }
  return {turnStart: entries[start]?.timestamp ?? null, model, skills: [...skills], steps};
}

function newest(dir, test, depth = 4) {
  let best = null;
  const walk = (path, level) => {
    let names;
    try { names = readdirSync(path); } catch { return; }
    for (const name of names) {
      const full = join(path, name);
      let stat;
      try { stat = statSync(full); } catch { continue; }
      if (stat.isDirectory() && level < depth) walk(full, level + 1);
      else if (stat.isFile() && test(name) && (!best || stat.mtimeMs > best.mtimeMs)) best = {path: full, mtimeMs: stat.mtimeMs};
    }
  };
  walk(dir, 0);
  return best?.path ?? null;
}

export function locate(harness, env = process.env) {
  if (harness === 'claude') {
    const root = join(env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), 'projects');
    const id = env.CLAUDE_CODE_SESSION_ID;
    const cloud = env.CLAUDE_CODE_REMOTE === 'true';
    const remote = env.CLAUDE_CODE_REMOTE_SESSION_ID;
    return {
      harness: `Claude Code (${cloud ? 'cloud' : env.CLAUDE_CODE_ENTRYPOINT ?? 'local'})`,
      session: id ?? null,
      link: remote?.startsWith('cse_') ? `https://claude.ai/code/session_${remote.slice(4)}`
        : id ? `claude --resume ${id}` : null,
      transcript: newest(root, name => (id ? name === `${id}.jsonl` : name.endsWith('.jsonl')), 2),
    };
  }
  if (harness === 'codex') {
    const id = env.CODEX_THREAD_ID ?? env.CODEX_SESSION_ID;
    return {
      harness: 'Codex',
      session: id ?? null,
      link: id ? `codex resume ${id}` : null,
      transcript: newest(join(env.CODEX_HOME ?? join(homedir(), '.codex'), 'sessions'),
        name => name.startsWith('rollout-') && name.endsWith('.jsonl') && (!id || name.includes(id))),
    };
  }
  return {harness: null, session: null, link: null, transcript: null};
}

export function trace({harness = detect(), transcript, env = process.env} = {}) {
  const found = locate(harness, env);
  const file = transcript ?? found.transcript;
  if (!harness || !file || !existsSync(file)) return {available: false, ...found, transcript: file ?? null};
  const parse = harness === 'codex' ? parseCodex : parseClaude;
  return {available: true, ...found, transcript: file, ...parse(lines(readFileSync(file, 'utf8')))};
}

function took(step) {
  if (!step.end) return 'running';
  const ms = Date.parse(step.end) - Date.parse(step.start);
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.floor(ms / 60000)} m ${Math.round((ms % 60000) / 1000)} s`;
}

export function render(t) {
  if (!t.available) return `Transcript ${NA}; fill the block by hand.`;
  const icon = step => (step.ok === null ? '⏳' : step.ok ? '✅' : '❌');
  const time = iso => (iso ? iso.slice(11, 23) : '?');
  const out = [
    `**🐞 Debug** · ${t.harness} · measured`,
    `- Session: ${t.link ?? NA}`,
    `- Model: ${t.model ?? NA}`,
    `- Skills: ${t.skills.length ? t.skills.map(name => `\`${name}\``).join(', ') : 'none this turn'}`,
    `- Turn started: ${t.turnStart ?? '?'}`,
    '',
    '| Status | Step | Started (UTC) | Took |',
    '|---|---|---|---|',
    ...t.steps.map(step => `| ${icon(step)} | ${clip(step.title)} | ${time(step.start)} | ${took(step)} |`),
    '',
    `Times measured from the ${t.harness.split(' (')[0]} transcript.`,
  ];
  return out.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const flag = name => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
  const result = trace({harness: flag('--harness') ?? detect(), transcript: flag('--transcript')});
  console.log(argv.includes('--json') ? JSON.stringify(result, null, 2) : render(result));
}
