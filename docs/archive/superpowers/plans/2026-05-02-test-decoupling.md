# Test Decoupling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decouple protocol package tests from the `protocol/*.x` submodule so upstream XDR changes don't break CI, and clean up dead wallet_kit.ts.

**Architecture:** Create a single kitchen-sink `test_types.x` file exercising every codegen pattern, generate TS from it via x23c, rewrite all non-cross-SDK tests to import from the generated test fixture instead of real protocol types. Clean up wallet_kit.ts remnants separately.

**Tech Stack:** XDR/x23c codegen, TypeScript, vitest

---

## File Map

**Created:**
- `packages/protocol/test/fixtures/test_types.x` — kitchen-sink XDR fixture
- `packages/protocol/test/fixtures/test_types.ts` — generated from test_types.x (checked in)
- `packages/protocol/test/xdr/branded_types.test.ts` — branded type + enum + constant tests
- `packages/protocol/test/xdr/codec_roundtrip.test.ts` — struct/opaque codec round-trip tests
- `packages/protocol/test/xdr/union_codecs.test.ts` — all union pattern tests

**Modified:**
- `packages/rpc/src/protocol/index.ts` — remove wallet_kit re-exports
- `scripts/generate.sh` — add test_types.x generation step

**Deleted:**
- `packages/rpc/src/protocol/wallet_kit.ts`
- `packages/protocol/test/protocol/types.test.ts`
- `packages/protocol/test/protocol/transaction.test.ts`
- `packages/protocol/test/protocol/contract.test.ts`
- `packages/protocol/test/protocol/codecs/types.test.ts`
- `packages/protocol/test/protocol/codecs/transaction.test.ts`
- `packages/protocol/test/protocol/union_codecs.test.ts`
- `packages/protocol/test/xdr/cxs_codec.test.ts` (CXS tests move into union_codecs.test.ts and codec_roundtrip.test.ts)

**Untouched:**
- `packages/protocol/test/protocol/golden.test.ts`
- `packages/protocol/test/cross-sdk/xdr.test.ts`
- `packages/protocol/test/cross-sdk/entrypoint.test.ts`
- `packages/protocol/test/integration.test.ts`
- `packages/protocol/test/utils/hash.test.ts`
- `packages/protocol/test/utils/hex.test.ts`

---

### Task 1: Clean up wallet_kit.ts

**Files:**
- Delete: `packages/rpc/src/protocol/wallet_kit.ts`
- Modify: `packages/rpc/src/protocol/index.ts:4,35,66`

- [ ] **Step 1: Remove wallet_kit from index.ts**

In `packages/rpc/src/protocol/index.ts`, remove these three lines:

Line 4:
```typescript
export * from "./wallet_kit.js";
```

Line 35:
```typescript
import { codec as wallet_kit_codec } from "./wallet_kit.js";
```

Line 66:
```typescript
  ...wallet_kit_codec,
```

- [ ] **Step 2: Delete wallet_kit.ts**

```bash
rm packages/rpc/src/protocol/wallet_kit.ts
```

- [ ] **Step 3: Verify the rpc package still builds**

```bash
npm run typecheck --workspace=packages/rpc
```

Expected: passes (wallet_kit types were not used by anything else in the package).

- [ ] **Step 4: Commit**

```bash
git add packages/rpc/src/protocol/wallet_kit.ts packages/rpc/src/protocol/index.ts
git commit -m "chore: remove dead wallet_kit.ts (source .x deleted upstream)"
```

---

### Task 2: Create test_types.x fixture

**Files:**
- Create: `packages/protocol/test/fixtures/test_types.x`

- [ ] **Step 1: Write test_types.x**

Create `packages/protocol/test/fixtures/test_types.x` with this content:

