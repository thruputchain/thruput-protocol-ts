// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 445ff7bb6fa8c182d33ef0d939ea8c869b7bf4ce

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";



export interface EchoRequest {
  value: bigint;
  /** XDR: `string message<256>` — max 256 bytes. */
  message: VarString<256>;
}

export interface EchoResponse {
  value: bigint;
  /** XDR: `string message<256>` — max 256 bytes. */
  message: VarString<256>;
}

export interface AddRequest {
  a: bigint;
  b: bigint;
}

export interface AddResponse {
  result: bigint;
}



//
// XDR Codecs below this point
//

const _EchoRequest: XdrCodec<EchoRequest> = {
  encode(w, val) {
    w.writeUint32(val.value);
    w.writeString(val.message, Number(256));
  },
  decode(r) {
    const value = r.readUint32();
    const message = r.readString(Number(256));
    return { value, message };
  },
};

const _EchoResponse: XdrCodec<EchoResponse> = {
  encode(w, val) {
    w.writeUint32(val.value);
    w.writeString(val.message, Number(256));
  },
  decode(r) {
    const value = r.readUint32();
    const message = r.readString(Number(256));
    return { value, message };
  },
};

const _AddRequest: XdrCodec<AddRequest> = {
  encode(w, val) {
    w.writeUint32(val.a);
    w.writeUint32(val.b);
  },
  decode(r) {
    const a = r.readUint32();
    const b = r.readUint32();
    return { a, b };
  },
};

const _AddResponse: XdrCodec<AddResponse> = {
  encode(w, val) {
    w.writeUint32(val.result);
  },
  decode(r) {
    const result = r.readUint32();
    return { result };
  },
};

export const codec = {
  EchoRequest: _EchoRequest,
  EchoResponse: _EchoResponse,
  AddRequest: _AddRequest,
  AddResponse: _AddResponse,
} as const;

export const EchoServiceProgram: RpcProgramMeta = {
  programId: 0xECEC0001,
  version: 1,
  methods: {
    echo_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    echo_echo: { proc: 1, request: () => _EchoRequest, response: () => _EchoResponse },
    echo_add: { proc: 2, request: () => _AddRequest, response: () => _AddResponse },
  },
};

