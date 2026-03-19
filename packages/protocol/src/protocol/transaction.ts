// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 3f9085a9d256ce71dd85566a4608e897076b5424

import type { XdrCodec } from "@groundhog/xdr";
import * as proto from "./index.js";



export type Calldata = Uint8Array & { readonly __brand: "Calldata" };
export function calldata(data: Uint8Array): Calldata {
  return data as Calldata;
}

export const kMaxReturnBufferLen = 1024n;

export type ReturnBuffer = Uint8Array & { readonly __brand: "ReturnBuffer" };
export function returnBuffer(data: Uint8Array): ReturnBuffer {
  if (data.length > Number(kMaxReturnBufferLen)) throw new Error(`ReturnBuffer exceeds max length kMaxReturnBufferLen, got ${data.length}`);
  return data as ReturnBuffer;
}

export interface GasClaim {
  sponsored_contract: proto.ContractAddress;
  amount: proto.GasAmount;
}

export interface Invocation {
  invoked_address: proto.ContractAddress;
  entrypoint: proto.ContractEntrypointID;
  gas_limit: proto.GasAmount;
  calldata: proto.Calldata;
}

export enum InvocationFrameStatusCode {
  kInvocationFrameStatusCodeReturn = 0,
  kInvocationFrameStatusCodeFault = 1,
  kInvocationFrameStatusCodeAbort = 2,
}

export type InvocationFrameOutput =
  | { status_code: proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn; return_buffer: proto.ReturnBuffer }
  | { status_code: proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort; abort_buffer: proto.ReturnBuffer }
  | { status_code: proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault }
;

export enum InvokeFlag {
  kInvokeFlagNone = 0,
  kInvokeFlagTryInvoke = 0x00000001,
  kInvokeFlagReadOnly = 0x00000002,
  kInvokeFlagDelegateCall = 0x00000004,
}

export type InvokeFlagSet = bigint & { readonly __brand: "InvokeFlagSet" };
export function invokeFlagSet(val: bigint): InvokeFlagSet {
  return val as InvokeFlagSet;
}

export interface Uniquifier {
  block_expiry_height: proto.BlockHeight;
  nonce: bigint;
}

export interface Transaction {
  invocation: proto.Invocation;
  uniquifier: proto.Uniquifier;
  contracts_to_deploy: proto.Contract[];
  auth_claims: proto.AuthClaimData;
  gas_claims: proto.GasClaim[];
}

export interface DecoratedSignature {
  auth_claim_idx: bigint;
  public_key_id: bigint;
  signature: proto.Signature;
}

export type SignedTransactionHash = proto.SHA256Hash & { readonly __brand: "SignedTransactionHash" };
export function signedTransactionHash(val: proto.SHA256Hash): SignedTransactionHash {
  return val as SignedTransactionHash;
}

export interface SignedTransaction {
  tx: proto.Transaction;
  signatures: proto.DecoratedSignature[];
}

export type TransactionBatch = proto.Transaction[] & { readonly __brand: "TransactionBatch" };
export function transactionBatch(val: proto.Transaction[]): TransactionBatch {
  return val as TransactionBatch;
}

export type SignedTransactionBatch = proto.SignedTransaction[] & { readonly __brand: "SignedTransactionBatch" };
export function signedTransactionBatch(val: proto.SignedTransaction[]): SignedTransactionBatch {
  return val as SignedTransactionBatch;
}

export type OptSignedTransaction = (proto.SignedTransaction | null) & { readonly __brand: "OptSignedTransaction" };
export function optSignedTransaction(val: proto.SignedTransaction | null): OptSignedTransaction {
  return val as OptSignedTransaction;
}

export type OptSignedTransactionBatch = proto.OptSignedTransaction[] & { readonly __brand: "OptSignedTransactionBatch" };
export function optSignedTransactionBatch(val: proto.OptSignedTransaction[]): OptSignedTransactionBatch {
  return val as OptSignedTransactionBatch;
}

export type SignedTransactionHashBatch = proto.SignedTransactionHash[] & { readonly __brand: "SignedTransactionHashBatch" };
export function signedTransactionHashBatch(val: proto.SignedTransactionHash[]): SignedTransactionHashBatch {
  return val as SignedTransactionHashBatch;
}

export interface NondeterministicProposalData {
  nondeterministic_bits: Uint8Array;
  nondeterministic_bit_count: bigint;
  observed_queue_entry_sequence: proto.QueueEntry[];
}

export interface ProposedTransaction {
  signed_tx: proto.SignedTransaction;
  nondeterministic_proposal_data: proto.NondeterministicProposalData;
}

export enum TransactionStatistic {
  kTxStatGasRemaining = 0,
}


//
// XDR Codecs below this point
//

const _Calldata: XdrCodec<Calldata> = {
  encode(w, val) { w.writeVarOpaque(val, Number(0xFFFFFFFF)); },
  decode(r) { return calldata(r.readVarOpaque(Number(0xFFFFFFFF))); },
};

