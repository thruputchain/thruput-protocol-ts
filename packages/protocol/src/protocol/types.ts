// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: dcb5d7af8f39be558b0bfe56c0d0bb9163cce9f2

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export interface uint128_xdr {
  highbits: bigint;
  lowbits: bigint;
}

export interface int128_xdr {
  highbits: bigint;
  lowbits: bigint;
}

export type Protocol = bigint & { readonly __brand: { readonly Protocol: true } };
export function protocol(val: bigint): Protocol {
  return val as Protocol;
}

export type TimePoint = bigint & { readonly __brand: { readonly TimePoint: true } };
export function timePoint(val: bigint): TimePoint {
  return val as TimePoint;
}

export type RuntimeMemoryLength = bigint & { readonly __brand: { readonly RuntimeMemoryLength: true } };
export function runtimeMemoryLength(val: bigint): RuntimeMemoryLength {
  return val as RuntimeMemoryLength;
}

export type GasAmount = bigint & { readonly __brand: { readonly GasAmount: true } };
export function gasAmount(val: bigint): GasAmount {
  return val as GasAmount;
}

/** XDR: `typedef opaque Ed25519Signature[64]` — exactly 64 bytes. */
export type Ed25519Signature = FixedBytes<64> & { readonly __brand: { readonly Ed25519Signature: true } };
export function ed25519Signature(data: Uint8Array): Ed25519Signature {
  if (data.length !== 64) throw new Error(`Ed25519Signature must be exactly 64 bytes, got ${data.length}`);
  return data as Ed25519Signature;
}

/** XDR: `typedef opaque Ed25519PublicKey[32]` — exactly 32 bytes. */
export type Ed25519PublicKey = FixedBytes<32> & { readonly __brand: { readonly Ed25519PublicKey: true } };
export function ed25519PublicKey(data: Uint8Array): Ed25519PublicKey {
  if (data.length !== 32) throw new Error(`Ed25519PublicKey must be exactly 32 bytes, got ${data.length}`);
  return data as Ed25519PublicKey;
}

/** XDR: `typedef opaque Ed25519SecretKey[64]` — exactly 64 bytes. */
export type Ed25519SecretKey = FixedBytes<64> & { readonly __brand: { readonly Ed25519SecretKey: true } };
export function ed25519SecretKey(data: Uint8Array): Ed25519SecretKey {
  if (data.length !== 64) throw new Error(`Ed25519SecretKey must be exactly 64 bytes, got ${data.length}`);
  return data as Ed25519SecretKey;
}

export enum CryptographicScheme {
  Ed25519 = 0,
}

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

/** XDR: `typedef opaque SHA256Hash[32]` — exactly 32 bytes. */
export type SHA256Hash = FixedBytes<32> & { readonly __brand: { readonly SHA256Hash: true } };
export function sha256Hash(data: Uint8Array): SHA256Hash {
  if (data.length !== 32) throw new Error(`SHA256Hash must be exactly 32 bytes, got ${data.length}`);
  return data as SHA256Hash;
}

export type ConsensusValueHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly ConsensusValueHash: true } }) | Extract<proto.SHA256Hash, null>;
export function consensusValueHash(val: proto.SHA256Hash): ConsensusValueHash {
  return val as ConsensusValueHash;
}

export type NetworkHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly NetworkHash: true } }) | Extract<proto.SHA256Hash, null>;
export function networkHash(val: proto.SHA256Hash): NetworkHash {
  return val as NetworkHash;
}

export type ConfigHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly ConfigHash: true } }) | Extract<proto.SHA256Hash, null>;
export function configHash(val: proto.SHA256Hash): ConfigHash {
  return val as ConfigHash;
}

/** XDR: `typedef opaque StorageLongHash[2048]` — exactly 2048 bytes. */
export type StorageLongHash = FixedBytes<2048> & { readonly __brand: { readonly StorageLongHash: true } };
export function storageLongHash(data: Uint8Array): StorageLongHash {
  if (data.length !== 2048) throw new Error(`StorageLongHash must be exactly 2048 bytes, got ${data.length}`);
  return data as StorageLongHash;
}

export type StorageShortHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly StorageShortHash: true } }) | Extract<proto.SHA256Hash, null>;
export function storageShortHash(val: proto.SHA256Hash): StorageShortHash {
  return val as StorageShortHash;
}

export type TxsHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly TxsHash: true } }) | Extract<proto.SHA256Hash, null>;
export function txsHash(val: proto.SHA256Hash): TxsHash {
  return val as TxsHash;
}

export type EventsHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly EventsHash: true } }) | Extract<proto.SHA256Hash, null>;
export function eventsHash(val: proto.SHA256Hash): EventsHash {
  return val as EventsHash;
}

