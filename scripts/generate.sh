#!/bin/bash
#
# Generate TypeScript from XDR definitions for both packages.
# Usage: XDRC=/path/to/x23c ./scripts/generate.sh
#
# The index.ts barrels are hand-written (like lib.rs in protocol-rs).
# This script only regenerates the .ts files from .x files.

set -euo pipefail

if [[ -z ${XDRC:-} ]]; then
  echo "error: set XDRC to the x23c binary, e.g. XDRC=/path/to/x23c $0" >&2
  exit 1
fi

echo "-- Using XDRC=${XDRC} --" >&2

generate() {
  local output="$1"
  local input="$2"
  "$XDRC" --ts -o "$output" "$input"
}

core_protos=(
  types.x db_conflict.x contract.x exec_result.x event.x genesis.x transaction.x
  retrocausal_queue.x storage_cost.x network_config.x syscall_error.x auth_claim.x
  standard_asset_events.x address_auth.x storage_item.x precompiles.x header.x
  validator.x invoke_flag.x network.x
)

rpc_protos=(
  dogwood_kit.x auth_card.x sched_db.x
  wallet.x dogwood_rpc.x event_rpc.x auth_rpc.x test_rpc.x
  discovery.x config.x dogwood.x
  scp.x scp_config.x scp_control.x scp_handle.x
  rpc_types.x parallel.x proposal.x db_sched.x exec_sched.x
  consensus.x sched_coord.x coord_sched.x catchup.x repair.x loadgen.x
)

for proto in "${core_protos[@]}"; do
  generate "packages/protocol/src/protocol/${proto%.x}.ts" "protocol/${proto}"
done

contract_spec_protos=(
  contract_spec.x
)

for proto in "${contract_spec_protos[@]}"; do
  generate "packages/contract-spec/src/protocol/${proto%.x}.ts" "protocol/${proto}"
done

for proto in "${rpc_protos[@]}"; do
  generate "packages/rpc/src/protocol/${proto%.x}.ts" "protocol/${proto}"
done

gateway_protos=(
  pagination.x indexer.x
)

for proto in "${gateway_protos[@]}"; do
  generate "packages/gateway/src/protocol/${proto%.x}.ts" "protocol/${proto}"
done

# Test fixture: echo RPC (standalone, needs proto import line removed)
generate "packages/rpc/test/fixtures/echo.ts" "packages/rpc/test/fixtures/echo.x"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' '/^import \* as proto/d' "packages/rpc/test/fixtures/echo.ts"
else
  sed -i '/^import \* as proto/d' "packages/rpc/test/fixtures/echo.ts"
fi

# Test fixtures: kitchen-sink XDR types (split into base + compound so
# cross-type refs resolve through the hand-written index.ts barrel)
generate "packages/protocol/test/fixtures/test_base.ts" "packages/protocol/test/fixtures/test_base.x"
generate "packages/protocol/test/fixtures/test_compound.ts" "packages/protocol/test/fixtures/test_compound.x"

echo "-- Done --" >&2
