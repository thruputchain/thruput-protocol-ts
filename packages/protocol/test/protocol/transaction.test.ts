import { describe, it, expect } from "vitest";
import {
  calldata, Calldata,
  returnBuffer, ReturnBuffer,
  kMaxReturnBufferLen,
  InvocationFrameStatusCode,
  InvokeFlag,
  AuthClaimType,
  kMaxSigners,
  kMaxAuthClaims,
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
    expect(InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn).toBe(0);
    expect(InvocationFrameStatusCode.kInvocationFrameStatusCodeFault).toBe(1);
    expect(InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort).toBe(2);
  });

  it("InvokeFlag", () => {
    expect(InvokeFlag.kInvokeFlagNone).toBe(0);
    expect(InvokeFlag.kInvokeFlagTryInvoke).toBe(0x00000001);
    expect(InvokeFlag.kInvokeFlagReadOnly).toBe(0x00000002);
    expect(InvokeFlag.kInvokeFlagDelegateCall).toBe(0x00000004);
  });
});

describe("auth_claim enums", () => {
  it("AuthClaimType", () => {
    expect(AuthClaimType.kInvokedAddressSignature).toBe(0);
    expect(AuthClaimType.kPubkeySignature).toBe(4);
  });
});

describe("constants", () => {
  it("kMaxReturnBufferLen", () => {
    expect(kMaxReturnBufferLen).toBe(1024n);
  });
  it("kMaxSigners", () => {
    expect(kMaxSigners).toBe(21n);
  });
  it("kMaxAuthClaims", () => {
    expect(kMaxAuthClaims).toBe(10n);
  });
  it("kQueueEntryMaxLen", () => {
    expect(kQueueEntryMaxLen).toBe(256n);
  });
});
