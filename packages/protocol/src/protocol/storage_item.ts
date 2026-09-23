// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e671a3694d7312d78364456bb86ee8a18de1502d

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum StorageItemType {
  kItemTypeBytestring = 0,
  kItemTypeNonnegativeInt = 1,
  kItemTypeRetrocausalQueue = 2,
  kItemTypeReplayCacheData = 3,
  kItemTypeAuthData = 4,
  kItemTypeDeployedContractHash = 5,
  kItemTypeDeleted = -1,
}

export const kBytestringCeilingLen = 65000n;
/**
 * Type-level value of {@link kBytestringCeilingLen}, for use in array-bound positions.
 * @hidden
 */
export type kBytestringCeilingLen = 65000;

export const kDefaultMaxBytestringLen = 1024n;
/**
 * Type-level value of {@link kDefaultMaxBytestringLen}, for use in array-bound positions.
 * @hidden
 */
export type kDefaultMaxBytestringLen = 1024;

/** XDR: `typedef opaque Bytestring<kBytestringCeilingLen>` — max {@link kBytestringCeilingLen} bytes. */
export type Bytestring = VarBytes<proto.kBytestringCeilingLen> & { readonly __brand: { readonly Bytestring: true } };
export function bytestring(data: Uint8Array): Bytestring {
  if (data.length > Number(proto.kBytestringCeilingLen)) throw new Error(`Bytestring exceeds max length kBytestringCeilingLen, got ${data.length}`);
  return data as Bytestring;
}

export type StorageItem =
  | { type: proto.StorageItemType.kItemTypeBytestring; bytestring: proto.Bytestring }
  | { type: proto.StorageItemType.kItemTypeNonnegativeInt; nnint: proto.int128_xdr }
  | { type: proto.StorageItemType.kItemTypeRetrocausalQueue; queue_entries: proto.QueueEntry[] }
  | { type: proto.StorageItemType.kItemTypeReplayCacheData; active_uniquifiers: proto.Uniquifier[] }
  | { type: proto.StorageItemType.kItemTypeAuthData; auth_data: proto.AddressAuthData }
  | { type: proto.StorageItemType.kItemTypeDeployedContractHash; deployed_contract_hash: proto.DeployedContractHash }
;

export type WireStorageItem =
  | { type: proto.StorageItemType.kItemTypeBytestring; bytestring: proto.Bytestring }
  | { type: proto.StorageItemType.kItemTypeNonnegativeInt; nnint: proto.int128_xdr }
  | { type: proto.StorageItemType.kItemTypeAuthData; auth_data: proto.AddressAuthData }
  | { type: proto.StorageItemType.kItemTypeRetrocausalQueue; metadata: proto.RetrocausalQueueMetadata }
  | { type: proto.StorageItemType.kItemTypeReplayCacheData }
  | { type: proto.StorageItemType.kItemTypeDeployedContractHash; deployed_contract_hash: proto.DeployedContractHash }
;

export enum StorageDeltaType {
  kDeltaTypeBytestringSet = 0,
  kDeltaTypeNonnegativeIntSetAdd = 1,
  kDeltaTypeDelete = 2,
  kDeltaTypeRetrocausalQueue = 3,
  kDeltaTypeNonnegativeIntAdd = 5,
  kDeltaTypeAuthDataChange = 6,
  kDeltaTypeDeployContract = 7,
  kDeltaTypeConsumeUniquifier = 8,
}

export interface AuthDataChangeSigner {
  public_key_id: bigint;
  public_key: proto.PublicKeyConfigOpt;
}

export interface AuthDataChangeArgs {
  /** XDR: `AuthDataChangeSigner auth_data_change_signers<kMaxSigners>` — max {@link kMaxSigners} elements. */
  auth_data_change_signers: VarArray<proto.AuthDataChangeSigner, proto.kMaxSigners>;
  new_required_weight: proto.Weight | null;
}

export interface NonnegativeInt128SetAddArgs {
  set_value: proto.int128_xdr;
  add_value: proto.int128_xdr;
}

