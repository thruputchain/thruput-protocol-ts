/**
 * Read outputs are caller-owned: bytes returned by readFixedOpaque and
 * readVarOpaque must not alias the reader's input buffer.
 */

import { describe, it, expect } from "vitest";
import { CxsReader } from "../../src/xdr/cxs_reader.js";
import { XdrReader } from "../../src/xdr/reader.js";

describe("CxsReader opaque ownership", () => {
  it("readFixedOpaque output survives input mutation", () => {
    const input = new Uint8Array([0xaa, 0xbb, 0xcc]);
    const result = new CxsReader(input).readFixedOpaque(3);
    input.fill(0);
    expect(result).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("mutating readFixedOpaque output leaves the input intact", () => {
    const input = new Uint8Array([0xaa, 0xbb, 0xcc]);
    new CxsReader(input).readFixedOpaque(3).fill(0);
    expect(input).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("readVarOpaque output survives input mutation", () => {
    const input = new Uint8Array([0x02, 0xde, 0xad]);
    const result = new CxsReader(input).readVarOpaque(100);
    input.fill(0);
    expect(result).toEqual(new Uint8Array([0xde, 0xad]));
  });

  it("readFixedOpaque copies even when the input is a Buffer", () => {
    const input = Buffer.from([0xaa, 0xbb, 0xcc]);
    const result = new CxsReader(input).readFixedOpaque(3);
    input.fill(0);
    expect(result).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("readVarOpaque copies even when the input is a Buffer", () => {
    const input = Buffer.from([0x02, 0xde, 0xad]);
    new CxsReader(input).readVarOpaque(100).fill(0);
    expect(input).toEqual(Buffer.from([0x02, 0xde, 0xad]));
  });
});

describe("XdrReader opaque ownership", () => {
  it("readFixedOpaque output survives input mutation", () => {
    const input = new Uint8Array([0xaa, 0xbb, 0xcc, 0x00]);
    const result = new XdrReader(input).readFixedOpaque(3);
    input.fill(0);
    expect(result).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("mutating readFixedOpaque output leaves the input intact", () => {
    const input = new Uint8Array([0xaa, 0xbb, 0xcc, 0x00]);
    new XdrReader(input).readFixedOpaque(3).fill(0);
    expect(input).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc, 0x00]));
  });

  it("readVarOpaque output survives input mutation", () => {
    const input = new Uint8Array([0, 0, 0, 2, 0xde, 0xad, 0, 0]);
    const result = new XdrReader(input).readVarOpaque(100);
    input.fill(0);
    expect(result).toEqual(new Uint8Array([0xde, 0xad]));
  });

  it("readFixedOpaque copies even when the input is a Buffer", () => {
    const input = Buffer.from([0xaa, 0xbb, 0xcc, 0x00]);
    const result = new XdrReader(input).readFixedOpaque(3);
    input.fill(0);
    expect(result).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("readVarOpaque copies even when the input is a Buffer", () => {
    const input = Buffer.from([0, 0, 0, 2, 0xde, 0xad, 0, 0]);
    new XdrReader(input).readVarOpaque(100).fill(0);
    expect(input).toEqual(Buffer.from([0, 0, 0, 2, 0xde, 0xad, 0, 0]));
  });
});
