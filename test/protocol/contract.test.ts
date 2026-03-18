import { describe, it, expect } from "vitest";
import {
  HogexecPrecompiledNativeContracts,
  ContractType,
  contractEntrypointID, ContractEntrypointID,
} from "../../src/protocol/index.js";

describe("precompiles", () => {
  it("HogexecPrecompiledNativeContracts has correct values", () => {
    expect(HogexecPrecompiledNativeContracts.kNativeContractHogToken).toBe(0);
    expect(HogexecPrecompiledNativeContracts.kNativeContractInitialTokenClaim).toBe(1);
  });
});

describe("contract types", () => {
  it("ContractType has correct values", () => {
    expect(ContractType.kWasmi).toBe(0);
    expect(ContractType.kNative).toBe(1);
    expect(ContractType.kMockTest).toBe(2);
  });

  it("contractEntrypointID accepts 8 bytes", () => {
    const data = new Uint8Array(8);
    const id: ContractEntrypointID = contractEntrypointID(data);
    expect(id).toBe(data);
  });

  it("contractEntrypointID rejects wrong length", () => {
    expect(() => contractEntrypointID(new Uint8Array(7))).toThrow();
  });
});
