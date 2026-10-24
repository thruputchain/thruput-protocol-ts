import { describe, expect, it } from "vitest";
import {
  NATIVE_TOKEN_ADDRESS,
  toHex,
  type ContractAddress,
} from "../src/index.js";

describe("NATIVE_TOKEN_ADDRESS", () => {
  it("is the typed precompiled native-token address", () => {
    const address: ContractAddress = NATIVE_TOKEN_ADDRESS;

    expect(address).toHaveLength(32);
    expect(toHex(address)).toBe(
      "0000000000000000000000000000000000000000000000000000000000000001",
    );
  });
});
