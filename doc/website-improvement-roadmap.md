# Homenavi Website Improvement Roadmap

Reviewed against the October 23, 2026 marketing-site review. The goal is to turn
an already credible developer landing page into a clearer adoption and contributor
funnel without diluting its technical tone or making unsupported comparison claims.

## Product Outcomes

1. A visitor can identify Homenavi's engineering choices in less than a minute.
2. Visitors can choose a next step that matches their intent: evaluate, self-host,
   or extend the platform.
3. Prospective operators can assess readiness from current, linked evidence rather
   than decorative trust signals.
4. Integration authors can reach a runnable starter project and first contribution
   path without having to infer the workflow from multiple repositories.

## Principles

- Describe Homenavi's own architecture and behavior; do not claim it is universally
  better than Home Assistant, openHAB, or another platform.
- Link every maturity, release, integration-count, CI, or compatibility claim to a
  source that is current at build time or clearly date-stamped.
- Keep the homepage editorial and route detailed technical material to Architecture,
  Guides, Marketplace, and Community.
- Preserve the existing glass visual language, real product screenshots, responsive
  behavior, and static-export deployment model.
- Measure changes with consent-respecting, aggregate events only after a published
  privacy decision. Do not add analytics by default.

## Phase 0: Baseline And Content Inventory

**Priority:** P0

### Work

- Define the three visitor journeys and their destination pages:
  - **Try it:** `/demo`
  - **Self-host it:** `/guides/quickstart` and `/guides/self-hosting`
  - **Build with it:** the main repository and integration template
- Record a baseline of CTA click-through, demo handoff, guide completion proxies,
  GitHub referral traffic, and integration-template referrals if an approved
  privacy-respecting measurement system is available.
- Create a small content-source inventory for marketplace data, releases, CI, known
  limitations, backup/recovery guidance, and integration support status. Each future
  fact section must identify its owner and refresh behavior.
- Audit the existing public links for availability and destination correctness.

### Deliverables

- `doc/website-content-sources.md` listing each public fact, source URL/API, owner,
  refresh cadence, and fallback behavior.
- A concise decision on analytics: approved implementation and retention policy, or
  no analytics with manual review cadence.

### Acceptance Criteria

- No new public status value lacks a verifiable source and an empty/error state.
- The three journeys have one primary destination each and no conflicting labels.

## Phase 1: Explicit Engineering Differentiation

**Priority:** P0
**Primary surface:** Homepage, immediately after the product workflow walkthrough.

### Work

Add a compact section titled **"Built around explicit platform contracts."** It
should explain Homenavi-specific design choices with a short statement and a direct
technical link for each:

| Engineering choice | Evidence to present | Destination |
| --- | --- | --- |
| Realtime protocol boundary | HDP device state, commands, and lifecycle events | `/architecture` |
| Independent integration runtime | Manifest-declared device, widget, automation, auth, and UI capabilities | `/integrations` |
| Acknowledged commands | Correlation IDs and acknowledgements support result-aware workflows | `/features` or `/architecture` |
| Operator-owned deployment | Compose for small installs and Helm for Kubernetes | `/guides/self-hosting` |
| Scoped assistant access | OAuth-scoped MCP access for inventory and workflow operations | `/guides/mcp` |

Use a small system diagram or contract strip, not a competitor comparison table.
The copy should say what Homenavi is designed to do, not claim feature parity or
superiority over another project.

### Acceptance Criteria

- The section names all five design choices in scannable language.
- Every item links to a page that substantiates it.
- No claim depends on an unverified competitor assertion.
- Mobile layout remains one column without horizontal overflow.

## Phase 1A: Product Walkthrough That Shows The Operating Model

**Priority:** P0
**Primary surface:** Homepage walkthrough, replacing the current five-step sequence.

### Objective

Evolve the walkthrough from a short product tour into nine evidence-led chapters.
Each chapter should show a real Homenavi interface or a factual architecture visual,
then describe the user's outcome, the underlying behavior, and one relevant next
step. The sequence should read as one connected operating model rather than nine
unrelated feature cards.

### Structure And Interaction

- Keep the alternating editorial text-and-product-frame layout on desktop and the
  single-column treatment on mobile.
- Use one decisive screenshot or short capture per chapter. Crop to the exact task;
  do not put labels or decorative overlays over important application UI.
- Add an optional `Explore` text link to the relevant page beneath each chapter.
  Reserve filled buttons for the three primary visitor journeys, not every step.
- Animate chapters only on entry: text and media should settle into place once;
  screenshots must remain visible for static captures and reduced-motion users.
- Use a compact journey index grouped into **Configure**, **Operate**, and
  **Extend** on desktop. It should become a simple numbered sequence on mobile.
