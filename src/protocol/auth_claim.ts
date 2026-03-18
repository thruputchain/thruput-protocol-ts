// auth_claim.ts — from auth_claim.x

import type { ContractAddress, PublicKey } from "./types.js";

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
  pubkey: PublicKey;
  nonce: bigint;
}

export interface AuthClaim_InvokedAddressSignedWeight {
  accepted_keys: BitMap;
  required_weight: Weight;
}

export interface AuthClaim_OtherAddressSignature {
  address: ContractAddress;
  key_id: KeyID;
}

export interface AuthClaim_OtherAddressSignedWeight {
  address: ContractAddress;
  accepted_keys: BitMap;
  required_weight: Weight;
}

// ============================================================================
// Unions
// ============================================================================

export type AuthClaim =
  | { claim_type: AuthClaimType.kInvokedAddressSignature; invoked_address_signature_id: KeyID }
  | { claim_type: AuthClaimType.kInvokedAddressSignedWeight; invoked_address_signed_weight: AuthClaim_InvokedAddressSignedWeight }
  | { claim_type: AuthClaimType.kOtherAddressSignature; other_address_signature_id: AuthClaim_OtherAddressSignature }
  | { claim_type: AuthClaimType.kOtherAddressSignedWeight; other_address_signed_weight: AuthClaim_OtherAddressSignedWeight }
  | { claim_type: AuthClaimType.kPubkeySignature; pubkey_preimage: PubkeyAccountPreimage };

// ============================================================================
// Typedefs
// ============================================================================

export type AuthClaimData = AuthClaim[];
