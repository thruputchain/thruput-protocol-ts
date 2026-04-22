// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: bab641a16d398d48b16086772f51d186ac0522cb

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export type DogwoodInt64 = bigint & { readonly __brand: "DogwoodInt64" };
export function dogwoodInt64(val: bigint): DogwoodInt64 {
  return val as DogwoodInt64;
}

export type DogwoodInt32 = bigint & { readonly __brand: "DogwoodInt32" };
export function dogwoodInt32(val: bigint): DogwoodInt32 {
  return val as DogwoodInt32;
}


//
// XDR Codecs below this point
//

const _DogwoodInt64: XdrCodec<DogwoodInt64> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return dogwoodInt64(r.readUint64()); },
};

const _DogwoodInt32: XdrCodec<DogwoodInt32> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return dogwoodInt32(r.readUint32()); },
};

export const codec = {
  DogwoodInt64: _DogwoodInt64,
  DogwoodInt32: _DogwoodInt32,
} as const;

