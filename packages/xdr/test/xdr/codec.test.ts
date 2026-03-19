import { describe, it, expect } from "vitest";
import { XdrCodec, serialize, deserialize } from "../../src/xdr/codec.js";
import { XdrWriter } from "../../src/xdr/writer.js";
import { XdrReader } from "../../src/xdr/reader.js";

const Uint32Codec: XdrCodec<bigint> = {
  encode(w: XdrWriter, val: bigint) { w.writeUint32(val); },
  decode(r: XdrReader) { return r.readUint32(); },
};

describe("serialize / deserialize", () => {
  it("round-trips uint32", () => {
    const bytes = serialize(42n, Uint32Codec);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 42]));
    const decoded = deserialize(bytes, Uint32Codec);
    expect(decoded).toBe(42n);
  });
});
