// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: bab641a16d398d48b16086772f51d186ac0522cb

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhog/xdr";
import * as proto from "./index.js";



export enum CoordinatorRegistrationOutcome {
  CoordinatorRegistrationOK = 0,
  CoordinatorRegistrationInvalidProtocol = 1,
}

export interface CoordCard {
  protocol: proto.Protocol;
  address_for_sched: proto.ServerAddress;
}

export enum SchedulerNominationOutcome {
  SchedulerNominationOK = 0,
  SchedulerNominationError = 1,
}

export interface SchedulerNominatedBlock {
  block_id: proto.BlockID;
  txs: proto.ParallelSignedTransactionBatch;
  nomination: proto.Nomination;
}

export type SchedulerNominationResult =
  | { outcome: proto.SchedulerNominationOutcome.SchedulerNominationOK; nominated_block: proto.SchedulerNominatedBlock }
  | { outcome: proto.SchedulerNominationOutcome.SchedulerNominationError }
;

export enum SchedulerValidationOutcome {
  SchedulerValidationOK = 0,
  SchedulerValidationInvalid = 1,
  SchedulerValidationMissingTxs = 2,
  SchedulerValidationDbFailed = 3,
  SchedulerValidationExecutorFailed = 4,
  SchedulerValidationTooLateToValidate = 5,
  SchedulerValidationUnknownParentBlock = 6,
}

export interface SchedulerValidationBlock {
  db_tip: proto.DbTip;
  signed_transactions: proto.ParallelSignedTransactionBatch;
}

export type SchedulerValidationResult =
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationOK; block: proto.SchedulerValidationBlock }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationMissingTxs; missing_tx_hashes: proto.SignedTransactionHash[] }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationDbFailed }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationExecutorFailed }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationInvalid }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationTooLateToValidate }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationUnknownParentBlock }
;

export enum SchedulerCommitOutcome {
  SchedulerCommitOK = 0,
  SchedulerCommitBlockNotFound = 1,
}

export enum SchedulerGetTipOutcome {
  SchedulerGetTipOK = 0,
  SchedulerGetTipNoGenesisBlock = 1,
}

export type SchedulerGetTipResult =
  | { outcome: proto.SchedulerGetTipOutcome.SchedulerGetTipOK; db_tip: proto.DbTip }
  | { outcome: proto.SchedulerGetTipOutcome.SchedulerGetTipNoGenesisBlock }
;


export interface schedulercoord_submit_vetted_args {
  arg0: proto.ValidatorID;
  arg1: proto.ParallelSignedTransactionBatch;
}

export interface schedulercoord_validate_args {
  arg0: proto.DbTip;
  arg1: proto.Nomination;
}


//
// XDR Codecs below this point
//

const _CoordinatorRegistrationOutcome: XdrCodec<CoordinatorRegistrationOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as CoordinatorRegistrationOutcome; },
};

const _CoordCard: XdrCodec<CoordCard> = {
  encode(w, val) {
    proto.codec.Protocol.encode(w, val.protocol);
    proto.codec.ServerAddress.encode(w, val.address_for_sched);
  },
  decode(r) {
    const protocol = proto.codec.Protocol.decode(r);
    const address_for_sched = proto.codec.ServerAddress.decode(r);
    return { protocol, address_for_sched };
  },
};

const _SchedulerNominationOutcome: XdrCodec<SchedulerNominationOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SchedulerNominationOutcome; },
};

const _SchedulerNominatedBlock: XdrCodec<SchedulerNominatedBlock> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.block_id);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.txs);
    proto.codec.Nomination.encode(w, val.nomination);
  },
  decode(r) {
    const block_id = proto.codec.BlockID.decode(r);
    const txs = proto.codec.ParallelSignedTransactionBatch.decode(r);
    const nomination = proto.codec.Nomination.decode(r);
    return { block_id, txs, nomination };
  },
};

const _SchedulerNominationResult: XdrCodec<SchedulerNominationResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.SchedulerNominationOutcome.SchedulerNominationOK:
        proto.codec.SchedulerNominatedBlock.encode(w, val.nominated_block);
        break;
      case proto.SchedulerNominationOutcome.SchedulerNominationError:
        break;
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.SchedulerNominationOutcome.SchedulerNominationOK:
        const nominated_block = proto.codec.SchedulerNominatedBlock.decode(r);
        return { outcome, nominated_block };
      case proto.SchedulerNominationOutcome.SchedulerNominationError:
        return { outcome } as SchedulerNominationResult;
      default:
        throw new Error(`Unknown SchedulerNominationResult discriminant: ${outcome}`);
    }
  },
};

const _SchedulerValidationOutcome: XdrCodec<SchedulerValidationOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SchedulerValidationOutcome; },
};

const _SchedulerValidationBlock: XdrCodec<SchedulerValidationBlock> = {
  encode(w, val) {
    proto.codec.DbTip.encode(w, val.db_tip);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.signed_transactions);
  },
  decode(r) {
    const db_tip = proto.codec.DbTip.decode(r);
    const signed_transactions = proto.codec.ParallelSignedTransactionBatch.decode(r);
    return { db_tip, signed_transactions };
  },
};

