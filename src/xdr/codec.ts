// Interfaces for XDR-like serialization formats.
// XdrWriter/XdrReader implement these for standard XDR (RFC 4506).
// A future CxsWriter/CxsReader would implement them for compressed XDR.

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

// Standard XDR serialization — uses XdrWriter/XdrReader
import { XdrWriter } from "./writer.js";
import { XdrReader } from "./reader.js";

export function serialize<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new XdrWriter();
  codec.encode(w, val);
  return w.finish();
}

export function deserialize<T>(data: Uint8Array, codec: XdrCodec<T>): T {
  const r = new XdrReader(data);
  return codec.decode(r);
}
