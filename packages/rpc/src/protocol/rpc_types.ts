// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export type BlockID = bigint & { readonly __brand: "BlockID" };
export function blockID(val: bigint): BlockID {
  return val as BlockID;
}

export interface DbTip {
  height: proto.BlockHeight;
  block_hash: proto.BlockHash;
  db_hash: proto.DbHash;
  id: proto.BlockID;
}

export type TransactionID = bigint & { readonly __brand: "TransactionID" };
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
}

export type StorageCost = proto.int128_xdr & { readonly __brand: "StorageCost" };
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

export type ExpectedStorageItem =
  | { error: proto.RPCError.kRPCNone; item: proto.WireStorageItem }
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

export type ContractAddressBatch = proto.ContractAddress[] & { readonly __brand: "ContractAddressBatch" };
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

const _DbTip: XdrCodec<DbTip> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.height);
    proto.codec.BlockHash.encode(w, val.block_hash);
    proto.codec.DbHash.encode(w, val.db_hash);
    proto.codec.BlockID.encode(w, val.id);
  },
  decode(r) {
    const height = proto.codec.BlockHeight.decode(r);
    const block_hash = proto.codec.BlockHash.decode(r);
    const db_hash = proto.codec.DbHash.decode(r);
    const id = proto.codec.BlockID.decode(r);
    return { height, block_hash, db_hash, id };
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

const _ExpectedStorageItem: XdrCodec<ExpectedStorageItem> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; item: proto.WireStorageItem };
        if (v.item === undefined) {
          throw new Error("ExpectedStorageItem encode: item is undefined");
        }
        proto.codec.WireStorageItem.encode(w, v.item);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const item = proto.codec.WireStorageItem.decode(r);
        return { error, item };
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

const _ContractAddressBatch = VarArrayCodec(() => proto.codec.ContractAddress, Number(0xFFFFFFFF)) as XdrCodec<ContractAddressBatch>;

export const codec = {
  BlockID: _BlockID,
  DbTip: _DbTip,
  TransactionID: _TransactionID,
  RPCError: _RPCError,
  BlockExecutionMode: _BlockExecutionMode,
  StorageCost: _StorageCost,
  ExpectedStorageCost: _ExpectedStorageCost,
  ExpectedContract: _ExpectedContract,
  ExpectedDeployment: _ExpectedDeployment,
  ExpectedProposalData: _ExpectedProposalData,
  ExpectedStorageItem: _ExpectedStorageItem,
  ExpectedRetrocausalQueueBlock: _ExpectedRetrocausalQueueBlock,
  ExpectedQueueEntry: _ExpectedQueueEntry,
  ExpectedDBTip: _ExpectedDBTip,
  ContractAddressBatch: _ContractAddressBatch,
} as const;

