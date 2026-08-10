import { describe, expect, it } from "vitest";
import {
  convertOddsInput,
  edge,
  fairOdds,
  fromDecimal,
  impliedProb,
  NEAR_THRESHOLD,
  overround,
  parseOdds,
  toDecimal,
  verdict,
} from "./odds";

describe("format conversion", () => {
  it("hk odds are decimal minus one", () => {
    expect(toDecimal(1.5, "hk")).toBeCloseTo(2.5);
    expect(fromDecimal(2.5, "hk")).toBeCloseTo(1.5);
  });
  it("decimal passes through", () => {
    expect(toDecimal(2.5, "dec")).toBeCloseTo(2.5);
    expect(fromDecimal(2.5, "dec")).toBeCloseTo(2.5);
  });
});

describe("parseOdds", () => {
  it("parses valid decimal input", () => {
    expect(parseOdds("2.50", "dec")).toBeCloseTo(2.5);
  });
  it("parses hk input to decimal", () => {
    expect(parseOdds("1.50", "hk")).toBeCloseTo(2.5);
  });
  it("rejects non-numeric, empty, and out-of-range input", () => {
    expect(parseOdds("abc", "dec")).toBeNull();
    expect(parseOdds("", "dec")).toBeNull();
    expect(parseOdds("1.01", "dec")).toBeNull();
    expect(parseOdds("0.9", "dec")).toBeNull();
    expect(parseOdds("-2", "hk")).toBeNull();
  });
  it("accepts a value just above the floor", () => {
    expect(parseOdds("1.02", "dec")).toBeCloseTo(1.02);
  });
  it("rejects hex and exponent notation", () => {
    expect(parseOdds("0x10", "dec")).toBeNull();
    expect(parseOdds("1e3", "dec")).toBeNull();
  });
});

describe("probabilities", () => {
  it("implied probability is the reciprocal", () => {
    expect(impliedProb(1.3)).toBeCloseTo(0.7692, 3);
  });
  it("fair odds is the reciprocal of the probability", () => {
    expect(fairOdds(0.81)).toBeCloseTo(1.2346, 3);
  });
});

describe("edge and verdict", () => {
  // model 81%, price 1.30 implies 76.9% → price pays above fair
  it("positive edge → above", () => {
    expect(edge(0.81, 1.3)).toBeCloseTo(0.0408, 3);
    expect(verdict(0.81, 1.3)).toBe("above");
  });
  it("negative edge → below", () => {
    expect(verdict(0.81, 1.15)).toBe("below");
  });
  it("within the near band → near (edges of 0 and +1 point)", () => {
    expect(verdict(0.8, 1.25)).toBe("near"); // implied 80% exactly
    expect(verdict(0.81, 1.25)).toBe("near"); // edge +1 point
  });
  it("pins the near threshold to 0.02", () => {
    expect(NEAR_THRESHOLD).toBe(0.02);
  });
  it("edge beyond the pinned threshold → above/below", () => {
    expect(verdict(0.83, 1.25)).toBe("above"); // edge +0.03
    expect(verdict(0.77, 1.25)).toBe("below"); // edge -0.03
  });
  it("exact boundary is exclusive → near", () => {
    expect(verdict(0.5, 4, 0.25)).toBe("near"); // edge exactly 0.25
  });
});

describe("convertOddsInput", () => {
  it("preserves precision below the 2dp display rounding", () => {
    expect(convertOddsInput("1.011", "dec", "hk")).toBe("0.011");
    expect(convertOddsInput("0.011", "hk", "dec")).toBe("1.011");
  });
  it("round-trips without drift", () => {
    expect(convertOddsInput("2.505", "dec", "hk")).toBe("1.505");
    expect(convertOddsInput("1.505", "hk", "dec")).toBe("2.505");
  });
  it("strips float noise and trailing zeros", () => {
    expect(convertOddsInput("1.30", "dec", "hk")).toBe("0.3");
    expect(convertOddsInput("0.3", "hk", "dec")).toBe("1.3");
  });
  it("returns invalid input unchanged", () => {
    expect(convertOddsInput("abc", "dec", "hk")).toBe("abc");
  });
  it("strips trailing zeros from a whole number result", () => {
    expect(convertOddsInput("2.50", "dec", "hk")).toBe("1.5");
  });
});

describe("overround", () => {
  it("book margin from a full 1X2 set", () => {
    // 1.30 / 7.00 / 12.00 → 0.7692+0.1429+0.0833 ≈ 0.99542 → -0.46% (no margin)
    expect(overround([1.3, 7, 12])).toBeCloseTo(-0.0046, 3);
    // typical book: 1.25 / 6.50 / 11.00 → 1.0447 → 4.5% margin
    expect(overround([1.25, 6.5, 11])).toBeCloseTo(0.0447, 3);
  });
});
