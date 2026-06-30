/**
 * Hex encoding/decoding for byte arrays.
 */

const hexChars = "0123456789abcdef";

/**
 * Encode bytes as a lowercase hexadecimal string without a `0x` prefix.
 *
 * @example
 * ```ts
 * toHex(new Uint8Array([0, 255])); // "00ff"
 * ```
 */
export function toHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += hexChars[bytes[i] >> 4];
    out += hexChars[bytes[i] & 0x0F];
  }
  return out;
}

/**
 * Decode a hexadecimal string into bytes.
 *
 * Accepts uppercase or lowercase digits and rejects odd-length strings or
 * non-hex characters.
 */
export function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: odd length ${hex.length}`);
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const hi = parseHexDigit(hex.charCodeAt(i));
    const lo = parseHexDigit(hex.charCodeAt(i + 1));
    bytes[i / 2] = (hi << 4) | lo;
  }
  return bytes;
}

function parseHexDigit(charCode: number): number {
  // 0-9
  if (charCode >= 48 && charCode <= 57) return charCode - 48;
  // a-f
  if (charCode >= 97 && charCode <= 102) return charCode - 87;
  // A-F
  if (charCode >= 65 && charCode <= 70) return charCode - 55;
  throw new Error(`Invalid hex character: ${String.fromCharCode(charCode)}`);
}
