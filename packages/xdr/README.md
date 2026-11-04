# @thruputchain/xdr

XDR/CXS serialization framework for the Thruput blockchain. Provides
readers, writers, and codec combinators for standard XDR (RFC 4506) and the
compact CXS encoding used on the wire.

## Install

```sh
npm install @thruputchain/xdr
```

Public npm installs need no authentication. Remove any GitHub Packages registry
override for the `@thruputchain` scope when using npm releases.

## Example

```ts
import { serialize, deserialize, VarOpaqueCodec } from "@thruputchain/xdr";

const codec = VarOpaqueCodec(1024);
const bytes = serialize(new Uint8Array([1, 2, 3]), codec);
const decoded = deserialize(bytes, codec); // Uint8Array [1, 2, 3]
```

Most consumers use the generated codecs from `@thruputchain/protocol`
rather than building codecs by hand.

## Codec limits

XDR and CXS readers own a shared depth and work budget. Writers share the same
depth limit. Defaults are 128 nested value levels and at most
`1024 + 16 * inputBytes` decoded value visits per reader. Callers can set a
smaller work limit for application-specific input policies.
Options and arrays apply these checks automatically. Arrays check their length
against the remaining work before allocating. Zero-width elements still count;
an opaque byte buffer counts as one value.

The updated x23c generator wraps structs and unions with `withCodecBudget`.
Regenerate older bindings to apply these checks to direct recursive calls.
Wrap custom structs, unions, tuples, and recursive codecs with the same helper.
Reuse that codec for aliases. Primitive reader calls do not track value nesting.
Transparent adapters that
forward to a bounded codec should spread it (`{ ...codec, ... }`) to preserve
its budget marker and avoid counting the same value twice.

The serialization helpers accept a third argument with explicit limits:

```ts
const decoded = deserialize(bytes, codec, { maxDepth: 128, maxWork: 200_000 });
```

Reader constructors accept limits as their second argument. Writer constructors
accept them after the initial capacity. Custom `IReader` and `IWriter`
implementations must provide a `DecodeBudget` or `EncodeBudget` instance in
their `budget` property. A budget belongs to one stream, not one codec.

## Documentation

See the [Thruput TypeScript protocol repository](https://github.com/thruputchain/thruput-protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
