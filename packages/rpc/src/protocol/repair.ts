// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5135a63d54ca836265b87b8475a9c06f4d4624e4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface MissingTransactions {
  /** XDR: `TransactionHash transaction_hashes<>`. */
  transaction_hashes: proto.TransactionHash[];
  consensus_value: proto.ConsensusValue;
}

export interface MissingTransactionsEnvelope {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_transactions: proto.MissingTransactions;
}

export interface RepairedTransactions {
  /** XDR: `SignedTransaction transactions<>`. */
  transactions: proto.SignedTransaction[];
}



//
// XDR Codecs below this point
//

const _MissingTransactions: XdrCodec<MissingTransactions> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.TransactionHash, Number(0xFFFFFFFF)).encode(w, val.transaction_hashes);
    proto.codec.ConsensusValue.encode(w, val.consensus_value);
  },
  decode(r) {
    const transaction_hashes = VarArrayCodec(proto.codec.TransactionHash, Number(0xFFFFFFFF)).decode(r);
    const consensus_value = proto.codec.ConsensusValue.decode(r);
    return { transaction_hashes, consensus_value };
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
    repair_missing_proposal: { proc: 20, request: () => proto.codec.ConsensusValue as XdrCodec<proto.ConsensusValue>, response: () => proto.codec.OptProposal as XdrCodec<proto.OptProposal> },
    repair_missing_scp_envelopes: { proc: 30, request: () => proto.codec.SCPSlotIndex as XdrCodec<proto.SCPSlotIndex>, response: () => proto.codec.SCPEnvelopes as XdrCodec<proto.SCPEnvelopes> },
  },
};

