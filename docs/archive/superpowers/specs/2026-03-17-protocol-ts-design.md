# Groundhog Protocol TypeScript SDK — Design Spec

> **Archived 2026-10-11.** Internal planning document, last updated 2026-03-18. It describes the repository as it was then (package names, tooling, versions and workflows have since changed) and is kept only for history. See the top-level README for current information.

## Overview

A TypeScript SDK providing generated protocol types and XDR serialization for the Groundhog blockchain. Primary consumers are browser wallets/dApps and smart contract developer tools. Backend infrastructure stays in Rust.

This SDK is the TypeScript equivalent of `protocol-rs` (generated types) + `xdrs` (XDR serialization), packaged as a single npm package `@groundhog/protocol`.

## Scope (Phase 1)

- Repository scaffold with build/test tooling
- Hand-written representative TypeScript types (spec for future `gen_ts.cc` codegen backend)
- XDR reader/writer implementing RFC 4506 + u128 extension
- Round-trip tests proving types and serialization work together
- **Out of scope**: RPC definitions, full codegen of all 73 `.x` files, `gen_ts.cc` implementation

## Package Structure

Single npm package: `@groundhog/protocol`

Code is organized so the XDR serialization layer (`src/xdr/`) can be extracted into its own package later if someone wants generic XDR without Groundhog types.

```
protocol-ts/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                 # public API re-exports
│   ├── xdr/                     # generic XDR serialization (future split candidate)
│   │   ├── index.ts
│   │   ├── reader.ts            # XdrReader: deserialize XDR binary → values
│   │   ├── writer.ts            # XdrWriter: serialize values → XDR binary
│   │   └── types.ts             # XDR primitive type handling (int32, uint64, opaque, etc.)
│   └── protocol/                # generated Groundhog types (future codegen output)
│       ├── index.ts
│       ├── types.ts             # from types.x
│       ├── transaction.ts       # from transaction.x
│       ├── contract.ts          # from contract.x
│       └── ...                  # one .ts per .x file
└── test/
    ├── xdr/                     # XDR reader/writer unit tests
    └── protocol/                # round-trip serialization tests
```

## Build Tooling

| Tool | Purpose | Rust equivalent |
|------|---------|-----------------|
| `package.json` | Dependency manifest, scripts | `Cargo.toml` |
| `tsconfig.json` | TypeScript compiler config (strictness, target) | `rustfmt.toml` + edition setting |
| `tsup` | Bundles into ESM + CommonJS outputs | `cargo build --lib` + `--cdylib` |
| `vitest` | Test runner | `cargo test` |

Output targets:
- **ESM** (modern `import/export` syntax) — for bundlers, modern Node.js
- **CommonJS** (older `require()` syntax) — for legacy Node.js tooling

## Design Decisions

### All integers are `bigint`

JavaScript `number` is a 64-bit float that loses precision above 2^53. Rather than mixing `number` and `bigint`, all XDR integer types (`int32`, `uint32`, `hyper`, `unsigned hyper`, `uint128`) use `bigint` uniformly. This avoids accidental precision bugs and simplifies the API.

Literals use the `n` suffix: `gas_limit: 1000000n`. Bitwise operations on `bigint` work with the same operators (`|`, `&`, `~`, `^`) as on `number`.

### Integer typedefs are branded `bigint`

All `typedef` aliases of integer types (e.g., `TimePoint`, `GasAmount`, `BlockHeight`) become branded `bigint` types, regardless of whether the XDR has a `#[rust(newtype)]` annotation. This provides domain-level type safety — you can't accidentally pass a `GasAmount` where a `BlockHeight` is expected:

```typescript
export type GasAmount = bigint & { readonly __brand: "GasAmount" };
export function gasAmount(val: bigint): GasAmount {
  return val as GasAmount;
}
```

The `#[rust(newtype)]` annotation controls branding for opaque/byte types. For integer typedefs, we always brand because the cost is zero and the safety benefit is significant.

