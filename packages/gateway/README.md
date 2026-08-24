# @groundhogchain/gateway

Gateway and indexer protocol types for Groundhog services: transaction and
event lookup records, query/filter types, and pagination primitives, with
XDR codecs generated from the protocol definitions.

## Install

```sh
npm install @groundhogchain/gateway
```

Published to GitHub Packages; configure your `.npmrc` for the
`@groundhogchain` scope.

## Example

```ts
import {
  serialize, deserialize, codec,
  eventFilterList, paginationCursor, blockHeight,
  IterationOrder, BlockAnchorKind,
} from "@groundhogchain/gateway";
import type { EventQuery } from "@groundhogchain/gateway";

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

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
