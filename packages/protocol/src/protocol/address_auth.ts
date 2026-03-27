// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export interface PublicKeyConfig {
  key: proto.PublicKey;
  max_weight: proto.Weight;
}

export type PublicKeyConfigOpt = (proto.PublicKeyConfig | null) & { readonly __brand: "PublicKeyConfigOpt" };
export function publicKeyConfigOpt(val: proto.PublicKeyConfig | null): PublicKeyConfigOpt {
  return val as PublicKeyConfigOpt;
}

export interface GasPermissionConfig {
  limit: proto.GasAmount;
  accepted_keys: proto.BitMap;
  required_weight: proto.Weight;
}

export interface NonceConfig {
  accepted_keys: proto.BitMap;
  required_weight: proto.Weight;
}

export const kDefaultNewAddressRequiredWeight = 1n;

export const kDefaultNewAddressAcceptedKeys = 0xFFFFFFFFn;

export const kDefaultNewAddressKeyID = 0n;

export interface AddressAuthData {
  public_keys: proto.PublicKeyConfigOpt[];
  gas_permissions: proto.GasPermissionConfig[];
  nonce_config: proto.NonceConfig;
  last_written_height: proto.BlockHeight;
}


//
// XDR Codecs below this point
//

const _PublicKeyConfig: XdrCodec<PublicKeyConfig> = {
  encode(w, val) {
    proto.codec.PublicKey.encode(w, val.key);
    proto.codec.Weight.encode(w, val.max_weight);
  },
  decode(r) {
    const key = proto.codec.PublicKey.decode(r);
    const max_weight = proto.codec.Weight.decode(r);
    return { key, max_weight };
  },
};

const _PublicKeyConfigOpt = OptionCodec(() => proto.codec.PublicKeyConfig) as XdrCodec<PublicKeyConfigOpt>;

const _GasPermissionConfig: XdrCodec<GasPermissionConfig> = {
  encode(w, val) {
    proto.codec.GasAmount.encode(w, val.limit);
    proto.codec.BitMap.encode(w, val.accepted_keys);
    proto.codec.Weight.encode(w, val.required_weight);
  },
  decode(r) {
    const limit = proto.codec.GasAmount.decode(r);
    const accepted_keys = proto.codec.BitMap.decode(r);
    const required_weight = proto.codec.Weight.decode(r);
    return { limit, accepted_keys, required_weight };
  },
};

const _NonceConfig: XdrCodec<NonceConfig> = {
  encode(w, val) {
    proto.codec.BitMap.encode(w, val.accepted_keys);
    proto.codec.Weight.encode(w, val.required_weight);
  },
  decode(r) {
    const accepted_keys = proto.codec.BitMap.decode(r);
    const required_weight = proto.codec.Weight.decode(r);
    return { accepted_keys, required_weight };
  },
};

const _AddressAuthData: XdrCodec<AddressAuthData> = {
  encode(w, val) {
    FixedArrayCodec(proto.codec.PublicKeyConfigOpt, Number(proto.kMaxSigners)).encode(w, val.public_keys);
    VarArrayCodec(proto.codec.GasPermissionConfig, Number(proto.kMaxGasConfigs)).encode(w, val.gas_permissions);
    proto.codec.NonceConfig.encode(w, val.nonce_config);
    proto.codec.BlockHeight.encode(w, val.last_written_height);
  },
  decode(r) {
    const public_keys = FixedArrayCodec(proto.codec.PublicKeyConfigOpt, Number(proto.kMaxSigners)).decode(r);
    const gas_permissions = VarArrayCodec(proto.codec.GasPermissionConfig, Number(proto.kMaxGasConfigs)).decode(r);
    const nonce_config = proto.codec.NonceConfig.decode(r);
    const last_written_height = proto.codec.BlockHeight.decode(r);
    return { public_keys, gas_permissions, nonce_config, last_written_height };
  },
};

export const codec = {
  PublicKeyConfig: _PublicKeyConfig,
  PublicKeyConfigOpt: _PublicKeyConfigOpt,
  GasPermissionConfig: _GasPermissionConfig,
  NonceConfig: _NonceConfig,
  AddressAuthData: _AddressAuthData,
} as const;

