import { describe, it, expectTypeOf } from "vitest";
import type {
  SHA256Hash,
  NetworkHash,
  TxsHash,
  SignedTransaction,
  OptSignedTransaction,
} from "../../src/protocol/index.js";
import type * as fixtures from "../fixtures/index.js";

// Branded typedef-of-typedef types (typedef SHA256Hash NetworkHash) must not
// collapse to never, and typedef pointers (typedef T *Opt) must admit null.

describe("branded typedef hierarchy", () => {
  it("typedef-of-typedef types are inhabited", () => {
    expectTypeOf<NetworkHash>().not.toBeNever();
    expectTypeOf<TxsHash>().not.toBeNever();
  });

  it("a derived hash is assignable to its base type", () => {
    expectTypeOf<NetworkHash>().toExtend<SHA256Hash>();
    expectTypeOf<TxsHash>().toExtend<SHA256Hash>();
  });

  it("sibling typedefs of the same base are not interchangeable", () => {
    expectTypeOf<NetworkHash>().not.toExtend<TxsHash>();
    expectTypeOf<TxsHash>().not.toExtend<NetworkHash>();
  });

  it("the base type is not assignable to a derived typedef", () => {
    expectTypeOf<SHA256Hash>().not.toExtend<NetworkHash>();
  });

  it("optional typedefs admit null and the wrapped value", () => {
    expectTypeOf<null>().toExtend<OptSignedTransaction>();
    expectTypeOf<OptSignedTransaction>().toExtend<SignedTransaction | null>();
  });
});

describe("scalar typedefs of nullable bases (fixtures)", () => {
  it("an alias of a pointer typedef keeps the null arm", () => {
    expectTypeOf<null>().toExtend<fixtures.TestOptPointAlias>();
    expectTypeOf<fixtures.TestOptPointAlias>().toExtend<fixtures.TestOptPoint>();
  });

  it("the alias's non-null arm is not the bare base", () => {
    expectTypeOf<fixtures.TestOptPoint>().not.toExtend<fixtures.TestOptPointAlias>();
  });
});
