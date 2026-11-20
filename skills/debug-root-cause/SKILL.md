---
name: debug-root-cause
description: "Root-cause debugging protocol: reproduce, isolate, prove the cause, then apply the smallest fix with a regression test."
whenToUse: "Use when code runs but behavior is wrong, state mutates unexpectedly, or a bug is reported without a clear cause."
---

# Debug until the cause is proven

Do not start editing on a hunch. A fix without a proven cause is a guess that hides the bug.

## 1. Reproduce and observe

- Get the exact symptom: input, expected, actual, environment, frequency.
- Reproduce it, or state precisely why you cannot.
- Read the error and the stack trace fully before searching for a fix.

## 2. Isolate

- Narrow by layer: input → validation → domain → persistence → response.
- Use bisection: disable/replace one variable at a time.
- Check recent changes (`git log`, `git diff`) — regressions usually have a commit.
- Inspect real state (logs, DB rows, payloads), not assumptions about it.

## 3. Prove the root cause

Write the causal chain explicitly:

```
Symptom: …
Trigger: …
Root cause: file:line — …
Why it explains the symptom: …
```

If you cannot fill this in, keep investigating. “Probably” is not a root cause.

Pay special attention to:

- async ordering, races, missing `await`;
- shared mutable state and cache;
- type coercion and empty values;
- authorization/tenant context lost between layers;
- retries causing duplicate side effects.

## 4. Fix minimally

- Change the smallest surface that addresses the cause.
- Do not refactor unrelated code in the same change.
- Keep behavior for other inputs unchanged; add a regression test that fails before and passes after.
- If the fix requires a broader change, stop and propose it separately.

## Output

```
Root cause: …
Evidence: …
Fix: file:line — …
Regression test: …
Risk / follow-ups: …
```

If the bug is not reproducible, report what was ruled out and what data is needed next — do not pretend it is fixed.
