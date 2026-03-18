/**
 * XDR wire format tests — verify exact byte output per RFC 4506.
 *
 * These tests check that our encoder produces the exact bytes specified
 * by the XDR standard, not just that round-tripping works. This catches
 * endianness bugs, padding errors, and encoding mistakes that a
 * round-trip test would miss (since both sides would make the same mistake).
 */
import { describe, it, expect } from "vitest";
import { XdrWriter } from "../../src/xdr/writer.js";
import { XdrReader } from "../../src/xdr/reader.js";

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(h: string): Uint8Array {
  const bytes = new Uint8Array(h.length / 2);
  for (let i = 0; i < h.length; i += 2) {
    bytes[i / 2] = parseInt(h.substring(i, i + 2), 16);
  }
  return bytes;
}

describe("XDR wire format — integers", () => {
  // RFC 4506 §4.1: Integer (32-bit big-endian two's complement)
  it("int32: 0 → 00000000", () => {
    const w = new XdrWriter();
    w.writeInt32(0n);
    expect(hex(w.finish())).toBe("00000000");
  });

  it("int32: 1 → 00000001", () => {
    const w = new XdrWriter();
    w.writeInt32(1n);
    expect(hex(w.finish())).toBe("00000001");
  });

  it("int32: -1 → ffffffff", () => {
    const w = new XdrWriter();
    w.writeInt32(-1n);
    expect(hex(w.finish())).toBe("ffffffff");
  });

  it("int32: 127 → 0000007f", () => {
    const w = new XdrWriter();
    w.writeInt32(127n);
    expect(hex(w.finish())).toBe("0000007f");
  });

  it("int32: -128 → ffffff80", () => {
    const w = new XdrWriter();
    w.writeInt32(-128n);
    expect(hex(w.finish())).toBe("ffffff80");
  });

  it("int32: 2147483647 (max) → 7fffffff", () => {
    const w = new XdrWriter();
    w.writeInt32(2147483647n);
    expect(hex(w.finish())).toBe("7fffffff");
  });

  it("int32: -2147483648 (min) → 80000000", () => {
    const w = new XdrWriter();
    w.writeInt32(-2147483648n);
    expect(hex(w.finish())).toBe("80000000");
  });

  // RFC 4506 §4.2: Unsigned Integer (32-bit big-endian)
  it("uint32: 0 → 00000000", () => {
    const w = new XdrWriter();
    w.writeUint32(0n);
    expect(hex(w.finish())).toBe("00000000");
  });

  it("uint32: 256 → 00000100", () => {
    const w = new XdrWriter();
    w.writeUint32(256n);
    expect(hex(w.finish())).toBe("00000100");
  });

  it("uint32: 4294967295 (max) → ffffffff", () => {
    const w = new XdrWriter();
    w.writeUint32(4294967295n);
    expect(hex(w.finish())).toBe("ffffffff");
  });

  // RFC 4506 §4.5: Hyper Integer (64-bit big-endian two's complement)
  it("int64: 0 → 0000000000000000", () => {
    const w = new XdrWriter();
    w.writeInt64(0n);
    expect(hex(w.finish())).toBe("0000000000000000");
  });

  it("int64: 1 → 0000000000000001", () => {
    const w = new XdrWriter();
    w.writeInt64(1n);
    expect(hex(w.finish())).toBe("0000000000000001");
  });

  it("int64: -1 → ffffffffffffffff", () => {
    const w = new XdrWriter();
    w.writeInt64(-1n);
    expect(hex(w.finish())).toBe("ffffffffffffffff");
  });

  it("int64: 0x0102030405060708 → 0102030405060708", () => {
    const w = new XdrWriter();
    w.writeInt64(0x0102030405060708n);
    expect(hex(w.finish())).toBe("0102030405060708");
  });

  // RFC 4506 §4.5: Unsigned Hyper (64-bit big-endian)
  it("uint64: max → ffffffffffffffff", () => {
    const w = new XdrWriter();
    w.writeUint64(0xFFFFFFFFFFFFFFFFn);
    expect(hex(w.finish())).toBe("ffffffffffffffff");
  });

  // u128 extension: two 64-bit halves, high then low
  it("uint128: 0 → 00000000000000000000000000000000", () => {
    const w = new XdrWriter();
    w.writeUint128(0n);
    expect(hex(w.finish())).toBe("00000000000000000000000000000000");
  });

  it("uint128: 1 → 00000000000000000000000000000001", () => {
    const w = new XdrWriter();
    w.writeUint128(1n);
    expect(hex(w.finish())).toBe("00000000000000000000000000000001");
  });

  it("uint128: 2^64 → 00000000000000010000000000000000", () => {
    const w = new XdrWriter();
    w.writeUint128(1n << 64n);
    expect(hex(w.finish())).toBe("00000000000000010000000000000000");
  });

  it("uint128: max → ffffffffffffffffffffffffffffffff", () => {
    const w = new XdrWriter();
    w.writeUint128((1n << 128n) - 1n);
    expect(hex(w.finish())).toBe("ffffffffffffffffffffffffffffffff");
  });

  // i128 extension: signed high half, unsigned low half
  it("int128: -1 → ffffffffffffffffffffffffffffffff", () => {
    const w = new XdrWriter();
    w.writeInt128(-1n);
    expect(hex(w.finish())).toBe("ffffffffffffffffffffffffffffffff");
  });

  it("int128: -2^127 (min) → 80000000000000000000000000000000", () => {
    const w = new XdrWriter();
    w.writeInt128(-(1n << 127n));
    expect(hex(w.finish())).toBe("80000000000000000000000000000000");
  });

  it("int128: 2^127-1 (max) → 7fffffffffffffffffffffffffffffff", () => {
    const w = new XdrWriter();
    w.writeInt128((1n << 127n) - 1n);
    expect(hex(w.finish())).toBe("7fffffffffffffffffffffffffffffff");
  });
});

