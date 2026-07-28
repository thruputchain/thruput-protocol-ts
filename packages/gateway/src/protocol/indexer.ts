// -*- TypeScript -*-
// Generated Code: DO NOT CHECK IN

// Generated from x23c commit: e3dda0763ff3fb21779d16b6fa2e130c633911a0

import { type XdrCodec, VoidCodec, OptionCodec, VarArrayCodec, FixedArrayCodec, type RpcProgramMeta } from "@groundhogchain/xdr";
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

export type IdentifiedEventBatch = proto.IdentifiedEvent[] & { readonly __brand: "IdentifiedEventBatch" };
export function identifiedEventBatch(val: proto.IdentifiedEvent[]): IdentifiedEventBatch {
  return val as IdentifiedEventBatch;
}

export type TxInfoBatch = proto.TxInfo[] & { readonly __brand: "TxInfoBatch" };
export function txInfoBatch(val: proto.TxInfo[]): TxInfoBatch {
  return val as TxInfoBatch;
}

export const kMaxContractAddressesPerEventFilter = 5n;

export const kMaxEventFiltersPerQuery = 5n;

export type ContractAddressList = proto.ContractAddress[] & { readonly __brand: "ContractAddressList" };
export function contractAddressList(val: proto.ContractAddress[]): ContractAddressList {
  return val as ContractAddressList;
}

export interface EventTopicFilter {
  topic0: proto.Topic[];
  topic1: proto.Topic[];
  topic2: proto.Topic[];
}

export interface EventFilter {
  contract_addresses: proto.ContractAddressList;
  topics: proto.EventTopicFilter;
}

export type EventFilterList = proto.EventFilter[] & { readonly __brand: "EventFilterList" };
export function eventFilterList(val: proto.EventFilter[]): EventFilterList {
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
  tx_hash: proto.SignedTransactionHash;
  height: proto.BlockHeight;
}

export type TransactionRefBatch = proto.TransactionRef[] & { readonly __brand: "TransactionRefBatch" };
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

export enum IndexerBlockExplorerIntroOutcome {
  IntroSuccess = 0,
  IntroMismatchedProtocol = 1,
}


export type TxEventLogBatch = proto.TxEventLog[] & { readonly __brand: "TxEventLogBatch" };
export function txEventLogBatch(val: proto.TxEventLog[]): TxEventLogBatch {
  return val as TxEventLogBatch;
}


export interface indexer_event_process_events_args {
  arg0: proto.BlockHeight;
  arg1: proto.TxEventLogBatch;
  arg2: proto.ProposedTransactionBatch;
}

export interface indexer_event_report_tx_failure_args {
  arg0: proto.SignedTransactionHash;
  arg1: proto.TxFailureDiagnostic;
}

export interface IndexerCard {
  protocol: proto.ProtocolCommit;
  address_for_event: proto.ServerAddress;
}

export enum EventIndexerIntroOutcome {
  EventIntroSuccess = 0,
  EventIntroMismatchedProtocol = 1,
  EventIntroConnectFailed = 2,
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
    proto.codec.SignedTransactionHash.encode(w, val.tx_hash);
    proto.codec.BlockHeight.encode(w, val.height);
  },
  decode(r) {
    const tx_hash = proto.codec.SignedTransactionHash.decode(r);
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

const _IndexerBlockExplorerIntroOutcome: XdrCodec<IndexerBlockExplorerIntroOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as IndexerBlockExplorerIntroOutcome; },
};

const _TxEventLogBatch = VarArrayCodec(() => proto.codec.TxEventLog, Number(0xFFFFFFFF)) as XdrCodec<TxEventLogBatch>;

const _indexer_event_process_events_args: XdrCodec<indexer_event_process_events_args> = {
  encode(w, val) {
    proto.codec.BlockHeight.encode(w, val.arg0);
    proto.codec.TxEventLogBatch.encode(w, val.arg1);
    proto.codec.ProposedTransactionBatch.encode(w, val.arg2);
  },
  decode(r) {
    const arg0 = proto.codec.BlockHeight.decode(r);
    const arg1 = proto.codec.TxEventLogBatch.decode(r);
    const arg2 = proto.codec.ProposedTransactionBatch.decode(r);
    return { arg0, arg1, arg2 };
  },
};

const _indexer_event_report_tx_failure_args: XdrCodec<indexer_event_report_tx_failure_args> = {
  encode(w, val) {
    proto.codec.SignedTransactionHash.encode(w, val.arg0);
    proto.codec.TxFailureDiagnostic.encode(w, val.arg1);
  },
  decode(r) {
    const arg0 = proto.codec.SignedTransactionHash.decode(r);
    const arg1 = proto.codec.TxFailureDiagnostic.decode(r);
    return { arg0, arg1 };
  },
};

const _IndexerCard: XdrCodec<IndexerCard> = {
  encode(w, val) {
    proto.codec.ProtocolCommit.encode(w, val.protocol);
    proto.codec.ServerAddress.encode(w, val.address_for_event);
  },
  decode(r) {
    const protocol = proto.codec.ProtocolCommit.decode(r);
    const address_for_event = proto.codec.ServerAddress.decode(r);
    return { protocol, address_for_event };
  },
};

const _EventIndexerIntroOutcome: XdrCodec<EventIndexerIntroOutcome> = {
  encode(w, val) { w.writeInt32(BigInt(val)); },
  decode(r) { return Number(r.readInt32()) as EventIndexerIntroOutcome; },
};

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
  IndexerBlockExplorerIntroOutcome: _IndexerBlockExplorerIntroOutcome,
  TxEventLogBatch: _TxEventLogBatch,
  IndexerCard: _IndexerCard,
  EventIndexerIntroOutcome: _EventIndexerIntroOutcome,
} as const;

export const IndexerBlockExplorerProgram: RpcProgramMeta = {
  programId: 0x4321aaaa,
  version: 1,
  methods: {
    indexer_block_explorer_intro: { proc: 0, request: () => proto.codec.ProtocolCommit as XdrCodec<proto.ProtocolCommit>, response: () => _IndexerBlockExplorerIntroOutcome },
    get_transaction_info: { proc: 1, request: () => proto.codec.SignedTransactionHash as XdrCodec<proto.SignedTransactionHash>, response: () => _TxInfoResult },
    get_block_by_height: { proc: 2, request: () => proto.codec.BlockHeight as XdrCodec<proto.BlockHeight>, response: () => _BlockLookupResult },
    get_events: { proc: 3, request: () => _EventQuery, response: () => _EventPage },
    get_transactions: { proc: 4, request: () => _TransactionQuery, response: () => _TransactionPage },
    get_transactions_by_address: { proc: 5, request: () => _AddressTransactionQuery, response: () => _TransactionRefPage },
    get_transactions_by_block: { proc: 6, request: () => _BlockTransactionQuery, response: () => _TransactionRefPage },
  },
};

export const IndexerEventProgram: RpcProgramMeta = {
  programId: 0x4321aaab,
  version: 1,
  methods: {
    indexer_event_process_events: { proc: 0, request: () => _indexer_event_process_events_args, response: () => VoidCodec },
    indexer_event_report_tx_failure: { proc: 1, request: () => _indexer_event_report_tx_failure_args, response: () => VoidCodec },
  },
};

export const EventIndexerProgram: RpcProgramMeta = {
  programId: 0x4321aaac,
  version: 1,
  methods: {
    event_indexer_intro: { proc: 0, request: () => _IndexerCard, response: () => _EventIndexerIntroOutcome },
  },
};

