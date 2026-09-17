// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5135a63d54ca836265b87b8475a9c06f4d4624e4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
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

