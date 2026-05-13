# protocol-ts

TypeScript bindings for the Groundhog blockchain protocol. This is a private npm
monorepo that publishes five `@groundhogchain/*` packages, generated from the
XDR definitions in the [`protocol/`](./protocol) submodule.

## Packages

| Package | Description | Depends on |
|---|---|---|
| [`@groundhogchain/xdr`](./packages/xdr) | XDR/CXS serialization framework | — |
| [`@groundhogchain/protocol`](./packages/protocol) | Core protocol types | `xdr` |
| [`@groundhogchain/contract-spec`](./packages/contract-spec) | Contract spec AST types | `xdr` |
| [`@groundhogchain/rpc`](./packages/rpc) | ONC-RPC client + RPC type defs | `xdr`, `protocol` |
| [`@groundhogchain/gateway`](./packages/gateway) | Gateway/indexer types | `xdr`, `protocol` |

All packages are published to GitHub Packages with `access: restricted`.

## Repo layout

```
packages/<name>/
  src/index.ts          # hand-written barrel (like lib.rs in protocol-rs)
  src/protocol/*.ts     # generated from protocol/*.x
protocol/               # git submodule: upstream XDR definitions
scripts/generate.sh     # regenerates *.ts from *.x via the x23c compiler
docs/                   # internal docs
```

## Setup & build

```sh
git submodule update --init
npm install
npm run build      # build all workspaces
npm test           # vitest across all workspaces
npm run typecheck
```

## Regenerating from XDR

After updating the `protocol/` submodule, regenerate the TypeScript sources:

```sh
XDRC=/path/to/x23c ./scripts/generate.sh
```

Only files under `src/protocol/` (and the noted test fixtures) are overwritten —
the hand-written `src/index.ts` barrels are not.

## Releasing

Bump versions across all packages in lockstep (see the `bump-version` workflow),
then publish. Inter-package `dependencies` versions must match the bumped
version exactly, since publishes go to a private registry.
