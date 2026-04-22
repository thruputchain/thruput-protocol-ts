// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: bab641a16d398d48b16086772f51d186ac0522cb

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export type JWTSecretKey = Uint8Array & { readonly __brand: "JWTSecretKey" };
export function jwtSecretKey(data: Uint8Array): JWTSecretKey {
  return data as JWTSecretKey;
}

export interface WalletUser {
  login: string;
  password_hash: proto.SHA256Hash;
}


//
// XDR Codecs below this point
//

const _JWTSecretKey: XdrCodec<JWTSecretKey> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return jwtSecretKey(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

const _WalletUser: XdrCodec<WalletUser> = {
  encode(w, val) {
    w.writeString(val.login, Number(0xFFFFFFFF));
    proto.codec.SHA256Hash.encode(w, val.password_hash);
  },
  decode(r) {
    const login = r.readString(Number(0xFFFFFFFF));
    const password_hash = proto.codec.SHA256Hash.decode(r);
    return { login, password_hash };
  },
};

export const codec = {
  JWTSecretKey: _JWTSecretKey,
  WalletUser: _WalletUser,
} as const;

