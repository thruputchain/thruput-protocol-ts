// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e671a3694d7312d78364456bb86ee8a18de1502d

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, Uint32Codec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export const kTestMaxLen = 1024n;
/**
 * Type-level value of {@link kTestMaxLen}, for use in array-bound positions.
 * @hidden
 */
export type kTestMaxLen = 1024;

export const kTestVersion = 42n;
/**
 * Type-level value of {@link kTestVersion}, for use in array-bound positions.
 * @hidden
 */
export type kTestVersion = 42;

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

/** XDR: `typedef opaque TestHash[32]` — exactly 32 bytes. */
export type TestHash = FixedBytes<32> & { readonly __brand: { readonly TestHash: true } };
export function testHash(data: Uint8Array): TestHash {
  if (data.length !== 32) throw new Error(`TestHash must be exactly 32 bytes, got ${data.length}`);
  return data as TestHash;
}

/** XDR: `typedef opaque TestEntrypointId[8]` — exactly 8 bytes. */
export type TestEntrypointId = FixedBytes<8> & { readonly __brand: { readonly TestEntrypointId: true } };
export function testEntrypointId(data: Uint8Array): TestEntrypointId {
  if (data.length !== 8) throw new Error(`TestEntrypointId must be exactly 8 bytes, got ${data.length}`);
  return data as TestEntrypointId;
}

/** XDR: `typedef opaque TestPayload<1024>` — max 1024 bytes. */
export type TestPayload = VarBytes<1024> & { readonly __brand: { readonly TestPayload: true } };
export function testPayload(data: Uint8Array): TestPayload {
  if (data.length > 1024) throw new Error(`TestPayload exceeds max length 1024, got ${data.length}`);
  return data as TestPayload;
}

/** XDR: `typedef opaque TestBlob<>`. */
export type TestBlob = Uint8Array & { readonly __brand: { readonly TestBlob: true } };
export function testBlob(data: Uint8Array): TestBlob {
  return data as TestBlob;
}

export interface TestPoint {
  x: bigint;
  y: bigint;
}

export type TestOptPoint = (proto.TestPoint & { readonly __brand: { readonly TestOptPoint: true } }) | null;
export function testOptPoint(val: proto.TestPoint | null): TestOptPoint {
  return val as TestOptPoint;
}

export type TestOptPointAlias = (NonNullable<proto.TestOptPoint> & { readonly __brand: { readonly TestOptPointAlias: true } }) | Extract<proto.TestOptPoint, null>;
export function testOptPointAlias(val: proto.TestOptPoint): TestOptPointAlias {
  return val as TestOptPointAlias;
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
  /** XDR: `unsigned int row[3]` — exactly 3 elements. */
  row: FixedArray<bigint, 3>;
}

export interface TestScores {
  /** XDR: `unsigned int values<10>` — max 10 elements. */
  values: VarArray<bigint, 10>;
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

const _TestOptPoint = OptionCodec(() => _TestPoint) as XdrCodec<TestOptPoint>;

const _TestOptPointAlias: XdrCodec<TestOptPointAlias> = {
  encode(w, val) { proto.codec.TestOptPoint.encode(w, val); },
  decode(r) { return testOptPointAlias(proto.codec.TestOptPoint.decode(r)); },
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
    const row = Array.from({ length: Number(3) }, () => r.readUint32()) as FixedArray<bigint, 3>;
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
  TestOptPoint: _TestOptPoint,
  TestOptPointAlias: _TestOptPointAlias,
  TestMessage: _TestMessage,
  TestExtPoint: _TestExtPoint,
  TestMatrix: _TestMatrix,
  TestScores: _TestScores,
  TestOptional: _TestOptional,
} as const;

