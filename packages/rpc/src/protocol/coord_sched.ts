// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
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
    coordscheduler_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    coordscheduler_notify_vetted: { proc: 1, request: proto.codec.ParallelSignedTransactionBatch as XdrCodec<proto.ParallelSignedTransactionBatch>, response: VoidCodec },
  },
};

