# Protocol-TS Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the `@groundhog/protocol` TypeScript SDK repository with XDR serialization and hand-written representative protocol types.

**Architecture:** Single npm package with two layers: a generic XDR serialization library (`src/xdr/`) and generated Groundhog protocol types (`src/protocol/`). Types are plain interfaces/branded types; serialization uses codec objects. All integers are `bigint`.

**Tech Stack:** TypeScript 5.x, `tsup` (bundler), `vitest` (test runner), Node.js 20+

**Spec:** `docs/superpowers/specs/2026-03-17-protocol-ts-design.md`

---

### Task 1: Repository Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/index.ts`
- Create: `src/xdr/index.ts`
- Create: `src/protocol/index.ts`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/geoff/groundhog/protocol-ts
git init
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "@groundhog/protocol",
  "version": "0.1.0",
  "description": "Groundhog blockchain protocol types and XDR serialization",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  },
  "license": "Apache-2.0"
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2022"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

ELI5: `target: ES2022` means "output JavaScript that uses features available since 2022" — this includes `bigint` natively. `strict: true` enables all type checking (like `#![deny(warnings)]` in Rust). `moduleResolution: bundler` tells TypeScript we're using a bundler (tsup) to resolve imports.

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
*.tsbuildinfo
```

- [ ] **Step 5: Create placeholder entry points**

Create `src/index.ts`:
```typescript
export * from "./xdr/index.js";
export * from "./protocol/index.js";
```

Create `src/xdr/index.ts`:
```typescript
// XDR serialization layer — generic, not Groundhog-specific
```

Create `src/protocol/index.ts`:
```typescript
// Groundhog protocol types — generated from .x files
```

- [ ] **Step 6: Install dependencies and verify build**

```bash
npm install
npx tsc --noEmit
```

Expected: no errors (empty project compiles fine).

- [ ] **Step 7: Verify vitest runs with no tests**

```bash
npx vitest run
```

Expected: exits 0, reports "no test files found" or similar.

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json .gitignore src/
git commit -m "chore: initialize protocol-ts repository scaffold"
```

---

### Task 2: XDR Writer

**Files:**
- Create: `src/xdr/writer.ts`
- Modify: `src/xdr/index.ts`
- Create: `test/xdr/writer.test.ts`

- [ ] **Step 1: Write the failing test for XdrWriter basics**

Create `test/xdr/writer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { XdrWriter } from "../src/xdr/writer.js";

describe("XdrWriter", () => {
  it("writes uint32", () => {
    const w = new XdrWriter();
    w.writeUint32(1n);
    expect(w.finish()).toEqual(new Uint8Array([0, 0, 0, 1]));
  });

  it("writes int32 positive", () => {
    const w = new XdrWriter();
    w.writeInt32(1n);
    expect(w.finish()).toEqual(new Uint8Array([0, 0, 0, 1]));
  });

  it("writes int32 negative", () => {
    const w = new XdrWriter();
    w.writeInt32(-1n);
    // -1 in two's complement 32-bit = 0xFFFFFFFF
    expect(w.finish()).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });

  it("writes uint64", () => {
    const w = new XdrWriter();
    w.writeUint64(0x0102030405060708n);
    expect(w.finish()).toEqual(
      new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
    );
  });

  it("writes int64 negative", () => {
    const w = new XdrWriter();
    w.writeInt64(-1n);
    expect(w.finish()).toEqual(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    );
  });

  it("writes bool true and false", () => {
    const w = new XdrWriter();
    w.writeBool(true);
    w.writeBool(false);
    expect(w.finish()).toEqual(
      new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0])
    );
  });

  it("writes fixed opaque with padding", () => {
    const w = new XdrWriter();
    // 3 bytes of data → 1 byte of zero padding (XDR pads to 4-byte boundary)
    w.writeFixedOpaque(new Uint8Array([0xaa, 0xbb, 0xcc]), 3);
    expect(w.finish()).toEqual(
      new Uint8Array([0xaa, 0xbb, 0xcc, 0x00])
    );
  });

  it("writes fixed opaque aligned (no padding needed)", () => {
    const w = new XdrWriter();
    w.writeFixedOpaque(new Uint8Array([1, 2, 3, 4]), 4);
    expect(w.finish()).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it("writes var opaque (length prefix + data + padding)", () => {
    const w = new XdrWriter();
    w.writeVarOpaque(new Uint8Array([0xde, 0xad]), 100);
    // 4 bytes length (2) + 2 bytes data + 2 bytes padding
    expect(w.finish()).toEqual(
      new Uint8Array([0, 0, 0, 2, 0xde, 0xad, 0, 0])
    );
  });

  it("writes string", () => {
    const w = new XdrWriter();
    w.writeString("hi", 100);
    // 4 bytes length (2) + 2 bytes UTF-8 + 2 bytes padding
    expect(w.finish()).toEqual(
      new Uint8Array([0, 0, 0, 2, 0x68, 0x69, 0, 0])
    );
  });

  it("throws on uint32 overflow", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint32(0x100000000n)).toThrow();
  });

  it("throws on negative uint32", () => {
    const w = new XdrWriter();
    expect(() => w.writeUint32(-1n)).toThrow();
  });

  it("throws on var opaque exceeding max", () => {
    const w = new XdrWriter();
    expect(() => w.writeVarOpaque(new Uint8Array(101), 100)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/xdr/writer.test.ts`
Expected: FAIL — cannot resolve `../src/xdr/writer.js`

- [ ] **Step 3: Implement `XdrWriter`**

Create `src/xdr/writer.ts`:

```typescript
const INITIAL_CAPACITY = 256;

export class XdrWriter {
  private buf: Uint8Array;
  private view: DataView;
  private pos: number = 0;

  constructor(capacity: number = INITIAL_CAPACITY) {
    this.buf = new Uint8Array(capacity);
    this.view = new DataView(this.buf.buffer);
  }

  finish(): Uint8Array {
    return this.buf.slice(0, this.pos);
  }

  private grow(needed: number): void {
    const required = this.pos + needed;
    if (required <= this.buf.length) return;
    let newCap = this.buf.length * 2;
    while (newCap < required) newCap *= 2;
    const newBuf = new Uint8Array(newCap);
    newBuf.set(this.buf);
    this.buf = newBuf;
    this.view = new DataView(this.buf.buffer);
  }

  writeInt32(val: bigint): void {
    if (val < -0x80000000n || val > 0x7FFFFFFFn) {
      throw new Error(`int32 overflow: ${val}`);
    }
    this.grow(4);
    this.view.setInt32(this.pos, Number(val));
    this.pos += 4;
  }

  writeUint32(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFn) {
      throw new Error(`uint32 overflow: ${val}`);
    }
    this.grow(4);
    this.view.setUint32(this.pos, Number(val));
    this.pos += 4;
  }

  writeInt64(val: bigint): void {
    if (val < -(1n << 63n) || val > (1n << 63n) - 1n) {
      throw new Error(`int64 overflow: ${val}`);
    }
    this.grow(8);
    this.view.setBigInt64(this.pos, val);
    this.pos += 8;
  }

  writeUint64(val: bigint): void {
    if (val < 0n || val > 0xFFFFFFFFFFFFFFFFn) {
      throw new Error(`uint64 overflow: ${val}`);
    }
    this.grow(8);
    this.view.setBigUint64(this.pos, val);
    this.pos += 8;
  }

  writeInt128(val: bigint): void {
    if (val < -(1n << 127n) || val > (1n << 127n) - 1n) {
      throw new Error(`int128 overflow: ${val}`);
    }
    // Signed high half, unsigned low half
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = (val >> 64n);
    this.writeInt64(highbits);
    this.writeUint64(lowbits);
  }

  writeUint128(val: bigint): void {
    if (val < 0n || val > (1n << 128n) - 1n) {
      throw new Error(`uint128 overflow: ${val}`);
    }
    const lowbits = val & 0xFFFFFFFFFFFFFFFFn;
    const highbits = val >> 64n;
    this.writeUint64(highbits);
    this.writeUint64(lowbits);
  }

  writeBool(val: boolean): void {
    this.writeInt32(val ? 1n : 0n);
  }

  writeFixedOpaque(val: Uint8Array, len: number): void {
    if (val.length !== len) {
      throw new Error(`fixed opaque length mismatch: expected ${len}, got ${val.length}`);
    }
    const padded = paddedLen(len);
    this.grow(padded);
    this.buf.set(val, this.pos);
    // zero-fill padding bytes
    for (let i = len; i < padded; i++) {
      this.buf[this.pos + i] = 0;
    }
    this.pos += padded;
  }

  writeVarOpaque(val: Uint8Array, max: number): void {
    if (val.length > max) {
      throw new Error(`var opaque exceeds max: ${val.length} > ${max}`);
    }
    this.writeUint32(BigInt(val.length));
    const padded = paddedLen(val.length);
    this.grow(padded);
    this.buf.set(val, this.pos);
    for (let i = val.length; i < padded; i++) {
      this.buf[this.pos + i] = 0;
    }
    this.pos += padded;
  }

  writeString(val: string, max: number): void {
    const encoded = new TextEncoder().encode(val);
    this.writeVarOpaque(encoded, max);
  }
}

function paddedLen(len: number): number {
  return (len + 3) & ~3;
}
```

- [ ] **Step 4: Export from `src/xdr/index.ts`**

Update `src/xdr/index.ts`:
```typescript
export { XdrWriter } from "./writer.js";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/xdr/writer.test.ts`
Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/xdr/writer.ts src/xdr/index.ts test/xdr/writer.test.ts
git commit -m "feat: implement XdrWriter with RFC 4506 encoding + u128 extension"
```

---

### Task 3: XDR Reader

**Files:**
- Create: `src/xdr/reader.ts`
- Modify: `src/xdr/index.ts`
- Create: `test/xdr/reader.test.ts`

- [ ] **Step 1: Write the failing test for XdrReader**

Create `test/xdr/reader.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { XdrReader } from "../src/xdr/reader.js";

