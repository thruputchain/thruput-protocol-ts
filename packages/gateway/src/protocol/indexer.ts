// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: 4eba524354bda9d7db1efa2845da43ce40dd1ab9

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type FixedBytes, type FixedArray, type VarBytes, type VarArray, type VarString, type RpcProgramMeta } from "@thruputchain/xdr";
import * as proto from "./index.js";



export interface TxInfo {
  height: proto.BlockHeight;
  tx: proto.ProposedTransaction;
  events: proto.TxEventLog;
}

export enum TxInfoOutcome {
  TxInfoFound = 0,
  TxInfoNotFound = 1,
  TxInfoRecentFailure = 2,
}

export type TxInfoResult =
  | { outcome: proto.TxInfoOutcome.TxInfoFound; info: proto.TxInfo }
  | { outcome: proto.TxInfoOutcome.TxInfoRecentFailure; recent_failure: proto.TxFailureDiagnostic }
  | { outcome: number }
;

export enum BlockLookupOutcome {
  BlockFound = 0,
  BlockNotFound = 1,
}

export type BlockLookupResult =
  | { outcome: proto.BlockLookupOutcome.BlockFound; value: proto.ConsensusValue }
  | { outcome: number }
;

/** XDR: `typedef IdentifiedEvent IdentifiedEventBatch<>`. */
export type IdentifiedEventBatch = proto.IdentifiedEvent[] & { readonly __brand: { readonly IdentifiedEventBatch: true } };
export function identifiedEventBatch(val: proto.IdentifiedEvent[]): IdentifiedEventBatch {
  return val as IdentifiedEventBatch;
}

/** XDR: `typedef TxInfo TxInfoBatch<>`. */
export type TxInfoBatch = proto.TxInfo[] & { readonly __brand: { readonly TxInfoBatch: true } };
export function txInfoBatch(val: proto.TxInfo[]): TxInfoBatch {
  return val as TxInfoBatch;
}

export const kMaxContractAddressesPerEventFilter = 5n;
/**
 * Type-level value of {@link kMaxContractAddressesPerEventFilter}, for use in array-bound positions.
 * @hidden
 */
export type kMaxContractAddressesPerEventFilter = 5;

export const kMaxEventFiltersPerQuery = 5n;
/**
 * Type-level value of {@link kMaxEventFiltersPerQuery}, for use in array-bound positions.
 * @hidden
 */
export type kMaxEventFiltersPerQuery = 5;

/** XDR: `typedef ContractAddress ContractAddressList<kMaxContractAddressesPerEventFilter>` — max {@link kMaxContractAddressesPerEventFilter} elements. */
export type ContractAddressList = VarArray<proto.ContractAddress, proto.kMaxContractAddressesPerEventFilter> & { readonly __brand: { readonly ContractAddressList: true } };
export function contractAddressList(val: proto.ContractAddress[]): ContractAddressList {
  if (val.length > Number(proto.kMaxContractAddressesPerEventFilter)) throw new Error(`ContractAddressList exceeds max length kMaxContractAddressesPerEventFilter, got ${val.length}`);
  return val as ContractAddressList;
}

export interface EventTopicFilter {
  /** XDR: `Topic topic0<>`. */
  topic0: proto.Topic[];
  /** XDR: `Topic topic1<>`. */
  topic1: proto.Topic[];
  /** XDR: `Topic topic2<>`. */
  topic2: proto.Topic[];
}

export interface EventFilter {
  contract_addresses: proto.ContractAddressList;
  topics: proto.EventTopicFilter;
}

/** XDR: `typedef EventFilter EventFilterList<kMaxEventFiltersPerQuery>` — max {@link kMaxEventFiltersPerQuery} elements. */
export type EventFilterList = VarArray<proto.EventFilter, proto.kMaxEventFiltersPerQuery> & { readonly __brand: { readonly EventFilterList: true } };
export function eventFilterList(val: proto.EventFilter[]): EventFilterList {
  if (val.length > Number(proto.kMaxEventFiltersPerQuery)) throw new Error(`EventFilterList exceeds max length kMaxEventFiltersPerQuery, got ${val.length}`);
  return val as EventFilterList;
}

export interface EventQuery {
  filters: proto.EventFilterList;
  order: proto.IterationOrder;
  anchor: proto.BlockAnchor;
  cursor: proto.PaginationCursor;
  limit: bigint;
}

export interface EventPage {
  events: proto.IdentifiedEventBatch;
  cursor: proto.PaginationCursor;
  latest_block: proto.BlockHeight;
  oldest_block: proto.BlockHeight;
}

export interface TransactionQuery {
  order: proto.IterationOrder;
  anchor: proto.BlockAnchor;
  cursor: proto.PaginationCursor;
  limit: bigint;
}

export interface TransactionPage {
  transactions: proto.TxInfoBatch;
  cursor: proto.PaginationCursor;
  latest_block: proto.BlockHeight;
  oldest_block: proto.BlockHeight;
}

