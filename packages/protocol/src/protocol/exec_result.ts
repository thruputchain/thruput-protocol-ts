// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 7cc13390a06c0d4590a76fcc35ad15f6b499f050

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export enum ExecResult {
  ExecResultOK = 0,
  ExecResultTxDeterministicError = 1,
  ExecResultTxRootFrameReverted = 2,
  ExecResultTxNonDeterministicError = 3,
  ExecResultFailedGasSponsorship = 100,
  ExecResultTxValidationFailure = 200,
  ExecResultSystemError = 300,
  ExecResultUnrecoverable = 400,
}


//
// XDR Codecs below this point
//

const _ExecResult: XdrCodec<ExecResult> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as ExecResult; },
};

export const codec = {
  ExecResult: _ExecResult,
} as const;

