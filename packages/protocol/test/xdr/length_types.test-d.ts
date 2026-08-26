import { describe, it, expectTypeOf } from "vitest";
import type {
  FixedBytes,
  FixedArray,
  VarBytes,
  VarArray,
  VarString,
} from "@groundhogchain/xdr";
import type {
  SHA256Hash,
  AddressAuthData,
  PublicKeyConfigOpt,
} from "../../src/protocol/index.js";

// Generated types carry their XDR length in the type: fixed shapes narrow the
// real `length` to a numeric literal and reject mutation that would break it,
// while variable-length shapes annotate their bound without costing a cast.

describe("fixed-length types", () => {
  it("narrows length to the declared literal", () => {
    expectTypeOf<SHA256Hash["length"]>().toEqualTypeOf<32>();
    expectTypeOf<AddressAuthData["public_keys"]["length"]>().toEqualTypeOf<21>();
  });

  it("rejects mutation that would change the length", () => {
    const keys = [] as unknown as FixedArray<PublicKeyConfigOpt, 21>;
    // @ts-expect-error push would make the runtime length disagree with the type
    keys.push(null);
    // @ts-expect-error pop would make the runtime length disagree with the type
    keys.pop();
    // @ts-expect-error splice would make the runtime length disagree with the type
    keys.splice(0, 1);
  });

  it("still reads like an array", () => {
    const keys = [] as unknown as FixedArray<PublicKeyConfigOpt, 21>;
    expectTypeOf(keys[0]).toEqualTypeOf<PublicKeyConfigOpt>();
    expectTypeOf(keys.map((k) => k)).toEqualTypeOf<PublicKeyConfigOpt[]>();
  });

  it("a wrong-length plain array is not assignable", () => {
    expectTypeOf<readonly PublicKeyConfigOpt[]>().not.toExtend<
      FixedArray<PublicKeyConfigOpt, 21>
    >();
  });

  it("fixed bytes stay usable as a Uint8Array", () => {
    expectTypeOf<FixedBytes<32>>().toExtend<Uint8Array>();
    expectTypeOf<SHA256Hash>().toExtend<Uint8Array>();
  });
});

describe("variable-length types", () => {
  it("accept plain values with no cast", () => {
    expectTypeOf<string[]>().toExtend<VarArray<string, 256>>();
    expectTypeOf<Uint8Array>().toExtend<VarBytes<1024>>();
    expectTypeOf<string>().toExtend<VarString<64>>();
  });

  it("surface the bound as an optional phantom property", () => {
    // Absent at runtime, so reading it must admit undefined.
    expectTypeOf<VarArray<string, 256>["max_length"]>().toEqualTypeOf<
      256 | undefined
    >();
  });

  it("stay mutable, since any length up to the bound is valid", () => {
    const xs: VarArray<string, 256> = [];
    expectTypeOf(xs.push).toBeFunction();
  });
});
