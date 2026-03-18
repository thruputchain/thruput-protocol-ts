// types.ts — Hand-written TypeScript from types.x
// This file serves as the reference for future gen_ts.cc codegen output.

// ============================================================================
// Branded bigint types
// ============================================================================

export type TimePoint = bigint & { readonly __brand: "TimePoint" };
export function timePoint(val: bigint): TimePoint {
  return val as TimePoint;
}

export type RuntimeMemoryLength = bigint & { readonly __brand: "RuntimeMemoryLength" };
export function runtimeMemoryLength(val: bigint): RuntimeMemoryLength {
  return val as RuntimeMemoryLength;
}

export type GasAmount = bigint & { readonly __brand: "GasAmount" };
export function gasAmount(val: bigint): GasAmount {
  return val as GasAmount;
}

export type BlockHeight = bigint & { readonly __brand: "BlockHeight" };
export function blockHeight(val: bigint): BlockHeight {
  return val as BlockHeight;
}

// ============================================================================
// Branded Uint8Array types (fixed-size opaque newtypes)
// ============================================================================

export type Ed25519Signature = Uint8Array & { readonly __brand: "Ed25519Signature" };
export function ed25519Signature(data: Uint8Array): Ed25519Signature {
  if (data.length !== 64) throw new Error(`Ed25519Signature must be exactly 64 bytes, got ${data.length}`);
  return data as Ed25519Signature;
}

export type Ed25519PublicKey = Uint8Array & { readonly __brand: "Ed25519PublicKey" };
export function ed25519PublicKey(data: Uint8Array): Ed25519PublicKey {
  if (data.length !== 32) throw new Error(`Ed25519PublicKey must be exactly 32 bytes, got ${data.length}`);
  return data as Ed25519PublicKey;
}

export type Ed25519SecretKey = Uint8Array & { readonly __brand: "Ed25519SecretKey" };
export function ed25519SecretKey(data: Uint8Array): Ed25519SecretKey {
  if (data.length !== 64) throw new Error(`Ed25519SecretKey must be exactly 64 bytes, got ${data.length}`);
  return data as Ed25519SecretKey;
}

export type SHA256Hash = Uint8Array & { readonly __brand: "SHA256Hash" };
export function sha256Hash(data: Uint8Array): SHA256Hash {
  if (data.length !== 32) throw new Error(`SHA256Hash must be exactly 32 bytes, got ${data.length}`);
  return data as SHA256Hash;
}

export type DbHash = Uint8Array & { readonly __brand: "DbHash" };
export function dbHash(data: Uint8Array): DbHash {
  if (data.length !== 2048) throw new Error(`DbHash must be exactly 2048 bytes, got ${data.length}`);
  return data as DbHash;
}

export type BlockHash = SHA256Hash & { readonly __brand: "BlockHash" };
export function blockHash(data: Uint8Array): BlockHash {
  if (data.length !== 32) throw new Error(`BlockHash must be exactly 32 bytes, got ${data.length}`);
  return data as BlockHash;
}

export type ContractAddress = Uint8Array & { readonly __brand: "ContractAddress" };
export function contractAddress(data: Uint8Array): ContractAddress {
  if (data.length !== 32) throw new Error(`ContractAddress must be exactly 32 bytes, got ${data.length}`);
  return data as ContractAddress;
}

export type StorageKeyContractData = Uint8Array & { readonly __brand: "StorageKeyContractData" };
export function storageKeyContractData(data: Uint8Array): StorageKeyContractData {
  if (data.length !== 32) throw new Error(`StorageKeyContractData must be exactly 32 bytes, got ${data.length}`);
  return data as StorageKeyContractData;
}

// ============================================================================
// Enums
// ============================================================================

export enum CryptographicScheme {
  Ed25519 = 0,
}

export enum StorageKeyType {
  kStorageKeyTypeContractData = 0,
  kStorageKeyTypeFreeNativeTokenBalance = 1,
  kStorageKeyTypeAddressAuthData = 2,
  kStorageKeyTypeAddressMetadata = 3,
  kStorageKeyTypeReplayCache = 4,
}

// ============================================================================
// Unions
// ============================================================================

export type Signature = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519Signature;
};

export type PublicKey = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519PublicKey;
};

export type SecretKey = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519SecretKey;
};

export type ExtensionPoint = { v: 0 };

export type StorageKey =
  | { key_type: StorageKeyType.kStorageKeyTypeContractData; contract_data_key: StorageKeyContractData }
  | { key_type: StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressAuthData }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressMetadata }
  | { key_type: StorageKeyType.kStorageKeyTypeReplayCache };

// ============================================================================
// Structs
// ============================================================================

export interface AddressAndKey {
  address: ContractAddress;
  key: StorageKey;
}

// ============================================================================
// Constants
// ============================================================================

export const kTotalHogSupply = 62_500_000_000n;
export const kHogDivisibility = 10_000_000n;
