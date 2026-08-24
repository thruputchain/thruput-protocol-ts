import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@groundhogchain/xdr": path.resolve(__dirname, "../xdr/src/index.ts"),
      "@groundhogchain/protocol": path.resolve(__dirname, "../protocol/src/index.ts"),
      "@groundhogchain/rpc": path.resolve(__dirname, "../rpc/src/index.ts"),
    },
  },
});
