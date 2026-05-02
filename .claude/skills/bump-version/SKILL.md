---
name: bump-version
description: Use when bumping the version of all packages in this monorepo, before a release
allowed-tools: Bash(jq *), Read, Edit
---

# Bump Version

Bump the version across all packages in this npm workspaces monorepo. All packages must share the same version, and cross-dependency versions must match.

## Usage

Ask the user which bump type (patch, minor, major) if not specified.

## Steps

Current version: !`jq -r .version packages/xdr/package.json`

1. Determine the new version from the current version and the bump type
2. Update **every** `package.json` under `packages/` — both the top-level `version` field and any `@groundhogchain/*` entries in `dependencies`:

```bash
for f in packages/*/package.json; do
  jq --arg v "$NEW_VERSION" '
    .version = $v |
    if .dependencies then
      .dependencies |= with_entries(
        if .key | startswith("@groundhogchain/") then .value = $v else . end
      )
    else . end
  ' "$f" > tmp.json && mv tmp.json "$f"
done
```

3. Run `npm install` to update `package-lock.json`
4. Commit with message `v$NEW_VERSION`
