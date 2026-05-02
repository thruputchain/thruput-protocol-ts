export * from "./test_types.js";

import { codec as test_types_codec } from "./test_types.js";

export const codec = {
  ...test_types_codec,
} as const;
