# Contributing

## Setup

Use the Node.js version in `.nvmrc` and npm (not pnpm or yarn):

```sh
npm install
```

## Before opening a pull request

Run the same checks as CI, in this order:

```sh
npm run typecheck
npm run docs:check
npm run test
npm run build
npm run test:smoke
npm run test:package
```

The cross-SDK tests compare this implementation against vectors produced by
the Rust SDK. To run them, install the generator from crates.io:

```sh
cargo install thruput-test-vectors@0.58.0 --locked
thruput-test-vectors xdr > packages/protocol/test/fixtures/xdr_vectors.json
cd packages/protocol && npx vitest run test/cross-sdk/
```

## Generated code

Files under `packages/*/src/protocol/` are generated from the XDR definitions
in the `protocol/` submodule and must not be edited by hand. Change the `.x`
definitions in [thruput-protocol](https://github.com/thruputchain/thruput-protocol)
instead; this repository picks them up through the `Auto-update protocol`
workflow. See [Regenerating from XDR](README.md#regenerating-from-xdr).

The hand-written entry points are the `src/index.ts` barrels and
`packages/protocol/src/utils/`.

## Versions

All packages are versioned in lockstep, and internal `@thruputchain/*`
dependencies are pinned to the exact same version. Maintainers handle version
bumps and releases; see [RELEASING.md](RELEASING.md).

## License

By contributing, you agree that your contributions are licensed under the
[Apache License 2.0](LICENSE).
