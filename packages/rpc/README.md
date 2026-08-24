# @groundhogchain/rpc

ONC-RPC (RFC 5531) client and generated RPC protocol definitions for
Groundhog services. Provides a WebSocket transport, a typed RPC client, and
the request/response types generated from the protocol XDR definitions.

## Install

```sh
npm install @groundhogchain/rpc
```

Published to GitHub Packages; configure your `.npmrc` for the
`@groundhogchain` scope.

## Example

```ts
import { WebSocketTransport, createRpcClient } from "@groundhogchain/rpc";

const transport = new WebSocketTransport("ws://localhost:11234");
const client = createRpcClient(transport, SomeServiceProgram);

const response = await client.call("someMethod", request);
transport.close();
```

`SomeServiceProgram` is one of the generated `RpcProgramMeta` values exported
by this package.

## Documentation

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
