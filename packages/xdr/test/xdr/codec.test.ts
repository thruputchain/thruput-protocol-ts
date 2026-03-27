import { describe, it, expect } from "vitest";
import {
  XdrCodec, serialize, deserialize,
  OptionCodec, VarArrayCodec, FixedArrayCodec,
} from "../../src/xdr/codec.js";
import { XdrWriter } from "../../src/xdr/writer.js";
import { XdrReader } from "../../src/xdr/reader.js";

const Uint32Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return r.readUint32(); },
};

const Int64Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return r.readInt64(); },
};

describe("serialize / deserialize", () => {
  it("round-trips uint32", () => {
    const bytes = serialize(42n, Uint32Codec);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 42]));
    const decoded = deserialize(bytes, Uint32Codec);
    expect(decoded).toBe(42n);
  });
});

describe("OptionCodec", () => {
  const OptUint32 = OptionCodec(Uint32Codec);

  it("encodes null as 0 discriminant", () => {
    const bytes = serialize(null, OptUint32);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  it("encodes present value as 1 discriminant + inner", () => {
    const bytes = serialize(42n, OptUint32);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 1, 0, 0, 0, 42]));
  });

  it("round-trips null", () => {
    expect(deserialize(serialize(null, OptUint32), OptUint32)).toBe(null);
  });

  it("round-trips present value", () => {
    expect(deserialize(serialize(99n, OptUint32), OptUint32)).toBe(99n);
  });

  it("works with i64 inner codec", () => {
    const OptInt64 = OptionCodec(Int64Codec);
    const bytes = serialize(-999n, OptInt64);
    expect(deserialize(bytes, OptInt64)).toBe(-999n);
    expect(deserialize(serialize(null, OptInt64), OptInt64)).toBe(null);
  });
});

describe("VarArrayCodec", () => {
  const VarUint32 = VarArrayCodec(Uint32Codec, 10);

  it("encodes empty array", () => {
    const bytes = serialize([], VarUint32);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  it("encodes array with elements", () => {
    const bytes = serialize([1n, 2n, 3n], VarUint32);
    expect(bytes).toEqual(new Uint8Array([
      0, 0, 0, 3,  // length
      0, 0, 0, 1,  // 1
      0, 0, 0, 2,  // 2
      0, 0, 0, 3,  // 3
    ]));
  });

  it("round-trips", () => {
    const val = [100n, 200n];
    expect(deserialize(serialize(val, VarUint32), VarUint32)).toEqual(val);
  });

  it("round-trips empty", () => {
    expect(deserialize(serialize([], VarUint32), VarUint32)).toEqual([]);
  });

  it("encodes at exactly max length", () => {
    const Max2 = VarArrayCodec(Uint32Codec, 2);
    expect(() => serialize([1n, 2n], Max2)).not.toThrow();
  });

  it("throws on encode when length exceeds max", () => {
    const Max2 = VarArrayCodec(Uint32Codec, 2);
    expect(() => serialize([1n, 2n, 3n], Max2)).toThrow("exceeds max 2");
  });

  it("decodes at exactly max length", () => {
    const Max2 = VarArrayCodec(Uint32Codec, 2);
    const bytes = serialize([1n, 2n], Max2);
    expect(deserialize(bytes, Max2)).toEqual([1n, 2n]);
  });

  it("throws on decode when length exceeds max", () => {
    const Max2 = VarArrayCodec(Uint32Codec, 2);
    const bytes = serialize([1n, 2n, 3n], VarArrayCodec(Uint32Codec, 10));
    expect(() => deserialize(bytes, Max2)).toThrow("exceeds max 2");
  });
});

describe("FixedArrayCodec", () => {
  const Fixed3 = FixedArrayCodec(Uint32Codec, 3);

  it("encodes without length prefix", () => {
    const bytes = serialize([10n, 20n, 30n], Fixed3);
    expect(bytes).toEqual(new Uint8Array([
      0, 0, 0, 10,
      0, 0, 0, 20,
      0, 0, 0, 30,
    ]));
  });

  it("round-trips", () => {
    const val = [7n, 8n, 9n];
    expect(deserialize(serialize(val, Fixed3), Fixed3)).toEqual(val);
  });

  it("throws on encode when length is wrong", () => {
    expect(() => serialize([1n, 2n], Fixed3)).toThrow("expected 3 elements, got 2");
    expect(() => serialize([1n, 2n, 3n, 4n], Fixed3)).toThrow("expected 3 elements, got 4");
  });

  it("works with length 0", () => {
    const Fixed0 = FixedArrayCodec(Uint32Codec, 0);
    const bytes = serialize([], Fixed0);
    expect(bytes).toEqual(new Uint8Array([]));
    expect(deserialize(bytes, Fixed0)).toEqual([]);
  });

  it("works with length 1", () => {
    const Fixed1 = FixedArrayCodec(Uint32Codec, 1);
    const val = [42n];
    expect(deserialize(serialize(val, Fixed1), Fixed1)).toEqual(val);
  });
});
