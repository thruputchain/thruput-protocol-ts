// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 6ab835b07c234abb4b0b50b61d687904727a4f32

// A program to test the rpc driver, used in {s}rpcthroughput.
// This file is present in protocol/ to support cross-language RPC testing.

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@thruputchain/xdr";
import * as proto from "./index.js";

/** XDR: `typedef opaque Data<>`. */
export type Data = Uint8Array & { readonly __brand: { readonly Data: true } };
export function data(data: Uint8Array): Data {
  return data as Data;
}


//
// XDR Codecs below this point
//

const _Data: XdrCodec<Data> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return data(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

export const codec = {
  Data: _Data,
} as const;

export const blank_rpcProgram: RpcProgramMeta = {
  programId: 3123124,
  version: 1,
  methods: {
    null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    echo: { proc: 1, request: () => _Data, response: () => _Data },
  },
};

