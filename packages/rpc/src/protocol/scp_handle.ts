// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export enum SCPValidationLevel {
  SCP_INVALID = 0,
  SCP_MAYBE_VALID = 1,
  SCP_FULLY_VALID = 2,
}


export interface scp_handle_validate_ballot_value_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
}

export interface scp_handle_validate_nomination_value_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
}

export interface scp_handle_extract_valid_value_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
}

export interface scp_handle_combine_candidates_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValues: proto.SCPValues;
}

export interface scp_handle_value_externalized_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
}

export interface scp_handle_nominating_value_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
}

export interface scp_handle_updated_candidate_value_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPValue: proto.SCPValue;
}

export interface scp_handle_started_ballot_proto_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPBallot: proto.SCPBallot;
}

export interface scp_handle_accepted_ballot_prepared_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPBallot: proto.SCPBallot;
}

export interface scp_handle_confirmed_ballot_prepared_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPBallot: proto.SCPBallot;
}

export interface scp_handle_accepted_commit_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPBallot: proto.SCPBallot;
}

export interface scp_handle_ballot_did_hear_from_quorum_args {
  SCPSlotIndex: proto.SCPSlotIndex;
  SCPBallot: proto.SCPBallot;
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
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue };
  },
};

const _scp_handle_validate_nomination_value_args: XdrCodec<scp_handle_validate_nomination_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue };
  },
};

const _scp_handle_extract_valid_value_args: XdrCodec<scp_handle_extract_valid_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue };
  },
};

const _scp_handle_combine_candidates_args: XdrCodec<scp_handle_combine_candidates_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValues.encode(w, val.SCPValues);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValues = proto.codec.SCPValues.decode(r);
    return { SCPSlotIndex, SCPValues };
  },
};

const _scp_handle_value_externalized_args: XdrCodec<scp_handle_value_externalized_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue };
  },
};

const _scp_handle_nominating_value_args: XdrCodec<scp_handle_nominating_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue };
  },
};

const _scp_handle_updated_candidate_value_args: XdrCodec<scp_handle_updated_candidate_value_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPValue.encode(w, val.SCPValue);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPValue = proto.codec.SCPValue.decode(r);
    return { SCPSlotIndex, SCPValue };
  },
};

const _scp_handle_started_ballot_proto_args: XdrCodec<scp_handle_started_ballot_proto_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPBallot.encode(w, val.SCPBallot);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPBallot = proto.codec.SCPBallot.decode(r);
    return { SCPSlotIndex, SCPBallot };
  },
};

const _scp_handle_accepted_ballot_prepared_args: XdrCodec<scp_handle_accepted_ballot_prepared_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPBallot.encode(w, val.SCPBallot);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPBallot = proto.codec.SCPBallot.decode(r);
    return { SCPSlotIndex, SCPBallot };
  },
};

const _scp_handle_confirmed_ballot_prepared_args: XdrCodec<scp_handle_confirmed_ballot_prepared_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPBallot.encode(w, val.SCPBallot);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPBallot = proto.codec.SCPBallot.decode(r);
    return { SCPSlotIndex, SCPBallot };
  },
};

const _scp_handle_accepted_commit_args: XdrCodec<scp_handle_accepted_commit_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPBallot.encode(w, val.SCPBallot);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPBallot = proto.codec.SCPBallot.decode(r);
    return { SCPSlotIndex, SCPBallot };
  },
};

const _scp_handle_ballot_did_hear_from_quorum_args: XdrCodec<scp_handle_ballot_did_hear_from_quorum_args> = {
  encode(w, val) {
    proto.codec.SCPSlotIndex.encode(w, val.SCPSlotIndex);
    proto.codec.SCPBallot.encode(w, val.SCPBallot);
  },
  decode(r) {
    const SCPSlotIndex = proto.codec.SCPSlotIndex.decode(r);
    const SCPBallot = proto.codec.SCPBallot.decode(r);
    return { SCPSlotIndex, SCPBallot };
  },
};

export const codec = {
  SCPValidationLevel: _SCPValidationLevel,
  scp_handle_validate_ballot_value_args: _scp_handle_validate_ballot_value_args,
  scp_handle_validate_nomination_value_args: _scp_handle_validate_nomination_value_args,
  scp_handle_extract_valid_value_args: _scp_handle_extract_valid_value_args,
  scp_handle_combine_candidates_args: _scp_handle_combine_candidates_args,
  scp_handle_value_externalized_args: _scp_handle_value_externalized_args,
  scp_handle_nominating_value_args: _scp_handle_nominating_value_args,
  scp_handle_updated_candidate_value_args: _scp_handle_updated_candidate_value_args,
  scp_handle_started_ballot_proto_args: _scp_handle_started_ballot_proto_args,
  scp_handle_accepted_ballot_prepared_args: _scp_handle_accepted_ballot_prepared_args,
  scp_handle_confirmed_ballot_prepared_args: _scp_handle_confirmed_ballot_prepared_args,
  scp_handle_accepted_commit_args: _scp_handle_accepted_commit_args,
  scp_handle_ballot_did_hear_from_quorum_args: _scp_handle_ballot_did_hear_from_quorum_args,
} as const;

export const SCP_HandleProgram: RpcProgramMeta = {
  programId: 0x9aa92002,
  version: 1,
  methods: {
    scp_handle_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    scp_handle_emit_envelope: { proc: 10, request: proto.codec.SCPEnvelope as XdrCodec<proto.SCPEnvelope>, response: VoidCodec },
    scp_handle_validate_ballot_value: { proc: 20, request: _scp_handle_validate_ballot_value_args, response: _SCPValidationLevel },
    scp_handle_validate_nomination_value: { proc: 30, request: _scp_handle_validate_nomination_value_args, response: _SCPValidationLevel },
    scp_handle_extract_valid_value: { proc: 40, request: _scp_handle_extract_valid_value_args, response: proto.codec.SCPOptValue as XdrCodec<proto.SCPOptValue> },
    scp_handle_combine_candidates: { proc: 50, request: _scp_handle_combine_candidates_args, response: proto.codec.SCPOptValue as XdrCodec<proto.SCPOptValue> },
    scp_handle_value_externalized: { proc: 100, request: _scp_handle_value_externalized_args, response: VoidCodec },
    scp_handle_nominating_value: { proc: 200, request: _scp_handle_nominating_value_args, response: VoidCodec },
    scp_handle_updated_candidate_value: { proc: 210, request: _scp_handle_updated_candidate_value_args, response: VoidCodec },
    scp_handle_started_ballot_proto: { proc: 310, request: _scp_handle_started_ballot_proto_args, response: VoidCodec },
    scp_handle_accepted_ballot_prepared: { proc: 320, request: _scp_handle_accepted_ballot_prepared_args, response: VoidCodec },
    scp_handle_confirmed_ballot_prepared: { proc: 330, request: _scp_handle_confirmed_ballot_prepared_args, response: VoidCodec },
    scp_handle_accepted_commit: { proc: 340, request: _scp_handle_accepted_commit_args, response: VoidCodec },
    scp_handle_ballot_did_hear_from_quorum: { proc: 350, request: _scp_handle_ballot_did_hear_from_quorum_args, response: VoidCodec },
    scp_handle_get_quorum_set: { proc: 1000, request: proto.codec.SCPHash as XdrCodec<proto.SCPHash>, response: proto.codec.SCPOptQuorumSet as XdrCodec<proto.SCPOptQuorumSet> },
  },
};

