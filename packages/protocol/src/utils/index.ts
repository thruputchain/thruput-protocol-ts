/**
 * Utility helpers for working with Groundhog protocol values.
 *
 * This subpath exposes focused helpers for hexadecimal encoding, transaction
 * hashes, contract addresses, entrypoint IDs, and semantic-version handling
 * without importing the full protocol barrel.
 *
 * @module @groundhogchain/protocol/utils
 */

export { toHex, fromHex } from "./hex.js";
export { hashSignedTransaction, deriveContractAddress, deriveEntrypointID, majorVersionFromSemver } from "./hash.js";
