// retrocausal_queue.ts — from retrocausal_queue.x

export const kQueueEntryMaxLen = 256n;

export type QueueEntry = Uint8Array & { readonly __brand: "QueueEntry" };
export function queueEntry(data: Uint8Array): QueueEntry {
  if (data.length > Number(kQueueEntryMaxLen)) {
    throw new Error(`QueueEntry exceeds max length ${kQueueEntryMaxLen}, got ${data.length}`);
  }
  return data as QueueEntry;
}
