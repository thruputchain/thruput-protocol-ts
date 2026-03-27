// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 33b572011b97781c388215e8d1e06f5fe816fa06

import type { XdrCodec } from "@groundhog/xdr";
import * as proto from "./index.js";


export type Milliseconds = bigint & { readonly __brand: "Milliseconds" };
export function milliseconds(val: bigint): Milliseconds {
  return val as Milliseconds;
}

export type Seconds = bigint & { readonly __brand: "Seconds" };
export function seconds(val: bigint): Seconds {
  return val as Seconds;
}

export interface ValidatorConfig {
  private_info: proto.ValidatorPrivateInfo;
  known_validators: proto.ValidatorPublicInfo[];
}

export interface WalletConfig {
  secret_key: proto.JWTSecretKey;
  users: proto.WalletUser[];
}

export interface DiscoveryConfig {
  advertise_interval_msec: proto.Milliseconds;
  advertise_par: bigint;
  snapshot_ttl_msec: proto.Milliseconds;
}

export interface RouterConfig {
  tree_fan_out: bigint;
}

export interface DogwoodConfig {
  route_count: proto.DogwoodInt32;
  route_time_to_live_msec: proto.Milliseconds;
  route_max_latency_msec: proto.Milliseconds;
  endpoint_max_pending: proto.DogwoodInt32;
  endpoint_num_clients: proto.DogwoodInt32;
  endpoint_idle_ttl_msec: proto.Milliseconds;
  endpoint_dial_timeout_msec: proto.Milliseconds;
  endpoint_redial_delay_msec: proto.Milliseconds;
  endpoint_call_timeout_msec: proto.Milliseconds;
  stream_receiver_worker_count: proto.DogwoodInt32;
  stream_sender_worker_count: proto.DogwoodInt32;
  transmission_receiver_decode_worker_count: proto.DogwoodInt32;
  transmission_sender_worker_count: proto.DogwoodInt32;
  transmission_partial_max_ttl_msec: proto.Milliseconds;
  transmission_partial_idle_ttl_msec: proto.Milliseconds;
}

export interface MempoolConfig {
  transaction_ttl_msec: proto.Milliseconds;
  submission_lot_size: bigint;
  submission_lot_wait_msec: proto.Milliseconds;
}

export interface CatchupConfig {
  catchup_block_ttl_sec: proto.Seconds;
  catchup_block_age: proto.BlockHeight;
}

export interface BatonConfig {
  skew_msec: proto.Milliseconds;
  heartbeat_msec: proto.Milliseconds;
  patience_msec: proto.Milliseconds;
  max_catchup_height: bigint;
}

export interface RepairConfig {
  base_delay_msec: proto.Milliseconds;
  max_delay_msec: proto.Milliseconds;
  multiplier_nom: bigint;
  multiplier_denom: bigint;
}

export interface StorageConfig {
  reclaim_interval_msec: proto.Milliseconds;
  max_catchup_blocks: bigint;
  max_scp_slots: bigint;
}

export interface Config {
  validator_config: proto.ValidatorConfig | null;
  wallet_config: proto.WalletConfig | null;
  discovery_config: proto.DiscoveryConfig | null;
  router_config: proto.RouterConfig | null;
  dogwood_config: proto.DogwoodConfig | null;
  mempool_config: proto.MempoolConfig | null;
  catchup_config: proto.CatchupConfig | null;
  scp_config: proto.SCPConfig | null;
  baton_config: proto.BatonConfig | null;
  repair_config: proto.RepairConfig | null;
  storage_config: proto.StorageConfig | null;
}


//
// XDR Codecs below this point
//

const _Milliseconds: XdrCodec<Milliseconds> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return milliseconds(r.readInt64()); },
};

const _Seconds: XdrCodec<Seconds> = {
  encode(w, val) { w.writeInt64(val); },
  decode(r) { return seconds(r.readInt64()); },
};