- Every visible current-state claim must be backed by a current screenshot or
  technical source. Mark forward-looking items with `On the roadmap` rather than
  presenting them as available now.

### Walkthrough Chapters

| # | Chapter | Story To Tell | Evidence And Product Frame | Follow-up |
| --- | --- | --- | --- | --- |
| 1 | **Make the dashboard yours** | A dashboard is an operator workspace: create one for a room or routine, resize and rearrange its layout, and add integration-provided widgets alongside core controls. | A focused dashboard-edit capture showing layout controls, resizing/reordering, and at least one integration widget. | `/features` |
| 2 | **Pair once, operate consistently** | Pairing produces a normal Homenavi device regardless of its integration. Explain that rooms, tags, and groups give the same device multiple useful ways to be found and targeted. | A paired-device flow followed by the device detail/list showing room, tag, and group assignment. Use only the currently supported pairing steps. | `/guides/integration-setup` and `/features` |
| 3 | **See the home as a place** | The map is the spatial layer for rooms, devices, and live state. Show placement, room-level inspection, and the device-list room context/selection behavior that helps move between inventory and space. | A map capture plus a device-list capture that proves the room-selection behavior. | `/features` |
| 4 | **Build automations with consequences** | Show the advanced builder as a workflow tool: triggers, conditions, targeting, branching or sequencing where supported, actions, and result-aware acknowledgements. | A real complex automation with readable condition/action/result stages. Do not imply unsupported control flow; label the exact builder capabilities shown. | `/guides/automations` |
| 5 | **Extend the platform, not the core** | Explain integrations as independently deployed services with manifests. They can contribute devices, custom widgets, setup surfaces, and automation capabilities while presenting as part of the same Homenavi experience. | Marketplace entry, integration detail, widget, and integration UI/setup capture. Mention integration MCP support only as `On the roadmap`. | `/integrations` and `/marketplace` |
| 6 | **Connect assistants with MCP** | Define Model Context Protocol in plain language: an assistant can use scoped access to inspect inventory, understand state, and carry out permitted operations. Show that the owner controls authorization. | The existing MCP/OAuth guide or architecture visual. Label the DIY voice assistant as `In development` or `On the roadmap` until a public build is available. | `/guides/mcp` |
| 7 | **Keep control boundaries explicit** | Explain authentication, role-based access control, session/security boundaries, and why device control is not anonymous application state. | A factual auth/RBAC flow or account/permission UI, sourced from the current product and Architecture documentation. Avoid a generic security badge wall. | `/architecture` |
| 8 | **Deploy for the home you run** | Show the same platform operating from a lightweight small-device deployment through a resilient, highly available Kubernetes configuration. Make the Pi claim conditional on a documented, tested profile. | Compose and Helm frames with a compact deployment progression. Use measured requirements and documented HA topology, not unqualified performance claims. | `/guides/self-hosting` and `/architecture` |
| 9 | **Carry the control plane with you** | Present the modern PWA as the available responsive interface. Distinguish the upcoming mobile app and Matter support as roadmap work, including a link to the published roadmap when available. | Current PWA on a real phone viewport; a separate, clearly labeled roadmap strip for native mobile and Matter. | `/project-status` when available |

### Content Rules For Upcoming Work

- **MCP integration support**, **DIY voice assistant**, **native mobile application**,
  and **Matter support** must use future-tense copy and a visible roadmap label
  until released.
- Raspberry Pi support may be stated only with a documented hardware profile,
  supported deployment instructions, and known limits. Otherwise use
  `lightweight deployment` without naming a device class.
- Security and RBAC copy must describe implemented controls and link to the
  relevant source documentation. Do not equate a UI login screen with a complete
  security posture.

### Implementation Plan

1. Inventory the nine target flows and choose one current, reproducible environment
   for captures. Record the source route, seed data, and release/version for each.
2. Replace the homepage walkthrough data model with chapter metadata: group, route,
   title, description, screenshot/capture, availability state, and destination.
3. Build the grouped desktop index and accessible mobile sequence. Keep headings in
   document order; the index must not become the only navigation method.
4. Add the nine assets and responsive crop rules. Use real interfaces and avoid
   composited mockups for product behavior.
5. Add `On the roadmap` presentation shared by this walkthrough and the future
   project-status page, so forward-looking claims remain visually and semantically
   consistent.

### Acceptance Criteria

- All nine chapters describe an observable task or clearly marked future capability.
- Every current-state screenshot maps to a reproducible product flow and has useful
  alternative text.
- No roadmap-only item is phrased as shipped functionality.
- Desktop grouping is understandable without animation; mobile shows a linear,
  centered, no-overflow sequence.
