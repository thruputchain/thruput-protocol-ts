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
