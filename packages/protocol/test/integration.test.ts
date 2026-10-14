import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
  contractAddress, contractEntrypointID, gasAmount, calldata,
  blockHeight, ed25519Signature, ed25519PublicKey,
  bitMap, weight,
  CryptographicScheme, AuthClaimType,
  SignedTransaction,
  codec,
} from "../src/index.js";

describe("codec completeness", () => {
  it("merged codec contains all per-file codec keys", () => {
    // Regression: the bundler can emit types.ts after the merged codec,
    // silently dropping ContractAddress, GasAmount, etc.
    const expected = [
      "ContractAddress", "GasAmount", "SHA256Hash", "BlockHeight",
      "Signature", "PublicKey", "SecretKey",
      "Invocation", "Transaction", "SignedTransaction",
      "ContractEntrypointID", "Contract",
      "ProposalHeader", "ValidatorID", "NetworkHash",
      "NetworkConfig", "ConfigHashPreimage",
    ];
    for (const key of expected) {
      expect(codec[key as keyof typeof codec], `codec.${key} missing`).toBeDefined();
      expect(codec[key as keyof typeof codec]).toHaveProperty("encode");
      expect(codec[key as keyof typeof codec]).toHaveProperty("decode");
    }
  });

  it("Invocation codec roundtrips correctly", () => {
    const inv = {
      invoked_address: contractAddress(new Uint8Array(32)),
      entrypoint: contractEntrypointID(new Uint8Array(8)),
      gas_limit: gasAmount(42n),
      calldata: calldata(new Uint8Array([1, 2, 3])),
    };
    const bytes = serialize(inv, codec.Invocation);
    const decoded = deserialize(bytes, codec.Invocation);
    expect(decoded).toEqual(inv);
  });
});

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
        auth_claim: {
          claim_type: AuthClaimType.kSourceAddressAuthData,
          source_address_claim: {
            allowed_keys: bitMap(1n),
            required_weight: weight(1n),
          },
        },
      },
      signatures: [
        {
          public_key_id: 0n,
          signature: {
            scheme: CryptographicScheme.Ed25519,
            ed25519: ed25519Signature(new Uint8Array(64).fill(0x55)),
          },
        },
      ],
      pubkey_claim_key: null,
    };

    const bytes = serialize(stx, codec.SignedTransaction);
    const decoded = deserialize(bytes, codec.SignedTransaction);
    expect(decoded).toEqual(stx);
  });
});
