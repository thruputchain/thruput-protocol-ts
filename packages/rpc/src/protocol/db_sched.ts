// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 6ab835b07c234abb4b0b50b61d687904727a4f32

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@thruputchain/xdr";
import * as proto from "./index.js";



export enum DbSchedResult {
  DbSchedResultOK = 0,
  DbSchedResultError = 1,
  DbSchedResultInvalidParentId = 2,
}

export const kNativeTokenAgeGroupToSchedule = 0n;
/**
 * Type-level value of {@link kNativeTokenAgeGroupToSchedule}, for use in array-bound positions.
 * @hidden
 */
export type kNativeTokenAgeGroupToSchedule = 0;

export const kNativeTokenAgeGroupAlreadyScheduled = 1n;
/**
 * Type-level value of {@link kNativeTokenAgeGroupAlreadyScheduled}, for use in array-bound positions.
 * @hidden
 */
export type kNativeTokenAgeGroupAlreadyScheduled = 1;

export const kNativeTokenAgeGroupReceived = 2n;
/**
 * Type-level value of {@link kNativeTokenAgeGroupReceived}, for use in array-bound positions.
 * @hidden
 */
export type kNativeTokenAgeGroupReceived = 2;

export const kNativeTokenAgeNumGroups = 3n;
/**
 * Type-level value of {@link kNativeTokenAgeNumGroups}, for use in array-bound positions.
 * @hidden
 */
export type kNativeTokenAgeNumGroups = 3;

export interface NativeTokenAge {
  address: proto.ContractAddress;
  /** XDR: `uint128_xdr num_native_tokens[kNativeTokenAgeNumGroups]` — exactly {@link kNativeTokenAgeNumGroups} elements. */
  num_native_tokens: FixedArray<proto.uint128_xdr, proto.kNativeTokenAgeNumGroups>;
  /** XDR: `BlockHeight average_ages[kNativeTokenAgeNumGroups]` — exactly {@link kNativeTokenAgeNumGroups} elements. */
  average_ages: FixedArray<proto.BlockHeight, proto.kNativeTokenAgeNumGroups>;
}

/** XDR: `typedef NativeTokenAge NativeTokenAgeBatch<>`. */
export type NativeTokenAgeBatch = proto.NativeTokenAge[] & { readonly __brand: { readonly NativeTokenAgeBatch: true } };
export function nativeTokenAgeBatch(val: proto.NativeTokenAge[]): NativeTokenAgeBatch {
  return val as NativeTokenAgeBatch;
}

export type NativeTokenAgeResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; native_token_age: proto.NativeTokenAge }
  | { result: number }
;

/** XDR: `typedef NativeTokenAgeResult NativeTokenAgeResults<>`. */
export type NativeTokenAgeResults = proto.NativeTokenAgeResult[] & { readonly __brand: { readonly NativeTokenAgeResults: true } };
export function nativeTokenAgeResults(val: proto.NativeTokenAgeResult[]): NativeTokenAgeResults {
  return val as NativeTokenAgeResults;
}

export type DbAddressAuthDataBatchResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; address_auth_data_batch: proto.AddressAuthData[] }
  | { result: number }
;

export interface DbBlockOk {
  storage_hash: proto.StorageShortHash;
  storage_long_hash: proto.StorageLongHash;
  config_hash_preimage: proto.ConfigHashPreimage;
}

export type DbBlockResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; block: proto.DbBlockOk }
  | { result: number }
;

export enum DbShardResult {
  ShardOK = 0,
}

export type DbTipResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; db_tip: proto.DbTip }
  | { result: number }
;


export interface dbsched_get_address_auth_data_args {
  arg0: proto.BlockID;
  arg1: proto.ContractAddressBatch;
}

export interface dbsched_create_snapshot_args {
  arg0: proto.BlockID;
  arg1: proto.BlockID;
  arg2: proto.BlockExecutionMode;
}

export interface dbsched_commit_snapshot_args {
  arg0: proto.BlockID;
  arg1: proto.ConsensusValue;
}

export interface dbsched_load_genesis_configuration_args {
  arg0: proto.GenesisConfiguration;
  arg1: proto.ConsensusValue;
}


//
// XDR Codecs below this point
//

const _DbSchedResult: XdrCodec<DbSchedResult> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DbSchedResult; },
};

const _NativeTokenAge: XdrCodec<NativeTokenAge> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    FixedArrayCodec(proto.codec.uint128_xdr, Number(proto.kNativeTokenAgeNumGroups)).encode(w, val.num_native_tokens);
    FixedArrayCodec(proto.codec.BlockHeight, Number(proto.kNativeTokenAgeNumGroups)).encode(w, val.average_ages);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const num_native_tokens = FixedArrayCodec(proto.codec.uint128_xdr, Number(proto.kNativeTokenAgeNumGroups)).decode(r) as FixedArray<proto.uint128_xdr, proto.kNativeTokenAgeNumGroups>;
    const average_ages = FixedArrayCodec(proto.codec.BlockHeight, Number(proto.kNativeTokenAgeNumGroups)).decode(r) as FixedArray<proto.BlockHeight, proto.kNativeTokenAgeNumGroups>;
    return { address, num_native_tokens, average_ages };
  },
};

const _NativeTokenAgeBatch = VarArrayCodec(() => proto.codec.NativeTokenAge, Number(0xFFFFFFFF)) as XdrCodec<NativeTokenAgeBatch>;

const _NativeTokenAgeResult: XdrCodec<NativeTokenAgeResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
      {
        const v = val as { result: number; native_token_age: proto.NativeTokenAge };
        if (v.native_token_age === undefined) {
          throw new Error("NativeTokenAgeResult encode: native_token_age is undefined");
        }
        proto.codec.NativeTokenAge.encode(w, v.native_token_age);
        break;
      }
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const native_token_age = proto.codec.NativeTokenAge.decode(r);
        return { result, native_token_age };
      default:
        return { result };
    }
  },
};

