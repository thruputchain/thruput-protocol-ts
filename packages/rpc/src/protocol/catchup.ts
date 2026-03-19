// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export interface CatchupBlock {
  consensus_value: proto.ConsensusValue;
  signed_transactions: proto.ParallelSignedTransactionBatch;
}

export interface CatchupSpan {
  from_block_height: proto.BlockHeight;
  to_block_height: proto.BlockHeight;
}

export interface CatchupBlocksRequest {
  timestamp: proto.TimePoint;
  spans: proto.CatchupSpan[];
}

export interface SignedCatchupBlocksRequest {
  signer: proto.ValidatorPublicInfo;
  signature: proto.Signature;
  request: proto.CatchupBlocksRequest;
}

export interface CatchupBlocksResult {
  timestamp: proto.TimePoint;
  blocks: proto.CatchupBlock[];
}

export interface SignedCatchupBlocksResult {
  signer: proto.ValidatorPublicInfo;
  signature: proto.Signature;
  result: proto.CatchupBlocksResult;
}



//
// XDR Codecs below this point
//

const _CatchupBlock: XdrCodec<CatchupBlock> = {
  encode(w, val) {
    proto.codec.ConsensusValue.encode(w, val.consensus_value);
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.signed_transactions);
  },
  decode(r) {
    const consensus_value = proto.codec.ConsensusValue.decode(r);
    const signed_transactions = proto.codec.ParallelSignedTransactionBatch.decode(r);
    return { consensus_value, signed_transactions };
  },
};

const _CatchupSpan: XdrCodec<CatchupSpan> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.from_block_height);
    proto.codec.BlockHeight.encode(w, val.to_block_height);
  },
  decode(r) {
    const from_block_height = proto.codec.BlockHeight.decode(r);
    const to_block_height = proto.codec.BlockHeight.decode(r);
    return { from_block_height, to_block_height };
  },
};

const _CatchupBlocksRequest: XdrCodec<CatchupBlocksRequest> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    w.writeUint32(BigInt(val.spans.length));
    for (const _item of val.spans) proto.codec.CatchupSpan.encode(w, _item);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const _spans_len = Number(r.readUint32());
    const spans = Array.from({ length: _spans_len }, () => proto.codec.CatchupSpan.decode(r));
    return { timestamp, spans };
  },
};

const _SignedCatchupBlocksRequest: XdrCodec<SignedCatchupBlocksRequest> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.CatchupBlocksRequest.encode(w, val.request);
  },
  decode(r) {
    const signer = proto.codec.ValidatorPublicInfo.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const request = proto.codec.CatchupBlocksRequest.decode(r);
    return { signer, signature, request };
  },
};

const _CatchupBlocksResult: XdrCodec<CatchupBlocksResult> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    w.writeUint32(BigInt(val.blocks.length));
    for (const _item of val.blocks) proto.codec.CatchupBlock.encode(w, _item);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const _blocks_len = Number(r.readUint32());
    const blocks = Array.from({ length: _blocks_len }, () => proto.codec.CatchupBlock.decode(r));
    return { timestamp, blocks };
  },
};

const _SignedCatchupBlocksResult: XdrCodec<SignedCatchupBlocksResult> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.CatchupBlocksResult.encode(w, val.result);
  },
  decode(r) {
    const signer = proto.codec.ValidatorPublicInfo.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const result = proto.codec.CatchupBlocksResult.decode(r);
    return { signer, signature, result };
  },
};

export const codec = {
  CatchupBlock: _CatchupBlock,
  CatchupSpan: _CatchupSpan,
  CatchupBlocksRequest: _CatchupBlocksRequest,
  SignedCatchupBlocksRequest: _SignedCatchupBlocksRequest,
  CatchupBlocksResult: _CatchupBlocksResult,
  SignedCatchupBlocksResult: _SignedCatchupBlocksResult,
} as const;

export const CatchupProgram: RpcProgramMeta = {
  programId: 0x4321abcd,
  version: 1,
  methods: {
    catchup_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    catchup_solicit: { proc: 10, request: _SignedCatchupBlocksRequest, response: _SignedCatchupBlocksResult },
  },
};

