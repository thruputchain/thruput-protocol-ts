// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 4eba524354bda9d7db1efa2845da43ce40dd1ab9

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



/** XDR: `typedef string ContractSpecString<>`. */
export type ContractSpecString = string & { readonly __brand: { readonly ContractSpecString: true } };
export function contractSpecString(val: string): ContractSpecString {
  return val as ContractSpecString;
}

export interface ContractSpecId {
  crate_name: proto.ContractSpecString;
  major: proto.ContractSpecString;
  module_path: proto.ContractSpecString;
  declared: proto.ContractSpecString;
}


export interface ContractArrayType {
  element: proto.ContractType;
  len: bigint;
}

export interface ContractVectorType {
  element: proto.ContractType;
  max_len: bigint;
}

export enum ContractTypeKind {
  Void = 0,
  Bool = 1,
  U32 = 2,
  I32 = 3,
  U64 = 4,
  I64 = 5,
  U128 = 6,
  I128 = 7,
  String = 8,
  Bytes = 9,
  Address = 10,
  Option = 11,
  Vector = 12,
  Tuple = 13,
  Named = 14,
  U8 = 15,
  Array = 16,
  SignedToken = 17,
  U256 = 18,
  I256 = 19,
}

export type ContractType =
  | { v: proto.ContractTypeKind.Void }
  | { v: proto.ContractTypeKind.Bool }
  | { v: proto.ContractTypeKind.U32 }
  | { v: proto.ContractTypeKind.I32 }
  | { v: proto.ContractTypeKind.U64 }
  | { v: proto.ContractTypeKind.I64 }
  | { v: proto.ContractTypeKind.U128 }
  | { v: proto.ContractTypeKind.I128 }
  | { v: proto.ContractTypeKind.String }
  | { v: proto.ContractTypeKind.Bytes }
  | { v: proto.ContractTypeKind.Address }
  | { v: proto.ContractTypeKind.Option; option_inner: proto.ContractType }
  | { v: proto.ContractTypeKind.Vector; vector: proto.ContractVectorType }
  | { v: proto.ContractTypeKind.Tuple; tuple: proto.ContractType[] }
  | { v: proto.ContractTypeKind.Named; named: proto.ContractSpecId }
  | { v: proto.ContractTypeKind.U8 }
  | { v: proto.ContractTypeKind.Array; array: proto.ContractArrayType }
  | { v: proto.ContractTypeKind.SignedToken; signed_token_preimage: proto.ContractSignedTokenPreimage }
  | { v: proto.ContractTypeKind.U256 }
  | { v: proto.ContractTypeKind.I256 }
;

export interface ContractSignedTokenPreimage {
  preimage_type: proto.ContractType | null;
}

export interface ContractExceptionType {
  selector: bigint;
  ty: proto.ContractType;
}

export interface ContractField {
  name: proto.ContractSpecString;
  ty: proto.ContractType;
}

export enum ContractMethodEffect {
  EffectPure = 1,
  EffectReadOnly = 2,
  EffectStateChanging = 3,
}

export interface ContractSpecMethod {
  name: proto.ContractSpecString;
  /** XDR: `ContractField args<>`. */
  args: proto.ContractField[];
  return_type: proto.ContractType;
  effect: proto.ContractMethodEffect | null;
}

export interface ContractSpecInterface {
  name: proto.ContractSpecString;
  vers: proto.ContractSpecString;
  /** XDR: `ContractExceptionType throws<>`. */
  throws: proto.ContractExceptionType[];
  /** XDR: `ContractSpecMethod methods<>`. */
  methods: proto.ContractSpecMethod[];
}

export interface ContractStructDef {
  name: proto.ContractSpecId;
  /** XDR: `ContractField fields<>`. */
  fields: proto.ContractField[];
}

export interface ContractEnumVariant {
  name: proto.ContractSpecString;
  value: bigint;
}

export interface ContractEnumDef {
  name: proto.ContractSpecId;
  /** XDR: `ContractEnumVariant variants<>`. */
  variants: proto.ContractEnumVariant[];
}

