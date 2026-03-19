/**
 * ONC-RPC transport abstraction.
 *
 * ONC-RPC (RFC 5531) sends XDR-encoded call/reply messages over a
 * reliable transport. We support:
 * - WebSocket (browsers, Cloudflare Workers)
 * - TCP (Node.js, via record marking per RFC 5531 §11)
 */

export interface RpcTransport {
  /** Send an ONC-RPC call and receive the reply bytes. */
  call(requestBytes: Uint8Array): Promise<Uint8Array>;
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

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(new Error(`WebSocket connection failed`));
    });

    this.ws.onmessage = (event) => {
      const data = new Uint8Array(event.data as ArrayBuffer);
      // The xid is the first 4 bytes of the ONC-RPC reply
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

  async call(requestBytes: Uint8Array): Promise<Uint8Array> {
    await this.ready;
    // Extract xid from the request (first 4 bytes)
    const view = new DataView(requestBytes.buffer, requestBytes.byteOffset, requestBytes.byteLength);
    const xid = view.getUint32(0);

    return new Promise((resolve, reject) => {
      this.pending.set(xid, { resolve, reject });
      this.ws.send(requestBytes);
    });
  }

  close(): void {
    this.ws.close();
  }
}
