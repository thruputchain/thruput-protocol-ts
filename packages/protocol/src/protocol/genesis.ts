// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: c0e2b46d8abfb48cd8fb90d8f06af8d2a99acf27

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
  },
  decode(r) {
    const initial_config = proto.codec.InitialConfigurationList.decode(r);
    const storage_cost_model = proto.codec.StorageCostModelXdr.decode(r);
    return { initial_config, storage_cost_model };
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
  GenesisContractAddresses: _GenesisContractAddresses,
} as const;

