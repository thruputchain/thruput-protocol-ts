import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
  XdrWriter,
} from "@groundhogchain/xdr";
import {
  TestColor, TestStatusCode,
  codec,
} from "../fixtures/index.js";
import type {
  TestShape, TestResult, TestMessage, TestExtPoint,
} from "../fixtures/index.js";

// ============================================================================
// Pattern 1: No default arm — enum-discriminated
// ============================================================================

describe("union codecs — no default arm", () => {
  describe("TestShape (data + data + void arms)", () => {
    it("round-trips Red (data: radius)", () => {
      const shape: TestShape = { color: TestColor.Red, radius: 42n };
      expect(deserialize(serialize(shape, codec.TestShape), codec.TestShape)).toEqual(shape);
    });

    it("round-trips Green (data: rectangle)", () => {
      const shape: TestShape = {
        color: TestColor.Green,
        rectangle: { width: 10n, height: 20n },
      };
      expect(deserialize(serialize(shape, codec.TestShape), codec.TestShape)).toEqual(shape);
    });

    it("round-trips Blue (void arm)", () => {
      const shape: TestShape = { color: TestColor.Blue };
      expect(deserialize(serialize(shape, codec.TestShape), codec.TestShape)).toEqual(shape);
    });

    it("throws on unknown discriminant", () => {
      const w = new XdrWriter();
      w.writeInt32(99n);
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow(/Unknown/);
    });

    it("each variant produces different bytes", () => {
      const variants: TestShape[] = [
        { color: TestColor.Red, radius: 1n },
        { color: TestColor.Green, rectangle: { width: 1n, height: 1n } },
        { color: TestColor.Blue },
      ];
      const hexes = variants.map(v =>
        Array.from(serialize(v, codec.TestShape)).map(b => b.toString(16).padStart(2, "0")).join("")
      );
      expect(new Set(hexes).size).toBe(hexes.length);
    });

    it("round-trips all variants via CXS", () => {
      const variants: TestShape[] = [
        { color: TestColor.Red, radius: 5n },
        { color: TestColor.Green, rectangle: { width: 3n, height: 4n } },
        { color: TestColor.Blue },
      ];
      for (const v of variants) {
        expect(deserializeCxs(serializeCxs(v, codec.TestShape), codec.TestShape)).toEqual(v);
      }
    });
  });

  describe("TestExtPoint (int-discriminated, void-only)", () => {
    it("round-trips variant 0", () => {
      const ep: TestExtPoint = { v: 0 };
      expect(serialize(ep, codec.TestExtPoint)).toEqual(new Uint8Array([0, 0, 0, 0]));
      expect(deserialize(serialize(ep, codec.TestExtPoint), codec.TestExtPoint)).toEqual(ep);
    });

    it("throws on unknown variant", () => {
      const w = new XdrWriter();
      w.writeInt32(1n);
      expect(() => deserialize(w.finish(), codec.TestExtPoint)).toThrow(/Unknown/);
    });
  });
});

// ============================================================================
// Pattern 2: Default void arm
// ============================================================================

describe("union codecs — default void arm (pattern 2)", () => {
  it("round-trips OK variant (data arm)", () => {
    const val: TestResult = { status: TestStatusCode.OK, value: 42n };
    expect(deserialize(serialize(val, codec.TestResult), codec.TestResult)).toEqual(val);
  });

  it("round-trips known error via default arm", () => {
    const val: TestResult = { status: TestStatusCode.NotFound };
    const decoded = deserialize(serialize(val, codec.TestResult), codec.TestResult);
    expect(decoded.status).toBe(TestStatusCode.NotFound);
    expect("value" in decoded).toBe(false);
  });

  it("round-trips unknown discriminant via default arm", () => {
    const w = new XdrWriter();
    w.writeInt32(99n);
    const decoded = deserialize(w.finish(), codec.TestResult);
    expect(decoded.status).toBe(99);
    expect("value" in decoded).toBe(false);
  });

  it("default arm (void) encodes only the discriminant", () => {
    const ok = serialize({ status: TestStatusCode.OK, value: 42n } as TestResult, codec.TestResult);
    const err = serialize({ status: TestStatusCode.NotFound } as TestResult, codec.TestResult);
    expect(ok.length).toBe(8);
    expect(err.length).toBe(4);
  });

  it("round-trips via CXS", () => {
    expect(
      deserializeCxs(serializeCxs({ status: TestStatusCode.OK, value: 100n } as TestResult, codec.TestResult), codec.TestResult)
    ).toEqual({ status: TestStatusCode.OK, value: 100n });
    expect(
      deserializeCxs(serializeCxs({ status: TestStatusCode.Internal } as TestResult, codec.TestResult), codec.TestResult)
    ).toEqual({ status: TestStatusCode.Internal });
  });
});

// ============================================================================
// Pattern 3: Default data arm
// ============================================================================

