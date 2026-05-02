import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
} from "@groundhogchain/xdr";
import {
  testHash, testEntrypointId, testPayload, testBlob,
  codec,
} from "../fixtures/test_types.js";
import type {
  TestPoint, TestPerson,
  TestMatrix, TestScores, TestOptional,
} from "../fixtures/test_types.js";

describe("branded opaque codecs round-trip", () => {
  it("TestHash (fixed 32 bytes)", () => {
    const data = testHash(new Uint8Array(32).fill(0xAB));
    const bytes = serialize(data, codec.TestHash);
    expect(deserialize(bytes, codec.TestHash)).toEqual(data);
  });

  it("TestEntrypointId (fixed 8 bytes)", () => {
    const data = testEntrypointId(new Uint8Array(8).fill(0xCD));
    const bytes = serialize(data, codec.TestEntrypointId);
    expect(deserialize(bytes, codec.TestEntrypointId)).toEqual(data);
  });

  it("TestPayload (var bounded)", () => {
    const data = testPayload(new Uint8Array([1, 2, 3, 4, 5]));
    const bytes = serialize(data, codec.TestPayload);
    expect(deserialize(bytes, codec.TestPayload)).toEqual(data);
  });

  it("TestBlob (var unbounded)", () => {
    const data = testBlob(new Uint8Array(2000).fill(0xEE));
    const bytes = serialize(data, codec.TestBlob);
    expect(deserialize(bytes, codec.TestBlob)).toEqual(data);
  });
});

describe("struct codecs round-trip", () => {
  it("TestPoint", () => {
    const p: TestPoint = { x: 10n, y: 20n };
    const bytes = serialize(p, codec.TestPoint);
    expect(deserialize(bytes, codec.TestPoint)).toEqual(p);
  });

  it("TestPerson (nested struct + string + branded opaque)", () => {
    const person: TestPerson = {
      name: "Alice",
      id: testHash(new Uint8Array(32).fill(0x01)),
      location: { x: 100n, y: 200n },
    };
    const bytes = serialize(person, codec.TestPerson);
    expect(deserialize(bytes, codec.TestPerson)).toEqual(person);
  });

  it("TestPerson with empty string", () => {
    const person: TestPerson = {
      name: "",
      id: testHash(new Uint8Array(32).fill(0x00)),
      location: { x: 0n, y: 0n },
    };
    const bytes = serialize(person, codec.TestPerson);
    expect(deserialize(bytes, codec.TestPerson)).toEqual(person);
  });
});

describe("array codecs round-trip", () => {
  it("TestMatrix (fixed array of 3)", () => {
    const m: TestMatrix = { row: [1n, 2n, 3n] };
    const bytes = serialize(m, codec.TestMatrix);
    expect(deserialize(bytes, codec.TestMatrix)).toEqual(m);
  });

  it("TestScores (var array, some elements)", () => {
    const s: TestScores = { values: [10n, 20n, 30n] };
    const bytes = serialize(s, codec.TestScores);
    expect(deserialize(bytes, codec.TestScores)).toEqual(s);
  });

  it("TestScores (var array, empty)", () => {
    const s: TestScores = { values: [] };
    const bytes = serialize(s, codec.TestScores);
    expect(deserialize(bytes, codec.TestScores)).toEqual(s);
  });
});

describe("option codecs round-trip", () => {
  it("TestOptional with value present", () => {
    const o: TestOptional = { maybe_value: 42n };
    const bytes = serialize(o, codec.TestOptional);
    expect(deserialize(bytes, codec.TestOptional)).toEqual(o);
  });

  it("TestOptional with null", () => {
    const o: TestOptional = { maybe_value: null };
    const bytes = serialize(o, codec.TestOptional);
    expect(deserialize(bytes, codec.TestOptional)).toEqual(o);
  });
});

describe("CXS round-trips", () => {
  it("TestPoint: CXS round-trip", () => {
    const p: TestPoint = { x: 10n, y: 20n };
    expect(deserializeCxs(serializeCxs(p, codec.TestPoint), codec.TestPoint)).toEqual(p);
  });

  it("TestPerson: CXS round-trip", () => {
    const person: TestPerson = {
      name: "Bob",
      id: testHash(new Uint8Array(32).fill(0x02)),
      location: { x: 50n, y: 60n },
    };
    expect(deserializeCxs(serializeCxs(person, codec.TestPerson), codec.TestPerson)).toEqual(person);
  });

  it("TestPoint: CXS is smaller than TXS", () => {
    const p: TestPoint = { x: 1n, y: 2n };
    const txs = serialize(p, codec.TestPoint);
    const cxs = serializeCxs(p, codec.TestPoint);
    expect(cxs.length).toBeLessThanOrEqual(txs.length);
  });

  it("TestHash: CXS round-trip", () => {
    const h = testHash(new Uint8Array(32).fill(0xBB));
    expect(deserializeCxs(serializeCxs(h, codec.TestHash), codec.TestHash)).toEqual(h);
  });
});
