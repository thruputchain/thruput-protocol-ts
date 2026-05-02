import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
} from "@groundhogchain/xdr";
import {
  testHash, TestHash,
  testEntrypointId, TestEntrypointId,
  testPayload, TestPayload,
  testBlob, TestBlob,
  TestColor,
  TestStatusCode,
  kTestMaxLen,
  kTestVersion,
  codec,
} from "../fixtures/test_types.js";

describe("branded type factories", () => {
  it("testHash accepts 32 bytes", () => {
    const data = new Uint8Array(32);
    const hash: TestHash = testHash(data);
    expect(hash).toBe(data);
  });

  it("testHash rejects wrong length", () => {
    expect(() => testHash(new Uint8Array(31))).toThrow();
    expect(() => testHash(new Uint8Array(33))).toThrow();
  });

  it("testEntrypointId accepts 8 bytes", () => {
    const data = new Uint8Array(8);
    const id: TestEntrypointId = testEntrypointId(data);
    expect(id).toBe(data);
  });

  it("testEntrypointId rejects wrong length", () => {
    expect(() => testEntrypointId(new Uint8Array(7))).toThrow();
    expect(() => testEntrypointId(new Uint8Array(9))).toThrow();
  });

  it("testPayload accepts up to kTestMaxLen", () => {
    const data = new Uint8Array(Number(kTestMaxLen));
    const p: TestPayload = testPayload(data);
    expect(p).toBe(data);
  });

  it("testPayload rejects over max", () => {
    expect(() => testPayload(new Uint8Array(Number(kTestMaxLen) + 1))).toThrow();
  });

  it("testBlob accepts any length", () => {
    const data = new Uint8Array(5000);
    const b: TestBlob = testBlob(data);
    expect(b).toBe(data);
  });
});

describe("enums", () => {
  it("TestColor has correct values", () => {
    expect(TestColor.Red).toBe(0);
    expect(TestColor.Green).toBe(1);
    expect(TestColor.Blue).toBe(2);
  });

  it("TestStatusCode has correct values", () => {
    expect(TestStatusCode.OK).toBe(0);
    expect(TestStatusCode.NotFound).toBe(1);
    expect(TestStatusCode.Internal).toBe(2);
  });
});

describe("enum codecs", () => {
  it("TestColor round-trips all variants", () => {
    for (const variant of [TestColor.Red, TestColor.Green, TestColor.Blue]) {
      const bytes = serialize(variant, codec.TestColor);
      expect(deserialize(bytes, codec.TestColor)).toBe(variant);
    }
  });

  it("TestStatusCode round-trips all variants", () => {
    for (const variant of [TestStatusCode.OK, TestStatusCode.NotFound, TestStatusCode.Internal]) {
      const bytes = serialize(variant, codec.TestStatusCode);
      expect(deserialize(bytes, codec.TestStatusCode)).toBe(variant);
    }
  });
});

describe("constants", () => {
  it("kTestMaxLen", () => {
    expect(kTestMaxLen).toBe(1024n);
  });

  it("kTestVersion", () => {
    expect(kTestVersion).toBe(42n);
  });
});
