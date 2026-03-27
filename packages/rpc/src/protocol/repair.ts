// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhog/xdr";
import * as proto from "./index.js";



export interface MissingTransactions {
  transaction_hashes: proto.SignedTransactionHash[];
  cv_hash: proto.ConsensusValueHash;
  block_hash: proto.BlockHash;
}

export interface MissingTransactionsEnvelope {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_transactions: proto.MissingTransactions;
}

export interface RepairedTransactions {
  transactions: proto.SignedTransaction[];
}


export interface repair_missing_cv_args {
  arg0: proto.ConsensusValueHash;
  arg1: proto.BlockHeight;
}


//
// XDR Codecs below this point
//

const _MissingTransactions: XdrCodec<MissingTransactions> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).encode(w, val.transaction_hashes);
    proto.codec.ConsensusValueHash.encode(w, val.cv_hash);
    proto.codec.BlockHash.encode(w, val.block_hash);
  },
  decode(r) {
    const transaction_hashes = VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).decode(r);
    const cv_hash = proto.codec.ConsensusValueHash.decode(r);
    const block_hash = proto.codec.BlockHash.decode(r);
    return { transaction_hashes, cv_hash, block_hash };
  },
};

const _MissingTransactionsEnvelope: XdrCodec<MissingTransactionsEnvelope> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.MissingTransactions.encode(w, val.missing_transactions);
  },
  decode(r) {
    const signer = proto.codec.ValidatorID.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const missing_transactions = proto.codec.MissingTransactions.decode(r);
    return { signer, signature, missing_transactions };
  },
};

const _RepairedTransactions: XdrCodec<RepairedTransactions> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransaction, Number(0xFFFFFFFF)).encode(w, val.transactions);
  },
  decode(r) {
    const transactions = VarArrayCodec(proto.codec.SignedTransaction, Number(0xFFFFFFFF)).decode(r);
    return { transactions };
  },
};

const _repair_missing_cv_args: XdrCodec<repair_missing_cv_args> = {
  encode(w, val) {
    proto.codec.ConsensusValueHash.encode(w, val.arg0);
    proto.codec.BlockHeight.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.ConsensusValueHash.decode(r);
    const arg1 = proto.codec.BlockHeight.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  MissingTransactions: _MissingTransactions,
  MissingTransactionsEnvelope: _MissingTransactionsEnvelope,
  RepairedTransactions: _RepairedTransactions,
} as const;

export const RepairProgram: RpcProgramMeta = {
  programId: 0x2233cccc,
  version: 1,
  methods: {
    repair_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    repair_missing_txs: { proc: 10, request: _MissingTransactionsEnvelope, response: _RepairedTransactions },
    repair_missing_cv: { proc: 20, request: _repair_missing_cv_args, response: proto.codec.OptConsensusValue as XdrCodec<proto.OptConsensusValue> },
    repair_missing_scp_envelopes: { proc: 30, request: proto.codec.SCPSlotIndex as XdrCodec<proto.SCPSlotIndex>, response: proto.codec.SCPEnvelopes as XdrCodec<proto.SCPEnvelopes> },
  },
};

