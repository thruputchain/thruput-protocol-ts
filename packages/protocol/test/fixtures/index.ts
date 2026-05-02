export * from "./test_base.js";
export * from "./test_compound.js";

import { codec as base_codec } from "./test_base.js";
import { codec as compound_codec } from "./test_compound.js";

export const codec = {
  ...base_codec,
  ...compound_codec,
} as const;
