# Thruput TypeScript protocol bindings

TypeScript bindings for the Thruput blockchain protocol. This is an npm
workspaces monorepo that publishes five `@thruputchain/*` packages, generated
from the XDR definitions in the `protocol/` submodule.

## Packages

| Package | Description | Depends on |
|---|---|---|
| `@thruputchain/xdr` | XDR/CXS serialization framework | — |
| `@thruputchain/protocol` | Core protocol types | `xdr` |
| `@thruputchain/contract-spec` | Contract spec AST types | `xdr`, `protocol` |
| `@thruputchain/rpc` | ONC-RPC client + RPC type defs | `xdr`, `protocol` |
| `@thruputchain/gateway` | Gateway/indexer types | `xdr`, `protocol`, `rpc` |

Public npm releases use `access: public` and need no installation token.

Most application code should prefer `@thruputchain/client`, which lives in
the separate [thruput-sdk-ts](https://github.com/thruputchain/thruput-sdk-ts)
repository (`npm install @thruputchain/client`). These protocol packages are lower-level building blocks
for serialization, generated protocol types, RPC access, contract specs, and
gateway/indexer types.

## Import surfaces

Import from the package barrels and documented subpaths:

- `@thruputchain/xdr`
- `@thruputchain/protocol`
- `@thruputchain/protocol/utils`
- `@thruputchain/contract-spec`
- `@thruputchain/rpc`
- `@thruputchain/gateway`

Avoid importing from generated files under `packages/*/src/protocol/` directly.
Those files are implementation output from code generation and may be rewritten.

## Repo layout

```
packages/<name>/
  src/index.ts          # hand-written barrel (like lib.rs in protocol-rs)
  src/protocol/*.ts     # generated from protocol/*.x
protocol/               # git submodule: upstream XDR definitions
scripts/generate.sh     # regenerates *.ts from *.x via the x23c compiler
```

## Setup & build

```sh
npm install
npm run build      # build all workspaces
npm test           # vitest across all workspaces
npm run typecheck
```

The generated protocol sources are committed, so the `protocol/` submodule is
only needed to regenerate them: run `git submodule update --init` before
following [Regenerating from XDR](#regenerating-from-xdr) (see
[What is not yet public](#what-is-not-yet-public)).

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

The generated files are committed and must not be edited by hand.

### What is not yet public

Building and testing from a clone needs nothing beyond npm, and the cross-SDK
tests need only `cargo install thruput-test-vectors --locked` from crates.io.
Regenerating also needs x23c, the XDR compiler. It is built from
`thruputchain/hogd` (`x23/x23c`) and published as that repository's
`latest-x23c` release; until hogd is public, regeneration is maintainer-only.

The `Auto-update protocol` workflow runs on a maintainer runner with a deploy
key and a GitHub App token, so contributors do not need to run it.

## Protocol commit per release

Each published version is generated from exactly one protocol commit;
`git rev-parse <tag>:protocol` gives it for any tag. Devnet bundles are the releases cut
from `thruputchain/packaging`, whose `release-manifest.toml` pins a protocol
commit; a bundle and a package version encode the same protocol when they pin
the same commit.

| Version | Protocol commit | Devnet bundles on the same commit |
|---|---|---|
| 0.19.0 | `6705996` | 0.1.31-rc.16 |
| 0.18.0 | `e62b877` | — |
| 0.16.0 | `af043b5` | — |
| 0.15.0 | `2f521176` | — |
| 0.14.0 | `6bfe776` | — |
| 0.13.0 | `db436d0` | — |
| 0.12.0 | `d2872e9` | 0.1.29-rc.1 |
| 0.11.0 | `b8799ac` | — |
| 0.10.0 | `a6913f0` | 0.1.25-rc.4, 0.1.25, 0.1.26 |
| 0.9.0 | `021c335` | — |
| 0.8.0 | `db2688f` | — |

## Releasing

Bump versions across all packages in lockstep (see the `bump-version` skill),
add the new version to [Protocol commit per release](#protocol-commit-per-release),
then publish. Inter-package `dependencies` versions must match the bumped
version exactly.

## Publishing the renamed packages

The manual release workflow targets public npm and defaults to dry-run.
See [RELEASING.md](RELEASING.md) for authentication, release order, and retries.
Repository installs retain GitHub Packages during the first npm release;
consumer registry settings and lockfiles switch after all seven packages exist.

Existing `@groundhogchain/*` releases retain their original identities.
