import { describe, expect, it } from "vitest";
import {
  CxsReader, CxsWriter, XdrReader, XdrWriter, FixedArrayCodec,
  FixedOpaqueCodec, OptionCodec, VarArrayCodec, VoidCodec, withCodecBudget,
  type XdrCodec,
} from "../../src/index.js";

describe.each([
  ["XDR", XdrReader, XdrWriter],
  ["CXS", CxsReader, CxsWriter],
] as const)("%s shared budgets", (_name, Reader, Writer) => {
  function nested(depth: number): XdrCodec<unknown> {
    let codec: XdrCodec<unknown> = withCodecBudget(VoidCodec);
    for (let i = 1; i < depth; i++) {
      const inner = codec;
      codec = OptionCodec(inner);
    }
    return codec;
  }

  it("accepts 128 value levels and rejects 129 for encode and decode", () => {
    const codec = nested(128);
    const writer = new Writer();
    codec.encode(writer, undefined);
    expect(codec.decode(new Reader(writer.finish()))).toBeUndefined();
    expect(() => nested(129).encode(new Writer(), undefined)).toThrow("encode depth limit");
    const deep = new Writer();
    for (let i = 0; i < 128; i++) deep.writeUint32(1n);
    expect(() => nested(129).decode(new Reader(deep.finish()))).toThrow("decode depth limit");
  });

  it("bounds recursive custom codecs even when they consume no bytes", () => {
    const recursive: XdrCodec<void> = withCodecBudget({
      encode(w) { recursive.encode(w, undefined); },
      decode(r) { return recursive.decode(r); },
    });
    expect(() => recursive.encode(new Writer(), undefined)).toThrow("encode depth limit");
    expect(() => recursive.decode(new Reader(new Uint8Array()))).toThrow("decode depth limit");
  });

  it("rejects huge zero-width collections before visiting an element", () => {
    let visits = 0;
    const empty: XdrCodec<void> = {
      encode() {},
      decode() { visits++; },
    };
    const writer = new Writer();
    writer.writeUint32(0xffffffffn);
    expect(() => VarArrayCodec(empty, 0xffffffff).decode(new Reader(writer.finish())))
      .toThrow("work budget");
    expect(() => FixedArrayCodec(empty, 0xffffffff).decode(new Reader(new Uint8Array())))
      .toThrow("work budget");
    expect(visits).toBe(0);
  });

  it("charges aggregate work across collections on the same reader", () => {
    const codec = FixedArrayCodec(VoidCodec, 2);
    const reader = new Reader(new Uint8Array(), { maxWork: 5 });
    expect(codec.decode(reader)).toHaveLength(2);
    expect(() => codec.decode(reader)).toThrow("work budget");
    expect(codec.decode(new Reader(new Uint8Array(), { maxWork: 3 }))).toHaveLength(2);
  });

  it("enforces the default zero-byte work allowance at its boundary", () => {
    expect(FixedArrayCodec(VoidCodec, 1023).decode(new Reader(new Uint8Array())))
      .toHaveLength(1023);
    expect(() => FixedArrayCodec(VoidCodec, 1024).decode(new Reader(new Uint8Array())))
      .toThrow("work budget");
  });

  it("counts opaque bytes as one value and supports explicit limits", () => {
    const codec = FixedArrayCodec(FixedOpaqueCodec(4096), 1);
    expect(codec.decode(new Reader(new Uint8Array(4096), { maxWork: 2, maxDepth: 2 })))
      .toHaveLength(1);
    expect(() => codec.decode(new Reader(new Uint8Array(4096), { maxDepth: 1 })))
      .toThrow("decode depth limit");
  });

  it("does not double-count aliases or transparent adapters", () => {
    const codec = withCodecBudget(VoidCodec);
    const adapter = withCodecBudget({ ...codec, encode: codec.encode });
    const writer = new Writer(undefined, { maxDepth: 1 });
    adapter.encode(writer, undefined);
    expect(adapter.decode(new Reader(new Uint8Array(), { maxDepth: 1, maxWork: 1 })))
      .toBeUndefined();
  });

  it("restores depth after failures but does not refund work", () => {
    const failing = withCodecBudget<void>({
      encode() { throw new Error("failure"); },
      decode() { throw new Error("failure"); },
    });
    const reader = new Reader(new Uint8Array(), { maxDepth: 1, maxWork: 2 });
    const writer = new Writer(undefined, { maxDepth: 1 });
    expect(() => failing.decode(reader)).toThrow("failure");
    expect(() => failing.encode(writer, undefined)).toThrow("failure");
    const empty = withCodecBudget(VoidCodec);
    empty.encode(writer, undefined);
    empty.decode(reader);
    expect(() => empty.decode(reader)).toThrow("work budget");
  });

  it("rejects invalid explicit limits", () => {
    for (const value of [-1, NaN, Infinity, 1.5]) {
      expect(() => new Reader(new Uint8Array(), { maxWork: value })).toThrow(RangeError);
      expect(() => new Writer(undefined, { maxDepth: value })).toThrow(RangeError);
    }
  });
});