export interface TransactionRef {
  tx_hash: proto.TransactionHash;
  height: proto.BlockHeight;
}

/** XDR: `typedef TransactionRef TransactionRefBatch<>`. */
export type TransactionRefBatch = proto.TransactionRef[] & { readonly __brand: { readonly TransactionRefBatch: true } };
export function transactionRefBatch(val: proto.TransactionRef[]): TransactionRefBatch {
  return val as TransactionRefBatch;
}

export interface AddressTransactionQuery {
  address: proto.ContractAddress;
  order: proto.IterationOrder;
  anchor: proto.BlockAnchor;
  cursor: proto.PaginationCursor;
  limit: bigint;
}

export interface BlockTransactionQuery {
  height: proto.BlockHeight;
  order: proto.IterationOrder;
  cursor: proto.PaginationCursor;
  limit: bigint;
}

export interface TransactionRefPage {
  refs: proto.TransactionRefBatch;
  cursor: proto.PaginationCursor;
  latest_block: proto.BlockHeight;
  oldest_block: proto.BlockHeight;
}

export enum IndexerQueryOutcome {
  IndexerQueryOk = 0,
  IndexerQueryNotReady = 1,
  IndexerQueryInternalFailure = 2,
}

export type EventPageResult =
  | { outcome: proto.IndexerQueryOutcome.IndexerQueryOk; page: proto.EventPage }
  | { outcome: number }
;

export type TransactionPageResult =
  | { outcome: proto.IndexerQueryOutcome.IndexerQueryOk; page: proto.TransactionPage }
  | { outcome: number }
;

export type TransactionRefPageResult =
  | { outcome: proto.IndexerQueryOutcome.IndexerQueryOk; page: proto.TransactionRefPage }
  | { outcome: number }
;

export enum IndexerBlockExplorerIntroOutcome {
  IntroSuccess = 0,
  IntroMismatchedProtocol = 1,
}


/** XDR: `typedef TxEventLog TxEventLogBatch<>`. */
export type TxEventLogBatch = proto.TxEventLog[] & { readonly __brand: { readonly TxEventLogBatch: true } };
export function txEventLogBatch(val: proto.TxEventLog[]): TxEventLogBatch {
  return val as TxEventLogBatch;
}

export interface IndexerOutboxOrigin {
  protocol: proto.ProtocolCommit;
  epoch_sequence: bigint;
  first_height: proto.BlockHeight;
  first_prev_hash: proto.ConsensusValueHash;
}

export interface IndexerCommittedBlockPayload {
  format_version: bigint;
  consensus_value: proto.ConsensusValue;
  event_logs: proto.TxEventLogBatch;
  tx_bodies: proto.ProposedTransactionBatch;
}

export interface IndexerCommittedBlockIdentity {
  consensus_hash: proto.ConsensusValueHash;
}

export interface IndexerCommittedBlock {
  payload: proto.IndexerCommittedBlockPayload;
  identity: proto.IndexerCommittedBlockIdentity;
}

export interface IndexerInitializedProgress {
  origin: proto.IndexerOutboxOrigin;
  contiguous_height: proto.BlockHeight;
  last_consensus_hash: proto.ConsensusValueHash;
}

export enum IndexerProgressState {
  IndexerProgressUninitialized = 0,
  IndexerProgressInitialized = 1,
  IndexerProgressCaughtUp = 2,
}

export type IndexerProgress =
  | { state: proto.IndexerProgressState.IndexerProgressInitialized; initialized: proto.IndexerInitializedProgress }
  | { state: proto.IndexerProgressState.IndexerProgressCaughtUp; initialized: proto.IndexerInitializedProgress }
  | { state: number }
;

/** XDR: `typedef string IndexerFailureMessage<1024>` — max 1024 bytes. */
export type IndexerFailureMessage = VarString<1024> & { readonly __brand: { readonly IndexerFailureMessage: true } };
export function indexerFailureMessage(val: string): IndexerFailureMessage {
  return val as IndexerFailureMessage;
}

export enum IndexerEpochOutcome {
  IndexerEpochInitialized = 0,
  IndexerEpochUnchanged = 1,
  IndexerEpochConflict = 2,
  IndexerEpochInternalFailure = 3,
}

export type IndexerEpochResult =
  | { outcome: proto.IndexerEpochOutcome.IndexerEpochInitialized; progress: proto.IndexerInitializedProgress }
  | { outcome: proto.IndexerEpochOutcome.IndexerEpochUnchanged; progress: proto.IndexerInitializedProgress }
  | { outcome: number; diagnostic: proto.IndexerFailureMessage }
;

export interface IndexerHeightGap {
  expected_height: proto.BlockHeight;
}

