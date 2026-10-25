// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: d205b2a2427fe9af85bb4fcdcf7e85ac770d5961

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";


export enum HogexecPrecompiledNativeContracts {
  kNativeContractNativeToken = 0,
  kNativeContractDefaultWallet = 2,
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

