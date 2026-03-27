// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 33b572011b97781c388215e8d1e06f5fe816fa06

import type { XdrCodec } from "@groundhog/xdr";
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
    w.writeUint32(BigInt(val.upgrades.length));
    for (const _item of val.upgrades) proto.codec.Upgrade.encode(w, _item);
    proto.codec.ConsensusValueHash.encode(w, val.prev_cv_hash);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const nomination = proto.codec.Nomination.decode(r);
    const _upgrades_len = Number(r.readUint32());
    const upgrades = Array.from({ length: _upgrades_len }, () => proto.codec.Upgrade.decode(r));
    const prev_cv_hash = proto.codec.ConsensusValueHash.decode(r);
    return { timestamp, nomination, upgrades, prev_cv_hash };
  },
};

const _OptConsensusValue: XdrCodec<OptConsensusValue> = {
  encode(w, val) {
    if (val !== null) {
      w.writeUint32(1n);
      proto.codec.ConsensusValue.encode(w, val);
    } else {
      w.writeUint32(0n);
    }
  },
  decode(r) {
    return optConsensusValue(Number(r.readUint32()) ? proto.codec.ConsensusValue.decode(r) : null);
  },
};

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

