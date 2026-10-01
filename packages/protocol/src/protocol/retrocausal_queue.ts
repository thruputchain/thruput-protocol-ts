// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: dcb5d7af8f39be558b0bfe56c0d0bb9163cce9f2

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export const kQueueEntryMaxLen = 256n;
/**
 * Type-level value of {@link kQueueEntryMaxLen}, for use in array-bound positions.
 * @hidden
 */
export type kQueueEntryMaxLen = 256;

/** XDR: `typedef opaque QueueEntry<kQueueEntryMaxLen>` — max {@link kQueueEntryMaxLen} bytes. */
export type QueueEntry = VarBytes<proto.kQueueEntryMaxLen> & { readonly __brand: { readonly QueueEntry: true } };
export function queueEntry(data: Uint8Array): QueueEntry {
  if (data.length > Number(proto.kQueueEntryMaxLen)) throw new Error(`QueueEntry exceeds max length kQueueEntryMaxLen, got ${data.length}`);
  return data as QueueEntry;
}

export const kMaxConcurrentRcqReadsPerTx = 16384n;
/**
 * Type-level value of {@link kMaxConcurrentRcqReadsPerTx}, for use in array-bound positions.
 * @hidden
 */
export type kMaxConcurrentRcqReadsPerTx = 16384;

export const kRetrocausalQueueBlockEntriesMaxLen = 250n;
/**
 * Type-level value of {@link kRetrocausalQueueBlockEntriesMaxLen}, for use in array-bound positions.
 * @hidden
 */
export type kRetrocausalQueueBlockEntriesMaxLen = 250;

export interface RetrocausalQueueBlock {
  /** XDR: `QueueEntry entries<>`. */
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
  /** XDR: `QueueEntry current_block_consumed<kRetrocausalQueueBlockEntriesMaxLen>` — max {@link kRetrocausalQueueBlockEntriesMaxLen} elements. */
  current_block_consumed: VarArray<proto.QueueEntry, proto.kRetrocausalQueueBlockEntriesMaxLen>;
}

export interface RetrocausalQueueInsertDelta {
  /** XDR: `QueueEntry added_entries<kRetrocausalQueueBlockEntriesMaxLen>` — max {@link kRetrocausalQueueBlockEntriesMaxLen} elements. */
  added_entries: VarArray<proto.QueueEntry, proto.kRetrocausalQueueBlockEntriesMaxLen>;
}

export interface RetrocausalQueueDelta {
  consume: proto.RetrocausalQueueConsumeDelta | null;
  insert: proto.RetrocausalQueueInsertDelta;
  /** XDR: `QueueEntry observed_concurrent_entries<kMaxConcurrentRcqReadsPerTx>` — max {@link kMaxConcurrentRcqReadsPerTx} elements. */
  observed_concurrent_entries: VarArray<proto.QueueEntry, proto.kMaxConcurrentRcqReadsPerTx>;
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

