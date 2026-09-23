// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e671a3694d7312d78364456bb86ee8a18de1502d

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";


/** XDR: `typedef opaque Bytes<>`. */
export type Bytes = Uint8Array & { readonly __brand: { readonly Bytes: true } };
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
  /** XDR: `opaque payload<>`. */
  payload: Uint8Array;
}


export interface dogwoodapi_send_args {
  arg0: proto.Milliseconds;
  arg1: proto.Bytes;
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
    proto.codec.Milliseconds.encode(w, val.arg0);
    proto.codec.Bytes.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.Milliseconds.decode(r);
    const arg1 = proto.codec.Bytes.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  Bytes: _Bytes,
  DogwoodStandaloneConfig: _DogwoodStandaloneConfig,
  DogwoodReceived: _DogwoodReceived,
} as const;

export const DogwoodAPIProgram: RpcProgramMeta = {
  programId: 0x8ee88ee8,
  version: 1,
  methods: {
    dogwoodapi_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    dogwoodapi_send: { proc: 10, request: () => _dogwoodapi_send_args, response: () => VoidCodec },
    dogwoodapi_receive: { proc: 20, request: () => proto.codec.Milliseconds as XdrCodec<proto.Milliseconds>, response: () => _DogwoodReceived },
  },
};

