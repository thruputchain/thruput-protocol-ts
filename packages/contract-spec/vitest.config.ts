import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@thruputchain/xdr": path.resolve(__dirname, "../xdr/src/index.ts"),
      "@thruputchain/protocol": path.resolve(__dirname, "../protocol/src/index.ts"),
    },
  },
});