export interface ConsumeUniquifierArgs {
  uniquifier: proto.Uniquifier;
}

export type StorageDelta =
  | { type: proto.StorageDeltaType.kDeltaTypeBytestringSet; bytestring: proto.Bytestring }
  | { type: proto.StorageDeltaType.kDeltaTypeNonnegativeIntSetAdd; nnint: proto.NonnegativeInt128SetAddArgs }
  | { type: proto.StorageDeltaType.kDeltaTypeNonnegativeIntAdd; nnint_add: proto.int128_xdr }
  | { type: proto.StorageDeltaType.kDeltaTypeDelete }
  | { type: proto.StorageDeltaType.kDeltaTypeRetrocausalQueue; retrocausal_queue: proto.RetrocausalQueueDelta }
  | { type: proto.StorageDeltaType.kDeltaTypeAuthDataChange; auth_data_change: proto.AuthDataChangeArgs }
  | { type: proto.StorageDeltaType.kDeltaTypeDeployContract; deployed_contract_hash: proto.DeployedContractHash }
  | { type: proto.StorageDeltaType.kDeltaTypeConsumeUniquifier; consume_uniquifier_args: proto.ConsumeUniquifierArgs }
;

export const kReplayCacheHeightsMaxLen = 4000n;
/**
 * Type-level value of {@link kReplayCacheHeightsMaxLen}, for use in array-bound positions.
 * @hidden
 */
export type kReplayCacheHeightsMaxLen = 4000;

export const kReplayCacheNoncesMaxLen = 8000n;
/**
 * Type-level value of {@link kReplayCacheNoncesMaxLen}, for use in array-bound positions.
 * @hidden
 */
export type kReplayCacheNoncesMaxLen = 8000;

export interface ReplayCacheHeightCount {
  height: proto.BlockHeight;
  nonce_count: bigint;
}

export interface ReplayCacheMetadata {
  size: bigint;
  /** XDR: `ReplayCacheHeightCount heights<kReplayCacheNoncesMaxLen>` — max {@link kReplayCacheNoncesMaxLen} elements. */
  heights: VarArray<proto.ReplayCacheHeightCount, proto.kReplayCacheNoncesMaxLen>;
}

export interface ReplayCacheData {
  /** XDR: `unsigned hyper nonces<kReplayCacheNoncesMaxLen>` — max {@link kReplayCacheNoncesMaxLen} elements. */
  nonces: VarArray<bigint, proto.kReplayCacheNoncesMaxLen>;
}

export enum StorageDeltaFlags {
  None = 0,
  ExclusiveLock = 0x00000001,
}

export type StorageDeltaFlagSet = bigint & { readonly __brand: { readonly StorageDeltaFlagSet: true } };
export function storageDeltaFlagSet(val: bigint): StorageDeltaFlagSet {
  return val as StorageDeltaFlagSet;
}

export interface FlaggedStorageDelta {
  addrkey: proto.AddressAndKey;
  delta: proto.StorageDelta;
  flags: proto.StorageDeltaFlagSet;
}


//
// XDR Codecs below this point
//

const _StorageItemType: XdrCodec<StorageItemType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as StorageItemType; },
};

const _Bytestring: XdrCodec<Bytestring> = {
  encode(w, val) { w.writeVarOpaque(val, Number(proto.kBytestringCeilingLen)); },
  decode(r) { return bytestring(r.readVarOpaque(Number(proto.kBytestringCeilingLen))); },
};