- Playwright validates the nine chapter links, availability labels, focus order, and
  screenshots at 2560x1440 and 390x844.

## Phase 2: Intent-Based Homepage Conversion

**Priority:** P0
**Primary surface:** Homepage hero and Explore Platform section.

### Work

- Reframe the existing action hierarchy around the three journeys:
  - `Try the live demo`
  - `Self-host Homenavi`
  - `Build an integration`
- Keep one visually primary hero action based on the agreed goal. For the current
  early-stage project, default to `Try the live demo`; place the other two in the
  Explore Platform section or a compact route selector.
- Add a GitHub action only when its count can be fetched or generated reliably.
  The fallback must be simply `View on GitHub`, never a stale hard-coded star count.
- Add concise expectation text next to the demo action: what can be explored and
  what is intentionally unavailable, linked to `/demo` for detail.
- Use consistent verb-first labels across navigation, cards, and footer links.

### Acceptance Criteria

- A first-time visitor sees all three journeys without scrolling through unrelated
  sections.
- There is exactly one primary CTA in the hero at each breakpoint.
- GitHub popularity data has loading, unavailable, and cached states, or is omitted.
- E2E coverage asserts the three journey URLs and mobile overflow remains absent.

## Phase 3: Evidence-Backed Operator Trust

**Priority:** P1
**Primary surface:** New `/project-status` page with a condensed homepage entry.

### Work

Create a factual, compact project-status page rather than a decorative badge wall.
It should cover:

- Release stage and a link to the current release history.
- Installation paths and their supported environments.
- Marketplace/integration availability, sourced from the marketplace data already
  used by the website.
- Backup, recovery, and upgrade guidance, linked to the canonical documentation.
- Known limitations and active work, linked to the issue tracker or published
  roadmap.
- CI/build status only when the result is live, repository-backed, and accessible.

Prefer generated/static data from a repository-owned snapshot when APIs are
unavailable at build time. Show `Last verified` only if it has a real source
timestamp.

### Acceptance Criteria

- Every metric or status statement has a linked source or an explicit date.
- API failures retain useful fallback content and do not make the page fail to build.
- The page has a clear limitation/unknown state; it does not imply production
  readiness through styling alone.

## Phase 4: Contributor Acquisition Path

**Priority:** P1
**Primary surfaces:** `/community`, `/integrations`, and `/guides/integration-setup`.

### Work

- Add a numbered **Build your first integration** path:
  1. Start from the integration template.
  2. Run the integration locally against the mock adapter or development stack.
  3. Declare and validate the manifest/capabilities.
  4. Test a device capability and setup UI.
  5. Package and submit the marketplace release.
- Link each step to an existing canonical guide, repository, or validation command.
- Create a curated `good first integration` list only if maintained in GitHub labels
  or a reviewed static source; do not add an empty aspirational list.
- Add a contributor CTA to the homepage only after the detailed flow is usable.

### Acceptance Criteria

- A developer can reach the template, local-development instructions, manifest
  validator, and submission path in no more than two clicks from `/community`.
- All commands match the active integration-template repository.
- The route is tested for external-link correctness and mobile readability.

## Phase 5: Validation, Accessibility, And Iteration

**Priority:** P1, ongoing

### Work

- Extend existing Vitest tests for any fact/data formatter and fallback state.
- Extend Playwright E2E checks for the three journeys, status-source links, and
  contributor path.
- Add visual captures for the differentiation and status sections at 2560x1440 and
  390x844.
- Verify keyboard order, visible focus, heading hierarchy, link names, color
  contrast, reduced-motion behavior, and no-horizontal-overflow after each phase.
- Review content quarterly or on every release milestone; remove facts that cannot
  be kept current.

### Acceptance Criteria

- `npm run test:ci` passes for every change.
- New externally sourced data has deterministic test fixtures and a fallback.
- Desktop and mobile visual QA include every new homepage band.

## Recommended Sequence

1. Phase 0 baseline and source inventory.
2. Phase 1 differentiation and Phase 1A walkthrough together, because the
  walkthrough proves the technical choices made in the differentiation section.
3. Phase 2 journey hierarchy once the revised walkthrough has clear destinations.
4. Phase 4 contributor path, using the existing template and guide assets.
5. Phase 3 status page after source ownership and fallback data are established.
6. Phase 5 validation and content review continuously across all releases.

## Deliberate Non-Goals

- A generic competitor feature matrix.
- Unverified availability, device-count, or reliability claims.
- Fake social proof, stale GitHub stars, or manually maintained CI badges.
- A broad visual redesign that displaces the real product screenshots and established
  Homenavi visual language.