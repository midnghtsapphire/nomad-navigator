/**
 * Pure tax estimation helpers for Nomad Navigator.
 * Rates are simplified educational estimates — not tax advice.
 * Source confidence: low (illustrative brackets; verify against current law).
 */

export type TaxRegime = {
  regime: string;
  rate: number;
  flag: string;
};

export type TaxScenario = {
  code: string;
  country: string;
  flag: string;
  regime: string;
  estimatedTax: number;
  effectiveRate: number;
  savingsVsUs: number;
  highlight: boolean;
};

export const TAX_REGIMES: Record<string, TaxRegime> = {
  PT: { regime: "NHR Regime", rate: 0.2, flag: "🇵🇹" },
  ES: { regime: "Beckham Law", rate: 0.24, flag: "🇪🇸" },
  AE: { regime: "Tax Free", rate: 0, flag: "🇦🇪" },
  SG: { regime: "Territorial Tax", rate: 0.22, flag: "🇸🇬" },
  MT: { regime: "Global Residence", rate: 0.15, flag: "🇲🇹" },
  CY: { regime: "Non-Dom Regime", rate: 0.125, flag: "🇨🇾" },
};

export const COUNTRY_NAMES: Record<string, string> = {
  PT: "Portugal",
  ES: "Spain",
  AE: "United Arab Emirates",
  SG: "Singapore",
  MT: "Malta",
  CY: "Cyprus",
};

/** Rough FX multipliers into USD for demo totals. */
export const CURRENCY_RATES_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
};

/**
 * Simplified single-filer US federal income tax (illustrative 2024-style brackets).
 * Not legal advice; ignores deductions, credits, NIIT, state tax, etc.
 */
export function calculateUSTax(income: number): number {
  if (!Number.isFinite(income) || income <= 0) return 0;
  if (income <= 11000) return income * 0.1;
  if (income <= 44725) return 1100 + (income - 11000) * 0.12;
  if (income <= 95375) return 5147 + (income - 44725) * 0.22;
  if (income <= 183000) return 16290 + (income - 95375) * 0.24;
  if (income <= 231250) return 37104 + (income - 183000) * 0.32;
  return 52832 + (income - 231250) * 0.35;
}

export function convertIncomeToUsd(
  sources: Array<{ amount: number | string; currency: string }>,
  rates: Record<string, number> = CURRENCY_RATES_USD,
): number {
  return sources.reduce((sum, src) => {
    const rate = rates[src.currency] ?? 1;
    const amount = Number(src.amount);
    if (!Number.isFinite(amount)) return sum;
    return sum + amount * rate;
  }, 0);
}

/**
 * Build top tax-optimization scenarios vs simplified US tax.
 * @param limit max scenarios to return (default 3)
 */
export function buildTaxScenarios(income: number, limit = 3): TaxScenario[] {
  if (!Number.isFinite(income) || income <= 0) return [];

  const usTax = calculateUSTax(income);

  return Object.entries(TAX_REGIMES)
    .map(([code, config]) => {
      const estimatedTax = income * config.rate;
      return {
        code,
        country: COUNTRY_NAMES[code] || code,
        flag: config.flag,
        regime: config.regime,
        estimatedTax,
        effectiveRate: config.rate * 100,
        savingsVsUs: usTax - estimatedTax,
        highlight: false,
      };
    })
    .sort((a, b) => b.savingsVsUs - a.savingsVsUs)
    .slice(0, Math.max(0, limit))
    .map((s, idx) => ({ ...s, highlight: idx === 0 }));
}

/** Days remaining before a common 183-day tax-residency threshold. */
export function daysUntilResidencyThreshold(daysSpent: number, limit = 183): number {
  const spent = Number.isFinite(daysSpent) ? daysSpent : 0;
  const cap = Number.isFinite(limit) && limit > 0 ? limit : 183;
  return Math.max(0, cap - spent);
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
