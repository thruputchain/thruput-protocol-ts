// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: a9ffbba797aa0c6dfbd417c2df77ed99cae34100

import { type XdrCodec, withCodecBudget, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@thruputchain/xdr";
import * as proto from "./index.js";



export const kAuthTokenMaxLen = 256n;
/**
 * Type-level value of {@link kAuthTokenMaxLen}, for use in array-bound positions.
 * @hidden
 */
export type kAuthTokenMaxLen = 256;

export const kAuthTokenMaxDepth = 4n;
/**
 * Type-level value of {@link kAuthTokenMaxDepth}, for use in array-bound positions.
 * @hidden
 */
export type kAuthTokenMaxDepth = 4;

export const kAuthTokenMaxChildNodes = 4n;
/**
 * Type-level value of {@link kAuthTokenMaxChildNodes}, for use in array-bound positions.
 * @hidden
 */
export type kAuthTokenMaxChildNodes = 4;

/** XDR: `typedef opaque AuthTokenPayload<kAuthTokenMaxLen>` — max {@link kAuthTokenMaxLen} bytes. */
export type AuthTokenPayload = VarBytes<proto.kAuthTokenMaxLen> & { readonly __brand: { readonly AuthTokenPayload: true } };
export function authTokenPayload(data: Uint8Array): AuthTokenPayload {
  if (data.length > Number(proto.kAuthTokenMaxLen)) throw new Error(`AuthTokenPayload exceeds max length kAuthTokenMaxLen, got ${data.length}`);
  return data as AuthTokenPayload;
}

export interface AuthTokenNode {
  consumer_address: proto.ContractAddress;
  payload: proto.AuthTokenPayload;
  /** XDR: `AuthTokenNode child_nodes<kAuthTokenMaxChildNodes>` — max {@link kAuthTokenMaxChildNodes} elements. */
  child_nodes: VarArray<proto.AuthTokenNode, proto.kAuthTokenMaxChildNodes>;
}

export interface AuthToken {
  mint_address: proto.ContractAddress;
  expiry_height: proto.BlockHeight;
  root_node: proto.AuthTokenNode;
}


//
// XDR Codecs below this point
//

const _AuthTokenPayload: XdrCodec<AuthTokenPayload> = {
  encode(w, val) { w.writeVarOpaque(val, Number(proto.kAuthTokenMaxLen)); },
  decode(r) { return authTokenPayload(r.readVarOpaque(Number(proto.kAuthTokenMaxLen))); },
};

const _AuthTokenNode: XdrCodec<AuthTokenNode> = withCodecBudget<AuthTokenNode>({
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.consumer_address);
    proto.codec.AuthTokenPayload.encode(w, val.payload);
    VarArrayCodec(proto.codec.AuthTokenNode, Number(proto.kAuthTokenMaxChildNodes)).encode(w, val.child_nodes);
  },
  decode(r) {
    const consumer_address = proto.codec.ContractAddress.decode(r);
    const payload = proto.codec.AuthTokenPayload.decode(r);
    const child_nodes = VarArrayCodec(proto.codec.AuthTokenNode, Number(proto.kAuthTokenMaxChildNodes)).decode(r);
    return { consumer_address, payload, child_nodes };
  },
});

const _AuthToken: XdrCodec<AuthToken> = withCodecBudget<AuthToken>({
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.mint_address);
    proto.codec.BlockHeight.encode(w, val.expiry_height);
    proto.codec.AuthTokenNode.encode(w, val.root_node);
  },
  decode(r) {
    const mint_address = proto.codec.ContractAddress.decode(r);
    const expiry_height = proto.codec.BlockHeight.decode(r);
    const root_node = proto.codec.AuthTokenNode.decode(r);
    return { mint_address, expiry_height, root_node };
  },
});

export const codec = {
  AuthTokenPayload: _AuthTokenPayload,
  AuthTokenNode: _AuthTokenNode,
  AuthToken: _AuthToken,
} as const;