```xdr
// Kitchen-sink XDR fixture for codegen testing.
// Not part of the protocol — used only by the test suite.

namespace hogd {

// -- Constants --

const kTestMaxLen = 1024;
const kTestVersion = 42;

// -- Enums --

enum TestColor {
  Red = 0,
  Green = 1,
  Blue = 2
};

enum TestStatusCode {
  OK = 0,
  NotFound = 1,
  Internal = 2
};

// -- Branded opaques --

typedef opaque TestHash[32];
typedef opaque TestEntrypointId[8];
typedef opaque TestPayload<1024>;
typedef opaque TestBlob<>;

// -- Structs --

struct TestPoint {
  unsigned int x;
  unsigned int y;
};

struct TestPerson {
  string name<256>;
  TestHash id;
  TestPoint location;
};

// -- Union pattern 1: no default arm (enum-discriminated, data + void) --

union TestShape switch (TestColor color) {
  case Red:
    unsigned int radius;
  case Green:
    struct {
      unsigned int width;
      unsigned int height;
    } rectangle;
  case Blue:
    void;
};

// -- Union pattern 2: default void arm --

union TestResult switch (TestStatusCode status) {
  case OK:
    unsigned int value;
  default:
    void;
};

// -- Union pattern 3: default data arm --

union TestMessage switch (int tag) {
  case 0:
    unsigned hyper count;
  case 1:
    void;
  default:
    opaque raw_payload<>;
};

// -- Union: int-discriminated, void-only (like ExtensionPoint) --

union TestExtPoint switch (int v) {
  case 0:
    void;
};

// -- Arrays --

struct TestMatrix {
  unsigned int row[3];
};

struct TestScores {
  unsigned int values<10>;
};

// -- Option --

struct TestOptional {
  unsigned int *maybe_value;
};

} // namespace hogd
```

- [ ] **Step 2: Commit the .x file**

```bash
git add packages/protocol/test/fixtures/test_types.x
git commit -m "test: add kitchen-sink test_types.x fixture for codegen testing"
```

---

### Task 3: Generate test_types.ts and update generate.sh

**Files:**
- Modify: `scripts/generate.sh`
- Create: `packages/protocol/test/fixtures/test_types.ts` (generated)

- [ ] **Step 1: Generate test_types.ts using x23c**

Run from repo root:

```bash
XDRC="../../hogd/vscode/x23/x23c/x23c"
$XDRC --ts -o "packages/protocol/test/fixtures/test_types.ts" \
  "packages/protocol/test/fixtures/test_types.x"
```

- [ ] **Step 2: Strip the proto import if present**

The generated file may contain `import * as proto from "./index.js"` which isn't needed (standalone fixture). Remove it:

```bash
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' '/^import \* as proto/d' "packages/protocol/test/fixtures/test_types.ts"
else
  sed -i '/^import \* as proto/d' "packages/protocol/test/fixtures/test_types.ts"
fi
```

- [ ] **Step 3: Verify the generated file compiles**

Read the generated `test_types.ts` to confirm it has the expected types:
- Enums: `TestColor`, `TestStatusCode`
- Branded opaques: `TestHash`, `TestEntrypointId`, `TestPayload`, `TestBlob`
- Structs: `TestPoint`, `TestPerson`
- Unions: `TestShape`, `TestResult`, `TestMessage`, `TestExtPoint`
- Arrays: `TestMatrix`, `TestScores`
- Option: `TestOptional`
- Constants: `kTestMaxLen`, `kTestVersion`
- Codec object with all of the above

Run typecheck to verify:

```bash
cd packages/protocol && npx tsc --noEmit --strict test/fixtures/test_types.ts --moduleResolution bundler --module esnext --target esnext --skipLibCheck
```

(Or simply run the full test suite later — this is a sanity check.)

- [ ] **Step 4: Update generate.sh**

Add the test_types.x generation block after the echo.x block in `scripts/generate.sh`. Insert after line 45 (after the echo.x `fi`):

```bash

# Test fixture: kitchen-sink XDR types (standalone, needs proto import line removed)
$XDRC --ts -o "packages/protocol/test/fixtures/test_types.ts" "packages/protocol/test/fixtures/test_types.x"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' '/^import \* as proto/d' "packages/protocol/test/fixtures/test_types.ts"
else
  sed -i '/^import \* as proto/d' "packages/protocol/test/fixtures/test_types.ts"
fi
```

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/test/fixtures/test_types.ts scripts/generate.sh
git commit -m "test: generate test_types.ts from kitchen-sink fixture, wire into generate.sh"
```

---

### Task 4: Write branded_types.test.ts

This consolidates tests from the old `types.test.ts`, `transaction.test.ts`, and `contract.test.ts`.

**Files:**
- Create: `packages/protocol/test/xdr/branded_types.test.ts`
- Delete: `packages/protocol/test/protocol/types.test.ts`
- Delete: `packages/protocol/test/protocol/transaction.test.ts`
- Delete: `packages/protocol/test/protocol/contract.test.ts`

**Important:** The generated `test_types.ts` has specific factory functions and types. After Task 3, read the generated file to confirm exact names. The code below uses the names x23c generates from the `.x` definitions — they follow the pattern: `TestHash` type → `testHash()` factory, `TestEntrypointId` → `testEntrypointId()`, etc.

- [ ] **Step 1: Write branded_types.test.ts**

Create `packages/protocol/test/xdr/branded_types.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
} from "@groundhogchain/xdr";
import {
  testHash, TestHash,
  testEntrypointId, TestEntrypointId,
  testPayload, TestPayload,
  testBlob, TestBlob,
  TestColor,
  TestStatusCode,
  kTestMaxLen,
  kTestVersion,
  codec,
} from "../fixtures/test_types.js";