const _ValidatorConfig: XdrCodec<ValidatorConfig> = {
  encode(w, val) {
    proto.codec.ValidatorPrivateInfo.encode(w, val.private_info);
    w.writeUint32(BigInt(val.known_validators.length));
    for (const _item of val.known_validators) proto.codec.ValidatorPublicInfo.encode(w, _item);
  },
  decode(r) {
    const private_info = proto.codec.ValidatorPrivateInfo.decode(r);
    const _known_validators_len = Number(r.readUint32());
    const known_validators = Array.from({ length: _known_validators_len }, () => proto.codec.ValidatorPublicInfo.decode(r));
    return { private_info, known_validators };
  },
};

const _WalletConfig: XdrCodec<WalletConfig> = {
  encode(w, val) {
    proto.codec.JWTSecretKey.encode(w, val.secret_key);
    w.writeUint32(BigInt(val.users.length));
    for (const _item of val.users) proto.codec.WalletUser.encode(w, _item);
  },
  decode(r) {
    const secret_key = proto.codec.JWTSecretKey.decode(r);
    const _users_len = Number(r.readUint32());
    const users = Array.from({ length: _users_len }, () => proto.codec.WalletUser.decode(r));
    return { secret_key, users };
  },
};

const _DiscoveryConfig: XdrCodec<DiscoveryConfig> = {
  encode(w, val) {
    proto.codec.Milliseconds.encode(w, val.advertise_interval_msec);
    w.writeUint32(val.advertise_par);
    proto.codec.Milliseconds.encode(w, val.snapshot_ttl_msec);
  },
  decode(r) {
    const advertise_interval_msec = proto.codec.Milliseconds.decode(r);
    const advertise_par = r.readUint32();
    const snapshot_ttl_msec = proto.codec.Milliseconds.decode(r);
    return { advertise_interval_msec, advertise_par, snapshot_ttl_msec };
  },
};

const _RouterConfig: XdrCodec<RouterConfig> = {
  encode(w, val) {
    w.writeUint32(val.tree_fan_out);
  },
  decode(r) {
    const tree_fan_out = r.readUint32();
    return { tree_fan_out };
  },
};

const _DogwoodConfig: XdrCodec<DogwoodConfig> = {
  encode(w, val) {
    proto.codec.DogwoodInt32.encode(w, val.route_count);
    proto.codec.Milliseconds.encode(w, val.route_time_to_live_msec);
    proto.codec.Milliseconds.encode(w, val.route_max_latency_msec);
    proto.codec.DogwoodInt32.encode(w, val.endpoint_max_pending);
    proto.codec.DogwoodInt32.encode(w, val.endpoint_num_clients);
    proto.codec.Milliseconds.encode(w, val.endpoint_idle_ttl_msec);
    proto.codec.Milliseconds.encode(w, val.endpoint_dial_timeout_msec);
    proto.codec.Milliseconds.encode(w, val.endpoint_redial_delay_msec);
    proto.codec.Milliseconds.encode(w, val.endpoint_call_timeout_msec);
    proto.codec.DogwoodInt32.encode(w, val.stream_receiver_worker_count);
    proto.codec.DogwoodInt32.encode(w, val.stream_sender_worker_count);
    proto.codec.DogwoodInt32.encode(w, val.transmission_receiver_decode_worker_count);
    proto.codec.DogwoodInt32.encode(w, val.transmission_sender_worker_count);
    proto.codec.Milliseconds.encode(w, val.transmission_partial_max_ttl_msec);
    proto.codec.Milliseconds.encode(w, val.transmission_partial_idle_ttl_msec);
  },
  decode(r) {
    const route_count = proto.codec.DogwoodInt32.decode(r);
    const route_time_to_live_msec = proto.codec.Milliseconds.decode(r);
    const route_max_latency_msec = proto.codec.Milliseconds.decode(r);
    const endpoint_max_pending = proto.codec.DogwoodInt32.decode(r);
    const endpoint_num_clients = proto.codec.DogwoodInt32.decode(r);
    const endpoint_idle_ttl_msec = proto.codec.Milliseconds.decode(r);
    const endpoint_dial_timeout_msec = proto.codec.Milliseconds.decode(r);
    const endpoint_redial_delay_msec = proto.codec.Milliseconds.decode(r);
    const endpoint_call_timeout_msec = proto.codec.Milliseconds.decode(r);
    const stream_receiver_worker_count = proto.codec.DogwoodInt32.decode(r);
    const stream_sender_worker_count = proto.codec.DogwoodInt32.decode(r);
    const transmission_receiver_decode_worker_count = proto.codec.DogwoodInt32.decode(r);
    const transmission_sender_worker_count = proto.codec.DogwoodInt32.decode(r);
    const transmission_partial_max_ttl_msec = proto.codec.Milliseconds.decode(r);
    const transmission_partial_idle_ttl_msec = proto.codec.Milliseconds.decode(r);
    return { route_count, route_time_to_live_msec, route_max_latency_msec, endpoint_max_pending, endpoint_num_clients, endpoint_idle_ttl_msec, endpoint_dial_timeout_msec, endpoint_redial_delay_msec, endpoint_call_timeout_msec, stream_receiver_worker_count, stream_sender_worker_count, transmission_receiver_decode_worker_count, transmission_sender_worker_count, transmission_partial_max_ttl_msec, transmission_partial_idle_ttl_msec };
  },
};

