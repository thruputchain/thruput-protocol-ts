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
  /** Read exactly `len` opaque bytes into a caller-owned copy. */
  readFixedOpaque(len: number): Uint8Array;
  /** Read length-prefixed opaque bytes bounded by `max` into a caller-owned copy. */
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

/**
 * Codec for unsigned 8-bit integers, represented as `bigint`.
 *
 * Scalar U8 values use the XDR/CXS uint32 wire representation with an enforced
 * range of `0..=255`. U8 arrays and vectors use opaque codecs instead.
 */
export const Uint8Codec: XdrCodec<bigint> = {
  encode(w, val) {
    assertUint8(val);
    w.writeUint32(val);
  },
  decode(r) {
    const val = r.readUint32();
    assertUint8(val);
    return val;
  },
};

function assertUint8(val: bigint): void {
  if (typeof val !== "bigint" || val < 0n || val > 0xffn) {
    throw new Error(`uint8 overflow: ${String(val)}`);
  }
}

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

/**
 * Maximum number of bytes a decoder may speculatively pre-allocate for a
 * variable-size container before any element has actually been decoded.
 *
 * Mirrors the bounded-reserve pattern used by hogd's x23 deserializer and
 * the Rust xdrs `MAX_PREALLOC_BYTES`: the untrusted length prefix sizes the
 * initial reservation only up to this budget, and the container grows
 * lazily beyond it as elements really decode, so a forged length prefix
 * cannot force a large up-front allocation.
 */
export const MAX_PREALLOC_BYTES = 16 * 1024 * 1024;

// Estimated backing-store bytes per JS array element slot, used to convert
// MAX_PREALLOC_BYTES into an element-count reserve bound (the analogue of
// dividing by sizeof(T) in the C++/Rust implementations).
const ARRAY_SLOT_BYTES = 8;
const MAX_PREALLOC_SLOTS = MAX_PREALLOC_BYTES / ARRAY_SLOT_BYTES;

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
      // Bounded reserve, lazy growth — the hogd x23 / Rust xdrs pattern.
      // The untrusted length prefix sizes the initial allocation only up to
      // MAX_PREALLOC_BYTES and the bytes actually remaining in the input
      // (every element consumes at least one byte); the array grows lazily
      // past the reserve as elements really decode. A forged length prefix
      // (max is often 0xFFFFFFFF) therefore never causes a large up-front
      // allocation, and decoding fails naturally when an element read
      // exhausts the input.
      const reserve = Math.min(len, r.remaining, MAX_PREALLOC_SLOTS);
      const result: T[] = new Array(reserve);
      for (let i = 0; i < reserve; i++) result[i] = c.decode(r);
      for (let i = reserve; i < len; i++) result.push(c.decode(r));
      return result;
    },
  };
}

/**
 * Codec combinator for XDR fixed-length array (no length prefix, exactly N elements).
 *
 * `encode` accepts a readonly array so that `FixedArray<T, N>` values — whose
 * exact length is part of their type, and which are therefore readonly — can be
 * encoded directly. `decode` still produces a mutable array.
 */
export function FixedArrayCodec<T>(
  inner: LazyCodec<T>,
  len: number,
): XdrCodec<T[]> & { encode(w: IWriter, val: readonly T[]): void } {
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

/** Codec for exactly `len` opaque bytes. */
export function FixedOpaqueCodec(len: number): XdrCodec<Uint8Array> {
  assertOpaqueBound("fixed opaque length", len);
  return {
    encode(w, val) {
      w.writeFixedOpaque(val, len);
    },
    decode(r) {
      return r.readFixedOpaque(len);
    },
  };
}

/** Codec for length-prefixed opaque bytes bounded by `max`. */
export function VarOpaqueCodec(max: number): XdrCodec<Uint8Array> {
  assertOpaqueBound("variable opaque maximum", max);
  return {
    encode(w, val) {
      w.writeVarOpaque(val, max);
    },
    decode(r) {
      return r.readVarOpaque(max);
    },
  };
}

function assertOpaqueBound(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
    throw new Error(`${name} must be an integer between 0 and 4294967295, got ${value}`);
  }
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