describe("branded type factories", () => {
  it("testHash accepts 32 bytes", () => {
    const data = new Uint8Array(32);
    const hash: TestHash = testHash(data);
    expect(hash).toBe(data);
  });

  it("testHash rejects wrong length", () => {
    expect(() => testHash(new Uint8Array(31))).toThrow();
    expect(() => testHash(new Uint8Array(33))).toThrow();
  });

  it("testEntrypointId accepts 8 bytes", () => {
    const data = new Uint8Array(8);
    const id: TestEntrypointId = testEntrypointId(data);
    expect(id).toBe(data);
  });

  it("testEntrypointId rejects wrong length", () => {
    expect(() => testEntrypointId(new Uint8Array(7))).toThrow();
    expect(() => testEntrypointId(new Uint8Array(9))).toThrow();
  });

  it("testPayload accepts up to kTestMaxLen", () => {
    const data = new Uint8Array(Number(kTestMaxLen));
    const p: TestPayload = testPayload(data);
    expect(p).toBe(data);
  });

  it("testPayload rejects over max", () => {
    expect(() => testPayload(new Uint8Array(Number(kTestMaxLen) + 1))).toThrow();
  });

  it("testBlob accepts any length", () => {
    const data = new Uint8Array(5000);
    const b: TestBlob = testBlob(data);
    expect(b).toBe(data);
  });
});

describe("enums", () => {
  it("TestColor has correct values", () => {
    expect(TestColor.Red).toBe(0);
    expect(TestColor.Green).toBe(1);
    expect(TestColor.Blue).toBe(2);
  });

  it("TestStatusCode has correct values", () => {
    expect(TestStatusCode.OK).toBe(0);
    expect(TestStatusCode.NotFound).toBe(1);
    expect(TestStatusCode.Internal).toBe(2);
  });
});

describe("enum codecs", () => {
  it("TestColor round-trips all variants", () => {
    for (const variant of [TestColor.Red, TestColor.Green, TestColor.Blue]) {
      const bytes = serialize(variant, codec.TestColor);
      expect(deserialize(bytes, codec.TestColor)).toBe(variant);
    }
  });

  it("TestStatusCode round-trips all variants", () => {
    for (const variant of [TestStatusCode.OK, TestStatusCode.NotFound, TestStatusCode.Internal]) {
      const bytes = serialize(variant, codec.TestStatusCode);
      expect(deserialize(bytes, codec.TestStatusCode)).toBe(variant);
    }
  });
});

describe("constants", () => {
  it("kTestMaxLen", () => {
    expect(kTestMaxLen).toBe(1024n);
  });

  it("kTestVersion", () => {
    expect(kTestVersion).toBe(42n);
  });
});
```

**Note on constant types:** x23c generates constants as `bigint` (e.g. `export const kTestMaxLen = 1024n`). If x23c generates them as plain `number` instead, adjust the expected values to drop the `n` suffix. Read the generated file to confirm.

**Note on factory names:** x23c generates factory functions using camelCase of the type name. `TestHash` → `testHash`, `TestEntrypointId` → `testEntrypointId`, `TestPayload` → `testPayload`, `TestBlob` → `testBlob`. If the generated names differ, update imports to match.

**Note on variable-length opaques:** `TestPayload` has a max bound (`<1024>`), so the factory may enforce the bound. `TestBlob` is unbounded (`<>`), so the factory may NOT enforce any length. Read the generated file to confirm whether `testBlob` is branded without a length check (like `Calldata` in the real codegen).

- [ ] **Step 2: Run the test**

```bash
npm run test --workspace=packages/protocol -- --reporter=verbose test/xdr/branded_types.test.ts
```

Expected: all tests pass.

- [ ] **Step 3: Delete old test files**

```bash
rm packages/protocol/test/protocol/types.test.ts
rm packages/protocol/test/protocol/transaction.test.ts
rm packages/protocol/test/protocol/contract.test.ts
```

- [ ] **Step 4: Verify remaining tests still pass**

```bash
npm run test --workspace=packages/protocol
```

Expected: all tests pass. The deleted files are replaced by branded_types.test.ts.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/test/xdr/branded_types.test.ts \
  packages/protocol/test/protocol/types.test.ts \
  packages/protocol/test/protocol/transaction.test.ts \
  packages/protocol/test/protocol/contract.test.ts
git commit -m "test: replace protocol-dependent branded type tests with fixture-based tests"
```

