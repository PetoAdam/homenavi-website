# Homenavi Website

The official marketing/product website for [Homenavi](https://github.com/PetoAdam/homenavi), built from the spec in [`website-product-plan.md`](./website-product-plan.md).

It is a fully static Next.js site (App Router, `output: "export"`) that reuses Homenavi's frontend visual language: the glassmorphism surfaces, the exact design tokens from the app's `colors.css`, pill badges, and screenshot frames.

## Quick start

### Option 1 — Docker (recommended)

Requires Docker 27+ and Docker Compose v2+.

```bash
git clone https://github.com/PetoAdam/homenavi-website
cd homenavi-website
docker compose up -d --build
```

The site is then served by nginx at **http://localhost:4000**.

```bash
docker compose logs -f      # watch the server logs
docker compose down         # stop the site
```

### Option 2 — Node locally

Requires Node.js 20+.

```bash
git clone https://github.com/PetoAdam/homenavi-website
cd homenavi-website
npm install
npm run dev          # http://localhost:3000
```

To produce the static export and serve it like the container does:

```bash
npm run build        # writes the static site to out/
npm run start        # Next.js static server
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, value props, proof sections, demo status, self-hosting snippets, marketplace spotlight |
| `/features` | Feature walkthrough with real product screenshots |
| `/integrations` | Integration runtime overview + build-your-own CTA |
| `/demo` | Live demo entry point with graceful fallback when the demo is unreachable |
| `/marketplace` | Live marketplace listing (search + filters), fetched from `marketplace.homenavi.org` with a local cache fallback |
| `/marketplace/[id]` | Integration detail pages (statically generated per integration) |
| `/guides` + `/guides/[slug]` | Quickstart, self-hosting, integration setup, automations, MCP, and troubleshooting (markdown in `content/guides/`) |
| `/architecture` | Advanced view of the platform planes, scoped MCP connection, and deployment options |
| `/community` | Discord, GitHub, contribution paths |
| `/changelog` | Release feed derived from marketplace data |
| `/about` | Platform architecture summary |

## Design system

`app/globals.css` is built on the Homenavi brand palette (`frontend/src/colors.css`), refined for an enterprise editorial layout:

- `--color-bg: #242e3a`, `--color-bg-deep: #1b232d`, `--color-bg-panel: #202832`
- `--color-primary: #39aa79`, `--color-primary-soft: #57c394`, `--color-primary-deep: #1d5f43`
- ink layer: `--color-ink: #e9eef4`, `--color-ink-muted: #9fb0c0`, `--color-ink-soft: #7d8c99`
- hairlines and glass surfaces (`--hairline`, `--glass`) instead of heavy card borders
- layout vars: `--container-width: 1280px`, `--radius-card: 0.75rem`, `--section-gap: 4rem`
- background: layered radial glows, a masked 64px engineering grid, and a fine SVG noise texture
- scroll rail: a fixed track in the left gutter at ≥1400px viewport width showing scroll progress, section ticks, an animated dot, and a compact scroll-percentage readout
- header brand mirrors the app sidebar title (`Sidebar.css`): Manrope 900, uppercase, 0.18em tracking, `--color-brand-ink: #e5e4e3` with a soft glow
- home hero uses the product dashboard as an animated control workspace; subpages use a one-line `.hero-meta` strip
- integration versions are normalised through `formatVersion` in `lib/integrations.ts` so `vv1.0.0` never renders

Responsive breakpoints at 960px, 760px, 640px and 480px collapse grids and switch the nav to a hamburger menu.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # static export into out/
npm test           # vitest unit tests (marketplace normalization, guides, demo)
npm run test:e2e   # Playwright responsive checks (1280x800 + 390x844), screenshots in qa-screenshots/
npm run test:qa    # Playwright visual/UX QA (tokens, contrast, broken images, detail pages)
npm run test:ci    # typecheck, unit, build, responsive E2E, and visual QA
node scripts/hero-shots.js     # 2K and mobile screenshots for design review (requires `npm run build` first)
```

## Delivery

Every pull request and push to `main` runs type checking, unit tests, Playwright responsive and visual QA, the production build, and a Docker image build. Pushing a semantic version tag such as `v1.0.0` publishes the image to `ghcr.io/petoadam/homenavi-website` with immutable version tags and `latest`.

The Argo CD deployment consumes the immutable full version tag from the
`homelab-gitops` repository. Release a new deployment by updating that image tag in
the GitOps manifest after the GitHub Actions publication has completed.

## Data

- `data/marketplace-cache.json` — fallback snapshot of the marketplace API.
- `public/screenshots/` — product screenshots vendored from the main repo docs, so the site never depends on GitHub raw at runtime.

## Testing

- **Unit:** `tests/unit.test.ts` — 14 tests for marketplace payload normalization, capability derivation, safe guide rendering, and demo URL.
- **Responsive E2E:** `tests/e2e-responsive.js` — responsive navigation, homepage discovery, integration roster, marketplace search/filter, and no-overflow checks at desktop and mobile viewports.
- **Visual QA:** `tests/qa-visual.js` — design-token, contrast, image, metadata, browser favicon, iOS touch icon, Android manifest, guide, marketplace, footer, and navigation checks.
