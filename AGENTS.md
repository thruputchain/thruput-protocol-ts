# AGENTS.md

## Repo Shape
- npm workspaces monorepo; use `npm`, not pnpm. Root scripts just fan out to `packages/*` workspaces.
- Published packages are `@groundhogchain/xdr`, `protocol`, `contract-spec`, `rpc`, and `gateway`.
- Real package entrypoints are the hand-written `src/index.ts` files. Generated protocol types live under `packages/*/src/protocol/*.ts`.

## Verified Commands
- Install with `npm ci` in CI and `npm install` locally.
- Full verification order used in the publish workflow: `npm run typecheck`, `npm run docs:check`, `npm run test`, `npm run build`, `npm run test:smoke`. Regular CI splits these across jobs (typecheck, docs:check, build in one; test, build, test:smoke in another).
- Run one workspace from the repo root with `npm run <script> --workspace @groundhogchain/<pkg>`.
- Cross-SDK tests are separate from the normal workspace test run: `cd packages/protocol && npx vitest run test/cross-sdk/`.

## Testing Notes
- `packages/protocol`, `packages/rpc`, `packages/contract-spec`, and `packages/gateway` use Vitest config aliases so tests resolve sibling workspace source directly instead of built output.
- Cross-SDK protocol tests require the external Rust tool `groundhog-test-vectors`, which CI installs via `cargo install groundhog-test-vectors --registry groundhog` before regenerating JSON fixtures.

## Codegen And Generated Files
- The `protocol/` directory is a git submodule (`git submodule update --init` if it is missing).
- Regenerate with `XDRC=/path/to/x23c ./scripts/generate.sh`.
- `scripts/generate.sh` overwrites generated files in `packages/protocol/src/protocol/*.ts`, `packages/contract-spec/src/protocol/*.ts`, `packages/rpc/src/protocol/*.ts`, `packages/gateway/src/protocol/*.ts`, plus these fixtures: `packages/rpc/test/fixtures/echo.ts`, `packages/protocol/test/fixtures/test_base.ts`, and `packages/protocol/test/fixtures/test_compound.ts`.
- The package `src/index.ts` files and the `src/protocol/index.ts` barrels are hand-maintained. When adding a new `.x` file, update both `scripts/generate.sh` and the matching barrel manually.
- `packages/contract-spec/src/protocol/index.ts` intentionally does not `export *` from `@groundhogchain/protocol`; it only re-exports the narrow protocol symbols needed to avoid name collisions like `ContractType`.

## Release Constraints
- All package versions move in lockstep. Publish workflows fail if any `packages/*/package.json` version differs.
- Internal workspace dependency versions are exact, not ranges.
- `.npmrc` sets `save-exact=true`, `ignore-scripts=true`, and publishes `@groundhogchain/*` to GitHub Packages.

## Existing Workflow To Preserve
- The auto-update workflow bumps the `protocol` submodule to upstream `main`, downloads `x23c`, runs `./scripts/generate.sh`, and opens a PR with the regenerated output. Keep manual regeneration changes aligned with that flow.
