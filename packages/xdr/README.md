# @thruputchain/xdr

XDR/CXS serialization framework for the Thruput blockchain. Provides
readers, writers, and codec combinators for standard XDR (RFC 4506) and the
compact CXS encoding used on the wire.

## Install

```sh
npm install @thruputchain/xdr
```

Published to GitHub Packages; configure your `.npmrc` for the
`@thruputchain` scope.

## Example

```ts
import { serialize, deserialize, VarOpaqueCodec } from "@thruputchain/xdr";

const codec = VarOpaqueCodec(1024);
const bytes = serialize(new Uint8Array([1, 2, 3]), codec);
const decoded = deserialize(bytes, codec); // Uint8Array [1, 2, 3]
```

Most consumers use the generated codecs from `@thruputchain/protocol`
rather than building codecs by hand.

## Documentation

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
