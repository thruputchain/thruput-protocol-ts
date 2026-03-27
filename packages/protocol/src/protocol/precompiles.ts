// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 33b572011b97781c388215e8d1e06f5fe816fa06

import type { XdrCodec } from "@groundhog/xdr";
import * as proto from "./index.js";


export enum HogexecPrecompiledNativeContracts {
  kNativeContractHogToken = 0,
  kNativeContractInitialTokenClaim = 1,
}


//
// XDR Codecs below this point
//

const _HogexecPrecompiledNativeContracts: XdrCodec<HogexecPrecompiledNativeContracts> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as HogexecPrecompiledNativeContracts; },
};

export const codec = {
  HogexecPrecompiledNativeContracts: _HogexecPrecompiledNativeContracts,
} as const;

