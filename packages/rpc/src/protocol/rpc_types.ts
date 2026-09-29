// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 445ff7bb6fa8c182d33ef0d939ea8c869b7bf4ce

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type BlockID = bigint & { readonly __brand: { readonly BlockID: true } };
export function blockID(val: bigint): BlockID {
  return val as BlockID;
}

export interface BlockExecutionContext {
  block_height: proto.BlockHeight;
  block_timepoint: proto.TimePoint;
}

export interface DbTip {
  id: proto.BlockID;
  storage_long_hash: proto.StorageLongHash;
  value: proto.ConsensusValue;
  default_wallet: proto.DeployedContractHash;
  network_config: proto.NetworkConfig;
}

export type TransactionID = bigint & { readonly __brand: { readonly TransactionID: true } };
export function transactionID(val: bigint): TransactionID {
  return val as TransactionID;
}

export enum RPCError {
  kRPCNone = 0,
  kRPCNotFound = 1,
  kRPCBadBlockID = 3,
  kRPCStorageWriteFailed = 4,
  kRPCTransactionFailed = 5,
  kRPCUnimplemented = 6,
  kRPCUnrecoverable = 7,
}

export enum BlockExecutionMode {
  kBlockExecutionModeValidation = 0,
  kBlockExecutionModeProposal = 1,
  kBlockExecutionModeViewing = 2,
}

export type StorageCost = (NonNullable<proto.int128_xdr> & { readonly __brand: { readonly StorageCost: true } }) | Extract<proto.int128_xdr, null>;
export function storageCost(val: proto.int128_xdr): StorageCost {
  return val as StorageCost;
}

export type ExpectedStorageCost =
  | { error: proto.RPCError.kRPCNone; storage_cost: proto.StorageCost }
  | { error: number }
;

export type ExpectedContract =
  | { error: proto.RPCError.kRPCNone; contract: proto.Contract }
  | { error: number }
;

export type ExpectedDeployment =
  | { error: proto.RPCError.kRPCNone; deployed_hash: proto.DeployedContractHash }
  | { error: number }
;

export type ExpectedProposalData =
  | { error: proto.RPCError.kRPCNone; proposal_data: proto.NondeterministicProposalData }
  | { error: number }
;

export type ExpectedRetrocausalQueueBlock =
  | { error: proto.RPCError.kRPCNone; queue_block: proto.RetrocausalQueueBlock }
  | { error: number }
;

export type ExpectedQueueEntry =
  | { error: proto.RPCError.kRPCNone; queue_entry: proto.QueueEntry }
  | { error: number }
;

export type ExpectedDBTip =
  | { error: proto.RPCError.kRPCNone; db_tip: proto.DbTip }
  | { error: number }
;

export interface ViewingSnapshot {
  viewing_block_id: proto.BlockID;
  tip: proto.DbTip;
}

export type ExpectedViewingSnapshot =
  | { error: proto.RPCError.kRPCNone; snapshot: proto.ViewingSnapshot }
  | { error: number }
;

/** XDR: `typedef ContractAddress ContractAddressBatch<>`. */
export type ContractAddressBatch = proto.ContractAddress[] & { readonly __brand: { readonly ContractAddressBatch: true } };
export function contractAddressBatch(val: proto.ContractAddress[]): ContractAddressBatch {
  return val as ContractAddressBatch;
}


//
// XDR Codecs below this point
//

const _BlockID: XdrCodec<BlockID> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return blockID(r.readUint64()); },
};

const _BlockExecutionContext: XdrCodec<BlockExecutionContext> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.TimePoint.encode(w, val.block_timepoint);
  },
  decode(r) {
    const block_height = proto.codec.BlockHeight.decode(r);
    const block_timepoint = proto.codec.TimePoint.decode(r);
    return { block_height, block_timepoint };
  },
};

const _DbTip: XdrCodec<DbTip> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.id);
    proto.codec.StorageLongHash.encode(w, val.storage_long_hash);
    proto.codec.ConsensusValue.encode(w, val.value);
    proto.codec.DeployedContractHash.encode(w, val.default_wallet);
    proto.codec.NetworkConfig.encode(w, val.network_config);
  },
  decode(r) {
    const id = proto.codec.BlockID.decode(r);
    const storage_long_hash = proto.codec.StorageLongHash.decode(r);
    const value = proto.codec.ConsensusValue.decode(r);
    const default_wallet = proto.codec.DeployedContractHash.decode(r);
    const network_config = proto.codec.NetworkConfig.decode(r);
    return { id, storage_long_hash, value, default_wallet, network_config };
  },
};

const _TransactionID: XdrCodec<TransactionID> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return transactionID(r.readUint64()); },
};

const _RPCError: XdrCodec<RPCError> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as RPCError; },
};

const _BlockExecutionMode: XdrCodec<BlockExecutionMode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as BlockExecutionMode; },
};

const _StorageCost: XdrCodec<StorageCost> = {
  encode(w, val) { proto.codec.int128_xdr.encode(w, val); },
  decode(r) { return storageCost(proto.codec.int128_xdr.decode(r)); },
};

