// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: cb9cab8a8d69ace37c18d49b505f1e93ec802af8

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";


export enum ExecResult {
  ExecResultOK = 0,
  ExecResultTxDeterministicError = 1,
  ExecResultTxRootFrameReverted = 2,
  ExecResultTxNonDeterministicError = 3,
  ExecResultFailedGasSponsorship = 100,
  ExecResultTxValidationFailure = 200,
  ExecResultMalformedTransaction = 201,
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