export enum IndexerBlockApplyOutcome {
  IndexerBlockApplied = 0,
  IndexerBlockDuplicate = 1,
  IndexerBlockGap = 2,
  IndexerBlockOriginMismatch = 3,
  IndexerBlockContentConflict = 4,
  IndexerBlockInternalFailure = 5,
}

export type IndexerBlockApplyResult =
  | { outcome: proto.IndexerBlockApplyOutcome.IndexerBlockApplied; progress: proto.IndexerInitializedProgress }
  | { outcome: proto.IndexerBlockApplyOutcome.IndexerBlockDuplicate; progress: proto.IndexerInitializedProgress }
  | { outcome: proto.IndexerBlockApplyOutcome.IndexerBlockGap; gap: proto.IndexerHeightGap }
  | { outcome: number; diagnostic: proto.IndexerFailureMessage }
;

export interface EventIndexerPullRequest {
  protocol: proto.ProtocolCommit;
  progress: proto.IndexerProgress;
}

export interface EventIndexerPulledBlock {
  origin: proto.IndexerOutboxOrigin;
  block: proto.IndexerCommittedBlock;
}

export enum EventIndexerPullOutcome {
  EventIndexerPullBlock = 0,
  EventIndexerPullCaughtUp = 1,
  EventIndexerPullNotReady = 2,
  EventIndexerPullMismatchedProtocol = 3,
  EventIndexerPullProgressConflict = 4,
  EventIndexerPullInternalFailure = 5,
}

export type EventIndexerPullResult =
  | { outcome: proto.EventIndexerPullOutcome.EventIndexerPullBlock; pulled_block: proto.EventIndexerPulledBlock }
  | { outcome: proto.EventIndexerPullOutcome.EventIndexerPullCaughtUp; origin: proto.IndexerOutboxOrigin }
  | { outcome: number; diagnostic: proto.IndexerFailureMessage }
;

export interface IndexerTxFailureNotice {
  tx_hash: proto.TransactionHash;
  diagnostic: proto.TxFailureDiagnostic;
}

/** XDR: `typedef IndexerTxFailureNotice IndexerTxFailureNoticeBatch<256>` — max 256 elements. */
export type IndexerTxFailureNoticeBatch = VarArray<proto.IndexerTxFailureNotice, 256> & { readonly __brand: { readonly IndexerTxFailureNoticeBatch: true } };
export function indexerTxFailureNoticeBatch(val: proto.IndexerTxFailureNotice[]): IndexerTxFailureNoticeBatch {
  if (val.length > 256) throw new Error(`IndexerTxFailureNoticeBatch exceeds max length 256, got ${val.length}`);
  return val as IndexerTxFailureNoticeBatch;
}



//
// XDR Codecs below this point
//

const _TxInfo: XdrCodec<TxInfo> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.height);
    proto.codec.ProposedTransaction.encode(w, val.tx);
    proto.codec.TxEventLog.encode(w, val.events);
  },
  decode(r) {
    const height = proto.codec.BlockHeight.decode(r);
    const tx = proto.codec.ProposedTransaction.decode(r);
    const events = proto.codec.TxEventLog.decode(r);
    return { height, tx, events };
  },
};

const _TxInfoOutcome: XdrCodec<TxInfoOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as TxInfoOutcome; },
};

const _TxInfoResult: XdrCodec<TxInfoResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.TxInfoOutcome.TxInfoFound:
      {
        const v = val as { outcome: number; info: proto.TxInfo };
        if (v.info === undefined) {
          throw new Error("TxInfoResult encode: info is undefined");
        }
        proto.codec.TxInfo.encode(w, v.info);
        break;
      }
      case proto.TxInfoOutcome.TxInfoRecentFailure:
      {
        const v = val as { outcome: number; recent_failure: proto.TxFailureDiagnostic };
        if (v.recent_failure === undefined) {
          throw new Error("TxInfoResult encode: recent_failure is undefined");
        }
        proto.codec.TxFailureDiagnostic.encode(w, v.recent_failure);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.TxInfoOutcome.TxInfoFound:
        const info = proto.codec.TxInfo.decode(r);
        return { outcome, info };
      case proto.TxInfoOutcome.TxInfoRecentFailure:
        const recent_failure = proto.codec.TxFailureDiagnostic.decode(r);
        return { outcome, recent_failure };
      default:
        return { outcome };
    }
  },
};

const _BlockLookupOutcome: XdrCodec<BlockLookupOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as BlockLookupOutcome; },
};

const _BlockLookupResult: XdrCodec<BlockLookupResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.BlockLookupOutcome.BlockFound:
      {
        const v = val as { outcome: number; value: proto.ConsensusValue };
        if (v.value === undefined) {
          throw new Error("BlockLookupResult encode: value is undefined");
        }
        proto.codec.ConsensusValue.encode(w, v.value);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.BlockLookupOutcome.BlockFound:
        const value = proto.codec.ConsensusValue.decode(r);
        return { outcome, value };
      default:
        return { outcome };
    }
  },
};

