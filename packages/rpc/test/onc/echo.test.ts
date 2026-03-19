/**
 * End-to-end ONC-RPC test using the echo service defined in echo.x.
 *
 * Simulates a server by wiring buildCallMessage → parseReplyMessage
 * in-process, verifying the full codec → RPC → codec pipeline.
 */
import { describe, it, expect } from "vitest";
import { serialize, deserialize, XdrWriter, XdrReader } from "@groundhog/xdr";
import type { XdrCodec, RpcProgramMeta } from "@groundhog/xdr";
import { buildCallMessage, parseReplyMessage } from "../../src/onc/message.js";
import { RpcClient, createRpcClient } from "../../src/onc/client.js";
import type { RpcTransport } from "../../src/onc/transport.js";
import {
  EchoServiceProgram, codec,
  type EchoRequest, type EchoResponse,
  type AddRequest, type AddResponse,
} from "../fixtures/echo.js";

/**
 * In-process mock transport that acts as a simple echo/add server.
 * Parses the ONC-RPC call, dispatches to the handler, builds a reply.
 */
class MockEchoTransport implements RpcTransport {
  async call(requestBytes: Uint8Array): Promise<Uint8Array> {
    const r = new XdrReader(requestBytes);
    const xid = Number(r.readUint32());
    r.readInt32();   // msg_type
    r.readUint32();  // rpc_version
    r.readUint32();  // program
    r.readUint32();  // version
    const proc = Number(r.readUint32());
    // Skip auth cred + verf (4 fields)
    r.readInt32(); r.readUint32(); r.readInt32(); r.readUint32();
    // Remaining is the request body
    const body = requestBytes.subarray(r.position);

    let responseBody: Uint8Array;

    switch (proc) {
      case 0: {
        // echo_null: void → void
        responseBody = new Uint8Array(0);
        break;
      }
      case 1: {
        // echo_echo: EchoRequest → EchoResponse (echo back the same values)
        const req = deserialize(body, codec.EchoRequest);
        responseBody = serialize({ value: req.value, message: req.message } as EchoResponse, codec.EchoResponse);
        break;
      }
      case 2: {
        // echo_add: AddRequest → AddResponse
        const req = deserialize(body, codec.AddRequest);
        responseBody = serialize({ result: req.a + req.b } as AddResponse, codec.AddResponse);
        break;
      }
      default:
        throw new Error(`Unknown procedure: ${proc}`);
    }

    // Build accepted reply
    const w = new XdrWriter();
    w.writeUint32(BigInt(xid));
    w.writeInt32(1n);  // MSG_REPLY
    w.writeInt32(0n);  // MSG_ACCEPTED
    w.writeInt32(0n);  // verf flavor
    w.writeUint32(0n); // verf length
    w.writeInt32(0n);  // SUCCESS
    w.writeFixedOpaque(responseBody, responseBody.length);
    return w.finish();
  }

  close(): void {}
}

describe("echo RPC end-to-end", () => {
  const transport = new MockEchoTransport();
  const client = createRpcClient(transport, EchoServiceProgram);

  it("echo_null: void round-trip", async () => {
    const result = await client.call("echo_null", undefined);
    expect(result).toBeUndefined();
  });

  it("echo_echo: echoes request back", async () => {
    const result = await client.call<EchoRequest, EchoResponse>("echo_echo", {
      value: 42n,
      message: "hello groundhog",
    });
    expect(result.value).toBe(42n);
    expect(result.message).toBe("hello groundhog");
  });

  it("echo_echo: empty string", async () => {
    const result = await client.call<EchoRequest, EchoResponse>("echo_echo", {
      value: 0n,
      message: "",
    });
    expect(result.value).toBe(0n);
    expect(result.message).toBe("");
  });

  it("echo_echo: max uint32 value", async () => {
    const result = await client.call<EchoRequest, EchoResponse>("echo_echo", {
      value: 0xFFFFFFFFn,
      message: "big",
    });
    expect(result.value).toBe(0xFFFFFFFFn);
  });

  it("echo_add: 2 + 3 = 5", async () => {
    const result = await client.call<AddRequest, AddResponse>("echo_add", {
      a: 2n,
      b: 3n,
    });
    expect(result.result).toBe(5n);
  });

  it("echo_add: 0 + 0 = 0", async () => {
    const result = await client.call<AddRequest, AddResponse>("echo_add", {
      a: 0n,
      b: 0n,
    });
    expect(result.result).toBe(0n);
  });

  it("echo_add: large values", async () => {
    const result = await client.call<AddRequest, AddResponse>("echo_add", {
      a: 1000000n,
      b: 2000000n,
    });
    expect(result.result).toBe(3000000n);
  });

  it("unknown method throws", async () => {
    await expect(client.call("nonexistent", {})).rejects.toThrow(/Unknown RPC method/);
  });
});

describe("echo codec round-trips", () => {
  it("EchoRequest round-trips through XDR", () => {
    const req: EchoRequest = { value: 99n, message: "test" };
    expect(deserialize(serialize(req, codec.EchoRequest), codec.EchoRequest)).toEqual(req);
  });

  it("AddRequest round-trips through XDR", () => {
    const req: AddRequest = { a: 10n, b: 20n };
    expect(deserialize(serialize(req, codec.AddRequest), codec.AddRequest)).toEqual(req);
  });

  it("EchoServiceProgram metadata is correct", () => {
    expect(EchoServiceProgram.programId).toBe(0xECEC0001);
    expect(EchoServiceProgram.version).toBe(1);
    expect(Object.keys(EchoServiceProgram.methods)).toEqual(["echo_null", "echo_echo", "echo_add"]);
    expect(EchoServiceProgram.methods.echo_null.proc).toBe(0);
    expect(EchoServiceProgram.methods.echo_echo.proc).toBe(1);
    expect(EchoServiceProgram.methods.echo_add.proc).toBe(2);
  });
});
