// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 003a0d33894e4c7c48474454948073bd6d10da45

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface PresetDeploymentConfig {
  initial_nonce: proto.SHA256Hash;
  contract_hash: proto.SHA256Hash;
  entrypoint: proto.ContractEntrypointID;
  calldata: proto.Calldata;
}

export interface InitialConfigurationEntry {
  config: proto.PresetDeploymentConfig;
  amount: proto.int128_xdr;
}

export type InitialConfigurationList = proto.InitialConfigurationEntry[] & { readonly __brand: "InitialConfigurationList" };
export function initialConfigurationList(val: proto.InitialConfigurationEntry[]): InitialConfigurationList {
  return val as InitialConfigurationList;
}

export interface GenesisConfiguration {
  initial_config: proto.InitialConfigurationList;
  storage_cost_model: proto.StorageCostModelXdr;
  default_wallet: proto.DeployedContractHash;
}

export interface GenesisConfigurationV2 {
  network_hash: proto.NetworkHash;
  storage_cost_model: proto.StorageCostModelXdr;
  root_contract: proto.Contract;
  default_wallet: proto.DeployedContractHash;
}

export enum GenesisContractAddresses {
  kAddressNull = 0,
  kAddressPrecompiledHogToken = 1,
  kAddressInitialTokenClaim = 2,
}


//
// XDR Codecs below this point
//

const _PresetDeploymentConfig: XdrCodec<PresetDeploymentConfig> = {
  encode(w, val) {
    proto.codec.SHA256Hash.encode(w, val.initial_nonce);
    proto.codec.SHA256Hash.encode(w, val.contract_hash);
    proto.codec.ContractEntrypointID.encode(w, val.entrypoint);
    proto.codec.Calldata.encode(w, val.calldata);
  },
  decode(r) {
    const initial_nonce = proto.codec.SHA256Hash.decode(r);
    const contract_hash = proto.codec.SHA256Hash.decode(r);
    const entrypoint = proto.codec.ContractEntrypointID.decode(r);
    const calldata = proto.codec.Calldata.decode(r);
    return { initial_nonce, contract_hash, entrypoint, calldata };
  },
};

const _InitialConfigurationEntry: XdrCodec<InitialConfigurationEntry> = {
  encode(w, val) {
    proto.codec.PresetDeploymentConfig.encode(w, val.config);
    proto.codec.int128_xdr.encode(w, val.amount);
  },
  decode(r) {
    const config = proto.codec.PresetDeploymentConfig.decode(r);
    const amount = proto.codec.int128_xdr.decode(r);
    return { config, amount };
  },
};

const _InitialConfigurationList = VarArrayCodec(() => proto.codec.InitialConfigurationEntry, Number(0xFFFFFFFF)) as XdrCodec<InitialConfigurationList>;

const _GenesisConfiguration: XdrCodec<GenesisConfiguration> = {
  encode(w, val) {
    proto.codec.InitialConfigurationList.encode(w, val.initial_config);
    proto.codec.StorageCostModelXdr.encode(w, val.storage_cost_model);
    proto.codec.DeployedContractHash.encode(w, val.default_wallet);
  },
  decode(r) {
    const initial_config = proto.codec.InitialConfigurationList.decode(r);
    const storage_cost_model = proto.codec.StorageCostModelXdr.decode(r);
    const default_wallet = proto.codec.DeployedContractHash.decode(r);
    return { initial_config, storage_cost_model, default_wallet };
  },
};

const _GenesisConfigurationV2: XdrCodec<GenesisConfigurationV2> = {
  encode(w, val) {
    proto.codec.NetworkHash.encode(w, val.network_hash);
    proto.codec.StorageCostModelXdr.encode(w, val.storage_cost_model);
    proto.codec.Contract.encode(w, val.root_contract);
    proto.codec.DeployedContractHash.encode(w, val.default_wallet);
  },
  decode(r) {
    const network_hash = proto.codec.NetworkHash.decode(r);
    const storage_cost_model = proto.codec.StorageCostModelXdr.decode(r);
    const root_contract = proto.codec.Contract.decode(r);
    const default_wallet = proto.codec.DeployedContractHash.decode(r);
    return { network_hash, storage_cost_model, root_contract, default_wallet };
  },
};

const _GenesisContractAddresses: XdrCodec<GenesisContractAddresses> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as GenesisContractAddresses; },
};

export const codec = {
  PresetDeploymentConfig: _PresetDeploymentConfig,
  InitialConfigurationEntry: _InitialConfigurationEntry,
  InitialConfigurationList: _InitialConfigurationList,
  GenesisConfiguration: _GenesisConfiguration,
  GenesisConfigurationV2: _GenesisConfigurationV2,
  GenesisContractAddresses: _GenesisContractAddresses,
} as const;

