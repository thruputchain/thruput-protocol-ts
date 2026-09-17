// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5135a63d54ca836265b87b8475a9c06f4d4624e4

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";



export enum SCPValidationLevel {
  SCP_INVALID = 0,
  SCP_MAYBE_VALID = 1,
  SCP_FULLY_VALID = 2,
}


export interface scp_handle_validate_ballot_value_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
}

export interface scp_handle_validate_nomination_value_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
}

export interface scp_handle_extract_valid_value_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
}

export interface scp_handle_combine_candidates_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValues;
}

export interface scp_handle_value_externalized_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
}

export interface scp_handle_nominating_value_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
}

export interface scp_handle_updated_candidate_value_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPValue;
}

export interface scp_handle_started_ballot_proto_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPBallot;
}

export interface scp_handle_accepted_ballot_prepared_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPBallot;
}

export interface scp_handle_confirmed_ballot_prepared_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPBallot;
}

export interface scp_handle_accepted_commit_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPBallot;
}

export interface scp_handle_ballot_did_hear_from_quorum_args {
  arg0: proto.SCPSlotIndex;
  arg1: proto.SCPBallot;
}


//
// XDR Codecs below this point
//

const _SCPValidationLevel: XdrCodec<SCPValidationLevel> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SCPValidationLevel; },
};

const _scp_handle_validate_ballot_value_args: XdrCodec<scp_handle_validate_ballot_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_validate_nomination_value_args: XdrCodec<scp_handle_validate_nomination_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_extract_valid_value_args: XdrCodec<scp_handle_extract_valid_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_combine_candidates_args: XdrCodec<scp_handle_combine_candidates_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValues.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValues.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_value_externalized_args: XdrCodec<scp_handle_value_externalized_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_nominating_value_args: XdrCodec<scp_handle_nominating_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_updated_candidate_value_args: XdrCodec<scp_handle_updated_candidate_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPValue.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPValue.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_started_ballot_proto_args: XdrCodec<scp_handle_started_ballot_proto_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPBallot.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPBallot.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_accepted_ballot_prepared_args: XdrCodec<scp_handle_accepted_ballot_prepared_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPBallot.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPBallot.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_confirmed_ballot_prepared_args: XdrCodec<scp_handle_confirmed_ballot_prepared_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPBallot.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPBallot.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_accepted_commit_args: XdrCodec<scp_handle_accepted_commit_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPBallot.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPBallot.decode(r);
    return { arg0, arg1 };
  },
};

const _scp_handle_ballot_did_hear_from_quorum_args: XdrCodec<scp_handle_ballot_did_hear_from_quorum_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.arg0);
    proto.codec.SCPBallot.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SCPSlotIndex.decode(r);
    const arg1 = proto.codec.SCPBallot.decode(r);
    return { arg0, arg1 };
  },
};

export const codec = {
  SCPValidationLevel: _SCPValidationLevel,
} as const;

export const SCP_HandleProgram: RpcProgramMeta = {
  programId: 0x9aa92002,
  version: 1,
  methods: {
    scp_handle_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    scp_handle_emit_envelope: { proc: 10, request: () => proto.codec.SCPEnvelope as XdrCodec<proto.SCPEnvelope>, response: () => VoidCodec },
    scp_handle_validate_ballot_value: { proc: 20, request: () => _scp_handle_validate_ballot_value_args, response: () => _SCPValidationLevel },
    scp_handle_validate_nomination_value: { proc: 30, request: () => _scp_handle_validate_nomination_value_args, response: () => _SCPValidationLevel },
    scp_handle_extract_valid_value: { proc: 40, request: () => _scp_handle_extract_valid_value_args, response: () => proto.codec.SCPOptValue as XdrCodec<proto.SCPOptValue> },
    scp_handle_combine_candidates: { proc: 50, request: () => _scp_handle_combine_candidates_args, response: () => proto.codec.SCPOptValue as XdrCodec<proto.SCPOptValue> },
    scp_handle_value_externalized: { proc: 100, request: () => _scp_handle_value_externalized_args, response: () => VoidCodec },
    scp_handle_nominating_value: { proc: 200, request: () => _scp_handle_nominating_value_args, response: () => VoidCodec },
    scp_handle_updated_candidate_value: { proc: 210, request: () => _scp_handle_updated_candidate_value_args, response: () => VoidCodec },
    scp_handle_started_ballot_proto: { proc: 310, request: () => _scp_handle_started_ballot_proto_args, response: () => VoidCodec },
    scp_handle_accepted_ballot_prepared: { proc: 320, request: () => _scp_handle_accepted_ballot_prepared_args, response: () => VoidCodec },
    scp_handle_confirmed_ballot_prepared: { proc: 330, request: () => _scp_handle_confirmed_ballot_prepared_args, response: () => VoidCodec },
    scp_handle_accepted_commit: { proc: 340, request: () => _scp_handle_accepted_commit_args, response: () => VoidCodec },
    scp_handle_ballot_did_hear_from_quorum: { proc: 350, request: () => _scp_handle_ballot_did_hear_from_quorum_args, response: () => VoidCodec },
    scp_handle_get_quorum_set: { proc: 1000, request: () => proto.codec.SCPHash as XdrCodec<proto.SCPHash>, response: () => proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
  },
};

