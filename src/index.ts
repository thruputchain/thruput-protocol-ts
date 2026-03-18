// XDR serialization layer
export { XdrWriter } from "./xdr/writer.js";
export { XdrReader } from "./xdr/reader.js";
export { serialize, deserialize } from "./xdr/codec.js";
export type { XdrCodec, IWriter, IReader } from "./xdr/codec.js";

// Protocol types + codecs (unified)
export * from "./protocol/index.js";
