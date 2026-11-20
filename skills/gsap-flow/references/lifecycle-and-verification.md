# Lifecycle and verification

## Disposable ownership

Use the project's controller/composable conventions. Its responsibilities should be equivalent to:

| Operation | Responsibility |
| --- | --- |
| Mount | Discover owned targets after layout gates; classify current viewport; prepare and start once |
| Reconcile | Refresh geometry, discover new targets, regroup pending rows, keep completed state |
| Finish | Cancel entrance work and restore owned targets to final visible state |
| Dispose | Cancel scope callbacks, timers, rAF, observers, listeners, split wrappers, tweens and triggers |

Repeated mount must not create duplicate timelines/listeners. Keep the outgoing owner reference so disposal can reach detached nodes after a route swap. Use an epoch/generation token or abort signal for fonts, decode promises, delayed gates and frame callbacks; check it after every await and before every delayed mutation. Check connectivity and ownership too.

Dispose only owned resources. Avoid killing all ScrollTriggers or all tweens globally. If using GSAP context/matchMedia, account for asynchronously created animations and non-GSAP resources separately. Reversion does not cancel unrelated timers or restore framework-owned markup automatically.

## Livewire and SPA adapters

Treat Livewire navigation as SPA page replacement; treat component morphing as an update within the current page. Confirm the installed version before relying on events/hooks. Check first-load and back/forward semantics instead of copying a historical adapter.

For Livewire versions exposing the documented navigation events:

- Bind document listeners once in the application bundle, not on every page visit. `livewire:navigated` covers initial load too; if keeping a DOMContentLoaded fallback, make mount idempotent so both events cannot double-start the scope.
- Dispose the outgoing page owner on `livewire:navigating`, before replacement. Mount after `livewire:navigated`, component layout initialization and the app's scroll restoration gate. Persistent elements need their own owner and replay policy.
- Bind a supported post-morph hook once when Livewire is ready. In Livewire 4, component-level `morphed` runs after children morph; partial morphing may require another supported hook. Coalesce callbacks for a single update.
- For same-page filtering/pagination, wait for committed layout, then reconcile new targets and refresh pending ScrollTrigger positions. Two animation frames can settle ordinary morph/layout work; asynchronous fonts/images need their own bounded handling.
- Do not restart the hero or already shown cards on a filter change. Existing CSS item transitions may already own inserted menu/product cards; leave those owners intact.

Keep structural text splitting outside framework-owned morph regions where possible. Otherwise use the project's supported ignore boundary or revert/rebuild wrappers at the appropriate lifecycle point. Never make Livewire reconcile against stale split wrappers, and never rewrite text after its original DOM node was replaced.

**Regression to test:** filtering/pagination shrinks the list. Pending contacts/footer retain old starts beyond the new document scroll range and never reveal. After morph, refresh geometry and explicitly finalize groups already passed or unreachable, and play currently eligible groups. Preserve completed state. If a component updates only existing nodes, a full route teardown is unnecessary.

For Vue/Nuxt, React or other SPA routers, map the same operations to mount/commit and unmount/disposal. Coordinate existing route/pose/View Transition gates instead of adding a second route animation. Direct URLs must not wait for a transition that only runs on in-app navigation. Account for history restoration, persistent shells and repeated development mounts.

Versioned API references: [Livewire navigation](https://livewire.laravel.com/docs/4.x/navigate), [JavaScript morph hooks](https://livewire.laravel.com/docs/4.x/javascript). These are not a requirement to upgrade a consuming project.

## Failure and interaction recovery

- Base markup is readable without JS. Enable any pre-hide through a JS capability prelude with bounded release. Server-rendering a JS-enabled marker alone does not prove that animation scripts will run.
- Missing library, runtime exception, rejected readiness gate or timeout releases prepared targets. Once released, a late bundle must not flash already visible content back to hidden.
- Never wait for every media request before revealing copy. Use real dimensions/reserved aspect ratios; refresh geometry after relevant lazy assets. Investigate image decode/GPU stalls before changing offsets. Do not copy project-specific global ticker tuning as a universal fix.
- Reduced motion bypasses preparation and completes active entrances immediately. Handle runtime changes; dispose owned triggers and prevent stale callbacks from hiding content again.
- Focus reveals the target and its hidden entrance ancestors immediately. Pointer interaction and fast scrolling finish or shorten obsolete waits. Motion never gates navigation, form input or modal access.
- Restore only entrance-owned properties. Slider placement, permanent scale/rotation and hover wrappers are not disposable entrance styles.
- On bfcache/back/forward, preserve or finish the restored visible state according to existing navigation rules. Do not replay a hero on a restored scrolled page accidentally.

## Acceptance matrix

Use representative home, internal, listing/detail and footer cases. Run relevant existing tests/build/lint; a build alone does not prove visual order.

| Case | Observable result |
| --- | --- |
| Cold load, slow animation bundle | No visible → hidden → visible flash; bounded release on failure |
| Tall viewport shows hero and next section | Both planned at boot; downstream groups respect the chosen order |
| Short page / 1px of next section visible | Visible sliver does not remain concealed forever below a trigger line |
| Deep URL, anchor or restored scroll | Passed groups final; current viewport starts locally without hero backlog |
| 3 → 2 → 1 columns | Groups follow actual rows; stagger resets; mobile cards trigger individually |
| Resize during playback and after completion | Active work settles safely; done targets remain visible; pending rows regroup |
| Fast scroll during boot | No long hidden queue; newly visible content catches up locally |
| No JS, missing GSAP or thrown initialization | Readable content; preparation reliably released |
| Reduced motion at load and toggled mid-play | Immediate final state; no later callback re-hides targets |
| Keyboard tab into pending or queued content | Focused target and hidden owner ancestors reveal immediately |
| Repeated Livewire navigation, including first load | One owner per page; no accumulating callbacks; persistent shell follows policy |
| Livewire filter/pagination shrinks list | Pending contacts/footer refresh and reveal; done content does not replay |
| Livewire inserts/replaces cards | New targets handled once; retained identities keep state; CSS owners stay intact |
| Navigate away during readiness wait/timer | Stale work cannot mutate the new route or detached DOM |
| History return / bfcache | Correct current viewport; no duplicate first-load animation |
| Nested section and carousel | No parent/child double hide, clone stagger or slider transform loss |

For meaningful automated coverage, prioritize grouping from measured boxes, once-only state transitions, idempotent mount/dispose and stale-generation cancellation. Use the project's real framework; test behavior rather than searching source text for constants. Browser checks observe sequence, visibility, focus and update lifecycle. State which cases were not run.

## Failure diagnosis

| Symptom | First evidence to inspect |
| --- | --- |
| Everything appears together | Actual end times vs start offsets; independent conductors competing |
| Second section flashes during hero | Preparation applied late; conflicting CSS; both parent and child hidden |
| Mobile item waits for off-screen siblings | Global list index or section-wide chain instead of local row grouping |
| Footer stays hidden after filtering | Stale trigger start beyond the new scroll range |
| Entrance runs twice after navigation | Duplicate first-load binding or missing disposal |
| Cards jump or slider breaks | Competing transform owners or broad clearProps cleanup |
| Later steps never run | Callback-created tween had no reserved duration |
| Media fade jumps despite correct timing | Decode/upload stall, broad CSS transition or conflicting animation owner |
