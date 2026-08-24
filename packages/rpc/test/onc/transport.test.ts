/**
 * Unit tests for WebSocketTransport using a fake in-process WebSocket.
 *
 * Covers reply matching by xid, per-call timeouts, rejection of frames
 * too short to carry an xid, and pending-call rejection on close.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WebSocketTransport } from "../../src/onc/transport.js";

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];

  url: string;
  binaryType = "blob";
  sent: Uint8Array[] = [];
  closed = false;
  onopen: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  onmessage: ((event: { data: ArrayBuffer }) => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  send(data: Uint8Array): void {
    if (this.closed) throw new Error("fake socket closed");
    this.sent.push(data);
  }

  close(): void {
    this.closed = true;
    this.onclose?.();
  }

  /** Test helper: simulate the server opening the connection. */
  open(): void {
    this.onopen?.();
  }

  /** Test helper: simulate an incoming binary frame. */
  receive(bytes: Uint8Array): void {
    const buf = new ArrayBuffer(bytes.length);
    new Uint8Array(buf).set(bytes);
    this.onmessage?.({ data: buf });
  }
}

function request(xid: number): Uint8Array {
  const bytes = new Uint8Array(8);
  new DataView(bytes.buffer).setUint32(0, xid);
  return bytes;
}

function reply(xid: number, payload: number[] = []): Uint8Array {
  const bytes = new Uint8Array(4 + payload.length);
  new DataView(bytes.buffer).setUint32(0, xid);
  bytes.set(payload, 4);
  return bytes;
}

describe("WebSocketTransport", () => {
  beforeEach(() => {
    FakeWebSocket.instances = [];
    vi.stubGlobal("WebSocket", FakeWebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  function connect(options?: { timeoutMs?: number }) {
    const transport = new WebSocketTransport("ws://fake", options);
    const ws = FakeWebSocket.instances[0];
    ws.open();
    return { transport, ws };
  }

  /** Flush microtasks so call() gets past `await this.ready` and sends. */
  async function flushSend(ws: FakeWebSocket) {
    for (let i = 0; i < 10 && ws.sent.length === 0; i++) {
      await Promise.resolve();
    }
    expect(ws.sent.length).toBeGreaterThan(0);
  }

  it("resolves a call with the reply matching its xid", async () => {
    const { transport, ws } = connect();
    const pending = transport.call(request(7));
    await flushSend(ws);
    ws.receive(reply(99));       // unrelated xid: ignored
    ws.receive(reply(7, [1, 2]));
    const result = await pending;
    expect(result).toEqual(reply(7, [1, 2]));
    expect(ws.sent).toHaveLength(1);
  });

  it("ignores frames shorter than 4 bytes", async () => {
    const { transport, ws } = connect();
    const pending = transport.call(request(7));
    await flushSend(ws);
    ws.receive(new Uint8Array(0));
    ws.receive(new Uint8Array([0x00]));
    ws.receive(new Uint8Array([0x00, 0x00, 0x07]));
    ws.receive(reply(7));
    await expect(pending).resolves.toEqual(reply(7));
  });

  it("rejects a call after timeoutMs and clears the pending entry", async () => {
    vi.useFakeTimers();
    const { transport, ws } = connect({ timeoutMs: 100 });
    const pending = transport.call(request(7));
    const failure = expect(pending).rejects.toThrow(/timed out after 100ms/);
    await vi.advanceTimersByTimeAsync(101);
    await failure;
    // A late reply for the timed-out xid must be a no-op.
    expect(() => ws.receive(reply(7))).not.toThrow();
  });

  it("does not time out a call that gets a prompt reply", async () => {
    vi.useFakeTimers();
    const { transport, ws } = connect({ timeoutMs: 100 });
    const pending = transport.call(request(7));
    await vi.advanceTimersByTimeAsync(1);
    ws.receive(reply(7));
    await expect(pending).resolves.toEqual(reply(7));
    // Advancing past the timeout must not produce an unhandled rejection.
    await vi.advanceTimersByTimeAsync(200);
  });

  it("rejects pending calls when the socket closes", async () => {
    const { transport, ws } = connect();
    const pending = transport.call(request(7));
    const failure = expect(pending).rejects.toThrow(/WebSocket closed/);
    // Let the call() microtask register the pending entry before closing.
    await flushSend(ws);
    ws.close();
    await failure;
  });

  it("rejects the older call immediately when a newer call reuses its xid", async () => {
    const { transport, ws } = connect();
    const first = transport.call(request(7));
    await flushSend(ws);
    const firstFailure = expect(first).rejects.toThrow(/xid 7 reused by a newer call/);
    const second = transport.call(request(7));
    await firstFailure;
    ws.receive(reply(7, [3, 4]));
    await expect(second).resolves.toEqual(reply(7, [3, 4]));
  });

  it("does not let the older call's timeout deadline kill the newer call's reply on xid reuse", async () => {
    vi.useFakeTimers();
    const { transport, ws } = connect({ timeoutMs: 100 });
    const first = transport.call(request(7));
    const firstFailure = expect(first).rejects.toThrow(/xid 7 reused by a newer call/);
    await vi.advanceTimersByTimeAsync(50);
    const second = transport.call(request(7));
    await firstFailure;
    // Pass the first call's original 100ms deadline; the second call's
    // pending entry must survive and still receive its reply.
    await vi.advanceTimersByTimeAsync(60);
    ws.receive(reply(7, [9]));
    await expect(second).resolves.toEqual(reply(7, [9]));
    // Advancing further must not produce an unhandled rejection.
    await vi.advanceTimersByTimeAsync(200);
  });

  it("rejects when send throws", async () => {
    const { transport, ws } = connect();
    ws.closed = true; // make send() throw without firing onclose
    await expect(transport.call(request(7))).rejects.toThrow(/fake socket closed/);
  });
});
