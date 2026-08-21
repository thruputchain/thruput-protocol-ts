// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 58301365769c00d43c91f44a53e2148f54fdfa6a

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export const kMaxEventLength = 1024n;

export const kMaxEventsPerTransaction = 1000n;

export const kMaxTopics = 3n;

export type Topic = Uint8Array & { readonly __brand: "Topic" };
export function topic(data: Uint8Array): Topic {
  if (data.length !== 32) throw new Error(`Topic must be exactly 32 bytes, got ${data.length}`);
  return data as Topic;
}

export interface TxEmittedEvent {
  contract_address: proto.ContractAddress;
  num_topics: bigint;
  serialized_event: Uint8Array;
}

export interface TxEventLog {
  tx_hash: proto.TransactionHash;
  exec_result: proto.ExecResult;
  root_output: proto.InvocationFrameOutput;
  events: proto.TxEmittedEvent[];
}

export interface IdentifiedEvent {
  tx_hash: proto.TransactionHash;
  block_height: proto.BlockHeight;
  sequence_number: bigint;
  emitted_event: proto.TxEmittedEvent;
}


//
// XDR Codecs below this point
//

const _Topic: XdrCodec<Topic> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return topic(r.readFixedOpaque(32)); },
};

const _TxEmittedEvent: XdrCodec<TxEmittedEvent> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.contract_address);
    w.writeUint32(val.num_topics);
    w.writeVarOpaque(val.serialized_event, Number(proto.kMaxEventLength));
  },
  decode(r) {
    const contract_address = proto.codec.ContractAddress.decode(r);
    const num_topics = r.readUint32();
    const serialized_event = r.readVarOpaque(Number(proto.kMaxEventLength));
    return { contract_address, num_topics, serialized_event };
  },
};

const _TxEventLog: XdrCodec<TxEventLog> = {
  encode(w, val) {
    proto.codec.TransactionHash.encode(w, val.tx_hash);
    proto.codec.ExecResult.encode(w, val.exec_result);
    proto.codec.InvocationFrameOutput.encode(w, val.root_output);
    VarArrayCodec(proto.codec.TxEmittedEvent, Number(proto.kMaxEventsPerTransaction)).encode(w, val.events);
  },
  decode(r) {
    const tx_hash = proto.codec.TransactionHash.decode(r);
    const exec_result = proto.codec.ExecResult.decode(r);
    const root_output = proto.codec.InvocationFrameOutput.decode(r);
    const events = VarArrayCodec(proto.codec.TxEmittedEvent, Number(proto.kMaxEventsPerTransaction)).decode(r);
    return { tx_hash, exec_result, root_output, events };
  },
};

const _IdentifiedEvent: XdrCodec<IdentifiedEvent> = {
  encode(w, val) {
    proto.codec.TransactionHash.encode(w, val.tx_hash);
    proto.codec.BlockHeight.encode(w, val.block_height);
    w.writeUint32(val.sequence_number);
    proto.codec.TxEmittedEvent.encode(w, val.emitted_event);
  },
  decode(r) {
    const tx_hash = proto.codec.TransactionHash.decode(r);
    const block_height = proto.codec.BlockHeight.decode(r);
    const sequence_number = r.readUint32();
    const emitted_event = proto.codec.TxEmittedEvent.decode(r);
    return { tx_hash, block_height, sequence_number, emitted_event };
  },
};

export const codec = {
  Topic: _Topic,
  TxEmittedEvent: _TxEmittedEvent,
  TxEventLog: _TxEventLog,
  IdentifiedEvent: _IdentifiedEvent,
} as const;

