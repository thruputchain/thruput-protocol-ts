// contract.ts — from contract.x

import type { ContractAddress, SHA256Hash } from "./types.js";
import { HogexecPrecompiledNativeContracts } from "./precompiles.js";

// ============================================================================
// Branded types
// ============================================================================

export type ContractEntrypointID = Uint8Array & { readonly __brand: "ContractEntrypointID" };
export function contractEntrypointID(data: Uint8Array): ContractEntrypointID {
  if (data.length !== 8) throw new Error(`ContractEntrypointID must be exactly 8 bytes, got ${data.length}`);
  return data as ContractEntrypointID;
}

export type Identifier = string & { readonly __brand: "Identifier" };
export function identifier(val: string): Identifier {
  return val as Identifier;
}

export type SemVer = string & { readonly __brand: "SemVer" };
export function semVer(val: string): SemVer {
  return val as SemVer;
}

// ============================================================================
// Enums
// ============================================================================

export enum ContractType {
  kWasmi = 0,
  kNative = 1,
  kMockTest = 2,
}

// ============================================================================
// Structs
// ============================================================================

export interface ContractBlob {
  wasm: Uint8Array;
}

export interface ContractDeploymentHashPreimage {
  deployer_address: ContractAddress;
  nonce: SHA256Hash;
  contract_hash: SHA256Hash;
}

export interface ContractInterfaceIDPreimage {
  name: Identifier;
  vers: SemVer;
}

export interface DeployedContractHash {
  hash: SHA256Hash;
  contract_size: bigint;
  contract_type: ContractType;
}

export interface AddressMetadata {
  deployed_contract: DeployedContractHash;
}

// ============================================================================
// Unions
// ============================================================================

export type Contract =
  | { contract_type: ContractType.kWasmi; wasmi_contract: ContractBlob }
  | { contract_type: ContractType.kNative; native_contract_id: HogexecPrecompiledNativeContracts }
  | { contract_type: ContractType.kMockTest; mock_contract_id: bigint };
