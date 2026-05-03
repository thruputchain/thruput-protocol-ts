import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@groundhogchain/xdr": path.resolve(__dirname, "../xdr/src/index.ts"),
    },
  },
});
