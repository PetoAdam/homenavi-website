# Homenavi Website

The official marketing/product website for [Homenavi](https://github.com/PetoAdam/homenavi), built from the spec in [`website-product-plan.md`](./website-product-plan.md).

It is a fully static Next.js site (App Router, `output: "export"`) that reuses Homenavi's frontend visual language: the glassmorphism surfaces, the exact design tokens from the app's `colors.css`, pill badges, and screenshot frames.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, value props, proof sections, demo status, self-hosting snippets, marketplace spotlight |
| `/features` | Feature walkthrough with real product screenshots |
| `/integrations` | Integration runtime overview + build-your-own CTA |
| `/demo` | Live demo entry point with graceful fallback when the demo is unreachable |
| `/marketplace` | Live marketplace listing (search + filters), fetched from `marketplace.homenavi.org` with a local cache fallback |
| `/marketplace/[id]` | Integration detail pages (statically generated per integration) |
| `/guides` + `/guides/[slug]` | Quickstart, self-hosting, integration setup, automations, troubleshooting (markdown in `content/guides/`) |
| `/community` | Discord, GitHub, contribution paths |
| `/changelog` | Release feed derived from marketplace data |
| `/about` | Platform architecture summary |

## Design system

`app/globals.css` ports the tokens verbatim from the Homenavi frontend (`frontend/src/colors.css`):

- `--color-bg: #242e3a`, `--color-bg-secondary: #32404d`
- `--color-primary: #39aa79`, `--color-primary-light: #b6f7c1`, `--color-primary-dark: #17a74a`
- glass surfaces (`--color-surface-card`, `--color-surface-panel`, `--color-modal-surface`)
- editorial layout vars (`--container-width: 1120px`, `--radius-card: 1.5rem`)

Responsive breakpoints at 960px, 760px, 640px and 480px collapse grids and switch the nav to a hamburger menu.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # static export into out/
npm test           # vitest unit tests (marketplace normalization, guides, demo)
npm run test:e2e   # Playwright responsive checks (1280x800 + 390x844), screenshots in qa-screenshots/
npm run test:qa    # Playwright visual/UX QA (tokens, contrast, broken images, detail pages)
```

## Data

- `data/marketplace-cache.json` — fallback snapshot of the marketplace API.
- `public/screenshots/` — product screenshots vendored from the main repo docs, so the site never depends on GitHub raw at runtime.

## Testing

- **Unit:** `tests/unit.test.ts` — 13 tests for marketplace payload normalization, capability derivation, guide loading, demo URL.
- **Responsive E2E:** `tests/e2e-responsive.js` — 36 checks: nav visibility/hamburger behavior, grid stacking, search/filter interactions, no horizontal overflow on mobile; captures desktop and mobile screenshots for every page.
- **Visual QA:** `tests/qa-visual.js` — 39 checks: design tokens match the app, hero contrast ≥ WCAG AA, zero broken images on all pages, guide markdown rendering, marketplace detail pages, footer/nav structure.