---

### Task 5: Write codec_roundtrip.test.ts

This consolidates tests from `codecs/types.test.ts`, `codecs/transaction.test.ts`, and `cxs_codec.test.ts`.

**Files:**
- Create: `packages/protocol/test/xdr/codec_roundtrip.test.ts`
- Delete: `packages/protocol/test/protocol/codecs/types.test.ts`
- Delete: `packages/protocol/test/protocol/codecs/transaction.test.ts`
- Delete: `packages/protocol/test/xdr/cxs_codec.test.ts`

- [ ] **Step 1: Write codec_roundtrip.test.ts**

Create `packages/protocol/test/xdr/codec_roundtrip.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
} from "@groundhogchain/xdr";
import {
  testHash, testEntrypointId, testPayload, testBlob,
  TestColor,
  codec,
} from "../fixtures/test_types.js";
import type {
  TestHash, TestPoint, TestPerson, TestShape,
  TestMatrix, TestScores, TestOptional,
} from "../fixtures/test_types.js";

describe("branded opaque codecs round-trip", () => {
  it("TestHash (fixed 32 bytes)", () => {
    const data = testHash(new Uint8Array(32).fill(0xAB));
    const bytes = serialize(data, codec.TestHash);
    expect(deserialize(bytes, codec.TestHash)).toEqual(data);
  });

  it("TestEntrypointId (fixed 8 bytes)", () => {
    const data = testEntrypointId(new Uint8Array(8).fill(0xCD));
    const bytes = serialize(data, codec.TestEntrypointId);
    expect(deserialize(bytes, codec.TestEntrypointId)).toEqual(data);
  });

  it("TestPayload (var bounded)", () => {
    const data = testPayload(new Uint8Array([1, 2, 3, 4, 5]));
    const bytes = serialize(data, codec.TestPayload);
    expect(deserialize(bytes, codec.TestPayload)).toEqual(data);
  });

  it("TestBlob (var unbounded)", () => {
    const data = testBlob(new Uint8Array(2000).fill(0xEE));
    const bytes = serialize(data, codec.TestBlob);
    expect(deserialize(bytes, codec.TestBlob)).toEqual(data);
  });
});

describe("struct codecs round-trip", () => {
  it("TestPoint", () => {
    const p: TestPoint = { x: 10n, y: 20n };
    const bytes = serialize(p, codec.TestPoint);
    expect(deserialize(bytes, codec.TestPoint)).toEqual(p);
  });

  it("TestPerson (nested struct + string + branded opaque)", () => {
    const person: TestPerson = {
      name: "Alice",
      id: testHash(new Uint8Array(32).fill(0x01)),
      location: { x: 100n, y: 200n },
    };
    const bytes = serialize(person, codec.TestPerson);
    expect(deserialize(bytes, codec.TestPerson)).toEqual(person);
  });

  it("TestPerson with empty string", () => {
    const person: TestPerson = {
      name: "",
      id: testHash(new Uint8Array(32).fill(0x00)),
      location: { x: 0n, y: 0n },
    };
    const bytes = serialize(person, codec.TestPerson);
    expect(deserialize(bytes, codec.TestPerson)).toEqual(person);
  });
});

describe("array codecs round-trip", () => {
  it("TestMatrix (fixed array of 3)", () => {
    const m: TestMatrix = { row: [1n, 2n, 3n] };
    const bytes = serialize(m, codec.TestMatrix);
    expect(deserialize(bytes, codec.TestMatrix)).toEqual(m);
  });

  it("TestScores (var array, some elements)", () => {
    const s: TestScores = { values: [10n, 20n, 30n] };
    const bytes = serialize(s, codec.TestScores);
    expect(deserialize(bytes, codec.TestScores)).toEqual(s);
  });

  it("TestScores (var array, empty)", () => {
    const s: TestScores = { values: [] };
    const bytes = serialize(s, codec.TestScores);
    expect(deserialize(bytes, codec.TestScores)).toEqual(s);
  });
});

describe("option codecs round-trip", () => {
  it("TestOptional with value present", () => {
    const o: TestOptional = { maybe_value: 42n };
    const bytes = serialize(o, codec.TestOptional);
    expect(deserialize(bytes, codec.TestOptional)).toEqual(o);
  });

  it("TestOptional with null", () => {
    const o: TestOptional = { maybe_value: null };
    const bytes = serialize(o, codec.TestOptional);
    expect(deserialize(bytes, codec.TestOptional)).toEqual(o);
  });
});

describe("CXS round-trips", () => {
  it("TestPoint: CXS round-trip", () => {
    const p: TestPoint = { x: 10n, y: 20n };
    expect(deserializeCxs(serializeCxs(p, codec.TestPoint), codec.TestPoint)).toEqual(p);
  });

  it("TestPerson: CXS round-trip", () => {
    const person: TestPerson = {
      name: "Bob",
      id: testHash(new Uint8Array(32).fill(0x02)),
      location: { x: 50n, y: 60n },
    };
    expect(deserializeCxs(serializeCxs(person, codec.TestPerson), codec.TestPerson)).toEqual(person);
  });

  it("TestPoint: CXS is smaller than TXS", () => {
    const p: TestPoint = { x: 1n, y: 2n };
    const txs = serialize(p, codec.TestPoint);
    const cxs = serializeCxs(p, codec.TestPoint);
    expect(cxs.length).toBeLessThanOrEqual(txs.length);
  });

  it("TestHash: CXS round-trip", () => {
    const h = testHash(new Uint8Array(32).fill(0xBB));
    expect(deserializeCxs(serializeCxs(h, codec.TestHash), codec.TestHash)).toEqual(h);
  });
});
```

