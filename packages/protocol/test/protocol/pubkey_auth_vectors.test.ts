/**
 * Cross-language pubkey-account vectors from thruput-protocol
 * `test_vectors/pubkey_auth.json` (see the README next to it there).
 *
 * The bindings must decode every XDR byte string in the file and re-encode it
 * byte-for-byte, and their CXS encodings of `PublicKey`,
 * `PubkeyAccountPreimage` must reproduce the preimages the `PublicKeyHash`,
 * account addresses and transaction hashes are taken over.
 */
import { createHash } from "node:crypto";
import { describe, it, expect } from "vitest";
import {
  serialize, deserialize, serializeCxs,
  publicKeyHash, CryptographicScheme, AuthClaimType,
  codec,
} from "../../src/index.js";
import type { PublicKey, SignedTransaction } from "../../src/index.js";
import { fromHex, toHex } from "../helpers/hex.js";
import vectors from "../fixtures/pubkey_auth.json";

function sha256(...parts: Uint8Array[]): string {
  const h = createHash("sha256");
  for (const p of parts) h.update(p);
  return h.digest("hex");
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

/** Decode `hex` as `SignedTransaction`, check it re-encodes exactly. */
function roundtripSigned(hex: string): SignedTransaction {
  const stx = deserialize(fromHex(hex), codec.SignedTransaction);
  expect(toHex(serialize(stx, codec.SignedTransaction))).toBe(hex);
  return stx;
}

function rawKey(key: PublicKey): Uint8Array {
  return key.scheme === CryptographicScheme.Ed25519 ? key.ed25519 : key.mldsa65;
}

const ds = {
  PublicKey: fromHex(vectors.domain_separators.PublicKey.cxs),
  PubkeyAccount: fromHex(vectors.domain_separators.PubkeyAccount.cxs),
  Transaction: fromHex(vectors.domain_separators.Transaction.cxs),
};
const keysByName = new Map(vectors.keys.map((k) => [k.name, k]));
const signingByName = new Map(vectors.signing.map((s) => [s.name, s]));

describe("pubkey_auth.json vectors", () => {
  it("is the format this test understands", () => {
    expect(vectors.format_version).toBe(1);
    expect(vectors.keys.map((k) => k.scheme).sort()).toEqual(
      ["Ed25519", "Ed25519", "MlDsa65", "MlDsa65"],
    );
  });

  describe.each(vectors.keys)("key $name", (key) => {
    it("decodes and re-encodes public_key_xdr", () => {
      const pk = deserialize(fromHex(key.public_key_xdr), codec.PublicKey);
      expect(pk.scheme).toBe(key.scheme_value);
      expect(CryptographicScheme[pk.scheme]).toBe(key.scheme);
      expect(toHex(rawKey(pk))).toBe(key.public_key);
      expect(toHex(serialize(pk, codec.PublicKey))).toBe(key.public_key_xdr);
    });

    it("reproduces cxs(PublicKey) and PublicKeyHash", () => {
      const pk = deserialize(fromHex(key.public_key_xdr), codec.PublicKey);
      const cxs = serializeCxs(pk, codec.PublicKey);
      expect(toHex(cxs)).toBe(key.public_key_cxs);
      expect(sha256(ds.PublicKey, cxs)).toBe(key.public_key_hash);
    });

    it.each(key.accounts)("reproduces the account preimage and address at nonce $nonce", (acct) => {
      const preimage = {
        pubkey_hash: publicKeyHash(fromHex(key.public_key_hash)),
        nonce: BigInt(acct.nonce),
      };
      const cxs = serializeCxs(preimage, codec.PubkeyAccountPreimage);
      expect(toHex(cxs)).toBe(acct.pubkey_account_preimage_cxs);
      expect(sha256(ds.PubkeyAccount, cxs)).toBe(acct.address);
    });
  });

  describe.each(vectors.signing)("signing $name", (vec) => {
    const key = keysByName.get(vec.key)!;
    const t = vec.transaction;

    it("decodes transaction_xdr into the listed fields and re-encodes it", () => {
      const tx = deserialize(fromHex(vec.transaction_xdr), codec.Transaction);
      expect(toHex(serialize(tx, codec.Transaction))).toBe(vec.transaction_xdr);
      expect(toHex(tx.invocation.invoked_address)).toBe(t.invoked_address);
      expect(toHex(tx.invocation.entrypoint)).toBe(t.entrypoint);
      expect(tx.invocation.gas_limit).toBe(BigInt(t.gas_limit));
      expect(toHex(tx.invocation.calldata)).toBe(t.calldata);
      expect(tx.uniquifier.block_expiry_height).toBe(BigInt(t.block_expiry_height));
      expect(tx.uniquifier.nonce).toBe(BigInt(t.uniquifier_nonce));
      expect(tx.contracts_to_deploy).toEqual([]);
      expect(AuthClaimType[tx.auth_claim.claim_type]).toBe(t.auth_claim_type);
      if (tx.auth_claim.claim_type !== AuthClaimType.kPubkeySignature) throw new Error("unreachable");
      expect(toHex(tx.auth_claim.pubkey_preimage.pubkey_hash)).toBe(t.pubkey_hash);
      expect(tx.auth_claim.pubkey_preimage.nonce).toBe(BigInt(t.account_nonce));
      // The sender is the key's own account at that nonce.
      const acct = key.accounts.find((a) => a.nonce === t.account_nonce)!;
      expect(t.invoked_address).toBe(acct.address);
      expect(t.pubkey_hash).toBe(key.public_key_hash);
    });

    it("reproduces the signing preimage and transaction hash", () => {
      const txXdr = fromHex(vec.transaction_xdr);
      expect(toHex(concat(ds.Transaction, fromHex(vec.network_hash), txXdr)))
        .toBe(vec.signing_preimage);
      expect(sha256(txXdr)).toBe(vec.transaction_hash);
    });

    it("decodes signed_transaction_xdr with the signature and claim key", () => {
      const stx = roundtripSigned(vec.signed_transaction_xdr);
      expect(sha256(fromHex(vec.signed_transaction_xdr))).toBe(vec.signed_transaction_sha256);
      expect(toHex(serialize(stx.tx, codec.Transaction))).toBe(vec.transaction_xdr);
      expect(stx.signatures).toHaveLength(1);
      const [sig] = stx.signatures;
      expect(sig.public_key_id).toBe(BigInt(vectors.constants.kDefaultNewAddressKeyID));
      expect(sig.signature.scheme).toBe(key.scheme_value);
      const rawSig = sig.signature.scheme === CryptographicScheme.Ed25519
        ? sig.signature.ed25519 : sig.signature.mldsa65;
      expect(toHex(rawSig)).toBe(vec.signature);
      expect(stx.pubkey_claim_key).not.toBeNull();
      expect(toHex(serialize(stx.pubkey_claim_key!, codec.PublicKey))).toBe(key.public_key_xdr);
    });
  });

  describe.each(vectors.resigning)("resigning $name", (vec) => {
    it("keeps the transaction hash and changes only the signature", () => {
      const base = signingByName.get(vec.of)!;
      const stx = roundtripSigned(vec.signed_transaction_xdr);
      expect(vec.signed_transaction_xdr).not.toBe(base.signed_transaction_xdr);
      const txXdr = serialize(stx.tx, codec.Transaction);
      expect(toHex(txXdr)).toBe(base.transaction_xdr);
      expect(sha256(txXdr)).toBe(vec.transaction_hash);
      expect(vec.transaction_hash).toBe(base.transaction_hash);
      const sig = stx.signatures[0].signature;
      expect(sig.scheme).toBe(CryptographicScheme.MlDsa65);
      if (sig.scheme !== CryptographicScheme.MlDsa65) throw new Error("unreachable");
      expect(toHex(sig.mldsa65)).toBe(vec.signature);
    });
  });

  // Negatives are well-formed XDR that a verifier must reject; the bindings
  // must still carry them byte-for-byte.
  describe.each(vectors.negative)("negative $name", (vec) => {
    it("decodes, re-encodes and hashes like the vector says", () => {
      const stx = roundtripSigned(vec.signed_transaction_xdr);
      expect(sha256(serialize(stx.tx, codec.Transaction))).toBe(vec.transaction_hash);
      expect(vec.expected.result).toBe("reject");
    });
  });
});
