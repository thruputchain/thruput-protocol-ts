/**
 * Core Groundhog protocol types, codecs, and utility helpers.
 *
 * The protocol types are generated from XDR definitions in the `protocol/`
 * submodule. This barrel is the intended public import surface for generated
 * protocol symbols, XDR primitives, and common helpers.
 *
 * @module @groundhogchain/protocol
 */

// Re-export XDR framework so consumers can import everything from @groundhogchain/protocol
export * from "@groundhogchain/xdr";

// Protocol types + codecs (unified)
export * from "./protocol/index.js";

// Protocol-defined constants
export { HOG_ADDRESS } from "./constants.js";

// Utilities (also available via "@groundhogchain/protocol/utils" for tree-shaking)
export * from "./utils/index.js";
