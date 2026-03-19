// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
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

