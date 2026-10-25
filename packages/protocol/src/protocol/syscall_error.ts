// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 2ff2d08a54a36835f1f9a22aa693ba3205b0217e

// clang-format off

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";


export enum SyscallErrorCode {
  kSyscallErrorCodeNone = 0,
  kSyscallErrorCodeFault = 1,
  kSyscallErrorCodeNoSyscall = 2,
  kSyscallErrorCodeIsRootTransaction = 3,
  kSyscallErrorCodeReentrance = 4,
  kSyscallErrorCodeContractAlreadyDeployed = 5,
  kSyscallErrorCodeNoReturnBufferAvailable = 6,
  kSyscallErrorCodeInvalidSyscallInput = 7,
  kSyscallErrorCodeStorageKeyNotExist = 8,
  kSyscallErrorCodeNoRetrocausalQueueEntry = 9,
  kSyscallErrorCodeRetrocausalQueueReadLimitReached = 10,
  kSyscallErrorCodeInvokeDepthExceeded = 11,
}


//
// XDR Codecs below this point
//

const _SyscallErrorCode: XdrCodec<SyscallErrorCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as SyscallErrorCode; },
};

export const codec = {
  SyscallErrorCode: _SyscallErrorCode,
} as const;

