// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e3dda0763ff3fb21779d16b6fa2e130c633911a0

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface MissingTransactions {
  transaction_hashes: proto.SignedTransactionHash[];
  consensus_value: proto.ConsensusValue;
}

export interface MissingTransactionsEnvelope {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_transactions: proto.MissingTransactions;
}

export interface RepairedTransactions {
  transactions: proto.SignedTransaction[];
}

export interface MissingTxs {
  tx_hashes: proto.SignedTransactionHash[];
  consensus_value: proto.ConsensusValue;
}

export interface SignedMissingTxs {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_txs: proto.MissingTxs;
}

export interface RepairedTxs {
  txs: proto.SignedTransaction[];
}

export interface SignedRepairedTxs {
  signature: proto.Signature;
  repaired_txs: proto.RepairedTxs;
}

export interface MissingProposal {
  consensus_value: proto.ConsensusValue;
}

export interface SignedMissingProposal {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_proposal: proto.MissingProposal;
}

export interface RepairedProposal {
  proposal: proto.Proposal | null;
}

export interface SignedRepairedProposal {
  signature: proto.Signature;
  repaired_proposal: proto.RepairedProposal;
}

export interface MissingSlot {
  slot: bigint;
}

export interface SignedMissingSlot {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_slot: proto.MissingSlot;
}

export type SlotMessage = Uint8Array & { readonly __brand: "SlotMessage" };
export function slotMessage(data: Uint8Array): SlotMessage {
  return data as SlotMessage;
}

export interface RepairedSlot {
  slot_messages: proto.SlotMessage[];
}

export interface SignedRepairedSlot {
  signature: proto.Signature;
  repaired_slot: proto.RepairedSlot;
}

export interface MissingBlocks {
  spans: proto.CatchupSpan[];
}

export interface SignedMissingBlocks {
  signer: proto.ValidatorID;
  signature: proto.Signature;
  missing_blocks: proto.MissingBlocks;
}

export interface RepairedBlocks {
  blocks: proto.CatchupBlock[];
}

export interface SignedRepairedBlocks {
  signature: proto.Signature;
  repaired_blocks: proto.RepairedBlocks;
}



//
// XDR Codecs below this point
//

const _MissingTransactions: XdrCodec<MissingTransactions> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).encode(w, val.transaction_hashes);
    proto.codec.ConsensusValue.encode(w, val.consensus_value);
  },
  decode(r) {
    const transaction_hashes = VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).decode(r);
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

const _MissingTxs: XdrCodec<MissingTxs> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).encode(w, val.tx_hashes);
    proto.codec.ConsensusValue.encode(w, val.consensus_value);
  },
  decode(r) {
    const tx_hashes = VarArrayCodec(proto.codec.SignedTransactionHash, Number(0xFFFFFFFF)).decode(r);
    const consensus_value = proto.codec.ConsensusValue.decode(r);
    return { tx_hashes, consensus_value };
  },
};

const _SignedMissingTxs: XdrCodec<SignedMissingTxs> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.MissingTxs.encode(w, val.missing_txs);
  },
  decode(r) {
    const signer = proto.codec.ValidatorID.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const missing_txs = proto.codec.MissingTxs.decode(r);
    return { signer, signature, missing_txs };
  },
};

const _RepairedTxs: XdrCodec<RepairedTxs> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransaction, Number(0xFFFFFFFF)).encode(w, val.txs);
  },
  decode(r) {
    const txs = VarArrayCodec(proto.codec.SignedTransaction, Number(0xFFFFFFFF)).decode(r);
    return { txs };
  },
};

const _SignedRepairedTxs: XdrCodec<SignedRepairedTxs> = {
  encode(w, val) {
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.RepairedTxs.encode(w, val.repaired_txs);
  },
  decode(r) {
    const signature = proto.codec.Signature.decode(r);
    const repaired_txs = proto.codec.RepairedTxs.decode(r);
    return { signature, repaired_txs };
  },
};

const _MissingProposal: XdrCodec<MissingProposal> = {
  encode(w, val) {
    proto.codec.ConsensusValue.encode(w, val.consensus_value);
  },
  decode(r) {
    const consensus_value = proto.codec.ConsensusValue.decode(r);
    return { consensus_value };
  },
};

const _SignedMissingProposal: XdrCodec<SignedMissingProposal> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.MissingProposal.encode(w, val.missing_proposal);
  },
  decode(r) {
    const signer = proto.codec.ValidatorID.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const missing_proposal = proto.codec.MissingProposal.decode(r);
    return { signer, signature, missing_proposal };
  },
};

const _RepairedProposal: XdrCodec<RepairedProposal> = {
  encode(w, val) {
    OptionCodec(proto.codec.Proposal as XdrCodec<proto.Proposal>).encode(w, val.proposal);
  },
  decode(r) {
    const proposal = OptionCodec(proto.codec.Proposal as XdrCodec<proto.Proposal>).decode(r);
    return { proposal };
  },
};

const _SignedRepairedProposal: XdrCodec<SignedRepairedProposal> = {
  encode(w, val) {
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.RepairedProposal.encode(w, val.repaired_proposal);
  },
  decode(r) {
    const signature = proto.codec.Signature.decode(r);
    const repaired_proposal = proto.codec.RepairedProposal.decode(r);
    return { signature, repaired_proposal };
  },
};