const _ReturnBuffer: XdrCodec<ReturnBuffer> = {
  encode(w, val) { w.writeVarOpaque(val, Number(proto.kMaxReturnBufferLen)); },
  decode(r) { return returnBuffer(r.readVarOpaque(Number(proto.kMaxReturnBufferLen))); },
};

const _GasClaim: XdrCodec<GasClaim> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.sponsored_contract);
    proto.codec.GasAmount.encode(w, val.amount);
  },
  decode(r) {
    const sponsored_contract = proto.codec.ContractAddress.decode(r);
    const amount = proto.codec.GasAmount.decode(r);
    return { sponsored_contract, amount };
  },
};

const _Invocation: XdrCodec<Invocation> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.invoked_address);
    proto.codec.ContractEntrypointID.encode(w, val.entrypoint);
    proto.codec.GasAmount.encode(w, val.gas_limit);
    proto.codec.Calldata.encode(w, val.calldata);
  },
  decode(r) {
    const invoked_address = proto.codec.ContractAddress.decode(r);
    const entrypoint = proto.codec.ContractEntrypointID.decode(r);
    const gas_limit = proto.codec.GasAmount.decode(r);
    const calldata = proto.codec.Calldata.decode(r);
    return { invoked_address, entrypoint, gas_limit, calldata };
  },
};

const _InvocationFrameStatusCode: XdrCodec<InvocationFrameStatusCode> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as InvocationFrameStatusCode; },
};

const _InvocationFrameOutput: XdrCodec<InvocationFrameOutput> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.status_code));
    switch (val.status_code) {
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        proto.codec.ReturnBuffer.encode(w, val.return_buffer);
        break;
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        proto.codec.ReturnBuffer.encode(w, val.abort_buffer);
        break;
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        break;
    }
  },
  decode(r) {
    const status_code = Number(r.readInt32());
    switch (status_code) {
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        const return_buffer = proto.codec.ReturnBuffer.decode(r);
        return { status_code, return_buffer };
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        const abort_buffer = proto.codec.ReturnBuffer.decode(r);
        return { status_code, abort_buffer };
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        return { status_code } as InvocationFrameOutput;
      default:
        throw new Error(`Unknown InvocationFrameOutput discriminant: ${status_code}`);
    }
  },
};

const _InvokeFlag: XdrCodec<InvokeFlag> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as InvokeFlag; },
};

const _InvokeFlagSet: XdrCodec<InvokeFlagSet> = {
  encode(w, val) { w.writeInt32(val); },
  decode(r) { return invokeFlagSet(r.readInt32()); },
};

const _Uniquifier: XdrCodec<Uniquifier> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.block_expiry_height);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    const block_expiry_height = proto.codec.BlockHeight.decode(r);
    const nonce = r.readUint64();
    return { block_expiry_height, nonce };
  },
};

const _Transaction: XdrCodec<Transaction> = {
  encode(w, val) {
    proto.codec.Invocation.encode(w, val.invocation);
    proto.codec.Uniquifier.encode(w, val.uniquifier);
    w.writeUint32(BigInt(val.contracts_to_deploy.length));
    for (const _item of val.contracts_to_deploy) proto.codec.Contract.encode(w, _item);
    proto.codec.AuthClaimData.encode(w, val.auth_claims);
    w.writeUint32(BigInt(val.gas_claims.length));
    for (const _item of val.gas_claims) proto.codec.GasClaim.encode(w, _item);
  },
  decode(r) {
    const invocation = proto.codec.Invocation.decode(r);
    const uniquifier = proto.codec.Uniquifier.decode(r);
    const _contracts_to_deploy_len = Number(r.readUint32());
    const contracts_to_deploy = Array.from({ length: _contracts_to_deploy_len }, () => proto.codec.Contract.decode(r));
    const auth_claims = proto.codec.AuthClaimData.decode(r);
    const _gas_claims_len = Number(r.readUint32());
    const gas_claims = Array.from({ length: _gas_claims_len }, () => proto.codec.GasClaim.decode(r));
    return { invocation, uniquifier, contracts_to_deploy, auth_claims, gas_claims };
  },
};

const _DecoratedSignature: XdrCodec<DecoratedSignature> = {
  encode(w, val) {
    w.writeUint32(val.auth_claim_idx);
    w.writeUint32(val.public_key_id);
    proto.codec.Signature.encode(w, val.signature);
  },
  decode(r) {
    const auth_claim_idx = r.readUint32();
    const public_key_id = r.readUint32();
    const signature = proto.codec.Signature.decode(r);
    return { auth_claim_idx, public_key_id, signature };
  },
};

const _SignedTransactionHash: XdrCodec<SignedTransactionHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return signedTransactionHash(proto.codec.SHA256Hash.decode(r)); },
};