export type ProposalHeaderHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly ProposalHeaderHash: true } }) | Extract<proto.SHA256Hash, null>;
export function proposalHeaderHash(val: proto.SHA256Hash): ProposalHeaderHash {
  return val as ProposalHeaderHash;
}

/** XDR: `typedef opaque ContractAddress[32]` — exactly 32 bytes. */
export type ContractAddress = FixedBytes<32> & { readonly __brand: { readonly ContractAddress: true } };
export function contractAddress(data: Uint8Array): ContractAddress {
  if (data.length !== 32) throw new Error(`ContractAddress must be exactly 32 bytes, got ${data.length}`);
  return data as ContractAddress;
}

export enum StorageKeyType {
  ContractData = 0,
  FreeNativeTokenBalance = 1,
  AuthData = 2,
  Metadata = 3,
  ReplayCache = 4,
}

/** XDR: `typedef opaque StorageKeyContractData[32]` — exactly 32 bytes. */
export type StorageKeyContractData = FixedBytes<32> & { readonly __brand: { readonly StorageKeyContractData: true } };
export function storageKeyContractData(data: Uint8Array): StorageKeyContractData {
  if (data.length !== 32) throw new Error(`StorageKeyContractData must be exactly 32 bytes, got ${data.length}`);
  return data as StorageKeyContractData;
}

export type StorageKey =
  | { key_type: proto.StorageKeyType.ContractData; contract_data_key: proto.StorageKeyContractData }
  | { key_type: proto.StorageKeyType.FreeNativeTokenBalance }
  | { key_type: proto.StorageKeyType.AuthData }
  | { key_type: proto.StorageKeyType.Metadata }
  | { key_type: proto.StorageKeyType.ReplayCache }
;

export const kTotalHogSupply = 62_500_000_000n;

export const kHogDivisibility = 10_000_000n;
/**
 * Type-level value of {@link kHogDivisibility}, for use in array-bound positions.
 * @hidden
 */
export type kHogDivisibility = 10_000_000;

export interface AddressAndKey {
  address: proto.ContractAddress;
  key: proto.StorageKey;
}

export type BlockHeight = bigint & { readonly __brand: { readonly BlockHeight: true } };
export function blockHeight(val: bigint): BlockHeight {
  return val as BlockHeight;
}


//
// XDR Codecs below this point
//

const _uint128_xdr: XdrCodec<uint128_xdr> = {
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

const _int128_xdr: XdrCodec<int128_xdr> = {
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

const _Protocol: XdrCodec<Protocol> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return protocol(r.readUint32()); },
};

const _TimePoint: XdrCodec<TimePoint> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return timePoint(r.readUint64()); },
};

const _RuntimeMemoryLength: XdrCodec<RuntimeMemoryLength> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return runtimeMemoryLength(r.readUint32()); },
};

const _GasAmount: XdrCodec<GasAmount> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return gasAmount(r.readUint64()); },
};

const _Ed25519Signature: XdrCodec<Ed25519Signature> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519Signature(r.readFixedOpaque(64)); },
};

const _Ed25519PublicKey: XdrCodec<Ed25519PublicKey> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return ed25519PublicKey(r.readFixedOpaque(32)); },
};

const _Ed25519SecretKey: XdrCodec<Ed25519SecretKey> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519SecretKey(r.readFixedOpaque(64)); },
};

const _CryptographicScheme: XdrCodec<CryptographicScheme> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as CryptographicScheme; },
};

const _Signature: XdrCodec<Signature> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case proto.CryptographicScheme.Ed25519:
        proto.codec.Ed25519Signature.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case proto.CryptographicScheme.Ed25519:
        const ed25519 = proto.codec.Ed25519Signature.decode(r);
        return { scheme, ed25519 };
      default:
        throw new Error(`Unknown Signature discriminant: ${scheme}`);
    }
  },
};

const _PublicKey: XdrCodec<PublicKey> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case proto.CryptographicScheme.Ed25519:
        proto.codec.Ed25519PublicKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case proto.CryptographicScheme.Ed25519:
        const ed25519 = proto.codec.Ed25519PublicKey.decode(r);
        return { scheme, ed25519 };
      default:
        throw new Error(`Unknown PublicKey discriminant: ${scheme}`);
    }
  },
};

const _SecretKey: XdrCodec<SecretKey> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case proto.CryptographicScheme.Ed25519:
        proto.codec.Ed25519SecretKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case proto.CryptographicScheme.Ed25519:
        const ed25519 = proto.codec.Ed25519SecretKey.decode(r);
        return { scheme, ed25519 };
      default:
        throw new Error(`Unknown SecretKey discriminant: ${scheme}`);
    }
  },
};

