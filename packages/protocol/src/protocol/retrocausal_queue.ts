// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 003a0d33894e4c7c48474454948073bd6d10da45

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export const kQueueEntryMaxLen = 256n;

export type QueueEntry = Uint8Array & { readonly __brand: "QueueEntry" };
export function queueEntry(data: Uint8Array): QueueEntry {
  if (data.length > Number(kQueueEntryMaxLen)) throw new Error(`QueueEntry exceeds max length kQueueEntryMaxLen, got ${data.length}`);
  return data as QueueEntry;
}

export const kMaxConcurrentRcqReadsPerTx = 16384n;

export const kRetrocausalQueueBlockEntriesMaxLen = 250n;

export interface RetrocausalQueueBlock {
  entries: proto.QueueEntry[];
  block_number: bigint;
}

export interface RetrocausalQueuePastBlockConsumeDelta {
  max_fully_consumed_block_number: bigint;
  partial_consumed_number: bigint;
}

export interface RetrocausalQueueMetadata {
  consume_state: proto.RetrocausalQueuePastBlockConsumeDelta;
  max_live_block_num: bigint;
  live_entries: bigint;
}

export interface RetrocausalQueueConsumeDelta {
  past_block_consume: proto.RetrocausalQueuePastBlockConsumeDelta;
  current_block_consumed: proto.QueueEntry[];
}

export interface RetrocausalQueueInsertDelta {
  added_entries: proto.QueueEntry[];
}

export interface RetrocausalQueueDelta {
  consume: proto.RetrocausalQueueConsumeDelta | null;
  insert: proto.RetrocausalQueueInsertDelta;
  observed_concurrent_entries: proto.QueueEntry[];
}


//
// XDR Codecs below this point
//

const _QueueEntry: XdrCodec<QueueEntry> = {
  encode(w, val) { w.writeVarOpaque(val, Number(proto.kQueueEntryMaxLen)); },
  decode(r) { return queueEntry(r.readVarOpaque(Number(proto.kQueueEntryMaxLen))); },
};

const _RetrocausalQueueBlock: XdrCodec<RetrocausalQueueBlock> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.QueueEntry, Number(0xFFFFFFFF)).encode(w, val.entries);
    w.writeUint64(val.block_number);
  },
  decode(r) {
    const entries = VarArrayCodec(proto.codec.QueueEntry, Number(0xFFFFFFFF)).decode(r);
    const block_number = r.readUint64();
    return { entries, block_number };
  },
};

const _RetrocausalQueuePastBlockConsumeDelta: XdrCodec<RetrocausalQueuePastBlockConsumeDelta> = {
  encode(w, val) {
    w.writeUint64(val.max_fully_consumed_block_number);
    w.writeUint64(val.partial_consumed_number);
  },
  decode(r) {
    const max_fully_consumed_block_number = r.readUint64();
    const partial_consumed_number = r.readUint64();
    return { max_fully_consumed_block_number, partial_consumed_number };
  },
};

const _RetrocausalQueueMetadata: XdrCodec<RetrocausalQueueMetadata> = {
  encode(w, val) {
    proto.codec.RetrocausalQueuePastBlockConsumeDelta.encode(w, val.consume_state);
    w.writeUint64(val.max_live_block_num);
    w.writeUint64(val.live_entries);
  },
  decode(r) {
    const consume_state = proto.codec.RetrocausalQueuePastBlockConsumeDelta.decode(r);
    const max_live_block_num = r.readUint64();
    const live_entries = r.readUint64();
    return { consume_state, max_live_block_num, live_entries };
  },
};

const _RetrocausalQueueConsumeDelta: XdrCodec<RetrocausalQueueConsumeDelta> = {
  encode(w, val) {
    proto.codec.RetrocausalQueuePastBlockConsumeDelta.encode(w, val.past_block_consume);
    VarArrayCodec(proto.codec.QueueEntry, Number(proto.kRetrocausalQueueBlockEntriesMaxLen)).encode(w, val.current_block_consumed);
  },
  decode(r) {
    const past_block_consume = proto.codec.RetrocausalQueuePastBlockConsumeDelta.decode(r);
    const current_block_consumed = VarArrayCodec(proto.codec.QueueEntry, Number(proto.kRetrocausalQueueBlockEntriesMaxLen)).decode(r);
    return { past_block_consume, current_block_consumed };
  },
};

const _RetrocausalQueueInsertDelta: XdrCodec<RetrocausalQueueInsertDelta> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.QueueEntry, Number(proto.kRetrocausalQueueBlockEntriesMaxLen)).encode(w, val.added_entries);
  },
  decode(r) {
    const added_entries = VarArrayCodec(proto.codec.QueueEntry, Number(proto.kRetrocausalQueueBlockEntriesMaxLen)).decode(r);
    return { added_entries };
  },
};

const _RetrocausalQueueDelta: XdrCodec<RetrocausalQueueDelta> = {
  encode(w, val) {
    OptionCodec(_RetrocausalQueueConsumeDelta).encode(w, val.consume);
    proto.codec.RetrocausalQueueInsertDelta.encode(w, val.insert);
    VarArrayCodec(proto.codec.QueueEntry, Number(proto.kMaxConcurrentRcqReadsPerTx)).encode(w, val.observed_concurrent_entries);
  },
  decode(r) {
    const consume = OptionCodec(_RetrocausalQueueConsumeDelta).decode(r);
    const insert = proto.codec.RetrocausalQueueInsertDelta.decode(r);
    const observed_concurrent_entries = VarArrayCodec(proto.codec.QueueEntry, Number(proto.kMaxConcurrentRcqReadsPerTx)).decode(r);
    return { consume, insert, observed_concurrent_entries };
  },
};

export const codec = {
  QueueEntry: _QueueEntry,
  RetrocausalQueueBlock: _RetrocausalQueueBlock,
  RetrocausalQueuePastBlockConsumeDelta: _RetrocausalQueuePastBlockConsumeDelta,
  RetrocausalQueueMetadata: _RetrocausalQueueMetadata,
  RetrocausalQueueConsumeDelta: _RetrocausalQueueConsumeDelta,
  RetrocausalQueueInsertDelta: _RetrocausalQueueInsertDelta,
  RetrocausalQueueDelta: _RetrocausalQueueDelta,
} as const;

