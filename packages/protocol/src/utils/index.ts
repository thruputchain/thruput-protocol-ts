/**
 * Utility helpers for working with Groundhog protocol values.
 *
 * This subpath exposes hexadecimal encoding without importing the full
 * protocol barrel.
 *
 * Derivations built on protocol types — transaction hashes, contract
 * addresses, entrypoint IDs — live in `@groundhogchain/client`, alongside the
 * domain-separator and pubkey-account derivations. This package is the binding
 * layer for the protocol types themselves.
 *
 * @module @groundhogchain/protocol/utils
 */

export { toHex, fromHex } from "./hex.js";
