import { describe, it, expect } from "vitest";
import { fixedArray, fixedBytes } from "../../src/index.js";

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

describe("fixedBytes", () => {
  it("returns the bytes when the length matches", () => {
    expect(fixedBytes(new Uint8Array([1, 2, 3]), 3)).toEqual(
      new Uint8Array([1, 2, 3]),
    );
  });

  it("accepts an empty array with length 0", () => {
    expect(fixedBytes(new Uint8Array(0), 0)).toEqual(new Uint8Array(0));
  });

  it("returns a copy, so later writes to the source do not reach it", () => {
    const src = new Uint8Array([1, 2, 3]);
    const fixed = fixedBytes(src, 3);
    expect(fixed).not.toBe(src);
    src.fill(0);
    expect(fixed).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("mutating the result leaves the source intact", () => {
    const src = new Uint8Array([1, 2, 3]);
    fixedBytes(src, 3).fill(0);
    expect(src).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("copies a Node Buffer, whose slice() would alias", () => {
    const src = Buffer.alloc(3, 1);
    const fixed = fixedBytes(src, 3);
    fixed.fill(9);
    expect(src).toEqual(Buffer.alloc(3, 1));
  });

  it("copies only the view's range, not the whole buffer", () => {
    const buf = new Uint8Array([1, 2, 3, 4, 5]);
    const fixed = fixedBytes(buf.subarray(1, 4), 3);
    expect(fixed).toEqual(new Uint8Array([2, 3, 4]));
    expect(fixed).toHaveLength(3);
  });

  it("throws when the byte length does not match", () => {
    expect(() => fixedBytes(new Uint8Array([1, 2]), 3)).toThrow(
      "FixedBytes expected 3 bytes, got 2",
    );
    expect(() => fixedBytes(new Uint8Array([1, 2, 3, 4]), 3)).toThrow(
      "FixedBytes expected 3 bytes, got 4",
    );
  });
});
