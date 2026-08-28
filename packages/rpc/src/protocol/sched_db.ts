// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 14959ad52a564640d44d7079849fb9f146d330c0

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface ShardCard {
  protocol: proto.ProtocolCommit;
  upid: proto.UPID;
  block_height: proto.BlockHeight;
  address_for_exec: proto.ServerAddress;
  address_for_sched: proto.ServerAddress;
  address_for_auth: proto.ServerAddress;
}

export interface Delta {
  address: proto.ContractAddress;
  hog_delta: proto.int128_xdr;
}

export interface HogsTransferred {
  block: proto.BlockHeight;
  /** XDR: `Delta deltas<>`. */
  deltas: proto.Delta[];
}



//
// XDR Codecs below this point
//

const _ShardCard: XdrCodec<ShardCard> = {
  encode(w, val) {
    proto.codec.ProtocolCommit.encode(w, val.protocol);
    proto.codec.UPID.encode(w, val.upid);
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.ServerAddress.encode(w, val.address_for_exec);
    proto.codec.ServerAddress.encode(w, val.address_for_sched);
    proto.codec.ServerAddress.encode(w, val.address_for_auth);
  },
  decode(r) {
    const protocol = proto.codec.ProtocolCommit.decode(r);
    const upid = proto.codec.UPID.decode(r);
    const block_height = proto.codec.BlockHeight.decode(r);
    const address_for_exec = proto.codec.ServerAddress.decode(r);
    const address_for_sched = proto.codec.ServerAddress.decode(r);
    const address_for_auth = proto.codec.ServerAddress.decode(r);
    return { protocol, upid, block_height, address_for_exec, address_for_sched, address_for_auth };
  },
};

const _Delta: XdrCodec<Delta> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    proto.codec.int128_xdr.encode(w, val.hog_delta);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const hog_delta = proto.codec.int128_xdr.decode(r);
    return { address, hog_delta };
  },
};

const _HogsTransferred: XdrCodec<HogsTransferred> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.block);
    VarArrayCodec(proto.codec.Delta, Number(0xFFFFFFFF)).encode(w, val.deltas);
  },
  decode(r) {
    const block = proto.codec.BlockHeight.decode(r);
    const deltas = VarArrayCodec(proto.codec.Delta, Number(0xFFFFFFFF)).decode(r);
    return { block, deltas };
  },
};

export const codec = {
  ShardCard: _ShardCard,
  Delta: _Delta,
  HogsTransferred: _HogsTransferred,
} as const;

export const SchedDbProgram: RpcProgramMeta = {
  programId: 0x7ee79998,
  version: 1,
  methods: {
    scheddb_intro_shard: { proc: 1, request: () => _ShardCard, response: () => VoidCodec },
    scheddb_hogs_transferred: { proc: 2, request: () => _HogsTransferred, response: () => VoidCodec },
  },
};

