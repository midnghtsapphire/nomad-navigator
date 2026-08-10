import { describe, expect, it } from "vitest";
import {
  buildTaxScenarios,
  calculateUSTax,
  convertIncomeToUsd,
  daysUntilResidencyThreshold,
  formatUsd,
} from "./tax";

describe("calculateUSTax", () => {
  it("returns 0 for non-positive income", () => {
    expect(calculateUSTax(0)).toBe(0);
    expect(calculateUSTax(-100)).toBe(0);
    expect(calculateUSTax(Number.NaN)).toBe(0);
  });

  it("applies the 10% bracket", () => {
    expect(calculateUSTax(10000)).toBe(1000);
  });

  it("applies progressive brackets above 11k", () => {
    // 1100 + (20000-11000)*0.12 = 1100 + 1080 = 2180
    expect(calculateUSTax(20000)).toBe(2180);
  });
});

describe("convertIncomeToUsd", () => {
  it("sums multi-currency sources", () => {
    const total = convertIncomeToUsd([
      { amount: 1000, currency: "USD" },
      { amount: 1000, currency: "EUR" },
      { amount: "500", currency: "GBP" },
    ]);
    expect(total).toBeCloseTo(1000 + 1080 + 635, 5);
  });

  it("ignores non-numeric amounts", () => {
    expect(convertIncomeToUsd([{ amount: "nope", currency: "USD" }])).toBe(0);
  });
});

describe("buildTaxScenarios", () => {
  it("returns empty when income is zero", () => {
    expect(buildTaxScenarios(0)).toEqual([]);
  });

  it("returns top scenarios with a recommended highlight", () => {
    const scenarios = buildTaxScenarios(100_000, 3);
    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].highlight).toBe(true);
    expect(scenarios.slice(1).every((s) => !s.highlight)).toBe(true);
    // Highest savings should be the zero-rate AE regime for pure earned income demo
    expect(scenarios[0].code).toBe("AE");
    expect(scenarios[0].savingsVsUs).toBeGreaterThan(scenarios[1].savingsVsUs);
  });
});

describe("daysUntilResidencyThreshold", () => {
  it("clamps at zero when over the limit", () => {
    expect(daysUntilResidencyThreshold(200, 183)).toBe(0);
  });

  it("returns remaining days under the limit", () => {
    expect(daysUntilResidencyThreshold(100, 183)).toBe(83);
  });
});

describe("formatUsd", () => {
  it("formats without cents by default", () => {
    expect(formatUsd(12345)).toBe("$12,345");
  });
});