const _StorageItem: XdrCodec<StorageItem> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.type));
    switch (val.type) {
      case proto.StorageItemType.kItemTypeBytestring:
        proto.codec.Bytestring.encode(w, val.bytestring);
        break;
      case proto.StorageItemType.kItemTypeNonnegativeInt:
        proto.codec.int128_xdr.encode(w, val.nnint);
        break;
      case proto.StorageItemType.kItemTypeRetrocausalQueue:
        VarArrayCodec(proto.codec.QueueEntry, Number(0xFFFFFFFF)).encode(w, val.queue_entries);
        break;
      case proto.StorageItemType.kItemTypeReplayCacheData:
        VarArrayCodec(proto.codec.Uniquifier, Number(0xFFFFFFFF)).encode(w, val.active_uniquifiers);
        break;
      case proto.StorageItemType.kItemTypeAuthData:
        proto.codec.AddressAuthData.encode(w, val.auth_data);
        break;
      case proto.StorageItemType.kItemTypeDeployedContractHash:
        proto.codec.DeployedContractHash.encode(w, val.deployed_contract_hash);
        break;
    }
  },
  decode(r) {
    const type = Number(r.readInt32());
    switch (type) {
      case proto.StorageItemType.kItemTypeBytestring:
        const bytestring = proto.codec.Bytestring.decode(r);
        return { type, bytestring };
      case proto.StorageItemType.kItemTypeNonnegativeInt:
        const nnint = proto.codec.int128_xdr.decode(r);
        return { type, nnint };
      case proto.StorageItemType.kItemTypeRetrocausalQueue:
        const queue_entries = VarArrayCodec(proto.codec.QueueEntry, Number(0xFFFFFFFF)).decode(r);
        return { type, queue_entries };
      case proto.StorageItemType.kItemTypeReplayCacheData:
        const active_uniquifiers = VarArrayCodec(proto.codec.Uniquifier, Number(0xFFFFFFFF)).decode(r);
        return { type, active_uniquifiers };
      case proto.StorageItemType.kItemTypeAuthData:
        const auth_data = proto.codec.AddressAuthData.decode(r);
        return { type, auth_data };
      case proto.StorageItemType.kItemTypeDeployedContractHash:
        const deployed_contract_hash = proto.codec.DeployedContractHash.decode(r);
        return { type, deployed_contract_hash };
      default:
        throw new Error(`Unknown StorageItem discriminant: ${type}`);
    }
  },
};

const _WireStorageItem: XdrCodec<WireStorageItem> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.type));
    switch (val.type) {
      case proto.StorageItemType.kItemTypeBytestring:
        proto.codec.Bytestring.encode(w, val.bytestring);
        break;
      case proto.StorageItemType.kItemTypeNonnegativeInt:
        proto.codec.int128_xdr.encode(w, val.nnint);
        break;
      case proto.StorageItemType.kItemTypeAuthData:
        proto.codec.AddressAuthData.encode(w, val.auth_data);
        break;
      case proto.StorageItemType.kItemTypeRetrocausalQueue:
        proto.codec.RetrocausalQueueMetadata.encode(w, val.metadata);
        break;
      case proto.StorageItemType.kItemTypeReplayCacheData:
        break;
      case proto.StorageItemType.kItemTypeDeployedContractHash:
        proto.codec.DeployedContractHash.encode(w, val.deployed_contract_hash);
        break;
    }
  },
  decode(r) {
    const type = Number(r.readInt32());
    switch (type) {
      case proto.StorageItemType.kItemTypeBytestring:
        const bytestring = proto.codec.Bytestring.decode(r);
        return { type, bytestring };
      case proto.StorageItemType.kItemTypeNonnegativeInt:
        const nnint = proto.codec.int128_xdr.decode(r);
        return { type, nnint };
      case proto.StorageItemType.kItemTypeAuthData:
        const auth_data = proto.codec.AddressAuthData.decode(r);
        return { type, auth_data };
      case proto.StorageItemType.kItemTypeRetrocausalQueue:
        const metadata = proto.codec.RetrocausalQueueMetadata.decode(r);
        return { type, metadata };
      case proto.StorageItemType.kItemTypeReplayCacheData:
        return { type } as WireStorageItem;
      case proto.StorageItemType.kItemTypeDeployedContractHash:
        const deployed_contract_hash = proto.codec.DeployedContractHash.decode(r);
        return { type, deployed_contract_hash };
      default:
        throw new Error(`Unknown WireStorageItem discriminant: ${type}`);
    }
  },
};

const _StorageDeltaType: XdrCodec<StorageDeltaType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as StorageDeltaType; },
};

