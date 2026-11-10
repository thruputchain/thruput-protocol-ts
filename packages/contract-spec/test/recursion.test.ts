import { describe, expect, it } from "vitest";
import {
  CxsReader, CxsWriter, XdrReader, XdrWriter,
} from "@thruputchain/xdr";
import { codec, ContractTypeKind, type ContractType } from "../src/index.js";

describe.each([
  ["XDR", XdrReader, XdrWriter],
  ["CXS", CxsReader, CxsWriter],
] as const)("%s generated recursive codecs", (_name, Reader, Writer) => {
  function options(levels: number): ContractType {
    let value: ContractType = { v: ContractTypeKind.U8 };
    for (let i = 1; i < levels; i++) {
      value = { v: ContractTypeKind.Option, option_inner: value };
    }
    return value;
  }

  it("bounds direct union recursion at 128 levels", () => {
    const writer = new Writer();
    codec.ContractType.encode(writer, options(128));
    expect(codec.ContractType.decode(new Reader(writer.finish()))).toEqual(options(128));
    expect(() => codec.ContractType.encode(new Writer(), options(129)))
      .toThrow("encode depth limit");

    // Write directly: the encoder should refuse to produce this input.
    const hostile = new Writer();
    for (let i = 0; i < 20_000; i++) hostile.writeInt32(BigInt(ContractTypeKind.Option));
    hostile.writeInt32(BigInt(ContractTypeKind.U8));
    expect(() => codec.ContractType.decode(new Reader(hostile.finish())))
      .toThrow("decode depth limit");
  });

  it("counts structs between recursive union values", () => {
    const value: ContractType = {
      v: ContractTypeKind.Array,
      array: { element: { v: ContractTypeKind.U8 }, len: 1n },
    };
    const writer = new Writer(undefined, { maxDepth: 3 });
    codec.ContractType.encode(writer, value);
    expect(codec.ContractType.decode(new Reader(writer.finish(), { maxDepth: 3 })))
      .toEqual(value);
    expect(() => codec.ContractType.decode(new Reader(writer.finish(), { maxDepth: 2 })))
      .toThrow("decode depth limit");
    expect(() => codec.ContractType.encode(new Writer(undefined, { maxDepth: 2 }), value))
      .toThrow("encode depth limit");
  });

  it("charges recursive union visits to the shared work budget", () => {
    const writer = new Writer();
    codec.ContractType.encode(writer, options(6));
    expect(() => codec.ContractType.decode(new Reader(writer.finish(), { maxWork: 5 })))
      .toThrow("work budget");
    expect(codec.ContractType.decode(new Reader(writer.finish(), { maxWork: 6 })))
      .toEqual(options(6));
  });
});
