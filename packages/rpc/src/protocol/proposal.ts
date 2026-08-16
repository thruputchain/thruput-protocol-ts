// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 003a0d33894e4c7c48474454948073bd6d10da45

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface ProposalTxs {
  ext: proto.ExtensionPoint;
  hash: proto.ParallelSignedTransactionHashBatch;
  nondeterministic_data: proto.ParallelNondeterministicProposalDataBatch;
}

export type ProposalTxsHash = proto.SHA256Hash & { readonly __brand: "ProposalTxsHash" };
export function proposalTxsHash(val: proto.SHA256Hash): ProposalTxsHash {
  return val as ProposalTxsHash;
}

export interface Proposal {
  header: proto.ProposalHeader;
  transactions: proto.ProposalTxs;
}

export type OptProposal = (proto.Proposal | null) & { readonly __brand: "OptProposal" };
export function optProposal(val: proto.Proposal | null): OptProposal {
  return val as OptProposal;
}

export interface PrevProposalSummary {
  value_hash: proto.ConsensusValueHash;
}


//
// XDR Codecs below this point
//

const _ProposalTxs: XdrCodec<ProposalTxs> = {
  encode(w, val) {
    proto.codec.ExtensionPoint.encode(w, val.ext);
    proto.codec.ParallelSignedTransactionHashBatch.encode(w, val.hash);
    proto.codec.ParallelNondeterministicProposalDataBatch.encode(w, val.nondeterministic_data);
  },
  decode(r) {
    const ext = proto.codec.ExtensionPoint.decode(r);
    const hash = proto.codec.ParallelSignedTransactionHashBatch.decode(r);
    const nondeterministic_data = proto.codec.ParallelNondeterministicProposalDataBatch.decode(r);
    return { ext, hash, nondeterministic_data };
  },
};

const _ProposalTxsHash: XdrCodec<ProposalTxsHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return proposalTxsHash(proto.codec.SHA256Hash.decode(r)); },
};

const _Proposal: XdrCodec<Proposal> = {
  encode(w, val) {
    proto.codec.ProposalHeader.encode(w, val.header);
    proto.codec.ProposalTxs.encode(w, val.transactions);
  },
  decode(r) {
    const header = proto.codec.ProposalHeader.decode(r);
    const transactions = proto.codec.ProposalTxs.decode(r);
    return { header, transactions };
  },
};

const _OptProposal = OptionCodec(() => _Proposal) as XdrCodec<OptProposal>;

const _PrevProposalSummary: XdrCodec<PrevProposalSummary> = {
  encode(w, val) {
    proto.codec.ConsensusValueHash.encode(w, val.value_hash);
  },
  decode(r) {
    const value_hash = proto.codec.ConsensusValueHash.decode(r);
    return { value_hash };
  },
};

export const codec = {
  ProposalTxs: _ProposalTxs,
  ProposalTxsHash: _ProposalTxsHash,
  Proposal: _Proposal,
  OptProposal: _OptProposal,
  PrevProposalSummary: _PrevProposalSummary,
} as const;

