# @groundhogchain/xdr

XDR/CXS serialization framework for the Groundhog blockchain. Provides
readers, writers, and codec combinators for standard XDR (RFC 4506) and the
compact CXS encoding used on the wire.

## Install

```sh
npm install @groundhogchain/xdr
```

Published to GitHub Packages; configure your `.npmrc` for the
`@groundhogchain` scope.

## Example

```ts
import { serialize, deserialize, VarOpaqueCodec } from "@groundhogchain/xdr";

const codec = VarOpaqueCodec(1024);
const bytes = serialize(new Uint8Array([1, 2, 3]), codec);
const decoded = deserialize(bytes, codec); // Uint8Array [1, 2, 3]
```

Most consumers use the generated codecs from `@groundhogchain/protocol`
rather than building codecs by hand.

## Documentation

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
