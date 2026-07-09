// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 21ee49e9b2a76b0fa98de8a0837954f4f9d61f19

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface StorageCostModelXdr {
  ext: proto.ExtensionPoint;
  base_data_item_cost: bigint;
  bytestring_cost_per_byte: bigint;
  base_contract_deployment_cost: bigint;
  contract_deployment_cost_per_byte: bigint;
  auth_per_key_cost: bigint;
  rcq_cost_per_entry: bigint;
  replay_cache_cost_per_entry: bigint;
  balance_cost: bigint;
}


//
// XDR Codecs below this point
//

const _StorageCostModelXdr: XdrCodec<StorageCostModelXdr> = {
  encode(w, val) {
    proto.codec.ExtensionPoint.encode(w, val.ext);
    w.writeUint64(val.base_data_item_cost);
    w.writeUint32(val.bytestring_cost_per_byte);
    w.writeUint64(val.base_contract_deployment_cost);
    w.writeUint64(val.contract_deployment_cost_per_byte);
    w.writeUint64(val.auth_per_key_cost);
    w.writeUint64(val.rcq_cost_per_entry);
    w.writeUint64(val.replay_cache_cost_per_entry);
    w.writeUint64(val.balance_cost);
  },
  decode(r) {
    const ext = proto.codec.ExtensionPoint.decode(r);
    const base_data_item_cost = r.readUint64();
    const bytestring_cost_per_byte = r.readUint32();
    const base_contract_deployment_cost = r.readUint64();
    const contract_deployment_cost_per_byte = r.readUint64();
    const auth_per_key_cost = r.readUint64();
    const rcq_cost_per_entry = r.readUint64();
    const replay_cache_cost_per_entry = r.readUint64();
    const balance_cost = r.readUint64();
    return { ext, base_data_item_cost, bytestring_cost_per_byte, base_contract_deployment_cost, contract_deployment_cost_per_byte, auth_per_key_cost, rcq_cost_per_entry, replay_cache_cost_per_entry, balance_cost };
  },
};

export const codec = {
  StorageCostModelXdr: _StorageCostModelXdr,
} as const;

