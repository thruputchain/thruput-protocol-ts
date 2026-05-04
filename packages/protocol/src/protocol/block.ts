// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 076d53880b71d9063d5455fe857591448b4f0fb8

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface BlockHeader {
  network_id: bigint;
  block_height: proto.BlockHeight;
  txset_hash: proto.SHA256Hash;
  db_hash: proto.DbHash;
  events_hash: proto.SHA256Hash;
  prev_block_hash: proto.BlockHash;
}


//
// XDR Codecs below this point
//

const _BlockHeader: XdrCodec<BlockHeader> = {
  encode(w, val) {
    w.writeUint64(val.network_id);
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.SHA256Hash.encode(w, val.txset_hash);
    proto.codec.DbHash.encode(w, val.db_hash);
    proto.codec.SHA256Hash.encode(w, val.events_hash);
    proto.codec.BlockHash.encode(w, val.prev_block_hash);
  },
  decode(r) {
    const network_id = r.readUint64();
    const block_height = proto.codec.BlockHeight.decode(r);
    const txset_hash = proto.codec.SHA256Hash.decode(r);
    const db_hash = proto.codec.DbHash.decode(r);
    const events_hash = proto.codec.SHA256Hash.decode(r);
    const prev_block_hash = proto.codec.BlockHash.decode(r);
    return { network_id, block_height, txset_hash, db_hash, events_hash, prev_block_hash };
  },
};

export const codec = {
  BlockHeader: _BlockHeader,
} as const;

