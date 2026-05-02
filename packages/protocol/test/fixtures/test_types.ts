// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5cf47b904e892062b9ef9ce2ab5b08809d319f6e

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
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

export interface TestPerson {
  name: string;
  id: proto.TestHash;
  location: proto.TestPoint;
}

export interface TestShape_rectangle {
  width: bigint;
  height: bigint;
}

export type TestShape =
  | { color: proto.TestColor.Red; radius: bigint }
  | { color: proto.TestColor.Green; rectangle: proto.TestShape_rectangle }
  | { color: proto.TestColor.Blue }
;

export type TestResult =
  | { status: proto.TestStatusCode.OK; value: bigint }
  | { status: number }
;

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

const _TestPerson: XdrCodec<TestPerson> = {
  encode(w, val) {
    w.writeString(val.name, Number(256));
    _TestHash.encode(w, val.id);
    _TestPoint.encode(w, val.location);
  },
  decode(r) {
    const name = r.readString(Number(256));
    const id = _TestHash.decode(r);
    const location = _TestPoint.decode(r);
    return { name, id, location };
  },
};

const _TestShape_rectangle: XdrCodec<TestShape_rectangle> = {
  encode(w, val) {
    w.writeUint32(val.width);
    w.writeUint32(val.height);
  },
  decode(r) {
    const width = r.readUint32();
    const height = r.readUint32();
    return { width, height };
  },
};

const _TestShape: XdrCodec<TestShape> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.color));
    switch (val.color) {
      case proto.TestColor.Red:
        w.writeUint32(val.radius);
        break;
      case proto.TestColor.Green:
        _TestShape_rectangle.encode(w, val.rectangle);
        break;
      case proto.TestColor.Blue:
        break;
    }
  },
  decode(r) {
    const color = Number(r.readInt32());
    switch (color) {
      case proto.TestColor.Red:
        const radius = r.readUint32();
        return { color, radius };
      case proto.TestColor.Green:
        const rectangle = _TestShape_rectangle.decode(r);
        return { color, rectangle };
      case proto.TestColor.Blue:
        return { color } as TestShape;
      default:
        throw new Error(`Unknown TestShape discriminant: ${color}`);
    }
  },
};

const _TestResult: XdrCodec<TestResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.status));
    switch (val.status) {
      case proto.TestStatusCode.OK:
      {
        const v = val as { status: number; value: bigint };
        if (v.value === undefined) {
          throw new Error("TestResult encode: value is undefined");
        }
        w.writeUint32(v.value);
        break;
      }
    }
  },
  decode(r) {
    const status = Number(r.readInt32());
    switch (status) {
      case proto.TestStatusCode.OK:
        const value = r.readUint32();
        return { status, value };
      default:
        return { status };
    }
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

const _Uint32Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return r.readUint32(); },
};

const _TestOptional: XdrCodec<TestOptional> = {
  encode(w, val) {
    OptionCodec(_Uint32Codec).encode(w, val.maybe_value);
  },
  decode(r) {
    const maybe_value = OptionCodec(_Uint32Codec).decode(r);
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
  TestPerson: _TestPerson,
  TestShape_rectangle: _TestShape_rectangle,
  TestShape: _TestShape,
  TestResult: _TestResult,
  TestMessage: _TestMessage,
  TestExtPoint: _TestExtPoint,
  TestMatrix: _TestMatrix,
  TestScores: _TestScores,
  TestOptional: _TestOptional,
} as const;

