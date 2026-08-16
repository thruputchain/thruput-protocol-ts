// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 003a0d33894e4c7c48474454948073bd6d10da45

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum CoordinatorRegistrationOutcome {
  CoordinatorRegistrationOK = 0,
  CoordinatorRegistrationInvalidProtocol = 1,
  CoordinatorRegistrationAlreadyRegistered = 2,
}

export interface CoordCard {
  protocol: proto.ProtocolCommit;
  address_for_sched: proto.ServerAddress;
}

export enum SchedulerProposalOutcome {
  SchedulerProposalOK = 0,
  SchedulerProposalError = 1,
}

export interface SchedulerProposedBlock {
  block_id: proto.BlockID;
  txs: proto.ParallelSignedTransactionBatch;
  proposal: proto.Proposal;
}

export type SchedulerProposalResult =
  | { outcome: proto.SchedulerProposalOutcome.SchedulerProposalOK; proposed_block: proto.SchedulerProposedBlock }
  | { outcome: proto.SchedulerProposalOutcome.SchedulerProposalError }
;

export enum SchedulerValidationOutcome {
  SchedulerValidationOK = 0,
  SchedulerValidationInvalid = 1,
  SchedulerValidationMissingTxs = 2,
  SchedulerValidationDbFailed = 3,
  SchedulerValidationExecutorFailed = 4,
  SchedulerValidationTooLateToValidate = 5,
  SchedulerValidationUnknownParentBlock = 6,
  SchedulerValidationMalformed = 7,
}

export interface SchedulerValidationBlock {
  block_id: proto.BlockID;
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
  | { outcome: proto.SchedulerValidationOutcome.SchedulerValidationMalformed }
;

export enum SchedulerCommitOutcome {
  SchedulerCommitOK = 0,
  SchedulerCommitBlockNotFound = 1,
  SchedulerCommitInvalidConsensusValue = 2,
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

export interface schedulercoord_propose_block_args {
  arg0: proto.BlockID;
  arg1: proto.ProposalContext;
}

export interface schedulercoord_validate_block_args {
  arg0: proto.BlockID;
  arg1: proto.Proposal;
}

export interface schedulercoord_commit_block_args {
  arg0: proto.BlockID;
  arg1: proto.ConsensusValue;
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
    proto.codec.ProtocolCommit.encode(w, val.protocol);
    proto.codec.ServerAddress.encode(w, val.address_for_sched);
  },
  decode(r) {
    const protocol = proto.codec.ProtocolCommit.decode(r);
    const address_for_sched = proto.codec.ServerAddress.decode(r);
    return { protocol, address_for_sched };
  },
};

const _SchedulerProposalOutcome: XdrCodec<SchedulerProposalOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SchedulerProposalOutcome; },
};

const _SchedulerProposedBlock: XdrCodec<SchedulerProposedBlock> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.block_id);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.txs);
    proto.codec.Proposal.encode(w, val.proposal);
  },
  decode(r) {
    const block_id = proto.codec.BlockID.decode(r);
    const txs = proto.codec.ParallelSignedTransactionBatch.decode(r);
    const proposal = proto.codec.Proposal.decode(r);
    return { block_id, txs, proposal };
  },
};

const _SchedulerProposalResult: XdrCodec<SchedulerProposalResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.SchedulerProposalOutcome.SchedulerProposalOK:
        proto.codec.SchedulerProposedBlock.encode(w, val.proposed_block);
        break;
      case proto.SchedulerProposalOutcome.SchedulerProposalError:
        break;
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.SchedulerProposalOutcome.SchedulerProposalOK:
        const proposed_block = proto.codec.SchedulerProposedBlock.decode(r);
        return { outcome, proposed_block };
      case proto.SchedulerProposalOutcome.SchedulerProposalError:
        return { outcome } as SchedulerProposalResult;
      default:
        throw new Error(`Unknown SchedulerProposalResult discriminant: ${outcome}`);
    }
  },
};

const _SchedulerValidationOutcome: XdrCodec<SchedulerValidationOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SchedulerValidationOutcome; },
};

const _SchedulerValidationBlock: XdrCodec<SchedulerValidationBlock> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.block_id);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.signed_transactions);
  },
  decode(r) {
    const block_id = proto.codec.BlockID.decode(r);
    const signed_transactions = proto.codec.ParallelSignedTransactionBatch.decode(r);
    return { block_id, signed_transactions };
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
      case proto.SchedulerValidationOutcome.SchedulerValidationMalformed:
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
      case proto.SchedulerValidationOutcome.SchedulerValidationMalformed:
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

const _schedulercoord_propose_block_args: XdrCodec<schedulercoord_propose_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.ProposalContext.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.ProposalContext.decode(r);
    return { arg0, arg1 };
  },
};

const _schedulercoord_validate_block_args: XdrCodec<schedulercoord_validate_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.Proposal.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.Proposal.decode(r);
    return { arg0, arg1 };
  },
};

const _schedulercoord_commit_block_args: XdrCodec<schedulercoord_commit_block_args> = {
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

export const codec = {
  CoordinatorRegistrationOutcome: _CoordinatorRegistrationOutcome,
  CoordCard: _CoordCard,
  SchedulerProposalOutcome: _SchedulerProposalOutcome,
  SchedulerProposedBlock: _SchedulerProposedBlock,
  SchedulerProposalResult: _SchedulerProposalResult,
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
    schedulercoord_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    schedulercoord_intro_coord: { proc: 1, request: () => _CoordCard, response: () => _CoordinatorRegistrationOutcome },
    schedulercoord_submit_unvetted: { proc: 2, request: () => proto.codec.ParallelSignedTransactionBatch as XdrCodec<proto.ParallelSignedTransactionBatch>, response: () => VoidCodec },
    schedulercoord_submit_vetted: { proc: 3, request: () => _schedulercoord_submit_vetted_args, response: () => VoidCodec },
    schedulercoord_propose_block: { proc: 4, request: () => _schedulercoord_propose_block_args, response: () => _SchedulerProposalResult },
    schedulercoord_validate_block: { proc: 5, request: () => _schedulercoord_validate_block_args, response: () => _SchedulerValidationResult },
    schedulercoord_commit_block: { proc: 6, request: () => _schedulercoord_commit_block_args, response: () => _SchedulerCommitOutcome },
    schedcoord_get_tip: { proc: 7, request: () => VoidCodec, response: () => _SchedulerGetTipResult },
    schedcoord_load_genesis_configuration: { proc: 8, request: () => proto.codec.GenesisConfiguration as XdrCodec<proto.GenesisConfiguration>, response: () => proto.codec.DbSchedResult as XdrCodec<proto.DbSchedResult> },
    schedcoord_lookup_transactions: { proc: 100, request: () => proto.codec.SignedTransactionHashBatch as XdrCodec<proto.SignedTransactionHashBatch>, response: () => proto.codec.OptSignedTransactionBatch as XdrCodec<proto.OptSignedTransactionBatch> },
  },
};

