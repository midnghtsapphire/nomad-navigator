# Nomad Navigator


<!-- AUTO-PACKAGE-BADGES:START -->

<!-- AUTO-PACKAGE-BADGES:END -->
**Digital nomad tax clarity** — track multi-currency income, residency days, and simplified tax scenarios so location-independent professionals can see trade-offs before they move.

> Educational estimates only. This app is **not** tax, legal, or financial advice. Always verify with a qualified professional and current local law.

## Live Deployment

- **Production:** https://nomad-navigator.vercel.app

## What it does

| Area | Capability |
| --- | --- |
| Income | Multi-currency income sources (Supabase-backed) |
| Residency | Country day counters vs legal limits (default 183-day style thresholds) |
| Tax scenarios | Simplified regime comparisons vs a progressive US federal estimate |
| Auth | Email/password via Supabase Auth |

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- Supabase (Auth + Postgres)
- Vitest for pure-logic unit tests

## Quick start

```bash
# 1. Clone
git clone https://github.com/midnghtsapphire/nomad-navigator.git
cd nomad-navigator

# 2. Install
npm install

# 3. Configure env (copy example, fill with your Supabase anon keys)
cp .env.example .env

# 4. Develop
npm run dev

# 5. Quality gates
npm test
npm run lint
npm run build
```

Dev server defaults to port **8080** (`vite.config.ts`).

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | yes | Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes | **Anon/public** key only |
| `VITE_SUPABASE_PROJECT_ID` | optional | Convenience id for tooling |

Never commit `.env`. Service-role keys must not ship in the browser bundle.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |

## Review jury (CI)

This repo wires the standard MIDNGHTSAPPHIRE review workflows:

- `ai-pr-review-openrouter.yml` — OpenRouter PR diff review
- `jules-pr-reviewer.yml` — Jules PR review (skips cleanly without `JULES_API_KEY`)
- `semgrep.yml` — Semgrep SAST + secret packs
- `codeql.yml` — CodeQL for JavaScript/TypeScript + Actions
- `ci.yml` — install, typecheck, unit tests, build
- Dependabot — weekly npm + GitHub Actions updates

Repo secrets to enable AI lanes (org-shared where possible):

- `OPENROUTER_API_KEY`
- `JULES_API_KEY` (optional)

## Monetization path (fleet research note)

| Path | Notes | Confidence |
| --- | --- | --- |
| Freemium SaaS | Free residency/income tracker; paid multi-year export, CPA handoff packs | medium |
| Affiliate | Cross-border banking, nomad insurance, e-residency prep (disclosure required) | medium |
| B2B white-label | Remote-first employers / EOR partners embedding day-count dashboards | low |

SEO / marketing keywords: `digital nomad tax`, `183 day rule tracker`, `expat tax residency`, `multi currency income tracker`, `NHR Portugal calculator`.

## Docs

- [OVERVIEW.md](./OVERVIEW.md) — product architecture and data model
- [CONTRIBUTING.md](./CONTRIBUTING.md) — branch / PR / commit conventions
- [AGENTS.md](./AGENTS.md) — instructions for coding agents

## License

See [LICENSE](./LICENSE).
