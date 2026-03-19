import { describe, it, expect } from "vitest";
import { toHex, fromHex } from "../../src/utils/hex.js";

describe("toHex", () => {
  it("empty", () => {
    expect(toHex(new Uint8Array([]))).toBe("");
  });

  it("single byte", () => {
    expect(toHex(new Uint8Array([0xff]))).toBe("ff");
  });

  it("multiple bytes", () => {
    expect(toHex(new Uint8Array([0xde, 0xad, 0xbe, 0xef]))).toBe("deadbeef");
  });

  it("leading zeros preserved", () => {
    expect(toHex(new Uint8Array([0x00, 0x01]))).toBe("0001");
  });
});

describe("fromHex", () => {
  it("empty", () => {
    expect(fromHex("")).toEqual(new Uint8Array([]));
  });

  it("lowercase", () => {
    expect(fromHex("deadbeef")).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
  });

  it("uppercase", () => {
    expect(fromHex("DEADBEEF")).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
  });

  it("mixed case", () => {
    expect(fromHex("DeAdBeEf")).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
  });

  it("throws on odd length", () => {
    expect(() => fromHex("abc")).toThrow(/odd length/);
  });

  it("throws on invalid character", () => {
    expect(() => fromHex("zz")).toThrow(/Invalid hex/);
  });
});

describe("round-trip", () => {
  it("toHex(fromHex(x)) === x", () => {
    const hex = "0123456789abcdef";
    expect(toHex(fromHex(hex))).toBe(hex);
  });

  it("fromHex(toHex(x)) === x", () => {
    const bytes = new Uint8Array([0, 1, 127, 128, 255]);
    expect(fromHex(toHex(bytes))).toEqual(bytes);
  });
});
