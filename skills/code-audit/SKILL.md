---
name: code-audit
description: "Cross-examination of the current change through three lenses: architecture, security, and QA."
whenToUse: "Use for a strict review of code produced in this conversation, before merge, or when asked to audit a diff."
---

# Code audit: three independent lenses

Review the current change (diff or files under discussion), not the whole repository unless asked. Be direct and evidence-based: cite `file:line` and explain the failure mode.

## 1. Tech Lead — architecture and readability

- Are boundaries and responsibilities in the right place? Any layer violation or leaky abstraction?
- Naming: does it express intent? Any misleading or generic names?
- Cognitive complexity: deep nesting, long functions, hidden control flow.
- Duplication and missed reuse of existing helpers.
- Technical debt introduced: dead code, mocks, TODOs, commented-out logic, leftover logging.
- Scalability: what breaks at 10× data, users or payload size?

## 2. AppSec — security and data

- Input validation and output encoding at every boundary.
- Injection: SQL/ORM, shell, templates, path traversal, SSRF.
- AuthN/AuthZ: server-side checks, IDOR, privilege escalation, tenant isolation.
- Secrets in code, logs, errors, fixtures or commit history.
- Sensitive data: over-fetching, PII in logs, unsafe error messages.
- CSRF, CORS, unsafe deserialization, file upload handling.

## 3. QA — logic and edge cases

- Null/undefined/empty collections, type coercion, off-by-one, boundaries.
- Async: races, ordering, retries, duplicate submissions, partial failure.
- State: mutations that leak between requests/tests, cache invalidation, idempotency.
- Error paths: what the user sees, what is logged, what is retried.
- Compatibility: existing data, API consumers, migrations, rollback.

## Output

Group findings by severity, then a short verdict:

```
Blockers
- file:line — problem → fix

Warnings
- file:line — risk / debt → suggestion

Suggestions
- …
```

Rules:

- Only blockers block. Do not inflate style preferences to blockers.
- Do not rewrite the code unless asked — propose the fix.
- If a finding depends on an assumption, state the assumption.
- If the diff is clean, say so and name what you checked.
