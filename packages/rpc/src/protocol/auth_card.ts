// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: bab641a16d398d48b16086772f51d186ac0522cb

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface AuthCard {
  protocol: proto.Protocol;
  upid: proto.UPID;
  address_for_db: proto.ServerAddress;
  address_for_mempool: proto.ServerAddress;
}


//
// XDR Codecs below this point
//

const _AuthCard: XdrCodec<AuthCard> = {
  encode(w, val) {
    proto.codec.Protocol.encode(w, val.protocol);
    proto.codec.UPID.encode(w, val.upid);
    proto.codec.ServerAddress.encode(w, val.address_for_db);
    proto.codec.ServerAddress.encode(w, val.address_for_mempool);
  },
  decode(r) {
    const protocol = proto.codec.Protocol.decode(r);
    const upid = proto.codec.UPID.decode(r);
    const address_for_db = proto.codec.ServerAddress.decode(r);
    const address_for_mempool = proto.codec.ServerAddress.decode(r);
    return { protocol, upid, address_for_db, address_for_mempool };
  },
};

export const codec = {
  AuthCard: _AuthCard,
} as const;

