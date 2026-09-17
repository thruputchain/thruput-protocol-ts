// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5135a63d54ca836265b87b8475a9c06f4d4624e4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum DbSchedResult {
  DbSchedResultOK = 0,
  DbSchedResultError = 1,
  DbSchedResultInvalidParentId = 2,
}

export const kHogAgeGroupToSchedule = 0n;
/**
 * Type-level value of {@link kHogAgeGroupToSchedule}, for use in array-bound positions.
 * @hidden
 */
export type kHogAgeGroupToSchedule = 0;

export const kHogAgeGroupAlreadyScheduled = 1n;
/**
 * Type-level value of {@link kHogAgeGroupAlreadyScheduled}, for use in array-bound positions.
 * @hidden
 */
export type kHogAgeGroupAlreadyScheduled = 1;

export const kHogAgeGroupReceived = 2n;
/**
 * Type-level value of {@link kHogAgeGroupReceived}, for use in array-bound positions.
 * @hidden
 */
export type kHogAgeGroupReceived = 2;

export const kHogAgeNumGroups = 3n;
/**
 * Type-level value of {@link kHogAgeNumGroups}, for use in array-bound positions.
 * @hidden
 */
export type kHogAgeNumGroups = 3;

export interface HogAge {
  address: proto.ContractAddress;
  /** XDR: `uint128_xdr num_hogs[kHogAgeNumGroups]` — exactly {@link kHogAgeNumGroups} elements. */
  num_hogs: FixedArray<proto.uint128_xdr, proto.kHogAgeNumGroups>;
  /** XDR: `BlockHeight average_ages[kHogAgeNumGroups]` — exactly {@link kHogAgeNumGroups} elements. */
  average_ages: FixedArray<proto.BlockHeight, proto.kHogAgeNumGroups>;
}

/** XDR: `typedef HogAge HogAgeBatch<>`. */
export type HogAgeBatch = proto.HogAge[] & { readonly __brand: { readonly HogAgeBatch: true } };
export function hogAgeBatch(val: proto.HogAge[]): HogAgeBatch {
  return val as HogAgeBatch;
}

export type HogAgeResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; hog_age: proto.HogAge }
  | { result: number }
;

/** XDR: `typedef HogAgeResult HogAgeResults<>`. */
export type HogAgeResults = proto.HogAgeResult[] & { readonly __brand: { readonly HogAgeResults: true } };
export function hogAgeResults(val: proto.HogAgeResult[]): HogAgeResults {
  return val as HogAgeResults;
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

const _HogAge: XdrCodec<HogAge> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    FixedArrayCodec(proto.codec.uint128_xdr, Number(proto.kHogAgeNumGroups)).encode(w, val.num_hogs);
    FixedArrayCodec(proto.codec.BlockHeight, Number(proto.kHogAgeNumGroups)).encode(w, val.average_ages);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const num_hogs = FixedArrayCodec(proto.codec.uint128_xdr, Number(proto.kHogAgeNumGroups)).decode(r) as FixedArray<proto.uint128_xdr, proto.kHogAgeNumGroups>;
    const average_ages = FixedArrayCodec(proto.codec.BlockHeight, Number(proto.kHogAgeNumGroups)).decode(r) as FixedArray<proto.BlockHeight, proto.kHogAgeNumGroups>;
    return { address, num_hogs, average_ages };
  },
};

const _HogAgeBatch = VarArrayCodec(() => proto.codec.HogAge, Number(0xFFFFFFFF)) as XdrCodec<HogAgeBatch>;

const _HogAgeResult: XdrCodec<HogAgeResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
      {
        const v = val as { result: number; hog_age: proto.HogAge };
        if (v.hog_age === undefined) {
          throw new Error("HogAgeResult encode: hog_age is undefined");
        }
        proto.codec.HogAge.encode(w, v.hog_age);
        break;
      }
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const hog_age = proto.codec.HogAge.decode(r);
        return { result, hog_age };
      default:
        return { result };
    }
  },
};

const _HogAgeResults = VarArrayCodec(() => proto.codec.HogAgeResult, Number(0xFFFFFFFF)) as XdrCodec<HogAgeResults>;

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
  HogAge: _HogAge,
  HogAgeBatch: _HogAgeBatch,
  HogAgeResult: _HogAgeResult,
  HogAgeResults: _HogAgeResults,
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
    dbsched_get_hog_ages: { proc: 2, request: () => proto.codec.ContractAddressBatch as XdrCodec<proto.ContractAddressBatch>, response: () => _HogAgeResults },
    dbsched_write_hog_ages: { proc: 3, request: () => _HogAgeBatch, response: () => _DbSchedResult },
    dbsched_create_snapshot: { proc: 5, request: () => _dbsched_create_snapshot_args, response: () => _DbSchedResult },
    dbsched_commit_snapshot: { proc: 6, request: () => _dbsched_commit_snapshot_args, response: () => _DbBlockResult },
    dbsched_close_snapshot: { proc: 7, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => _DbBlockResult },
    dbsched_abandon_snapshot: { proc: 8, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => _DbSchedResult },
    dbsched_load_genesis_configuration: { proc: 9, request: () => _dbsched_load_genesis_configuration_args, response: () => _DbSchedResult },
    dbsched_get_tip: { proc: 10, request: () => VoidCodec, response: () => _DbTipResult },
  },
};

