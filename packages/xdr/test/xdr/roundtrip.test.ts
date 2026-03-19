import { describe, it, expect } from "vitest";
import { XdrWriter } from "../../src/xdr/writer.js";
import { XdrReader } from "../../src/xdr/reader.js";

function roundtrip(write: (w: XdrWriter) => void, read: (r: XdrReader) => unknown) {
  const w = new XdrWriter();
  write(w);
  const r = new XdrReader(w.finish());
  return read(r);
}

describe("XDR round-trip", () => {
  describe("int32", () => {
    for (const val of [0n, 1n, -1n, 0x7FFFFFFFn, -0x80000000n]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt32(val), r => r.readInt32())).toBe(val);
      });
    }
  });

  describe("uint32", () => {
    for (const val of [0n, 1n, 0xFFFFFFFFn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint32(val), r => r.readUint32())).toBe(val);
      });
    }
  });

  describe("int64", () => {
    for (const val of [0n, 1n, -1n, (1n << 63n) - 1n, -(1n << 63n)]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt64(val), r => r.readInt64())).toBe(val);
      });
    }
  });

  describe("uint64", () => {
    for (const val of [0n, 1n, 0xFFFFFFFFFFFFFFFFn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint64(val), r => r.readUint64())).toBe(val);
      });
    }
  });

  describe("uint128", () => {
    for (const val of [0n, 1n, (1n << 64n), (1n << 128n) - 1n, 0xDEADBEEFCAFEBABEn]) {
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

  describe("fixed opaque", () => {
    it("round-trips 32 bytes", () => {
      const data = new Uint8Array(32);
      data.fill(0xAB);
      const result = roundtrip(
        w => w.writeFixedOpaque(data, 32),
        r => r.readFixedOpaque(32)
      );
      expect(result).toEqual(data);
    });

    it("round-trips 3 bytes (with padding)", () => {
      const data = new Uint8Array([1, 2, 3]);
      const result = roundtrip(
        w => w.writeFixedOpaque(data, 3),
        r => r.readFixedOpaque(3)
      );
      expect(result).toEqual(data);
    });
  });

  describe("var opaque", () => {
    it("round-trips empty", () => {
      const data = new Uint8Array(0);
      const result = roundtrip(
        w => w.writeVarOpaque(data, 100),
        r => r.readVarOpaque(100)
      );
      expect(result).toEqual(data);
    });

    it("round-trips 5 bytes", () => {
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

    it("round-trips empty", () => {
      expect(roundtrip(w => w.writeString("", 100), r => r.readString(100))).toBe("");
    });

    it("round-trips UTF-8", () => {
      expect(roundtrip(w => w.writeString("grüße", 100), r => r.readString(100))).toBe("grüße");
    });
  });

  describe("multiple values in sequence", () => {
    it("writes and reads back multiple values", () => {
      const w = new XdrWriter();
      w.writeUint32(1n);
      w.writeInt64(-100n);
      w.writeBool(true);
      w.writeString("test", 100);

      const r = new XdrReader(w.finish());
      expect(r.readUint32()).toBe(1n);
      expect(r.readInt64()).toBe(-100n);
      expect(r.readBool()).toBe(true);
      expect(r.readString(100)).toBe("test");
    });
  });
});
