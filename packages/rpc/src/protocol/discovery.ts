// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5351fdbd5f24dc09297b1857e6e8605cbf0ee655

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type ValidatorID = Uint8Array & { readonly __brand: "ValidatorID" };
export function validatorID(data: Uint8Array): ValidatorID {
  if (data.length !== 32) throw new Error(`ValidatorID must be exactly 32 bytes, got ${data.length}`);
  return data as ValidatorID;
}

export type ValidatorPublicKey = proto.Ed25519PublicKey & { readonly __brand: "ValidatorPublicKey" };
export function validatorPublicKey(val: proto.Ed25519PublicKey): ValidatorPublicKey {
  return val as ValidatorPublicKey;
}

export type ValidatorSecretKey = proto.Ed25519SecretKey & { readonly __brand: "ValidatorSecretKey" };
export function validatorSecretKey(val: proto.Ed25519SecretKey): ValidatorSecretKey {
  return val as ValidatorSecretKey;
}

export interface ValidatorPublicInfo {
  public_key: proto.ValidatorPublicKey;
  address: proto.ServerAddress;
}

export interface ValidatorPrivateInfo {
  public_info: proto.ValidatorPublicInfo;
  secret_key: proto.ValidatorSecretKey;
}

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
  quorum_set_snapshots: proto.SignedQuorumSetSnapshot[];
  validator_snapshots: proto.SignedValidatorInfoSnapshot[];
}



//
// XDR Codecs below this point
//

const _ValidatorID: XdrCodec<ValidatorID> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return validatorID(r.readFixedOpaque(32)); },
};

const _ValidatorPublicKey: XdrCodec<ValidatorPublicKey> = {
  encode(w, val) { proto.codec.Ed25519PublicKey.encode(w, val); },
  decode(r) { return validatorPublicKey(proto.codec.Ed25519PublicKey.decode(r)); },
};

const _ValidatorSecretKey: XdrCodec<ValidatorSecretKey> = {
  encode(w, val) { proto.codec.Ed25519SecretKey.encode(w, val); },
  decode(r) { return validatorSecretKey(proto.codec.Ed25519SecretKey.decode(r)); },
};

const _ValidatorPublicInfo: XdrCodec<ValidatorPublicInfo> = {
  encode(w, val) {
    proto.codec.ValidatorPublicKey.encode(w, val.public_key);
    proto.codec.ServerAddress.encode(w, val.address);
  },
  decode(r) {
    const public_key = proto.codec.ValidatorPublicKey.decode(r);
    const address = proto.codec.ServerAddress.decode(r);
    return { public_key, address };
  },
};

const _ValidatorPrivateInfo: XdrCodec<ValidatorPrivateInfo> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.public_info);
    proto.codec.ValidatorSecretKey.encode(w, val.secret_key);
  },
  decode(r) {
    const public_info = proto.codec.ValidatorPublicInfo.decode(r);
    const secret_key = proto.codec.ValidatorSecretKey.decode(r);
    return { public_info, secret_key };
  },
};

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
  ValidatorID: _ValidatorID,
  ValidatorPublicKey: _ValidatorPublicKey,
  ValidatorSecretKey: _ValidatorSecretKey,
  ValidatorPublicInfo: _ValidatorPublicInfo,
  ValidatorPrivateInfo: _ValidatorPrivateInfo,
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

