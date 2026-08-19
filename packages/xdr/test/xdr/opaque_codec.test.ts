import { describe, expect, it } from "vitest";
import {
  FixedOpaqueCodec,
  Uint8Codec,
  Uint32Codec,
  VarOpaqueCodec,
  deserialize,
  deserializeCxs,
  serialize,
  serializeCxs,
} from "../../src/index.js";

describe("Uint8Codec", () => {
  it.each([
    [0n, [0x00, 0x00, 0x00, 0x00], [0x00]],
    [62n, [0x00, 0x00, 0x00, 0x3e], [0x3e]],
    [63n, [0x00, 0x00, 0x00, 0x3f], [0x3f, 0x3f]],
    [255n, [0x00, 0x00, 0x00, 0xff], [0x3f, 0xff]],
  ])("encodes %s in XDR and CXS", (value, xdr, cxs) => {
    expect(serialize(value, Uint8Codec)).toEqual(Uint8Array.from(xdr));
    expect(serializeCxs(value, Uint8Codec)).toEqual(Uint8Array.from(cxs));
  });

  it.each([0n, 1n, 62n, 63n, 127n, 255n])("round-trips %s", (value) => {
    expect(deserialize(serialize(value, Uint8Codec), Uint8Codec)).toBe(value);
    expect(deserializeCxs(serializeCxs(value, Uint8Codec), Uint8Codec)).toBe(value);
  });

  it.each([-1n, 256n])("rejects out-of-range value %s", (value) => {
    expect(() => serialize(value, Uint8Codec)).toThrow("uint8 overflow");
    expect(() => serializeCxs(value, Uint8Codec)).toThrow("uint8 overflow");
  });

  it("rejects non-bigint values at runtime", () => {
    expect(() => serialize(1 as unknown as bigint, Uint8Codec)).toThrow(
      "uint8 overflow",
    );
    expect(() => serializeCxs(1 as unknown as bigint, Uint8Codec)).toThrow(
      "uint8 overflow",
    );
  });

  it("rejects truncated input", () => {
    expect(() => deserialize(new Uint8Array([0, 0, 0]), Uint8Codec)).toThrow();
    expect(() => deserializeCxs(new Uint8Array(), Uint8Codec)).toThrow();
  });

  it("rejects decoded uint32 values above the uint8 range", () => {
    expect(() =>
      deserialize(serialize(256n, Uint32Codec), Uint8Codec),
    ).toThrow("uint8 overflow: 256");
    expect(() =>
      deserializeCxs(serializeCxs(256n, Uint32Codec), Uint8Codec),
    ).toThrow("uint8 overflow: 256");
  });
});

describe("FixedOpaqueCodec", () => {
  const Fixed3 = FixedOpaqueCodec(3);

  it("uses XDR padding and raw CXS bytes", () => {
    const value = Uint8Array.from([0xaa, 0xbb, 0xcc]);

    expect(serialize(value, Fixed3)).toEqual(
      Uint8Array.from([0xaa, 0xbb, 0xcc, 0x00]),
    );
    expect(serializeCxs(value, Fixed3)).toEqual(value);
  });

  it("round-trips zero-length and non-empty values", () => {
    const empty = new Uint8Array();
    const value = Uint8Array.from([1, 2, 3]);

    expect(deserialize(serialize(empty, FixedOpaqueCodec(0)), FixedOpaqueCodec(0))).toEqual(empty);
    expect(deserialize(serialize(value, Fixed3), Fixed3)).toEqual(value);
    expect(deserializeCxs(serializeCxs(value, Fixed3), Fixed3)).toEqual(value);
  });

  it("rejects values whose length is not exact", () => {
    expect(() => serialize(Uint8Array.from([1, 2]), Fixed3)).toThrow(
      "expected 3, got 2",
    );
    expect(() => serializeCxs(Uint8Array.from([1, 2]), Fixed3)).toThrow(
      "expected 3, got 2",
    );
    expect(() => serializeCxs(Uint8Array.from([1, 2, 3, 4]), Fixed3)).toThrow(
      "expected 3, got 4",
    );
  });

  it("rejects truncated XDR and CXS input", () => {
    expect(() => deserialize(Uint8Array.from([1, 2, 3]), Fixed3)).toThrow();
    expect(() => deserializeCxs(Uint8Array.from([1, 2]), Fixed3)).toThrow();
  });

  it("returns caller-owned bytes", () => {
    const xdrInput = Uint8Array.from([1, 2, 3, 0]);
    const xdrDecoded = deserialize(xdrInput, Fixed3);
    const cxsInput = Uint8Array.from([1, 2, 3]);
    const cxsDecoded = deserializeCxs(cxsInput, Fixed3);

    xdrInput[0] = 9;
    cxsInput[0] = 9;
    expect(xdrDecoded).toEqual(Uint8Array.from([1, 2, 3]));
    expect(cxsDecoded).toEqual(Uint8Array.from([1, 2, 3]));

    xdrDecoded[1] = 8;
    cxsDecoded[1] = 8;
    expect(xdrInput).toEqual(Uint8Array.from([9, 2, 3, 0]));
    expect(cxsInput).toEqual(Uint8Array.from([9, 2, 3]));
  });
});