const _IdentifiedEventBatch = VarArrayCodec(() => proto.codec.IdentifiedEvent, Number(0xFFFFFFFF)) as XdrCodec<IdentifiedEventBatch>;

const _TxInfoBatch = VarArrayCodec(() => proto.codec.TxInfo, Number(0xFFFFFFFF)) as XdrCodec<TxInfoBatch>;

const _ContractAddressList = VarArrayCodec(() => proto.codec.ContractAddress, Number(proto.kMaxContractAddressesPerEventFilter)) as XdrCodec<ContractAddressList>;

const _EventTopicFilter: XdrCodec<EventTopicFilter> = {
  encode(w, val) {
    VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).encode(w, val.topic0);
    VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).encode(w, val.topic1);
    VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).encode(w, val.topic2);
  },
  decode(r) {
    const topic0 = VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).decode(r);
    const topic1 = VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).decode(r);
    const topic2 = VarArrayCodec(proto.codec.Topic, Number(0xFFFFFFFF)).decode(r);
    return { topic0, topic1, topic2 };
  },
};

const _EventFilter: XdrCodec<EventFilter> = {
  encode(w, val) {
    proto.codec.ContractAddressList.encode(w, val.contract_addresses);
    proto.codec.EventTopicFilter.encode(w, val.topics);
  },
  decode(r) {
    const contract_addresses = proto.codec.ContractAddressList.decode(r);
    const topics = proto.codec.EventTopicFilter.decode(r);
    return { contract_addresses, topics };
  },
};

const _EventFilterList = VarArrayCodec(() => proto.codec.EventFilter, Number(proto.kMaxEventFiltersPerQuery)) as XdrCodec<EventFilterList>;

const _EventQuery: XdrCodec<EventQuery> = {
  encode(w, val) {
    proto.codec.EventFilterList.encode(w, val.filters);
    proto.codec.IterationOrder.encode(w, val.order);
    proto.codec.BlockAnchor.encode(w, val.anchor);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    w.writeUint32(val.limit);
  },
  decode(r) {
    const filters = proto.codec.EventFilterList.decode(r);
    const order = proto.codec.IterationOrder.decode(r);
    const anchor = proto.codec.BlockAnchor.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const limit = r.readUint32();
    return { filters, order, anchor, cursor, limit };
  },
};

const _EventPage: XdrCodec<EventPage> = {
  encode(w, val) {
    proto.codec.IdentifiedEventBatch.encode(w, val.events);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    proto.codec.BlockHeight.encode(w, val.latest_block);
    proto.codec.BlockHeight.encode(w, val.oldest_block);
  },
  decode(r) {
    const events = proto.codec.IdentifiedEventBatch.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const latest_block = proto.codec.BlockHeight.decode(r);
    const oldest_block = proto.codec.BlockHeight.decode(r);
    return { events, cursor, latest_block, oldest_block };
  },
};

const _TransactionQuery: XdrCodec<TransactionQuery> = {
  encode(w, val) {
    proto.codec.IterationOrder.encode(w, val.order);
    proto.codec.BlockAnchor.encode(w, val.anchor);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    w.writeUint32(val.limit);
  },
  decode(r) {
    const order = proto.codec.IterationOrder.decode(r);
    const anchor = proto.codec.BlockAnchor.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const limit = r.readUint32();
    return { order, anchor, cursor, limit };
  },
};

const _TransactionPage: XdrCodec<TransactionPage> = {
  encode(w, val) {
    proto.codec.TxInfoBatch.encode(w, val.transactions);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    proto.codec.BlockHeight.encode(w, val.latest_block);
    proto.codec.BlockHeight.encode(w, val.oldest_block);
  },
  decode(r) {
    const transactions = proto.codec.TxInfoBatch.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const latest_block = proto.codec.BlockHeight.decode(r);
    const oldest_block = proto.codec.BlockHeight.decode(r);
    return { transactions, cursor, latest_block, oldest_block };
  },
};

const _TransactionRef: XdrCodec<TransactionRef> = {
  encode(w, val) {
    proto.codec.TransactionHash.encode(w, val.tx_hash);
    proto.codec.BlockHeight.encode(w, val.height);
  },
  decode(r) {
    const tx_hash = proto.codec.TransactionHash.decode(r);
    const height = proto.codec.BlockHeight.decode(r);
    return { tx_hash, height };
  },
};

const _TransactionRefBatch = VarArrayCodec(() => proto.codec.TransactionRef, Number(0xFFFFFFFF)) as XdrCodec<TransactionRefBatch>;