### Branded types for newtypes

Fixed-size opaque typedefs with `#[rust(newtype)]` become branded `Uint8Array` types — zero runtime cost, but the type checker prevents mixing up a `SHA256Hash` with a `ContractAddress`:

```typescript
export type SHA256Hash = Uint8Array & { readonly __brand: "SHA256Hash" };

export function sha256Hash(data: Uint8Array): SHA256Hash {
  if (data.length !== 32) throw new Error("SHA256Hash must be exactly 32 bytes");
  return data as SHA256Hash;
}
```

Variable-length opaques get the same treatment, with max-length validation at construction time:

```typescript
export type Calldata = Uint8Array & { readonly __brand: "Calldata" };

export function calldata(data: Uint8Array): Calldata {
  if (data.length > MAX_CALLDATA_LEN) throw new Error("Calldata exceeds max length");
  return data as Calldata;
}
```

### Discriminated unions with numeric enum tags

XDR unions become TypeScript discriminated unions using numeric enum values as the tag. This avoids magic strings and maps directly to the wire format:

```typescript
export enum CryptographicScheme {
  Ed25519 = 0,
}

export type PublicKey = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519PublicKey;
};
```

For multi-variant unions:

```typescript
export enum StorageKeyType {
  kStorageKeyTypeContractData = 0,
  kStorageKeyTypeFreeNativeTokenBalance = 1,
  kStorageKeyTypeAddressAuthData = 2,
  kStorageKeyTypeAddressMetadata = 3,
  kStorageKeyTypeReplayCache = 4,
}

export type StorageKey =
  | { key_type: StorageKeyType.kStorageKeyTypeContractData; contract_data_key: StorageKeyContractData }
  | { key_type: StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressAuthData }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressMetadata }
  | { key_type: StorageKeyType.kStorageKeyTypeReplayCache };
```

TypeScript's type narrowing works with numeric discriminants: `if (key.key_type === StorageKeyType.ContractData)` narrows the type so `key.contract_data_key` is accessible.

**Unions discriminated by a raw `int` (not an enum)** use a numeric literal type as the discriminant:

```typescript
// union ExtensionPoint switch (int v) { case 0: void; };
export type ExtensionPoint = { v: 0 };
```

### No naming transformations

All identifiers (type names, field names, enum variant names, constants) are emitted exactly as written in the XDR source, with no renaming. If an XDR enum has `kStorageKeyTypeContractData`, the TypeScript output is `kStorageKeyTypeContractData`. Naming cleanup (e.g., removing redundant prefixes) is done at the XDR source level, not per-language codegen.

### Anonymous structs in union arms

XDR allows inline struct definitions inside union arms (e.g., `AuthClaim`). These become named interfaces, with the name derived from the union arm field name in `PascalCase`:

```typescript
// union AuthClaim case kInvokedAddressSignedWeight:
//   struct { BitMap accepted_keys; Weight required_weight; } invoked_address_signed_weight;
export interface AuthClaim_InvokedAddressSignedWeight {
  accepted_keys: bigint;
  required_weight: bigint;
}

export type AuthClaim =
  | { claim_type: AuthClaimType.kInvokedAddressSignature; invoked_address_signature_id: bigint }
  | { claim_type: AuthClaimType.kInvokedAddressSignedWeight;
      invoked_address_signed_weight: AuthClaim_InvokedAddressSignedWeight }
  // ...
```

### Field names preserve XDR `snake_case`

Field names match the XDR source (e.g., `invoked_address`, `gas_limit`, `block_expiry_height`). This avoids confusion when cross-referencing with XDR files, Rust code, or protocol docs. Type names remain `PascalCase` (they already are in XDR).

### Structs are plain interfaces

XDR structs become TypeScript `interface` declarations — no classes, no constructors. Any plain object with the right fields satisfies the type:

