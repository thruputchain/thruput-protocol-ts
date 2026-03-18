import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
  contractAddress, contractEntrypointID, gasAmount,
  calldata, blockHeight,
  keyID, bitMap, weight,
  CryptographicScheme, AuthClaimType,
  Invocation, Uniquifier, AuthClaim,
} from "../../../src/index.js";

describe("transaction codecs round-trip", () => {
  it("Invocation", () => {
    const inv: Invocation = {
      invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
      entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xAB)),
      gas_limit: gasAmount(1000000n),
      calldata: calldata(new Uint8Array([1, 2, 3, 4])),
    };
    const bytes = serialize(inv, Invocation);
    const decoded = deserialize(bytes, Invocation);
    expect(decoded).toEqual(inv);
  });

  it("Uniquifier", () => {
    const u: Uniquifier = {
      block_expiry_height: blockHeight(100n),
      nonce: 42n,
    };
    const bytes = serialize(u, Uniquifier);
    expect(deserialize(bytes, Uniquifier)).toEqual(u);
  });
});

describe("auth_claim codecs round-trip", () => {
  it("AuthClaim — kInvokedAddressSignature", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kInvokedAddressSignature,
      invoked_address_signature_id: keyID(3n),
    };
    const bytes = serialize(claim, AuthClaim);
    expect(deserialize(bytes, AuthClaim)).toEqual(claim);
  });

  it("AuthClaim — kInvokedAddressSignedWeight (anonymous struct arm)", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kInvokedAddressSignedWeight,
      invoked_address_signed_weight: {
        accepted_keys: bitMap(0b111n),
        required_weight: weight(2n),
      },
    };
    const bytes = serialize(claim, AuthClaim);
    expect(deserialize(bytes, AuthClaim)).toEqual(claim);
  });

  it("AuthClaim — kOtherAddressSignature (anonymous struct arm)", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kOtherAddressSignature,
      other_address_signature_id: {
        address: contractAddress(new Uint8Array(32).fill(0xBB)),
        key_id: keyID(1n),
      },
    };
    const bytes = serialize(claim, AuthClaim);
    expect(deserialize(bytes, AuthClaim)).toEqual(claim);
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
    const bytes = serialize(claim, AuthClaim);
    expect(deserialize(bytes, AuthClaim)).toEqual(claim);
  });
});
