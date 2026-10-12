# @thruputchain/protocol

Core Thruput protocol types and XDR codecs, generated from the canonical
XDR definitions in the protocol repository. Includes transactions,
invocations, events, and the merged `codec` namespace, plus utility helpers
under `@thruputchain/protocol/utils`.

## Install

```sh
npm install @thruputchain/protocol
```

Published to GitHub Packages; configure your `.npmrc` for the
`@thruputchain` scope.

## Example

```ts
import {
  serialize, deserialize, codec,
  contractAddress, contractEntrypointID, gasAmount, calldata,
} from "@thruputchain/protocol";

const invocation = {
  invoked_address: contractAddress(new Uint8Array(32)),
  entrypoint: contractEntrypointID(new Uint8Array(8)),
  gas_limit: gasAmount(1_000_000n),
  calldata: calldata(new Uint8Array([0xde, 0xad])),
};

const bytes = serialize(invocation, codec.Invocation);
const decoded = deserialize(bytes, codec.Invocation);
```

Application code should usually prefer the higher-level
`@thruputchain/client`; this package is the low-level typed protocol
surface.

## Documentation

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
