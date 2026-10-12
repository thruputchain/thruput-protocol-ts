#!/bin/bash
#
# Check that the package manifests record the protocol commit the `protocol`
# submodule is pinned to (as written by generate.sh).
# Usage: ./scripts/check-codegen-provenance.sh
#
# Needs neither x23c nor a submodule checkout: the pinned commit comes from
# the superproject's index. It catches a submodule bump without regeneration;
# .github/workflows/codegen.yml regenerates and diffs to catch hand edits.

set -euo pipefail

expected=$(git rev-parse :protocol)
status=0

for pkg in protocol contract-spec rpc gateway; do
  manifest="packages/${pkg}/package.json"
  actual=$(node -p "require('./${manifest}').groundhog?.protocolCommit ?? ''")
  if [[ $actual != "$expected" ]]; then
    echo "${manifest}: groundhog.protocolCommit is '${actual}', expected ${expected}" >&2
    status=1
  fi
done

if [[ $status -ne 0 ]]; then
  echo "Regenerate with: XDRC=/path/to/x23c ./scripts/generate.sh" >&2
else
  echo "Package manifests match groundhogchain/protocol@${expected}" >&2
fi

exit $status