describe("XdrReader", () => {
  it("reads uint32", () => {
    const r = new XdrReader(new Uint8Array([0, 0, 0, 42]));
    expect(r.readUint32()).toBe(42n);
  });

  it("reads int32 negative", () => {
    const r = new XdrReader(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
    expect(r.readInt32()).toBe(-1n);
  });

  it("reads uint64", () => {
    const r = new XdrReader(
      new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
    );
    expect(r.readUint64()).toBe(0x0102030405060708n);
  });

  it("reads int64 negative", () => {
    const r = new XdrReader(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    );
    expect(r.readInt64()).toBe(-1n);
  });

  it("reads bool", () => {
    const r = new XdrReader(
      new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0])
    );
    expect(r.readBool()).toBe(true);
    expect(r.readBool()).toBe(false);
  });

  it("reads fixed opaque with padding", () => {
    const r = new XdrReader(new Uint8Array([0xaa, 0xbb, 0xcc, 0x00]));
    const result = r.readFixedOpaque(3);
    expect(result).toEqual(new Uint8Array([0xaa, 0xbb, 0xcc]));
  });

  it("reads var opaque", () => {
    const r = new XdrReader(
      new Uint8Array([0, 0, 0, 2, 0xde, 0xad, 0, 0])
    );
    const result = r.readVarOpaque(100);
    expect(result).toEqual(new Uint8Array([0xde, 0xad]));
  });

  it("reads string", () => {
    const r = new XdrReader(
      new Uint8Array([0, 0, 0, 2, 0x68, 0x69, 0, 0])
    );
    expect(r.readString(100)).toBe("hi");
  });

  it("throws on truncated data", () => {
    const r = new XdrReader(new Uint8Array([0, 0]));
    expect(() => r.readUint32()).toThrow();
  });

  it("throws on var opaque exceeding max", () => {
    // length field says 101 but max is 100
    const buf = new Uint8Array(4 + 104);
    new DataView(buf.buffer).setUint32(0, 101);
    const r = new XdrReader(buf);
    expect(() => r.readVarOpaque(100)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/xdr/reader.test.ts`
Expected: FAIL — cannot resolve `../src/xdr/reader.js`

- [ ] **Step 3: Implement `XdrReader`**

Create `src/xdr/reader.ts`:

```typescript
export class XdrReader {
  private view: DataView;
  private pos: number = 0;

  constructor(private data: Uint8Array) {
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  private ensure(n: number): void {
    if (this.pos + n > this.data.length) {
      throw new Error(
        `XDR read past end: need ${n} bytes at offset ${this.pos}, have ${this.data.length}`
      );
    }
  }

  readInt32(): bigint {
    this.ensure(4);
    const val = this.view.getInt32(this.pos);
    this.pos += 4;
    return BigInt(val);
  }

  readUint32(): bigint {
    this.ensure(4);
    const val = this.view.getUint32(this.pos);
    this.pos += 4;
    return BigInt(val);
  }

  readInt64(): bigint {
    this.ensure(8);
    const val = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return val;
  }

  readUint64(): bigint {
    this.ensure(8);
    const val = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return val;
  }

  readInt128(): bigint {
    const highbits = this.readInt64();
    const lowbits = this.readUint64();
    return (highbits << 64n) | lowbits;
  }

  readUint128(): bigint {
    const highbits = this.readUint64();
    const lowbits = this.readUint64();
    return (highbits << 64n) | lowbits;
  }

  readBool(): boolean {
    const val = this.readInt32();
    if (val !== 0n && val !== 1n) {
      throw new Error(`invalid bool value: ${val}`);
    }
    return val === 1n;
  }

  readFixedOpaque(len: number): Uint8Array {
    const padded = (len + 3) & ~3;
    this.ensure(padded);
    const result = this.data.slice(this.pos, this.pos + len);
    this.pos += padded;
    return result;
  }

  readVarOpaque(max: number): Uint8Array {
    const len = Number(this.readUint32());
    if (len > max) {
      throw new Error(`var opaque length ${len} exceeds max ${max}`);
    }
    return this.readFixedOpaque(len);
  }

  readString(max: number): string {
    const bytes = this.readVarOpaque(max);
    return new TextDecoder().decode(bytes);
  }
}
```

- [ ] **Step 4: Export from `src/xdr/index.ts`**

Update `src/xdr/index.ts` to add:
```typescript
export { XdrReader } from "./reader.js";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/xdr/reader.test.ts`
Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/xdr/reader.ts src/xdr/index.ts test/xdr/reader.test.ts
git commit -m "feat: implement XdrReader with RFC 4506 decoding + u128 extension"
```

---

### Task 4: XDR Codec Infrastructure

**Files:**
- Create: `src/xdr/codec.ts`
- Modify: `src/xdr/index.ts`
- Create: `test/xdr/codec.test.ts`

- [ ] **Step 1: Write the failing test for codec round-trip**

Create `test/xdr/codec.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { XdrCodec, serialize, deserialize } from "../src/xdr/codec.js";
import { XdrWriter } from "../src/xdr/writer.js";
import { XdrReader } from "../src/xdr/reader.js";

// A trivial codec for testing
const Uint32Codec: XdrCodec<bigint> = {
  encode(w: XdrWriter, val: bigint) { w.writeUint32(val); },
  decode(r: XdrReader) { return r.readUint32(); },
};

describe("serialize / deserialize", () => {
  it("round-trips uint32", () => {
    const bytes = serialize(42n, Uint32Codec);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 42]));
    const decoded = deserialize(bytes, Uint32Codec);
    expect(decoded).toBe(42n);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/xdr/codec.test.ts`
Expected: FAIL — cannot resolve `../src/xdr/codec.js`

- [ ] **Step 3: Implement codec infrastructure**

Create `src/xdr/codec.ts`:

```typescript
import { XdrWriter } from "./writer.js";
import { XdrReader } from "./reader.js";

export interface XdrCodec<T> {
  encode(w: XdrWriter, val: T): void;
  decode(r: XdrReader): T;
}

export function serialize<T>(val: T, codec: XdrCodec<T>): Uint8Array {
  const w = new XdrWriter();
  codec.encode(w, val);
  return w.finish();
}

export function deserialize<T>(data: Uint8Array, codec: XdrCodec<T>): T {
  const r = new XdrReader(data);
  return codec.decode(r);
}
```

- [ ] **Step 4: Export from `src/xdr/index.ts`**

Update `src/xdr/index.ts` to add:
```typescript
export { XdrCodec, serialize, deserialize } from "./codec.js";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/xdr/codec.test.ts`
Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/xdr/codec.ts src/xdr/index.ts test/xdr/codec.test.ts
git commit -m "feat: add XdrCodec interface and serialize/deserialize helpers"
```

---

### Task 5: XDR Writer/Reader Round-Trip Tests

**Files:**
- Create: `test/xdr/roundtrip.test.ts`

This task adds thorough round-trip tests for all primitives including edge cases and u128/i128.

- [ ] **Step 1: Write round-trip tests**

Create `test/xdr/roundtrip.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { XdrWriter } from "../src/xdr/writer.js";
import { XdrReader } from "../src/xdr/reader.js";

function roundtrip(write: (w: XdrWriter) => void, read: (r: XdrReader) => unknown) {
  const w = new XdrWriter();
  write(w);
  const r = new XdrReader(w.finish());
  return read(r);
}

describe("XDR round-trip", () => {
  describe("int32", () => {
    for (const val of [0n, 1n, -1n, 0x7FFFFFFFn, -0x80000000n]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt32(val), r => r.readInt32())).toBe(val);
      });
    }
  });

  describe("uint32", () => {
    for (const val of [0n, 1n, 0xFFFFFFFFn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint32(val), r => r.readUint32())).toBe(val);
      });
    }
  });

  describe("int64", () => {
    for (const val of [0n, 1n, -1n, (1n << 63n) - 1n, -(1n << 63n)]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt64(val), r => r.readInt64())).toBe(val);
      });
    }
  });

  describe("uint64", () => {
    for (const val of [0n, 1n, 0xFFFFFFFFFFFFFFFFn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint64(val), r => r.readUint64())).toBe(val);
      });
    }
  });

  describe("uint128", () => {
    for (const val of [0n, 1n, (1n << 64n), (1n << 128n) - 1n, 0xDEADBEEF_CAFEBABEn]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeUint128(val), r => r.readUint128())).toBe(val);
      });
    }
  });

  describe("int128", () => {
    for (const val of [0n, 1n, -1n, (1n << 127n) - 1n, -(1n << 127n)]) {
      it(`round-trips ${val}`, () => {
        expect(roundtrip(w => w.writeInt128(val), r => r.readInt128())).toBe(val);
      });
    }
  });

  describe("bool", () => {
    it("round-trips true", () => {
      expect(roundtrip(w => w.writeBool(true), r => r.readBool())).toBe(true);
    });
    it("round-trips false", () => {
      expect(roundtrip(w => w.writeBool(false), r => r.readBool())).toBe(false);
    });
  });

  describe("fixed opaque", () => {
    it("round-trips 32 bytes", () => {
      const data = new Uint8Array(32);
      data.fill(0xAB);
      const result = roundtrip(
        w => w.writeFixedOpaque(data, 32),
        r => r.readFixedOpaque(32)
      );
      expect(result).toEqual(data);
    });

    it("round-trips 3 bytes (with padding)", () => {
      const data = new Uint8Array([1, 2, 3]);
      const result = roundtrip(
        w => w.writeFixedOpaque(data, 3),
        r => r.readFixedOpaque(3)
      );
      expect(result).toEqual(data);
    });
  });

  describe("var opaque", () => {
    it("round-trips empty", () => {
      const data = new Uint8Array(0);
      const result = roundtrip(
        w => w.writeVarOpaque(data, 100),
        r => r.readVarOpaque(100)
      );
      expect(result).toEqual(data);
    });

    it("round-trips 5 bytes", () => {
      const data = new Uint8Array([1, 2, 3, 4, 5]);
      const result = roundtrip(
        w => w.writeVarOpaque(data, 100),
        r => r.readVarOpaque(100)
      );
      expect(result).toEqual(data);
    });
  });

  describe("string", () => {
    it("round-trips ASCII", () => {
      expect(roundtrip(w => w.writeString("hello", 100), r => r.readString(100))).toBe("hello");
    });

    it("round-trips empty", () => {
      expect(roundtrip(w => w.writeString("", 100), r => r.readString(100))).toBe("");
    });

    it("round-trips UTF-8", () => {
      expect(roundtrip(w => w.writeString("grüße", 100), r => r.readString(100))).toBe("grüße");
    });
  });

  describe("multiple values in sequence", () => {
    it("writes and reads back multiple values", () => {
      const w = new XdrWriter();
      w.writeUint32(1n);
      w.writeInt64(-100n);
      w.writeBool(true);
      w.writeString("test", 100);

      const r = new XdrReader(w.finish());
      expect(r.readUint32()).toBe(1n);
      expect(r.readInt64()).toBe(-100n);
      expect(r.readBool()).toBe(true);
      expect(r.readString(100)).toBe("test");
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run test/xdr/roundtrip.test.ts`
Expected: all PASS

- [ ] **Step 3: Commit**

```bash
git add test/xdr/roundtrip.test.ts
git commit -m "test: comprehensive XDR primitive round-trip tests"
```

---

### Task 6: Protocol Types — `types.ts`

**Files:**
- Create: `src/protocol/types.ts`
- Modify: `src/protocol/index.ts`
- Create: `test/protocol/types.test.ts`

This is the largest type file. It covers: enums, structs, branded types (bigint and Uint8Array), unions with enum and int discriminants, void arms, constants.

- [ ] **Step 1: Write failing tests for branded type factories**

Create `test/protocol/types.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  sha256Hash, SHA256Hash,
  contractAddress, ContractAddress,
  ed25519Signature, Ed25519Signature,
  ed25519PublicKey, Ed25519PublicKey,
  gasAmount, GasAmount,
  blockHeight, BlockHeight,
  StorageKeyType,
  CryptographicScheme,
  kTotalHogSupply,
  kHogDivisibility,
} from "../src/protocol/types.js";

describe("branded type factories", () => {
  it("sha256Hash accepts 32 bytes", () => {
    const data = new Uint8Array(32);
    const hash: SHA256Hash = sha256Hash(data);
    expect(hash).toBe(data);
  });

  it("sha256Hash rejects wrong length", () => {
    expect(() => sha256Hash(new Uint8Array(31))).toThrow();
    expect(() => sha256Hash(new Uint8Array(33))).toThrow();
  });

  it("contractAddress accepts 32 bytes", () => {
    const data = new Uint8Array(32);
    const addr: ContractAddress = contractAddress(data);
    expect(addr).toBe(data);
  });

  it("ed25519Signature accepts 64 bytes", () => {
    const data = new Uint8Array(64);
    const sig: Ed25519Signature = ed25519Signature(data);
    expect(sig).toBe(data);
  });

  it("ed25519PublicKey accepts 32 bytes", () => {
    const data = new Uint8Array(32);
    const pk: Ed25519PublicKey = ed25519PublicKey(data);
    expect(pk).toBe(data);
  });

  it("gasAmount brands a bigint", () => {
    const g: GasAmount = gasAmount(1000n);
    expect(g).toBe(1000n);
  });

  it("blockHeight brands a bigint", () => {
    const h: BlockHeight = blockHeight(42n);
    expect(h).toBe(42n);
  });
});

describe("enums", () => {
  it("StorageKeyType has correct values", () => {
    expect(StorageKeyType.kStorageKeyTypeContractData).toBe(0);
    expect(StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance).toBe(1);
    expect(StorageKeyType.kStorageKeyTypeAddressAuthData).toBe(2);
    expect(StorageKeyType.kStorageKeyTypeAddressMetadata).toBe(3);
    expect(StorageKeyType.kStorageKeyTypeReplayCache).toBe(4);
  });

  it("CryptographicScheme has correct values", () => {
    expect(CryptographicScheme.Ed25519).toBe(0);
  });
});

describe("constants", () => {
  it("kTotalHogSupply", () => {
    expect(kTotalHogSupply).toBe(62_500_000_000n);
  });

  it("kHogDivisibility", () => {
    expect(kHogDivisibility).toBe(10_000_000n);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/protocol/types.test.ts`
Expected: FAIL — cannot resolve `../src/protocol/types.js`

- [ ] **Step 3: Implement `src/protocol/types.ts`**

Create `src/protocol/types.ts`. This file maps directly from `protocol-rs/protocol/types.x`:

```typescript
// types.ts — Hand-written TypeScript from types.x
// This file serves as the reference for future gen_ts.cc codegen output.

// ============================================================================
// Branded bigint types
// ============================================================================

export type TimePoint = bigint & { readonly __brand: "TimePoint" };
export function timePoint(val: bigint): TimePoint {
  return val as TimePoint;
}

export type RuntimeMemoryLength = bigint & { readonly __brand: "RuntimeMemoryLength" };
export function runtimeMemoryLength(val: bigint): RuntimeMemoryLength {
  return val as RuntimeMemoryLength;
}

export type GasAmount = bigint & { readonly __brand: "GasAmount" };
export function gasAmount(val: bigint): GasAmount {
  return val as GasAmount;
}

export type BlockHeight = bigint & { readonly __brand: "BlockHeight" };
export function blockHeight(val: bigint): BlockHeight {
  return val as BlockHeight;
}

// ============================================================================
// Branded Uint8Array types (fixed-size opaque newtypes)
// ============================================================================

export type Ed25519Signature = Uint8Array & { readonly __brand: "Ed25519Signature" };
export function ed25519Signature(data: Uint8Array): Ed25519Signature {
  if (data.length !== 64) throw new Error(`Ed25519Signature must be exactly 64 bytes, got ${data.length}`);
  return data as Ed25519Signature;
}

export type Ed25519PublicKey = Uint8Array & { readonly __brand: "Ed25519PublicKey" };
export function ed25519PublicKey(data: Uint8Array): Ed25519PublicKey {
  if (data.length !== 32) throw new Error(`Ed25519PublicKey must be exactly 32 bytes, got ${data.length}`);
  return data as Ed25519PublicKey;
}

export type Ed25519SecretKey = Uint8Array & { readonly __brand: "Ed25519SecretKey" };
export function ed25519SecretKey(data: Uint8Array): Ed25519SecretKey {
  if (data.length !== 64) throw new Error(`Ed25519SecretKey must be exactly 64 bytes, got ${data.length}`);
  return data as Ed25519SecretKey;
}

export type SHA256Hash = Uint8Array & { readonly __brand: "SHA256Hash" };
export function sha256Hash(data: Uint8Array): SHA256Hash {
  if (data.length !== 32) throw new Error(`SHA256Hash must be exactly 32 bytes, got ${data.length}`);
  return data as SHA256Hash;
}

export type DbHash = Uint8Array & { readonly __brand: "DbHash" };
export function dbHash(data: Uint8Array): DbHash {
  if (data.length !== 2048) throw new Error(`DbHash must be exactly 2048 bytes, got ${data.length}`);
  return data as DbHash;
}

export type BlockHash = SHA256Hash & { readonly __brand: "BlockHash" };
export function blockHash(data: Uint8Array): BlockHash {
  if (data.length !== 32) throw new Error(`BlockHash must be exactly 32 bytes, got ${data.length}`);
  return data as BlockHash;
}

export type ContractAddress = Uint8Array & { readonly __brand: "ContractAddress" };
export function contractAddress(data: Uint8Array): ContractAddress {
  if (data.length !== 32) throw new Error(`ContractAddress must be exactly 32 bytes, got ${data.length}`);
  return data as ContractAddress;
}

export type StorageKeyContractData = Uint8Array & { readonly __brand: "StorageKeyContractData" };
export function storageKeyContractData(data: Uint8Array): StorageKeyContractData {
  if (data.length !== 32) throw new Error(`StorageKeyContractData must be exactly 32 bytes, got ${data.length}`);
  return data as StorageKeyContractData;
}

// ============================================================================
// Enums
// ============================================================================

export enum CryptographicScheme {
  Ed25519 = 0,
}

export enum StorageKeyType {
  kStorageKeyTypeContractData = 0,
  kStorageKeyTypeFreeNativeTokenBalance = 1,
  kStorageKeyTypeAddressAuthData = 2,
  kStorageKeyTypeAddressMetadata = 3,
  kStorageKeyTypeReplayCache = 4,
}

// ============================================================================
// Unions
// ============================================================================

export type Signature = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519Signature;
};

export type PublicKey = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519PublicKey;
};

export type SecretKey = {
  scheme: CryptographicScheme.Ed25519;
  ed25519: Ed25519SecretKey;
};

export type ExtensionPoint = { v: 0 };

export type StorageKey =
  | { key_type: StorageKeyType.kStorageKeyTypeContractData; contract_data_key: StorageKeyContractData }
  | { key_type: StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressAuthData }
  | { key_type: StorageKeyType.kStorageKeyTypeAddressMetadata }
  | { key_type: StorageKeyType.kStorageKeyTypeReplayCache };

// ============================================================================
// Structs
// ============================================================================

export interface AddressAndKey {
  address: ContractAddress;
  key: StorageKey;
}

// ============================================================================
// Constants
// ============================================================================

export const kTotalHogSupply = 62_500_000_000n;
export const kHogDivisibility = 10_000_000n;
```

- [ ] **Step 4: Export from `src/protocol/index.ts`**

Update `src/protocol/index.ts`:
```typescript
export * from "./types.js";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/protocol/types.test.ts`
Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add src/protocol/types.ts src/protocol/index.ts test/protocol/types.test.ts
git commit -m "feat: add protocol types from types.x (branded types, enums, unions, structs)"
```

---

### Task 7: Protocol Types — `precompiles.ts`, `contract.ts`

**Files:**
- Create: `src/protocol/precompiles.ts`
- Create: `src/protocol/contract.ts`
- Modify: `src/protocol/index.ts`
- Create: `test/protocol/contract.test.ts`

- [ ] **Step 1: Write failing tests**

Create `test/protocol/contract.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  HogexecPrecompiledNativeContracts,
  ContractType,
  contractEntrypointID, ContractEntrypointID,
} from "../src/protocol/index.js";

describe("precompiles", () => {
  it("HogexecPrecompiledNativeContracts has correct values", () => {
    expect(HogexecPrecompiledNativeContracts.kNativeContractHogToken).toBe(0);
    expect(HogexecPrecompiledNativeContracts.kNativeContractInitialTokenClaim).toBe(1);
  });
});

describe("contract types", () => {
  it("ContractType has correct values", () => {
    expect(ContractType.kWasmi).toBe(0);
    expect(ContractType.kNative).toBe(1);
    expect(ContractType.kMockTest).toBe(2);
  });

  it("contractEntrypointID accepts 8 bytes", () => {
    const data = new Uint8Array(8);
    const id: ContractEntrypointID = contractEntrypointID(data);
    expect(id).toBe(data);
  });

  it("contractEntrypointID rejects wrong length", () => {
    expect(() => contractEntrypointID(new Uint8Array(7))).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/protocol/contract.test.ts`
Expected: FAIL

- [ ] **Step 3: Create `src/protocol/precompiles.ts`**

```typescript
// precompiles.ts — from precompiles.x

export enum HogexecPrecompiledNativeContracts {
  kNativeContractHogToken = 0,
  kNativeContractInitialTokenClaim = 1,
}
```

- [ ] **Step 4: Create `src/protocol/contract.ts`**

```typescript
// contract.ts — from contract.x

import type { ContractAddress, SHA256Hash } from "./types.js";
import { HogexecPrecompiledNativeContracts } from "./precompiles.js";

// ============================================================================
// Branded types
// ============================================================================

export type ContractEntrypointID = Uint8Array & { readonly __brand: "ContractEntrypointID" };
export function contractEntrypointID(data: Uint8Array): ContractEntrypointID {
  if (data.length !== 8) throw new Error(`ContractEntrypointID must be exactly 8 bytes, got ${data.length}`);
  return data as ContractEntrypointID;
}

export type Identifier = string & { readonly __brand: "Identifier" };
export function identifier(val: string): Identifier {
  return val as Identifier;
}

export type SemVer = string & { readonly __brand: "SemVer" };
export function semVer(val: string): SemVer {
  return val as SemVer;
}

// ============================================================================
// Enums
// ============================================================================

export enum ContractType {
  kWasmi = 0,
  kNative = 1,
  kMockTest = 2,
}

// ============================================================================
// Structs
// ============================================================================

export interface ContractBlob {
  wasm: Uint8Array;
}

export interface ContractDeploymentHashPreimage {
  deployer_address: ContractAddress;
  nonce: SHA256Hash;
  contract_hash: SHA256Hash;
}

export interface ContractInterfaceIDPreimage {
  name: Identifier;
  vers: SemVer;
}

export interface DeployedContractHash {
  hash: SHA256Hash;
  contract_size: bigint;
  contract_type: ContractType;
}

export interface AddressMetadata {
  deployed_contract: DeployedContractHash;
}

// ============================================================================
// Unions
// ============================================================================

export type Contract =
  | { contract_type: ContractType.kWasmi; wasmi_contract: ContractBlob }
  | { contract_type: ContractType.kNative; native_contract_id: HogexecPrecompiledNativeContracts }
  | { contract_type: ContractType.kMockTest; mock_contract_id: bigint };
```

- [ ] **Step 5: Update `src/protocol/index.ts`**

Add:
```typescript
export * from "./precompiles.js";
export * from "./contract.js";
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run test/protocol/contract.test.ts`
Expected: all PASS

- [ ] **Step 7: Commit**

```bash
git add src/protocol/precompiles.ts src/protocol/contract.ts src/protocol/index.ts test/protocol/contract.test.ts
git commit -m "feat: add protocol types from precompiles.x and contract.x"
```

---

### Task 8: Protocol Types — `retrocausal_queue.ts`, `auth_claim.ts`, `transaction.ts`

**Files:**
- Create: `src/protocol/retrocausal_queue.ts`
- Create: `src/protocol/auth_claim.ts`
- Create: `src/protocol/transaction.ts`
- Modify: `src/protocol/index.ts`
- Create: `test/protocol/transaction.test.ts`

- [ ] **Step 1: Write failing tests**

Create `test/protocol/transaction.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  calldata, Calldata,
  returnBuffer, ReturnBuffer,
  kMaxReturnBufferLen,
  InvocationFrameStatusCode,
  InvokeFlag,
  AuthClaimType,
  kMaxSigners,
  kMaxAuthClaims,
  kQueueEntryMaxLen,
  queueEntry, QueueEntry,
} from "../src/protocol/index.js";

describe("transaction branded types", () => {
  it("calldata accepts any length (unbounded)", () => {
    const data = new Uint8Array(500);
    const c: Calldata = calldata(data);
    expect(c).toBe(data);
  });

  it("returnBuffer accepts up to kMaxReturnBufferLen", () => {
    const data = new Uint8Array(1024);
    const rb: ReturnBuffer = returnBuffer(data);
    expect(rb).toBe(data);
  });

  it("returnBuffer rejects over max", () => {
    expect(() => returnBuffer(new Uint8Array(1025))).toThrow();
  });

  it("queueEntry accepts up to kQueueEntryMaxLen", () => {
    const data = new Uint8Array(256);
    const qe: QueueEntry = queueEntry(data);
    expect(qe).toBe(data);
  });

  it("queueEntry rejects over max", () => {
    expect(() => queueEntry(new Uint8Array(257))).toThrow();
  });
});

describe("transaction enums", () => {
  it("InvocationFrameStatusCode", () => {
    expect(InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn).toBe(0);
    expect(InvocationFrameStatusCode.kInvocationFrameStatusCodeFault).toBe(1);
    expect(InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort).toBe(2);
  });

  it("InvokeFlag", () => {
    expect(InvokeFlag.kInvokeFlagNone).toBe(0);
    expect(InvokeFlag.kInvokeFlagTryInvoke).toBe(0x00000001);
    expect(InvokeFlag.kInvokeFlagReadOnly).toBe(0x00000002);
    expect(InvokeFlag.kInvokeFlagDelegateCall).toBe(0x00000004);
  });
});

describe("auth_claim enums", () => {
  it("AuthClaimType", () => {
    expect(AuthClaimType.kInvokedAddressSignature).toBe(0);
    expect(AuthClaimType.kPubkeySignature).toBe(4);
  });
});

describe("constants", () => {
  it("kMaxReturnBufferLen", () => {
    expect(kMaxReturnBufferLen).toBe(1024n);
  });
  it("kMaxSigners", () => {
    expect(kMaxSigners).toBe(21n);
  });
  it("kMaxAuthClaims", () => {
    expect(kMaxAuthClaims).toBe(10n);
  });
  it("kQueueEntryMaxLen", () => {
    expect(kQueueEntryMaxLen).toBe(256n);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/protocol/transaction.test.ts`
Expected: FAIL

- [ ] **Step 3: Create `src/protocol/retrocausal_queue.ts`**

```typescript
// retrocausal_queue.ts — from retrocausal_queue.x

export const kQueueEntryMaxLen = 256n;

export type QueueEntry = Uint8Array & { readonly __brand: "QueueEntry" };
export function queueEntry(data: Uint8Array): QueueEntry {
  if (data.length > Number(kQueueEntryMaxLen)) {
    throw new Error(`QueueEntry exceeds max length ${kQueueEntryMaxLen}, got ${data.length}`);
  }
  return data as QueueEntry;
}
```

- [ ] **Step 4: Create `src/protocol/auth_claim.ts`**

```typescript
// auth_claim.ts — from auth_claim.x

import type { ContractAddress, PublicKey } from "./types.js";

// ============================================================================
// Branded bigint types
// ============================================================================

export type Weight = bigint & { readonly __brand: "Weight" };
export function weight(val: bigint): Weight { return val as Weight; }

export type BitMap = bigint & { readonly __brand: "BitMap" };
export function bitMap(val: bigint): BitMap { return val as BitMap; }

export type KeyID = bigint & { readonly __brand: "KeyID" };
export function keyID(val: bigint): KeyID { return val as KeyID; }

// ============================================================================
// Constants
// ============================================================================

export const kMaxSigners = 21n;
export const kMaxGasConfigs = 5n;
export const kMaxAuthClaims = 10n;

// ============================================================================
// Enums
// ============================================================================

export enum AuthClaimType {
  kInvokedAddressSignature = 0,
  kInvokedAddressSignedWeight = 1,
  kOtherAddressSignature = 2,
  kOtherAddressSignedWeight = 3,
  kPubkeySignature = 4,
}

export enum AuthVerifyErrorCode {
  kAuthMalformed = 1,
  kSignatureVerificationFailed = 2,
  kAuthDataMismatch = 3,
}

// ============================================================================
// Structs (including anonymous structs extracted from union arms)
// ============================================================================

export interface PubkeyAccountPreimage {
  pubkey: PublicKey;
  nonce: bigint;
}

export interface AuthClaim_InvokedAddressSignedWeight {
  accepted_keys: BitMap;
  required_weight: Weight;
}

export interface AuthClaim_OtherAddressSignature {
  address: ContractAddress;
  key_id: KeyID;
}

export interface AuthClaim_OtherAddressSignedWeight {
  address: ContractAddress;
  accepted_keys: BitMap;
  required_weight: Weight;
}

// ============================================================================
// Unions
// ============================================================================

export type AuthClaim =
  | { claim_type: AuthClaimType.kInvokedAddressSignature; invoked_address_signature_id: KeyID }
  | { claim_type: AuthClaimType.kInvokedAddressSignedWeight; invoked_address_signed_weight: AuthClaim_InvokedAddressSignedWeight }
  | { claim_type: AuthClaimType.kOtherAddressSignature; other_address_signature_id: AuthClaim_OtherAddressSignature }
  | { claim_type: AuthClaimType.kOtherAddressSignedWeight; other_address_signed_weight: AuthClaim_OtherAddressSignedWeight }
  | { claim_type: AuthClaimType.kPubkeySignature; pubkey_preimage: PubkeyAccountPreimage };

// ============================================================================
// Typedefs
// ============================================================================

export type AuthClaimData = AuthClaim[];
```

- [ ] **Step 5: Create `src/protocol/transaction.ts`**

```typescript
// transaction.ts — from transaction.x

import type { ContractAddress, GasAmount, BlockHeight, SHA256Hash, Signature } from "./types.js";
import type { ContractEntrypointID, Contract } from "./contract.js";
import type { AuthClaimData } from "./auth_claim.js";
import type { QueueEntry } from "./retrocausal_queue.js";

// ============================================================================
// Branded types
// ============================================================================

export type Calldata = Uint8Array & { readonly __brand: "Calldata" };
export function calldata(data: Uint8Array): Calldata {
  // Calldata is typedef opaque Calldata<> — unbounded
  return data as Calldata;
}

export const kMaxReturnBufferLen = 1024n;

export type ReturnBuffer = Uint8Array & { readonly __brand: "ReturnBuffer" };
export function returnBuffer(data: Uint8Array): ReturnBuffer {
  if (data.length > Number(kMaxReturnBufferLen)) {
    throw new Error(`ReturnBuffer exceeds max length ${kMaxReturnBufferLen}, got ${data.length}`);
  }
  return data as ReturnBuffer;
}

export type InvokeFlagSet = bigint & { readonly __brand: "InvokeFlagSet" };
export function invokeFlagSet(val: bigint): InvokeFlagSet { return val as InvokeFlagSet; }

export type SignedTransactionHash = SHA256Hash;

// ============================================================================
// Enums
// ============================================================================

export enum InvocationFrameStatusCode {
  kInvocationFrameStatusCodeReturn = 0,
  kInvocationFrameStatusCodeFault = 1,
  kInvocationFrameStatusCodeAbort = 2,
}

export enum InvokeFlag {
  kInvokeFlagNone = 0,
  kInvokeFlagTryInvoke = 0x00000001,
  kInvokeFlagReadOnly = 0x00000002,
  kInvokeFlagDelegateCall = 0x00000004,
}

export enum TransactionStatistic {
  kTxStatGasRemaining = 0,
}

// ============================================================================
// Structs
// ============================================================================

export interface GasClaim {
  sponsored_contract: ContractAddress;
  amount: GasAmount;
}

export interface Invocation {
  invoked_address: ContractAddress;
  entrypoint: ContractEntrypointID;
  gas_limit: GasAmount;
  calldata: Calldata;
}

export interface Uniquifier {
  block_expiry_height: BlockHeight;
  nonce: bigint;
}

export interface Transaction {
  invocation: Invocation;
  uniquifier: Uniquifier;
  contracts_to_deploy: Contract[];
  auth_claims: AuthClaimData;
  gas_claims: GasClaim[];
}

export interface DecoratedSignature {
  auth_claim_idx: bigint;
  public_key_id: bigint;
  signature: Signature;
}

export interface SignedTransaction {
  tx: Transaction;
  signatures: DecoratedSignature[];
}

export interface NondeterministicProposalData {
  nondeterministic_bits: Uint8Array;
  nondeterministic_bit_count: bigint;
  observed_queue_entry_sequence: QueueEntry[];
}

export interface ProposedTransaction {
  signed_tx: SignedTransaction;
  nondeterministic_proposal_data: NondeterministicProposalData;
}

// ============================================================================
// Unions
// ============================================================================

export type InvocationFrameOutput =
  | { status_code: InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn; return_buffer: ReturnBuffer }
  | { status_code: InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort; abort_buffer: ReturnBuffer }
  | { status_code: InvocationFrameStatusCode.kInvocationFrameStatusCodeFault };

// ============================================================================
// Batch typedefs
// ============================================================================

export type TransactionBatch = Transaction[];
export type SignedTransactionBatch = SignedTransaction[];
export type SignedTransactionHashBatch = SignedTransactionHash[];
export type OptSignedTransaction = SignedTransaction | null;
export type OptSignedTransactionBatch = OptSignedTransaction[];
```

- [ ] **Step 6: Update `src/protocol/index.ts`**

Add:
```typescript
export * from "./retrocausal_queue.js";
export * from "./auth_claim.js";
export * from "./transaction.js";
```

- [ ] **Step 7: Run typecheck to verify all cross-file references resolve**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 8: Run tests**

Run: `npx vitest run test/protocol/transaction.test.ts`
Expected: all PASS

- [ ] **Step 9: Commit**

```bash
git add src/protocol/retrocausal_queue.ts src/protocol/auth_claim.ts src/protocol/transaction.ts src/protocol/index.ts test/protocol/transaction.test.ts
git commit -m "feat: add protocol types from auth_claim.x, retrocausal_queue.x, transaction.x"
```

---

### Task 9: Protocol Codecs — `types.ts` Codecs

**Files:**
- Create: `src/protocol/codecs/types.ts`
- Create: `src/protocol/codecs/index.ts`
- Modify: `src/xdr/index.ts`
- Create: `test/protocol/codecs/types.test.ts`

This task implements the codec objects for all types in `types.x`, enabling XDR serialization of the core types.

- [ ] **Step 1: Write failing round-trip tests**

Create `test/protocol/codecs/types.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { serialize, deserialize } from "../../../src/xdr/codec.js";
import * as codecs from "../../../src/protocol/codecs/types.js";
import {
  sha256Hash, contractAddress, ed25519PublicKey, ed25519Signature,
  storageKeyContractData,
  CryptographicScheme, StorageKeyType,
  type PublicKey, type StorageKey, type ExtensionPoint, type AddressAndKey,
} from "../../../src/protocol/types.js";

describe("types.x codecs round-trip", () => {
  it("SHA256Hash", () => {
    const data = new Uint8Array(32).fill(0xAB);
    const hash = sha256Hash(data);
    const bytes = serialize(hash, codecs.SHA256Hash);
    const decoded = deserialize(bytes, codecs.SHA256Hash);
    expect(decoded).toEqual(hash);
  });

  it("ContractAddress", () => {
    const data = new Uint8Array(32).fill(0x01);
    const addr = contractAddress(data);
    const bytes = serialize(addr, codecs.ContractAddress);
    expect(deserialize(bytes, codecs.ContractAddress)).toEqual(addr);
  });

  it("PublicKey (Ed25519)", () => {
    const pk: PublicKey = {
      scheme: CryptographicScheme.Ed25519,
      ed25519: ed25519PublicKey(new Uint8Array(32).fill(0x42)),
    };
    const bytes = serialize(pk, codecs.PublicKey);
    const decoded = deserialize(bytes, codecs.PublicKey);
    expect(decoded).toEqual(pk);
  });

  it("StorageKey (ContractData variant)", () => {
    const sk: StorageKey = {
      key_type: StorageKeyType.kStorageKeyTypeContractData,
      contract_data_key: storageKeyContractData(new Uint8Array(32).fill(0xFF)),
    };
    const bytes = serialize(sk, codecs.StorageKey);
    expect(deserialize(bytes, codecs.StorageKey)).toEqual(sk);
  });

  it("StorageKey (void variant — FreeNativeTokenBalance)", () => {
    const sk: StorageKey = {
      key_type: StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance,
    };
    const bytes = serialize(sk, codecs.StorageKey);
    expect(deserialize(bytes, codecs.StorageKey)).toEqual(sk);
  });

  it("ExtensionPoint", () => {
    const ep: ExtensionPoint = { v: 0 };
    const bytes = serialize(ep, codecs.ExtensionPoint);
    // Should be just 4 bytes: int 0
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 0]));
    expect(deserialize(bytes, codecs.ExtensionPoint)).toEqual(ep);
  });

  it("AddressAndKey", () => {
    const val: AddressAndKey = {
      address: contractAddress(new Uint8Array(32).fill(0x01)),
      key: { key_type: StorageKeyType.kStorageKeyTypeReplayCache },
    };
    const bytes = serialize(val, codecs.AddressAndKey);
    expect(deserialize(bytes, codecs.AddressAndKey)).toEqual(val);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/protocol/codecs/types.test.ts`
Expected: FAIL — cannot resolve codecs module

- [ ] **Step 3: Implement codecs for types.x**

Create `src/protocol/codecs/types.ts`:

```typescript
import type { XdrCodec } from "../../xdr/codec.js";
import { XdrWriter } from "../../xdr/writer.js";
import { XdrReader } from "../../xdr/reader.js";
import {
  sha256Hash, dbHash, blockHash, contractAddress,
  ed25519Signature, ed25519PublicKey, ed25519SecretKey,
  storageKeyContractData,
  CryptographicScheme, StorageKeyType,
} from "../types.js";
import type {
  SHA256Hash as SHA256HashType,
  DbHash as DbHashType,
  BlockHash as BlockHashType,
  ContractAddress as ContractAddressType,
  Ed25519Signature as Ed25519SignatureType,
  Ed25519PublicKey as Ed25519PublicKeyType,
  Ed25519SecretKey as Ed25519SecretKeyType,
  StorageKeyContractData as StorageKeyContractDataType,
  PublicKey as PublicKeyType,
  SecretKey as SecretKeyType,
  Signature as SignatureType,
  StorageKey as StorageKeyType_,
  ExtensionPoint as ExtensionPointType,
  AddressAndKey as AddressAndKeyType,
} from "../types.js";

// Fixed-size opaque branded types
export const SHA256Hash: XdrCodec<SHA256HashType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return sha256Hash(r.readFixedOpaque(32)); },
};

export const DbHash: XdrCodec<DbHashType> = {
  encode(w, val) { w.writeFixedOpaque(val, 2048); },
  decode(r) { return dbHash(r.readFixedOpaque(2048)); },
};

export const BlockHash: XdrCodec<BlockHashType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return blockHash(r.readFixedOpaque(32)); },
};

export const ContractAddress: XdrCodec<ContractAddressType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return contractAddress(r.readFixedOpaque(32)); },
};

export const Ed25519Signature: XdrCodec<Ed25519SignatureType> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519Signature(r.readFixedOpaque(64)); },
};

export const Ed25519PublicKey: XdrCodec<Ed25519PublicKeyType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return ed25519PublicKey(r.readFixedOpaque(32)); },
};

export const Ed25519SecretKey: XdrCodec<Ed25519SecretKeyType> = {
  encode(w, val) { w.writeFixedOpaque(val, 64); },
  decode(r) { return ed25519SecretKey(r.readFixedOpaque(64)); },
};

export const StorageKeyContractData: XdrCodec<StorageKeyContractDataType> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return storageKeyContractData(r.readFixedOpaque(32)); },
};

// Unions
export const PublicKey: XdrCodec<PublicKeyType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519PublicKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        return { scheme, ed25519: Ed25519PublicKey.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const Signature: XdrCodec<SignatureType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519Signature.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        return { scheme, ed25519: Ed25519Signature.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const SecretKey: XdrCodec<SecretKeyType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.scheme));
    switch (val.scheme) {
      case CryptographicScheme.Ed25519:
        Ed25519SecretKey.encode(w, val.ed25519);
        break;
    }
  },
  decode(r) {
    const scheme = Number(r.readInt32());
    switch (scheme) {
      case CryptographicScheme.Ed25519:
        return { scheme, ed25519: Ed25519SecretKey.decode(r) };
      default:
        throw new Error(`Unknown CryptographicScheme: ${scheme}`);
    }
  },
};

export const ExtensionPoint: XdrCodec<ExtensionPointType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.v));
  },
  decode(r) {
    const v = Number(r.readInt32());
    if (v !== 0) throw new Error(`Unknown ExtensionPoint variant: ${v}`);
    return { v: 0 as const };
  },
};

export const StorageKey: XdrCodec<StorageKeyType_> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.key_type));
    if (val.key_type === StorageKeyType.kStorageKeyTypeContractData) {
      StorageKeyContractData.encode(w, val.contract_data_key);
    }
    // void arms: nothing to write
  },
  decode(r) {
    const key_type = Number(r.readInt32());
    switch (key_type) {
      case StorageKeyType.kStorageKeyTypeContractData:
        return { key_type, contract_data_key: StorageKeyContractData.decode(r) };
      case StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance:
      case StorageKeyType.kStorageKeyTypeAddressAuthData:
      case StorageKeyType.kStorageKeyTypeAddressMetadata:
      case StorageKeyType.kStorageKeyTypeReplayCache:
        return { key_type } as StorageKeyType_;
      default:
        throw new Error(`Unknown StorageKeyType: ${key_type}`);
    }
  },
};

// Structs
export const AddressAndKey: XdrCodec<AddressAndKeyType> = {
  encode(w, val) {
    ContractAddress.encode(w, val.address);
    StorageKey.encode(w, val.key);
  },
  decode(r) {
    return {
      address: ContractAddress.decode(r),
      key: StorageKey.decode(r),
    };
  },
};
```

- [ ] **Step 4: Create `src/protocol/codecs/index.ts`**

```typescript
export * from "./types.js";
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run test/protocol/codecs/types.test.ts`
Expected: all PASS

- [ ] **Step 7: Commit**

```bash
git add src/protocol/codecs/ test/protocol/codecs/
git commit -m "feat: add XDR codecs for types.x (round-trip serialization)"
```

---

### Task 10: Protocol Codecs — `contract.ts` and `transaction.ts` Codecs

**Files:**
- Create: `src/protocol/codecs/contract.ts`
- Create: `src/protocol/codecs/auth_claim.ts`
- Create: `src/protocol/codecs/transaction.ts`
- Modify: `src/protocol/codecs/index.ts`
- Create: `test/protocol/codecs/transaction.test.ts`

- [ ] **Step 1: Write failing test for Invocation round-trip**

Create `test/protocol/codecs/transaction.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { serialize, deserialize } from "../../../src/xdr/codec.js";
import * as codecs from "../../../src/protocol/codecs/index.js";
import {
  contractAddress, contractEntrypointID, gasAmount,
  calldata, blockHeight, ed25519PublicKey, ed25519Signature,
  keyID, bitMap, weight,
  CryptographicScheme, AuthClaimType,
  type Invocation, type Uniquifier, type SignedTransaction, type AuthClaim,
} from "../../../src/protocol/index.js";

describe("transaction codecs round-trip", () => {
  it("Invocation", () => {
    const inv: Invocation = {
      invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
      entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xAB)),
      gas_limit: gasAmount(1000000n),
      calldata: calldata(new Uint8Array([1, 2, 3, 4])),
    };
    const bytes = serialize(inv, codecs.Invocation);
    const decoded = deserialize(bytes, codecs.Invocation);
    expect(decoded).toEqual(inv);
  });

  it("Uniquifier", () => {
    const u: Uniquifier = {
      block_expiry_height: blockHeight(100n),
      nonce: 42n,
    };
    const bytes = serialize(u, codecs.Uniquifier);
    expect(deserialize(bytes, codecs.Uniquifier)).toEqual(u);
  });
});

describe("auth_claim codecs round-trip", () => {
  it("AuthClaim — kInvokedAddressSignature", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kInvokedAddressSignature,
      invoked_address_signature_id: keyID(3n),
    };
    const bytes = serialize(claim, codecs.AuthClaim);
    expect(deserialize(bytes, codecs.AuthClaim)).toEqual(claim);
  });

  it("AuthClaim — kInvokedAddressSignedWeight (anonymous struct arm)", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kInvokedAddressSignedWeight,
      invoked_address_signed_weight: {
        accepted_keys: bitMap(0b111n),
        required_weight: weight(2n),
      },
    };
    const bytes = serialize(claim, codecs.AuthClaim);
    expect(deserialize(bytes, codecs.AuthClaim)).toEqual(claim);
  });

  it("AuthClaim — kOtherAddressSignature (anonymous struct arm)", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kOtherAddressSignature,
      other_address_signature_id: {
        address: contractAddress(new Uint8Array(32).fill(0xBB)),
        key_id: keyID(1n),
      },
    };
    const bytes = serialize(claim, codecs.AuthClaim);
    expect(deserialize(bytes, codecs.AuthClaim)).toEqual(claim);
  });

  it("AuthClaim — kOtherAddressSignedWeight (anonymous struct arm)", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kOtherAddressSignedWeight,
      other_address_signed_weight: {
        address: contractAddress(new Uint8Array(32).fill(0xCC)),
        accepted_keys: bitMap(0b1111n),
        required_weight: weight(3n),
      },
    };
    const bytes = serialize(claim, codecs.AuthClaim);
    expect(deserialize(bytes, codecs.AuthClaim)).toEqual(claim);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/protocol/codecs/transaction.test.ts`
Expected: FAIL

- [ ] **Step 3: Create `src/protocol/codecs/contract.ts`**

```typescript
import type { XdrCodec } from "../../xdr/codec.js";
import {
  contractEntrypointID,
  ContractType,
  HogexecPrecompiledNativeContracts,
} from "../index.js";
import type {
  ContractEntrypointID as ContractEntrypointIDType,
  ContractBlob as ContractBlobType,
  Contract as ContractType_,
  Identifier as IdentifierType,
  SemVer as SemVerType,
  ContractInterfaceIDPreimage as ContractInterfaceIDPreimageType,
  ContractDeploymentHashPreimage as ContractDeploymentHashPreimageType,
  DeployedContractHash as DeployedContractHashType,
  AddressMetadata as AddressMetadataType,
} from "../contract.js";
import { identifier, semVer } from "../contract.js";
import * as typesCodecs from "./types.js";

export const ContractEntrypointID: XdrCodec<ContractEntrypointIDType> = {
  encode(w, val) { w.writeFixedOpaque(val, 8); },
  decode(r) { return contractEntrypointID(r.readFixedOpaque(8)); },
};

export const ContractBlob: XdrCodec<ContractBlobType> = {
  encode(w, val) { w.writeVarOpaque(val.wasm, 0xFFFFFFFF); },
  decode(r) { return { wasm: r.readVarOpaque(0xFFFFFFFF) }; },
};

export const Identifier: XdrCodec<IdentifierType> = {
  encode(w, val) { w.writeString(val, 0xFFFFFFFF); },
  decode(r) { return identifier(r.readString(0xFFFFFFFF)); },
};

export const SemVer: XdrCodec<SemVerType> = {
  encode(w, val) { w.writeString(val, 0xFFFFFFFF); },
  decode(r) { return semVer(r.readString(0xFFFFFFFF)); },
};

export const Contract: XdrCodec<ContractType_> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.contract_type));
    switch (val.contract_type) {
      case ContractType.kWasmi:
        ContractBlob.encode(w, val.wasmi_contract);
        break;
      case ContractType.kNative:
        w.writeInt32(BigInt(val.native_contract_id));
        break;
      case ContractType.kMockTest:
        w.writeInt32(val.mock_contract_id);
        break;
    }
  },
  decode(r) {
    const contract_type = Number(r.readInt32());
    switch (contract_type) {
      case ContractType.kWasmi:
        return { contract_type, wasmi_contract: ContractBlob.decode(r) };
      case ContractType.kNative:
        return { contract_type, native_contract_id: Number(r.readInt32()) as HogexecPrecompiledNativeContracts };
      case ContractType.kMockTest:
        return { contract_type, mock_contract_id: r.readInt32() };
      default:
        throw new Error(`Unknown ContractType: ${contract_type}`);
    }
  },
};

export const ContractDeploymentHashPreimage: XdrCodec<ContractDeploymentHashPreimageType> = {
  encode(w, val) {
    typesCodecs.ContractAddress.encode(w, val.deployer_address);
    typesCodecs.SHA256Hash.encode(w, val.nonce);
    typesCodecs.SHA256Hash.encode(w, val.contract_hash);
  },
  decode(r) {
    return {
      deployer_address: typesCodecs.ContractAddress.decode(r),
      nonce: typesCodecs.SHA256Hash.decode(r),
      contract_hash: typesCodecs.SHA256Hash.decode(r),
    };
  },
};

export const ContractInterfaceIDPreimage: XdrCodec<ContractInterfaceIDPreimageType> = {
  encode(w, val) {
    Identifier.encode(w, val.name);
    SemVer.encode(w, val.vers);
  },
  decode(r) {
    return { name: Identifier.decode(r), vers: SemVer.decode(r) };
  },
};

export const DeployedContractHash: XdrCodec<DeployedContractHashType> = {
  encode(w, val) {
    typesCodecs.SHA256Hash.encode(w, val.hash);
    w.writeUint32(val.contract_size);
    w.writeInt32(BigInt(val.contract_type));
  },
  decode(r) {
    return {
      hash: typesCodecs.SHA256Hash.decode(r),
      contract_size: r.readUint32(),
      contract_type: Number(r.readInt32()) as ContractType,
    };
  },
};

export const AddressMetadata: XdrCodec<AddressMetadataType> = {
  encode(w, val) { DeployedContractHash.encode(w, val.deployed_contract); },
  decode(r) { return { deployed_contract: DeployedContractHash.decode(r) }; },
};
```

- [ ] **Step 4: Create `src/protocol/codecs/auth_claim.ts`**

```typescript
import type { XdrCodec } from "../../xdr/codec.js";
import { AuthClaimType, keyID, bitMap, weight } from "../auth_claim.js";
import type {
  AuthClaim as AuthClaimType_,
  AuthClaimData as AuthClaimDataType,
  AuthClaim_InvokedAddressSignedWeight,
  AuthClaim_OtherAddressSignature,
  AuthClaim_OtherAddressSignedWeight,
  PubkeyAccountPreimage as PubkeyAccountPreimageType,
} from "../auth_claim.js";
import { kMaxAuthClaims } from "../auth_claim.js";
import * as typesCodecs from "./types.js";

export const PubkeyAccountPreimage: XdrCodec<PubkeyAccountPreimageType> = {
  encode(w, val) {
    typesCodecs.PublicKey.encode(w, val.pubkey);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    return { pubkey: typesCodecs.PublicKey.decode(r), nonce: r.readUint64() };
  },
};

export const AuthClaim: XdrCodec<AuthClaimType_> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.claim_type));
    switch (val.claim_type) {
      case AuthClaimType.kInvokedAddressSignature:
        w.writeUint32(val.invoked_address_signature_id);
        break;
      case AuthClaimType.kInvokedAddressSignedWeight:
        w.writeUint32(val.invoked_address_signed_weight.accepted_keys);
        w.writeUint32(val.invoked_address_signed_weight.required_weight);
        break;
      case AuthClaimType.kOtherAddressSignature:
        typesCodecs.ContractAddress.encode(w, val.other_address_signature_id.address);
        w.writeUint32(val.other_address_signature_id.key_id);
        break;
      case AuthClaimType.kOtherAddressSignedWeight:
        typesCodecs.ContractAddress.encode(w, val.other_address_signed_weight.address);
        w.writeUint32(val.other_address_signed_weight.accepted_keys);
        w.writeUint32(val.other_address_signed_weight.required_weight);
        break;
      case AuthClaimType.kPubkeySignature:
        PubkeyAccountPreimage.encode(w, val.pubkey_preimage);
        break;
    }
  },
  decode(r) {
    const claim_type = Number(r.readInt32());
    switch (claim_type) {
      case AuthClaimType.kInvokedAddressSignature:
        return { claim_type, invoked_address_signature_id: keyID(r.readUint32()) };
      case AuthClaimType.kInvokedAddressSignedWeight:
        return {
          claim_type,
          invoked_address_signed_weight: {
            accepted_keys: bitMap(r.readUint32()),
            required_weight: weight(r.readUint32()),
          },
        };
      case AuthClaimType.kOtherAddressSignature:
        return {
          claim_type,
          other_address_signature_id: {
            address: typesCodecs.ContractAddress.decode(r),
            key_id: keyID(r.readUint32()),
          },
        };
      case AuthClaimType.kOtherAddressSignedWeight:
        return {
          claim_type,
          other_address_signed_weight: {
            address: typesCodecs.ContractAddress.decode(r),
            accepted_keys: bitMap(r.readUint32()),
            required_weight: weight(r.readUint32()),
          },
        };
      case AuthClaimType.kPubkeySignature:
        return { claim_type, pubkey_preimage: PubkeyAccountPreimage.decode(r) };
      default:
        throw new Error(`Unknown AuthClaimType: ${claim_type}`);
    }
  },
};

export const AuthClaimData: XdrCodec<AuthClaimDataType> = {
  encode(w, val) {
    if (val.length > Number(kMaxAuthClaims)) throw new Error(`AuthClaimData length ${val.length} exceeds max ${kMaxAuthClaims}`);
    w.writeUint32(BigInt(val.length));
    for (const item of val) AuthClaim.encode(w, item);
  },
  decode(r) {
    const len = Number(r.readUint32());
    if (len > Number(kMaxAuthClaims)) throw new Error(`AuthClaimData length ${len} exceeds max ${kMaxAuthClaims}`);
    const result: AuthClaimDataType = [];
    for (let i = 0; i < len; i++) result.push(AuthClaim.decode(r));
    return result;
  },
};
```

- [ ] **Step 5: Create `src/protocol/codecs/transaction.ts`**

```typescript
import type { XdrCodec } from "../../xdr/codec.js";
import { InvocationFrameStatusCode } from "../transaction.js";
import { calldata, returnBuffer } from "../transaction.js";
import { queueEntry } from "../retrocausal_queue.js";
import type {
  Calldata as CalldataType,
  ReturnBuffer as ReturnBufferType,
  GasClaim as GasClaimType,
  Invocation as InvocationType,
  Uniquifier as UniquifierType,
  Transaction as TransactionType,
  DecoratedSignature as DecoratedSignatureType,
  SignedTransaction as SignedTransactionType,
  InvocationFrameOutput as InvocationFrameOutputType,
  NondeterministicProposalData as NondeterministicProposalDataType,
  ProposedTransaction as ProposedTransactionType,
} from "../transaction.js";
import { gasAmount, blockHeight } from "../types.js";
import * as typesCodecs from "./types.js";
import * as contractCodecs from "./contract.js";
import * as authCodecs from "./auth_claim.js";

export const Calldata: XdrCodec<CalldataType> = {
  encode(w, val) { w.writeVarOpaque(val, 0xFFFFFFFF); },
  decode(r) { return calldata(r.readVarOpaque(0xFFFFFFFF)); },
};

export const ReturnBuffer: XdrCodec<ReturnBufferType> = {
  encode(w, val) { w.writeVarOpaque(val, 1024); },
  decode(r) { return returnBuffer(r.readVarOpaque(1024)); },
};

export const GasClaim: XdrCodec<GasClaimType> = {
  encode(w, val) {
    typesCodecs.ContractAddress.encode(w, val.sponsored_contract);
    w.writeUint64(val.amount);
  },
  decode(r) {
    return {
      sponsored_contract: typesCodecs.ContractAddress.decode(r),
      amount: gasAmount(r.readUint64()),
    };
  },
};

export const Invocation: XdrCodec<InvocationType> = {
  encode(w, val) {
    typesCodecs.ContractAddress.encode(w, val.invoked_address);
    contractCodecs.ContractEntrypointID.encode(w, val.entrypoint);
    w.writeUint64(val.gas_limit);
    Calldata.encode(w, val.calldata);
  },
  decode(r) {
    return {
      invoked_address: typesCodecs.ContractAddress.decode(r),
      entrypoint: contractCodecs.ContractEntrypointID.decode(r),
      gas_limit: gasAmount(r.readUint64()),
      calldata: Calldata.decode(r),
    };
  },
};

export const Uniquifier: XdrCodec<UniquifierType> = {
  encode(w, val) {
    w.writeInt64(val.block_expiry_height);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    return {
      block_expiry_height: blockHeight(r.readInt64()),
      nonce: r.readUint64(),
    };
  },
};

export const DecoratedSignature: XdrCodec<DecoratedSignatureType> = {
  encode(w, val) {
    w.writeUint32(val.auth_claim_idx);
    w.writeUint32(val.public_key_id);
    typesCodecs.Signature.encode(w, val.signature);
  },
  decode(r) {
    return {
      auth_claim_idx: r.readUint32(),
      public_key_id: r.readUint32(),
      signature: typesCodecs.Signature.decode(r),
    };
  },
};

function varArray<T>(codec: XdrCodec<T>, max: number = 0xFFFFFFFF): XdrCodec<T[]> {
  return {
    encode(w, val) {
      if (val.length > max) throw new Error(`array length ${val.length} exceeds max ${max}`);
      w.writeUint32(BigInt(val.length));
      for (const item of val) codec.encode(w, item);
    },
    decode(r) {
      const len = Number(r.readUint32());
      if (len > max) throw new Error(`array length ${len} exceeds max ${max}`);
      const result: T[] = [];
      for (let i = 0; i < len; i++) result.push(codec.decode(r));
      return result;
    },
  };
}

const ContractArray = varArray(contractCodecs.Contract);
const GasClaimArray = varArray(GasClaim);
const DecoratedSignatureArray = varArray(DecoratedSignature);

export const Transaction: XdrCodec<TransactionType> = {
  encode(w, val) {
    Invocation.encode(w, val.invocation);
    Uniquifier.encode(w, val.uniquifier);
    ContractArray.encode(w, val.contracts_to_deploy);
    authCodecs.AuthClaimData.encode(w, val.auth_claims);
    GasClaimArray.encode(w, val.gas_claims);
  },
  decode(r) {
    return {
      invocation: Invocation.decode(r),
      uniquifier: Uniquifier.decode(r),
      contracts_to_deploy: ContractArray.decode(r),
      auth_claims: authCodecs.AuthClaimData.decode(r),
      gas_claims: GasClaimArray.decode(r),
    };
  },
};

export const SignedTransaction: XdrCodec<SignedTransactionType> = {
  encode(w, val) {
    Transaction.encode(w, val.tx);
    DecoratedSignatureArray.encode(w, val.signatures);
  },
  decode(r) {
    return {
      tx: Transaction.decode(r),
      signatures: DecoratedSignatureArray.decode(r),
    };
  },
};

export const InvocationFrameOutput: XdrCodec<InvocationFrameOutputType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.status_code));
    switch (val.status_code) {
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        ReturnBuffer.encode(w, val.return_buffer);
        break;
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        ReturnBuffer.encode(w, val.abort_buffer);
        break;
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        break;
    }
  },
  decode(r) {
    const status_code = Number(r.readInt32());
    switch (status_code) {
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        return { status_code, return_buffer: ReturnBuffer.decode(r) };
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        return { status_code, abort_buffer: ReturnBuffer.decode(r) };
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        return { status_code };
      default:
        throw new Error(`Unknown InvocationFrameStatusCode: ${status_code}`);
    }
  },
};

const QueueEntryArray = varArray({
  encode(w, val) { w.writeVarOpaque(val, 256); },
  decode(r) { return queueEntry(r.readVarOpaque(256)); },
});

export const NondeterministicProposalData: XdrCodec<NondeterministicProposalDataType> = {
  encode(w, val) {
    w.writeVarOpaque(val.nondeterministic_bits, 0xFFFFFFFF);
    w.writeUint32(val.nondeterministic_bit_count);
    QueueEntryArray.encode(w, val.observed_queue_entry_sequence);
  },
  decode(r) {
    return {
      nondeterministic_bits: r.readVarOpaque(0xFFFFFFFF),
      nondeterministic_bit_count: r.readUint32(),
      observed_queue_entry_sequence: QueueEntryArray.decode(r),
    };
  },
};

export const ProposedTransaction: XdrCodec<ProposedTransactionType> = {
  encode(w, val) {
    SignedTransaction.encode(w, val.signed_tx);
    NondeterministicProposalData.encode(w, val.nondeterministic_proposal_data);
  },
  decode(r) {
    return {
      signed_tx: SignedTransaction.decode(r),
      nondeterministic_proposal_data: NondeterministicProposalData.decode(r),
    };
  },
};
```

- [ ] **Step 6: Update `src/protocol/codecs/index.ts`**

```typescript
export * from "./types.js";
export * from "./contract.js";
export * from "./auth_claim.js";
export * from "./transaction.js";
```

- [ ] **Step 7: Run all tests**

Run: `npx vitest run`
Expected: all PASS

- [ ] **Step 8: Commit**

```bash
git add src/protocol/codecs/ test/protocol/codecs/transaction.test.ts
git commit -m "feat: add XDR codecs for contract.x, auth_claim.x, transaction.x"
```

---

### Task 11: Public API and Final Integration Test

**Files:**
- Modify: `src/index.ts`
- Modify: `src/xdr/index.ts`
- Create: `test/integration.test.ts`

- [ ] **Step 1: Write failing integration test**

Create `test/integration.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  // xdr layer
  serialize, deserialize,
  // protocol types
  contractAddress, contractEntrypointID, gasAmount, calldata,
  blockHeight, ed25519Signature, ed25519PublicKey, sha256Hash,
  keyID,
  CryptographicScheme, AuthClaimType,
  // types
  type Invocation, type SignedTransaction,
} from "../src/index.js";
import * as xdr from "../src/protocol/codecs/index.js";

describe("end-to-end: build and round-trip a SignedTransaction", () => {
  it("constructs, serializes, and deserializes a complete SignedTransaction", () => {
    const addr = contractAddress(new Uint8Array(32).fill(0x01));
    const ep = contractEntrypointID(new Uint8Array(8).fill(0xAB));

    const stx: SignedTransaction = {
      tx: {
        invocation: {
          invoked_address: addr,
          entrypoint: ep,
          gas_limit: gasAmount(1_000_000n),
          calldata: calldata(new Uint8Array([0xDE, 0xAD])),
        },
        uniquifier: {
          block_expiry_height: blockHeight(100n),
          nonce: 12345n,
        },
        contracts_to_deploy: [],
        auth_claims: [
          {
            claim_type: AuthClaimType.kInvokedAddressSignature,
            invoked_address_signature_id: keyID(0n),
          },
        ],
        gas_claims: [],
      },
      signatures: [
        {
          auth_claim_idx: 0n,
          public_key_id: 0n,
          signature: {
            scheme: CryptographicScheme.Ed25519,
            ed25519: ed25519Signature(new Uint8Array(64).fill(0x55)),
          },
        },
      ],
    };

    const bytes = serialize(stx, xdr.SignedTransaction);
    const decoded = deserialize(bytes, xdr.SignedTransaction);
    expect(decoded).toEqual(stx);
  });
});
```

- [ ] **Step 2: Finalize `src/index.ts`**

```typescript
// XDR serialization layer
export { XdrWriter } from "./xdr/writer.js";
export { XdrReader } from "./xdr/reader.js";
export { serialize, deserialize } from "./xdr/codec.js";
export type { XdrCodec } from "./xdr/codec.js";

// Protocol types
export * from "./protocol/index.js";

// Codecs namespace
export * as xdr from "./protocol/codecs/index.js";
```

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: all PASS

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: `dist/` created with ESM, CJS, and .d.ts files

- [ ] **Step 6: Commit**

```bash
git add src/index.ts src/xdr/index.ts test/integration.test.ts
git commit -m "feat: finalize public API and add end-to-end integration test"
```

---

### Task 12: Golden Test Vectors (deferred — requires Rust harness)

**Note:** This task is defined but cannot be fully implemented until a Rust test harness is written (in protocol-rs) that serializes sample values and outputs hex-encoded bytes. The TypeScript side is ready to consume the vectors once generated.

**Files:**
- Create: `test/fixtures/golden_vectors.json` (generated by Rust harness, checked in)
- Create: `test/protocol/golden.test.ts`

- [ ] **Step 1: Create placeholder golden vectors file**

Create `test/fixtures/golden_vectors.json`:
```json
{
  "_comment": "Generated by protocol-rs test harness. Do not edit by hand.",
  "vectors": []
}
```

- [ ] **Step 2: Write the golden vector test framework**

Create `test/protocol/golden.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { serialize, deserialize } from "../../src/xdr/codec.js";
import * as xdr from "../../src/protocol/codecs/index.js";
import vectors from "../fixtures/golden_vectors.json";

// Each vector: { type: "Invocation" | "SignedTransaction" | ..., hex: "abcdef..." }
// The codec name must match a key in the xdr namespace.

const codecMap: Record<string, unknown> = xdr;

describe("golden vector cross-compatibility", () => {
  for (const vec of (vectors as any).vectors) {
    it(`deserializes ${vec.type} from Rust-generated bytes`, () => {
      const codec = codecMap[vec.type];
      if (!codec) throw new Error(`No codec for type: ${vec.type}`);
      const bytes = hexToBytes(vec.hex);
      // Deserialize from Rust bytes, re-serialize, and verify identical output
      const decoded = deserialize(bytes, codec as any);
      const reserialized = serialize(decoded, codec as any);
      expect(Buffer.from(reserialized).toString("hex")).toBe(vec.hex);
    });
  }
});

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
```

- [ ] **Step 3: Commit placeholder**

```bash
git add test/fixtures/golden_vectors.json test/protocol/golden.test.ts
git commit -m "test: add golden vector test framework (awaiting Rust-generated vectors)"
```

- [ ] **Step 4 (done outside this repo):** Write a Rust test in protocol-rs that serializes representative values and outputs `golden_vectors.json`. Copy the output to `test/fixtures/golden_vectors.json` and re-run `npx vitest run test/protocol/golden.test.ts`.