describe("XDR wire format — bool", () => {
  // RFC 4506 §4.4: Boolean (enum with FALSE=0, TRUE=1, encoded as int32)
  it("true → 00000001", () => {
    const w = new XdrWriter();
    w.writeBool(true);
    expect(hex(w.finish())).toBe("00000001");
  });

  it("false → 00000000", () => {
    const w = new XdrWriter();
    w.writeBool(false);
    expect(hex(w.finish())).toBe("00000000");
  });
});

describe("XDR wire format — opaque", () => {
  // RFC 4506 §4.9: Fixed-Length Opaque (padded to 4-byte boundary)
  it("fixed opaque 4 bytes (aligned) → no padding", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd]), 4);
    expect(hex(w.finish())).toBe("aabbccdd");
  });

  it("fixed opaque 1 byte → 3 bytes padding", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([0xff]), 1);
    expect(hex(w.finish())).toBe("ff000000");
  });

  it("fixed opaque 2 bytes → 2 bytes padding", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([0xab, 0xcd]), 2);
    expect(hex(w.finish())).toBe("abcd0000");
  });

  it("fixed opaque 3 bytes → 1 byte padding", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([0x01, 0x02, 0x03]), 3);
    expect(hex(w.finish())).toBe("01020300");
  });

  it("fixed opaque 5 bytes → 3 bytes padding", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([1, 2, 3, 4, 5]), 5);
    expect(hex(w.finish())).toBe("0102030405000000");
  });

  it("fixed opaque 0 bytes → 0 bytes output", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([]), 0);
    expect(hex(w.finish())).toBe("");
  });

  // RFC 4506 §4.10: Variable-Length Opaque (length prefix + data + padding)
  it("var opaque [0xDE, 0xAD] → length(2) + data + 2 pad bytes", () => {
    const w = new XdrWriter();
    w.writeVarOpaque(new Uint8Array([0xde, 0xad]), 100);
    expect(hex(w.finish())).toBe("00000002dead0000");
  });

  it("var opaque empty → length(0)", () => {
    const w = new XdrWriter();
    w.writeVarOpaque(new Uint8Array([]), 100);
    expect(hex(w.finish())).toBe("00000000");
  });

  it("var opaque 4 bytes (aligned) → length(4) + data, no padding", () => {
    const w = new XdrWriter();
    w.writeVarOpaque(new Uint8Array([1, 2, 3, 4]), 100);
    expect(hex(w.finish())).toBe("0000000401020304");
  });
});

describe("XDR wire format — string", () => {
  // RFC 4506 §4.11: String (var-length opaque of UTF-8 bytes)
  it("'hi' → length(2) + 0x6869 + 2 pad bytes", () => {
    const w = new XdrWriter();
    w.writeString("hi", 100);
    expect(hex(w.finish())).toBe("0000000268690000");
  });

  it("empty string → length(0)", () => {
    const w = new XdrWriter();
    w.writeString("", 100);
    expect(hex(w.finish())).toBe("00000000");
  });

  it("'ABCD' (4 bytes, aligned) → length(4) + 41424344", () => {
    const w = new XdrWriter();
    w.writeString("ABCD", 100);
    expect(hex(w.finish())).toBe("0000000441424344");
  });
});

