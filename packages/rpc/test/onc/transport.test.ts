/**
 * Unit tests for WebSocketTransport using a fake in-process WebSocket.
 *
 * Covers reply matching by xid, rejection of frames too short to carry
 * an xid, and pending-call rejection on close.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WebSocketTransport } from "../../src/onc/transport.js";

class FakeWebSocket {
  static OPEN = 1;
  static instances: FakeWebSocket[] = [];

  url: string;
  binaryType = "blob";
  sent: Uint8Array[] = [];
  closed = false;
  readyState = 0;
  onopen: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  onmessage: ((event: { data: ArrayBuffer }) => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  send(data: Uint8Array): void {
    // Native WebSocket silently discards sends after closing starts.
    if (this.readyState !== FakeWebSocket.OPEN) return;
    this.sent.push(data);
  }

  close(): void {
    this.closed = true;
    this.readyState = 3;
    this.onclose?.();
  }

  /** Test helper: simulate the server opening the connection. */
  open(): void {
    this.readyState = FakeWebSocket.OPEN;
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
  });

  function connect() {
    const transport = new WebSocketTransport("ws://fake");
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

  it("rejects pending calls when the socket closes", async () => {
    const { transport, ws } = connect();
    const pending = transport.call(request(7));
    const failure = expect(pending).rejects.toThrow(/WebSocket closed/);
    // Let the call() microtask register the pending entry before closing.
    await flushSend(ws);
    ws.close();
    await failure;
  });

  it("rejects a call made after the socket closes", async () => {
    const { transport, ws } = connect();
    ws.close();
    await expect(transport.call(request(7))).rejects.toThrow("WebSocket closed");
    expect(ws.sent).toHaveLength(0);
  });

  it("rejects calls while the close event is still pending", async () => {
    const { transport, ws } = connect();
    ws.readyState = 2;
    await expect(transport.call(request(7))).rejects.toThrow("WebSocket is not open");
    expect(ws.sent).toHaveLength(0);
  });

  it.each(["close", "error"])("settles calls waiting for open on %s", async (event) => {
    const transport = new WebSocketTransport("ws://fake");
    const ws = FakeWebSocket.instances[0];
    const pending = transport.call(request(7));
    const failure = expect(pending).rejects.toThrow(/WebSocket/);
    if (event === "close") transport.close();
    else ws.onerror?.(new Error("connection failed"));
    await failure;
    await expect(transport.call(request(8))).rejects.toThrow(/WebSocket/);
    expect(ws.sent).toHaveLength(0);
  });

  it("rejects all in-flight calls on a connection error", async () => {
    const { transport, ws } = connect();
    const failures = [7, 8].map((xid) =>
      expect(transport.call(request(xid))).rejects.toThrow("WebSocket connection failed"),
    );
    await flushSend(ws);
    ws.onerror?.(new Error("connection failed"));
    await Promise.all(failures);
  });

  it("removes requests whose send throws", async () => {
    const { transport, ws } = connect();
    vi.spyOn(ws, "send").mockImplementationOnce(() => { throw new Error("send failed"); });
    await expect(transport.call(request(7))).rejects.toThrow("send failed");
    // The failed send must not retain a pending request or consume a later reply.
    expect((transport as unknown as { pending: Map<number, unknown> }).pending.size).toBe(0);
    const next = transport.call(request(7));
    await flushSend(ws);
    ws.receive(reply(7));
    await expect(next).resolves.toEqual(reply(7));
  });
});
