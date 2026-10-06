#!/usr/bin/env node
// Summarise what an `update` changed in skills-sync.lock.json, for the refresh job's pull request: per source its
// version and commit before and after, and which skills were updated, added, removed or moved upstream.
//
//   node lock-diff.mjs <library> [--base <git ref>]        (default base: HEAD)
//
// Prints JSON {changed, ids, title, body}. With GITHUB_OUTPUT set it also writes those four as step outputs.
// The lock is version 2 (@oneezy/skills-sync 0.5.0), grouped per source like skills-sync.json. A base that still
// holds the 0.4.0 skills-lock.json is read in the same shape: each entry goes to the source whose `repo` matches,
// or to its owner/repo when the config names none, with no version.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const baseIx = argv.indexOf("--base");
const base = baseIx >= 0 ? argv.splice(baseIx, 2)[1] : "HEAD";
const lib = path.resolve(argv[0] ?? ".");
const LOCK = "skills-sync.lock.json";
const OLD_LOCK = "skills-lock.json";

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
function showAt(ref, file) {
  try {
    return JSON.parse(execFileSync("git", ["-C", lib, "show", `${ref}:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}
const normalize = (s) =>
  String(s ?? "")
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "");
const short = (c) => (c ? String(c).slice(0, 7) : "none");

const config = readJson(path.join(lib, "skills-sync.json"), {});
const idByRepo = new Map(Object.entries(config.sources ?? {}).map(([id, s]) => [normalize(s.repo), id]));

/** A 0.4.0 skills-lock.json in the version 2 shape: sources by id, each skill with path, hash and its own commit. */
function fromOld(old) {
  const sources = {};
  for (const [name, e] of Object.entries(old.skills ?? {})) {
    const id = idByRepo.get(normalize(e.source)) ?? String(e.source);
    const s = (sources[id] ??= { repo: normalize(e.source), version: null, commit: null, skills: {} });
    s.skills[name] = { path: String(e.skillPath ?? "").replace(/\/SKILL\.md$/, ""), hash: e.computedHash, commit: e.commit };
    s.commit ??= e.commit ?? null;
  }
  return sources;
}
function lockAt(ref) {
  const v2 = showAt(ref, LOCK);
  if (v2) return v2.sources ?? {};
  const v1 = showAt(ref, OLD_LOCK);
  return v1 ? fromOld(v1) : {};
}

const before = lockAt(base);
const after = readJson(path.join(lib, LOCK), { sources: {} }).sources ?? {};
const label = (s) => (s ? `${s.version ?? "no version"} \`${short(s.commit)}\`` : "none");
/** A skill's commit: its own (a pin) or its source's. */
const at = (src, skill) => skill?.commit ?? src?.commit;

const sections = [];
const ids = [];
let total = 0;
for (const id of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
  const b = before[id];
  const a = after[id];
  const lines = [];
  const same = [];
  const bs = b?.skills ?? {};
  const as = a?.skills ?? {};
  for (const name of [...new Set([...Object.keys(bs), ...Object.keys(as)])].sort()) {
    const x = bs[name];
    const y = as[name];
    if (x && !y) lines.push(`- removed \`${name}\``);
    else if (y && !x) lines.push(`- added \`${name}\` at \`${short(at(a, y))}\``);
    else {
      const what = [];
      if (x.hash !== y.hash) what.push("content changed");
      if (x.path !== y.path) what.push(`moved from \`${x.path}\` to \`${y.path}\``);
      if (what.length) lines.push(`- \`${name}\`: ${what.join(", ")} (\`${short(at(b, x))}\` → \`${short(at(a, y))}\`)`);
      else if (at(b, x) !== at(a, y)) same.push(name);
    }
  }
  // A source that moved re-records its commit for every skill; the ones whose content stayed are one line, not one each.
  if (same.length) lines.push(`- ${same.length} skill${same.length === 1 ? "" : "s"} unchanged in content`);
  // a base read from a 0.4.0 lock has no version to compare (and no ref): only its commit counts
  const moved = b?.commit !== a?.commit || (b?.ref !== undefined && b.version !== a?.version);
  if (!lines.length && !moved) continue;
  ids.push(id);
  total += lines.length;
  const repo = a?.repo ?? b?.repo ?? id;
  sections.push([`### ${id} (\`${repo}\`): ${label(b)} → ${label(a)}`, ...lines].join("\n"));
}

const changed = ids.length > 0;
const title = changed ? `chore(sources): update ${ids.join(", ")}` : "chore(sources): update (nothing moved)";
const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
const run = GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null;
const body = [
  "## Summary",
  changed
    ? `\`update\` moved ${ids.length} source${ids.length === 1 ? "" : "s"} (${ids.join(", ")}), ${total} skill line${total === 1 ? "" : "s"} below. Every source not held at a \`version\` in \`skills-sync.json\` goes to the tip of its \`ref\`; a \`pin\` holds one skill at one commit.`
    : "`update` found every source already where the config says; `skills-sync.lock.json` is unchanged.",
  ...sections,
  "## Review",
  [
    "- Read the upstream changelog and diff of each moved source before merging; third-party content is never edited here.",
    "- The `check` job must be green on this PR: frozen refresh, `build --check`, `check`.",
    run
      ? `- Opened by the \`refresh\` job of \`.github/workflows/library.yml\` (workflow_dispatch): ${run}`
      : "- Opened by the `refresh` job of `.github/workflows/library.yml` (workflow_dispatch).",
  ].join("\n"),
].join("\n\n");

process.stdout.write(JSON.stringify({ changed, ids, title, body }, null, 2) + "\n");
if (process.env.GITHUB_OUTPUT) {
  const delim = `LOCKDIFF_${process.pid}_${Date.now()}`;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\nids=${ids.join(" ")}\ntitle=${title}\nbody<<${delim}\n${body}\n${delim}\n`);
}
