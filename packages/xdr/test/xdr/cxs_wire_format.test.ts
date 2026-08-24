/**
 * CXS wire format tests — verify exact byte output per CXS.md spec.
 *
 * CXS uses variable-length integer encoding with a header byte,
 * little-endian multi-byte values, and no padding on opaque data.
 */
import { describe, it, expect } from "vitest";
import { CxsWriter } from "../../src/xdr/cxs_writer.js";
import { CxsReader } from "../../src/xdr/cxs_reader.js";
import { toHex as hex, fromHex } from "../helpers/hex.js";

describe("CXS wire format — unsigned integers", () => {
  // Header-only encoding: values 0-62 fit in a single byte
  it("uint32: 0 → 00", () => {
    const w = new CxsWriter();
    w.writeUint32(0n);
    expect(hex(w.finish())).toBe("00");
  });

  it("uint32: 1 → 01", () => {
    const w = new CxsWriter();
    w.writeUint32(1n);
    expect(hex(w.finish())).toBe("01");
  });

  it("uint32: 62 (UH_MAX) → 3e", () => {
    const w = new CxsWriter();
    w.writeUint32(62n);
    expect(hex(w.finish())).toBe("3e");
  });

  // 1-byte extension: values 63-255
  it("uint32: 63 → 3f3f (header=v63,s0 + byte 63)", () => {
    const w = new CxsWriter();
    w.writeUint32(63n);
    expect(hex(w.finish())).toBe("3f3f");
  });

  it("uint32: 255 → 3fff", () => {
    const w = new CxsWriter();
    w.writeUint32(255n);
    expect(hex(w.finish())).toBe("3fff");
  });

  // 2-byte extension: values 256-65535
  it("uint32: 256 → 7f0001 (header=v63,s1 + 2 LE bytes)", () => {
    const w = new CxsWriter();
    w.writeUint32(256n);
    expect(hex(w.finish())).toBe("7f0001");
  });

  it("uint32: 65535 → 7fffff", () => {
    const w = new CxsWriter();
    w.writeUint32(65535n);
    expect(hex(w.finish())).toBe("7fffff");
  });

  // 4-byte extension: values 65536-4294967295
  it("uint32: 65536 → bf00000100 (header=v63,s2 + 4 LE bytes)", () => {
    const w = new CxsWriter();
    w.writeUint32(65536n);
    expect(hex(w.finish())).toBe("bf00000100");
  });

  it("uint32: 4294967295 (max) → bfffffffff", () => {
    const w = new CxsWriter();
    w.writeUint32(4294967295n);
    expect(hex(w.finish())).toBe("bfffffffff");
  });

  // 8-byte extension for uint64
  it("uint64: 4294967296 (2^32) → ff0000000001000000", () => {
    const w = new CxsWriter();
    w.writeUint64(4294967296n);
    expect(hex(w.finish())).toBe("ff0000000001000000");
  });

  it("uint64: small value 42 → 2a (cascades to header-only)", () => {
    const w = new CxsWriter();
    w.writeUint64(42n);
    expect(hex(w.finish())).toBe("2a");
  });
});

describe("CXS wire format — signed integers", () => {
  // Header-only: 6-bit one's complement, range -31 to +31
  it("int32: 0 → 00", () => {
    const w = new CxsWriter();
    w.writeInt32(0n);
    expect(hex(w.finish())).toBe("00");
  });

  it("int32: 1 → 01", () => {
    const w = new CxsWriter();
    w.writeInt32(1n);
    expect(hex(w.finish())).toBe("01");
  });

  it("int32: 31 (IH_MAX) → 1f", () => {
    const w = new CxsWriter();
    w.writeInt32(31n);
    expect(hex(w.finish())).toBe("1f");
  });

  it("int32: -1 → 3e (one's complement: ~1=0x3e, with sign bit)", () => {
    const w = new CxsWriter();
    w.writeInt32(-1n);
    expect(hex(w.finish())).toBe("3e");
  });

  it("int32: -31 (IH_MIN) → 20", () => {
    const w = new CxsWriter();
    w.writeInt32(-31n);
    expect(hex(w.finish())).toBe("20");
  });

  // 1-byte extension: values outside header range but within i8
  it("int32: 32 → 3f20 (header + byte 0x20)", () => {
    const w = new CxsWriter();
    w.writeInt32(32n);
    expect(hex(w.finish())).toBe("3f20");
  });

  it("int32: -32 → 3fe0 (header + byte 0xe0 = -32 in two's complement)", () => {
    const w = new CxsWriter();
    w.writeInt32(-32n);
    expect(hex(w.finish())).toBe("3fe0");
  });

  it("int32: 127 → 3f7f", () => {
    const w = new CxsWriter();
    w.writeInt32(127n);
    expect(hex(w.finish())).toBe("3f7f");
  });

  it("int32: -128 → 3f80", () => {
    const w = new CxsWriter();
    w.writeInt32(-128n);
    expect(hex(w.finish())).toBe("3f80");
  });

  // 2-byte extension
  it("int32: 128 → 7f8000", () => {
    const w = new CxsWriter();
    w.writeInt32(128n);
    expect(hex(w.finish())).toBe("7f8000");
  });

  it("int32: -129 → 7f7fff", () => {
    const w = new CxsWriter();
    w.writeInt32(-129n);
    expect(hex(w.finish())).toBe("7f7fff");
  });

  // 4-byte extension
  it("int32: 32768 → bf00800000", () => {
    const w = new CxsWriter();
    w.writeInt32(32768n);
    expect(hex(w.finish())).toBe("bf00800000");
  });

  it("int32: 2147483647 (max) → bf ffffff7f", () => {
    const w = new CxsWriter();
    w.writeInt32(2147483647n);
    expect(hex(w.finish())).toBe("bfffffff7f");
  });

  it("int32: -2147483648 (min) → bf 00000080", () => {
    const w = new CxsWriter();
    w.writeInt32(-2147483648n);
    expect(hex(w.finish())).toBe("bf00000080");
  });

  // 8-byte extension for int64
  it("int64: 2147483648 (2^31) → ff 0000008000000000", () => {
    const w = new CxsWriter();
    w.writeInt64(2147483648n);
    expect(hex(w.finish())).toBe("ff0000008000000000");
  });

  it("int64: -2147483649 → ff ffffff7fffffffff", () => {
    const w = new CxsWriter();
    w.writeInt64(-2147483649n);
    expect(hex(w.finish())).toBe("ffffffff7fffffffff");
  });
});

