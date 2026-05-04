// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 076d53880b71d9063d5455fe857591448b4f0fb8

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type ContractSpecString = string & { readonly __brand: "ContractSpecString" };
export function contractSpecString(val: string): ContractSpecString {
  return val as ContractSpecString;
}


export interface ContractArrayType {
  element: proto.ContractType | null;
  len: bigint;
}

export interface ContractVectorType {
  element: proto.ContractType | null;
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
  | { v: proto.ContractTypeKind.Option; option_inner: proto.ContractType | null }
  | { v: proto.ContractTypeKind.Vector; vector: proto.ContractVectorType }
  | { v: proto.ContractTypeKind.Tuple; tuple: proto.ContractType[] }
  | { v: proto.ContractTypeKind.Named; named: proto.ContractSpecString }
  | { v: proto.ContractTypeKind.U8 }
  | { v: proto.ContractTypeKind.Array; array: proto.ContractArrayType }
;

export interface ContractExceptionType {
  selector: bigint;
  ty: proto.ContractType;
}

export interface ContractField {
  name: proto.ContractSpecString;
  ty: proto.ContractType;
}

export interface ContractSpecMethod {
  name: proto.ContractSpecString;
  args: proto.ContractField[];
  return_type: proto.ContractType;
}

export interface ContractSpecInterface {
  name: proto.ContractSpecString;
  vers: proto.ContractSpecString;
  throws: proto.ContractExceptionType[];
  methods: proto.ContractSpecMethod[];
}

export interface ContractStructDef {
  name: proto.ContractSpecString;
  fields: proto.ContractField[];
}

export interface ContractEnumVariant {
  name: proto.ContractSpecString;
  value: bigint;
}

export interface ContractEnumDef {
  name: proto.ContractSpecString;
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
  name: proto.ContractSpecString;
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

export interface ContractSpec {
  interfaces: proto.ContractSpecInterface[];
  type_defs: proto.ContractTypeDef[];
}

export interface SpecInterfaceFragment {
  interface_name: proto.ContractSpecString;
  interface_version: proto.ContractSpecString;
  throws: proto.ContractExceptionType[];
}

export interface SpecMethodFragment {
  interface_name: proto.ContractSpecString;
  interface_version: proto.ContractSpecString;
  method: proto.ContractSpecMethod;
}

export enum SpecFragmentKind {
  SpecInterface = 0,
  SpecMethod = 1,
  SpecTypeDef = 2,
  ExportedSpecTypeDef = 3,
}

export type SpecFragment =
  | { v: proto.SpecFragmentKind.SpecInterface; interface_fragment: proto.SpecInterfaceFragment }
  | { v: proto.SpecFragmentKind.SpecMethod; method_fragment: proto.SpecMethodFragment }
  | { v: proto.SpecFragmentKind.SpecTypeDef; type_def: proto.ContractTypeDef }
  | { v: proto.SpecFragmentKind.ExportedSpecTypeDef; type_def: proto.ContractTypeDef }
;


//
// XDR Codecs below this point
//

const _ContractSpecString: XdrCodec<ContractSpecString> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return contractSpecString(r.readString(Number(0xFFFFFFFF))); },
};

const _ContractArrayType: XdrCodec<ContractArrayType> = {
  encode(w, val) {
    OptionCodec(proto.codec.ContractType as XdrCodec<proto.ContractType>).encode(w, val.element);
    w.writeUint32(val.len);
  },
  decode(r) {
    const element = OptionCodec(proto.codec.ContractType as XdrCodec<proto.ContractType>).decode(r);
    const len = r.readUint32();
    return { element, len };
  },
};