const _NativeTokenAgeResults = VarArrayCodec(() => proto.codec.NativeTokenAgeResult, Number(0xFFFFFFFF)) as XdrCodec<NativeTokenAgeResults>;

const _DbAddressAuthDataBatchResult: XdrCodec<DbAddressAuthDataBatchResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
      {
        const v = val as { result: number; address_auth_data_batch: proto.AddressAuthData[] };
        if (v.address_auth_data_batch === undefined) {
          throw new Error("DbAddressAuthDataBatchResult encode: address_auth_data_batch is undefined");
        }
        VarArrayCodec(proto.codec.AddressAuthData, Number(0xFFFFFFFF)).encode(w, v.address_auth_data_batch);
        break;
      }
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const address_auth_data_batch = VarArrayCodec(proto.codec.AddressAuthData, Number(0xFFFFFFFF)).decode(r);
        return { result, address_auth_data_batch };
      default:
        return { result };
    }
  },
};

const _DbBlockOk: XdrCodec<DbBlockOk> = {
  encode(w, val) {
    proto.codec.StorageShortHash.encode(w, val.storage_hash);
    proto.codec.StorageLongHash.encode(w, val.storage_long_hash);
    proto.codec.ConfigHashPreimage.encode(w, val.config_hash_preimage);
  },
  decode(r) {
    const storage_hash = proto.codec.StorageShortHash.decode(r);
    const storage_long_hash = proto.codec.StorageLongHash.decode(r);
    const config_hash_preimage = proto.codec.ConfigHashPreimage.decode(r);
    return { storage_hash, storage_long_hash, config_hash_preimage };
  },
};

const _DbBlockResult: XdrCodec<DbBlockResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
      {
        const v = val as { result: number; block: proto.DbBlockOk };
        if (v.block === undefined) {
          throw new Error("DbBlockResult encode: block is undefined");
        }
        proto.codec.DbBlockOk.encode(w, v.block);
        break;
      }
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const block = proto.codec.DbBlockOk.decode(r);
        return { result, block };
      default:
        return { result };
    }
  },
};

const _DbShardResult: XdrCodec<DbShardResult> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DbShardResult; },
};

const _DbTipResult: XdrCodec<DbTipResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
      {
        const v = val as { result: number; db_tip: proto.DbTip };
        if (v.db_tip === undefined) {
          throw new Error("DbTipResult encode: db_tip is undefined");
        }
        proto.codec.DbTip.encode(w, v.db_tip);
        break;
      }
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const db_tip = proto.codec.DbTip.decode(r);
        return { result, db_tip };
      default:
        return { result };
    }
  },
};

const _dbsched_get_address_auth_data_args: XdrCodec<dbsched_get_address_auth_data_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.ContractAddressBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.ContractAddressBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _dbsched_create_snapshot_args: XdrCodec<dbsched_create_snapshot_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.BlockID.encode(w, val.arg1);
    proto.codec.BlockExecutionMode.encode(w, val.arg2);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.BlockID.decode(r);
    const arg2 = proto.codec.BlockExecutionMode.decode(r);
    return { arg0, arg1, arg2 };
  },
};

const _dbsched_commit_snapshot_args: XdrCodec<dbsched_commit_snapshot_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.ConsensusValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.ConsensusValue.decode(r);
    return { arg0, arg1 };
  },
};

const _dbsched_load_genesis_configuration_args: XdrCodec<dbsched_load_genesis_configuration_args> = {
  encode(w, val) {
    proto.codec.GenesisConfiguration.encode(w, val.arg0);
    proto.codec.ConsensusValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.GenesisConfiguration.decode(r);
    const arg1 = proto.codec.ConsensusValue.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  DbSchedResult: _DbSchedResult,
  NativeTokenAge: _NativeTokenAge,
  NativeTokenAgeBatch: _NativeTokenAgeBatch,
  NativeTokenAgeResult: _NativeTokenAgeResult,
  NativeTokenAgeResults: _NativeTokenAgeResults,
  DbAddressAuthDataBatchResult: _DbAddressAuthDataBatchResult,
  DbBlockOk: _DbBlockOk,
  DbBlockResult: _DbBlockResult,
  DbShardResult: _DbShardResult,
  DbTipResult: _DbTipResult,
} as const;

export const DbSchedProgram: RpcProgramMeta = {
  programId: 0x88887ee7,
  version: 1,
  methods: {
    dbsched_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    dbsched_get_address_auth_data: { proc: 1, request: () => _dbsched_get_address_auth_data_args, response: () => _DbAddressAuthDataBatchResult },
    dbsched_get_native_token_ages: { proc: 2, request: () => proto.codec.ContractAddressBatch as XdrCodec<proto.ContractAddressBatch>, response: () => _NativeTokenAgeResults },
    dbsched_write_native_token_ages: { proc: 3, request: () => _NativeTokenAgeBatch, response: () => _DbSchedResult },
    dbsched_create_snapshot: { proc: 5, request: () => _dbsched_create_snapshot_args, response: () => _DbSchedResult },
    dbsched_commit_snapshot: { proc: 6, request: () => _dbsched_commit_snapshot_args, response: () => _DbBlockResult },
    dbsched_close_snapshot: { proc: 7, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => _DbBlockResult },
    dbsched_abandon_snapshot: { proc: 8, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => _DbSchedResult },
    dbsched_load_genesis_configuration: { proc: 9, request: () => _dbsched_load_genesis_configuration_args, response: () => _DbSchedResult },
    dbsched_get_tip: { proc: 10, request: () => VoidCodec, response: () => _DbTipResult },
  },
};

