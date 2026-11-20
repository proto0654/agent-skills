# actualize (project template)

Copy to `.cursor/commands/actualize.md` and replace `<Project>` / doc names.

~~~~markdown
# actualize

Role: Technical Writer and Software Architect.
Task: Update <Project> documentation from the recent conversation and diff.

If this file disagrees with the global `actualize` skill, **this file wins**.

## 0. Git hygiene (run first)

1. Run `git status -sb` (and `git diff` if useful).
2. If there are **uncommitted** changes from this conversation:
   - Summarize what changed (1–3 bullets).
   - Propose a Conventional Commit message.
   - **Ask** whether to commit now (unless the user already asked to commit).
3. Do not invent release/deploy steps that are not documented in the project docs.

---

## 1. Analyze

Review the conversation and the diff. Identify which **documented behavior** changed — not merely which files were touched.

---

## 2. Update docs (targeted; keep hubs slim)

1. **Domain docs** under `docs/` — update the owning file only.
2. **docs/CONTEXT.md** — only if a **permanent** fact changed. No session changelog.
3. **docs/README.md** — TOC only. Add a row if a **new** doc was created. Never append “Recent changes”.
4. Put non-obvious gotchas in the domain doc closest to the change.

Do not resurrect deleted docs. Do not duplicate a product SoT that already lives elsewhere.

---

## Output

- Docs edits: **English** (unless CONTEXT records an exception for a specific file).
- Chat: **Russian**.

End with:

    Docs status
    - Files updated: …
    - Suggested commit: …
    - Verification: …

Ask before committing unless the user already requested a commit.
~~~~
