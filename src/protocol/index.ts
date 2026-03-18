export * from "./types.js";
export * from "./precompiles.js";
export * from "./contract.js";
export * from "./retrocausal_queue.js";
export * from "./auth_claim.js";
export * from "./transaction.js";

// Merged codec namespace
import { codec as types_codec } from "./types.js";
import { codec as precompiles_codec } from "./precompiles.js";
import { codec as contract_codec } from "./contract.js";
import { codec as retrocausal_queue_codec } from "./retrocausal_queue.js";
import { codec as auth_claim_codec } from "./auth_claim.js";
import { codec as transaction_codec } from "./transaction.js";

export const codec = {
  ...types_codec,
  ...precompiles_codec,
  ...contract_codec,
  ...retrocausal_queue_codec,
  ...auth_claim_codec,
  ...transaction_codec,
} as const;
