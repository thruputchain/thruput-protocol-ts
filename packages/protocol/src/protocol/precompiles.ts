// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 6ab835b07c234abb4b0b50b61d687904727a4f32

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

