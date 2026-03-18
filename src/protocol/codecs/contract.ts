import type { XdrCodec } from "../../xdr/codec.js";
import {
  contractEntrypointID,
  ContractType,
  HogexecPrecompiledNativeContracts,
  identifier, semVer,
} from "../index.js";
import type {
  ContractEntrypointID as ContractEntrypointIDType,
  ContractBlob as ContractBlobType,
  Contract as ContractType_,
  Identifier as IdentifierType,
  SemVer as SemVerType,
  ContractInterfaceIDPreimage as ContractInterfaceIDPreimageType,
  ContractDeploymentHashPreimage as ContractDeploymentHashPreimageType,
  DeployedContractHash as DeployedContractHashType,
  AddressMetadata as AddressMetadataType,
} from "../contract.js";
import * as typesCodecs from "./types.js";

export const ContractEntrypointID: XdrCodec<ContractEntrypointIDType> = {
  encode(w, val) { w.writeFixedOpaque(val, 8); },
  decode(r) { return contractEntrypointID(r.readFixedOpaque(8)); },
};

export const ContractBlob: XdrCodec<ContractBlobType> = {
  encode(w, val) { w.writeVarOpaque(val.wasm, 0xFFFFFFFF); },
  decode(r) { return { wasm: r.readVarOpaque(0xFFFFFFFF) }; },
};

export const Identifier: XdrCodec<IdentifierType> = {
  encode(w, val) { w.writeString(val, 0xFFFFFFFF); },
  decode(r) { return identifier(r.readString(0xFFFFFFFF)); },
};

export const SemVer: XdrCodec<SemVerType> = {
  encode(w, val) { w.writeString(val, 0xFFFFFFFF); },
  decode(r) { return semVer(r.readString(0xFFFFFFFF)); },
};

export const Contract: XdrCodec<ContractType_> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.contract_type));
    switch (val.contract_type) {
      case ContractType.kWasmi:
        ContractBlob.encode(w, val.wasmi_contract);
        break;
      case ContractType.kNative:
        w.writeInt32(BigInt(val.native_contract_id));
        break;
      case ContractType.kMockTest:
        w.writeInt32(val.mock_contract_id);
        break;
    }
  },
  decode(r) {
    const contract_type = Number(r.readInt32());
    switch (contract_type) {
      case ContractType.kWasmi:
        return { contract_type, wasmi_contract: ContractBlob.decode(r) };
      case ContractType.kNative:
        return { contract_type, native_contract_id: Number(r.readInt32()) as HogexecPrecompiledNativeContracts };
      case ContractType.kMockTest:
        return { contract_type, mock_contract_id: r.readInt32() };
      default:
        throw new Error(`Unknown ContractType: ${contract_type}`);
    }
  },
};

export const ContractDeploymentHashPreimage: XdrCodec<ContractDeploymentHashPreimageType> = {
  encode(w, val) {
    typesCodecs.ContractAddress.encode(w, val.deployer_address);
    typesCodecs.SHA256Hash.encode(w, val.nonce);
    typesCodecs.SHA256Hash.encode(w, val.contract_hash);
  },
  decode(r) {
    return {
      deployer_address: typesCodecs.ContractAddress.decode(r),
      nonce: typesCodecs.SHA256Hash.decode(r),
      contract_hash: typesCodecs.SHA256Hash.decode(r),
    };
  },
};

export const ContractInterfaceIDPreimage: XdrCodec<ContractInterfaceIDPreimageType> = {
  encode(w, val) {
    Identifier.encode(w, val.name);
    SemVer.encode(w, val.vers);
  },
  decode(r) {
    return { name: Identifier.decode(r), vers: SemVer.decode(r) };
  },
};

export const DeployedContractHash: XdrCodec<DeployedContractHashType> = {
  encode(w, val) {
    typesCodecs.SHA256Hash.encode(w, val.hash);
    w.writeUint64(val.contract_size);
    w.writeInt32(BigInt(val.contract_type));
  },
  decode(r) {
    return {
      hash: typesCodecs.SHA256Hash.decode(r),
      contract_size: r.readUint64(),
      contract_type: Number(r.readInt32()) as ContractType,
    };
  },
};

export const AddressMetadata: XdrCodec<AddressMetadataType> = {
  encode(w, val) { DeployedContractHash.encode(w, val.deployed_contract); },
  decode(r) { return { deployed_contract: DeployedContractHash.decode(r) }; },
};
