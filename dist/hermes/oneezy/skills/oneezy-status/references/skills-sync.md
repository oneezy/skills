# Skills Sync result mode

Consume the canonical script's command, exit code, complete action report and verified before/after snapshots. Read-only: fill missing evidence through supported discovery/readbacks, never rerun mutation to make the report look successful.

- **✅ Verified**: executed changes whose exact target readback agrees. Include each host and path, old → new link targets, Claude and Codex roots, ownership, required file hashes, instruction block state and idempotence/rollback evidence.
- **❌ Failed**: attempted destinations, failed precondition or command, affected paths and preserved state. A failed prerequisite means zero instruction writes to that destination; independent valid destinations may complete.
- **Skipped / unreachable / held**: each selected or registered destination not executed, with the exact reason. Dispatch, plan, build, permission refusal and absent account/tool route are not successful installation.

Name all registered repositories and their instruction coverage; list unselected repositories separately. Keep source-library HEAD and each upstream source version/SHA before → after separate from generated package versions and installed native/cloud plugin versions. An unqueried version is unknown. Record frozen sync versus explicitly requested update; pins and dirty work retain their bytes. Use full SHAs and actual release tags, not guessed latest labels.

End with tests and their actual outcomes, draft PR links and remaining blockers. Held review work requires new merge/release approval. Cloud upload is separate from local CLI installation and managed links; source generation never proves either installed or loaded behavior. Report unsupported hosts explicitly, including missing capability adapters.
