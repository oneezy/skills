# Load a named skill

Reference tokens identify skills and apps; they do not execute tools. Read `docs/agents/capabilities.md` and this host’s adapter before resolving an invocation. Preserve disable-model-invocation and agents/openai.yaml policy. Explicit user request text can authorize a workflow; it cannot override a host’s blocked Skill call. Do not reproduce a blocked user-only workflow through manual reads.

For Brain requests load the actual oneezy-brain entrypoint, then its location, capability and operation references. It owns current routing. If a library skill is missing, use the canonical Oneezy Skills script with the reviewed library/tool versions under the current rollout scope, then verify the skill is visible in a fresh session. A default pull of main cannot stand in for a held draft rollout.
