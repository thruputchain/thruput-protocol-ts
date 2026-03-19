// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
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
}

export type SchedulerValidationResult =
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationOK; db_tip: proto.DbTip }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationMissingTxs; missing_tx_hashes: proto.SignedTransactionHash[] }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationDbFailed }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationExecutorFailed }
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationInvalid }
;

export enum SchedulerCommitOutcome {
  SchedulerCommitOK = 0,
  SchedulerCommitBlockNotFound = 1,
  SchedulerCommitRace = 2,
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
  ValidatorID: proto.ValidatorID;
  ParallelSignedTransactionBatch: proto.ParallelSignedTransactionBatch;
}

export interface schedulercoord_validate_args {
  DbTip: proto.DbTip;
  Nomination: proto.Nomination;
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

const _SchedulerValidationResult: XdrCodec<SchedulerValidationResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.SchedulerValidationOutcome.SchedulerValidationOK:
        proto.codec.DbTip.encode(w, val.db_tip);
        break;
      case proto.SchedulerValidationOutcome.SchedulerValidationMissingTxs:
        w.writeUint32(BigInt(val.missing_tx_hashes.length));
        for (const _item of val.missing_tx_hashes) proto.codec.SignedTransactionHash.encode(w, _item);
        break;
      case proto.SchedulerValidationOutcome.SchedulerValidationDbFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationExecutorFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationInvalid:
        break;
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.SchedulerValidationOutcome.SchedulerValidationOK:
        const db_tip = proto.codec.DbTip.decode(r);
        return { outcome, db_tip };
      case proto.SchedulerValidationOutcome.SchedulerValidationMissingTxs:
        const _missing_tx_hashes_len = Number(r.readUint32());
        const missing_tx_hashes = Array.from({ length: _missing_tx_hashes_len }, () => proto.codec.SignedTransactionHash.decode(r));
        return { outcome, missing_tx_hashes };
      case proto.SchedulerValidationOutcome.SchedulerValidationDbFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationExecutorFailed:
      case proto.SchedulerValidationOutcome.SchedulerValidationInvalid:
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
    proto.codec.ValidatorID.encode(w, val.ValidatorID);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.ParallelSignedTransactionBatch);
  },
  decode(r) {
    const ValidatorID = proto.codec.ValidatorID.decode(r);
    const ParallelSignedTransactionBatch = proto.codec.ParallelSignedTransactionBatch.decode(r);
    return { ValidatorID, ParallelSignedTransactionBatch };
  },
};

const _schedulercoord_validate_args: XdrCodec<schedulercoord_validate_args> = {
  encode(w, val) {
    proto.codec.DbTip.encode(w, val.DbTip);
    proto.codec.Nomination.encode(w, val.Nomination);
  },
  decode(r) {
    const DbTip = proto.codec.DbTip.decode(r);
    const Nomination = proto.codec.Nomination.decode(r);
    return { DbTip, Nomination };
  },
};

export const codec = {
  CoordinatorRegistrationOutcome: _CoordinatorRegistrationOutcome,
  CoordCard: _CoordCard,
  SchedulerNominationOutcome: _SchedulerNominationOutcome,
  SchedulerNominatedBlock: _SchedulerNominatedBlock,
  SchedulerNominationResult: _SchedulerNominationResult,
  SchedulerValidationOutcome: _SchedulerValidationOutcome,
  SchedulerValidationResult: _SchedulerValidationResult,
  SchedulerCommitOutcome: _SchedulerCommitOutcome,
  SchedulerGetTipOutcome: _SchedulerGetTipOutcome,
  SchedulerGetTipResult: _SchedulerGetTipResult,
  schedulercoord_submit_vetted_args: _schedulercoord_submit_vetted_args,
  schedulercoord_validate_args: _schedulercoord_validate_args,
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
  },
};

