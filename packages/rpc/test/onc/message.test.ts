/**
 * ONC-RPC message encoding/decoding tests.
 *
 * Tests buildCallMessage and parseReplyMessage against the RFC 5531 wire format.
 */
import { describe, it, expect } from "vitest";
import { XdrWriter, XdrReader } from "@groundhogchain/xdr";
import { buildCallMessage, parseReplyMessage } from "../../src/onc/message.js";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

describe("buildCallMessage", () => {
  it("produces valid ONC-RPC call envelope", () => {
    const body = new Uint8Array([0xDE, 0xAD]);
    const msg = buildCallMessage(0x8aa87aa7, 1, 10, body);
    const r = new XdrReader(msg);

    const xid = Number(r.readUint32());
    expect(xid).toBeGreaterThan(0);

    expect(Number(r.readInt32())).toBe(0);    // MSG_CALL
    expect(Number(r.readUint32())).toBe(2);   // rpc_version
    expect(Number(r.readUint32())).toBe(0x8aa87aa7); // program
    expect(Number(r.readUint32())).toBe(1);   // version
    expect(Number(r.readUint32())).toBe(10);  // procedure

    // auth_cred: AUTH_NONE
    expect(Number(r.readInt32())).toBe(0);    // flavor
    expect(Number(r.readUint32())).toBe(0);   // length

    // auth_verf: AUTH_NONE
    expect(Number(r.readInt32())).toBe(0);    // flavor
    expect(Number(r.readUint32())).toBe(0);   // length

    // body (padded to 4 bytes)
    const bodyBytes = r.readFixedOpaque(2);
    expect(bodyBytes).toEqual(new Uint8Array([0xDE, 0xAD]));
  });

  it("increments xid on each call", () => {
    const msg1 = buildCallMessage(1, 1, 0, new Uint8Array(0));
    const msg2 = buildCallMessage(1, 1, 0, new Uint8Array(0));
    const r1 = new XdrReader(msg1);
    const r2 = new XdrReader(msg2);
    const xid1 = Number(r1.readUint32());
    const xid2 = Number(r2.readUint32());
    expect(xid2).toBe(xid1 + 1);
  });

  it("handles empty body", () => {
    const msg = buildCallMessage(1, 1, 0, new Uint8Array(0));
    // 10 uint32 fields (xid, msg_type, rpc_ver, prog, ver, proc, cred_flavor, cred_len, verf_flavor, verf_len)
    // = 40 bytes + 0 body
    expect(msg.length).toBe(40);
  });
});

describe("parseReplyMessage", () => {
  // Build a valid accepted reply with SUCCESS
  function buildReply(xid: number, body: Uint8Array): Uint8Array {
    const w = new XdrWriter();
    w.writeUint32(BigInt(xid));
    w.writeInt32(1n);  // MSG_REPLY
    w.writeInt32(0n);  // MSG_ACCEPTED
    // auth_verf: AUTH_NONE
    w.writeInt32(0n);  // flavor
    w.writeUint32(0n); // length
    // accept_stat: SUCCESS
    w.writeInt32(0n);
    // body
    w.writeFixedOpaque(body, body.length);
    return w.finish();
  }

  it("parses a valid accepted reply", () => {
    const reply = buildReply(42, new Uint8Array([1, 2, 3, 4]));
    const { xid, body } = parseReplyMessage(reply);
    expect(xid).toBe(42);
    expect(body.length).toBeGreaterThanOrEqual(4);
    // body starts with our bytes
    expect(body[0]).toBe(1);
    expect(body[1]).toBe(2);
  });

  it("parses a reply with empty body", () => {
    const reply = buildReply(1, new Uint8Array(0));
    const { xid, body } = parseReplyMessage(reply);
    expect(xid).toBe(1);
    expect(body.length).toBe(0);
  });

  it("throws on non-reply message type", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);   // xid
    w.writeInt32(0n);     // MSG_CALL (not REPLY)
    expect(() => parseReplyMessage(w.finish())).toThrow(/Expected ONC-RPC reply/);
  });

  it("throws on rejected reply", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);   // xid
    w.writeInt32(1n);     // MSG_REPLY
    w.writeInt32(1n);     // reply_stat = MSG_DENIED
    expect(() => parseReplyMessage(w.finish())).toThrow(/rejected/);
  });

  it("throws on PROG_UNAVAIL", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);   // xid
    w.writeInt32(1n);     // MSG_REPLY
    w.writeInt32(0n);     // MSG_ACCEPTED
    w.writeInt32(0n);     // verf flavor
    w.writeUint32(0n);   // verf length
    w.writeInt32(1n);     // accept_stat = PROG_UNAVAIL
    expect(() => parseReplyMessage(w.finish())).toThrow(/PROG_UNAVAIL/);
  });

  it("throws on PROC_UNAVAIL", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);
    w.writeInt32(1n);
    w.writeInt32(0n);
    w.writeInt32(0n);
    w.writeUint32(0n);
    w.writeInt32(3n);     // PROC_UNAVAIL
    expect(() => parseReplyMessage(w.finish())).toThrow(/PROC_UNAVAIL/);
  });

  it("throws on GARBAGE_ARGS", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);
    w.writeInt32(1n);
    w.writeInt32(0n);
    w.writeInt32(0n);
    w.writeUint32(0n);
    w.writeInt32(4n);     // GARBAGE_ARGS
    expect(() => parseReplyMessage(w.finish())).toThrow(/GARBAGE_ARGS/);
  });

  it("throws on unknown accept_stat with numeric fallback", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);
    w.writeInt32(1n);
    w.writeInt32(0n);
    w.writeInt32(0n);
    w.writeUint32(0n);
    w.writeInt32(99n);
    expect(() => parseReplyMessage(w.finish())).toThrow(/accept_stat=99/);
  });
});

describe("buildCallMessage + parseReplyMessage round-trip", () => {
  it("call xid matches reply xid", () => {
    const callMsg = buildCallMessage(0x12345678, 1, 5, new Uint8Array([0xAB]));
    const callXid = Number(new XdrReader(callMsg).readUint32());

    // Simulate server: parse call, build reply with same xid
    const w = new XdrWriter();
    w.writeUint32(BigInt(callXid));
    w.writeInt32(1n);  // MSG_REPLY
    w.writeInt32(0n);  // ACCEPTED
    w.writeInt32(0n);  // verf flavor
    w.writeUint32(0n); // verf length
    w.writeInt32(0n);  // SUCCESS
    w.writeUint32(42n); // response body: uint32 = 42

    const { xid, body } = parseReplyMessage(w.finish());
    expect(xid).toBe(callXid);
    const r = new XdrReader(body);
    expect(Number(r.readUint32())).toBe(42);
  });
});
