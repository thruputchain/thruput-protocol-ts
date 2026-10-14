/**
 * Wire-format tests for ML-DSA-65 pubkey-account auth: the new `mldsa65`
 * arms of `PublicKey` and `Signature`, `PublicKeyHash`, the hash-based
 * `PubkeyAccountPreimage`, and `SignedTransaction.pubkey_claim_key`.
 */
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize,
  contractAddress, contractEntrypointID, gasAmount, calldata, blockHeight,
  ed25519PublicKey, ed25519Signature, bitMap, weight,
  mlDsa65PublicKey, mlDsa65Signature, publicKeyHash,
  CryptographicScheme, AuthClaimType,
  codec,
} from "../../src/index.js";
import type {
  PublicKey, Signature, PubkeyAccountPreimage, AuthClaim,
  SignedTransaction, Transaction,
} from "../../src/index.js";
import { toHex } from "../helpers/hex.js";

function patterned(length: number, seed: number): Uint8Array {
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) out[i] = (seed + i * 7) & 0xff;
  return out;
}

const mldsaKey: PublicKey = {
  scheme: CryptographicScheme.MlDsa65,
  mldsa65: mlDsa65PublicKey(patterned(1952, 0x10)),
};

const mldsaSig: Signature = {
  scheme: CryptographicScheme.MlDsa65,
  mldsa65: mlDsa65Signature(patterned(3309, 0x20)),
};

const preimage: PubkeyAccountPreimage = {
  pubkey_hash: publicKeyHash(patterned(32, 0x30)),
  nonce: 0x0102030405060708n,
};

function makeTx(auth_claim: AuthClaim): Transaction {
  return {
    invocation: {
      invoked_address: contractAddress(new Uint8Array(32).fill(0x01)),
      entrypoint: contractEntrypointID(new Uint8Array(8).fill(0xab)),
      gas_limit: gasAmount(1_000_000n),
      calldata: calldata(new Uint8Array([0xde, 0xad])),
    },
    uniquifier: { block_expiry_height: blockHeight(100n), nonce: 12345n },
    contracts_to_deploy: [],
    auth_claim,
  };
}

describe("ML-DSA-65 fixed opaques", () => {
  it("constructors reject the wrong length", () => {
    expect(() => mlDsa65PublicKey(new Uint8Array(1951))).toThrow(/1952/);
    expect(() => mlDsa65Signature(new Uint8Array(3310))).toThrow(/3309/);
    expect(() => publicKeyHash(new Uint8Array(33))).toThrow(/32/);
  });

  it("PublicKey mldsa65 arm: discriminant 1 then 1952 key bytes", () => {
    const bytes = serialize(mldsaKey, codec.PublicKey);
    expect(bytes.length).toBe(4 + 1952);
    expect(toHex(bytes.subarray(0, 4))).toBe("00000001");
    expect(bytes.subarray(4)).toEqual(mldsaKey.mldsa65);
    expect(deserialize(bytes, codec.PublicKey)).toEqual(mldsaKey);
  });

  it("Signature mldsa65 arm: discriminant 1, 3309 bytes, 3 zero pad bytes", () => {
    const bytes = serialize(mldsaSig, codec.Signature);
    expect(bytes.length).toBe(4 + 3309 + 3);
    expect(toHex(bytes.subarray(0, 4))).toBe("00000001");
    expect(bytes.subarray(4, 4 + 3309)).toEqual(mldsaSig.mldsa65);
    expect(toHex(bytes.subarray(4 + 3309))).toBe("000000");
    expect(deserialize(bytes, codec.Signature)).toEqual(mldsaSig);
  });

  it("Signature decode rejects nonzero padding after the 3309 bytes", () => {
    const bytes = serialize(mldsaSig, codec.Signature);
    bytes[bytes.length - 1] = 1;
    expect(() => deserialize(bytes, codec.Signature)).toThrow();
  });

  it("Ed25519 arms keep discriminant 0", () => {
    const key: PublicKey = {
      scheme: CryptographicScheme.Ed25519,
      ed25519: ed25519PublicKey(patterned(32, 0x40)),
    };
    const bytes = serialize(key, codec.PublicKey);
    expect(bytes.length).toBe(36);
    expect(toHex(bytes.subarray(0, 4))).toBe("00000000");
    expect(deserialize(bytes, codec.PublicKey)).toEqual(key);
  });
});

