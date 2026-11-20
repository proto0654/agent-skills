---
name: commit-message
description: "Generate a Conventional Commit message from the actual diff, ready to copy."
whenToUse: "Use when the user asks for a commit message or before committing a finished change."
---

# Commit message

Read the real diff (`git status`, `git diff --staged`, or `git diff`). Do not summarize from the conversation alone.

## Shape

```
type(scope): summary

Why this change is needed, not a file list. At most 2–3 short lines.
```

- `type`: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`, `style`.
- `scope`: the module or area (`auth`, `lk`, `orders`, `api`), lowercase.
- summary: imperative mood, ≤ 72 chars, no trailing period, no `wip`/`fix2`/`update`.
- Breaking change: `!` after type/scope (`feat(api)!: …`) and a `BREAKING CHANGE:` footer.

## Rules

- One logical change per commit. If the diff mixes unrelated work, split it and say how.
- Prefer the project's documented scopes (check `AGENTS.md` / `docs/`).
- Match the project language for the body; English by default.
- Output only the message text, no conversational filler.
- Do not commit, stage, or push unless the user asked.