export enum ContractUnionCaseKind {
  UnionCaseVoid = 0,
  UnionCaseTuple = 1,
  UnionCaseStruct = 2,
}

export type ContractUnionCaseType =
  | { v: proto.ContractUnionCaseKind.UnionCaseVoid }
  | { v: proto.ContractUnionCaseKind.UnionCaseTuple; tuple: proto.ContractType[] }
  | { v: proto.ContractUnionCaseKind.UnionCaseStruct; struct_fields: proto.ContractField[] }
;

export interface ContractUnionCase {
  name: proto.ContractSpecString;
  discriminant: bigint;
  case_type: proto.ContractUnionCaseType;
}

export interface ContractUnionDef {
  name: proto.ContractSpecId;
  /** XDR: `ContractUnionCase cases<>`. */
  cases: proto.ContractUnionCase[];
}

export enum ContractTypeDefKind {
  TypeDefStruct = 0,
  TypeDefEnum = 1,
  TypeDefUnion = 2,
}

export type ContractTypeDef =
  | { v: proto.ContractTypeDefKind.TypeDefStruct; struct_def: proto.ContractStructDef }
  | { v: proto.ContractTypeDefKind.TypeDefEnum; enum_def: proto.ContractEnumDef }
  | { v: proto.ContractTypeDefKind.TypeDefUnion; union_def: proto.ContractUnionDef }
;

export interface ContractEventDef {
  name: proto.ContractSpecId;
  signature: proto.Topic;
  /** XDR: `ContractField topics<>`. */
  topics: proto.ContractField[];
  /** XDR: `ContractField fields<>`. */
  fields: proto.ContractField[];
}

export interface ContractSpec {
  /** XDR: `ContractSpecInterface interfaces<>`. */
  interfaces: proto.ContractSpecInterface[];
  /** XDR: `ContractTypeDef type_defs<>`. */
  type_defs: proto.ContractTypeDef[];
  /** XDR: `ContractEventDef events<>`. */
  events: proto.ContractEventDef[];
}


//
// XDR Codecs below this point
//

const _ContractSpecString: XdrCodec<ContractSpecString> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return contractSpecString(r.readString(Number(0xFFFFFFFF))); },
};

const _ContractSpecId: XdrCodec<ContractSpecId> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.crate_name);
    proto.codec.ContractSpecString.encode(w, val.major);
    proto.codec.ContractSpecString.encode(w, val.module_path);
    proto.codec.ContractSpecString.encode(w, val.declared);
  },
  decode(r) {
    const crate_name = proto.codec.ContractSpecString.decode(r);
    const major = proto.codec.ContractSpecString.decode(r);
    const module_path = proto.codec.ContractSpecString.decode(r);
    const declared = proto.codec.ContractSpecString.decode(r);
    return { crate_name, major, module_path, declared };
  },
};

const _ContractArrayType: XdrCodec<ContractArrayType> = {
  encode(w, val) {
    proto.codec.ContractType.encode(w, val.element);
    w.writeUint32(val.len);
  },
  decode(r) {
    const element = proto.codec.ContractType.decode(r);
    const len = r.readUint32();
    return { element, len };
  },
};

const _ContractVectorType: XdrCodec<ContractVectorType> = {
  encode(w, val) {
    proto.codec.ContractType.encode(w, val.element);
    w.writeUint32(val.max_len);
  },
  decode(r) {
    const element = proto.codec.ContractType.decode(r);
    const max_len = r.readUint32();
    return { element, max_len };
  },
};

const _ContractTypeKind: XdrCodec<ContractTypeKind> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ContractTypeKind; },
};

