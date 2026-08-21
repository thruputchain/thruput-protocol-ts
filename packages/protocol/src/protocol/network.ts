// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 58301365769c00d43c91f44a53e2148f54fdfa6a

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export type ServerAddress = string & { readonly __brand: "ServerAddress" };
export function serverAddress(val: string): ServerAddress {
  return val as ServerAddress;
}

export type UPID = Uint8Array & { readonly __brand: "UPID" };
export function upid(data: Uint8Array): UPID {
  if (data.length !== 8) throw new Error(`UPID must be exactly 8 bytes, got ${data.length}`);
  return data as UPID;
}

export type ProtocolCommit = string & { readonly __brand: "ProtocolCommit" };
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

