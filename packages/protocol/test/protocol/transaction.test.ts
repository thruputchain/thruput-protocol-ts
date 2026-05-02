import { describe, it, expect } from "vitest";
import {
  calldata, Calldata,
  returnBuffer, ReturnBuffer,
  kMaxReturnBufferLen,
  InvocationFrameStatusCode,
  InvokeFlag,
  AuthClaimType,
  kMaxSigners,
  kQueueEntryMaxLen,
  queueEntry, QueueEntry,
} from "../../src/protocol/index.js";

describe("transaction branded types", () => {
  it("calldata accepts any length (unbounded)", () => {
    const data = new Uint8Array(500);
    const c: Calldata = calldata(data);
    expect(c).toBe(data);
  });

  it("returnBuffer accepts up to kMaxReturnBufferLen", () => {
    const data = new Uint8Array(1024);
    const rb: ReturnBuffer = returnBuffer(data);
    expect(rb).toBe(data);
  });

  it("returnBuffer rejects over max", () => {
    expect(() => returnBuffer(new Uint8Array(1025))).toThrow();
  });

  it("queueEntry accepts up to kQueueEntryMaxLen", () => {
    const data = new Uint8Array(256);
    const qe: QueueEntry = queueEntry(data);
    expect(qe).toBe(data);
  });

  it("queueEntry rejects over max", () => {
    expect(() => queueEntry(new Uint8Array(257))).toThrow();
  });
});

describe("transaction enums", () => {
  it("InvocationFrameStatusCode", () => {
    expect(InvocationFrameStatusCode.Return).toBe(0);
    expect(InvocationFrameStatusCode.Fault).toBe(1);
    expect(InvocationFrameStatusCode.Abort).toBe(2);
  });

  it("InvokeFlag", () => {
    expect(InvokeFlag.None).toBe(0);
    expect(InvokeFlag.TryInvoke).toBe(0x00000001);
    expect(InvokeFlag.ReadOnly).toBe(0x00000002);
    expect(InvokeFlag.DelegateCall).toBe(0x00000004);
  });
});

describe("auth_claim enums", () => {
  it("AuthClaimType", () => {
    expect(AuthClaimType.kSourceAddressAuthData).toBe(0);
    expect(AuthClaimType.kPubkeySignature).toBe(1);
  });
});

describe("constants", () => {
  it("kMaxReturnBufferLen", () => {
    expect(kMaxReturnBufferLen).toBe(1024n);
  });
  it("kMaxSigners", () => {
    expect(kMaxSigners).toBe(21n);
  });
  it("kQueueEntryMaxLen", () => {
    expect(kQueueEntryMaxLen).toBe(256n);
  });
});
