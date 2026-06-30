/**
 * CXS (Compact XDR Serialization) reader.
 *
 * Implements the same IReader interface as XdrReader but decodes the CXS
 * compact encoding: variable-length integers, no padding on opaque data.
 * See CXS.md in the xdrs repo for the full specification.
 *
 * By default, validates minimal encoding (rejects non-shortest representations).
 */

import type { IReader } from "./codec.js";

const textDecoder = new TextDecoder();

// Max values that fit in the header byte alone
const UH_MAX = 62;
const IH_MAX = 31;
const IH_MIN = -31;

/** Reads compact XDR serialization (CXS) bytes. */
export class CxsReader implements IReader {
  private pos: number = 0;

  /** Create a reader over a CXS byte array. */
  constructor(private data: Uint8Array) {}

  /** Current byte offset in the input. */
  get position(): number { return this.pos; }

  /** Number of unread bytes remaining in the input. */
  get remaining(): number { return this.data.length - this.pos; }

  private ensure(n: number): void {
    if (this.pos + n > this.data.length) {
      throw new Error(
        `CXS read past end: need ${n} bytes at offset ${this.pos}, have ${this.data.length}`
      );
    }
  }

  private readByte(): number {
    this.ensure(1);
    return this.data[this.pos++];
  }

  // --- Core signed/unsigned decoders ---

  private readSigned(): bigint {
    const h = this.readByte();
    const s = (h & 0xC0) >> 6;
    const v = h & 0x3F;

    if (v === 63) {
      // Multi-byte: read 1/2/4/8 bytes based on s
      const nBytes = [1, 2, 4, 8][s];
      this.ensure(nBytes);

      // Read little-endian bytes into a bigint, with sign extension
      const bytes = this.data.subarray(this.pos, this.pos + nBytes);
      this.pos += nBytes;

      // Build unsigned value from LE bytes
      let n = 0n;
      for (let i = nBytes - 1; i >= 0; i--) {
        n = (n << 8n) | BigInt(bytes[i]);
      }

      // Sign extend: if high bit of the last byte is set, the value is negative
      if (bytes[nBytes - 1] & 0x80) {
        n -= 1n << BigInt(nBytes * 8);
      }

      // Validate minimal encoding — value must exceed the range of the
      // next-smaller representation. Matches Rust xdrs logic.
      const reprMinPos: bigint[] = [
        BigInt(IH_MAX) + 1n,   // s=0 (1-byte): must be > IH_MAX or < IH_MIN
        0x80n,                  // s=1 (2-byte): must exceed i8 range
        0x8000n,                // s=2 (4-byte): must exceed i16 range
        0x80000000n,            // s=3 (8-byte): must exceed i32 range
      ];
      const reprMaxNeg: bigint[] = [
        BigInt(IH_MIN) - 1n,
        -0x81n,
        -0x8001n,
        -0x80000001n,
      ];
      if (n >= 0n && n < reprMinPos[s]) throw new Error("CXS: non-minimal signed encoding");
      if (n < 0n && n > reprMaxNeg[s]) throw new Error("CXS: non-minimal signed encoding");

      return n;
    } else {
      // Header-only: 6-bit one's complement
      if (s !== 0) throw new Error(`CXS: invalid header byte 0x${h.toString(16)}`);

      if (v & 0x20) {
        // Sign bit set: negate the inverted lower 6 bits
        return -BigInt((~v) & 0x3F);
      } else {
        return BigInt(v);
      }
    }
  }

  private readUnsigned(): bigint {
    const h = this.readByte();
    const s = (h & 0xC0) >> 6;
    const v = h & 0x3F;

    if (v === 63) {
      // Multi-byte: read 1/2/4/8 bytes based on s
      const nBytes = [1, 2, 4, 8][s];
      this.ensure(nBytes);

      const bytes = this.data.subarray(this.pos, this.pos + nBytes);
      this.pos += nBytes;

      let n = 0n;
      for (let i = nBytes - 1; i >= 0; i--) {
        n = (n << 8n) | BigInt(bytes[i]);
      }

      // Validate minimal encoding
      const reprMin = [63n, 256n, 65536n, 4294967296n][s];
      if (n < reprMin) throw new Error("CXS: non-minimal unsigned encoding");

      return n;
    } else {
      // Header-only: v is the unsigned value directly
      if (s !== 0) throw new Error(`CXS: invalid header byte 0x${h.toString(16)}`);
      return BigInt(v);
    }
  }

  // --- IReader interface ---

  /** Read a signed 32-bit integer from CXS variable-length encoding. */
  readInt32(): bigint {
    const n = this.readSigned();
    if (n < -0x80000000n || n > 0x7FFFFFFFn) {
      throw new Error(`CXS: int32 out of range: ${n}`);
    }
    return n;
  }

  /** Read an unsigned 32-bit integer from CXS variable-length encoding. */
  readUint32(): bigint {
    const n = this.readUnsigned();
    if (n > 0xFFFFFFFFn) {
      throw new Error(`CXS: uint32 out of range: ${n}`);
    }
    return n;
  }

  /** Read a signed 64-bit integer from CXS variable-length encoding. */
  readInt64(): bigint {
    return this.readSigned();
  }

  /** Read an unsigned 64-bit integer from CXS variable-length encoding. */
  readUint64(): bigint {
    return this.readUnsigned();
  }

  /** Read a signed 128-bit integer. */
  readInt128(): bigint {
    const highbits = this.readInt64();
    const lowbits = this.readUint64();
    return (highbits << 64n) | lowbits;
  }

  /** Read an unsigned 128-bit integer. */
  readUint128(): bigint {
    const highbits = this.readUint64();
    const lowbits = this.readUint64();
    return (highbits << 64n) | lowbits;
  }

  /** Read a CXS bool and reject values other than `0` and `1`. */
  readBool(): boolean {
    const val = this.readInt32();
    if (val !== 0n && val !== 1n) {
      throw new Error(`CXS: invalid bool value: ${val}`);
    }
    return val === 1n;
  }

  // No padding in CXS
  /** Read fixed-length opaque bytes without padding. */
  readFixedOpaque(len: number): Uint8Array {
    this.ensure(len);
    const result = this.data.subarray(this.pos, this.pos + len);
    this.pos += len;
    return result;
  }

  /** Read length-prefixed opaque bytes bounded by `max`. */
  readVarOpaque(max: number): Uint8Array {
    const len = Number(this.readUint32());
    if (len > max) {
      throw new Error(`CXS: var opaque length ${len} exceeds max ${max}`);
    }
    return this.readFixedOpaque(len);
  }

  /** Read and UTF-8 decode a length-prefixed string bounded by `max` bytes. */
  readString(max: number): string {
    const bytes = this.readVarOpaque(max);
    return textDecoder.decode(bytes);
  }
}
