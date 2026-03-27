// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 709902883de376dc08544eb36e6c9a16f03bceb1

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhog/xdr";
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

