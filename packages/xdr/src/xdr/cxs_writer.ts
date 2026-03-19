/**
 * CXS (Compact XDR Serialization) writer.
 *
 * Implements the same IWriter interface as XdrWriter but uses the CXS
 * compact encoding: variable-length integers, no padding on opaque data.
 * See CXS.md in the xdrs repo for the full specification.
 */

const INITIAL_CAPACITY = 256;
const textEncoder = new TextEncoder();

// Header byte constants
const V_MULTIBYTE = 63;
const S_1BYTE = 0 << 6;
const S_2BYTE = 1 << 6;
const S_4BYTE = 2 << 6;
const S_8BYTE = 3 << 6;

// Max values that fit in the header byte alone
const UH_MAX = 62;   // unsigned
const IH_MAX = 31;   // signed positive
const IH_MIN = -31;  // signed negative

export class CxsWriter {
  private buf: Uint8Array;
  private pos: number = 0;

  constructor(capacity: number = INITIAL_CAPACITY) {
    this.buf = new Uint8Array(capacity);
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
  }

  private putByte(b: number): void {
    this.grow(1);
    this.buf[this.pos++] = b;
  }

  private putBytes(bytes: Uint8Array): void {
    this.grow(bytes.length);
    this.buf.set(bytes, this.pos);
    this.pos += bytes.length;
  }

  // --- Signed integer encoding (cascading: i64 → i32 → i16 → i8 → header) ---

  private writeSignedI8(n: number): void {
    if (n < IH_MIN || n > IH_MAX) {
      // 1-byte representation: header + 1 byte
      this.putByte(V_MULTIBYTE | S_1BYTE);
      this.putByte(n & 0xFF); // two's complement byte
    } else {
      // Header-only: 6-bit one's complement
      const absN = Math.abs(n);
      const v = n >= 0 ? absN : ((~absN) & 0x1F) | 0x20;
      this.putByte(v); // s=0 is implicit (0 << 6)
    }
  }

  private writeSignedI16(n: number): void {
    if (n > 0x7F || n < -0x80) {
      // 2-byte representation: header + 2 LE bytes
      this.grow(3);
      this.buf[this.pos++] = V_MULTIBYTE | S_2BYTE;
      this.buf[this.pos++] = n & 0xFF;
      this.buf[this.pos++] = (n >> 8) & 0xFF;
    } else {
      this.writeSignedI8(n);
    }
  }

  private writeSignedI32(n: number): void {
    if (n > 0x7FFF || n < -0x8000) {
      // 4-byte representation: header + 4 LE bytes
      this.grow(5);
      this.buf[this.pos++] = V_MULTIBYTE | S_4BYTE;
      this.buf[this.pos++] = n & 0xFF;
      this.buf[this.pos++] = (n >> 8) & 0xFF;
      this.buf[this.pos++] = (n >> 16) & 0xFF;
      this.buf[this.pos++] = (n >> 24) & 0xFF;
    } else {
      this.writeSignedI16(n);
    }
  }

  writeInt32(val: bigint): void {
    if (val < -0x80000000n || val > 0x7FFFFFFFn) {
      throw new Error(`int32 overflow: ${val}`);
    }
    this.writeSignedI32(Number(val));
  }

  writeInt64(val: bigint): void {
    if (val < -(1n << 63n) || val > (1n << 63n) - 1n) {
      throw new Error(`int64 overflow: ${val}`);
    }
    if (val > 0x7FFFFFFFn || val < -0x80000000n) {
      // 8-byte representation: header + 8 LE bytes
      this.grow(9);
      this.buf[this.pos++] = V_MULTIBYTE | S_8BYTE;
      // Write 8 little-endian bytes from bigint
      let v = val < 0n ? val + (1n << 64n) : val; // unsigned representation
      for (let i = 0; i < 8; i++) {
        this.buf[this.pos++] = Number(v & 0xFFn);
        v >>= 8n;
      }
    } else {
      this.writeSignedI32(Number(val));
    }
  }

  writeInt128(val: bigint): void {
    if (val < -(1n << 127n) || val > (1n << 127n) - 1n) {
      throw new Error(`int128 overflow: ${val}`);
    }
    // CXS encodes int128 as the struct { highbits: i64, lowbits: u64 }
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = val >> 64n;
    this.writeInt64(highbits);
    this.writeUint64(lowbits);
  }

  // --- Unsigned integer encoding (cascading: u64 → u32 → u16 → u8 → header) ---

  private writeUnsignedU8(n: number): void {
    if (n > UH_MAX) {
      // 1-byte representation: header + 1 byte
      this.putByte(V_MULTIBYTE | S_1BYTE);
      this.putByte(n);
    } else {
      // Header-only
      this.putByte(n);
    }
  }

  private writeUnsignedU16(n: number): void {
    if (n > 0xFF) {
      // 2-byte representation
      this.grow(3);
      this.buf[this.pos++] = V_MULTIBYTE | S_2BYTE;
      this.buf[this.pos++] = n & 0xFF;
      this.buf[this.pos++] = (n >> 8) & 0xFF;
    } else {
      this.writeUnsignedU8(n);
    }
  }

  private writeUnsignedU32(n: number): void {
    if (n > 0xFFFF) {
      // 4-byte representation
      this.grow(5);
      this.buf[this.pos++] = V_MULTIBYTE | S_4BYTE;
      this.buf[this.pos++] = n & 0xFF;
      this.buf[this.pos++] = (n >> 8) & 0xFF;
      this.buf[this.pos++] = (n >> 16) & 0xFF;
      this.buf[this.pos++] = (n >>> 24) & 0xFF; // >>> for unsigned shift
    } else {
      this.writeUnsignedU16(n);
    }
  }

  writeUint32(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFn) {
      throw new Error(`uint32 overflow: ${val}`);
    }
    this.writeUnsignedU32(Number(val));
  }

  writeUint64(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFFFFFFFFFn) {
      throw new Error(`uint64 overflow: ${val}`);
    }
    if (val > 0xFFFFFFFFn) {
      // 8-byte representation
      this.grow(9);
      this.buf[this.pos++] = V_MULTIBYTE | S_8BYTE;
      let v = val;
      for (let i = 0; i < 8; i++) {
        this.buf[this.pos++] = Number(v & 0xFFn);
        v >>= 8n;
      }
    } else {
      this.writeUnsignedU32(Number(val));
    }
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

  // --- Opaque / string (no padding in CXS) ---

  writeFixedOpaque(val: Uint8Array, len: number): void {
    if (val.length !== len) {
      throw new Error(`fixed opaque length mismatch: expected ${len}, got ${val.length}`);
    }
    this.putBytes(val);
  }

  writeVarOpaque(val: Uint8Array, max: number): void {
    if (val.length > max) {
      throw new Error(`var opaque exceeds max: ${val.length} > ${max}`);
    }
    this.writeUint32(BigInt(val.length));
    this.putBytes(val);
  }

  writeString(val: string, max: number): void {
    const encoded = textEncoder.encode(val);
    this.writeVarOpaque(encoded, max);
  }
}