describe("PublicKeyHash and PubkeyAccountPreimage", () => {
  it("PublicKeyHash is a bare 32-byte opaque", () => {
    const bytes = serialize(preimage.pubkey_hash, codec.PublicKeyHash);
    expect(bytes).toEqual(preimage.pubkey_hash);
    expect(deserialize(bytes, codec.PublicKeyHash)).toEqual(preimage.pubkey_hash);
  });

  it("PubkeyAccountPreimage is pubkey_hash then big-endian nonce (40 bytes)", () => {
    const bytes = serialize(preimage, codec.PubkeyAccountPreimage);
    expect(bytes.length).toBe(40);
    expect(bytes.subarray(0, 32)).toEqual(preimage.pubkey_hash);
    expect(toHex(bytes.subarray(32))).toBe("0102030405060708");
    expect(deserialize(bytes, codec.PubkeyAccountPreimage)).toEqual(preimage);
  });

  it("kPubkeySignature AuthClaim has the same size for every scheme", () => {
    const claim: AuthClaim = {
      claim_type: AuthClaimType.kPubkeySignature,
      pubkey_preimage: preimage,
    };
    const bytes = serialize(claim, codec.AuthClaim);
    expect(bytes.length).toBe(4 + 40);
    expect(deserialize(bytes, codec.AuthClaim)).toEqual(claim);
  });
});

describe("SignedTransaction.pubkey_claim_key", () => {
  const pubkeyTx = makeTx({
    claim_type: AuthClaimType.kPubkeySignature,
    pubkey_preimage: preimage,
  });

  it("round-trips an ML-DSA-65 pubkey claim with its key attached", () => {
    const stx: SignedTransaction = {
      tx: pubkeyTx,
      signatures: [{ public_key_id: 0n, signature: mldsaSig }],
      pubkey_claim_key: mldsaKey,
    };
    const bytes = serialize(stx, codec.SignedTransaction);
    expect(deserialize(bytes, codec.SignedTransaction)).toEqual(stx);

    // The key trails the signatures as a present optional, outside the
    // signed Transaction, whose encoding is a prefix of the signed one.
    const keyBytes = serialize(mldsaKey, codec.PublicKey);
    const tail = bytes.subarray(bytes.length - keyBytes.length - 4);
    expect(toHex(tail.subarray(0, 4))).toBe("00000001");
    expect(tail.subarray(4)).toEqual(keyBytes);
    const txBytes = serialize(pubkeyTx, codec.Transaction);
    expect(bytes.subarray(0, txBytes.length)).toEqual(txBytes);
  });

  it("encodes an absent key as a single zero word", () => {
    const stx: SignedTransaction = {
      tx: makeTx({
        claim_type: AuthClaimType.kSourceAddressAuthData,
        source_address_claim: { allowed_keys: bitMap(1n), required_weight: weight(1n) },
      }),
      signatures: [{
        public_key_id: 0n,
        signature: {
          scheme: CryptographicScheme.Ed25519,
          ed25519: ed25519Signature(new Uint8Array(64).fill(0x55)),
        },
      }],
      pubkey_claim_key: null,
    };
    const bytes = serialize(stx, codec.SignedTransaction);
    expect(toHex(bytes.subarray(bytes.length - 4))).toBe("00000000");
    expect(deserialize(bytes, codec.SignedTransaction)).toEqual(stx);
  });

  it("rejects a SignedTransaction missing the trailing option word", () => {
    const stx: SignedTransaction = {
      tx: pubkeyTx,
      signatures: [{ public_key_id: 0n, signature: mldsaSig }],
      pubkey_claim_key: null,
    };
    const bytes = serialize(stx, codec.SignedTransaction);
    expect(() =>
      deserialize(bytes.subarray(0, bytes.length - 4), codec.SignedTransaction),
    ).toThrow();
  });
});