const _AddressTransactionQuery: XdrCodec<AddressTransactionQuery> = {
  encode(w, val) {
    proto.codec.ContractAddress.encode(w, val.address);
    proto.codec.IterationOrder.encode(w, val.order);
    proto.codec.BlockAnchor.encode(w, val.anchor);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    w.writeUint32(val.limit);
  },
  decode(r) {
    const address = proto.codec.ContractAddress.decode(r);
    const order = proto.codec.IterationOrder.decode(r);
    const anchor = proto.codec.BlockAnchor.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const limit = r.readUint32();
    return { address, order, anchor, cursor, limit };
  },
};

const _BlockTransactionQuery: XdrCodec<BlockTransactionQuery> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.height);
    proto.codec.IterationOrder.encode(w, val.order);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    w.writeUint32(val.limit);
  },
  decode(r) {
    const height = proto.codec.BlockHeight.decode(r);
    const order = proto.codec.IterationOrder.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const limit = r.readUint32();
    return { height, order, cursor, limit };
  },
};

const _TransactionRefPage: XdrCodec<TransactionRefPage> = {
  encode(w, val) {
    proto.codec.TransactionRefBatch.encode(w, val.refs);
    proto.codec.PaginationCursor.encode(w, val.cursor);
    proto.codec.BlockHeight.encode(w, val.latest_block);
    proto.codec.BlockHeight.encode(w, val.oldest_block);
  },
  decode(r) {
    const refs = proto.codec.TransactionRefBatch.decode(r);
    const cursor = proto.codec.PaginationCursor.decode(r);
    const latest_block = proto.codec.BlockHeight.decode(r);
    const oldest_block = proto.codec.BlockHeight.decode(r);
    return { refs, cursor, latest_block, oldest_block };
  },
};

const _IndexerQueryOutcome: XdrCodec<IndexerQueryOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerQueryOutcome; },
};

const _EventPageResult: XdrCodec<EventPageResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.IndexerQueryOutcome.IndexerQueryOk:
      {
        const v = val as { outcome: number; page: proto.EventPage };
        if (v.page === undefined) {
          throw new Error("EventPageResult encode: page is undefined");
        }
        proto.codec.EventPage.encode(w, v.page);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.IndexerQueryOutcome.IndexerQueryOk:
        const page = proto.codec.EventPage.decode(r);
        return { outcome, page };
      default:
        return { outcome };
    }
  },
};

const _TransactionPageResult: XdrCodec<TransactionPageResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.IndexerQueryOutcome.IndexerQueryOk:
      {
        const v = val as { outcome: number; page: proto.TransactionPage };
        if (v.page === undefined) {
          throw new Error("TransactionPageResult encode: page is undefined");
        }
        proto.codec.TransactionPage.encode(w, v.page);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.IndexerQueryOutcome.IndexerQueryOk:
        const page = proto.codec.TransactionPage.decode(r);
        return { outcome, page };
      default:
        return { outcome };
    }
  },
};

const _TransactionRefPageResult: XdrCodec<TransactionRefPageResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.IndexerQueryOutcome.IndexerQueryOk:
      {
        const v = val as { outcome: number; page: proto.TransactionRefPage };
        if (v.page === undefined) {
          throw new Error("TransactionRefPageResult encode: page is undefined");
        }
        proto.codec.TransactionRefPage.encode(w, v.page);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.IndexerQueryOutcome.IndexerQueryOk:
        const page = proto.codec.TransactionRefPage.decode(r);
        return { outcome, page };
      default:
        return { outcome };
    }
  },
};

const _IndexerBlockExplorerIntroOutcome: XdrCodec<IndexerBlockExplorerIntroOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerBlockExplorerIntroOutcome; },
};

const _TxEventLogBatch = VarArrayCodec(() => proto.codec.TxEventLog, Number(0xFFFFFFFF)) as XdrCodec<TxEventLogBatch>;

const _IndexerOutboxOrigin: XdrCodec<IndexerOutboxOrigin> = {
  encode(w, val) {
    proto.codec.ProtocolCommit.encode(w, val.protocol);
    w.writeUint64(val.epoch_sequence);
    proto.codec.BlockHeight.encode(w, val.first_height);
    proto.codec.ConsensusValueHash.encode(w, val.first_prev_hash);
  },
  decode(r) {
    const protocol = proto.codec.ProtocolCommit.decode(r);
    const epoch_sequence = r.readUint64();
    const first_height = proto.codec.BlockHeight.decode(r);
    const first_prev_hash = proto.codec.ConsensusValueHash.decode(r);
    return { protocol, epoch_sequence, first_height, first_prev_hash };
  },
};

const _IndexerCommittedBlockPayload: XdrCodec<IndexerCommittedBlockPayload> = {
  encode(w, val) {
    w.writeUint32(val.format_version);
    proto.codec.ConsensusValue.encode(w, val.consensus_value);
    proto.codec.TxEventLogBatch.encode(w, val.event_logs);
    proto.codec.ProposedTransactionBatch.encode(w, val.tx_bodies);
  },
  decode(r) {
    const format_version = r.readUint32();
    const consensus_value = proto.codec.ConsensusValue.decode(r);
    const event_logs = proto.codec.TxEventLogBatch.decode(r);
    const tx_bodies = proto.codec.ProposedTransactionBatch.decode(r);
    return { format_version, consensus_value, event_logs, tx_bodies };
  },
};

