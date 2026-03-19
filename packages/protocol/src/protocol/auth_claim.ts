// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 3f9085a9d256ce71dd85566a4608e897076b5424

import type { XdrCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export type Weight = bigint & { readonly __brand: "Weight" };
export function weight(val: bigint): Weight {
  return val as Weight;
}

export type BitMap = bigint & { readonly __brand: "BitMap" };
export function bitMap(val: bigint): BitMap {
  return val as BitMap;
}

export type KeyID = bigint & { readonly __brand: "KeyID" };
export function keyID(val: bigint): KeyID {
  return val as KeyID;
}

export const kMaxSigners = 21n;

export const kMaxGasConfigs = 5n;

export const kMaxAuthClaims = 10n;

export enum AuthClaimType {
  kInvokedAddressSignature = 0,
  kInvokedAddressSignedWeight = 1,
  kOtherAddressSignature = 2,
  kOtherAddressSignedWeight = 3,
  kPubkeySignature = 4,
}

export interface PubkeyAccountPreimage {
  pubkey: proto.PublicKey;
  nonce: bigint;
}

export interface AuthClaim_invoked_address_signed_weight {
  accepted_keys: proto.BitMap;
  required_weight: proto.Weight;
}

export interface AuthClaim_other_address_signature_id {
  address: proto.ContractAddress;
  key_id: proto.KeyID;
}

export interface AuthClaim_other_address_signed_weight {
  address: proto.ContractAddress;
  accepted_keys: proto.BitMap;
  required_weight: proto.Weight;
}

export type AuthClaim =
  | { claim_type: proto.AuthClaimType.kInvokedAddressSignature; invoked_address_signature_id: proto.KeyID }
  | { claim_type: proto.AuthClaimType.kInvokedAddressSignedWeight; invoked_address_signed_weight: proto.AuthClaim_invoked_address_signed_weight }
  | { claim_type: proto.AuthClaimType.kOtherAddressSignature; other_address_signature_id: proto.AuthClaim_other_address_signature_id }
  | { claim_type: proto.AuthClaimType.kOtherAddressSignedWeight; other_address_signed_weight: proto.AuthClaim_other_address_signed_weight }
  | { claim_type: proto.AuthClaimType.kPubkeySignature; pubkey_preimage: proto.PubkeyAccountPreimage }
;

export type AuthClaimData = proto.AuthClaim[] & { readonly __brand: "AuthClaimData" };
export function authClaimData(val: proto.AuthClaim[]): AuthClaimData {
  return val as AuthClaimData;
}

export enum AuthVerifyErrorCode {
  kAuthMalformed = 1,
  kSignatureVerificationFailed = 2,
  kAuthDataMismatch = 3,
}


//
// XDR Codecs below this point
//

const _Weight: XdrCodec<Weight> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return weight(r.readUint32()); },
};

const _BitMap: XdrCodec<BitMap> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return bitMap(r.readUint32()); },
};

const _KeyID: XdrCodec<KeyID> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return keyID(r.readUint32()); },
};

const _AuthClaimType: XdrCodec<AuthClaimType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as AuthClaimType; },
};

const _PubkeyAccountPreimage: XdrCodec<PubkeyAccountPreimage> = {
  encode(w, val) {
    proto.codec.PublicKey.encode(w, val.pubkey);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    const pubkey = proto.codec.PublicKey.decode(r);
    const nonce = r.readUint64();
    return { pubkey, nonce };
  },
};

const _AuthClaim_invoked_address_signed_weight: XdrCodec<AuthClaim_invoked_address_signed_weight> = {
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

const _AuthClaim_other_address_signature_id: XdrCodec<AuthClaim_other_address_signature_id> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    proto.codec.KeyID.encode(w, val.key_id);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const key_id = proto.codec.KeyID.decode(r);
    return { address, key_id };
  },
};

const _AuthClaim_other_address_signed_weight: XdrCodec<AuthClaim_other_address_signed_weight> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    proto.codec.BitMap.encode(w, val.accepted_keys);
    proto.codec.Weight.encode(w, val.required_weight);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const accepted_keys = proto.codec.BitMap.decode(r);
    const required_weight = proto.codec.Weight.decode(r);
    return { address, accepted_keys, required_weight };
  },
};

const _AuthClaim: XdrCodec<AuthClaim> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.claim_type));
    switch (val.claim_type) {
      case proto.AuthClaimType.kInvokedAddressSignature:
        proto.codec.KeyID.encode(w, val.invoked_address_signature_id);
        break;
      case proto.AuthClaimType.kInvokedAddressSignedWeight:
        proto.codec.AuthClaim_invoked_address_signed_weight.encode(w, val.invoked_address_signed_weight);
        break;
      case proto.AuthClaimType.kOtherAddressSignature:
        proto.codec.AuthClaim_other_address_signature_id.encode(w, val.other_address_signature_id);
        break;
      case proto.AuthClaimType.kOtherAddressSignedWeight:
        proto.codec.AuthClaim_other_address_signed_weight.encode(w, val.other_address_signed_weight);
        break;
      case proto.AuthClaimType.kPubkeySignature:
        proto.codec.PubkeyAccountPreimage.encode(w, val.pubkey_preimage);
        break;
    }
  },
  decode(r) {
    const claim_type = Number(r.readInt32());
    switch (claim_type) {
      case proto.AuthClaimType.kInvokedAddressSignature:
        const invoked_address_signature_id = proto.codec.KeyID.decode(r);
        return { claim_type, invoked_address_signature_id };
      case proto.AuthClaimType.kInvokedAddressSignedWeight:
        const invoked_address_signed_weight = proto.codec.AuthClaim_invoked_address_signed_weight.decode(r);
        return { claim_type, invoked_address_signed_weight };
      case proto.AuthClaimType.kOtherAddressSignature:
        const other_address_signature_id = proto.codec.AuthClaim_other_address_signature_id.decode(r);
        return { claim_type, other_address_signature_id };
      case proto.AuthClaimType.kOtherAddressSignedWeight:
        const other_address_signed_weight = proto.codec.AuthClaim_other_address_signed_weight.decode(r);
        return { claim_type, other_address_signed_weight };
      case proto.AuthClaimType.kPubkeySignature:
        const pubkey_preimage = proto.codec.PubkeyAccountPreimage.decode(r);
        return { claim_type, pubkey_preimage };
      default:
        throw new Error(`Unknown AuthClaim discriminant: ${claim_type}`);
    }
  },
};

const _AuthClaimData: XdrCodec<AuthClaimData> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.AuthClaim.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return authClaimData(Array.from({ length: _len }, () => proto.codec.AuthClaim.decode(r)));
  },
};

const _AuthVerifyErrorCode: XdrCodec<AuthVerifyErrorCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as AuthVerifyErrorCode; },
};

export const codec = {
  Weight: _Weight,
  BitMap: _BitMap,
  KeyID: _KeyID,
  AuthClaimType: _AuthClaimType,
  PubkeyAccountPreimage: _PubkeyAccountPreimage,
  AuthClaim_invoked_address_signed_weight: _AuthClaim_invoked_address_signed_weight,
  AuthClaim_other_address_signature_id: _AuthClaim_other_address_signature_id,
  AuthClaim_other_address_signed_weight: _AuthClaim_other_address_signed_weight,
  AuthClaim: _AuthClaim,
  AuthClaimData: _AuthClaimData,
  AuthVerifyErrorCode: _AuthVerifyErrorCode,
} as const;

