// Interfaces for XDR-like serialization formats.
// XdrWriter/XdrReader implement these for standard XDR (RFC 4506).
// CxsWriter/CxsReader implement them for compact XDR (CXS).

export interface IWriter {
  writeInt32(val: bigint): void;
  writeUint32(val: bigint): void;
  writeInt64(val: bigint): void;
  writeUint64(val: bigint): void;
  writeInt128(val: bigint): void;
  writeUint128(val: bigint): void;
  writeBool(val: boolean): void;
  writeFixedOpaque(val: Uint8Array, len: number): void;
  writeVarOpaque(val: Uint8Array, max: number): void;
  writeString(val: string, max: number): void;
}

export interface IReader {
  readonly position: number;
  readonly remaining: number;
  readInt32(): bigint;
  readUint32(): bigint;
  readInt64(): bigint;
  readUint64(): bigint;
  readInt128(): bigint;
  readUint128(): bigint;
  readBool(): boolean;
  readFixedOpaque(len: number): Uint8Array;
  readVarOpaque(max: number): Uint8Array;
  readString(max: number): string;
}

export interface XdrCodec<T> {
  encode(w: IWriter, val: T): void;
  decode(r: IReader): T;
}

/** Codec for XDR void — encodes/decodes nothing. */
export const VoidCodec: XdrCodec<void> = {
  encode() {},
  decode() {},
};

/** Codec for XDR bool. */
export const BoolCodec: XdrCodec<boolean> = {
  encode(w, val) { w.writeBool(val); },
  decode(r) { return r.readBool(); },
};

export const Int32Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt32(val); },
  decode(r) { return r.readInt32(); },
};

export const Uint32Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return r.readUint32(); },
};

export const Int64Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return r.readInt64(); },
};

export const Uint64Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return r.readUint64(); },
};

export const Int128Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt128(val); },
  decode(r) { return r.readInt128(); },
};

export const Uint128Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint128(val); },
  decode(r) { return r.readUint128(); },
};

// Codec references may be passed as thunks (`() => codec`) to break circular
// dependencies between generated files that all re-export through a barrel
// module.  At module load time the barrel's `codec` object may not yet be
// initialised, so eagerly evaluating `proto.codec.X` in a top-level
// combinator call would fail.  A thunk defers the lookup to encode/decode
// time, when all modules have finished loading.
export type LazyCodec<T> = XdrCodec<T> | (() => XdrCodec<T>);
function resolve<T>(c: LazyCodec<T>): XdrCodec<T> {
  return typeof c === "function" ? (c as () => XdrCodec<T>)() : c;
}

/** Codec combinator for XDR optional (u32 discriminant + inner value). */
export function OptionCodec<T>(inner: LazyCodec<T>): XdrCodec<T | null> {
  return {
    encode(w, val) {
      if (val !== null) {
        w.writeUint32(1n);
        resolve(inner).encode(w, val);
      } else {
        w.writeUint32(0n);
      }
    },
    decode(r) {
      const disc = r.readUint32();
      if (disc === 1n) return resolve(inner).decode(r);
      if (disc === 0n) return null;
      throw new Error(`Option: invalid discriminant ${disc} (expected 0 or 1)`);
    },
  };
}

/** Codec combinator for XDR variable-length array (u32 length prefix + elements). */
export function VarArrayCodec<T>(inner: LazyCodec<T>, max: number): XdrCodec<T[]> {
  return {
    encode(w, val) {
      if (val.length > max) {
        throw new Error(`VarArray length ${val.length} exceeds max ${max}`);
      }
      const c = resolve(inner);
      w.writeUint32(BigInt(val.length));
      for (const item of val) c.encode(w, item);
    },
    decode(r) {
      const len = Number(r.readUint32());
      if (len > max) {
        throw new Error(`VarArray length ${len} exceeds max ${max}`);
      }
      const c = resolve(inner);
      return Array.from({ length: len }, () => c.decode(r));
    },
  };
}

/** Codec combinator for XDR fixed-length array (no length prefix, exactly N elements). */
export function FixedArrayCodec<T>(inner: LazyCodec<T>, len: number): XdrCodec<T[]> {
  return {
    encode(w, val) {
      if (val.length !== len) {
        throw new Error(`FixedArray expected ${len} elements, got ${val.length}`);
      }
      const c = resolve(inner);
      for (const item of val) c.encode(w, item);
    },
    decode(r) {
      const c = resolve(inner);
      return Array.from({ length: len }, () => c.decode(r));
    },
  };
}

/** Metadata for a single RPC method (generated from XDR `program` blocks). */
export interface RpcMethodMeta<Req, Resp> {
  proc: number;
  request: XdrCodec<Req>;
  response: XdrCodec<Resp>;
}

/** Metadata for an RPC program (generated from XDR `program` blocks). */
export interface RpcProgramMeta {
  programId: number;
  version: number;
  methods: Record<string, RpcMethodMeta<unknown, unknown>>;
}

// Standard XDR (TXS) serialization
import { XdrWriter } from "./writer.js";
import { XdrReader } from "./reader.js";

export function serialize<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new XdrWriter();
  codec.encode(w, val);
  return w.finish();
}

export function deserialize<T>(data: Uint8Array, codec: XdrCodec<T>): T {
  const r = new XdrReader(data);
  const val = codec.decode(r);
  if (r.remaining > 0) {
    throw new Error(`Trailing data after XDR decode: ${r.remaining} bytes remaining`);
  }
  return val;
}

// Compact XDR (CXS) serialization
import { CxsWriter } from "./cxs_writer.js";
import { CxsReader } from "./cxs_reader.js";

export function serializeCxs<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new CxsWriter();
  codec.encode(w, val);
  return w.finish();
}

export function deserializeCxs<T>(data: Uint8Array, codec: XdrCodec<T>): T {
  const r = new CxsReader(data);
  const val = codec.decode(r);
  if (r.remaining > 0) {
    throw new Error(`Trailing data after CXS decode: ${r.remaining} bytes remaining`);
  }
  return val;
}
