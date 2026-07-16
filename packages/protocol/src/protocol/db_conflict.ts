// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e3dda0763ff3fb21779d16b6fa2e130c633911a0

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum DbConflictCode {
  kDbConflictExclusiveLock = 0,
  kDbConflictTypeMismatch = 1,
  kDbConflictValueMismatch = 2,
  kDbConflictBoundsExceeded = 3,
  kDbConflictOverflow = 4,
  kDbConflictReplayProtection = 5,
  kDbConflictQueueConsumer = 6,
  kDbConflictCapacityExceeded = 7,
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

export interface TxFailureDiagnostic {
  attempt_height: proto.BlockHeight;
  conflict: proto.DbConflictDiagnostic;
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

const _TxFailureDiagnostic: XdrCodec<TxFailureDiagnostic> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.attempt_height);
    proto.codec.DbConflictDiagnostic.encode(w, val.conflict);
  },
  decode(r) {
    const attempt_height = proto.codec.BlockHeight.decode(r);
    const conflict = proto.codec.DbConflictDiagnostic.decode(r);
    return { attempt_height, conflict };
  },
};

export const codec = {
  DbConflictCode: _DbConflictCode,
  DbDiagnosticLevel: _DbDiagnosticLevel,
  DbConflictDiagnostic: _DbConflictDiagnostic,
  DbConflictResult: _DbConflictResult,
  TxFailureDiagnostic: _TxFailureDiagnostic,
} as const;