const _ExtensionPoint: XdrCodec<ExtensionPoint> = {
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

const _SHA256Hash: XdrCodec<SHA256Hash> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return sha256Hash(r.readFixedOpaque(32)); },
};

const _ConsensusValueHash: XdrCodec<ConsensusValueHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return consensusValueHash(proto.codec.SHA256Hash.decode(r)); },
};

const _NetworkHash: XdrCodec<NetworkHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return networkHash(proto.codec.SHA256Hash.decode(r)); },
};

const _ConfigHash: XdrCodec<ConfigHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return configHash(proto.codec.SHA256Hash.decode(r)); },
};

const _StorageLongHash: XdrCodec<StorageLongHash> = {
  encode(w, val) { w.writeFixedOpaque(val, 2048); },
  decode(r) { return storageLongHash(r.readFixedOpaque(2048)); },
};

const _StorageShortHash: XdrCodec<StorageShortHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return storageShortHash(proto.codec.SHA256Hash.decode(r)); },
};

const _TxsHash: XdrCodec<TxsHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return txsHash(proto.codec.SHA256Hash.decode(r)); },
};

const _EventsHash: XdrCodec<EventsHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return eventsHash(proto.codec.SHA256Hash.decode(r)); },
};

const _ProposalHeaderHash: XdrCodec<ProposalHeaderHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return proposalHeaderHash(proto.codec.SHA256Hash.decode(r)); },
};

const _ContractAddress: XdrCodec<ContractAddress> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return contractAddress(r.readFixedOpaque(32)); },
};

const _StorageKeyType: XdrCodec<StorageKeyType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as StorageKeyType; },
};

const _StorageKeyContractData: XdrCodec<StorageKeyContractData> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return storageKeyContractData(r.readFixedOpaque(32)); },
};

const _StorageKey: XdrCodec<StorageKey> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.key_type));
    switch (val.key_type) {
      case proto.StorageKeyType.ContractData:
        proto.codec.StorageKeyContractData.encode(w, val.contract_data_key);
        break;
      case proto.StorageKeyType.FreeNativeTokenBalance:
        break;
      case proto.StorageKeyType.AuthData:
        break;
      case proto.StorageKeyType.Metadata:
        break;
      case proto.StorageKeyType.ReplayCache:
        break;
    }
  },
  decode(r) {
    const key_type = Number(r.readInt32());
    switch (key_type) {
      case proto.StorageKeyType.ContractData:
        const contract_data_key = proto.codec.StorageKeyContractData.decode(r);
        return { key_type, contract_data_key };
      case proto.StorageKeyType.FreeNativeTokenBalance:
        return { key_type } as StorageKey;
      case proto.StorageKeyType.AuthData:
        return { key_type } as StorageKey;
      case proto.StorageKeyType.Metadata:
        return { key_type } as StorageKey;
      case proto.StorageKeyType.ReplayCache:
        return { key_type } as StorageKey;
      default:
        throw new Error(`Unknown StorageKey discriminant: ${key_type}`);
    }
  },
};

const _AddressAndKey: XdrCodec<AddressAndKey> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    proto.codec.StorageKey.encode(w, val.key);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const key = proto.codec.StorageKey.decode(r);
    return { address, key };
  },
};

const _BlockHeight: XdrCodec<BlockHeight> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return blockHeight(r.readInt64()); },
};

export const codec = {
  uint128_xdr: _uint128_xdr,
  int128_xdr: _int128_xdr,
  Protocol: _Protocol,
  TimePoint: _TimePoint,
  RuntimeMemoryLength: _RuntimeMemoryLength,
  GasAmount: _GasAmount,
  Ed25519Signature: _Ed25519Signature,
  Ed25519PublicKey: _Ed25519PublicKey,
  Ed25519SecretKey: _Ed25519SecretKey,
  CryptographicScheme: _CryptographicScheme,
  Signature: _Signature,
  PublicKey: _PublicKey,
  SecretKey: _SecretKey,
  ExtensionPoint: _ExtensionPoint,
  SHA256Hash: _SHA256Hash,
  ConsensusValueHash: _ConsensusValueHash,
  NetworkHash: _NetworkHash,
  ConfigHash: _ConfigHash,
  StorageLongHash: _StorageLongHash,
  StorageShortHash: _StorageShortHash,
  TxsHash: _TxsHash,
  EventsHash: _EventsHash,
  ProposalHeaderHash: _ProposalHeaderHash,
  ContractAddress: _ContractAddress,
  StorageKeyType: _StorageKeyType,
  StorageKeyContractData: _StorageKeyContractData,
  StorageKey: _StorageKey,
  AddressAndKey: _AddressAndKey,
  BlockHeight: _BlockHeight,
} as const;