const _ExpectedStorageCost: XdrCodec<ExpectedStorageCost> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; storage_cost: proto.StorageCost };
        if (v.storage_cost === undefined) {
          throw new Error("ExpectedStorageCost encode: storage_cost is undefined");
        }
        proto.codec.StorageCost.encode(w, v.storage_cost);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const storage_cost = proto.codec.StorageCost.decode(r);
        return { error, storage_cost };
      default:
        return { error };
    }
  },
};

const _ExpectedContract: XdrCodec<ExpectedContract> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; contract: proto.Contract };
        if (v.contract === undefined) {
          throw new Error("ExpectedContract encode: contract is undefined");
        }
        proto.codec.Contract.encode(w, v.contract);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const contract = proto.codec.Contract.decode(r);
        return { error, contract };
      default:
        return { error };
    }
  },
};

const _ExpectedDeployment: XdrCodec<ExpectedDeployment> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; deployed_hash: proto.DeployedContractHash };
        if (v.deployed_hash === undefined) {
          throw new Error("ExpectedDeployment encode: deployed_hash is undefined");
        }
        proto.codec.DeployedContractHash.encode(w, v.deployed_hash);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const deployed_hash = proto.codec.DeployedContractHash.decode(r);
        return { error, deployed_hash };
      default:
        return { error };
    }
  },
};

const _ExpectedProposalData: XdrCodec<ExpectedProposalData> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; proposal_data: proto.NondeterministicProposalData };
        if (v.proposal_data === undefined) {
          throw new Error("ExpectedProposalData encode: proposal_data is undefined");
        }
        proto.codec.NondeterministicProposalData.encode(w, v.proposal_data);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const proposal_data = proto.codec.NondeterministicProposalData.decode(r);
        return { error, proposal_data };
      default:
        return { error };
    }
  },
};

const _ExpectedRetrocausalQueueBlock: XdrCodec<ExpectedRetrocausalQueueBlock> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; queue_block: proto.RetrocausalQueueBlock };
        if (v.queue_block === undefined) {
          throw new Error("ExpectedRetrocausalQueueBlock encode: queue_block is undefined");
        }
        proto.codec.RetrocausalQueueBlock.encode(w, v.queue_block);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const queue_block = proto.codec.RetrocausalQueueBlock.decode(r);
        return { error, queue_block };
      default:
        return { error };
    }
  },
};

const _ExpectedQueueEntry: XdrCodec<ExpectedQueueEntry> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; queue_entry: proto.QueueEntry };
        if (v.queue_entry === undefined) {
          throw new Error("ExpectedQueueEntry encode: queue_entry is undefined");
        }
        proto.codec.QueueEntry.encode(w, v.queue_entry);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const queue_entry = proto.codec.QueueEntry.decode(r);
        return { error, queue_entry };
      default:
        return { error };
    }
  },
};

const _ExpectedDBTip: XdrCodec<ExpectedDBTip> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; db_tip: proto.DbTip };
        if (v.db_tip === undefined) {
          throw new Error("ExpectedDBTip encode: db_tip is undefined");
        }
        proto.codec.DbTip.encode(w, v.db_tip);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const db_tip = proto.codec.DbTip.decode(r);
        return { error, db_tip };
      default:
        return { error };
    }
  },
};

const _ViewingSnapshot: XdrCodec<ViewingSnapshot> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.viewing_block_id);
    proto.codec.DbTip.encode(w, val.tip);
  },
  decode(r) {
    const viewing_block_id = proto.codec.BlockID.decode(r);
    const tip = proto.codec.DbTip.decode(r);
    return { viewing_block_id, tip };
  },
};

const _ExpectedViewingSnapshot: XdrCodec<ExpectedViewingSnapshot> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; snapshot: proto.ViewingSnapshot };
        if (v.snapshot === undefined) {
          throw new Error("ExpectedViewingSnapshot encode: snapshot is undefined");
        }
        proto.codec.ViewingSnapshot.encode(w, v.snapshot);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const snapshot = proto.codec.ViewingSnapshot.decode(r);
        return { error, snapshot };
      default:
        return { error };
    }
  },
};

const _ContractAddressBatch = VarArrayCodec(() => proto.codec.ContractAddress, Number(0xFFFFFFFF)) as XdrCodec<ContractAddressBatch>;

export const codec = {
  BlockID: _BlockID,
  BlockExecutionContext: _BlockExecutionContext,
  DbTip: _DbTip,
  TransactionID: _TransactionID,
  RPCError: _RPCError,
  BlockExecutionMode: _BlockExecutionMode,
  StorageCost: _StorageCost,
  ExpectedStorageCost: _ExpectedStorageCost,
  ExpectedContract: _ExpectedContract,
  ExpectedDeployment: _ExpectedDeployment,
  ExpectedProposalData: _ExpectedProposalData,
  ExpectedRetrocausalQueueBlock: _ExpectedRetrocausalQueueBlock,
  ExpectedQueueEntry: _ExpectedQueueEntry,
  ExpectedDBTip: _ExpectedDBTip,
  ViewingSnapshot: _ViewingSnapshot,
  ExpectedViewingSnapshot: _ExpectedViewingSnapshot,
  ContractAddressBatch: _ContractAddressBatch,
} as const;

