// transaction.ts — from transaction.x

import type { ContractAddress, GasAmount, BlockHeight, SHA256Hash, Signature } from "./types.js";
import type { ContractEntrypointID, Contract } from "./contract.js";
import type { AuthClaimData } from "./auth_claim.js";
import type { QueueEntry } from "./retrocausal_queue.js";

// ============================================================================
// Branded types
// ============================================================================

export type Calldata = Uint8Array & { readonly __brand: "Calldata" };
export function calldata(data: Uint8Array): Calldata {
  // Calldata is typedef opaque Calldata<> — unbounded
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

export type SignedTransactionHash = SHA256Hash;

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
  sponsored_contract: ContractAddress;
  amount: GasAmount;
}

export interface Invocation {
  invoked_address: ContractAddress;
  entrypoint: ContractEntrypointID;
  gas_limit: GasAmount;
  calldata: Calldata;
}

export interface Uniquifier {
  block_expiry_height: BlockHeight;
  nonce: bigint;
}

export interface Transaction {
  invocation: Invocation;
  uniquifier: Uniquifier;
  contracts_to_deploy: Contract[];
  auth_claims: AuthClaimData;
  gas_claims: GasClaim[];
}

export interface DecoratedSignature {
  auth_claim_idx: bigint;
  public_key_id: bigint;
  signature: Signature;
}

export interface SignedTransaction {
  tx: Transaction;
  signatures: DecoratedSignature[];
}

export interface NondeterministicProposalData {
  nondeterministic_bits: Uint8Array;
  nondeterministic_bit_count: bigint;
  observed_queue_entry_sequence: QueueEntry[];
}

export interface ProposedTransaction {
  signed_tx: SignedTransaction;
  nondeterministic_proposal_data: NondeterministicProposalData;
}

// ============================================================================
// Unions
// ============================================================================

export type InvocationFrameOutput =
  | { status_code: InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn; return_buffer: ReturnBuffer }
  | { status_code: InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort; abort_buffer: ReturnBuffer }
  | { status_code: InvocationFrameStatusCode.kInvocationFrameStatusCodeFault };

// ============================================================================
// Batch typedefs
// ============================================================================

export type TransactionBatch = Transaction[];
export type SignedTransactionBatch = SignedTransaction[];
export type SignedTransactionHashBatch = SignedTransactionHash[];
export type OptSignedTransaction = SignedTransaction | null;
export type OptSignedTransactionBatch = OptSignedTransaction[];
