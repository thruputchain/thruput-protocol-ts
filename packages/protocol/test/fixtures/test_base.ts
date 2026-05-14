// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5351fdbd5f24dc09297b1857e6e8605cbf0ee655

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, Uint32Codec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export const kTestMaxLen = 1024n;

export const kTestVersion = 42n;

export enum TestColor {
  Red = 0,
  Green = 1,
  Blue = 2,
}

export enum TestStatusCode {
  OK = 0,
  NotFound = 1,
  Internal = 2,
}

export type TestHash = Uint8Array & { readonly __brand: "TestHash" };
export function testHash(data: Uint8Array): TestHash {
  if (data.length !== 32) throw new Error(`TestHash must be exactly 32 bytes, got ${data.length}`);
  return data as TestHash;
}

export type TestEntrypointId = Uint8Array & { readonly __brand: "TestEntrypointId" };
export function testEntrypointId(data: Uint8Array): TestEntrypointId {
  if (data.length !== 8) throw new Error(`TestEntrypointId must be exactly 8 bytes, got ${data.length}`);
  return data as TestEntrypointId;
}

export type TestPayload = Uint8Array & { readonly __brand: "TestPayload" };
export function testPayload(data: Uint8Array): TestPayload {
  if (data.length > Number(1024)) throw new Error(`TestPayload exceeds max length 1024, got ${data.length}`);
  return data as TestPayload;
}

export type TestBlob = Uint8Array & { readonly __brand: "TestBlob" };
export function testBlob(data: Uint8Array): TestBlob {
  return data as TestBlob;
}

export interface TestPoint {
  x: bigint;
  y: bigint;
}

export type TestMessage =
  | { tag: 0; count: bigint }
  | { tag: 1 }
  | { tag: number; raw_payload: Uint8Array }
;

export type TestExtPoint =
  | { v: 0 }
;

export interface TestMatrix {
  row: bigint[];
}

export interface TestScores {
  values: bigint[];
}

export interface TestOptional {
  maybe_value: bigint | null;
}


//
// XDR Codecs below this point
//

const _TestColor: XdrCodec<TestColor> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TestColor; },
};

const _TestStatusCode: XdrCodec<TestStatusCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TestStatusCode; },
};

const _TestHash: XdrCodec<TestHash> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return testHash(r.readFixedOpaque(32)); },
};

const _TestEntrypointId: XdrCodec<TestEntrypointId> = {
  encode(w, val) { w.writeFixedOpaque(val, 8); },
  decode(r) { return testEntrypointId(r.readFixedOpaque(8)); },
};

const _TestPayload: XdrCodec<TestPayload> = {
  encode(w, val) { w.writeVarOpaque(val, Number(1024)); },
  decode(r) { return testPayload(r.readVarOpaque(Number(1024))); },
};

const _TestBlob: XdrCodec<TestBlob> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return testBlob(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

const _TestPoint: XdrCodec<TestPoint> = {
  encode(w, val) {
    w.writeUint32(val.x);
    w.writeUint32(val.y);
  },
  decode(r) {
    const x = r.readUint32();
    const y = r.readUint32();
    return { x, y };
  },
};

const _TestMessage: XdrCodec<TestMessage> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.tag));
    switch (val.tag) {
      case 0:
      {
        const v = val as { tag: number; count: bigint };
        if (v.count === undefined) {
          throw new Error("TestMessage encode: count is undefined");
        }
        w.writeUint64(v.count);
        break;
      }
      case 1:
        break;
      default: {
        const v = val as { tag: number; raw_payload: Uint8Array };
        if (v.raw_payload === undefined) {
          throw new Error("TestMessage encode: default arm but raw_payload is undefined");
        }
        w.writeVarOpaque(v.raw_payload, Number(0xFFFFFFFF));
        break;
      }
    }
  },
  decode(r) {
    const tag = Number(r.readInt32());
    switch (tag) {
      case 0:
        const count = r.readUint64();
        return { tag, count };
      case 1:
        return { tag };
      default:
        const raw_payload = r.readVarOpaque(Number(0xFFFFFFFF));
        return { tag, raw_payload };
    }
  },
};

const _TestExtPoint: XdrCodec<TestExtPoint> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
    switch (val.v) {
      case 0:
        break;
    }
  },
  decode(r) {
    const v = Number(r.readInt32());
    switch (v) {
      case 0:
        return { v } as TestExtPoint;
      default:
        throw new Error(`Unknown TestExtPoint discriminant: ${v}`);
    }
  },
};

const _TestMatrix: XdrCodec<TestMatrix> = {
  encode(w, val) {
    for (const _item of val.row) w.writeUint32(_item);
  },
  decode(r) {
    const row = Array.from({ length: Number(3) }, () => r.readUint32());
    return { row };
  },
};

const _TestScores: XdrCodec<TestScores> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.values.length));
    for (const _item of val.values) w.writeUint32(_item);
  },
  decode(r) {
    const _values_len = Number(r.readUint32());
    const values = Array.from({ length: _values_len }, () => r.readUint32());
    return { values };
  },
};

const _TestOptional: XdrCodec<TestOptional> = {
  encode(w, val) {
    OptionCodec(Uint32Codec).encode(w, val.maybe_value);
  },
  decode(r) {
    const maybe_value = OptionCodec(Uint32Codec).decode(r);
    return { maybe_value };
  },
};

export const codec = {
  TestColor: _TestColor,
  TestStatusCode: _TestStatusCode,
  TestHash: _TestHash,
  TestEntrypointId: _TestEntrypointId,
  TestPayload: _TestPayload,
  TestBlob: _TestBlob,
  TestPoint: _TestPoint,
  TestMessage: _TestMessage,
  TestExtPoint: _TestExtPoint,
  TestMatrix: _TestMatrix,
  TestScores: _TestScores,
  TestOptional: _TestOptional,
} as const;

