import { describe, it, expect } from "vitest";
import { fixedArray } from "../../src/index.js";

describe("fixedArray", () => {
  it("returns the value when the length matches", () => {
    const xs = [1, 2, 3];
    expect(fixedArray(xs, 3)).toBe(xs);
  });

  it("accepts an empty array with length 0", () => {
    expect(fixedArray([], 0)).toEqual([]);
  });

  it("throws when the array is too short", () => {
    expect(() => fixedArray([1, 2], 3)).toThrow(
      "FixedArray expected 3 elements, got 2",
    );
  });

  it("throws when the array is too long", () => {
    expect(() => fixedArray([1, 2, 3, 4], 3)).toThrow(
      "FixedArray expected 3 elements, got 4",
    );
  });
});