**Note on struct field types:** x23c generates `unsigned int` fields as `bigint` (using `readUint32`/`writeUint32` which return/take `bigint`). The test values above use `bigint` literals (`10n`, `20n`, etc.). If the generated code uses `number` instead, adjust.

**Note on option encoding:** x23c may generate `TestOptional` with `maybe_value` typed as `bigint | null`. Confirm by reading the generated file.

**Note on fixed array encoding:** x23c may generate `TestMatrix.row` as `bigint[]` (a 3-element array). The codec may use `FixedArrayCodec`. Confirm by reading the generated file.

- [ ] **Step 2: Run the test**

```bash
npm run test --workspace=packages/protocol -- --reporter=verbose test/xdr/codec_roundtrip.test.ts
```

Expected: all tests pass.

- [ ] **Step 3: Delete old test files**

```bash
rm packages/protocol/test/protocol/codecs/types.test.ts
rm packages/protocol/test/protocol/codecs/transaction.test.ts
rm packages/protocol/test/xdr/cxs_codec.test.ts
rmdir packages/protocol/test/protocol/codecs
```

- [ ] **Step 4: Verify remaining tests still pass**

```bash
npm run test --workspace=packages/protocol
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/test/xdr/codec_roundtrip.test.ts \
  packages/protocol/test/protocol/codecs/types.test.ts \
  packages/protocol/test/protocol/codecs/transaction.test.ts \
  packages/protocol/test/xdr/cxs_codec.test.ts \
  packages/protocol/test/protocol/codecs
git commit -m "test: replace protocol-dependent codec tests with fixture-based round-trip tests"
```

---

### Task 6: Write union_codecs.test.ts

This replaces `union_codecs.test.ts` (which used both real protocol types and inline mock codecs) with tests against generated test fixture types only.

**Files:**
- Create: `packages/protocol/test/xdr/union_codecs.test.ts`
- Delete: `packages/protocol/test/protocol/union_codecs.test.ts`

- [ ] **Step 1: Write union_codecs.test.ts**

