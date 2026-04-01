// Barrel — add new .x files here when they're added to generate.sh
export * from "./types.js";
export * from "./contract.js";
export * from "./exec_result.js";
export * from "./event.js";
export * from "./genesis.js";
export * from "./transaction.js";
export * from "./retrocausal_queue.js";
export * from "./storage_cost.js";
export * from "./syscall_error.js";
export * from "./auth_claim.js";
export * from "./standard_asset_events.js";
export * from "./address_auth.js";
export * from "./storage_item.js";
export * from "./precompiles.js";
export * from "./block.js";
export * from "./invoke_flag.js";

// Merged codec namespace
import { codec as types_codec } from "./types.js";
import { codec as contract_codec } from "./contract.js";
import { codec as exec_result_codec } from "./exec_result.js";
import { codec as event_codec } from "./event.js";
import { codec as genesis_codec } from "./genesis.js";
import { codec as transaction_codec } from "./transaction.js";
import { codec as retrocausal_queue_codec } from "./retrocausal_queue.js";
import { codec as storage_cost_codec } from "./storage_cost.js";
import { codec as syscall_error_codec } from "./syscall_error.js";
import { codec as auth_claim_codec } from "./auth_claim.js";
import { codec as standard_asset_events_codec } from "./standard_asset_events.js";
import { codec as address_auth_codec } from "./address_auth.js";
import { codec as storage_item_codec } from "./storage_item.js";
import { codec as precompiles_codec } from "./precompiles.js";
import { codec as block_codec } from "./block.js";
import { codec as invoke_flag_codec } from "./invoke_flag.js";

export const codec = {
  ...types_codec,
  ...contract_codec,
  ...exec_result_codec,
  ...event_codec,
  ...genesis_codec,
  ...transaction_codec,
  ...retrocausal_queue_codec,
  ...storage_cost_codec,
  ...syscall_error_codec,
  ...auth_claim_codec,
  ...standard_asset_events_codec,
  ...address_auth_codec,
  ...storage_item_codec,
  ...precompiles_codec,
  ...block_codec,
  ...invoke_flag_codec,
} as const;
