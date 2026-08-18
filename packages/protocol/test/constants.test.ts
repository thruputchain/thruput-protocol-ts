import { describe, expect, it } from "vitest";
import {
  HOG_ADDRESS,
  toHex,
  type ContractAddress,
} from "../src/index.js";

describe("HOG_ADDRESS", () => {
  it("is the typed precompiled native HOG token address", () => {
    const address: ContractAddress = HOG_ADDRESS;

    expect(address).toHaveLength(32);
    expect(toHex(address)).toBe(
      "0000000000000000000000000000000000000000000000000000000000000001",
    );
  });
});
