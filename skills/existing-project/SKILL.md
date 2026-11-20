---
name: existing-project
description: "Open an existing repository and get to a safe first change: workspace, context, baseline, architecture map, bounded task, verification."
whenToUse: "Use when opening an unfamiliar or long-unseen project, onboarding to a repository, or handing one to an agent."
---

# Existing project: from open to first safe change

## 1. Open it as a workspace

- One repository = one workspace and one session root.
- Confirm you are at the repository root (`git rev-parse --show-toplevel`), not a parent folder or a nested package.
- Read `git status --short` before touching anything. Note modified and untracked files; never clean or revert them on your own.
- If the folder is not a Git repository, ask before initializing one.
- If it is a monorepo, identify the package you will work in and treat it as the session's working directory.

## 2. Read the project's own instructions

Read in this order, stopping when the task is clear:

1. `AGENTS.md` / `CLAUDE.md` (entry point).
2. The context snapshot (`docs/CONTEXT.md`, `PROJECT_CONTEXT.md`, or equivalent).
3. The docs hub and the domain doc for the area you will touch.
4. `.cursor/rules`, `docs/adr`, `CONTRIBUTING.md` if present.

If docs and code disagree, trust the code and report the mismatch. If there is no entry point, create a short `AGENTS.md` later: purpose, key paths, commands, hard rules — do not paste the whole repository into it.

## 3. Establish the baseline before changing

- Detect the stack from manifests and CI: `package.json`, `composer.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, `Makefile`, `.github/workflows`.
- Read the scripts before running them: install, build, test, lint, dev, migrate.
- Do not install dependencies, run migrations, start services, or touch `.env` files without asking.
- Run the cheapest read-only checks first: recent history, current branch, existing tests or linter. Record what passes and what already fails — that is your baseline.

## 4. Map the architecture when the repository is non-trivial

Before the first change, ask for an architecture diagram with the `archify` skill. It produces one standalone HTML artifact from the real code, not a guessed picture.

How to read the result:

- **Canvas** — nodes are components, colors are types, a frame is a real boundary.
- **Semantic Passport** (click a node) — incoming and outgoing relationships answer "who calls it" and "what it calls".
- **Upstream / Downstream** — authored reachability over drawn arrows, not runtime impact or blast radius.
- **Route** — trace one real request end to end; **Lens** — isolate a layer (frontend, backend, data, security).
- **Legend** — counts by type, useful to spot missing components.

Fall back to the directory tree, entry points, and dependency manifests when a diagram is not warranted. Treat the diagram as an overview: verify any claim you will act on in the source.

## 5. Choose a bounded first task

- Prefer something small and verifiable: fix a failing test, add a missing guard, update one doc, add one log line.
- If the task touches more than a couple of files or the requirements are ambiguous, use plan mode first.
- The first diff validates the whole loop — edit, test, review, commit — before you take on the real change.

## 6. Work the loop

- Read the file and its siblings before editing; follow existing structure, naming, and patterns.
- Make the smallest change that satisfies the task; no drive-by refactors.
- Run the affected tests, linter, and build after each step; state what was not verified.
- Review the diff through the changed-files card before committing.
- Commit only when asked, with a Conventional Commit message.

## 7. Leave the project easier to enter

- Update the context snapshot only for permanent facts; update domain docs for changed behavior.
- Put non-obvious gotchas in the domain doc closest to the change.
- Run the `project-context` link checker after adding, moving, or deleting docs.
- Report unresolved questions and mismatches in the final reply, not as code comments.

## Safety rails

- Never deploy, force-push, rewrite shared history, rotate credentials, or run production migrations without an explicit request.
- Never print or commit secrets from `.env`, config, or logs.
- Do not hand-edit generated or vendor directories; rebuild them through the project's tooling.
- Local-only docs may be absent on another machine; committed files must stay understandable without them.
- If the project has no tests, say so and agree on a manual verification step before changing behavior.

## First reply

Report, briefly: what the project is, how it is run locally, what already fails, and the one task you propose to start with. Then wait for the task instead of exploring the whole repository.
