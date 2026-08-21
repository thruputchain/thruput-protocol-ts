// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 58301365769c00d43c91f44a53e2148f54fdfa6a

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type ValidatorID = Uint8Array & { readonly __brand: "ValidatorID" };
export function validatorID(data: Uint8Array): ValidatorID {
  if (data.length !== 32) throw new Error(`ValidatorID must be exactly 32 bytes, got ${data.length}`);
  return data as ValidatorID;
}

export type ValidatorPublicKey = proto.Ed25519PublicKey & { readonly __brand: "ValidatorPublicKey" };
export function validatorPublicKey(val: proto.Ed25519PublicKey): ValidatorPublicKey {
  return val as ValidatorPublicKey;
}

export type ValidatorSecretKey = proto.Ed25519SecretKey & { readonly __brand: "ValidatorSecretKey" };
export function validatorSecretKey(val: proto.Ed25519SecretKey): ValidatorSecretKey {
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

const _ValidatorPublicKey: XdrCodec<ValidatorPublicKey> = {
  encode(w, val) { proto.codec.Ed25519PublicKey.encode(w, val); },
  decode(r) { return validatorPublicKey(proto.codec.Ed25519PublicKey.decode(r)); },
};

const _ValidatorSecretKey: XdrCodec<ValidatorSecretKey> = {
  encode(w, val) { proto.codec.Ed25519SecretKey.encode(w, val); },
  decode(r) { return validatorSecretKey(proto.codec.Ed25519SecretKey.decode(r)); },
};

const _ValidatorPublicInfo: XdrCodec<ValidatorPublicInfo> = {
  encode(w, val) {
    proto.codec.ValidatorPublicKey.encode(w, val.public_key);
    proto.codec.ServerAddress.encode(w, val.address);
  },
  decode(r) {
    const public_key = proto.codec.ValidatorPublicKey.decode(r);
    const address = proto.codec.ServerAddress.decode(r);
    return { public_key, address };
  },
};

const _ValidatorPrivateInfo: XdrCodec<ValidatorPrivateInfo> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.public_info);
    proto.codec.ValidatorSecretKey.encode(w, val.secret_key);
  },
  decode(r) {
    const public_info = proto.codec.ValidatorPublicInfo.decode(r);
    const secret_key = proto.codec.ValidatorSecretKey.decode(r);
    return { public_info, secret_key };
  },
};

export const codec = {
  ValidatorID: _ValidatorID,
  ValidatorPublicKey: _ValidatorPublicKey,
  ValidatorSecretKey: _ValidatorSecretKey,
  ValidatorPublicInfo: _ValidatorPublicInfo,
  ValidatorPrivateInfo: _ValidatorPrivateInfo,
} as const;

