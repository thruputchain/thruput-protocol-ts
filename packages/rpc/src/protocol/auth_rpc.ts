// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5cf47b904e892062b9ef9ce2ab5b08809d319f6e

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum AuthErrorCode {
  kAuthSuccess = 0,
  kAuthFailed = 1,
  kAuthStaleBlockHeight = 2,
  kAuthInternal = 3,
}

export type AuthErrorCodeBatch = proto.AuthErrorCode[] & { readonly __brand: "AuthErrorCodeBatch" };
export function authErrorCodeBatch(val: proto.AuthErrorCode[]): AuthErrorCodeBatch {
  return val as AuthErrorCodeBatch;
}


export interface authmempool_verify_transactions_args {
  arg0: proto.BlockHeight;
  arg1: proto.SignedTransactionBatch;
}

export interface authmempool_verify_batch_args {
  arg0: proto.BlockHeight;
  arg1: proto.SignedTransactionBatch;
}

export interface KeyChange {
  address: proto.ContractAddress;
  auth_data: proto.AddressAuthData | null;
}

export type KeyChangeBatch = proto.KeyChange[] & { readonly __brand: "KeyChangeBatch" };
export function keyChangeBatch(val: proto.KeyChange[]): KeyChangeBatch {
  return val as KeyChangeBatch;
}


export interface authdb_forward_key_changes_args {
  arg0: proto.BlockHeight;
  arg1: proto.KeyChangeBatch;
}

export enum DBAuthError {
  kDBAuthSuccess = 0,
  kDBAuthNotFound = 1,
  kDBAuthStaleBlockHeight = 2,
  kDBAuthInternal = 3,
}

export type DBAuthResult =
  | { error: proto.DBAuthError.kDBAuthSuccess; auth_data: proto.AddressAuthData }
  | { error: number }
;

export enum DBAuthIntroOutcome {
  kIntroSuccess = 0,
  kIntroFailure = 1,
}

export type DBAuthIntroResult =
  | { outcome: proto.DBAuthIntroOutcome.kIntroSuccess; current_height: proto.BlockHeight }
  | { outcome: number }
;

export type DBAuthResultBatch = proto.DBAuthResult[] & { readonly __brand: "DBAuthResultBatch" };
export function dbAuthResultBatch(val: proto.DBAuthResult[]): DBAuthResultBatch {
  return val as DBAuthResultBatch;
}


export interface authdb_get_auth_data_args {
  arg0: proto.BlockHeight;
  arg1: proto.ContractAddress;
}

export interface authdb_get_auth_data_batch_args {
  arg0: proto.BlockHeight;
  arg1: proto.ContractAddressBatch;
}

export enum IntroAuthOutcome {
  kSuccess = 0,
  kFailure = 1,
}

export type IntroAuthResult =
  | { outcome: proto.IntroAuthOutcome.kSuccess; shards: proto.ShardCard[] }
  | { outcome: number }
;


export interface mempoolauth_auth_data_changed_args {
  arg0: proto.BlockHeight;
  arg1: proto.KeyChangeBatch;
}


//
// XDR Codecs below this point
//

const _AuthErrorCode: XdrCodec<AuthErrorCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as AuthErrorCode; },
};

const _AuthErrorCodeBatch = VarArrayCodec(() => proto.codec.AuthErrorCode, Number(0xFFFFFFFF)) as XdrCodec<AuthErrorCodeBatch>;

const _authmempool_verify_transactions_args: XdrCodec<authmempool_verify_transactions_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.SignedTransactionBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.SignedTransactionBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _authmempool_verify_batch_args: XdrCodec<authmempool_verify_batch_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.SignedTransactionBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.SignedTransactionBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _KeyChange: XdrCodec<KeyChange> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    OptionCodec(proto.codec.AddressAuthData).encode(w, val.auth_data);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const auth_data = OptionCodec(proto.codec.AddressAuthData).decode(r);
    return { address, auth_data };
  },
};

const _KeyChangeBatch = VarArrayCodec(() => proto.codec.KeyChange, Number(0xFFFFFFFF)) as XdrCodec<KeyChangeBatch>;

const _authdb_forward_key_changes_args: XdrCodec<authdb_forward_key_changes_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.KeyChangeBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.KeyChangeBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _DBAuthError: XdrCodec<DBAuthError> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DBAuthError; },
};

const _DBAuthResult: XdrCodec<DBAuthResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.error));
    switch (val.error) {
      case proto.DBAuthError.kDBAuthSuccess:
      {
        const v = val as { error: number; auth_data: proto.AddressAuthData };
        if (v.auth_data === undefined) {
          throw new Error("DBAuthResult encode: auth_data is undefined");
        }
        proto.codec.AddressAuthData.encode(w, v.auth_data);
        break;
      }
    }
  },
  decode(r) {
    const error = Number(r.readInt32());
    switch (error) {
      case proto.DBAuthError.kDBAuthSuccess:
        const auth_data = proto.codec.AddressAuthData.decode(r);
        return { error, auth_data };
      default:
        return { error };
    }
  },
};

