# @thruputchain/contract-spec

Thruput contract specification AST types and XDR serialization. Models
contract interfaces, methods, type definitions, and events as data, so
tooling can read and emit contract specs.

## Install

```sh
npm install @thruputchain/contract-spec
```

Published to GitHub Packages; configure your `.npmrc` for the
`@thruputchain` scope.

## Example

```ts
import {
  serialize, deserialize, codec,
  contractSpecString, ContractTypeKind,
} from "@thruputchain/contract-spec";
import type { ContractSpec } from "@thruputchain/contract-spec";

const spec: ContractSpec = {
  interfaces: [{
    name: contractSpecString("Counter"),
    vers: contractSpecString("1.0.0"),
    throws: [],
    methods: [{
      name: contractSpecString("get"),
      args: [],
      return_type: { v: ContractTypeKind.U64 },
    }],
  }],
  type_defs: [],
  events: [],
};

const bytes = serialize(spec, codec.ContractSpec);
const decoded = deserialize(bytes, codec.ContractSpec);
```

## Documentation

See the [protocol-ts repository](https://github.com/groundhogchain/protocol-ts)
for the full monorepo docs, codegen workflow, and API reference.