Create `packages/protocol/test/xdr/union_codecs.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs, deserializeCxs,
  XdrWriter,
} from "@groundhogchain/xdr";
import {
  testHash,
  TestColor, TestStatusCode,
  codec,
} from "../fixtures/test_types.js";
import type {
  TestShape, TestResult, TestMessage, TestExtPoint,
} from "../fixtures/test_types.js";

// ============================================================================
// Pattern 1: No default arm — enum-discriminated
// ============================================================================

describe("union codecs — no default arm", () => {
  describe("TestShape (data + data + void arms)", () => {
    it("round-trips Red (data: radius)", () => {
      const shape: TestShape = { color: TestColor.Red, radius: 42n };
      expect(deserialize(serialize(shape, codec.TestShape), codec.TestShape)).toEqual(shape);
    });

    it("round-trips Green (data: rectangle)", () => {
      const shape: TestShape = {
        color: TestColor.Green,
        rectangle: { width: 10n, height: 20n },
      };
      expect(deserialize(serialize(shape, codec.TestShape), codec.TestShape)).toEqual(shape);
    });

    it("round-trips Blue (void arm)", () => {
      const shape: TestShape = { color: TestColor.Blue };
      expect(deserialize(serialize(shape, codec.TestShape), codec.TestShape)).toEqual(shape);
    });

    it("throws on unknown discriminant", () => {
      const w = new XdrWriter();
      w.writeInt32(99n);
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow(/Unknown/);
    });

    it("each variant produces different bytes", () => {
      const variants: TestShape[] = [
        { color: TestColor.Red, radius: 1n },
        { color: TestColor.Green, rectangle: { width: 1n, height: 1n } },
        { color: TestColor.Blue },
      ];
      const hexes = variants.map(v => Array.from(serialize(v, codec.TestShape)).map(b => b.toString(16).padStart(2, "0")).join(""));
      expect(new Set(hexes).size).toBe(hexes.length);
    });

    it("round-trips all variants via CXS", () => {
      const variants: TestShape[] = [
        { color: TestColor.Red, radius: 5n },
        { color: TestColor.Green, rectangle: { width: 3n, height: 4n } },
        { color: TestColor.Blue },
      ];
      for (const v of variants) {
        expect(deserializeCxs(serializeCxs(v, codec.TestShape), codec.TestShape)).toEqual(v);
      }
    });
  });

  describe("TestExtPoint (int-discriminated, void-only)", () => {
    it("round-trips variant 0", () => {
      const ep: TestExtPoint = { v: 0 };
      expect(serialize(ep, codec.TestExtPoint)).toEqual(new Uint8Array([0, 0, 0, 0]));
      expect(deserialize(serialize(ep, codec.TestExtPoint), codec.TestExtPoint)).toEqual(ep);
    });

    it("throws on unknown variant", () => {
      const w = new XdrWriter();
      w.writeInt32(1n);
      expect(() => deserialize(w.finish(), codec.TestExtPoint)).toThrow(/Unknown/);
    });
  });
});

// ============================================================================
// Pattern 2: Default void arm
// ============================================================================

describe("union codecs — default void arm (pattern 2)", () => {
  it("round-trips OK variant (data arm)", () => {
    const val: TestResult = { status: TestStatusCode.OK, value: 42n };
    expect(deserialize(serialize(val, codec.TestResult), codec.TestResult)).toEqual(val);
  });

  it("round-trips known error via default arm", () => {
    const val: TestResult = { status: TestStatusCode.NotFound };
    const decoded = deserialize(serialize(val, codec.TestResult), codec.TestResult);
    expect(decoded.status).toBe(TestStatusCode.NotFound);
    expect("value" in decoded).toBe(false);
  });

  it("round-trips unknown discriminant via default arm", () => {
    const w = new XdrWriter();
    w.writeInt32(99n);
    const decoded = deserialize(w.finish(), codec.TestResult);
    expect(decoded.status).toBe(99);
    expect("value" in decoded).toBe(false);
  });

  it("default arm (void) encodes only the discriminant", () => {
    const ok = serialize({ status: TestStatusCode.OK, value: 42n } as TestResult, codec.TestResult);
    const err = serialize({ status: TestStatusCode.NotFound } as TestResult, codec.TestResult);
    expect(ok.length).toBe(8);
    expect(err.length).toBe(4);
  });

  it("round-trips via CXS", () => {
    expect(
      deserializeCxs(serializeCxs({ status: TestStatusCode.OK, value: 100n } as TestResult, codec.TestResult), codec.TestResult)
    ).toEqual({ status: TestStatusCode.OK, value: 100n });
    expect(
      deserializeCxs(serializeCxs({ status: TestStatusCode.Internal } as TestResult, codec.TestResult), codec.TestResult)
    ).toEqual({ status: TestStatusCode.Internal });
  });
});

// ============================================================================
// Pattern 3: Default data arm
// ============================================================================

describe("union codecs — default data arm (pattern 3)", () => {
  it("round-trips tag 0 (data: count)", () => {
    const val: TestMessage = { tag: 0, count: 999n };
    expect(deserialize(serialize(val, codec.TestMessage), codec.TestMessage)).toEqual(val);
  });

  it("round-trips tag 1 (void)", () => {
    const decoded = deserialize(serialize({ tag: 1 } as TestMessage, codec.TestMessage), codec.TestMessage);
    expect(decoded.tag).toBe(1);
  });

  it("round-trips unknown tag via default arm with data", () => {
    const val: TestMessage = { tag: 42, raw_payload: new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]) };
    const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
    expect(decoded.tag).toBe(42);
    expect((decoded as { raw_payload: Uint8Array }).raw_payload).toEqual(new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]));
  });

  it("round-trips default arm with empty payload", () => {
    const val: TestMessage = { tag: 77, raw_payload: new Uint8Array(0) };
    const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
    expect(decoded.tag).toBe(77);
    expect((decoded as { raw_payload: Uint8Array }).raw_payload).toEqual(new Uint8Array(0));
  });

  it("round-trips all variants via CXS", () => {
    const variants: TestMessage[] = [
      { tag: 0, count: 0n },
      { tag: 1 },
      { tag: 255, raw_payload: new Uint8Array([1, 2, 3]) },
    ];
    for (const val of variants) {
      expect(deserializeCxs(serializeCxs(val, codec.TestMessage), codec.TestMessage)).toEqual(val);
    }
  });
});

// ============================================================================
// TXS vs CXS comparison
// ============================================================================

describe("union codecs — TXS vs CXS", () => {
  it("CXS is smaller for small discriminants", () => {
    const shape: TestShape = { color: TestColor.Blue };
    expect(serialize(shape, codec.TestShape).length).toBe(4);
    expect(serializeCxs(shape, codec.TestShape).length).toBe(1);
  });

  it("both formats decode to the same value", () => {
    const shape: TestShape = { color: TestColor.Red, radius: 42n };
    expect(
      deserialize(serialize(shape, codec.TestShape), codec.TestShape)
    ).toEqual(
      deserializeCxs(serializeCxs(shape, codec.TestShape), codec.TestShape)
    );
  });
});

// ============================================================================
// Discriminant/field mismatch safety
// ============================================================================

describe("union codecs — discriminant/field mismatch safety", () => {
  describe("no-default unions: decode throws on unknown discriminant", () => {
    it("TestShape throws on discriminant 99", () => {
      const w = new XdrWriter();
      w.writeInt32(99n);
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow(/Unknown/);
    });

    it("TestExtPoint throws on discriminant 1", () => {
      const w = new XdrWriter();
      w.writeInt32(1n);
      expect(() => deserialize(w.finish(), codec.TestExtPoint)).toThrow(/Unknown/);
    });
  });

  describe("no-default unions: decode produces correctly paired discriminant+fields", () => {
    it("TestShape Red has radius, not rectangle", () => {
      const shape: TestShape = { color: TestColor.Red, radius: 10n };
      const decoded = deserialize(serialize(shape, codec.TestShape), codec.TestShape);
      expect("radius" in decoded).toBe(true);
      expect("rectangle" in decoded).toBe(false);
    });

    it("TestShape Green has rectangle, not radius", () => {
      const shape: TestShape = { color: TestColor.Green, rectangle: { width: 5n, height: 6n } };
      const decoded = deserialize(serialize(shape, codec.TestShape), codec.TestShape);
      expect("rectangle" in decoded).toBe(true);
      expect("radius" in decoded).toBe(false);
    });

    it("TestShape Blue (void) has no data fields", () => {
      const shape: TestShape = { color: TestColor.Blue };
      const decoded = deserialize(serialize(shape, codec.TestShape), codec.TestShape);
      expect(Object.keys(decoded)).toEqual(["color"]);
    });
  });

  describe("default-void unions: unknown discriminants don't crash", () => {
    it("TestResult: unknown status decodes to { status } only", () => {
      const w = new XdrWriter();
      w.writeInt32(77n);
      const decoded = deserialize(w.finish(), codec.TestResult);
      expect(decoded.status).toBe(77);
      expect(Object.keys(decoded)).toEqual(["status"]);
    });

    it("TestResult: OK always has value field", () => {
      const val: TestResult = { status: TestStatusCode.OK, value: 42n };
      const decoded = deserialize(serialize(val, codec.TestResult), codec.TestResult);
      expect("value" in decoded).toBe(true);
    });
  });

  describe("default-data unions: field presence matches discriminant", () => {
    it("TestMessage tag=0 has count, not raw_payload", () => {
      const val: TestMessage = { tag: 0, count: 42n };
      const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
      expect("count" in decoded).toBe(true);
      expect("raw_payload" in decoded).toBe(false);
    });

    it("TestMessage tag=1 has neither count nor raw_payload", () => {
      const decoded = deserialize(serialize({ tag: 1 } as TestMessage, codec.TestMessage), codec.TestMessage);
      expect(Object.keys(decoded)).toEqual(["tag"]);
    });

    it("TestMessage unknown tag has raw_payload, not count", () => {
      const val: TestMessage = { tag: 50, raw_payload: new Uint8Array([1]) };
      const decoded = deserialize(serialize(val, codec.TestMessage), codec.TestMessage);
      expect("raw_payload" in decoded).toBe(true);
      expect("count" in decoded).toBe(false);
    });
  });

  describe("hand-crafted bad bytes", () => {
    it("TestShape: discriminant=Red but no body -> read past end", () => {
      const w = new XdrWriter();
      w.writeInt32(BigInt(TestColor.Red));
      expect(() => deserialize(w.finish(), codec.TestShape)).toThrow();
    });

    it("TestShape: discriminant=Blue with trailing garbage is ok", () => {
      const w = new XdrWriter();
      w.writeInt32(BigInt(TestColor.Blue));
      w.writeUint32(0xDEADn);
      const decoded = deserialize(w.finish(), codec.TestShape);
      expect(decoded.color).toBe(TestColor.Blue);
    });

    it("TestExtPoint: discriminant=0 encodes as 4 zero bytes", () => {
      const ep: TestExtPoint = { v: 0 };
      expect(serialize(ep, codec.TestExtPoint)).toEqual(new Uint8Array([0, 0, 0, 0]));
    });
  });
});
```

