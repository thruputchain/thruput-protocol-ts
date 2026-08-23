// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 7cc13390a06c0d4590a76fcc35ad15f6b499f050

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export interface SCPConfig {
  max_timeout_ms: bigint;
  initial_ballot_timeout_ms: bigint;
  increment_ballot_timeout_ms: bigint;
  initial_nomination_timeout_ms: bigint;
  increment_nomination_timeout_ms: bigint;
  quorum_set: proto.SCPQuorumSet;
}


//
// XDR Codecs below this point
//

const _SCPConfig: XdrCodec<SCPConfig> = {
  encode(w, val) {
    w.writeUint64(val.max_timeout_ms);
    w.writeUint64(val.initial_ballot_timeout_ms);
    w.writeUint64(val.increment_ballot_timeout_ms);
    w.writeUint64(val.initial_nomination_timeout_ms);
    w.writeUint64(val.increment_nomination_timeout_ms);
    proto.codec.SCPQuorumSet.encode(w, val.quorum_set);
  },
  decode(r) {
    const max_timeout_ms = r.readUint64();
    const initial_ballot_timeout_ms = r.readUint64();
    const increment_ballot_timeout_ms = r.readUint64();
    const initial_nomination_timeout_ms = r.readUint64();
    const increment_nomination_timeout_ms = r.readUint64();
    const quorum_set = proto.codec.SCPQuorumSet.decode(r);
    return { max_timeout_ms, initial_ballot_timeout_ms, increment_ballot_timeout_ms, initial_nomination_timeout_ms, increment_nomination_timeout_ms, quorum_set };
  },
};

export const codec = {
  SCPConfig: _SCPConfig,
} as const;

