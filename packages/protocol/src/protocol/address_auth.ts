// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: a238ec3f5700fe0c9d304af7119641d21be8cc63

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface PublicKeyConfig {
  key: proto.PublicKey;
  max_weight: proto.Weight;
}

export type PublicKeyConfigOpt = (proto.PublicKeyConfig | null) & { readonly __brand: "PublicKeyConfigOpt" };
export function publicKeyConfigOpt(val: proto.PublicKeyConfig | null): PublicKeyConfigOpt {
  return val as PublicKeyConfigOpt;
}

export const kDefaultNewAddressRequiredWeight = 1n;

export const kDefaultNewAddressAcceptedKeys = 0xFFFFFFFFn;

export const kDefaultNewAddressKeyID = 0n;

export interface AddressAuthData {
  public_keys: proto.PublicKeyConfigOpt[];
  required_weight: proto.Weight;
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

const _PublicKeyConfigOpt = OptionCodec(() => _PublicKeyConfig) as XdrCodec<PublicKeyConfigOpt>;

const _AddressAuthData: XdrCodec<AddressAuthData> = {
  encode(w, val) {
    FixedArrayCodec(proto.codec.PublicKeyConfigOpt, Number(proto.kMaxSigners)).encode(w, val.public_keys);
    proto.codec.Weight.encode(w, val.required_weight);
    proto.codec.BlockHeight.encode(w, val.last_written_height);
  },
  decode(r) {
    const public_keys = FixedArrayCodec(proto.codec.PublicKeyConfigOpt, Number(proto.kMaxSigners)).decode(r);
    const required_weight = proto.codec.Weight.decode(r);
    const last_written_height = proto.codec.BlockHeight.decode(r);
    return { public_keys, required_weight, last_written_height };
  },
};

export const codec = {
  PublicKeyConfig: _PublicKeyConfig,
  PublicKeyConfigOpt: _PublicKeyConfigOpt,
  AddressAuthData: _AddressAuthData,
} as const;

