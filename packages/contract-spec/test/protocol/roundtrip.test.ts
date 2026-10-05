/**
 * Serialize/deserialize roundtrip tests over the contract-spec AST codecs,
 * including nested/recursive ContractType shapes and a full ContractSpec.
 */
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
  codec, contractSpecString, topic,
  ContractTypeKind, ContractUnionCaseKind, ContractTypeDefKind, ContractMethodEffect,
} from "../../src/index.js";
import type {
  ContractType, ContractTypeDef, ContractSpec, ContractSpecId,
} from "../../src/index.js";

/** A declared type identity in the `example` crate's root module. */
function specId(declared: string): ContractSpecId {
  return {
    crate_name: contractSpecString("example"),
    major: contractSpecString("1"),
    module_path: contractSpecString(""),
    declared: contractSpecString(declared),
  };
}

/** Vector<Tuple<Option<U32>, Array<U8; 4>>> — recursive through three levels. */
function makeNestedType(): ContractType {
  return {
    v: ContractTypeKind.Vector,
    vector: {
      element: {
        v: ContractTypeKind.Tuple,
        tuple: [
          { v: ContractTypeKind.Option, option_inner: { v: ContractTypeKind.U32 } },
          {
            v: ContractTypeKind.Array,
            array: { element: { v: ContractTypeKind.U8 }, len: 4n },
          },
        ],
      },
      max_len: 16n,
    },
  };
}

describe("contract-spec AST codecs: roundtrip", () => {
  it("preserves all declared effects and unknown in method codecs", () => {
    for (const effect of [
      ContractMethodEffect.EffectUnknown,
      ContractMethodEffect.EffectPure,
      ContractMethodEffect.EffectReadOnly,
      ContractMethodEffect.EffectStateChanging,
    ]) {
      const method = {
        name: contractSpecString("get"),
        args: [],
        return_type: { v: ContractTypeKind.U32 } as ContractType,
        effect,
      };
      const bytes = serialize(method, codec.ContractSpecMethod);
      expect(deserialize(bytes, codec.ContractSpecMethod)).toEqual(method);
      expect(Array.from(bytes.slice(-4))).toEqual([0, 0, 0, effect]);
    }
  });
  it("round-trips flat ContractType variants", () => {
    const variants: ContractType[] = [
      { v: ContractTypeKind.Void },
      { v: ContractTypeKind.Bool },
      { v: ContractTypeKind.I128 },
      { v: ContractTypeKind.String },
      { v: ContractTypeKind.Address },
      { v: ContractTypeKind.Named, named: specId("MyStruct") },
    ];
    for (const val of variants) {
      expect(deserialize(serialize(val, codec.ContractType), codec.ContractType)).toEqual(val);
    }
  });

  it("round-trips a nested/recursive ContractType", () => {
    const val = makeNestedType();
    expect(deserialize(serialize(val, codec.ContractType), codec.ContractType)).toEqual(val);
  });

  it("round-trips a nested ContractType through CXS", () => {
    const val = makeNestedType();
    expect(deserializeCxs(serializeCxs(val, codec.ContractType), codec.ContractType)).toEqual(val);
  });

  it("round-trips ContractSignedTokenPreimage with and without inner type", () => {
    for (const preimage_type of [null, makeNestedType()]) {
      const val = { preimage_type };
      expect(
        deserialize(
          serialize(val, codec.ContractSignedTokenPreimage),
          codec.ContractSignedTokenPreimage,
        )
      ).toEqual(val);
    }
  });

  it("round-trips every ContractUnionCaseType variant", () => {
    const cases = [
      { v: ContractUnionCaseKind.UnionCaseVoid },
      { v: ContractUnionCaseKind.UnionCaseTuple, tuple: [makeNestedType()] },
      {
        v: ContractUnionCaseKind.UnionCaseStruct,
        struct_fields: [{ name: contractSpecString("field0"), ty: makeNestedType() }],
      },
    ];
    for (const val of cases) {
      expect(
        deserialize(serialize(val, codec.ContractUnionCaseType), codec.ContractUnionCaseType)
      ).toEqual(val);
    }
  });

  it("round-trips every ContractTypeDef variant", () => {
    const defs: ContractTypeDef[] = [
      {
        v: ContractTypeDefKind.TypeDefStruct,
        struct_def: {
          name: specId("Point"),
          fields: [
            { name: contractSpecString("x"), ty: { v: ContractTypeKind.U64 } },
            { name: contractSpecString("y"), ty: { v: ContractTypeKind.U64 } },
          ],
        },
      },
      {
        v: ContractTypeDefKind.TypeDefEnum,
        enum_def: {
          name: specId("Color"),
          variants: [
            { name: contractSpecString("Red"), value: 0n },
            { name: contractSpecString("Green"), value: 1n },
          ],
        },
      },
      {
        v: ContractTypeDefKind.TypeDefUnion,
        union_def: {
          name: specId("Shape"),
          cases: [
            {
              name: contractSpecString("Circle"),
              discriminant: 0n,
              case_type: {
                v: ContractUnionCaseKind.UnionCaseTuple,
                tuple: [{ v: ContractTypeKind.U32 }],
              },
            },
            {
              name: contractSpecString("Empty"),
              discriminant: 1n,
              case_type: { v: ContractUnionCaseKind.UnionCaseVoid },
            },
          ],
        },
      },
    ];
    for (const val of defs) {
      expect(
        deserialize(serialize(val, codec.ContractTypeDef), codec.ContractTypeDef)
      ).toEqual(val);
    }
  });

  it("round-trips a full ContractSpec", () => {
    const val: ContractSpec = {
      interfaces: [
        {
          name: contractSpecString("Counter"),
          vers: contractSpecString("1.0.0"),
          throws: [
            { selector: 7n, ty: { v: ContractTypeKind.String } },
          ],
          methods: [
            {
              name: contractSpecString("increment"),
              effect: ContractMethodEffect.EffectStateChanging,
              args: [{ name: contractSpecString("by"), ty: { v: ContractTypeKind.U32 } }],
              return_type: { v: ContractTypeKind.U64 },
            },
            {
              name: contractSpecString("get"),
              effect: ContractMethodEffect.EffectReadOnly,
              args: [],
              return_type: makeNestedType(),
            },
          ],
        },
      ],
      type_defs: [
        {
          v: ContractTypeDefKind.TypeDefStruct,
          struct_def: {
            name: specId("State"),
            fields: [{ name: contractSpecString("count"), ty: { v: ContractTypeKind.U64 } }],
          },
        },
      ],
      events: [
        {
          name: specId("Incremented"),
          signature: topic(new Uint8Array(32).fill(0x99)),
          topics: [{ name: contractSpecString("who"), ty: { v: ContractTypeKind.Address } }],
          fields: [{ name: contractSpecString("by"), ty: { v: ContractTypeKind.U32 } }],
        },
      ],
    };
    expect(deserialize(serialize(val, codec.ContractSpec), codec.ContractSpec)).toEqual(val);
    expect(deserializeCxs(serializeCxs(val, codec.ContractSpec), codec.ContractSpec)).toEqual(val);
  });
});
