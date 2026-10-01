#!/usr/bin/env node
// Locate the @oneezy/skills-sync package inside a checkout of oneezy/tools by the name in its package.json,
// never by folder: the package lives under clis/skills-sync today and moves to packages/skills-sync (tools #75).
//
//   node find-package.mjs <checkout> [name]
//
// Prints the package folder. With GITHUB_OUTPUT set it also writes `dir` (the folder) and `cli` (the folder
// joined with the package's bin entry, dist/src/cli.js today) for later steps. Exit 1 when the package is
// missing or found more than once without a way to choose.
import fs from "node:fs";
import path from "node:path";

const [checkout = ".", name = "@oneezy/skills-sync"] = process.argv.slice(2);
const SKIP = new Set(["node_modules", "dist"]);
const MAX_DEPTH = 4;

function walk(dir, depth, found) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  if (entries.some((e) => e.isFile() && e.name === "package.json")) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
      if (pkg.name === name) found.push({ dir, pkg });
    } catch {
      /* not a readable package.json; keep walking */
    }
  }
  if (depth >= MAX_DEPTH) return;
  for (const e of entries) {
    if (!e.isDirectory() || SKIP.has(e.name) || e.name.startsWith(".")) continue;
    walk(path.join(dir, e.name), depth + 1, found);
  }
}

function binOf(pkg) {
  if (typeof pkg.bin === "string") return pkg.bin;
  if (pkg.bin && typeof pkg.bin === "object") return Object.values(pkg.bin)[0];
  return undefined;
}

const root = path.resolve(checkout);
let found = [];
walk(root, 0, found);
// A compatibility stub left at the old path may carry the same name; the real package is the one that builds.
if (found.length > 1) found = found.filter((f) => f.pkg.scripts && f.pkg.scripts.build);
if (found.length !== 1) {
  const list = found.map((f) => `  ${path.relative(root, f.dir) || "."}`).join("\n");
  process.stderr.write(
    found.length === 0
      ? `no package named ${name} under ${root} (searched ${MAX_DEPTH} levels, skipping node_modules, dist and dot-folders)\n`
      : `${found.length} packages named ${name} under ${root}, each with a build script; cannot choose:\n${list}\n`,
  );
  process.exit(1);
}

const [{ dir, pkg }] = found;
const bin = binOf(pkg);
const cli = bin ? path.join(dir, bin) : undefined;
process.stdout.write(dir + "\n");
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `dir=${dir}\n` + (cli ? `cli=${cli}\n` : ""));
}
