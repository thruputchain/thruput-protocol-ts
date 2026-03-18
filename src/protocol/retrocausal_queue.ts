// -*- TypeScript -*-
// Generated from retrocausal_queue.x — DO NOT EDIT
import { type XdrCodec } from "../xdr/codec.js";
import * as proto from "./index.js";

export const kQueueEntryMaxLen = 256n;

export type QueueEntry = Uint8Array & { readonly __brand: "QueueEntry" };
export function queueEntry(data: Uint8Array): QueueEntry {
  if (data.length > Number(kQueueEntryMaxLen)) {
    throw new Error(`QueueEntry exceeds max length ${kQueueEntryMaxLen}, got ${data.length}`);
  }
  return data as QueueEntry;
}

// ============================================================================
// XDR Codecs
// ============================================================================

const _QueueEntry: XdrCodec<proto.QueueEntry> = {
  encode(w, val) { w.writeVarOpaque(val, Number(proto.kQueueEntryMaxLen)); },
  decode(r) { return proto.queueEntry(r.readVarOpaque(Number(proto.kQueueEntryMaxLen))); },
};

export const codec = {
  QueueEntry: _QueueEntry,
} as const;
