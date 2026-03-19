// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";


export type Bytes = Uint8Array & { readonly __brand: "Bytes" };
export function bytes(data: Uint8Array): Bytes {
  return data as Bytes;
}

export interface DogwoodStandaloneConfig {
  validator_config: proto.ValidatorConfig;
  router_config: proto.RouterConfig;
  dogwood_config: proto.DogwoodConfig;
}

export interface DogwoodReceived {
  from: proto.ValidatorID;
  payload: Uint8Array;
}


export interface dogwoodapi_send_args {
  Milliseconds: proto.Milliseconds;
  Bytes: proto.Bytes;
}


//
// XDR Codecs below this point
//

const _Bytes: XdrCodec<Bytes> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return bytes(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

const _DogwoodStandaloneConfig: XdrCodec<DogwoodStandaloneConfig> = {
  encode(w, val) {
    proto.codec.ValidatorConfig.encode(w, val.validator_config);
    proto.codec.RouterConfig.encode(w, val.router_config);
    proto.codec.DogwoodConfig.encode(w, val.dogwood_config);
  },
  decode(r) {
    const validator_config = proto.codec.ValidatorConfig.decode(r);
    const router_config = proto.codec.RouterConfig.decode(r);
    const dogwood_config = proto.codec.DogwoodConfig.decode(r);
    return { validator_config, router_config, dogwood_config };
  },
};

const _DogwoodReceived: XdrCodec<DogwoodReceived> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.from);
    w.writeVarOpaque(val.payload, Number(0xFFFFFFFF));
  },
  decode(r) {
    const from = proto.codec.ValidatorID.decode(r);
    const payload = r.readVarOpaque(Number(0xFFFFFFFF));
    return { from, payload };
  },
};

const _dogwoodapi_send_args: XdrCodec<dogwoodapi_send_args> = {
  encode(w, val) {
    proto.codec.Milliseconds.encode(w, val.Milliseconds);
    proto.codec.Bytes.encode(w, val.Bytes);
  },
  decode(r) {
    const Milliseconds = proto.codec.Milliseconds.decode(r);
    const Bytes = proto.codec.Bytes.decode(r);
    return { Milliseconds, Bytes };
  },
};

export const codec = {
  Bytes: _Bytes,
  DogwoodStandaloneConfig: _DogwoodStandaloneConfig,
  DogwoodReceived: _DogwoodReceived,
  dogwoodapi_send_args: _dogwoodapi_send_args,
} as const;

export const DogwoodAPIProgram: RpcProgramMeta = {
  programId: 0x8ee88ee8,
  version: 1,
  methods: {
    dogwoodapi_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    dogwoodapi_send: { proc: 10, request: _dogwoodapi_send_args, response: VoidCodec },
    dogwoodapi_receive: { proc: 20, request: proto.codec.Milliseconds as XdrCodec<proto.Milliseconds>, response: _DogwoodReceived },
  },
};

