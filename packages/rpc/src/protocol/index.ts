// Barrel — add new .x files here when they're added to generate.sh
export * from "@groundhogchain/protocol";
export * from "./dogwood_kit.js";
export * from "./auth_card.js";
export * from "./sched_db.js";
export * from "./wallet.js";
export * from "./dogwood_rpc.js";
export * from "./event_rpc.js";
export * from "./auth_rpc.js";
export * from "./test_rpc.js";
export * from "./discovery.js";
export * from "./config.js";
export * from "./dogwood.js";
export * from "./scp.js";
export * from "./scp_config.js";
export * from "./scp_control.js";
export * from "./scp_handle.js";
export * from "./rpc_types.js";
export * from "./parallel.js";
export * from "./nomination.js";
export * from "./db_sched.js";
export * from "./exec_sched.js";
export * from "./consensus.js";
export * from "./sched_coord.js";
export * from "./coord_sched.js";
export * from "./catchup.js";
export * from "./repair.js";
export * from "./loadgen.js";

// Merged codec namespace
import { codec as _protocol_codec } from "@groundhogchain/protocol";
import { codec as dogwood_kit_codec } from "./dogwood_kit.js";
import { codec as auth_card_codec } from "./auth_card.js";
import { codec as sched_db_codec } from "./sched_db.js";
import { codec as wallet_codec } from "./wallet.js";
import { codec as dogwood_rpc_codec } from "./dogwood_rpc.js";
import { codec as event_rpc_codec } from "./event_rpc.js";
import { codec as auth_rpc_codec } from "./auth_rpc.js";
import { codec as test_rpc_codec } from "./test_rpc.js";
import { codec as discovery_codec } from "./discovery.js";
import { codec as config_codec } from "./config.js";
import { codec as dogwood_codec } from "./dogwood.js";
import { codec as scp_codec } from "./scp.js";
import { codec as scp_config_codec } from "./scp_config.js";
import { codec as scp_control_codec } from "./scp_control.js";
import { codec as scp_handle_codec } from "./scp_handle.js";
import { codec as rpc_types_codec } from "./rpc_types.js";
import { codec as parallel_codec } from "./parallel.js";
import { codec as nomination_codec } from "./nomination.js";
import { codec as db_sched_codec } from "./db_sched.js";
import { codec as exec_sched_codec } from "./exec_sched.js";
import { codec as consensus_codec } from "./consensus.js";
import { codec as sched_coord_codec } from "./sched_coord.js";
import { codec as coord_sched_codec } from "./coord_sched.js";
import { codec as catchup_codec } from "./catchup.js";
import { codec as repair_codec } from "./repair.js";
import { codec as loadgen_codec } from "./loadgen.js";

function _buildCodec() {
  return {
    ..._protocol_codec,
    ...dogwood_kit_codec,
    ...auth_card_codec,
    ...sched_db_codec,
    ...wallet_codec,
    ...dogwood_rpc_codec,
    ...event_rpc_codec,
    ...auth_rpc_codec,
    ...test_rpc_codec,
    ...discovery_codec,
    ...config_codec,
    ...dogwood_codec,
    ...scp_codec,
    ...scp_config_codec,
    ...scp_control_codec,
    ...scp_handle_codec,
    ...rpc_types_codec,
    ...parallel_codec,
    ...nomination_codec,
    ...db_sched_codec,
    ...exec_sched_codec,
    ...consensus_codec,
    ...sched_coord_codec,
    ...coord_sched_codec,
    ...catchup_codec,
    ...repair_codec,
    ...loadgen_codec,
  } as const;
}

type _Codec = ReturnType<typeof _buildCodec>;
let _cached: _Codec | undefined;
function _resolve(): _Codec {
  return (_cached ??= _buildCodec());
}

export const codec: _Codec = new Proxy({} as _Codec, {
  get(_, prop) { return (_resolve() as any)[prop]; },
  has(_, prop) { return prop in _resolve(); },
  ownKeys() { return Reflect.ownKeys(_resolve()); },
  getOwnPropertyDescriptor(_, prop) {
    return Object.getOwnPropertyDescriptor(_resolve(), prop);
  },
});
