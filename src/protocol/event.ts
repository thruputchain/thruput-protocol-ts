// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 3f9085a9d256ce71dd85566a4608e897076b5424

import type { XdrCodec } from "../xdr/codec.js";
import * as proto from "./index.js";



export const kMaxEventLength = 1024n;

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
  proposed_tx_hash: proto.SHA256Hash;
  events: proto.TxEmittedEvent[];
}

export interface IdentifiedEvent {
  proposed_tx_hash: proto.SHA256Hash;
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
    proto.codec.SHA256Hash.encode(w, val.proposed_tx_hash);
    w.writeUint32(BigInt(val.events.length));
    for (const _item of val.events) proto.codec.TxEmittedEvent.encode(w, _item);
  },
  decode(r) {
    const proposed_tx_hash = proto.codec.SHA256Hash.decode(r);
    const _events_len = Number(r.readUint32());
    const events = Array.from({ length: _events_len }, () => proto.codec.TxEmittedEvent.decode(r));
    return { proposed_tx_hash, events };
  },
};

const _IdentifiedEvent: XdrCodec<IdentifiedEvent> = {
  encode(w, val) {
    proto.codec.SHA256Hash.encode(w, val.proposed_tx_hash);
    w.writeUint32(val.sequence_number);
    proto.codec.TxEmittedEvent.encode(w, val.emitted_event);
  },
  decode(r) {
    const proposed_tx_hash = proto.codec.SHA256Hash.decode(r);
    const sequence_number = r.readUint32();
    const emitted_event = proto.codec.TxEmittedEvent.decode(r);
    return { proposed_tx_hash, sequence_number, emitted_event };
  },
};

export const codec = {
  Topic: _Topic,
  TxEmittedEvent: _TxEmittedEvent,
  TxEventLog: _TxEventLog,
  IdentifiedEvent: _IdentifiedEvent,
} as const;

