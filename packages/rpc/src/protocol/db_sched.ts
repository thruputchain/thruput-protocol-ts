// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export enum DbSchedResult {
  DbSchedResultOK = 0,
  DbSchedResultError = 1,
}

export const kHogAgeGroupToSchedule = 0n;

export const kHogAgeGroupAlreadyScheduled = 1n;

export const kHogAgeGroupReceived = 2n;

export const kHogAgeNumGroups = 3n;

export interface HogAge {
  address: proto.ContractAddress;
  num_hogs: proto.uint128_xdr[];
  average_ages: proto.BlockHeight[];
}

export type HogAgeBatch = proto.HogAge[] & { readonly __brand: "HogAgeBatch" };
export function hogAgeBatch(val: proto.HogAge[]): HogAgeBatch {
  return val as HogAgeBatch;
}

export type HogAgeResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; hog_age_batch: proto.HogAgeBatch }
  | { result: number }
;

export type DbAddressAuthDataBatchResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; address_auth_data_batch: proto.AddressAuthData[] }
  | { result: number }
;

export type DbBlockResult =
  | { result: proto.DbSchedResult.DbSchedResultOK; db_hash: proto.DbHash }
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
  BlockID: proto.BlockID;
  ContractAddressBatch: proto.ContractAddressBatch;
}

export interface dbsched_create_snapshot_args {
  BlockID: proto.BlockID;
  BlockID2: proto.BlockID;
  BlockExecutionMode: proto.BlockExecutionMode;
}

export interface dbsched_commit_snapshot_args {
  BlockID: proto.BlockID;
  BlockHash: proto.BlockHash;
}

export interface dbsched_load_genesis_configuration_args {
  GenesisConfiguration: proto.GenesisConfiguration;
  unsigned hyper: bigint;
  SHA256Hash: proto.SHA256Hash;
  SHA256Hash2: proto.SHA256Hash;
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
    for (const _item of val.num_hogs) proto.codec.uint128_xdr.encode(w, _item);
    for (const _item of val.average_ages) proto.codec.BlockHeight.encode(w, _item);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const num_hogs = Array.from({ length: Number(proto.kHogAgeNumGroups) }, () => proto.codec.uint128_xdr.decode(r));
    const average_ages = Array.from({ length: Number(proto.kHogAgeNumGroups) }, () => proto.codec.BlockHeight.decode(r));
    return { address, num_hogs, average_ages };
  },
};

const _HogAgeBatch: XdrCodec<HogAgeBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.HogAge.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return hogAgeBatch(Array.from({ length: _len }, () => proto.codec.HogAge.decode(r)));
  },
};

const _HogAgeResult: XdrCodec<HogAgeResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
        proto.codec.HogAgeBatch.encode(w, val.hog_age_batch);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const hog_age_batch = proto.codec.HogAgeBatch.decode(r);
        return { result, hog_age_batch };
      default:
        return { result } as HogAgeResult;
    }
  },
};

const _DbAddressAuthDataBatchResult: XdrCodec<DbAddressAuthDataBatchResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
        w.writeUint32(BigInt(val.address_auth_data_batch.length));
        for (const _item of val.address_auth_data_batch) proto.codec.AddressAuthData.encode(w, _item);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const _address_auth_data_batch_len = Number(r.readUint32());
        const address_auth_data_batch = Array.from({ length: _address_auth_data_batch_len }, () => proto.codec.AddressAuthData.decode(r));
        return { result, address_auth_data_batch };
      default:
        return { result } as DbAddressAuthDataBatchResult;
    }
  },
};

const _DbBlockResult: XdrCodec<DbBlockResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.DbSchedResult.DbSchedResultOK:
        proto.codec.DbHash.encode(w, val.db_hash);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const db_hash = proto.codec.DbHash.decode(r);
        return { result, db_hash };
      default:
        return { result } as DbBlockResult;
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
        proto.codec.DbTip.encode(w, val.db_tip);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.DbSchedResult.DbSchedResultOK:
        const db_tip = proto.codec.DbTip.decode(r);
        return { result, db_tip };
      default:
        return { result } as DbTipResult;
    }
  },
};

