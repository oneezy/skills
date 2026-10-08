# Uploading a plugin to ChatGPT

Publication is a separate authorized destination (decision oneezy/skills#22); a source-only request holds it. Load the actual Plugin Creator/Management instructions and use the currently exposed supported APIs through Oneezy Skills’ management branch. `docs/agents/capabilities.md` owns host discovery and action distinctions. Nothing here is scheduled, polled or run from CI.

Before starting: `dev` or `main` is checked out with a green `check`, and `npx @oneezy/skills-sync check` passes locally.

1. **Get the archives.** The latest GitHub release (`release-<n>`, `docs/agents/release.md`) holds every plugin's archive and, in `release.json`, its sha256 and files, and lists which plugins changed; download the changed ones. Or build them: `npx @oneezy/skills-sync build --artifacts` writes `artifacts/<id>-<version>.zip` per plugin and `artifacts/releases.json` (each archive's sha256, the source commit, the last recorded release). A plugin whose sha256 equals its recorded one has not changed: skip it.
2. **Open ChatGPT** on the web (upload the zip in the chat) or the Codex desktop app (give the archive's local path).
3. **First upload of a plugin:** say `@Plugin Creator create a plugin from <archive>`. Record what comes back: `plugin_id` and `release_id`.
4. **Update an uploaded plugin:** say `@Plugin Creator update plugin <plugin_id> with <archive>, expected release <release_id>`, using the release freshly read through get_plugin_files. A release mismatch requires refreshing and reconciling the candidate with current source before retrying. Record the new `release_id`.
5. **Removed or renamed files:** inspect the current update API. If explicit `delete_paths` is supported and removal is authorized, pass only verified exact paths with the guarded update; omissions preserve files. If the host cannot delete, stop and report the unsupported operation. Creating a replacement and uninstalling the prior plugin requires separate explicit authorization.
6. **Record the release** in `skills-sync.json` under `releases.<id>`: `plugin_id`, `release_id`, `sha256` and `files` (both copied from that plugin's entry in `artifacts/releases.json`), `scope: personal`, `date`. `files` is the list of what the uploaded archive held, and it is what lets step 5 fire: the next `build --artifacts` writes `artifacts/<id>.changes.md` only when a recorded file is missing from the new archive, so a record without `files` never produces the note. Commit it on a branch like any other change; `check` stays green.
7. **Test one namespaced skill** in a fresh chat: `@Oneezy` (the plugin's display name), then ask for `/oneezy-status` by name. It must answer as the skill, not from general knowledge. Repeat for each plugin uploaded (`@Trident`, `@Matt Pocock`, `@PStack`).

Out of scope: Business workspace sync (the admin "Import marketplace"), polling, schedules, any upload from CI.
