import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
  contractAddress, contractEntrypointID, gasAmount,
  calldata, blockHeight, ed25519PublicKey,
  keyID, bitMap, weight,
  CryptographicScheme, AuthClaimType,
  Invocation, Uniquifier, AuthClaim,
  codec,
} from "../../../src/index.js";

describe("transaction codecs round-trip", () => {
  it("Invocation", () => {
    const inv: Invocation = {
      invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
      entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xAB)),
      gas_limit: gasAmount(1000000n),
      calldata: calldata(new Uint8Array([1, 2, 3, 4])),
    };
    const bytes = serialize(inv, codec.Invocation);
    const decoded = deserialize(bytes, codec.Invocation);
    expect(decoded).toEqual(inv);
  });

  it("Uniquifier", () => {
    const u: Uniquifier = {
      block_expiry_height: blockHeight(100n),
      nonce: 42n,
    };
    const bytes = serialize(u, codec.Uniquifier);
    expect(deserialize(bytes, codec.Uniquifier)).toEqual(u);
  });
});

describe("auth_claim codecs round-trip", () => {
  it("AuthClaim — kSourceAddressAuthData", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kSourceAddressAuthData,
      source_address_claim: {
        allowed_keys: bitMap(0b111n),
        required_weight: weight(2n),
      },
    };
    const bytes = serialize(claim, codec.AuthClaim);
    expect(deserialize(bytes, codec.AuthClaim)).toEqual(claim);
  });

  it("AuthClaim — kPubkeySignature", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kPubkeySignature,
      pubkey_preimage: {
        pubkey: {
          scheme: CryptographicScheme.Ed25519,
          ed25519: ed25519PublicKey(new Uint8Array(32).fill(0xDD)),
        },
        nonce: 42n,
      },
    };
    const bytes = serialize(claim, codec.AuthClaim);
    expect(deserialize(bytes, codec.AuthClaim)).toEqual(claim);
  });
});
