#!/bin/bash
#
# Generate TypeScript from XDR definitions for both packages.
# Usage: XDRC=/path/to/x23c ./scripts/generate.sh
#

set -euo pipefail

[[ -z ${XDRC:-} ]] && XDRC="../../hogd/vscode/x23/x23c/x23c"

echo "-- Using XDRC=${XDRC} --" >&2

# generate_package OUTDIR [--dep PKG]... -- PROTO...
#
# Generates .ts files from XDR, then writes a barrel index.ts.
# --dep PKG adds `export * from "PKG"` and merges its codec namespace.
generate_package() {
  local outdir=$1; shift
  local deps=()
  local protos=()

  # Parse args: --dep flags before --, then proto files after
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dep) deps+=("$2"); shift 2 ;;
      --)    shift; break ;;
      *)     break ;;
    esac
  done
  protos=("$@")

  echo "-- Generating TypeScript to ${outdir}/ --" >&2

  for proto in "${protos[@]}"; do
    local name
    name=$(basename "${proto}" .x)
    echo "  ${proto} -> ${outdir}/${name}.ts" >&2
    $XDRC --ts -o "${outdir}/${name}.ts" "protocol/${proto}"
  done

  echo "-- Generating ${outdir}/index.ts --" >&2
  {
    echo "// Auto-generated barrel — do not edit"
    echo ""

    # Re-export dependency packages (so proto.X resolves for cross-package types)
    for dep in "${deps[@]+"${deps[@]}"}"; do
      echo "export * from \"${dep}\";"
    done

    for proto in "${protos[@]}"; do
      local name
      name=$(basename "${proto}" .x)
      echo "export * from \"./${name}.js\";"
    done
    echo ""
    echo "// Merged codec namespace"

    # Import dependency codecs
    local dep_idx=0
    for dep in "${deps[@]+"${deps[@]}"}"; do
      echo "import { codec as _dep${dep_idx}_codec } from \"${dep}\";"
      dep_idx=$((dep_idx + 1))
    done

    for proto in "${protos[@]}"; do
      local name
      name=$(basename "${proto}" .x)
      echo "import { codec as ${name}_codec } from \"./${name}.js\";"
    done
    echo ""
    echo "export const codec = {"

    # Spread dependency codecs first
    dep_idx=0
    for _ in "${deps[@]+"${deps[@]}"}"; do
      echo "  ..._dep${dep_idx}_codec,"
      dep_idx=$((dep_idx + 1))
    done

    for proto in "${protos[@]}"; do
      local name
      name=$(basename "${proto}" .x)
      echo "  ...${name}_codec,"
    done
    echo "} as const;"
  } > "${outdir}/index.ts"
}

# ============================================================================
# @groundhog/protocol — core types (user-facing, small, tree-shakeable)
# ============================================================================
core_protos=(
  types.x
  contract.x
  exec_result.x
  event.x
  genesis.x
  transaction.x
  retrocausal_queue.x
  storage_cost.x
  syscall_error.x
  auth_claim.x
  standard_asset_events.x
  address_auth.x
  storage_item.x
  precompiles.x
  block.x
)

generate_package "packages/protocol/src/protocol" -- "${core_protos[@]}"

# ============================================================================
# @groundhog/rpc — RPC types + ONC-RPC client (internal services)
# ============================================================================
rpc_protos=(
  wallet.x
  dogwood_rpc.x
  event_rpc.x
  auth_rpc.x
  test_rpc.x
  discovery.x
  config.x
  dogwood.x
  scp.x
  scp_config.x
  scp_control.x
  scp_handle.x
  network.x
  rpc_types.x
  parallel.x
  nomination.x
  db_sched.x
  exec_sched.x
  consensus.x
  sched_coord.x
  coord_sched.x
  catchup.x
  repair.x
  loadgen.x
)

generate_package "packages/rpc/src/protocol" --dep "@groundhog/protocol" -- "${rpc_protos[@]}"

echo "-- Done --" >&2
