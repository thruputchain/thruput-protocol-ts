// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export interface ParallelBatch {
  segment_tokens: bigint[];
  segment_bytes: bigint[];
  xdr: Uint8Array;
}

export type ParallelSignedTransactionBatch = proto.ParallelBatch & { readonly __brand: "ParallelSignedTransactionBatch" };
export function parallelSignedTransactionBatch(val: proto.ParallelBatch): ParallelSignedTransactionBatch {
  return val as ParallelSignedTransactionBatch;
}

export type ParallelSignedTransactionHashBatch = proto.ParallelBatch & { readonly __brand: "ParallelSignedTransactionHashBatch" };
export function parallelSignedTransactionHashBatch(val: proto.ParallelBatch): ParallelSignedTransactionHashBatch {
  return val as ParallelSignedTransactionHashBatch;
}

export type ParallelNondeterministicProposalDataBatch = proto.ParallelBatch & { readonly __brand: "ParallelNondeterministicProposalDataBatch" };
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

