// -*- TypeScript -*-
// Generated from types.x — DO NOT EDIT
import { type XdrCodec, type IWriter, type IReader } from "../xdr/codec.js";
import * as proto from "./index.js";

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

export type Signature =
  | { scheme: proto.CryptographicScheme.Ed25519; ed25519: proto.Ed25519Signature }
;

export type PublicKey =
  | { scheme: proto.CryptographicScheme.Ed25519; ed25519: proto.Ed25519PublicKey }
;

export type SecretKey =
  | { scheme: proto.CryptographicScheme.Ed25519; ed25519: proto.Ed25519SecretKey }
;

export type ExtensionPoint =
  | { v: 0 }
;

export type StorageKey =
  | { key_type: proto.StorageKeyType.kStorageKeyTypeContractData; contract_data_key: proto.StorageKeyContractData }
  | { key_type: proto.StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance }
  | { key_type: proto.StorageKeyType.kStorageKeyTypeAddressAuthData }
  | { key_type: proto.StorageKeyType.kStorageKeyTypeAddressMetadata }
  | { key_type: proto.StorageKeyType.kStorageKeyTypeReplayCache }
;

// ============================================================================
// Structs
// ============================================================================

export interface AddressAndKey {
  address: proto.ContractAddress;
  key: proto.StorageKey;
}

// ============================================================================
// Constants
// ============================================================================

export const kTotalHogSupply = 62_500_000_000n;
export const kHogDivisibility = 10_000_000n;

// ============================================================================
// XDR Codecs
// ============================================================================

export const TimePoint: XdrCodec<proto.TimePoint> = {
  encode(w: IWriter, val: proto.TimePoint) { w.writeUint64(val); },
  decode(r: IReader) { return proto.timePoint(r.readUint64()); },
};

export const RuntimeMemoryLength: XdrCodec<proto.RuntimeMemoryLength> = {
  encode(w: IWriter, val: proto.RuntimeMemoryLength) { w.writeUint32(val); },
  decode(r: IReader) { return proto.runtimeMemoryLength(r.readUint32()); },
};

export const GasAmount: XdrCodec<proto.GasAmount> = {
  encode(w: IWriter, val: proto.GasAmount) { w.writeUint64(val); },
  decode(r: IReader) { return proto.gasAmount(r.readUint64()); },
};

export const BlockHeight: XdrCodec<proto.BlockHeight> = {
  encode(w: IWriter, val: proto.BlockHeight) { w.writeInt64(val); },
  decode(r: IReader) { return proto.blockHeight(r.readInt64()); },
};

export const Ed25519Signature: XdrCodec<proto.Ed25519Signature> = {
  encode(w: IWriter, val: proto.Ed25519Signature) { w.writeFixedOpaque(val, 64); },
  decode(r: IReader) { return proto.ed25519Signature(r.readFixedOpaque(64)); },
};

export const Ed25519PublicKey: XdrCodec<proto.Ed25519PublicKey> = {
  encode(w: IWriter, val: proto.Ed25519PublicKey) { w.writeFixedOpaque(val, 32); },
  decode(r: IReader) { return proto.ed25519PublicKey(r.readFixedOpaque(32)); },
};

export const Ed25519SecretKey: XdrCodec<proto.Ed25519SecretKey> = {
  encode(w: IWriter, val: proto.Ed25519SecretKey) { w.writeFixedOpaque(val, 64); },
  decode(r: IReader) { return proto.ed25519SecretKey(r.readFixedOpaque(64)); },
};

export const SHA256Hash: XdrCodec<proto.SHA256Hash> = {
  encode(w: IWriter, val: proto.SHA256Hash) { w.writeFixedOpaque(val, 32); },
  decode(r: IReader) { return proto.sha256Hash(r.readFixedOpaque(32)); },
};

export const DbHash: XdrCodec<proto.DbHash> = {
  encode(w: IWriter, val: proto.DbHash) { w.writeFixedOpaque(val, 2048); },
  decode(r: IReader) { return proto.dbHash(r.readFixedOpaque(2048)); },
};

