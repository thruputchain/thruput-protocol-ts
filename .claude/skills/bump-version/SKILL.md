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
4. Run `npm run codegen:check`; if it fails, the generated code does not match the pinned protocol commit, so stop and ask the user to regenerate first
5. Add a row for `$NEW_VERSION` at the top of the "Protocol commit per release" table in `README.md`, using the short form of `jq -r .groundhog.protocolCommit packages/protocol/package.json`. List any devnet bundle versions whose `release-manifest.toml` in groundhogchain/packaging pins the same `[protocol] repository_commit`, or `—` if none (ask the user if you cannot check)
6. Commit with message `v$NEW_VERSION`
