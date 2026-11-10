import { describe, expect, it } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
} from "@thruputchain/xdr";
import { codec } from "../../src/index.js";
import { codec as fixture, type TestMatrix } from "../fixtures/index.js";

describe.each([
  ["XDR", serialize, deserialize],
  ["CXS", serializeCxs, deserializeCxs],
] as const)("%s generated array budgets", (_name, encode, decode) => {
  it("charges primitive vector elements", () => {
    const value = { nonces: Array<bigint>(100).fill(0n) };
    const bytes = encode(value, codec.ReplayCacheData);
    expect(() => decode(bytes, codec.ReplayCacheData, { maxWork: 1 })).toThrow("work budget");
    expect(() => decode(bytes, codec.ReplayCacheData, { maxWork: 101 })).toThrow("work budget");
    expect(decode(bytes, codec.ReplayCacheData, { maxWork: 102 })).toEqual(value);
  });

  it("charges primitive fixed-array elements", () => {
    const value: TestMatrix = { row: [1n, 2n, 3n] };
    const bytes = encode(value, fixture.TestMatrix);
    expect(() => decode(bytes, fixture.TestMatrix, { maxWork: 4 })).toThrow("work budget");
    expect(decode(bytes, fixture.TestMatrix, { maxWork: 5 })).toEqual(value);
  });
});
