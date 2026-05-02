// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5cf47b904e892062b9ef9ce2ab5b08809d319f6e

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum ExperimentType {
  kExperimentTypeERC20Payments = 0,
  kExperimentTypeERC20BasicAuthPayments = 1,
}

export interface ERC20PaymentsConfig {
  num_addresses: bigint;
}

export type ExperimentConfig =
  | { experiment_type: proto.ExperimentType.kExperimentTypeERC20Payments; erc20_payments: proto.ERC20PaymentsConfig }
  | { experiment_type: proto.ExperimentType.kExperimentTypeERC20BasicAuthPayments; erc20_payments: proto.ERC20PaymentsConfig }
;

export type InitializationBlock = proto.SignedTransaction[] & { readonly __brand: "InitializationBlock" };
export function initializationBlock(val: proto.SignedTransaction[]): InitializationBlock {
  return val as InitializationBlock;
}

export type LoadgenContextID = bigint & { readonly __brand: "LoadgenContextID" };
export function loadgenContextID(val: bigint): LoadgenContextID {
  return val as LoadgenContextID;
}

export interface LoadgenSuccessResult {
  genesis_configuration: proto.GenesisConfiguration;
  initialization_txs: proto.InitializationBlock[];
  context_id: proto.LoadgenContextID;
}

export interface LoadgenExtension {
  work_txs: proto.ParallelSignedTransactionBatch;
}

export enum LoadgenRPCError {
  kLoadgenRPCErrorOK = 0,
  kLoadgenRPCErrorInvalidConfig = 1,
  kLoadgenRPCErrorInvalidContext = 2,
}

export type LoadgenResult =
  | { error: proto.LoadgenRPCError.kLoadgenRPCErrorOK; success: proto.LoadgenSuccessResult }
  | { error: number }
;

export type LoadgenExtensionResult =
  | { error: proto.LoadgenRPCError.kLoadgenRPCErrorOK; success: proto.LoadgenExtension }
  | { error: number }
;


export interface extend_experiment_args {
  arg0: proto.LoadgenContextID;
  arg1: bigint;
  arg2: proto.BlockHeight;
}


//
// XDR Codecs below this point
//

const _ExperimentType: XdrCodec<ExperimentType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ExperimentType; },
};

const _ERC20PaymentsConfig: XdrCodec<ERC20PaymentsConfig> = {
  encode(w, val) {
    w.writeUint64(val.num_addresses);
  },
  decode(r) {
    const num_addresses = r.readUint64();
    return { num_addresses };
  },
};

const _ExperimentConfig: XdrCodec<ExperimentConfig> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.experiment_type));
    switch (val.experiment_type) {
      case proto.ExperimentType.kExperimentTypeERC20Payments:
      case proto.ExperimentType.kExperimentTypeERC20BasicAuthPayments:
        proto.codec.ERC20PaymentsConfig.encode(w, val.erc20_payments);
        break;
    }
  },
  decode(r) {
    const experiment_type = Number(r.readInt32());
    switch (experiment_type) {
      case proto.ExperimentType.kExperimentTypeERC20Payments:
      case proto.ExperimentType.kExperimentTypeERC20BasicAuthPayments:
        const erc20_payments = proto.codec.ERC20PaymentsConfig.decode(r);
        return { experiment_type, erc20_payments };
      default:
        throw new Error(`Unknown ExperimentConfig discriminant: ${experiment_type}`);
    }
  },
};

const _InitializationBlock = VarArrayCodec(() => proto.codec.SignedTransaction, Number(0xFFFFFFFF)) as XdrCodec<InitializationBlock>;

const _LoadgenContextID: XdrCodec<LoadgenContextID> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return loadgenContextID(r.readUint64()); },
};

const _LoadgenSuccessResult: XdrCodec<LoadgenSuccessResult> = {
  encode(w, val) {
    proto.codec.GenesisConfiguration.encode(w, val.genesis_configuration);
    VarArrayCodec(proto.codec.InitializationBlock, Number(0xFFFFFFFF)).encode(w, val.initialization_txs);
    proto.codec.LoadgenContextID.encode(w, val.context_id);
  },
  decode(r) {
    const genesis_configuration = proto.codec.GenesisConfiguration.decode(r);
    const initialization_txs = VarArrayCodec(proto.codec.InitializationBlock, Number(0xFFFFFFFF)).decode(r);
    const context_id = proto.codec.LoadgenContextID.decode(r);
    return { genesis_configuration, initialization_txs, context_id };
  },
};

const _LoadgenExtension: XdrCodec<LoadgenExtension> = {
  encode(w, val) {
    proto.codec.ParallelSignedTransactionBatch.encode(w, val.work_txs);
  },
  decode(r) {
    const work_txs = proto.codec.ParallelSignedTransactionBatch.decode(r);
    return { work_txs };
  },
};

const _LoadgenRPCError: XdrCodec<LoadgenRPCError> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as LoadgenRPCError; },
};

const _LoadgenResult: XdrCodec<LoadgenResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.LoadgenRPCError.kLoadgenRPCErrorOK:
      {
        const v = val as { error: number; success: proto.LoadgenSuccessResult };
        if (v.success === undefined) {
          throw new Error("LoadgenResult encode: success is undefined");
        }
        proto.codec.LoadgenSuccessResult.encode(w, v.success);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.LoadgenRPCError.kLoadgenRPCErrorOK:
        const success = proto.codec.LoadgenSuccessResult.decode(r);
        return { error, success };
      default:
        return { error };
    }
  },
};

const _LoadgenExtensionResult: XdrCodec<LoadgenExtensionResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.LoadgenRPCError.kLoadgenRPCErrorOK:
      {
        const v = val as { error: number; success: proto.LoadgenExtension };
        if (v.success === undefined) {
          throw new Error("LoadgenExtensionResult encode: success is undefined");
        }
        proto.codec.LoadgenExtension.encode(w, v.success);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.LoadgenRPCError.kLoadgenRPCErrorOK:
        const success = proto.codec.LoadgenExtension.decode(r);
        return { error, success };
      default:
        return { error };
    }
  },
};

const _extend_experiment_args: XdrCodec<extend_experiment_args> = {
  encode(w, val) {
    proto.codec.LoadgenContextID.encode(w, val.arg0);
    w.writeUint64(val.arg1);
    proto.codec.BlockHeight.encode(w, val.arg2);
  },
  decode(r) {
    const arg0 = proto.codec.LoadgenContextID.decode(r);
    const arg1 = r.readUint64();
    const arg2 = proto.codec.BlockHeight.decode(r);
    return { arg0, arg1, arg2 };
  },
};

export const codec = {
  ExperimentType: _ExperimentType,
  ERC20PaymentsConfig: _ERC20PaymentsConfig,
  ExperimentConfig: _ExperimentConfig,
  InitializationBlock: _InitializationBlock,
  LoadgenContextID: _LoadgenContextID,
  LoadgenSuccessResult: _LoadgenSuccessResult,
  LoadgenExtension: _LoadgenExtension,
  LoadgenRPCError: _LoadgenRPCError,
  LoadgenResult: _LoadgenResult,
  LoadgenExtensionResult: _LoadgenExtensionResult,
} as const;

export const LoadgenInterfaceProgram: RpcProgramMeta = {
  programId: 12341234,
  version: 1,
  methods: {
    generate_experiment: { proc: 0, request: _ExperimentConfig, response: _LoadgenResult },
    extend_experiment: { proc: 1, request: _extend_experiment_args, response: _LoadgenExtensionResult },
  },
};

