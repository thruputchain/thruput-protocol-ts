import type { IReader } from "./codec.js";

const textDecoder = new TextDecoder();

/** Reads standard XDR bytes as defined by RFC 4506. */
export class XdrReader implements IReader {
  private view: DataView;
  private pos: number = 0;

  /** Create a reader over an XDR byte array. */
  constructor(private data: Uint8Array) {
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  /** Current byte offset in the input. */
  get position(): number { return this.pos; }

  /** Number of unread bytes remaining in the input. */
  get remaining(): number { return this.data.length - this.pos; }

  private ensure(n: number): void {
    if (this.pos + n > this.data.length) {
      throw new Error(
        `XDR read past end: need ${n} bytes at offset ${this.pos}, have ${this.data.length}`
      );
    }
  }

  /** Read a signed 32-bit integer. */
  readInt32(): bigint {
    this.ensure(4);
    const val = this.view.getInt32(this.pos);
    this.pos += 4;
    return BigInt(val);
  }

  /** Read an unsigned 32-bit integer. */
  readUint32(): bigint {
    this.ensure(4);
    const val = this.view.getUint32(this.pos);
    this.pos += 4;
    return BigInt(val);
  }

  /** Read a signed 64-bit integer. */
  readInt64(): bigint {
    this.ensure(8);
    const val = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return val;
  }

  /** Read an unsigned 64-bit integer. */
  readUint64(): bigint {
    this.ensure(8);
    const val = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return val;
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

  /** Read an XDR bool and reject values other than `0` and `1`. */
  readBool(): boolean {
    const val = this.readInt32();
    if (val !== 0n && val !== 1n) {
      throw new Error(`invalid bool value: ${val}`);
    }
    return val === 1n;
  }

  /** Read fixed-length opaque bytes and skip XDR zero padding. */
  readFixedOpaque(len: number): Uint8Array {
    const padded = (len + 3) & ~3;
    this.ensure(padded);
    const result = this.data.subarray(this.pos, this.pos + len);
    this.pos += padded;
    return result;
  }

  /** Read length-prefixed opaque bytes bounded by `max`. */
  readVarOpaque(max: number): Uint8Array {
    const len = Number(this.readUint32());
    if (len > max) {
      throw new Error(`var opaque length ${len} exceeds max ${max}`);
    }
    return this.readFixedOpaque(len);
  }

  /** Read and UTF-8 decode a length-prefixed string bounded by `max` bytes. */
  readString(max: number): string {
    const bytes = this.readVarOpaque(max);
    return textDecoder.decode(bytes);
  }
}
