---
name: release-audit
description: "Production-readiness audit of the repository or a release: dead code, configs, dependencies, migrations, docs, rollback."
whenToUse: "Use before a release, when asked to check production readiness, or after a large merge."
---

# Release audit

Scope: the repository or the release diff. Read configuration and entrypoints; do not trust README claims without checking the files.

## Checklist

### 1. Code health

- Dead code, unused exports/modules, leftover feature flags, temporary mocks, debug prints, development-only logging.
- TODOs/FIXMEs that block the release; commented-out blocks.
- Error handling: unhandled promises, swallowed exceptions, missing timeouts.
- Version pins: no `latest`, no floating ranges where reproducibility matters.

### 2. Configuration and environment

- `.env.example` lists every required variable; no real secrets committed.
- Default values are safe for production (debug off, verbose errors off).
- Docker/CI/deploy scripts match the current entrypoints and build output.
- File permissions, writable paths, and storage locations are correct.

### 3. Dependencies and build

- Lockfile present and consistent; no unresolved conflicts.
- Build passes from a clean checkout; production build uses production mode.
- No dev-only packages required at runtime.

### 4. Data and schema

- Migrations are ordered, idempotent where possible, and have a rollback path.
- Backfill jobs are safe to re-run; no destructive change without a backup plan.
- Indexes exist for new query paths; no obvious N+1 in critical endpoints.

### 5. Documentation

- Setup/run/deploy instructions match reality.
- Permanent facts (paths, env names, auth model) are current.
- No docs describing removed features.

### 6. Operability

- Health checks and logs exist for new services/jobs.
- Rollback is known and tested at least conceptually: previous artifact, schema, config.
- Secrets rotation does not require a code change.

## Output

```
Blockers
- …

Warnings
- …

Docs outdated
- …

Verdict: ready / not ready
```

A blocker is something that breaks production, loses data, exposes secrets or prevents rollback. Everything else is a warning.
