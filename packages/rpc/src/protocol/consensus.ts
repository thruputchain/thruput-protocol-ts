// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e671a3694d7312d78364456bb86ee8a18de1502d

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



/** XDR: `typedef opaque Upgrade<128>` — max 128 bytes. */
export type Upgrade = VarBytes<128> & { readonly __brand: { readonly Upgrade: true } };
export function upgrade(data: Uint8Array): Upgrade {
  if (data.length > 128) throw new Error(`Upgrade exceeds max length 128, got ${data.length}`);
  return data as Upgrade;
}

export interface ConsensusValue {
  protocol: proto.Protocol;
  ext: proto.ExtensionPoint;
  prev_hash: proto.ConsensusValueHash;
  proposal_header: proto.ProposalHeader;
  proposal_txs_hash: proto.ProposalTxsHash;
  /** XDR: `Upgrade upgrades<6>` — max 6 elements. */
  upgrades: VarArray<proto.Upgrade, 6>;
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