**IMPORTANT — field names depend on codegen output:** The union discriminant field names and arm field names depend on how x23c names them. For example:
- `TestShape` discriminant might be `color` (from `switch (TestColor color)`)
- `TestResult` discriminant might be `status` (from `switch (TestStatusCode status)`)
- `TestMessage` discriminant might be `tag` (from `switch (int tag)`)
- `TestExtPoint` discriminant might be `v` (from `switch (int v)`)

Read the generated `test_types.ts` after Task 3 and adjust these names if they differ.

- [ ] **Step 2: Run the test**

```bash
npm run test --workspace=packages/protocol -- --reporter=verbose test/xdr/union_codecs.test.ts
```

Expected: all tests pass.

- [ ] **Step 3: Delete old test file**

```bash
rm packages/protocol/test/protocol/union_codecs.test.ts
```

- [ ] **Step 4: Verify all tests pass**

```bash
npm run test --workspace=packages/protocol
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/test/xdr/union_codecs.test.ts \
  packages/protocol/test/protocol/union_codecs.test.ts
git commit -m "test: replace protocol-dependent union codec tests with fixture-based tests"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run full test suite for all packages**

```bash
npm test
```

Expected: all packages pass.

- [ ] **Step 2: Run typecheck for all packages**

```bash
npm run typecheck
```

Expected: no type errors.

- [ ] **Step 3: Verify protocol tests no longer import from src/protocol/**

```bash
grep -rn 'from.*src/protocol' packages/protocol/test/xdr/ && echo "FAIL: fixture tests still import protocol types" || echo "OK: no protocol imports in fixture tests"
```

Expected: "OK: no protocol imports in fixture tests"

The following files ARE expected to still import from `src/protocol/` (they test real protocol types):
```bash
grep -rn 'from.*src' packages/protocol/test/protocol/golden.test.ts packages/protocol/test/cross-sdk/ packages/protocol/test/integration.test.ts
```

- [ ] **Step 4: Verify directory cleanup**

```bash
ls packages/protocol/test/protocol/codecs 2>/dev/null && echo "FAIL: codecs dir still exists" || echo "OK: codecs dir removed"
ls packages/protocol/test/protocol/golden.test.ts && echo "OK: golden.test.ts kept"
ls packages/protocol/test/xdr/branded_types.test.ts packages/protocol/test/xdr/codec_roundtrip.test.ts packages/protocol/test/xdr/union_codecs.test.ts && echo "OK: new test files exist"
```

- [ ] **Step 5: Final commit (if any remaining changes)**

Only if there are uncommitted changes from verification fixes:

```bash
git status
```
