// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5cf47b904e892062b9ef9ce2ab5b08809d319f6e

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
import * as proto from "./index.js";


export interface WalletSubmit {
  signed_transactions: proto.SignedTransaction[];
}

export enum WalletTransactionAckType {
  WalletTransactionNotSubmitted = 0,
  WalletTransactionSubmitted = 1,
}

export type WalletSubmittedTransactionID = Uint8Array & { readonly __brand: "WalletSubmittedTransactionID" };
export function walletSubmittedTransactionID(data: Uint8Array): WalletSubmittedTransactionID {
  if (data.length !== 32) throw new Error(`WalletSubmittedTransactionID must be exactly 32 bytes, got ${data.length}`);
  return data as WalletSubmittedTransactionID;
}

export type WalletTransactionAck =
  | { ack_type: proto.WalletTransactionAckType.WalletTransactionNotSubmitted }
  | { ack_type: proto.WalletTransactionAckType.WalletTransactionSubmitted; submitted_transaction_id: proto.WalletSubmittedTransactionID }
  | { ack_type: number }
;

export interface WalletAck {
  transaction_acks: proto.WalletTransactionAck[];
}



//
// XDR Codecs below this point
//

const _WalletSubmit: XdrCodec<WalletSubmit> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.SignedTransaction, Number(0xFFFFFFFF)).encode(w, val.signed_transactions);
  },
  decode(r) {
    const signed_transactions = VarArrayCodec(proto.codec.SignedTransaction, Number(0xFFFFFFFF)).decode(r);
    return { signed_transactions };
  },
};

const _WalletTransactionAckType: XdrCodec<WalletTransactionAckType> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as WalletTransactionAckType; },
};

const _WalletSubmittedTransactionID: XdrCodec<WalletSubmittedTransactionID> = {
  encode(w, val) { w.writeFixedOpaque(val, 32); },
  decode(r) { return walletSubmittedTransactionID(r.readFixedOpaque(32)); },
};

const _WalletTransactionAck: XdrCodec<WalletTransactionAck> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.ack_type));
    switch (val.ack_type) {
      case proto.WalletTransactionAckType.WalletTransactionNotSubmitted:
        break;
      case proto.WalletTransactionAckType.WalletTransactionSubmitted:
      {
        const v = val as { ack_type: number; submitted_transaction_id: proto.WalletSubmittedTransactionID };
        if (v.submitted_transaction_id === undefined) {
          throw new Error("WalletTransactionAck encode: submitted_transaction_id is undefined");
        }
        proto.codec.WalletSubmittedTransactionID.encode(w, v.submitted_transaction_id);
        break;
      }
    }
  },
  decode(r) {
    const ack_type = Number(r.readInt32());
    switch (ack_type) {
      case proto.WalletTransactionAckType.WalletTransactionNotSubmitted:
        return { ack_type };
      case proto.WalletTransactionAckType.WalletTransactionSubmitted:
        const submitted_transaction_id = proto.codec.WalletSubmittedTransactionID.decode(r);
        return { ack_type, submitted_transaction_id };
      default:
        return { ack_type };
    }
  },
};

const _WalletAck: XdrCodec<WalletAck> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.WalletTransactionAck, Number(0xFFFFFFFF)).encode(w, val.transaction_acks);
  },
  decode(r) {
    const transaction_acks = VarArrayCodec(proto.codec.WalletTransactionAck, Number(0xFFFFFFFF)).decode(r);
    return { transaction_acks };
  },
};

export const codec = {
  WalletSubmit: _WalletSubmit,
  WalletTransactionAckType: _WalletTransactionAckType,
  WalletSubmittedTransactionID: _WalletSubmittedTransactionID,
  WalletTransactionAck: _WalletTransactionAck,
  WalletAck: _WalletAck,
} as const;

export const WalletProgram: RpcProgramMeta = {
  programId: 0x8aa87aa7,
  version: 1,
  methods: {
    wallet_null: { proc: 0, request: VoidCodec, response: VoidCodec },
    wallet_submit: { proc: 10, request: _WalletSubmit, response: _WalletAck },
  },
};