```typescript
export interface Invocation {
  invoked_address: ContractAddress;
  entrypoint: ContractEntrypointID;
  gas_limit: bigint;
  calldata: Calldata;
}
```

### Serialization via codec objects

TypeScript has no traits. Instead, each type gets a "codec" — a value that pairs a reader and writer function:

```typescript
import { xdr } from "@groundhog/protocol";

const bytes: Uint8Array = xdr.serialize(invocation, xdr.Invocation);
const decoded: Invocation = xdr.deserialize(bytes, xdr.Invocation);
```

`xdr.Invocation` is a codec object (not the type itself). This is the standard TypeScript pattern for serialization (used by `io-ts`, `@stellar/stellar-base`, `borsh-js`).

**Codec naming convention**: Each codec is a `PascalCase` property on the `xdr` namespace object, matching the type name exactly. For example:

- Type `Invocation` → codec `xdr.Invocation`
- Type `SHA256Hash` → codec `xdr.SHA256Hash`
- Type `StorageKey` → codec `xdr.StorageKey`
- Type `AuthClaimData` (var-length array typedef) → codec `xdr.AuthClaimData`

Codecs for variable-length array typedefs (like `SignedTransactionBatch`) are generated as named codecs, not assembled from combinators. Internally, the implementation may compose them from primitives, but the public API is always a named codec per type.

### Error handling

All errors throw standard JavaScript `Error` exceptions:

- **Factory functions** throw on invalid input (wrong length, exceeds max, out of range)
- **Deserialization** throws on malformed data (unexpected discriminant, truncated input, length exceeds max)
- **Serialization** throws if a `bigint` value overflows the target XDR integer width (e.g., writing a value > 2^32-1 as a `uint32`)

## XDR Serialization Layer (`src/xdr/`)

Implements RFC 4506 XDR encoding plus a `uint128` extension matching the Rust `xdrs` crate.

### Core interfaces

```typescript
export interface XdrWriter {
  writeInt32(val: bigint): void;
  writeUint32(val: bigint): void;
  writeInt64(val: bigint): void;
  writeUint64(val: bigint): void;
  writeInt128(val: bigint): void;   // extension: two 64-bit halves
  writeUint128(val: bigint): void;  // extension: two 64-bit halves
  writeBool(val: boolean): void;
  writeFixedOpaque(val: Uint8Array, len: number): void;
  writeVarOpaque(val: Uint8Array, max: number): void;
  writeString(val: string, max: number): void;
}

export interface XdrReader {
  readInt32(): bigint;
  readUint32(): bigint;
  readInt64(): bigint;
  readUint64(): bigint;
  readInt128(): bigint;   // extension
  readUint128(): bigint;  // extension
  readBool(): boolean;
  readFixedOpaque(len: number): Uint8Array;
  readVarOpaque(max: number): Uint8Array;
  readString(max: number): string;
}
```

### Codec type

```typescript
export interface XdrCodec<T> {
  encode(writer: XdrWriter, val: T): void;
  decode(reader: XdrReader): T;
}

// Convenience functions
export function serialize<T>(val: T, codec: XdrCodec<T>): Uint8Array;
export function deserialize<T>(data: Uint8Array, codec: XdrCodec<T>): T;
```

### u128 / i128 wire format

**Unsigned** (`uint128_xdr`): Encoded as `{ highbits: uint64, lowbits: uint64 }` — two big-endian unsigned 64-bit halves. Reconstructed as `(highbits << 64n) | lowbits`.

**Signed** (`int128_xdr`): Encoded as `{ highbits: int64, lowbits: uint64 }` — the high half is signed, the low half is unsigned. The codec must handle sign extension correctly when reconstructing the `bigint`: the high half carries the sign, and the low half is always non-negative.

### XdrWriter / XdrReader implementation

`XdrWriter` uses a dynamically growing internal `Uint8Array` buffer. Call `.finish()` to get the final bytes.

`XdrReader` wraps a `Uint8Array` with an internal offset cursor that advances as values are read.

