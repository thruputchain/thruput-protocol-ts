// Barrel — add new .x files here when they're added to generate.sh
export * from "@groundhogchain/protocol";
export * from "./pagination.js";
export * from "./indexer.js";

// Merged codec namespace
import { codec as _protocol_codec } from "@groundhogchain/protocol";
import { codec as pagination_codec } from "./pagination.js";
import { codec as indexer_codec } from "./indexer.js";

export const codec = {
  ..._protocol_codec,
  ...pagination_codec,
  ...indexer_codec,
} as const;
