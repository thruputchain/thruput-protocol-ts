// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 27c2d4d8be10f9aeeb886090c13524a793e4a386

import { type XdrCodec, withCodecBudget, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@thruputchain/xdr";
import * as proto from "./index.js";





//
// XDR Codecs below this point
//

export const codec = {
} as const;

export const CoordSchedulerProgram: RpcProgramMeta = {
  programId: 0x11117667,
  version: 1,
  methods: {
    coordscheduler_null: { proc: 0, request: () => VoidCodec, response: () => VoidCodec },
    coordscheduler_notify_vetted: { proc: 1, request: () => proto.codec.ParallelSignedTransactionBatch as XdrCodec<proto.ParallelSignedTransactionBatch>, response: () => VoidCodec },
  },
};

