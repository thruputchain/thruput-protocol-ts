/**
 * ONC-RPC transport abstraction.
 *
 * ONC-RPC (RFC 5531) sends XDR-encoded call/reply messages over a
 * reliable transport. The provided implementation is WebSocket-based
 * (browsers, Cloudflare Workers, Node.js).
 */

export interface RpcTransport {
  /** Send an ONC-RPC call and receive the reply bytes. */
  call(requestBytes: Uint8Array): Promise<Uint8Array>;
  /** Close the underlying transport and reject or discard pending calls. */
  close(): void;
}

/** Options for {@link WebSocketTransport}. */
export interface WebSocketTransportOptions {
  /**
   * Milliseconds to wait for a reply before rejecting a call and
   * discarding its pending entry. Defaults to 30000.
   */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * WebSocket-based ONC-RPC transport.
 *
 * Each call sends one WebSocket binary message and waits for one reply.
 * Suitable for browsers and Cloudflare Workers.
 */
export class WebSocketTransport implements RpcTransport {
  private ws: WebSocket;
  // Keyed by xid, so at most one call per xid can be in flight. If a
  // caller reuses an in-flight xid, the older call is rejected
  // immediately when the newer one is registered (see call()).
  private pending: Map<number, { resolve: (data: Uint8Array) => void; reject: (err: Error) => void }> = new Map();
  private ready: Promise<void>;
  private timeoutMs: number;

  /** Connect to an ONC-RPC WebSocket endpoint. */
  constructor(url: string, options: WebSocketTransportOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error(`WebSocket connection failed`));
    });

    this.ws.onmessage = (event) => {
      const data = new Uint8Array(event.data as ArrayBuffer);
      // The xid is the first 4 bytes of the ONC-RPC reply; drop frames
      // too short to carry one.
      if (data.byteLength < 4) return;
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const xid = view.getUint32(0);
      const pending = this.pending.get(xid);
      if (pending) {
        this.pending.delete(xid);
        pending.resolve(data);
      }
    };

    this.ws.onclose = () => {
      for (const [, pending] of this.pending) {
        pending.reject(new Error("WebSocket closed"));
      }
      this.pending.clear();
    };
  }

  /**
   * Send one encoded ONC-RPC call message and wait for the matching reply.
   *
   * Replies are matched to calls by xid, so each in-flight call needs a
   * unique xid. If a new call reuses the xid of a call still awaiting its
   * reply, the older call is rejected immediately rather than silently
   * orphaned — its reply could no longer be told apart from the newer
   * call's anyway.
   */
  async call(requestBytes: Uint8Array): Promise<Uint8Array> {
    await this.ready;
    // Extract xid from the request (first 4 bytes)
    const view = new DataView(requestBytes.buffer, requestBytes.byteOffset, requestBytes.byteLength);
    const xid = view.getUint32(0);

    return new Promise((resolve, reject) => {
      const superseded = this.pending.get(xid);
      if (superseded) {
        this.pending.delete(xid);
        superseded.reject(new Error(`ONC-RPC xid ${xid} reused by a newer call while still in flight`));
      }

      const entry = {
        resolve: (data: Uint8Array) => {
          clearTimeout(timer);
          resolve(data);
        },
        reject: (err: Error) => {
          clearTimeout(timer);
          reject(err);
        },
      };

      const timer = setTimeout(() => {
        // Delete only the entry this timeout owns: a newer call may have
        // reused the xid, and its live entry must keep receiving replies.
        if (this.pending.get(xid) === entry) {
          this.pending.delete(xid);
        }
        reject(new Error(`ONC-RPC call timed out after ${this.timeoutMs}ms (xid ${xid})`));
      }, this.timeoutMs);

      this.pending.set(xid, entry);

      try {
        this.ws.send(requestBytes);
      } catch (err) {
        clearTimeout(timer);
        if (this.pending.get(xid) === entry) {
          this.pending.delete(xid);
        }
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  /** Close the WebSocket connection. */
  close(): void {
    this.ws.close();
  }
}
