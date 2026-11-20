---
name: docs-bootstrap
description: >-
  Bootstrap a project documentation graph and /actualize pipeline with
  guardrails: AGENTS.md, docs/CONTEXT.md hub, domain docs, project actualize
  command, link verification. Use when starting docs on a new or undoc'd repo,
  when the user asks for docs bootstrap, init docs, сформируй документацию,
  docs graph, or /docs-bootstrap. Not for routine post-change updates (use
  actualize). Complements project-context (ongoing graph rules).
---

# Docs bootstrap: first graph + actualize pipeline

Use this **once** (or when a repo has no docs graph). After the graph exists, ongoing updates go through the project `.cursor/commands/actualize.md` or the global `actualize` skill.

Also read `project-context` for ongoing linking / freshness rules — this skill **creates** the pipeline those rules maintain.

## When not to use

- Repo already has `AGENTS.md` + `docs/CONTEXT.md` + `docs/README.md` → run `/actualize` instead, or only fill missing pieces.
- User asked only to update docs after a code change → `actualize`.
- Do not invent product requirements; invent only structure and placeholders when facts are unknown.

## Guardrails (non-negotiable)

1. **Roles, not folders:** Agent entry (`AGENTS.md`), context snapshot (`docs/CONTEXT.md`), hub (`docs/README.md`), domain docs, optional runbooks. Nested areas get `docs/<area>/README.md` hubs.
2. **Language:** Docs and Cursor commands in **English**. Chat in **Russian** unless the user writes otherwise. Record the convention in `AGENTS.md` / `CONTEXT.md`. Keep an existing Russian product SoT (e.g. `CONCEPT.md`) in Russian — link it, do not machine-translate.
3. **Links:** Relative paths to **files**, never directories, never `C:\…` / `file:///`. Every new doc reachable in ≤ 2 hops from `AGENTS.md` or `docs/README.md`.
4. **CONTEXT.md:** Permanent facts only (purpose, paths, stack, auth/data boundaries, current focus). No session history, no “Recent changes”, no API dumps.
5. **Hub:** Slim TOC table. No changelog section.
6. **Precedence:** State that project docs / `AGENTS.md` override global agent rules.
7. **Actualize:** Project command wins over the global skill. Wire `.cursor/commands/actualize.md` with git hygiene → targeted updates → status block → ask before commit.
8. **Do not** create parallel hubs, orphan docs, or duplicate the same fact in three places — link the owner.
9. **Do not** commit unless the user asked. Propose a Conventional Commit message after bootstrap.
10. **Caches / secrets:** Document project-local cache and userdata conventions if they exist; never put secrets in docs.

## Procedure

### 0. Inspect

1. Confirm repo root (`git rev-parse --show-toplevel` if git exists).
2. List existing markdown: `AGENTS.md`, `README.md`, `CONCEPT.md`, `docs/**`, `.cursor/commands/**`.
3. Detect stack from manifests (`package.json`, etc.) and key source dirs — enough for CONTEXT paths, not a full audit.
4. If a strong product SoT already exists (e.g. `CONCEPT.md`), keep it and link from CONTEXT; do not rewrite it into English.

### 1. Create or repair the graph

Create only what is missing. Prefer small English files.

| File | Job |
|------|-----|
| `AGENTS.md` | Short: what / precedence / language / start-here links / key paths / commands / hard rules |
| `docs/CONTEXT.md` | Permanent snapshot + doc index |
| `docs/README.md` | TOC only |
| `docs/ARCHITECTURE.md` (or stack-appropriate name) | Structure, boundaries, what code already has |
| `docs/DEVELOPMENT.md` | Run / env / platform gotchas |
| `docs/ROADMAP.md` | Milestones if useful; empty table OK |
| Root `README.md` | One-screen human pointer into the graph |

If a root `ARCHITECTURE.md` already exists, **move content into** `docs/ARCHITECTURE.md` and leave a stub pointer at the old path (do not keep two full copies).

Domain-specific extras (API, SCREENS, …) only when the codebase clearly needs them — one job per file.

Templates: see [reference.md](reference.md).

### 2. Wire `/actualize`

Create `.cursor/commands/actualize.md` adapted from [actualize-template.md](actualize-template.md):

- Point at this repo’s `docs/` names.
- Git hygiene first; ask before commit.
- Targeted domain updates; CONTEXT only for permanent facts; hub stays slim.
- English docs / Russian chat (or the project’s recorded exception).
- End with the Docs status block.

If a project `actualize` already exists, do not overwrite without merging project-specific hard rules (deploy ownership, monorepo boundaries, …).

### 3. Verify

From the repository root:

```bash
node <path-to-project-context-skill>/scripts/check-doc-links.mjs .
```

Typical skill path: `~/.cursor/skills/project-context/scripts/check-doc-links.mjs` (Windows: `%USERPROFILE%\.cursor\skills\project-context\scripts\check-doc-links.mjs`).

Fix broken links, absolute paths, and directory links in the same change. Re-run until clean (or report leftover blockers).

### 4. Report (chat in Russian)

```
Docs status
- Files created/updated: …
- Actualize command: present / created / merged
- Link check: pass / fail (summary)
- Suggested commit: …
```

Ask whether to commit unless the user already requested it.

## Relationship to other skills

| Skill | Role |
|-------|------|
| `docs-bootstrap` (this) | First-time graph + actualize pipeline |
| `project-context` | Ongoing graph design / link rules |
| `actualize` | Post-change doc pass |
| `existing-project` | Open unfamiliar repo; may call this if docs are missing |
