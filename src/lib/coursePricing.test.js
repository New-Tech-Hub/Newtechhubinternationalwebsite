import { describe, expect, it } from "bun:test";
import { BEGINNER_COURSE_MIN_PRICE, isCoursePriceValidForLevel } from "./coursePricing.ts";

describe("beginner course price floor", () => {
  it("accepts a beginner course priced at ₦120,000", () => {
    expect(isCoursePriceValidForLevel("beginner", BEGINNER_COURSE_MIN_PRICE)).toBe(true);
  });

  it("rejects a beginner course priced below ₦120,000", () => {
    expect(isCoursePriceValidForLevel("beginner", BEGINNER_COURSE_MIN_PRICE - 1)).toBe(false);
  });
});