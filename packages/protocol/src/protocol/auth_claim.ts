// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e671a3694d7312d78364456bb86ee8a18de1502d

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type Weight = bigint & { readonly __brand: { readonly Weight: true } };
export function weight(val: bigint): Weight {
  return val as Weight;
}

export type BitMap = bigint & { readonly __brand: { readonly BitMap: true } };
export function bitMap(val: bigint): BitMap {
  return val as BitMap;
}

export type KeyID = bigint & { readonly __brand: { readonly KeyID: true } };
export function keyID(val: bigint): KeyID {
  return val as KeyID;
}

export const kMaxSigners = 21n;
/**
 * Type-level value of {@link kMaxSigners}, for use in array-bound positions.
 * @hidden
 */
export type kMaxSigners = 21;

export enum AuthClaimType {
  kSourceAddressAuthData = 0,
  kPubkeySignature = 1,
}

export interface PubkeyAccountPreimage {
  pubkey: proto.PublicKey;
  nonce: bigint;
}

export interface AuthClaim_source_address_claim {
  allowed_keys: proto.BitMap;
  required_weight: proto.Weight;
}

export type AuthClaim =
  | { claim_type: proto.AuthClaimType.kSourceAddressAuthData; source_address_claim: proto.AuthClaim_source_address_claim }
  | { claim_type: proto.AuthClaimType.kPubkeySignature; pubkey_preimage: proto.PubkeyAccountPreimage }
;

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

const _AuthClaim_source_address_claim: XdrCodec<AuthClaim_source_address_claim> = {
  encode(w, val) {
    proto.codec.BitMap.encode(w, val.allowed_keys);
    proto.codec.Weight.encode(w, val.required_weight);
  },
  decode(r) {
    const allowed_keys = proto.codec.BitMap.decode(r);
    const required_weight = proto.codec.Weight.decode(r);
    return { allowed_keys, required_weight };
  },
};

const _AuthClaim: XdrCodec<AuthClaim> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.claim_type));
    switch (val.claim_type) {
      case proto.AuthClaimType.kSourceAddressAuthData:
        proto.codec.AuthClaim_source_address_claim.encode(w, val.source_address_claim);
        break;
      case proto.AuthClaimType.kPubkeySignature:
        proto.codec.PubkeyAccountPreimage.encode(w, val.pubkey_preimage);
        break;
    }
  },
  decode(r) {
    const claim_type = Number(r.readInt32());
    switch (claim_type) {
      case proto.AuthClaimType.kSourceAddressAuthData:
        const source_address_claim = proto.codec.AuthClaim_source_address_claim.decode(r);
        return { claim_type, source_address_claim };
      case proto.AuthClaimType.kPubkeySignature:
        const pubkey_preimage = proto.codec.PubkeyAccountPreimage.decode(r);
        return { claim_type, pubkey_preimage };
      default:
        throw new Error(`Unknown AuthClaim discriminant: ${claim_type}`);
    }
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
  AuthClaim_source_address_claim: _AuthClaim_source_address_claim,
  AuthClaim: _AuthClaim,
  AuthVerifyErrorCode: _AuthVerifyErrorCode,
} as const;

