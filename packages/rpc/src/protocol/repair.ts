// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: b89462754658cb15bd45d5f4bfaf76372e55a454

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface MissingTransactions {
  transaction_hashes: proto.SignedTransactionHash[];
  cue: proto.ConsensusValueCue;
}

export interface MissingTransactionsEnvelope {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_transactions: proto.MissingTransactions;
}

export interface RepairedTransactions {
  transactions: proto.SignedTransaction[];
}



//
// XDR Codecs below this point
//

const _MissingTransactions: XdrCodec<MissingTransactions> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).encode(w, val.transaction_hashes);
    proto.codec.ConsensusValueCue.encode(w, val.cue);
  },
  decode(r) {
    const transaction_hashes = VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).decode(r);
    const cue = proto.codec.ConsensusValueCue.decode(r);
    return { transaction_hashes, cue };
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

export const codec = {
  MissingTransactions: _MissingTransactions,
  MissingTransactionsEnvelope: _MissingTransactionsEnvelope,
  RepairedTransactions: _RepairedTransactions,
} as const;

export const RepairProgram: RpcProgramMeta = {
  programId: 0x2233cccc,
  version: 1,
  methods: {
    repair_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    repair_missing_txs: { proc: 10, request: () => _MissingTransactionsEnvelope, response: () => _RepairedTransactions },
    repair_missing_cv: { proc: 20, request: () => proto.codec.ConsensusValueCue as XdrCodec<proto.ConsensusValueCue>, response: () => proto.codec.OptConsensusValue as XdrCodec<proto.OptConsensusValue> },
    repair_missing_scp_envelopes: { proc: 30, request: () => proto.codec.SCPSlotIndex as XdrCodec<proto.SCPSlotIndex>, response: () => proto.codec.SCPEnvelopes as XdrCodec<proto.SCPEnvelopes> },
  },
};

