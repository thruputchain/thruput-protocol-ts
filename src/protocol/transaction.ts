// -*- TypeScript -*-
// Generated from transaction.x — DO NOT EDIT
import { type XdrCodec } from "../xdr/codec.js";
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

function varArray<T>(itemCodec: XdrCodec<T>, max: number = 0xFFFFFFFF): XdrCodec<T[]> {
  return {
    encode(w, val) {
      if (val.length > max) throw new Error(`array length ${val.length} exceeds max ${max}`);
      w.writeUint32(BigInt(val.length));
      for (const item of val) itemCodec.encode(w, item);
    },
    decode(r) {
      const len = Number(r.readUint32());
      if (len > max) throw new Error(`array length ${len} exceeds max ${max}`);
      const result: T[] = [];
      for (let i = 0; i < len; i++) result.push(itemCodec.decode(r));
      return result;
    },
  };
}

const _Calldata: XdrCodec<proto.Calldata> = {
  encode(w, val) { w.writeVarOpaque(val, 0xFFFFFFFF); },
  decode(r) { return proto.calldata(r.readVarOpaque(0xFFFFFFFF)); },
};

const _ReturnBuffer: XdrCodec<proto.ReturnBuffer> = {
  encode(w, val) { w.writeVarOpaque(val, 1024); },
  decode(r) { return proto.returnBuffer(r.readVarOpaque(1024)); },
};

const _GasClaim: XdrCodec<proto.GasClaim> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.sponsored_contract);
    w.writeUint64(val.amount);
  },
  decode(r) {
    return {
      sponsored_contract: proto.codec.ContractAddress.decode(r),
      amount: proto.gasAmount(r.readUint64()),
    };
  },
};

const _Invocation: XdrCodec<proto.Invocation> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.invoked_address);
    proto.codec.ContractEntrypointID.encode(w, val.entrypoint);
    w.writeUint64(val.gas_limit);
    _Calldata.encode(w, val.calldata);
  },
  decode(r) {
    return {
      invoked_address: proto.codec.ContractAddress.decode(r),
      entrypoint: proto.codec.ContractEntrypointID.decode(r),
      gas_limit: proto.gasAmount(r.readUint64()),
      calldata: _Calldata.decode(r),
    };
  },
};

const _Uniquifier: XdrCodec<proto.Uniquifier> = {
  encode(w, val) {
    w.writeInt64(val.block_expiry_height);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    return {
      block_expiry_height: proto.blockHeight(r.readInt64()),
      nonce: r.readUint64(),
    };
  },
};

const _DecoratedSignature: XdrCodec<proto.DecoratedSignature> = {
  encode(w, val) {
    w.writeUint32(val.auth_claim_idx);
    w.writeUint32(val.public_key_id);
    proto.codec.Signature.encode(w, val.signature);
  },
  decode(r) {
    return {
      auth_claim_idx: r.readUint32(),
      public_key_id: r.readUint32(),
      signature: proto.codec.Signature.decode(r),
    };
  },
};

const GasClaimArray = varArray(_GasClaim);
const DecoratedSignatureArray = varArray(_DecoratedSignature);

// ContractArray and QueueEntryArray reference proto.codec.* which is resolved
// lazily inside encode/decode — safe despite circular module deps.
const ContractArray: XdrCodec<proto.Contract[]> = {
  encode(w, val) { varArray(proto.codec.Contract).encode(w, val); },
  decode(r) { return varArray(proto.codec.Contract).decode(r); },
};

const _Transaction: XdrCodec<proto.Transaction> = {
  encode(w, val) {
    _Invocation.encode(w, val.invocation);
    _Uniquifier.encode(w, val.uniquifier);
    ContractArray.encode(w, val.contracts_to_deploy);
    proto.codec.AuthClaimData.encode(w, val.auth_claims);
    GasClaimArray.encode(w, val.gas_claims);
  },
  decode(r) {
    return {
      invocation: _Invocation.decode(r),
      uniquifier: _Uniquifier.decode(r),
      contracts_to_deploy: ContractArray.decode(r),
      auth_claims: proto.codec.AuthClaimData.decode(r),
      gas_claims: GasClaimArray.decode(r),
    };
  },
};

const _SignedTransaction: XdrCodec<proto.SignedTransaction> = {
  encode(w, val) {
    _Transaction.encode(w, val.tx);
    DecoratedSignatureArray.encode(w, val.signatures);
  },
  decode(r) {
    return {
      tx: _Transaction.decode(r),
      signatures: DecoratedSignatureArray.decode(r),
    };
  },
};

const _InvocationFrameOutput: XdrCodec<proto.InvocationFrameOutput> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.status_code));
    switch (val.status_code) {
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        _ReturnBuffer.encode(w, val.return_buffer);
        break;
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        _ReturnBuffer.encode(w, val.abort_buffer);
        break;
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        break;
    }
  },
  decode(r) {
    const status_code = Number(r.readInt32());
    switch (status_code) {
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        return { status_code, return_buffer: _ReturnBuffer.decode(r) };
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        return { status_code, abort_buffer: _ReturnBuffer.decode(r) };
      case proto.InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        return { status_code };
      default:
        throw new Error(`Unknown InvocationFrameStatusCode: ${status_code}`);
    }
  },
};

const QueueEntryArray: XdrCodec<proto.QueueEntry[]> = {
  encode(w, val) { varArray(proto.codec.QueueEntry).encode(w, val); },
  decode(r) { return varArray(proto.codec.QueueEntry).decode(r); },
};

const _NondeterministicProposalData: XdrCodec<proto.NondeterministicProposalData> = {
  encode(w, val) {
    w.writeVarOpaque(val.nondeterministic_bits, 0xFFFFFFFF);
    w.writeUint32(val.nondeterministic_bit_count);
    QueueEntryArray.encode(w, val.observed_queue_entry_sequence);
  },
  decode(r) {
    return {
      nondeterministic_bits: r.readVarOpaque(0xFFFFFFFF),
      nondeterministic_bit_count: r.readUint32(),
      observed_queue_entry_sequence: QueueEntryArray.decode(r),
    };
  },
};

const _ProposedTransaction: XdrCodec<proto.ProposedTransaction> = {
  encode(w, val) {
    _SignedTransaction.encode(w, val.signed_tx);
    _NondeterministicProposalData.encode(w, val.nondeterministic_proposal_data);
  },
  decode(r) {
    return {
      signed_tx: _SignedTransaction.decode(r),
      nondeterministic_proposal_data: _NondeterministicProposalData.decode(r),
    };
  },
};

export const codec = {
  Calldata: _Calldata,
  ReturnBuffer: _ReturnBuffer,
  GasClaim: _GasClaim,
  Invocation: _Invocation,
  Uniquifier: _Uniquifier,
  DecoratedSignature: _DecoratedSignature,
  Transaction: _Transaction,
  SignedTransaction: _SignedTransaction,
  InvocationFrameOutput: _InvocationFrameOutput,
  NondeterministicProposalData: _NondeterministicProposalData,
  ProposedTransaction: _ProposedTransaction,
} as const;
