// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 3f9085a9d256ce71dd85566a4608e897076b5424

import type { XdrCodec } from "./xdr_codec.js";


export interface uint128_xdr {
  highbits: bigint;
  lowbits: bigint;
}

export interface int128_xdr {
  highbits: bigint;
  lowbits: bigint;
}

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

export enum CryptographicScheme {
  Ed25519 = 0,
}

export type Signature =
  | { scheme: CryptographicScheme.Ed25519; ed25519: Ed25519Signature }
;

export type PublicKey =
  | { scheme: CryptographicScheme.Ed25519; ed25519: Ed25519PublicKey }
;

export type SecretKey =
  | { scheme: CryptographicScheme.Ed25519; ed25519: Ed25519SecretKey }
;

export type ExtensionPoint =
  | { v: 0 }
;

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

export type BlockHash = SHA256Hash;

export type ContractAddress = Uint8Array & { readonly __brand: "ContractAddress" };
export function contractAddress(data: Uint8Array): ContractAddress {
  if (data.length !== 32) throw new Error(`ContractAddress must be exactly 32 bytes, got ${data.length}`);
  return data as ContractAddress;
}

export enum StorageKeyType {
  kStorageKeyTypeContractData = 0,
  kStorageKeyTypeFreeNativeTokenBalance = 1,
  kStorageKeyTypeAddressAuthData = 2,
  kStorageKeyTypeAddressMetadata = 3,
  kStorageKeyTypeReplayCache = 4,
}

export type StorageKeyContractData = Uint8Array & { readonly __brand: "StorageKeyContractData" };
export function storageKeyContractData(data: Uint8Array): StorageKeyContractData {
  if (data.length !== 32) throw new Error(`StorageKeyContractData must be exactly 32 bytes, got ${data.length}`);
  return data as StorageKeyContractData;
}

export type StorageKey =
  | { key_type: StorageKeyType.kStorageKeyTypeContractData; contract_data_key: StorageKeyContractData }
  | { key_type: StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressAuthData }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressMetadata }
  | { key_type: StorageKeyType.kStorageKeyTypeReplayCache }
;

export const kTotalHogSupply = 62_500_000_000n;

export const kHogDivisibility = 10_000_000n;

export interface AddressAndKey {
  address: ContractAddress;
  key: StorageKey;
}

export type BlockHeight = bigint & { readonly __brand: "BlockHeight" };
export function blockHeight(val: bigint): BlockHeight {
  return val as BlockHeight;
}


//
// XDR Codecs below this point
//

export const uint128_xdr: XdrCodec<uint128_xdr> = {
  encode(w, val) {
    w.writeUint64(val.highbits);
    w.writeUint64(val.lowbits);
  },
  decode(r) {
    const highbits = r.readUint64();
    const lowbits = r.readUint64();
    return { highbits, lowbits };
  },
};

export const int128_xdr: XdrCodec<int128_xdr> = {
  encode(w, val) {
    w.writeInt64(val.highbits);
    w.writeUint64(val.lowbits);
  },
  decode(r) {
    const highbits = r.readInt64();
    const lowbits = r.readUint64();
    return { highbits, lowbits };
  },
};

export const TimePoint: XdrCodec<TimePoint> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return timePoint(r.readUint64()); },
};

export const RuntimeMemoryLength: XdrCodec<RuntimeMemoryLength> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return runtimeMemoryLength(r.readUint32()); },
};

export const GasAmount: XdrCodec<GasAmount> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return gasAmount(r.readUint64()); },
};

export const Ed25519Signature: XdrCodec<Ed25519Signature> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519Signature(r.readFixedOpaque(64)); },
};

export const Ed25519PublicKey: XdrCodec<Ed25519PublicKey> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return ed25519PublicKey(r.readFixedOpaque(32)); },
};

export const Ed25519SecretKey: XdrCodec<Ed25519SecretKey> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519SecretKey(r.readFixedOpaque(64)); },
};

export const Signature: XdrCodec<Signature> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519Signature.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        const ed25519 = Ed25519Signature.decode(r);
        return { scheme, ed25519 };
      default:
        throw new Error(`Unknown Signature discriminant: ${scheme}`);
    }
  },
};

export const PublicKey: XdrCodec<PublicKey> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519PublicKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        const ed25519 = Ed25519PublicKey.decode(r);
        return { scheme, ed25519 };
      default:
        throw new Error(`Unknown PublicKey discriminant: ${scheme}`);
    }
  },
};

export const SecretKey: XdrCodec<SecretKey> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519SecretKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        const ed25519 = Ed25519SecretKey.decode(r);
        return { scheme, ed25519 };
      default:
        throw new Error(`Unknown SecretKey discriminant: ${scheme}`);
    }
  },
};

export const ExtensionPoint: XdrCodec<ExtensionPoint> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case 0:
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case 0:
        return { v } as ExtensionPoint;
      default:
        throw new Error(`Unknown ExtensionPoint discriminant: ${v}`);
    }
  },
};

export const SHA256Hash: XdrCodec<SHA256Hash> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return sha256Hash(r.readFixedOpaque(32)); },
};

export const DbHash: XdrCodec<DbHash> = {
  encode(w, val) { w.writeFixedOpaque(val, 2048); },
  decode(r) { return dbHash(r.readFixedOpaque(2048)); },
};

export const BlockHash: XdrCodec<BlockHash> = SHA256Hash as XdrCodec<BlockHash>;

export const ContractAddress: XdrCodec<ContractAddress> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return contractAddress(r.readFixedOpaque(32)); },
};

export const StorageKeyContractData: XdrCodec<StorageKeyContractData> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return storageKeyContractData(r.readFixedOpaque(32)); },
};

export const StorageKey: XdrCodec<StorageKey> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.key_type));
    switch (val.key_type) {
      case StorageKeyType.kStorageKeyTypeContractData:
        StorageKeyContractData.encode(w, val.contract_data_key);
        break;
      case StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance:
        break;
      case StorageKeyType.kStorageKeyTypeAddressAuthData:
        break;
      case StorageKeyType.kStorageKeyTypeAddressMetadata:
        break;
      case StorageKeyType.kStorageKeyTypeReplayCache:
        break;
    }
  },
  decode(r) {
    const key_type = Number(r.readInt32());
    switch (key_type) {
      case StorageKeyType.kStorageKeyTypeContractData:
        const contract_data_key = StorageKeyContractData.decode(r);
        return { key_type, contract_data_key };
      case StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance:
        return { key_type } as StorageKey;
      case StorageKeyType.kStorageKeyTypeAddressAuthData:
        return { key_type } as StorageKey;
      case StorageKeyType.kStorageKeyTypeAddressMetadata:
        return { key_type } as StorageKey;
      case StorageKeyType.kStorageKeyTypeReplayCache:
        return { key_type } as StorageKey;
      default:
        throw new Error(`Unknown StorageKey discriminant: ${key_type}`);
    }
  },
};

export const AddressAndKey: XdrCodec<AddressAndKey> = {
  encode(w, val) {
    ContractAddress.encode(w, val.address);
    StorageKey.encode(w, val.key);
  },
  decode(r) {
    const address = ContractAddress.decode(r);
    const key = StorageKey.decode(r);
    return { address, key };
  },
};

export const BlockHeight: XdrCodec<BlockHeight> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return blockHeight(r.readInt64()); },
};