describe("CXS wire format — bool", () => {
  it("true → 01 (signed i32 of 1, fits in header)", () => {
    const w = new CxsWriter();
    w.writeBool(true);
    expect(hex(w.finish())).toBe("01");
  });

  it("false → 00", () => {
    const w = new CxsWriter();
    w.writeBool(false);
    expect(hex(w.finish())).toBe("00");
  });
});

describe("CXS wire format — opaque (no padding)", () => {
  it("fixed opaque 3 bytes → no padding", () => {
    const w = new CxsWriter();
    w.writeFixedOpaque(new Uint8Array([0xaa, 0xbb, 0xcc]), 3);
    expect(hex(w.finish())).toBe("aabbcc");
  });

  it("fixed opaque 1 byte → no padding", () => {
    const w = new CxsWriter();
    w.writeFixedOpaque(new Uint8Array([0xff]), 1);
    expect(hex(w.finish())).toBe("ff");
  });

  it("var opaque [0xDE, 0xAD] → compact length(2) + data, no padding", () => {
    const w = new CxsWriter();
    w.writeVarOpaque(new Uint8Array([0xde, 0xad]), 100);
    // length 2 fits in header byte (02), then raw data
    expect(hex(w.finish())).toBe("02dead");
  });

  it("var opaque empty → length(0)", () => {
    const w = new CxsWriter();
    w.writeVarOpaque(new Uint8Array([]), 100);
    expect(hex(w.finish())).toBe("00");
  });
});

describe("CXS wire format — string", () => {
  it("'hi' → compact length(2) + 6869, no padding", () => {
    const w = new CxsWriter();
    w.writeString("hi", 100);
    expect(hex(w.finish())).toBe("026869");
  });
});

describe("CXS decoding from known bytes", () => {
  it("decodes uint32 0 from 00", () => {
    const r = new CxsReader(fromHex("00"));
    expect(r.readUint32()).toBe(0n);
  });

  it("decodes uint32 62 from 3e", () => {
    const r = new CxsReader(fromHex("3e"));
    expect(r.readUint32()).toBe(62n);
  });

  it("decodes uint32 63 from 3f3f", () => {
    const r = new CxsReader(fromHex("3f3f"));
    expect(r.readUint32()).toBe(63n);
  });

  it("decodes uint32 256 from 7f0001", () => {
    const r = new CxsReader(fromHex("7f0001"));
    expect(r.readUint32()).toBe(256n);
  });

  it("decodes int32 -1 from 3e", () => {
    const r = new CxsReader(fromHex("3e"));
    expect(r.readInt32()).toBe(-1n);
  });

  it("decodes int32 -31 from 20", () => {
    const r = new CxsReader(fromHex("20"));
    expect(r.readInt32()).toBe(-31n);
  });

  it("decodes int32 -32 from 3fe0", () => {
    const r = new CxsReader(fromHex("3fe0"));
    expect(r.readInt32()).toBe(-32n);
  });

  it("decodes int32 -128 from 3f80", () => {
    const r = new CxsReader(fromHex("3f80"));
    expect(r.readInt32()).toBe(-128n);
  });

  it("decodes var opaque from 02dead", () => {
    const r = new CxsReader(fromHex("02dead"));
    expect(r.readVarOpaque(100)).toEqual(new Uint8Array([0xde, 0xad]));
  });

  it("decodes string 'hi' from 026869", () => {
    const r = new CxsReader(fromHex("026869"));
    expect(r.readString(100)).toBe("hi");
  });

  it("rejects invalid UTF-8 in strings", () => {
    // length 2, bytes ff fe: not valid UTF-8
    const r = new CxsReader(fromHex("02fffe"));
    expect(() => r.readString(100)).toThrow(TypeError);
  });

  it("rejects truncated multi-byte UTF-8 sequence in strings", () => {
    // length 1, byte e2: start of a 3-byte sequence with no continuation
    const r = new CxsReader(fromHex("01e2"));
    expect(() => r.readString(100)).toThrow(TypeError);
  });
});

