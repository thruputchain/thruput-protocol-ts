// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 2fc45939fb978fe9459bf18e0aa0f80e2880f87b

import { type XdrCodec, withCodecBudget, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



/** XDR: `typedef opaque ValidatorID[32]` — exactly 32 bytes. */
export type ValidatorID = FixedBytes<32> & { readonly __brand: { readonly ValidatorID: true } };
export function validatorID(data: Uint8Array): ValidatorID {
  if (data.length !== 32) throw new Error(`ValidatorID must be exactly 32 bytes, got ${data.length}`);
  return data as ValidatorID;
}

export type ValidatorPublicKey = (NonNullable<proto.PublicKey> & { readonly __brand: { readonly ValidatorPublicKey: true } }) | Extract<proto.PublicKey, null>;
export function validatorPublicKey(val: proto.PublicKey): ValidatorPublicKey {
  return val as ValidatorPublicKey;
}

export type ValidatorSecretKey = (NonNullable<proto.SecretKey> & { readonly __brand: { readonly ValidatorSecretKey: true } }) | Extract<proto.SecretKey, null>;
export function validatorSecretKey(val: proto.SecretKey): ValidatorSecretKey {
  return val as ValidatorSecretKey;
}

export interface ValidatorPublicInfo {
  public_key: proto.ValidatorPublicKey;
  address: proto.ServerAddress;
}

export interface ValidatorPrivateInfo {
  public_info: proto.ValidatorPublicInfo;
  secret_key: proto.ValidatorSecretKey;
}


//
// XDR Codecs below this point
//

const _ValidatorID: XdrCodec<ValidatorID> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return validatorID(r.readFixedOpaque(32)); },
};

const _ValidatorPublicKey: XdrCodec<ValidatorPublicKey> = withCodecBudget(() => proto.codec.PublicKey as XdrCodec<ValidatorPublicKey>);

const _ValidatorSecretKey: XdrCodec<ValidatorSecretKey> = withCodecBudget(() => proto.codec.SecretKey as XdrCodec<ValidatorSecretKey>);

const _ValidatorPublicInfo: XdrCodec<ValidatorPublicInfo> = withCodecBudget<ValidatorPublicInfo>({
  encode(w, val) {
    proto.codec.ValidatorPublicKey.encode(w, val.public_key);
    proto.codec.ServerAddress.encode(w, val.address);
  },
  decode(r) {
    const public_key = proto.codec.ValidatorPublicKey.decode(r);
    const address = proto.codec.ServerAddress.decode(r);
    return { public_key, address };
  },
});

const _ValidatorPrivateInfo: XdrCodec<ValidatorPrivateInfo> = withCodecBudget<ValidatorPrivateInfo>({
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.public_info);
    proto.codec.ValidatorSecretKey.encode(w, val.secret_key);
  },
  decode(r) {
    const public_info = proto.codec.ValidatorPublicInfo.decode(r);
    const secret_key = proto.codec.ValidatorSecretKey.decode(r);
    return { public_info, secret_key };
  },
});

export const codec = {
  ValidatorID: _ValidatorID,
  ValidatorPublicKey: _ValidatorPublicKey,
  ValidatorSecretKey: _ValidatorSecretKey,
  ValidatorPublicInfo: _ValidatorPublicInfo,
  ValidatorPrivateInfo: _ValidatorPrivateInfo,
} as const;

