# @thruputchain/gateway

Gateway and indexer protocol types for Thruput services: transaction and
event lookup records, query/filter types, and pagination primitives, with
XDR codecs generated from the protocol definitions.

## Install

```sh
npm install @thruputchain/gateway
```

Published to GitHub Packages; configure your `.npmrc` for the
`@thruputchain` scope.

## Example

```ts
import {
  serialize, deserialize, codec,
  eventFilterList, paginationCursor, blockHeight,
  IterationOrder, BlockAnchorKind,
} from "@thruputchain/gateway";
import type { EventQuery } from "@thruputchain/gateway";

const query: EventQuery = {
  filters: eventFilterList([]),
  order: IterationOrder.IterationOrderAscending,
  anchor: { kind: BlockAnchorKind.AnchorAtHeight, height: blockHeight(100n) },
  cursor: paginationCursor(new Uint8Array(0)),
  limit: 50n,
};

const bytes = serialize(query, codec.EventQuery);
const decoded = deserialize(bytes, codec.EventQuery);
```

## Documentation

See the [Thruput TypeScript protocol repository](https://github.com/thruputchain/thruput-protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
