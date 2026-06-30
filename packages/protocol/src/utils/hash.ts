/**
 * SHA-256 hashing utilities for protocol operations.
 *
 * Uses the Web Crypto API (available in browsers and Node.js 16+).
 */

import { serialize } from "@groundhogchain/xdr";
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
 *
 * @param stx Signed transaction to hash.
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
 *
 * @param deployer Address deploying the contract.
 * @param nonce Deployment nonce.
 * @param contractHash Hash of the contract code or artifact.
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
 *
 * @param versionStr Semantic version string with at least major, minor, and patch components.
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
 * EntrypointID = SHA-256(interfaceName :: majorVersion(versionStr) :: methodName)[0..8]
 *
 * If interfaceName is null, uses "_unnamed_interface" as the domain separator.
 * Fields are joined with literal `::` separators (raw UTF-8, not XDR-encoded).
 * The separators are required to prevent field-boundary collisions, e.g.
 * interface "Foo1" + major "2" vs "Foo" + "12" would otherwise hash identically.
 *
 * Matches the Rust SDK's `contract_entrypoint_id` function.
 *
 * @param interfaceName Interface name, or `null` for the unnamed interface domain.
 * @param versionStr Semantic version used to derive the major-version domain.
 * @param methodName Contract method name.
 */
export async function deriveEntrypointID(
  interfaceName: string | null,
  versionStr: string,
  methodName: string,
): Promise<ContractEntrypointID> {
  const name = interfaceName ?? "_unnamed_interface";
  const majorVersion = majorVersionFromSemver(versionStr);

  const encoder = new TextEncoder();
  const combined = encoder.encode(`${name}::${majorVersion}::${methodName}`);

  const digest = await sha256(combined);
  return contractEntrypointID(digest.slice(0, 8));
}
