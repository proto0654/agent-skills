---
name: project-context
description: "Design and maintain project documentation as a navigable graph: agent entry point, context snapshot, domain docs, deep links, freshness."
whenToUse: "Use when creating or reorganizing docs, adding/moving/deleting a document, or when an agent needs to find the right project context fast."
---

# Project context as a navigable graph

The goal: an agent or a new developer reaches the right document in at most two hops, and every link resolves. Stack does not matter; the structure does.

## Roles, not folders

| Role | Typical path | Rule |
|---|---|---|
| Agent entry | `AGENTS.md` | Short. What the project is, where things live, commands, hard rules. Links to the context doc and docs hub. |
| Context snapshot | `docs/CONTEXT.md` | Permanent facts only: purpose, key paths, auth/data model, external systems, current focus. No changelog. |
| Docs hub | `docs/README.md` | Slim TOC. One row per document or area. No “recent changes”. |
| Domain doc | `docs/<domain>.md` | One topic, current behavior, gotchas, links to neighbours. |
| Runbook / checklist | `deployment/*.md` | Operational steps, kept in git, linked from the context or hub. |
| Decision / act | `docs/acts/`, ADR dir | Dated and immutable. History lives here, not in the context snapshot. |

Nested areas get their own small hub (`docs/<area>/README.md`) — link the **file**, not the directory.

## Language

- Write project documentation in **English**: it tokenizes more efficiently, keeps the injected context cheaper, and produces more consistent model behavior. It also stays portable across tools, teams and future agents.
- Reply to the user in **Russian** unless they switch language.
- Keep Russian for: verbatim UI strings, business/legal documents the team owns in Russian, and projects with an explicit Russian convention.
- Do not machine-translate an existing doc tree. New docs are English; editing an existing Russian doc keeps its language unless asked.
- Record the convention in the entry point (`AGENTS.md`) so neither a human nor an agent has to guess.

## Linking rules

- Relative links only. No `C:\…`, no `file:///`, no absolute machine paths.
- Link files, not directories: `docs/<area>/README.md`, not `docs/<area>/`.
- Deep links should survive a move: prefer linking the owning doc over a deep anchor.
- Anchors (`file.md#section`) are fine, but do not make them the only way to find a doc.
- Do not put paths in backticks when a human should be able to click them. Code spans do not create graph edges.
- Every document must be reachable from an entry point in ≤ 2 hops. A leaf with no inbound link is lost.

## Update protocol

- **New doc:** create it, add a hub row, link it from the closest domain doc. Give it one job.
- **Move/rename:** update every inbound link in the same change; run the checker.
- **Delete:** remove its links and hub row. Do not leave “moved” stubs for long.
- **Permanent fact changed:** edit the context snapshot. Do not append a history line.
- **Decision made:** add a dated act/ADR; link it from the domain doc, leave the context clean.
- **Behavior changed:** update the domain doc, not the roadmap.

## Context injection for agents

- Keep `AGENTS.md` small: it is injected into every session, so tokens spent there are spent always.
- Put detail one hop away and let the agent read it on demand. Do not paste API schemas or file inventories into the entry point.
- State precedence explicitly: project docs and `AGENTS.md` override global rules.
- If docs are gitignored/local-only, say so in the entry point; committed docs must not depend on them to be understandable.

## Verification

Run the bundled checker from the repository root:

```bash
node <skill-dir>/scripts/check-doc-links.mjs .
```

It reports broken links, absolute paths, directory links and docs unreachable from `README.md` / `AGENTS.md` / `docs/README.md` / `docs/CONTEXT.md`. Override seeds with `--seed=AGENTS.md,docs/README.md`.

Wire it into CI or a pre-commit hook if the repo has one. Fix broken links in the same change that broke them.

To keep shared or global rules free of private context, scan them for project and vendor terms:

```bash
node <skill-dir>/scripts/scan-terms.mjs ~/.agents/skills --terms=projectname,vendor,product
```

Exit 1 on any hit, so the same check can guard a template repository.

## Anti-patterns

- Two hubs listing the same docs with different wording.
- A directory link where a hub file is expected (the chain stops there).
- A context doc that grows into a changelog or a schema dump.
- Orphan docs: created once, linked never.
- Absolute paths from one developer's machine.
- Docs describing removed features; delete or mark them explicitly.
- Duplicating the same fact in three files — link to the owner instead.
