// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: c0e2b46d8abfb48cd8fb90d8f06af8d2a99acf27

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface Nomination {
  block_height: proto.BlockHeight;
  block_hash: proto.BlockHash;
  prev_block_hash: proto.BlockHash;
  transactions_hash: proto.ParallelSignedTransactionHashBatch;
  transactions_nondeterministic_data: proto.ParallelNondeterministicProposalDataBatch;
}

export interface PrevNominationSummary {
  block_hash: proto.BlockHash;
}


//
// XDR Codecs below this point
//

const _Nomination: XdrCodec<Nomination> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.BlockHash.encode(w, val.block_hash);
    proto.codec.BlockHash.encode(w, val.prev_block_hash);
    proto.codec.ParallelSignedTransactionHashBatch.encode(w, val.transactions_hash);
    proto.codec.ParallelNondeterministicProposalDataBatch.encode(w, val.transactions_nondeterministic_data);
  },
  decode(r) {
    const block_height = proto.codec.BlockHeight.decode(r);
    const block_hash = proto.codec.BlockHash.decode(r);
    const prev_block_hash = proto.codec.BlockHash.decode(r);
    const transactions_hash = proto.codec.ParallelSignedTransactionHashBatch.decode(r);
    const transactions_nondeterministic_data = proto.codec.ParallelNondeterministicProposalDataBatch.decode(r);
    return { block_height, block_hash, prev_block_hash, transactions_hash, transactions_nondeterministic_data };
  },
};

const _PrevNominationSummary: XdrCodec<PrevNominationSummary> = {
  encode(w, val) {
    proto.codec.BlockHash.encode(w, val.block_hash);
  },
  decode(r) {
    const block_hash = proto.codec.BlockHash.decode(r);
    return { block_hash };
  },
};

export const codec = {
  Nomination: _Nomination,
  PrevNominationSummary: _PrevNominationSummary,
} as const;