export const BlockHash: XdrCodec<proto.BlockHash> = {
  encode(w: IWriter, val: proto.BlockHash) { w.writeFixedOpaque(val, 32); },
  decode(r: IReader) { return proto.blockHash(r.readFixedOpaque(32)); },
};

export const ContractAddress: XdrCodec<proto.ContractAddress> = {
  encode(w: IWriter, val: proto.ContractAddress) { w.writeFixedOpaque(val, 32); },
  decode(r: IReader) { return proto.contractAddress(r.readFixedOpaque(32)); },
};

export const StorageKeyContractData: XdrCodec<proto.StorageKeyContractData> = {
  encode(w: IWriter, val: proto.StorageKeyContractData) { w.writeFixedOpaque(val, 32); },
  decode(r: IReader) { return proto.storageKeyContractData(r.readFixedOpaque(32)); },
};

export const Signature: XdrCodec<proto.Signature> = {
  encode(w: IWriter, val: proto.Signature) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case proto.CryptographicScheme.Ed25519:
        proto.Ed25519Signature.encode(w, val.ed25519);
        break;
    }
  },
  decode(r: IReader) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case proto.CryptographicScheme.Ed25519:
        return { scheme, ed25519: proto.Ed25519Signature.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const PublicKey: XdrCodec<proto.PublicKey> = {
  encode(w: IWriter, val: proto.PublicKey) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case proto.CryptographicScheme.Ed25519:
        proto.Ed25519PublicKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r: IReader) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case proto.CryptographicScheme.Ed25519:
        return { scheme, ed25519: proto.Ed25519PublicKey.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const SecretKey: XdrCodec<proto.SecretKey> = {
  encode(w: IWriter, val: proto.SecretKey) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case proto.CryptographicScheme.Ed25519:
        proto.Ed25519SecretKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r: IReader) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case proto.CryptographicScheme.Ed25519:
        return { scheme, ed25519: proto.Ed25519SecretKey.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const ExtensionPoint: XdrCodec<proto.ExtensionPoint> = {
  encode(w: IWriter, val: proto.ExtensionPoint) {
    w.writeInt32(BigInt(val.v));
  },
  decode(r: IReader) {
    const v = Number(r.readInt32());
    switch (v) {
      case 0:
        return { v } as proto.ExtensionPoint;
      default:
        throw new Error(`Unknown ExtensionPoint discriminant: ${v}`);
    }
  },
};

export const StorageKey: XdrCodec<proto.StorageKey> = {
  encode(w: IWriter, val: proto.StorageKey) {
    w.writeInt32(BigInt(val.key_type));
    switch (val.key_type) {
      case proto.StorageKeyType.kStorageKeyTypeContractData:
        proto.StorageKeyContractData.encode(w, val.contract_data_key);
        break;
      case proto.StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance:
        break;
      case proto.StorageKeyType.kStorageKeyTypeAddressAuthData:
        break;
      case proto.StorageKeyType.kStorageKeyTypeAddressMetadata:
        break;
      case proto.StorageKeyType.kStorageKeyTypeReplayCache:
        break;
    }
  },
  decode(r: IReader) {
    const key_type = Number(r.readInt32());
    switch (key_type) {
      case proto.StorageKeyType.kStorageKeyTypeContractData:
        return { key_type, contract_data_key: proto.StorageKeyContractData.decode(r) };
      case proto.StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance:
        return { key_type } as proto.StorageKey;
      case proto.StorageKeyType.kStorageKeyTypeAddressAuthData:
        return { key_type } as proto.StorageKey;
      case proto.StorageKeyType.kStorageKeyTypeAddressMetadata:
        return { key_type } as proto.StorageKey;
      case proto.StorageKeyType.kStorageKeyTypeReplayCache:
        return { key_type } as proto.StorageKey;
      default:
        throw new Error(`Unknown StorageKeyType: ${key_type}`);
    }
  },
};

export const AddressAndKey: XdrCodec<proto.AddressAndKey> = {
  encode(w: IWriter, val: proto.AddressAndKey) {
    proto.ContractAddress.encode(w, val.address);
    proto.StorageKey.encode(w, val.key);
  },
  decode(r: IReader) {
    return {
      address: proto.ContractAddress.decode(r),
      key: proto.StorageKey.decode(r),
    };
  },
};
