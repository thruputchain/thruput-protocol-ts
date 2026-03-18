import { XdrWriter } from "./writer.js";
import { XdrReader } from "./reader.js";

export interface XdrCodec<T> {
  encode(w: XdrWriter, val: T): void;
  decode(r: XdrReader): T;
}

export function serialize<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new XdrWriter();
  codec.encode(w, val);
  return w.finish();
}

export function deserialize<T>(data: Uint8Array, codec: XdrCodec<T>): T {
  const r = new XdrReader(data);
  return codec.decode(r);
}
