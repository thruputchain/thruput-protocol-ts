// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 076d53880b71d9063d5455fe857591448b4f0fb8

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type SCPHash = Uint8Array & { readonly __brand: "SCPHash" };
export function scpHash(data: Uint8Array): SCPHash {
  if (data.length !== 32) throw new Error(`SCPHash must be exactly 32 bytes, got ${data.length}`);
  return data as SCPHash;
}

export type SCPNodeID = proto.PublicKey & { readonly __brand: "SCPNodeID" };
export function scpNodeID(val: proto.PublicKey): SCPNodeID {
  return val as SCPNodeID;
}

export type SCPCount = bigint & { readonly __brand: "SCPCount" };
export function scpCount(val: bigint): SCPCount {
  return val as SCPCount;
}

export type SCPSlotIndex = bigint & { readonly __brand: "SCPSlotIndex" };
export function scpSlotIndex(val: bigint): SCPSlotIndex {
  return val as SCPSlotIndex;
}

export type SCPValue = Uint8Array & { readonly __brand: "SCPValue" };
export function scpValue(data: Uint8Array): SCPValue {
  return data as SCPValue;
}

export type SCPValues = proto.SCPValue[] & { readonly __brand: "SCPValues" };
export function scpValues(val: proto.SCPValue[]): SCPValues {
  return val as SCPValues;
}

export type SCPOptValue = (proto.SCPValue | null) & { readonly __brand: "SCPOptValue" };
export function scpOptValue(val: proto.SCPValue | null): SCPOptValue {
  return val as SCPOptValue;
}

export interface SCPBallot {
  counter: proto.SCPCount;
  value: proto.SCPValue;
}

export enum SCPStatementType {
  SCP_ST_PREPARE = 0,
  SCP_ST_CONFIRM = 1,
  SCP_ST_EXTERNALIZE = 2,
  SCP_ST_NOMINATE = 3,
}

export interface SCPStatementNominate {
  quorum_set_hash: proto.SCPHash;
  votes: proto.SCPValue[];
  accepted: proto.SCPValue[];
}

export interface SCPStatementPrepare {
  quorum_set_hash: proto.SCPHash;
  ballot: proto.SCPBallot;
  prepared: proto.SCPBallot | null;
  prepared_prime: proto.SCPBallot | null;
  n_c: proto.SCPCount;
  n_h: proto.SCPCount;
}

export interface SCPStatementConfirm {
  ballot: proto.SCPBallot;
  n_prepared: proto.SCPCount;
  n_commit: proto.SCPCount;
  n_h: proto.SCPCount;
  quorum_set_hash: proto.SCPHash;
}

export interface SCPStatementExternalize {
  commit: proto.SCPBallot;
  n_h: proto.SCPCount;
  commit_quorum_set_hash: proto.SCPHash;
}

export type SCPStatement_pledges =
  | { stmt_type: proto.SCPStatementType.SCP_ST_PREPARE; prepare: proto.SCPStatementPrepare }
  | { stmt_type: proto.SCPStatementType.SCP_ST_CONFIRM; confirm: proto.SCPStatementConfirm }
  | { stmt_type: proto.SCPStatementType.SCP_ST_EXTERNALIZE; externalize: proto.SCPStatementExternalize }
  | { stmt_type: proto.SCPStatementType.SCP_ST_NOMINATE; nominate: proto.SCPStatementNominate }
;

export interface SCPStatement {
  node_id: proto.SCPNodeID;
  slot_index: proto.SCPSlotIndex;
  pledges: proto.SCPStatement_pledges;
}

export interface SCPEnvelope {
  statement: proto.SCPStatement;
  signature: proto.Signature;
}

export type SCPEnvelopes = proto.SCPEnvelope[] & { readonly __brand: "SCPEnvelopes" };
export function scpEnvelopes(val: proto.SCPEnvelope[]): SCPEnvelopes {
  return val as SCPEnvelopes;
}

export interface SCPQuorumSet {
  threshold: proto.SCPCount;
  validators: proto.SCPNodeID[];
  inner_sets: proto.SCPQuorumSet[];
}

export type SCPOptQuorumSet = (proto.SCPQuorumSet | null) & { readonly __brand: "SCPOptQuorumSet" };
export function scpOptQuorumSet(val: proto.SCPQuorumSet | null): SCPOptQuorumSet {
  return val as SCPOptQuorumSet;
}


//
// XDR Codecs below this point
//

const _SCPHash: XdrCodec<SCPHash> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return scpHash(r.readFixedOpaque(32)); },
};

const _SCPNodeID: XdrCodec<SCPNodeID> = {
  encode(w, val) { proto.codec.PublicKey.encode(w, val); },
  decode(r) { return scpNodeID(proto.codec.PublicKey.decode(r)); },
};

