// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5351fdbd5f24dc09297b1857e6e8605cbf0ee655

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface ContractBlob {
  data: Uint8Array;
}

export enum ContractType {
  kWasmi = 0,
  kNative = 1,
  kMockTest = 2,
  kRv32 = 3,
}

export type Contract =
  | { contract_type: proto.ContractType.kWasmi; wasmi_contract: proto.ContractBlob }
  | { contract_type: proto.ContractType.kNative; native_contract_id: proto.HogexecPrecompiledNativeContracts }
  | { contract_type: proto.ContractType.kMockTest; mock_contract_id: bigint }
  | { contract_type: proto.ContractType.kRv32; rv32_contract: proto.ContractBlob }
;

export interface ContractDeploymentHashPreimage {
  deployer_address: proto.ContractAddress;
  nonce: proto.SHA256Hash;
  contract_hash: proto.SHA256Hash;
}

export type Identifier = string & { readonly __brand: "Identifier" };
export function identifier(val: string): Identifier {
  return val as Identifier;
}

export type SemVer = string & { readonly __brand: "SemVer" };
export function semVer(val: string): SemVer {
  return val as SemVer;
}

export interface ContractInterfaceIDPreimage {
  name: proto.Identifier;
  vers: proto.SemVer;
}

export type ContractEntrypointID = Uint8Array & { readonly __brand: "ContractEntrypointID" };
export function contractEntrypointID(data: Uint8Array): ContractEntrypointID {
  if (data.length !== 8) throw new Error(`ContractEntrypointID must be exactly 8 bytes, got ${data.length}`);
  return data as ContractEntrypointID;
}

export interface DeployedContractHash {
  hash: proto.SHA256Hash;
  contract_size: bigint;
  contract_type: proto.ContractType;
}

export interface AddressMetadata {
  deployed_contract: proto.DeployedContractHash;
}



//
// XDR Codecs below this point
//

const _ContractBlob: XdrCodec<ContractBlob> = {
  encode(w, val) {
    w.writeVarOpaque(val.data, Number(0xFFFFFFFF));
  },
  decode(r) {
    const data = r.readVarOpaque(Number(0xFFFFFFFF));
    return { data };
  },
};

const _ContractType: XdrCodec<ContractType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ContractType; },
};

const _Contract: XdrCodec<Contract> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.contract_type));
    switch (val.contract_type) {
      case proto.ContractType.kWasmi:
        proto.codec.ContractBlob.encode(w, val.wasmi_contract);
        break;
      case proto.ContractType.kNative:
        proto.codec.HogexecPrecompiledNativeContracts.encode(w, val.native_contract_id);
        break;
      case proto.ContractType.kMockTest:
        w.writeInt32(val.mock_contract_id);
        break;
      case proto.ContractType.kRv32:
        proto.codec.ContractBlob.encode(w, val.rv32_contract);
        break;
    }
  },
  decode(r) {
    const contract_type = Number(r.readInt32());
    switch (contract_type) {
      case proto.ContractType.kWasmi:
        const wasmi_contract = proto.codec.ContractBlob.decode(r);
        return { contract_type, wasmi_contract };
      case proto.ContractType.kNative:
        const native_contract_id = proto.codec.HogexecPrecompiledNativeContracts.decode(r);
        return { contract_type, native_contract_id };
      case proto.ContractType.kMockTest:
        const mock_contract_id = r.readInt32();
        return { contract_type, mock_contract_id };
      case proto.ContractType.kRv32:
        const rv32_contract = proto.codec.ContractBlob.decode(r);
        return { contract_type, rv32_contract };
      default:
        throw new Error(`Unknown Contract discriminant: ${contract_type}`);
    }
  },
};

const _ContractDeploymentHashPreimage: XdrCodec<ContractDeploymentHashPreimage> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.deployer_address);
    proto.codec.SHA256Hash.encode(w, val.nonce);
    proto.codec.SHA256Hash.encode(w, val.contract_hash);
  },
  decode(r) {
    const deployer_address = proto.codec.ContractAddress.decode(r);
    const nonce = proto.codec.SHA256Hash.decode(r);
    const contract_hash = proto.codec.SHA256Hash.decode(r);
    return { deployer_address, nonce, contract_hash };
  },
};

const _Identifier: XdrCodec<Identifier> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return identifier(r.readString(Number(0xFFFFFFFF))); },
};

const _SemVer: XdrCodec<SemVer> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return semVer(r.readString(Number(0xFFFFFFFF))); },
};

const _ContractInterfaceIDPreimage: XdrCodec<ContractInterfaceIDPreimage> = {
  encode(w, val) {
    proto.codec.Identifier.encode(w, val.name);
    proto.codec.SemVer.encode(w, val.vers);
  },
  decode(r) {
    const name = proto.codec.Identifier.decode(r);
    const vers = proto.codec.SemVer.decode(r);
    return { name, vers };
  },
};

const _ContractEntrypointID: XdrCodec<ContractEntrypointID> = {
  encode(w, val) { w.writeFixedOpaque(val, 8); },
  decode(r) { return contractEntrypointID(r.readFixedOpaque(8)); },
};

const _DeployedContractHash: XdrCodec<DeployedContractHash> = {
  encode(w, val) {
    proto.codec.SHA256Hash.encode(w, val.hash);
    w.writeUint32(val.contract_size);
    proto.codec.ContractType.encode(w, val.contract_type);
  },
  decode(r) {
    const hash = proto.codec.SHA256Hash.decode(r);
    const contract_size = r.readUint32();
    const contract_type = proto.codec.ContractType.decode(r);
    return { hash, contract_size, contract_type };
  },
};

const _AddressMetadata: XdrCodec<AddressMetadata> = {
  encode(w, val) {
    proto.codec.DeployedContractHash.encode(w, val.deployed_contract);
  },
  decode(r) {
    const deployed_contract = proto.codec.DeployedContractHash.decode(r);
    return { deployed_contract };
  },
};

export const codec = {
  ContractBlob: _ContractBlob,
  ContractType: _ContractType,
  Contract: _Contract,
  ContractDeploymentHashPreimage: _ContractDeploymentHashPreimage,
  Identifier: _Identifier,
  SemVer: _SemVer,
  ContractInterfaceIDPreimage: _ContractInterfaceIDPreimage,
  ContractEntrypointID: _ContractEntrypointID,
  DeployedContractHash: _DeployedContractHash,
  AddressMetadata: _AddressMetadata,
} as const;

