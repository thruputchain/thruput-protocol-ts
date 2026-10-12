// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 90ab53996dddd3e3954ac09fc10609aa15fae2a4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export enum DbConflictCode {
  ExclusiveLockDenied = 0,
  TypeMismatch = 1,
  ValueMismatch = 2,
  BoundsExceeded = 3,
  Overflow = 4,
  ReplayProtection = 5,
  QueueConsumer = 6,
  CapacityExceeded = 7,
  InsufficientFunds = 8,
  DuplicateSigner = 9,
}

export enum DbDiagnosticLevel {
  kDbDiagnosticNone = 0,
  kDbDiagnosticFirst = 1,
  kDbDiagnosticAll = 2,
}

export interface DbConflictDiagnostic {
  addrkey: proto.AddressAndKey;
  code: proto.DbConflictCode;
}

export type DbConflictResult =
  | { level: proto.DbDiagnosticLevel.kDbDiagnosticNone }
  | { level: proto.DbDiagnosticLevel.kDbDiagnosticFirst; first: proto.DbConflictDiagnostic }
  | { level: proto.DbDiagnosticLevel.kDbDiagnosticAll; conflicts: proto.DbConflictDiagnostic[] }
;

export enum ContractRejectCode {
  ContractRejectTooMany = 0,
  ContractRejectBlobTooLarge = 1,
  ContractRejectNotDeployable = 2,
  ContractRejectDuplicate = 3,
  ContractRejectMalformedArtifact = 4,
  ContractRejectUnsupportedFormat = 5,
  ContractRejectUnsupportedAbi = 6,
  ContractRejectGasScheduleMismatch = 7,
  ContractRejectMemoryTooLarge = 8,
  ContractRejectCodeSizeInvalid = 9,
  ContractRejectInitialMemoryInvalid = 10,
  ContractRejectDigestMismatch = 11,
  ContractRejectInvalidProgram = 12,
}

export interface ContractRejectDiagnostic {
  contract_index: bigint;
  code: proto.ContractRejectCode;
}

export enum TxFailureKind {
  TxFailureDbConflict = 0,
  TxFailureContractRejected = 1,
}

export type TxFailureCause =
  | { kind: proto.TxFailureKind.TxFailureDbConflict; conflict: proto.DbConflictDiagnostic }
  | { kind: proto.TxFailureKind.TxFailureContractRejected; contract: proto.ContractRejectDiagnostic }
;

export interface TxFailureDiagnostic {
  attempt_height: proto.BlockHeight;
  cause: proto.TxFailureCause;
}


//
// XDR Codecs below this point
//

const _DbConflictCode: XdrCodec<DbConflictCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DbConflictCode; },
};

const _DbDiagnosticLevel: XdrCodec<DbDiagnosticLevel> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as DbDiagnosticLevel; },
};

const _DbConflictDiagnostic: XdrCodec<DbConflictDiagnostic> = {
  encode(w, val) {
    proto.codec.AddressAndKey.encode(w, val.addrkey);
    proto.codec.DbConflictCode.encode(w, val.code);
  },
  decode(r) {
    const addrkey = proto.codec.AddressAndKey.decode(r);
    const code = proto.codec.DbConflictCode.decode(r);
    return { addrkey, code };
  },
};

const _DbConflictResult: XdrCodec<DbConflictResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.level));
    switch (val.level) {
      case proto.DbDiagnosticLevel.kDbDiagnosticNone:
        break;
      case proto.DbDiagnosticLevel.kDbDiagnosticFirst:
        proto.codec.DbConflictDiagnostic.encode(w, val.first);
        break;
      case proto.DbDiagnosticLevel.kDbDiagnosticAll:
        VarArrayCodec(proto.codec.DbConflictDiagnostic, Number(0xFFFFFFFF)).encode(w, val.conflicts);
        break;
    }
  },
  decode(r) {
    const level = Number(r.readInt32());
    switch (level) {
      case proto.DbDiagnosticLevel.kDbDiagnosticNone:
        return { level } as DbConflictResult;
      case proto.DbDiagnosticLevel.kDbDiagnosticFirst:
        const first = proto.codec.DbConflictDiagnostic.decode(r);
        return { level, first };
      case proto.DbDiagnosticLevel.kDbDiagnosticAll:
        const conflicts = VarArrayCodec(proto.codec.DbConflictDiagnostic, Number(0xFFFFFFFF)).decode(r);
        return { level, conflicts };
      default:
        throw new Error(`Unknown DbConflictResult discriminant: ${level}`);
    }
  },
};

const _ContractRejectCode: XdrCodec<ContractRejectCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ContractRejectCode; },
};

const _ContractRejectDiagnostic: XdrCodec<ContractRejectDiagnostic> = {
  encode(w, val) {
    w.writeUint32(val.contract_index);
    proto.codec.ContractRejectCode.encode(w, val.code);
  },
  decode(r) {
    const contract_index = r.readUint32();
    const code = proto.codec.ContractRejectCode.decode(r);
    return { contract_index, code };
  },
};

const _TxFailureKind: XdrCodec<TxFailureKind> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TxFailureKind; },
};

const _TxFailureCause: XdrCodec<TxFailureCause> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.kind));
    switch (val.kind) {
      case proto.TxFailureKind.TxFailureDbConflict:
        proto.codec.DbConflictDiagnostic.encode(w, val.conflict);
        break;
      case proto.TxFailureKind.TxFailureContractRejected:
        proto.codec.ContractRejectDiagnostic.encode(w, val.contract);
        break;
    }
  },
  decode(r) {
    const kind = Number(r.readInt32());
    switch (kind) {
      case proto.TxFailureKind.TxFailureDbConflict:
        const conflict = proto.codec.DbConflictDiagnostic.decode(r);
        return { kind, conflict };
      case proto.TxFailureKind.TxFailureContractRejected:
        const contract = proto.codec.ContractRejectDiagnostic.decode(r);
        return { kind, contract };
      default:
        throw new Error(`Unknown TxFailureCause discriminant: ${kind}`);
    }
  },
};

const _TxFailureDiagnostic: XdrCodec<TxFailureDiagnostic> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.attempt_height);
    proto.codec.TxFailureCause.encode(w, val.cause);
  },
  decode(r) {
    const attempt_height = proto.codec.BlockHeight.decode(r);
    const cause = proto.codec.TxFailureCause.decode(r);
    return { attempt_height, cause };
  },
};

export const codec = {
  DbConflictCode: _DbConflictCode,
  DbDiagnosticLevel: _DbDiagnosticLevel,
  DbConflictDiagnostic: _DbConflictDiagnostic,
  DbConflictResult: _DbConflictResult,
  ContractRejectCode: _ContractRejectCode,
  ContractRejectDiagnostic: _ContractRejectDiagnostic,
  TxFailureKind: _TxFailureKind,
  TxFailureCause: _TxFailureCause,
  TxFailureDiagnostic: _TxFailureDiagnostic,
} as const;

