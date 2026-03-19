/**
 * Test that protocol codecs work with CXS serialization.
 *
 * The same codec objects (codec.Invocation, codec.SignedTransaction, etc.)
 * should work with both serialize/deserialize (TXS) and serializeCxs/deserializeCxs.
 */
import { describe, it, expect } from "vitest";
import {
  serializeCxs, deserializeCxs, serialize,
  contractAddress, contractEntrypointID, gasAmount, calldata,
  blockHeight, ed25519Signature, ed25519PublicKey,
  keyID,
  CryptographicScheme, AuthClaimType, StorageKeyType,
  storageKeyContractData,
  codec,
} from "../../src/index.js";
import type { Invocation, SignedTransaction, StorageKey, PublicKey } from "../../src/index.js";

describe("CXS codec round-trip with protocol types", () => {
  it("Invocation: CXS round-trip", () => {
    const inv: Invocation = {
      invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
      entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xAB)),
      gas_limit: gasAmount(1_000_000n),
      calldata: calldata(new Uint8Array([0xDE, 0xAD])),
    };
    const cxsBytes = serializeCxs(inv, codec.Invocation);
    const decoded = deserializeCxs(cxsBytes, codec.Invocation);
    expect(decoded).toEqual(inv);
  });

  it("Invocation: CXS is smaller than TXS", () => {
    const inv: Invocation = {
      invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
      entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xAB)),
      gas_limit: gasAmount(1_000_000n),
      calldata: calldata(new Uint8Array([0xDE, 0xAD])),
    };
    const txsBytes = serialize(inv, codec.Invocation);
    const cxsBytes = serializeCxs(inv, codec.Invocation);
    expect(cxsBytes.length).toBeLessThan(txsBytes.length);
  });

  it("PublicKey (Ed25519): CXS round-trip", () => {
    const pk: PublicKey = {
      scheme: CryptographicScheme.Ed25519,
      ed25519: ed25519PublicKey(new Uint8Array(32).fill(0x42)),
    };
    const cxsBytes = serializeCxs(pk, codec.PublicKey);
    const decoded = deserializeCxs(cxsBytes, codec.PublicKey);
    expect(decoded).toEqual(pk);
  });

  it("StorageKey (void variant): CXS round-trip", () => {
    const sk: StorageKey = {
      key_type: StorageKeyType.FreeNativeTokenBalance,
    };
    const cxsBytes = serializeCxs(sk, codec.StorageKey);
    const decoded = deserializeCxs(cxsBytes, codec.StorageKey);
    expect(decoded).toEqual(sk);
  });

  it("StorageKey (ContractData): CXS round-trip", () => {
    const sk: StorageKey = {
      key_type: StorageKeyType.ContractData,
      contract_data_key: storageKeyContractData(new Uint8Array(32).fill(0xFF)),
    };
    const cxsBytes = serializeCxs(sk, codec.StorageKey);
    const decoded = deserializeCxs(cxsBytes, codec.StorageKey);
    expect(decoded).toEqual(sk);
  });

  it("full SignedTransaction: CXS round-trip", () => {
    const stx: SignedTransaction = {
      tx: {
        invocation: {
          invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
          entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xAB)),
          gas_limit: gasAmount(1_000_000n),
          calldata: calldata(new Uint8Array([0xDE, 0xAD])),
        },
        uniquifier: {
          block_expiry_height: blockHeight(100n),
          nonce: 12345n,
        },
        contracts_to_deploy: [],
        auth_claims: [{
          claim_type: AuthClaimType.kInvokedAddressSignature,
          invoked_address_signature_id: keyID(0n),
        }],
        gas_claims: [],
      },
      signatures: [{
        auth_claim_idx: 0n,
        public_key_id: 0n,
        signature: {
          scheme: CryptographicScheme.Ed25519,
          ed25519: ed25519Signature(new Uint8Array(64).fill(0x55)),
        },
      }],
    };

    const cxsBytes = serializeCxs(stx, codec.SignedTransaction);
    const decoded = deserializeCxs(cxsBytes, codec.SignedTransaction);
    expect(decoded).toEqual(stx);

    // CXS should be smaller than TXS for this transaction
    const txsBytes = serialize(stx, codec.SignedTransaction);
    expect(cxsBytes.length).toBeLessThan(txsBytes.length);
  });
});
