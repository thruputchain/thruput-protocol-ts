import { describe, it, expect } from "vitest";
import { fixedArray } from "../../src/index.js";

describe("fixedArray", () => {
  it("returns the elements when the length matches", () => {
    const xs = [1, 2, 3];
    expect(fixedArray(xs, 3)).toEqual([1, 2, 3]);
  });

  it("returns a copy, so a retained source alias cannot change the length", () => {
    const xs = [1, 2, 3];
    const fixed = fixedArray(xs, 3);
    expect(fixed).not.toBe(xs);
    xs.push(4);
    expect(fixed).toHaveLength(3);
  });

  it("freezes the result, so a cast or plain JS cannot mutate it", () => {
    const fixed = fixedArray([1, 2, 3], 3);
    expect(Object.isFrozen(fixed)).toBe(true);
    expect(() => (fixed as unknown as number[]).push(4)).toThrow(TypeError);
    expect(fixed).toHaveLength(3);
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
