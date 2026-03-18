/**
 * SHA-256 hashing utilities for protocol operations.
 *
 * Uses the Web Crypto API (available in browsers and Node.js 16+).
 */

import { serialize } from "../xdr/codec.js";
import { codec } from "../protocol/index.js";
import type { SignedTransaction, SHA256Hash, ContractAddress, ContractEntrypointID } from "../protocol/index.js";
import { sha256Hash } from "../protocol/types.js";
import { contractAddress } from "../protocol/types.js";
import { contractEntrypointID } from "../protocol/contract.js";

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", data as Uint8Array<ArrayBuffer>);
  return new Uint8Array(digest);
}

/**
 * Hash a SignedTransaction to produce its transaction ID.
 *
 * The transaction hash is SHA-256 of the XDR-encoded SignedTransaction.
 */
export async function hashSignedTransaction(stx: SignedTransaction): Promise<SHA256Hash> {
  const bytes = serialize(stx, codec.SignedTransaction);
  const digest = await sha256(bytes);
  return sha256Hash(digest);
}

/**
 * Derive a contract address from deployment parameters.
 *
 * ContractAddress = SHA-256(deployer_address || nonce || contract_hash)
 * under XDR encoding (i.e., SHA-256 of the serialized ContractDeploymentHashPreimage).
 */
export async function deriveContractAddress(
  deployer: ContractAddress,
  nonce: SHA256Hash,
  contractHash: SHA256Hash,
): Promise<ContractAddress> {
  const preimage = serialize(
    { deployer_address: deployer, nonce, contract_hash: contractHash },
    codec.ContractDeploymentHashPreimage,
  );
  const digest = await sha256(preimage);
  return contractAddress(digest);
}

/**
 * Derive a contract entrypoint ID from interface name, major version, and method name.
 *
 * EntrypointID = SHA-256(name || majorVersion || methodName)[0..8]
 *
 * The concatenation is raw UTF-8 bytes, not XDR-encoded.
 */
export async function deriveEntrypointID(
  interfaceName: string,
  majorVersion: string,
  methodName: string,
): Promise<ContractEntrypointID> {
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(interfaceName);
  const versionBytes = encoder.encode(majorVersion);
  const methodBytes = encoder.encode(methodName);

  const combined = new Uint8Array(nameBytes.length + versionBytes.length + methodBytes.length);
  combined.set(nameBytes, 0);
  combined.set(versionBytes, nameBytes.length);
  combined.set(methodBytes, nameBytes.length + versionBytes.length);

  const digest = await sha256(combined);
  return contractEntrypointID(digest.slice(0, 8));
}
