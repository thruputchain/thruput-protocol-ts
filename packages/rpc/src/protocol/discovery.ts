// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5135a63d54ca836265b87b8475a9c06f4d4624e4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface QuorumSetSnapshot {
  timestamp: proto.TimePoint;
  quorum_set: proto.SCPQuorumSet;
}

export interface SignedQuorumSetSnapshot {
  signer: proto.ValidatorPublicInfo;
  signature: proto.Signature;
  quorum_set_snapshot: proto.QuorumSetSnapshot;
}

export interface ValidatorInfoSnapshot {
  timestamp: proto.TimePoint;
  validator: proto.ValidatorPublicInfo;
}

export interface SignedValidatorInfoSnapshot {
  signer: proto.ValidatorPublicInfo;
  signature: proto.Signature;
  validator_snapshot: proto.ValidatorInfoSnapshot;
}

export interface KnownQuorumSets {
  /** XDR: `SignedQuorumSetSnapshot quorum_set_snapshots<>`. */
  quorum_set_snapshots: proto.SignedQuorumSetSnapshot[];
  /** XDR: `SignedValidatorInfoSnapshot validator_snapshots<>`. */
  validator_snapshots: proto.SignedValidatorInfoSnapshot[];
}



//
// XDR Codecs below this point
//

const _QuorumSetSnapshot: XdrCodec<QuorumSetSnapshot> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    proto.codec.SCPQuorumSet.encode(w, val.quorum_set);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const quorum_set = proto.codec.SCPQuorumSet.decode(r);
    return { timestamp, quorum_set };
  },
};

const _SignedQuorumSetSnapshot: XdrCodec<SignedQuorumSetSnapshot> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.QuorumSetSnapshot.encode(w, val.quorum_set_snapshot);
  },
  decode(r) {
    const signer = proto.codec.ValidatorPublicInfo.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const quorum_set_snapshot = proto.codec.QuorumSetSnapshot.decode(r);
    return { signer, signature, quorum_set_snapshot };
  },
};

const _ValidatorInfoSnapshot: XdrCodec<ValidatorInfoSnapshot> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    proto.codec.ValidatorPublicInfo.encode(w, val.validator);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const validator = proto.codec.ValidatorPublicInfo.decode(r);
    return { timestamp, validator };
  },
};

const _SignedValidatorInfoSnapshot: XdrCodec<SignedValidatorInfoSnapshot> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.signer);
    proto.codec.Signature.encode(w, val.signature);
    proto.codec.ValidatorInfoSnapshot.encode(w, val.validator_snapshot);
  },
  decode(r) {
    const signer = proto.codec.ValidatorPublicInfo.decode(r);
    const signature = proto.codec.Signature.decode(r);
    const validator_snapshot = proto.codec.ValidatorInfoSnapshot.decode(r);
    return { signer, signature, validator_snapshot };
  },
};

const _KnownQuorumSets: XdrCodec<KnownQuorumSets> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedQuorumSetSnapshot, Number(0xFFFFFFFF)).encode(w, val.quorum_set_snapshots);
    VarArrayCodec(proto.codec.SignedValidatorInfoSnapshot, Number(0xFFFFFFFF)).encode(w, val.validator_snapshots);
  },
  decode(r) {
    const quorum_set_snapshots = VarArrayCodec(proto.codec.SignedQuorumSetSnapshot, Number(0xFFFFFFFF)).decode(r);
    const validator_snapshots = VarArrayCodec(proto.codec.SignedValidatorInfoSnapshot, Number(0xFFFFFFFF)).decode(r);
    return { quorum_set_snapshots, validator_snapshots };
  },
};

export const codec = {
  QuorumSetSnapshot: _QuorumSetSnapshot,
  SignedQuorumSetSnapshot: _SignedQuorumSetSnapshot,
  ValidatorInfoSnapshot: _ValidatorInfoSnapshot,
  SignedValidatorInfoSnapshot: _SignedValidatorInfoSnapshot,
  KnownQuorumSets: _KnownQuorumSets,
} as const;

export const DiscoveryProgram: RpcProgramMeta = {
  programId: 0x3eef0505,
  version: 1,
  methods: {
    discovery_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    discovery_update_quorums: { proc: 10, request: () => _KnownQuorumSets, response: () => _KnownQuorumSets },
  },
};