const _ContractVectorType: XdrCodec<ContractVectorType> = {
  encode(w, val) {
    OptionCodec(proto.codec.ContractType as XdrCodec<proto.ContractType>).encode(w, val.element);
    w.writeUint32(val.max_len);
  },
  decode(r) {
    const element = OptionCodec(proto.codec.ContractType as XdrCodec<proto.ContractType>).decode(r);
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
        OptionCodec(_ContractType).encode(w, val.option_inner);
        break;
      case proto.ContractTypeKind.Vector:
        proto.codec.ContractVectorType.encode(w, val.vector);
        break;
      case proto.ContractTypeKind.Tuple:
        VarArrayCodec(proto.codec.ContractType, Number(0xFFFFFFFF)).encode(w, val.tuple);
        break;
      case proto.ContractTypeKind.Named:
        proto.codec.ContractSpecString.encode(w, val.named);
        break;
      case proto.ContractTypeKind.U8:
        break;
      case proto.ContractTypeKind.Array:
        proto.codec.ContractArrayType.encode(w, val.array);
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
        const option_inner = OptionCodec(_ContractType).decode(r);
        return { v, option_inner };
      case proto.ContractTypeKind.Vector:
        const vector = proto.codec.ContractVectorType.decode(r);
        return { v, vector };
      case proto.ContractTypeKind.Tuple:
        const tuple = VarArrayCodec(proto.codec.ContractType, Number(0xFFFFFFFF)).decode(r);
        return { v, tuple };
      case proto.ContractTypeKind.Named:
        const named = proto.codec.ContractSpecString.decode(r);
        return { v, named };
      case proto.ContractTypeKind.U8:
        return { v } as ContractType;
      case proto.ContractTypeKind.Array:
        const array = proto.codec.ContractArrayType.decode(r);
        return { v, array };
      default:
        throw new Error(`Unknown ContractType discriminant: ${v}`);
    }
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

const _ContractSpecMethod: XdrCodec<ContractSpecMethod> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.args);
    proto.codec.ContractType.encode(w, val.return_type);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
    const args = VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).decode(r);
    const return_type = proto.codec.ContractType.decode(r);
    return { name, args, return_type };
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
    proto.codec.ContractSpecString.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractField, Number(0xFFFFFFFF)).encode(w, val.fields);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
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
    proto.codec.ContractSpecString.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractEnumVariant, Number(0xFFFFFFFF)).encode(w, val.variants);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
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
    proto.codec.ContractSpecString.encode(w, val.name);
    VarArrayCodec(proto.codec.ContractUnionCase, Number(0xFFFFFFFF)).encode(w, val.cases);
  },
  decode(r) {
    const name = proto.codec.ContractSpecString.decode(r);
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

const _ContractSpec: XdrCodec<ContractSpec> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.ContractSpecInterface, Number(0xFFFFFFFF)).encode(w, val.interfaces);
    VarArrayCodec(proto.codec.ContractTypeDef, Number(0xFFFFFFFF)).encode(w, val.type_defs);
  },
  decode(r) {
    const interfaces = VarArrayCodec(proto.codec.ContractSpecInterface, Number(0xFFFFFFFF)).decode(r);
    const type_defs = VarArrayCodec(proto.codec.ContractTypeDef, Number(0xFFFFFFFF)).decode(r);
    return { interfaces, type_defs };
  },
};

const _SpecInterfaceFragment: XdrCodec<SpecInterfaceFragment> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.interface_name);
    proto.codec.ContractSpecString.encode(w, val.interface_version);
    VarArrayCodec(proto.codec.ContractExceptionType, Number(0xFFFFFFFF)).encode(w, val.throws);
  },
  decode(r) {
    const interface_name = proto.codec.ContractSpecString.decode(r);
    const interface_version = proto.codec.ContractSpecString.decode(r);
    const throws = VarArrayCodec(proto.codec.ContractExceptionType, Number(0xFFFFFFFF)).decode(r);
    return { interface_name, interface_version, throws };
  },
};

const _SpecMethodFragment: XdrCodec<SpecMethodFragment> = {
  encode(w, val) {
    proto.codec.ContractSpecString.encode(w, val.interface_name);
    proto.codec.ContractSpecString.encode(w, val.interface_version);
    proto.codec.ContractSpecMethod.encode(w, val.method);
  },
  decode(r) {
    const interface_name = proto.codec.ContractSpecString.decode(r);
    const interface_version = proto.codec.ContractSpecString.decode(r);
    const method = proto.codec.ContractSpecMethod.decode(r);
    return { interface_name, interface_version, method };
  },
};

const _SpecFragmentKind: XdrCodec<SpecFragmentKind> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SpecFragmentKind; },
};

const _SpecFragment: XdrCodec<SpecFragment> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case proto.SpecFragmentKind.SpecInterface:
        proto.codec.SpecInterfaceFragment.encode(w, val.interface_fragment);
        break;
      case proto.SpecFragmentKind.SpecMethod:
        proto.codec.SpecMethodFragment.encode(w, val.method_fragment);
        break;
      case proto.SpecFragmentKind.SpecTypeDef:
      case proto.SpecFragmentKind.ExportedSpecTypeDef:
        proto.codec.ContractTypeDef.encode(w, val.type_def);
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case proto.SpecFragmentKind.SpecInterface:
        const interface_fragment = proto.codec.SpecInterfaceFragment.decode(r);
        return { v, interface_fragment };
      case proto.SpecFragmentKind.SpecMethod:
        const method_fragment = proto.codec.SpecMethodFragment.decode(r);
        return { v, method_fragment };
      case proto.SpecFragmentKind.SpecTypeDef:
      case proto.SpecFragmentKind.ExportedSpecTypeDef:
        const type_def = proto.codec.ContractTypeDef.decode(r);
        return { v, type_def };
      default:
        throw new Error(`Unknown SpecFragment discriminant: ${v}`);
    }
  },
};

export const codec = {
  ContractSpecString: _ContractSpecString,
  ContractArrayType: _ContractArrayType,
  ContractVectorType: _ContractVectorType,
  ContractTypeKind: _ContractTypeKind,
  ContractType: _ContractType,
  ContractExceptionType: _ContractExceptionType,
  ContractField: _ContractField,
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
  ContractSpec: _ContractSpec,
  SpecInterfaceFragment: _SpecInterfaceFragment,
  SpecMethodFragment: _SpecMethodFragment,
  SpecFragmentKind: _SpecFragmentKind,
  SpecFragment: _SpecFragment,
} as const;