const _SCPCount: XdrCodec<SCPCount> = {
  encode(w, val) { w.writeUint32(val); },
  decode(r) { return scpCount(r.readUint32()); },
};

const _SCPSlotIndex: XdrCodec<SCPSlotIndex> = {
  encode(w, val) { w.writeUint64(val); },
  decode(r) { return scpSlotIndex(r.readUint64()); },
};

const _SCPValue: XdrCodec<SCPValue> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return scpValue(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

const _SCPValues = VarArrayCodec(() => proto.codec.SCPValue, Number(0xFFFFFFFF)) as XdrCodec<SCPValues>;

const _SCPOptValue = OptionCodec(() => _SCPValue) as XdrCodec<SCPOptValue>;

const _SCPBallot: XdrCodec<SCPBallot> = {
  encode(w, val) {
    proto.codec.SCPCount.encode(w, val.counter);
    proto.codec.SCPValue.encode(w, val.value);
  },
  decode(r) {
    const counter = proto.codec.SCPCount.decode(r);
    const value = proto.codec.SCPValue.decode(r);
    return { counter, value };
  },
};

const _SCPStatementType: XdrCodec<SCPStatementType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SCPStatementType; },
};

const _SCPStatementNominate: XdrCodec<SCPStatementNominate> = {
  encode(w, val) {
    proto.codec.SCPHash.encode(w, val.quorum_set_hash);
    VarArrayCodec(proto.codec.SCPValue, Number(0xFFFFFFFF)).encode(w, val.votes);
    VarArrayCodec(proto.codec.SCPValue, Number(0xFFFFFFFF)).encode(w, val.accepted);
  },
  decode(r) {
    const quorum_set_hash = proto.codec.SCPHash.decode(r);
    const votes = VarArrayCodec(proto.codec.SCPValue, Number(0xFFFFFFFF)).decode(r);
    const accepted = VarArrayCodec(proto.codec.SCPValue, Number(0xFFFFFFFF)).decode(r);
    return { quorum_set_hash, votes, accepted };
  },
};

const _SCPStatementPrepare: XdrCodec<SCPStatementPrepare> = {
  encode(w, val) {
    proto.codec.SCPHash.encode(w, val.quorum_set_hash);
    proto.codec.SCPBallot.encode(w, val.ballot);
    OptionCodec(_SCPBallot).encode(w, val.prepared);
    OptionCodec(_SCPBallot).encode(w, val.prepared_prime);
    proto.codec.SCPCount.encode(w, val.n_c);
    proto.codec.SCPCount.encode(w, val.n_h);
  },
  decode(r) {
    const quorum_set_hash = proto.codec.SCPHash.decode(r);
    const ballot = proto.codec.SCPBallot.decode(r);
    const prepared = OptionCodec(_SCPBallot).decode(r);
    const prepared_prime = OptionCodec(_SCPBallot).decode(r);
    const n_c = proto.codec.SCPCount.decode(r);
    const n_h = proto.codec.SCPCount.decode(r);
    return { quorum_set_hash, ballot, prepared, prepared_prime, n_c, n_h };
  },
};

const _SCPStatementConfirm: XdrCodec<SCPStatementConfirm> = {
  encode(w, val) {
    proto.codec.SCPBallot.encode(w, val.ballot);
    proto.codec.SCPCount.encode(w, val.n_prepared);
    proto.codec.SCPCount.encode(w, val.n_commit);
    proto.codec.SCPCount.encode(w, val.n_h);
    proto.codec.SCPHash.encode(w, val.quorum_set_hash);
  },
  decode(r) {
    const ballot = proto.codec.SCPBallot.decode(r);
    const n_prepared = proto.codec.SCPCount.decode(r);
    const n_commit = proto.codec.SCPCount.decode(r);
    const n_h = proto.codec.SCPCount.decode(r);
    const quorum_set_hash = proto.codec.SCPHash.decode(r);
    return { ballot, n_prepared, n_commit, n_h, quorum_set_hash };
  },
};

const _SCPStatementExternalize: XdrCodec<SCPStatementExternalize> = {
  encode(w, val) {
    proto.codec.SCPBallot.encode(w, val.commit);
    proto.codec.SCPCount.encode(w, val.n_h);
    proto.codec.SCPHash.encode(w, val.commit_quorum_set_hash);
  },
  decode(r) {
    const commit = proto.codec.SCPBallot.decode(r);
    const n_h = proto.codec.SCPCount.decode(r);
    const commit_quorum_set_hash = proto.codec.SCPHash.decode(r);
    return { commit, n_h, commit_quorum_set_hash };
  },
};