const _IndexerCommittedBlockIdentity: XdrCodec<IndexerCommittedBlockIdentity> = {
  encode(w, val) {
    proto.codec.ConsensusValueHash.encode(w, val.consensus_hash);
  },
  decode(r) {
    const consensus_hash = proto.codec.ConsensusValueHash.decode(r);
    return { consensus_hash };
  },
};

const _IndexerCommittedBlock: XdrCodec<IndexerCommittedBlock> = {
  encode(w, val) {
    proto.codec.IndexerCommittedBlockPayload.encode(w, val.payload);
    proto.codec.IndexerCommittedBlockIdentity.encode(w, val.identity);
  },
  decode(r) {
    const payload = proto.codec.IndexerCommittedBlockPayload.decode(r);
    const identity = proto.codec.IndexerCommittedBlockIdentity.decode(r);
    return { payload, identity };
  },
};

const _IndexerInitializedProgress: XdrCodec<IndexerInitializedProgress> = {
  encode(w, val) {
    proto.codec.IndexerOutboxOrigin.encode(w, val.origin);
    proto.codec.BlockHeight.encode(w, val.contiguous_height);
    proto.codec.ConsensusValueHash.encode(w, val.last_consensus_hash);
  },
  decode(r) {
    const origin = proto.codec.IndexerOutboxOrigin.decode(r);
    const contiguous_height = proto.codec.BlockHeight.decode(r);
    const last_consensus_hash = proto.codec.ConsensusValueHash.decode(r);
    return { origin, contiguous_height, last_consensus_hash };
  },
};

const _IndexerProgressState: XdrCodec<IndexerProgressState> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerProgressState; },
};

const _IndexerProgress: XdrCodec<IndexerProgress> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.state));
    switch (val.state) {
      case proto.IndexerProgressState.IndexerProgressInitialized:
      case proto.IndexerProgressState.IndexerProgressCaughtUp:
      {
        const v = val as { state: number; initialized: proto.IndexerInitializedProgress };
        if (v.initialized === undefined) {
          throw new Error("IndexerProgress encode: initialized is undefined");
        }
        proto.codec.IndexerInitializedProgress.encode(w, v.initialized);
        break;
      }
    }
  },
  decode(r) {
    const state = Number(r.readInt32());
    switch (state) {
      case proto.IndexerProgressState.IndexerProgressInitialized:
      case proto.IndexerProgressState.IndexerProgressCaughtUp:
        const initialized = proto.codec.IndexerInitializedProgress.decode(r);
        return { state, initialized } as IndexerProgress;
      default:
        return { state };
    }
  },
};

const _IndexerFailureMessage: XdrCodec<IndexerFailureMessage> = {
  encode(w, val) { w.writeString(val, Number(1024)); },
  decode(r) { return indexerFailureMessage(r.readString(Number(1024))); },
};

const _IndexerEpochOutcome: XdrCodec<IndexerEpochOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerEpochOutcome; },
};

const _IndexerEpochResult: XdrCodec<IndexerEpochResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.IndexerEpochOutcome.IndexerEpochInitialized:
      case proto.IndexerEpochOutcome.IndexerEpochUnchanged:
      {
        const v = val as { outcome: number; progress: proto.IndexerInitializedProgress };
        if (v.progress === undefined) {
          throw new Error("IndexerEpochResult encode: progress is undefined");
        }
        proto.codec.IndexerInitializedProgress.encode(w, v.progress);
        break;
      }
      default: {
        const v = val as { outcome: number; diagnostic: proto.IndexerFailureMessage };
        if (v.diagnostic === undefined) {
          throw new Error("IndexerEpochResult encode: default arm but diagnostic is undefined");
        }
        proto.codec.IndexerFailureMessage.encode(w, v.diagnostic);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.IndexerEpochOutcome.IndexerEpochInitialized:
      case proto.IndexerEpochOutcome.IndexerEpochUnchanged:
        const progress = proto.codec.IndexerInitializedProgress.decode(r);
        return { outcome, progress } as IndexerEpochResult;
      default:
        const diagnostic = proto.codec.IndexerFailureMessage.decode(r);
        return { outcome, diagnostic };
    }
  },
};

const _IndexerHeightGap: XdrCodec<IndexerHeightGap> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.expected_height);
  },
  decode(r) {
    const expected_height = proto.codec.BlockHeight.decode(r);
    return { expected_height };
  },
};

const _IndexerBlockApplyOutcome: XdrCodec<IndexerBlockApplyOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerBlockApplyOutcome; },
};