describe("union codecs — default data arm (pattern 3)", () => {
  it("round-trips tag 0 (data: count)", () => {
    const val: TestMessage = { tag: 0, count: 999n };
    expect(deserialize(serialize(val, codec.TestMessage), codec.TestMessage)).toEqual(val);
  });

  it("round-trips tag 1 (void)", () => {
    const decoded = deserialize(serialize({ tag: 1 } as TestMessage, codec.TestMessage), codec.TestMessage);
    expect(decoded.tag).toBe(1);
  });

  it("round-trips unknown tag via default arm with data", () => {
    const val: TestMessage = { tag: 42, raw_payload: new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]) };
    const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
    expect(decoded.tag).toBe(42);
    expect((decoded as { raw_payload: Uint8Array }).raw_payload).toEqual(new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]));
  });

  it("round-trips default arm with empty payload", () => {
    const val: TestMessage = { tag: 77, raw_payload: new Uint8Array(0) };
    const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
    expect(decoded.tag).toBe(77);
    expect((decoded as { raw_payload: Uint8Array }).raw_payload).toEqual(new Uint8Array(0));
  });

  it("round-trips all variants via CXS", () => {
    const variants: TestMessage[] = [
      { tag: 0, count: 0n },
      { tag: 1 },
      { tag: 255, raw_payload: new Uint8Array([1, 2, 3]) },
    ];
    for (const val of variants) {
      expect(deserializeCxs(serializeCxs(val, codec.TestMessage), codec.TestMessage)).toEqual(val);
    }
  });
});

// ============================================================================
// TXS vs CXS comparison
// ============================================================================

describe("union codecs — TXS vs CXS", () => {
  it("CXS is smaller for small discriminants", () => {
    const shape: TestShape = { color: TestColor.Blue };
    expect(serialize(shape, codec.TestShape).length).toBe(4);
    expect(serializeCxs(shape, codec.TestShape).length).toBe(1);
  });

  it("both formats decode to the same value", () => {
    const shape: TestShape = { color: TestColor.Red, radius: 42n };
    expect(
      deserialize(serialize(shape, codec.TestShape), codec.TestShape)
    ).toEqual(
      deserializeCxs(serializeCxs(shape, codec.TestShape), codec.TestShape)
    );
  });
});

// ============================================================================
// Discriminant/field mismatch safety
// ============================================================================

describe("union codecs — discriminant/field mismatch safety", () => {
  describe("no-default unions: decode throws on unknown discriminant", () => {
    it("TestShape throws on discriminant 99", () => {
      const w = new XdrWriter();
      w.writeInt32(99n);
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow(/Unknown/);
    });

    it("TestExtPoint throws on discriminant 1", () => {
      const w = new XdrWriter();
      w.writeInt32(1n);
      expect(() => deserialize(w.finish(), codec.TestExtPoint)).toThrow(/Unknown/);
    });
  });

  describe("no-default unions: decode produces correctly paired discriminant+fields", () => {
    it("TestShape Red has radius, not rectangle", () => {
      const shape: TestShape = { color: TestColor.Red, radius: 10n };
      const decoded = deserialize(serialize(shape, codec.TestShape), codec.TestShape);
      expect("radius" in decoded).toBe(true);
      expect("rectangle" in decoded).toBe(false);
    });

    it("TestShape Green has rectangle, not radius", () => {
      const shape: TestShape = { color: TestColor.Green, rectangle: { width: 5n, height: 6n } };
      const decoded = deserialize(serialize(shape, codec.TestShape), codec.TestShape);
      expect("rectangle" in decoded).toBe(true);
      expect("radius" in decoded).toBe(false);
    });

    it("TestShape Blue (void) has no data fields", () => {
      const shape: TestShape = { color: TestColor.Blue };
      const decoded = deserialize(serialize(shape, codec.TestShape), codec.TestShape);
      expect(Object.keys(decoded)).toEqual(["color"]);
    });
  });

  describe("default-void unions: unknown discriminants don't crash", () => {
    it("TestResult: unknown status decodes to { status } only", () => {
      const w = new XdrWriter();
      w.writeInt32(77n);
      const decoded = deserialize(w.finish(), codec.TestResult);
      expect(decoded.status).toBe(77);
      expect(Object.keys(decoded)).toEqual(["status"]);
    });

    it("TestResult: OK always has value field", () => {
      const val: TestResult = { status: TestStatusCode.OK, value: 42n };
      const decoded = deserialize(serialize(val, codec.TestResult), codec.TestResult);
      expect("value" in decoded).toBe(true);
    });
  });

  describe("default-data unions: field presence matches discriminant", () => {
    it("TestMessage tag=0 has count, not raw_payload", () => {
      const val: TestMessage = { tag: 0, count: 42n };
      const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
      expect("count" in decoded).toBe(true);
      expect("raw_payload" in decoded).toBe(false);
    });

    it("TestMessage tag=1 has neither count nor raw_payload", () => {
      const decoded = deserialize(serialize({ tag: 1 } as TestMessage, codec.TestMessage), codec.TestMessage);
      expect(Object.keys(decoded)).toEqual(["tag"]);
    });

    it("TestMessage unknown tag has raw_payload, not count", () => {
      const val: TestMessage = { tag: 50, raw_payload: new Uint8Array([1]) };
      const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
      expect("raw_payload" in decoded).toBe(true);
      expect("count" in decoded).toBe(false);
    });
  });

  describe("hand-crafted bad bytes", () => {
    it("TestShape: discriminant=Red but no body -> read past end", () => {
      const w = new XdrWriter();
      w.writeInt32(BigInt(TestColor.Red));
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow();
    });

    it("TestShape: discriminant=Blue with trailing garbage throws", () => {
      const w = new XdrWriter();
      w.writeInt32(BigInt(TestColor.Blue));
      w.writeUint32(0xDEADn);
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow("Trailing data");
    });

    it("TestExtPoint: discriminant=0 encodes as 4 zero bytes", () => {
      const ep: TestExtPoint = { v: 0 };
      expect(serialize(ep, codec.TestExtPoint)).toEqual(new Uint8Array([0, 0, 0, 0]));
    });
  });
});
