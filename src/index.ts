// XDR serialization layer
export { XdrWriter } from "./xdr/writer.js";
export { XdrReader } from "./xdr/reader.js";
export { serialize, deserialize } from "./xdr/codec.js";
export type { XdrCodec } from "./xdr/codec.js";

// Protocol types
export * from "./protocol/index.js";

// Codecs namespace
export * as xdr from "./protocol/codecs/index.js";
