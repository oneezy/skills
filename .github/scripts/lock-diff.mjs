#!/usr/bin/env node
// Summarise what an unfrozen `refresh` changed in skills-lock.json, for the refresh job's pull request:
// which sources moved and which skills were updated, added, removed or moved upstream.
//
//   node lock-diff.mjs <library> [--base <git ref>]        (default base: HEAD)
//
// Prints JSON {changed, ids, title, body}. With GITHUB_OUTPUT set it also writes those four as step outputs.
// A source id comes from skills-sync.json (the source whose `repo` matches the lock entry's `source`); an
// entry the config does not name is listed under its owner/repo.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const baseIx = argv.indexOf("--base");
const base = baseIx >= 0 ? argv.splice(baseIx, 2)[1] : "HEAD";
const lib = path.resolve(argv[0] ?? ".");
const LOCK = "skills-lock.json";

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
function lockAt(ref) {
  try {
    return JSON.parse(execFileSync("git", ["-C", lib, "show", `${ref}:${LOCK}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return { skills: {} };
  }
}
const normalize = (s) =>
  String(s ?? "")
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "");
const short = (c) => (c ? String(c).slice(0, 7) : "none");

const before = lockAt(base).skills ?? {};
const after = readJson(path.join(lib, LOCK), { skills: {} }).skills ?? {};
const config = readJson(path.join(lib, "skills-sync.json"), {});
const idByRepo = new Map(Object.entries(config.sources ?? {}).map(([id, s]) => [normalize(s.repo), id]));
const idOf = (entry) => idByRepo.get(normalize(entry.source)) ?? String(entry.source);

/** id -> { repo, lines, same: skills whose content stayed while the recorded commit moved, was: commits before, now: commits after } */
const changes = new Map();
function bucket(entry) {
  const id = idOf(entry);
  if (!changes.has(id)) changes.set(id, { repo: entry.source, lines: [], same: [], was: new Set(), now: new Set() });
  return changes.get(id);
}

for (const name of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
  const b = before[name];
  const a = after[name];
  if (b && !a) {
    bucket(b).lines.push(`- removed \`${name}\``);
    continue;
  }
  if (a && !b) {
    const c = bucket(a);
    if (a.commit) c.now.add(a.commit);
    c.lines.push(`- added \`${name}\` at \`${short(a.commit)}\``);
    continue;
  }
  const c = bucket(a);
  if (b.commit) c.was.add(b.commit);
  if (a.commit) c.now.add(a.commit);
  const what = [];
  if (b.computedHash !== a.computedHash) what.push("content changed");
  if (b.skillPath !== a.skillPath) what.push(`moved from \`${b.skillPath}\` to \`${a.skillPath}\``);
  if (normalize(b.source) !== normalize(a.source)) what.push(`now from \`${a.source}\``);
  if (what.length) c.lines.push(`- \`${name}\`: ${what.join(", ")} (\`${short(b.commit)}\` → \`${short(a.commit)}\`)`);
  else if (b.commit !== a.commit) c.same.push(name);
}
// A source that moved re-records every skill's commit; the ones whose content stayed are one line, not one each.
for (const [id, c] of [...changes]) {
  if (c.same.length) c.lines.push(`- ${c.same.length} skill${c.same.length === 1 ? "" : "s"} unchanged in content, now recorded at ${[...c.now].map((x) => `\`${short(x)}\``).join(", ")}`);
  if (!c.lines.length) changes.delete(id);
}

const ids = [...changes.keys()].sort();
const changed = ids.length > 0;
const total = ids.reduce((n, id) => n + changes.get(id).lines.length, 0);
const title = changed ? `chore(sources): refresh ${ids.join(", ")}` : "chore(sources): refresh (nothing moved)";
const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
const run = GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null;
const sections = ids.map((id) => {
  const c = changes.get(id);
  const was = [...c.was].map(short).join(", ") || "none";
  const now = [...c.now].map(short).join(", ") || "none";
  return [`### ${id} (\`${c.repo}\`): ${was} → ${now}`, ...c.lines].join("\n");
});
const body = [
  "## Summary",
  changed
    ? `An unfrozen \`refresh\` moved ${total} lock ${total === 1 ? "entry" : "entries"} across ${ids.length} source${ids.length === 1 ? "" : "s"} (${ids.join(", ")}). Latest is the default; a \`pin\` in \`skills-sync.json\` is how one skill is held back.`
    : "An unfrozen `refresh` found every unpinned skill already at upstream's tip; `skills-lock.json` is unchanged.",
  ...sections,
  "## Review",
  [
    "- Read the upstream diff of each updated skill before merging; third-party content is never edited here.",
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
