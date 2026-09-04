import { describe, expect, it } from "vitest";
import {
  Int256Codec,
  Uint256Codec,
  deserialize,
  deserializeCxs,
  serialize,
  serializeCxs,
} from "../../src/index.js";
import cxsVectors from "../fixtures/integer256_cxs_vectors.json";
import { fromHex } from "../helpers/hex.js";

const UINT256_MAX = (1n << 256n) - 1n;
const INT256_MIN = -(1n << 255n);
const INT256_MAX = (1n << 255n) - 1n;

describe("Uint256Codec", () => {
  it.each([
    [0n, "00".repeat(32)],
    [1n, `${"00".repeat(31)}01`],
    [1n << 255n, `80${"00".repeat(31)}`],
    [UINT256_MAX, "ff".repeat(32)],
  ])("encodes %s in XDR as 32 fixed big-endian bytes", (value, hex) => {
    const expected = fromHex(hex);
    expect(serialize(value, Uint256Codec)).toEqual(expected);
  });

  it.each([0n, 1n, 1n << 255n, UINT256_MAX])("round-trips %s", (value) => {
    expect(deserialize(serialize(value, Uint256Codec), Uint256Codec)).toBe(value);
    expect(deserializeCxs(serializeCxs(value, Uint256Codec), Uint256Codec)).toBe(value);
  });

  it.each([-1n, 1n << 256n])("rejects out-of-range value %s", (value) => {
    expect(() => serialize(value, Uint256Codec)).toThrow("uint256 overflow");
    expect(() => serializeCxs(value, Uint256Codec)).toThrow("uint256 overflow");
  });

  it("rejects non-bigint values at runtime", () => {
    expect(() => serialize(1 as unknown as bigint, Uint256Codec)).toThrow(
      "uint256 overflow",
    );
  });
});

describe("Int256Codec", () => {
  it.each([
    [INT256_MIN, `80${"00".repeat(31)}`],
    [-1n, "ff".repeat(32)],
    [0n, "00".repeat(32)],
    [1n, `${"00".repeat(31)}01`],
    [INT256_MAX, `7f${"ff".repeat(31)}`],
  ])(
    "encodes %s in XDR as 32 fixed big-endian two's-complement bytes",
    (value, hex) => {
      const expected = fromHex(hex);
      expect(serialize(value, Int256Codec)).toEqual(expected);
    },
  );

  it.each([INT256_MIN, -1n, 0n, 1n, INT256_MAX])(
    "round-trips %s",
    (value) => {
      expect(deserialize(serialize(value, Int256Codec), Int256Codec)).toBe(value);
      expect(deserializeCxs(serializeCxs(value, Int256Codec), Int256Codec)).toBe(value);
    },
  );

  it.each([INT256_MIN - 1n, INT256_MAX + 1n])(
    "rejects out-of-range value %s",
    (value) => {
      expect(() => serialize(value, Int256Codec)).toThrow("int256 overflow");
      expect(() => serializeCxs(value, Int256Codec)).toThrow("int256 overflow");
    },
  );

  it("rejects non-bigint values at runtime", () => {
    expect(() => serialize(1 as unknown as bigint, Int256Codec)).toThrow(
      "int256 overflow",
    );
  });
});

describe("Rust SDK CXS compatibility", () => {
  for (const vector of cxsVectors.vectors) {
    it(`matches ${vector.name}`, () => {
      const codec = vector.type === "u256" ? Uint256Codec : Int256Codec;
      const value = BigInt(vector.value);
      const expected = fromHex(vector.expected_hex);

      expect(serializeCxs(value, codec)).toEqual(expected);
      expect(deserializeCxs(expected, codec)).toBe(value);
    });
  }
});

it("rejects truncated 256-bit inputs", () => {
  const truncated = new Uint8Array(31);
  expect(() => deserialize(truncated, Uint256Codec)).toThrow(/read past end/);
  expect(() => deserializeCxs(truncated, Int256Codec)).toThrow(/read past end/);
});
