// -*- TypeScript -*-
// Generated from transaction.x — DO NOT EDIT
import { type XdrCodec, type IWriter, type IReader } from "../xdr/codec.js";
import * as proto from "./index.js";

// ============================================================================
// Branded types
// ============================================================================

export type Calldata = Uint8Array & { readonly __brand: "Calldata" };
export function calldata(data: Uint8Array): Calldata {
  return data as Calldata;
}

export const kMaxReturnBufferLen = 1024n;

export type ReturnBuffer = Uint8Array & { readonly __brand: "ReturnBuffer" };
export function returnBuffer(data: Uint8Array): ReturnBuffer {
  if (data.length > Number(kMaxReturnBufferLen)) {
    throw new Error(`ReturnBuffer exceeds max length ${kMaxReturnBufferLen}, got ${data.length}`);
  }
  return data as ReturnBuffer;
}

export type InvokeFlagSet = bigint & { readonly __brand: "InvokeFlagSet" };
export function invokeFlagSet(val: bigint): InvokeFlagSet { return val as InvokeFlagSet; }

export type SignedTransactionHash = proto.SHA256Hash;

// ============================================================================
// Enums
// ============================================================================

export enum InvocationFrameStatusCode {
  kInvocationFrameStatusCodeReturn = 0,
  kInvocationFrameStatusCodeFault = 1,
  kInvocationFrameStatusCodeAbort = 2,
}

export enum InvokeFlag {
  kInvokeFlagNone = 0,
  kInvokeFlagTryInvoke = 0x00000001,
  kInvokeFlagReadOnly = 0x00000002,
  kInvokeFlagDelegateCall = 0x00000004,
}

export enum TransactionStatistic {
  kTxStatGasRemaining = 0,
}

// ============================================================================
// Structs
// ============================================================================

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