const _MissingSlot: XdrCodec<MissingSlot> = {
  encode(w, val) {
    w.writeUint64(val.slot);
  },
  decode(r) {
    const slot = r.readUint64();
    return { slot };
  },
};

const _SignedMissingSlot: XdrCodec<SignedMissingSlot> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.MissingSlot.encode(w, val.missing_slot);
  },
  decode(r) {
    const signer = proto.codec.ValidatorID.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const missing_slot = proto.codec.MissingSlot.decode(r);
    return { signer, signature, missing_slot };
  },
};

const _SlotMessage: XdrCodec<SlotMessage> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return slotMessage(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

const _RepairedSlot: XdrCodec<RepairedSlot> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SlotMessage, Number(0xFFFFFFFF)).encode(w, val.slot_messages);
  },
  decode(r) {
    const slot_messages = VarArrayCodec(proto.codec.SlotMessage, Number(0xFFFFFFFF)).decode(r);
    return { slot_messages };
  },
};

const _SignedRepairedSlot: XdrCodec<SignedRepairedSlot> = {
  encode(w, val) {
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.RepairedSlot.encode(w, val.repaired_slot);
  },
  decode(r) {
    const signature = proto.codec.Signature.decode(r);
    const repaired_slot = proto.codec.RepairedSlot.decode(r);
    return { signature, repaired_slot };
  },
};

const _MissingBlocks: XdrCodec<MissingBlocks> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.CatchupSpan, Number(0xFFFFFFFF)).encode(w, val.spans);
  },
  decode(r) {
    const spans = VarArrayCodec(proto.codec.CatchupSpan, Number(0xFFFFFFFF)).decode(r);
    return { spans };
  },
};

const _SignedMissingBlocks: XdrCodec<SignedMissingBlocks> = {
  encode(w, val) {
    proto.codec.ValidatorID.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.MissingBlocks.encode(w, val.missing_blocks);
  },
  decode(r) {
    const signer = proto.codec.ValidatorID.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const missing_blocks = proto.codec.MissingBlocks.decode(r);
    return { signer, signature, missing_blocks };
  },
};

const _RepairedBlocks: XdrCodec<RepairedBlocks> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.CatchupBlock, Number(0xFFFFFFFF)).encode(w, val.blocks);
  },
  decode(r) {
    const blocks = VarArrayCodec(proto.codec.CatchupBlock, Number(0xFFFFFFFF)).decode(r);
    return { blocks };
  },
};

const _SignedRepairedBlocks: XdrCodec<SignedRepairedBlocks> = {
  encode(w, val) {
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.RepairedBlocks.encode(w, val.repaired_blocks);
  },
  decode(r) {
    const signature = proto.codec.Signature.decode(r);
    const repaired_blocks = proto.codec.RepairedBlocks.decode(r);
    return { signature, repaired_blocks };
  },
};

export const codec = {
  MissingTransactions: _MissingTransactions,
  MissingTransactionsEnvelope: _MissingTransactionsEnvelope,
  RepairedTransactions: _RepairedTransactions,
  MissingTxs: _MissingTxs,
  SignedMissingTxs: _SignedMissingTxs,
  RepairedTxs: _RepairedTxs,
  SignedRepairedTxs: _SignedRepairedTxs,
  MissingProposal: _MissingProposal,
  SignedMissingProposal: _SignedMissingProposal,
  RepairedProposal: _RepairedProposal,
  SignedRepairedProposal: _SignedRepairedProposal,
  MissingSlot: _MissingSlot,
  SignedMissingSlot: _SignedMissingSlot,
  SlotMessage: _SlotMessage,
  RepairedSlot: _RepairedSlot,
  SignedRepairedSlot: _SignedRepairedSlot,
  MissingBlocks: _MissingBlocks,
  SignedMissingBlocks: _SignedMissingBlocks,
  RepairedBlocks: _RepairedBlocks,
  SignedRepairedBlocks: _SignedRepairedBlocks,
} as const;

export const Repair1Program: RpcProgramMeta = {
  programId: 0x2233cccc,
  version: 1,
  methods: {
    repair_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    repair_missing_txs: { proc: 10, request: () => _MissingTransactionsEnvelope, response: () => _RepairedTransactions },
    repair_missing_proposal: { proc: 20, request: () => proto.codec.ConsensusValue as XdrCodec<proto.ConsensusValue>, response: () => proto.codec.OptProposal as XdrCodec<proto.OptProposal> },
    repair_missing_scp_envelopes: { proc: 30, request: () => proto.codec.SCPSlotIndex as XdrCodec<proto.SCPSlotIndex>, response: () => proto.codec.SCPEnvelopes as XdrCodec<proto.SCPEnvelopes> },
  },
};

export const Repair2Program: RpcProgramMeta = {
  programId: 0x2233cccc,
  version: 2,
  methods: {
    repair_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    repair_missing_txs: { proc: 10, request: () => _SignedMissingTxs, response: () => _RepairedTxs },
    repair_missing_proposal: { proc: 20, request: () => _SignedMissingProposal, response: () => _RepairedProposal },
    repair_missing_slot: { proc: 30, request: () => _SignedMissingSlot, response: () => _RepairedSlot },
    repair_missing_blocks: { proc: 40, request: () => _SignedMissingBlocks, response: () => _RepairedBlocks },
  },
};