describe("VarOpaqueCodec", () => {
  const Max3 = VarOpaqueCodec(3);

  it("uses format-specific length framing", () => {
    const value = Uint8Array.from([0xde, 0xad]);

    expect(serialize(value, Max3)).toEqual(
      Uint8Array.from([0x00, 0x00, 0x00, 0x02, 0xde, 0xad, 0x00, 0x00]),
    );
    expect(serializeCxs(value, Max3)).toEqual(
      Uint8Array.from([0x02, 0xde, 0xad]),
    );
  });

  it("round-trips empty and maximum-length values", () => {
    const empty = new Uint8Array();
    const maximum = Uint8Array.from([1, 2, 3]);

    expect(deserialize(serialize(empty, Max3), Max3)).toEqual(empty);
    expect(deserialize(serialize(maximum, Max3), Max3)).toEqual(maximum);
    expect(deserializeCxs(serializeCxs(maximum, Max3), Max3)).toEqual(maximum);
  });

  it("rejects values above the maximum", () => {
    expect(() => serialize(Uint8Array.from([1, 2, 3, 4]), Max3)).toThrow(
      "exceeds max",
    );
    expect(() => serializeCxs(Uint8Array.from([1, 2, 3, 4]), Max3)).toThrow(
      "exceeds max",
    );
  });

  it("rejects encoded lengths above the maximum", () => {
    expect(() =>
      deserialize(
        Uint8Array.from([0x00, 0x00, 0x00, 0x04, 1, 2, 3, 4]),
        Max3,
      ),
    ).toThrow("exceeds max 3");
    expect(() =>
      deserializeCxs(Uint8Array.from([0x04, 1, 2, 3, 4]), Max3),
    ).toThrow("exceeds max 3");
  });

  it("rejects truncated payloads", () => {
    expect(() =>
      deserialize(
        Uint8Array.from([0x00, 0x00, 0x00, 0x03, 1, 2]),
        Max3,
      ),
    ).toThrow();
    expect(() =>
      deserializeCxs(Uint8Array.from([0x03, 1, 2]), Max3),
    ).toThrow();
  });

  it("returns caller-owned bytes", () => {
    const xdrInput = Uint8Array.from([0, 0, 0, 3, 1, 2, 3, 0]);
    const xdrDecoded = deserialize(xdrInput, Max3);
    const cxsInput = Uint8Array.from([3, 1, 2, 3]);
    const cxsDecoded = deserializeCxs(cxsInput, Max3);

    xdrInput[4] = 9;
    cxsInput[1] = 9;
    expect(xdrDecoded).toEqual(Uint8Array.from([1, 2, 3]));
    expect(cxsDecoded).toEqual(Uint8Array.from([1, 2, 3]));

    xdrDecoded[1] = 8;
    cxsDecoded[1] = 8;
    expect(xdrInput).toEqual(Uint8Array.from([0, 0, 0, 3, 9, 2, 3, 0]));
    expect(cxsInput).toEqual(Uint8Array.from([3, 9, 2, 3]));
  });
});

describe("opaque codec bounds", () => {
  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 0x1_0000_0000])(
    "rejects invalid bound %s",
    (bound) => {
      expect(() => FixedOpaqueCodec(bound)).toThrow("must be an integer");
      expect(() => VarOpaqueCodec(bound)).toThrow("must be an integer");
    },
  );

  it("accepts the uint32 maximum", () => {
    expect(() => FixedOpaqueCodec(0xffffffff)).not.toThrow();
    expect(() => VarOpaqueCodec(0xffffffff)).not.toThrow();
  });

  it("rejects truncated maximum-length fixed opaque input", () => {
    expect(() =>
      deserialize(new Uint8Array(), FixedOpaqueCodec(0xffffffff)),
    ).toThrow();
  });
});
