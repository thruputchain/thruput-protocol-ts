// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 4eba524354bda9d7db1efa2845da43ce40dd1ab9

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export enum HogexecPrecompiledNativeContracts {
  kNativeContractHogToken = 0,
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

