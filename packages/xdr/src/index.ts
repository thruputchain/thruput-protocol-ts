/**
 * XDR and CXS serialization primitives used by the Groundhog protocol packages.
 *
 * Use this package when you need direct access to readers, writers, codecs, or
 * serialization helpers. Most application code should prefer the higher-level
 * protocol and client packages.
 *
 * @module @groundhogchain/xdr
 */

export {
  XdrWriter,
} from "./xdr/writer.js";

export {
  XdrReader,
} from "./xdr/reader.js";

export {
  CxsWriter,
} from "./xdr/cxs_writer.js";

export {
  CxsReader,
} from "./xdr/cxs_reader.js";

export {
  MAX_PREALLOC_BYTES,
  VoidCodec,
  BoolCodec,
  Uint8Codec,
  Int32Codec,
  Uint32Codec,
  Int64Codec,
  Uint64Codec,
  Int128Codec,
  Uint128Codec,
  OptionCodec,
  VarArrayCodec,
  FixedArrayCodec,
  FixedOpaqueCodec,
  VarOpaqueCodec,
  serialize,
  deserialize,
  serializeCxs,
  deserializeCxs,
  resolve,
} from "./xdr/codec.js";

export type {
  IWriter,
  IReader,
  XdrCodec,
  LazyCodec,
  RpcMethodMeta,
  RpcProgramMeta,
} from "./xdr/codec.js";

export type {
  FixedBytes,
  FixedArray,
  VarBytes,
  VarArray,
  VarString,
} from "./xdr/length_types.js";
