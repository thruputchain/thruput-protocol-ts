import { describe, it, expect } from "vitest";
import { XdrReader } from "../../src/xdr/reader.js";

describe("XdrReader", () => {
  it("reads uint32", () => {
    const r = new XdrReader(new Uint8Array([0, 0, 0, 42]));
    expect(r.readUint32()).toBe(42n);
  });

  it("reads int32 negative", () => {
    const r = new XdrReader(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
    expect(r.readInt32()).toBe(-1n);
  });

  it("reads uint64", () => {
    const r = new XdrReader(
      new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
    );
    expect(r.readUint64()).toBe(0x0102030405060708n);
  });

  it("reads int64 negative", () => {
    const r = new XdrReader(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    );
    expect(r.readInt64()).toBe(-1n);
  });

  it("reads bool", () => {
    const r = new XdrReader(
      new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0])
    );
    expect(r.readBool()).toBe(true);
    expect(r.readBool()).toBe(false);
  });

  it("reads fixed opaque with padding", () => {
    const r = new XdrReader(new Uint8Array([0xaa, 0xbb, 0xcc, 0x00]));
    const result = r.readFixedOpaque(3);
    expect(result).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("rejects non-zero fixed opaque padding for 1/2/3-byte pad widths", () => {
    // len 3 -> 1 pad byte
    expect(() =>
      new XdrReader(new Uint8Array([0xaa, 0xbb, 0xcc, 0x01])).readFixedOpaque(3)
    ).toThrow(/non-zero padding/);
    // len 2 -> 2 pad bytes (second one non-zero)
    expect(() =>
      new XdrReader(new Uint8Array([0xaa, 0xbb, 0x00, 0xff])).readFixedOpaque(2)
    ).toThrow(/non-zero padding/);
    // len 1 -> 3 pad bytes (first one non-zero)
    expect(() =>
      new XdrReader(new Uint8Array([0xaa, 0x01, 0x00, 0x00])).readFixedOpaque(1)
    ).toThrow(/non-zero padding/);
  });

  it("accepts zero fixed opaque padding for 1/2/3-byte pad widths", () => {
    expect(
      new XdrReader(new Uint8Array([0xaa, 0xbb, 0xcc, 0x00])).readFixedOpaque(3)
    ).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
    expect(
      new XdrReader(new Uint8Array([0xaa, 0xbb, 0x00, 0x00])).readFixedOpaque(2)
    ).toEqual(new Uint8Array([0xaa, 0xbb]));
    expect(
      new XdrReader(new Uint8Array([0xaa, 0x00, 0x00, 0x00])).readFixedOpaque(1)
    ).toEqual(new Uint8Array([0xaa]));
  });

  it("rejects non-zero padding on var opaque payloads", () => {
    // length 2, payload 0xde 0xad, non-zero pad
    const r = new XdrReader(new Uint8Array([0, 0, 0, 2, 0xde, 0xad, 0x01, 0x00]));
    expect(() => r.readVarOpaque(100)).toThrow(/non-zero padding/);
  });

  it("reads var opaque", () => {
    const r = new XdrReader(
      new Uint8Array([0, 0, 0, 2, 0xde, 0xad, 0, 0])
    );
    const result = r.readVarOpaque(100);
    expect(result).toEqual(new Uint8Array([0xde, 0xad]));
  });

  it("reads string", () => {
    const r = new XdrReader(
      new Uint8Array([0, 0, 0, 2, 0x68, 0x69, 0, 0])
    );
    expect(r.readString(100)).toBe("hi");
  });

  it("rejects invalid UTF-8 in strings", () => {
    // length 2, bytes ff fe: not valid UTF-8
    const r = new XdrReader(new Uint8Array([0, 0, 0, 2, 0xff, 0xfe, 0, 0]));
    expect(() => r.readString(100)).toThrow(TypeError);
  });

  it("rejects truncated multi-byte UTF-8 sequence in strings", () => {
    // length 1, byte e2: start of a 3-byte sequence with no continuation
    const r = new XdrReader(new Uint8Array([0, 0, 0, 1, 0xe2, 0, 0, 0]));
    expect(() => r.readString(100)).toThrow(TypeError);
  });

  it("throws on truncated data", () => {
    const r = new XdrReader(new Uint8Array([0, 0]));
    expect(() => r.readUint32()).toThrow();
  });

  it("throws on var opaque exceeding max", () => {
    const buf = new Uint8Array(4 + 104);
    new DataView(buf.buffer).setUint32(0, 101);
    const r = new XdrReader(buf);
    expect(() => r.readVarOpaque(100)).toThrow();
  });

  it("remaining tracks unconsumed bytes", () => {
    // Two uint32s = 8 bytes
    const r = new XdrReader(new Uint8Array([0, 0, 0, 1, 0, 0, 0, 2]));
    expect(r.remaining).toBe(8);
    expect(r.position).toBe(0);
    r.readUint32();
    expect(r.remaining).toBe(4);
    expect(r.position).toBe(4);
    r.readUint32();
    expect(r.remaining).toBe(0);
  });

  it("remaining detects trailing bytes after decoding", () => {
    // One uint32 (4 bytes) + 2 trailing bytes
    const r = new XdrReader(new Uint8Array([0, 0, 0, 42, 0xff, 0xff]));
    r.readUint32();
    expect(r.remaining).toBe(2);
  });
});
