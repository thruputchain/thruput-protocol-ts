// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 21ee49e9b2a76b0fa98de8a0837954f4f9d61f19

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

export type ConsensusBasisHash = proto.SHA256Hash & { readonly __brand: "ConsensusBasisHash" };
export function consensusBasisHash(val: proto.SHA256Hash): ConsensusBasisHash {
  return val as ConsensusBasisHash;
}

export interface ConsensusBasis {
  timestamp: proto.TimePoint;
  proposer: proto.ValidatorID;
  nomination: proto.Nomination;
  upgrades: proto.Upgrade[];
  prev_value_hash: proto.ConsensusValueHash;
  prev_basis_hash: proto.ConsensusBasisHash;
}

export type OptConsensusBasis = (proto.ConsensusBasis | null) & { readonly __brand: "OptConsensusBasis" };
export function optConsensusBasis(val: proto.ConsensusBasis | null): OptConsensusBasis {
  return val as OptConsensusBasis;
}

export interface ConsensusValue {
  timestamp: proto.TimePoint;
  proposer: proto.ValidatorID;
  upgrades: proto.Upgrade[];
  block_height: proto.BlockHeight;
  prev_value_hash: proto.ConsensusValueHash;
  basis_hash: proto.ConsensusBasisHash;
  prev_basis_hash: proto.ConsensusBasisHash;
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

const _ConsensusBasisHash: XdrCodec<ConsensusBasisHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return consensusBasisHash(proto.codec.SHA256Hash.decode(r)); },
};

const _ConsensusBasis: XdrCodec<ConsensusBasis> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    proto.codec.ValidatorID.encode(w, val.proposer);
    proto.codec.Nomination.encode(w, val.nomination);
    VarArrayCodec(proto.codec.Upgrade, Number(6)).encode(w, val.upgrades);
    proto.codec.ConsensusValueHash.encode(w, val.prev_value_hash);
    proto.codec.ConsensusBasisHash.encode(w, val.prev_basis_hash);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const proposer = proto.codec.ValidatorID.decode(r);
    const nomination = proto.codec.Nomination.decode(r);
    const upgrades = VarArrayCodec(proto.codec.Upgrade, Number(6)).decode(r);
    const prev_value_hash = proto.codec.ConsensusValueHash.decode(r);
    const prev_basis_hash = proto.codec.ConsensusBasisHash.decode(r);
    return { timestamp, proposer, nomination, upgrades, prev_value_hash, prev_basis_hash };
  },
};

const _OptConsensusBasis = OptionCodec(() => _ConsensusBasis) as XdrCodec<OptConsensusBasis>;

const _ConsensusValue: XdrCodec<ConsensusValue> = {
  encode(w, val) {
    proto.codec.TimePoint.encode(w, val.timestamp);
    proto.codec.ValidatorID.encode(w, val.proposer);
    VarArrayCodec(proto.codec.Upgrade, Number(6)).encode(w, val.upgrades);
    proto.codec.BlockHeight.encode(w, val.block_height);
    proto.codec.ConsensusValueHash.encode(w, val.prev_value_hash);
    proto.codec.ConsensusBasisHash.encode(w, val.basis_hash);
    proto.codec.ConsensusBasisHash.encode(w, val.prev_basis_hash);
    proto.codec.BlockHash.encode(w, val.block_hash);
    proto.codec.BlockHash.encode(w, val.prev_block_hash);
  },
  decode(r) {
    const timestamp = proto.codec.TimePoint.decode(r);
    const proposer = proto.codec.ValidatorID.decode(r);
    const upgrades = VarArrayCodec(proto.codec.Upgrade, Number(6)).decode(r);
    const block_height = proto.codec.BlockHeight.decode(r);
    const prev_value_hash = proto.codec.ConsensusValueHash.decode(r);
    const basis_hash = proto.codec.ConsensusBasisHash.decode(r);
    const prev_basis_hash = proto.codec.ConsensusBasisHash.decode(r);
    const block_hash = proto.codec.BlockHash.decode(r);
    const prev_block_hash = proto.codec.BlockHash.decode(r);
    return { timestamp, proposer, upgrades, block_height, prev_value_hash, basis_hash, prev_basis_hash, block_hash, prev_block_hash };
  },
};

export const codec = {
  Upgrade: _Upgrade,
  ConsensusValueHash: _ConsensusValueHash,
  ConsensusBasisHash: _ConsensusBasisHash,
  ConsensusBasis: _ConsensusBasis,
  OptConsensusBasis: _OptConsensusBasis,
  ConsensusValue: _ConsensusValue,
} as const;

