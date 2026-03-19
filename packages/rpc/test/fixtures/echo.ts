// Generated from echo.x by x23c --ts, then patched for standalone use.
//
// To regenerate:
//   x23c --ts -o packages/rpc/test/fixtures/echo.ts packages/rpc/test/fixtures/echo.x
// Then delete the `import * as proto from "./index.js";` line (this file is
// standalone — it doesn't reference any external protocol types via proto.*).

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";



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

