# Homepage Hero Redesign

## Goal

Create a distinctive enterprise-grade hero that reflects Homenavi's real product language without looking like a generic SaaS split hero. The dashboard must remain unobstructed and legible at the preferred 2560x1440 review size.

## Evidence

The authenticated Homenavi deployment uses a strong structural vocabulary:

- a narrow branded navigation rail;
- a dense operational canvas;
- slate surfaces with restrained emerald state cues;
- modular weather, quick-control, map, climate, media, and automation widgets;
- compact typography and minimal decorative chrome.

The current website hero conflicts with that vocabulary. Its bordered briefing block introduces empty space, while the live-signal and workflow-receipt overlays obscure the dashboard.

The requested GPT-5.6 Luna agent is not registered in this workspace. The available GPT-5.6 Terra reviewer supplied the concepts below; implementation remains subject to a separate Terra visual gate.

## Concepts

### 1. Command Rail (selected)

A narrow editorial rail echoes the app sidebar while the dashboard becomes the dominant operational canvas.

- Rail: brand context, headline, short product proof, and two actions.
- Product: bare dashboard image with no frame, cards, labels, or overlays.
- Desktop: dashboard bleeds from the 1280px content column toward the right viewport edge.
- Mobile: rail stacks above the complete dashboard image.
- Motion: rail lines enter in a short stagger; dashboard reveals once through a horizontal clip; a subtle state current runs only along the rail edge.

Why selected: it reuses the app's strongest structural idea, keeps the screenshot readable, and avoids both a conventional 50/50 split and a detached copy band.

### 2. Dashboard Horizon

An unbordered information band sits above a full-width dashboard image. A thin emerald route line draws once from the headline toward the product canvas.

Strength: highly legible and restrained.

Risk: still close to a common editorial product-site pattern.

### 3. Operational Ledger

A compact two-row ledger introduces the product through plain typographic metadata, followed by a dashboard that bleeds beyond the right container edge.

Strength: dense and operator-oriented.

Risk: metadata can become decorative and repeat information already visible in the product.

## Hero Copy Options

1. **Run your home on infrastructure you control.** (selected)
2. The open source smart-home platform that stays yours.
3. Realtime control for every device, room, and integration.
4. Build the home system around your rules, not a vendor's.
5. Your devices, dashboards, automations, and data on your terms.

Selected support copy:

> Realtime device state, customizable dashboards, automations, and integrations on a stack you operate.

This is grounded in the main repository README: Homenavi is open, self-hostable, integration-first, and built around a realtime MQTT/HDP plane.

## Interaction And Motion

The entrance sequence is deterministic and runs once:

1. Rail marker and headline enter in 40ms staggered steps.
2. Supporting copy and actions settle next.
3. Dashboard reveals horizontally using `clip-path`.
4. A 1px emerald state current traverses the rail edge once.
5. No dashboard widget, fake datum, floating card, or screenshot content moves.

Reduced-motion mode renders everything immediately with no transforms or clipping.

## Responsive Rules

- At wide desktop, the hero extends into the right viewport gutter while preserving the site's left content alignment.
- At standard desktop, the rail remains narrow and the dashboard occupies most of the width.
- Below 960px, the layout stacks with copy first and dashboard second.
- On mobile, actions remain above the screenshot; the complete screenshot ratio is retained and no overlay covers it.

## Acceptance Criteria

- No `.hero-brief`, `.hero-signal`, or `.hero-receipt` elements.
- No text or decorative element overlays the dashboard screenshot.
- No horizontal overflow at 390px.
- Dashboard weather, quick controls, map, climate, and media areas remain visible at 2560x1440.
- Motion is disabled by `prefers-reduced-motion`.
- Build, unit, responsive E2E, visual QA, and Terra design gate pass.
