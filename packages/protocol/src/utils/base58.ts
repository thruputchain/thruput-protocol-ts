import { base58 } from "@scure/base";

/** Conservative text bound for a maximum decoded byte length. */
export function maxBase58Length(maxBytes: number): number {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError("Byte limit must be a nonnegative safe integer");
  }
  if (maxBytes === 0) return 0;
  if (maxBytes > Math.floor((Number.MAX_SAFE_INTEGER - 1) / 138)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.floor((maxBytes * 138) / 100) + 1;
}

/** Encode bytes with the Bitcoin/Solana alphabet, preserving leading zeros. */
export function toBase58(bytes: Uint8Array): string {
  return base58.encode(bytes);
}

/**
 * Decode base58 with an explicit byte limit, rejecting whitespace and prefixes.
 * Errors omit the supplied text. The limit bounds size, not conversion time.
 */
export function fromBase58(text: string, maxBytes: number): Uint8Array {
  const maxLength = maxBase58Length(maxBytes);
  if (typeof text !== "string") throw new TypeError("Expected base58 text");
  if (text.length > maxLength)
    throw new Error("Base58 value exceeds byte limit");
  let bytes: Uint8Array;
  try {
    bytes = base58.decode(text);
  } catch {
    throw new Error("Invalid base58 encoding");
  }
  if (bytes.length > maxBytes) {
    bytes.fill(0);
    throw new Error("Base58 value exceeds byte limit");
  }
  return bytes;
}
