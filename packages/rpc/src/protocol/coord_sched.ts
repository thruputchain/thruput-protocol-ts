// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 7c6215466921ff17dc1f31705e23af0f52ce2c08

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
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

