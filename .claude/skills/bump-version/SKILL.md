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
2. Update **every** `package.json` under `packages/` — both the top-level `version` field and any `@thruputchain/*` entries in `dependencies`:

```bash
for f in packages/*/package.json; do
  jq --arg v "$NEW_VERSION" '
    .version = $v |
    if .dependencies then
      .dependencies |= with_entries(
        if .key | startswith("@thruputchain/") then .value = $v else . end
      )
    else . end
  ' "$f" > tmp.json && mv tmp.json "$f"
done
```

3. Run `npm install` to update `package-lock.json`
4. Add a row for `$NEW_VERSION` at the top of the "Protocol commit per release" table in `README.md`, using `git rev-parse --short=7 HEAD:protocol`. List any devnet bundle versions whose `release-manifest.toml` in groundhogchain/packaging pins the same `[protocol] repository_commit`, or `—` if none (ask the user if you cannot check)
5. Commit with message `v$NEW_VERSION`
