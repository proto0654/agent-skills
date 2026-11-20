# Docs bootstrap — file templates

Fill from the real repo. Keep stubs short; prefer links over paste.

## AGENTS.md

~~~~markdown
# <Project> — agent entry

<One sentence what it is.>

## Precedence

Project docs and this file override global agent rules when they conflict.

## Language

| Channel | Language |
|---------|----------|
| Chat with the user | **Russian** |
| `docs/**`, `AGENTS.md`, `.cursor/commands/**` | **English** |
| UI copy | **…** |

## Start here

1. [docs/CONTEXT.md](docs/CONTEXT.md)
2. [docs/README.md](docs/README.md)

## Key paths

| Area | Path |
|------|------|
| … | `…` |

## Commands

    npm run dev
    npm test

## Hard rules

1. …
~~~~

## docs/CONTEXT.md

~~~~markdown
# <Project> — project context

Permanent snapshot. No session changelogs.

## What this is

- …

## Communication

| Channel | Language |
|---------|----------|
| Chat | Russian |
| Docs / commands | English |

## Stack

- …

## Key paths

| Purpose | Path |
|---------|------|
| … | `…` |

## Source of truth

| Concern | Owner |
|---------|-------|
| … | [link](…) |

## Current focus

- …

## Doc index

| Doc | Role |
|-----|------|
| [README.md](README.md) | Hub |
| … | … |
~~~~

## docs/README.md

~~~~markdown
# <Project> — documentation hub

Slim TOC. Start from [CONTEXT.md](CONTEXT.md).

| Topic | File |
|-------|------|
| Permanent snapshot | [CONTEXT.md](CONTEXT.md) |
| … | […](…) |
~~~~

## Minimal domain set

- `docs/ARCHITECTURE.md` — layout, boundaries, “already in code”
- `docs/DEVELOPMENT.md` — run / env / OS gotchas
- `docs/ROADMAP.md` — milestones table (optional but useful)