const _MempoolConfig: XdrCodec<MempoolConfig> = {
  encode(w, val) {
    proto.codec.Milliseconds.encode(w, val.transaction_ttl_msec);
    w.writeInt64(val.submission_lot_size);
    proto.codec.Milliseconds.encode(w, val.submission_lot_wait_msec);
  },
  decode(r) {
    const transaction_ttl_msec = proto.codec.Milliseconds.decode(r);
    const submission_lot_size = r.readInt64();
    const submission_lot_wait_msec = proto.codec.Milliseconds.decode(r);
    return { transaction_ttl_msec, submission_lot_size, submission_lot_wait_msec };
  },
};

const _CatchupConfig: XdrCodec<CatchupConfig> = {
  encode(w, val) {
    proto.codec.Seconds.encode(w, val.catchup_block_ttl_sec);
    proto.codec.BlockHeight.encode(w, val.catchup_block_age);
  },
  decode(r) {
    const catchup_block_ttl_sec = proto.codec.Seconds.decode(r);
    const catchup_block_age = proto.codec.BlockHeight.decode(r);
    return { catchup_block_ttl_sec, catchup_block_age };
  },
};

const _BatonConfig: XdrCodec<BatonConfig> = {
  encode(w, val) {
    proto.codec.Milliseconds.encode(w, val.skew_msec);
    proto.codec.Milliseconds.encode(w, val.heartbeat_msec);
    proto.codec.Milliseconds.encode(w, val.patience_msec);
    w.writeInt32(val.max_catchup_height);
  },
  decode(r) {
    const skew_msec = proto.codec.Milliseconds.decode(r);
    const heartbeat_msec = proto.codec.Milliseconds.decode(r);
    const patience_msec = proto.codec.Milliseconds.decode(r);
    const max_catchup_height = r.readInt32();
    return { skew_msec, heartbeat_msec, patience_msec, max_catchup_height };
  },
};

const _RepairConfig: XdrCodec<RepairConfig> = {
  encode(w, val) {
    proto.codec.Milliseconds.encode(w, val.base_delay_msec);
    proto.codec.Milliseconds.encode(w, val.max_delay_msec);
    w.writeUint32(val.multiplier_nom);
    w.writeUint32(val.multiplier_denom);
  },
  decode(r) {
    const base_delay_msec = proto.codec.Milliseconds.decode(r);
    const max_delay_msec = proto.codec.Milliseconds.decode(r);
    const multiplier_nom = r.readUint32();
    const multiplier_denom = r.readUint32();
    return { base_delay_msec, max_delay_msec, multiplier_nom, multiplier_denom };
  },
};

