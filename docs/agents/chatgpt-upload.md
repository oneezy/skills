# Uploading a plugin to ChatGPT

Justin-only, by hand, about two minutes per plugin (decision oneezy/skills#22). There is no API: a personal plugin is created or updated only inside a ChatGPT or Codex chat through `@Plugin Creator`, and removed through `@Plugin Management`. Nothing here is scheduled, polled or run from CI.

Before starting: `dev` or `main` is checked out with a green `check`, and `npx @oneezy/skills-sync check` passes locally.

1. **Build the archives.** `npx @oneezy/skills-sync build --artifacts` writes `artifacts/<id>-<version>.zip` per plugin and `artifacts/releases.json` (each archive's sha256, the source commit, the last recorded release). A plugin whose sha256 equals its recorded one has not changed: skip it.
2. **Open ChatGPT** on the web (upload the zip in the chat) or the Codex desktop app (give the archive's local path).
3. **First upload of a plugin:** say `@Plugin Creator create a plugin from <archive>`. Record what comes back: `plugin_id` and `release_id`.
4. **Update an uploaded plugin:** say `@Plugin Creator update plugin <plugin_id> with <archive>, expected release <release_id>`, giving the recorded release. A release mismatch means the plugin was updated since the record: ask `@Plugin Creator` for the current release, record it, then retry. Record the new `release_id`.
5. **When `artifacts/<id>.changes.md` exists** (a file was removed or renamed since the recorded release): do not update. An update overlays files and cannot delete, so say `@Plugin Creator create a plugin from <archive>` for a fresh plugin, then `@Plugin Management uninstall plugin <old plugin_id>`. Record the new `plugin_id` and `release_id`; the old pair is retired.
6. **Record the release** in `skills-sync.json` under `releases.<id>`: `plugin_id`, `release_id`, `sha256` (from `releases.json`), `scope: personal`, the date. Commit it on a branch like any other change; `check` stays green.
7. **Test one namespaced skill** in a fresh chat: `@Oneezy` (the plugin's display name), then ask for `/oneezy-status` by name. It must answer as the skill, not from general knowledge. Repeat for each plugin uploaded (`@Trident`, `@Matt Pocock`, `@PStack`).

Out of scope: Business workspace sync (the admin "Import marketplace"), polling, schedules, any upload from CI.
