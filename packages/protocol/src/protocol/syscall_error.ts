// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5351fdbd5f24dc09297b1857e6e8605cbf0ee655

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
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
  kSyscallErrorCodeDeterministicWasm = -1,
  kSyscallErrorCodeFrameReverted = -2,
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

