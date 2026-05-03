// Re-export XDR framework so consumers can import everything from @groundhogchain/protocol
export * from "@groundhogchain/xdr";

// Protocol types + codecs (unified)
export * from "./protocol/index.js";

// Utilities (also available via "@groundhogchain/protocol/utils" for tree-shaking)
export * from "./utils/index.js";
