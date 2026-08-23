import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    typecheck: { enabled: true, tsconfig: "./tsconfig.test.json" },
  },
  resolve: {
    alias: {
      "@groundhogchain/xdr": path.resolve(__dirname, "../xdr/src/index.ts"),
    },
  },
});
