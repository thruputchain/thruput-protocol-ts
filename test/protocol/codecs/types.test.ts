import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
  sha256Hash, contractAddress, ed25519PublicKey,
  storageKeyContractData,
  CryptographicScheme, StorageKeyType,
  SHA256Hash, ContractAddress, PublicKey, StorageKey, ExtensionPoint, AddressAndKey,
} from "../../../src/index.js";

describe("types.x codecs round-trip", () => {
  it("SHA256Hash", () => {
    const data = new Uint8Array(32).fill(0xAB);
    const hash = sha256Hash(data);
    const bytes = serialize(hash, SHA256Hash);
    const decoded = deserialize(bytes, SHA256Hash);
    expect(decoded).toEqual(hash);
  });

  it("ContractAddress", () => {
    const data = new Uint8Array(32).fill(0x01);
    const addr = contractAddress(data);
    const bytes = serialize(addr, ContractAddress);
    expect(deserialize(bytes, ContractAddress)).toEqual(addr);
  });

  it("PublicKey (Ed25519)", () => {
    const pk: PublicKey = {
      scheme: CryptographicScheme.Ed25519,
      ed25519: ed25519PublicKey(new Uint8Array(32).fill(0x42)),
    };
    const bytes = serialize(pk, PublicKey);
    const decoded = deserialize(bytes, PublicKey);
    expect(decoded).toEqual(pk);
  });

  it("StorageKey (ContractData variant)", () => {
    const sk: StorageKey = {
      key_type: StorageKeyType.kStorageKeyTypeContractData,
      contract_data_key: storageKeyContractData(new Uint8Array(32).fill(0xFF)),
    };
    const bytes = serialize(sk, StorageKey);
    expect(deserialize(bytes, StorageKey)).toEqual(sk);
  });

  it("StorageKey (void variant — FreeNativeTokenBalance)", () => {
    const sk: StorageKey = {
      key_type: StorageKeyType.kStorageKeyTypeFreeNativeTokenBalance,
    };
    const bytes = serialize(sk, StorageKey);
    expect(deserialize(bytes, StorageKey)).toEqual(sk);
  });

  it("ExtensionPoint", () => {
    const ep: ExtensionPoint = { v: 0 };
    const bytes = serialize(ep, ExtensionPoint);
    expect(bytes).toEqual(new Uint8Array([0, 0, 0, 0]));
    expect(deserialize(bytes, ExtensionPoint)).toEqual(ep);
  });

  it("AddressAndKey", () => {
    const val: AddressAndKey = {
      address: contractAddress(new Uint8Array(32).fill(0x01)),
      key: { key_type: StorageKeyType.kStorageKeyTypeReplayCache },
    };
    const bytes = serialize(val, AddressAndKey);
    expect(deserialize(bytes, AddressAndKey)).toEqual(val);
  });
});
