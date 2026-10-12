/**
 * Generic ONC-RPC client.
 *
 * Given a transport and program metadata, provides typed method dispatch.
 */

import { serialize, deserialize, resolve } from "@thruputchain/xdr";
import type { XdrCodec, RpcProgramMeta } from "@thruputchain/xdr";
import type { RpcTransport } from "./transport.js";
import { buildCallMessage, parseReplyMessage } from "./message.js";

/**
 * Create an ONC-RPC client for a given program.
 *
 * Usage:
 * ```typescript
 * const client = createRpcClient(transport, WalletProgram);
 * const ack = await client.call("wallet_submit", request);
 * ```
 */
export class RpcClient {
  /** Create a client for one generated RPC program over a transport. */
  constructor(
    private transport: RpcTransport,
    private program: RpcProgramMeta,
  ) {}

  /**
   * Call a generated RPC method by name.
   *
   * The request and response bodies are encoded and decoded with the method
   * codecs from the supplied `RpcProgramMeta`.
   */
  async call<Req, Resp>(
    methodName: string,
    request: Req,
  ): Promise<Resp> {
    const method = this.program.methods[methodName];
    if (!method) {
      throw new Error(`Unknown RPC method: ${methodName}`);
    }

    const reqCodec = resolve(method.request) as XdrCodec<Req>;
    const respCodec = resolve(method.response) as XdrCodec<Resp>;

    const requestBody = serialize(request, reqCodec);
    const callMsg = buildCallMessage(
      this.program.programId,
      this.program.version,
      method.proc,
      requestBody,
    );

    const replyMsg = await this.transport.call(callMsg);
    const { body } = parseReplyMessage(replyMsg);
    return deserialize(body, respCodec);
  }

  /** Close the underlying transport. */
  close(): void {
    this.transport.close();
  }
}

/** Create an ONC-RPC client for a generated program metadata object. */
export function createRpcClient(transport: RpcTransport, program: RpcProgramMeta): RpcClient {
  return new RpcClient(transport, program);
}