export interface SignedTransaction {
  tx: proto.Transaction;
  signatures: proto.DecoratedSignature[];
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

// ============================================================================
// Unions
// ============================================================================

export type InvocationFrameOutput =
  | { status_code: proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn; return_buffer: proto.ReturnBuffer }
  | { status_code: proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort; abort_buffer: proto.ReturnBuffer }
  | { status_code: proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault }
;

// ============================================================================
// Batch typedefs
// ============================================================================

export type TransactionBatch = proto.Transaction[];
export type SignedTransactionBatch = proto.SignedTransaction[];
export type SignedTransactionHashBatch = proto.SignedTransactionHash[];
export type OptSignedTransaction = proto.SignedTransaction | null;
export type OptSignedTransactionBatch = proto.OptSignedTransaction[];

// ============================================================================
// XDR Codecs
// ============================================================================

export const Calldata: XdrCodec<proto.Calldata> = {
  encode(w: IWriter, val: proto.Calldata) { w.writeVarOpaque(val, 0xFFFFFFFF); },
  decode(r: IReader) { return proto.calldata(r.readVarOpaque(0xFFFFFFFF)); },
};

export const ReturnBuffer: XdrCodec<proto.ReturnBuffer> = {
  encode(w: IWriter, val: proto.ReturnBuffer) { w.writeVarOpaque(val, 1024); },
  decode(r: IReader) { return proto.returnBuffer(r.readVarOpaque(1024)); },
};

function varArray<T>(codec: XdrCodec<T>, max: number = 0xFFFFFFFF): XdrCodec<T[]> {
  return {
    encode(w: IWriter, val: T[]) {
      if (val.length > max) throw new Error(`array length ${val.length} exceeds max ${max}`);
      w.writeUint32(BigInt(val.length));
      for (const item of val) codec.encode(w, item);
    },
    decode(r: IReader) {
      const len = Number(r.readUint32());
      if (len > max) throw new Error(`array length ${len} exceeds max ${max}`);
      const result: T[] = [];
      for (let i = 0; i < len; i++) result.push(codec.decode(r));
      return result;
    },
  };
}

export const GasClaim: XdrCodec<proto.GasClaim> = {
  encode(w: IWriter, val: proto.GasClaim) {
    proto.ContractAddress.encode(w, val.sponsored_contract);
    w.writeUint64(val.amount);
  },
  decode(r: IReader) {
    return {
      sponsored_contract: proto.ContractAddress.decode(r),
      amount: proto.gasAmount(r.readUint64()),
    };
  },
};

export const Invocation: XdrCodec<proto.Invocation> = {
  encode(w: IWriter, val: proto.Invocation) {
    proto.ContractAddress.encode(w, val.invoked_address);
    proto.ContractEntrypointID.encode(w, val.entrypoint);
    w.writeUint64(val.gas_limit);
    proto.Calldata.encode(w, val.calldata);
  },
  decode(r: IReader) {
    return {
      invoked_address: proto.ContractAddress.decode(r),
      entrypoint: proto.ContractEntrypointID.decode(r),
      gas_limit: proto.gasAmount(r.readUint64()),
      calldata: proto.Calldata.decode(r),
    };
  },
};

export const Uniquifier: XdrCodec<proto.Uniquifier> = {
  encode(w: IWriter, val: proto.Uniquifier) {
    w.writeInt64(val.block_expiry_height);
    w.writeUint64(val.nonce);
  },
  decode(r: IReader) {
    return {
      block_expiry_height: proto.blockHeight(r.readInt64()),
      nonce: r.readUint64(),
    };
  },
};

export const DecoratedSignature: XdrCodec<proto.DecoratedSignature> = {
  encode(w: IWriter, val: proto.DecoratedSignature) {
    w.writeUint32(val.auth_claim_idx);
    w.writeUint32(val.public_key_id);
    proto.Signature.encode(w, val.signature);
  },
  decode(r: IReader) {
    return {
      auth_claim_idx: r.readUint32(),
      public_key_id: r.readUint32(),
      signature: proto.Signature.decode(r),
    };
  },
};

const ContractArray = varArray(proto.Contract);
const GasClaimArray = varArray(GasClaim);
const DecoratedSignatureArray = varArray(DecoratedSignature);

export const Transaction: XdrCodec<proto.Transaction> = {
  encode(w: IWriter, val: proto.Transaction) {
    proto.Invocation.encode(w, val.invocation);
    proto.Uniquifier.encode(w, val.uniquifier);
    ContractArray.encode(w, val.contracts_to_deploy);
    proto.AuthClaimData.encode(w, val.auth_claims);
    GasClaimArray.encode(w, val.gas_claims);
  },
  decode(r: IReader) {
    return {
      invocation: proto.Invocation.decode(r),
      uniquifier: proto.Uniquifier.decode(r),
      contracts_to_deploy: ContractArray.decode(r),
      auth_claims: proto.AuthClaimData.decode(r),
      gas_claims: GasClaimArray.decode(r),
    };
  },
};

export const SignedTransaction: XdrCodec<proto.SignedTransaction> = {
  encode(w: IWriter, val: proto.SignedTransaction) {
    proto.Transaction.encode(w, val.tx);
    DecoratedSignatureArray.encode(w, val.signatures);
  },
  decode(r: IReader) {
    return {
      tx: proto.Transaction.decode(r),
      signatures: DecoratedSignatureArray.decode(r),
    };
  },
};

export const InvocationFrameOutput: XdrCodec<proto.InvocationFrameOutput> = {
  encode(w: IWriter, val: proto.InvocationFrameOutput) {
    w.writeInt32(BigInt(val.status_code));
    switch (val.status_code) {
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        proto.ReturnBuffer.encode(w, val.return_buffer);
        break;
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        proto.ReturnBuffer.encode(w, val.abort_buffer);
        break;
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        break;
    }
  },
  decode(r: IReader) {
    const status_code = Number(r.readInt32());
    switch (status_code) {
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        return { status_code, return_buffer: proto.ReturnBuffer.decode(r) };
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        return { status_code, abort_buffer: proto.ReturnBuffer.decode(r) };
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        return { status_code };
      default:
        throw new Error(`Unknown InvocationFrameStatusCode: ${status_code}`);
    }
  },
};

const QueueEntryCodec: XdrCodec<proto.QueueEntry> = {
  encode(w: IWriter, val: proto.QueueEntry) { w.writeVarOpaque(val, 256); },
  decode(r: IReader) { return proto.queueEntry(r.readVarOpaque(256)); },
};
const QueueEntryArray = varArray(QueueEntryCodec);

export const NondeterministicProposalData: XdrCodec<proto.NondeterministicProposalData> = {
  encode(w: IWriter, val: proto.NondeterministicProposalData) {
    w.writeVarOpaque(val.nondeterministic_bits, 0xFFFFFFFF);
    w.writeUint32(val.nondeterministic_bit_count);
    QueueEntryArray.encode(w, val.observed_queue_entry_sequence);
  },
  decode(r: IReader) {
    return {
      nondeterministic_bits: r.readVarOpaque(0xFFFFFFFF),
      nondeterministic_bit_count: r.readUint32(),
      observed_queue_entry_sequence: QueueEntryArray.decode(r),
    };
  },
};

export const ProposedTransaction: XdrCodec<proto.ProposedTransaction> = {
  encode(w: IWriter, val: proto.ProposedTransaction) {
    proto.SignedTransaction.encode(w, val.signed_tx);
    proto.NondeterministicProposalData.encode(w, val.nondeterministic_proposal_data);
  },
  decode(r: IReader) {
    return {
      signed_tx: proto.SignedTransaction.decode(r),
      nondeterministic_proposal_data: proto.NondeterministicProposalData.decode(r),
    };
  },
};
