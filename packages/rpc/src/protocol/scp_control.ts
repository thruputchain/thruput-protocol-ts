// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta, BoolCodec } from "@groundhog/xdr";
import * as proto from "./index.js";




export interface scp_control_nominate_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
  arg2: proto.SCPValue;
}


//
// XDR Codecs below this point
//

const _scp_control_nominate_args: XdrCodec<scp_control_nominate_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
    proto.codec.SCPValue.encode(w, val.arg2);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    const arg2 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1, arg2 };
  },
};

export const codec = {
} as const;

export const SCP_ControlProgram: RpcProgramMeta = {
  programId: 0x9aa93003,
  version: 1,
  methods: {
    scp_control_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    scp_control_nominate: { proc: 10, request: _scp_control_nominate_args, response: BoolCodec },
    scp_control_stop_nomination: { proc: 20, request: proto.codec.SCPSlotIndex as XdrCodec<proto.SCPSlotIndex>, response: VoidCodec },
    scp_control_update_local_quorum_set: { proc: 100, request: proto.codec.SCPQuorumSet as XdrCodec<proto.SCPQuorumSet>, response: VoidCodec },
    scp_control_received_envelope: { proc: 200, request: proto.codec.SCPEnvelope as XdrCodec<proto.SCPEnvelope>, response: VoidCodec },
    scp_control_set_qset: { proc: 300, request: proto.codec.SCPQuorumSet as XdrCodec<proto.SCPQuorumSet>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
    scp_control_get_qset: { proc: 301, request: proto.codec.SCPHash as XdrCodec<proto.SCPHash>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
    scp_control_remove_qset: { proc: 302, request: proto.codec.SCPHash as XdrCodec<proto.SCPHash>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
  },
};

