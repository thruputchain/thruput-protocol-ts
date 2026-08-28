// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 14959ad52a564640d44d7079849fb9f146d330c0

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";


/** XDR: `typedef string ServerAddress<>`. */
export type ServerAddress = string & { readonly __brand: { readonly ServerAddress: true } };
export function serverAddress(val: string): ServerAddress {
  return val as ServerAddress;
}

/** XDR: `typedef opaque UPID[8]` — exactly 8 bytes. */
export type UPID = FixedBytes<8> & { readonly __brand: { readonly UPID: true } };
export function upid(data: Uint8Array): UPID {
  if (data.length !== 8) throw new Error(`UPID must be exactly 8 bytes, got ${data.length}`);
  return data as UPID;
}

/** XDR: `typedef string ProtocolCommit<>`. */
export type ProtocolCommit = string & { readonly __brand: { readonly ProtocolCommit: true } };
export function protocolCommit(val: string): ProtocolCommit {
  return val as ProtocolCommit;
}


//
// XDR Codecs below this point
//

const _ServerAddress: XdrCodec<ServerAddress> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return serverAddress(r.readString(Number(0xFFFFFFFF))); },
};

const _UPID: XdrCodec<UPID> = {
  encode(w, val) { w.writeFixedOpaque(val, 8); },
  decode(r) { return upid(r.readFixedOpaque(8)); },
};

const _ProtocolCommit: XdrCodec<ProtocolCommit> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return protocolCommit(r.readString(Number(0xFFFFFFFF))); },
};

export const codec = {
  ServerAddress: _ServerAddress,
  UPID: _UPID,
  ProtocolCommit: _ProtocolCommit,
} as const;

