import type { IWriter } from "./codec.js";
import { paddedLen } from "./padding.js";

const INITIAL_CAPACITY = 256;
const textEncoder = new TextEncoder();

/** Writes standard XDR bytes as defined by RFC 4506. */
export class XdrWriter implements IWriter {
  private buf: Uint8Array;
  private view: DataView;
  private pos: number = 0;

  /** Create a writer with an optional initial buffer capacity. */
  constructor(capacity: number = INITIAL_CAPACITY) {
    this.buf = new Uint8Array(capacity);
    this.view = new DataView(this.buf.buffer);
  }

  /** Return the written bytes without unused buffer capacity. */
  finish(): Uint8Array {
    return this.buf.slice(0, this.pos);
  }

  private grow(needed: number): void {
    const required = this.pos + needed;
    if (required <= this.buf.length) return;
    let newCap = this.buf.length * 2;
    while (newCap < required) newCap *= 2;
    const newBuf = new Uint8Array(newCap);
    newBuf.set(this.buf);
    this.buf = newBuf;
    this.view = new DataView(this.buf.buffer);
  }

  /** Write a signed 32-bit integer in big-endian XDR form. */
  writeInt32(val: bigint): void {
    if (val < -0x80000000n || val > 0x7FFFFFFFn) {
      throw new Error(`int32 overflow: ${val}`);
    }
    this.grow(4);
    this.view.setInt32(this.pos, Number(val));
    this.pos += 4;
  }

  /** Write an unsigned 32-bit integer in big-endian XDR form. */
  writeUint32(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFn) {
      throw new Error(`uint32 overflow: ${val}`);
    }
    this.grow(4);
    this.view.setUint32(this.pos, Number(val));
    this.pos += 4;
  }

  /** Write a signed 64-bit integer in big-endian XDR form. */
  writeInt64(val: bigint): void {
    if (val < -(1n << 63n) || val > (1n << 63n) - 1n) {
      throw new Error(`int64 overflow: ${val}`);
    }
    this.grow(8);
    this.view.setBigInt64(this.pos, val);
    this.pos += 8;
  }

  /** Write an unsigned 64-bit integer in big-endian XDR form. */
  writeUint64(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFFFFFFFFFn) {
      throw new Error(`uint64 overflow: ${val}`);
    }
    this.grow(8);
    this.view.setBigUint64(this.pos, val);
    this.pos += 8;
  }

  /** Write a signed 128-bit integer as high signed 64 bits followed by low unsigned 64 bits. */
  writeInt128(val: bigint): void {
    if (val < -(1n << 127n) || val > (1n << 127n) - 1n) {
      throw new Error(`int128 overflow: ${val}`);
    }
    this.grow(16);
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = (val >> 64n);
    this.view.setBigInt64(this.pos, highbits);
    this.view.setBigUint64(this.pos + 8, lowbits);
    this.pos += 16;
  }

  /** Write an unsigned 128-bit integer as two unsigned 64-bit words. */
  writeUint128(val: bigint): void {
    if (val < 0n || val > (1n << 128n) - 1n) {
      throw new Error(`uint128 overflow: ${val}`);
    }
    this.grow(16);
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = val >> 64n;
    this.view.setBigUint64(this.pos, highbits);
    this.view.setBigUint64(this.pos + 8, lowbits);
    this.pos += 16;
  }

  /** Write a boolean as XDR int32 value `0` or `1`. */
  writeBool(val: boolean): void {
    this.writeInt32(val ? 1n : 0n);
  }

  /** Write fixed-length opaque bytes and add XDR zero padding to a 4-byte boundary. */
  writeFixedOpaque(val: Uint8Array, len: number): void {
    if (val.length !== len) {
      throw new Error(`fixed opaque length mismatch: expected ${len}, got ${val.length}`);
    }
    const padded = paddedLen(len);
    this.grow(padded);
    this.buf.set(val, this.pos);
    for (let i = len; i < padded; i++) {
      this.buf[this.pos + i] = 0;
    }
    this.pos += padded;
  }

  /** Write length-prefixed opaque bytes, bounded by `max`, with XDR padding. */
  writeVarOpaque(val: Uint8Array, max: number): void {
    if (val.length > max) {
      throw new Error(`var opaque exceeds max: ${val.length} > ${max}`);
    }
    this.writeUint32(BigInt(val.length));
    this.writeFixedOpaque(val, val.length);
  }

  /** UTF-8 encode and write a length-prefixed string bounded by `max` bytes. */
  writeString(val: string, max: number): void {
    const encoded = textEncoder.encode(val);
    this.writeVarOpaque(encoded, max);
  }
}
