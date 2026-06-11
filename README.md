# Movantis — Marketing Website

Financial infrastructure built for the Americas. **One integration. Full ecosystem access.**

A self-contained, production-clean marketing site: dark "infrastructure" aesthetic, orange-led
brand system, an interactive 3D globe of US ↔ LATAM money-movement corridors, and the full
Movantis narrative (products, solutions, use cases, coverage, why, developers, how-it-works).

No build step. No Node required. Just static files.

## Run

Any static server works. With Python (already on macOS):

```bash
# MovantisSite is a sibling of the PCC folder — use the full path:
cd "/Users/david_lopes/Documents/Code Apps/MovantisSite"
python3 -m http.server 5173
# open http://localhost:5173
```

Or open `index.html` directly (the globe needs a server/CDN access for the country GeoJSON;
without it, the globe still renders — just without the dotted country outlines).

## Structure

```
MovantisSite/
├── index.html              # All content & page structure (semantic, SEO + OG tags)
├── README.md
└── assets/
    ├── css/styles.css      # Design tokens + every component style
    └── js/
        ├── globe.js        # three.js / globe.gl interactive globe + corridor arcs
        └── main.js         # scroll reveals, count-ups, tabs, verticals, use cases,
                            #   coverage, how-it-works flow, problem diagrams, magnetics
```

## Tech

- **Tailwind**: not required at runtime — styling is hand-authored design tokens in `styles.css`
  (CSS variables) for a zero-CDN-dependency look. (Swap in Tailwind if you migrate to a framework.)
- **three.js / globe.gl** (`globe.gl@2.34.4`, loaded from unpkg) — the hero globe.
- **Fonts**: Inter (body + display) via Google Fonts — matches the official Movantis brand.
- Vanilla JS only. Honors `prefers-reduced-motion` throughout; globe degrades to an SVG
  arc fallback on reduced-motion or when WebGL is unavailable.

## What to swap before launch

| Placeholder | Where | Notes |
|---|---|---|
| Official brand assets | `assets/brand/` (`movantis-logo.svg`, `movantis-footer-logo.svg`, `favicon.png`, `cert-badge.webp`) | Pulled from the official movantis.com CDN; used in nav, footer and favicon. |
| Contact form backend | `index.html` `#contactForm` + handler in `assets/js/main.js` | Demo only — shows a client-side "thank you". Wire to your CRM / Formspree / Webflow endpoint before launch. |
| Coverage flags | `assets/js/main.js` → `FLAGS` | Simplified inline SVG flags; swap for official flag assets if preferred. |
| Partner / network logos | `index.html` → Trust strip (`.trust-rail`) | Currently neutral text tags. |
| Privacy/legal links | footer `Legal` column | Point at official `movantis.com/glba-privacy-notice` and `/global-privacy-notice`. |
| Live metrics | `index.html` → `.metrics` (`data-count` attrs) | Official figures: 130+ countries · 80,000+ payout locations · 70+ MTOs · $60B+ annual volume. |
| Coverage rails per country | `assets/js/main.js` → `COVERAGE` | Update tags / add markets. |
| Corridor cities on the globe | `assets/js/globe.js` → `HUB` / `DEST` | lat/lng + `rail: "orange" | "cyan"`. |
| API code sample | `index.html` → `#developers` `.code` | Mock `POST /v1/transfers`. |
| CTA links (`Start Building`, etc.) | `index.html` | Point at real signup / contact / docs. |
| Company links (About, Leadership, News) | footer + Company column | Link out. |
| Legal pages | footer `.legal` | Privacy · Compliance · Terms. |
| OG image | `<head>` — add `og:image` | None set yet. |

## Brand tokens

Defined in `assets/css/styles.css` `:root`:

- Orange: `--orange-500 #FF7F39` (official primary), `--orange-400 #FF9A5E`, `--orange-600 #E8631C`
- Ink base: `--ink-950 #0A0A0F` → `--ink-700`
- Cool accent (digital / stablecoin rail): `--cyan-400 #2DD4BF`
- Orange = brand / traditional flow · Cyan = stablecoin / digital rail (used sparingly).

## Accessibility & performance

- Semantic landmarks, keyboard-navigable nav + mobile drawer, visible focus via browser defaults,
  AA-minded contrast on orange-on-dark.
- Globe is lazy-ish (deferred scripts) and degrades gracefully; reveals/count-ups disabled under
  reduced-motion. Heavy 3D is isolated to `globe.js` so the rest of the page is unaffected if it fails.
