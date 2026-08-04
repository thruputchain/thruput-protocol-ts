// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 2bb863900e285102907f789666495140afed7392

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export type Upgrade = Uint8Array & { readonly __brand: "Upgrade" };
export function upgrade(data: Uint8Array): Upgrade {
  if (data.length > Number(128)) throw new Error(`Upgrade exceeds max length 128, got ${data.length}`);
  return data as Upgrade;
}

export interface ConsensusValue {
  protocol: proto.Protocol;
  ext: proto.ExtensionPoint;
  prev_hash: proto.ConsensusValueHash;
  proposal_header: proto.ProposalHeader;
  proposal_txs_hash: proto.ProposalTxsHash;
  upgrades: proto.Upgrade[];
}

export interface ConsensusBasis {
  ext: proto.ExtensionPoint;
  value: proto.ConsensusValue;
  proposal_txs: proto.ProposalTxs;
}


//
// XDR Codecs below this point
//

const _Upgrade: XdrCodec<Upgrade> = {
  encode(w, val) { w.writeVarOpaque(val, Number(128)); },
  decode(r) { return upgrade(r.readVarOpaque(Number(128))); },
};

const _ConsensusValue: XdrCodec<ConsensusValue> = {
  encode(w, val) {
    proto.codec.Protocol.encode(w, val.protocol);
    proto.codec.ExtensionPoint.encode(w, val.ext);
    proto.codec.ConsensusValueHash.encode(w, val.prev_hash);
    proto.codec.ProposalHeader.encode(w, val.proposal_header);
    proto.codec.ProposalTxsHash.encode(w, val.proposal_txs_hash);
    VarArrayCodec(proto.codec.Upgrade, Number(6)).encode(w, val.upgrades);
  },
  decode(r) {
    const protocol = proto.codec.Protocol.decode(r);
    const ext = proto.codec.ExtensionPoint.decode(r);
    const prev_hash = proto.codec.ConsensusValueHash.decode(r);
    const proposal_header = proto.codec.ProposalHeader.decode(r);
    const proposal_txs_hash = proto.codec.ProposalTxsHash.decode(r);
    const upgrades = VarArrayCodec(proto.codec.Upgrade, Number(6)).decode(r);
    return { protocol, ext, prev_hash, proposal_header, proposal_txs_hash, upgrades };
  },
};

const _ConsensusBasis: XdrCodec<ConsensusBasis> = {
  encode(w, val) {
    proto.codec.ExtensionPoint.encode(w, val.ext);
    proto.codec.ConsensusValue.encode(w, val.value);
    proto.codec.ProposalTxs.encode(w, val.proposal_txs);
  },
  decode(r) {
    const ext = proto.codec.ExtensionPoint.decode(r);
    const value = proto.codec.ConsensusValue.decode(r);
    const proposal_txs = proto.codec.ProposalTxs.decode(r);
    return { ext, value, proposal_txs };
  },
};

export const codec = {
  Upgrade: _Upgrade,
  ConsensusValue: _ConsensusValue,
  ConsensusBasis: _ConsensusBasis,
} as const;

