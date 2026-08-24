import { describe, it, expect } from "vitest";
import { XdrWriter } from "../../src/xdr/writer.js";
import { CxsWriter } from "../../src/xdr/cxs_writer.js";

describe("XdrWriter", () => {
  it("writes uint32", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);
    expect(w.finish()).toEqual(new Uint8Array([0, 0, 0, 1]));
  });

  it("writes int32 positive", () => {
    const w = new XdrWriter();
    w.writeInt32(1n);
    expect(w.finish()).toEqual(new Uint8Array([0, 0, 0, 1]));
  });

  it("writes int32 negative", () => {
    const w = new XdrWriter();
    w.writeInt32(-1n);
    expect(w.finish()).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });

  it("writes uint64", () => {
    const w = new XdrWriter();
    w.writeUint64(0x0102030405060708n);
    expect(w.finish()).toEqual(
      new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
    );
  });

  it("writes int64 negative", () => {
    const w = new XdrWriter();
    w.writeInt64(-1n);
    expect(w.finish()).toEqual(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    );
  });

  it("writes bool true and false", () => {
    const w = new XdrWriter();
    w.writeBool(true);
    w.writeBool(false);
    expect(w.finish()).toEqual(
      new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0])
    );
  });

  it("writes fixed opaque with padding", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([0xaa, 0xbb, 0xcc]), 3);
    expect(w.finish()).toEqual(
      new Uint8Array([0xaa, 0xbb, 0xcc, 0x00])
    );
  });

  it("writes fixed opaque aligned (no padding needed)", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([1, 2, 3, 4]), 4);
    expect(w.finish()).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it("writes var opaque (length prefix + data + padding)", () => {
    const w = new XdrWriter();
    w.writeVarOpaque(new Uint8Array([0xde, 0xad]), 100);
    expect(w.finish()).toEqual(
      new Uint8Array([0, 0, 0, 2, 0xde, 0xad, 0, 0])
    );
  });

  it("writes string", () => {
    const w = new XdrWriter();
    w.writeString("hi", 100);
    expect(w.finish()).toEqual(
      new Uint8Array([0, 0, 0, 2, 0x68, 0x69, 0, 0])
    );
  });

  it("throws on uint32 overflow", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint32(0x100000000n)).toThrow();
  });

  it("throws on negative uint32", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint32(-1n)).toThrow();
  });

  it("throws on var opaque exceeding max", () => {
    const w = new XdrWriter();
    expect(() => w.writeVarOpaque(new Uint8Array(101), 100)).toThrow();
  });

  it("grows from zero initial capacity", () => {
    const w = new XdrWriter(0);
    w.writeUint32(42n);
    w.writeString("hello", 100);
    const r = w.finish();
    expect(r.length).toBe(4 + 4 + 8); // uint32 + length prefix + padded "hello"
    expect(r.subarray(0, 4)).toEqual(new Uint8Array([0, 0, 0, 42]));
  });
});

describe("CxsWriter", () => {
  it("grows from zero initial capacity", () => {
    const w = new CxsWriter(0);
    w.writeUint32(42n);
    w.writeString("hello", 100);
    const r = w.finish();
    expect(r.length).toBe(1 + 1 + 5); // header-only u32 + length prefix + "hello"
    expect(r[0]).toBe(42);
  });
});