const _DBAuthIntroOutcome: XdrCodec<DBAuthIntroOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DBAuthIntroOutcome; },
};

const _DBAuthIntroResult: XdrCodec<DBAuthIntroResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.DBAuthIntroOutcome.kIntroSuccess:
      {
        const v = val as { outcome: number; current_height: proto.BlockHeight };
        if (v.current_height === undefined) {
          throw new Error("DBAuthIntroResult encode: current_height is undefined");
        }
        proto.codec.BlockHeight.encode(w, v.current_height);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.DBAuthIntroOutcome.kIntroSuccess:
        const current_height = proto.codec.BlockHeight.decode(r);
        return { outcome, current_height };
      default:
        return { outcome };
    }
  },
};

const _DBAuthResultBatch = VarArrayCodec(() => proto.codec.DBAuthResult, Number(0xFFFFFFFF)) as XdrCodec<DBAuthResultBatch>;

const _authdb_get_auth_data_args: XdrCodec<authdb_get_auth_data_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.ContractAddress.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.ContractAddress.decode(r);
    return { arg0, arg1 };
  },
};

const _authdb_get_auth_data_batch_args: XdrCodec<authdb_get_auth_data_batch_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.ContractAddressBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.ContractAddressBatch.decode(r);
    return { arg0, arg1 };
  },
};

const _IntroAuthOutcome: XdrCodec<IntroAuthOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IntroAuthOutcome; },
};

const _IntroAuthResult: XdrCodec<IntroAuthResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.IntroAuthOutcome.kSuccess:
      {
        const v = val as { outcome: number; shards: proto.ShardCard[] };
        if (v.shards === undefined) {
          throw new Error("IntroAuthResult encode: shards is undefined");
        }
        VarArrayCodec(proto.codec.ShardCard, Number(0xFFFFFFFF)).encode(w, v.shards);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.IntroAuthOutcome.kSuccess:
        const shards = VarArrayCodec(proto.codec.ShardCard, Number(0xFFFFFFFF)).decode(r);
        return { outcome, shards };
      default:
        return { outcome };
    }
  },
};

const _mempoolauth_auth_data_changed_args: XdrCodec<mempoolauth_auth_data_changed_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.KeyChangeBatch.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.KeyChangeBatch.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  AuthErrorCode: _AuthErrorCode,
  AuthErrorCodeBatch: _AuthErrorCodeBatch,
  KeyChange: _KeyChange,
  KeyChangeBatch: _KeyChangeBatch,
  DBAuthError: _DBAuthError,
  DBAuthResult: _DBAuthResult,
  DBAuthIntroOutcome: _DBAuthIntroOutcome,
  DBAuthIntroResult: _DBAuthIntroResult,
  DBAuthResultBatch: _DBAuthResultBatch,
  IntroAuthOutcome: _IntroAuthOutcome,
  IntroAuthResult: _IntroAuthResult,
} as const;

export const AuthMempoolProgram: RpcProgramMeta = {
  programId: 0x8aa87aa7,
  version: 1,
  methods: {
    authmempool_verify_transactions: { proc: 2, request: _authmempool_verify_transactions_args, response: _AuthErrorCodeBatch },
    authmempool_verify_batch: { proc: 3, request: _authmempool_verify_batch_args, response: _AuthErrorCode },
  },
};

export const AuthDBProgram: RpcProgramMeta = {
  programId: 0x8aa87aa8,
  version: 1,
  methods: {
    authdb_forward_key_changes: { proc: 1, request: _authdb_forward_key_changes_args, response: VoidCodec },
  },
};

export const DBAuthProgram: RpcProgramMeta = {
  programId: 0x8aa87aa9,
  version: 1,
  methods: {
    authdb_get_auth_data: { proc: 0, request: _authdb_get_auth_data_args, response: _DBAuthResult },
    authdb_get_auth_data_batch: { proc: 1, request: _authdb_get_auth_data_batch_args, response: _DBAuthResultBatch },
    dbauth_intro: { proc: 2, request: proto.codec.AuthCard as XdrCodec<proto.AuthCard>, response: _DBAuthIntroResult },
  },
};

export const MempoolAuthProgram: RpcProgramMeta = {
  programId: 0x8aa87aaa,
  version: 1,
  methods: {
    mempoolauth_intro_auth: { proc: 0, request: proto.codec.AuthCard as XdrCodec<proto.AuthCard>, response: _IntroAuthResult },
    mempoolauth_auth_data_changed: { proc: 1, request: _mempoolauth_auth_data_changed_args, response: VoidCodec },
  },
};

