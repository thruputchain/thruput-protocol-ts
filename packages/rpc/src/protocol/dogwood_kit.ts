// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 445ff7bb6fa8c182d33ef0d939ea8c869b7bf4ce

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export type DogwoodInt64 = bigint & { readonly __brand: { readonly DogwoodInt64: true } };
export function dogwoodInt64(val: bigint): DogwoodInt64 {
  return val as DogwoodInt64;
}

export type DogwoodInt32 = bigint & { readonly __brand: { readonly DogwoodInt32: true } };
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

