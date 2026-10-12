// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 90ab53996dddd3e3954ac09fc10609aa15fae2a4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@thruputchain/xdr";
import * as proto from "./index.js";




export interface eventexecutor_report_tx_failure_args {
  arg0: proto.TransactionHash;
  arg1: proto.TxFailureDiagnostic;
}

export interface eventexecutor_emit_event_args {
  arg0: proto.BlockID;
  arg1: proto.TransactionID;
  arg2: proto.TxEventLog;
  arg3: proto.ProposedTransaction;
}

export type EventBlockResult =
  | { error: proto.RPCError.kRPCNone; root_hash: proto.SHA256Hash }
  | { error: number }
;


export interface eventsched_close_block_args {
  arg0: proto.BlockID;
  arg1: proto.BlockHeight;
}

export interface eventsched_commit_block_args {
  arg0: proto.BlockID;
  arg1: proto.ConsensusValue;
}


//
// XDR Codecs below this point
//

const _eventexecutor_report_tx_failure_args: XdrCodec<eventexecutor_report_tx_failure_args> = {
  encode(w, val) {
    proto.codec.TransactionHash.encode(w, val.arg0);
    proto.codec.TxFailureDiagnostic.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.TransactionHash.decode(r);
    const arg1 = proto.codec.TxFailureDiagnostic.decode(r);
    return { arg0, arg1 };
  },
};

const _eventexecutor_emit_event_args: XdrCodec<eventexecutor_emit_event_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.TransactionID.encode(w, val.arg1);
    proto.codec.TxEventLog.encode(w, val.arg2);
    proto.codec.ProposedTransaction.encode(w, val.arg3);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.TransactionID.decode(r);
    const arg2 = proto.codec.TxEventLog.decode(r);
    const arg3 = proto.codec.ProposedTransaction.decode(r);
    return { arg0, arg1, arg2, arg3 };
  },
};

const _EventBlockResult: XdrCodec<EventBlockResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.RPCError.kRPCNone:
      {
        const v = val as { error: number; root_hash: proto.SHA256Hash };
        if (v.root_hash === undefined) {
          throw new Error("EventBlockResult encode: root_hash is undefined");
        }
        proto.codec.SHA256Hash.encode(w, v.root_hash);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.RPCError.kRPCNone:
        const root_hash = proto.codec.SHA256Hash.decode(r);
        return { error, root_hash };
      default:
        return { error };
    }
  },
};

const _eventsched_close_block_args: XdrCodec<eventsched_close_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.BlockHeight.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.BlockHeight.decode(r);
    return { arg0, arg1 };
  },
};

const _eventsched_commit_block_args: XdrCodec<eventsched_commit_block_args> = {
  encode(w, val) {
    proto.codec.BlockID.encode(w, val.arg0);
    proto.codec.ConsensusValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockID.decode(r);
    const arg1 = proto.codec.ConsensusValue.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  EventBlockResult: _EventBlockResult,
} as const;

export const EventExecutorProgram: RpcProgramMeta = {
  programId: 0x8aa81224,
  version: 1,
  methods: {
    eventexecutor_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    eventexecutor_open_block: { proc: 31, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventexecutor_close_block: { proc: 32, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventexecutor_report_tx_failure: { proc: 33, request: () => _eventexecutor_report_tx_failure_args, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventexecutor_emit_event: { proc: 30, request: () => _eventexecutor_emit_event_args, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
  },
};

export const EventSchedProgram: RpcProgramMeta = {
  programId: 0x8aa81226,
  version: 1,
  methods: {
    eventsched_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    eventsched_open_block: { proc: 10, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventsched_close_block: { proc: 30, request: () => _eventsched_close_block_args, response: () => _EventBlockResult },
    eventsched_commit_block: { proc: 31, request: () => _eventsched_commit_block_args, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
    eventsched_abandon_block: { proc: 40, request: () => proto.codec.BlockID as XdrCodec<proto.BlockID>, response: () => proto.codec.RPCError as XdrCodec<proto.RPCError> },
  },
};

