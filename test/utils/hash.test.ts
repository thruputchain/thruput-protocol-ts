import { describe, it, expect } from "vitest";
import {
  hashSignedTransaction,
  deriveContractAddress,
  deriveEntrypointID,
  toHex,
} from "../../src/utils/index.js";
import {
  contractAddress, contractEntrypointID, gasAmount, calldata,
  blockHeight, ed25519Signature, sha256Hash,
  keyID,
  CryptographicScheme, AuthClaimType,
} from "../../src/protocol/index.js";
import type { SignedTransaction } from "../../src/protocol/index.js";

function makeTestTransaction(): SignedTransaction {
  return {
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
}

describe("hashSignedTransaction", () => {
  it("returns a 32-byte SHA256Hash", async () => {
    const stx = makeTestTransaction();
    const hash = await hashSignedTransaction(stx);
    expect(hash.length).toBe(32);
  });

  it("is deterministic", async () => {
    const stx = makeTestTransaction();
    const hash1 = await hashSignedTransaction(stx);
    const hash2 = await hashSignedTransaction(stx);
    expect(toHex(hash1)).toBe(toHex(hash2));
  });

  it("changes when transaction content changes", async () => {
    const stx1 = makeTestTransaction();
    const stx2 = makeTestTransaction();
    stx2.tx.uniquifier.nonce = 99999n;
    const hash1 = await hashSignedTransaction(stx1);
    const hash2 = await hashSignedTransaction(stx2);
    expect(toHex(hash1)).not.toBe(toHex(hash2));
  });
});

describe("deriveContractAddress", () => {
  it("returns a 32-byte ContractAddress", async () => {
    const deployer = contractAddress(new Uint8Array(32).fill(0x01));
    const nonce = sha256Hash(new Uint8Array(32).fill(0x02));
    const contractHash = sha256Hash(new Uint8Array(32).fill(0x03));
    const addr = await deriveContractAddress(deployer, nonce, contractHash);
    expect(addr.length).toBe(32);
  });

  it("is deterministic", async () => {
    const deployer = contractAddress(new Uint8Array(32).fill(0x01));
    const nonce = sha256Hash(new Uint8Array(32).fill(0x02));
    const contractHash = sha256Hash(new Uint8Array(32).fill(0x03));
    const addr1 = await deriveContractAddress(deployer, nonce, contractHash);
    const addr2 = await deriveContractAddress(deployer, nonce, contractHash);
    expect(toHex(addr1)).toBe(toHex(addr2));
  });

  it("changes when nonce changes", async () => {
    const deployer = contractAddress(new Uint8Array(32).fill(0x01));
    const contractHash = sha256Hash(new Uint8Array(32).fill(0x03));
    const addr1 = await deriveContractAddress(deployer, sha256Hash(new Uint8Array(32).fill(0x02)), contractHash);
    const addr2 = await deriveContractAddress(deployer, sha256Hash(new Uint8Array(32).fill(0xFF)), contractHash);
    expect(toHex(addr1)).not.toBe(toHex(addr2));
  });
});

describe("deriveEntrypointID", () => {
  it("returns an 8-byte ContractEntrypointID", async () => {
    const id = await deriveEntrypointID("ERC20", "1", "transfer");
    expect(id.length).toBe(8);
  });

  it("is deterministic", async () => {
    const id1 = await deriveEntrypointID("ERC20", "1", "transfer");
    const id2 = await deriveEntrypointID("ERC20", "1", "transfer");
    expect(toHex(id1)).toBe(toHex(id2));
  });

  it("different method names produce different IDs", async () => {
    const id1 = await deriveEntrypointID("ERC20", "1", "transfer");
    const id2 = await deriveEntrypointID("ERC20", "1", "approve");
    expect(toHex(id1)).not.toBe(toHex(id2));
  });

  it("different versions produce different IDs", async () => {
    const id1 = await deriveEntrypointID("ERC20", "1", "transfer");
    const id2 = await deriveEntrypointID("ERC20", "2", "transfer");
    expect(toHex(id1)).not.toBe(toHex(id2));
  });

  it("different interface names produce different IDs", async () => {
    const id1 = await deriveEntrypointID("ERC20", "1", "transfer");
    const id2 = await deriveEntrypointID("Governance", "1", "transfer");
    expect(toHex(id1)).not.toBe(toHex(id2));
  });
});
