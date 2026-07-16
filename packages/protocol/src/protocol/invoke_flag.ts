// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 7c6215466921ff17dc1f31705e23af0f52ce2c08

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export enum InvokeFlag {
  None = 0,
  TryInvoke = 0x00000001,
  ReadOnly = 0x00000002,
  DelegateCall = 0x00000004,
}

export type InvokeFlagSet = bigint & { readonly __brand: "InvokeFlagSet" };
export function invokeFlagSet(val: bigint): InvokeFlagSet {
  return val as InvokeFlagSet;
}


//
// XDR Codecs below this point
//

const _InvokeFlag: XdrCodec<InvokeFlag> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as InvokeFlag; },
};

const _InvokeFlagSet: XdrCodec<InvokeFlagSet> = {
  encode(w, val) { w.writeInt32(val); },
  decode(r) { return invokeFlagSet(r.readInt32()); },
};

export const codec = {
  InvokeFlag: _InvokeFlag,
  InvokeFlagSet: _InvokeFlagSet,
} as const;

