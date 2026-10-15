import { describe, expect, it } from "vitest";
import {
  toBase58,
  fromBase58,
  maxBase58Length,
} from "../../src/utils/base58.js";

describe("base58", () => {
  it.each([
    [new Uint8Array(), ""],
    [Uint8Array.of(0, 0, 1, 255), "119p"],
    [new TextEncoder().encode("Hello World"), "JxF12TrwUP45BMd"],
    [new Uint8Array(32), "11111111111111111111111111111111"],
    [
      new Uint8Array(32).fill(255),
      "JEKNVnkbo3jma5nREBBJCDoXFVeKkD56V3xKrvRmWxFG",
    ],
    [
      Uint8Array.from({ length: 64 }, (_, i) => i),
      "1GMkH3brNXiNNs1tiFZHu4yZSRrzJwxi5wB9bHFtMinfCXNnR1adh8Vo8NTheK4evneedH4qmvjeqcBBNAefgS",
    ],
  ] as const)("preserves known bytes %s", (bytes, text) => {
    expect(toBase58(bytes)).toBe(text);
    expect(fromBase58(text, bytes.length)).toEqual(bytes);
  });

  it("enforces encoded and decoded size limits", () => {
    expect(maxBase58Length(0)).toBe(0);
    expect(maxBase58Length(32)).toBe(45);
    expect(maxBase58Length(Number.MAX_SAFE_INTEGER)).toBe(
      Number.MAX_SAFE_INTEGER,
    );
    for (const limit of [-1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => fromBase58("", limit)).toThrow();
    }
    expect(() => fromBase58("1", 0)).toThrow();
    expect(() => fromBase58("1".repeat(33), 32)).toThrow();
    expect(() => fromBase58("z".repeat(46), 32)).toThrow();
  });

  it.each([
    "0",
    "O",
    "I",
    "l",
    " 1",
    "1 ",
    "1\n",
    "1\t",
    "=",
    "é",
    "１",
    "0x01",
  ])("rejects invalid text without echoing it: %s", (text) => {
    expect(() => fromBase58(text, 32)).toThrow("Invalid base58 encoding");
  });

  it("is case sensitive and does not interpret alphabet-valid text as hex", () => {
    expect(fromBase58("ff", 2)).toEqual(Uint8Array.of(8, 194));
    expect(fromBase58("ab", 2)).not.toEqual(fromBase58("AB", 2));
  });
});
