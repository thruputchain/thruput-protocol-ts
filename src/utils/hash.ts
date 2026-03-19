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
 * Extract the "major version" string from a semver version string.
 *
 * Matches the Rust SDK's `major_version_from_string`:
 * - "1.2.3" → "1" (major is non-zero)
 * - "0.9.2" → "0.9" (major is 0, minor is non-zero)
 * - "0.0.2" → "0.0.2" (0.0.z is always considered major)
 * - "0.0.0" → "0.0.0"
 */
export function majorVersionFromSemver(versionStr: string): string {
  const parts = versionStr.split(".");
  if (parts.length < 3) throw new Error(`Invalid semver: ${versionStr}`);
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2], 10);
  if (major > 0) return `${major}`;
  if (minor > 0) return `${major}.${minor}`;
  if (patch > 0) return `${major}.${minor}.${patch}`;
  return versionStr;
}

/**
 * Derive a contract entrypoint ID.
 *
 * EntrypointID = SHA-256(interfaceName || majorVersion(versionStr) || methodName)[0..8]
 *
 * If interfaceName is null, uses "_unnamed_interface" as the domain separator.
 * The concatenation is raw UTF-8 bytes, not XDR-encoded.
 *
 * Matches the Rust SDK's `contract_entrypoint_id` function.
 */
export async function deriveEntrypointID(
  interfaceName: string | null,
  versionStr: string,
  methodName: string,
): Promise<ContractEntrypointID> {
  const name = interfaceName ?? "_unnamed_interface";
  const majorVersion = majorVersionFromSemver(versionStr);

  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);
  const versionBytes = encoder.encode(majorVersion);
  const methodBytes = encoder.encode(methodName);

  const combined = new Uint8Array(nameBytes.length + versionBytes.length + methodBytes.length);
  combined.set(nameBytes, 0);
  combined.set(versionBytes, nameBytes.length);
  combined.set(methodBytes, nameBytes.length + versionBytes.length);

  const digest = await sha256(combined);
  return contractEntrypointID(digest.slice(0, 8));
}
