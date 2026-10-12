# Test Decoupling from Protocol XDR Files

> **Archived 2026-10-11.** Internal planning document, last updated 2026-05-02. It describes the repository as it was then (package names, tooling, versions and workflows have since changed) and is kept only for history. See the top-level README for current information.

Decouple protocol package tests from the `protocol/*.x` submodule so that
upstream XDR changes don't break CI. Tests use a local kitchen-sink `.x`
fixture instead.

## Scope

Two changes:

1. **wallet_kit.ts cleanup** -- remove dead generated file and re-exports
2. **Test fixture + test rewrites** -- new test `.x` file, rewrite tests to use it

## 1. wallet_kit.ts Cleanup

`wallet_kit.x` was deleted upstream but the generated artifacts remain:

- Delete `packages/rpc/src/protocol/wallet_kit.ts`
- Remove from `packages/rpc/src/protocol/index.ts`:
  - `export * from "./wallet_kit.js"`
  - `import { codec as wallet_kit_codec } from "./wallet_kit.js"`
  - `...wallet_kit_codec,` in the merged codec object

## 2. Test Fixture: `test_types.x`

Single file at `packages/protocol/test/fixtures/test_types.x` covering every
codegen pattern the XDR framework supports:

### Enums

- `TestColor` -- 3+ variants, used as union discriminant and standalone
- `TestStatusCode` -- used for union with void arms

### Structs

- `TestPoint` -- simple struct (two uint32 fields)
- `TestPerson` -- nested struct with string, branded opaque, and inner struct

### Branded Opaques

- Fixed-length: `TestHash` (32 bytes), `TestEntrypointId` (8 bytes)
- Variable-length bounded: `TestPayload` (max 1024 bytes)
- Variable-length unbounded: `TestBlob`

### Strings

- Bounded string field in `TestPerson` (max 256)

### Unions -- Pattern 1 (no default arm)

- Enum-discriminated union `TestShape` with:
  - Data arm: `circle` (has radius)
  - Data arm: `rectangle` (has width + height)
  - Void arm: `none`

### Unions -- Pattern 2 (default void arm)

- Enum-discriminated union `TestResult` with:
  - `ok` arm carrying a uint32 value
  - default void arm (error codes produce no data)

### Unions -- Pattern 3 (default data arm)

- Int-discriminated union `TestMessage` with:
  - tag 0: `count` (uint64)
  - tag 1: void
  - default: `raw_payload` (var opaque)

### Union -- Int-discriminated void-only

- `TestExtPoint` with a single variant 0 (void), mimicking ExtensionPoint

### Arrays

- Fixed-length array: `TestMatrix` (3x uint32, i.e. `uint32 row[3]`)
- Variable-length array: `TestScores` (`uint32 values<10>`)

### Options

- Optional field: `TestOptional` struct with `uint32 *maybe_value`

### Constants

- `kTestMaxLen = 1024`
- `kTestVersion = 42`

No RPC program in this fixture -- the protocol package doesn't handle RPC.
The `echo.x` fixture in the rpc package already covers RPC codegen testing.

## 3. Code Generation

Add to `scripts/generate.sh` after the echo.x block:

```bash
$XDRC --ts -o "packages/protocol/test/fixtures/test_types.ts" \
  "packages/protocol/test/fixtures/test_types.x"
```

Apply `sed` to strip `import * as proto` if present (standalone fixture has
no cross-file dependencies, but x23c may still emit the import).

The generated `test_types.ts` is checked in (same convention as `echo.ts`).

## 4. Test Rewrites

### Files rewritten (import from `test/fixtures/test_types.js`)

| Old path | New path | Tests |
|----------|----------|-------|
| `test/protocol/types.test.ts` | `test/xdr/branded_types.test.ts` | Branded type factories (length validation, branding), enum values, constants |
| `test/protocol/transaction.test.ts` | merged into `branded_types.test.ts` | Same -- branded types, enums, constants |
| `test/protocol/contract.test.ts` | merged into `branded_types.test.ts` | Same -- enum values, branded types |
| `test/protocol/codecs/types.test.ts` | `test/xdr/codec_roundtrip.test.ts` | Struct + opaque codec round-trips via XDR and CXS |
| `test/protocol/codecs/transaction.test.ts` | merged into `codec_roundtrip.test.ts` | Same -- struct/union codec round-trips |
| `test/protocol/union_codecs.test.ts` | `test/xdr/union_codecs.test.ts` | All 3 union patterns + discriminant safety, using generated codecs only (no inline mocks) |

### Files untouched (keep testing real protocol types)

- `test/protocol/golden.test.ts` -- cross-SDK golden vectors
- `test/cross-sdk/xdr.test.ts` -- cross-SDK XDR serialization compat
- `test/cross-sdk/entrypoint.test.ts` -- cross-SDK entrypoint derivation
- `test/integration.test.ts` -- end-to-end SignedTransaction round-trip

### Test coverage requirements

The rewritten tests must cover the same behaviors currently tested:

- Branded type factory: correct length accepted, wrong length rejected
- Enum values match expected integers
- Constants match expected values
- Struct codec round-trip (serialize then deserialize equals original)
- Union codec round-trip for every variant (data arms, void arms)
- Union unknown discriminant throws (pattern 1) or falls through (patterns 2/3)
- Union discriminant/field pairing correctness on decode
- CXS round-trip for unions and structs
- CXS vs TXS size comparison
- Byte-level safety (truncated input, trailing garbage on void arms)

## 5. What This Does NOT Change

- The protocol package's `src/` directory and its exports -- unchanged
- The `@groundhogchain/protocol` published package -- unchanged
- The RPC package's echo.x fixture -- unchanged
- Any cross-SDK or integration test -- unchanged
- The generate.sh codegen for protocol types -- unchanged (still generates from `protocol/*.x`)

## 6. Directory Cleanup

After moving test files:

- Delete empty `test/protocol/codecs/` directory
- `test/protocol/` still contains `golden.test.ts` -- keep it
- New `test/xdr/` directory contains `branded_types.test.ts`, `codec_roundtrip.test.ts`, `union_codecs.test.ts`
