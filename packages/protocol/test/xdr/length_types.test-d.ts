import { describe, it, expectTypeOf } from "vitest";
import { fixedArray, fixedBytes } from "@groundhogchain/xdr";
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

  it("is built from a dynamic array via fixedArray, with no cast", () => {
    // Array.from infers T[] (length: number), so it cannot be assigned
    // directly; fixedArray checks the length and narrows the type.
    const built = Array.from({ length: 21 }, () => null as PublicKeyConfigOpt);
    expectTypeOf(fixedArray(built, 21)).toEqualTypeOf<
      FixedArray<PublicKeyConfigOpt, 21>
    >();
    expectTypeOf(fixedArray(built, 21)).toExtend<
      AddressAuthData["public_keys"]
    >();
  });

  it("a wrong-length plain array is not assignable", () => {
    expectTypeOf<readonly PublicKeyConfigOpt[]>().not.toExtend<
      FixedArray<PublicKeyConfigOpt, 21>
    >();
  });

  it("is built from a plain Uint8Array via fixedBytes, with no cast", () => {
    // A plain Uint8Array has length: number, so it is not assignable to a
    // FixedBytes<N>; fixedBytes checks the length and narrows the type.
    expectTypeOf<Uint8Array>().not.toExtend<FixedBytes<32>>();
    expectTypeOf(fixedBytes(new Uint8Array(32), 32)).toEqualTypeOf<
      FixedBytes<32>
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

  it("do not relate different bounds", () => {
    // The phantom property makes distinct bounds mutually unassignable. This
    // is a side effect of annotating the bound, not a designed subtyping
    // relationship — the plain unbranded value is the interop path.
    expectTypeOf<VarArray<string, 5>>().not.toExtend<VarArray<string, 10>>();
    expectTypeOf<VarArray<string, 10>>().not.toExtend<VarArray<string, 5>>();
    expectTypeOf<string[]>().toExtend<VarArray<string, 5>>();
    expectTypeOf<string[]>().toExtend<VarArray<string, 10>>();
  });

  it("stay mutable, since any length up to the bound is valid", () => {
    const xs: VarArray<string, 256> = [];
    expectTypeOf(xs.push).toBeFunction();
  });
});
