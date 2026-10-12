/**
 * Utility helpers for working with Thruput protocol values.
 *
 * This subpath exposes hexadecimal encoding without importing the full
 * protocol barrel.
 *
 * Derivations built on protocol types — transaction hashes, contract
 * addresses, entrypoint IDs — live in `@thruputchain/client` (published
 * from the separate client-ts repository,
 * https://github.com/thruputchain/client-ts), alongside the
 * domain-separator and pubkey-account derivations. This package is the binding
 * layer for the protocol types themselves.
 *
 * @module @thruputchain/protocol/utils
 */

export { toHex, fromHex } from "./hex.js";
