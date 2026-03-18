import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
  contractAddress, contractEntrypointID, gasAmount, calldata,
  blockHeight, ed25519Signature,
  keyID,
  CryptographicScheme, AuthClaimType,
  xdr,
  type SignedTransaction,
} from "../src/index.js";

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
