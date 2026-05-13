// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: a238ec3f5700fe0c9d304af7119641d21be8cc63

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface StorageCostModelXdr {
  ext: proto.ExtensionPoint;
  base_data_item_cost: proto.int128_xdr;
  bytestring_cost_per_byte: bigint;
  base_contract_deployment_cost: proto.int128_xdr;
  contract_deployment_cost_per_byte: proto.int128_xdr;
  auth_per_key_cost: proto.int128_xdr;
  rcq_cost_per_entry: proto.int128_xdr;
  replay_cache_cost_per_entry: proto.int128_xdr;
  balance_cost: proto.int128_xdr;
}


//
// XDR Codecs below this point
//

const _StorageCostModelXdr: XdrCodec<StorageCostModelXdr> = {
  encode(w, val) {
    proto.codec.ExtensionPoint.encode(w, val.ext);
    proto.codec.int128_xdr.encode(w, val.base_data_item_cost);
    w.writeInt32(val.bytestring_cost_per_byte);
    proto.codec.int128_xdr.encode(w, val.base_contract_deployment_cost);
    proto.codec.int128_xdr.encode(w, val.contract_deployment_cost_per_byte);
    proto.codec.int128_xdr.encode(w, val.auth_per_key_cost);
    proto.codec.int128_xdr.encode(w, val.rcq_cost_per_entry);
    proto.codec.int128_xdr.encode(w, val.replay_cache_cost_per_entry);
    proto.codec.int128_xdr.encode(w, val.balance_cost);
  },
  decode(r) {
    const ext = proto.codec.ExtensionPoint.decode(r);
    const base_data_item_cost = proto.codec.int128_xdr.decode(r);
    const bytestring_cost_per_byte = r.readInt32();
    const base_contract_deployment_cost = proto.codec.int128_xdr.decode(r);
    const contract_deployment_cost_per_byte = proto.codec.int128_xdr.decode(r);
    const auth_per_key_cost = proto.codec.int128_xdr.decode(r);
    const rcq_cost_per_entry = proto.codec.int128_xdr.decode(r);
    const replay_cache_cost_per_entry = proto.codec.int128_xdr.decode(r);
    const balance_cost = proto.codec.int128_xdr.decode(r);
    return { ext, base_data_item_cost, bytestring_cost_per_byte, base_contract_deployment_cost, contract_deployment_cost_per_byte, auth_per_key_cost, rcq_cost_per_entry, replay_cache_cost_per_entry, balance_cost };
  },
};

export const codec = {
  StorageCostModelXdr: _StorageCostModelXdr,
} as const;