const _AuthDataChangeSigner: XdrCodec<AuthDataChangeSigner> = {
  encode(w, val) {
    w.writeUint32(val.public_key_id);
    proto.codec.PublicKeyConfigOpt.encode(w, val.public_key);
  },
  decode(r) {
    const public_key_id = r.readUint32();
    const public_key = proto.codec.PublicKeyConfigOpt.decode(r);
    return { public_key_id, public_key };
  },
};

const _AuthDataChangeArgs: XdrCodec<AuthDataChangeArgs> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.AuthDataChangeSigner, Number(proto.kMaxSigners)).encode(w, val.auth_data_change_signers);
    OptionCodec(proto.codec.Weight as XdrCodec<proto.Weight>).encode(w, val.new_required_weight);
  },
  decode(r) {
    const auth_data_change_signers = VarArrayCodec(proto.codec.AuthDataChangeSigner, Number(proto.kMaxSigners)).decode(r);
    const new_required_weight = OptionCodec(proto.codec.Weight as XdrCodec<proto.Weight>).decode(r);
    return { auth_data_change_signers, new_required_weight };
  },
};

const _NonnegativeInt128SetAddArgs: XdrCodec<NonnegativeInt128SetAddArgs> = {
  encode(w, val) {
    proto.codec.int128_xdr.encode(w, val.set_value);
    proto.codec.int128_xdr.encode(w, val.add_value);
  },
  decode(r) {
    const set_value = proto.codec.int128_xdr.decode(r);
    const add_value = proto.codec.int128_xdr.decode(r);
    return { set_value, add_value };
  },
};

const _ConsumeUniquifierArgs: XdrCodec<ConsumeUniquifierArgs> = {
  encode(w, val) {
    proto.codec.Uniquifier.encode(w, val.uniquifier);
  },
  decode(r) {
    const uniquifier = proto.codec.Uniquifier.decode(r);
    return { uniquifier };
  },
};

const _StorageDelta: XdrCodec<StorageDelta> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.type));
    switch (val.type) {
      case proto.StorageDeltaType.kDeltaTypeBytestringSet:
        proto.codec.Bytestring.encode(w, val.bytestring);
        break;
      case proto.StorageDeltaType.kDeltaTypeNonnegativeIntSetAdd:
        proto.codec.NonnegativeInt128SetAddArgs.encode(w, val.nnint);
        break;
      case proto.StorageDeltaType.kDeltaTypeNonnegativeIntAdd:
        proto.codec.int128_xdr.encode(w, val.nnint_add);
        break;
      case proto.StorageDeltaType.kDeltaTypeDelete:
        break;
      case proto.StorageDeltaType.kDeltaTypeRetrocausalQueue:
        proto.codec.RetrocausalQueueDelta.encode(w, val.retrocausal_queue);
        break;
      case proto.StorageDeltaType.kDeltaTypeAuthDataChange:
        proto.codec.AuthDataChangeArgs.encode(w, val.auth_data_change);
        break;
      case proto.StorageDeltaType.kDeltaTypeDeployContract:
        proto.codec.DeployedContractHash.encode(w, val.deployed_contract_hash);
        break;
      case proto.StorageDeltaType.kDeltaTypeConsumeUniquifier:
        proto.codec.ConsumeUniquifierArgs.encode(w, val.consume_uniquifier_args);
        break;
    }
  },
  decode(r) {
    const type = Number(r.readInt32());
    switch (type) {
      case proto.StorageDeltaType.kDeltaTypeBytestringSet:
        const bytestring = proto.codec.Bytestring.decode(r);
        return { type, bytestring };
      case proto.StorageDeltaType.kDeltaTypeNonnegativeIntSetAdd:
        const nnint = proto.codec.NonnegativeInt128SetAddArgs.decode(r);
        return { type, nnint };
      case proto.StorageDeltaType.kDeltaTypeNonnegativeIntAdd:
        const nnint_add = proto.codec.int128_xdr.decode(r);
        return { type, nnint_add };
      case proto.StorageDeltaType.kDeltaTypeDelete:
        return { type } as StorageDelta;
      case proto.StorageDeltaType.kDeltaTypeRetrocausalQueue:
        const retrocausal_queue = proto.codec.RetrocausalQueueDelta.decode(r);
        return { type, retrocausal_queue };
      case proto.StorageDeltaType.kDeltaTypeAuthDataChange:
        const auth_data_change = proto.codec.AuthDataChangeArgs.decode(r);
        return { type, auth_data_change };
      case proto.StorageDeltaType.kDeltaTypeDeployContract:
        const deployed_contract_hash = proto.codec.DeployedContractHash.decode(r);
        return { type, deployed_contract_hash };
      case proto.StorageDeltaType.kDeltaTypeConsumeUniquifier:
        const consume_uniquifier_args = proto.codec.ConsumeUniquifierArgs.decode(r);
        return { type, consume_uniquifier_args };
      default:
        throw new Error(`Unknown StorageDelta discriminant: ${type}`);
    }
  },
};

