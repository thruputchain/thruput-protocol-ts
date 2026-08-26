// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 5e4cd71af221d40113563e054719553ca351f0a9

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString } from "@groundhogchain/xdr";
import * as proto from "./index.js";



/** XDR: `typedef opaque Calldata<>`. */
export type Calldata = Uint8Array & { readonly __brand: { readonly Calldata: true } };
export function calldata(data: Uint8Array): Calldata {
  return data as Calldata;
}

export const kMaxReturnBufferLen = 1024n;
/**
 * Type-level value of {@link kMaxReturnBufferLen}, for use in array-bound positions.
 * @hidden
 */
export type kMaxReturnBufferLen = 1024;

/** XDR: `typedef opaque ReturnBuffer<kMaxReturnBufferLen>` — max {@link kMaxReturnBufferLen} bytes. */
export type ReturnBuffer = VarBytes<proto.kMaxReturnBufferLen> & { readonly __brand: { readonly ReturnBuffer: true } };
export function returnBuffer(data: Uint8Array): ReturnBuffer {
  if (data.length > Number(proto.kMaxReturnBufferLen)) throw new Error(`ReturnBuffer exceeds max length kMaxReturnBufferLen, got ${data.length}`);
  return data as ReturnBuffer;
}

export interface Invocation {
  invoked_address: proto.ContractAddress;
  entrypoint: proto.ContractEntrypointID;
  gas_limit: proto.GasAmount;
  calldata: proto.Calldata;
}

export enum InvocationFrameStatusCode {
  Return = 0,
  Fault = 1,
  Abort = 2,
}

export type InvocationFrameOutput =
  | { status_code: proto.InvocationFrameStatusCode.Return; return_buffer: proto.ReturnBuffer }
  | { status_code: proto.InvocationFrameStatusCode.Abort; abort_buffer: proto.ReturnBuffer }
  | { status_code: proto.InvocationFrameStatusCode.Fault }
;

export interface Uniquifier {
  block_expiry_height: proto.BlockHeight;
  nonce: bigint;
}

export interface Transaction {
  invocation: proto.Invocation;
  uniquifier: proto.Uniquifier;
  /** XDR: `Contract contracts_to_deploy<>`. */
  contracts_to_deploy: proto.Contract[];
  auth_claim: proto.AuthClaim;
}

export interface DecoratedSignature {
  public_key_id: bigint;
  signature: proto.Signature;
}

export type TransactionHash = (NonNullable<proto.SHA256Hash> & { readonly __brand: { readonly TransactionHash: true } }) | Extract<proto.SHA256Hash, null>;
export function transactionHash(val: proto.SHA256Hash): TransactionHash {
  return val as TransactionHash;
}

export interface SignedTransaction {
  tx: proto.Transaction;
  /** XDR: `DecoratedSignature signatures<>`. */
  signatures: proto.DecoratedSignature[];
}

/** XDR: `typedef Transaction TransactionBatch<>`. */
export type TransactionBatch = proto.Transaction[] & { readonly __brand: { readonly TransactionBatch: true } };
export function transactionBatch(val: proto.Transaction[]): TransactionBatch {
  return val as TransactionBatch;
}

/** XDR: `typedef SignedTransaction SignedTransactionBatch<>`. */
export type SignedTransactionBatch = proto.SignedTransaction[] & { readonly __brand: { readonly SignedTransactionBatch: true } };
export function signedTransactionBatch(val: proto.SignedTransaction[]): SignedTransactionBatch {
  return val as SignedTransactionBatch;
}

export type OptSignedTransaction = (proto.SignedTransaction & { readonly __brand: { readonly OptSignedTransaction: true } }) | null;
export function optSignedTransaction(val: proto.SignedTransaction | null): OptSignedTransaction {
  return val as OptSignedTransaction;
}

/** XDR: `typedef OptSignedTransaction OptSignedTransactionBatch<>`. */
export type OptSignedTransactionBatch = proto.OptSignedTransaction[] & { readonly __brand: { readonly OptSignedTransactionBatch: true } };
export function optSignedTransactionBatch(val: proto.OptSignedTransaction[]): OptSignedTransactionBatch {
  return val as OptSignedTransactionBatch;
}

/** XDR: `typedef TransactionHash TransactionHashBatch<>`. */
export type TransactionHashBatch = proto.TransactionHash[] & { readonly __brand: { readonly TransactionHashBatch: true } };
export function transactionHashBatch(val: proto.TransactionHash[]): TransactionHashBatch {
  return val as TransactionHashBatch;
}

export interface NondeterministicProposalData {
  /** XDR: `opaque nondeterministic_bits<>`. */
  nondeterministic_bits: Uint8Array;
  nondeterministic_bit_count: bigint;
  /** XDR: `QueueEntry observed_queue_entry_sequence<kMaxConcurrentRcqReadsPerTx>` — max {@link kMaxConcurrentRcqReadsPerTx} elements. */
  observed_queue_entry_sequence: VarArray<proto.QueueEntry, proto.kMaxConcurrentRcqReadsPerTx>;
}

export interface ProposedTransaction {
  signed_tx: proto.SignedTransaction;
  nondeterministic_proposal_data: proto.NondeterministicProposalData;
}

/** XDR: `typedef ProposedTransaction ProposedTransactionBatch<>`. */
export type ProposedTransactionBatch = proto.ProposedTransaction[] & { readonly __brand: { readonly ProposedTransactionBatch: true } };
export function proposedTransactionBatch(val: proto.ProposedTransaction[]): ProposedTransactionBatch {
  return val as ProposedTransactionBatch;
}

