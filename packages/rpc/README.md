# @thruputchain/rpc

ONC-RPC (RFC 5531) client and generated RPC protocol definitions for
Thruput services. Provides a WebSocket transport, a typed RPC client, and
the request/response types generated from the protocol XDR definitions.

## Install

```sh
npm install @thruputchain/rpc
```

Public npm installs need no authentication. Remove any GitHub Packages registry
override for the `@thruputchain` scope when using npm releases.

## Example

```ts
import { WebSocketTransport, createRpcClient } from "@thruputchain/rpc";

const transport = new WebSocketTransport("ws://localhost:11234");
const client = createRpcClient(transport, SomeServiceProgram);

const response = await client.call("someMethod", request);
transport.close();
```

`SomeServiceProgram` is one of the generated `RpcProgramMeta` values exported
by this package.

## Documentation

See the [Thruput TypeScript protocol repository](https://github.com/thruputchain/thruput-protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