const _ContractType: XdrCodec<ContractType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case proto.ContractTypeKind.Void:
        break;
      case proto.ContractTypeKind.Bool:
        break;
      case proto.ContractTypeKind.U32:
        break;
      case proto.ContractTypeKind.I32:
        break;
      case proto.ContractTypeKind.U64:
        break;
      case proto.ContractTypeKind.I64:
        break;
      case proto.ContractTypeKind.U128:
        break;
      case proto.ContractTypeKind.I128:
        break;
      case proto.ContractTypeKind.String:
        break;
      case proto.ContractTypeKind.Bytes:
        break;
      case proto.ContractTypeKind.Address:
        break;
      case proto.ContractTypeKind.Option:
        proto.codec.ContractType.encode(w, val.option_inner);
        break;
      case proto.ContractTypeKind.Vector:
        proto.codec.ContractVectorType.encode(w, val.vector);
        break;
      case proto.ContractTypeKind.Tuple:
        VarArrayCodec(proto.codec.ContractType, Number(0xFFFFFFFF)).encode(w, val.tuple);
        break;
      case proto.ContractTypeKind.Named:
        proto.codec.ContractSpecId.encode(w, val.named);
        break;
      case proto.ContractTypeKind.U8:
        break;
      case proto.ContractTypeKind.Array:
        proto.codec.ContractArrayType.encode(w, val.array);
        break;
      case proto.ContractTypeKind.SignedToken:
        proto.codec.ContractSignedTokenPreimage.encode(w, val.signed_token_preimage);
        break;
      case proto.ContractTypeKind.U256:
        break;
      case proto.ContractTypeKind.I256:
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case proto.ContractTypeKind.Void:
        return { v } as ContractType;
      case proto.ContractTypeKind.Bool:
        return { v } as ContractType;
      case proto.ContractTypeKind.U32:
        return { v } as ContractType;
      case proto.ContractTypeKind.I32:
        return { v } as ContractType;
      case proto.ContractTypeKind.U64:
        return { v } as ContractType;
      case proto.ContractTypeKind.I64:
        return { v } as ContractType;
      case proto.ContractTypeKind.U128:
        return { v } as ContractType;
      case proto.ContractTypeKind.I128:
        return { v } as ContractType;
      case proto.ContractTypeKind.String:
        return { v } as ContractType;
      case proto.ContractTypeKind.Bytes:
        return { v } as ContractType;
      case proto.ContractTypeKind.Address:
        return { v } as ContractType;
      case proto.ContractTypeKind.Option:
        const option_inner = proto.codec.ContractType.decode(r);
        return { v, option_inner };
      case proto.ContractTypeKind.Vector:
        const vector = proto.codec.ContractVectorType.decode(r);
        return { v, vector };
      case proto.ContractTypeKind.Tuple:
        const tuple = VarArrayCodec(proto.codec.ContractType, Number(0xFFFFFFFF)).decode(r);
        return { v, tuple };
      case proto.ContractTypeKind.Named:
        const named = proto.codec.ContractSpecId.decode(r);
        return { v, named };
      case proto.ContractTypeKind.U8:
        return { v } as ContractType;
      case proto.ContractTypeKind.Array:
        const array = proto.codec.ContractArrayType.decode(r);
        return { v, array };
      case proto.ContractTypeKind.SignedToken:
        const signed_token_preimage = proto.codec.ContractSignedTokenPreimage.decode(r);
        return { v, signed_token_preimage };
      case proto.ContractTypeKind.U256:
        return { v } as ContractType;
      case proto.ContractTypeKind.I256:
        return { v } as ContractType;
      default:
        throw new Error(`Unknown ContractType discriminant: ${v}`);
    }
  },
};

const _ContractSignedTokenPreimage: XdrCodec<ContractSignedTokenPreimage> = {
  encode(w, val) {
    OptionCodec(_ContractType).encode(w, val.preimage_type);
  },
  decode(r) {
    const preimage_type = OptionCodec(_ContractType).decode(r);
    return { preimage_type };
  },
};

const _ContractExceptionType: XdrCodec<ContractExceptionType> = {
  encode(w, val) {
    w.writeUint64(val.selector);
    proto.codec.ContractType.encode(w, val.ty);
  },
  decode(r) {
    const selector = r.readUint64();
    const ty = proto.codec.ContractType.decode(r);
    return { selector, ty };
  },
};

const _ContractField: XdrCodec<ContractField> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.name);
    proto.codec.ContractType.encode(w, val.ty);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
    const ty = proto.codec.ContractType.decode(r);
    return { name, ty };
  },
};

