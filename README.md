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

All packages are published to GitHub Packages with `access: restricted`.

Most application code should prefer `@thruputchain/client`, which lives in
the separate [client-ts](https://github.com/thruputchain/client-ts)
repository and is published to the same GitHub Packages registry
(`npm install @thruputchain/client`, with the registry auth described in
that repo's README). These protocol packages are lower-level building blocks
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
docs/archive/           # historical planning docs, not maintained
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
[What needs org access](#what-needs-org-access)).

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

### What needs org access

Building and testing from a clone needs nothing beyond npm. Regenerating does:

- The `protocol/` submodule (`groundhogchain/protocol`) is currently private.
- x23c, the XDR compiler, is built from `groundhogchain/hogd` (`x23/x23c`) and
  published only as the `latest-x23c` release of that private repository.
- The `Auto-update protocol` workflow runs on an internal runner with a deploy
  key and a GitHub App token.
- The cross-SDK tests install `thruput-test-vectors` from the private Cargo
  registry.

## Protocol commit per release

Each published version is generated from exactly one protocol commit;
`git rev-parse <tag>:protocol` gives it for any tag. Devnet bundles are the releases cut
from `groundhogchain/packaging`, whose `release-manifest.toml` pins a protocol
commit; a bundle and a package version encode the same protocol when they pin
the same commit.

| Version | Protocol commit | Devnet bundles on the same commit |
|---|---|---|
| 0.15.0 (pending) | `cfcaf864` | — |
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
version exactly, since publishes go to a private registry.

## Publishing the renamed packages

The `@thruputchain/*` packages publish to GitHub Packages from repositories in
`thruputchain`. Release workflows use the repository's `GITHUB_TOKEN` with
`packages: write`.

Publish the protocol packages first, then the client, then React. Grant the
client and React repositories Actions read access to the protocol packages,
and grant React read access to the client package. Refresh downstream lockfiles
from the published artifacts before merging their PRs.

Existing `@groundhogchain/*` releases retain their original identities.