Both are concrete classes, not just interfaces — the interfaces define the contract for codec `encode`/`decode` methods, and the classes are the standard implementation.

## XDR → TypeScript Mapping Reference

This table defines how each XDR construct maps to TypeScript. This serves as the spec for a future `gen_ts.cc` backend in x23c.

| XDR construct | TypeScript output | Example |
|---|---|---|
| `int` / `unsigned int` | `bigint` | `gas_limit: bigint` |
| `hyper` / `unsigned hyper` | `bigint` | `nonce: bigint` |
| `uint128_xdr` / `int128_xdr` | `bigint` (via u128/i128 codec extension) | — |
| `bool` | `boolean` | — |
| `enum Foo { kFooA = 0 }` | `enum Foo { kFooA = 0 }` (no renaming) | `CryptographicScheme`, `StorageKeyType` |
| `struct Foo { T a; U b; }` | `interface Foo { a: T; b: U }` | `Invocation` |
| `union Foo switch (E d) { case A: T a; }` | `type Foo = \| { d: E.A; a: T }` | `PublicKey`, `StorageKey` |
| `union Foo switch (int d) { case 0: void; }` | `type Foo = { d: 0 }` (numeric literal discriminant) | `ExtensionPoint` |
| `struct { ... } name` (anon in union arm) | `interface Union_ArmName { ... }` | `AuthClaim` inline structs |
| `typedef opaque Name[N]` with newtype | Branded `Uint8Array` + factory fn | `SHA256Hash`, `ContractAddress` |
| `typedef opaque Name<N>` | Branded `Uint8Array` + max-len factory | `Calldata`, `ReturnBuffer` |
| `typedef integer Name` | Branded `bigint` + factory (always branded) | `GasAmount`, `TimePoint`, `BlockHeight` |
| `typedef BrandedType Name` (no newtype) | `type Name = BrandedType` (inherits existing brand) | `SignedTransactionHash = SHA256Hash` |
| `typedef T Name` (no newtype, unbranded T) | `type Name = T` (plain alias) | — |
| `typedef T Name<>` (var-length array) | `T[]` (or branded with max-len) | `SignedTransactionBatch` |
| `typedef T Name<N>` (bounded array) | `T[]` with max-len codec | `AuthClaimData` |
| `T name[N]` (fixed-length array, non-opaque) | `T[]` with exact-length codec | — |
| `string Name<N>` | `string` (max-len checked at construction) | `Identifier`, `SemVer` |
| `T *Name` (optional pointer) | `T \| null` | `OptSignedTransaction` |
| `const kFoo = N` | `export const kFoo = ...` | `kMaxReturnBufferLen` |
| `void` (in union case) | omitted field | `StorageKey.FreeNativeTokenBalance` |

## Representative Types (Phase 1 hand-written files)

### `src/protocol/types.ts` — from `types.x`

Covers: enums, structs, newtypes (fixed-size opaque), typedef aliases, unions with void arms, constants.

Types to include:
- `uint128_xdr` / `int128_xdr` (struct → bigint via codec)
- `TimePoint`, `GasAmount`, `BlockHeight`, `RuntimeMemoryLength` (typedef → branded bigint)
- `Ed25519Signature`, `Ed25519PublicKey`, `Ed25519SecretKey` (fixed opaque → branded Uint8Array)
- `CryptographicScheme` (enum)
- `Signature`, `PublicKey`, `SecretKey` (union)
- `SHA256Hash`, `DbHash`, `BlockHash`, `ContractAddress`, `StorageKeyContractData` (fixed opaque → branded Uint8Array)
- `StorageKeyType` (enum with many variants)
- `StorageKey` (union with void arms)
- `ExtensionPoint` (union discriminated by raw `int`, with void arm)
- `AddressAndKey` (struct with cross-type references)
- `kTotalHogSupply`, `kHogDivisibility` (constants)

### `src/protocol/precompiles.ts` — from `precompiles.x`