const _StorageConfig: XdrCodec<StorageConfig> = {
  encode(w, val) {
    proto.codec.Milliseconds.encode(w, val.reclaim_interval_msec);
    w.writeInt32(val.max_catchup_blocks);
    w.writeInt32(val.max_scp_slots);
  },
  decode(r) {
    const reclaim_interval_msec = proto.codec.Milliseconds.decode(r);
    const max_catchup_blocks = r.readInt32();
    const max_scp_slots = r.readInt32();
    return { reclaim_interval_msec, max_catchup_blocks, max_scp_slots };
  },
};

const _Config: XdrCodec<Config> = {
  encode(w, val) {
    if (val.validator_config !== null) {
      w.writeUint32(1n);
      proto.codec.ValidatorConfig.encode(w, val.validator_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.wallet_config !== null) {
      w.writeUint32(1n);
      proto.codec.WalletConfig.encode(w, val.wallet_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.discovery_config !== null) {
      w.writeUint32(1n);
      proto.codec.DiscoveryConfig.encode(w, val.discovery_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.router_config !== null) {
      w.writeUint32(1n);
      proto.codec.RouterConfig.encode(w, val.router_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.dogwood_config !== null) {
      w.writeUint32(1n);
      proto.codec.DogwoodConfig.encode(w, val.dogwood_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.mempool_config !== null) {
      w.writeUint32(1n);
      proto.codec.MempoolConfig.encode(w, val.mempool_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.catchup_config !== null) {
      w.writeUint32(1n);
      proto.codec.CatchupConfig.encode(w, val.catchup_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.scp_config !== null) {
      w.writeUint32(1n);
      proto.codec.SCPConfig.encode(w, val.scp_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.baton_config !== null) {
      w.writeUint32(1n);
      proto.codec.BatonConfig.encode(w, val.baton_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.repair_config !== null) {
      w.writeUint32(1n);
      proto.codec.RepairConfig.encode(w, val.repair_config);
    } else {
      w.writeUint32(0n);
    }
    if (val.storage_config !== null) {
      w.writeUint32(1n);
      proto.codec.StorageConfig.encode(w, val.storage_config);
    } else {
      w.writeUint32(0n);
    }
  },
  decode(r) {
    const validator_config = Number(r.readUint32()) ? proto.codec.ValidatorConfig.decode(r) : null;
    const wallet_config = Number(r.readUint32()) ? proto.codec.WalletConfig.decode(r) : null;
    const discovery_config = Number(r.readUint32()) ? proto.codec.DiscoveryConfig.decode(r) : null;
    const router_config = Number(r.readUint32()) ? proto.codec.RouterConfig.decode(r) : null;
    const dogwood_config = Number(r.readUint32()) ? proto.codec.DogwoodConfig.decode(r) : null;
    const mempool_config = Number(r.readUint32()) ? proto.codec.MempoolConfig.decode(r) : null;
    const catchup_config = Number(r.readUint32()) ? proto.codec.CatchupConfig.decode(r) : null;
    const scp_config = Number(r.readUint32()) ? proto.codec.SCPConfig.decode(r) : null;
    const baton_config = Number(r.readUint32()) ? proto.codec.BatonConfig.decode(r) : null;
    const repair_config = Number(r.readUint32()) ? proto.codec.RepairConfig.decode(r) : null;
    const storage_config = Number(r.readUint32()) ? proto.codec.StorageConfig.decode(r) : null;
    return { validator_config, wallet_config, discovery_config, router_config, dogwood_config, mempool_config, catchup_config, scp_config, baton_config, repair_config, storage_config };
  },
};

export const codec = {
  Milliseconds: _Milliseconds,
  Seconds: _Seconds,
  ValidatorConfig: _ValidatorConfig,
  WalletConfig: _WalletConfig,
  DiscoveryConfig: _DiscoveryConfig,
  RouterConfig: _RouterConfig,
  DogwoodConfig: _DogwoodConfig,
  MempoolConfig: _MempoolConfig,
  CatchupConfig: _CatchupConfig,
  BatonConfig: _BatonConfig,
  RepairConfig: _RepairConfig,
  StorageConfig: _StorageConfig,
  Config: _Config,
} as const;

