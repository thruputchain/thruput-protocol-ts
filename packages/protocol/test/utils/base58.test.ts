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
      expect(() => fromBase58("", limit)).toThrow(
        new RangeError("Byte limit must be a nonnegative safe integer"),
      );
    }
    for (const [text, limit] of [
      ["1", 0],
      ["1".repeat(33), 32], // Leading zeros exceed the decoded limit.
      ["z".repeat(44), 32], // Nonzero bytes exceed it despite passing the text bound.
      ["z".repeat(46), 32], // Rejected by the text bound before decoding.
    ] as const) {
      expect(() => fromBase58(text, limit)).toThrow(
        new Error("Base58 value exceeds byte limit"),
      );
    }
    expect(fromBase58("", 32)).toEqual(new Uint8Array());
    expect(fromBase58("2", 32)).toEqual(Uint8Array.of(1));
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
    "secret:do-not-echo",
  ])("rejects invalid text without echoing it: %s", (text) => {
    expect(() => fromBase58(text, 32)).toThrow(
      new Error("Invalid base58 encoding"),
    );
  });

  it.each([null, undefined, 1, {}, new Uint8Array()])(
    "rejects non-string input from JavaScript callers: %s",
    (text) => {
      // @ts-expect-error Exercise the runtime boundary for JavaScript callers.
      expect(() => fromBase58(text, 32)).toThrow(new TypeError("Expected base58 text"));
    },
  );

  it("is case sensitive and does not interpret alphabet-valid text as hex", () => {
    expect(fromBase58("ff", 2)).toEqual(Uint8Array.of(8, 194));
    expect(fromBase58("ab", 2)).not.toEqual(fromBase58("AB", 2));
  });
});
