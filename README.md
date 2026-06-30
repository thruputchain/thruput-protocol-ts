# protocol-ts

TypeScript bindings for the Groundhog blockchain protocol. This is a private npm
monorepo that publishes five `@groundhogchain/*` packages, generated from the
XDR definitions in the `protocol/` submodule.

## Packages

| Package | Description | Depends on |
|---|---|---|
| `@groundhogchain/xdr` | XDR/CXS serialization framework | — |
| `@groundhogchain/protocol` | Core protocol types | `xdr` |
| `@groundhogchain/contract-spec` | Contract spec AST types | `xdr` |
| `@groundhogchain/rpc` | ONC-RPC client + RPC type defs | `xdr`, `protocol` |
| `@groundhogchain/gateway` | Gateway/indexer types | `xdr`, `protocol` |

All packages are published to GitHub Packages with `access: restricted`.

Most application code should prefer `@groundhogchain/client`. These protocol
packages are lower-level building blocks for serialization, generated protocol
types, RPC access, contract specs, and gateway/indexer types.

## Import surfaces

Import from the package barrels and documented subpaths:

- `@groundhogchain/xdr`
- `@groundhogchain/protocol`
- `@groundhogchain/protocol/utils`
- `@groundhogchain/contract-spec`
- `@groundhogchain/rpc`
- `@groundhogchain/gateway`

Avoid importing from generated files under `packages/*/src/protocol/` directly.
Those files are implementation output from code generation and may be rewritten.

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

## API docs

Generate the local API reference with:

```sh
npm run docs
```

Validate the TypeDoc configuration without writing output with:

```sh
npm run docs:check
```

The generated site is written to `docs/api/`, which is ignored by git. The API
reference is generated from the public package entrypoints rather than every
generated implementation file.

## Regenerating from XDR

Protocol types under `packages/*/src/protocol/*.ts` are generated from XDR
definitions in the `protocol/` submodule. After updating that submodule,
regenerate the TypeScript sources with:

```sh
XDRC=/path/to/x23c ./scripts/generate.sh
```

Generation also updates the generated test fixtures noted in
`scripts/generate.sh`. Hand-written barrels such as `packages/*/src/index.ts`
and `packages/protocol/src/utils/index.ts` are the intended import surfaces and
are not overwritten by the generator.

## Releasing

Bump versions across all packages in lockstep (see the `bump-version` workflow),
then publish. Inter-package `dependencies` versions must match the bumped
version exactly, since publishes go to a private registry.
