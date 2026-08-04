// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 2bb863900e285102907f789666495140afed7392

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface ProposalContext {
  protocol: proto.Protocol;
  proposer: proto.ValidatorID;
  block_timepoint: proto.TimePoint;
}

export interface ProposalHeader {
  ext: proto.ExtensionPoint;
  network_hash: proto.NetworkHash;
  proposer: proto.ValidatorID;
  block_timepoint: proto.TimePoint;
  block_height: proto.BlockHeight;
  txs_hash: proto.TxsHash;
  storage_hash: proto.StorageShortHash;
  events_hash: proto.EventsHash;
}


//
// XDR Codecs below this point
//

const _ProposalContext: XdrCodec<ProposalContext> = {
  encode(w, val) {
    proto.codec.Protocol.encode(w, val.protocol);
    proto.codec.ValidatorID.encode(w, val.proposer);
    proto.codec.TimePoint.encode(w, val.block_timepoint);
  },
  decode(r) {
    const protocol = proto.codec.Protocol.decode(r);
    const proposer = proto.codec.ValidatorID.decode(r);
    const block_timepoint = proto.codec.TimePoint.decode(r);
    return { protocol, proposer, block_timepoint };
  },
};

const _ProposalHeader: XdrCodec<ProposalHeader> = {
  encode(w, val) {
    proto.codec.ExtensionPoint.encode(w, val.ext);
    proto.codec.NetworkHash.encode(w, val.network_hash);
    proto.codec.ValidatorID.encode(w, val.proposer);
    proto.codec.TimePoint.encode(w, val.block_timepoint);
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.TxsHash.encode(w, val.txs_hash);
    proto.codec.StorageShortHash.encode(w, val.storage_hash);
    proto.codec.EventsHash.encode(w, val.events_hash);
  },
  decode(r) {
    const ext = proto.codec.ExtensionPoint.decode(r);
    const network_hash = proto.codec.NetworkHash.decode(r);
    const proposer = proto.codec.ValidatorID.decode(r);
    const block_timepoint = proto.codec.TimePoint.decode(r);
    const block_height = proto.codec.BlockHeight.decode(r);
    const txs_hash = proto.codec.TxsHash.decode(r);
    const storage_hash = proto.codec.StorageShortHash.decode(r);
    const events_hash = proto.codec.EventsHash.decode(r);
    return { ext, network_hash, proposer, block_timepoint, block_height, txs_hash, storage_hash, events_hash };
  },
};

export const codec = {
  ProposalContext: _ProposalContext,
  ProposalHeader: _ProposalHeader,
} as const;

