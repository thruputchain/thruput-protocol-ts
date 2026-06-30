// Interfaces for XDR-like serialization formats.
// XdrWriter/XdrReader implement these for standard XDR (RFC 4506).
// CxsWriter/CxsReader implement them for compact XDR (CXS).

/** Writes primitive values to an XDR-compatible serialization format. */
export interface IWriter {
  /** Write a signed 32-bit integer. */
  writeInt32(val: bigint): void;
  /** Write an unsigned 32-bit integer. */
  writeUint32(val: bigint): void;
  /** Write a signed 64-bit integer. */
  writeInt64(val: bigint): void;
  /** Write an unsigned 64-bit integer. */
  writeUint64(val: bigint): void;
  /** Write a signed 128-bit integer. */
  writeInt128(val: bigint): void;
  /** Write an unsigned 128-bit integer. */
  writeUint128(val: bigint): void;
  /** Write a boolean value. */
  writeBool(val: boolean): void;
  /** Write exactly `len` opaque bytes. */
  writeFixedOpaque(val: Uint8Array, len: number): void;
  /** Write length-prefixed opaque bytes bounded by `max`. */
  writeVarOpaque(val: Uint8Array, max: number): void;
  /** UTF-8 encode and write a length-prefixed string bounded by `max` bytes. */
  writeString(val: string, max: number): void;
}

/** Reads primitive values from an XDR-compatible serialization format. */
export interface IReader {
  /** Current byte offset in the input. */
  readonly position: number;
  /** Number of unread bytes remaining in the input. */
  readonly remaining: number;
  /** Read a signed 32-bit integer. */
  readInt32(): bigint;
  /** Read an unsigned 32-bit integer. */
  readUint32(): bigint;
  /** Read a signed 64-bit integer. */
  readInt64(): bigint;
  /** Read an unsigned 64-bit integer. */
  readUint64(): bigint;
  /** Read a signed 128-bit integer. */
  readInt128(): bigint;
  /** Read an unsigned 128-bit integer. */
  readUint128(): bigint;
  /** Read a boolean value. */
  readBool(): boolean;
  /** Read exactly `len` opaque bytes. */
  readFixedOpaque(len: number): Uint8Array;
  /** Read length-prefixed opaque bytes bounded by `max`. */
  readVarOpaque(max: number): Uint8Array;
  /** Read and UTF-8 decode a length-prefixed string bounded by `max` bytes. */
  readString(max: number): string;
}

/** Encodes and decodes values of type `T` using an XDR-compatible format. */
export interface XdrCodec<T> {
  /** Write `val` to `w`. */
  encode(w: IWriter, val: T): void;
  /** Read and return a value from `r`. */
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

/** Codec for signed 32-bit integers, represented as `bigint`. */
export const Int32Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt32(val); },
  decode(r) { return r.readInt32(); },
};

/** Codec for unsigned 32-bit integers, represented as `bigint`. */
export const Uint32Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return r.readUint32(); },
};

/** Codec for signed 64-bit integers. */
export const Int64Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return r.readInt64(); },
};

/** Codec for unsigned 64-bit integers. */
export const Uint64Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return r.readUint64(); },
};

/** Codec for signed 128-bit integers. */
export const Int128Codec: XdrCodec<bigint> = {
  encode(w, val) { w.writeInt128(val); },
  decode(r) { return r.readInt128(); },
};

/** Codec for unsigned 128-bit integers. */
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
/** Codec reference or thunk used to break circular dependencies in generated codecs. */
export type LazyCodec<T> = XdrCodec<T> | (() => XdrCodec<T>);

/** Resolve a direct codec or lazy codec thunk. */
export function resolve<T>(c: LazyCodec<T>): XdrCodec<T> {
  return typeof c === "function" ? (c as () => XdrCodec<T>)() : c;
}

/** Codec combinator for XDR optional values (u32 discriminant + inner value). */
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

/** Metadata for a single RPC method generated from XDR `program` blocks. */
export interface RpcMethodMeta<Req, Resp> {
  /** ONC-RPC procedure number. */
  proc: number;
  /** Codec for the request body. */
  request: LazyCodec<Req>;
  /** Codec for the response body. */
  response: LazyCodec<Resp>;
}

/** Metadata for an RPC program generated from XDR `program` blocks. */
export interface RpcProgramMeta {
  /** ONC-RPC program identifier. */
  programId: number;
  /** ONC-RPC program version. */
  version: number;
  /** Method metadata keyed by generated method name. */
  methods: Record<string, RpcMethodMeta<unknown, unknown>>;
}

// Standard XDR (TXS) serialization
import { XdrWriter } from "./writer.js";
import { XdrReader } from "./reader.js";

/**
 * Serialize a value with standard XDR encoding.
 *
 * @example
 * ```ts
 * const bytes = serialize(42n, Int32Codec);
 * ```
 */
export function serialize<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new XdrWriter();
  codec.encode(w, val);
  return w.finish();
}

/** Deserialize a standard XDR byte array and reject trailing bytes. */
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

/** Serialize a value with compact XDR serialization (CXS). */
export function serializeCxs<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new CxsWriter();
  codec.encode(w, val);
  return w.finish();
}

/** Deserialize a CXS byte array and reject trailing bytes. */
export function deserializeCxs<T>(data: Uint8Array, codec: XdrCodec<T>): T {
  const r = new CxsReader(data);
  const val = codec.decode(r);
  if (r.remaining > 0) {
    throw new Error(`Trailing data after CXS decode: ${r.remaining} bytes remaining`);
  }
  return val;
}
