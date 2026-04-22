/**
 * Generic ONC-RPC client.
 *
 * Given a transport and program metadata, provides typed method dispatch.
 */

import { serialize, deserialize } from "@groundhogchain/xdr";
import type { XdrCodec, RpcProgramMeta } from "@groundhogchain/xdr";
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
  constructor(
    private transport: RpcTransport,
    private program: RpcProgramMeta,
  ) {}

  async call<Req, Resp>(
    methodName: string,
    request: Req,
  ): Promise<Resp> {
    const method = this.program.methods[methodName];
    if (!method) {
      throw new Error(`Unknown RPC method: ${methodName}`);
    }

    const reqCodec = method.request as XdrCodec<Req>;
    const respCodec = method.response as XdrCodec<Resp>;

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

  close(): void {
    this.transport.close();
  }
}

export function createRpcClient(transport: RpcTransport, program: RpcProgramMeta): RpcClient {
  return new RpcClient(transport, program);
}
