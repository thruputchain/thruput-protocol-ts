#!/usr/bin/env node
// Check the tarballs a consumer installs, without workspace source aliases.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
// Invoke npm's JavaScript entrypoint, not the shell-only npm.cmd on Windows.
const npmCli = process.env.npm_execpath;
assert(npmCli, "Run this check with npm run test:package.");
const directory = await mkdtemp(join(tmpdir(), "thruput-protocol-consumer-"));
const require = createRequire(import.meta.url);
const run = (command, args, cwd = directory) =>
  execFileSync(command, args, { cwd, encoding: "utf8", stdio: "pipe" });

try {
  const dependencies = {};
  const specifiers = [];
  for (const name of (await readdir(join(root, "packages"))).sort()) {
    const cwd = join(root, "packages", name);
    const manifest = JSON.parse(
      await readFile(join(cwd, "package.json"), "utf8"),
    );
    const [packed] = JSON.parse(
      run(
        process.execPath,
        [npmCli, "pack", "--json", "--pack-destination", directory],
        cwd,
      ),
    );
    assert(packed.files.some((file) => file.path === "LICENSE"));
    assert(packed.files.some((file) => file.path === "README.md"));
    assert(
      !packed.files.some((file) => /^(src|test|scripts)\//.test(file.path)),
    );
    dependencies[manifest.name] = `file:./${packed.filename}`;
    for (const subpath of Object.keys(manifest.exports)) {
      specifiers.push(manifest.name + subpath.slice(1));
    }
  }
  assert.equal(Object.keys(dependencies).length, 5);
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({ private: true, type: "module", dependencies }),
  );
  // All Thruput packages come from the local tarballs. Other dependencies are public.
  await writeFile(join(directory, ".npmrc"), "ignore-scripts=true\n");
  run(process.execPath, [
    npmCli,
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
  ]);

  const imports = specifiers
    .map(
      (specifier, index) =>
        `import * as api${index} from ${JSON.stringify(specifier)};\nexport { api${index} };`,
    )
    .join("\n");
  for (const extension of ["mts", "cts"]) {
    await writeFile(join(directory, `consumer.${extension}`), imports);
  }
  for (const resolution of ["NodeNext", "Bundler"]) {
    await writeFile(
      join(directory, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM"],
          types: [],
          module: resolution === "NodeNext" ? "NodeNext" : "ESNext",
          moduleResolution: resolution,
          strict: true,
          noUncheckedIndexedAccess: true,
          exactOptionalPropertyTypes: true,
          skipLibCheck: false,
          noEmit: true,
        },
        include:
          resolution === "NodeNext"
            ? ["consumer.mts", "consumer.cts"]
            : ["consumer.mts"],
      }),
    );
    run(process.execPath, [
      require.resolve("typescript/bin/tsc"),
      "-p",
      "tsconfig.json",
    ]);
  }

  await writeFile(
    join(directory, "smoke.mjs"),
    `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    const require = createRequire(import.meta.url);
    for (const specifier of ${JSON.stringify(specifiers)}) {
      const esm = await import(specifier);
      const cjs = require(specifier);
      assert(Object.keys(esm).length > 0);
      assert.deepEqual(Object.keys(esm).sort(), Object.keys(cjs).sort());
    }
    import { serialize, deserialize } from '@thruputchain/xdr';
    import { codec, paginationCursor } from '@thruputchain/gateway';
    const cursor = paginationCursor(new Uint8Array([1, 2, 3]));
    assert.deepEqual(deserialize(serialize(cursor, codec.PaginationCursor), codec.PaginationCursor), cursor);
  `,
  );
  run(process.execPath, ["smoke.mjs"]);
  console.log(
    "All five packed packages pass strict consumer types and ESM/CJS runtime checks.",
  );
} catch (error) {
  if (error.stdout) console.error(error.stdout);
  if (error.stderr) console.error(error.stderr);
  throw error;
} finally {
  await rm(directory, { recursive: true, force: true });
}
