// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 445ff7bb6fa8c182d33ef0d939ea8c869b7bf4ce

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type ExecProposeResult =
  | { result: proto.ExecResult.ExecResultOK; proposal_data: proto.NondeterministicProposalData }
  | { result: proto.ExecResult.ExecResultTxDeterministicError; proposal_data: proto.NondeterministicProposalData }
  | { result: proto.ExecResult.ExecResultTxRootFrameReverted; proposal_data: proto.NondeterministicProposalData }
  | { result: number }
;

/** XDR: `typedef ExecProposeResult ExecProposeBatchResult<>`. */
export type ExecProposeBatchResult = proto.ExecProposeResult[] & { readonly __brand: { readonly ExecProposeBatchResult: true } };
export function execProposeBatchResult(val: proto.ExecProposeResult[]): ExecProposeBatchResult {
  return val as ExecProposeBatchResult;
}

/** XDR: `typedef ExecResult ExecValidateBatchResult<>`. */
export type ExecValidateBatchResult = proto.ExecResult[] & { readonly __brand: { readonly ExecValidateBatchResult: true } };
export function execValidateBatchResult(val: proto.ExecResult[]): ExecValidateBatchResult {
  return val as ExecValidateBatchResult;
}


export interface executorsched_propose_transaction_args {
  arg0: proto.BlockID;
  arg1: proto.SignedTransaction;
}

export interface executorsched_validate_transaction_args {
  arg0: proto.BlockID;
  arg1: proto.ProposedTransaction;
}

export interface executorsched_propose_batch_args {
  arg0: proto.BlockID;
  arg1: proto.SignedTransactionBatch;
}

export interface executorsched_validate_batch_args {
  arg0: proto.BlockID;
  arg1: proto.ProposedTransactionBatch;
}

export interface executorsched_open_proposal_block_args {
  arg0: proto.BlockID;
  arg1: proto.BlockExecutionContext;
}

export interface executorsched_open_validation_block_args {
  arg0: proto.BlockID;
  arg1: proto.BlockExecutionContext;
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
      {
        const v = val as { result: number; proposal_data: proto.NondeterministicProposalData };
        if (v.proposal_data === undefined) {
          throw new Error("ExecProposeResult encode: proposal_data is undefined");
        }
        proto.codec.NondeterministicProposalData.encode(w, v.proposal_data);
        break;
      }
    }
  },
  decode(r) {
    const result = Number(r.readInt32());
    switch (result) {
      case proto.ExecResult.ExecResultOK:
      case proto.ExecResult.ExecResultTxDeterministicError:
      case proto.ExecResult.ExecResultTxRootFrameReverted:
        const proposal_data = proto.codec.NondeterministicProposalData.decode(r);
        return { result, proposal_data } as ExecProposeResult;
      default:
        return { result };
    }
  },
};

const _ExecProposeBatchResult = VarArrayCodec(() => proto.codec.ExecProposeResult, Number(0xFFFFFFFF)) as XdrCodec<ExecProposeBatchResult>;

const _ExecValidateBatchResult = VarArrayCodec(() => proto.codec.ExecResult, Number(0xFFFFFFFF)) as XdrCodec<ExecValidateBatchResult>;

const _executorsched_propose_transaction_args: XdrCodec<executorsched_propose_transaction_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.SignedTransaction.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.SignedTransaction.decode(r);
    return { arg0, arg1 };
  },
};

const _executorsched_validate_transaction_args: XdrCodec<executorsched_validate_transaction_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.ProposedTransaction.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.ProposedTransaction.decode(r);
    return { arg0, arg1 };
  },
};

const _executorsched_propose_batch_args: XdrCodec<executorsched_propose_batch_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.SignedTransactionBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.SignedTransactionBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _executorsched_validate_batch_args: XdrCodec<executorsched_validate_batch_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.ProposedTransactionBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.ProposedTransactionBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _executorsched_open_proposal_block_args: XdrCodec<executorsched_open_proposal_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.BlockExecutionContext.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.BlockExecutionContext.decode(r);
    return { arg0, arg1 };
  },
};

const _executorsched_open_validation_block_args: XdrCodec<executorsched_open_validation_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.BlockExecutionContext.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.BlockExecutionContext.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  ExecProposeResult: _ExecProposeResult,
  ExecProposeBatchResult: _ExecProposeBatchResult,
  ExecValidateBatchResult: _ExecValidateBatchResult,
} as const;

export const ExecutorSchedProgram: RpcProgramMeta = {
  programId: 0x7ee79999,
  version: 1,
  methods: {
    executorsched_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    executorsched_ready: { proc: 1, request: () => VoidCodec, response: () => proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_propose_transaction: { proc: 10, request: () => _executorsched_propose_transaction_args, response: () => _ExecProposeResult },
    executorsched_validate_transaction: { proc: 20, request: () => _executorsched_validate_transaction_args, response: () => proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_propose_batch: { proc: 11, request: () => _executorsched_propose_batch_args, response: () => _ExecProposeBatchResult },
    executorsched_validate_batch: { proc: 21, request: () => _executorsched_validate_batch_args, response: () => _ExecValidateBatchResult },
    executorsched_open_proposal_block: { proc: 30, request: () => _executorsched_open_proposal_block_args, response: () => proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_open_validation_block: { proc: 40, request: () => _executorsched_open_validation_block_args, response: () => proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_finish_block: { proc: 50, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => proto.codec.ExecResult as XdrCodec<proto.ExecResult> },
    executorsched_shutdown: { proc: 60, request: () => VoidCodec, response: () => VoidCodec },
  },
};

