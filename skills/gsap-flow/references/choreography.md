# Choreography

## Model groups before effects

Represent a group by its owner, ordered targets, layout anchor, eligibility and state. A title with its lead may form one group; a grid produces one group per visual row. Deduplicate targets, ignore non-rendered items and keep nested entrance roots independent.

Keep eligibility separate from lifecycle:

- Eligibility: already passed / intersects current viewport / future / not currently rendered.
- Lifecycle: pending → queued → playing → done. Claim a group before scheduling it, so repeated observer callbacks cannot enqueue it twice.

Store completed identity for the lifetime of the current scope. A DOM WeakSet works for retained nodes. If the framework replaces nodes representing the same item during a morph, use stable business keys within that scope when replay prevention is needed. Do not persist one global played set across unrelated routes.

## Initial classification

Read candidate geometry before writing opacity/transform. Use a non-animated layout anchor: an entrance lift changes `getBoundingClientRect()` and can corrupt row detection or trigger starts. For the document viewport, with all values in viewport coordinates:

```text
rect.bottom <= 0                             → passed: show final state
rect.top < viewportHeight && rect.bottom > 0  → initially intersecting
rect.top >= viewportHeight                    → future
```

Filter non-rendered elements before classification. Account for horizontal intersection and clipping containers too. For nested scroll regions use that scroller's root bounds, not the document viewport.

An 8–10% bottom inset can make scroll entrances feel deliberate. It must not strand a visible sliver below that line on a static short page. Give such a group an explicit initial follow decision or reveal it immediately. If a start lies beyond the maximum scroll position, reveal/complete it instead of waiting forever.

Read geometry after the framework commits, existing scroll restoration, and any layout-critical font/slider initialization. Do not hold all copy behind window.load or a heavy video request. Use bounded readiness and remeasure when relevant late assets settle.

## Initial versus scroll sequences

```text
hero copy
    → quick-link row
    → next section heading, if initially intersecting
    → each initially intersecting card row

future heading/row → its own scroll eligibility → local stagger → done
```

Order by intended reading order. Ordinary top-aligned grids sort rows top-to-bottom and items left-to-right (reverse for RTL). If CSS order conflicts with semantic reading order, inspect the intended contract rather than sorting the entire page blindly by pixels. A heading precedes its associated cards even when their callbacks fire in one frame.

If the user scrolls during boot, do not append an unbounded chain of newly intersecting sections to the hero timeline. Finish/release obsolete queued groups and hand new content to bounded local scheduling. A target that moves past the viewport is finalized. A newly visible row starts locally; it must not wait through unseen sections.

## Completion versus offset

For equal item duration `d`, stagger `s`, and `n` targets:

```text
groupDuration = d + max(0, n - 1) * s
nextGroupStart = groupStart + groupDuration + groupGap
```

A fixed 0.16s start offset with a 0.45s animation creates overlap. Use it only when overlap is intended. For mixed-duration child timelines, use the actual end rather than the simplified formula.

GSAP sketch, assuming valid scope-owned prepared targets and recovery/cleanup implemented by the controller:

```js
const boot = gsap.timeline({ paused: true });

for (const group of initiallyVisibleGroups) {
  if (!group.targets.length) continue;
  const position = boot.duration() === 0 ? 0 : `+=${groupGap}`;
  boot.to(group.targets, {
    opacity: 1,
    y: 0,
    duration: itemDuration,
    stagger: itemStagger,
    ease: 'power2.out',
  }, position);
}

boot.play();
```

The next group uses the timeline end, including previous stagger. This is a scheduling example, not a drop-in controller. Clear only entrance-owned properties or restore the recorded final state on completion.

When building lazily, add a real child timeline or reserve a known slot before playback. A callback that creates/returns an animation is not a timed child. Avoid splitting all document text just to compute durations: prepare only the next needed text after its fonts/layout are ready, or reserve a bounded slot and reconcile its length before dependent steps.

CSS/observer variants can use a small capped cascade for initially visible items. Below-fold items start with fresh local delays. Do not assign `index * delay` across the whole document or feed unbounded lists into the boot chain.

## Actual responsive rows

1. Measure all rendered candidate boxes in one read phase, before entrance transforms; do not interleave layout reads and style writes.
2. For ordinary top-aligned grids, sort by top and group approximately equal top coordinates (a small 2–3 CSS px tolerance handles fractional layout).
3. Sort each row's members by horizontal reading direction. The stagger index starts at zero for every row.
4. Trigger each pending row from a stable layout anchor. Bind eligibility once, then stagger its current pending members.

Use actual positions instead of dividing a DOM index by a hardcoded column count. This handles auto-fit, breakpoints, container widths, incomplete rows and filtered items. Masonry, centered unequal-height flex rows and vertical writing need a layout-specific grouping rule; do not force top equality onto them.

| Layout | Groups for cards A–F | Local delays |
| --- | --- | --- |
| 3 columns | ABC / DEF | 0, s, 2s in each row |
| 2 columns | AB / CD / EF | 0, s in each row |
| 1 column | A / B / C / D / E / F | 0 for each card at its own trigger |

Rows visible at boot join its sequence. Future rows do not inherit the accumulated boot duration. On mobile, D must not wait for the entrance of off-screen A–C.

Horizontal carousels are not wrapping grids. Exclude clones, preserve the slider transform, and distinguish visible slides from off-track slides. Use the existing slider lifecycle for newly shown slides rather than animating the entire track as one viewport row.

## Reflow without replay

On width/container changes, font reflow or filtering, rebuild pending groups. Finish active groups safely before regrouping remaining peers. Retain done identities; never re-hide completed targets. Keep pending prepared states stable during a rebuild so there is no visible → hidden flash.

Height-only mobile browser toolbar changes usually need viewport/trigger refresh rather than full split/row rebuild. Observe layout changes that happen without window resize when needed. Prevent observer feedback from the animation's own writes.

## API sources

Check compatibility with the consuming project's installed version:

- [GSAP timelines and positions](https://gsap.com/docs/v3/GSAP/Timeline/).
- [ScrollTrigger geometry and refresh](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
- [GSAP matchMedia and reversion](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/).
