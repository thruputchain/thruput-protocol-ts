#!/bin/bash
#
# Generate TypeScript protocol types from XDR definitions.
# Usage: XDRC=/path/to/x23c ./scripts/generate.sh
#
# Mirrors protocol-rs/scripts/generate.sh but for TypeScript output.

set -euo pipefail

[[ -z ${XDRC:-} ]] && XDRC="../../hogd/vscode/x23/x23c/x23c"

echo "-- Using XDRC=${XDRC} --" >&2

# XDR files to generate TypeScript for.
# These are the user-facing protocol types (same as protocol-rs "protos" list).
# RPC, scheduler, and coordinator types are not needed for the TS SDK.
protos=(
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

OUTDIR="src/protocol"

echo "-- Generating TypeScript to ${OUTDIR}/ --" >&2

for proto in "${protos[@]}"; do
  name=$(basename "${proto}" .x)
  echo "  ${proto} -> ${OUTDIR}/${name}.ts" >&2
  $XDRC --ts -o "${OUTDIR}/${name}.ts" "protocol/${proto}"
done

# Regenerate the barrel index that re-exports all generated files
# and merges the codec namespaces.
echo "-- Generating ${OUTDIR}/index.ts --" >&2

{
  echo "// Auto-generated barrel — do not edit"
  echo ""
  for proto in "${protos[@]}"; do
    name=$(basename "${proto}" .x)
    echo "export * from \"./${name}.js\";"
  done
  echo ""
  echo "// Merged codec namespace"
  for proto in "${protos[@]}"; do
    name=$(basename "${proto}" .x)
    echo "import { codec as ${name}_codec } from \"./${name}.js\";"
  done
  echo ""
  echo "export const codec = {"
  for proto in "${protos[@]}"; do
    name=$(basename "${proto}" .x)
    echo "  ...${name}_codec,"
  done
  echo "} as const;"
} > "${OUTDIR}/index.ts"

echo "-- Done --" >&2
