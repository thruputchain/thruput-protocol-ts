// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export type ExecProposeResult =
  | { result: proto.ExecResult.ExecResultOK; proposal_data: proto.NondeterministicProposalData }
  | { result: proto.ExecResult.ExecResultTxDeterministicError; proposal_data: proto.NondeterministicProposalData }
  | { result: proto.ExecResult.ExecResultTxRootFrameReverted; proposal_data: proto.NondeterministicProposalData }
  | { result: number }
;

export type ProposedTransactionBatch = proto.ProposedTransaction[] & { readonly __brand: "ProposedTransactionBatch" };
export function proposedTransactionBatch(val: proto.ProposedTransaction[]): ProposedTransactionBatch {
  return val as ProposedTransactionBatch;
}

export type ExecProposeBatchResult = proto.ExecProposeResult[] & { readonly __brand: "ExecProposeBatchResult" };
export function execProposeBatchResult(val: proto.ExecProposeResult[]): ExecProposeBatchResult {
  return val as ExecProposeBatchResult;
}

export type ExecValidateBatchResult = proto.ExecResult[] & { readonly __brand: "ExecValidateBatchResult" };
export function execValidateBatchResult(val: proto.ExecResult[]): ExecValidateBatchResult {
  return val as ExecValidateBatchResult;
}


export interface executorsched_propose_transaction_args {
  BlockID: proto.BlockID;
  Transaction: proto.Transaction;
}

export interface executorsched_validate_transaction_args {
  BlockID: proto.BlockID;
  ProposedTransaction: proto.ProposedTransaction;
}

export interface executorsched_propose_batch_args {
  BlockID: proto.BlockID;
  TransactionBatch: proto.TransactionBatch;
}

export interface executorsched_validate_batch_args {
  BlockID: proto.BlockID;
  ProposedTransactionBatch: proto.ProposedTransactionBatch;
}


//
// XDR Codecs below this point
//

const _ExecProposeResult: XdrCodec<ExecProposeResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.result));
    switch (val.result) {
      case proto.ExecResult.ExecResultOK:
      case proto.ExecResult.ExecResultTxDeterministicError:
      case proto.ExecResult.ExecResultTxRootFrameReverted:
        proto.codec.NondeterministicProposalData.encode(w, val.proposal_data);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.ExecResult.ExecResultOK:
      case proto.ExecResult.ExecResultTxDeterministicError:
      case proto.ExecResult.ExecResultTxRootFrameReverted:
        const proposal_data = proto.codec.NondeterministicProposalData.decode(r);
        return { result, proposal_data };
      default:
        return { result } as ExecProposeResult;
    }
  },
};

const _ProposedTransactionBatch: XdrCodec<ProposedTransactionBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.ProposedTransaction.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return proposedTransactionBatch(Array.from({ length: _len }, () => proto.codec.ProposedTransaction.decode(r)));
  },
};

const _ExecProposeBatchResult: XdrCodec<ExecProposeBatchResult> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.ExecProposeResult.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return execProposeBatchResult(Array.from({ length: _len }, () => proto.codec.ExecProposeResult.decode(r)));
  },
};

const _ExecValidateBatchResult: XdrCodec<ExecValidateBatchResult> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.ExecResult.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return execValidateBatchResult(Array.from({ length: _len }, () => proto.codec.ExecResult.decode(r)));
  },
};

const _executorsched_propose_transaction_args: XdrCodec<executorsched_propose_transaction_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.Transaction.encode(w, val.Transaction);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const Transaction = proto.codec.Transaction.decode(r);
    return { BlockID, Transaction };
  },
};

const _executorsched_validate_transaction_args: XdrCodec<executorsched_validate_transaction_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.ProposedTransaction.encode(w, val.ProposedTransaction);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const ProposedTransaction = proto.codec.ProposedTransaction.decode(r);
    return { BlockID, ProposedTransaction };
  },
};

const _executorsched_propose_batch_args: XdrCodec<executorsched_propose_batch_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.TransactionBatch.encode(w, val.TransactionBatch);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const TransactionBatch = proto.codec.TransactionBatch.decode(r);
    return { BlockID, TransactionBatch };
  },
};

const _executorsched_validate_batch_args: XdrCodec<executorsched_validate_batch_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.ProposedTransactionBatch.encode(w, val.ProposedTransactionBatch);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const ProposedTransactionBatch = proto.codec.ProposedTransactionBatch.decode(r);
    return { BlockID, ProposedTransactionBatch };
  },
};

export const codec = {
  ExecProposeResult: _ExecProposeResult,
  ProposedTransactionBatch: _ProposedTransactionBatch,
  ExecProposeBatchResult: _ExecProposeBatchResult,
  ExecValidateBatchResult: _ExecValidateBatchResult,
  executorsched_propose_transaction_args: _executorsched_propose_transaction_args,
  executorsched_validate_transaction_args: _executorsched_validate_transaction_args,
  executorsched_propose_batch_args: _executorsched_propose_batch_args,
  executorsched_validate_batch_args: _executorsched_validate_batch_args,
} as const;

export const ExecutorSchedProgram: RpcProgramMeta = {
  programId: 0x7ee79999,
  version: 1,
  methods: {
    executorsched_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    executorsched_ready: { proc: 1, request: VoidCodec, response: proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_propose_transaction: { proc: 10, request: _executorsched_propose_transaction_args, response: _ExecProposeResult },
    executorsched_validate_transaction: { proc: 20, request: _executorsched_validate_transaction_args, response: proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_propose_batch: { proc: 11, request: _executorsched_propose_batch_args, response: _ExecProposeBatchResult },
    executorsched_validate_batch: { proc: 21, request: _executorsched_validate_batch_args, response: _ExecValidateBatchResult },
    executorsched_open_proposal_block: { proc: 30, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_open_validation_block: { proc: 40, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_finish_block: { proc: 50, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_shutdown: { proc: 60, request: VoidCodec, response: VoidCodec },
  },
};