const _ContractMethodEffect: XdrCodec<ContractMethodEffect> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ContractMethodEffect; },
};

const _ContractSpecMethod: XdrCodec<ContractSpecMethod> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.args);
    proto.codec.ContractType.encode(w, val.return_type);
    OptionCodec(_ContractMethodEffect).encode(w, val.effect);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
    const args = VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).decode(r);
    const return_type = proto.codec.ContractType.decode(r);
    const effect = OptionCodec(_ContractMethodEffect).decode(r);
    return { name, args, return_type, effect };
  },
};

const _ContractSpecInterface: XdrCodec<ContractSpecInterface> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.name);
    proto.codec.ContractSpecString.encode(w, val.vers);
    VarArrayCodec(proto.codec.ContractExceptionType, Number(0xFFFFFFFF)).encode(w, val.throws);
    VarArrayCodec(proto.codec.ContractSpecMethod, Number(0xFFFFFFFF)).encode(w, val.methods);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
    const vers = proto.codec.ContractSpecString.decode(r);
    const throws = VarArrayCodec(proto.codec.ContractExceptionType, Number(0xFFFFFFFF)).decode(r);
    const methods = VarArrayCodec(proto.codec.ContractSpecMethod, Number(0xFFFFFFFF)).decode(r);
    return { name, vers, throws, methods };
  },
};

const _ContractStructDef: XdrCodec<ContractStructDef> = {
  encode(w, val) {
    proto.codec.ContractSpecId.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.fields);
  },
  decode(r) {
    const name = proto.codec.ContractSpecId.decode(r);
    const fields = VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).decode(r);
    return { name, fields };
  },
};

const _ContractEnumVariant: XdrCodec<ContractEnumVariant> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.name);
    w.writeInt32(val.value);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
    const value = r.readInt32();
    return { name, value };
  },
};

const _ContractEnumDef: XdrCodec<ContractEnumDef> = {
  encode(w, val) {
    proto.codec.ContractSpecId.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractEnumVariant, Number(0xFFFFFFFF)).encode(w, val.variants);
  },
  decode(r) {
    const name = proto.codec.ContractSpecId.decode(r);
    const variants = VarArrayCodec(proto.codec.ContractEnumVariant, Number(0xFFFFFFFF)).decode(r);
    return { name, variants };
  },
};

const _ContractUnionCaseKind: XdrCodec<ContractUnionCaseKind> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ContractUnionCaseKind; },
};

const _ContractUnionCaseType: XdrCodec<ContractUnionCaseType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case proto.ContractUnionCaseKind.UnionCaseVoid:
        break;
      case proto.ContractUnionCaseKind.UnionCaseTuple:
        VarArrayCodec(proto.codec.ContractType, Number(0xFFFFFFFF)).encode(w, val.tuple);
        break;
      case proto.ContractUnionCaseKind.UnionCaseStruct:
        VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.struct_fields);
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case proto.ContractUnionCaseKind.UnionCaseVoid:
        return { v } as ContractUnionCaseType;
      case proto.ContractUnionCaseKind.UnionCaseTuple:
        const tuple = VarArrayCodec(proto.codec.ContractType, Number(0xFFFFFFFF)).decode(r);
        return { v, tuple };
      case proto.ContractUnionCaseKind.UnionCaseStruct:
        const struct_fields = VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).decode(r);
        return { v, struct_fields };
      default:
        throw new Error(`Unknown ContractUnionCaseType discriminant: ${v}`);
    }
  },
};

const _ContractUnionCase: XdrCodec<ContractUnionCase> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.name);
    w.writeInt32(val.discriminant);
    proto.codec.ContractUnionCaseType.encode(w, val.case_type);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
    const discriminant = r.readInt32();
    const case_type = proto.codec.ContractUnionCaseType.decode(r);
    return { name, discriminant, case_type };
  },
};

const _ContractUnionDef: XdrCodec<ContractUnionDef> = {
  encode(w, val) {
    proto.codec.ContractSpecId.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractUnionCase, Number(0xFFFFFFFF)).encode(w, val.cases);
  },
  decode(r) {
    const name = proto.codec.ContractSpecId.decode(r);
    const cases = VarArrayCodec(proto.codec.ContractUnionCase, Number(0xFFFFFFFF)).decode(r);
    return { name, cases };
  },
};

