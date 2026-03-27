// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 33b572011b97781c388215e8d1e06f5fe816fa06

import type { XdrCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export interface TransferEvent {
  from_address: proto.ContractAddress;
  to_address: proto.ContractAddress;
  amount: proto.int128_xdr;
}

export interface ApprovalEvent {
  owner_address: proto.ContractAddress;
  spender_address: proto.ContractAddress;
  amount: proto.int128_xdr;
}


//
// XDR Codecs below this point
//

const _TransferEvent: XdrCodec<TransferEvent> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.from_address);
    proto.codec.ContractAddress.encode(w, val.to_address);
    proto.codec.int128_xdr.encode(w, val.amount);
  },
  decode(r) {
    const from_address = proto.codec.ContractAddress.decode(r);
    const to_address = proto.codec.ContractAddress.decode(r);
    const amount = proto.codec.int128_xdr.decode(r);
    return { from_address, to_address, amount };
  },
};

const _ApprovalEvent: XdrCodec<ApprovalEvent> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.owner_address);
    proto.codec.ContractAddress.encode(w, val.spender_address);
    proto.codec.int128_xdr.encode(w, val.amount);
  },
  decode(r) {
    const owner_address = proto.codec.ContractAddress.decode(r);
    const spender_address = proto.codec.ContractAddress.decode(r);
    const amount = proto.codec.int128_xdr.decode(r);
    return { owner_address, spender_address, amount };
  },
};

export const codec = {
  TransferEvent: _TransferEvent,
  ApprovalEvent: _ApprovalEvent,
} as const;

