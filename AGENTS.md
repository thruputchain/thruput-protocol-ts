# AGENTS.md

## Repo Shape
- npm workspaces monorepo; use `npm`, not pnpm. The root build runs workspaces in dependency order.
- Published packages are `@thruputchain/xdr`, `protocol`, `contract-spec`, `rpc`, and `gateway`.
- Real package entrypoints are the hand-written `src/index.ts` files. Generated protocol types live under `packages/*/src/protocol/*.ts`.

## Verified Commands
- Install with `npm ci` in CI and `npm install` locally.
- Full verification order used in the publish workflow: `npm run typecheck`, `npm run docs:check`, `npm run test`, `npm run build`, `npm run test:smoke`, `npm run test:package`. The package check installs all five local tarballs and checks strict external consumer types and runtime imports. Run the build first.
- Run one workspace from the repo root with `npm run <script> --workspace @thruputchain/<pkg>`.
- Cross-SDK tests are separate from the normal workspace test run: `cd packages/protocol && npx vitest run test/cross-sdk/`.

## Testing Notes
- `packages/protocol`, `packages/rpc`, `packages/contract-spec`, and `packages/gateway` use Vitest config aliases so tests resolve sibling workspace source directly instead of built output.
- Cross-SDK protocol tests require the external Rust tool `thruput-test-vectors`, which CI installs via `cargo install thruput-test-vectors@0.51.0 --registry thruput --locked` before regenerating JSON fixtures.

## Codegen And Generated Files

- RPC and gateway JavaScript is bundled with tsdown; their declarations are emitted by TypeScript using `tsconfig.build.json`. Preserve declaration modules: bundling their self-referencing protocol namespaces loses external re-exported types. Build dependencies first so declaration generation checks the actual package boundary.
- The `protocol/` directory is a git submodule (`git submodule update --init` if it is missing).
- Regenerate with `XDRC=/path/to/x23c ./scripts/generate.sh` (`XDRC` is required). x23c is built from `x23/x23c` in thruputchain/hogd and published as that repo's `latest-x23c` release.
- `scripts/generate.sh` overwrites generated files in `packages/protocol/src/protocol/*.ts`, `packages/contract-spec/src/protocol/*.ts`, `packages/rpc/src/protocol/*.ts`, `packages/gateway/src/protocol/*.ts`, plus these fixtures: `packages/rpc/test/fixtures/echo.ts`, `packages/protocol/test/fixtures/test_base.ts`, and `packages/protocol/test/fixtures/test_compound.ts`.
- The package `src/index.ts` files and the `src/protocol/index.ts` barrels are hand-maintained. When adding a new `.x` file, update both `scripts/generate.sh` and the matching barrel manually.
- `packages/contract-spec/src/protocol/index.ts` intentionally does not `export *` from `@thruputchain/protocol`; it only re-exports the narrow protocol symbols needed to avoid name collisions like `ContractType`.

## Release Constraints
- All package versions move in lockstep. Publish workflows fail if any `packages/*/package.json` version differs.
- Internal workspace dependency versions are exact, not ranges.
- `.npmrc` keeps GitHub Packages as the install source during migration. `publishConfig` publishes public packages to npm. See `RELEASING.md` for release order and authentication.

## Existing Workflow To Preserve
- The auto-update workflow bumps the `protocol` submodule to upstream `main`, downloads `x23c`, runs `./scripts/generate.sh`, and opens a PR with the regenerated output. Keep manual regeneration changes aligned with that flow.
- `.gitmodules` uses the canonical HTTPS URL. The updater reads protocol source and Hogd releases with a repository-scoped Contents-read App token; its separate retained write key pushes the update branch.
