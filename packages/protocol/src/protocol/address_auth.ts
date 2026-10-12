// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 4eba524354bda9d7db1efa2845da43ce40dd1ab9

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export interface PublicKeyConfig {
  key: proto.PublicKey;
  max_weight: proto.Weight;
}

export type PublicKeyConfigOpt = (proto.PublicKeyConfig & { readonly __brand: { readonly PublicKeyConfigOpt: true } }) | null;
export function publicKeyConfigOpt(val: proto.PublicKeyConfig | null): PublicKeyConfigOpt {
  return val as PublicKeyConfigOpt;
}

export const kDefaultNewAddressRequiredWeight = 1n;
/**
 * Type-level value of {@link kDefaultNewAddressRequiredWeight}, for use in array-bound positions.
 * @hidden
 */
export type kDefaultNewAddressRequiredWeight = 1;

export const kDefaultNewAddressAcceptedKeys = 0xFFFFFFFFn;
/**
 * Type-level value of {@link kDefaultNewAddressAcceptedKeys}, for use in array-bound positions.
 * @hidden
 */
export type kDefaultNewAddressAcceptedKeys = 0xFFFFFFFF;

export const kDefaultNewAddressKeyID = 0n;
/**
 * Type-level value of {@link kDefaultNewAddressKeyID}, for use in array-bound positions.
 * @hidden
 */
export type kDefaultNewAddressKeyID = 0;

export interface AddressAuthData {
  /** XDR: `PublicKeyConfigOpt public_keys[kMaxSigners]` — exactly {@link kMaxSigners} elements. */
  public_keys: FixedArray<proto.PublicKeyConfigOpt, proto.kMaxSigners>;
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
    const public_keys = FixedArrayCodec(proto.codec.PublicKeyConfigOpt, Number(proto.kMaxSigners)).decode(r) as FixedArray<proto.PublicKeyConfigOpt, proto.kMaxSigners>;
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

