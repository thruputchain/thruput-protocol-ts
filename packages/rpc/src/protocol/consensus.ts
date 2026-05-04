// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: ad83b3f82af341f97adcda39e036f417732fe1f4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type Upgrade = Uint8Array & { readonly __brand: "Upgrade" };
export function upgrade(data: Uint8Array): Upgrade {
  if (data.length > Number(128)) throw new Error(`Upgrade exceeds max length 128, got ${data.length}`);
  return data as Upgrade;
}

export type ConsensusValueHash = proto.SHA256Hash & { readonly __brand: "ConsensusValueHash" };
export function consensusValueHash(val: proto.SHA256Hash): ConsensusValueHash {
  return val as ConsensusValueHash;
}

export interface ConsensusValue {
  timestamp: proto.TimePoint;
  nomination: proto.Nomination;
  upgrades: proto.Upgrade[];
  prev_cv_hash: proto.ConsensusValueHash;
}

export type OptConsensusValue = (proto.ConsensusValue | null) & { readonly __brand: "OptConsensusValue" };
export function optConsensusValue(val: proto.ConsensusValue | null): OptConsensusValue {
  return val as OptConsensusValue;
}

export interface ConsensusValueCue {
  proposer: proto.ValidatorPublicInfo;
  cv_hash: proto.ConsensusValueHash;
  prev_cv_hash: proto.ConsensusValueHash;
  block_height: proto.BlockHeight;
  block_hash: proto.BlockHash;
  prev_block_hash: proto.BlockHash;
}


//
// XDR Codecs below this point
//

const _Upgrade: XdrCodec<Upgrade> = {
  encode(w, val) { w.writeVarOpaque(val, Number(128)); },
  decode(r) { return upgrade(r.readVarOpaque(Number(128))); },
};

const _ConsensusValueHash: XdrCodec<ConsensusValueHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return consensusValueHash(proto.codec.SHA256Hash.decode(r)); },
};

const _ConsensusValue: XdrCodec<ConsensusValue> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    proto.codec.Nomination.encode(w, val.nomination);
    VarArrayCodec(proto.codec.Upgrade, Number(6)).encode(w, val.upgrades);
    proto.codec.ConsensusValueHash.encode(w, val.prev_cv_hash);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const nomination = proto.codec.Nomination.decode(r);
    const upgrades = VarArrayCodec(proto.codec.Upgrade, Number(6)).decode(r);
    const prev_cv_hash = proto.codec.ConsensusValueHash.decode(r);
    return { timestamp, nomination, upgrades, prev_cv_hash };
  },
};

const _OptConsensusValue = OptionCodec(() => _ConsensusValue) as XdrCodec<OptConsensusValue>;

const _ConsensusValueCue: XdrCodec<ConsensusValueCue> = {
  encode(w, val) {
    proto.codec.ValidatorPublicInfo.encode(w, val.proposer);
    proto.codec.ConsensusValueHash.encode(w, val.cv_hash);
    proto.codec.ConsensusValueHash.encode(w, val.prev_cv_hash);
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.BlockHash.encode(w, val.block_hash);
    proto.codec.BlockHash.encode(w, val.prev_block_hash);
  },
  decode(r) {
    const proposer = proto.codec.ValidatorPublicInfo.decode(r);
    const cv_hash = proto.codec.ConsensusValueHash.decode(r);
    const prev_cv_hash = proto.codec.ConsensusValueHash.decode(r);
    const block_height = proto.codec.BlockHeight.decode(r);
    const block_hash = proto.codec.BlockHash.decode(r);
    const prev_block_hash = proto.codec.BlockHash.decode(r);
    return { proposer, cv_hash, prev_cv_hash, block_height, block_hash, prev_block_hash };
  },
};

export const codec = {
  Upgrade: _Upgrade,
  ConsensusValueHash: _ConsensusValueHash,
  ConsensusValue: _ConsensusValue,
  OptConsensusValue: _OptConsensusValue,
  ConsensusValueCue: _ConsensusValueCue,
} as const;