const _SignedTransaction: XdrCodec<SignedTransaction> = {
  encode(w, val) {
    proto.codec.Transaction.encode(w, val.tx);
    w.writeUint32(BigInt(val.signatures.length));
    for (const _item of val.signatures) proto.codec.DecoratedSignature.encode(w, _item);
  },
  decode(r) {
    const tx = proto.codec.Transaction.decode(r);
    const _signatures_len = Number(r.readUint32());
    const signatures = Array.from({ length: _signatures_len }, () => proto.codec.DecoratedSignature.decode(r));
    return { tx, signatures };
  },
};

const _TransactionBatch: XdrCodec<TransactionBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.Transaction.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return transactionBatch(Array.from({ length: _len }, () => proto.codec.Transaction.decode(r)));
  },
};

const _SignedTransactionBatch: XdrCodec<SignedTransactionBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.SignedTransaction.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return signedTransactionBatch(Array.from({ length: _len }, () => proto.codec.SignedTransaction.decode(r)));
  },
};

const _OptSignedTransaction: XdrCodec<OptSignedTransaction> = {
  encode(w, val) {
    if (val !== null) {
      w.writeUint32(1n);
      proto.codec.SignedTransaction.encode(w, val);
    } else {
      w.writeUint32(0n);
    }
  },
  decode(r) {
    return optSignedTransaction(Number(r.readUint32()) ? proto.codec.SignedTransaction.decode(r) : null);
  },
};

const _OptSignedTransactionBatch: XdrCodec<OptSignedTransactionBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.OptSignedTransaction.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return optSignedTransactionBatch(Array.from({ length: _len }, () => proto.codec.OptSignedTransaction.decode(r)));
  },
};

const _SignedTransactionHashBatch: XdrCodec<SignedTransactionHashBatch> = {
  encode(w, val) {
    w.writeUint32(BigInt(val.length));
    for (const _item of val) proto.codec.SignedTransactionHash.encode(w, _item);
  },
  decode(r) {
    const _len = Number(r.readUint32());
    return signedTransactionHashBatch(Array.from({ length: _len }, () => proto.codec.SignedTransactionHash.decode(r)));
  },
};

const _NondeterministicProposalData: XdrCodec<NondeterministicProposalData> = {
  encode(w, val) {
    w.writeVarOpaque(val.nondeterministic_bits, Number(0xFFFFFFFF));
    w.writeUint32(val.nondeterministic_bit_count);
    w.writeUint32(BigInt(val.observed_queue_entry_sequence.length));
    for (const _item of val.observed_queue_entry_sequence) proto.codec.QueueEntry.encode(w, _item);
  },
  decode(r) {
    const nondeterministic_bits = r.readVarOpaque(Number(0xFFFFFFFF));
    const nondeterministic_bit_count = r.readUint32();
    const _observed_queue_entry_sequence_len = Number(r.readUint32());
    const observed_queue_entry_sequence = Array.from({ length: _observed_queue_entry_sequence_len }, () => proto.codec.QueueEntry.decode(r));
    return { nondeterministic_bits, nondeterministic_bit_count, observed_queue_entry_sequence };
  },
};

const _ProposedTransaction: XdrCodec<ProposedTransaction> = {
  encode(w, val) {
    proto.codec.SignedTransaction.encode(w, val.signed_tx);
    proto.codec.NondeterministicProposalData.encode(w, val.nondeterministic_proposal_data);
  },
  decode(r) {
    const signed_tx = proto.codec.SignedTransaction.decode(r);
    const nondeterministic_proposal_data = proto.codec.NondeterministicProposalData.decode(r);
    return { signed_tx, nondeterministic_proposal_data };
  },
};

const _TransactionStatistic: XdrCodec<TransactionStatistic> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TransactionStatistic; },
};

export const codec = {
  Calldata: _Calldata,
  ReturnBuffer: _ReturnBuffer,
  GasClaim: _GasClaim,
  Invocation: _Invocation,
  InvocationFrameStatusCode: _InvocationFrameStatusCode,
  InvocationFrameOutput: _InvocationFrameOutput,
  InvokeFlag: _InvokeFlag,
  InvokeFlagSet: _InvokeFlagSet,
  Uniquifier: _Uniquifier,
  Transaction: _Transaction,
  DecoratedSignature: _DecoratedSignature,
  SignedTransactionHash: _SignedTransactionHash,
  SignedTransaction: _SignedTransaction,
  TransactionBatch: _TransactionBatch,
  SignedTransactionBatch: _SignedTransactionBatch,
  OptSignedTransaction: _OptSignedTransaction,
  OptSignedTransactionBatch: _OptSignedTransactionBatch,
  SignedTransactionHashBatch: _SignedTransactionHashBatch,
  NondeterministicProposalData: _NondeterministicProposalData,
  ProposedTransaction: _ProposedTransaction,
  TransactionStatistic: _TransactionStatistic,
} as const;

