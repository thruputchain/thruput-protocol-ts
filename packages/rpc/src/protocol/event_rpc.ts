// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";




export interface eventexecutor_emit_event_args {
  BlockID: proto.BlockID;
  TransactionID: proto.TransactionID;
  TxEventLog: proto.TxEventLog;
}

export type EventBlockResult =
  | { error: proto.RPCError.kRPCNone; root_hash: proto.SHA256Hash }
  | { error: number }
;


export interface eventsched_close_block_args {
  BlockID: proto.BlockID;
  BlockHeight: proto.BlockHeight;
}


//
// XDR Codecs below this point
//

const _eventexecutor_emit_event_args: XdrCodec<eventexecutor_emit_event_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.TransactionID.encode(w, val.TransactionID);
    proto.codec.TxEventLog.encode(w, val.TxEventLog);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const TransactionID = proto.codec.TransactionID.decode(r);
    const TxEventLog = proto.codec.TxEventLog.decode(r);
    return { BlockID, TransactionID, TxEventLog };
  },
};

const _EventBlockResult: XdrCodec<EventBlockResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
        proto.codec.SHA256Hash.encode(w, val.root_hash);
        break;
      default:
        break;
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const root_hash = proto.codec.SHA256Hash.decode(r);
        return { error, root_hash };
      default:
        return { error } as EventBlockResult;
    }
  },
};

const _eventsched_close_block_args: XdrCodec<eventsched_close_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.BlockID);
    proto.codec.BlockHeight.encode(w, val.BlockHeight);
  },
  decode(r) {
    const BlockID = proto.codec.BlockID.decode(r);
    const BlockHeight = proto.codec.BlockHeight.decode(r);
    return { BlockID, BlockHeight };
  },
};

export const codec = {
  eventexecutor_emit_event_args: _eventexecutor_emit_event_args,
  EventBlockResult: _EventBlockResult,
  eventsched_close_block_args: _eventsched_close_block_args,
} as const;

export const EventExecutorProgram: RpcProgramMeta = {
  programId: 0x8aa81224,
  version: 1,
  methods: {
    eventexecutor_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    eventexecutor_open_block: { proc: 31, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventexecutor_close_block: { proc: 32, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventexecutor_emit_event: { proc: 30, request: _eventexecutor_emit_event_args, response: proto.codec.RPCError as XdrCodec<proto.RPCError> },
  },
};

export const EventSchedProgram: RpcProgramMeta = {
  programId: 0x8aa81226,
  version: 1,
  methods: {
    eventsched_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    eventsched_open_block: { proc: 10, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventsched_get_block_hash: { proc: 20, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: _EventBlockResult },
    eventsched_close_block: { proc: 30, request: _eventsched_close_block_args, response: _EventBlockResult },
    eventsched_abandon_block: { proc: 40, request: proto.codec.BlockID as XdrCodec<proto.BlockID>, response: proto.codec.RPCError as XdrCodec<proto.RPCError> },
  },
};

