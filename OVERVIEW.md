# Nomad Navigator — Overview

## Product

Nomad Navigator (product surface also branded **NomadTax** in marketing copy) helps digital nomads and remote workers:

1. Log income across currencies.
2. Track days spent per country against residency thresholds.
3. Compare simplified tax-regime scenarios against a progressive US federal estimate.

The UI is a Vite SPA. Persistence and auth run on Supabase.

## Architecture

```text
Browser (Vite/React)
  ├─ pages/          Index (marketing + dashboard), Auth, NotFound
  ├─ components/     Dashboard, ResidencyTracker, TaxEstimator, …
  ├─ hooks/useAuth   Supabase session + sample-data seed on first sign-in
  └─ lib/tax         Pure estimation helpers (unit-tested)
        │
        ▼
Supabase
  ├─ Auth            email/password
  └─ Postgres        countries, income_sources, travel dates (see migrations/)
```

## Key modules

| Path | Role |
| --- | --- |
| `src/lib/tax.ts` | Pure tax + FX helpers (`calculateUSTax`, `buildTaxScenarios`, …) |
| `src/components/TaxEstimator.tsx` | UI wrapper over `lib/tax` + Supabase reads |
| `src/components/ResidencyTracker.tsx` | Country day CRUD |
| `src/integrations/supabase/` | Generated client + types |
| `supabase/migrations/` | Schema history |

## Non-goals (current)

- Filing taxes or generating legal opinions
- Real-time FX feeds (static demo rates in `CURRENCY_RATES_USD`)
- Native mobile apps

## Ops

| Item | Value |
| --- | --- |
| Live URL | https://nomad-navigator.vercel.app |
| Default branch | `main` |
| Node | 20+ recommended (CI uses 22) |
| Package manager | npm (`package-lock.json`) |

## Related fleet WR

Filed and tracked from `midnghtsapphire/revvel-standards` issue **#16882** (fleet-maintenance sweep).