const _dbsched_get_address_auth_data_args: XdrCodec<dbsched_get_address_auth_data_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.ContractAddressBatch.encode(w, val.ContractAddressBatch);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const ContractAddressBatch = proto.codec.ContractAddressBatch.decode(r);
    return { BlockID, ContractAddressBatch };
  },
};

const _dbsched_create_snapshot_args: XdrCodec<dbsched_create_snapshot_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.BlockID.encode(w, val.BlockID2);
    proto.codec.BlockExecutionMode.encode(w, val.BlockExecutionMode);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const BlockID2 = proto.codec.BlockID.decode(r);
    const BlockExecutionMode = proto.codec.BlockExecutionMode.decode(r);
    return { BlockID, BlockID2, BlockExecutionMode };
  },
};

const _dbsched_commit_snapshot_args: XdrCodec<dbsched_commit_snapshot_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.BlockHash.encode(w, val.BlockHash);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const BlockHash = proto.codec.BlockHash.decode(r);
    return { BlockID, BlockHash };
  },
};

const _dbsched_load_genesis_configuration_args: XdrCodec<dbsched_load_genesis_configuration_args> = {
  encode(w, val) {
    proto.codec.GenesisConfiguration.encode(w, val.GenesisConfiguration);
    w.writeUint64(val.unsigned hyper);
    proto.codec.SHA256Hash.encode(w, val.SHA256Hash);
    proto.codec.SHA256Hash.encode(w, val.SHA256Hash2);
  },
  decode(r) {
    const GenesisConfiguration = proto.codec.GenesisConfiguration.decode(r);
    const unsigned hyper = r.readUint64();
    const SHA256Hash = proto.codec.SHA256Hash.decode(r);
    const SHA256Hash2 = proto.codec.SHA256Hash.decode(r);
    return { GenesisConfiguration, unsigned hyper, SHA256Hash, SHA256Hash2 };
  },
};

export const codec = {
  DbSchedResult: _DbSchedResult,
  HogAge: _HogAge,
  HogAgeBatch: _HogAgeBatch,
  HogAgeResult: _HogAgeResult,
  DbAddressAuthDataBatchResult: _DbAddressAuthDataBatchResult,
  DbBlockResult: _DbBlockResult,
  DbShardResult: _DbShardResult,
  DbTipResult: _DbTipResult,
  dbsched_get_address_auth_data_args: _dbsched_get_address_auth_data_args,
  dbsched_create_snapshot_args: _dbsched_create_snapshot_args,
  dbsched_commit_snapshot_args: _dbsched_commit_snapshot_args,
  dbsched_load_genesis_configuration_args: _dbsched_load_genesis_configuration_args,
} as const;

export const DbSchedProgram: RpcProgramMeta = {
  programId: 0x88887ee7,
  version: 1,
  methods: {
    dbsched_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    dbsched_get_address_auth_data: { proc: 1, request: _dbsched_get_address_auth_data_args, response: _DbAddressAuthDataBatchResult },
    dbsched_get_hog_ages: { proc: 2, request: proto.codec.ContractAddressBatch as XdrCodec<proto.ContractAddressBatch>, response: _HogAgeResult },
    dbsched_write_hog_ages: { proc: 3, request: _HogAgeBatch, response: _DbSchedResult },
    dbsched_create_snapshot: { proc: 5, request: _dbsched_create_snapshot_args, response: _DbSchedResult },
    dbsched_commit_snapshot: { proc: 6, request: _dbsched_commit_snapshot_args, response: _DbBlockResult },
    dbsched_close_snapshot: { proc: 7, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: _DbBlockResult },
    dbsched_abandon_snapshot: { proc: 8, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: _DbSchedResult },
    dbsched_load_genesis_configuration: { proc: 9, request: _dbsched_load_genesis_configuration_args, response: _DbSchedResult },
    dbsched_get_tip: { proc: 10, request: VoidCodec, response: _DbTipResult },
  },
};

