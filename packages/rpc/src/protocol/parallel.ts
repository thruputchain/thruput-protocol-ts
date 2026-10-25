// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 2ff2d08a54a36835f1f9a22aa693ba3205b0217e

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export interface ParallelBatch {
  /** XDR: `unsigned int segment_tokens<>`. */
  segment_tokens: bigint[];
  /** XDR: `unsigned int segment_bytes<>`. */
  segment_bytes: bigint[];
  /** XDR: `opaque xdr<>`. */
  xdr: Uint8Array;
}

export type ParallelSignedTransactionBatch = (NonNullable<proto.ParallelBatch> & { readonly __brand: { readonly ParallelSignedTransactionBatch: true } }) | Extract<proto.ParallelBatch, null>;
export function parallelSignedTransactionBatch(val: proto.ParallelBatch): ParallelSignedTransactionBatch {
  return val as ParallelSignedTransactionBatch;
}

export type ParallelSignedTransactionHashBatch = (NonNullable<proto.ParallelBatch> & { readonly __brand: { readonly ParallelSignedTransactionHashBatch: true } }) | Extract<proto.ParallelBatch, null>;
export function parallelSignedTransactionHashBatch(val: proto.ParallelBatch): ParallelSignedTransactionHashBatch {
  return val as ParallelSignedTransactionHashBatch;
}

export type ParallelNondeterministicProposalDataBatch = (NonNullable<proto.ParallelBatch> & { readonly __brand: { readonly ParallelNondeterministicProposalDataBatch: true } }) | Extract<proto.ParallelBatch, null>;
export function parallelNondeterministicProposalDataBatch(val: proto.ParallelBatch): ParallelNondeterministicProposalDataBatch {
  return val as ParallelNondeterministicProposalDataBatch;
}


//
// XDR Codecs below this point
//

const _ParallelBatch: XdrCodec<ParallelBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.segment_tokens.length));
    for (const _item of val.segment_tokens) w.writeUint32(_item);
    w.writeUint32(BigInt(val.segment_bytes.length));
    for (const _item of val.segment_bytes) w.writeUint32(_item);
    w.writeVarOpaque(val.xdr, Number(0xFFFFFFFF));
  },
  decode(r) {
    const _segment_tokens_len = Number(r.readUint32());
    const segment_tokens = Array.from({ length: _segment_tokens_len }, () => r.readUint32());
    const _segment_bytes_len = Number(r.readUint32());
    const segment_bytes = Array.from({ length: _segment_bytes_len }, () => r.readUint32());
    const xdr = r.readVarOpaque(Number(0xFFFFFFFF));
    return { segment_tokens, segment_bytes, xdr };
  },
};

const _ParallelSignedTransactionBatch: XdrCodec<ParallelSignedTransactionBatch> = {
  encode(w, val) { proto.codec.ParallelBatch.encode(w, val); },
  decode(r) { return parallelSignedTransactionBatch(proto.codec.ParallelBatch.decode(r)); },
};

const _ParallelSignedTransactionHashBatch: XdrCodec<ParallelSignedTransactionHashBatch> = {
  encode(w, val) { proto.codec.ParallelBatch.encode(w, val); },
  decode(r) { return parallelSignedTransactionHashBatch(proto.codec.ParallelBatch.decode(r)); },
};

const _ParallelNondeterministicProposalDataBatch: XdrCodec<ParallelNondeterministicProposalDataBatch> = {
  encode(w, val) { proto.codec.ParallelBatch.encode(w, val); },
  decode(r) { return parallelNondeterministicProposalDataBatch(proto.codec.ParallelBatch.decode(r)); },
};

export const codec = {
  ParallelBatch: _ParallelBatch,
  ParallelSignedTransactionBatch: _ParallelSignedTransactionBatch,
  ParallelSignedTransactionHashBatch: _ParallelSignedTransactionHashBatch,
  ParallelNondeterministicProposalDataBatch: _ParallelNondeterministicProposalDataBatch,
} as const;

