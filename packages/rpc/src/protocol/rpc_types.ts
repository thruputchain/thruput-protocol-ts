// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import type { XdrCodec } from "@groundhog/xdr";
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
;

export type ExpectedContract =
  | { error: proto.RPCError.kRPCNone; contract: proto.Contract }
;

export type ExpectedDeployment =
  | { error: proto.RPCError.kRPCNone; deployed_hash: proto.DeployedContractHash }
;

export type ExpectedProposalData =
  | { error: proto.RPCError.kRPCNone; proposal_data: proto.NondeterministicProposalData }
;

export type ExpectedStorageItem =
  | { error: proto.RPCError.kRPCNone; item: proto.WireStorageItem }
;

export type ExpectedRetrocausalQueueBlock =
  | { error: proto.RPCError.kRPCNone; queue_block: proto.RetrocausalQueueBlock }
;

export type ExpectedQueueEntry =
  | { error: proto.RPCError.kRPCNone; queue_entry: proto.QueueEntry }
;

export type ExpectedDBTip =
  | { error: proto.RPCError.kRPCNone; db_tip: proto.DbTip }
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
        proto.codec.StorageCost.encode(w, val.storage_cost);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const storage_cost = proto.codec.StorageCost.decode(r);
        return { error, storage_cost };
      default:
        return { error } as ExpectedStorageCost;
    }
  },
};

const _ExpectedContract: XdrCodec<ExpectedContract> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.Contract.encode(w, val.contract);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const contract = proto.codec.Contract.decode(r);
        return { error, contract };
      default:
        return { error } as ExpectedContract;
    }
  },
};

const _ExpectedDeployment: XdrCodec<ExpectedDeployment> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.DeployedContractHash.encode(w, val.deployed_hash);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const deployed_hash = proto.codec.DeployedContractHash.decode(r);
        return { error, deployed_hash };
      default:
        return { error } as ExpectedDeployment;
    }
  },
};

const _ExpectedProposalData: XdrCodec<ExpectedProposalData> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.NondeterministicProposalData.encode(w, val.proposal_data);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const proposal_data = proto.codec.NondeterministicProposalData.decode(r);
        return { error, proposal_data };
      default:
        return { error } as ExpectedProposalData;
    }
  },
};

const _ExpectedStorageItem: XdrCodec<ExpectedStorageItem> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.WireStorageItem.encode(w, val.item);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const item = proto.codec.WireStorageItem.decode(r);
        return { error, item };
      default:
        return { error } as ExpectedStorageItem;
    }
  },
};

const _ExpectedRetrocausalQueueBlock: XdrCodec<ExpectedRetrocausalQueueBlock> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.RetrocausalQueueBlock.encode(w, val.queue_block);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const queue_block = proto.codec.RetrocausalQueueBlock.decode(r);
        return { error, queue_block };
      default:
        return { error } as ExpectedRetrocausalQueueBlock;
    }
  },
};

const _ExpectedQueueEntry: XdrCodec<ExpectedQueueEntry> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.QueueEntry.encode(w, val.queue_entry);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const queue_entry = proto.codec.QueueEntry.decode(r);
        return { error, queue_entry };
      default:
        return { error } as ExpectedQueueEntry;
    }
  },
};

const _ExpectedDBTip: XdrCodec<ExpectedDBTip> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.DbTip.encode(w, val.db_tip);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const db_tip = proto.codec.DbTip.decode(r);
        return { error, db_tip };
      default:
        return { error } as ExpectedDBTip;
    }
  },
};

const _ContractAddressBatch: XdrCodec<ContractAddressBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.ContractAddress.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return contractAddressBatch(Array.from({ length: _len }, () => proto.codec.ContractAddress.decode(r)));
  },
};

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