describe("XDR wire format — decoding known bytes", () => {
  it("decodes int32 from known bytes", () => {
    const r = new XdrReader(fromHex("ffffff80"));
    expect(r.readInt32()).toBe(-128n);
  });

  it("decodes uint64 from known bytes", () => {
    const r = new XdrReader(fromHex("0102030405060708"));
    expect(r.readUint64()).toBe(0x0102030405060708n);
  });

  it("decodes var opaque from known bytes", () => {
    const r = new XdrReader(fromHex("00000002dead0000"));
    expect(r.readVarOpaque(100)).toEqual(new Uint8Array([0xde, 0xad]));
  });

  it("decodes string from known bytes", () => {
    const r = new XdrReader(fromHex("0000000268690000"));
    expect(r.readString(100)).toBe("hi");
  });

  it("decodes int128 -1 from known bytes", () => {
    const r = new XdrReader(fromHex("ffffffffffffffffffffffffffffffff"));
    expect(r.readInt128()).toBe(-1n);
  });

  it("decodes uint128 2^64 from known bytes", () => {
    const r = new XdrReader(fromHex("00000000000000010000000000000000"));
    expect(r.readUint128()).toBe(1n << 64n);
  });
});

describe("XDR error handling", () => {
  it("int32 overflow: rejects 2^31", () => {
    const w = new XdrWriter();
    expect(() => w.writeInt32(2147483648n)).toThrow(/overflow/);
  });

  it("int32 underflow: rejects -(2^31 + 1)", () => {
    const w = new XdrWriter();
    expect(() => w.writeInt32(-2147483649n)).toThrow(/overflow/);
  });

  it("uint32 overflow: rejects 2^32", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint32(0x100000000n)).toThrow(/overflow/);
  });

  it("uint32 underflow: rejects -1", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint32(-1n)).toThrow(/overflow/);
  });

  it("int64 overflow: rejects 2^63", () => {
    const w = new XdrWriter();
    expect(() => w.writeInt64(1n << 63n)).toThrow(/overflow/);
  });

  it("uint64 overflow: rejects 2^64", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint64(1n << 64n)).toThrow(/overflow/);
  });

  it("int128 overflow: rejects 2^127", () => {
    const w = new XdrWriter();
    expect(() => w.writeInt128(1n << 127n)).toThrow(/overflow/);
  });

  it("uint128 overflow: rejects 2^128", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint128(1n << 128n)).toThrow(/overflow/);
  });

  it("fixed opaque length mismatch", () => {
    const w = new XdrWriter();
    expect(() => w.writeFixedOpaque(new Uint8Array(3), 4)).toThrow(/length mismatch/);
  });

  it("var opaque exceeds max", () => {
    const w = new XdrWriter();
    expect(() => w.writeVarOpaque(new Uint8Array(11), 10)).toThrow(/exceeds max/);
  });

  it("reader: truncated data", () => {
    const r = new XdrReader(new Uint8Array([0, 0]));
    expect(() => r.readUint32()).toThrow(/read past end/);
  });

  it("reader: var opaque exceeds max", () => {
    // length field says 101 but max is 100
    const buf = new Uint8Array(4 + 104);
    new DataView(buf.buffer).setUint32(0, 101);
    const r = new XdrReader(buf);
    expect(() => r.readVarOpaque(100)).toThrow(/exceeds max/);
  });

  it("reader: invalid bool value", () => {
    const r = new XdrReader(fromHex("00000002"));
    expect(() => r.readBool()).toThrow(/invalid bool/);
  });
});

describe("XDR writer growth", () => {
  it("handles data larger than initial buffer capacity", () => {
    const w = new XdrWriter(8); // start with tiny buffer
    // Write more than 8 bytes to force growth
    w.writeUint64(1n);
    w.writeUint64(2n);
    w.writeUint64(3n);
    const bytes = w.finish();
    expect(bytes.length).toBe(24);

    const r = new XdrReader(bytes);
    expect(r.readUint64()).toBe(1n);
    expect(r.readUint64()).toBe(2n);
    expect(r.readUint64()).toBe(3n);
  });
});
