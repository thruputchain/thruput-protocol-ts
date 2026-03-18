// -*- TypeScript -*-
// Generated from auth_claim.x — DO NOT EDIT
import { type XdrCodec, type IWriter, type IReader } from "../xdr/codec.js";
import * as proto from "./index.js";

// ============================================================================
// Branded bigint types
// ============================================================================

export type Weight = bigint & { readonly __brand: "Weight" };
export function weight(val: bigint): Weight { return val as Weight; }

export type BitMap = bigint & { readonly __brand: "BitMap" };
export function bitMap(val: bigint): BitMap { return val as BitMap; }

export type KeyID = bigint & { readonly __brand: "KeyID" };
export function keyID(val: bigint): KeyID { return val as KeyID; }

// ============================================================================
// Constants
// ============================================================================

export const kMaxSigners = 21n;
export const kMaxGasConfigs = 5n;
export const kMaxAuthClaims = 10n;

// ============================================================================
// Enums
// ============================================================================

export enum AuthClaimType {
  kInvokedAddressSignature = 0,
  kInvokedAddressSignedWeight = 1,
  kOtherAddressSignature = 2,
  kOtherAddressSignedWeight = 3,
  kPubkeySignature = 4,
}

export enum AuthVerifyErrorCode {
  kAuthMalformed = 1,
  kSignatureVerificationFailed = 2,
  kAuthDataMismatch = 3,
}

// ============================================================================
// Structs (including anonymous structs extracted from union arms)
// ============================================================================

export interface PubkeyAccountPreimage {
  pubkey: proto.PublicKey;
  nonce: bigint;
}

export interface AuthClaim_InvokedAddressSignedWeight {
  accepted_keys: proto.BitMap;
  required_weight: proto.Weight;
}

export interface AuthClaim_OtherAddressSignature {
  address: proto.ContractAddress;
  key_id: proto.KeyID;
}

export interface AuthClaim_OtherAddressSignedWeight {
  address: proto.ContractAddress;
  accepted_keys: proto.BitMap;
  required_weight: proto.Weight;
}

// ============================================================================
// Unions
// ============================================================================

export type AuthClaim =
  | { claim_type: proto.AuthClaimType.kInvokedAddressSignature; invoked_address_signature_id: proto.KeyID }
  | { claim_type: proto.AuthClaimType.kInvokedAddressSignedWeight; invoked_address_signed_weight: proto.AuthClaim_InvokedAddressSignedWeight }
  | { claim_type: proto.AuthClaimType.kOtherAddressSignature; other_address_signature_id: proto.AuthClaim_OtherAddressSignature }
  | { claim_type: proto.AuthClaimType.kOtherAddressSignedWeight; other_address_signed_weight: proto.AuthClaim_OtherAddressSignedWeight }
  | { claim_type: proto.AuthClaimType.kPubkeySignature; pubkey_preimage: proto.PubkeyAccountPreimage }
;

// ============================================================================
// Typedefs
// ============================================================================

export type AuthClaimData = proto.AuthClaim[];

// ============================================================================
// XDR Codecs
// ============================================================================

export const PubkeyAccountPreimage: XdrCodec<proto.PubkeyAccountPreimage> = {
  encode(w: IWriter, val: proto.PubkeyAccountPreimage) {
    proto.PublicKey.encode(w, val.pubkey);
    w.writeUint64(val.nonce);
  },
  decode(r: IReader) {
    return { pubkey: proto.PublicKey.decode(r), nonce: r.readUint64() };
  },
};

export const AuthClaim: XdrCodec<proto.AuthClaim> = {
  encode(w: IWriter, val: proto.AuthClaim) {
    w.writeInt32(BigInt(val.claim_type));
    switch (val.claim_type) {
      case proto.AuthClaimType.kInvokedAddressSignature:
        w.writeUint32(val.invoked_address_signature_id);
        break;
      case proto.AuthClaimType.kInvokedAddressSignedWeight:
        w.writeUint32(val.invoked_address_signed_weight.accepted_keys);
        w.writeUint32(val.invoked_address_signed_weight.required_weight);
        break;
      case proto.AuthClaimType.kOtherAddressSignature:
        proto.ContractAddress.encode(w, val.other_address_signature_id.address);
        w.writeUint32(val.other_address_signature_id.key_id);
        break;
      case proto.AuthClaimType.kOtherAddressSignedWeight:
        proto.ContractAddress.encode(w, val.other_address_signed_weight.address);
        w.writeUint32(val.other_address_signed_weight.accepted_keys);
        w.writeUint32(val.other_address_signed_weight.required_weight);
        break;
      case proto.AuthClaimType.kPubkeySignature:
        proto.PubkeyAccountPreimage.encode(w, val.pubkey_preimage);
        break;
    }
  },
  decode(r: IReader) {
    const claim_type = Number(r.readInt32());
    switch (claim_type) {
      case proto.AuthClaimType.kInvokedAddressSignature:
        return { claim_type, invoked_address_signature_id: proto.keyID(r.readUint32()) };
      case proto.AuthClaimType.kInvokedAddressSignedWeight:
        return {
          claim_type,
          invoked_address_signed_weight: {
            accepted_keys: proto.bitMap(r.readUint32()),
            required_weight: proto.weight(r.readUint32()),
          },
        };
      case proto.AuthClaimType.kOtherAddressSignature:
        return {
          claim_type,
          other_address_signature_id: {
            address: proto.ContractAddress.decode(r),
            key_id: proto.keyID(r.readUint32()),
          },
        };
      case proto.AuthClaimType.kOtherAddressSignedWeight:
        return {
          claim_type,
          other_address_signed_weight: {
            address: proto.ContractAddress.decode(r),
            accepted_keys: proto.bitMap(r.readUint32()),
            required_weight: proto.weight(r.readUint32()),
          },
        };
      case proto.AuthClaimType.kPubkeySignature:
        return { claim_type, pubkey_preimage: proto.PubkeyAccountPreimage.decode(r) };
      default:
        throw new Error(`Unknown AuthClaimType: ${claim_type}`);
    }
  },
};

export const AuthClaimData: XdrCodec<proto.AuthClaimData> = {
  encode(w: IWriter, val: proto.AuthClaimData) {
    if (val.length > Number(proto.kMaxAuthClaims)) throw new Error(`AuthClaimData length ${val.length} exceeds max ${proto.kMaxAuthClaims}`);
    w.writeUint32(BigInt(val.length));
    for (const item of val) proto.AuthClaim.encode(w, item);
  },
  decode(r: IReader) {
    const len = Number(r.readUint32());
    if (len > Number(proto.kMaxAuthClaims)) throw new Error(`AuthClaimData length ${len} exceeds max ${proto.kMaxAuthClaims}`);
    const result: proto.AuthClaimData = [];
    for (let i = 0; i < len; i++) result.push(proto.AuthClaim.decode(r));
    return result;
  },
};
