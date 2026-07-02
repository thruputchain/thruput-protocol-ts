# GH-171 Brief: Generate and Publish protocol-ts API Docs

## Linear Issue

[GH-171](https://linear.app/grndhg/issue/GH-171/generate-and-publish-protocol-ts-api-docs): Generate and publish protocol-ts API docs

## Goal

Add generated API reference docs for `groundhog-protocol-ts` and publish them from the repo with GitHub Pages.

The generated docs should help users understand the public package surfaces without forcing them to browse raw generated protocol files.

## Repo

Work in:

```sh
~/Work/groundhog-protocol-ts
```

This is a private npm workspace monorepo with five published packages:

- `@groundhogchain/xdr`
- `@groundhogchain/protocol`
- `@groundhogchain/contract-spec`
- `@groundhogchain/rpc`
- `@groundhogchain/gateway`

The root `package.json` is private and only runs workspace-level scripts:

```json
{
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "typecheck": "npm run typecheck --workspaces"
  }
}
```

## Current Package Map

| Package                         | Current role                                      | Public entrypoints                                                       |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| `@groundhogchain/xdr`           | XDR/CXS serialization framework                   | `packages/xdr/src/index.ts`                                              |
| `@groundhogchain/protocol`      | Core protocol types, codecs, and helpers          | `packages/protocol/src/index.ts`, `packages/protocol/src/utils/index.ts` |
| `@groundhogchain/contract-spec` | Contract spec AST types and codecs                | `packages/contract-spec/src/index.ts`                                    |
| `@groundhogchain/rpc`           | ONC-RPC client and generated RPC type definitions | `packages/rpc/src/index.ts`                                              |
| `@groundhogchain/gateway`       | Gateway/indexer protocol types                    | `packages/gateway/src/index.ts`                                          |

## Important Repo Facts

- Each package builds with `tsdown` and emits ESM, CJS, and declarations into `dist/`.
- Root `npm run build`, `npm test`, and `npm run typecheck` fan out to all workspaces.
- There are no `.github/workflows` files yet in this repo.
- Package versions are currently `0.4.1` and should remain lockstep.
- Packages publish to GitHub Packages with `access: restricted`.
- Generated protocol files live under `packages/*/src/protocol/`.
- Hand-written package barrels live at `packages/*/src/index.ts`.
- `packages/protocol` also has the public subpath `./utils`, backed by `packages/protocol/src/utils/index.ts`.
- `scripts/generate.sh` regenerates protocol files from the `protocol/` submodule using `x23c`.
- The generator intentionally does not overwrite hand-written `src/index.ts` barrels.

## Non-Negotiables

- Do not hand-edit generated files under `packages/*/src/protocol/`.
- Do not hand-edit generated test fixtures.
- Generate docs from public entrypoints, not from every generated implementation file directly.
- Keep generated TypeDoc HTML out of git.
- Keep the first pass focused on latest docs from `main`; do not add versioned historical docs yet.
- Keep docs plain and useful. Avoid custom TypeDoc themes or large restructuring.

## Recommended Approach

Build one combined TypeDoc site for the monorepo from curated public entrypoints.

Use a root-level TypeDoc config with entrypoints:

```json
[
  "packages/xdr/src/index.ts",
  "packages/protocol/src/index.ts",
  "packages/protocol/src/utils/index.ts",
  "packages/contract-spec/src/index.ts",
  "packages/rpc/src/index.ts",
  "packages/gateway/src/index.ts"
]
```

Recommended output:

```text
docs/api/
```

Recommended package scripts at root:

```json
{
  "docs": "typedoc",
  "docs:check": "typedoc --emit none"
}
```

Recommended TypeDoc dependency:

- Add `typedoc` as a root dev dependency.
- Use the current TypeDoc version that supports the repo's TypeScript version.
- `client-ts` used `typedoc@0.28.19`; this is a good starting point.

Recommended `typedoc.json` behavior:

```json
{
  "name": "@groundhogchain/protocol-ts",
  "entryPoints": [
    "packages/xdr/src/index.ts",
    "packages/protocol/src/index.ts",
    "packages/protocol/src/utils/index.ts",
    "packages/contract-spec/src/index.ts",
    "packages/rpc/src/index.ts",
    "packages/gateway/src/index.ts"
  ],
  "out": "docs/api",
  "readme": "README.md",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "excludeExternals": true,
  "cleanOutputDir": true,
  "githubPages": true,
  "treatWarningsAsErrors": true
}
```

Adjust only if TypeDoc cannot resolve workspace package imports. If that happens, keep the public-entrypoint principle and fix TypeScript/TypeDoc config rather than broadening to all source files.

## Documentation Content Requirements

Add high-value JSDoc/TSDoc comments to hand-written public entrypoints and important hand-written APIs. Do not try to document every generated protocol symbol.

Minimum comments to add:

- Root package/module comments for each public entrypoint.
- Package-level explanation for `@groundhogchain/xdr`.
- Package-level explanation for `@groundhogchain/protocol`.
- Package-level explanation for `@groundhogchain/protocol/utils`.
- Package-level explanation for `@groundhogchain/contract-spec`.
- Package-level explanation for `@groundhogchain/rpc`.
- Package-level explanation for `@groundhogchain/gateway`.
- Comments on the hand-written ONC-RPC client APIs in `packages/rpc/src/onc/*`.
- Comments on important XDR/CXS reader, writer, and codec APIs in `packages/xdr/src/xdr/*`.
- Comments on protocol utility helpers in `packages/protocol/src/utils/*`.

Suggested examples:

- `@groundhogchain/xdr`: encode/decode a simple value with a codec.
- `@groundhogchain/protocol`: construct or serialize a protocol type if there is a clear public helper.
- `@groundhogchain/protocol/utils`: `toHex`/`fromHex`, hash or address derivation helpers.
- `@groundhogchain/rpc`: create an RPC client and call a method, if the API supports a concise example.

Avoid examples on every generated type or enum.

## Generated File Provenance

The issue asks that generated protocol files explain provenance without confusing users.

Because generated files should not be hand-edited, handle this carefully:

- First inspect existing generated file headers.
- If headers are already clear enough, do not change generated files.
- If headers are missing or confusing, update the generator or generation path, not individual generated files, unless the team explicitly accepts a one-time generated output update.
- At minimum, document provenance in the README and package/module comments:
  - `packages/*/src/protocol/*.ts` files are generated from XDR definitions in the `protocol/` submodule.
  - Regenerate with `XDRC=/path/to/x23c ./scripts/generate.sh`.
  - Hand-written barrels such as `src/index.ts` are the intended import surface.

Do not block TypeDoc setup on generator changes unless generated files are actively misleading.

## README Updates

Update the root README with:

- Local API docs command: `npm run docs`.
- Check command: `npm run docs:check`.
- Output path: `docs/api/`.
- Note that `docs/api/` is generated and ignored.
- Short statement that the API reference is generated from public package entrypoints.
- Short package-selection guidance that most app code should prefer `@groundhogchain/client`, while protocol packages are lower-level building blocks.

Update package READMEs only if they exist and are already maintained. Do not create five long package READMEs in this pass.

## GitHub Pages Workflow

Add a workflow after local docs build successfully.

Recommended file:

```text
.github/workflows/docs.yml
```

Recommended behavior:

- Trigger on pushes to `main`.
- Support manual `workflow_dispatch`.
- Use Node 22.
- Run `npm ci`.
- Run `npm run docs`.
- Upload `docs/api` as the Pages artifact.
- Deploy with `actions/deploy-pages`.
- Set permissions:
  - `contents: read`
  - `packages: read`
  - `pages: write`
  - `id-token: write`

- Use concurrency group `pages`.

Package auth note:

- This repo publishes and consumes private GitHub Packages.
- If `npm ci` needs package auth, mirror the pattern used in `groundhog-client-ts`:
  - `actions/setup-node` with `registry-url: https://npm.pkg.github.com` and `scope: "@groundhogchain"`.
  - `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` on `npm ci`.

If the repo has no workflow style yet, use current GitHub action versions and pin SHAs if that is the organization standard. `client-ts` pins action SHAs.

The GitHub repo must have Pages source set to `GitHub Actions` before deployment succeeds.

## Suggested Work Chunks

### Chunk 1: Local TypeDoc Setup

Expected changes:

- Root `typedoc` dev dependency.
- Root `typedoc.json`.
- Root `docs` and `docs:check` scripts.
- `.gitignore` entry for `docs/api/`.
- README section for local API docs.

Verification:

- `npm run docs:check`
- `npm run docs`
- `npm run typecheck`

Stop after this chunk and review the generated site before adding many comments.

### Chunk 2: Package-Level Docs

Expected changes:

- Module comments in public entrypoints.
- Short package descriptions for all five packages and the `protocol/utils` subpath.
- No generated file edits.

Verification:

- `npm run docs:check`
- `npm run docs`
- Review `docs/api/modules/*.html`.

### Chunk 3: Hand-Written API Comments

Expected changes:

- JSDoc/TSDoc for `packages/xdr/src/xdr/*` public classes/functions/types.
- JSDoc/TSDoc for `packages/protocol/src/utils/*` public helpers.
- JSDoc/TSDoc for `packages/rpc/src/onc/*` public client/transport/message APIs.
- Selective examples where they clarify usage.

Verification:

- `npm run docs:check`
- `npm run docs`
- `npm run typecheck`
- Package tests if comments touch exported types in a way that can affect declaration emit.

### Chunk 4: README and Provenance Polish

Expected changes:

- README explains local docs workflow.
- README explains generated protocol file provenance.
- README points users to public barrels as supported import surfaces.

Verification:

- `npm run docs:check`
- `npm run docs`
- `npm run typecheck`

### Chunk 5: GitHub Pages Workflow

Expected changes:

- `.github/workflows/docs.yml`.
- No source changes.

Verification:

- `npm run docs:check`
- `npm run docs`
- Review workflow syntax carefully.
- First real deployment is verified after merge to `main`.

### Chunk 6: Final Verification

Run the repo's standard checks:

```sh
npm run build
npm test
npm run typecheck
npm run docs:check
npm run docs
```

If a format script is added or already exists, run it too.

## Expected Outcome

When complete:

- `groundhog-protocol-ts` can generate local API docs with `npm run docs`.
- `npm run docs:check` validates TypeDoc without writing output.
- Generated docs live in ignored `docs/api/`.
- TypeDoc documents all public package entrypoints.
- Package-level docs explain what each package is for.
- Hand-written public APIs have useful comments and selective examples.
- Generated protocol files are not hand-edited.
- README explains local docs, generated-file provenance, and import surfaces.
- GitHub Pages publishes the generated API reference after merge to `main`.

## Acceptance Checklist

- [ ] `typedoc` is installed at the root.

- [ ] `typedoc.json` uses curated public entrypoints.

- [ ] `npm run docs` works.

- [ ] `npm run docs:check` works.

- [ ] `docs/api/` is ignored.

- [ ] Root README documents local API docs generation.

- [ ] Root README explains generated protocol file provenance.

- [ ] Public entrypoints have module-level docs.

- [ ] Important hand-written public APIs have JSDoc/TSDoc comments.

- [ ] Generated files are not hand-edited.

- [ ] GitHub Pages workflow publishes `docs/api`.

- [ ] Full repo checks pass.

## PR Summary Template

```md
## Summary

- Add TypeDoc-generated API reference for protocol-ts packages
- Document public package entrypoints and key hand-written APIs
- Add local docs scripts and README instructions
- Add GitHub Pages workflow to publish `docs/api`

## Verification

- `npm run docs:check`
- `npm run docs`
- `npm run typecheck`
- `npm test`
- `npm run build`
```
