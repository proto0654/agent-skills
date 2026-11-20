---
name: actualize
description: "Post-change documentation pass: analyze the diff, update only affected docs, run git hygiene, report status."
whenToUse: "Use after a meaningful change when asked to update docs, run /actualize, or wrap up before commit."
---

# Actualize: docs after a change

If the project ships its own `actualize` skill or command, that one wins. This is the generic fallback.

If the repo has **no** docs graph yet (`AGENTS.md` + `docs/CONTEXT.md` missing), use the `docs-bootstrap` skill first, then return here for ongoing updates.

## 0. Git hygiene

1. Run `git status -sb` and inspect the diff.
2. If this conversation left uncommitted changes: summarize them in 1–3 bullets and propose a Conventional Commit message.
3. Ask whether to commit now. Commit only if the user already asked.
4. Do not invent deploy or release steps. Use them only if the project documents them.

## 1. Analyze

Review the conversation and the diff. Identify which documented behavior actually changed — not which files were touched.

## 2. Update docs (targeted, no changelog)

Find the docs root first (project `AGENTS.md`, `README.md`, or an existing `docs/` tree).

1. **Domain docs** — update only the files that describe the changed behavior.
2. **Context/snapshot doc** (e.g. `CONTEXT.md`) — only permanent facts: paths, auth model, IDs, current focus. No session history, no API dumps.
3. **Docs hub / TOC** — add a row only for a new document; never append a “Recent changes” section.
4. **Roadmap / task docs** — only if the work maps to a tracked milestone.
5. **Process docs** — only if the process itself changed.
6. Put non-obvious gotchas in the domain doc closest to the change.

Do not resurrect deleted or archived docs unless asked. Do not duplicate information that already lives in code or a single source of truth.

## 3. Output

- Docs: English by default (cheaper tokens, more consistent model behavior). Follow a documented project exception.
- Chat: Russian unless the user writes in another language.
- Keep the existing Markdown style and table conventions.

End with a short block:

```
Docs status
- Files updated: …
- Suggested commit: …
- Verification: …
```
