import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@groundhog/xdr": path.resolve(__dirname, "../xdr/src/index.ts"),
    },
  },
});