Dependency of `contract.x`. Tiny file.

Types to include:
- `HogexecPrecompiledNativeContracts` (enum — `HogToken = 0`, `InitialTokenClaim = 1`)

### `src/protocol/contract.ts` — from `contract.x`

Covers: structs with variable-length opaque fields, unions with data arms, string typedefs.

Types to include:
- `ContractBlob` (struct with var-length opaque)
- `ContractType` (enum)
- `Contract` (union with data arms of different types, depends on `HogexecPrecompiledNativeContracts`)
- `ContractDeploymentHashPreimage` (struct referencing types from `types.ts`)
- `Identifier`, `SemVer` (string typedefs)
- `ContractInterfaceIDPreimage` (struct with string fields)
- `ContractEntrypointID` (fixed opaque newtype)
- `DeployedContractHash`, `AddressMetadata` (structs)

### `src/protocol/retrocausal_queue.ts` — from `retrocausal_queue.x`

Dependency of `transaction.x`. Small file.

Types to include:
- `kQueueEntryMaxLen` (constant)
- `QueueEntry` (var-length opaque with max, branded newtype)

### `src/protocol/auth_claim.ts` — from `auth_claim.x`

Dependency of `transaction.x`. Exercises anonymous structs in union arms.

Types to include:
- `Weight`, `BitMap`, `KeyID` (integer typedefs → branded bigint)
- `kMaxSigners`, `kMaxGasConfigs`, `kMaxAuthClaims` (constants)
- `AuthClaimType` (enum)
- `PubkeyAccountPreimage` (struct)
- `AuthClaim` (union with anonymous inline structs in arms)
- `AuthClaimData` (bounded var-length array typedef)
- `AuthVerifyErrorCode` (enum)

### `src/protocol/transaction.ts` — from `transaction.x`

Covers: structs referencing types across files, variable-length arrays, optional pointer types, batch typedefs.

Types to include:
- `Calldata`, `ReturnBuffer` (var-length opaque with max)
- `kMaxReturnBufferLen` (constant)
- `GasClaim`, `Invocation` (structs)
- `InvocationFrameStatusCode`, `InvokeFlag`, `TransactionStatistic` (enums)
- `InvocationFrameOutput` (union)
- `InvokeFlagSet` (integer typedef — bitset)
- `Uniquifier`, `Transaction`, `DecoratedSignature`, `SignedTransaction` (structs)
- `SignedTransactionHash` (typedef inheriting `SHA256Hash` brand)
- `TransactionBatch`, `SignedTransactionBatch`, `SignedTransactionHashBatch` (var-length array typedefs)
- `OptSignedTransaction` (optional pointer → `T | null`)
- `OptSignedTransactionBatch` (var-length array of optional pointer)
- `ProposedTransaction`, `NondeterministicProposalData` (structs, depends on `QueueEntry` and `AuthClaimData`)

## Test Plan

1. **XDR primitives**: Round-trip each primitive type through write → read (including i128/u128, edge cases like 0, max values, negative values)
2. **Branded type factories**: Verify length validation (exact and max), reject invalid lengths, type branding
3. **Struct serialization**: Round-trip `Invocation`, `Transaction`, `SignedTransaction`
4. **Union serialization**: Round-trip `PublicKey`, `StorageKey` (including void arms), `AuthClaim` (with inline struct arms)
5. **Cross-compatibility**: Serialize in TypeScript, compare bytes against known-good output from the Rust `xdrs` crate. Golden test vectors are generated by a Rust test harness that serializes sample values and writes hex-encoded bytes to a JSON fixture file checked into the repo (`test/fixtures/golden_vectors.json`).

## Future Work (out of scope)

- `gen_ts.cc` backend for x23c (automated codegen for all 73 `.x` files)
- JSON-RPC client layer for talking to Groundhog nodes
- Splitting `@groundhog/xdr` into its own package
- npm publishing and CI/CD
