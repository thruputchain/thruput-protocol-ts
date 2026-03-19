import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
} from "../../src/index.js";
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
  codec,
} from "../../src/protocol/types.js";

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
    expect(StorageKeyType.ContractData).toBe(0);
    expect(StorageKeyType.FreeNativeTokenBalance).toBe(1);
    expect(StorageKeyType.AuthData).toBe(2);
    expect(StorageKeyType.Metadata).toBe(3);
    expect(StorageKeyType.ReplayCache).toBe(4);
  });

  it("CryptographicScheme has correct values", () => {
    expect(CryptographicScheme.Ed25519).toBe(0);
  });
});

describe("enum codecs", () => {
  it("CryptographicScheme round-trips Ed25519", () => {
    const bytes = serialize(CryptographicScheme.Ed25519, codec.CryptographicScheme);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 0]));
    const decoded = deserialize(bytes, codec.CryptographicScheme);
    expect(decoded).toBe(CryptographicScheme.Ed25519);
  });

  it("StorageKeyType round-trips all variants", () => {
    for (const variant of [
      StorageKeyType.ContractData,
      StorageKeyType.FreeNativeTokenBalance,
      StorageKeyType.AuthData,
      StorageKeyType.Metadata,
      StorageKeyType.ReplayCache,
    ]) {
      const bytes = serialize(variant, codec.StorageKeyType);
      const decoded = deserialize(bytes, codec.StorageKeyType);
      expect(decoded).toBe(variant);
    }
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