describe("CXS minimal encoding validation", () => {
  it("rejects non-minimal unsigned: 0 encoded as 3f00 (1-byte ext for value 0)", () => {
    const r = new CxsReader(fromHex("3f00"));
    expect(() => r.readUint32()).toThrow(/non-minimal/);
  });

  it("rejects non-minimal unsigned: 62 encoded as 3f3e (1-byte ext for value 62)", () => {
    const r = new CxsReader(fromHex("3f3e"));
    expect(() => r.readUint32()).toThrow(/non-minimal/);
  });

  it("rejects non-minimal signed: 0 encoded as 3f00 (1-byte ext for value 0)", () => {
    const r = new CxsReader(fromHex("3f00"));
    expect(() => r.readInt32()).toThrow(/non-minimal/);
  });

  it("rejects reserved header: s=1 with v<63", () => {
    // s=1, v=0 → header byte = 0x40
    const r = new CxsReader(fromHex("40"));
    expect(() => r.readUint32()).toThrow(/invalid header/);
  });
});

describe("CXS round-trip — all integer types", () => {
  function roundtrip(
    write: (w: CxsWriter) => void,
    read: (r: CxsReader) => unknown
  ) {
    const w = new CxsWriter();
    write(w);
    const r = new CxsReader(w.finish());
    return read(r);
  }

  describe("uint32", () => {
    for (const val of [0n, 1n, 62n, 63n, 255n, 256n, 65535n, 65536n, 0xFFFFFFFFn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint32(val), r => r.readUint32())).toBe(val);
      });
    }
  });

  describe("int32", () => {
    for (const val of [0n, 1n, -1n, 31n, -31n, 32n, -32n, 127n, -128n, 128n, -129n, 0x7FFFFFFFn, -0x80000000n]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt32(val), r => r.readInt32())).toBe(val);
      });
    }
  });

  describe("uint64", () => {
    for (const val of [0n, 1n, 62n, 0xFFFFFFFFn, 0x100000000n, 0xFFFFFFFFFFFFFFFFn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint64(val), r => r.readUint64())).toBe(val);
      });
    }
  });

  describe("int64", () => {
    for (const val of [0n, 1n, -1n, 0x7FFFFFFFn, -0x80000000n, 0x80000000n, -0x80000001n, (1n << 63n) - 1n, -(1n << 63n)]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt64(val), r => r.readInt64())).toBe(val);
      });
    }
  });

  describe("uint128", () => {
    for (const val of [0n, 1n, (1n << 64n), (1n << 128n) - 1n]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint128(val), r => r.readUint128())).toBe(val);
      });
    }
  });

  describe("int128", () => {
    for (const val of [0n, 1n, -1n, (1n << 127n) - 1n, -(1n << 127n)]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt128(val), r => r.readInt128())).toBe(val);
      });
    }
  });

  describe("bool", () => {
    it("round-trips true", () => {
      expect(roundtrip(w => w.writeBool(true), r => r.readBool())).toBe(true);
    });
    it("round-trips false", () => {
      expect(roundtrip(w => w.writeBool(false), r => r.readBool())).toBe(false);
    });
  });

  describe("opaque", () => {
    it("fixed opaque 32 bytes", () => {
      const data = new Uint8Array(32).fill(0xAB);
      const result = roundtrip(
        w => w.writeFixedOpaque(data, 32),
        r => r.readFixedOpaque(32)
      );
      expect(result).toEqual(data);
    });

    it("var opaque", () => {
      const data = new Uint8Array([1, 2, 3, 4, 5]);
      const result = roundtrip(
        w => w.writeVarOpaque(data, 100),
        r => r.readVarOpaque(100)
      );
      expect(result).toEqual(data);
    });
  });

  describe("string", () => {
    it("round-trips ASCII", () => {
      expect(roundtrip(w => w.writeString("hello", 100), r => r.readString(100))).toBe("hello");
    });
    it("round-trips UTF-8", () => {
      expect(roundtrip(w => w.writeString("grüße", 100), r => r.readString(100))).toBe("grüße");
    });
  });

  describe("remaining / position", () => {
    it("tracks unconsumed bytes", () => {
      // CXS encodes 42 as a single header byte (0x2a), 7 as (0x07)
      const r = new CxsReader(fromHex("2a07"));
      expect(r.remaining).toBe(2);
      expect(r.position).toBe(0);
      r.readUint32();
      expect(r.remaining).toBe(1);
      expect(r.position).toBe(1);
      r.readUint32();
      expect(r.remaining).toBe(0);
    });

    it("detects trailing bytes after decoding", () => {
      // CXS encodes 1 as 0x01, then 2 trailing garbage bytes
      const r = new CxsReader(fromHex("01ffff"));
      r.readUint32();
      expect(r.remaining).toBe(2);
    });
  });
});
