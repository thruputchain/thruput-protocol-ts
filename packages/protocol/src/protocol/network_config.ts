// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 14959ad52a564640d44d7079849fb9f146d330c0

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum ConfigParamID {
  kConfigParamMaxSHA256Buffers = 0,
  kConfigParamMaxCrossInvokeDepth = 1,
  kConfigParamMaxNewContractsPerTx = 2,
}

export type ConfigParam =
  | { param: proto.ConfigParamID.kConfigParamMaxSHA256Buffers; max_sha256_buffers: bigint }
  | { param: proto.ConfigParamID.kConfigParamMaxCrossInvokeDepth; max_cross_invoke_depth: bigint }
  | { param: proto.ConfigParamID.kConfigParamMaxNewContractsPerTx; max_new_contracts_per_tx: bigint }
;

export interface NetworkConfigV0 {
  /** XDR: `ConfigParam params<>`. */
  params: proto.ConfigParam[];
}

export type NetworkConfig =
  | { v: 0; v0: proto.NetworkConfigV0 }
;

export interface ConfigHashPreimage {
  storage_cost_model: proto.StorageCostModelXdr;
  network_config: proto.NetworkConfig;
}


//
// XDR Codecs below this point
//

const _ConfigParamID: XdrCodec<ConfigParamID> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ConfigParamID; },
};

const _ConfigParam: XdrCodec<ConfigParam> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.param));
    switch (val.param) {
      case proto.ConfigParamID.kConfigParamMaxSHA256Buffers:
        w.writeUint32(val.max_sha256_buffers);
        break;
      case proto.ConfigParamID.kConfigParamMaxCrossInvokeDepth:
        w.writeUint32(val.max_cross_invoke_depth);
        break;
      case proto.ConfigParamID.kConfigParamMaxNewContractsPerTx:
        w.writeUint32(val.max_new_contracts_per_tx);
        break;
    }
  },
  decode(r) {
    const param = Number(r.readInt32());
    switch (param) {
      case proto.ConfigParamID.kConfigParamMaxSHA256Buffers:
        const max_sha256_buffers = r.readUint32();
        return { param, max_sha256_buffers };
      case proto.ConfigParamID.kConfigParamMaxCrossInvokeDepth:
        const max_cross_invoke_depth = r.readUint32();
        return { param, max_cross_invoke_depth };
      case proto.ConfigParamID.kConfigParamMaxNewContractsPerTx:
        const max_new_contracts_per_tx = r.readUint32();
        return { param, max_new_contracts_per_tx };
      default:
        throw new Error(`Unknown ConfigParam discriminant: ${param}`);
    }
  },
};

const _NetworkConfigV0: XdrCodec<NetworkConfigV0> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.ConfigParam, Number(0xFFFFFFFF)).encode(w, val.params);
  },
  decode(r) {
    const params = VarArrayCodec(proto.codec.ConfigParam, Number(0xFFFFFFFF)).decode(r);
    return { params };
  },
};

const _NetworkConfig: XdrCodec<NetworkConfig> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case 0:
        proto.codec.NetworkConfigV0.encode(w, val.v0);
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case 0:
        const v0 = proto.codec.NetworkConfigV0.decode(r);
        return { v, v0 };
      default:
        throw new Error(`Unknown NetworkConfig discriminant: ${v}`);
    }
  },
};

const _ConfigHashPreimage: XdrCodec<ConfigHashPreimage> = {
  encode(w, val) {
    proto.codec.StorageCostModelXdr.encode(w, val.storage_cost_model);
    proto.codec.NetworkConfig.encode(w, val.network_config);
  },
  decode(r) {
    const storage_cost_model = proto.codec.StorageCostModelXdr.decode(r);
    const network_config = proto.codec.NetworkConfig.decode(r);
    return { storage_cost_model, network_config };
  },
};

export const codec = {
  ConfigParamID: _ConfigParamID,
  ConfigParam: _ConfigParam,
  NetworkConfigV0: _NetworkConfigV0,
  NetworkConfig: _NetworkConfig,
  ConfigHashPreimage: _ConfigHashPreimage,
} as const;

