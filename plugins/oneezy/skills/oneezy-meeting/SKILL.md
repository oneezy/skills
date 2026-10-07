---
name: oneezy-meeting
description: >-
  Run Justin's Oneezy meeting workflow through /oneezy-meeting or natural requests for Oneezy or Onizi meetings. Show a numbered menu when the meeting type is unspecified, then route to one of seven templates: daily standup, backlog refinement, sprint planning, sprint review, sprint retrospective, quarterly review, or yearly review. Gather relevant information from the user's updates, named GitHub repositories, Brain, and available project records. Produce concise reports in plain language for nontechnical readers.
metadata:
  internal: true
---

# Oneezy meeting

## Choose the meeting

Accept `/oneezy-meeting`, `$oneezy-meeting`, "Oneezy meeting," and "Onizi meeting." Treat slash forms as user request text; do not claim they register an application command. Keep this skill separate from any existing Oneezy or Onizi status skill. Do not capture `/oneezy-status` or rename or edit that skill.

Answer questions about this workflow and handle requested skill edits directly. Show the meeting menu only when the user wants a meeting report.

If the user does not specify a meeting type, show this menu as normal Markdown, not a code block, and stop to await their choice. Preserve any project, source, timeframe, or supplied update from the request for the next turn. Do not silently default to standup or prepare seven reports.

# 🗓️ Oneezy meeting

Which meeting would you like? Reply with its number or name.

1. Daily standup: Yesterday, today, and anything stopping progress.
2. Backlog refinement: Review upcoming tasks and make them clear and ready.
3. Sprint planning: Choose the goal and work for the next work period.
4. Sprint review: Summarize finished work and progress over a chosen period.
5. Sprint retrospective: Discuss what worked, what did not, and what to improve.
6. Quarterly review: Review results and priorities over three months.
7. Yearly review: Review results and priorities over a year.

Use a number as a meeting selection only in an explicit meeting request or after showing this menu. Do not interpret "two weeks" as meeting 2. Honor changed selections. If a number is outside 1 to 7, ask for a valid selection without inventing another meeting. If a name is unclear or multiple types are requested without an order, ask one focused clarification. Accept a requested ordered series and run one meeting at a time.

If the type is already clear, skip the menu. Recognize these names and aliases within a Oneezy meeting request, or as a reply to its menu:

| Number | Meeting | Aliases | Template |
| --- | --- | --- | --- |
| 1 | Daily standup | standup, daily scrum, daily check-in, /standup | [daily standup](references/daily-standup.md) |
| 2 | Backlog refinement | backlog, refinement, /backlog | [backlog refinement](references/backlog-refinement.md) |
| 3 | Sprint planning | planning, plan the next sprint, /sprint, /planning | [sprint planning](references/sprint-planning.md) |
| 4 | Sprint review | review, weekly review, progress highlights, /review | [sprint review](references/sprint-review.md) |
| 5 | Sprint retrospective | retrospective, retro, /retro | [sprint retrospective](references/sprint-retrospective.md) |
| 6 | Quarterly review | quarter review, /quarterly | [quarterly review](references/quarterly-review.md) |
| 7 | Yearly review | annual review, year review, /yearly | [yearly review](references/yearly-review.md) |

Read [shared rules](references/shared-rules.md) and only the selected template. Follow its evidence needs, period rules, prompts, and layout. Use the template locally; do not require its source repository to be available each time.

## Gather the right information

1. Honor the user's named sources and exclusions. If they say "use only this update," do not fetch other sources. Preserve the requested project, person, and period through menu selection.
2. Otherwise read [source routing](references/source-routing.md) before retrieving external evidence. Resolve the requested source to its named skill and plugin, check the current runtime and invocation policy, then load allowed skill instructions and call available tools. Use active project instructions and context to identify relevant sources. Use the client repository for the actual project's work and delivery evidence. Do not let a summary in Brain override newer direct evidence without checking the conflict. Consult [capability discovery](references/capability-inventory.md) when a requested source is absent from the routing table or the user asks what skills and plugins are available; use live discovery before treating availability as current.
3. Resolve nicknames such as "Onizi Brain" or "Trident Cube" to a verified repository or file using known context or repository search. Do not invent a repository path. If multiple plausible sources remain, ask only for the missing choice. Use the appropriate available account connection. Do not embed connection IDs or assume private access.
4. Gather information relevant to the chosen meeting and period. Fetch full details when excerpts are insufficient and cover available result pages. Do not search unrelated repositories or collect everything on the account.
5. Ask only for information that cannot be read and materially affects the meeting, such as the user's intended work today, a planning goal, capacity, or personal lessons. Do not ask the user to repeat an update already supplied. If enough evidence exists, prepare the report. If none exists, ask the selected template's opening questions and wait. If partial evidence exists, draft with a short coverage note and clearly marked unknowns.
6. Prepare the meeting using best judgment. Keep reading and summarizing within the authorized request. Save reports or change task records only when the request or standing project instructions authorize it. Do not send reports to other people without explicit instructions.

## Finish

Return the selected template with numbered lists, status words and emojis, and concrete Next Steps. Replace every placeholder. Keep it easy for someone with no technical background to read. Preserve verified source links beside the claims they support. Do not expose internal template instructions or generate an unrelated menu after a completed meeting.

Before returning, check the report against the shared rules for the user's timezone, covered period, delivery claims, source coverage, and authorization. Correct every mismatch.

Examples:
- `/oneezy-meeting` shows the seven numbered choices.
- `/oneezy-meeting 1 for Trident Cubed` prepares a standup or asks the missing daily questions.
- `/oneezy-meeting review the last 3 weeks for layerdbiz/tridentcubed` uses the sprint review template and gathers that repository's evidence.
- `/oneezy-meeting quarterly review using Brain and the client repo` resolves the sources and uses the quarterly template.

Use [source notes](references/source-notes.md) only when the user asks about the original templates or provenance.