const _IndexerBlockApplyResult: XdrCodec<IndexerBlockApplyResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.IndexerBlockApplyOutcome.IndexerBlockApplied:
      case proto.IndexerBlockApplyOutcome.IndexerBlockDuplicate:
      {
        const v = val as { outcome: number; progress: proto.IndexerInitializedProgress };
        if (v.progress === undefined) {
          throw new Error("IndexerBlockApplyResult encode: progress is undefined");
        }
        proto.codec.IndexerInitializedProgress.encode(w, v.progress);
        break;
      }
      case proto.IndexerBlockApplyOutcome.IndexerBlockGap:
      {
        const v = val as { outcome: number; gap: proto.IndexerHeightGap };
        if (v.gap === undefined) {
          throw new Error("IndexerBlockApplyResult encode: gap is undefined");
        }
        proto.codec.IndexerHeightGap.encode(w, v.gap);
        break;
      }
      default: {
        const v = val as { outcome: number; diagnostic: proto.IndexerFailureMessage };
        if (v.diagnostic === undefined) {
          throw new Error("IndexerBlockApplyResult encode: default arm but diagnostic is undefined");
        }
        proto.codec.IndexerFailureMessage.encode(w, v.diagnostic);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.IndexerBlockApplyOutcome.IndexerBlockApplied:
      case proto.IndexerBlockApplyOutcome.IndexerBlockDuplicate:
        const progress = proto.codec.IndexerInitializedProgress.decode(r);
        return { outcome, progress } as IndexerBlockApplyResult;
      case proto.IndexerBlockApplyOutcome.IndexerBlockGap:
        const gap = proto.codec.IndexerHeightGap.decode(r);
        return { outcome, gap };
      default:
        const diagnostic = proto.codec.IndexerFailureMessage.decode(r);
        return { outcome, diagnostic };
    }
  },
};

const _EventIndexerPullRequest: XdrCodec<EventIndexerPullRequest> = {
  encode(w, val) {
    proto.codec.ProtocolCommit.encode(w, val.protocol);
    proto.codec.IndexerProgress.encode(w, val.progress);
  },
  decode(r) {
    const protocol = proto.codec.ProtocolCommit.decode(r);
    const progress = proto.codec.IndexerProgress.decode(r);
    return { protocol, progress };
  },
};

const _EventIndexerPulledBlock: XdrCodec<EventIndexerPulledBlock> = {
  encode(w, val) {
    proto.codec.IndexerOutboxOrigin.encode(w, val.origin);
    proto.codec.IndexerCommittedBlock.encode(w, val.block);
  },
  decode(r) {
    const origin = proto.codec.IndexerOutboxOrigin.decode(r);
    const block = proto.codec.IndexerCommittedBlock.decode(r);
    return { origin, block };
  },
};

const _EventIndexerPullOutcome: XdrCodec<EventIndexerPullOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as EventIndexerPullOutcome; },
};

const _EventIndexerPullResult: XdrCodec<EventIndexerPullResult> = {
  encode(w, val) {
    w.writeInt32(BigInt(val.outcome));
    switch (val.outcome) {
      case proto.EventIndexerPullOutcome.EventIndexerPullBlock:
      {
        const v = val as { outcome: number; pulled_block: proto.EventIndexerPulledBlock };
        if (v.pulled_block === undefined) {
          throw new Error("EventIndexerPullResult encode: pulled_block is undefined");
        }
        proto.codec.EventIndexerPulledBlock.encode(w, v.pulled_block);
        break;
      }
      case proto.EventIndexerPullOutcome.EventIndexerPullCaughtUp:
      {
        const v = val as { outcome: number; origin: proto.IndexerOutboxOrigin };
        if (v.origin === undefined) {
          throw new Error("EventIndexerPullResult encode: origin is undefined");
        }
        proto.codec.IndexerOutboxOrigin.encode(w, v.origin);
        break;
      }
      default: {
        const v = val as { outcome: number; diagnostic: proto.IndexerFailureMessage };
        if (v.diagnostic === undefined) {
          throw new Error("EventIndexerPullResult encode: default arm but diagnostic is undefined");
        }
        proto.codec.IndexerFailureMessage.encode(w, v.diagnostic);
        break;
      }
    }
  },
  decode(r) {
    const outcome = Number(r.readInt32());
    switch (outcome) {
      case proto.EventIndexerPullOutcome.EventIndexerPullBlock:
        const pulled_block = proto.codec.EventIndexerPulledBlock.decode(r);
        return { outcome, pulled_block };
      case proto.EventIndexerPullOutcome.EventIndexerPullCaughtUp:
        const origin = proto.codec.IndexerOutboxOrigin.decode(r);
        return { outcome, origin };
      default:
        const diagnostic = proto.codec.IndexerFailureMessage.decode(r);
        return { outcome, diagnostic };
    }
  },
};