const _SCPStatement_pledges: XdrCodec<SCPStatement_pledges> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.stmt_type));
    switch (val.stmt_type) {
      case proto.SCPStatementType.SCP_ST_PREPARE:
        proto.codec.SCPStatementPrepare.encode(w, val.prepare);
        break;
      case proto.SCPStatementType.SCP_ST_CONFIRM:
        proto.codec.SCPStatementConfirm.encode(w, val.confirm);
        break;
      case proto.SCPStatementType.SCP_ST_EXTERNALIZE:
        proto.codec.SCPStatementExternalize.encode(w, val.externalize);
        break;
      case proto.SCPStatementType.SCP_ST_NOMINATE:
        proto.codec.SCPStatementNominate.encode(w, val.nominate);
        break;
    }
  },
  decode(r) {
    const stmt_type = Number(r.readInt32());
    switch (stmt_type) {
      case proto.SCPStatementType.SCP_ST_PREPARE:
        const prepare = proto.codec.SCPStatementPrepare.decode(r);
        return { stmt_type, prepare };
      case proto.SCPStatementType.SCP_ST_CONFIRM:
        const confirm = proto.codec.SCPStatementConfirm.decode(r);
        return { stmt_type, confirm };
      case proto.SCPStatementType.SCP_ST_EXTERNALIZE:
        const externalize = proto.codec.SCPStatementExternalize.decode(r);
        return { stmt_type, externalize };
      case proto.SCPStatementType.SCP_ST_NOMINATE:
        const nominate = proto.codec.SCPStatementNominate.decode(r);
        return { stmt_type, nominate };
      default:
        throw new Error(`Unknown SCPStatement_pledges discriminant: ${stmt_type}`);
    }
  },
};

const _SCPStatement: XdrCodec<SCPStatement> = {
  encode(w, val) {
    proto.codec.SCPNodeID.encode(w, val.node_id);
    proto.codec.SCPSlotIndex.encode(w, val.slot_index);
    proto.codec.SCPStatement_pledges.encode(w, val.pledges);
  },
  decode(r) {
    const node_id = proto.codec.SCPNodeID.decode(r);
    const slot_index = proto.codec.SCPSlotIndex.decode(r);
    const pledges = proto.codec.SCPStatement_pledges.decode(r);
    return { node_id, slot_index, pledges };
  },
};

const _SCPEnvelope: XdrCodec<SCPEnvelope> = {
  encode(w, val) {
    proto.codec.SCPStatement.encode(w, val.statement);
    proto.codec.Signature.encode(w, val.signature);
  },
  decode(r) {
    const statement = proto.codec.SCPStatement.decode(r);
    const signature = proto.codec.Signature.decode(r);
    return { statement, signature };
  },
};

const _SCPEnvelopes = VarArrayCodec(() => proto.codec.SCPEnvelope, Number(0xFFFFFFFF)) as XdrCodec<SCPEnvelopes>;

const _SCPQuorumSet: XdrCodec<SCPQuorumSet> = {
  encode(w, val) {
    proto.codec.SCPCount.encode(w, val.threshold);
    VarArrayCodec(proto.codec.SCPNodeID, Number(0xFFFFFFFF)).encode(w, val.validators);
    VarArrayCodec(proto.codec.SCPQuorumSet, Number(0xFFFFFFFF)).encode(w, val.inner_sets);
  },
  decode(r) {
    const threshold = proto.codec.SCPCount.decode(r);
    const validators = VarArrayCodec(proto.codec.SCPNodeID, Number(0xFFFFFFFF)).decode(r);
    const inner_sets = VarArrayCodec(proto.codec.SCPQuorumSet, Number(0xFFFFFFFF)).decode(r);
    return { threshold, validators, inner_sets };
  },
};

const _SCPOptQuorumSet = OptionCodec(() => _SCPQuorumSet) as XdrCodec<SCPOptQuorumSet>;

export const codec = {
  SCPHash: _SCPHash,
  SCPNodeID: _SCPNodeID,
  SCPCount: _SCPCount,
  SCPSlotIndex: _SCPSlotIndex,
  SCPValue: _SCPValue,
  SCPValues: _SCPValues,
  SCPOptValue: _SCPOptValue,
  SCPBallot: _SCPBallot,
  SCPStatementType: _SCPStatementType,
  SCPStatementNominate: _SCPStatementNominate,
  SCPStatementPrepare: _SCPStatementPrepare,
  SCPStatementConfirm: _SCPStatementConfirm,
  SCPStatementExternalize: _SCPStatementExternalize,
  SCPStatement_pledges: _SCPStatement_pledges,
  SCPStatement: _SCPStatement,
  SCPEnvelope: _SCPEnvelope,
  SCPEnvelopes: _SCPEnvelopes,
  SCPQuorumSet: _SCPQuorumSet,
  SCPOptQuorumSet: _SCPOptQuorumSet,
} as const;

