/**
 * Contract specification AST types and codecs for Groundhog contracts.
 *
 * The exported symbols are generated from XDR definitions in the `protocol/`
 * submodule, with this barrel serving as the supported public import surface
 * for contract-spec consumers.
 *
 * @module @groundhogchain/contract-spec
 */

// Re-export XDR framework so consumers can import everything from @groundhogchain/contract-spec
export * from "@groundhogchain/xdr";

// Protocol types + codecs (unified)
export * from "./protocol/index.js";
