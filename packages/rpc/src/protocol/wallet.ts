// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 0b35b4bc56dc32f40c6de155f35b76f18a1da5f2

import { type XdrCodec, type RpcProgramMeta, VoidCodec } from "@groundhog/xdr";
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
    w.writeUint32(BigInt(val.signed_transactions.length));
    for (const _item of val.signed_transactions) proto.codec.SignedTransaction.encode(w, _item);
  },
  decode(r) {
    const _signed_transactions_len = Number(r.readUint32());
    const signed_transactions = Array.from({ length: _signed_transactions_len }, () => proto.codec.SignedTransaction.decode(r));
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
        const v = val as Extract<WalletTransactionAck, { ack_type: proto.WalletTransactionAckType.WalletTransactionSubmitted }>;
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
    w.writeUint32(BigInt(val.transaction_acks.length));
    for (const _item of val.transaction_acks) proto.codec.WalletTransactionAck.encode(w, _item);
  },
  decode(r) {
    const _transaction_acks_len = Number(r.readUint32());
    const transaction_acks = Array.from({ length: _transaction_acks_len }, () => proto.codec.WalletTransactionAck.decode(r));
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