const _SchedulerValidationResult: XdrCodec<SchedulerValidationResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.SchedulerValidationOutcome.SchedulerValidationOK:
        proto.codec.SchedulerValidationBlock.encode(w, val.block);
        break;
      case proto.SchedulerValidationOutcome.SchedulerValidationMissingTxs:
        VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).encode(w, val.missing_tx_hashes);
        break;
      case proto.SchedulerValidationOutcome.SchedulerValidationDbFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationExecutorFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationInvalid:
      case proto.SchedulerValidationOutcome.SchedulerValidationTooLateToValidate:
      case proto.SchedulerValidationOutcome.SchedulerValidationUnknownParentBlock:
        break;
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.SchedulerValidationOutcome.SchedulerValidationOK:
        const block = proto.codec.SchedulerValidationBlock.decode(r);
        return { outcome, block };
      case proto.SchedulerValidationOutcome.SchedulerValidationMissingTxs:
        const missing_tx_hashes = VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).decode(r);
        return { outcome, missing_tx_hashes };
      case proto.SchedulerValidationOutcome.SchedulerValidationDbFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationExecutorFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationInvalid:
      case proto.SchedulerValidationOutcome.SchedulerValidationTooLateToValidate:
      case proto.SchedulerValidationOutcome.SchedulerValidationUnknownParentBlock:
        return { outcome } as SchedulerValidationResult;
      default:
        throw new Error(`Unknown SchedulerValidationResult discriminant: ${outcome}`);
    }
  },
};

const _SchedulerCommitOutcome: XdrCodec<SchedulerCommitOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SchedulerCommitOutcome; },
};

const _SchedulerGetTipOutcome: XdrCodec<SchedulerGetTipOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SchedulerGetTipOutcome; },
};

const _SchedulerGetTipResult: XdrCodec<SchedulerGetTipResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.SchedulerGetTipOutcome.SchedulerGetTipOK:
        proto.codec.DbTip.encode(w, val.db_tip);
        break;
      case proto.SchedulerGetTipOutcome.SchedulerGetTipNoGenesisBlock:
        break;
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.SchedulerGetTipOutcome.SchedulerGetTipOK:
        const db_tip = proto.codec.DbTip.decode(r);
        return { outcome, db_tip };
      case proto.SchedulerGetTipOutcome.SchedulerGetTipNoGenesisBlock:
        return { outcome } as SchedulerGetTipResult;
      default:
        throw new Error(`Unknown SchedulerGetTipResult discriminant: ${outcome}`);
    }
  },
};

const _schedulercoord_submit_vetted_args: XdrCodec<schedulercoord_submit_vetted_args> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.arg0);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.ValidatorID.decode(r);
    const arg1 = proto.codec.ParallelSignedTransactionBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _schedulercoord_validate_args: XdrCodec<schedulercoord_validate_args> = {
  encode(w, val) {
    proto.codec.DbTip.encode(w, val.arg0);
    proto.codec.Nomination.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.DbTip.decode(r);
    const arg1 = proto.codec.Nomination.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  CoordinatorRegistrationOutcome: _CoordinatorRegistrationOutcome,
  CoordCard: _CoordCard,
  SchedulerNominationOutcome: _SchedulerNominationOutcome,
  SchedulerNominatedBlock: _SchedulerNominatedBlock,
  SchedulerNominationResult: _SchedulerNominationResult,
  SchedulerValidationOutcome: _SchedulerValidationOutcome,
  SchedulerValidationBlock: _SchedulerValidationBlock,
  SchedulerValidationResult: _SchedulerValidationResult,
  SchedulerCommitOutcome: _SchedulerCommitOutcome,
  SchedulerGetTipOutcome: _SchedulerGetTipOutcome,
  SchedulerGetTipResult: _SchedulerGetTipResult,
} as const;

export const SchedulerCoordProgram: RpcProgramMeta = {
  programId: 0x76671111,
  version: 1,
  methods: {
    schedulercoord_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    schedulercoord_intro_coord: { proc: 1, request: _CoordCard, response: _CoordinatorRegistrationOutcome },
    schedulercoord_submit_unvetted: { proc: 2, request: proto.codec.ParallelSignedTransactionBatch as XdrCodec<proto.ParallelSignedTransactionBatch>, response: VoidCodec },
    schedulercoord_submit_vetted: { proc: 3, request: _schedulercoord_submit_vetted_args, response: VoidCodec },
    schedulercoord_nominate: { proc: 4, request: proto.codec.DbTip as XdrCodec<proto.DbTip>, response: _SchedulerNominationResult },
    schedulercoord_validate: { proc: 5, request: _schedulercoord_validate_args, response: _SchedulerValidationResult },
    schedulercoord_commit_block: { proc: 6, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: _SchedulerCommitOutcome },
    schedcoord_get_tip: { proc: 7, request: VoidCodec, response: _SchedulerGetTipResult },
    schedcoord_load_genesis_configuration: { proc: 8, request: proto.codec.GenesisConfiguration as XdrCodec<proto.GenesisConfiguration>, response: proto.codec.DbSchedResult as XdrCodec<proto.DbSchedResult> },
    schedcoord_lookup_transactions: { proc: 100, request: proto.codec.SignedTransactionHashBatch as XdrCodec<proto.SignedTransactionHashBatch>, response: proto.codec.OptSignedTransactionBatch as XdrCodec<proto.OptSignedTransactionBatch> },
    schedcoord_pending_transaction_count: { proc: 101, request: VoidCodec, response: proto.codec.BlockHeight as XdrCodec<proto.BlockHeight> },
  },
};