const _ContractTypeDefKind: XdrCodec<ContractTypeDefKind> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ContractTypeDefKind; },
};

const _ContractTypeDef: XdrCodec<ContractTypeDef> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case proto.ContractTypeDefKind.TypeDefStruct:
        proto.codec.ContractStructDef.encode(w, val.struct_def);
        break;
      case proto.ContractTypeDefKind.TypeDefEnum:
        proto.codec.ContractEnumDef.encode(w, val.enum_def);
        break;
      case proto.ContractTypeDefKind.TypeDefUnion:
        proto.codec.ContractUnionDef.encode(w, val.union_def);
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case proto.ContractTypeDefKind.TypeDefStruct:
        const struct_def = proto.codec.ContractStructDef.decode(r);
        return { v, struct_def };
      case proto.ContractTypeDefKind.TypeDefEnum:
        const enum_def = proto.codec.ContractEnumDef.decode(r);
        return { v, enum_def };
      case proto.ContractTypeDefKind.TypeDefUnion:
        const union_def = proto.codec.ContractUnionDef.decode(r);
        return { v, union_def };
      default:
        throw new Error(`Unknown ContractTypeDef discriminant: ${v}`);
    }
  },
};

const _ContractEventDef: XdrCodec<ContractEventDef> = {
  encode(w, val) {
    proto.codec.ContractSpecId.encode(w, val.name);
    proto.codec.Topic.encode(w, val.signature);
    VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.topics);
    VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.fields);
  },
  decode(r) {
    const name = proto.codec.ContractSpecId.decode(r);
    const signature = proto.codec.Topic.decode(r);
    const topics = VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).decode(r);
    const fields = VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).decode(r);
    return { name, signature, topics, fields };
  },
};

const _ContractSpec: XdrCodec<ContractSpec> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.ContractSpecInterface, Number(0xFFFFFFFF)).encode(w, val.interfaces);
    VarArrayCodec(proto.codec.ContractTypeDef, Number(0xFFFFFFFF)).encode(w, val.type_defs);
    VarArrayCodec(proto.codec.ContractEventDef, Number(0xFFFFFFFF)).encode(w, val.events);
  },
  decode(r) {
    const interfaces = VarArrayCodec(proto.codec.ContractSpecInterface, Number(0xFFFFFFFF)).decode(r);
    const type_defs = VarArrayCodec(proto.codec.ContractTypeDef, Number(0xFFFFFFFF)).decode(r);
    const events = VarArrayCodec(proto.codec.ContractEventDef, Number(0xFFFFFFFF)).decode(r);
    return { interfaces, type_defs, events };
  },
};

export const codec = {
  ContractSpecString: _ContractSpecString,
  ContractSpecId: _ContractSpecId,
  ContractArrayType: _ContractArrayType,
  ContractVectorType: _ContractVectorType,
  ContractTypeKind: _ContractTypeKind,
  ContractType: _ContractType,
  ContractSignedTokenPreimage: _ContractSignedTokenPreimage,
  ContractExceptionType: _ContractExceptionType,
  ContractField: _ContractField,
  ContractMethodEffect: _ContractMethodEffect,
  ContractSpecMethod: _ContractSpecMethod,
  ContractSpecInterface: _ContractSpecInterface,
  ContractStructDef: _ContractStructDef,
  ContractEnumVariant: _ContractEnumVariant,
  ContractEnumDef: _ContractEnumDef,
  ContractUnionCaseKind: _ContractUnionCaseKind,
  ContractUnionCaseType: _ContractUnionCaseType,
  ContractUnionCase: _ContractUnionCase,
  ContractUnionDef: _ContractUnionDef,
  ContractTypeDefKind: _ContractTypeDefKind,
  ContractTypeDef: _ContractTypeDef,
  ContractEventDef: _ContractEventDef,
  ContractSpec: _ContractSpec,
} as const;

