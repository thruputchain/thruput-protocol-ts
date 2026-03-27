// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhog/xdr";



export interface EchoRequest {
  value: bigint;
  message: string;
}

export interface EchoResponse {
  value: bigint;
  message: string;
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
    echo_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    echo_echo: { proc: 1, request: _EchoRequest, response: _EchoResponse },
    echo_add: { proc: 2, request: _AddRequest, response: _AddResponse },
  },
};

