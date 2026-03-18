// -*- TypeScript -*-
// Generated from contract.x — DO NOT EDIT
import { type XdrCodec } from "../xdr/codec.js";
import * as proto from "./index.js";

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
  deployer_address: proto.ContractAddress;
  nonce: proto.SHA256Hash;
  contract_hash: proto.SHA256Hash;
}

export interface ContractInterfaceIDPreimage {
  name: proto.Identifier;
  vers: proto.SemVer;
}

export interface DeployedContractHash {
  hash: proto.SHA256Hash;
  contract_size: bigint;
  contract_type: proto.ContractType;
}

export interface AddressMetadata {
  deployed_contract: proto.DeployedContractHash;
}

// ============================================================================
// Unions
// ============================================================================

export type Contract =
  | { contract_type: proto.ContractType.kWasmi; wasmi_contract: proto.ContractBlob }
  | { contract_type: proto.ContractType.kNative; native_contract_id: proto.HogexecPrecompiledNativeContracts }
  | { contract_type: proto.ContractType.kMockTest; mock_contract_id: bigint }
;

// ============================================================================
// XDR Codecs
// ============================================================================

const _ContractEntrypointID: XdrCodec<proto.ContractEntrypointID> = {
  encode(w, val) { w.writeFixedOpaque(val, 8); },
  decode(r) { return proto.contractEntrypointID(r.readFixedOpaque(8)); },
};

const _Identifier: XdrCodec<proto.Identifier> = {
  encode(w, val) { w.writeString(val, 0xFFFFFFFF); },
  decode(r) { return proto.identifier(r.readString(0xFFFFFFFF)); },
};

const _SemVer: XdrCodec<proto.SemVer> = {
  encode(w, val) { w.writeString(val, 0xFFFFFFFF); },
  decode(r) { return proto.semVer(r.readString(0xFFFFFFFF)); },
};

const _ContractBlob: XdrCodec<proto.ContractBlob> = {
  encode(w, val) { w.writeVarOpaque(val.wasm, 0xFFFFFFFF); },
  decode(r) { return { wasm: r.readVarOpaque(0xFFFFFFFF) }; },
};

const _Contract: XdrCodec<proto.Contract> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.contract_type));
    switch (val.contract_type) {
      case proto.ContractType.kWasmi:
        _ContractBlob.encode(w, val.wasmi_contract);
        break;
      case proto.ContractType.kNative:
        w.writeInt32(BigInt(val.native_contract_id));
        break;
      case proto.ContractType.kMockTest:
        w.writeInt32(val.mock_contract_id);
        break;
    }
  },
  decode(r) {
    const contract_type = Number(r.readInt32());
    switch (contract_type) {
      case proto.ContractType.kWasmi:
        return { contract_type, wasmi_contract: _ContractBlob.decode(r) };
      case proto.ContractType.kNative:
        return { contract_type, native_contract_id: Number(r.readInt32()) as proto.HogexecPrecompiledNativeContracts };
      case proto.ContractType.kMockTest:
        return { contract_type, mock_contract_id: r.readInt32() };
      default:
        throw new Error(`Unknown ContractType: ${contract_type}`);
    }
  },
};

const _ContractDeploymentHashPreimage: XdrCodec<proto.ContractDeploymentHashPreimage> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.deployer_address);
    proto.codec.SHA256Hash.encode(w, val.nonce);
    proto.codec.SHA256Hash.encode(w, val.contract_hash);
  },
  decode(r) {
    return {
      deployer_address: proto.codec.ContractAddress.decode(r),
      nonce: proto.codec.SHA256Hash.decode(r),
      contract_hash: proto.codec.SHA256Hash.decode(r),
    };
  },
};

const _ContractInterfaceIDPreimage: XdrCodec<proto.ContractInterfaceIDPreimage> = {
  encode(w, val) {
    _Identifier.encode(w, val.name);
    _SemVer.encode(w, val.vers);
  },
  decode(r) {
    return { name: _Identifier.decode(r), vers: _SemVer.decode(r) };
  },
};

const _DeployedContractHash: XdrCodec<proto.DeployedContractHash> = {
  encode(w, val) {
    proto.codec.SHA256Hash.encode(w, val.hash);
    w.writeUint32(val.contract_size);
    w.writeInt32(BigInt(val.contract_type));
  },
  decode(r) {
    return {
      hash: proto.codec.SHA256Hash.decode(r),
      contract_size: r.readUint32(),
      contract_type: Number(r.readInt32()) as proto.ContractType,
    };
  },
};

const _AddressMetadata: XdrCodec<proto.AddressMetadata> = {
  encode(w, val) { _DeployedContractHash.encode(w, val.deployed_contract); },
  decode(r) { return { deployed_contract: _DeployedContractHash.decode(r) }; },
};

export const codec = {
  ContractEntrypointID: _ContractEntrypointID,
  Identifier: _Identifier,
  SemVer: _SemVer,
  ContractBlob: _ContractBlob,
  Contract: _Contract,
  ContractDeploymentHashPreimage: _ContractDeploymentHashPreimage,
  ContractInterfaceIDPreimage: _ContractInterfaceIDPreimage,
  DeployedContractHash: _DeployedContractHash,
  AddressMetadata: _AddressMetadata,
} as const;
