// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 3f9085a9d256ce71dd85566a4608e897076b5424

import type { XdrCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export const kQueueEntryMaxLen = 256n;

export type QueueEntry = Uint8Array & { readonly __brand: "QueueEntry" };
export function queueEntry(data: Uint8Array): QueueEntry {
  if (data.length > Number(kQueueEntryMaxLen)) throw new Error(`QueueEntry exceeds max length kQueueEntryMaxLen, got ${data.length}`);
  return data as QueueEntry;
}

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
    w.writeUint32(BigInt(val.entries.length));
    for (const _item of val.entries) proto.codec.QueueEntry.encode(w, _item);
    w.writeUint64(val.block_number);
  },
  decode(r) {
    const _entries_len = Number(r.readUint32());
    const entries = Array.from({ length: _entries_len }, () => proto.codec.QueueEntry.decode(r));
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
    w.writeUint32(BigInt(val.current_block_consumed.length));
    for (const _item of val.current_block_consumed) proto.codec.QueueEntry.encode(w, _item);
  },
  decode(r) {
    const past_block_consume = proto.codec.RetrocausalQueuePastBlockConsumeDelta.decode(r);
    const _current_block_consumed_len = Number(r.readUint32());
    const current_block_consumed = Array.from({ length: _current_block_consumed_len }, () => proto.codec.QueueEntry.decode(r));
    return { past_block_consume, current_block_consumed };
  },
};

const _RetrocausalQueueInsertDelta: XdrCodec<RetrocausalQueueInsertDelta> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.added_entries.length));
    for (const _item of val.added_entries) proto.codec.QueueEntry.encode(w, _item);
  },
  decode(r) {
    const _added_entries_len = Number(r.readUint32());
    const added_entries = Array.from({ length: _added_entries_len }, () => proto.codec.QueueEntry.decode(r));
    return { added_entries };
  },
};

const _RetrocausalQueueDelta: XdrCodec<RetrocausalQueueDelta> = {
  encode(w, val) {
    if (val.consume !== null) {
      w.writeUint32(1n);
      proto.codec.RetrocausalQueueConsumeDelta.encode(w, val.consume);
    } else {
      w.writeUint32(0n);
    }
    proto.codec.RetrocausalQueueInsertDelta.encode(w, val.insert);
  },
  decode(r) {
    const consume = Number(r.readUint32()) ? proto.codec.RetrocausalQueueConsumeDelta.decode(r) : null;
    const insert = proto.codec.RetrocausalQueueInsertDelta.decode(r);
    return { consume, insert };
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

