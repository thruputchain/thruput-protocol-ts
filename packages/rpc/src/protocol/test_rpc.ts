// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: bab641a16d398d48b16086772f51d186ac0522cb

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";

export type Data = Uint8Array & { readonly __brand: "Data" };
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
    null: { proc: 0, request: VoidCodec, response: VoidCodec },
    echo: { proc: 1, request: _Data, response: _Data },
  },
};

