#!/bin/bash
#
# Generate TypeScript from XDR definitions for both packages.
# Usage: XDRC=/path/to/x23c ./scripts/generate.sh
#
# The index.ts barrels are hand-written (like lib.rs in protocol-rs).
# This script only regenerates the .ts files from .x files.

set -euo pipefail

[[ -z ${XDRC:-} ]] && XDRC="../../hogd/vscode/x23/x23c/x23c"

echo "-- Using XDRC=${XDRC} --" >&2

core_protos=(
  types.x contract.x exec_result.x event.x genesis.x transaction.x
  retrocausal_queue.x storage_cost.x syscall_error.x auth_claim.x
  standard_asset_events.x address_auth.x storage_item.x precompiles.x block.x
  invoke_flag.x
)

rpc_protos=(
  dogwood_kit.x auth_card.x sched_db.x
  wallet.x dogwood_rpc.x event_rpc.x auth_rpc.x test_rpc.x
  discovery.x config.x dogwood.x
  scp.x scp_config.x scp_control.x scp_handle.x network.x
  rpc_types.x parallel.x nomination.x db_sched.x exec_sched.x
  consensus.x sched_coord.x coord_sched.x catchup.x repair.x loadgen.x
)

for proto in "${core_protos[@]}"; do
  $XDRC --ts -o "packages/protocol/src/protocol/${proto%.x}.ts" "protocol/${proto}"
done

for proto in "${rpc_protos[@]}"; do
  $XDRC --ts -o "packages/rpc/src/protocol/${proto%.x}.ts" "protocol/${proto}"
done

# Test fixture: echo RPC (standalone, needs proto import line removed)
$XDRC --ts -o "packages/rpc/test/fixtures/echo.ts" "packages/rpc/test/fixtures/echo.x"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' '/^import \* as proto/d' "packages/rpc/test/fixtures/echo.ts"
else
  sed -i '/^import \* as proto/d' "packages/rpc/test/fixtures/echo.ts"
fi

# Test fixture: kitchen-sink XDR types (has a hand-written index.ts barrel
# so the generated proto import resolves naturally)
$XDRC --ts -o "packages/protocol/test/fixtures/test_types.ts" "packages/protocol/test/fixtures/test_types.x"

echo "-- Done --" >&2
