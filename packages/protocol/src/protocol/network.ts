// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 21ee49e9b2a76b0fa98de8a0837954f4f9d61f19

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

export type Protocol = string & { readonly __brand: "Protocol" };
export function protocol(val: string): Protocol {
  return val as Protocol;
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

const _Protocol: XdrCodec<Protocol> = {
  encode(w, val) { w.writeString(val, Number(0xFFFFFFFF)); },
  decode(r) { return protocol(r.readString(Number(0xFFFFFFFF))); },
};

export const codec = {
  ServerAddress: _ServerAddress,
  UPID: _UPID,
  Protocol: _Protocol,
} as const;

