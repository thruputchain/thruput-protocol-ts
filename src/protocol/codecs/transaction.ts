import type { XdrCodec } from "../../xdr/codec.js";
import { InvocationFrameStatusCode } from "../transaction.js";
import { calldata, returnBuffer } from "../transaction.js";
import { queueEntry } from "../retrocausal_queue.js";
import type {
  Calldata as CalldataType,
  ReturnBuffer as ReturnBufferType,
  GasClaim as GasClaimType,
  Invocation as InvocationType,
  Uniquifier as UniquifierType,
  Transaction as TransactionType,
  DecoratedSignature as DecoratedSignatureType,
  SignedTransaction as SignedTransactionType,
  InvocationFrameOutput as InvocationFrameOutputType,
  NondeterministicProposalData as NondeterministicProposalDataType,
  ProposedTransaction as ProposedTransactionType,
} from "../transaction.js";
import { gasAmount, blockHeight } from "../types.js";
import type { QueueEntry } from "../retrocausal_queue.js";
import * as typesCodecs from "./types.js";
import * as contractCodecs from "./contract.js";
import * as authCodecs from "./auth_claim.js";

export const Calldata: XdrCodec<CalldataType> = {
  encode(w, val) { w.writeVarOpaque(val, 0xFFFFFFFF); },
  decode(r) { return calldata(r.readVarOpaque(0xFFFFFFFF)); },
};

export const ReturnBuffer: XdrCodec<ReturnBufferType> = {
  encode(w, val) { w.writeVarOpaque(val, 1024); },
  decode(r) { return returnBuffer(r.readVarOpaque(1024)); },
};

export const GasClaim: XdrCodec<GasClaimType> = {
  encode(w, val) {
    typesCodecs.ContractAddress.encode(w, val.sponsored_contract);
    w.writeUint64(val.amount);
  },
  decode(r) {
    return {
      sponsored_contract: typesCodecs.ContractAddress.decode(r),
      amount: gasAmount(r.readUint64()),
    };
  },
};

export const Invocation: XdrCodec<InvocationType> = {
  encode(w, val) {
    typesCodecs.ContractAddress.encode(w, val.invoked_address);
    contractCodecs.ContractEntrypointID.encode(w, val.entrypoint);
    w.writeUint64(val.gas_limit);
    Calldata.encode(w, val.calldata);
  },
  decode(r) {
    return {
      invoked_address: typesCodecs.ContractAddress.decode(r),
      entrypoint: contractCodecs.ContractEntrypointID.decode(r),
      gas_limit: gasAmount(r.readUint64()),
      calldata: Calldata.decode(r),
    };
  },
};

export const Uniquifier: XdrCodec<UniquifierType> = {
  encode(w, val) {
    w.writeInt64(val.block_expiry_height);
    w.writeUint64(val.nonce);
  },
  decode(r) {
    return {
      block_expiry_height: blockHeight(r.readInt64()),
      nonce: r.readUint64(),
    };
  },
};

export const DecoratedSignature: XdrCodec<DecoratedSignatureType> = {
  encode(w, val) {
    w.writeUint32(val.auth_claim_idx);
    w.writeUint32(val.public_key_id);
    typesCodecs.Signature.encode(w, val.signature);
  },
  decode(r) {
    return {
      auth_claim_idx: r.readUint32(),
      public_key_id: r.readUint32(),
      signature: typesCodecs.Signature.decode(r),
    };
  },
};

function varArray<T>(codec: XdrCodec<T>, max: number = 0xFFFFFFFF): XdrCodec<T[]> {
  return {
    encode(w, val) {
      if (val.length > max) throw new Error(`array length ${val.length} exceeds max ${max}`);
      w.writeUint32(BigInt(val.length));
      for (const item of val) codec.encode(w, item);
    },
    decode(r) {
      const len = Number(r.readUint32());
      if (len > max) throw new Error(`array length ${len} exceeds max ${max}`);
      const result: T[] = [];
      for (let i = 0; i < len; i++) result.push(codec.decode(r));
      return result;
    },
  };
}

const ContractArray = varArray(contractCodecs.Contract);
const GasClaimArray = varArray(GasClaim);
const DecoratedSignatureArray = varArray(DecoratedSignature);

export const Transaction: XdrCodec<TransactionType> = {
  encode(w, val) {
    Invocation.encode(w, val.invocation);
    Uniquifier.encode(w, val.uniquifier);
    ContractArray.encode(w, val.contracts_to_deploy);
    authCodecs.AuthClaimData.encode(w, val.auth_claims);
    GasClaimArray.encode(w, val.gas_claims);
  },
  decode(r) {
    return {
      invocation: Invocation.decode(r),
      uniquifier: Uniquifier.decode(r),
      contracts_to_deploy: ContractArray.decode(r),
      auth_claims: authCodecs.AuthClaimData.decode(r),
      gas_claims: GasClaimArray.decode(r),
    };
  },
};

export const SignedTransaction: XdrCodec<SignedTransactionType> = {
  encode(w, val) {
    Transaction.encode(w, val.tx);
    DecoratedSignatureArray.encode(w, val.signatures);
  },
  decode(r) {
    return {
      tx: Transaction.decode(r),
      signatures: DecoratedSignatureArray.decode(r),
    };
  },
};

export const InvocationFrameOutput: XdrCodec<InvocationFrameOutputType> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.status_code));
    switch (val.status_code) {
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        ReturnBuffer.encode(w, val.return_buffer);
        break;
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        ReturnBuffer.encode(w, val.abort_buffer);
        break;
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        break;
    }
  },
  decode(r) {
    const status_code = Number(r.readInt32());
    switch (status_code) {
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeReturn:
        return { status_code, return_buffer: ReturnBuffer.decode(r) };
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeAbort:
        return { status_code, abort_buffer: ReturnBuffer.decode(r) };
      case InvocationFrameStatusCode.kInvocationFrameStatusCodeFault:
        return { status_code };
      default:
        throw new Error(`Unknown InvocationFrameStatusCode: ${status_code}`);
    }
  },
};

const QueueEntryArray = varArray<QueueEntry>({
  encode(w, val) { w.writeVarOpaque(val, 256); },
  decode(r) { return queueEntry(r.readVarOpaque(256)); },
});

export const NondeterministicProposalData: XdrCodec<NondeterministicProposalDataType> = {
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

export const ProposedTransaction: XdrCodec<ProposedTransactionType> = {
  encode(w, val) {
    SignedTransaction.encode(w, val.signed_tx);
    NondeterministicProposalData.encode(w, val.nondeterministic_proposal_data);
  },
  decode(r) {
    return {
      signed_tx: SignedTransaction.decode(r),
      nondeterministic_proposal_data: NondeterministicProposalData.decode(r),
    };
  },
};
