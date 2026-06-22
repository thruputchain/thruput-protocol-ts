// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e71362f6e7b2754f18b47834c49916f3f359ab01

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



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


//
// XDR Codecs below this point
//

const _TestPerson: XdrCodec<TestPerson> = {
  encode(w, val) {
    w.writeString(val.name, Number(256));
    proto.codec.TestHash.encode(w, val.id);
    proto.codec.TestPoint.encode(w, val.location);
  },
  decode(r) {
    const name = r.readString(Number(256));
    const id = proto.codec.TestHash.decode(r);
    const location = proto.codec.TestPoint.decode(r);
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
        proto.codec.TestShape_rectangle.encode(w, val.rectangle);
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
        const rectangle = proto.codec.TestShape_rectangle.decode(r);
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

export const codec = {
  TestPerson: _TestPerson,
  TestShape_rectangle: _TestShape_rectangle,
  TestShape: _TestShape,
  TestResult: _TestResult,
} as const;

