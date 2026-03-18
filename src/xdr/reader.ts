export class XdrReader {
  private view: DataView;
  private pos: number = 0;

  constructor(private data: Uint8Array) {
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  private ensure(n: number): void {
    if (this.pos + n > this.data.length) {
      throw new Error(
        `XDR read past end: need ${n} bytes at offset ${this.pos}, have ${this.data.length}`
      );
    }
  }

  readInt32(): bigint {
    this.ensure(4);
    const val = this.view.getInt32(this.pos);
    this.pos += 4;
    return BigInt(val);
  }

  readUint32(): bigint {
    this.ensure(4);
    const val = this.view.getUint32(this.pos);
    this.pos += 4;
    return BigInt(val);
  }

  readInt64(): bigint {
    this.ensure(8);
    const val = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return val;
  }

  readUint64(): bigint {
    this.ensure(8);
    const val = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return val;
  }

  readInt128(): bigint {
    const highbits = this.readInt64();
    const lowbits = this.readUint64();
    return (highbits << 64n) | lowbits;
  }

  readUint128(): bigint {
    const highbits = this.readUint64();
    const lowbits = this.readUint64();
    return (highbits << 64n) | lowbits;
  }

  readBool(): boolean {
    const val = this.readInt32();
    if (val !== 0n && val !== 1n) {
      throw new Error(`invalid bool value: ${val}`);
    }
    return val === 1n;
  }

  readFixedOpaque(len: number): Uint8Array {
    const padded = (len + 3) & ~3;
    this.ensure(padded);
    const result = this.data.slice(this.pos, this.pos + len);
    this.pos += padded;
    return result;
  }

  readVarOpaque(max: number): Uint8Array {
    const len = Number(this.readUint32());
    if (len > max) {
      throw new Error(`var opaque length ${len} exceeds max ${max}`);
    }
    return this.readFixedOpaque(len);
  }

  readString(max: number): string {
    const bytes = this.readVarOpaque(max);
    return new TextDecoder().decode(bytes);
  }
}
