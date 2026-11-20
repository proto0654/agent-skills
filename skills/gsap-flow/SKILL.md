---
name: gsap-flow
description: "Coordinate website entrance animations: sequence initially visible groups, reveal later groups on scroll, and stagger cards by actual responsive rows. Use for chained GSAP entrances, first-viewport timing, adaptive grid reveals, or their SPA/Livewire lifecycle. Preserve existing CSS/observer implementations when they already express the flow. Not for standalone hover effects, scroll-scrub scenes, or general page redesign."
---

# GSAP Flow

Build a readable entrance sequence that follows the current layout and viewport. The reusable behavior is the combination of ordered phases, initial visibility, and responsive rows; individual fade/slide effects are interchangeable.

Documentation language: English. Follow the user's language for replies.

## Inspect before choosing the flow

- Read project instructions, motion docs, relevant templates, CSS, initialization and cleanup code. Confirm library versions from lockfiles or installed metadata, including Livewire when present.
- Reuse the existing motion controller and tokens. Do not add GSAP, ScrollTrigger, a splitter, smooth scrolling, or another dependency without authorization. CSS plus IntersectionObserver can implement the same scheduling contract.
- Identify owners: persistent shell, route body, nested sections, grids, sliders, existing text animation and scroll effects. Give each target/property one entrance owner. Respect existing transitions and framework DOM ownership.
- Map meaningful groups, such as hero copy, quick links, section heading, each card row, media, CTA and footer. Include internal pages and short/tall viewport cases, not just the home hero.

Read [Choreography](references/choreography.md) when implementing scheduling or row grouping. Read [Lifecycle and verification](references/lifecycle-and-verification.md) for runtime integration, Livewire/SPA updates, failure recovery, and acceptance checks.

## Scheduling contract

1. **Measure the final layout before entrance transforms.** Wait for DOM/framework commit, layout anchor stability and the existing scroll restoration gate. Measure before writing entrance transforms.
2. **Classify before preparing.** Separate already passed, initially intersecting, future and non-rendered groups. Passed content is final. Initially visible content includes the next section when it already shares the screen, even partly.
3. **Coordinate the initial viewport.** Feed initially eligible groups into one content conductor. Default to completion-based group handoffs with a short gap when the request calls for a clear sequence. Deliberate overlap or capped stagger is valid when the design calls for it; small independent delays do not establish sequence.
4. **Reveal future groups locally.** Each pending row/group starts once when eligible, using local item order with its delay reset. Do not make later scroll content wait for every preceding section or its absolute index in the document.
5. **Use the actual row.** At three columns, stagger three cards together; at two, stagger two; at one, trigger each card independently as it arrives. Recompute pending groups when layout changes. Preserve completed targets and finish or safely hand off active targets.
6. **Prepare without trapping content.** Apply required initial hidden states before playback so later boot groups do not flash while the hero plays. If first-paint hiding is needed, use a bounded JS prelude; keep no-JS content visible and release on failure/focus/timeout.
7. **Keep interaction ahead of decoration.** Focus reveals its target immediately. Fast scrolling must catch up without a hidden backlog. Reduced motion shows the final state and cancels pending work, including when the preference changes at runtime.

Persistent shell entrances can run independently when already designed that way. A viewport containing the hero and the next section still needs coordinated content order. Do not force the shell, whole document, or a long mobile list into one blocking timeline.

## Timing and ownership

- Separate group order, within-row stagger, and local phase order (for example heading → copy → media). Start the next group after the last staggered item, unless overlap is intentional.
- Use timeline children/labels or completion signals, not guessed fixed delays for dependencies. Lazy-created tweens need an explicit duration contract; returning a tween from a callback does not reserve timeline time.
- Reuse project motion tokens. If none exist, a restrained starting point is 0.4–0.55s duration, 0.05–0.08s item stagger, 8–12px lift, and a small group gap. These are tuning examples, not acceptance criteria.
- Animate wrappers or proxies when another controller owns transforms. Do not clear existing slider, layout, hover or 3D transforms. Scope selectors to the nearest section owner; do not hide both a parent and its separately controlled descendants.

## Runtime contract

Treat initialization as an idempotent, disposable scope with pending/queued/playing/done state. A route change disposes the outgoing scope; a same-page morph refreshes geometry and discovers new targets without replaying completed content. Cancel stale async callbacks with a scope/generation guard. Never kill unrelated GSAP timelines or global ScrollTriggers.

For Livewire, distinguish `wire:navigate` page replacement from a component morph. The relevant adapter and the footer-after-filter regression are in [Lifecycle and verification](references/lifecycle-and-verification.md#livewire-and-spa-adapters).

## Verify and report

Run affected project checks and exercise the acceptance matrix in the lifecycle reference. Use real browser behavior to assess order; source inspection alone cannot prove a visual sequence. Test pure grouping/state transitions in the existing test framework when implementation changes warrant it. Report what changed, what was run, and any unverified browser/runtime cases. Update the existing motion domain doc when permanent behavior changes.
