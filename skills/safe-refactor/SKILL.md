---
name: safe-refactor
description: "Refactor without changing behavior: freeze contracts, cover with tests, move in small verified steps."
whenToUse: "Use when asked to clean up, deduplicate, restructure, or reduce complexity in existing code."
---

# Safe refactor

The goal is the same behavior with better structure. If behavior must change, that is a separate change.

## 1. Freeze the contract

Record what the outside world depends on:

- public functions, signatures, types, return shapes;
- HTTP routes, request/response fields, status codes;
- DB schema, stored data, migration behavior;
- CLI flags, env variables, config keys;
- events, queue payloads, file formats.

Anything on this list stays identical unless the user explicitly approves a breaking change.

## 2. Establish a safety net

- Run the existing tests before touching anything; note failures as baseline.
- If the area is untested, add characterization tests for current behavior first.
- Keep a small, reproducible verification command for each step.

## 3. Move in small steps

- One mechanical transformation per step: rename, extract, inline, move.
- Do not mix refactor with feature work or dependency upgrades.
- After each step: run tests/linters; if red, revert the step instead of debugging forward.
- Delete dead code only after confirming nothing references it (search, not intuition).

## 4. Preserve semantics

Watch for subtle changes:

- evaluation order and short-circuiting;
- null vs missing vs empty;
- exception types and messages that callers catch;
- iteration order and duplicate handling;
- floating point, date/timezones, encoding;
- side-effect order (writes, events, logs).

## 5. Report

```
Contract: unchanged / changed (why)
Steps: …
Verification: command → result
Remaining risks: …
```

If the refactor exposes a real design problem, stop and propose it as a separate change instead of expanding scope.
