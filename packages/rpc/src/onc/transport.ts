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

/**
 * WebSocket-based ONC-RPC transport.
 *
 * Each call sends one WebSocket binary message and waits for one reply.
 * Suitable for browsers and Cloudflare Workers.
 */
export class WebSocketTransport implements RpcTransport {
  private ws: WebSocket;
  private pending: Map<number, { resolve: (data: Uint8Array) => void; reject: (err: Error) => void }> = new Map();
  private ready: Promise<void>;
  private failure?: Error;

  /** Connect to an ONC-RPC WebSocket endpoint. */
  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";

    this.ready = new Promise((resolve) => {
      const fail = (error: Error) => {
        this.failure ??= error;
        // Wake callers still waiting for open. They reject with failure below.
        resolve();
        for (const pending of this.pending.values()) {
          pending.reject(this.failure);
        }
        this.pending.clear();
      };
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => fail(new Error("WebSocket connection failed"));
      this.ws.onclose = () => fail(new Error("WebSocket closed"));
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
  }

  /** Send one encoded ONC-RPC call message and wait for the matching reply. */
  async call(requestBytes: Uint8Array): Promise<Uint8Array> {
    await this.ready;
    if (this.failure) throw this.failure;
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not open");
    }
    // Extract xid from the request (first 4 bytes)
    const view = new DataView(requestBytes.buffer, requestBytes.byteOffset, requestBytes.byteLength);
    const xid = view.getUint32(0);

    return new Promise((resolve, reject) => {
      this.pending.set(xid, { resolve, reject });
      try {
        this.ws.send(requestBytes);
      } catch (error) {
        this.pending.delete(xid);
        reject(error);
      }
    });
  }

  /** Close the WebSocket connection. */
  close(): void {
    this.ws.close();
  }
}
