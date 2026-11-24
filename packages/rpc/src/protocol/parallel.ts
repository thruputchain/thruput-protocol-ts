// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 27c2d4d8be10f9aeeb886090c13524a793e4a386

import { type XdrCodec, withCodecBudget, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, Uint32Codec } from "@thruputchain/xdr";
import * as proto from "./index.js";



export interface ParallelBatch {
  /** XDR: `unsigned int segment_tokens<>`. */
  segment_tokens: bigint[];
  /** XDR: `unsigned int segment_bytes<>`. */
  segment_bytes: bigint[];
  /** XDR: `opaque xdr<>`. */
  xdr: Uint8Array;
}

export interface BatchCommit {
  ext: proto.ExtensionPoint;
  /** XDR: `unsigned int segment_tokens<>`. */
  segment_tokens: bigint[];
  /** XDR: `unsigned int segment_bytes<>`. */
  segment_bytes: bigint[];
  /** XDR: `SHA256Hash segment_hashes<>`. */
  segment_hashes: proto.SHA256Hash[];
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

const _ParallelBatch: XdrCodec<ParallelBatch> = withCodecBudget<ParallelBatch>({
  encode(w, val) {
    VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).encode(w, val.segment_tokens);
    VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).encode(w, val.segment_bytes);
    w.writeVarOpaque(val.xdr, Number(0xFFFFFFFF));
  },
  decode(r) {
    const segment_tokens = VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).decode(r);
    const segment_bytes = VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).decode(r);
    const xdr = r.readVarOpaque(Number(0xFFFFFFFF));
    return { segment_tokens, segment_bytes, xdr };
  },
});

const _BatchCommit: XdrCodec<BatchCommit> = withCodecBudget<BatchCommit>({
  encode(w, val) {
    proto.codec.ExtensionPoint.encode(w, val.ext);
    VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).encode(w, val.segment_tokens);
    VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).encode(w, val.segment_bytes);
    VarArrayCodec(proto.codec.SHA256Hash, Number(0xFFFFFFFF)).encode(w, val.segment_hashes);
  },
  decode(r) {
    const ext = proto.codec.ExtensionPoint.decode(r);
    const segment_tokens = VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).decode(r);
    const segment_bytes = VarArrayCodec(Uint32Codec, Number(0xFFFFFFFF)).decode(r);
    const segment_hashes = VarArrayCodec(proto.codec.SHA256Hash, Number(0xFFFFFFFF)).decode(r);
    return { ext, segment_tokens, segment_bytes, segment_hashes };
  },
});

const _ParallelSignedTransactionBatch: XdrCodec<ParallelSignedTransactionBatch> = withCodecBudget(() => proto.codec.ParallelBatch as XdrCodec<ParallelSignedTransactionBatch>);

const _ParallelSignedTransactionHashBatch: XdrCodec<ParallelSignedTransactionHashBatch> = withCodecBudget(() => proto.codec.ParallelBatch as XdrCodec<ParallelSignedTransactionHashBatch>);

const _ParallelNondeterministicProposalDataBatch: XdrCodec<ParallelNondeterministicProposalDataBatch> = withCodecBudget(() => proto.codec.ParallelBatch as XdrCodec<ParallelNondeterministicProposalDataBatch>);

export const codec = {
  ParallelBatch: _ParallelBatch,
  BatchCommit: _BatchCommit,
  ParallelSignedTransactionBatch: _ParallelSignedTransactionBatch,
  ParallelSignedTransactionHashBatch: _ParallelSignedTransactionHashBatch,
  ParallelNondeterministicProposalDataBatch: _ParallelNondeterministicProposalDataBatch,
} as const;

