# Engineering rules (all projects)

These are stack-agnostic. A project's own `AGENTS.md` and docs override anything here.

## Language and replies

- Reply to the user in Russian unless they write in another language.
- Project documentation, `AGENTS.md`, code comments, identifiers and commit messages: English. English tokenizes more efficiently, keeps context cheaper, and gives more consistent model behavior across sessions; it also keeps docs portable across tools and teams.
- Keep Russian for: direct replies, UI strings quoted verbatim, business/legal documents the team owns in another language (contracts, regulations, customer-facing legal texts), and projects that explicitly document a Russian convention.
- Do not translate an existing doc tree wholesale. New docs are English; when editing an existing Russian doc, keep its language unless asked.
- Record the documentation language in the project entry point so an agent never has to guess.
- Be concise: what changed, why, how it was verified. Skip obvious explanations.

## Before changing code

- Read the file and its siblings first; follow the existing structure, naming and patterns.
- Reuse existing components/helpers before adding new ones.
- Confirm installed versions before using an API (manifest/lockfile) — never assume.
- Do not add dependencies, create new base folders, or rewrite architecture without asking.
- Read the project `AGENTS.md` and relevant docs before touching an unfamiliar module.

## Architecture and code quality

- SOLID, DRY, KISS; single responsibility; names that explain intent (`isRegisteredForDiscounts`, not `discount`).
- Guard clauses instead of deep nesting; keep cognitive complexity low; split heavy functions.
- No hacks, dead code, commented-out blocks, debug scaffolding or temporary mocks left behind.
- One source of truth for config and business rules; no duplicated logic across layers.
- Refactoring must keep external contracts, signatures and types identical unless a change is explicitly agreed.

## Security

- Validate and sanitize at system boundaries: HTTP, forms, CLI, DB queries, file paths.
- No secrets, tokens or keys in code, logs or commits — environment/config only.
- Authorization is enforced server-side; least privilege by default.
- Cover the basics: injection, XSS, CSRF, SSRF, path traversal, unsafe deserialization.

## Performance

- Avoid N+1 queries; batch or eager-load.
- Watch for O(n²) loops and unnecessary re-renders or heavy recomputation.
- Measure before optimizing; a guess is not a profile.

## Reliability

- Handle async failures, timeouts, retries and partial failures; provide safe fallback states.
- Make jobs, webhooks and migrations idempotent.
- Do not swallow errors silently; log with context, never with secrets or personal data.

## Verification

- Every change: run the affected tests, linters and build; show the command output in the reply. Add or update tests for the changed behavior and its key failure modes.
- Do not claim something works without running it. State explicitly what was not verified.
- Prefer real tests over ad-hoc verification scripts.
- Schema or data changes need a migration, a rollback path and a docs update.
- At most two attempts on the same failing check; then change approach or stop and ask.
- If the same defect appears twice, fix it at the source (shared helper, rule, hook, or regression test)—do not keep patching the symptom.

## Review and risk

- Before merge or release of non-trivial work, run a fresh-context review (`/code-audit`; add security focus when auth, money, PII, or secrets are touched). Do not rely only on the writing session.
- Critical surfaces need an explicit human go-ahead before finishing: payments/billing, auth/permissions, secrets/credentials, schema/migrations, production deploy, and push/force-push to shared release branches (`main`/`master`) when that is the release path.
- Keep global and project agent instructions short. Soft preferences stay in text; hard “never” constraints belong in harness permissions/hooks when available—not only in prose.

## Git

- Conventional Commits (`feat(scope): …`, `fix(scope): …`, `chore: …`), first line ≤ 72 chars, no `wip`/`fix2`/`update`.
- One logical change per commit; do not stage unrelated files.
- Show `git status` and the proposed message; commit only when asked.
- Never force-push shared branches or rewrite history without an explicit request.

## Deployment

- Never deploy, run production migrations or restart production without an explicit request.
- Follow the project's deploy checklist; verify a clean tree and record the deployed commit.
- Prefer reversible changes; know the rollback before applying anything.

## Documentation

- Update docs when behavior or permanent facts change, or when asked.
- Docs in English by default; keep hubs/TOC slim, no session changelogs.
- Record non-obvious gotchas in the domain doc closest to the change.
- If the project defines a planning workflow (OpenSpec, ADR, RFC), follow it instead of inventing one.

## Project context

- `AGENTS.md` is the agent entry point: what the project is, where things live, commands, hard rules — and links to the context doc and docs hub, not duplicates of them.
- Keep permanent facts in one context snapshot; keep decisions/acts dated and immutable; keep hubs as slim TOCs without changelogs.
- Link files, not directories, with relative paths. Every document should be reachable from an entry point in at most two hops.
- After adding, moving or deleting docs, update inbound links and run the `project-context` link checker.

## Skills

- The available-skill catalog is part of your working surface. When a request matches a skill, load it with the `skill` tool instead of improvising the procedure.
- At the natural checkpoint, remind the user once, in one short line, with the exact command:
  - starting in an existing or unfamiliar repository → `/existing-project`
  - after a code change → `/actualize`
  - before committing → `/commit-message`
  - before a release or deploy → `/release-audit`, or the project's deploy skill
  - when a bug has no proven cause → `/debug-root-cause`
  - when planning tests → `/qa-edge-cases`
  - before a merge or a strict review → `/code-audit`
  - during a behavior-preserving cleanup → `/safe-refactor`
  - when restructuring docs → `/project-context`
- Mention a skill only when it applies to the current step, at most once per task. Never dump the catalog, never interrupt work for a reminder, never repeat a suggestion the user ignored.
- Invoke by typing `/name` or by asking; project skills shadow global ones with the same name — prefer the project version.

## Planning

- If a task touches more than a couple of files or is ambiguous: propose a short plan and wait for approval.
- State assumptions explicitly; ask when a decision materially changes scope, behavior or compatibility.
