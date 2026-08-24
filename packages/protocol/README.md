# @groundhogchain/protocol

Core Groundhog protocol types and XDR codecs, generated from the canonical
XDR definitions in the protocol repository. Includes transactions,
invocations, events, and the merged `codec` namespace, plus utility helpers
under `@groundhogchain/protocol/utils`.

## Install

```sh
npm install @groundhogchain/protocol
```

Published to GitHub Packages; configure your `.npmrc` for the
`@groundhogchain` scope.

## Example

```ts
import {
  serialize, deserialize, codec,
  contractAddress, contractEntrypointID, gasAmount, calldata,
} from "@groundhogchain/protocol";

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
`@groundhogchain/client`; this package is the low-level typed protocol
surface.

## Documentation

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