const _ReplayCacheHeightCount: XdrCodec<ReplayCacheHeightCount> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.height);
    w.writeUint32(val.nonce_count);
  },
  decode(r) {
    const height = proto.codec.BlockHeight.decode(r);
    const nonce_count = r.readUint32();
    return { height, nonce_count };
  },
};

const _ReplayCacheMetadata: XdrCodec<ReplayCacheMetadata> = {
  encode(w, val) {
    w.writeInt64(val.size);
    VarArrayCodec(proto.codec.ReplayCacheHeightCount, Number(proto.kReplayCacheNoncesMaxLen)).encode(w, val.heights);
  },
  decode(r) {
    const size = r.readInt64();
    const heights = VarArrayCodec(proto.codec.ReplayCacheHeightCount, Number(proto.kReplayCacheNoncesMaxLen)).decode(r);
    return { size, heights };
  },
};

const _ReplayCacheData: XdrCodec<ReplayCacheData> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.nonces.length));
    for (const _item of val.nonces) w.writeUint64(_item);
  },
  decode(r) {
    const _nonces_len = Number(r.readUint32());
    const nonces = Array.from({ length: _nonces_len }, () => r.readUint64());
    return { nonces };
  },
};

const _StorageDeltaFlags: XdrCodec<StorageDeltaFlags> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as StorageDeltaFlags; },
};

const _StorageDeltaFlagSet: XdrCodec<StorageDeltaFlagSet> = {
  encode(w, val) { w.writeInt32(val); },
  decode(r) { return storageDeltaFlagSet(r.readInt32()); },
};

const _FlaggedStorageDelta: XdrCodec<FlaggedStorageDelta> = {
  encode(w, val) {
    proto.codec.AddressAndKey.encode(w, val.addrkey);
    proto.codec.StorageDelta.encode(w, val.delta);
    proto.codec.StorageDeltaFlagSet.encode(w, val.flags);
  },
  decode(r) {
    const addrkey = proto.codec.AddressAndKey.decode(r);
    const delta = proto.codec.StorageDelta.decode(r);
    const flags = proto.codec.StorageDeltaFlagSet.decode(r);
    return { addrkey, delta, flags };
  },
};

export const codec = {
  StorageItemType: _StorageItemType,
  Bytestring: _Bytestring,
  StorageItem: _StorageItem,
  WireStorageItem: _WireStorageItem,
  StorageDeltaType: _StorageDeltaType,
  AuthDataChangeSigner: _AuthDataChangeSigner,
  AuthDataChangeArgs: _AuthDataChangeArgs,
  NonnegativeInt128SetAddArgs: _NonnegativeInt128SetAddArgs,
  ConsumeUniquifierArgs: _ConsumeUniquifierArgs,
  StorageDelta: _StorageDelta,
  ReplayCacheHeightCount: _ReplayCacheHeightCount,
  ReplayCacheMetadata: _ReplayCacheMetadata,
  ReplayCacheData: _ReplayCacheData,
  StorageDeltaFlags: _StorageDeltaFlags,
  StorageDeltaFlagSet: _StorageDeltaFlagSet,
  FlaggedStorageDelta: _FlaggedStorageDelta,
} as const;

