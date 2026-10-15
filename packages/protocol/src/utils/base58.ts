import { base58 } from "@scure/base";

/**
 * Conservative text bound for a nonnegative safe-integer byte limit.
 *
 * Uses 1.38 > log(256) / log(58), rounded up with room for leading zeros.
 * Very large limits saturate at Number.MAX_SAFE_INTEGER. This bound is a
 * precheck; text within it can still decode to more than the byte limit.
 */
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

/**
 * Encode bytes with the case-sensitive Bitcoin/Solana alphabet and no prefix.
 * Preserves leading zeros and encodes an empty array as an empty string.
 */
export function toBase58(bytes: Uint8Array): string {
  return base58.encode(bytes);
}

/**
 * Decode base58 with an explicit maximum byte length, preserving leading zeros.
 *
 * Accepts empty text, rejects whitespace and characters outside the alphabet,
 * and does not interpret prefixes or other encodings. The byte limit must be a
 * nonnegative safe integer. Callers enforce any exact identifier width.
 *
 * Errors omit the supplied text. Conversion has quadratic cost: use a small
 * byte limit appropriate to the field when decoding untrusted input.
 */
export function fromBase58(text: string, maxBytes: number): Uint8Array {
  const maxLength = maxBase58Length(maxBytes);
  if (typeof text !== "string") throw new TypeError("Expected base58 text");
  if (text.length > maxLength) {
    throw new Error("Base58 value exceeds byte limit");
  }
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
