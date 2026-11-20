---
name: qa-edge-cases
description: "Find blind spots and edge cases in a change, then produce tests in the project's existing framework."
whenToUse: "Use when a feature is implemented, a bug is fixed, or the user asks what could break."
---

# QA edge cases

Detect the project's test framework and conventions first (`package.json`, `composer.json`, `pyproject.toml`, existing test files). Match them; never introduce a second test framework.

## Map the surface

For each changed entry point, list:

- inputs: types, ranges, optionality, encoding, size;
- state: what is read/written, what is cached, what is shared;
- external calls: timeouts, errors, retries, partial success;
- concurrency: parallel requests, duplicate submits, ordering;
- permissions: who may call it, what happens across tenants/users.

## Categories to check

| Category | Examples |
|---|---|
| Empty | `null`, `undefined`, `""`, `[]`, `{}`, zero |
| Boundary | min/max, off-by-one, pagination edges, long strings, unicode |
| Type | numeric strings, floats vs ints, dates/timezones, booleans as strings |
| State | re-entry, double submit, stale cache, mutation leaking between calls |
| Async | race, out-of-order responses, retry duplication, cancellation |
| Failure | network error, 4xx/5xx, DB constraint, disk full |
| Auth | missing/expired session, wrong role, IDOR, cross-tenant access |
| Data | legacy rows, missing relations, soft-deleted records, migration mid-flight |
| UI | loading, empty, error and partial states; very long content; keyboard only |

## Output

```
Covered
- …

Gaps
- case → expected behavior → risk

Proposed tests
- name — setup → action → assertion
```

Rules:

- Test the changed behavior and its important failure modes; do not test the framework.
- Prefer deterministic assertions over snapshots for logic.
- If a case is genuinely out of scope, say why instead of silently skipping it.
- Write the tests only if asked; otherwise propose them.
