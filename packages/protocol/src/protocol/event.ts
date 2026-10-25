// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: d205b2a2427fe9af85bb4fcdcf7e85ac770d5961

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export const kMaxEventLength = 1024n;
/**
 * Type-level value of {@link kMaxEventLength}, for use in array-bound positions.
 * @hidden
 */
export type kMaxEventLength = 1024;

export const kMaxEventsPerTransaction = 1000n;
/**
 * Type-level value of {@link kMaxEventsPerTransaction}, for use in array-bound positions.
 * @hidden
 */
export type kMaxEventsPerTransaction = 1000;

export const kMaxTopics = 3n;
/**
 * Type-level value of {@link kMaxTopics}, for use in array-bound positions.
 * @hidden
 */
export type kMaxTopics = 3;

/** XDR: `typedef opaque Topic[32]` — exactly 32 bytes. */
export type Topic = FixedBytes<32> & { readonly __brand: { readonly Topic: true } };
export function topic(data: Uint8Array): Topic {
  if (data.length !== 32) throw new Error(`Topic must be exactly 32 bytes, got ${data.length}`);
  return data as Topic;
}

export interface TxEmittedEvent {
  contract_address: proto.ContractAddress;
  num_topics: bigint;
  /** XDR: `opaque serialized_event<kMaxEventLength>` — max {@link kMaxEventLength} bytes. */
  serialized_event: VarBytes<proto.kMaxEventLength>;
}

export interface TxEventLog {
  tx_hash: proto.TransactionHash;
  exec_result: proto.ExecResult;
  root_output: proto.InvocationFrameOutput;
  gas_consumed: proto.GasAmount;
  /** XDR: `TxEmittedEvent events<kMaxEventsPerTransaction>` — max {@link kMaxEventsPerTransaction} elements. */
  events: VarArray<proto.TxEmittedEvent, proto.kMaxEventsPerTransaction>;
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
    proto.codec.GasAmount.encode(w, val.gas_consumed);
    VarArrayCodec(proto.codec.TxEmittedEvent, Number(proto.kMaxEventsPerTransaction)).encode(w, val.events);
  },
  decode(r) {
    const tx_hash = proto.codec.TransactionHash.decode(r);
    const exec_result = proto.codec.ExecResult.decode(r);
    const root_output = proto.codec.InvocationFrameOutput.decode(r);
    const gas_consumed = proto.codec.GasAmount.decode(r);
    const events = VarArrayCodec(proto.codec.TxEmittedEvent, Number(proto.kMaxEventsPerTransaction)).decode(r);
    return { tx_hash, exec_result, root_output, gas_consumed, events };
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

