// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";




export interface scp_control_nominate_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
  SCPValue2: proto.SCPValue;
}


//
// XDR Codecs below this point
//

const _scp_control_nominate_args: XdrCodec<scp_control_nominate_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
    proto.codec.SCPValue.encode(w, val.SCPValue2);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    const SCPValue2 = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue, SCPValue2 };
  },
};

export const codec = {
  scp_control_nominate_args: _scp_control_nominate_args,
} as const;

export const SCP_ControlProgram: RpcProgramMeta = {
  programId: 0x9aa93003,
  version: 1,
  methods: {
    scp_control_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    scp_control_nominate: { proc: 10, request: _scp_control_nominate_args, response: proto.codec.bool as XdrCodec<proto.bool> },
    scp_control_stop_nomination: { proc: 20, request: proto.codec.SCPSlotIndex as XdrCodec<proto.SCPSlotIndex>, response: VoidCodec },
    scp_control_update_local_quorum_set: { proc: 100, request: proto.codec.SCPQuorumSet as XdrCodec<proto.SCPQuorumSet>, response: VoidCodec },
    scp_control_received_envelope: { proc: 200, request: proto.codec.SCPEnvelope as XdrCodec<proto.SCPEnvelope>, response: VoidCodec },
    scp_control_set_qset: { proc: 300, request: proto.codec.SCPQuorumSet as XdrCodec<proto.SCPQuorumSet>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
    scp_control_get_qset: { proc: 301, request: proto.codec.SCPHash as XdrCodec<proto.SCPHash>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
    scp_control_remove_qset: { proc: 302, request: proto.codec.SCPHash as XdrCodec<proto.SCPHash>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
  },
};