export enum TransactionStatistic {
  GasRemaining = 0,
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
      case proto.InvocationFrameStatusCode.Return:
        proto.codec.ReturnBuffer.encode(w, val.return_buffer);
        break;
      case proto.InvocationFrameStatusCode.Abort:
        proto.codec.ReturnBuffer.encode(w, val.abort_buffer);
        break;
      case proto.InvocationFrameStatusCode.Fault:
        break;
    }
  },
  decode(r) {
    const status_code = Number(r.readInt32());
    switch (status_code) {
      case proto.InvocationFrameStatusCode.Return:
        const return_buffer = proto.codec.ReturnBuffer.decode(r);
        return { status_code, return_buffer };
      case proto.InvocationFrameStatusCode.Abort:
        const abort_buffer = proto.codec.ReturnBuffer.decode(r);
        return { status_code, abort_buffer };
      case proto.InvocationFrameStatusCode.Fault:
        return { status_code } as InvocationFrameOutput;
      default:
        throw new Error(`Unknown InvocationFrameOutput discriminant: ${status_code}`);
    }
  },
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
    VarArrayCodec(proto.codec.Contract, Number(0xFFFFFFFF)).encode(w, val.contracts_to_deploy);
    proto.codec.AuthClaim.encode(w, val.auth_claim);
  },
  decode(r) {
    const invocation = proto.codec.Invocation.decode(r);
    const uniquifier = proto.codec.Uniquifier.decode(r);
    const contracts_to_deploy = VarArrayCodec(proto.codec.Contract, Number(0xFFFFFFFF)).decode(r);
    const auth_claim = proto.codec.AuthClaim.decode(r);
    return { invocation, uniquifier, contracts_to_deploy, auth_claim };
  },
};

const _DecoratedSignature: XdrCodec<DecoratedSignature> = {
  encode(w, val) {
    w.writeUint32(val.public_key_id);
    proto.codec.Signature.encode(w, val.signature);
  },
  decode(r) {
    const public_key_id = r.readUint32();
    const signature = proto.codec.Signature.decode(r);
    return { public_key_id, signature };
  },
};

const _TransactionHash: XdrCodec<TransactionHash> = {
  encode(w, val) { proto.codec.SHA256Hash.encode(w, val); },
  decode(r) { return transactionHash(proto.codec.SHA256Hash.decode(r)); },
};

const _SignedTransaction: XdrCodec<SignedTransaction> = {
  encode(w, val) {
    proto.codec.Transaction.encode(w, val.tx);
    VarArrayCodec(proto.codec.DecoratedSignature, Number(0xFFFFFFFF)).encode(w, val.signatures);
  },
  decode(r) {
    const tx = proto.codec.Transaction.decode(r);
    const signatures = VarArrayCodec(proto.codec.DecoratedSignature, Number(0xFFFFFFFF)).decode(r);
    return { tx, signatures };
  },
};

const _TransactionBatch = VarArrayCodec(() => proto.codec.Transaction, Number(0xFFFFFFFF)) as XdrCodec<TransactionBatch>;

const _SignedTransactionBatch = VarArrayCodec(() => proto.codec.SignedTransaction, Number(0xFFFFFFFF)) as XdrCodec<SignedTransactionBatch>;

const _OptSignedTransaction = OptionCodec(() => _SignedTransaction) as XdrCodec<OptSignedTransaction>;

const _OptSignedTransactionBatch = VarArrayCodec(() => proto.codec.OptSignedTransaction, Number(0xFFFFFFFF)) as XdrCodec<OptSignedTransactionBatch>;

const _TransactionHashBatch = VarArrayCodec(() => proto.codec.TransactionHash, Number(0xFFFFFFFF)) as XdrCodec<TransactionHashBatch>;

const _NondeterministicProposalData: XdrCodec<NondeterministicProposalData> = {
  encode(w, val) {
    w.writeVarOpaque(val.nondeterministic_bits, Number(0xFFFFFFFF));
    w.writeUint32(val.nondeterministic_bit_count);
    VarArrayCodec(proto.codec.QueueEntry, Number(proto.kMaxConcurrentRcqReadsPerTx)).encode(w, val.observed_queue_entry_sequence);
  },
  decode(r) {
    const nondeterministic_bits = r.readVarOpaque(Number(0xFFFFFFFF));
    const nondeterministic_bit_count = r.readUint32();
    const observed_queue_entry_sequence = VarArrayCodec(proto.codec.QueueEntry, Number(proto.kMaxConcurrentRcqReadsPerTx)).decode(r);
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

const _ProposedTransactionBatch = VarArrayCodec(() => proto.codec.ProposedTransaction, Number(0xFFFFFFFF)) as XdrCodec<ProposedTransactionBatch>;

const _TransactionStatistic: XdrCodec<TransactionStatistic> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TransactionStatistic; },
};

export const codec = {
  Calldata: _Calldata,
  ReturnBuffer: _ReturnBuffer,
  Invocation: _Invocation,
  InvocationFrameStatusCode: _InvocationFrameStatusCode,
  InvocationFrameOutput: _InvocationFrameOutput,
  Uniquifier: _Uniquifier,
  Transaction: _Transaction,
  DecoratedSignature: _DecoratedSignature,
  TransactionHash: _TransactionHash,
  SignedTransaction: _SignedTransaction,
  TransactionBatch: _TransactionBatch,
  SignedTransactionBatch: _SignedTransactionBatch,
  OptSignedTransaction: _OptSignedTransaction,
  OptSignedTransactionBatch: _OptSignedTransactionBatch,
  TransactionHashBatch: _TransactionHashBatch,
  NondeterministicProposalData: _NondeterministicProposalData,
  ProposedTransaction: _ProposedTransaction,
  ProposedTransactionBatch: _ProposedTransactionBatch,
  TransactionStatistic: _TransactionStatistic,
} as const;

