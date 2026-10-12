# Update the ChatGPT plugins

ChatGPT keeps Justin's plugins on his account. No CLI or API outside ChatGPT reaches them, so this procedure runs inside ChatGPT (the website or the desktop app) when he types:

```
@oneezy-skills update my ChatGPT plugins to the latest oneezy/skills release
```

That line is his authorization for every write below: updating, creating, and deleting the files that make each account copy exactly the release's. The scope is the library's plugins, the ones the release's `release.json` names; every other plugin on the account stays as it is. Read `references/capabilities/chatgpt.md` first and load the actual Plugin Creator (`update-plugin`, `create-plugin`) and Plugin Management instructions this host exposes.

1. **Read the release.** Fetch `https://api.github.com/repos/oneezy/skills/releases/latest` (a public repo: use whichever of web fetch, code execution or the GitHub connector this session has). Take its `tag_name` and download its `release.json` asset. For each entry in `plugins`, keep `version`, `archive` (the asset's name) and `files` (each path inside the plugin and its sha256). Done when every plugin id has its version, its archive's download URL and its file map.
2. **Read the account.** List Justin's own plugins, personal and workspace. A plugin whose name is a release plugin id is that plugin's copy. For each copy, call `get_plugin_files` through every page and keep `current_release_id` and each file's sha256 (hash the content when the API returns no digest). A copy that a workspace imported from GitHub is managed there and takes no upload: note it as "workspace sync" and leave it. Done when every release plugin is "on the account" with its file map and release id, "workspace sync", or "not on the account".
3. **Diff.** Compare each copy with the release, path by path, relative to the plugin's root (strip a leading `<id>/`). *Changed* are the release's paths whose sha256 differs or that the copy lacks; *removed* are the copy's paths the release lacks. Done when each plugin is current (both lists empty) or has both exact lists.
4. **Bring each plugin up**, in `release.json` order, skipping the current ones:
   - **Bytes.** Download the archive from `https://github.com/oneezy/skills/releases/download/<tag>/<archive>` and check its sha256 against `release.json`. When this session cannot download it, read each changed file from `github.com/oneezy/skills` at the tag (`plugins/<id>/<path>`) through the GitHub connector and check each file's sha256 instead.
   - **On the account:** `update_plugin` with `expected_release_id` set to the `current_release_id` from step 2, the changed files (or the whole archive, when that is what the API takes), and `delete_paths` set to the removed paths, exact paths only.
   - **Not on the account:** create it from the archive through Plugin Creator, personal scope.
   - **Release mismatch:** someone changed the copy since step 2. Re-read that plugin (steps 2 and 3) and try once more.

   Done when every plugin has the release id the API returned, or a failure in the API's own words.
5. **Read back.** Call `get_plugin_files` on every plugin step 4 touched. Its file map must equal the release's for that plugin; any difference is a failure for that plugin.
6. **Report**, one line per plugin: `updated <old version> → <new version>`, `created <version>`, `already current`, `workspace sync`, or `failed: <reason>`. Then one line: a PC's `npx @oneezy/skills-sync status` shows ChatGPT current after Codex there next starts. When a step needs a tool this host does not expose (say, Codex in the desktop app has no Plugin Creator), name the missing tool and tell Justin to type the line in a ChatGPT chat instead.
