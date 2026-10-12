#!/usr/bin/env node
// Loads every subpath in every workspace package's `exports` map under the
// current Node runtime, in both ESM and CJS form.
//
// `npm test` runs src/ through vitest's transform pipeline, so it can pass on
// a runtime that cannot actually load the artifacts we publish — a downlevel
// syntax gap, a builtin missing on an older major, a broken exports entry, or
// a CJS build that require()s an ESM-only dependency. This loads the real
// dist/ files, which is what the CI version matrix needs to exercise for the
// matrix to mean anything.
import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);
const packagesDir = new URL("packages/", root);

const failures = [];
let checked = 0;
const requiredExports = {
  "@thruputchain/xdr": {
    ".": ["Uint8Codec", "FixedOpaqueCodec", "VarOpaqueCodec"],
  },
};

for (const dir of readdirSync(fileURLToPath(packagesDir)).sort()) {
  const pkgRoot = new URL(`${dir}/`, packagesDir);
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(new URL("package.json", pkgRoot), "utf8"));
  } catch {
    continue; // not a package directory
  }

  for (const [subpath, entry] of Object.entries(pkg.exports ?? {})) {
    for (const condition of ["import", "require"]) {
      const relative = entry[condition];
      if (!relative) continue;

      const label = `${pkg.name}${subpath.slice(1)} (${condition})`;
      const target = fileURLToPath(new URL(relative, pkgRoot));
      checked++;
      try {
        const mod =
          condition === "import" ? await import(target) : require(target);
        const names = Object.keys(mod).filter(
          (k) => k !== "default" && k !== "__esModule",
        );
        if (names.length === 0) {
          failures.push(`${label}: loaded but exported nothing`);
        }
        for (const name of requiredExports[pkg.name]?.[subpath] ?? []) {
          if (!names.includes(name)) {
            failures.push(`${label}: missing ${name}`);
          }
        }
        if (
          pkg.name === "@thruputchain/protocol" &&
          subpath === "." &&
          !isHogAddress(mod.HOG_ADDRESS)
        ) {
          failures.push(`${label}: HOG_ADDRESS has incorrect bytes`);
        }
      } catch (err) {
        failures.push(`${label}: ${err.message}`);
      }
    }
  }
}

if (checked === 0) {
  console.error("Smoke test found no entry points — is packages/ populated?");
  process.exit(1);
}

if (failures.length > 0) {
  console.error(`Smoke test FAILED on Node ${process.version}:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error("\nRun `npm run build` first if dist/ is stale.");
  process.exit(1);
}

console.log(
  `Smoke test passed on Node ${process.version}: ${checked} entry points loaded from dist/.`,
);

function isHogAddress(value) {
  return (
    value instanceof Uint8Array &&
    value.length === 32 &&
    value.every((byte, index) => byte === (index === 31 ? 1 : 0))
  );
}
