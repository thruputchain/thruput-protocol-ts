// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: d205b2a2427fe9af85bb4fcdcf7e85ac770d5961

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export interface AuthCard {
  protocol: proto.ProtocolCommit;
  upid: proto.UPID;
  address_for_db: proto.ServerAddress;
  address_for_mempool: proto.ServerAddress;
}


//
// XDR Codecs below this point
//

const _AuthCard: XdrCodec<AuthCard> = {
  encode(w, val) {
    proto.codec.ProtocolCommit.encode(w, val.protocol);
    proto.codec.UPID.encode(w, val.upid);
    proto.codec.ServerAddress.encode(w, val.address_for_db);
    proto.codec.ServerAddress.encode(w, val.address_for_mempool);
  },
  decode(r) {
    const protocol = proto.codec.ProtocolCommit.decode(r);
    const upid = proto.codec.UPID.decode(r);
    const address_for_db = proto.codec.ServerAddress.decode(r);
    const address_for_mempool = proto.codec.ServerAddress.decode(r);
    return { protocol, upid, address_for_db, address_for_mempool };
  },
};

export const codec = {
  AuthCard: _AuthCard,
} as const;

