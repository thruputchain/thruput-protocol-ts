const INITIAL_CAPACITY = 256;

export class XdrWriter {
  private buf: Uint8Array;
  private view: DataView;
  private pos: number = 0;

  constructor(capacity: number = INITIAL_CAPACITY) {
    this.buf = new Uint8Array(capacity);
    this.view = new DataView(this.buf.buffer);
  }

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

  writeInt32(val: bigint): void {
    if (val < -0x80000000n || val > 0x7FFFFFFFn) {
      throw new Error(`int32 overflow: ${val}`);
    }
    this.grow(4);
    this.view.setInt32(this.pos, Number(val));
    this.pos += 4;
  }

  writeUint32(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFn) {
      throw new Error(`uint32 overflow: ${val}`);
    }
    this.grow(4);
    this.view.setUint32(this.pos, Number(val));
    this.pos += 4;
  }

  writeInt64(val: bigint): void {
    if (val < -(1n << 63n) || val > (1n << 63n) - 1n) {
      throw new Error(`int64 overflow: ${val}`);
    }
    this.grow(8);
    this.view.setBigInt64(this.pos, val);
    this.pos += 8;
  }

  writeUint64(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFFFFFFFFFn) {
      throw new Error(`uint64 overflow: ${val}`);
    }
    this.grow(8);
    this.view.setBigUint64(this.pos, val);
    this.pos += 8;
  }

  writeInt128(val: bigint): void {
    if (val < -(1n << 127n) || val > (1n << 127n) - 1n) {
      throw new Error(`int128 overflow: ${val}`);
    }
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = (val >> 64n);
    this.writeInt64(highbits);
    this.writeUint64(lowbits);
  }

  writeUint128(val: bigint): void {
    if (val < 0n || val > (1n << 128n) - 1n) {
      throw new Error(`uint128 overflow: ${val}`);
    }
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = val >> 64n;
    this.writeUint64(highbits);
    this.writeUint64(lowbits);
  }

  writeBool(val: boolean): void {
    this.writeInt32(val ? 1n : 0n);
  }

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

  writeVarOpaque(val: Uint8Array, max: number): void {
    if (val.length > max) {
      throw new Error(`var opaque exceeds max: ${val.length} > ${max}`);
    }
    this.writeUint32(BigInt(val.length));
    const padded = paddedLen(val.length);
    this.grow(padded);
    this.buf.set(val, this.pos);
    for (let i = val.length; i < padded; i++) {
      this.buf[this.pos + i] = 0;
    }
    this.pos += padded;
  }

  writeString(val: string, max: number): void {
    const encoded = new TextEncoder().encode(val);
    this.writeVarOpaque(encoded, max);
  }
}

function paddedLen(len: number): number {
  return (len + 3) & ~3;
}