const _IndexerTxFailureNotice: XdrCodec<IndexerTxFailureNotice> = {
  encode(w, val) {
    proto.codec.TransactionHash.encode(w, val.tx_hash);
    proto.codec.TxFailureDiagnostic.encode(w, val.diagnostic);
  },
  decode(r) {
    const tx_hash = proto.codec.TransactionHash.decode(r);
    const diagnostic = proto.codec.TxFailureDiagnostic.decode(r);
    return { tx_hash, diagnostic };
  },
};

const _IndexerTxFailureNoticeBatch = VarArrayCodec(() => proto.codec.IndexerTxFailureNotice, Number(256)) as XdrCodec<IndexerTxFailureNoticeBatch>;

export const codec = {
  TxInfo: _TxInfo,
  TxInfoOutcome: _TxInfoOutcome,
  TxInfoResult: _TxInfoResult,
  BlockLookupOutcome: _BlockLookupOutcome,
  BlockLookupResult: _BlockLookupResult,
  IdentifiedEventBatch: _IdentifiedEventBatch,
  TxInfoBatch: _TxInfoBatch,
  ContractAddressList: _ContractAddressList,
  EventTopicFilter: _EventTopicFilter,
  EventFilter: _EventFilter,
  EventFilterList: _EventFilterList,
  EventQuery: _EventQuery,
  EventPage: _EventPage,
  TransactionQuery: _TransactionQuery,
  TransactionPage: _TransactionPage,
  TransactionRef: _TransactionRef,
  TransactionRefBatch: _TransactionRefBatch,
  AddressTransactionQuery: _AddressTransactionQuery,
  BlockTransactionQuery: _BlockTransactionQuery,
  TransactionRefPage: _TransactionRefPage,
  IndexerQueryOutcome: _IndexerQueryOutcome,
  EventPageResult: _EventPageResult,
  TransactionPageResult: _TransactionPageResult,
  TransactionRefPageResult: _TransactionRefPageResult,
  IndexerBlockExplorerIntroOutcome: _IndexerBlockExplorerIntroOutcome,
  TxEventLogBatch: _TxEventLogBatch,
  IndexerOutboxOrigin: _IndexerOutboxOrigin,
  IndexerCommittedBlockPayload: _IndexerCommittedBlockPayload,
  IndexerCommittedBlockIdentity: _IndexerCommittedBlockIdentity,
  IndexerCommittedBlock: _IndexerCommittedBlock,
  IndexerInitializedProgress: _IndexerInitializedProgress,
  IndexerProgressState: _IndexerProgressState,
  IndexerProgress: _IndexerProgress,
  IndexerFailureMessage: _IndexerFailureMessage,
  IndexerEpochOutcome: _IndexerEpochOutcome,
  IndexerEpochResult: _IndexerEpochResult,
  IndexerHeightGap: _IndexerHeightGap,
  IndexerBlockApplyOutcome: _IndexerBlockApplyOutcome,
  IndexerBlockApplyResult: _IndexerBlockApplyResult,
  EventIndexerPullRequest: _EventIndexerPullRequest,
  EventIndexerPulledBlock: _EventIndexerPulledBlock,
  EventIndexerPullOutcome: _EventIndexerPullOutcome,
  EventIndexerPullResult: _EventIndexerPullResult,
  IndexerTxFailureNotice: _IndexerTxFailureNotice,
  IndexerTxFailureNoticeBatch: _IndexerTxFailureNoticeBatch,
} as const;

export const IndexerBlockExplorerProgram: RpcProgramMeta = {
  programId: 0x4321aaaa,
  version: 1,
  methods: {
    indexer_block_explorer_intro: { proc: 0, request: () => proto.codec.ProtocolCommit as XdrCodec<proto.ProtocolCommit>, response: () => _IndexerBlockExplorerIntroOutcome },
    get_transaction_info: { proc: 1, request: () => proto.codec.TransactionHash as XdrCodec<proto.TransactionHash>, response: () => _TxInfoResult },
    get_block_by_height: { proc: 2, request: () => proto.codec.BlockHeight as XdrCodec<proto.BlockHeight>, response: () => _BlockLookupResult },
    get_events: { proc: 3, request: () => _EventQuery, response: () => _EventPageResult },
    get_transactions: { proc: 4, request: () => _TransactionQuery, response: () => _TransactionPageResult },
    get_transactions_by_address: { proc: 5, request: () => _AddressTransactionQuery, response: () => _TransactionRefPageResult },
    get_transactions_by_block: { proc: 6, request: () => _BlockTransactionQuery, response: () => _TransactionRefPageResult },
  },
};

export const EventIndexerProgram: RpcProgramMeta = {
  programId: 0x4321aaac,
  version: 1,
  methods: {
    event_indexer_pull_next: { proc: 10, request: () => _EventIndexerPullRequest, response: () => _EventIndexerPullResult },
    event_indexer_pull_tx_failures: { proc: 11, request: () => VoidCodec, response: () => _IndexerTxFailureNoticeBatch },
  },
};

